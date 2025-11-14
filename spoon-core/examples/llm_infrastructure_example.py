#!/usr/bin/env python3
"""
Example demonstrating the new unified LLM infrastructure.

This example shows how to:
1. Register custom providers
2. Use the configuration manager
3. Monitor requests and collect metrics
4. Handle errors gracefully
5. Use the provider registry
"""

import asyncio
import sys
import os

# Add the spoon-core directory to the path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from spoon_ai.llm import (
    LLMProviderInterface,
    ProviderCapability,
    ProviderMetadata,
    LLMResponse,
    register_provider,
    get_global_registry,
    ConfigurationManager,
    get_debug_logger,
    get_metrics_collector,
    ProviderError
)
from spoon_ai.schema import Message


@register_provider("example", [ProviderCapability.CHAT, ProviderCapability.COMPLETION])
class ExampleProvider(LLMProviderInterface):
    """Example provider implementation using the decorator for registration."""
    
    def __init__(self):
        self.config = None
        self.initialized = False
        self.request_count = 0
    
    async def initialize(self, config):
        """Initialize with configuration."""
        self.config = config
        self.initialized = True
        print(f"ExampleProvider initialized with model: {config.get('model', 'default')}")
    
    async def chat(self, messages, **kwargs):
        """Simulate chat functionality."""
        if not self.initialized:
            raise ProviderError("example", "Provider not initialized")
        
        self.request_count += 1
        
        # Simulate processing time
        await asyncio.sleep(0.1)
        
        # Create response based on last message
        last_message = messages[-1] if messages else Message(role="user", content="")
        response_content = f"Example response to: {last_message.content}"
        
        return LLMResponse(
            content=response_content,
            provider="example",
            model=self.config.get('model', 'example-model'),
            finish_reason="stop",
            native_finish_reason="stop",
            usage={
                "prompt_tokens": len(last_message.content) // 4,
                "completion_tokens": len(response_content) // 4,
                "total_tokens": (len(last_message.content) + len(response_content)) // 4
            },
            metadata={"request_count": self.request_count}
        )
    
    async def chat_stream(self, messages, **kwargs):
        """Simulate streaming chat."""
        if not self.initialized:
            raise ProviderError("example", "Provider not initialized")
        
        response_parts = ["This ", "is ", "a ", "streaming ", "response."]
        for part in response_parts:
            await asyncio.sleep(0.05)  # Simulate streaming delay
            yield part
    
    async def completion(self, prompt, **kwargs):
        """Simulate completion functionality."""
        if not self.initialized:
            raise ProviderError("example", "Provider not initialized")
        
        await asyncio.sleep(0.1)
        
        return LLMResponse(
            content=f"Completed: {prompt}",
            provider="example",
            model=self.config.get('model', 'example-model'),
            finish_reason="stop",
            native_finish_reason="stop"
        )
    
    async def chat_with_tools(self, messages, tools, **kwargs):
        """Simulate tool-enabled chat."""
        if not self.initialized:
            raise ProviderError("example", "Provider not initialized")
        
        return LLMResponse(
            content="I would use tools here if this were a real provider",
            provider="example",
            model=self.config.get('model', 'example-model'),
            finish_reason="stop",
            native_finish_reason="stop",
            tool_calls=[]
        )
    
    def get_metadata(self):
        """Return provider metadata."""
        return ProviderMetadata(
            name="example",
            version="1.0.0",
            capabilities=[ProviderCapability.CHAT, ProviderCapability.COMPLETION, ProviderCapability.STREAMING],
            max_tokens=4096,
            supports_system_messages=True,
            rate_limits={"requests_per_minute": 100}
        )
    
    async def health_check(self):
        """Check if provider is healthy."""
        return self.initialized
    
    async def cleanup(self):
        """Cleanup resources."""
        self.initialized = False
        print("ExampleProvider cleaned up")


async def demonstrate_infrastructure():
    """Demonstrate the LLM infrastructure capabilities."""
    print("LLM Infrastructure Demonstration")
    print("=" * 50)
    
    # 1. Get the global registry (provider was auto-registered via decorator)
    registry = get_global_registry()
    print(f"Available providers: {registry.list_providers()}")
    
    # 2. Create and configure a provider
    config = {
        "api_key": "demo-key",
        "model": "example-model-v1",
        "max_tokens": 2048,
        "temperature": 0.7
    }
    
    provider = registry.get_provider("example", config)
    await provider.initialize(config)
    
    # 3. Get monitoring instances
    debug_logger = get_debug_logger()
    metrics_collector = get_metrics_collector()
    
    # 4. Demonstrate chat functionality with monitoring
    print("\n1. Chat Example with Monitoring")
    messages = [
        Message(role="system", content="You are a helpful assistant."),
        Message(role="user", content="What is the capital of France?")
    ]
    
    # Log the request
    request_id = debug_logger.log_request("example", "chat", {"messages": len(messages)})
    
    try:
        start_time = asyncio.get_event_loop().time()
        response = await provider.chat(messages)
        duration = asyncio.get_event_loop().time() - start_time
        
        # Log successful response
        debug_logger.log_response(request_id, response, duration)
        
        # Record metrics
        metrics_collector.record_request(
            provider="example",
            method="chat", 
            duration=duration,
            success=True,
            tokens=response.usage.get("total_tokens", 0) if response.usage else 0,
            model=response.model
        )
        
        print(f"Response: {response.content}")
        print(f"Duration: {duration:.3f}s")
        print(f"Tokens used: {response.usage}")
        
    except Exception as e:
        debug_logger.log_error(request_id, e, {"messages": len(messages)})
        metrics_collector.record_request("example", "chat", 0, False, error=str(e))
        print(f"Error: {e}")
    
    # 5. Demonstrate streaming
    print("\n2. Streaming Example")
    print("Streaming response: ", end="")
    async for chunk in provider.chat_stream(messages):
        print(chunk, end="", flush=True)
    print()
    
    # 6. Demonstrate completion
    print("\n3. Completion Example")
    completion_response = await provider.completion("The weather today is")
    print(f"Completion: {completion_response.content}")
    
    # 7. Show metrics
    print("\n4. Metrics Summary")
    stats = metrics_collector.get_provider_stats("example")
    if stats:
        print(f"Total requests: {stats.total_requests}")
        print(f"Success rate: {(stats.successful_requests / stats.total_requests * 100):.1f}%")
        print(f"Average duration: {stats.average_duration:.3f}s")
        print(f"Total tokens: {stats.total_tokens}")
    
    # 8. Show request history
    print("\n5. Request History")
    history = debug_logger.get_request_history(provider="example", limit=3)
    for req in history:
        status = "✓" if req.success else "✗"
        print(f"{status} {req.method} - {req.duration:.3f}s - {req.total_tokens} tokens")
    
    # 9. Demonstrate error handling
    print("\n6. Error Handling Example")
    try:
        # Try to use a non-existent provider
        bad_provider = registry.get_provider("nonexistent")
    except Exception as e:
        print(f"Expected error: {e}")
    
    # 10. Health check
    print("\n7. Health Check")
    health = await provider.health_check()
    print(f"Provider health: {'Healthy' if health else 'Unhealthy'}")
    
    # 11. Cleanup
    await provider.cleanup()
    
    print("\n" + "=" * 50)
    print("Demonstration completed!")


if __name__ == "__main__":
    asyncio.run(demonstrate_infrastructure())