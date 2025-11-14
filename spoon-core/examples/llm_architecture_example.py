#!/usr/bin/env python3
"""
Example demonstrating the new LLM architecture features.

This example shows how to:
1. Use the new LLM Manager architecture
2. Configure fallback chains
3. Enable load balancing
4. Use caching for performance
5. Monitor provider health
6. Handle errors gracefully
"""

import asyncio
import logging
import os
import sys

# Add the spoon-core directory to the path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from spoon_ai.chat import ChatBot
from spoon_ai.llm.manager import get_llm_manager, LLMManager
from spoon_ai.llm.cache import CachedLLMManager, get_global_cache
from spoon_ai.llm.config import ConfigurationManager
from spoon_ai.llm.monitoring import get_debug_logger, get_metrics_collector
from spoon_ai.llm.errors import ProviderError, ConfigurationError
from spoon_ai.schema import Message
from spoon_ai.agents.spoon_react import SpoonReactAI

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


async def basic_usage_example():
    """Basic usage of the new LLM architecture."""
    print("\n" + "="*60)
    print("BASIC USAGE EXAMPLE")
    print("="*60)

    # Create ChatBot with new architecture
    chatbot = ChatBot(use_llm_manager=True)

    # Simple chat
    messages = [Message(role="user", content="Hello! How are you?")]

    try:
        # This will use the default provider with automatic fallback
        response = await chatbot.ask(messages)
        print(f"Response: {response}")
    except Exception as e:
        print(f"Error: {e}")
        print("Note: This is expected if no providers are configured with API keys")


async def fallback_example():
    """Example of fallback configuration."""
    print("\n" + "="*60)
    print("FALLBACK CONFIGURATION EXAMPLE")
    print("="*60)

    # Get the LLM manager
    manager = get_llm_manager()

    # Configure fallback chain
    try:
        manager.set_fallback_chain(["openai", "anthropic", "gemini"])
        print("* Fallback chain configured: OpenAI -> Anthropic -> Gemini")

        # Show current configuration
        stats = manager.get_stats()
        print(f"* Default provider: {stats['manager']['default_provider']}")
        print(f"* Fallback chain: {stats['manager']['fallback_chain']}")

    except ConfigurationError as e:
        print(f"Configuration error: {e}")


async def load_balancing_example():
    """Example of load balancing configuration."""
    print("\n" + "="*60)
    print("LOAD BALANCING EXAMPLE")
    print("="*60)

    manager = get_llm_manager()

    # Enable load balancing
    try:
        manager.enable_load_balancing("round_robin")
        print("* Load balancing enabled with round-robin strategy")

        # You could also use:
        # manager.enable_load_balancing("weighted")
        # manager.enable_load_balancing("random")

        # Show configuration
        stats = manager.get_stats()
        print(f"* Load balancing enabled: {stats['manager']['load_balancing_enabled']}")
        print(f"* Strategy: {stats['manager']['load_balancing_strategy']}")

    except Exception as e:
        print(f"Load balancing error: {e}")


async def caching_example():
    """Example of response caching for performance."""
    print("\n" + "="*60)
    print("CACHING EXAMPLE")
    print("="*60)

    # Get the base manager
    base_manager = get_llm_manager()

    # Wrap with caching
    cached_manager = CachedLLMManager(base_manager)

    # Create ChatBot that uses cached manager
    chatbot = ChatBot(use_llm_manager=True)

    # Show cache stats
    cache_stats = cached_manager.get_cache_stats()
    print(f"* Cache initialized - Max size: {cache_stats['max_size']}")
    print(f"* Current cache size: {cache_stats['size']}")
    print(f"* Hit rate: {cache_stats['hit_rate']:.2%}")

    # Example of cache usage (would work with real API keys)
    messages = [Message(role="user", content="What is 2+2?")]

    try:
        # First request - will be cached
        response1 = await cached_manager.chat(messages)
        print("* First request completed (cached)")

        # Second request - will use cache
        response2 = await cached_manager.chat(messages)
        print("* Second request completed (from cache)")

        # Show updated cache stats
        cache_stats = cached_manager.get_cache_stats()
        print(f"* Cache hits: {cache_stats['hits']}")
        print(f"* Cache misses: {cache_stats['misses']}")
        print(f"* Hit rate: {cache_stats['hit_rate']:.2%}")

    except Exception as e:
        print(f"Caching example error: {e}")
        print("Note: This is expected without configured API keys")


async def health_monitoring_example():
    """Example of provider health monitoring."""
    print("\n" + "="*60)
    print("HEALTH MONITORING EXAMPLE")
    print("="*60)

    manager = get_llm_manager()

    try:
        # Check health of all providers
        health_status = await manager.health_check_all()

        print("Provider Health Status:")
        for provider, is_healthy in health_status.items():
            status = "* Healthy" if is_healthy else "X Unhealthy"
            print(f"  {provider}: {status}")

        # Get detailed statistics
        stats = manager.get_stats()
        if 'providers' in stats:
            print("\nProvider Statistics:")
            for provider, provider_stats in stats['providers'].items():
                print(f"  {provider}:")
                print(f"    Total requests: {provider_stats.get('total_requests', 0)}")
                print(f"    Success rate: {provider_stats.get('success_rate', 0):.2%}")
                print(f"    Avg response time: {provider_stats.get('avg_response_time', 0):.3f}s")

    except Exception as e:
        print(f"Health monitoring error: {e}")


