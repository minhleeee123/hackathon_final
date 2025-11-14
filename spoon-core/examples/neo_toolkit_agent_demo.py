"""
Neo Toolkit Agent Demo - Comprehensive demonstration using spoon_ai framework

This example demonstrates Neo blockchain tools using spoon_ai agents, showcasing:
- Agent-based tool interaction
- Comprehensive Neo toolkit coverage (58 tools)
- Real-world usage scenarios
- Error handling and validation

Uses testnet for all demonstrations with embedded test data.
"""

import asyncio
import sys
import os
from pathlib import Path
from typing import List, Dict, Any
from dotenv import load_dotenv

# Import spoon_ai framework
from spoon_ai.agents.toolcall import ToolCallAgent
from spoon_ai.tools import ToolManager
from spoon_ai.chat import ChatBot
from spoon_ai.llm.manager import get_llm_manager
from pydantic import Field

# Import Neo tools for agent
from spoon_toolkits.crypto.neo import (
    # Address tools (8)
    GetAddressCountTool,
    GetAddressInfoTool,
    GetActiveAddressesTool,
    GetTagByAddressesTool,
    GetTotalSentAndReceivedTool,
    GetRawTransactionByAddressTool,
    GetTransferByAddressTool,
    GetNep11OwnedByAddressTool,
    
    # Asset tools (5)
    GetAssetCountTool,
    GetAssetInfoByNameTool,
    GetAssetInfoByHashTool,
    GetAssetsInfoByUserAddressTool,
    GetAssetInfoByAssetAndAddressTool,

    # Block tools (6)
    GetBlockCountTool,
    GetBlockByHeightTool,
    GetBestBlockHashTool,
    GetRecentBlocksInfoTool,
    GetBlockByHashTool,
    GetBlockRewardByHashTool,

    # Smart contract tools (8)
    GetContractCountTool,
    GetContractByHashTool,
    GetContractListByNameTool,
    GetVerifiedContractByContractHashTool,
    GetVerifiedContractTool,
    GetScCallByContractHashTool,
    GetScCallByContractHashAddressTool,
    GetScCallByTransactionHashTool,

    # Transaction tools (8)
    GetTransactionCountTool,
    GetRawTransactionByHashTool,
    GetRawTransactionByBlockHashTool,
    GetRawTransactionByBlockHeightTool,
    GetRawTransactionByTransactionHashTool,
    GetTransferByBlockHashTool,
    GetTransferByBlockHeightTool,
    GetTransferEventByTransactionHashTool,

    # NEP tools (11)
    GetNep11BalanceTool,
    GetNep11ByAddressAndHashTool,
    GetNep11TransferByAddressTool,
    GetNep11TransferByBlockHeightTool,
    GetNep11TransferByTransactionHashTool,
    GetNep11TransferCountByAddressTool,
    GetNep17TransferByAddressTool,
    GetNep17TransferByBlockHeightTool,
    GetNep17TransferByContractHashTool,
    GetNep17TransferByTransactionHashTool,
    GetNep17TransferCountByAddressTool,

    # Application Log and State tools (2)
    GetApplicationLogTool,
    GetApplicationStateTool,

    # Governance tools (10)
    GetCandidateCountTool,
    GetTotalVotesTool,
    GetCommitteeInfoTool,
    GetCandidateByAddressTool,
    GetCandidateByVoterAddressTool,
    GetScVoteCallByCandidateAddressTool,
    GetScVoteCallByTransactionHashTool,
    GetScVoteCallByVoterAddressTool,
    GetVotersByCandidateAddressTool,
    GetVotesByCandidateAddressTool,
)

# Load environment variables
load_dotenv()


