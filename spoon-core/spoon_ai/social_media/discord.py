import os
import logging
import asyncio
from typing import List, Dict, Any, Optional

import discord
from discord.ext import commands
from dotenv import load_dotenv

from spoon_ai.agents.toolcall import ToolCallAgent
from spoon_ai.schema import AgentState, Role, Message

logger = logging.getLogger(__name__)

class DiscordClient:
    """Discord client for interacting with Discord"""
    
    def __init__(self, agent: Optional[ToolCallAgent] = None):
        """
        Initialize Discord client
        
        Args:
            agent: Optional ToolCallAgent instance for message processing
        """
        self.config = self._load_config()
        self.client = commands.Bot(command_prefix='!', intents=discord.Intents.all())
        self.agent = agent
        self.setup_handlers()
        
    def _load_config(self) -> Dict[str, Any]:
        """Load Discord configuration from environment variables"""
        load_dotenv()
        
        config = {
            "token": os.getenv("DISCORD_BOT_TOKEN"),
            "default_channel_id": os.getenv("DISCORD_DEFAULT_CHANNEL_ID"),
        }
        
        # Validate required configuration items
        if not config.get("token"):
            logger.warning("Missing Discord bot token")
        
        return config
    
    def setup_handlers(self):
        """Set up Discord event handlers"""
        
        @self.client.event
        async def on_ready():
            """Triggered when the bot successfully connects to Discord"""
            logger.info(f'Discord bot logged in as {self.client.user}')
            
        @self.client.event
        async def on_message(message):
            """Triggered when a new message is received"""
            # Ignore own messages
            if message.author == self.client.user:
                return
                
            # Process commands
            await self.client.process_commands(message)
            
            # If the message mentions the bot, process with agent
            if self.agent and self.client.user in message.mentions:
                content = message.content.replace(f'<@!{self.client.user.id}>', '').strip()
                await self._process_with_agent(content, message.channel)
        
        @self.client.command(name='help')
        async def help_command(ctx):
            """Send help information"""
            help_text = """
            👋 Hi! I'm the SpoonAI bot, an assistant working for Neo blockchain.

            **Commands:**
            `!help` - Display this help information
            
            You can also mention me directly for conversation.
            """
            await ctx.send(help_text)
    
    async def _process_with_agent(self, content: str, channel):
        """Process message content with agent"""
        if not self.agent:
            return
            
        # Run agent asynchronously
        result = await self.agent.run(content)
        self.agent.state = AgentState.IDLE
        
        # Get assistant messages
        def get_assistant_message_summary(messages: List[Message]):
            assistant_messages = [message for message in messages if message.role == Role.ASSISTANT]
            return "\n".join([message.content for message in assistant_messages]) if assistant_messages else "No response from assistant"
        
        response = get_assistant_message_summary(self.agent.memory.get_messages())
        await channel.send(response)
        self.agent.clear()
    
    async def send(self, message: str, channel_id: Optional[str] = None, **kwargs) -> bool:
        """
        Send Discord message
        
        Args:
            message: Message content
            channel_id: Channel ID, uses default channel if None
            **kwargs: Additional parameters
        
        Returns:
            bool: Whether the send was successful
        """
        try:
            # Get channel ID
            target_channel_id = channel_id or self.config.get("default_channel_id")
            if not target_channel_id:
                logger.error("No channel ID specified for Discord message")
                return False
                
            # Get channel
            channel = self.client.get_channel(int(target_channel_id))
            if not channel:
                logger.error(f"Could not find Discord channel with ID {target_channel_id}")
                return False
                
            # Send message
            asyncio.create_task(channel.send(message))
            logger.info(f"Discord message sent to channel {target_channel_id}")
            return True
            
        except Exception as e:
            logger.error(f"Failed to send Discord message: {str(e)}")
            return False
    
    async def run(self):
        """Start Discord client"""
        if not self.config.get("token"):
            logger.error("Discord bot token not configured")
            return
            
        try:
            await self.client.start(self.config["token"])
        except Exception as e:
            logger.error(f"Error running Discord client: {e}")
    
    async def stop(self):
        """Stop Discord client"""
        if self.client:
            await self.client.close()
            logger.info("Discord client stopped") 