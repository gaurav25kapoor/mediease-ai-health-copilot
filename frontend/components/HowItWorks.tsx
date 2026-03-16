"use client"
import React from 'react';
import { motion } from 'framer-motion';

const steps = [
  {
    number: '01',
    title: 'Enter Symptoms',
    description: 'Describe your symptoms in natural language or select from a list.',
  },
  {
    number: '02',
    title: 'AI Analysis',
    description: 'Our AI analyzes medical patterns and cross-references vast medical data.',
  },
  {
    number: '03',
    title: 'Risk Prediction',
    description: 'Advanced ML models predict possible conditions and risk levels.',
  },
  {
    number: '04',
    title: 'Get Health Insights',
    description: 'Receive personalized recommendations and clear next steps.',
  },
];

const HowItWorks = () => {
  return (
    <section className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            How MediEase Works
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            A simple, four-step process to get professional-grade health insights from the comfort of your home.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative"
            >
              {/* Connector Line for Desktop */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-slate-100 -z-10" />
              )}
              
              <div className="mb-6">
                <span className="text-5xl font-black text-slate-200 select-none">
                  {step.number}
                </span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                {step.title}
              </h3>
              <p className="text-slate-600 leading-relaxed">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
