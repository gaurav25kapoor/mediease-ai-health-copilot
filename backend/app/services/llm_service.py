from openai import OpenAI

client = OpenAI()


# --------------------------------------------------
# HEALTH RISK SCORING
# --------------------------------------------------

def compute_overall_risk(predictions):

    if not predictions:
        return {
            "overall_risk_score": 0,
            "risk_level": "Unknown"
        }

    probabilities = []

    for model in predictions.values():

        if isinstance(model, dict) and "probability" in model:
            probabilities.append(model["probability"])

    if not probabilities:
        return {
            "overall_risk_score": 0,
            "risk_level": "Unknown"
        }

    avg_prob = sum(probabilities) / len(probabilities)

    score = round(avg_prob,1)

    if score < 30:
        level = "Low"
    elif score < 60:
        level = "Moderate"
    else:
        level = "High"

    return {
        "overall_risk_score": score,
        "risk_level": level
    }


# --------------------------------------------------
# MEDICAL EXPLANATION GENERATION
# --------------------------------------------------

def generate_medical_explanation(labs, predictions):

    # Compute overall risk
    risk_summary = compute_overall_risk(predictions)

    system_prompt = """
You are an AI medical copilot designed to assist with interpreting laboratory test results.

You receive:
1. Extracted laboratory values from medical reports
2. Predictions from machine learning disease risk models
3. An overall health risk score derived from these predictions

Your task is to generate a professional, cautious, and medically responsible explanation.

Important safety rules:

• Do NOT provide a medical diagnosis.
• Clearly explain abnormal or borderline lab values.
• Interpret machine learning predictions cautiously.
• If predictions are based on limited features, state that clearly.
• Identify inconsistencies or unusual combinations in lab values.
• If values appear unrealistic or contradictory, suggest possible reasons
  such as dehydration, measurement variation, or OCR extraction errors.
• Always encourage consultation with a healthcare professional.

Use clear language understandable to patients while maintaining medical accuracy.

Your explanation must follow this structure:

1. Summary  
Brief overview of the most important findings including the overall health risk level.

2. Clinical Interpretation  
Explain each important lab value and whether it is normal, borderline, or abnormal.

3. Risk Assessment  
Explain the machine learning predictions and the overall health risk score.

4. Possible Medical Considerations  
Describe possible conditions that may be associated with the findings, without diagnosing.

5. Recommended Next Steps  
Suggest appropriate follow-up actions such as repeat testing or medical consultation.

6. Lifestyle Considerations  
Provide general health advice relevant to the findings.

7. When to Seek Medical Attention  
Explain symptoms or situations where medical care should be sought.

8. Medical Disclaimer  
State that this analysis is informational and not a substitute for professional medical care.
"""

    user_prompt = f"""
The following laboratory values were extracted from a patient's medical report.

Extracted Lab Values:
{labs}

AI Model Risk Predictions:
{predictions}

Computed Overall Health Risk:
{risk_summary}

Analyze the results carefully.

Important instructions:
• Base interpretations primarily on the laboratory values.
• Use AI predictions only as supporting information.
• If important tests are missing, mention the limitation.
• Explain the meaning of the overall health risk score.
• Provide a detailed but responsible explanation following the required structure.
"""

    response = client.chat.completions.create(
        model="gpt-4.1-mini",
        temperature=0.3,
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ]
    )

    return {
        "risk_summary": risk_summary,
        "explanation": response.choices[0].message.content
    }