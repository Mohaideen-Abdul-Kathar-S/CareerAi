from typing import List, Optional
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from db import auth_collection
from pypdf import PdfReader
from dotenv import load_dotenv
from job_seekers import analyze_skill_gap
from resume_screening import Invisible_extract_text_with_highlight, analyze_resume_with_ai, fetch_required_skills_from_role
import http.client

from routes import phase1,phase2,phase3,phase4,phase5,phase6


load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5174",
    ],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(phase1.router, prefix="/phase1")
app.include_router(phase2.router, prefix="/phase2")
app.include_router(phase3.router, prefix="/phase3")
app.include_router(phase4.router, prefix="/phase4")
app.include_router(phase5.router, prefix="/interview")
app.include_router(phase6.router, prefix="/payment")

def extract_text_from_pdf(file_obj) -> str:
    """Extract text from a PDF file-like object. Raises HTTPException on failure."""
    try:
        # Ensure we're at the beginning
        try:
            file_obj.seek(0)
        except Exception:
            pass

        reader = PdfReader(file_obj)
        texts = []
        for page in reader.pages:
            page_text = page.extract_text()
            if page_text:
                texts.append(page_text)

        return "\n".join(texts).strip()
    except Exception as exc:
        raise HTTPException(status_code=400, detail=f"Failed to read PDF: {exc}")


@app.post("/analyze")
async def analyze_resume(email:str,
    resume: UploadFile = File(...),
    job_description: Optional[str] = Form(None),
    job_role: Optional[str] = Form(None),
):

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

    # Validate at least JD or role provided
    if not job_description and not job_role:
        raise HTTPException(status_code=400, detail="Provide either job_description or job_role")

    # Basic content-type check
    if resume.content_type and "pdf" not in resume.content_type.lower():
        raise HTTPException(status_code=400, detail="Only PDF resumes are supported")

    resume_text = extract_text_from_pdf(resume.file)

    result = analyze_skill_gap(resume_text, job_description=job_description, job_role=job_role)
    auth_collection.update_one(
        {"email": email},
        {"$inc": {"freemium_count": 1}}
    )
    print(result)
    return {"analysis": result}

@app.post("/analyze-resumes")
async def resumes_screening(email:str,
    resumes: List[UploadFile] = File(...),
    job_description: Optional[str] = Form(None),
    job_role: Optional[str] = Form(None)
):

    # user = auth_collection.find_one({"email": email})
    
    # if not user:
    #     # If user doesn't exist, create them with 0 count
    #     auth_collection.update_one(
    #         {"email": email},
    #         {"$setOnInsert": {"email": email, "freemium_count": 0, "ispremium": False}},
    #         upsert=True
    #     )
    #     user = {"freemium_count": 0, "ispremium": False}

    # # 2. Check if limit reached
    # # Limit is set to 3 for free users
    # if user.get("b2blicence", "no") == "no":
    #     raise HTTPException(
    #         status_code=403, 
    #         detail="Please buy the B2B Licence for Accessing this feature."
    #     )

    if not job_description and not job_role:
        raise HTTPException(
            status_code=400,
            detail="Provide either job_description or job_role"
        )

    # If role given → fetch required skills using AI
    if job_role:
        required_skills = fetch_required_skills_from_role(job_role)
        job_text = f"Job Role: {job_role}\nRequired Skills: {', '.join(required_skills)}"
    else:
        job_text = job_description

    results = []

    

    for resume in resumes:
        resume.file.seek(0)
        resume_text = extract_text_from_pdf(resume.file)
        # print(resume_text)
        # print()
        
        resume.file.seek(0)
        hidden = Invisible_extract_text_with_highlight(resume.file)
        
        analysis = analyze_resume_with_ai(resume_text, job_text)

        results.append({
            "resume_name": resume.filename,
            "analysis": analysis,
            "hidden" : hidden
        })

    return results



class UserEmail(BaseModel):
    email: EmailStr
    
class EmailRequest(BaseModel):
    email: EmailStr

class B2BLicenceRequest(EmailRequest):
    b2blicence: str

class PremiumRequest(EmailRequest):
    ispremium: bool

# ----- APIs -----

@app.post("/register-email")
def register_email(user: UserEmail):

    result = auth_collection.update_one(
        {"email": user.email},
        {
            "$setOnInsert": {
                "email": user.email,
                "freemium_count": 0,
                "ispremium": False,
                "b2blicence": "no"
            }
        },
        upsert=True
    )

    if result.upserted_id:
        return {"message": "User created successfully"}
    else:
        return {"message": "User already exists"}


# 1️⃣ Add or update B2B licence
@app.post("/add-b2blicence")
def add_b2blicence(req: B2BLicenceRequest):
    result = auth_collection.update_one(
        {"email": req.email},
        {"$set": {"b2blicence": req.b2blicence}},
        upsert=False  # Only update existing user
    )

    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="User not found")

    return {"message": f"B2B licence updated to '{req.b2blicence}' for {req.email}"}


# 2️⃣ Update ispremium
@app.post("/update-ispremium")
def update_ispremium(req: PremiumRequest):
    result = auth_collection.update_one(
        {"email": req.email},
        {"$set": {"ispremium": req.ispremium}},
        upsert=False
    )

    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="User not found")

    return {"message": f"ispremium updated to {req.ispremium} for {req.email}"}


# 3️⃣ Increment freemium_count
@app.post("/increment-freemium")
def increment_freemium(req: EmailRequest):
    result = auth_collection.update_one(
        {"email": req.email},
        {"$inc": {"freemium_count": 1}},
        upsert=False
    )

    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="User not found")

    return {"message": f"freemium_count incremented by 1 for {req.email}"}


@app.post("/updateb2b")
def b2b_licence(email: str, b2blicence: str):
    result = auth_collection.update_one(
        {"email": email},
        {"$set": {"b2blicence": b2blicence}},
        upsert=False  # Only update existing user
    )

    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="User not found")

    return {"message": f"B2B licence updated to '{b2blicence}' for {email}"}
    
@app.get('/')
def Welcome():
    return {"Greeting": "Welcome"}



# @app.post("/btn4_resume_JD")
# async def btn4(resume: UploadFile,resume2: UploadFile, JD: str = Form(...)) -> Dict[str, Any]:
#     """
#     Endpoint to analyze resume vs JD
#     Returns invisible text + final scores
#     """
#     # 1️⃣ Extract text with visibility info
#     df = extract_text_with_highlight(resume)

#     # 2️⃣ Compute final scores
#     final_score_visible, final_score_invisible = analyze_resume_vs_job(df, JD)
#     ATS_score = analyze_resume_format(resume2)

#         # Convert numpy types to native Python float
#     final_score_visible = float(final_score_visible)
#     final_score_invisible = float(final_score_invisible)

#     # 3️⃣ Get invisible text
#     invisible_text = ", ".join(df[df["Visible"] == False]["Text"].tolist())

#     # Replace multiple commas (with optional spaces between them) with single comma
#     cleaned_text = re.sub(r',\s*,+', ',', invisible_text)

#     # Also clean extra spaces around commas
#     cleaned_text = re.sub(r'\s*,\s*', ', ', cleaned_text)

#     # Remove trailing comma if exists
#     cleaned_text = cleaned_text.strip().rstrip(',')

#     return {
#         "invisible_text": cleaned_text,
#         "final_score_visible": round(final_score_visible,2),
#         "final_score_invisible": final_score_invisible,
#         "ATS Score" : ATS_score
#     }
