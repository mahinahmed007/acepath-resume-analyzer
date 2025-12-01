// src/components/PDFPreview.tsx
import React from "react";

export default function PDFPreview({ thumbnail }: { thumbnail: string }) {
  // The thumbnail is expected to be a dataURL or image URL
  return (
    <div className=" rounded-lg bg-white p-4">
      <img src={thumbnail} alt="Resume preview" className="w-full h-auto border" />
    </div>
  );
}
