from typing import Any, Dict
import fitz
import os
from collections import Counter
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from rank_bm25 import BM25Okapi
import numpy as np
import gensim.downloader as api
from gensim.models import KeyedVectors
from sentence_transformers import SentenceTransformer


# ==============================
# 1️⃣ Sentence Transformer Model
# ==============================

semantic_model = SentenceTransformer('all-MiniLM-L6-v2')

def calculate_semantic_similarity(text1, text2):
    embeddings = semantic_model.encode([text1, text2])
    similarity = cosine_similarity(
        [embeddings[0]],
        [embeddings[1]]
    )[0][0]
    return round(similarity * 100, 2)

# ==============================
# 2️⃣ Word2Vec Model (Load your pretrained model)
# ==============================

word2vec_model = api.load("glove-wiki-gigaword-100")

def get_sentence_vector(text, model):
    words = text.lower().split()
    vectors = []

    for word in words:
        if word in model:
            vectors.append(model[word])

    if len(vectors) == 0:
        return np.zeros(model.vector_size)

    return np.mean(vectors, axis=0)

def calculate_word2vec_similarity(text1, text2):
    vec1 = get_sentence_vector(text1, word2vec_model)
    vec2 = get_sentence_vector(text2, word2vec_model)

    similarity = cosine_similarity([vec1], [vec2])[0][0]

    return round(similarity * 100, 2)

# ==============================
# 4️⃣ Skill Match Score
# ==============================


def calculate_skill_match(resume, jd):
    resume_words = set(resume.lower().split())
    jd_words = set(jd.lower().split())

    common_skills = resume_words.intersection(jd_words)

    if len(jd_words) == 0:
        return 0

    score = (len(common_skills) / len(jd_words)) * 100
    return round(score, 2)



def analyze_resume_vs_job(df, job_description):

    all_text, visible_text, invisible_text = get_resume_versions(df)



    print("\n📊 Resume Analysis Result")
    print("----------------------------------")
    # print(f"Output 1 - All Text Match        : {score_all}%")
    # print(f"Output 2 - Visible Text Match    : {score_visible}%")
    # print(f"Output 3 - Invisible Text Match  : {score_invisible}%")

    # # 🚨 Major Condition
    # if score_invisible >= 3:
    #     print("\n⚠ WARNING:")
    #     print("Resume contains hidden keyword matching.")
    #     print("Consider making hidden content visible or removing it.")


  
    semantic_score_visible_text = calculate_semantic_similarity(visible_text, job_description)
    semantic_score_invisible_text = calculate_semantic_similarity(invisible_text, job_description)


    skill_score_visible_text = calculate_skill_match(visible_text, job_description)
    skill_score_invisible_text = calculate_skill_match(invisible_text, job_description)

    word2vec_score_visible_text  = calculate_word2vec_similarity(visible_text, job_description)
    word2vec_score_invisible_text = calculate_word2vec_similarity(visible_text, job_description)

    final_score_visible = (
    0.6 * semantic_score_visible_text + 
    0.25 * word2vec_score_visible_text + 
    0.15 * skill_score_visible_text
)
    final_score_invisible = (
    0.6 * semantic_score_invisible_text + 
    0.25 * word2vec_score_invisible_text + 
    0.15 * skill_score_invisible_text
)

    

    # print("Semantic Similarity Score(V):", semantic_score_visible_text, "%")
    # print("Semantic Similarity Score(I):", semantic_score_invisible_text, "%")
    # print("Skill Match Score(V):", skill_score_visible_text, "%")
    # print("Skill Match Score(I):", skill_score_invisible_text, "%")
    # print("Word2Vec Score:(V)", word2vec_score_visible_text, "%")
    # print("Word2Vec Score:(I)", word2vec_score_invisible_text, "%")
    # print("Final Hybrid Score:", round(final_score, 2), "%")

    return final_score_visible, final_score_invisible 


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

def get_resume_versions(df):

    all_text = " ".join(df["Text"].astype(str))

    visible_text = " ".join(
        df[df["Visible"] == True]["Text"].astype(str)
    )

    invisible_text = " ".join(
        df[df["Visible"] == False]["Text"].astype(str)
    )

    return all_text, visible_text, invisible_text


