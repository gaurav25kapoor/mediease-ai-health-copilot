"use client";

import React, { useState, useCallback } from "react";
import Link from "next/link";
import { Heart } from "lucide-react";
import CopilotWidget from "@/components/copilot-widget";

// --- Types ---

interface LabValue {
  value: number;
  reference_range: string;
  status: string;
}

interface Prediction {
  prediction: number;
  probability: number;
  status: string;
  feature_coverage: number;
  reason?: string;
}

interface AnalysisResult {
  lab_values: Record<string, LabValue>;
  predictions: Record<string, Prediction>;
  explanation: {
    risk_summary: {
      overall_risk_score: number;
      risk_level: string;
    };
    explanation: string;
  };
}

// --- Components ---
const Badge = ({
  children,
  status,
}: {
  children: React.ReactNode;
  status?: string;
}) => {
  const safeStatus = status?.toLowerCase() || "unknown";

  const getStyles = () => {
    switch (safeStatus) {
      case "normal":
      case "success":
        return "bg-emerald-100 text-emerald-700 border-emerald-200";

      case "high":
      case "red":
        return "bg-rose-100 text-rose-700 border-rose-200";

      case "moderate":
      case "warning":
      case "low":
        return "bg-amber-100 text-amber-700 border-amber-200";

      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  return (
    <span
      className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getStyles()}`}
    >
      {children}
    </span>
  );
};

const Card = ({
  children,
  title,
  className = "",
}: {
  children: React.ReactNode;
  title?: string;
  className?: string;
}) => (
  <div
    className={`bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden ${className}`}
  >
    {title && (
      <div className="px-6 py-4 border-b border-slate-100">
        <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
      </div>
    )}
    <div className="p-6">{children}</div>
  </div>
);

// --- Main Page ---

export default function MedicalReportPage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
      setError(null);
    } else {
      setError("Please upload a PDF file first.");
      setFile(null);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === "application/pdf") {
      setFile(droppedFile);
      setError(null);
    } else {
      setError("Please upload a PDF file first.");
    }
  };

  const analyzeReport = async () => {
    if (!file) {
      setError("Please upload a PDF file first.");
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:8000/reports/analyze", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to analyze report");

      const data: AnalysisResult = await response.json();
      setResult(data);
    } catch (err) {
      setError("Failed to analyze report. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Header */}
        <Link href="/" className="flex items-center gap-2 mb-8 cursor-pointer">
          <Heart className="w-6 h-6 text-rose-500 fill-rose-500" />
          <span className="text-xl font-bold text-slate-900">MediEase</span>
        </Link>
        <header className="text-center space-y-4">
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
            Medical Report <span className="text-indigo-600">Analyzer</span>
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Upload a medical report and receive AI-powered clinical insights.
          </p>
        </header>

        {/* Upload Section */}
        <section>
          <Card className="max-w-3xl mx-auto">
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              className={`relative border-2 border-dashed rounded-xl p-10 text-center transition-colors ${
                file
                  ? "border-indigo-400 bg-indigo-50"
                  : "border-slate-300 hover:border-indigo-400"
              }`}
            >
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="space-y-4">
                <div className="mx-auto w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-indigo-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-base font-medium text-slate-900">
                    {file ? file.name : "Click to upload or drag and drop"}
                  </p>
                  <p className="text-sm text-slate-500">
                    PDF medical reports only
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-col items-center gap-4">
              <button
                onClick={analyzeReport}
                disabled={loading || !file}
                className={`w-full sm:w-64 py-3 px-6 rounded-lg font-semibold text-white transition-all shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 ${
                  loading || !file
                    ? "bg-slate-400 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-700 active:scale-95"
                }`}
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Analyzing report...
                  </>
                ) : (
                  "Analyze Report"
                )}
              </button>
              {error && (
                <p className="text-rose-600 text-sm font-medium">{error}</p>
              )}
            </div>
          </Card>
        </section>

        {result && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-10">
            {/* Risk Score */}
            <section>
              <div
                className={`rounded-2xl p-8 border shadow-sm flex flex-col items-center justify-center text-center space-y-2 ${
                  result.explanation.risk_summary.risk_level === "Low"
                    ? "bg-emerald-50 border-emerald-100"
                    : result.explanation.risk_summary.risk_level === "Moderate"
                      ? "bg-amber-50 border-amber-100"
                      : "bg-rose-50 border-rose-100"
                }`}
              >
                <h2 className="text-slate-600 font-medium uppercase tracking-wider text-sm">
                  Risk Assessment
                </h2>
                <div className="flex items-baseline gap-2">
                  <span
                    className={`text-5xl font-black ${
                      result.explanation.risk_summary.risk_level === "Low"
                        ? "text-emerald-700"
                        : result.explanation.risk_summary.risk_level ===
                            "Moderate"
                          ? "text-amber-700"
                          : "text-rose-700"
                    }`}
                  >
                    {result.explanation.risk_summary.risk_level} Risk
                  </span>
                </div>
                <p className="text-slate-600 font-medium">
                  Overall Risk Score:{" "}
                  {result.explanation.risk_summary.overall_risk_score}
                </p>
              </div>
            </section>

            {/* Lab Results */}
            <section className="space-y-6">
              <h2 className="text-2xl font-bold text-slate-800 px-2">
                Lab Values
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(result.lab_values).map(([name, data]) => (
                  <Card
                    key={name}
                    className="hover:shadow-md transition-shadow border-l-4 border-l-indigo-500"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <h4
                        className="font-bold text-slate-700 truncate pr-2"
                        title={name}
                      >
                        {name}
                      </h4>
                      <Badge status={data.status}>{data.status}</Badge>
                    </div>
                    <div className="space-y-1">
                      <p className="text-2xl font-bold text-slate-900">
                        {data.value}
                      </p>
                      <p className="text-sm text-slate-500 font-medium">
                        Reference: {data.reference_range}
                      </p>
                    </div>
                  </Card>
                ))}
              </div>
            </section>

            {/* Disease Predictions */}
            {/* Disease Predictions */}
            <section className="space-y-6">
              <h2 className="text-2xl font-bold text-slate-800 px-2">
                Disease Risk Predictions
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(result.predictions).map(([disease, data]) => {
                  const diseaseName =
                    disease.charAt(0).toUpperCase() + disease.slice(1);

                  // Handle skipped predictions
                  if (data.status === "skipped") {
                    return (
                      <Card key={disease} title={`${diseaseName} Risk`}>
                        <div className="text-center py-4 space-y-2">
                          <p className="text-sm text-slate-500 font-semibold uppercase">
                            Status
                          </p>
                          <Badge status="warning">Insufficient Data</Badge>

                          {data.reason && (
                            <p className="text-xs text-slate-500 mt-2">
                              {data.reason.replace(/_/g, " ")}
                            </p>
                          )}
                        </div>
                      </Card>
                    );
                  }

                  // Safe values
                  const probability =
                    typeof data.probability === "number" ? data.probability : 0;

                  const coverage =
                    typeof data.feature_coverage === "number"
                      ? data.feature_coverage
                      : 0;

                  const prediction =
                    typeof data.prediction === "number" ? data.prediction : 0;

                  return (
                    <Card key={disease} title={`${diseaseName} Risk`}>
                      <div className="grid grid-cols-3 gap-4">
                        {/* Prediction */}
                        <div className="text-center p-3 bg-slate-50 rounded-lg">
                          <p className="text-xs text-slate-500 mb-1 uppercase font-bold">
                            Prediction
                          </p>

                          <p
                            className={`text-lg font-bold ${
                              prediction === 1
                                ? "text-rose-600"
                                : "text-emerald-600"
                            }`}
                          >
                            {prediction === 1 ? "High Risk" : "Low Risk"}
                          </p>
                        </div>

                        {/* Probability */}
                        <div className="text-center p-3 bg-slate-50 rounded-lg">
                          <p className="text-xs text-slate-500 mb-1 uppercase font-bold">
                            Probability
                          </p>

                          <p className="text-lg font-bold text-slate-800">
                            {probability.toFixed(1)}%
                          </p>
                        </div>

                        {/* Feature Coverage */}
                        <div className="text-center p-3 bg-slate-50 rounded-lg">
                          <p className="text-xs text-slate-500 mb-1 uppercase font-bold">
                            Coverage
                          </p>

                          <p className="text-lg font-bold text-slate-800">
                            {(coverage * 100).toFixed(0)}%
                          </p>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </section>
            {/* AI Explanation */}
            <section className="mt-10">
              <div className="relative group">
                {/* Decorative background glow */}
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>

                <Card className="relative bg-[#0f172a] border-none shadow-2xl p-10 overflow-hidden">
                  {/* Subtle mesh background effect */}
                  <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl"></div>
                  <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
                    <div className="flex items-center gap-4">
                      <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 p-3 rounded-xl shadow-lg shadow-indigo-500/30">
                        <svg
                          className="w-6 h-6 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2.5"
                            d="M13 10V3L4 14h7v7l9-11h-7z"
                          />
                        </svg>
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-black tracking-tight">
                          Clinical AI Insight
                        </h2>
                        <p className="text-indigo-600 text-sm font-medium">
                          Personalized Medical Narrative
                        </p>
                      </div>
                    </div>
                    <div className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 text-[10px] font-black uppercase tracking-[0.2em]">
                      Generative Intelligence
                    </div>
                  </div>

                  <div className="relative">
                    <div className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-indigo-500/50 to-transparent rounded-full hidden sm:block"></div>
                    <div className="sm:pl-8">
                      <p className="text-black leading-[1.9] whitespace-pre-line text-md font-normal tracking-wide selection:bg-indigo-500/30">
                        {result.explanation.explanation}
                      </p>
                    </div>
                  </div>

                  <div className="mt-10 pt-8 border-t border-slate-800/50 flex items-center gap-2 text-slate-500 text-sm italic">
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                        clipRule="evenodd"
                      />
                    </svg>
                    AI analysis is for informational purposes and should be
                    verified by a medical professional.
                  </div>
                </Card>
              </div>
            </section>
          </div>
        )}
      </div>
      <CopilotWidget
        key={result ? "report-loaded" : "report-empty"}
        context={{
          page: "report_analyzer",
          labs: result?.lab_values,
          predictions: result?.predictions,
          explanation: result?.explanation,
        }}
      />
    </div>
  );
}
