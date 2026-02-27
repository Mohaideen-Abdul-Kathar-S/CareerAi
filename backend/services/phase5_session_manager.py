import uuid
from datetime import datetime, timedelta

sessions = {}


def create_session(resume_text, role, duration_minutes):
    session_id = str(uuid.uuid4())

    sessions[session_id] = {
        "resume_text": resume_text,
        "role": role,
        "history": [],
        "start_time": datetime.utcnow(),
        "end_time": datetime.utcnow() + timedelta(minutes=duration_minutes),
        "active": True,
    }

    return session_id


def get_session(session_id):
    return sessions.get(session_id)


def is_time_over(session):
    return datetime.utcnow() >= session["end_time"]


def end_session(session_id):
    if session_id in sessions:
        sessions[session_id]["active"] = False
