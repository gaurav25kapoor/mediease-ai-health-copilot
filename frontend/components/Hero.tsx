"use client"
import React from 'react';
import { motion } from 'framer-motion';
import { Heart, ArrowRight, Activity, ShieldCheck } from 'lucide-react';

const Hero = () => {
  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-indigo-100/50 rounded-full blur-3xl opacity-60" />
        <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-emerald-50/50 rounded-full blur-3xl opacity-60" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-center gap-2 mb-6"
        >
          <div className="flex items-center gap-2 bg-indigo-50 text-indigo-700 px-4 py-1.5 rounded-full text-sm font-semibold border border-indigo-100 shadow-sm">
            <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
            <span>MediEase AI</span>
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl md:text-6xl lg:text-7xl font-bold text-slate-900 tracking-tight mb-8"
        >
          AI-Health Copilot <span className="text-indigo-600">for Smarter Medical</span> Decisions   
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-2xl mx-auto text-lg md:text-xl text-slate-600 mb-10 leading-relaxed"
        >
          MediEase helps you analyze symptoms, predict health risks, understand medical reports, and get AI-powered health insights instantly.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <button className="w-full sm:w-auto bg-indigo-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 group">
            Try Symptom Checker
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          <button className="w-full sm:w-auto bg-white text-slate-700 border border-slate-200 px-8 py-4 rounded-full text-lg font-semibold hover:bg-slate-50 transition-all shadow-sm flex items-center justify-center gap-2">
            Start AI Chat
          </button>
        </motion.div>

        {/* Floating Stats/Badges */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto"
        >
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center mb-3">
              <Activity className="w-6 h-6 text-indigo-600" />
            </div>
            <span className="text-2xl font-bold text-slate-900">99.8%</span>
            <span className="text-sm text-slate-500 font-medium">Accuracy Rate</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center mb-3">
              <ShieldCheck className="w-6 h-6 text-emerald-600" />
            </div>
            <span className="text-2xl font-bold text-slate-900">HIPAA</span>
            <span className="text-sm text-slate-500 font-medium">Compliant</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-rose-50 rounded-xl flex items-center justify-center mb-3">
              <Heart className="w-6 h-6 text-rose-600" />
            </div>
            <span className="text-2xl font-bold text-slate-900">24/7</span>
            <span className="text-sm text-slate-500 font-medium">Availability</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center mb-3">
              <Activity className="w-6 h-6 text-indigo-600" />
            </div>
            <span className="text-2xl font-bold text-slate-900">1M+</span>
            <span className="text-sm text-slate-500 font-medium">Users Trusted</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