def extract_text_with_highlight(resume, output_file="output.txt"):

    # if not os.path.exists(pdf_path):
    #     print("File not found!")
    #     return

    # doc = fitz.open(pdf_path)
    pdf_bytes = resume.file.read()  # read bytes from UploadFile
    doc = fitz.open(stream=pdf_bytes, filetype="pdf")

    rows = []  # ✅ use list instead of DataFrame

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
                        # Write to file
                        f.write("--------------------------------\n")
                        f.write(f"Text          : {text}\n")
                        f.write(f"Font Size     : {font_size}\n")
                        f.write(f"RGB           : ({r}, {g}, {b})\n")
                        f.write(f"Highlight     : {highlight_rgb}\n\n")
                        f.write(f"Contrast Ratio : {round(ratio,2)}\n")
                        f.write(f"Visible        : {visible_status}\n\n")


                        visible_status, ratio = is_text_visible(
                            (r, g, b),
                            highlight_rgb,
                            font_size
                        )

                        rows.append({
                            "Text": text,
                            "Font Size": font_size,
                            "Text_RGB": (r, g, b),
                            "Background_RGB": highlight_rgb,
                            "Contrast_Ratio": round(ratio, 2),
                            "Visible": visible_status
                        })

    doc.close()

    # ✅ Convert list to DataFrame
    df = pd.DataFrame(rows)

    # ✅ Save CSV
    df.to_csv("output_dataframe.csv", index=False)

    print("✅ Output written to output.txt")
    print("✅ DataFrame saved as output_dataframe.csv")

    return df


def analyze_resume_format(pdf_file) -> float:
    """
    Analyze PDF resume formatting and return a 'format score'.
    Score is based on:
    - font consistency
    - font size consistency
    - alignment consistency
    """

    # Read PDF
    pdf_bytes = pdf_file.file.read()
    pdf_file.file.seek(0)
    doc = fitz.open(stream=pdf_bytes, filetype="pdf")

    font_sizes = []
    font_names = []
    x_positions = []

    for page in doc:
        blocks = page.get_text("dict")["blocks"]
        for block in blocks:
            if "lines" in block:
                for line in block["lines"]:
                    for span in line["spans"]:
                        font_sizes.append(span["size"])
                        font_names.append(span["font"])
                        x_positions.append(span["bbox"][0])  # x0 of text = horizontal start

    pdf_file.seek(0)  # reset pointer

    # -----------------------------
    # 1️⃣ Font size consistency
    # -----------------------------
    size_counter = Counter(font_sizes)
    most_common_size_count = size_counter.most_common(1)[0][1] if size_counter else 0
    font_size_score = (most_common_size_count / len(font_sizes)) * 100 if font_sizes else 0

    # -----------------------------
    # 2️⃣ Font name consistency
    # -----------------------------
    font_counter = Counter(font_names)
    most_common_font_count = font_counter.most_common(1)[0][1] if font_counter else 0
    font_name_score = (most_common_font_count / len(font_names)) * 100 if font_names else 0

    # -----------------------------
    # 3️⃣ Alignment consistency
    # -----------------------------
    # Approximate alignment: texts starting at similar x positions are aligned
    if x_positions:
        alignment_std = np.std(x_positions)
        # Smaller std = better alignment
        alignment_score = max(0, 100 - alignment_std*10)  # scale to 0-100
    else:
        alignment_score = 0

    # -----------------------------
    # 4️⃣ Combine scores
    # -----------------------------
    # Weight: font size 40%, font name 30%, alignment 30%
    format_score = 0.4 * font_size_score + 0.3 * font_name_score + 0.3 * alignment_score

    consolidated_score = 0.4 * font_size_score + 0.3 * font_name_score + 0.3 * alignment_score
    return round(consolidated_score, 2)

# if __name__ == "__main__":
#     pdf_path = input("Enter full PDF path: ").strip()
#     job_description = """
# About the Role
# We are looking for a skilled Backend Developer to join our engineering team. You will be responsible for designing, developing, and maintaining scalable server-side applications, APIs, and database systems that power our products. You’ll collaborate closely with frontend developers, product managers, and DevOps engineers to deliver high-quality software solutions.

# Key Responsibilities
# Design, build, and maintain efficient, reusable, and reliable backend systems

# Develop and maintain RESTful APIs and microservices

# Optimize applications for maximum speed and scalability

# Implement data storage solutions (SQL and NoSQL databases)

# Ensure security, authentication, and data protection standards

# Write clean, maintainable, and well-documented code

# Perform code reviews and mentor junior developers

# Troubleshoot and debug production issues

# Collaborate in agile development processes

# Required Qualifications
# Bachelor’s degree in Computer Science, Engineering, or related field (or equivalent experience)

# 3+ years of backend development experience

# Strong proficiency in at least one backend language such as:

# Python

# Java

# Node.js

# Go

# Experience with frameworks such as:

# Django

# Spring Boot

# Express.js

# Strong knowledge of databases like:

# PostgreSQL

# MySQL

# MongoDB

# Familiarity with version control systems such as Git

# Understanding of cloud platforms (e.g., Amazon Web Services, Google Cloud Platform, Microsoft Azure)

# Experience with containerization tools like Docker

# Preferred Qualifications
# Experience with CI/CD pipelines

# Knowledge of distributed systems and microservices architecture

# Familiarity with message brokers (e.g., Kafka, RabbitMQ)

# Experience in performance tuning and monitoring

# Exposure to DevOps practices
# """

#     df = extract_text_with_highlight(pdf_path)

#     analyze_resume_vs_job(df, job_description)


    