"use client";

interface BadgeProps {
  variant: "difficulty" | "light";
  value: string;
  className?: string;
}

export default function Badge({ variant, value, className = "" }: BadgeProps) {
  const variants = {
    difficulty: {
      easy: "border border-emerald-200 bg-emerald-50 text-emerald-800",
      medium: "border border-amber-200 bg-amber-50 text-amber-800",
      hard: "border border-rose-200 bg-rose-50 text-rose-800",
    },
    light: {
      low: "border border-sky-200 bg-sky-50 text-sky-800",
      medium: "border border-amber-200 bg-amber-50 text-amber-800",
      high: "border border-orange-200 bg-orange-50 text-orange-800",
    },
  };

  const labels = {
    difficulty: {
      easy: "Fácil",
      medium: "Media",
      hard: "Difícil",
    },
    light: {
      low: "Poca luz",
      medium: "Luz media",
      high: "Mucha luz",
    },
  };

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-wide ${
        variants[variant][value as keyof (typeof variants)[typeof variant]]
      } ${className}`}
    >
      {labels[variant][value as keyof (typeof labels)[typeof variant]]}
    </span>
  );
}
