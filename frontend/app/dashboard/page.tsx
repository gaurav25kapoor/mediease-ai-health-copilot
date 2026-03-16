"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Activity,
  FileText,
  TrendingUp,
  AlertCircle,
  ArrowRight,
  Shield,
  Clipboard,
  ChevronRight,
  Stethoscope,
  Search,
  BrainCircuit,
} from "lucide-react";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

import { motion } from "framer-motion";
import CopilotWidget from "@/components/copilot-widget";

interface DashboardData {
  overview: {
    total_reports: number;
    total_predictions: number;
    overall_risk: string;
  };
  reports: {
    id: number;
    risk_level: string;
    risk_score: number;
    created_at: string;
  }[];
  predictions: {
    id: number;
    model: string;
    probability: number;
    prediction: number;
    created_at: string;
  }[];
  latest_symptom_analysis: {
    symptoms: string[] | string;
    risk_level: string;
    urgency: string;
  } | null;
}

const StatCard = ({ title, value, icon: Icon, color, delay }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4"
  >
    <div className={`p-3 rounded-xl ${color}`}>
      <Icon className="w-6 h-6" />
    </div>

    <div>
      <p className="text-sm font-medium text-slate-500">{title}</p>
      <p className="text-2xl font-bold text-slate-900">{value}</p>
    </div>
  </motion.div>
);

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await fetch("http://localhost:8000/dashboard/summary");
        const result = await res.json();

        setData(result);
      } catch (err) {
        console.error("Dashboard fetch error", err);

        setData({
          overview: {
            total_reports: 0,
            total_predictions: 0,
            overall_risk: "Low",
          },
          reports: [],
          predictions: [],
          latest_symptom_analysis: null,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-500 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const chartData =
    data?.predictions?.map((p) => ({
      name: p.model,
      probability: Number(p.probability.toFixed(1)),
      prediction: p.prediction,
    })) || [];

  const symptomsRaw = data?.latest_symptom_analysis?.symptoms;

  let symptoms: string[] = [];

  if (Array.isArray(symptomsRaw)) {
    symptoms = symptomsRaw;
  } else if (typeof symptomsRaw === "string") {
    symptoms = symptomsRaw
      .toLowerCase()
      .replace("i have", "")
      .replace("from past", ",")
      .replace("days", "")
      .replace("and", ",")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
      .map((s) => s.charAt(0).toUpperCase() + s.slice(1));
  }
  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* HEADER */}

      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <Activity className="w-5 h-5 text-white" />
            </div>

            <Link href="/" className="text-xl font-bold text-slate-900">
              MediEase Dashboard
            </Link>
          </div>

          <Search className="w-5 h-5 text-slate-400" />
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900">Health Overview</h2>

          <p className="text-slate-500">
            Monitor your medical reports, predictions and AI insights.
          </p>
        </div>

        {/* OVERVIEW */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard
            title="Total Reports"
            value={data?.overview.total_reports || 0}
            icon={FileText}
            color="bg-blue-50 text-blue-600"
            delay={0.1}
          />

          <StatCard
            title="Total Predictions"
            value={data?.overview.total_predictions || 0}
            icon={BrainCircuit}
            color="bg-purple-50 text-purple-600"
            delay={0.2}
          />

          <StatCard
            title="Overall Risk"
            value={data?.overview.overall_risk || "Low"}
            icon={Shield}
            color="bg-emerald-50 text-emerald-600"
            delay={0.3}
          />
        </div>

        {/* CHART + TRIAGE */}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-indigo-600" />
                Risk Analytics
              </h3>
            </div>

            {chartData.length === 0 ? (
              <p className="text-slate-400 text-sm">
                No prediction data available yet.
              </p>
            ) : (
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value: any) => `${value}%`} />

                    <Bar dataKey="probability" radius={[6, 6, 0, 0]}>
                      {chartData.map((entry, index) => (
                        <Cell
                          key={index}
                          fill={entry.probability > 50 ? "#e11d48" : "#4f46e5"}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </motion.div>

          {/* TRIAGE */}

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100"
          >
            <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Stethoscope className="w-5 h-5 text-indigo-600" />
              Latest Triage
            </h3>

            {data?.latest_symptom_analysis ? (
              <div className="space-y-6">
                {/* Symptoms */}
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase mb-2">
                    Symptoms
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {symptoms.map((s, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-medium rounded-full border border-slate-200"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Risk Level */}
                <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-100">
                  <p className="text-xs font-bold text-indigo-400 uppercase mb-1">
                    Risk Level
                  </p>

                  <p className="text-lg font-bold text-indigo-700">
                    {data.latest_symptom_analysis.risk_level}
                  </p>
                </div>

                {/* Urgency */}
                <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-50 border border-amber-100">
                  <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />

                  <div>
                    <p className="text-xs font-bold text-amber-600 uppercase mb-1">
                      Urgency
                    </p>

                    <p className="text-sm font-medium text-amber-800">
                      {data.latest_symptom_analysis.urgency}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-slate-400 italic text-sm">
                No recent symptom analysis found.
              </p>
            )}

            <Link
              href="/triage"
              className="mt-8 w-full flex items-center justify-center gap-2 py-3 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-all group"
            >
              New Symptom Check
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>

        {/* DISEASE PREDICTIONS TABLE */}

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden mb-8">
          <div className="p-6 border-b border-slate-100 flex justify-between">
            <h3 className="text-lg font-bold text-slate-900">
              Disease Predictions
            </h3>
          </div>

          <table className="w-full text-left">
            <thead className="bg-slate-50 text-xs uppercase text-slate-400">
              <tr>
                <th className="px-6 py-4">Model</th>
                <th className="px-6 py-4">Probability</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Date</th>
              </tr>
            </thead>

            <tbody>
              {data?.predictions.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-6 text-slate-400">
                    No predictions yet.
                  </td>
                </tr>
              ) : (
                data?.predictions.map((p) => (
                  <tr key={p.id} className="border-t">
                    <td className="px-6 py-4 font-semibold text-slate-800">
                      {p.model}
                    </td>

                    <td className="px-6 py-4 text-slate-600">
                      {p.probability.toFixed(1)}%
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 text-xs rounded font-semibold ${
                          p.prediction === 1
                            ? "bg-red-100 text-red-600"
                            : "bg-green-100 text-green-600"
                        }`}
                      >
                        {p.prediction === 1 ? "High Risk" : "Low Risk"}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-slate-400">
                      {new Date(p.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* REPORTS TABLE */}

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden mb-8">
          <div className="p-6 border-b border-slate-100 flex justify-between">
            <h3 className="text-lg font-bold text-slate-900">
              Medical Reports
            </h3>
          </div>

          <table className="w-full text-left">
            <thead className="bg-slate-50 text-xs uppercase text-slate-400">
              <tr>
                <th className="px-6 py-4">ID</th>
                <th className="px-6 py-4">Risk Level</th>
                <th className="px-6 py-4">Score</th>
                <th className="px-6 py-4">Date</th>
              </tr>
            </thead>

            <tbody>
              {data?.reports.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-6 text-slate-400">
                    No reports uploaded yet.
                  </td>
                </tr>
              ) : (
                data?.reports.map((r) => (
                  <tr key={r.id} className="border-t">
                    <td className="px-6 py-4 text-slate-700 font-medium">
                      #{r.id}
                    </td>

                    <td className="px-6 py-4">
                      <span className="px-2 py-1 text-xs rounded font-semibold bg-red-100 text-red-600">
                        {r.risk_level}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-indigo-600 rounded-full"
                            style={{ width: `${r.risk_score}%` }}
                          />
                        </div>

                        <span className="text-sm font-semibold text-slate-700">
                          {r.risk_score.toFixed(1)}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-slate-400">
                      {new Date(r.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* QUICK ACTIONS */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            href="/reports"
            className="group bg-white p-6 rounded-2xl shadow-sm border border-slate-100"
          >
            <Clipboard className="w-6 h-6 text-blue-600 mb-4" />
            <h4 className="font-bold text-slate-900 mb-1">Report Analyzer</h4>
            <p className="text-sm text-slate-500 mb-4">
              Upload and analyze lab reports.
            </p>
            <div className="flex items-center gap-2 text-indigo-600 text-sm font-bold">
              Analyze Report <ArrowRight className="w-4 h-4" />
            </div>
          </Link>

          <Link
            href="/prediction"
            className="group bg-white p-6 rounded-2xl shadow-sm border border-slate-100"
          >
            <BrainCircuit className="w-6 h-6 text-purple-600 mb-4" />
            <h4 className="font-bold text-slate-900 mb-1">
              Disease Prediction
            </h4>
            <p className="text-sm text-slate-500 mb-4">
              Check risk for heart, diabetes, kidney and anemia.
            </p>
            <div className="flex items-center gap-2 text-indigo-600 text-sm font-bold">
              Predict Risk <ArrowRight className="w-4 h-4" />
            </div>
          </Link>

          <Link
            href="/triage"
            className="group bg-white p-6 rounded-2xl shadow-sm border border-slate-100"
          >
            <Stethoscope className="w-6 h-6 text-emerald-600 mb-4" />
            <h4 className="font-bold text-slate-900 mb-1">Symptom Checker</h4>
            <p className="text-sm text-slate-500 mb-4">
              AI-powered symptom triage.
            </p>
            <div className="flex items-center gap-2 text-indigo-600 text-sm font-bold">
              Start Triage <ArrowRight className="w-4 h-4" />
            </div>
          </Link>
        </div>
      </main>

      <CopilotWidget context={{ page: "dashboard" }} />
    </div>
  );
}
