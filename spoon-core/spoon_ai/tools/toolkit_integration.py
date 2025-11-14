"""
Comprehensive Toolkit Integration Module

This module provides integration of all spoon-toolkit tools as core tools
for the spoon-core chat functionality, including crypto, security, data platforms,
storage, and social media tools.
"""

import logging
from typing import List, Optional, Dict, Any
from spoon_ai.tools.base import BaseTool
from spoon_ai.tools.tool_manager import ToolManager

logger = logging.getLogger(__name__)

def get_all_toolkit_tools() -> List[BaseTool]:
    """
    Import and return all available tools from spoon-toolkit.

    Returns:
        List[BaseTool]: List of instantiated tools from all modules
    """
    all_tools = []

    # Get tools from each module
    all_tools.extend(get_crypto_tools())
    all_tools.extend(get_security_tools())
    all_tools.extend(get_data_platform_tools())
    all_tools.extend(get_storage_tools())
    all_tools.extend(get_social_media_tools())

    logger.info(f"🔧 Loaded {len(all_tools)} total toolkit tools successfully")
    return all_tools

def get_crypto_tools() -> List[BaseTool]:
    """Import crypto tools from spoon-toolkit"""
    crypto_tools = []

    try:
        # Import crypto data tools
        from spoon_toolkits.crypto.crypto_data_tools import (
            GetTokenPriceTool,
            Get24hStatsTool,
            GetKlineDataTool,
            PriceThresholdAlertTool,
            LpRangeCheckTool,
            SuddenPriceIncreaseTool,
            LendingRateMonitorTool
        )

        # Import additional crypto tools
        from spoon_toolkits.crypto.crypto_data_tools.blockchain_monitor import CryptoMarketMonitor
        from spoon_toolkits.crypto.crypto_data_tools.predict_price import PredictPrice
        from spoon_toolkits.crypto.crypto_data_tools.token_holders import TokenHolders
        from spoon_toolkits.crypto.crypto_data_tools.trading_history import TradingHistory
        from spoon_toolkits.crypto.crypto_data_tools.uniswap_liquidity import UniswapLiquidity
        from spoon_toolkits.crypto.crypto_data_tools.wallet_analysis import WalletAnalysis

        # Import crypto_powerdata tools
        from spoon_toolkits.crypto.crypto_powerdata import (
            CryptoPowerDataCEXTool,
            CryptoPowerDataDEXTool,
            CryptoPowerDataIndicatorsTool,
            CryptoPowerDataPriceTool,
        )

        # Import EVM tools
        try:
            from spoon_toolkits.crypto.evm import (
                EvmTransferTool,
                EvmSwapTool,
                EvmBridgeTool,
                EvmErc20TransferTool,
                EvmBalanceTool,
                EvmSwapQuoteTool,
            )
        except Exception as e:
            logger.warning(f"EVM tools not available: {e}")

        tool_classes = [
            GetTokenPriceTool,
            Get24hStatsTool,
            GetKlineDataTool,
            PriceThresholdAlertTool,
            LpRangeCheckTool,
            SuddenPriceIncreaseTool,
            LendingRateMonitorTool,
            CryptoMarketMonitor,
            PredictPrice,
            TokenHolders,
            TradingHistory,
            UniswapLiquidity,
            WalletAnalysis,
            CryptoPowerDataCEXTool,
            CryptoPowerDataDEXTool,
            CryptoPowerDataIndicatorsTool,
            CryptoPowerDataPriceTool,
            # EVM tools (conditionally present)
            *[cls for cls in [
                'EvmTransferTool' in globals() and EvmTransferTool or None,
                'EvmSwapTool' in globals() and EvmSwapTool or None,
                'EvmBridgeTool' in globals() and EvmBridgeTool or None,
                'EvmErc20TransferTool' in globals() and EvmErc20TransferTool or None,
                'EvmBalanceTool' in globals() and EvmBalanceTool or None,
                'EvmSwapQuoteTool' in globals() and EvmSwapQuoteTool or None,
            ] if cls],
        ]

        for tool_class in tool_classes:
            try:
                tool_instance = tool_class()
                crypto_tools.append(tool_instance)
                logger.info(f"✅ Loaded crypto tool: {tool_instance.name}")
            except Exception as e:
                logger.warning(f"⚠️ Failed to load crypto tool {tool_class.__name__}: {e}")

    except ImportError as e:
        logger.error(f"❌ Failed to import crypto tools: {e}")
    except Exception as e:
        logger.error(f"❌ Unexpected error loading crypto tools: {e}")

    return crypto_tools

