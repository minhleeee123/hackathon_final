"""
Example demonstrating the new LLMManager with provider fallback and load balancing.
"""

import asyncio
from spoon_ai.schema import Message
from spoon_ai.llm import (
    get_llm_manager,
    LLMManager,
    ConfigurationManager,
    get_debug_logger,
    get_metrics_collector
)


async def basic_chat_example():
    """Basic chat example using LLMManager."""
    print("=== Basic Chat Example ===")
    
    # Get the global LLM manager
    manager = get_llm_manager()
    
    # Create a simple chat message
    messages = [
        Message(role="user", content="Hello! Can you tell me about Python?")
    ]
    
    try:
        # Send chat request (will use default provider with fallback)
        response = await manager.chat(messages)
        
        print(f"Provider: {response.provider}")
        print(f"Model: {response.model}")
        print(f"Response: {response.content}")
        print(f"Duration: {response.duration:.3f}s")
        print(f"Finish reason: {response.finish_reason}")
        
    except Exception as e:
        print(f"Error: {e}")


async def fallback_example():
    """Example demonstrating provider fallback."""
    print("\n=== Fallback Example ===")
    
    manager = get_llm_manager()
    
    # Set a fallback chain
    manager.set_fallback_chain(["openai", "anthropic", "gemini"])
    
    messages = [
        Message(role="user", content="What is machine learning?")
    ]
    
    try:
        response = await manager.chat(messages)
        print(f"Successfully used provider: {response.provider}")
        print(f"Response: {response.content[:100]}...")
        
    except Exception as e:
        print(f"All providers failed: {e}")


async def load_balancing_example():
    """Example demonstrating load balancing."""
    print("\n=== Load Balancing Example ===")
    
    manager = get_llm_manager()
    
    # Enable load balancing
    manager.enable_load_balancing("round_robin")
    
    messages = [
        Message(role="user", content="Explain quantum computing briefly.")
    ]
    
    # Send multiple requests to see load balancing in action
    for i in range(3):
        try:
            response = await manager.chat(messages)
            print(f"Request {i+1} - Provider: {response.provider}")
        except Exception as e:
            print(f"Request {i+1} failed: {e}")


async def tools_example():
    """Example demonstrating tool usage."""
    print("\n=== Tools Example ===")
    
    manager = get_llm_manager()
    
    # Define a simple tool
    tools = [
        {
            "type": "function",
            "function": {
                "name": "get_weather",
                "description": "Get current weather for a location",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "location": {
                            "type": "string",
                            "description": "The city and state, e.g. San Francisco, CA"
                        }
                    },
                    "required": ["location"]
                }
            }
        }
    ]
    
    messages = [
        Message(role="user", content="What's the weather like in New York?")
    ]
    
    try:
        response = await manager.chat_with_tools(messages, tools)
        print(f"Provider: {response.provider}")
        print(f"Tool calls: {len(response.tool_calls)}")
        if response.tool_calls:
            for tool_call in response.tool_calls:
                print(f"  - {tool_call.function.name}: {tool_call.function.arguments}")
        print(f"Response: {response.content}")
        
    except Exception as e:
        print(f"Tools request failed: {e}")


async def streaming_example():
    """Example demonstrating streaming responses."""
    print("\n=== Streaming Example ===")
    
    manager = get_llm_manager()
    
    messages = [
        Message(role="user", content="Write a short poem about AI.")
    ]
    
    try:
        print("Streaming response:")
        async for chunk in manager.chat_stream(messages):
            print(chunk, end="", flush=True)
        print("\n")
        
    except Exception as e:
        print(f"Streaming failed: {e}")


async def health_check_example():
    """Example demonstrating health checks."""
    print("\n=== Health Check Example ===")
    
    manager = get_llm_manager()
    
    # Check health of all providers
    health_status = await manager.health_check_all()
    
    print("Provider health status:")
    for provider, is_healthy in health_status.items():
        status = "✓ Healthy" if is_healthy else "✗ Unhealthy"
        print(f"  {provider}: {status}")


async def metrics_example():
    """Example demonstrating metrics collection."""
    print("\n=== Metrics Example ===")
    
    manager = get_llm_manager()
    
    # Get comprehensive stats
    stats = manager.get_stats()
    
    print("Manager Configuration:")
    print(f"  Default provider: {stats['manager']['default_provider']}")
    print(f"  Fallback chain: {stats['manager']['fallback_chain']}")
    print(f"  Load balancing: {stats['manager']['load_balancing_enabled']}")
    
    print("\nOverall Summary:")
    summary = stats['summary']
    print(f"  Total requests: {summary['total_requests']}")
    print(f"  Success rate: {summary['overall_success_rate']:.2%}")
    print(f"  Total tokens: {summary['total_tokens']}")
    print(f"  Total cost: ${summary['total_cost']:.4f}")
    
    print("\nProvider Statistics:")
    for provider_name, provider_stats in stats['providers'].items():
        print(f"  {provider_name}:")
        print(f"    Requests: {provider_stats.total_requests}")
        print(f"    Success rate: {(1 - provider_stats.error_rate):.2%}")
        print(f"    Avg duration: {provider_stats.average_duration:.3f}s")


async def debug_logging_example():
    """Example demonstrating debug logging."""
    print("\n=== Debug Logging Example ===")
    
    # Get debug logger
    debug_logger = get_debug_logger()
    
    # Get recent request history
    history = debug_logger.get_request_history(limit=5)
    
    print(f"Recent requests ({len(history)}):")
    for request in history:
        status = "✓" if request.success else "✗"
        print(f"  {status} {request.provider}.{request.method} - {request.duration:.3f}s")
        if not request.success and request.error:
            print(f"    Error: {request.error}")


async def main():
    """Run all examples."""
    print("LLM Manager Examples")
    print("=" * 50)
    
    try:
        await basic_chat_example()
        await fallback_example()
        await load_balancing_example()
        await tools_example()
        await streaming_example()
        await health_check_example()
        await metrics_example()
        await debug_logging_example()
        
    except Exception as e:
        print(f"Example failed: {e}")
    
    finally:
        # Cleanup
        manager = get_llm_manager()
        await manager.cleanup()
        print("\n=== Cleanup completed ===")


if __name__ == "__main__":
    asyncio.run(main())