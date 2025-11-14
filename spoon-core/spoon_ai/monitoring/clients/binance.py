import logging
import requests
from typing import Dict, Any, List, Optional
from datetime import datetime

logger = logging.getLogger(__name__)

class BinanceClient:
    """Binance API client"""
    
    BASE_URL = "https://api.binance.com"
    
    def __init__(self, api_key: Optional[str] = None, api_secret: Optional[str] = None):
        self.api_key = api_key
        self.api_secret = api_secret
        self.session = requests.Session()
        
        if api_key:
            self.session.headers.update({"X-MBX-APIKEY": api_key})
    
    def get_ticker_price(self, symbol: str) -> Dict[str, Any]:
        """Get single trading pair price"""
        endpoint = f"{self.BASE_URL}/api/v3/ticker/price"
        params = {"symbol": symbol}
        
        try:
            response = self.session.get(endpoint, params=params)
            response.raise_for_status()
            return response.json()
        except Exception as e:
            logger.error(f"Failed to get ticker price for {symbol}: {str(e)}")
            raise
            
    def get_ticker_24h(self, symbol: str) -> Dict[str, Any]:
        """Get 24-hour price change statistics"""
        endpoint = f"{self.BASE_URL}/api/v3/ticker/24hr"
        params = {"symbol": symbol}
        
        try:
            response = self.session.get(endpoint, params=params)
            response.raise_for_status()
            return response.json()
        except Exception as e:
            logger.error(f"Failed to get 24h stats for {symbol}: {str(e)}")
            raise
    
    def get_klines(self, symbol: str, interval: str, limit: int = 500) -> List[List]:
        """Get K-line data"""
        endpoint = f"{self.BASE_URL}/api/v3/klines"
        params = {
            "symbol": symbol,
            "interval": interval,
            "limit": limit
        }
        
        try:
            response = self.session.get(endpoint, params=params)
            response.raise_for_status()
            return response.json()
        except Exception as e:
            logger.error(f"Failed to get klines for {symbol}: {str(e)}")
            raise
            
    def get_server_time(self) -> int:
        """Get server time"""
        endpoint = f"{self.BASE_URL}/api/v3/time"
        
        try:
            response = self.session.get(endpoint)
            response.raise_for_status()
            return response.json()["serverTime"]
        except Exception as e:
            logger.error(f"Failed to get server time: {str(e)}")
            raise