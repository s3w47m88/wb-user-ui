import React from "react";
import { ChevronDown } from "lucide-react";

type BrandedSelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  containerClassName?: string;
  chromeSize?: "sm" | "md";
};

const SIZE_STYLES = {
  sm: {
    select: "h-9 rounded-xl px-3 pr-9 text-sm",
    icon: "w-9",
    chevron: 16,
  },
  md: {
    select: "h-12 rounded-2xl px-4 pr-11 text-sm",
    icon: "w-11",
    chevron: 18,
  },
} as const;

export const BrandedSelect = React.forwardRef<
  HTMLSelectElement,
  BrandedSelectProps
>(function BrandedSelect(
  {
    children,
    className = "",
    containerClassName = "",
    chromeSize = "md",
    ...props
  },
  ref,
) {
  const styles = SIZE_STYLES[chromeSize];

  return (
    <div className={`relative ${containerClassName}`.trim()}>
      <select
        ref={ref}
        {...props}
        className={`w-full appearance-none border border-gray-300 bg-white text-gray-900 shadow-sm transition duration-150 focus:border-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-900/10 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400 ${styles.select} ${className}`.trim()}
      >
        {children}
      </select>
      <span
        className={`pointer-events-none absolute inset-y-0 right-0 flex items-center justify-center text-gray-400 ${styles.icon}`}
      >
        <ChevronDown size={styles.chevron} />
      </span>
    </div>
  );
});
