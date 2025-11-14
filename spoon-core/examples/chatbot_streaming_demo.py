"""ChatBot Streaming Demo"""

import asyncio
from textwrap import shorten
from typing import Dict, List, Optional
from spoon_ai.callbacks import BaseCallbackHandler, LLMManagerMixin, StreamingStatisticsCallback
from spoon_ai.callbacks.streaming_stdout import StreamingStdOutCallbackHandler
from spoon_ai.chat import ChatBot
from spoon_ai.schema import LLMResponse, LLMResponseChunk


# Example 1: Basic async streaming with stdout
async def basic_async_streaming():
    """Basic async streaming with automatic stdout printing."""
    print("=" * 60)
    print("Example 1: Basic Async Streaming with Stdout")
    print("=" * 60)
    
    chatbot = ChatBot()
    messages = [
        {"role": "user", "content": "Write a short poem about building on blockchain networks."}
    ]
    async for chunk in chatbot.astream(
        messages,
        callbacks=[StreamingStdOutCallbackHandler()]
    ):
        pass
    print()


# Example 2: Async streaming with custom callback
async def async_streaming_with_callbacks():
    """Async streaming with custom statistics callback."""
    print("=" * 60)
    print("Example 2: Async Streaming with Custom Callbacks")
    print("=" * 60)
    
    chatbot = ChatBot()
    stats_callback = StreamingStatisticsCallback()
    
    messages = [
        {"role": "user", "content": "Explain blockchain consensus in 2 sentences."}
    ]
    
    print("\nResponse:")
    full_response = ""
    async for chunk in chatbot.astream(messages, callbacks=[stats_callback]):
        print(chunk.delta, end="", flush=True)
        full_response += chunk.delta
    
    print(f"Full response length: {len(full_response)} characters"+ "\n")


# Example 3: Monitoring chunk metadata
async def monitor_chunk_metadata():
    """Monitor chunk metadata during streaming."""
    print("=" * 60)
    print("Example 3: Monitoring Chunk Metadata")
    print("=" * 60)
    
    chatbot = ChatBot()
    messages = [
        {"role": "user", "content": "List 3 benefits of blockchain interoperability."}
    ]
    
    print("\nStreaming with metadata monitoring:")
    print("-" * 60)
    
    chunks_received = []
    async for chunk in chatbot.astream(messages):
        chunks_received.append(chunk)
        
        # Print token with metadata every 5 chunks
        if chunk.chunk_index % 5 == 0:
            print(f"\n[Chunk {chunk.chunk_index}] "
                  f"Content length: {len(chunk.content)}, "
                  f"Delta: '{chunk.delta}'")
        else:
            print(chunk.delta, end="", flush=True)
    
    # Print final chunk info
    final_chunk = chunks_received[-1]
    print(f"   Total chunks: {len(chunks_received)}")
    print(f"   Final content length: {len(final_chunk.content)}")
    print(f"   Finish reason: {final_chunk.finish_reason}")
    print(f"   Provider: {final_chunk.provider}")
    print(f"   Model: {final_chunk.model}")
    print(f"   Usage: {final_chunk.usage}")


# Example 4: Structured event streaming (astream_events)
async def structured_event_streaming():
    """Inspect structured events emitted during streaming."""
    print("=" * 60)
    print(f"Example 4： uses ChatBot.astream_events() to emit chain/prompt/retriever/LLM start/stream/end events, proving structured event streaming works.") 
    print("=" * 60)

    chatbot = ChatBot()
    messages = [
        {"role": "user", "content": "Summarize a blockchain smart contract in one paragraph."}
    ]

    print("Event stream (first 12 events shown):")
    print("-" * 60)

    max_events = 12
    event_count = 0
    hidden_count = 0
    last_event: Optional[dict] = None

    async for event in chatbot.astream_events(messages):
        event_count += 1
        event_name = event.get("event")
        name = event.get("name")
        run_id = event.get("run_id")
        parent_ids = ", ".join(event.get("parent_ids", []) or ["-"])
        timestamp = event.get("timestamp")
        data = event.get("data", {}) or {}
        snippet_source = (data.get("token")or data.get("chunk")or data.get("output")or data.get("response")or data.get("inputs"))
        snippet = ""
        if snippet_source is not None:
            snippet = shorten(str(snippet_source), width=70, placeholder="…")

        if event_count <= max_events:
            print(f"[{timestamp}] {event_name} | component={name} | run={run_id} | parents={parent_ids}")
            if snippet:
                print(f"  ↳ data: {snippet}")
        else:
            hidden_count += 1
        last_event = event

    if event_count == 0:
        print("No events emitted.")
        return

    print("-" * 60)
    print(f"Displayed first {max_events} events ({hidden_count} additional events hidden).")
    
    if last_event and hidden_count:
        final_data = last_event.get("data", {}) or {}
        final_response = final_data.get("response") or final_data.get("output") or final_data.get("chunk")
        final_response = shorten(str(final_response), width=70, placeholder="…")
        print("Last event summary: "
            f"{last_event.get('event')} (run={last_event.get('run_id')}, "
            f"data={final_response})")


