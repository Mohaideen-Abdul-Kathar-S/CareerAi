from fastapi import APIRouter, HTTPException
from models.schemas import RoleRequest
from services.ai_service import generate_response_A
from db import auth_collection
import json

router = APIRouter()

@router.post("/role-roadmap")
def role_roadmap(email: str, data: RoleRequest):
    # 1. Check user status
    user = auth_collection.find_one({"email": email})
    
    if not user:
        # If user doesn't exist, create them with 0 count
        auth_collection.update_one(
            {"email": email},
            {"$setOnInsert": {"email": email, "freemium_count": 0, "ispremium": False}},
            upsert=True
        )
        user = {"freemium_count": 0, "ispremium": False}

    # 2. Check if limit reached
    # Limit is set to 3 for free users
    if not user.get("ispremium", False) and user.get("freemium_count", 0) >= 99:
        raise HTTPException(
            status_code=403, 
            detail="Free limit reached (3/3). Please upgrade to Premium for unlimited access."
        )

    prompt = f"""
    For the role: {data.role}

    Return the response STRICTLY in JSON format like this:

    {{
        "roadmap": "...",
        "required_skills": "...",
        "future_prediction": "..."
    }}

    Do not add any extra text outside JSON.
    """

    result = generate_response_A(prompt)

    try:
        parsed_result = json.loads(result)
        
        # 3. Increment count only on success
        auth_collection.update_one(
            {"email": email},
            {"$inc": {"freemium_count": 1}}
        )
        
        return parsed_result
    except:
        return {"error": "AI response not in valid JSON format", "raw": result}
