"""
Test 4: Spoon LLM Manager Test
Test LLM Manager với Gemini
"""
import sys
import os
import asyncio
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

print("=" * 50)
print("TEST 4: Spoon LLM Manager Test")
print("=" * 50)

async def test_llm_manager():
    """Test Spoon LLM Manager với Gemini"""
    try:
        from spoon_ai.llm import LLMManager, ConfigurationManager
        from spoon_ai.schema import Message, Role
        
        print("\n1. Creating LLM Manager...")
        config_manager = ConfigurationManager()
        llm_manager = LLMManager(config_manager)
        print("   ✅ LLM Manager created")
        
        print("\n2. Sending test message...")
        prompt = "Say 'Hello from Spoon OS!' in one sentence."
        print(f"   Prompt: {prompt}")
        
        # Create Message object properly
        messages = [Message(role=Role.USER.value, content=prompt)]
        
        response = await llm_manager.chat(
            messages=messages,
            provider="gemini"
        )
        
        print(f"\n✅ Response: {response.content}")
        print("\n✅ SPOON LLM MANAGER TEST PASSED!")
        return True
        
    except Exception as e:
        print(f"\n❌ LLM Manager test failed: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    result = asyncio.run(test_llm_manager())
    sys.exit(0 if result else 1)

print("\n" + "=" * 50)