def get_security_tools() -> List[BaseTool]:
    """Import security tools from spoon-toolkit"""
    security_tools = []

    try:
        # Note: GoPlusLabs tools are primarily MCP-based
        # They would need to be adapted to BaseTool interface or used via MCP
        logger.info("Security tools (GoPlusLabs) are available via MCP integration")

    except ImportError as e:
        logger.error(f"❌ Failed to import security tools: {e}")
    except Exception as e:
        logger.error(f"❌ Unexpected error loading security tools: {e}")

    return security_tools

def get_data_platform_tools() -> List[BaseTool]:
    """Import data platform tools from spoon-toolkit"""
    data_tools = []

    try:
        # Import Chainbase tools
        from spoon_toolkits.data_platforms.chainbase.chainbase_tools import (
            GetLatestBlockNumberTool,
            GetBlockByNumberTool,
            GetTransactionByHashTool,
            GetAccountTransactionsTool,
            ContractCallTool,
            GetAccountTokensTool,
            GetAccountNFTsTool,
            GetAccountBalanceTool,
            GetTokenMetadataTool
        )

        # Import ThirdWeb tools
        from spoon_toolkits.data_platforms.third_web.third_web_tools import (
            GetContractEventsFromThirdwebInsight,
            GetMultichainTransfersFromThirdwebInsight,
            GetTransactionsTool,
            GetContractTransactionsTool,
            GetContractTransactionsBySignatureTool,
            GetBlocksFromThirdwebInsight,
            GetWalletTransactionsFromThirdwebInsight
        )

        tool_classes = [
            # Chainbase tools
            GetLatestBlockNumberTool,
            GetBlockByNumberTool,
            GetTransactionByHashTool,
            GetAccountTransactionsTool,
            ContractCallTool,
            GetAccountTokensTool,
            GetAccountNFTsTool,
            GetAccountBalanceTool,
            GetTokenMetadataTool,
            # ThirdWeb tools
            GetContractEventsFromThirdwebInsight,
            GetMultichainTransfersFromThirdwebInsight,
            GetTransactionsTool,
            GetContractTransactionsTool,
            GetContractTransactionsBySignatureTool,
            GetBlocksFromThirdwebInsight,
            GetWalletTransactionsFromThirdwebInsight,
        ]

        for tool_class in tool_classes:
            try:
                tool_instance = tool_class()
                data_tools.append(tool_instance)
                logger.info(f"✅ Loaded data platform tool: {tool_instance.name}")
            except Exception as e:
                logger.warning(f"⚠️ Failed to load data platform tool {tool_class.__name__}: {e}")

    except ImportError as e:
        logger.error(f"❌ Failed to import data platform tools: {e}")
    except Exception as e:
        logger.error(f"❌ Unexpected error loading data platform tools: {e}")

    return data_tools

def get_storage_tools() -> List[BaseTool]:
    """Import storage tools from spoon-toolkit"""
    storage_tools = []

    try:
        # Import storage tools (these may require specific dependencies)
        try:
            from spoon_toolkits.storage.aioz.aioz_tools import AiozStorageTool
        except ImportError:
            logger.warning("AiozStorageTool not available - missing dependencies")
            AiozStorageTool = None

        try:
            from spoon_toolkits.storage.foureverland.foureverland_tools import FoureverLandStorageTool
        except ImportError:
            logger.warning("FoureverLandStorageTool not available - missing dependencies")
            FoureverLandStorageTool = None

        try:
            from spoon_toolkits.storage.oort.oort_tools import OortStorageTool
        except ImportError:
            logger.warning("OortStorageTool not available - missing dependencies")
            OortStorageTool = None

        tool_classes = [
            cls for cls in [AiozStorageTool, FoureverLandStorageTool, OortStorageTool]
            if cls is not None
        ]

        for tool_class in tool_classes:
            try:
                tool_instance = tool_class()
                storage_tools.append(tool_instance)
                logger.info(f"✅ Loaded storage tool: {tool_instance.name}")
            except Exception as e:
                logger.warning(f"⚠️ Failed to load storage tool {tool_class.__name__}: {e}")

    except ImportError as e:
        logger.error(f"❌ Failed to import storage tools: {e}")
    except Exception as e:
        logger.error(f"❌ Unexpected error loading storage tools: {e}")

    return storage_tools

