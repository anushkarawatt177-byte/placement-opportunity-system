import React from 'react';

interface CircularProgressProps {
  score: number; // 0 to 100
  size?: number;
  strokeWidth?: number;
  label?: string;
  sublabel?: string;
}

export const CircularProgress: React.FC<CircularProgressProps> = ({
  score,
  size = 140,
  strokeWidth = 10,
  label = 'Readiness Score',
  sublabel = 'out of 100',
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  // Determine stroke color based on score
  let strokeColor = '#2563eb'; // blue-600 default
  if (score >= 85) strokeColor = '#16a34a'; // green-600
  else if (score >= 70) strokeColor = '#2563eb'; // blue-600
  else if (score >= 50) strokeColor = '#d97706'; // amber-600
  else strokeColor = '#dc2626'; // red-600

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#e2e8f0"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Foreground animated progress */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-3xl font-bold tracking-tight text-slate-900 tabular-nums">
            {score}
          </span>
          <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">
            {sublabel}
          </span>
        </div>
      </div>
      {label && (
        <span className="mt-3 text-xs font-semibold text-slate-700 tracking-wide uppercase">
          {label}
        </span>
      )}
    </div>
  );
};
