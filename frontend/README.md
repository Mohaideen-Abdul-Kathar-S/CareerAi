# AI Resume Analysis & Preparation Hub

A full-stack application for resume analysis, interview preparation, and job matching.

## Project Structure

- `src/`: React + Vite frontend source code.
- `backend/`: FastAPI backend implementation.
- `complete/`: Root project configuration.

## Setup Instructions

### Frontend (Root Directory)

1.  **Install Dependencies:**
    ```powershell
    npm install
    ```
2.  **Environment Variables:**
    Create a `.env` file based on `.env.example`:
    ```env
    VITE_API_BASE_URL=http://localhost:8000
    ```
3.  **Run Development Server:**
    ```powershell
    npm run dev
    ```

### Backend (`/backend` Directory)

1.  **Navigate to Backend:**
    ```powershell
    cd backend
    ```
2.  **Create & Activate Virtual Environment:**
    ```powershell
    python -m venv venv
    .\venv\Scripts\activate
    ```
3.  **Install Dependencies:**
    ```powershell
    pip install -r requirements.txt
    ```
4.  **Environment Variables:**
    Create a `.env` file in the `backend/` folder based on `backend/.env.example`.
5.  **Run Backend Server:**
    ```powershell
    python app.py
    ```

## Features

- **Resume Analyzer**: Extract and analyze content from PDF resumes.
- **Smart Preparation Hub**: AI-driven interview and career prep.
- **Resume Screening**: Batch screening for candidates.
- **Career Domain Switch**: Guidance on transitioning between career paths.
- **Interactive Resume Editor**: Real-time editing and optimization.

## Technologies Used

- **Frontend**: React, Vite, Tailwind CSS, Lucide Icons.
- **Backend**: Python, FastAPI, OpenRouter (LLM integration).
- **Styling**: Modern, responsive UI with a premium dark/light mode aesthetic.
