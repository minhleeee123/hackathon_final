
import os
import asyncio
import logging
from typing import Dict, Any
from spoon_ai.agents.spoon_react_mcp import SpoonReactMCP
from spoon_ai.tools.mcp_tool import MCPTool
from spoon_ai.tools.tool_manager import ToolManager
from spoon_ai.chat import ChatBot
from spoon_toolkits.crypto.crypto_powerdata.tools import CryptoPowerDataCEXTool

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class SpoonMacroAnalysisAgent(SpoonReactMCP):
    name: str = "SpoonMacroAnalysisAgent"
    system_prompt: str = (
        '''You are a cryptocurrency market analyst. Your task is to provide a comprehensive
        macroeconomic analysis of a given token.

        To do this, you will perform the following steps:
        1. Use the `crypto_power_data_cex` tool to get the latest candlestick data and
           technical indicators.
        2. Use the `tavily-search` tool to find the latest news and market sentiment.
        3. Synthesize the data from both tools to form a holistic analysis.'''
    )

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.available_tools = ToolManager([])

    async def initialize(self):
        logger.info("Initializing agent and loading tools...")

        tavily_key = os.getenv("TAVILY_API_KEY", "")
        if not tavily_key or "your-tavily-api-key-here" in tavily_key:
            raise ValueError("TAVILY_API_KEY is not set or is a placeholder.")

        tavily_tool = MCPTool(
            name="tavily-search",
            description="Performs a web search using the Tavily API.",
            mcp_config={
                "command": "npx",
                "args": ["--yes", "tavily-mcp"],
                "env": {"TAVILY_API_KEY": tavily_key}
            }
        )

        crypto_tool = CryptoPowerDataCEXTool()
        self.available_tools = ToolManager([tavily_tool, crypto_tool])
        logger.info(f"Available tools: {list(self.available_tools.tool_map.keys())}")

async def main():
    print("--- SpoonOS Macro Analysis Agent Demo ---")
    tavily_key = os.getenv("TAVILY_API_KEY")
    if not tavily_key or "your-tavily-api-key-here" in tavily_key:
        logger.error("TAVILY_API_KEY is not set or contains a placeholder. Please set a valid API key.")
        return

    agent = SpoonMacroAnalysisAgent(llm=ChatBot(llm_provider="openai"))
    print("Agent instance created.")
    await agent.initialize()
    query = "Perform a macro analysis of the NEO token."
    print(f"\nRunning query: {query}")
    response = await agent.run(query)
    print(f"\n--- Analysis Complete ---\n{response}")

if __name__ == "__main__":
    asyncio.run(main())
