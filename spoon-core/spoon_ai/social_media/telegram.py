import logging
import os
import asyncio

from telegram import Update
from telegram.ext import (ApplicationBuilder, CommandHandler, ContextTypes,
                          MessageHandler, filters)

from telegram.request import HTTPXRequest

from spoon_ai.agents.toolcall import ToolCallAgent
from spoon_ai.schema import AgentState, Role, Message
from typing import List

logger = logging.getLogger(__name__)

BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN")

class TelegramClient:
    
    def __init__(self, agent: ToolCallAgent):
        print(BOT_TOKEN)
        self.application = ApplicationBuilder().token(BOT_TOKEN).request(HTTPXRequest()).build()
        self.agent = agent
        
    async def start(self, update: Update, context: ContextTypes.DEFAULT_TYPE):
        await update.message.reply_text("Hello! I'm spoon ai, a helpful assistant worked for neo blockchain")
    
    async def echo(self, update: Update, context: ContextTypes.DEFAULT_TYPE):
        result = await self.agent.run(update.message.text)
        self.agent.state = AgentState.IDLE
        
        def get_assistant_message_summary(messages: List[Message]):
            assistant_messages = [message for message in messages if message.role == Role.ASSISTANT]
            return "\n".join([message.content for message in assistant_messages]) if assistant_messages else "No response from assistant"
        
        await update.message.reply_text(get_assistant_message_summary(self.agent.memory.get_messages()))
        self.agent.clear()
        
    async def send_proactive_message(self, text, chat_id=1836137431):
        await self.application.bot.send_message(chat_id=chat_id, text=text)
        
    async def run(self):
        self.application.add_handler(CommandHandler("start", self.start))
        self.application.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, self.echo))
        await self.application.initialize()
        await self.application.start()
        
        self.stop_event = asyncio.Event()
        try:
            await self.application.updater.start_polling()
            await self.stop_event.wait()
        except Exception as e:
            logger.error(f"Error running Telegram client: {e}")
        finally:
            await self.application.stop()
            await self.application.shutdown()

    async def stop(self):
        self.stop_event.set()