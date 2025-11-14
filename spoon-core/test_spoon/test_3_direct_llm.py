"""
Test 3: Simple LLM Call Test
Test gọi Gemini API trực tiếp (không qua LLM Manager)
"""
import sys
import os
import asyncio
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

print("=" * 50)
print("TEST 3: Simple LLM Call (Direct)")
print("=" * 50)

GEMINI_API_KEY = "AIzaSyAl9P_ydHYwRyNVHaiB1_LLIEhAL5su70Y"
GEMINI_MODEL = "gemini-2.0-flash"

async def test_direct_gemini():
    """Test Gemini API directly without Spoon framework"""
    import json
    
    try:
        # Use requests instead of spoon_ai
        import requests
        
        url = f"https://generativelanguage.googleapis.com/v1beta/models/{GEMINI_MODEL}:generateContent?key={GEMINI_API_KEY}"
        
        prompt = "Say 'Hello from Gemini!' in one sentence."
        
        print(f"\n1. Testing Gemini API directly...")
        print(f"   Model: {GEMINI_MODEL}")
        print(f"   Prompt: {prompt}")
        
        response = requests.post(
            url,
            headers={"Content-Type": "application/json"},
            json={
                "contents": [{
                    "parts": [{
                        "text": prompt
                    }]
                }]
            }
        )
        
        if response.status_code == 200:
            data = response.json()
            text = data['candidates'][0]['content']['parts'][0]['text']
            print(f"\n✅ Response: {text}")
            print("\n✅ DIRECT GEMINI TEST PASSED!")
            return True
        else:
            print(f"\n❌ API error: {response.status_code}")
            print(response.text)
            return False
            
    except Exception as e:
        print(f"\n❌ Direct test failed: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    result = asyncio.run(test_direct_gemini())
    sys.exit(0 if result else 1)

print("\n" + "=" * 50)
