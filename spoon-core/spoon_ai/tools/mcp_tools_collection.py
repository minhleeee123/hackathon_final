from fastmcp import FastMCP
import asyncio
from typing import Any, Dict, List, Optional

# Import base tool classes and tool manager
from spoon_ai.tools import BaseTool, ToolManager

from spoon_toolkits import (
    PredictPrice,
    TokenHolders,
    TradingHistory,
    UniswapLiquidity,
    WalletAnalysis,
    GetTokenPriceTool,
    Get24hStatsTool,
    GetKlineDataTool,
    PriceThresholdAlertTool,
    LpRangeCheckTool,
    SuddenPriceIncreaseTool,
    LendingRateMonitorTool,
    # LstArbitrageTool,
    # TokenTransfer,
)

mcp = FastMCP("SpoonAI MCP Tools")

class MCPToolsCollection:
    """Collection class that wraps existing tools as MCP tools"""

    def __init__(self):
        """Initialize MCP tools collection

        Args:
            name: Name of the MCP server
        """
        self.mcp = mcp
        self._setup_tools()

    def _setup_tools(self):
        """Set up all available tools as MCP tools"""
        # Create all tool instances
        tools = [
            PredictPrice(),
            TokenHolders(),
            TradingHistory(),
            UniswapLiquidity(),
            WalletAnalysis(),
            GetTokenPriceTool(),
            Get24hStatsTool(),
            GetKlineDataTool(),
            PriceThresholdAlertTool(),
            LpRangeCheckTool(),
            SuddenPriceIncreaseTool(),
            LendingRateMonitorTool(),
            # LstArbitrageTool(),
            # TokenTransfer()

        ]

        # Create tool manager
        self.tool_manager = ToolManager(tools)

        # Create MCP wrapper for each tool using new FastMCP API
        for tool in tools:
            # Use the new API: add_tool expects a FunctionTool object
            from fastmcp.tools.tool import FunctionTool

            # Create a FunctionTool from the existing tool
            function_tool = FunctionTool(
                name=tool.name,
                description=tool.description,
                fn=tool.execute,  # Pass the function directly
                parameters=tool.parameters if hasattr(tool, 'parameters') else {}
            )
            self.mcp.add_tool(function_tool)

    async def run(self, **kwargs):
        """Start the MCP server

        Args:
            **kwargs: Parameters passed to FastMCP.run()
        """
        await self.mcp.run_async(transport="sse", port=8765, **kwargs)

    async def add_tool(self, tool: BaseTool):
        """Add a tool to the MCP server"""
        from fastmcp.tools.tool import FunctionTool

        # Create a FunctionTool from the existing tool
        function_tool = FunctionTool(
            name=tool.name,
            description=tool.description,
            fn=tool.execute,  # Pass the function directly
            parameters=tool.parameters if hasattr(tool, 'parameters') else {}
        )
        self.mcp.add_tool(function_tool)

# Create default instance that can be imported directly
mcp_tools = MCPToolsCollection()

if __name__ == "__main__":
    # Start MCP server when this script is run directly
    asyncio.run(mcp_tools.run())