# Example 5: Log streaming with astream_log
async def log_streaming_demo():
    """Stream structured log patches to observe state transitions."""
    print("=" * 60)
    print("Example 5: Log Streaming (astream_log)")
    print("=" * 60)

    chatbot = ChatBot()
    messages = [
        {"role": "user", "content": "Provide a two bullet highlight of blockchain governance."}
    ]

    print("Run log patches (diff view, first 10 shown):")
    print("-" * 60)

    max_patches = 10
    patch_count = 0
    hidden_patches = 0
    final_states: Dict[str, dict] = {}

    async for patch in chatbot.astream_log(messages, diff=True):
        patch_count += 1
        event = patch.get("event")
        run_id = patch.get("run_id")
        timestamp = patch.get("timestamp")
        delta = patch.get("delta") or {}
        snapshot = delta.get("snapshot") or {}
        status = snapshot.get("status", "unknown")
        data = delta.get("data", {}) or {}
        chunk = data.get("chunk") or data.get("token")
        chunk_text = ""
        if chunk is not None:
            chunk_text = shorten(str(chunk), width=70, placeholder="…")

        final_states[run_id] = {
            "status": status,
            "final_output": snapshot.get("final_output"),
            "end_time": snapshot.get("end_time"),
        }

        if patch_count <= max_patches:
            print(f"[{timestamp}] {event} | run={run_id} | status={status}")
            if chunk_text:
                print(f"  ↳ chunk: {chunk_text}")
        else:
            hidden_patches += 1

    print("-" * 60)
    print(f"Displayed first {max_patches} patches ({hidden_patches} additional patches hidden).")
    
    for run_id, state in final_states.items():
        summary = f"status={state.get('status')}"
        if state.get("end_time"):
            summary += f", end_time={state['end_time']}"
        final_output = state.get("final_output")
        if final_output:
            summary += f", output={shorten(str(final_output), width=60, placeholder='…')}"
        print(f"  - {run_id}: {summary}")


# Example 6: Synchronous streaming 
def sync_streaming():
    """Synchronous streaming example."""
    print("=" * 60)
    print("Example 6: Synchronous Streaming")
    print("=" * 60)
    
    chatbot = ChatBot()
    messages = [
        {"role": "user", "content": "What is the difference between public and private blockchains?"}
    ]
    
    print("Response (sync):")
    for chunk in chatbot.stream(
        messages,
        callbacks=[StreamingStdOutCallbackHandler()]
    ):
        # The stdout handler prints automatically
        pass
    print()


# Example 7: Streaming with conversation history
async def streaming_with_history():
    """Streaming with multi-turn conversation."""
    print( "=" * 60)
    print("Example 7: Streaming with Conversation History")
    print("=" * 60)
    
    chatbot = ChatBot()
    stats_callback = StreamingStatisticsCallback()
    
    # Multi-turn conversation
    messages = [
        {"role": "user", "content": "How do smart contracts work on Ethereum?"},
        {"role": "assistant", "content": "Smart contracts are autonomous programs stored on-chain that execute deterministically when predefined conditions are met."},
        {"role": "user", "content": "Show me a simple Solidity example that transfers tokens."}
    ]
    
    print("\nResponse:")
    async for chunk in chatbot.astream(
        messages,
        callbacks=[
            StreamingStdOutCallbackHandler(),
            stats_callback,
        ],
    ):
        pass
    print()


# Example 8: Error handling in streaming
async def streaming_error_handling():
    """Demonstrate error handling during streaming."""
    print("=" * 60)
    print(f"Example 8： In the recorded run no error actually occurred, so you only see the streamed answer—but the code still demonstrates how to attach error handling during streaming.")
    print("=" * 60)
    # Create callback that tracks errors
    class ErrorTrackingCallback(BaseCallbackHandler, LLMManagerMixin):
        async def on_llm_error(self, error: Exception, run_id, **kwargs):
            print(f"\n  Caught error in callback: {type(error).__name__}")
    
    chatbot = ChatBot()
    messages = [
        {"role": "user", "content": "Hello! Can you assist with a blockchain project?"}
    ]
    
    print("\nAttempting to stream...")
    async for chunk in chatbot.astream(
        messages,
        callbacks=[
            ErrorTrackingCallback(),
            StreamingStdOutCallbackHandler(),
        ],
    ):
        pass




# Example 9: Comparing streaming vs non-streaming
async def compare_streaming_vs_batch():
    """Compare streaming vs batch responses."""
    print("=" * 60)
    print("Example 9: Comparing Streaming vs Batch")
    print("=" * 60)
    
    chatbot = ChatBot()
    messages = [
        {"role": "user", "content": "List five major milestones in blockchain history."}
    ]
    
    # Batch (non-streaming)
    print("\n Batch mode (ask):")
    import time
    start = time.time()
    response = await chatbot.ask(messages)
    batch_time = time.time() - start
    print(response)
    print(f" Time: {batch_time:.2f}s")
    
    # Streaming
    print("\n Streaming mode (astream):")
    start = time.time()
    full_response = ""
    async for chunk in chatbot.astream(
        messages,
        callbacks=[StreamingStdOutCallbackHandler()]
    ):
        full_response += chunk.delta
    stream_time = time.time() - start
    print(f"\n  Time: {stream_time:.2f}s")
    
    # Compare
    print(f"\n Comparison:")
    print(f"   Batch time: {batch_time:.2f}s")
    print(f"   Stream time: {stream_time:.2f}s")
    

async def main():

    print("ChatBot Streaming Demo")
    print(f"Example 1–3 exercise core ChatBot.astream() streaming: stdout token printing, custom callbacks collecting token/chunk stats, and metadata inspection of LLMResponseChunk fields")
    await basic_async_streaming()
    await async_streaming_with_callbacks()
    await monitor_chunk_metadata()
    await structured_event_streaming()
    
    await log_streaming_demo()
    print("\nRunning sync example in separate process...")
    import multiprocessing
    p = multiprocessing.Process(target=sync_streaming)
    p.start()
    p.join()
    
    await streaming_with_history()
    await streaming_error_handling()
    await compare_streaming_vs_batch()


if __name__ == "__main__":
    asyncio.run(main())
