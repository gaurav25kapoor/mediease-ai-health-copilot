import os
import json
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# --------------------------------------------------
# SYSTEM PROMPT
# --------------------------------------------------

SYSTEM_PROMPT = """
You are MediEase AI Health Copilot.

You are an intelligent medical assistant integrated inside an AI healthcare platform.

Your job is to help users understand health information provided on the current page.

Capabilities:
• explain lab test values
• interpret disease risk predictions
• explain symptom triage results
• help users fill medical prediction forms
• provide educational medical guidance

Important Safety Rules:
• NEVER give a final medical diagnosis
• NEVER replace a medical professional
• Always provide educational explanations
• Encourage consulting healthcare professionals when necessary

Behavior Rules:

If the page is REPORT_ANALYZER:
- Explain lab values clearly
- Mention if values are Normal, Low, or High
- Explain possible implications
- Reference typical medical ranges when helpful

If the page is SYMPTOM_CHECKER:
- Explain symptom analysis
- Clarify possible causes
- Explain urgency and recommended actions

If the page is DISEASE_PREDICTION:
- Help users understand what medical fields mean
- Explain what value they should enter
- Give typical ranges if helpful

Your tone should be:
• professional
• medically accurate
• simple and understandable
"""

# --------------------------------------------------
# PAGE CONTEXT HELPERS
# --------------------------------------------------


def build_page_instructions(page: str | None):

    if page == "report_analyzer":
        return """
PAGE CONTEXT:
User is viewing a medical report analysis.

Focus on:
• explaining lab results
• explaining risk predictions
• explaining AI clinical insight
"""

    if page == "symptom_checker":
        return """
PAGE CONTEXT:
User has entered symptoms and received a triage analysis.

Focus on:
• explaining symptoms
• interpreting risk level
• explaining urgency
"""

    if page == "disease_prediction":
        return """
PAGE CONTEXT:
User is filling a disease risk prediction form.

Focus on:
• explaining medical fields
• guiding what values to enter
• explaining medical metrics
"""

    return """
PAGE CONTEXT:
General health assistant context.
"""


# --------------------------------------------------
# LAB VALUE FORMATTER
# --------------------------------------------------


def format_lab_values(labs: dict):

    text = "\nLAB VALUES:\n"

    for name, val in labs.items():

        value = val.get("value")
        status = val.get("status")
        ref = val.get("reference_range")

        text += f"""
{name}
Value: {value}
Status: {status}
Reference Range: {ref}
"""

    return text


# --------------------------------------------------
# PREDICTION FORMATTER
# --------------------------------------------------


def format_predictions(predictions: dict):

    text = "\nDISEASE PREDICTIONS:\n"

    for disease, data in predictions.items():

        status = data.get("status")

        if status == "skipped":
            text += f"""
{disease}:
Status: Skipped
Reason: {data.get("reason")}
"""
            continue

        prediction = data.get("prediction")
        probability = data.get("probability")
        coverage = data.get("feature_coverage")

        text += f"""
{disease}
Prediction: {"High Risk" if prediction == 1 else "Low Risk"}
Probability: {probability}%
Feature Coverage: {coverage}
"""

    return text


# --------------------------------------------------
# SYMPTOM FORMATTER
# --------------------------------------------------


def format_symptoms(symptoms):

    text = "\nUSER SYMPTOMS:\n"

    for s in symptoms:
        text += f"- {s}\n"

    return text


# --------------------------------------------------
# BUILD CONTEXT
# --------------------------------------------------


def build_context(
    question: str,
    page: str | None = None,
    labs: dict | None = None,
    predictions: dict | None = None,
    explanation: dict | None = None,
    symptoms: list | None = None,
    symptom_analysis: dict | None = None
):

    context = f"""
=========== MEDIEASE COPILOT CONTEXT ===========

USER QUESTION:
{question}

CURRENT PAGE:
{page}
"""

    context += build_page_instructions(page)

    # ---------------- LAB VALUES ----------------

    if labs:
        context += format_lab_values(labs)

    # ---------------- PREDICTIONS ----------------

    if predictions:
        context += format_predictions(predictions)

    # ---------------- RISK SUMMARY ----------------

    if explanation:

        risk_summary = explanation.get("risk_summary")

        if risk_summary:
            context += f"""

RISK SUMMARY
Overall Risk Score: {risk_summary.get("overall_risk_score")}
Risk Level: {risk_summary.get("risk_level")}
"""

    # ---------------- SYMPTOMS ----------------

    if symptoms:
        context += format_symptoms(symptoms)

    # ---------------- SYMPTOM ANALYSIS ----------------

    if symptom_analysis:

        context += f"""

SYMPTOM TRIAGE RESULT

Risk Level: {symptom_analysis.get("risk_level")}
Triage Category: {symptom_analysis.get("triage_category")}
Urgency: {symptom_analysis.get("urgency")}

Possible Conditions:
{symptom_analysis.get("possible_conditions")}

Recommended Actions:
{symptom_analysis.get("recommended_actions")}

Red Flags:
{symptom_analysis.get("red_flags")}
"""

    context += "\n===========================================\n"

    return context


# --------------------------------------------------
# MAIN COPILOT FUNCTION
# --------------------------------------------------


def run_copilot(
    question: str,
    page: str | None = None,
    labs: dict | None = None,
    predictions: dict | None = None,
    explanation: dict | None = None,
    symptoms: list | None = None,
    symptom_analysis: dict | None = None
):

    context = build_context(
        question=question,
        page=page,
        labs=labs,
        predictions=predictions,
        explanation=explanation,
        symptoms=symptoms,
        symptom_analysis=symptom_analysis
    )

    print("\n=========== COPILOT CONTEXT ===========")
    print(context)
    print("=======================================\n")

    try:

        response = client.chat.completions.create(
            model="gpt-4o-mini",
            temperature=0.3,
            messages=[
                {
                    "role": "system",
                    "content": SYSTEM_PROMPT
                },
                {
                    "role": "user",
                    "content": context
                }
            ]
        )

        return response.choices[0].message.content

    except Exception as e:

        print("COPILOT ERROR:", e)

        return "I'm having trouble analyzing your request right now. Please try again."