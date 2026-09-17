"use client";

interface ProgressBarProps {
  value: number;
  max: number;
  variant?: "emerald" | "amber" | "sky";
  label: string;
  valueLabel: string;
}

export default function ProgressBar({
  value,
  max,
  variant = "emerald",
  label,
  valueLabel,
}: ProgressBarProps) {
  const variants = {
    emerald: "bg-emerald-600",
    amber: "bg-amber-500",
    sky: "bg-sky-500",
  };

  const bgColors = {
    emerald: "bg-emerald-100",
    amber: "bg-amber-100",
    sky: "bg-sky-100",
  };

  const percentage = (value / max) * 100;

  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="text-slate-600">{label}</span>
        <span className="font-semibold text-slate-800">{valueLabel}</span>
      </div>
      <div className={`h-1.5 rounded-full ${bgColors[variant]}`}>
        <div
          className={`h-full ${variants[variant]} rounded-full transition-all duration-300`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
