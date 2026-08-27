import os
import sys
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parent.parent.parent
sys.path.insert(0, str(ROOT_DIR))

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

from fastapi.testclient import TestClient

from backend.app.main import app

client = TestClient(app)

QUESTIONS = [
    ("What is RealVest?", {}),
    ("How does RealVest work?", {}),
    ("I have ₹50 lakh. Where should I invest in Bengaluru?", {}),
    ("Is Whitefield good for rental income?", {"location": "Whitefield"}),
    ("What can I buy with ₹30 lakh?", {}),
    ("Should I buy or rent?", {}),
    ("What are the biggest risks?", {}),
    ("Explain rental yield.", {}),
    ("Why was this property recommended?", {"property_id": "prop-1"}),
    ("Which property is better?", {"property_id": "prop-1"}),
    ("Compare these properties.", {"comparison_id": "cmp-1"}),
    ("Which area is better for investment?", {}),
    ("What should I check before buying?", {}),
    ("I want rental income. What should I consider?", {})
]

def verify_questions():
    print("==================================================")
    print("VERIFYING 14 BASELINE CHATBOT QUESTIONS")
    print("==================================================")

    passed = 0
    failed = 0

    for idx, (q, ctx) in enumerate(QUESTIONS, 1):
        payload = {"message": q, "context": ctx}
        res = client.post("/api/advisor/chat", json=payload)

        if res.status_code == 200:
            data = res.json()
            reply = data.get("reply", "")
            sources = data.get("sources", [])
            success = data.get("success", False)

            if success and reply and len(reply) > 20:
                print(f"[{idx}/14] PASS: '{q}'")
                print(f"       Sources: {sources}")
                print(f"       Snippet: {reply[:100]}...\n")
                passed += 1
            else:
                print(f"[{idx}/14] FAIL (Invalid content): '{q}'")
                failed += 1
        else:
            print(f"[{idx}/14] FAIL (HTTP {res.status_code}): '{q}'")
            failed += 1

    print("==================================================")
    print(f"TOTAL TESTED: {len(QUESTIONS)} | PASSED: {passed} | FAILED: {failed}")
    print("==================================================")
    return failed == 0

if __name__ == "__main__":
    success = verify_questions()
    sys.exit(0 if success else 1)
