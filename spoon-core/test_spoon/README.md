# Spoon OS Test Suite

## 🎯 Mục đích
Làm quen với Spoon OS từng bước một, test các tính năng cơ bản.

## ✅ Test Results Summary

| Test | Status | Description |
|------|--------|-------------|
| Test 1 | ✅ PASSED | Import spoon_ai modules successfully |
| Test 2 | ✅ PASSED | ConfigurationManager loads providers |
| Test 3 | ✅ PASSED | Direct Gemini API call works |
| Test 4 | ✅ PASSED | LLM Manager with Gemini works |
| Test 5 | ⚠️ PARTIAL | gemini_fast configured but not registered |
| Test 6 | ⚠️ RATE LIMITED | Hit 429 - need fallback! |

## 📝 Các Test Files

### Test 1: Import Test (`test_1_imports.py`) ✅
- Kiểm tra có import được spoon_ai modules không
- Test cơ bản nhất

**Run:**
```bash
cd spoon-core
python test_spoon/test_1_imports.py
```

**Result:** All imports successful, Spoon AI version: 0.3.0

### Test 2: Configuration Test (`test_2_config.py`) ✅
- Kiểm tra ConfigurationManager
- Xem có providers nào được cấu hình

**Run:**
```bash
python test_spoon/test_2_config.py
```

**Result:** Found 1 provider (gemini), default provider: gemini

### Test 3: Direct LLM Call (`test_3_direct_llm.py`) ✅
- Test gọi Gemini API trực tiếp (không qua Spoon framework)
- Đảm bảo API key hoạt động

**Run:**
```bash
python test_spoon/test_3_direct_llm.py
```

**Result:** Direct Gemini API call successful

### Test 4: LLM Manager Test (`test_4_llm_manager.py`) ✅
- Test LLM Manager của Spoon OS
- Gọi Gemini thông qua framework
- **Học được:** Messages phải là `Message` objects với `role` và `content`

**Run:**
```bash
python test_spoon/test_4_llm_manager.py
```

**Result:** LLM Manager works! Response: "Hello from Spoon OS!"

**Key Lesson:**
```python
from spoon_ai.schema import Message, Role

# ❌ WRONG: Plain dict
messages = [{"role": "user", "content": "Hello"}]

# ✅ CORRECT: Message objects
messages = [Message(role=Role.USER.value, content="Hello")]
```

### Test 5: Fallback Test (`test_5_fallback.py`) ⚠️
- Test multiple providers
- gemini_fast có config nhưng chưa registered

**Run:**
```bash
python test_spoon/test_5_fallback.py
```

**Result:** gemini works, gemini_fast configured but not registered in LLMManager

### Test 6: Email Classification (`test_6_email_classification.py`) ⚠️
- Test real email classification use case
- **Hit 429 RESOURCE_EXHAUSTED** - Rate limit!

**Run:**
```bash
python test_spoon/test_6_email_classification.py
```

**Result:** 429 error proves we need fallback mechanism!

## 🔑 Key Learnings

1. **Message Format**: Must use `Message(role=Role.USER.value, content="...")` not plain dicts
2. **Configuration**: Environment variables `PROVIDER_NAME_API_KEY`, `PROVIDER_NAME_MODEL` etc.
3. **LLM Manager**: Works well with `await llm_manager.chat(messages, provider="gemini")`
4. **Rate Limiting**: Hit 429 on Gemini - fallback is essential!
5. **Provider Registration**: Custom providers (gemini_fast) need explicit registration

## 📦 Dependencies Installed

```bash
python-dotenv
requests
openai
anthropic
google-genai
google-api-core
googleapis-common-protos
grpcio
tenacity
protobuf
```

## ⚙️ Configuration (.env)

```bash
# Gemini API Keys
GEMINI_API_KEY=AIzaSyAl9P_ydHYwRyNVHaiB1_LLIEhAL5su70Y
GEMINI_MODEL=gemini-2.0-flash
GEMINI_MAX_TOKENS=8192
GEMINI_TEMPERATURE=0.3
GEMINI_TIMEOUT=30

# Gemini Fast (Fallback)
GEMINI_FAST_API_KEY=AIzaSyBKoPjBKVzNd7bKpx-y4fr7ZNSEeeSd6Ao
GEMINI_FAST_MODEL=gemini-2.5-flash
GEMINI_FAST_MAX_TOKENS=8192
GEMINI_FAST_TEMPERATURE=0.3
GEMINI_FAST_TIMEOUT=30

DEFAULT_PROVIDER=gemini
```

## 🚀 Next Steps

1. **Register gemini_fast provider** - Learn how to register custom providers
2. **Implement fallback chain** - Setup proper fallback: gemini → gemini_fast
3. **Test rate limiting** - Verify fallback triggers on 429 errors
4. **Build email backend** - Apply learnings to email_backend/main.py
5. **Add monitoring** - Use Spoon OS metrics to track API usage

## 💡 Best Practices Discovered

- Always use `Message` objects, not dicts
- Config via environment variables is cleaner than code
- LLM Manager handles retries and errors automatically
- Rate limiting is real - test with realistic loads
- Provider registration needed for custom provider names
