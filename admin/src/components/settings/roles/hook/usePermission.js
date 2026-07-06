import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { permissionApi } from "../api/permissionApi";

// ── Query Keys ────────────────────────────────────────────────────────────────
export const PERMISSION_KEYS = {
  all:    ()       => ["permissions"],
  list:   (params) => ["permissions", "list", params],
  detail: (id)     => ["permissions", "detail", id],
};


// ════════════════════════════════════════════════════════
//  PERMISSION HOOKS
// ════════════════════════════════════════════════════════

// ── GET all permissions ───────────────────────────────────────────────────────
export const usePermissions = (params = {}) => {
  return useQuery({
    queryKey:        PERMISSION_KEYS.list(params),
    queryFn:         () => permissionApi.getAll(params),
    placeholderData: keepPreviousData,
    staleTime:       1000 * 60 * 5,  // 5 min — permissions rarely change
    select:          (res) => res?.result?.permissions,  // adjust to your response shape
  });
};

// ── GET single permission ─────────────────────────────────────────────────────
export const usePermission = (id) => {
  return useQuery({
    queryKey:  PERMISSION_KEYS.detail(id),
    queryFn:   () => permissionApi.getOne(id),
    enabled:   !!id,
    staleTime: 1000 * 60 * 5,
    select:    (res) => res?.result?.permission ?? null,
  });
};

// ── CREATE permission ─────────────────────────────────────────────────────────
export const useCreatePermission = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => permissionApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PERMISSION_KEYS.all() });
      toast.success("Permission created.");
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Failed to create permission.");
    },
  });
};

// ── UPDATE permission ─────────────────────────────────────────────────────────
export const useUpdatePermission = (id) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => permissionApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PERMISSION_KEYS.all() });
      queryClient.invalidateQueries({ queryKey: PERMISSION_KEYS.detail(id) });
      toast.success("Permission updated.");
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Failed to update permission.");
    },
  });
};

// ── DELETE permission ─────────────────────────────────────────────────────────
export const useDeletePermission = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => permissionApi.remove(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: PERMISSION_KEYS.all() });
      queryClient.removeQueries({ queryKey: PERMISSION_KEYS.detail(id) });
      toast.success("Permission deleted.");
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Failed to delete permission.");
    },
  });
};
