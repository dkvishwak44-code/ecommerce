import { cn } from "@/lib/utils"

export function Badge({ children, variant = "success", className }) {
  const styles = {
    default: "bg-muted text-muted-foreground",
    success:
      "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    warning:
      "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
    fail:
      "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    outline: "border border-border text-foreground",
  }

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        styles[variant],
        className
      )}
    >
      {children}
    </span>
  )
}