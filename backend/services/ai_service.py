import os
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

client_B = OpenAI(
    api_key=os.getenv("OPENROUTER_API_KEY_B"),
    base_url="https://openrouter.ai/api/v1"
)

client_A = OpenAI(
    api_key=os.getenv("OPENROUTER_API_KEY_A"),
    base_url="https://openrouter.ai/api/v1"
)

def generate_response_A(prompt: str):
    try:
        print("prompt", prompt)
        response = client_A.chat.completions.create(
            model="openai/gpt-4o-mini",   # safe default model
            messages=[
                {"role": "system", "content": "You are an expert career advisor and resume expert."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            max_tokens=1000
        )
        print(response)

        return response.choices[0].message.content

    except Exception as e:
        print("error in ai")
        return f"Error: {str(e)}"


def generate_response_B(prompt: str):
    try:
        print("prompt", prompt)
        response = client_B.chat.completions.create(
            model="openai/gpt-4o-mini",   # safe default model
            messages=[
                {"role": "system", "content": "You are an expert career advisor and resume expert."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            max_tokens=1000
        )
        print(response)

        return response.choices[0].message.content

    except Exception as e:
        print("error in ai")
        return f"Error: {str(e)}"