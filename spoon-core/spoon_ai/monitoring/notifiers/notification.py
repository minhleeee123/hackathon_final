# spoon_ai/monitoring/notifiers/notification.py
import logging
from typing import Dict, Any, List, Optional
import asyncio

logger = logging.getLogger(__name__)

class NotificationManager:
    """Notification manager, manages multiple notification channels, calls notification classes in the social_media directory"""
    
    def __init__(self):
        self.channels = {}
        self._load_channels()
    
    def _load_channels(self):
        """Load all available notification channels"""
        # Load Telegram
        try:
            from spoon_ai.social_media.telegram import TelegramClient
            from spoon_ai.agents.toolcall import ToolCallAgent
            
            class NotificationAgent(ToolCallAgent):
                """Simplified Agent, only used for sending notifications"""
                def __init__(self):
                    pass
                
                async def run(self, text):
                    return "Notification only"
                
                def clear(self):
                    pass
                
                @property
                def memory(self):
                    class DummyMemory:
                        def get_messages(self):
                            return []
                    return DummyMemory()
                
                @property
                def state(self):
                    return None
                
                @state.setter
                def state(self, value):
                    pass
            
            self.channels["telegram"] = {
                "instance": TelegramClient(NotificationAgent())
            }
            logger.info("Registered Telegram notification channel")
        except Exception as e:
            import traceback
            logger.warning(f"Failed to register Telegram channel: {str(e)}")
            logger.warning(traceback.format_exc())
        
        # Load Twitter
        try:
            from spoon_ai.social_media.twitter import TwitterClient
            self.channels["twitter"] = {
                "instance": TwitterClient()
            }
            logger.info("Registered Twitter notification channel")
        except Exception as e:
            logger.warning(f"Failed to register Twitter channel: {str(e)}")
        
        # Load Email
        try:
            from spoon_ai.social_media.email import EmailNotifier
            self.channels["email"] = {
                "instance": EmailNotifier()
            }
            logger.info("Registered Email notification channel")
        except Exception as e:
            logger.warning(f"Failed to register Email channel: {str(e)}")
            
        # Load Discord
        try:
            from spoon_ai.social_media.discord import DiscordClient
            self.channels["discord"] = {
                "instance": DiscordClient(NotificationAgent())
            }
            logger.info("Registered Discord notification channel")
        except Exception as e:
            logger.warning(f"Failed to register Discord channel: {str(e)}")
    
    async def _run_async_method(self, method, *args, **kwargs):
        """Run async method and wait for results"""
        return await method(*args, **kwargs)
        
    def send(self, channel: str, message: str, **kwargs) -> bool:
        """Send notification through specified channel"""
        if channel not in self.channels:
            logger.error(f"Notification channel not available: {channel}")
            return False
            
        try:
            logger.info(f"Attempting to send notification via {channel}")
            logger.info(f"Notification channels available: {self.channels.keys()}")
            
            instance = self.channels[channel]["instance"]
            logger.info(f"Using {channel} instance: {type(instance).__name__}")
            
            # Log parameters
            safe_kwargs = kwargs.copy()
            if "password" in safe_kwargs:
                safe_kwargs["password"] = "******"  # Hide password
            logger.info(f"Notification params: {safe_kwargs}")
            
            # Call different methods based on channel
            if channel == "telegram":
                # Telegram uses async send_proactive_message method
                chat_id = kwargs.get("chat_id")
                method = instance.send_proactive_message
                
                # Check if chat_id needs to be passed
                if chat_id:
                    # Run async method
                    logger.info(f"Sending Telegram message with chat_id: {chat_id}")
                    loop = asyncio.get_event_loop()
                    if not loop.is_running():
                        loop = asyncio.new_event_loop()
                        asyncio.set_event_loop(loop)
                    
                    loop.run_until_complete(method(message, chat_id))
                else:
                    logger.info("Sending Telegram message without specific chat_id")
                    loop = asyncio.get_event_loop()
                    if not loop.is_running():
                        loop = asyncio.new_event_loop()
                        asyncio.set_event_loop(loop)
                    
                    loop.run_until_complete(method(message))
                
                logger.info(f"Telegram notification sent successfully")
                return True
            elif channel == "discord":
                # Discord uses async send method
                channel_id = kwargs.get("channel_id")
                method = instance.send
                
                # Prepare arguments for send method
                send_args = {"message": message}
                if channel_id:
                    send_args["channel_id"] = channel_id
                
                # Run async method
                logger.info(f"Sending Discord message with args: {send_args}")
                loop = asyncio.get_event_loop()
                if not loop.is_running():
                    loop = asyncio.new_event_loop()
                    asyncio.set_event_loop(loop)
                
                result = loop.run_until_complete(method(**send_args))
                logger.info(f"Discord notification result: {result}")
                return result
            else:
                # Twitter and Email use synchronous send method
                method = instance.send
                logger.info(f"Calling {type(instance).__name__}.send method")
                
                # Log message summary
                msg_preview = message[:100] + "..." if len(message) > 100 else message
                logger.info(f"Message preview: {msg_preview}")
                
                result = method(message, **kwargs)
                logger.info(f"Send result: {result}")
                return result
                    
        except Exception as e:
            logger.error(f"Failed to send notification via {channel}: {str(e)}")
            # Print full error stack
            import traceback
            logger.error(traceback.format_exc())
            return False
    
    def get_available_channels(self) -> List[str]:
        """Get all available notification channels"""
        return list(self.channels.keys())

    def send_to_all(self, message: str, channels: Optional[List[str]] = None, **kwargs) -> Dict[str, bool]:
        """
        Send the same notification to multiple channels
        
        Args:
            message: Notification content
            channels: List of channels to use, if None, use all available channels
            **kwargs: Channel-specific parameters
        
        Returns:
            Dict[str, bool]: Send result for each channel
        """
        if channels is None:
            channels = self.get_available_channels()
            
        results = {}
        for channel in channels:
            channel_kwargs = kwargs.get(channel, {})
            results[channel] = self.send(channel, message, **channel_kwargs)
            
        return results