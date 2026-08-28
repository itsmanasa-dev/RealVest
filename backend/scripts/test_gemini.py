import os
import sys
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parent.parent.parent
sys.path.insert(0, str(ROOT_DIR))

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

from backend.app.core.config import settings

def test_gemini_connection():
    api_key = settings.GEMINI_API_KEY or os.getenv("GEMINI_API_KEY", "")
    req_model = settings.GEMINI_MODEL or "gemini-3.7-flash"

    print("==================================================")
    print("GEMINI CONNECTION TEST")
    print("==================================================")
    print(f"MODEL REQUESTED: {req_model}")
    print(f"API KEY PRESENT: {'YES (' + api_key[:6] + '...)' if api_key else 'NO'}")

    if not api_key:
        print("\n[WARNING] GEMINI_API_KEY is not set in environment or .env file.")
        print("Please add GEMINI_API_KEY=<your_gemini_key> to .env to run live test.")
        print("==================================================")
        return

    prompt = "What should a first-time property investor consider before buying a property?"
    print(f"\nREQUEST SENT: '{prompt}'")

    candidate_models = [req_model, "gemini-2.5-flash", "gemini-2.0-flash", "gemini-1.5-flash"]
    candidate_models = list(dict.fromkeys(candidate_models))

    from google import genai

    client = genai.Client(api_key=api_key)

    for m in candidate_models:
        try:
            print(f"Connecting to Google Gemini API using google-genai SDK ({m})...")
            response = client.models.generate_content(
                model=m,
                contents=prompt,
            )

            answer = response.text
            if answer:
                print(f"\n[SUCCESS] RESPONSE RECEIVED FROM GEMINI (Model: {m}):")
                print("--------------------------------------------------")
                print(answer)
                print("--------------------------------------------------")
                print("==================================================")
                return
        except Exception as e:
            print(f"  -> Model '{m}' returned error: {e}")

    print("\n==================================================")
    print("[ERROR] All Gemini model attempts failed.")
    print("==================================================")

if __name__ == "__main__":
    test_gemini_connection()
