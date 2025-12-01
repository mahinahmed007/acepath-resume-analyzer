// src/components/SectionScoreCard.tsx


type Props = {
  title: string;
  score: number;
  comment?: string;
};

// ⭐ Max points for each category
const MAX_SCORES: Record<string, number> = {
  "Contact Info": 10,
  "Experience": 25,
  "Education": 10,
  "Skills": 15,
  "Projects": 15,
  "Achievements": 10,
  "Formatting": 10,
  "Keywords": 10,
};

export default function SectionScoreCard({ title, score, comment }: Props) {
  const max = MAX_SCORES[title] ?? 100; // fallback just in case

  // percentage for color logic
  const percent = (score / max) * 100;

  const color =
    percent >= 80
      ? "border-green-300"
      : percent >= 60
      ? "border-yellow-300"
      : "border-red-300";

  return (
    <div className={`p-4 rounded-xl border ${color} bg-white/60 shadow-sm backdrop-blur-sm`}>
      <div className="flex justify-between items-start">
        <h4 className="text-md font-semibold">{title}</h4>

        {/* ⭐ Now shows: 8/10, 22/25, 12/15, etc */}
        <div className="text-blue-600 font-bold">
          {score}/{max}
        </div>
      </div>

      <p className="mt-2 text-sm text-gray-600">{comment || "No comment."}</p>
    </div>
  );
}
