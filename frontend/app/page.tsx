import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import HowItWorks from "@/components/HowItWorks";
import CTA from "@/components/CTA";
import DashboardPreview from "@/components/DashboardPreview";
import CopilotWidget from "@/components/copilot-widget";

export default function Home() {
  return (
    <div className="min-h-screen bg-white font-sans selection:bg-indigo-100 selection:text-indigo-900">
      
      <Navbar />

      <main>
        <Hero />
        <DashboardPreview/>
        <Features />
        <HowItWorks />
        <CTA />
      </main>
      <CopilotWidget/>

      <footer className="py-12 border-t border-slate-100 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="flex flex-col md:flex-row justify-between items-center gap-8">

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">❤️</span>
              </div>

              <span className="text-xl font-bold text-slate-900">
                MediEase
              </span>
            </div>

            <div className="flex gap-8 text-sm font-medium text-slate-500">
              <a href="#" className="hover:text-indigo-600 transition-colors">
                Privacy Policy
              </a>

              <a href="#" className="hover:text-indigo-600 transition-colors">
                Terms of Service
              </a>

              <a href="#" className="hover:text-indigo-600 transition-colors">
                Contact Us
              </a>
            </div>

            <p className="text-sm text-slate-400">
              © {new Date().getFullYear()} MediEase AI. All rights reserved.
            </p>

          </div>
        </div>
      </footer>

    </div>
  );
}