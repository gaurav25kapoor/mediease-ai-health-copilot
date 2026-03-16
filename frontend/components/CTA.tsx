"use client"
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const CTA = () => {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="max-w-5xl mx-auto bg-indigo-600 rounded-[2.5rem] p-8 md:p-16 text-center relative overflow-hidden shadow-2xl shadow-indigo-200"
      >
        {/* Background Accents */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-indigo-400/20 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl" />

        <div className="relative z-10">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Start your AI Health Journey Today
          </h2>
          <p className="text-indigo-100 text-lg md:text-xl mb-10 max-w-2xl mx-auto">
            Join thousands of users who trust MediEase for their daily health insights and symptom analysis.
          </p>
          <button className="bg-white text-indigo-600 px-10 py-4 rounded-full text-lg font-bold hover:bg-indigo-50 transition-all shadow-xl flex items-center justify-center gap-2 mx-auto group">
            Try MediEase Now
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          <p className="mt-6 text-indigo-200 text-sm font-medium">
            Free to start • No credit card required • HIPAA Compliant
          </p>
        </div>
      </motion.div>
    </section>
  );
};

export default CTA;
