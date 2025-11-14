# spoon_ai/monitoring/clients/base.py
import logging
from abc import ABC, abstractmethod
from typing import Dict, Any, List, Optional

logger = logging.getLogger(__name__)

class DataClient(ABC):
    """Base class for data clients"""
    
    @abstractmethod
    def get_ticker_price(self, symbol: str) -> Dict[str, Any]:
        """Get trading pair price"""
        pass
    
    @abstractmethod
    def get_ticker_24h(self, symbol: str) -> Dict[str, Any]:
        """Get 24-hour statistics"""
        pass
    
    @abstractmethod
    def get_klines(self, symbol: str, interval: str, limit: int = 500) -> List[Any]:
        """Get K-line data"""
        pass

    @classmethod
    def get_client(cls, market: str, provider: str):
        """Get appropriate client based on market and provider"""
        market = market.lower()
        provider = provider.lower()
        
        if market == "cex":
            if provider == "bn" or provider == "binance":
                from .cex.binance import BinanceClient
                return BinanceClient()
            # Add other CEX clients here
        
        elif market == "dex":
            if provider == "uni" or provider == "uniswap":
                from .dex.uniswap import UniswapClient
                return UniswapClient()
            elif provider == "ray" or provider == "raydium":
                from .dex.raydium import RaydiumClient
                return RaydiumClient()
            # Add other DEX clients here
        
        # If no matching client found
        valid_providers = []
        if market == "cex":
            valid_providers = ["bn (Binance)"]
        elif market == "dex":
            valid_providers = ["uni (Uniswap)", "ray (Raydium)"]
        
        raise ValueError(f"Unsupported provider: {provider} for market: {market}. " 
                        f"Available providers: {', '.join(valid_providers)}")