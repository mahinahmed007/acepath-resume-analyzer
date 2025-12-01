import React from "react";
import { useNavigate } from "react-router-dom";
import { removeById } from "../lib/storage";
import ATSMeter from "./ATSMeter";

export default function ResumeCard({ item }: any) {
  const navigate = useNavigate();

  function handleDelete(e: any) {
    e.stopPropagation();
    removeById(item.id);
    window.location.reload(); // refresh UI after delete
  }

  function handleView() {
    navigate(`/analyze/${item.id}`, { state: { item } });
  }

  return (
    <div
      className="
        group relative bg-white rounded-2xl p-5 shadow-md border border-gray-200
        hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer
      "
      onClick={handleView}
    >
      {/* HEADER */}
      <div className="flex justify-between items-start mb-3">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Resume</h2>
          <p className="text-gray-500 text-sm">
            Last analyzed: {new Date(item.createdAt).toLocaleDateString()}
          </p>
        </div>

        {/* Score Circle */}
        <div className="w-14 h-14">
          <ATSMeter score={item.overall_score} size={56} />
        </div>
      </div>

      {/* Thumbnail */}
      <div
        className="
          overflow-hidden rounded-xl 
          bg-gray-100 h-[280px]
        "
      >
        <img
          src={item.thumbnail}
          alt="resume"
                   className="w-full h-full object-cover object-top"

        />
      </div>

       {/* Hover Buttons */}
      <div
       className="
          absolute inset-0 bg-black/15 backdrop-blur-sm rounded-2xl
          opacity-0 group-hover:opacity-100
          flex items-center justify-center gap-4
          transition-all duration-300
        "
      >
        <button
          onClick={handleView}
         className="px-4 py-2 bg-white text-blue-600 rounded-lg font-semibold 
          shadow hover:bg-blue-100"
        >
          View
        </button>

        <button
          onClick={handleDelete}
           className="px-4 py-2 bg-rose-600 text-white rounded-lg font-semibold 
          shadow hover:bg-rose-700"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
