from collections import Counter
from http import client
import json
import http.client

import fitz
import pandas as pd

from job_seekers import generate_response
from sendMail import send_mail


def clean_ai_json(content: str):
    content = content.strip()

    if content.startswith("```"):
        content = content.split("```")[1].strip()

    # Remove leading "json" if present
    if content.lower().startswith("json"):
        content = content[4:].strip()

    return content

def fetch_required_skills_from_role(job_role: str):

    prompt = f"""
    You are a hiring expert.

    For the job role: "{job_role}"

    Return ONLY JSON:

    {{
        "required_skills": []
    }}
    """

    response = generate_response(prompt)
    print(response)

    if response.startswith("Error:"):
        raise Exception(response)

    content = clean_ai_json(response)

    try:
        data = json.loads(content)
        return data.get("required_skills", [])
    except Exception:
        print("AI returned invalid JSON:", content)
        raise Exception("AI returned invalid JSON format")


def analyze_resume_with_ai(resume_text, job_text):

    prompt = f"""
    You are an advanced ATS system.

    Resume:
    {resume_text}

    Job Requirements:
    {job_text}

    Return ONLY valid JSON:

    {{
        "ats_score": 0,
        "skill_match_score": 0,
        "format_score": 0,
        "mail":string
        "skills_you_have": [],
        "skills_missing": [],
        "improvement_suggestions": []
    }}
    """

    response = generate_response(prompt)
    print(response)

    if response.startswith("Error:"):
        raise Exception(response)

    content = clean_ai_json(response)

    try:
        data = json.loads(content)
    except Exception:
        print("Invalid AI JSON:", content)
        raise Exception("AI returned invalid JSON format")

    # If the AI returns a dict with 'analysis' key, use that
    if isinstance(data, dict) and 'analysis' in data:
        data = data['analysis']
    
    # If it's a list, just take the first item
    if isinstance(data, list) and len(data) > 0:
        data = data[0]
        if isinstance(data, dict) and 'analysis' in data:
            data = data['analysis']

    # data should now be a dictionary with ats_score, etc.
    if isinstance(data, dict):
        if int(data.get("ats_score", 0)) < 50 or int(data.get("skill_match_score", 0)) < 50:
            filtered_results = [{
                "mail": data.get("mail", "").replace(" ", ''),
                "skills_missing": data.get("skills_missing", []),
                "improvement_suggestions": data.get("improvement_suggestions", [])
            }]
            try:
                send_mail(filtered_results)
            except Exception as e:
                print(f"Mail sending failed: {e}")

    return data


def rgb_from_int(color):
    return (color >> 16 & 255, color >> 8 & 255, color & 255)

def get_word_highlight_color(page, rect, text_rgb):
    pix = page.get_pixmap(dpi=200)
    width, height = pix.width, pix.height
    n = pix.n
    img = pix.samples

    zoom = 200 / 72

    x0 = int(rect.x0 * zoom)
    y0 = int(rect.y0 * zoom)
    x1 = int(rect.x1 * zoom)
    y1 = int(rect.y1 * zoom)

    mid_y0 = y0 + int((y1 - y0) * 0.35)
    mid_y1 = y0 + int((y1 - y0) * 0.65)

    colors = []

    for y in range(mid_y0, min(mid_y1, height)):
        for x in range(x0, min(x1, width)):
            idx = (y * width + x) * n
            r, g, b = img[idx], img[idx + 1], img[idx + 2]

            if abs(r - text_rgb[0]) < 20 and \
               abs(g - text_rgb[1]) < 20 and \
               abs(b - text_rgb[2]) < 20:
                continue

            colors.append((r, g, b))

    if colors:
        return Counter(colors).most_common(1)[0][0]
    else:
        return (255, 255, 255)
def relative_luminance(rgb):
    def convert(c):
        c = c / 255
        if c <= 0.03928:
            return c / 12.92
        else:
            return ((c + 0.055) / 1.055) ** 2.4

    r, g, b = rgb
    r_lin = convert(r)
    g_lin = convert(g)
    b_lin = convert(b)

    return 0.2126 * r_lin + 0.7152 * g_lin + 0.0722 * b_lin


def contrast_ratio(rgb1, rgb2):
    L1 = relative_luminance(rgb1)
    L2 = relative_luminance(rgb2)

    lighter = max(L1, L2)
    darker = min(L1, L2)

    return (lighter + 0.05) / (darker + 0.05)


def is_text_visible(text_rgb, bg_rgb, font_size):
    ratio = contrast_ratio(text_rgb, bg_rgb)

    # Rule 1: Very small font
    if font_size <= 5:
        return False, ratio

    # Rule 2: Very low contrast
    if ratio < 1.5:
        return False, ratio

    # Rule 3: Weak contrast
    if ratio < 3:
        return "Hard to See", ratio

    return True, ratio

def Invisible_extract_text_with_highlight(resume, output_file="output.txt"):

    # if not os.path.exists(pdf_path):
    #     print("File not found!")
    #     return

    # doc = fitz.open(pdf_path)
    pdf_bytes = resume.read()  # read bytes from UploadFile
    doc = fitz.open(stream=pdf_bytes, filetype="pdf")

    rows = []  # ✅ use list instead of DataFrame

    ls = []

    with open(output_file, "w", encoding="utf-8") as f:

        for page_number, page in enumerate(doc, start=1):

            blocks = page.get_text("dict")["blocks"]

            for block in blocks:
                if "lines" not in block:
                    continue

                for line in block["lines"]:
                    for span in line["spans"]:

                        text = span["text"]
                        if text.strip() == "":
                            continue
                        rect = fitz.Rect(span["bbox"])

                        r, g, b = rgb_from_int(span["color"])
                        font_size = span["size"]

                        highlight_rgb = get_word_highlight_color(
                            page, rect, (r, g, b)
                        )
                        visible_status, ratio = is_text_visible(
                            (r, g, b),
                            highlight_rgb,
                            font_size
                        )
                        


                        visible_status, ratio = is_text_visible(
                            (r, g, b),
                            highlight_rgb,
                            font_size
                        )

                        

                        if not visible_status:
                            ls.append(text)

    doc.close()


    return len(ls)>2 

