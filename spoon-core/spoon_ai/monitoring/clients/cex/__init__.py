# spoon_ai/monitoring/clients/cex/__init__.py
from typing import Dict
from .base import CEXClient
from .binance import BinanceClient

# Register supported CEX providers
CEX_PROVIDERS = {
    "bn": BinanceClient,
    "binance": BinanceClient,
    # Add more providers...
}

def get_cex_client(provider: str) -> CEXClient:
    """
    Get appropriate CEX client based on provider name
    
    Args:
        provider: Provider code (e.g., 'bn' for Binance)
        
    Returns:
        CEXClient: Corresponding exchange client instance
    
    Raises:
        ValueError: If provider is not supported
    """
    provider_lower = provider.lower()
    if provider_lower in CEX_PROVIDERS:
        return CEX_PROVIDERS[provider_lower]()
    else:
        supported = ", ".join(CEX_PROVIDERS.keys())
        raise ValueError(f"Unsupported CEX provider: {provider}. Supported providers: {supported}")