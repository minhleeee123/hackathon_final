"""
Test 1: Basic import test
Kiểm tra xem có import được spoon_ai modules không
"""
import sys
import os

# Add spoon-core to path
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

print("=" * 50)
print("TEST 1: Basic Import Test")
print("=" * 50)

try:
    print("\n1. Testing basic imports...")
    import spoon_ai
    print("   ✅ spoon_ai imported successfully")
    
    from spoon_ai.chat import ChatBot
    print("   ✅ ChatBot imported successfully")
    
    from spoon_ai.llm import LLMManager, ConfigurationManager
    print("   ✅ LLM modules imported successfully")
    
    print("\n✅ ALL IMPORTS SUCCESSFUL!")
    print("\nSpoon AI version:", spoon_ai.__version__ if hasattr(spoon_ai, '__version__') else "Unknown")
    
except ImportError as e:
    print(f"\n❌ Import failed: {e}")
    print("\nMissing dependencies. Please install:")
    print("pip install python-dotenv openai anthropic pydantic")
    sys.exit(1)

print("\n" + "=" * 50)
