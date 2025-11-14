# spoon_ai/monitoring/clients/dex/uniswap.py
import logging
from typing import Dict, Any, List, Optional
import time
import asyncio

from .base import DEXClient
try:
    from spoon_toolkits.crypto.price_data import UniswapPriceProvider
except ImportError:
    from spoon_ai.tools.crypto.price_data import UniswapPriceProvider
import nest_asyncio

# Apply nest_asyncio to allow nested event loops
nest_asyncio.apply()
logger = logging.getLogger(__name__)


class UniswapClient(DEXClient):
    """Uniswap API client"""
    
    def __init__(self, rpc_url: Optional[str] = None):
        self.rpc_url = rpc_url or "https://eth-mainnet.g.alchemy.com/v2/demo"
        self.provider = UniswapPriceProvider(rpc_url=self.rpc_url)
    
    def get_ticker_price(self, symbol: str) -> Dict[str, Any]:
        """Get trading pair price"""
        logger.info(f"Getting Uniswap price for: {symbol}")
        
        # Fix: Create a new event loop for synchronous context
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        result = loop.run_until_complete(self.provider.get_ticker_price(symbol))
        loop.close()
        return result
            
    def get_ticker_24h(self, symbol: str) -> Dict[str, Any]:
        """Get 24-hour price change statistics"""
        logger.info(f"Getting Uniswap 24h data for: {symbol}")
        
        # Fix: Create a new event loop for synchronous context
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        result = loop.run_until_complete(self.provider.get_ticker_24h(symbol))
        loop.close()
        return result
    
    def get_klines(self, symbol: str, interval: str, limit: int = 500) -> List[List]:
        """Get K-line data"""
        logger.info(f"Getting Uniswap K-line data: {symbol}, interval: {interval}, limit: {limit}")
        
        # Fix: Create a new event loop for synchronous context
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        result = loop.run_until_complete(self.provider.get_klines(symbol, interval, limit))
        loop.close()
        return result