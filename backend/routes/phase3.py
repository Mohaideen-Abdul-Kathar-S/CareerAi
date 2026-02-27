from fastapi import APIRouter, HTTPException
from models.schemas import CompanyRoleRequest
from services.ai_service import generate_response_A
import json
from db import auth_collection
router = APIRouter()

@router.post("/company-role-analysis")
def company_role_analysis(email: str,data: CompanyRoleRequest):


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
    Provide detailed preparation guidance for the role 
    '{data.job_role}' at the company '{data.company_name}'.

    Return STRICTLY in JSON format:

    {{
        "preparation_roadmap": [
            "Step 1",
            "Step 2"
        ],
        "preferred_skills_by_company": [
            "Skill1",
            "Skill2"
        ],
        "hiring_trends_in_company": [
            "Trend1",
            "Trend2"
        ],
        "future_prediction_5_years": "Detailed future prediction text"
    }}

    Do not include any extra text outside JSON.
    """

    result = generate_response_A(prompt)

    try:
        parsed_result = json.loads(result)
        auth_collection.update_one(
            {"email": email},
            {"$inc": {"freemium_count": 1}}
        )        
        return parsed_result
    except:
        return {"error": "AI response not valid JSON", "raw": result}
