from spoon_ai.agents.spoon_react import SpoonReactAI
from spoon_ai.tools.mcp_tool import MCPTool as MCPClientMixin
from fastmcp.client.transports import SSETransport
from spoon_ai.tools.tool_manager import ToolManager
from pydantic import Field
from spoon_ai.chat import ChatBot
import os
import asyncio

"""
🔍 SpoonThirdWebMCP Agent

This agent is specialized in querying EVM blockchain data via the Thirdweb Insight API.
It supports analyzing smart contract events, wallet activity, and cross-chain transactions.

📌 Requirements:
- You must have a valid Thirdweb Insight API `client_id`.

📚 For more info, see:
- https://portal.thirdweb.com/insight/overview

💡 Example usage:
    > Show me recent USDT transfers on Ethereum
    > Get 10 latest transactions from contract 0x...
"""


class SpoonThirdWebMCP(SpoonReactAI, MCPClientMixin):
    name: str = "SpoonThirdWebMCP"
    description: str = (
        "An AI assistant specialized in querying EVM blockchain data using the Thirdweb Insight API. "
        "Supports retrieving smart contract events (e.g. Transfer), function call transactions, wallet activity, "
        "recent cross-chain token transfers (especially USDT), block metadata, and contract-specific transaction logs. "
        "Use this agent when the user asks about on-chain behavior, such as token transfers, contract usage, wallet history, or recent block/transaction activity."
    )
    system_prompt: str = """
        You are ThirdwebInsightAgent, a blockchain data analyst assistant powered by Thirdweb Insight API.
        You can fetch EVM contract events, transactions, token transfers, blocks, and wallet activity across multiple chains.

        Use the appropriate tool when the user asks about:
        - contract logs or Transfer events → use `get_contract_events_from_thirdweb_insight`
        - USDT transfers across chains → use `get_multichain_transfers_from_thirdweb_insight`
        - recent cross-chain transactions → use `get_transactions`
        - a specific contract’s transaction history → use `get_contract_transactions`
        - contract function call history (e.g., swap, approve) → use `get_contract_transactions_by_signature`
        - recent block info by chain → use `get_blocks_from_thirdweb_insight`
        - wallet activity across chains → use `get_wallet_transactions_from_thirdweb_insight`

        Always extract necessary parameters like:
        - `contract_address` (if user mentions a token, e.g. USDT, WETH, use its address)
        - `chain_id` (Ethereum = 1, Polygon = 137, etc.)
        - `event_signature` (e.g., 'Transfer(address,address,uint256)')
        - `limit` (default to 10 if unspecified)
        - `client_id` can be pulled from environment variable or injected context

        If something is unclear, ask for clarification. Otherwise, call the appropriate tool.

        Do not call any tool not listed here.
    """

    available_tools: ToolManager = Field(default_factory=lambda: ToolManager([]))
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        MCPClientMixin.__init__(self, mcp_transport=kwargs.get('mcp_transport', SSETransport("http://127.0.0.1:8765/sse")))


async def main():
    # Ensure necessary API keys are set
    info_agent = SpoonThirdWebMCP(llm=ChatBot(llm_provider="openai",model_name="anthropic/claude-sonnet-4", base_url="https://openrouter.ai/api/v1" ))

    # Query the latest USDT transfer events on Ethereum and Polygon
    info_agent.clear()
    result = await info_agent.run("Show me recent USDT transfers on Ethereum and Polygon ,using client ID xxxxx.")
    print("🧠 Agent Reply:", result)

    info_agent.clear()
    result = await info_agent.run("Please return 0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48 Ethereum chain contracts in recent 10 trades,using client ID xxxxx.")
    print("🧠 Agent Reply:", result)

    info_agent.clear()
    result = await info_agent.run("Get the latest 12 blocks from Ethereum,sorted by block number,using client ID xxxxx.")
    print("🧠 Agent Reply:", result)

    info_agent.clear()
    result = await info_agent.run("Fetch 5 blocks from Polygon, Sort by block_number, using client ID xxxxx.")
    print("🧠 Agent Reply:", result)


if __name__ == "__main__":
    asyncio.run(main())





