import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import CopilotWidget from "@/components/copilot-widget";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "❤️ MediEase - AI Health Copilot",
  description:
    "MediEase is an AI-powered healthcare assistant for symptom analysis, disease risk prediction, and medical report understanding.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white`}
      >
        {children}
        <CopilotWidget context={{ page: "global" }} />
      </body>
    </html>
  );
}