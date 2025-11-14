# spoon_ai/monitoring/core/tasks.py
import logging
import uuid
from typing import Dict, Any, List, Optional
from datetime import datetime, timedelta

from .scheduler import MonitoringScheduler
from .alerts import AlertManager, Metric, Comparator

logger = logging.getLogger(__name__)

class TaskStatus:
    """Task status enumeration"""
    ACTIVE = "active"
    EXPIRED = "expired"
    PAUSED = "paused"

class MonitoringTaskManager:
    """Monitoring task manager, handles task creation, deletion and execution"""
    
    def __init__(self):
        self.scheduler = MonitoringScheduler()
        self.alert_manager = AlertManager()
        self.tasks = {}  # Store task status and metadata
        self.scheduler.start()
        
    def create_task(self, config: Dict[str, Any]) -> Dict[str, Any]:
        """Create a new monitoring task"""
        # Generate task ID
        task_id = config.get("task_id", f"task_{uuid.uuid4().hex[:8]}")
        
        # Validate configuration
        self._validate_config(config)
        
        # Create timestamps once to ensure consistency
        creation_time = datetime.now()
        expires_in_hours = config.get("expires_in_hours", 24)
        expiry_time = creation_time + timedelta(hours=expires_in_hours)
        
        # Store task metadata
        self.tasks[task_id] = {
            "status": TaskStatus.ACTIVE,
            "created_at": creation_time,
            "expires_at": expiry_time,
            "config": config,
            "last_checked": None,
            "alert_count": 0
        }
        
        # Add to scheduler
        interval_minutes = config.get("check_interval_minutes", 5)
        self.scheduler.add_job(
            task_id, 
            self._task_wrapper,
            interval_minutes,
            task_id=task_id,
            alert_config=config
        )
        # Add expiry check task
        expiry_task_id = f"{task_id}_expiry"
        self.scheduler.add_job(
            expiry_task_id,
            self._check_task_expiry,
            10,  # Check expiry status every 10 minutes
            task_id=task_id
        )
        self._task_wrapper(task_id, config)
        return {
            "task_id": task_id,
            "created_at": creation_time.isoformat(),
            "expires_at": expiry_time.isoformat(),
            "config": config,
            "status": TaskStatus.ACTIVE
        }
    
    def _task_wrapper(self, task_id: str, alert_config: Dict[str, Any]) -> None:
        """Task execution wrapper, used to update task status and handle expired tasks"""
        task_info = self.tasks.get(task_id)
        if not task_info:
            logger.warning(f"Task does not exist: {task_id}")
            return
            
        # Check if task is expired or paused
        if task_info["status"] != TaskStatus.ACTIVE:
            logger.info(f"Task {task_id} status is {task_info['status']}, skipping execution")
            return
            
        # Execute task
        try:
            is_triggered = self.alert_manager.check_alert(alert_config)
            task_info["last_checked"] = datetime.now()
            
            if is_triggered:
                task_info["alert_count"] += 1
        except Exception as e:
            logger.error(f"Error executing task {task_id}: {str(e)}")
    
    def _check_task_expiry(self, task_id: str) -> None:
        """Check if a task has expired"""
        task_info = self.tasks.get(task_id)
        if not task_info:
            return
            
        if task_info["status"] == TaskStatus.ACTIVE and datetime.now() > task_info["expires_at"]:
            # Task expired
            task_info["status"] = TaskStatus.EXPIRED
            logger.info(f"Task {task_id} has expired")
            
            # Send expiry notification
            self._send_expiry_notification(task_id, task_info)
    
    def _send_expiry_notification(self, task_id: str, task_info: Dict[str, Any]) -> None:
        """Send task expiry notification"""
        config = task_info["config"]
        channels = config.get("notification_channels", ["telegram"])
        notification_params = config.get("notification_params", {})
        
        message = (
            f"🕒 **Monitoring Task Expired** 🕒\n\n"
            f"Task ID: {task_id}\n"
            f"Name: {config.get('name', 'Unnamed Task')}\n"
            f"Created: {task_info['created_at'].strftime('%Y-%m-%d %H:%M:%S')}\n"
            f"Expired: {task_info['expires_at'].strftime('%Y-%m-%d %H:%M:%S')}\n"
            f"Alert Count: {task_info['alert_count']}\n\n"
            f"This monitoring task has been automatically stopped. To continue monitoring, please recreate or extend the task."
        )
        
        # Send notifications
        for channel in channels:
            self.alert_manager.notification.send(channel, message, **notification_params)
    
    def extend_task(self, task_id: str, hours: int = 24) -> Dict[str, Any]:
        """Extend task expiration time"""
        if task_id not in self.tasks:
            raise ValueError(f"Task does not exist: {task_id}")
            
        task_info = self.tasks[task_id]
        
        # Calculate new expiry time
        new_expiry = datetime.now() + timedelta(hours=hours)
        task_info["expires_at"] = new_expiry
        
        # If task is expired, reactivate it
        if task_info["status"] == TaskStatus.EXPIRED:
            task_info["status"] = TaskStatus.ACTIVE
            
            # Re-add to scheduler
            config = task_info["config"]
            interval_minutes = config.get("check_interval_minutes", 5)
            self.scheduler.add_job(
                task_id, 
                self._task_wrapper,
                interval_minutes,
                task_id=task_id,
                alert_config=config
            )
        
        return {
            "task_id": task_id,
            "status": task_info["status"],
            "expires_at": new_expiry.isoformat()
        }
    
    def pause_task(self, task_id: str) -> bool:
        """Pause task"""
        if task_id not in self.tasks:
            return False
            
        self.tasks[task_id]["status"] = TaskStatus.PAUSED
        return True
    
    def resume_task(self, task_id: str) -> bool:
        """Resume task"""
        if task_id not in self.tasks:
            return False
            
        task_info = self.tasks[task_id]
        
        # Check if expired
        if datetime.now() > task_info["expires_at"]:
            return False
            
        task_info["status"] = TaskStatus.ACTIVE
        return True
    
    def delete_task(self, task_id: str) -> bool:
        """Delete monitoring task"""
        if task_id in self.tasks:
            # Delete task metadata
            del self.tasks[task_id]
            
            # Remove scheduled job
            self.scheduler.remove_job(task_id)
            
            # Remove expiry check task
            expiry_task_id = f"{task_id}_expiry"
            self.scheduler.remove_job(expiry_task_id)
            
            return True
        return False
    
    def get_tasks(self) -> Dict[str, Any]:
        """Get all tasks, including status information"""
        result = {}
        for task_id, task_info in self.tasks.items():
            result[task_id] = {
                "status": task_info["status"],
                "created_at": task_info["created_at"].isoformat(),
                "expires_at": task_info["expires_at"].isoformat(),
                "config": task_info["config"],
                "last_checked": task_info["last_checked"].isoformat() if task_info["last_checked"] else None,
                "alert_count": task_info["alert_count"]
            }
        return result
    
    def get_task(self, task_id: str) -> Optional[Dict[str, Any]]:
        """Get specific task information"""
        if task_id not in self.tasks:
            return None
            
        task_info = self.tasks[task_id]
        return {
            "status": task_info["status"],
            "created_at": task_info["created_at"].isoformat(),
            "expires_at": task_info["expires_at"].isoformat(),
            "config": task_info["config"],
            "last_checked": task_info["last_checked"].isoformat() if task_info["last_checked"] else None,
            "alert_count": task_info["alert_count"]
        }
    
    def test_notification(self, task_id: str) -> bool:
        """Test task notification"""
        if task_id not in self.tasks:
            return False
            
        alert_config = self.tasks[task_id]["config"]
        return self.alert_manager.test_notification(alert_config)
    
    def _validate_config(self, config: Dict[str, Any]) -> None:
        """Validate task configuration"""
        required_fields = ["provider", "symbol", "metric", "threshold", "comparator"]
        for field in required_fields:
            if field not in config:
                raise ValueError(f"Missing required field: {field}")
        
        # Validate market type
        market = config.get("market", "cex").lower()
        if market not in ["cex", "dex"]:  # Add more supported market types
            raise ValueError(f"Invalid market type: {market}. Supported types: cex, dex")
        
        # Validate provider
        provider = config["provider"].lower()
        try:
            from ..clients.base import DataClient
            # This will check if the provider is valid
            DataClient.get_client(market, provider)
        except ValueError as e:
            raise ValueError(f"Invalid provider: {str(e)}")
        
        # Validate metric type
        if "metric" in config and not any(config["metric"] == m.value for m in Metric):
            valid_metrics = [m.value for m in Metric]
            raise ValueError(f"Invalid metric: {config['metric']}. Valid options are: {valid_metrics}")
        
        # Validate comparator
        if "comparator" in config and not any(config["comparator"] == c.value for c in Comparator):
            valid_comparators = [c.value for c in Comparator]
            raise ValueError(f"Invalid comparator: {config['comparator']}. Valid options are: {valid_comparators}")
        
        # Validate expiration time
        if "expires_in_hours" in config:
            try:
                expires_in_hours = int(config["expires_in_hours"])
                if expires_in_hours <= 0:
                    raise ValueError("Expiration time must be positive")
            except (TypeError, ValueError):
                raise ValueError("Invalid expiration time: must be a positive integer")
