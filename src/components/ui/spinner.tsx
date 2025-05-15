// src/components/ui/spinner.tsx

import { SVGProps } from "react";

export const Spinner = ({ size = "md" }: { size?: "sm" | "md" | "lg" }) => {
  const sizeClasses = size === "sm" ? "w-4 h-4" : size === "lg" ? "w-8 h-8" : "w-6 h-6";

  return (
    <svg
      className={`animate-spin ${sizeClasses}`}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 50 50"
      fill="none"
    >
      <circle
        className="opacity-25"
        cx="25"
        cy="25"
        r="20"
        stroke="currentColor"
        strokeWidth="5"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M5 25a20 20 0 1 0 40 0 20 20 0 1 0-40 0z"
      ></path>
    </svg>
  );
};
