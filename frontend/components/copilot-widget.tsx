"use client";

import React, { useState, useRef, useEffect } from "react";
import { Sparkles, X, Send, MessageSquare, Loader2 } from "lucide-react";

type CopilotContext = {
  page?: string;
  labs?: any;
  predictions?: any;
  explanation?: any;
  symptoms?: string[];
  symptom_analysis?: any;
};

type Message = {
  role: "user" | "assistant";
  text: string;
};

interface CopilotWidgetProps {
  context?: CopilotContext;
}

export default function CopilotWidget({ context = {} }: CopilotWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);

  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      text: "Hello! I'm your MediEase AI Copilot. How can I help you understand your health data today?",
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  /**
   * Ensure context always has safe defaults
   */
  const safeContext: CopilotContext = {
    page: context?.page ?? "global",
    labs: context?.labs ?? null,
    predictions: context?.predictions ?? null,
    explanation: context?.explanation ?? null,
    symptoms: context?.symptoms ?? undefined,
    symptom_analysis: context?.symptom_analysis ?? null,
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, loading, isOpen]);

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    setInput("");

    const userMessage: Message = {
      role: "user",
      text: trimmed,
    };

    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      const payload = {
        question: trimmed,
        ...context
      };

      console.log("COPILOT PAYLOAD:", payload);

      const response = await fetch("http://localhost:8000/api/copilot/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch AI response");
      }

      const data = await response.json();

      const aiText =
        data?.answer ||
        data ||
        "I'm sorry, I couldn't generate a response right now.";

      await new Promise((resolve) => setTimeout(resolve, 250));

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: aiText,
        },
      ]);
    } catch (error) {
      console.error("Copilot Error:", error);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text:
            "I'm sorry, I'm having trouble connecting to the medical intelligence server. Please try again in a moment.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999] font-sans antialiased">
      {isOpen && (
        <div className="absolute bottom-20 right-0 w-[360px] h-[500px] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 fade-in duration-300">

          <div className="bg-indigo-600 p-4 flex items-center justify-between text-white shadow-lg">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm tracking-tight">
                  MediEase AI Copilot
                </h3>
                <p className="text-[10px] text-indigo-100 flex items-center gap-1 font-medium">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                  Medical Intelligence Online
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-white/10 p-2 rounded-xl transition-all duration-200 active:scale-90"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${
                  msg.role === "user"
                    ? "justify-end"
                    : "justify-start"
                } animate-in fade-in slide-in-from-bottom-2 duration-300`}
              >
                <div
                  className={`max-w-[85%] p-3.5 rounded-2xl text-[13px] leading-relaxed shadow-sm ${
                    msg.role === "user"
                      ? "bg-indigo-600 text-white rounded-tr-none"
                      : "bg-white text-slate-700 border border-slate-100 rounded-tl-none"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start animate-in fade-in duration-300">
                <div className="bg-white text-slate-500 border border-slate-100 p-3.5 rounded-2xl rounded-tl-none text-[13px] shadow-sm flex items-center gap-2.5">
                  <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
                  <span className="font-medium">AI is thinking...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 bg-white border-t border-slate-100">
            <div className="relative flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about your report, symptoms, or health..."
                className="w-full bg-slate-100 border-none rounded-xl px-4 py-3.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all pr-12 text-slate-700 placeholder:text-slate-400"
                disabled={loading}
              />
              <button
                onClick={handleSend}
                disabled={loading || !input.trim()}
                className="absolute right-2 p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-all shadow-md active:scale-95"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center justify-center gap-1.5 mt-3">
              <span className="text-[9px] text-slate-400 font-medium uppercase tracking-wider">
                Powered by MediEase Medical AI
              </span>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-3 px-6 py-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 group ${
          isOpen
            ? "bg-slate-900 text-white"
            : "bg-indigo-600 text-white hover:bg-indigo-700"
        }`}
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <>
            <MessageSquare className="w-6 h-6 group-hover:rotate-12 transition-transform" />
            <span className="font-bold text-sm tracking-wide">
              AI Copilot
            </span>
          </>
        )}
      </button>
    </div>
  );
}