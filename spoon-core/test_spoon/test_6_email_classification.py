"""
Test 6: Email Classification Test
Test phân loại email thực tế như trong ứng dụng
"""
import sys
import os
import asyncio
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

print("=" * 50)
print("TEST 6: Email Classification")
print("=" * 50)

async def test_email_classification():
    """Test email classification with Spoon OS"""
    try:
        from spoon_ai.llm import LLMManager, ConfigurationManager
        from spoon_ai.schema import Message, Role
        
        print("\n1. Creating LLM Manager...")
        config_manager = ConfigurationManager()
        llm_manager = LLMManager(config_manager)
        print("   ✅ LLM Manager created")
        
        # Test email
        test_email = """
        Subject: Meeting tomorrow at 3pm
        From: john@company.com
        
        Hi,
        
        Can we schedule a meeting tomorrow at 3pm to discuss the project?
        Let me know if that works for you.
        
        Thanks,
        John
        """
        
        # Classification prompt (from your aiService.ts)
        classification_prompt = f"""You are an email classification assistant. Analyze the following email and classify it into ONE of these categories:
- work: Professional emails, work-related correspondence
- personal: Personal messages, family, friends
- finance: Bills, invoices, bank statements, payment-related
- promotions: Marketing, advertisements, promotional offers
- social: Social media notifications, networking
- updates: System updates, newsletters, automated notifications
- spam: Unwanted or suspicious emails

Email to classify:
{test_email}

Respond with ONLY the category name (e.g., "work", "personal", etc.)."""

        print("\n2. Classifying email...")
        print(f"   Subject: Meeting tomorrow at 3pm")
        
        messages = [Message(role=Role.USER.value, content=classification_prompt)]
        
        response = await llm_manager.chat(
            messages=messages,
            provider="gemini"
        )
        
        classification = response.content.strip().lower()
        print(f"   ✅ Classification: {classification}")
        
        print("\n3. Testing task extraction...")
        task_prompt = f"""Extract actionable tasks from this email. Return a JSON array of tasks.

Email:
{test_email}

Return format: [{{"task": "task description", "priority": "high/medium/low"}}]"""

        messages = [Message(role=Role.USER.value, content=task_prompt)]
        
        response = await llm_manager.chat(
            messages=messages,
            provider="gemini"
        )
        
        print(f"   ✅ Tasks extracted")
        print(f"   {response.content[:200]}...")
        
        print("\n✅ EMAIL CLASSIFICATION TEST PASSED!")
        return True
        
    except Exception as e:
        print(f"\n❌ Email classification test failed: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    result = asyncio.run(test_email_classification())
    sys.exit(0 if result else 1)

print("\n" + "=" * 50)
