// src/pages/UploadPage.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { extractTextFromPdf } from "../lib/parser";
import { analyzeResume } from "../lib/ai";
import { save } from "../lib/storage";
import { v4 as uuidv4 } from "uuid";
import { Upload , } from "lucide-react";
import LoadingSpinner from "../components/LoadingSpinner";
import ResumeCard from "../components/ResumeCard";


export default function UploadPage() {
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (f) setFile(f);
  }

  async function handleAnalyze() {
    if (!file) {
      setError("Please select a resume file.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const { text, thumbnail } = await extractTextFromPdf(file);
      const ai = await analyzeResume(text);

      const id = uuidv4();
      const item = {
        id,
        createdAt: Date.now(),
        thumbnail,
        extractedText: text,
        ...ai,
      };

      save(item);
      navigate(`/analyze/${id}`, { state: { item } });
    } catch (err) {
      console.error(err);
      setError("Analysis failed. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen  mt-30 flex flex-col items-center">
      {/* Floating Back Button */}
<button
  onClick={() => navigate("/")}
  className="
    fixed top-8 left-12 z-50
    px-5 py-2 rounded-lg
    border border-blue-500 text-blue-600
    font-semibold
    hover:bg-blue-500 hover:text-white
    hover:shadow-lg
    transition-all duration-300
  "
>
  Back to Dashboard 
</button>



      
      {/* ----------- Page Title ----------- */}
      <h1 className="text-4xl font-bold text-gray-900 mb-2">Resume Analyser</h1>
      <p className="text-gray-600 mb-10 text-center">
        Get AI-powered insights to optimize your resume for ATS systems
      </p>

      {/* ----------- Upload Box ----------- */}
      <div className="w-full max-w-4xl bg-white shadow-md rounded-2xl p-8 border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Upload Resume</h2>
        <p className="text-gray-500 text-sm mb-4">
          Upload your resume in PDF, DOC, or DOCX format
        </p>

        {/* File Input */}
        <div className="flex items-center gap-4">
          <label className="w-full">
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileSelect}
              className="hidden"
            />
            <div className="border border-gray-300 rounded-lg px-4 py-3 w-full cursor-pointer hover:bg-gray-50">
              {file ? (
                <span className="text-gray-800 font-medium">{file.name}</span>
              ) : (
                <span className="text-gray-500">Choose File</span>
              )}
            </div>
          </label>

          <button
            onClick={handleAnalyze}
            disabled={loading || !file}
            className={`flex items-center gap-2 px-5 py-3 rounded-lg text-white font-semibold transition ${
              file ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-300 cursor-not-allowed"
            }`}
          >
            <span>Analyze</span>
            <span ><Upload /></span>
          </button>
        </div>

        {error && <p className="text-red-600 text-sm mt-3">{error}</p>}
      </div>

  {/* ----------- Previously Analyzed Resumes ----------- */}
<div className="w-full max-w-6xl mt-14">
  

  {
    (() => {
      let history: any[] = [];

      try {
        history = JSON.parse(
          localStorage.getItem("resume_analyzer_history_v1") || "[]"
        );
      } catch (e) {
        history = [];
      }

      // ⭐ If no resumes → show your original empty UI
      if (history.length === 0) {
        return (
          <div className="w-full max-w-4xl bg-white shadow-sm border border-gray-200 rounded-2xl p-16  text-center mx-auto">
            <div className="text-gray-400 text-6xl mb-4">📄</div>

            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              No Resume Analyzed Yet
            </h3>

            <p className="text-gray-600">
              Upload your resume to get AI-powered analysis and suggestions
            </p>
          </div>
        );
      }

      // ⭐ IF RESUMES EXIST — show heading + cards
    return (
      <>
        <h2 className="text-2xl font-bold text-gray-900  mb-6">
          Previously Analyzed Resumes
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {history.map((item: any) => (
            <ResumeCard
              key={item.id}
              item={item}
            />
          ))}
        </div>
      </>
    );
  })()}

</div>


      {loading && <LoadingSpinner />}
    </div>
  );
}
