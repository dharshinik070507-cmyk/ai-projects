import { cn } from "@/lib/utils";

interface GradeBadgeProps {
  grade: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function GradeBadge({ grade, className, size = "md" }: GradeBadgeProps) {
  const getGradeColor = (g: string) => {
    const normalized = g.toUpperCase();
    if (normalized.includes("A")) return "bg-green-100 text-green-700 border-green-200";
    if (normalized.includes("B")) return "bg-yellow-100 text-yellow-700 border-yellow-200";
    return "bg-red-100 text-red-700 border-red-200";
  };

  const sizeClasses = {
    sm: "text-xs px-2 py-0.5",
    md: "text-sm px-3 py-1",
    lg: "text-xl px-6 py-2",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center justify-center font-bold rounded-full border shadow-sm",
        getGradeColor(grade),
        sizeClasses[size],
        className
      )}
    >
      {grade}
    </span>
  );
}
