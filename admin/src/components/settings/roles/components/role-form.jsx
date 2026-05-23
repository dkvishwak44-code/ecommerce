import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  AlertCircle,
  Loader2,
  Save,
  X,
  ShieldCheck,
  ArrowLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";
import PermissionMatrix from "./permission-matrix";

export default function RoleForm({
  initialData = null,
  onSubmit,
  onCancel,
  loading = false,
}) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors, isDirty },
  } = useForm({
    defaultValues: { name: "", permissions: {} },
  });

  const actions = [
    {
      id: "view",
      label: "View",
      dotClass: "bg-green-500",
    },
    {
      id: "create",
      label: "Create",
      dotClass: "bg-blue-500",
    },
    {
      id: "update",
      label: "Update",
      dotClass: "bg-yellow-500",
    },
    {
      id: "delete",
      label: "Delete",
      dotClass: "bg-red-500",
    },
  ];

  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name ?? "",
        permissions: initialData.permissions ?? {},
      });
    }
  }, [initialData, reset]);

  const watchedPermissions = watch("permissions");
  const totalGranted = Object.values(watchedPermissions ?? {}).reduce(
    (sum, arr) => sum + (Array.isArray(arr) ? arr.length : 0),
    0,
  );

  // const onFormSubmit = (data) => {
  //   console.log(" Form Data:", data);
  //   if (typeof onSubmit === "function") onSubmit(data);
  // };

  return (
    <div className="flex min-h-screen w-full flex-col bg-card">
      <form
        onSubmit={handleSubmit(onSubmit, (err) =>
          console.log("❌ Validation errors:", err),
        )}
        noValidate
        className="flex flex-1 flex-col "
      >
        <div className="bg-card">
          {/* ── Sticky Top Bar ─────────────────────────────────────── */}
          <div className="sticky top-0 z-10 border-b border-border backdrop-blur">
            <div className="flex h-14 items-center justify-between px-6">
              {/* Left: back + title */}
              <div className="flex items-center gap-3">
                {/* <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={onCancel}
                className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button> */}
                <Separator orientation="vertical" className="h-5" />
                <div className="flex items-center gap-2.5">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-500/10">
                    <ShieldCheck className="h-4 w-4 text-violet-500" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold leading-none text-foreground">
                      {initialData ? "Edit Role" : "Create Role"}
                    </p>
                    <p className="mt-0.5 text-[11px] leading-none text-muted-foreground">
                      {initialData
                        ? "Update role name and permissions"
                        : "Define a new role and its permissions"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Right: status + actions */}
              {/* <div className="flex items-center gap-2.5">
              {isDirty && (
                <span className="hidden text-[11px] text-muted-foreground sm:inline">
                  Unsaved changes
                </span>
              )}
              {totalGranted > 0 && (
                <Badge className="gap-1.5 rounded-full bg-violet-500/10 px-2.5 py-1 text-[11px] font-semibold text-violet-600 hover:bg-violet-500/10 dark:text-violet-400">
                  <ShieldCheck className="h-3 w-3" />
                  {totalGranted} granted
                </Badge>
              )}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onCancel}
                disabled={loading}
                className="h-8 gap-1.5 rounded-lg text-xs"
              >
                <X className="h-3.5 w-3.5" />
                Discard
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={loading}
                className="h-8 gap-1.5 rounded-lg bg-violet-600 text-xs text-white hover:bg-violet-700"
              >
                {loading ? (
                  <><Loader2 className="h-3.5 w-3.5 animate-spin" />Saving...</>
                ) : (
                  <><Save className="h-3.5 w-3.5" />Save Role</>
                )}
              </Button>
            </div> */}
            </div>
          </div>

          {/* ── Body ───────────────────────────────────────────────── */}
          <div className="flex-1 px-6 py-8">
            <div className="mx-auto w-full max-w-5xl overflow-hidden rounded-xl border border-border shadow-sm">
              {/* Row 1 — Role Name */}
              <div className="grid grid-cols-1 border-b border-border md:grid-cols-[260px_1fr]">
                <div className="border-b border-border p-6 md:border-b-0 md:border-r">
                  <p className="text-sm font-semibold text-foreground">
                    Role Name
                  </p>
                  <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                    A short, descriptive label that identifies this role across
                    the system.
                  </p>
                </div>
                <div className="bg-card p-6">
                  <input
                    id="role-name"
                    placeholder="e.g. Manager, Staff, Viewer..."
                    autoComplete="off"
                    className={cn(
                      "w-full rounded-lg border border-border bg-muted/30 px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none transition-all focus:border-violet-500 focus:bg-background focus:ring-2 focus:ring-violet-500/20",
                      errors.name &&
                        "border-destructive focus:border-destructive focus:ring-destructive/20",
                    )}
                    {...register("name", {
                      required: "Role name is required.",
                      minLength: {
                        value: 2,
                        message: "At least 2 characters required.",
                      },
                      maxLength: {
                        value: 50,
                        message: "Maximum 50 characters.",
                      },
                    })}
                  />
                  {errors.name && (
                    <p className="mt-2 flex items-center gap-1.5 text-xs text-destructive">
                      <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                      {errors.name.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Row 2 — Permissions */}
              <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] ">
                <div className="border-b border-border  p-6 md:border-b-0 md:border-r">
                  <p className="text-sm font-semibold text-foreground">
                    Permissions
                  </p>
                  <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                    Control which modules this role can access and what actions
                    are allowed.
                  </p>
                  <div className="mt-5 space-y-2.5">
                    {actions.map((action) => (
                      <div key={action.id} className="flex items-center gap-2">
                        <span
                          className={cn(
                            "h-2 w-2 rounded-full",
                            action.dotClass,
                          )}
                        />
                        <span className="text-xs capitalize text-muted-foreground">
                          {action.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-background">
                  <Controller
                    name="permissions"
                    control={control}
                    render={({ field }) => (
                      <PermissionMatrix
                        value={field.value}
                        onChange={field.onChange}
                      />
                    )}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ── Sticky Bottom Bar ──────────────────────────────────── */}
          <div className="sticky bottom-0 z-10 border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
            <div className="flex h-14 items-center justify-between px-6">
              <p className="text-xs text-muted-foreground">
                {isDirty
                  ? "⚠ You have unsaved changes."
                  : "Changes will be saved when you click Save Role."}
              </p>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={onCancel}
                  disabled={loading}
                  className="h-8 gap-1.5 rounded-lg text-xs"
                >
                  <X className="h-3.5 w-3.5" />
                  Discard
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  disabled={loading}
                  variant="blue"
                  // className="h-8 gap-1.5 rounded-lg bg-violet-600 text-xs text-white hover:bg-violet-700"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-3.5 w-3.5" />
                      Save Role
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
