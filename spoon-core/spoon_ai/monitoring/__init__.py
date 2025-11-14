"""
Cryptocurrency Monitoring Module
Provides cryptocurrency price and metrics monitoring, alerts and notification functionality
"""

from .core.tasks import MonitoringTaskManager

# Export main classes
__all__ = ['MonitoringTaskManager']