// src/components/ATSMeter.tsx
import { useEffect, useRef } from "react";

type ATSMeterProps = {
  score: number;    // 0–100 ATS score
  size?: number;
  strokeWidth?: number;
};

export default function ATSMeter({ score, size = 100, strokeWidth = 10 }: ATSMeterProps) {
  const circleRef = useRef<SVGCircleElement | null>(null);

  const normalized = Math.min(100, Math.max(0, Math.round(score)));

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  // Color theme depending on score
 const color =
    normalized >= 80
      ? "#10b981" // green
      : normalized >= 60
      ? "#f9da0f" // yellow
      : normalized >= 40
      ? "#f59e0b" // amber
      : "#ef4444"; // red

  useEffect(() => {
    if (circleRef.current) {
      const offset = circumference - (normalized / 100) * circumference;
      circleRef.current.style.strokeDashoffset = offset.toString();
      circleRef.current.style.transition = "stroke-dashoffset 1s ease-out";
    }
  }, [normalized, circumference]);

  return (
    <svg width={size} height={size} className="block">
      <g transform={`translate(${size / 2}, ${size / 2})`}>
        
        {/* Background circle */}
        <circle
          r={radius}
          fill="transparent"
          stroke="#e5e7eb"
          strokeWidth={strokeWidth}
        />

        {/* Gradient stroke */}
        <circle
          ref={circleRef}
          r={radius}
          fill="transparent"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference}
          transform="rotate(-90)"
        />

        {/* Score text */}
        <text
          x="0"
          y="6"
          textAnchor="middle"
          fontSize={size * 0.25}
          fontWeight="700"
          fill={color}
        >
          {normalized}
        </text>
      </g>
    </svg>
  );
}
