"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
// import { roleSchema } from "../validation/role-schema";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input }     from "@/components/ui/input";
import { Textarea }  from "@/components/ui/textarea";
import { Button }    from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Loader2, Save, X, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import PermissionMatrix from "./permission-matrix";
import { roleSchema } from "../validation/role-schema";
import { useCreateRole } from "../hook/useRole";
import { useRouter } from "next/navigation";

// ── Payload transformer ───────────────────────────────────────────────────────
// Converts form shape → backend shape
// { permissions: { product: ["product.create"] } } → { permissions: ["_id1", "_id2"] }
const transformPayload = (data, allPermissions) => {
  const selectedKeys = Object.values(data.permissions).flat().filter(Boolean);

  const permissionIds = selectedKeys
    .map((key) => allPermissions.find((p) => p.key === key)?._id)
    .filter(Boolean);

  return {
    name:        data.name.trim().toLowerCase().replace(/\s+/g, "_"), // "product seller" → "product_seller"
    displayName: data.displayName?.trim() || data.name,
    description: data.description?.trim() || "",
    permissions: permissionIds,
  };
};

// ── Actions legend ────────────────────────────────────────────────────────────
const ACTIONS_LEGEND = [
  { label: "Create", dotClass: "bg-blue-500"   },
  { label: "Read",   dotClass: "bg-green-500"  },
  { label: "Update", dotClass: "bg-yellow-500" },
  { label: "Delete", dotClass: "bg-red-500"    },
];

// ── RoleForm ──────────────────────────────────────────────────────────────────
export default function RoleForm({
  initialData  = null,
  onSubmit,
  onCancel,
  loading      = false,
  permissions  = [],   // raw array from API: [{ _id, key, action, module }]
}) {
   const router = useRouter();
  const {mutate:createRole , isPending} = useCreateRole();

  const form = useForm({
    resolver: zodResolver(roleSchema),
    defaultValues: {
      name:        "",
      displayName: "",
      description: "",
      permissions: {},
    },
  });

  const { formState: { errors, isDirty }, watch } = form;

  // Prefill on edit
  useEffect(() => {
    if (initialData) {
      form.reset({
        name:        initialData.name        ?? "",
        displayName: initialData.displayName ?? "",
        description: initialData.description ?? "",
        permissions: initialData.permissions ?? {},
      });
    }
  }, [initialData]);

  // Granted count for bottom bar
  const watchedPermissions = watch("permissions");
  const totalGranted = Object.values(watchedPermissions ?? {}).reduce(
    (sum, arr) => sum + (Array.isArray(arr) ? arr.length : 0), 0
  );

  // ── Submit ──────────────────────────────────────────────────────────────────
  const handleFormSubmit = (data) => {
    const payload = transformPayload(data, permissions);
    console.log("✅ Role payload:", payload);
    // payload = { name, displayName, description, permissions: ["_id1", "_id2"] }
    // onSubmit(payload);
    createRole(payload,{
      onSuccess:()=> router.push("settings/roles")
    })
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-card">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleFormSubmit, (err) =>
            console.log("❌ Validation errors:", err)
          )}
          noValidate
          className="flex flex-1 flex-col"
        >
          {/* ── Sticky Top Bar ───────────────────────────────────────────── */}
          <div className="sticky top-0 z-10 border-b border-border backdrop-blur">
            <div className="flex h-14 items-center gap-3 px-6">
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
          </div>

          {/* ── Body ─────────────────────────────────────────────────────── */}
          <div className="flex-1 px-6 py-8">
            <div className="mx-auto w-full max-w-5xl overflow-hidden rounded-xl border border-border shadow-sm">

              {/* ── Row 1: Role Name ────────────────────────────────────── */}
              <div className="grid grid-cols-1 border-b border-border md:grid-cols-[260px_1fr]">
                <div className="border-b border-border p-6 md:border-b-0 md:border-r">
                  <p className="text-sm font-semibold text-foreground">Role Name</p>
                  <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                    A short, descriptive label that identifies this role.
                  </p>
                </div>
                <div className="bg-card p-6 space-y-4">
                  {/* Name */}
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name <span className="text-destructive">*</span></FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g. seller, manager, staff..."
                            autoComplete="off"
                            className={cn(
                              "focus-visible:ring-violet-500",
                              errors.name && "border-destructive focus-visible:ring-destructive"
                            )}
                            {...field}
                          />
                        </FormControl>
                        <FormDescription className="text-xs">
                          Used as system identifier. Lowercase recommended.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Display Name */}
                  <FormField
                    control={form.control}
                    name="displayName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Display Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g. Product Seller, Store Manager..."
                            {...field}
                          />
                        </FormControl>
                        <FormDescription className="text-xs">
                          Human-readable name shown in the UI.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Description */}
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describe what this role can do..."
                            rows={2}
                            className="resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* ── Row 2: Permissions ───────────────────────────────────── */}
              <div className="grid grid-cols-1 md:grid-cols-[260px_1fr]">
                <div className="border-b border-border p-6 md:border-b-0 md:border-r">
                  <p className="text-sm font-semibold text-foreground">Permissions</p>
                  <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                    Control which modules this role can access and what actions are allowed.
                  </p>
                  {/* Legend */}
                  <div className="mt-5 space-y-2.5">
                    {ACTIONS_LEGEND.map((a) => (
                      <div key={a.label} className="flex items-center gap-2">
                        <span className={cn("h-2 w-2 rounded-full", a.dotClass)} />
                        <span className="text-xs text-muted-foreground">{a.label}</span>
                      </div>
                    ))}
                  </div>
                  {/* Permission error */}
                  {errors.permissions && (
                    <p className="mt-3 text-xs text-destructive">
                      {errors.permissions.message}
                    </p>
                  )}
                </div>

                <div className="bg-background">
                  <FormField
                    control={form.control}
                    name="permissions"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <PermissionMatrix
                            permissions={permissions}
                            value={field.value}
                            onChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>

            </div>
          </div>

          {/* ── Sticky Bottom Bar ────────────────────────────────────────── */}
          <div className="sticky bottom-0 z-10 border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
            <div className="flex h-14 items-center justify-between px-6">
              <p className="text-xs text-muted-foreground">
                {totalGranted > 0
                  ? `${totalGranted} permission${totalGranted > 1 ? "s" : ""} selected`
                  : isDirty
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

        </form>
      </Form>
    </div>
  );
}