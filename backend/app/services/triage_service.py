import os
import json
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))


def analyze_symptoms(symptoms: str):

    prompt = f"""
You are an AI medical triage assistant.

Analyze the following symptoms and return a structured medical triage report.

Symptoms:
{symptoms}

Return ONLY valid JSON in this exact format:

{{
  "risk_level": "Low | Moderate | High",
  "triage_category": "Self-care | Doctor Visit | Urgent Care | Emergency",
  "urgency": "Non-emergency | Urgent | Emergency",
  "key_symptoms_detected": ["symptom1","symptom2"],
  "possible_conditions": [
    {{
      "condition": "condition name",
      "probability": "Low | Medium | High",
      "reason": "short medical reasoning"
    }}
  ],
  "recommended_actions": ["action1","action2"],
  "red_flags": ["warning1","warning2"],
  "confidence_score": 0.0,
  "medical_disclaimer": "This AI tool provides informational guidance only and is not a substitute for professional medical advice."
}}
"""

    try:

        response = client.chat.completions.create(
            model="gpt-4o-mini",
            temperature=0.2,
            messages=[
                {"role": "system", "content": "You are a medical triage AI returning strict JSON."},
                {"role": "user", "content": prompt}
            ]
        )

        content = response.choices[0].message.content.strip()

        # Remove accidental markdown formatting if present
        content = content.replace("```json", "").replace("```", "").strip()

        result = json.loads(content)

        return result

    except Exception as e:

        print("LLM parsing error:", e)

        return {
            "risk_level": "Low",
            "triage_category": "Self-care",
            "urgency": "Non-emergency",
            "key_symptoms_detected": [],
            "possible_conditions": [],
            "recommended_actions": [],
            "red_flags": [],
            "confidence_score": 0,
            "medical_disclaimer": "AI analysis temporarily unavailable. Please consult a medical professional."
        }