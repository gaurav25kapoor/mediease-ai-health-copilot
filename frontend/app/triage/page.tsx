"use client";

import React, { useState } from "react";
import axios from "axios";
import Link from "next/link";
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  Stethoscope,
  AlertCircle,
  ChevronRight,
  Loader2,
  Heart,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import CopilotWidget from "@/components/copilot-widget";

interface Condition {
  condition: string;
  probability: string;
  reason: string;
}

interface TriageResult {
  risk_level: "Low" | "Moderate" | "High";
  triage_category: "Self-care" | "Doctor Visit" | "Urgent Care" | "Emergency";
  urgency: "Non-emergency" | "Urgent" | "Emergency";
  key_symptoms_detected: string[];
  possible_conditions: Condition[];
  recommended_actions: string[];
  red_flags: string[];
  confidence_score: number;
  medical_disclaimer: string;
}

export default function TriagePage() {
  const [symptoms, setSymptoms] = useState("");
  const [result, setResult] = useState<TriageResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyzeSymptoms = async () => {
    if (!symptoms.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/triage/analyze",
        { symptoms: symptoms },
      );

      const data = response.data;

      setResult({
        risk_level: data.risk_level ?? "Low",
        triage_category: data.triage_category ?? "Self-care",
        urgency: data.urgency ?? "Non-emergency",
        key_symptoms_detected: data.key_symptoms_detected ?? [],
        possible_conditions: data.possible_conditions ?? [],
        recommended_actions: data.recommended_actions ?? [],
        red_flags: data.red_flags ?? [],
        confidence_score: data.confidence_score ?? 0,
        medical_disclaimer:
          data.medical_disclaimer ??
          "This AI system provides informational guidance only.",
      });
    } catch (err) {
      console.error("API Error:", err);

      setError(
        "Failed to connect to the analysis server. Please ensure the FastAPI backend is running at http://127.0.0.1:8000",
      );
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case "High":
        return "text-rose-600 bg-rose-50 border-rose-100";
      case "Moderate":
        return "text-amber-600 bg-amber-50 border-amber-100";
      case "Low":
        return "text-emerald-600 bg-emerald-50 border-emerald-100";
      default:
        return "text-slate-600 bg-slate-50 border-slate-100";
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="flex items-center gap-2 mb-8 cursor-pointer">
          <Heart className="w-6 h-6 text-rose-500 fill-rose-500" />
          <span className="text-xl font-bold text-slate-900">MediEase</span>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            AI Symptom Checker
          </h1>
          <p className="text-lg text-slate-600">
            Describe how you're feeling, and our AI will help you understand
            your symptoms and next steps.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 mb-8"
        >
          <label
            htmlFor="symptoms"
            className="block text-sm font-semibold text-slate-700 mb-2"
          >
            Describe your symptoms
          </label>

          <textarea
            id="symptoms"
            rows={4}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none resize-none text-slate-700"
            placeholder="e.g., I have a high fever, persistent cough, and feeling dizzy since yesterday..."
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
          />

          <div className="mt-4 flex justify-end">
            <button
              onClick={analyzeSymptoms}
              disabled={loading || !symptoms.trim()}
              className="bg-indigo-600 text-white px-8 py-3 rounded-full font-bold hover:bg-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg shadow-indigo-200"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  Analyze Symptoms
                  <ChevronRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        </motion.div>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-rose-50 border border-rose-100 text-rose-700 px-4 py-3 rounded-xl mb-8 flex items-center gap-3"
            >
              <AlertCircle className="w-5 h-5 shrink-0" />
              <p className="text-sm font-medium">{error}</p>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div
                  className={`p-4 rounded-2xl border ${getRiskColor(result.risk_level)}`}
                >
                  <p className="text-xs font-bold uppercase tracking-wider opacity-70 mb-1">
                    Risk Level
                  </p>
                  <p className="text-xl font-bold">{result.risk_level}</p>
                </div>

                <div className="p-4 rounded-2xl border border-indigo-100 bg-indigo-50 text-indigo-700">
                  <p className="text-xs font-bold uppercase tracking-wider opacity-70 mb-1">
                    Triage Category
                  </p>
                  <p className="text-xl font-bold">{result.triage_category}</p>
                </div>

                <div className="p-4 rounded-2xl border border-slate-200 bg-white text-slate-700">
                  <p className="text-xs font-bold uppercase tracking-wider opacity-70 mb-1">
                    Urgency
                  </p>
                  <p className="text-xl font-bold">{result.urgency}</p>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Stethoscope className="w-5 h-5 text-indigo-600" />
                  Detected Symptoms
                </h3>

                <div className="flex flex-wrap gap-2">
                  {result.key_symptoms_detected?.map((symptom, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-slate-100 text-slate-600 text-sm font-medium rounded-full border border-slate-200"
                    >
                      {symptom}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-indigo-600" />
                  Possible Conditions
                </h3>

                <div className="space-y-4">
                  {result.possible_conditions?.map((item, i) => (
                    <div
                      key={i}
                      className="p-4 rounded-xl bg-slate-50 border border-slate-100"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold text-slate-900">
                          {item.condition}
                        </h4>
                        <span className="text-xs font-bold px-2 py-1 bg-white rounded-md border border-slate-200 text-indigo-600">
                          {item.probability}
                        </span>
                      </div>

                      <p className="text-sm text-slate-600 leading-relaxed">
                        {item.reason}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                  <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-emerald-600" />
                    Recommended Actions
                  </h3>

                  <ul className="space-y-3">
                    {result.recommended_actions?.map((action, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-3 text-sm text-slate-600"
                      >
                        <div className="w-5 h-5 rounded-full bg-emerald-50 flex items-center justify-center shrink-0 mt-0.5">
                          <CheckCircle className="w-3 h-3 text-emerald-600" />
                        </div>

                        {action}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                  <h3 className="text-lg font-bold text-rose-600 mb-4 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" />
                    Red Flags
                  </h3>

                  <ul className="space-y-3">
                    {result.red_flags?.map((flag, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-3 text-sm text-rose-700 bg-rose-50 p-2 rounded-lg"
                      >
                        <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                        {flag}
                      </li>
                    ))}

                    {result.red_flags?.length === 0 && (
                      <p className="text-sm text-slate-500 italic">
                        No emergency red flags detected based on input.
                      </p>
                    )}
                  </ul>
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-4 items-center justify-between p-4 bg-slate-100 rounded-2xl">
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <Clock className="w-4 h-4" />
                  Confidence Score:
                  <span className="font-bold text-slate-900">
                    {(result.confidence_score * 100).toFixed(1)}%
                  </span>
                </div>

                <div className="text-[10px] text-slate-400 font-medium uppercase tracking-widest">
                  AI-Generated Analysis
                </div>
              </div>

              <div className="p-6 bg-amber-50 rounded-2xl border border-amber-100">
                <div className="flex items-center gap-2 mb-2 text-amber-800">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-sm font-bold">Medical Disclaimer</span>
                </div>

                <p className="text-xs text-amber-700 leading-relaxed">
                  {result.medical_disclaimer}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <CopilotWidget
        key={result ? "symptom-loaded" : "symptom-empty"}
        context={{
          page: "symptom_checker",
          symptoms: symptoms ? [symptoms] : [],
          symptom_analysis: result,
        }}
      />
    </div>
  );
}
