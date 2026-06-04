import { cn } from "@/lib/utils";

export function Card({ className, ...props }) {
  return (
    <div
      className={cn(
        "bg-gray-900 border border-gray-800 rounded-xl p-5",
        className
      )}
      {...props}
    />
  );
}

export function Badge({ variant = "default", className, children }) {
  const variants = {
    default: "bg-gray-800 text-gray-300 border-gray-700",
    hot: "bg-red-500/10 text-red-400 border-red-500/20",
    warm: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    cold: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    violet: "bg-violet-500/10 text-violet-400 border-violet-500/20",
    green: "bg-green-500/10 text-green-400 border-green-500/20",
    sky: "bg-sky-500/10 text-sky-400 border-sky-500/20",
    emerald: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border",
        variants[variant] || variants.default,
        className
      )}
    >
      {children}
    </span>
  );
}

export function ScoreBar({ score }) {
  if (score === null || score === undefined) {
    return <span className="text-gray-600 text-xs">—</span>;
  }

  const color =
    score >= 65 ? "bg-red-500" : score >= 40 ? "bg-amber-500" : "bg-blue-500";

  return (
    <div className="flex items-center gap-2">
      <div className="w-16 h-1.5 bg-gray-800 rounded-full overflow-hidden">
        <div
          className={cn(color, "h-full rounded-full transition-all duration-300")}
          style={{ width: `${score}%` }}
        />
      </div>
      <span className="text-gray-300 font-mono text-xs w-6">{score}</span>
    </div>
  );
}

export function Button({
  variant = "primary",
  size = "default",
  className,
  children,
  ...props
}) {
  const variants = {
    primary: "bg-violet-600 hover:bg-violet-500 text-white",
    secondary: "bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-700",
    ghost: "hover:bg-gray-800 text-gray-400 hover:text-white",
    danger: "bg-red-600/10 hover:bg-red-600/20 text-red-400 border border-red-600/20",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    default: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function Input({ className, ...props }) {
  return (
    <input
      className={cn(
        "w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-colors",
        className
      )}
      {...props}
    />
  );
}

export function Select({ className, children, ...props }) {
  return (
    <select
      className={cn(
        "w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-300 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-colors",
        className
      )}
      {...props}
    >
      {children}
    </select>
  );
}

export function Textarea({ className, ...props }) {
  return (
    <textarea
      className={cn(
        "w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-colors resize-none",
        className
      )}
      {...props}
    />
  );
}

export function Skeleton({ className }) {
  return (
    <div
      className={cn(
        "animate-pulse bg-gray-800 rounded",
        className
      )}
    />
  );
}
