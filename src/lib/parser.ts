import { GlobalWorkerOptions, getDocument } from "pdfjs-dist";
import workerSrc from "pdfjs-dist/build/pdf.worker?url";

// Set PDF worker
GlobalWorkerOptions.workerSrc = workerSrc;

// Skill database
const SKILLS_DB = [
  "javascript", "typescript", "react", "node", "python", "java", "c++",
  "sql", "mongodb", "docker", "aws", "git", "css", "tailwind", "html"
];

// Extract email
const extractEmail = (t: string) =>
  t.match(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/)?.[0];

// Extract phone
const extractPhone = (t: string) =>
  t.match(/(\+?\d{1,3}[-.\s]?)?(\d{10}|\d{3}[-.\s]\d{3}[-.\s]\d{4})/)?.[0];

// Extract name
function extractName(text: string) {
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
  for (let i = 0; i < 6; i++) {
    const ln = lines[i];
    if (ln && !/\d/.test(ln) && !ln.includes("@") && ln.length < 40) return ln;
  }
  return undefined;
}

// Extract skills
function extractSkills(text: string) {
  const lower = text.toLowerCase();
  return SKILLS_DB.filter((skill) => lower.includes(skill));
}

// MAIN PDF FUNCTION
export async function extractTextFromPdf(file: File) {
  const data = await file.arrayBuffer();
  const pdf = await getDocument({ data }).promise;

  let extractedText = "";

  // Read all pages
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    extractedText += content.items.map((it: any) => it.str).join(" ") + "\n";
  }

  // Generate thumbnail from first page
  const firstPage = await pdf.getPage(1);
  const viewport = firstPage.getViewport({ scale: 2 });

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d")!;

  canvas.width = viewport.width;
  canvas.height = viewport.height;

  // ⭐ FIXED: pdfjs requires { canvas } now
  await firstPage.render({
    canvasContext: ctx,
    viewport,
    canvas, // REQUIRED FIELD
  }).promise;

  const thumbnail = canvas.toDataURL("image/png");

  return {
    text: extractedText.trim(),
    thumbnail,
  };
}

// AI-Style Analyzer
export function analyzeText(text: string) {
  const skills = extractSkills(text);
  const email = extractEmail(text);
  const phone = extractPhone(text);
  const name = extractName(text);

  const atsScore = Math.min(
    100,
    skills.length * 10 + (email ? 10 : 0) + (phone ? 10 : 0)
  );

  const strengths = [
    skills.length > 5 ? "Strong technical skill set" : "Decent skill base",
    text.includes("project") ? "Project experience included" : "",
  ].filter(Boolean);

  const weaknesses = [
    !email && "Email missing",
    !phone && "Phone number missing",
    skills.length < 5 && "Skill section is weak",
    !text.toLowerCase().includes("experience") && "Experience section missing",
  ].filter(Boolean) as string[];

  const suggestions = [
    "Use bullet points for clarity.",
    "Add measurable achievements (e.g., improved sales by 20%).",
    "Include a professional summary at the top.",
    "Highlight major projects with technologies used.",
  ];

  return {
    name,
    email,
    phone,
    skills,
    strengths,
    weaknesses,
    suggestions,
    atsScore,
    summary: `Estimated ATS score: ${atsScore}/100`,
    extractedText: text,
  };
}
