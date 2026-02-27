from fastapi import APIRouter, HTTPException
from models.schemas import CareerSwitchRequest
from services.ai_service import generate_response_B
import json
from db import auth_collection
router = APIRouter()

@router.post("/career-switch")
def career_switch(email:str, data: CareerSwitchRequest):

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
    A person currently working as '{data.current_role}' 
    wants to switch to '{data.target_role}'.

    Provide response STRICTLY in JSON format:

    {{
        "transferable_skills": [
            "Skill1",
            "Skill2"
        ],
        "skill_gap": [
            "Missing Skill1",
            "Missing Skill2"
        ],
        "career_switch_roadmap": [
            "Step 1",
            "Step 2"
        ],
        "suggested_projects_for_transition": [
            "Project1",
            "Project2"
        ],
        "future_prediction_5_years": "Detailed future prediction"
    }}

    Do not include any text outside JSON.
    """

    result = generate_response_B(prompt)

    try:
        parsed_result = json.loads(result)
        auth_collection.update_one(
            {"email": email},
            {"$inc": {"freemium_count": 1}}
        )        
        print(parsed_result)
        return parsed_result
    except:
        return {"error": "AI response not valid JSON", "raw": result}
