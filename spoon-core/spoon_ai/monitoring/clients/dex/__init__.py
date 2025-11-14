# spoon_ai/monitoring/clients/dex/__init__.py
from typing import Dict
from .base import DEXClient
from .uniswap import UniswapClient

# Register supported DEX providers
DEX_PROVIDERS = {
    "uni": UniswapClient,
    "uniswap": UniswapClient,
    # Add more providers...
}

def get_dex_client(provider: str) -> DEXClient:
    """
    Get appropriate DEX client based on provider name
    
    Args:
        provider: Provider code (e.g., 'uni' for Uniswap)
        
    Returns:
        DEXClient: Corresponding exchange client instance
    
    Raises:
        ValueError: If provider is not supported
    """
    provider_lower = provider.lower()
    if provider_lower in DEX_PROVIDERS:
        return DEX_PROVIDERS[provider_lower]()
    else:
        supported = ", ".join(DEX_PROVIDERS.keys())
        raise ValueError(f"Unsupported DEX provider: {provider}. Supported providers: {supported}")