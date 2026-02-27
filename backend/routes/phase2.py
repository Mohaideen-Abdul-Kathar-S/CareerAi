from fastapi import APIRouter, HTTPException
from models.schemas import JDRequest
from services.ai_service import generate_response_A
import json
from db import auth_collection
router = APIRouter()

@router.post("/analyze-jd")
def analyze_jd(email:str, data: JDRequest):

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
    Analyze the following job description:

    {data.job_description}

    Return STRICTLY in JSON format:

    {{
        "preparation_roadmap": [
            "Step 1",
            "Step 2"
        ],
        "technical_skills": [
            "Skill1",
            "Skill2"
        ],
        "soft_skills": [
            "Skill1",
            "Skill2"
        ],
        "ats_keywords": [
            "Keyword1",
            "Keyword2"
        ],
        "suggested_projects": [
            "Project idea 1",
            "Project idea 2"
        ],
        "interview_focus_areas": [
            "Topic 1",
            "Topic 2"
        ]
    }}

    Make the preparation roadmap very clear and step-by-step.
    Do not include any text outside JSON.
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
