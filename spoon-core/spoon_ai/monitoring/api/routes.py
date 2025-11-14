# spoon_ai/monitoring/api/routes.py
from fastapi import APIRouter, HTTPException, Depends, BackgroundTasks
from typing import Dict, Any, List, Optional
from pydantic import BaseModel, Field

from ..core.tasks import MonitoringTaskManager, TaskStatus

router = APIRouter(
    prefix="/monitoring",
    tags=["monitoring"],
    responses={404: {"description": "Not found"}},
)

task_manager = MonitoringTaskManager()

class MonitoringTaskCreate(BaseModel):
    """Request model for creating monitoring task"""
    market: str = Field("cex", description="Market type: cex, dex, etc.")
    provider: str = Field(..., description="Data provider: bn (Binance), uni (Uniswap), ray (Raydium), etc.")
    symbol: str = Field(..., description="Trading pair symbol, e.g., BTCUSDT, ETH-USDC, SOL-USDC")
    metric: str = Field(..., description="Monitoring metric: price, volume, price_change, price_change_percent, liquidity")
    threshold: float = Field(..., description="Alert threshold")
    comparator: str = Field(..., description="Comparison operator: >, <, =, >=, <=")
    name: Optional[str] = Field(None, description="Alert name")
    check_interval_minutes: int = Field(5, description="Check interval (minutes)")
    expires_in_hours: int = Field(24, description="Task expiration time (hours)")
    notification_channels: List[str] = Field(["telegram"], description="Notification channels")
    notification_params: Dict[str, Any] = Field({}, description="Additional parameters for notification channels")

class TaskExtendRequest(BaseModel):
    """Request model for extending task validity period"""
    hours: int = Field(..., description="Number of hours to extend")

class MonitoringTaskResponse(BaseModel):
    """Response model for monitoring task"""
    task_id: str
    created_at: str
    expires_at: str
    status: str
    config: Dict[str, Any]

class MonitoringChannelsResponse(BaseModel):
    """Response model for available notification channels"""
    available_channels: List[str]

@router.post("/tasks", response_model=MonitoringTaskResponse)
async def create_monitoring_task(task: MonitoringTaskCreate):
    """Create a new monitoring task"""
    try:
        result = task_manager.create_task(task.dict())
        return result
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create task: {str(e)}")

@router.get("/tasks", response_model=Dict[str, Any])
async def list_monitoring_tasks():
    """Get all monitoring tasks"""
    return task_manager.get_tasks()

@router.get("/tasks/{task_id}", response_model=Dict[str, Any])
async def get_monitoring_task(task_id: str):
    """Get a specific monitoring task"""
    task = task_manager.get_task(task_id)
    if not task:
        raise HTTPException(status_code=404, detail=f"Task {task_id} not found")
    return task

@router.delete("/tasks/{task_id}")
async def delete_monitoring_task(task_id: str):
    """Delete a monitoring task"""
    success = task_manager.delete_task(task_id)
    if not success:
        raise HTTPException(status_code=404, detail=f"Task {task_id} not found")
    return {"status": "success", "message": f"Task {task_id} deleted"}

@router.post("/tasks/{task_id}/pause")
async def pause_monitoring_task(task_id: str):
    """Pause a monitoring task"""
    success = task_manager.pause_task(task_id)
    if not success:
        raise HTTPException(status_code=404, detail=f"Task {task_id} not found")
    return {"status": "success", "message": f"Task {task_id} paused"}

@router.post("/tasks/{task_id}/resume")
async def resume_monitoring_task(task_id: str):
    """Resume a monitoring task"""
    success = task_manager.resume_task(task_id)
    if not success:
        raise HTTPException(status_code=404, detail=f"Task {task_id} not found or expired")
    return {"status": "success", "message": f"Task {task_id} resumed"}

@router.post("/tasks/{task_id}/extend", response_model=Dict[str, Any])
async def extend_monitoring_task(task_id: str, request: TaskExtendRequest):
    """Extend monitoring task validity period"""
    try:
        result = task_manager.extend_task(task_id, request.hours)
        return result
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to extend task: {str(e)}")

@router.get("/channels", response_model=MonitoringChannelsResponse)
async def get_notification_channels():
    """Get available notification channels"""
    from ..notifiers.notification import NotificationManager
    manager = NotificationManager()
    return {"available_channels": manager.get_available_channels()}

@router.post("/tasks/{task_id}/test")
async def test_notification(task_id: str):
    """Test notification for a specific task"""
    task = task_manager.get_task(task_id)
    if not task:
        raise HTTPException(status_code=404, detail=f"Task {task_id} not found")
    
    success = task_manager.test_notification(task_id)
    if not success:
        raise HTTPException(status_code=500, detail="Failed to send test notification")
    
    return {"status": "success", "message": "Test notification sent"}