
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  CheckCheck,
  Minus,
  Package,
  ShoppingCart,
  Users,
  BarChart2,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Config ───────────────────────────────────────────────────────────────────

export const modules = [
  { id: "products",   label: "Products",   icon: Package },
  { id: "orders",     label: "Orders",     icon: ShoppingCart },
  { id: "users",      label: "Users",      icon: Users },
  { id: "analytics",  label: "Analytics",  icon: BarChart2 },
  { id: "settings",   label: "Settings",   icon: Settings },
];

export const actions = [
  {
    id: "view",
    label: "View",
    badgeClass:
      "bg-sky-500/10 text-sky-600 border-sky-500/20 hover:bg-sky-500/10 dark:text-sky-400",
    checkboxClass:
      "data-[state=checked]:bg-sky-500 data-[state=checked]:border-sky-500",
    dotClass: "bg-sky-500",
  },
  {
    id: "create",
    label: "Create",
    badgeClass:
      "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 hover:bg-emerald-500/10 dark:text-emerald-400",
    checkboxClass:
      "data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500",
    dotClass: "bg-emerald-500",
  },
  {
    id: "update",
    label: "Update",
    badgeClass:
      "bg-amber-500/10 text-amber-600 border-amber-500/20 hover:bg-amber-500/10 dark:text-amber-400",
    checkboxClass:
      "data-[state=checked]:bg-amber-500 data-[state=checked]:border-amber-500",
    dotClass: "bg-amber-500",
  },
  {
    id: "delete",
    label: "Delete",
    badgeClass:
      "bg-rose-500/10 text-rose-600 border-rose-500/20 hover:bg-rose-500/10 dark:text-rose-400",
    checkboxClass:
      "data-[state=checked]:bg-rose-500 data-[state=checked]:border-rose-500",
    dotClass: "bg-rose-500",
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function PermissionMatrix({ value = {}, onChange }) {
  const handleChange = (moduleId, actionId, checked) => {
    const updated = { ...value };
    if (!updated[moduleId]) updated[moduleId] = [];
    updated[moduleId] = checked
      ? [...updated[moduleId], actionId]
      : updated[moduleId].filter((a) => a !== actionId);
    onChange(updated);
  };

  const isAllChecked = (moduleId) =>
    actions.every((a) => value?.[moduleId]?.includes(a.id));

  const getCount = (moduleId) =>
    actions.filter((a) => value?.[moduleId]?.includes(a.id)).length;

  const toggleRow = (moduleId) => {
    const updated = { ...value };
    updated[moduleId] = isAllChecked(moduleId) ? [] : actions.map((a) => a.id);
    onChange(updated);
  };

  const toggleAllModules = () => {
    const allFull = modules.every((m) => isAllChecked(m.id));
    const updated = {};
    modules.forEach((m) => {
      updated[m.id] = allFull ? [] : actions.map((a) => a.id);
    });
    onChange(updated);
  };

  const totalGranted = Object.values(value ?? {}).reduce(
    (sum, arr) => sum + (Array.isArray(arr) ? arr.length : 0),
    0
  );

  return (
    <TooltipProvider>
      <div className="w-full">

        {/* Header */}
        <div className="grid grid-cols-[minmax(180px,2fr)_repeat(4,1fr)_52px] items-center border-b border-border  px-5 py-3">
          <span className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
            Module
          </span>
          {actions.map((action) => (
            <div key={action.id} className="flex justify-center">
              <Badge
                variant="outline"
                className={cn(
                  "rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider",
                  action.badgeClass
                )}
              >
                {action.label}
              </Badge>
            </div>
          ))}
          {/* Global toggle-all */}
          <div className="flex justify-center">
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={toggleAllModules}
                  className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  <CheckCheck className="h-3.5 w-3.5" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="top" className="text-xs">
                Toggle all modules
              </TooltipContent>
            </Tooltip>
          </div>
        </div>

        {/* Module rows */}
        {modules.map((mod, idx) => {
          const Icon = mod.icon;
          const count = getCount(mod.id);
          const allChecked = isAllChecked(mod.id);

          return (
            <div
              key={mod.id}
              className={cn(
                "group grid grid-cols-[minmax(180px,2fr)_repeat(4,1fr)_52px] items-center px-5 py-4 transition-colors hover:bg-muted/30 bg-card",
                idx !== modules.length - 1 && "border-b border-border/70"
              )}
            >
              {/* Module info */}
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border bg-background shadow-sm">
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm font-medium leading-none text-foreground">
                    {mod.label}
                  </p>
                  <p className="mt-1 text-[11px] text-muted-foreground">
                    {count > 0
                      ? `${count} of ${actions.length} permissions`
                      : "No access"}
                  </p>
                </div>
              </div>

              {/* Per-action checkboxes */}
              {actions.map((action) => (
                <div key={action.id} className="flex justify-center">
                  <Checkbox
                    checked={!!value?.[mod.id]?.includes(action.id)}
                    onCheckedChange={(checked) =>
                      handleChange(mod.id, action.id, !!checked)
                    }
                    className={cn(
                      "h-[18px] w-[18px] rounded-[5px] border-border/80 transition-all",
                      action.checkboxClass
                    )}
                  />
                </div>
              ))}

              {/* Row toggle-all (visible on hover) */}
              <div className="flex justify-center">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => toggleRow(mod.id)}
                      className={cn(
                        "h-7 w-7 rounded-lg opacity-0 transition-opacity group-hover:opacity-100",
                        allChecked
                          ? "text-violet-500 hover:bg-violet-500/10"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {allChecked
                        ? <Minus className="h-3.5 w-3.5" />
                        : <CheckCheck className="h-3.5 w-3.5" />}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="text-xs">
                    {allChecked ? "Revoke all" : "Grant all"}
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
          );
        })}

        {/* Summary footer */}
        {totalGranted > 0 && (
          <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 border-t border-border/50 bg-muted/20 px-5 py-3">
            <span className="text-[11px] font-semibold text-muted-foreground">
              Summary:
            </span>
            {actions.map((action) => {
              const count = modules.filter((m) =>
                value?.[m.id]?.includes(action.id)
              ).length;
              if (!count) return null;
              return (
                <div key={action.id} className="flex items-center gap-1.5">
                  <span className={cn("h-1.5 w-1.5 rounded-full", action.dotClass)} />
                  <span className="text-[11px] text-muted-foreground">
                    {action.label}:{" "}
                    <span className="font-semibold text-foreground">{count}</span>
                  </span>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </TooltipProvider>
  );
}