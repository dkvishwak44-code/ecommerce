import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import { productApi } from "../api/productApi";
import { toast } from "sonner";

// ── Query Keys ────────────────────────────────────────────────────────────────
export const PRODUCT_KEYS = {
  all:    ()       => ["products"],
  list:   (params) => ["products", "list", params],
  detail: (id)     => ["products", "detail", id],
};

// ── GET all products ──────────────────────────────────────────────────────────
export const useProducts = (params = {}) => {
  return useQuery({
    queryKey:     PRODUCT_KEYS.list(params),
    queryFn:      () => productApi.getAll(params),
    placeholderData: keepPreviousData,  // smooth pagination — no loading flicker
    staleTime:    1000 * 30,            // 30s fresh
    select:       (res) => res?.result?.products,   // adjust to your response shape
  });
};

// ── GET single product ────────────────────────────────────────────────────────
export const useProduct = (id) => {
  return useQuery({
    queryKey: PRODUCT_KEYS.detail(id),
    queryFn:  () => productApi.getOne(id),
    enabled:  !!id,                     // don't run if no id
    staleTime: 1000 * 60,               // 60s fresh
    select:   (res) => res?.result?.product,
  });
};

// ── CREATE product ────────────────────────────────────────────────────────────
export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => productApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCT_KEYS.all() });
      toast.success("Product created successfully.");
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to create product.");
    },
  });
};

// ── UPDATE product ────────────────────────────────────────────────────────────
export const useUpdateProduct = (id) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => productApi.update(id, data),
    onSuccess: () => {
      // Invalidate both list and this specific product
      queryClient.invalidateQueries({ queryKey: PRODUCT_KEYS.all() });
      queryClient.invalidateQueries({ queryKey: PRODUCT_KEYS.detail(id) });
      toast.success("Product updated.");
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to update product.");
    },
  });
};

// ── DELETE product ────────────────────────────────────────────────────────────
export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => productApi.remove(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: PRODUCT_KEYS.all() });
      queryClient.removeQueries({ queryKey: PRODUCT_KEYS.detail(id) }); // remove from cache
      toast.success("Product deleted.");
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to delete product.");
    },
  });
};

// ── UPLOAD images ─────────────────────────────────────────────────────────────
export const useUploadProductImages = (id) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData) => productApi.uploadImages(id, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCT_KEYS.detail(id) });
      toast.success("Images uploaded.");
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Image upload failed.");
    },
  });
};

// ── TOGGLE featured ───────────────────────────────────────────────────────────
export const useToggleFeatured = (id) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (isFeatured) => productApi.toggleFeatured(id, isFeatured),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCT_KEYS.all() });
      queryClient.invalidateQueries({ queryKey: PRODUCT_KEYS.detail(id) });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to update featured status.");
    },
  });
};

// ── TOGGLE publish ────────────────────────────────────────────────────────────
export const useTogglePublish = (id) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (isPublished) => productApi.togglePublish(id, isPublished),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCT_KEYS.all() });
      queryClient.invalidateQueries({ queryKey: PRODUCT_KEYS.detail(id) });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to update publish status.");
    },
  });
};