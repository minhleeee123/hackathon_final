# Graph System Documentation

## Overview

The Graph System is a powerful workflow orchestration framework that enables you to create complex, multi-step AI workflows using a graph-based approach. It provides advanced state management, dynamic routing, parallel execution, monitoring, and robust error handling with enterprise-grade features.

## Table of Contents
1. [Quick Start](#quick-start)
2. [Core Concepts](#core-concepts)
3. [Node Development](#node-development)
4. [Dynamic Routing](#dynamic-routing)
5. [Intelligent Routing](#intelligent-routing)
6. [Parallel Execution](#parallel-execution)
7. [Memory Management](#memory-management)
8. [Memory System](#memory-system)
9. [Monitoring & Metrics](#monitoring--metrics)
10. [Error Handling](#error-handling)
11. [Advanced Features](#advanced-features)
12. [Best Practices](#best-practices)
13. [Complete Examples](#complete-examples)

## Quick Start

### Basic Graph Example

```python
from spoon_ai.graph import StateGraph, NodeContext, NodeResult
from datetime import datetime

# Define your state schema
class WorkflowState:
    input_text: str = ""
    processed_text: str = ""
    final_result: str = ""
    confidence: float = 0.0
    timestamp: str = ""

# Create the graph
graph = StateGraph(WorkflowState)

# Enable monitoring and cleanup
graph.enable_monitoring(["execution_time", "success_rate", "node_performance"])
graph.set_default_state_cleanup()

# Define node functions
async def process_input(state, context: NodeContext):
    """Process the input text"""
    processed = state["input_text"].upper()

    return NodeResult(
        updates={
            "processed_text": processed,
            "timestamp": datetime.now().isoformat()
        },
        confidence=0.9,
        metadata={"processing_method": "uppercase"}
    )

async def generate_result(state, context: NodeContext):
    """Generate the final result"""
    result = f"Result: {state['processed_text']} (processed at {state['timestamp']})"

    return NodeResult(
        updates={"final_result": result},
        confidence=0.95
    )

# Add nodes to graph
graph.add_node("process", process_input)
graph.add_node("generate", generate_result)

# Add edges
graph.add_edge("process", "generate")
graph.set_entry_point("process")

# Compile and execute
compiled = graph.compile()
result = await compiled.invoke({"input_text": "hello world"})

print(f"Final result: {result['final_result']}")
print(f"Confidence: {result.get('confidence', 0):.1%}")

# Get execution metrics
metrics = compiled.get_execution_metrics()
print(f"Total executions: {metrics['total_executions']}")
print(f"Success rate: {metrics['success_rate']:.1%}")
```

## Core Concepts

### StateGraph Architecture

The `StateGraph` is the main building block for creating workflows:

```python
from spoon_ai.graph import StateGraph, NodeContext, NodeResult, RouterResult
from spoon_ai.graph.checkpointer import InMemoryCheckpointer

# Define state schema
class MyState:
    input_data: str = ""
    processed_data: str = ""
    results: list = []
    confidence: float = 0.0
    metadata: dict = {}

# Create graph with advanced configuration
graph = StateGraph(MyState)

# Configure checkpointing with memory management
checkpointer = InMemoryCheckpointer(
    max_checkpoints_per_thread=10,
    max_threads=100,
    ttl_seconds=3600  # 1 hour TTL
)
graph.set_checkpointer(checkpointer)

# Enable monitoring
graph.enable_monitoring(["execution_time", "success_rate", "memory_usage"])

# Set automatic state cleanup
graph.set_default_state_cleanup()
```

### State Reducers

Use reducers to control how state updates are merged:

```python
from typing import Annotated
from spoon_ai.graph import add_messages, merge_dicts, append_history

class WorkflowState(TypedDict):
    # List operations
    messages: Annotated[List[Dict], add_messages]  # Append new messages
    execution_log: Annotated[List[str], append_history]  # Add to history

    # Dictionary operations
    analysis_results: Annotated[Dict[str, Any], merge_dicts]  # Deep merge

    # Simple replacement (default behavior)
    current_step: str
    status: str
```

### Command Objects for Fine Control

Use `Command` objects for advanced state control:

```python
from spoon_ai.graph import Command

def advanced_node(state: MyState) -> Command:
    """Node with advanced control over execution"""
    if state["counter"] >= 5:
        return Command(
            update={"completed": True},
            goto="END"
        )
    else:
        return Command(
            update={"counter": state["counter"] + 1},
            goto="increment"
        )
```

## Node Development

### Basic Node Structure

```python
def process_data(state: MyState) -> Dict[str, Any]:
    """Standard node function"""
    # Process state data
    input_data = state.get("input_data", [])

    # Perform computation
    processed = [item.upper() for item in input_data]

    # Return state updates
    return {
        "processed_data": processed,
        "step_count": state.get("step_count", 0) + 1
    }
```

### Async Node Functions

```python
import asyncio

async def fetch_external_data(state: MyState) -> Dict[str, Any]:
    """Async node for external API calls"""
    # Simulate API call
    await asyncio.sleep(1)

    # Fetch data
    api_data = {"source": "external", "data": [1, 2, 3]}

    return {"external_data": api_data}
```

### Error Handling in Nodes

```python
def safe_node(state: MyState) -> Dict[str, Any]:
    """Node with error handling"""
    try:
        # Potentially failing operation
        result = risky_operation(state["input"])
        return {"result": result, "error": None}
    except Exception as e:
        return {
            "result": None,
            "error": str(e),
            "status": "failed"
        }
```

## Edge Configuration and Flow Control

### Conditional Edges

Route execution based on state conditions:

```python
def route_based_on_count(state: MyState) -> str:
    """Conditional routing function"""
    if state["counter"] < 3:
        return "continue"
    elif state["counter"] < 5:
        return "warning"
    else:
        return "stop"

# Add conditional edge
graph.add_conditional_edges(
    "increment",
    route_based_on_count,
    {
        "continue": "increment",
        "warning": "warning_node",
        "stop": "END"
    }
)
```

### Complex Routing Logic

```python
def intelligent_router(state: ChatState) -> str:
    """Multi-condition routing"""
    messages = state["messages"]

    # Check for specific conditions
    if not messages:
        return "greeting"

    last_message = messages[-1]["content"].lower()

    if "help" in last_message:
        return "help"
    elif "data" in last_message:
        return "data_processing"
    elif "exit" in last_message:
        return "END"
    else:
        return "conversation"
```

## Advanced Execution Patterns

### Parallel Execution

Execute multiple nodes simultaneously:

```python
from spoon_ai.graph import StateGraph

class ParallelState(TypedDict):
    results: Dict[str, Any]
    execution_time: float

async def task_a(state: ParallelState) -> Dict[str, Any]:
    await asyncio.sleep(1)
    return {"results": {"task_a": "done"}}

async def task_b(state: ParallelState) -> Dict[str, Any]:
    await asyncio.sleep(1)
    return {"results": {"task_b": "done"}}

# Create graph with parallel execution
graph = StateGraph(ParallelState)
graph.add_node("task_a", task_a, parallel_group="parallel_tasks")
graph.add_node("task_b", task_b, parallel_group="parallel_tasks")

# Aggregation node
def aggregate_results(state: ParallelState) -> Dict[str, Any]:
    return {"execution_time": 1.0}

graph.add_node("aggregate", aggregate_results)
graph.add_edge("task_a", "aggregate")
graph.add_edge("task_b", "aggregate")
```

### Loop Patterns

Create iterative workflows:

```python
def loop_condition(state: MyState) -> str:
    """Determine if loop should continue"""
    if state["counter"] >= 10:
        return "END"
    elif state["counter"] % 2 == 0:
        return "even_processing"
    else:
        return "odd_processing"

# Set up loop
graph.add_conditional_edges(
    "process",
    loop_condition,
    {
        "even_processing": "even_node",
        "odd_processing": "odd_node",
        "END": "END"
    }
)
```

## LLM Integration

### Basic LLM Node

```python
async def llm_chat_node(state: ChatState) -> Dict[str, Any]:
    """Node that uses LLM for response generation"""
    from spoon_ai.llm.manager import LLMManager

    llm_manager = LLMManager()

    # Prepare messages for LLM
    messages = state["messages"]

    # Get LLM response
    response = await llm_manager.chat(messages)

    # Add response to state
    return {
        "messages": [{"role": "assistant", "content": response["content"]}]
    }
```

### LLM-Driven Routing

```python
from spoon_ai.graph import RouterResult, router_decorator

@router_decorator
async def llm_router(state: ChatState, context) -> RouterResult:
    """LLM decides next action"""
    from spoon_ai.llm.manager import LLMManager

    llm_manager = LLMManager()

    # Create decision prompt
    prompt = f"""
    Based on the conversation, what should we do next?

    Messages: {state['messages']}

    Options:
    - continue_chat: Keep talking
    - data_analysis: Analyze data
    - end_conversation: End chat
    """

    response = await llm_manager.chat([{"role": "user", "content": prompt}])

    # Parse decision
    content = response["content"].lower()
    if "data_analysis" in content:
        return RouterResult(next_node="data_analysis", confidence=0.8)
    elif "end" in content:
        return RouterResult(next_node="END", confidence=0.9)
    else:
        return RouterResult(next_node="continue_chat", confidence=0.7)
```

## Intelligent Routing

SpoonOS provides advanced intelligent routing capabilities for automatic path selection based on user queries, state conditions, and intelligent decision-making.

### Core Features

- **Rule-Based Routing**: String, pattern, and function-based routing rules
- **Priority System**: Higher priority rules execute first
- **LLM-Powered Intelligence**: AI-driven complex routing decisions
- **Pattern Matching**: Regex-based sophisticated pattern recognition
- **Real-Time Adaptation**: Dynamic routing based on execution context

### Rule-Based Routing

#### Basic Keyword Routing

```python
from spoon_ai.graph import StateGraph

graph = StateGraph(TradingState)

# Simple keyword routing with priorities
graph.add_routing_rule("START", "price", "fetch_price_data", priority=10)
graph.add_routing_rule("START", "buy|sell|trade", "execute_trade", priority=8)
graph.add_routing_rule("START", "analyze", "analyze_market", priority=7)
graph.add_routing_rule("START", "risk", "assess_risks", priority=6)
```

#### Pattern-Based Routing

```python
# Advanced regex pattern matching
graph.add_pattern_routing("START", r".*?(?:current|latest).*?(?:price|value).*?",
                         "fetch_price_data", priority=9)
graph.add_pattern_routing("START", r".*?(?:should I|recommend).*?(?:buy|sell).*?",
                         "analyze_market", priority=8)
graph.add_pattern_routing("START", r".*?(?:execute|place).*?(?:order|trade).*?",
                         "execute_trade", priority=7)
```

#### Function-Based Routing

```python
def confidence_based_router(state: Dict[str, Any], query: str) -> str:
    """Route based on confidence score and query analysis"""
    confidence = state.get('confidence_score', 0)

    if confidence > 0.8:
        return "generate_response"
    elif confidence > 0.6 and "risk" in query.lower():
        return "assess_risks"
    else:
        return "analyze_market"

graph.add_routing_rule("analysis_complete", confidence_based_router,
                      "generate_response", priority=15)
```

### LLM-Powered Intelligent Routing

#### Intelligent Router Setup

```python
async def intelligent_router(state: Dict[str, Any], query: str) -> str:
    """LLM-powered routing for complex decision making"""
    from spoon_ai.llm.manager import LLMManager

    llm_manager = LLMManager()

    intent_prompt = f"""
    Analyze this trading query and determine the appropriate action:

    Query: "{query}"
    Current State: {json.dumps(state, indent=2)}

    Available actions:
    - query_price: Get current price information
    - analyze_market: Perform technical/fundamental analysis
    - execute_trade: Execute a trade order
    - risk_assessment: Assess trading risks
    - portfolio_review: Review current portfolio

    Respond with ONLY the action name (lowercase, no explanation).
    """

    messages = [Message(role="user", content=intent_prompt)]
    response = await llm_manager.chat(messages)

    intent = response.content.strip().lower()

    # Map to appropriate nodes
    intent_mapping = {
        'query_price': 'fetch_price_data',
        'analyze_market': 'analyze_market',
        'execute_trade': 'execute_trade',
        'risk_assessment': 'assess_risks',
        'portfolio_review': 'portfolio_review'
    }

    return intent_mapping.get(intent, 'fetch_price_data')

# Set intelligent router
graph.set_intelligent_router(intelligent_router)
```

### Advanced Routing Patterns

#### Context-Aware Routing

```python
def context_aware_router(state: Dict[str, Any], query: str) -> str:
    """Route based on conversation context and state"""
    # Check conversation history
    history = state.get('execution_log', [])

    # High-frequency trader pattern
    if len(history) > 10 and any('trade' in log.lower() for log in history[-5:]):
        return 'high_frequency_check'

    # Risk-averse pattern
    if any('loss' in log.lower() for log in history[-3:]):
        return 'risk_reassessment'

    # Default analysis
    return 'standard_analysis'

graph.add_routing_rule("decision_point", context_aware_router,
                      "standard_analysis", priority=10)
```

#### Multi-Modal Routing

```python
def multi_modal_router(state: Dict[str, Any], query: str) -> str:
    """Route based on input type and content analysis"""

    # Check input modalities
    if state.get('input_type') == 'image':
        return 'vision_analysis'
    elif state.get('input_type') == 'data':
        return 'data_processing'
    elif state.get('input_type') == 'audio':
        return 'speech_analysis'

    # Content-based routing
    query_lower = query.lower()

    if any(word in query_lower for word in ['chart', 'technical', 'indicator']):
        return 'technical_analysis'
    elif any(word in query_lower for word in ['news', 'sentiment', 'social']):
        return 'sentiment_analysis'
    elif any(word in query_lower for word in ['portfolio', 'allocation', 'balance']):
        return 'portfolio_management'
    else:
        return 'general_analysis'

graph.add_routing_rule("input_received", multi_modal_router,
                      "general_analysis", priority=12)
```

### Real-World Trading Bot Example

#### Complete Intelligent Trading Workflow

```python
"""
Intelligent TradeBot with Real Data Integration
"""

from spoon_ai.graph import StateGraph, NodeContext, NodeResult
from spoon_toolkits.crypto.crypto_powerdata.tools import CryptoPowerDataCEXTool
from spoon_ai.llm.manager import LLMManager
from typing import Dict, Any, List, Annotated
import json
import asyncio

class TradingState(TypedDict):
    user_query: str
    intent: str
    market_data: Dict[str, Any]  # Real market data from PowerData
    analysis_results: List[str]
    trade_decision: Dict[str, Any]
    confidence_score: float
    execution_log: List[str]
    routing_decisions: List[str]

class IntelligentTradeBot:
    def __init__(self):
        self.powerdata_tool = CryptoPowerDataCEXTool()
        self.llm_manager = LLMManager()
        self.graph = self._build_intelligent_graph()

        # Setup intelligent router
        self.intelligent_router = self._create_intelligent_router()

    def _build_intelligent_graph(self) -> StateGraph:
        """Build graph with intelligent routing"""
        graph = StateGraph(TradingState)

        # Add nodes
        graph.add_node("fetch_price_data", self._fetch_price_data)
        graph.add_node("analyze_market", self._analyze_market)
        graph.add_node("execute_trade", self._execute_trade)
        graph.add_node("assess_risks", self._assess_risks)
        graph.add_node("generate_response", self._generate_response)

        # Intelligent routing rules (priority-based)
        graph.add_routing_rule("START", "price", "fetch_price_data", priority=10)
        graph.add_routing_rule("START", "buy|sell|trade", "execute_trade", priority=8)
        graph.add_routing_rule("START", "analyze|analysis", "analyze_market", priority=7)
        graph.add_routing_rule("START", "risk", "assess_risks", priority=6)

        # Pattern-based routing
        graph.add_pattern_routing("START", r".*?(?:current|latest).*?(?:price|value).*?",
                                 "fetch_price_data", priority=9)
        graph.add_pattern_routing("START", r".*?(?:should I|recommend).*?(?:buy|sell).*?",
                                 "analyze_market", priority=8)

        # Confidence-based conditional routing
        def confidence_router(state: Dict[str, Any], query: str) -> str:
            confidence = state.get('confidence_score', 0)
            if confidence > 0.8:
                return "generate_response"
            elif confidence > 0.6:
                return "assess_risks"
            else:
                return "analyze_market"

        graph.add_conditional_edges(
            "fetch_price_data",
            confidence_router,
            {
                "generate_response": "generate_response",
                "assess_risks": "assess_risks",
                "analyze_market": "analyze_market"
            }
        )

        # Set intelligent router
        graph.set_intelligent_router(self.intelligent_router)

        graph.set_entry_point("fetch_price_data")

        return graph

    async def _create_intelligent_router(self):
        """Create LLM-powered intelligent router"""
        async def router(state: Dict[str, Any], query: str) -> str:
            try:
                intent_prompt = f"""
                Analyze this trading query and determine the appropriate action:

                Query: "{query}"
                Market Context: {json.dumps(state.get('market_data', {}), indent=2)}

                Available actions:
                - query_price: Get current price information
                - analyze_market: Perform technical/fundamental analysis
                - execute_trade: Execute a trade order
                - risk_assessment: Assess trading risks

                Respond with ONLY the action name (lowercase, no explanation).
                """

                messages = [{"role": "user", "content": intent_prompt}]
                response = await self.llm_manager.chat(messages)

                intent = response.content.strip().lower()
                mapping = {
                    'query_price': 'fetch_price_data',
                    'analyze_market': 'analyze_market',
                    'execute_trade': 'execute_trade',
                    'risk_assessment': 'assess_risks'
                }

                return mapping.get(intent, 'fetch_price_data')
            except Exception as e:
                print(f"Intelligent routing failed: {e}")
                return 'fetch_price_data'

        return router

    async def _fetch_price_data(self, state: Dict[str, Any], context: NodeContext) -> Dict[str, Any]:
        """Fetch real market data using PowerData"""
        try:
            query = state.get('user_query', '')
            symbol = self._extract_symbol(query) or 'BTC'

            # Real PowerData integration
            result = await self.powerdata_tool.execute(
                exchange="binance",
                symbol=f"{symbol}/USDT",
                timeframe="1h",
                limit=50,
                indicators_config=json.dumps({
                    "rsi": [{"timeperiod": 14}],
                    "ema": [{"timeperiod": 12}, {"timeperiod": 26}],
                    "macd": [{"fastperiod": 12, "slowperiod": 26}]
                }),
                use_enhanced=True
            )

        market_data = {
            "symbol": f"{symbol}/USDT",
            "data": result.output,
            "timestamp": asyncio.get_event_loop().time(),
            "source": "powerdata_api"
        }

        return {
            "market_data": market_data,
            "intent": "query_price",
            "confidence_score": 0.9,
            "execution_log": [f"Fetched data for {symbol}"],
            "routing_decisions": ["Price data fetched successfully"]
        }

    async def _analyze_market(self, state: Dict[str, Any], context: NodeContext) -> Dict[str, Any]:
        """Perform market analysis using real data"""
        market_data = state.get('market_data', {})
        query = state.get('user_query', '')

        analysis_prompt = f"""
        Analyze this market data and provide trading insights:

        Query: {query}
        Market Data: {json.dumps(market_data, indent=2)}

        Provide: analysis, recommendation (BUY/SELL/HOLD), confidence (0-1)
        Format as JSON.
        """

        messages = [{"role": "user", "content": analysis_prompt}]
        response = await self.llm_manager.chat(messages)

        try:
            analysis = json.loads(response.content)
        except:
            analysis = {"analysis": response.content, "recommendation": "HOLD", "confidence": 0.5}

        return {
            "analysis_results": [analysis.get('analysis', 'Analysis completed')],
            "trade_decision": {
                "action": analysis.get('recommendation', 'HOLD'),
                "reasoning": analysis.get('analysis', ''),
                "symbol": market_data.get('symbol', 'UNKNOWN')
            },
            "confidence_score": float(analysis.get('confidence', 0.5)),
            "intent": "analyze_market",
            "execution_log": ["Market analysis completed"]
        }

    async def _execute_trade(self, state: Dict[str, Any], context: NodeContext) -> Dict[str, Any]:
        """Execute trade"""
        trade_params = self._parse_trade_params(state.get('user_query', ''))
        trade_result = {
            "action": trade_params.get('action', 'HOLD'),
            "symbol": trade_params.get('symbol', 'BTC/USDT'),
            "amount": trade_params.get('amount', 0),
            "status": "SUCCESS",
            "order_id": f"sim_{asyncio.get_event_loop().time()}",
            "timestamp": asyncio.get_event_loop().time()
        }

        return {
            "trade_decision": trade_result,
            "confidence_score": 0.95,
            "intent": "execute_trade",
            "execution_log": [f"Trade executed: {trade_result['action']}"]
        }

    def _extract_symbol(self, query: str) -> str:
        """Extract trading symbol from query"""
        import re
        match = re.search(r'\b(BTC|ETH|SOL|ADA|DOT)\b', query.upper())
        return match.group(1) if match else None

    def _parse_trade_params(self, query: str) -> Dict[str, Any]:
        """Parse trade parameters from natural language"""
        query_lower = query.lower()

        action = 'BUY' if 'buy' in query_lower else 'SELL' if 'sell' in query_lower else 'HOLD'
        symbol_match = re.search(r'\b(btc|eth|sol|ada|dot)\b', query_lower)
        symbol = symbol_match.group(1).upper() if symbol_match else 'BTC'
        amount_match = re.search(r'(\d+(?:\.\d+)?)', query_lower)
        amount = float(amount_match.group(1)) if amount_match else 0.1

        return {
            'action': action,
            'symbol': f"{symbol}/USDT",
            'amount': amount
        }


    async def process_query(self, user_query: str) -> Dict[str, Any]:
        """Process user query through intelligent routing"""
        print(f"\n🤖 Processing: '{user_query}'")

        initial_state = {
            "user_query": user_query,
            "market_data": {},
            "analysis_results": [],
            "execution_log": [],
            "routing_decisions": []
        }

        compiled_graph = self.graph.compile()
        result = await compiled_graph.invoke(initial_state)

        return result

# Usage example
async def main():
    bot = IntelligentTradeBot()

    queries = [
        "What's the current price of BTC?",
        "Should I buy Ethereum right now?",
        "Execute a buy order for 0.1 BTC"
    ]

    for query in queries:
        result = await bot.process_query(query)
        print(f"Result: {result.get('trade_decision', 'No decision')}")
        print(f"Confidence: {result.get('confidence_score', 0):.1%}")

if __name__ == "__main__":
    asyncio.run(main())
```

### Routing Performance & Monitoring

#### Execution Metrics

```python
# Get detailed execution metrics
metrics = compiled_graph.get_execution_metrics()

print("Routing Performance:")
print(f"• Total Executions: {metrics['total_executions']}")
print(f"• Success Rate: {metrics['success_rate']:.1%}")
print(f"• Average Routing Time: {metrics['avg_execution_time']:.3f}s")
print(f"• Node Performance: {metrics['node_stats']}")
```

#### Real-Time Monitoring

```python
# Stream execution with routing decisions
async for state in compiled_graph.stream(initial_state, stream_mode="values"):
    routing_decisions = state.get('routing_decisions', [])
    if routing_decisions:
        print(f"🛣️ Routing: {routing_decisions[-1]}")

    execution_log = state.get('execution_log', [])
    if execution_log:
        print(f"📝 Execution: {execution_log[-1]}")
```

## Error Handling and Recovery

### Graph-Level Error Handling

```python
from spoon_ai.graph import GraphExecutionError, NodeExecutionError

try:
    result = await compiled.invoke(initial_state)
except GraphExecutionError as e:
    print(f"Graph execution failed: {e}")
except NodeExecutionError as e:
    print(f"Node {e.node_name} failed: {e}")
```

### Recovery Patterns

```python
def recovery_node(state: MyState) -> Dict[str, Any]:
    """Handle errors and attempt recovery"""
    if state.get("error"):
        error_type = state["error"].get("type")

        if error_type == "timeout":
            return {
                "status": "retrying",
                "retry_count": state.get("retry_count", 0) + 1
            }
        elif error_type == "invalid_data":
            return {"status": "validation_failed"}
        else:
            return {"status": "unknown_error"}

    return {"status": "no_error"}
```

### Error Routing

```python
def error_router(state: MyState) -> str:
    """Route based on error status"""
    status = state.get("status", "normal")

    if status == "retrying" and state.get("retry_count", 0) < 3:
        return "retry"
    elif status in ["validation_failed", "unknown_error"]:
        return "error_handling"
    else:
        return "continue"
```

## Streaming and Monitoring

### Stream Execution States

```python
async def monitor_execution():
    """Monitor graph execution in real-time"""
    compiled = graph.compile()

    # Stream state changes
    async for state in compiled.stream(initial_state, stream_mode="values"):
        print(f"Current state: {state}")

    # Stream node updates
    async for update in compiled.stream(initial_state, stream_mode="updates"):
        print(f"Node update: {update}")

    # Stream debug information
    async for debug in compiled.stream(initial_state, stream_mode="debug"):
        print(f"Debug: {debug}")
```

### Execution History

```python
# Access execution history after completion
compiled = graph.compile()
result = await compiled.invoke(initial_state)

# Get execution statistics
execution_history = compiled.execution_history
print(f"Total steps: {len(execution_history)}")

# Analyze performance
for step in execution_history:
    print(f"Node {step.node} took {step.duration}s")
```

## Complex Workflows

### For comprehensive workflow examples, see:
**`spoon-core/examples/graph_crypto_analysis.py`**

This example demonstrates:
- Complex multi-step analysis workflows
- Parallel execution patterns
- LLM integration for decision making
- Advanced state management
- Error handling and recovery
- Real-world crypto analysis pipeline

### Workflow Builder Pattern

```python
class AnalysisWorkflow:
    def __init__(self):
        self.graph = StateGraph(AnalysisState)
        self._build_workflow()

    def _build_workflow(self):
        """Build the complete analysis workflow"""
        # Data collection phase
        self.graph.add_node("collect_data", self.collect_data)
        self.graph.add_node("validate_data", self.validate_data)

        # Parallel analysis phase
        self.graph.add_node("technical_analysis", self.technical_analysis,
                           parallel_group="analysis")
        self.graph.add_node("sentiment_analysis", self.sentiment_analysis,
                           parallel_group="analysis")

        # Decision phase
        self.graph.add_node("make_decision", self.make_decision)

        # Connect workflow
        self.graph.add_edge("collect_data", "validate_data")
        self.graph.add_edge("validate_data", "technical_analysis")
        self.graph.add_edge("technical_analysis", "make_decision")
        self.graph.add_edge("sentiment_analysis", "make_decision")
        self.graph.add_edge("make_decision", "END")

        self.graph.set_entry_point("collect_data")

    async def run_analysis(self, initial_state):
        """Execute the complete workflow"""
        compiled = self.graph.compile()
        return await compiled.invoke(initial_state)
```

## Complete Usage Example

```python
import asyncio
from spoon_ai.graph import StateGraph, Command
from typing import TypedDict, Dict, Any, List, Annotated
from spoon_ai.graph import add_messages

class DocumentProcessingState(TypedDict):
    documents: List[str]
    processed_docs: List[str]
    current_step: str
    error_count: int
    completed: bool

def process_document(state: DocumentProcessingState) -> Dict[str, Any]:
    """Process a single document"""
    docs = state["documents"]

    if not docs:
        return {"current_step": "completed", "completed": True}

    # Process first document
    doc = docs[0]
    processed = f"PROCESSED: {doc.upper()}"

    return {
        "processed_docs": state["processed_docs"] + [processed],
        "documents": docs[1:],  # Remove processed document
        "current_step": "processing"
    }

def check_completion(state: DocumentProcessingState) -> str:
    """Check if processing should continue"""
    if not state["documents"]:
        return "END"
    elif state["error_count"] > 3:
        return "error_handling"
    else:
        return "process"

async def main():
    # Create workflow
    graph = StateGraph(DocumentProcessingState)
    graph.add_node("process", process_document)
    graph.add_node("error_handling", lambda s: {"completed": True})

    # Set up conditional flow
    graph.add_conditional_edges(
        "process",
        check_completion,
        {
            "process": "process",
            "END": "END",
            "error_handling": "error_handling"
        }
    )

    graph.set_entry_point("process")

    # Execute
    compiled = graph.compile()

    initial_state = {
        "documents": ["doc1", "doc2", "doc3"],
        "processed_docs": [],
        "current_step": "start",
        "error_count": 0,
        "completed": False
    }

    # Stream execution
    async for state in compiled.stream(initial_state):
        print(f"Step: {state['current_step']}, "
              f"Remaining: {len(state['documents'])}, "
              f"Processed: {len(state['processed_docs'])}")

    print("Workflow completed!")

if __name__ == "__main__":
    asyncio.run(main())
```

## Best Practices

### 1. State Design
- Use clear state schemas with TypedDict
- Keep state minimal and focused
- Use appropriate reducers for different data types

### 2. Node Development
- Make nodes pure functions when possible
- Handle errors gracefully within nodes
- Use NodeResult for rich return values
- Leverage NodeContext for execution metadata

### 3. Parallel Execution
- Group related operations in parallel groups
- Choose appropriate join strategies (all_complete, any_first, quorum)
- Configure timeouts and error handling
- Use custom join conditions when needed

### 4. Memory Management
- **Memory**: Persistent storage with JSON serialization to disk
- **Advanced Features**: Message search, recent message retrieval, statistics
- **Session Management**: Multi-session support with automatic loading/saving
- **Metadata Support**: Custom metadata storage and retrieval
- Enable automatic state cleanup with `set_default_state_cleanup()`
- Configure checkpointer limits (max_threads, ttl_seconds)
- Monitor memory usage in long-running workflows

#### Memory Features

```python
from spoon_ai.graph import Memory

# Create persistent memory with custom path
memory = Memory(
    storage_path="./my_memory",
    session_id="conversation_bot"
)

# Advanced memory operations
memory.add_message({"role": "user", "content": "Hello!"})
results = memory.search_messages("help", limit=5)
recent = memory.get_recent_messages(hours=24)
stats = memory.get_statistics()

# Metadata management
memory.set_metadata("last_interaction", "2024-01-15")
last_time = memory.get_metadata("last_interaction")
```

#### Memory Statistics

```python
stats = agent.get_memory_statistics()
print(f"Messages: {stats['total_messages']}")
print(f"Session: {stats['session_id']}")
print(f"Storage: {stats['storage_path']}")
print(f"File Size: {stats['file_size']} bytes")
```

## Memory System

The Memory system replaces the legacy MockMemory with a robust, persistent memory implementation that provides enterprise-grade conversation persistence, search capabilities, and session management.

### Features

- **Persistent Storage**: Automatic JSON serialization to disk with error recovery
- **Session Management**: Multi-session support with automatic loading/saving
- **Advanced Search**: Full-text search through message history
- **Time-based Queries**: Retrieve messages from specific time periods
- **Metadata Support**: Custom key-value metadata storage
- **Statistics**: Comprehensive memory usage and performance metrics
- **Backward Compatibility**: Drop-in replacement for MockMemory

### Basic Usage

```python
from spoon_ai.graph import GraphAgent, Memory

# Create agent with persistent memory
agent = GraphAgent(
    name="MyBot",
    graph=my_graph,
    memory_path="./bot_memory",  # Custom storage directory
    session_id="production_session"  # Specific session identifier
)

# Memory automatically persists to disk
await agent.run("Hello, remember this conversation!")
```

### Advanced Memory Operations

```python
# Search through message history
search_results = agent.search_memory("important topic", limit=10)

# Get recent conversations
recent_messages = agent.get_recent_memory(hours=24)

# Access memory statistics
stats = agent.get_memory_statistics()
print(f"Total messages: {stats['total_messages']}")
print(f"Storage location: {stats['storage_path']}")

# Manage metadata
agent.set_memory_metadata("last_training", "2024-01-15")
training_date = agent.get_memory_metadata("last_training")

# Switch sessions
agent.load_session("different_session")
```

### Memory File Structure

Memory stores data in JSON format with the following structure:

```json
{
  "messages": [
    {
      "role": "user",
      "content": "Hello!",
      "timestamp": "2024-01-15T10:30:00.000000"
    }
  ],
  "metadata": {
    "custom_key": "custom_value",
    "last_interaction": "2024-01-15"
  },
  "last_updated": "2024-01-15T10:30:00.000000",
  "session_id": "conversation_demo"
}
```

### Configuration Options

```python
# Custom storage path
memory = Memory(storage_path="/path/to/storage")

# Custom session ID
memory = Memory(session_id="my_custom_session")

# Both options
memory = Memory(
    storage_path="./data",
    session_id="production_bot"
)
```

### Error Handling

Memory includes comprehensive error handling:

- **Disk I/O Errors**: Graceful fallback with warnings
- **Corrupted Files**: Automatic recovery with backup creation
- **Permission Issues**: Clear error messages with recovery suggestions
- **Large Files**: Automatic file size monitoring and optimization

### Performance Considerations

- **Lazy Loading**: Memory files are loaded only when needed
- **Incremental Saves**: Only changed data is written to disk
- **Compression**: Future support for compressed storage
- **Indexing**: Search operations use efficient string matching

### Migration from MockMemory

The Memory system is fully backward compatible:

```python
# Old code (still works)
from spoon_ai.graph import MockMemory
memory = MockMemory()  # Now uses Memory internally

# New recommended approach
from spoon_ai.graph import Memory
memory = Memory()  # Direct instantiation
```

### 6. Error Handling
- Use appropriate error strategies for parallel groups
- Implement recovery patterns with RouterResult
- Leverage checkpoint resume for fault tolerance

### 7. Monitoring
- Enable execution monitoring for production workflows
- Track node performance metrics with `get_execution_metrics()`
- Use streaming for real-time monitoring

## Summary

The Graph System provides a comprehensive framework for building complex AI workflows with:

- **Advanced State Management**: Robust state handling with automatic merging and cleanup
- **Parallel Execution**: Sophisticated parallel processing with multiple strategies
- **Dynamic Routing**: RouterResult-based intelligent flow control
- **Memory Management**: Automatic garbage collection and resource optimization
- **Error Handling**: Comprehensive error collection and recovery mechanisms
- **Monitoring**: Real-time execution metrics and performance tracking
- **Checkpointing**: Reliable state persistence and resume capabilities
- **Streaming**: Real-time execution monitoring and state streaming

For complex real-world implementations, refer to the complete crypto analysis example at `spoon-core/examples/graph_crypto_analysis.py`.