def get_social_media_tools() -> List[BaseTool]:
    """Import social media tools from spoon-toolkit"""
    social_tools = []

    try:
        # Import social media tools (these may require specific dependencies)
        try:
            from spoon_toolkits.social_media.discord_tool import DiscordTool
        except ImportError:
            logger.warning("DiscordTool not available - missing dependencies")
            DiscordTool = None

        try:
            from spoon_toolkits.social_media.email_tool import EmailTool
        except ImportError:
            logger.warning("EmailTool not available - missing dependencies")
            EmailTool = None

        try:
            from spoon_toolkits.social_media.telegram_tool import TelegramTool
        except ImportError:
            logger.warning("TelegramTool not available - missing dependencies")
            TelegramTool = None

        try:
            from spoon_toolkits.social_media.twitter_tool import TwitterTool
        except ImportError:
            logger.warning("TwitterTool not available - missing dependencies")
            TwitterTool = None

        tool_classes = [
            cls for cls in [DiscordTool, EmailTool, TelegramTool, TwitterTool]
            if cls is not None
        ]

        for tool_class in tool_classes:
            try:
                tool_instance = tool_class()
                social_tools.append(tool_instance)
                logger.info(f"✅ Loaded social media tool: {tool_instance.name}")
            except Exception as e:
                logger.warning(f"⚠️ Failed to load social media tool {tool_class.__name__}: {e}")

    except ImportError as e:
        logger.error(f"❌ Failed to import social media tools: {e}")
    except Exception as e:
        logger.error(f"❌ Unexpected error loading social media tools: {e}")

    return social_tools

def create_comprehensive_tool_manager() -> ToolManager:
    """
    Create a ToolManager instance with all toolkit tools loaded.

    Returns:
        ToolManager: Tool manager with all toolkit tools
    """
    all_tools = get_all_toolkit_tools()
    return ToolManager(all_tools)

def add_all_toolkit_tools_to_manager(tool_manager: ToolManager) -> ToolManager:
    """
    Add all toolkit tools to an existing ToolManager instance.

    Args:
        tool_manager (ToolManager): Existing tool manager

    Returns:
        ToolManager: Updated tool manager with all toolkit tools
    """
    all_tools = get_all_toolkit_tools()
    tool_manager.add_tools(*all_tools)
    return tool_manager

class ToolkitConfig:
    """Configuration class for comprehensive toolkit integration"""

    # Available tool categories
    TOOL_CATEGORIES = {
        "crypto": [
            "get_token_price", "get_24h_stats", "get_kline_data",
            "price_threshold_alert", "lp_range_check", "monitor_sudden_price_increase",
            "lending_rate_monitor", "crypto_market_monitor", "predict_price",
            "token_holders", "trading_history", "uniswap_liquidity", "wallet_analysis",
            "crypto_powerdata_cex", "crypto_powerdata_dex",
            "crypto_powerdata_indicators", "crypto_powerdata_price",
            # EVM toolkit tools
            "evm_transfer", "evm_swap", "evm_bridge", "evm_erc20_transfer", "evm_get_balance", "evm_swap_quote",
        ],
        "data_platforms": [
            "get_latest_block_number", "get_block_by_number", "get_transaction_by_hash",
            "get_account_transactions", "contract_call", "get_account_tokens",
            "get_account_nfts", "get_account_balance", "get_token_metadata",
            "get_contract_events", "get_multichain_transfers", "get_transactions",
            "get_contract_transactions", "get_blocks", "get_wallet_transactions"
        ],
        "storage": [
            "aioz_storage", "foureverland_storage", "oort_storage"
        ],
        "social_media": [
            "discord_tool", "email_tool", "telegram_tool", "twitter_tool"
        ],
        "security": [
            # GoPlusLabs tools available via MCP
            "token_security", "malicious_address", "nft_security",
            "dapp_security", "phishing_site", "rug_pull_detection"
        ]
    }

    # Tools that require API keys or special configuration
    TOOLS_REQUIRING_CONFIG = [
        # Crypto tools
        "lending_rate_monitor", "predict_price", "token_holders",
        "trading_history", "wallet_analysis", "crypto_powerdata_dex",
        # Data platform tools
        "chainbase_tools", "thirdweb_tools",
        # Storage tools
        "aioz_storage", "foureverland_storage", "oort_storage",
        # Social media tools
        "discord_tool", "email_tool", "telegram_tool", "twitter_tool",
        # Security tools (via MCP)
        "goplus_security_tools"
    ]

    @classmethod
    def get_tools_by_category(cls, category: str) -> List[str]:
        """Get list of tools in a specific category"""
        return cls.TOOL_CATEGORIES.get(category, [])

    @classmethod
    def get_all_categories(cls) -> List[str]:
        """Get list of all available tool categories"""
        return list(cls.TOOL_CATEGORIES.keys())

    @classmethod
    def get_tools_requiring_config(cls) -> List[str]:
        """Get list of tools that require additional configuration"""
        return cls.TOOLS_REQUIRING_CONFIG.copy()