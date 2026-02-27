import json
import re

from fastapi import APIRouter, File, Form, UploadFile

from models.schemas import AnswerRequest, FinalReportRequest
from services.phase5_ai_service import generate_ai_response
from services.phase5_resume_parser import extract_text_from_pdf
from services.phase5_session_manager import (
    create_session,
    end_session,
    get_session,
    is_time_over,
)

router = APIRouter()


def _parse_ai_json_response(result: str):
    try:
        return json.loads(result)
    except Exception:
        pass

    match = re.search(r"\{[\s\S]*\}", result)
    if match:
        try:
            return json.loads(match.group(0))
        except Exception:
            return None
    return None


@router.post("/start")
async def start_interview(
    resume_file: UploadFile = File(...),
    role: str = Form(...),
    duration: int = Form(...),
):


    file_bytes = await resume_file.read()
    resume_text = extract_text_from_pdf(file_bytes)

    session_id = create_session(resume_text, role, duration)

    prompt = f"""
    You are conducting a professional technical interview.

    Role: {role}

    Candidate Resume:
    {resume_text}

    Ask the first question.
    Only return the question.
    """

    question = generate_ai_response(prompt)

    return {"session_id": session_id, "question": question}


@router.post("/next")
def next_question(data: AnswerRequest):
    session = get_session(data.session_id)

    if not session:
        return {"error": "Invalid session"}

    if not session["active"]:
        return {"message": "Interview already ended"}

    session["history"].append({"answer": data.answer})

    if is_time_over(session):
        end_session(data.session_id)
        return {"message": "TIME_OVER"}

    prompt = f"""
    Continue the interview for the role {session['role']}.

    Resume:
    {session['resume_text']}

    Previous Answers:
    {session['history']}

    Rules:
    - Do NOT end the interview.
    - Do NOT summarize.
    - Ask only ONE new question.
    - Ask a follow-up if needed.
    - Increase difficulty gradually.

    Return only the question.
    """

    question = generate_ai_response(prompt)

    return {"question": question}


@router.post("/final")
def final_report(data: FinalReportRequest):
    session = get_session(data.session_id)

    if not session:
        return {"error": "Invalid session"}

    end_session(data.session_id)

    prompt = f"""
    Analyze this complete interview.

    Role: {session['role']}
    Resume: {session['resume_text']}
    Answers: {session['history']}

    Return ONLY valid JSON (no markdown, no code fences, no extra text).

    Provide structured JSON:

    {{
        "overall_score": 0-100,
        "technical_score": 0-100,
        "communication_score": 0-100,
        "confidence_score": 0-100,
        "strengths": ["List clear strengths"],
        "weaknesses": ["List clear weaknesses"],
        "improvement_plan": ["List actionable improvements"],
        "final_summary_message": "Clear spoken summary"
    }}
    """

    result = generate_ai_response(prompt)

    parsed = _parse_ai_json_response(result)
    if parsed is not None:
        return parsed

    return {"error": "Could not parse AI JSON report", "raw_response": result}
