import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

export default function RefreshButton({
  loading,
  onRefresh,
  children,
}) {
  return (
    <div className="space-y-3">

      {/* Header */}
      <div className="flex items-center justify-end">

        <Button
          variant="outline"
          onClick={onRefresh}
          disabled={loading}
          className="w-7 h-7 rounded-full p-0 flex items-center justify-center"
        >
          <RefreshCw
            className={`h-3 w-3 ${loading ? "animate-spin" : ""}`}
          />
        </Button>

      </div>

      {/* Content */}
      <div
        className={
          loading
            ? "opacity-60 pointer-events-none transition"
            : ""
        }
      >
        {children}
      </div>

    </div>
  );
}