class NeoToolkitAgentDemo:
    """Neo Toolkit Agent-based comprehensive demonstration"""

    TEST_DATA = {
        "network": "testnet",
        "basic_test_data": {
            "addresses": [
                "NUTtedVrz5RgKAdCvtKiq3sRkb9pizcewe",
                "NaU3shtZqnR1H6XnDTxghorgkXN687C444"
            ],
            "transaction_hash": "0xac72c504141743c5ac538ecaf360502b8492208b60d667bd2b3eb445d7ce3c6c",
            "block_height": 10226921,
            "block_hash": "0x9f238c3759e655937b277ef7f2755da2875d8811f415c60b57b8b07d1791de0f",
            "start_time": "2025-10-13T00:00:00Z",
            "end_time": "2025-10-13T23:59:59Z",
            "limit": 20,
            "skip": 0,
            "token_id": "0704"
        },
        "contract_hashes": {
            "NEO": "0xef4073a0f2b305a38ec4050e4d3d28bc40ea63f5",
            "GAS": "0xd2a4cff31913016155e38e474a2c06d08be276cf",
            "NEO_TOKEN": "0xef4073a0f2b305a38ec4050e4d3d28bc40ea63f5"
        },
        "asset_names": ["NEO", "GAS"],
        "governance_data": {
            "active_candidates": [
                {
                    "publickey": "0214baf0ceea3a66f17e7e1e839ea25fd8bed6cd82e6bb6e68250189065f44ff01",
                    "votes": "2000873",
                    "active": True,
                    "note": "High votes, active candidate"
                },
                {
                    "publickey": "023e9b32ea89b94d066e649b124fd50e396ee91369e8e2a6ae1b11c170d022256d",
                    "votes": "2442241",
                    "active": True,
                    "note": "Highest votes among active candidates"
                }
            ],
            "candidate_public_keys": [
                "0214baf0ceea3a66f17e7e1e839ea25fd8bed6cd82e6bb6e68250189065f44ff01",
                "023e9b32ea89b94d066e649b124fd50e396ee91369e8e2a6ae1b11c170d022256d",
                "02a7834be9b32e2981d157cb5bbd3acb42cfd11ea5c3b10224d7a44e98c5910f1b",
                "02ba2c70f5996f357a43198705859fae2cfea13e1172962800772b3d588a9d4abd",
                "03009b7540e10f2562e5fd8fac9eaec25166a58b26e412348ff5a86927bfac22a2"
            ]
        }
    }

    def __init__(self):
        """Initialize the demo with embedded test data"""
        self.load_test_data()
        self.agents = {}

    def load_test_data(self):
        """Load test data from embedded TEST_DATA configuration"""
        try:
            data = self.TEST_DATA
            
            # Load basic configuration
            self.network = data.get("network", "testnet")

            # Load basic test data
            basic_data = data.get("basic_test_data", {})
            self.demo_address = basic_data.get("addresses", [])[0] if basic_data.get("addresses") else "default_address"
            self.demo_addresses = basic_data.get("addresses", [])
            self.test_tx_hash = basic_data.get("transaction_hash", "")
            self.test_block_height = basic_data.get("block_height", 0)
            self.test_block_hash = basic_data.get("block_hash", "")
            self.test_token_id = basic_data.get("token_id", "")
            self.test_limit = basic_data.get("limit", 20)
            self.test_skip = basic_data.get("skip", 0)

            # Load contract and asset data
            contracts = data.get("contract_hashes", {})
            self.demo_contract = contracts.get("NEO", "")
            self.gas_contract = contracts.get("GAS", "")
            self.demo_asset_name = data.get("asset_names", ["NEO"])[0] if data.get("asset_names") else "NEO"

            # Load governance data
            governance_data = data.get("governance_data", {})
            self.active_candidates = governance_data.get("active_candidates", [])
            self.candidate_public_keys = governance_data.get("candidate_public_keys", [])
            print(f"✳️Running the entire example takes around 10 minutes")
            print(f"✅ Loaded test data from embedded configuration")
            print(f"   Network: {self.network}")
            print(f"   Addresses: {len(self.demo_addresses)} available")
            print(f"   Candidates: {len(self.active_candidates)} active")

        except Exception as e:
            print(f"❌ Failed to load test data: {e}")
            # Set minimal defaults
            self.network = "testnet"
            self.demo_address = ""
            self.demo_addresses = []
            self.demo_contract = ""
            self.gas_contract = ""
            self.demo_asset_name = "NEO"
            self.test_tx_hash = ""
            self.test_block_height = 0
            self.test_block_hash = ""
            self.test_token_id = ""
            self.test_limit = 20
            self.test_skip = 0
            self.active_candidates = []
            self.candidate_public_keys = []

    def create_agent(self, name: str, tools: List, description: str) -> ToolCallAgent:
        """Create a specialized agent with specific tools"""
        network = self.network
        test_limit = self.test_limit
        test_skip = self.test_skip

        class NeoSpecializedAgent(ToolCallAgent):
            agent_name: str = name
            agent_description: str = description
            system_prompt: str = f"""
            You are a Neo blockchain specialist focused on {description}.
            Use the available tools to analyze Neo blockchain data and provide comprehensive insights.
            Always specify network='{network}' when calling tools.

            **Pagination Support:**
            21 tools support optional Skip and Limit parameters for efficient pagination:
            - Skip: the number of items to skip (default: {test_skip})
            - Limit: the number of items to return (default: {test_limit})

            When calling tools that support pagination (especially for list queries), always include:
            - Example: GetAssetInfoByNameTool(asset_name="NEO", Skip={test_skip}, Limit={test_limit}, network="{network}")

            Complete list of tools supporting pagination:
            - GetAssetInfoByNameTool 
            - GetAssetsInfoByUserAddressTool 
            - GetRecentBlocksInfoTool 
            - GetContractListByNameTool 
            - GetVerifiedContractTool 
            - GetCommitteeInfoTool 
            - GetApplicationStateTool 
            - GetNep11ByAddressAndHashTool 
            - GetNep11TransferByAddressTool 
            - GetNep11TransferByBlockHeightTool 
            - GetNep11TransferByTransactionHashTool 
            - GetNep17TransferByAddressTool 
            - GetNep17TransferByBlockHeightTool 
            - GetNep17TransferByContractHashTool 
            - GetNep17TransferByTransactionHashTool 
            - GetScCallByContractHashTool 
            - GetScCallByContractHashAddressTool 
            - GetScCallByTransactionHashTool 
            - GetRawTransactionByBlockHeightTool 
            - GetCandidateByVoterAddressTool 
            - GetScVoteCallByCandidateAddressTool 
            - GetScVoteCallByVoterAddressTool
            - GetVotersByCandidateAddressTool 

            Provide clear, informative responses based on the tool results.
            """
            max_steps: int = 5
            available_tools: ToolManager = Field(default_factory=lambda: ToolManager(tools))

        agent = NeoSpecializedAgent(
            llm=ChatBot(
                llm_provider="openrouter",
                model_name="anthropic/claude-3.5-sonnet"
            )
        )
        return agent

    def setup_agents(self):
        """Setup specialized agents for different Neo toolkit categories"""

        # Blockchain Explorer Agent (6 tools)
        blockchain_tools = [
            GetBlockCountTool(),
            GetBlockByHeightTool(),
            GetBestBlockHashTool(),
            GetRecentBlocksInfoTool(),
            GetBlockByHashTool(),
            GetBlockRewardByHashTool()
        ]
        self.agents['blockchain'] = self.create_agent(
            "Blockchain Explorer",
            blockchain_tools,
            "Expert in Neo blockchain exploration, block analysis, and network monitoring"
        )

        # Address Analyst Agent (8 tools)
        address_tools = [
            GetAddressCountTool(),
            GetAddressInfoTool(),
            GetActiveAddressesTool(),
            GetTagByAddressesTool(),
            GetTotalSentAndReceivedTool(),
            GetRawTransactionByAddressTool(),
            GetTransferByAddressTool(),
            GetNep11OwnedByAddressTool()
        ]
        self.agents['address'] = self.create_agent(
            "Address Analyst",
            address_tools,
            "Specialist in Neo address validation, analysis, NFT holdings, and transaction tracking"
        )

        # Asset Manager Agent (5 tools)
        asset_tools = [
            GetAssetCountTool(),
            GetAssetInfoByNameTool(),
            GetAssetInfoByHashTool(),
            GetAssetsInfoByUserAddressTool(),
            GetAssetInfoByAssetAndAddressTool()
        ]
        self.agents['asset'] = self.create_agent(
            "Asset Manager",
            asset_tools,
            "Expert in Neo asset management, token information, and portfolio analysis"
        )

        # Transaction Tracker Agent (8 tools)
        transaction_tools = [
            GetTransactionCountTool(),
            GetRawTransactionByHashTool(),
            GetRawTransactionByBlockHashTool(),
            GetRawTransactionByBlockHeightTool(),
            GetRawTransactionByTransactionHashTool(),
            GetTransferByBlockHashTool(),
            GetTransferByBlockHeightTool(),
            GetTransferEventByTransactionHashTool()
        ]
        self.agents['transaction'] = self.create_agent(
            "Transaction Tracker",
            transaction_tools,
            "Specialist in Neo transaction analysis, tracking, and verification"
        )

        # NEP Token Expert Agent (11 tools)
        nep_tools = [
            GetNep11BalanceTool(),
            GetNep11ByAddressAndHashTool(),
            GetNep11TransferByAddressTool(),
            GetNep11TransferByBlockHeightTool(),
            GetNep11TransferByTransactionHashTool(),
            GetNep11TransferCountByAddressTool(),
            GetNep17TransferByAddressTool(),
            GetNep17TransferByBlockHeightTool(),
            GetNep17TransferByContractHashTool(),
            GetNep17TransferByTransactionHashTool(),
            GetNep17TransferCountByAddressTool()
        ]
        self.agents['nep'] = self.create_agent(
            "NEP Token Expert",
            nep_tools,
            "Expert in NEP-17 fungible tokens and NEP-11 NFTs, transfers, and balance management"
        )

        # Smart Contract Auditor Agent (8 tools)
        contract_tools = [
            GetContractCountTool(),
            GetContractByHashTool(),
            GetContractListByNameTool(),
            GetScCallByContractHashTool(),
            GetScCallByContractHashAddressTool(),
            GetScCallByTransactionHashTool(),
            GetVerifiedContractByContractHashTool(),
            GetVerifiedContractTool()
        ]
        self.agents['contract'] = self.create_agent(
            "Smart Contract Auditor",
            contract_tools,
            "Specialist in Neo smart contract analysis, verification, call patterns, and testing"
        )

        # Governance Monitor Agent (10 tools)
        governance_tools = [
            GetCandidateCountTool(),
            GetTotalVotesTool(),
            GetCommitteeInfoTool(),
            GetCandidateByAddressTool(),
            GetCandidateByVoterAddressTool(),
            GetScVoteCallByCandidateAddressTool(),
            GetScVoteCallByTransactionHashTool(),
            GetScVoteCallByVoterAddressTool(),
            GetVotersByCandidateAddressTool(),
            GetVotesByCandidateAddressTool()
        ]
        self.agents['governance'] = self.create_agent(
            "Governance Monitor",
            governance_tools,
            "Expert in Neo governance, voting mechanisms, committee operations, and consensus analysis"
        )
        
        # Application Log Analyst Agent (2 tools)
        log_tools = [
            GetApplicationLogTool(),
            GetApplicationStateTool()
        ]
        self.agents['logs'] = self.create_agent(
            "Application Log Analyst",
            log_tools,
            "Specialist in analyzing smart contract execution logs, debugging, and application states"
        )

    def print_section_header(self, title: str):
        """Print formatted section header"""
        print(f"\n{'='*80}")
        print(f" {title}")
        print(f"{'='*80}")

    async def run_agent_scenario(self, agent_name: str, scenario_title: str, user_message: str):
        """Run a specific scenario with an agent"""
        print(f"\n{'-'*60}")
        print(f" Agent: {self.agents[agent_name].agent_name}")
        print(f" Scenario: {scenario_title}")
        print(f" Query: {user_message}")
        print(f"{'-'*60}")

        try:
            # Clear agent state before running
            self.agents[agent_name].clear()

            # Run the agent with the user message
            response = await self.agents[agent_name].run(user_message)

            print(f"✅ Response: {response}")

        except Exception as e:
            print(f"❌ Error: {str(e)}")

    async def demo_blockchain_exploration(self):
        """Demonstrate blockchain exploration capabilities"""
        self.print_section_header("1. Blockchain Exploration with AI Agent")

        await self.run_agent_scenario(
            'blockchain',
            "Current Network Status",
            f"What's the current status of the Neo {self.network}? Show me the latest block information and total block count."
        )

        await self.run_agent_scenario(
            'blockchain',
            "Historical Block Analysis",
            f"Analyze block number {self.test_block_height} on {self.network}. What information can you provide about this block?"
        )

        await self.run_agent_scenario(
            'blockchain',
            "Recent Blocks Overview",
            f"Give me an overview of recent blocks on Neo {self.network}. What's the network activity like?"
        )

    async def demo_address_analysis(self):
        """Demonstrate address analysis capabilities"""
        self.print_section_header("2. Address Analysis with AI Agent")

        await self.run_agent_scenario(
            'address',
            "Address Profile Analysis",
            f"Create a profile analysis for address {self.demo_address}. What can you tell me about this address's activity?"
        )
        
        await self.run_agent_scenario(
            'address',
            "NFT Holdings Analysis",
            f"Analyze NEP-11 NFT holdings for address {self.demo_address}. What NFTs does this address own?"
        )
        
        await self.run_agent_scenario(
            'address',
            "Comprehensive Address Portfolio",
            f"Create a comprehensive portfolio analysis for {self.demo_address} including all assets, NFTs, and transaction patterns."
        )
        
        if len(self.demo_addresses) >= 3:
            await self.run_agent_scenario(
                'address',
                "Multi-Address Comparison",
                f"Compare activity between addresses: {', '.join(self.demo_addresses[:3])}. What patterns do you observe?"
            )

    async def demo_asset_management(self):
        """Demonstrate asset management capabilities"""
        self.print_section_header("3. Asset Management with AI Agent")

        await self.run_agent_scenario(
            'asset',
            "Asset Discovery",
            f"How many assets are registered on Neo {self.network}? Give me an overview of the asset ecosystem. When retrieving asset lists, use Skip={self.test_skip} and Limit={self.test_limit} for pagination."
        )

        await self.run_agent_scenario(
            'asset',
            "NEO Token Analysis",
            f"Analyze the {self.demo_asset_name} token with pagination (Skip={self.test_skip}, Limit={self.test_limit}). What are its key properties and characteristics?"
        )

        await self.run_agent_scenario(
            'asset',
            "Portfolio Analysis",
            f"Analyze the asset portfolio for address {self.demo_address} using pagination parameters Skip={self.test_skip} and Limit={self.test_limit}. What assets does this address hold?"
        )

    async def demo_transaction_tracking(self):
        """Demonstrate transaction tracking capabilities"""
        self.print_section_header("4. Transaction Tracking with AI Agent")

        await self.run_agent_scenario(
            'transaction',
            "Network Transaction Overview",
            f"Give me an overview of transaction activity on Neo {self.network}. How many transactions have been processed?"
        )

        await self.run_agent_scenario(
            'transaction',
            "Address Transaction History",
            f"Analyze the transaction history for address {self.demo_address}. When retrieving transaction lists, use pagination with Skip={self.test_skip} and Limit={self.test_limit}. What can you tell me about its transaction patterns?"
        )

        await self.run_agent_scenario(
            'transaction',
            "Block Transaction Analysis",
            f"Analyze transactions in block height {self.test_block_height} on {self.network} using pagination (Skip={self.test_skip}, Limit={self.test_limit}). What types of transactions occurred?"
        )

    async def demo_nep_tokens(self):
        """Demonstrate NEP token analysis capabilities"""
        self.print_section_header("5. NEP Token Analysis with AI Agent")

        await self.run_agent_scenario(
            'nep',
            "NEP-17 Transfer Analysis",
            f"Analyze NEP-17 token transfers for address {self.demo_address} and contract {self.demo_contract} using pagination (Skip={self.test_skip}, Limit={self.test_limit}). What token activity can you find?"
        )

        await self.run_agent_scenario(
            'nep',
            "Contract Token Activity",
            f"Analyze token activity for contract {self.demo_contract} with pagination Skip={self.test_skip} and Limit={self.test_limit}. What transfer patterns do you see?"
        )

        await self.run_agent_scenario(
            'nep',
            "NEP-11 Asset Holdings",
            f"Check NEP-11 (NFT) assets for address {self.demo_address} and contract {self.demo_contract} using Skip={self.test_skip} and Limit={self.test_limit}. What NFT information can you find?"
        )

    async def demo_smart_contracts(self):
        """Demonstrate smart contract analysis capabilities"""
        self.print_section_header("6. Smart Contract Analysis with AI Agent")

        await self.run_agent_scenario(
            'contract',
            "Contract Ecosystem Overview",
            f"Give me an overview of the smart contract ecosystem on Neo {self.network}. How many contracts are deployed? When retrieving contract lists, use Skip={self.test_skip} and Limit={self.test_limit}."
        )

        await self.run_agent_scenario(
            'contract',
            "Contract Deep Dive",
            f"Analyze contract {self.demo_contract}. What can you tell me about this contract's functionality and state?"
        )

        await self.run_agent_scenario(
            'contract',
            "Contract Call Analysis",
            f"Analyze smart contract calls for contract {self.demo_contract} using pagination (Skip={self.test_skip}, Limit={self.test_limit}). What contract interactions can you find?"
        )

        await self.run_agent_scenario(
            'contract',
            "Verified Contracts Overview",
            f"Give me an overview of verified smart contracts on Neo {self.network} with pagination Skip={self.test_skip} and Limit={self.test_limit}. What are the benefits of contract verification?"
        )
        if self.demo_contract:
            await self.run_agent_scenario(
                'contract',
                "Contract Verification Check",
                f"Check if contract {self.demo_contract} is verified. If yes, show me its verification details."
            )

            await self.run_agent_scenario(
                'contract',
                "Contract Call Pattern Analysis",
                f"Analyze smart contract call patterns for {self.demo_contract} using Skip={self.test_skip} and Limit={self.test_limit}. What are the most common interactions and who are the main users?"
            )
        
        # Transaction-based contract call analysis
        if self.test_tx_hash:
            await self.run_agent_scenario(
                'contract',
                "Transaction Contract Interactions",
                f"Analyze all contract calls in transaction {self.test_tx_hash}. What contract methods were invoked?"
            )

    async def demo_governance_monitoring(self):
        """Demonstrate governance monitoring capabilities"""
        self.print_section_header("7. Governance Monitoring with AI Agent")

        await self.run_agent_scenario(
            'governance',
            "Governance Overview",
            f"Give me an overview of Neo {self.network} governance. How many candidates and what's the voting situation? When retrieving lists, use Skip={self.test_skip} and Limit={self.test_limit}."
        )

        await self.run_agent_scenario(
            'governance',
            "Committee Analysis",
            f"Analyze the current Neo committee members on {self.network} using pagination (Skip={self.test_skip}, Limit={self.test_limit}). Who are the active committee members?"
        )

        await self.run_agent_scenario(
            'governance',
            "Voting Statistics",
            f"Analyze voting statistics on Neo {self.network}. What's the level of community participation?"
        )

        # Additional scenario if we have candidate data
        if self.active_candidates:
            candidate_info = self.active_candidates[0]  # Use first active candidate
            candidate_key = candidate_info.get('publickey', '')
            await self.run_agent_scenario(
                'governance',
                "Candidate Deep Analysis",
                f"Analyze candidate with public key {candidate_key} using pagination Skip={self.test_skip} and Limit={self.test_limit}. Show me their detailed information, voters, and vote statistics."
            )

        # Voter analysis scenario
        if self.demo_address:
            await self.run_agent_scenario(
                'governance',
                "Voter Activity Analysis",
                f"Analyze voting activity for address {self.demo_address} with pagination (Skip={self.test_skip}, Limit={self.test_limit}). What candidates have they voted for? Show me their voting history."
            )

    async def demo_application_logs(self):
        """Demonstrate application log and state analysis capabilities"""
        self.print_section_header("8. Application Log Analysis with AI Agent")

        # Transaction log analysis
        if self.test_tx_hash:
            await self.run_agent_scenario(
                'logs',
                "Transaction Log Analysis",
                f"Analyze the application execution logs for transaction {self.test_tx_hash}. What smart contract operations occurred?"
            )

        # Block state analysis
        if self.test_block_hash:
            await self.run_agent_scenario(
                'logs',
                "Block State Analysis",
                f"Analyze the application state for block {self.test_block_hash} using pagination (Skip={self.test_skip}, Limit={self.test_limit}). What contract executions happened in this block?"
            )

        await self.run_agent_scenario(
            'logs',
            "Smart Contract Debugging",
            f"Help me understand how to use application logs to debug smart contract issues on Neo {self.network}."
        )

    async def run_comprehensive_demo(self):
        """Run the complete agent-based demonstration"""
        print("🚀 Neo Blockchain Toolkit - AI Agent Demonstration")
        print("=" * 80)
        print("This demo showcases Neo blockchain tools through specialized AI agents")
        print("Each agent is an expert in specific aspects of the Neo ecosystem")
        print("=" * 80)
        print(f" Network: {self.network}")
        print(f" Demo Address: {self.demo_address}")
        print(f" Demo Contract: {self.demo_contract}")
        print(f"  Test Data Available:")
        print(f"   - Addresses: {len(self.demo_addresses)}")
        print(f"   - Block Height: {self.test_block_height}")
        print(f"   - Transaction Hash: {'✅' if self.test_tx_hash else '❌'}")
        print(f"   - Active Candidates: {len(self.active_candidates)}")

        try:
            # Setup all specialized agents
            print("\n🔧 Setting up specialized agents...")
            self.setup_agents()
            print(f"✅ Created {len(self.agents)} specialized agents")

            # Run comprehensive demonstrations
            await self.demo_blockchain_exploration()
            await self.demo_address_analysis()
            await self.demo_asset_management()
            await self.demo_transaction_tracking()
            await self.demo_nep_tokens()
            await self.demo_smart_contracts()
            await self.demo_governance_monitoring()
            await self.demo_application_logs()

            # Final summary
            self.print_section_header("Demo Completed Successfully")
            for agent_name, agent in self.agents.items():
                tool_count = len(agent.available_tools.tools)
                print(f"    {agent.agent_name}: {tool_count} specialized tools")

            total_tools = sum(len(agent.available_tools.tools) for agent in self.agents.values())
            print(f"\n🔧 Total Tools Demonstrated: {total_tools} out of 58 Neo tools")
            print(" All demonstrations powered by AI agents with domain expertise")
            print(" Each agent provides intelligent analysis and insights")
            print("   1. Blockchain Exploration (Block analysis, network status)")
            print("   2. Address Analysis (Profile, transactions, NFT holdings, portfolio)")
            print("   3. Asset Management (Token discovery, portfolio analysis)")
            print("   4. Transaction Tracking (History, patterns, verification)")
            print("   5. NEP Token Analysis (NEP-17 & NEP-11 transfers)")
            print("   6. Smart Contract Analysis (Deployment, calls, verification, patterns)")
            print("   7. Governance Monitoring (Candidates, voting, committee)")
            print("   8. Application Logs (Execution logs, debugging)")

        except Exception as e:
            print(f"\n❌ Demo error: {str(e)}")
            print("Please check your environment setup and network connectivity")


async def main():
    """Main demonstration function"""
    print("\n Neo Blockchain Toolkit - AI Agent Demonstration")
    print("=" * 80)
    print("Showcasing comprehensive Neo blockchain analysis through specialized AI agents")
    print("Each agent is equipped with domain-specific tools and expertise")
    print("=" * 80)

    demo = NeoToolkitAgentDemo()
    await demo.run_comprehensive_demo()


if __name__ == "__main__":
    asyncio.run(main())
