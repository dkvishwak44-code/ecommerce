
import { cn } from "@/lib/utils";
import { LayoutDashboard, Package, Shield, ShoppingCart, Store, User } from "lucide-react";

// ── Config ────────────────────────────────────────────────────────────────────
const ALLOWED_MODULES = ["product", "order", "role", "dashboard", "store", "user"];
const CRUD_ACTIONS    = ["create", "read", "update", "delete"];

const ACTION_STYLE = {
  create: { label: "Create", color: "text-blue-600 dark:text-blue-400",     accent: "accent-blue-500"    },
  read:   { label: "Read",   color: "text-green-600 dark:text-green-400",   accent: "accent-green-500"   },
  update: { label: "Update", color: "text-yellow-600 dark:text-yellow-500", accent: "accent-yellow-500"  },
  delete: { label: "Delete", color: "text-red-600 dark:text-red-400",       accent: "accent-red-500"     },
};

const MODULE_ICON = {
  product:   <Package         className="h-4 w-4 text-orange-500" />,
  order:     <ShoppingCart    className="h-4 w-4 text-blue-500"   />,
  role:      <Shield         className="h-4 w-4 text-violet-500" />,
  dashboard: <LayoutDashboard className="h-4 w-4 text-green-500"  />,
  store:     <Store           className="h-4 w-4 text-yellow-500" />,
  user:      <User            className="h-4 w-4 text-pink-500"   />,
};
// ── Build matrix ──────────────────────────────────────────────────────────────
const buildMatrix = (permissions = []) => {
  const matrix = {};
  ALLOWED_MODULES.forEach((mod) => {
    const filtered = permissions.filter(
      (p) => p.module === mod && CRUD_ACTIONS.includes(p.action)
    );
    if (filtered.length > 0) matrix[mod] = filtered;
  });
  return matrix;
};

// ── Component ─────────────────────────────────────────────────────────────────
export default function PermissionMatrix({ permissions = [], value = {}, onChange }) {
  const matrix = buildMatrix(permissions);

  const isGranted     = (mod, key) => (value[mod] ?? []).includes(key);
  const grantedCount  = (mod) => (value[mod] ?? []).length;
  const totalInModule = (mod) => matrix[mod]?.length ?? 0;

  // Toggle single permission
  const toggle = (mod, key) => {
    const current = value[mod] ?? [];
    const updated = current.includes(key)
      ? current.filter((k) => k !== key)
      : [...current, key];
    onChange({ ...value, [mod]: updated });
  };

  // Toggle all in a module
  const toggleAll = (mod) => {
    const allKeys    = matrix[mod].map((p) => p.key);
    const current    = value[mod] ?? [];
    const allGranted = allKeys.every((k) => current.includes(k));
    onChange({ ...value, [mod]: allGranted ? [] : allKeys });
  };

  // Toggle everything
  const toggleEverything = () => {
    const allGranted = ALLOWED_MODULES.every((mod) => {
      const allKeys = matrix[mod]?.map((p) => p.key) ?? [];
      return allKeys.every((k) => (value[mod] ?? []).includes(k));
    });
    if (allGranted) {
      onChange({});
    } else {
      const all = {};
      ALLOWED_MODULES.forEach((mod) => {
        if (matrix[mod]) all[mod] = matrix[mod].map((p) => p.key);
      });
      onChange(all);
    }
  };

  const totalGranted = Object.values(value).reduce(
    (sum, arr) => sum + (Array.isArray(arr) ? arr.length : 0), 0
  );
  const totalAvailable = ALLOWED_MODULES.reduce(
    (sum, mod) => sum + (matrix[mod]?.length ?? 0), 0
  );
  const allGranted = totalGranted === totalAvailable && totalAvailable > 0;

  return (
    <div className="divide-y divide-border">

      {/* ── Global Select All Header ──────────────────────────────────────── */}
      <div className="flex items-center justify-between px-5 py-3 bg-muted/30">
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={allGranted}
            onChange={toggleEverything}
            className="h-4 w-4 rounded accent-violet-500 cursor-pointer"
          />
          <span className="text-xs font-semibold text-foreground">
            Select All Permissions
          </span>
        </label>
        <span className="text-[11px] text-muted-foreground">
          {totalGranted} / {totalAvailable} granted
        </span>
      </div>

      {/* ── Module Rows ───────────────────────────────────────────────────── */}
      {ALLOWED_MODULES.map((mod) => {
        const perms = matrix[mod];
        if (!perms || perms.length === 0) return null;

        const count          = grantedCount(mod);
        const total          = totalInModule(mod);
        const modAllGranted  = count === total;
        const modSomeGranted = count > 0 && count < total;

        return (
          <div key={mod} className="grid grid-cols-[200px_1fr] divide-x divide-border">

            {/* Left — Module + select all checkbox */}
            <div className="flex flex-col justify-center gap-1.5 px-5 py-4 bg-muted/10">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={modAllGranted}
                  ref={(el) => { if (el) el.indeterminate = modSomeGranted; }}
                  onChange={() => toggleAll(mod)}
                  className="h-4 w-4 rounded accent-violet-500 cursor-pointer"
                />
                <span className="flex items-center gap-1.5">
                  <span>{MODULE_ICON[mod]}</span>
                  <span className="text-sm font-semibold capitalize text-foreground">
                    {mod}
                  </span>
                </span>
              </label>
              {count > 0 && (
                <span className="ml-6 text-[10px] text-muted-foreground">
                  {count}/{total} selected
                </span>
              )}
            </div>

            {/* Right — CRUD checkboxes */}
            <div className="flex flex-wrap items-center gap-x-8 gap-y-3 px-6 py-4">
              {perms.map((perm) => {
                const style   = ACTION_STYLE[perm.action];
                const granted = isGranted(mod, perm.key);

                return (
                  <label
                    key={perm.key}
                    className="flex items-center gap-2 cursor-pointer select-none group"
                  >
                    <input
                      type="checkbox"
                      checked={granted}
                      onChange={() => toggle(mod, perm.key)}
                      className={cn("h-4 w-4 rounded cursor-pointer", style.accent)}
                    />
                    <span className={cn(
                      "text-sm font-medium transition-colors",
                      granted
                        ? style.color
                        : "text-muted-foreground group-hover:text-foreground"
                    )}>
                      {style.label}
                    </span>
                  </label>
                );
              })}
            </div>

          </div>
        );
      })}
    </div>
  );
}