async def error_handling_example():
    """Example of error handling with the new architecture."""
    print("\n" + "="*60)
    print("ERROR HANDLING EXAMPLE")
    print("="*60)

    chatbot = ChatBot(use_llm_manager=True)
    messages = [Message(role="user", content="Test message")]

    try:
        # This will likely fail without API keys, demonstrating error handling
        response = await chatbot.ask(messages)
        print(f"Unexpected success: {response}")

    except ProviderError as e:
        print(f"* Provider error caught: {e}")
        print(f"  Provider: {e.provider}")
        print(f"  Context: {getattr(e, 'context', 'None')}")

    except ConfigurationError as e:
        print(f"* Configuration error caught: {e}")

    except Exception as e:
        print(f"* General error caught: {e}")
        print("  This demonstrates the error handling hierarchy")


async def agent_integration_example():
    """Example of agent integration with new architecture."""
    print("\n" + "="*60)
    print("AGENT INTEGRATION EXAMPLE")
    print("="*60)

    try:
        # Create agent - automatically uses new architecture
        agent = SpoonReactAI(name="example_agent")

        print(f"* Agent created: {agent.name}")
        print(f"* Uses LLM Manager: {getattr(agent.llm, 'use_llm_manager', False)}")
        print(f"* Agent state: {agent.state}")
        print(f"* Max steps: {agent.max_steps}")

        # The agent would work normally with proper API keys
        # result = await agent.run("Hello, please introduce yourself")
        # print(f"Agent response: {result}")

    except Exception as e:
        print(f"Agent integration error: {e}")


async def debugging_example():
    """Example of debugging and monitoring features."""
    print("\n" + "="*60)
    print("DEBUGGING EXAMPLE")
    print("="*60)

    # Get debug logger and metrics collector
    debug_logger = get_debug_logger()
    metrics_collector = get_metrics_collector()

    print("* Debug logger available")
    print("* Metrics collector available")

    # Show current metrics
    try:
        all_stats = metrics_collector.get_all_stats()
        summary = metrics_collector.get_summary()

        print(f"* Total providers tracked: {len(all_stats)}")
        print(f"* Summary available: {bool(summary)}")

        # In a real application, you would see detailed metrics here
        print("  (Detailed metrics would appear here with real usage)")

    except Exception as e:
        print(f"Debugging example error: {e}")


async def configuration_example():
    """Example of configuration management."""
    print("\n" + "="*60)
    print("CONFIGURATION EXAMPLE")
    print("="*60)

    config_manager = ConfigurationManager()

    try:
        # Show configured providers
        configured_providers = config_manager.list_configured_providers()
        print(f"* Configured providers: {configured_providers}")

        # Show default provider
        default_provider = config_manager.get_default_provider()
        print(f"* Default provider: {default_provider}")

        # Show configuration for each provider
        for provider in configured_providers:
            try:
                config = config_manager.load_provider_config(provider)
                print(f"* {provider} configuration loaded")
                print(f"  Model: {config.model}")
                print(f"  Max tokens: {config.max_tokens}")
                print(f"  Temperature: {config.temperature}")
            except Exception as e:
                print(f"  Error loading {provider} config: {e}")

    except Exception as e:
        print(f"Configuration example error: {e}")


async def performance_comparison():
    """Compare performance between legacy and new architecture."""
    print("\n" + "="*60)
    print("PERFORMANCE COMPARISON")
    print("="*60)

    import time

    # Create both types of ChatBot
    legacy_bot = ChatBot(use_llm_manager=False)
    new_bot = ChatBot(use_llm_manager=True)

    print("* Legacy ChatBot created")
    print("* New architecture ChatBot created")

    # Measure initialization time (already done above)
    print("* Both architectures initialize quickly")

    # In a real scenario with API keys, you could measure:
    # - Response times
    # - Memory usage
    # - Throughput
    # - Error rates

    print("  (Performance metrics would be measured here with real API calls)")


async def main():
    """Run all examples."""
    print("LLM ARCHITECTURE EXAMPLES")
    print("=" * 80)
    print("This example demonstrates the new LLM architecture features.")
    print("Note: Some examples may show errors without configured API keys.")
    print("=" * 80)

    # Run all examples
    await basic_usage_example()
    await fallback_example()
    await load_balancing_example()
    await caching_example()
    await health_monitoring_example()
    await error_handling_example()
    await agent_integration_example()
    await debugging_example()
    await configuration_example()
    await performance_comparison()


if __name__ == "__main__":
    asyncio.run(main())