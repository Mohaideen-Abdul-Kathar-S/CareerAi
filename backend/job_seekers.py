
import json
import os
import certifi
from openai import OpenAI
import requests
from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from pypdf import PdfReader
from dotenv import load_dotenv

load_dotenv()

import json
import re

def clean_ai_response(ai_text: str):
    try:
        # 1️⃣ Remove leading "json" if present
        cleaned = ai_text.strip()

        if cleaned.startswith("json"):
            cleaned = cleaned.replace("json", "", 1).strip()

        # 2️⃣ Parse JSON safely
        data = json.loads(cleaned)

        # 3️⃣ Extract ats_score and clean it
        ats_raw = data.get("analysis_result", {}).get("ats_score", "0")

        # Remove % if exists
        ats_number = int(re.sub(r"[^\d]", "", ats_raw))

        # 4️⃣ Return clean structured response
        return {
            "ats_score": ats_number,
            "skills_required": data.get("skills_required", []),
            "skills_you_have": data.get("skills_you_have", []),
            "skills_to_improve": data.get("skills_to_improve", []),
            "suggestions": data.get("suggestions", [])
        }

    except Exception as e:
        print("Error parsing AI response:", e)
        return {
            "ats_score": 0,
            "skills_required": [],
            "skills_you_have": [],
            "skills_to_improve": [],
            "suggestions": ["Error processing AI response."]
        }

def extract_text_from_pdf(file):
    reader = PdfReader(file)
    text = ""
    for page in reader.pages:
        extracted = page.extract_text()
        if extracted:
            text += extracted + "\n"
    return text


def analyze_skill_gap(resume_text, job_description=None, job_role=None):

    comparison_target = ""

    if job_description:
        comparison_target += f"\nJob Description:\n{job_description}\n"

    if job_role:
        comparison_target += f"\nJob Role:\n{job_role}\n"

    prompt = f"""
    You are a professional ATS (Applicant Tracking System) analyzer.

    Analyze the resume against the job description or job role.

    Resume:
    {resume_text}

    {comparison_target}

    Return ONLY valid JSON in this exact format:

    {{
        "analysis_result": {{
            "ats_score": "0-100%"
        }},
        "skills_required": [],
        "skills_you_have": [],
        "skills_to_improve": [],
        "suggestions": []
    }}
    """

    ai_text = generate_response(prompt)

    # If API failed
    if ai_text.startswith("Error:"):
        raise HTTPException(status_code=500, detail=ai_text)

    try:
        # Remove markdown formatting if model adds ```
        if "```" in ai_text:
            ai_text = ai_text.split("```")[1]

        return clean_ai_response(ai_text)

    except Exception:
        return {"raw_response": ai_text}



client = OpenAI(
    api_key=os.getenv("OPENROUTER_API_KEY_B"),
    base_url="https://openrouter.ai/api/v1"
)

def generate_response(prompt: str):
    try:
        response = client.chat.completions.create(
            model="openai/gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are an expert career advisor and resume expert."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            max_tokens=1000
        )

        return response.choices[0].message.content

    except Exception as e:
        return f"Error: {str(e)}"
