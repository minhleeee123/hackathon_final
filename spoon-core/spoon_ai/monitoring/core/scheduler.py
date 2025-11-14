import time
import threading
import schedule
import logging
from typing import Dict, Any, Callable

logger = logging.getLogger(__name__)

class MonitoringScheduler:
    """Monitoring task scheduler, implemented as a singleton"""
    
    _instance = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(MonitoringScheduler, cls).__new__(cls)
            cls._instance.jobs = {}
            cls._instance.running = False
            cls._instance.thread = None
        return cls._instance
    
    def start(self):
        """Start the scheduler to run in a background thread"""
        if self.running:
            return
            
        self.running = True
        self.thread = threading.Thread(target=self._run_scheduler)
        self.thread.daemon = True
        self.thread.start()
        logger.info("Monitoring scheduler started")
    
    def _run_scheduler(self):
        """Run the scheduler loop"""
        while self.running:
            schedule.run_pending()
            time.sleep(1)
    
    def stop(self):
        """Stop the scheduler"""
        self.running = False
        if self.thread:
            self.thread.join(timeout=5)
        logger.info("Monitoring scheduler stopped")
        
    def add_job(self, job_id: str, task_func: Callable, 
                interval_minutes: int, *args, **kwargs) -> str:
        """Add a scheduled monitoring task"""
        # Cancel existing task with the same name
        self.remove_job(job_id)
        
        # Add new task
        schedule.every(interval_minutes).minutes.do(task_func, *args, **kwargs).tag(job_id)
        self.jobs[job_id] = {
            "function": task_func.__name__,
            "interval": interval_minutes,
            "created_at": time.time(),
            "args": args,
            "kwargs": kwargs
        }
        
        logger.info(f"Added monitoring job: {job_id}, interval: {interval_minutes}min")
        return job_id
    
    def remove_job(self, job_id: str) -> bool:
        """Remove a scheduled task"""
        if job_id in self.jobs:
            schedule.clear(job_id)
            del self.jobs[job_id]
            logger.info(f"Removed monitoring job: {job_id}")
            return True
        return False
    
    def get_jobs(self) -> Dict[str, Any]:
        """Get all tasks"""
        return self.jobs
    
    def get_job(self, job_id: str) -> Dict[str, Any]:
        """Get information for a specific task"""
        return self.jobs.get(job_id)
        
    def run_job_once(self, job_id: str) -> bool:
        """Execute a task immediately once, for testing"""
        if job_id not in self.jobs:
            return False
            
        job_info = self.jobs[job_id]
        task_func = job_info.get("function")
        
        # Find function with that name
        for job in schedule.jobs:
            if hasattr(job, "job_func") and job.tags and job_id in job.tags:
                job.job_func()
                return True
                
        return False