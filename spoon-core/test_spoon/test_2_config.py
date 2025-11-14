"""
Test 2: Configuration Test
Kiểm tra cấu hình LLM providers
"""
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

print("=" * 50)
print("TEST 2: Configuration Test")
print("=" * 50)

try:
    from spoon_ai.llm import ConfigurationManager
    
    print("\n1. Creating ConfigurationManager...")
    config_manager = ConfigurationManager()
    print("   ✅ ConfigurationManager created")
    
    print("\n2. Checking providers...")
    providers = config_manager.get_available_providers_by_priority()
    print(f"   Found {len(providers)} providers:")
    for provider_name in providers:
        print(f"   - {provider_name}")
    
    print("\n3. Getting provider info...")
    provider_info = config_manager.get_provider_info()
    for name, info in provider_info.items():
        print(f"   {name}:")
        print(f"      Model: {info.get('model', 'N/A')}")
        print(f"      Max Tokens: {info.get('max_tokens', 'N/A')}")
    
    print("\n4. Getting default provider...")
    default = config_manager.get_default_provider()
    print(f"   Default provider: {default}")
    
    print("\n✅ CONFIGURATION TEST PASSED!")
    
except Exception as e:
    print(f"\n❌ Configuration test failed: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)

print("\n" + "=" * 50)
