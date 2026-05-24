"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams, useRouter } from "next/navigation";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import AutoBreadcrumb from "@/components/layout/auto-breadcrumb";

export default function EditProductPage() {
  const { id } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [preview, setPreview] = useState(null);
  const [existingImage, setExistingImage] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: {
      name: "",
      category: "",
      brand: "",
      price: "",
      stock: "",
      status: "active",
      description: "",
      image: "",
    },
  });

  const status = watch("status");

  useEffect(() => {
    async function fetchProduct() {
      setLoading(true);

      const product = {
        name: "iPhone 15",
        category: "Smartphones",
        brand: "Apple",
        price: 999,
        stock: 10,
        status: "active",
        description: "Latest Apple iPhone with A17 chip",
        image: "https://images.unsplash.com/photo-1591337676887-a217a6970a8a?w=300&h=300&fit=crop",
      };

      reset(product);
      setExistingImage(product.image);
      setPreview(product.image);
      setLoading(false);
    }

    fetchProduct();
  }, [id, reset]);

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    setPreview(url);
    setValue("image", url);
    setExistingImage(null);
  };

  const onSubmit = async (data) => {
    console.log("Updated product:", data);
    router.push(`/products/${id}`);
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen ">
      <div className="container mx-auto  max-w-7xl">
        {/* Header Section */}
        <div className="mb-4">
          <AutoBreadcrumb />
        </div>

        <Separator className="mb-4" />

        {/* Main Content - 1:2:1 Ratio with proper spacing */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Left Column - Image Upload (1/4) */}
          <div className="lg:col-span-1 space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Product Image</h3>
              <div className="rounded-lg border-2 border-dashed border-gray-300 bg-card p-4 transition-all hover:border-gray-400">
                <label className="flex cursor-pointer flex-col items-center justify-center">
                  {preview ? (
                    <div className="relative aspect-square w-full overflow-hidden rounded-md">
                      <img
                        src={preview}
                        alt="Product preview"
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity hover:opacity-100">
                        <p className="text-sm text-white">Click to change</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12">
                      <svg
                        className="mb-4 h-12 w-12 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <p className="text-sm text-gray-600">Click to upload image</p>
                      <p className="text-xs text-gray-400 mt-1">
                        PNG, JPG up to 2MB
                      </p>
                    </div>
                  )}
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </label>
              </div>
              {existingImage && preview === existingImage && (
                <p className="mt-2 text-xs text-green-600">
                  ✓ Current image loaded
                </p>
              )}
            </div>
          </div>

          {/* Middle Column - Form (2/4) */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Product Information</h3>
              <div className="bg-card rounded-lg border p-6 space-y-6">
                {/* Product Name */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Product Name <span className="text-red-500">*</span>
                  </label>
                  <Input 
                    placeholder="Enter product name" 
                    {...register("name")} 
                    className="focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Category & Brand */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Category <span className="text-red-500">*</span>
                    </label>
                    <Input 
                      placeholder="e.g., Electronics" 
                      {...register("category")} 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Brand</label>
                    <Input placeholder="e.g., Apple" {...register("brand")} />
                  </div>
                </div>

                {/* Price & Stock */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Price (₹) <span className="text-red-500">*</span>
                    </label>
                    <Input 
                      type="number" 
                      placeholder="0.00" 
                      {...register("price")}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Stock Quantity <span className="text-red-500">*</span>
                    </label>
                    <Input 
                      type="number" 
                      placeholder="0" 
                      {...register("stock")}
                    />
                  </div>
                </div>

                {/* Status Select */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Status <span className="text-red-500">*</span>
                  </label>
                  <Select
                    value={status}
                    onValueChange={(val) => setValue("status", val)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-green-500"></div>
                          <span>Active</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="draft">
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
                          <span>Draft</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="out_of_stock">
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-red-500"></div>
                          <span>Out of Stock</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Description</label>
                  <Textarea
                    rows={4}
                    placeholder="Enter product description..."
                    {...register("description")}
                    className="resize-none"
                  />
                </div>

                <Separator />

                {/* Actions */}
                <div className="flex justify-between gap-3 pt-2">
                  <Button
                    variant="outline"
                    onClick={() => router.push(`/products/${id}`)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSubmit(onSubmit)}
                    className="bg-blue-600 text-mute text-white hover:bg-blue-700"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Summary & Tips (1/4) */}
          <div className="lg:col-span-1 space-y-6">
            {/* Summary Card */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Summary</h3>
              <div className="bg-card rounded-lg border p-6 space-y-4">
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase">
                    Product Name
                  </p>
                  <p className="mt-1 text-sm font-medium break-words">
                    {watch("name") || "—"}
                  </p>
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Price</span>
                    <span className="text-lg font-bold text-blue-600">
                      ₹{watch("price") || "0"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Stock</span>
                    <span className="text-sm font-medium">
                      {watch("stock") || "0"} units
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Status</span>
                    <Badge
                      variant={
                        status === "active"
                          ? "success"
                          : status === "draft"
                          ? "warning"
                          : "fail"
                      }
                      className="capitalize"
                    >
                      {status === "active"
                        ? "Active"
                        : status === "draft"
                        ? "Draft"
                        : "Out of Stock"}
                    </Badge>
                  </div>
                </div>

                <Separator />

                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase">
                    Category
                  </p>
                  <p className="mt-1 text-sm">{watch("category") || "—"}</p>
                </div>

                {watch("brand") && (
                  <>
                    <Separator />
                    <div>
                      <p className="text-xs font-medium text-muted-foreground uppercase">
                        Brand
                      </p>
                      <p className="mt-1 text-sm">{watch("brand")}</p>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Tips Section */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Pro Tips</h3>
              <div className="bg-blue-50 rounded-lg border border-blue-100 p-6">
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                      <span className="text-xs font-bold">1</span>
                    </div>
                    <p className="text-sm text-blue-900">
                      Use high-quality images (500x500px)
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                      <span className="text-xs font-bold">2</span>
                    </div>
                    <p className="text-sm text-blue-900">
                      Keep product title under 60 characters
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                      <span className="text-xs font-bold">3</span>
                    </div>
                    <p className="text-sm text-blue-900">
                      Update stock levels regularly
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                      <span className="text-xs font-bold">4</span>
                    </div>
                    <p className="text-sm text-blue-900">
                      Use "Draft" for products in development
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                      <span className="text-xs font-bold">5</span>
                    </div>
                    <p className="text-sm text-blue-900">
                      Write detailed descriptions for SEO
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}