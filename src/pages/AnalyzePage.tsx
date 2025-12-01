// src/pages/AnalyzePage.tsx
import React, { useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import type { StoredResumeItem } from "../types";

import PDFPreview from "../components/PDFPreview";
import SectionScoreCard from "../components/SectionScoreCard";
import ATSMeter from "../components/ATSMeter";


export default function AnalyzePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const item = location.state?.item as StoredResumeItem;

  const printableRef = useRef<HTMLDivElement | null>(null);

  if (!item) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl font-semibold mb-4">No resume found.</p>
          <button
            onClick={() => navigate("/")}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Return Home
          </button>
        </div>
      </div>
    );
  }

  // ------------------------------
  // Export PDF
  // ------------------------------
  function handleExportPDF() {
    if (!printableRef.current) return;
    const html = printableRef.current.innerHTML;
    const win = window.open("", "_blank", "width=900,height=700");

    win?.document.write(`
      <html>
        <head>
          <title>Resume Analysis Report</title>
          <style>
            body { font-family: Inter, sans-serif; padding: 20px; }
            h2 { margin: 0; }
            .section { margin-bottom: 20px; border: 1px solid #ddd; padding: 15px; border-radius: 8px; }
          </style>
        </head>
        <body>${html}</body>
      </html>
    `);

    setTimeout(() => win?.print(), 500);
  }

  

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ---------------- HEADER ---------------- */}
      <header className="sticky top-0 z-40 bg-white/70 backdrop-blur shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => navigate("/")}
            className="px-4 py-2 rounded-lg bg-white/40 border hover:bg-blue-600 hover:text-white transition"
          >
            Home
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={handleExportPDF}
              className="px-4 py-2 mr-4 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Export PDF
            </button>

           
            
          </div>
        </div>
      </header>

      {/* ---------------- MAIN CONTENT ---------------- */}
      <main className="max-w-7xl mx-auto px-4 py-8 h-[calc(100vh-90px)] overflow-hidden">

        {/* GRID LAYOUT */}
        <div className="grid grid-cols-2 gap-8 h-full">

          {/* LEFT — RESUME PREVIEW (FIXED / STICKY) */}
          <div className="bg-white p-6 rounded-2xl shadow h-full sticky top-[100px] overflow-auto  scrollbar-hide">
            <h2 className="text-xl font-semibold mb-4">Resume Preview</h2>
            <div className="scale-[0.95] origin-top ">
              <PDFPreview thumbnail={item.thumbnail} />
            </div>
          </div>

          {/* RIGHT — SCROLLABLE ANALYSIS */}
          <div className="space-y-6 h-full overflow-y-auto pr-3 scrollbar-hide " ref={printableRef}>

            {/* --------- TOP SCORE CARD ---------- */}
            <div className="p-6 rounded-2xl bg-linear-to-r from-blue-600 to-indigo-600 text-white shadow-xl relative overflow-hidden">
              <div className="flex justify-between">
                <div>
                  <p className="text-sm">Overall Score</p>
                  <div className="text-6xl font-bold">
                    {item.overall_score}
                    <span className="text-xl">/100</span>
                  </div>
                  <p className="text-yellow-300 mt-2 text-md">{item.overall_feedback}</p>
                </div>

                <div className="flex flex-col items-center">
                  <ATSMeter score={item.overall_score} size={100} />
                  <p className="text-xs mt-2">ATS Match</p>
                </div>
              </div>
              <p className="mt-4 opacity-90">{item.summary_comment}</p>
            </div>

            {/* --------- SECTION SCORES GRID ---------- */}
            <div className="grid grid-cols-2 gap-4">
              <SectionScoreCard title="Contact Info" {...item.sections.contact_info} />
              <SectionScoreCard title="Experience" {...item.sections.experience} />
              <SectionScoreCard title="Education" {...item.sections.education} />
              <SectionScoreCard title="Skills" {...item.sections.skills} />
              <SectionScoreCard title="Projects" {...item.sections.projects} />
              <SectionScoreCard title="Achievements" {...item.sections.achievements} />
              <SectionScoreCard title="Formatting" {...item.sections.formatting} />
              <SectionScoreCard title="Keywords" {...item.sections.keywords} />
            </div>

            {/* --------- KEYWORD ANALYSIS ---------- */}
            <div
              className="
    p-5 rounded-2xl 
    bg-white/80 
    backdrop-blur-lg 
    shadow-[0_4px_20px_rgba(0,0,0,0.06)] 
    border border-gray-400/40
    transition-all duration-300 
    hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] 
    hover:-translate-y-1
  "
            >
              <h3 className="font-semibold text-indigo-600 mb-2">Keyword Analysis</h3>

              {/* Detected Keywords */}
              <div className="mb-3">
                <p className="font-medium text-gray-700">Detected Keywords</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {item.keyword_analysis.detected_keywords.length ? (
                    item.keyword_analysis.detected_keywords.map((k, i) => (
                      <span key={i} className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">
                        {k}
                      </span>
                    ))
                  ) : (
                    <p className="text-gray-500">None detected.</p>
                  )}
                </div>
              </div>

              {/* Missing Keywords */}
              <div className="mb-3">
                <p className="font-medium text-gray-700">Missing Keywords</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {item.keyword_analysis.missing_keywords.length ? (
                    item.keyword_analysis.missing_keywords.map((k, i) => (
                      <span key={i} className="px-2 py-1 bg-rose-100 text-rose-700 rounded text-xs">
                        {k}
                      </span>
                    ))
                  ) : (
                    <p className="text-gray-500">None missing.</p>
                  )}
                </div>
              </div>

              {/* Weak Action Verbs */}
              <div>
                <p className="font-medium text-gray-700">Weak Action Verbs</p>
                <ul className="list-disc ml-5 text-gray-600">
                  {item.keyword_analysis.weak_action_verbs.length ? (
                    item.keyword_analysis.weak_action_verbs.map((v, i) => <li key={i}>{v}</li>)
                  ) : (
                    <li>No weak verbs.</li>
                  )}
                </ul>
              </div>

              {/* Recommended Action Verbs */}
              <div className="mt-3">
                <p className="font-medium text-gray-700">Recommended Action Verbs</p>
                <ul className="list-disc ml-5 text-green-700">
                  {item.keyword_analysis.recommended_action_verbs.map((v, i) => (
                    <li key={i}>{v}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* --------- GRAMMAR ISSUES ---------- */}
            <div
              className="
    p-5 rounded-2xl 
    bg-white/80 
    backdrop-blur-lg 
    shadow-[0_4px_20px_rgba(0,0,0,0.06)] 
    border border-gray-400/40
    transition-all duration-300 
    hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] 
    hover:-translate-y-1
  "
            >
              <h3 className="font-semibold text-rose-700 mb-2">Grammar Issues</h3>
              <ul className="list-disc ml-5 text-gray-700">
                {item.grammar_issues.length ? (
                  item.grammar_issues.map((g, i) => <li key={i}>{g}</li>)
                ) : (
                  <li>No grammar issues found.</li>
                )}
              </ul>
            </div>

            {/* --------- BULLET REWRITES ---------- */}
            <div
              className="
    p-5 rounded-2xl 
    bg-white/80 
    backdrop-blur-lg 
    shadow-[0_4px_20px_rgba(0,0,0,0.06)] 
    border border-gray-200 
    transition-all duration-300 
    hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] 
    hover:-translate-y-1
  "
            >
              <h3 className="font-semibold text-blue-700 mb-2">Improved Bullet Points</h3>

              {item.bullet_rewrite.length ? (
                item.bullet_rewrite.map((b, i) => (
                  <div key={i} className="mb-4 p-3 bg-gray-50 rounded-lg ">
                    <p className="text-sm text-gray-700 font-bold">Original:</p>
                    <p className="text-gray-700">{b.original}</p>
                    <p className="text-sm mt-2 text-gray-700 font-bold">Improved:</p>
                    <p className="text-green-700 font-medium">{b.improved}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No bullet rewrites available.</p>
              )}
            </div>

            {/* --------- ROLE MATCH ---------- */}
            <div
              className="
    p-5 rounded-2xl 
    bg-white/80 
    backdrop-blur-lg 
    shadow-[0_4px_20px_rgba(0,0,0,0.06)] 
    border border-gray-400/40
    transition-all duration-300 
    hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] 
    hover:-translate-y-1
  "
            >
              <h3 className="font-semibold text-purple-700 mb-2">Role Match</h3>
              <div className="flex flex-wrap gap-2 mb-2">
                {item.role_match.best_fit_roles.map((r, i) => (
                  <span key={i} className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs">
                    {r}
                  </span>
                ))}
              </div>
              <p className="text-gray-700">{item.role_match.match_explanation}</p>
            </div>

            {/* --------- GOOD / BAD / TIPS ---------- */}
            <div
              className="
    p-5 rounded-2xl 
    bg-white/80 
    backdrop-blur-lg 
    shadow-[0_4px_20px_rgba(0,0,0,0.06)] 
    border border-gray-400/40
    transition-all duration-300 
    hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] 
    hover:-translate-y-1
  "
            >
              <h3 className="font-semibold text-green-700 mb-2">What's Good</h3>
              <ul className="list-disc ml-5 text-green-700">
                {item.what_is_good.map((g, i) => <li key={i}>{g}</li>)}
              </ul>
            </div>

            <div
              className="
    p-5 rounded-2xl 
    bg-white/80 
    backdrop-blur-lg 
    shadow-[0_4px_20px_rgba(0,0,0,0.06)] 
    border border-gray-400/40
    transition-all duration-300 
    hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] 
    hover:-translate-y-1
  "
            >
              <h3 className="font-semibold text-rose-700 mb-2">Needs Improvement</h3>
              <ul className="list-disc ml-5 text-rose-700">
                {item.needs_improvement.map((g, i) => <li key={i}>{g}</li>)}
              </ul>
            </div>
            <div
              className="
    p-5 rounded-2xl 
    bg-white/80 
    backdrop-blur-lg 
    shadow-[0_4px_20px_rgba(0,0,0,0.06)] 
    border border-gray-400/40
    transition-all duration-300 
    hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] 
    hover:-translate-y-1
  " >
              <h3 className="font-semibold text-yellow-700 mb-2">Tips for Improvement</h3>
              <ul className="list-disc ml-5 text-yellow-700">
                {item.tips_for_improvement.map((g, i) => <li key={i}>{g}</li>)}
              </ul>
            </div>

            {/* TIMESTAMP */}
            <div className="text-xs text-gray-500 pb-10">
              Generated on {new Date(item.createdAt).toLocaleString()}
            </div>

          </div>
        </div>
      </main>

    </div>
  );
}
