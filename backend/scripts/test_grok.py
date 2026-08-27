import os
import sys
from pathlib import Path

# Add project root to sys.path
ROOT_DIR = Path(__file__).resolve().parent.parent.parent
sys.path.insert(0, str(ROOT_DIR))

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

from backend.app.core.config import settings


def test_grok_connection():
    api_key = settings.XAI_API_KEY or os.getenv("XAI_API_KEY", "")
    model = settings.GROK_MODEL or "grok-4.6"

    print("==================================================")
    print("XAI GROK 4.6 CONNECTION TEST")
    print("==================================================")
    print(f"Model Requested: {model}")
    print(f"API Key Present: {'YES (' + api_key[:5] + '...)' if api_key else 'NO'}")

    if not api_key:
        print("[WARNING] XAI_API_KEY is not set in environment or .env file.")
        print("Please add XAI_API_KEY=<your_xai_key> to .env to run live test.")
        print("==================================================")
        return False

    prompt = "What should a first-time property investor consider before buying a property?"
    print(f"\nTest Question: '{prompt}'\nSending request to xAI API (https://api.x.ai/v1)...")

    # Method 1: Try OpenAI client with base_url="https://api.x.ai/v1"
    try:
        from openai import OpenAI
        client = OpenAI(
            api_key=api_key,
            base_url="https://api.x.ai/v1"
        )
        response = client.chat.completions.create(
            model=model,
            messages=[
                {"role": "system", "content": "You are a helpful real estate advisor assistant."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.3,
            max_tokens=300
        )
        answer = response.choices[0].message.content
        print("\n[SUCCESS] Response received from Grok 4.6 (via OpenAI SDK):")
        print("--------------------------------------------------")
        print(answer)
        print("--------------------------------------------------")
        print("==================================================")
        return True
    except Exception as e:
        print(f"\n[OpenAI SDK Method Failed]: {str(e)}")

    # Method 2: Fallback to direct httpx POST to https://api.x.ai/v1/chat/completions
    try:
        import httpx
        url = "https://api.x.ai/v1/chat/completions"
        headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json"
        }
        payload = {
            "model": model,
            "messages": [
                {"role": "system", "content": "You are a helpful real estate advisor assistant."},
                {"role": "user", "content": prompt}
            ],
            "temperature": 0.3,
            "max_tokens": 300
        }
        with httpx.Client(timeout=30.0) as http_client:
            res = http_client.post(url, headers=headers, json=payload)
            res.raise_for_status()
            data = res.json()
            answer = data["choices"][0]["message"]["content"]
            print("\n[SUCCESS] Response received from Grok 4.6 (via httpx):")
            print("--------------------------------------------------")
            print(answer)
            print("--------------------------------------------------")
            print("==================================================")
            return True
    except Exception as e:
        print(f"\n[ERROR] Direct xAI HTTP API call failed: {str(e)}")
        print("==================================================")
        return False

if __name__ == "__main__":
    success = test_grok_connection()
    sys.exit(0 if success else 1)
