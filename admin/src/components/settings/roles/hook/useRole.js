import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";

import { toast } from "sonner";
import { roleApi } from "../api/roleApi";
// import { permissionApi } from "../api/permissionApi";


export const ROLE_KEYS = {
  all:    ()       => ["roles"],
  list:   (params) => ["roles", "list", params],
  detail: (id)     => ["roles", "detail", id],
};
// ════════════════════════════════════════════════════════
//  ROLE HOOKS
// ════════════════════════════════════════════════════════

// ── GET all roles ─────────────────────────────────────────────────────────────
export const useRoles = (params = {}) => {
  return useQuery({
    queryKey:        ROLE_KEYS.list(params),
    queryFn:         () => roleApi.getAll(params),
    placeholderData: keepPreviousData,
    staleTime:       1000 * 60 * 5,
    select:          (res) => res?.result ?? [],
  });
};

// ── GET single role ───────────────────────────────────────────────────────────
export const useRole = (id) => {
  return useQuery({
    queryKey:  ROLE_KEYS.detail(id),
    queryFn:   () => roleApi.getOne(id),
    enabled:   !!id,
    staleTime: 1000 * 60 * 5,
    select:    (res) => res?.result?.role ?? null,
  });
};

// ── CREATE role ───────────────────────────────────────────────────────────────
export const useCreateRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => roleApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ROLE_KEYS.all() });
      toast.success("Role created.");
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Failed to create role.");
    },
  });
};

// ── UPDATE role ───────────────────────────────────────────────────────────────
export const useUpdateRole = (id) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => roleApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ROLE_KEYS.all() });
      queryClient.invalidateQueries({ queryKey: ROLE_KEYS.detail(id) });
      toast.success("Role updated.");
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Failed to update role.");
    },
  });
};

// ── DELETE role ───────────────────────────────────────────────────────────────
export const useDeleteRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => roleApi.remove(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ROLE_KEYS.all() });
      queryClient.removeQueries({ queryKey: ROLE_KEYS.detail(id) });
      toast.success("Role deleted.");
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Failed to delete role.");
    },
  });
};

// ── ASSIGN permissions to role ────────────────────────────────────────────────
export const useAssignPermissions = (roleId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (permissionIds) => roleApi.assignPermissions(roleId, permissionIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ROLE_KEYS.detail(roleId) });
      queryClient.invalidateQueries({ queryKey: ROLE_KEYS.all() });
      toast.success("Permissions assigned.");
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Failed to assign permissions.");
    },
  });
};

// ── REVOKE permissions from role ──────────────────────────────────────────────
export const useRevokePermissions = (roleId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (permissionIds) => roleApi.revokePermissions(roleId, permissionIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ROLE_KEYS.detail(roleId) });
      queryClient.invalidateQueries({ queryKey: ROLE_KEYS.all() });
      toast.success("Permissions revoked.");
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Failed to revoke permissions.");
    },
  });
};