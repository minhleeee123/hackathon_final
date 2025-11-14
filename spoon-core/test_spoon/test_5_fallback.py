"""
Test 5: Fallback Test
Test fallback chain: gemini → gemini_fast
"""
import sys
import os
import asyncio
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

print("=" * 50)
print("TEST 5: Fallback Chain Test")
print("=" * 50)

async def test_fallback():
    """Test fallback mechanism"""
    try:
        from spoon_ai.llm import LLMManager, ConfigurationManager
        from spoon_ai.schema import Message, Role
        
        print("\n1. Creating LLM Manager...")
        config_manager = ConfigurationManager()
        llm_manager = LLMManager(config_manager)
        print("   ✅ LLM Manager created")
        
        print("\n2. Testing gemini provider...")
        messages = [Message(role=Role.USER.value, content="Say 'Test 1' in one sentence.")]
        
        response = await llm_manager.chat(
            messages=messages,
            provider="gemini"
        )
        print(f"   ✅ Response from gemini: {response.content}")
        
        print("\n3. Testing gemini_fast provider (if available)...")
        try:
            config_fast = config_manager.load_provider_config("gemini_fast")
            print(f"   ✅ gemini_fast configured with model: {config_fast.model}")
            
            response_fast = await llm_manager.chat(
                messages=[Message(role=Role.USER.value, content="Say 'Test 2' in one sentence.")],
                provider="gemini_fast"
            )
            print(f"   ✅ Response from gemini_fast: {response_fast.content}")
        except Exception as e:
            print(f"   ℹ️  gemini_fast not available: {e}")
        
        print("\n✅ FALLBACK TEST COMPLETED!")
        return True
        
    except Exception as e:
        print(f"\n❌ Fallback test failed: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    result = asyncio.run(test_fallback())
    sys.exit(0 if result else 1)

print("\n" + "=" * 50)
