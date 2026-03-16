"use client"
import React from 'react';
import { motion } from 'framer-motion';
import { Stethoscope, Activity, FileText, AlertCircle, CheckCircle2, Info } from 'lucide-react';

const DashboardPreview = () => {
  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Real-time AI Health Insights
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Get a glimpse of how MediEase processes your data to provide actionable health intelligence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* CARD 1 — Symptom Analysis */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-2xl p-6 shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col h-full"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
                <Stethoscope className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900">Symptom Analysis</h3>
            </div>

            <div className="space-y-4 grow">
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Symptoms Entered</span>
                <div className="flex flex-wrap gap-2 mt-2">
                  {['Fever', 'Headache', 'Fatigue'].map((s) => (
                    <span key={s} className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-medium rounded-full">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-amber-50 rounded-xl border border-amber-100">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                  <span className="text-sm font-bold text-amber-900">AI Result: Moderate Risk</span>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-amber-800 font-medium">Possible Conditions:</p>
                  <ul className="text-xs text-amber-700 list-disc list-inside space-y-0.5">
                    <li>Flu</li>
                    <li>Viral Infection</li>
                  </ul>
                </div>
              </div>

              <div className="flex gap-2 items-start text-xs text-slate-500 bg-slate-50 p-3 rounded-lg">
                <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <p><span className="font-semibold text-slate-700">Recommendation:</span> Rest, hydration, consult a doctor if symptoms persist.</p>
              </div>
            </div>
          </motion.div>

          {/* CARD 2 — Risk Prediction */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-2xl p-6 shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col h-full"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-rose-50 rounded-lg flex items-center justify-center text-rose-600">
                <Activity className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900">Disease Risk Prediction</h3>
            </div>

            <div className="space-y-6 grow">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-slate-600">Heart Disease Risk</span>
                  <span className="font-bold text-slate-900">22%</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    whileInView={{ width: '22%' }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="h-full bg-rose-500 rounded-full" 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-slate-600">Diabetes Risk</span>
                  <span className="font-bold text-slate-900">12%</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    whileInView={{ width: '12%' }}
                    transition={{ duration: 1, ease: "easeOut", delay: 0.1 }}
                    className="h-full bg-blue-500 rounded-full" 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-slate-600">Hypertension Risk</span>
                  <span className="font-bold text-slate-900">18%</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    whileInView={{ width: '18%' }}
                    transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                    className="h-full bg-emerald-500 rounded-full" 
                  />
                </div>
              </div>

              <div className="mt-auto pt-4 border-t border-slate-50">
                <div className="flex items-center gap-2 text-[10px] text-slate-400 uppercase font-bold tracking-widest">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Live Analysis Active
                </div>
              </div>
            </div>
          </motion.div>

          {/* CARD 3 — Medical Report Insights */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-2xl p-6 shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col h-full"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-600">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900">Medical Report Analyzer</h3>
            </div>

            <div className="space-y-4 grow">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-900">Hemoglobin</span>
                    <span className="text-[10px] text-slate-500">Reference: 13.5-17.5 g/dL</span>
                  </div>
                  <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-md">Slightly Low</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-900">Cholesterol</span>
                    <span className="text-[10px] text-slate-500">Reference: &lt;200 mg/dL</span>
                  </div>
                  <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2 py-1 rounded-md">Borderline High</span>
                </div>
              </div>

              <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 className="w-4 h-4 text-indigo-600" />
                  <span className="text-sm font-bold text-indigo-900">AI Summary</span>
                </div>
                <p className="text-xs text-indigo-700 leading-relaxed">
                  Possible early signs of anemia and mild cholesterol elevation. Recommend dietary adjustments and follow-up in 3 months.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default DashboardPreview;
