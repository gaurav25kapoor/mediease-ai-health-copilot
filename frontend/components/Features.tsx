
"use client"
import React from 'react';
import { motion } from 'framer-motion';
import { 
  Stethoscope, 
  TrendingUp, 
  FileText, 
  MessageSquare, 
  LayoutDashboard, 
  BrainCircuit 
} from 'lucide-react';

const features = [
  {
    title: 'AI Symptom Triage',
    description: 'Analyze symptoms instantly and detect urgency with high precision.',
    icon: Stethoscope,
    color: 'bg-blue-50 text-blue-600',
  },
  {
    title: 'Disease Risk Prediction',
    description: 'Machine learning models estimate health risks based on your data.',
    icon: TrendingUp,
    color: 'bg-emerald-50 text-emerald-600',
  },
  {
    title: 'Medical Report Analyzer',
    description: 'Upload reports and get simplified, easy-to-understand explanations.',
    icon: FileText,
    color: 'bg-amber-50 text-amber-600',
  },
  {
    title: 'AI Health Assistant',
    description: 'Chat with an AI trained on extensive healthcare knowledge and data.',
    icon: MessageSquare,
    color: 'bg-indigo-50 text-indigo-600',
  },
  {
    title: 'Patient Dashboard',
    description: 'Track symptoms, reports, and health insights in one unified view.',
    icon: LayoutDashboard,
    color: 'bg-rose-50 text-rose-600',
  },
  {
    title: 'Explainable AI',
    description: 'Understand exactly why the AI predicted a specific health risk.',
    icon: BrainCircuit,
    color: 'bg-purple-50 text-purple-600',
  },
];

const Features = () => {
  return (
    <section className="py-24 bg-slate-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Powerful AI Health Features
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Experience the future of healthcare with our advanced AI-driven tools designed for accuracy and accessibility.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 transition-all group"
            >
              <div className={`w-14 h-14 ${feature.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                <feature.icon className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-slate-600 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
