import smtplib
import os
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from dotenv import load_dotenv

load_dotenv()

EMAIL_USER = os.getenv("EMAIL_USER")
EMAIL_PASS = os.getenv("EMAIL_PASS")


def send_mail(filtered_results):
    if not filtered_results:
        print("No users to send mail.")
        return

    server = None
    try:
        server = smtplib.SMTP("smtp.gmail.com", 587, timeout=10)
        server.starttls()
        server.login(EMAIL_USER, EMAIL_PASS)
    except Exception as e:
        print(f"Failed to connect or login to SMTP server: {e}")
        return

    try:
        for user in filtered_results:
            receiver_email = user["mail"]
            missing_skills = ", ".join(user["skills_missing"])
            improvements = "\n".join(user["improvement_suggestions"])

            subject = "Resume Analysis - Improvement Suggestions"

            body = f"""
Hello,

Your resume needs improvement based on our analysis.

Missing Skills:
{missing_skills}

Improvement Suggestions:
{improvements}

Please update your resume and resubmit.

Best Regards,
Resume Analyzer Team
"""

            msg = MIMEMultipart()
            msg["From"] = EMAIL_USER
            msg["To"] = receiver_email
            msg["Subject"] = subject
            msg.attach(MIMEText(body, "plain"))

            try:
                server.sendmail(EMAIL_USER, receiver_email, msg.as_string())
                print(f"Mail sent to {receiver_email}")
            except Exception as e:
                print(f"Failed to send mail to {receiver_email}: {e}")
    finally:
        if server:
            try:
                server.quit()
            except:
                pass
