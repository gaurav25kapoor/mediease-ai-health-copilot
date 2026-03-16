"use client";

import React, { useState } from "react";
import axios from "axios";
import Link from "next/link";
import {
  Heart,
  Activity,
  Droplet,
  TestTube,
  ChevronRight,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Info,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import CopilotWidget from "@/components/copilot-widget";

interface PredictionResult {
  prediction: number | null;
  probability: number | null;
}

interface CardProps {
  title: string;
  icon: React.ReactNode;
  description: string;
  endpoint: string;
  fields: {
    name: string;
    label: string;
    type: string;
    placeholder?: string;
    options?: { value: string; label: string }[];
  }[];
}

const PredictionCard = ({
  title,
  icon,
  description,
  endpoint,
  fields,
}: CardProps) => {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (name: string, value: any) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await axios.post(`http://127.0.0.1:8000${endpoint}`, {
        features: formData,
      });

      // 🔥 FIX HERE
      setResult(response.data.result);
    } catch (err) {
      setError("Failed to get prediction. Ensure backend is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6 transition-all duration-300 hover:shadow-xl flex flex-col"
    >
      <div className="flex items-center gap-4 mb-4">
        <div className="p-3 bg-indigo-50 rounded-xl text-indigo-600">
          {icon}
        </div>

        <div>
          <h3 className="text-xl font-bold text-slate-800">{title}</h3>
          <p className="text-sm text-slate-500">{description}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {fields.map((field) => (
            <div key={field.name} className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                {field.label}
              </label>

              {field.options ? (
                <select
                  required
                  onChange={(e) =>
                    handleInputChange(field.name, Number(e.target.value))
                  }
                  className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  <option value="">Select</option>
                  {field.options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  required
                  type="number"
                  placeholder={field.placeholder || field.label}
                  onChange={(e) =>
                    handleInputChange(field.name, parseFloat(e.target.value))
                  }
                  className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              )}
            </div>
          ))}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-full py-3 px-6 flex items-center justify-center gap-2 disabled:opacity-70"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              Predict Risk
              <ChevronRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 p-3 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3"
          >
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <p className="text-xs text-red-700">{error}</p>
          </motion.div>
        )}

        {result && result.prediction !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`mt-6 p-5 rounded-2xl border-2 ${
              result.prediction === 1
                ? "bg-rose-50 border-rose-200"
                : "bg-emerald-50 border-emerald-200"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {result.prediction === 1 ? (
                  <AlertCircle className="w-6 h-6 text-rose-600" />
                ) : (
                  <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                )}

                <span
                  className={`font-bold text-lg ${
                    result.prediction === 1
                      ? "text-rose-700"
                      : "text-emerald-700"
                  }`}
                >
                  {result.prediction === 1 ? "High Risk Detected" : "Low Risk"}
                </span>
              </div>

              <div className="text-right">
                <p className="text-xs text-slate-500 uppercase font-bold">
                  Probability
                </p>

                <p
                  className={`text-2xl font-black ${
                    result.prediction === 1
                      ? "text-rose-600"
                      : "text-emerald-600"
                  }`}
                >
                  {result.probability !== null
                    ? result.probability.toFixed(1) + "%"
                    : "--"}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default function Page() {
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <Link href="/" className="flex items-center gap-2 mb-8 cursor-pointer">
          <Heart className="w-6 h-6 text-rose-500 fill-rose-500" />
          <span className="text-xl font-bold text-slate-900">MediEase</span>
        </Link>

        <h1 className="text-4xl font-bold text-slate-900 mb-2">
          AI Disease <span className="text-indigo-600">Risk</span> Prediction
        </h1>

        <p className="text-slate-600 mb-12">
          Enter your health metrics and our AI models will analyze disease risk.
        </p>

        <PredictionCard
          title="Heart Disease"
          icon={<Heart className="w-6 h-6" />}
          description="Cardiovascular risk"
          endpoint="/prediction/heart"
          fields={[
            { name: "age", label: "Age", type: "number" },
            { name: "sex", label: "Sex (1=Male 0=Female)", type: "number" },
            { name: "trestbps", label: "Resting BP", type: "number" },
            { name: "chol", label: "Cholesterol", type: "number" },
            { name: "fbs", label: "Fasting Blood Sugar (0 = less than 120 mg/dl 1 = greater than 120 mg/dl)", type: "number" },
            { name: "thalch", label: "Max Heart Rate", type: "number" },
            { name: "exang", label: "Exercise Angina", type: "number" },
            { name: "oldpeak", label: "ST Depression", type: "number" },
            { name: "ca", label: "Major Vessels", type: "number" },
          ]}
        />

        {/* DIABETES */}
        <PredictionCard
          title="Diabetes"
          icon={<Activity />}
          description="Metabolic risk"
          endpoint="/prediction/diabetes"
          fields={[
            { name: "Pregnancies", label: "Pregnancies", type: "number" },
            { name: "Glucose", label: "Glucose", type: "number" },
            { name: "BloodPressure", label: "Blood Pressure", type: "number" },
            { name: "SkinThickness", label: "Skin Thickness", type: "number" },
            { name: "Insulin", label: "Insulin", type: "number" },
            { name: "BMI", label: "BMI", type: "number" },
            { name: "DiabetesPedigreeFunction", label: "DPF", type: "number" },
            { name: "Age", label: "Age", type: "number" },
          ]}
        />

        {/* KIDNEY */}
        <PredictionCard
          title="Kidney Disease"
          icon={<Droplet />}
          description="Renal risk"
          endpoint="/prediction/kidney"
          fields={[
            { name: "Age", label: "Age", type: "number" },
            { name: "BMI", label: "BMI", type: "number" },
            { name: "SystolicBP", label: "Systolic BP", type: "number" },
            { name: "DiastolicBP", label: "Diastolic BP", type: "number" },
            { name: "FastingBloodSugar", label: "Blood Sugar", type: "number" },
            { name: "SerumCreatinine", label: "Creatinine", type: "number" },
            { name: "BUNLevels", label: "BUN", type: "number" },
            { name: "GFR", label: "GFR", type: "number" },
          ]}
        />

        {/* ANEMIA */}
        <PredictionCard
          title="Anemia Detection"
          icon={<TestTube />}
          description="Blood health"
          endpoint="/prediction/anemia"
          fields={[
            { name: "Gender_Male", label: "Gender (1=Male)", type: "number" },
            { name: "Hemoglobin", label: "Hemoglobin", type: "number" },
            { name: "MCH", label: "MCH", type: "number" },
            { name: "MCHC", label: "MCHC", type: "number" },
            { name: "MCV", label: "MCV", type: "number" },
          ]}
        />
      </div>
      <CopilotWidget
        key="prediction"
        context={{
          page: "disease_prediction",
        }}
      />
    </div>
  );
}
