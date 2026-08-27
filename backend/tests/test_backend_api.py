import os
import sys
ROOT_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
if ROOT_DIR not in sys.path:
    sys.path.insert(0, ROOT_DIR)

import pytest
from fastapi.testclient import TestClient
from backend.app.main import app

client = TestClient(app)

def test_health_endpoint():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}

def test_get_properties():
    response = client.get("/api/properties")
    assert response.status_code == 200
    properties = response.json()
    assert len(properties) >= 1
    assert "askingPriceLakhs" in properties[0]
    assert "fairValueLakhs" in properties[0]

def test_get_properties_filtered():
    response = client.get("/api/properties?location=Whitefield&bhk=2")
    assert response.status_code == 200
    properties = response.json()
    assert isinstance(properties, list)

def test_search_and_compare_flow():
    # 1. Search matching properties
    search_payload = {
        "locality": "Whitefield",
        "min_budget": 25.0,
        "max_budget": 95.0,
        "property_type": "Residential",
        "bhk": 2,
        "goal": "Capital Appreciation",
        "risk": "Moderate",
        "holding_period": "3–5 years"
    }
    search_res = client.post("/api/comparisons/search", json=search_payload)
    assert search_res.status_code == 200
    candidates = search_res.json()
    assert len(candidates) >= 1

    # 2. Compare 2 properties
    prop_ids = [candidates[0]["id"]]
    if len(candidates) > 1:
        prop_ids.append(candidates[1]["id"])
    
    compare_res = client.post("/api/properties/compare", json={"property_ids": prop_ids, "criteria": search_payload})
    assert compare_res.status_code == 200
    cmp_data = compare_res.json()
    assert "top_pick" in cmp_data
    assert "comparison_table" in cmp_data
    assert len(cmp_data["reasoning"]) >= 1

    # 3. Save comparison
    save_payload = {
        "title": "Test Whitefield Comparison",
        "criteria": search_payload,
        "selected_property_ids": prop_ids,
        "comparison_results": cmp_data,
        "top_pick": cmp_data["top_pick"]["title"],
        "recommendation": cmp_data["recommendation"],
        "reasoning": cmp_data["reasoning"]
    }
    save_res = client.post("/api/comparisons", json=save_payload)
    assert save_res.status_code == 200
    saved_obj = save_res.json()
    cmp_id = saved_obj["id"]
    assert cmp_id.startswith("cmp-")

    # 4. List saved comparisons
    list_res = client.get("/api/comparisons")
    assert list_res.status_code == 200
    saved_list = list_res.json()
    assert any(item["id"] == cmp_id for item in saved_list)

    # 5. Get saved comparison detail
    detail_res = client.get(f"/api/comparisons/{cmp_id}")
    assert detail_res.status_code == 200
    assert detail_res.json()["id"] == cmp_id

    # 6. Delete saved comparison
    del_res = client.delete(f"/api/comparisons/{cmp_id}")
    assert del_res.status_code == 200
    assert del_res.json()["status"] == "success"

    # 7. Verify deletion
    verify_res = client.get(f"/api/comparisons/{cmp_id}")
    assert verify_res.status_code == 404

def test_analyze_endpoint():
    payload = {
        "location": "Whitefield",
        "sqft": 1350.0,
        "bhk": 2,
        "bathrooms": 2.0,
        "asking_price_lakhs": 65.0
    }
    response = client.post("/api/analyze", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "fair_value_lakhs" in data
    assert "monthly_rent" in data
    assert "annual_yield" in data
    assert "deal_status" in data
    assert "risk_radar" in data

def test_advisor_chat_endpoint():
    payload = {
        "message": "Is Whitefield good for rental income?",
        "context": {
            "location": "Whitefield",
            "asking_price_lakhs": 55.0
        }
    }
    response = client.post("/api/advisor/chat", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "reply" in data
    assert len(data["reply"]) > 10
    assert "sources" in data
