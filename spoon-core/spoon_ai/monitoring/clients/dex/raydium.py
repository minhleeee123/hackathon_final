import logging
from typing import Dict, Any, List, Optional
import asyncio
import time

try:
    from spoon_toolkits.crypto.price_data import RaydiumPriceProvider
except ImportError:
    from spoon_ai.tools.crypto.price_data import RaydiumPriceProvider
from .base import DEXClient

logger = logging.getLogger(__name__)

class RaydiumClient(DEXClient):
    """Raydium (Solana) DEX client with V3 API support"""
    
    def __init__(self, rpc_url: Optional[str] = None):
        """Initialize Raydium client with optional RPC URL"""
        self.provider = RaydiumPriceProvider(rpc_url)

    def get_tvl_and_volume(self):
        return self.provider.get_tvl_and_volume()
    
    def get_mint_prices(self, mint_ids):
        return self.provider.get_mint_prices(mint_ids)
    
    def get_mint_info(self, mint_ids):
        return self.provider.get_mint_info(mint_ids)
    
    def get_pools_list(self, **kwargs):
        return self.provider.get_pools_list(**kwargs)
    
    def get_pool_info_by_ids(self, pool_ids):
        return self.provider.get_pool_info_by_ids(pool_ids)
    
    def get_pool_info_by_lp_mints(self, lp_mints):
        return self.provider.get_pool_info_by_lp_mints(lp_mints)
    
    def get_pool_liquidity_history(self, pool_id):
        return self.provider.get_pool_liquidity_history(pool_id)
    
    def get_ticker_price(self, symbol):
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        try:
            result = loop.run_until_complete(self.provider.get_ticker_price(symbol))
            return result
        finally:
            loop.close()
    
    def get_ticker_24h(self, symbol):
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        try:
            result = loop.run_until_complete(self.provider.get_ticker_24h(symbol))
            return result
        finally:
            loop.close()
    
    def get_klines(self, symbol, interval, limit=500):
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        try:
            result = loop.run_until_complete(self.provider.get_klines(symbol, interval, limit))
            return result
        finally:
            loop.close()