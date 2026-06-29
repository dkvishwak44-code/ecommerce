"use client";

import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import Can from "@/components/rbac/Can";
import { PERMISSIONS } from "@/lib/permissions";
import { Edit, Trash, Copy, Star, TrendingUp, PackageX } from "lucide-react";
import AutoBreadcrumb from "@/components/layout/auto-breadcrumb";
import { useProduct } from "../hook/useProducts";
// import { useProduct } from "../hook/useProducts";

// ── Loading Skeleton ──────────────────────────────────────────────────────────
function ProductDetailsSkeleton() {
  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto space-y-2">
        <Skeleton className="h-4 w-48" />
        <Separator />
        <Skeleton className="h-7 w-64" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Skeleton className="h-72 w-full rounded-lg" />
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="space-y-1">
                      <Skeleton className="h-3 w-20" />
                      <Skeleton className="h-5 w-36" />
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
          <div className="space-y-6">
            <Card>
              <CardHeader><Skeleton className="h-5 w-24" /></CardHeader>
              <CardContent className="space-y-2">
                <Skeleton className="h-9 w-full" />
                <Skeleton className="h-9 w-full" />
                <Skeleton className="h-9 w-full" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Empty / Error State ───────────────────────────────────────────────────────
function ProductNotFound() {
  const router = useRouter();
  return (
    <div className="h-screen flex flex-col items-center justify-center gap-4">
      <PackageX className="h-16 w-16 text-muted-foreground" />
      <h2 className="text-xl font-semibold">Product not found</h2>
      <p className="text-sm text-muted-foreground">
        This product may have been deleted or does not exist.
      </p>
      <Button variant="outline" onClick={() => router.push("/products")}>
        Back to Products
      </Button>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function ProductDetailsPage() {
  const { id } = useParams();
  const router  = useRouter();

  const { data: product, isLoading, isError } = useProducta(id);

  if (isLoading) return <ProductDetailsSkeleton />;
  if (isError || !product) return <ProductNotFound />;

  // ── Derived values from response ──────────────────────────────────────────
  const thumbnail   = product.thumbnail?.url;
  const category    = product.category?.join(", ") || "—";
  const brand       = product.attributes?.find((a) => a.name === "Brand")?.value || "—";
  const storeName   = product.storeId?.name || "—";
  const createdBy   = product.createdBy?.name || "—";

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto space-y-2">

        {/* Breadcrumb */}
        <AutoBreadcrumb />
        <Separator />

        {/* Title */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-semibold">{product.name}</h1>
            <p className="text-xs text-muted-foreground mt-0.5">SKU: {product.sku}</p>
          </div>
          <Badge variant={product.isPublished ? "success" : "warning"}>
            {product.isPublished ? "Published" : "Unpublished"}
          </Badge>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── Left (2/3) ────────────────────────────────────────────── */}
          <Card className="lg:col-span-2">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Thumbnail */}
                <div className="border rounded-lg overflow-hidden bg-white">
                  {thumbnail ? (
                    <img
                      src={thumbnail}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-64 flex items-center justify-center text-muted-foreground text-sm">
                      No image
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Category</p>
                    <p className="font-medium">{category}</p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground">Brand</p>
                    <p className="font-medium">{brand}</p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground">Store</p>
                    <p className="font-medium">{storeName}</p>
                  </div>

                  <div className="flex gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Price</p>
                      <p className="text-xl font-bold text-blue-600">
                        ₹{product.price?.toLocaleString("en-IN")}
                      </p>
                    </div>
                    {product.salePrice && (
                      <div>
                        <p className="text-sm text-muted-foreground">Sale Price</p>
                        <p className="text-xl font-bold text-green-600">
                          ₹{product.salePrice?.toLocaleString("en-IN")}
                        </p>
                      </div>
                    )}
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground">Stock</p>
                    <p className={`font-medium ${product.stock <= product.lowStockThreshold ? "text-red-500" : ""}`}>
                      {product.stock}
                      {product.stock <= product.lowStockThreshold && (
                        <span className="ml-2 text-xs">(Low stock)</span>
                      )}
                    </p>
                  </div>

                  <div className="flex items-center justify-between border-b pb-2">
                    <span className="text-sm text-muted-foreground">Status</span>
                    <Badge
                      variant={
                        product.status === "active" ? "success" :
                        product.status === "draft"  ? "warning" : "fail"
                      }
                      className="capitalize"
                    >
                      {product.status}
                    </Badge>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Description</p>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {product.description || "No description provided."}
                    </p>
                  </div>
                </div>
              </div>

              {/* Images Gallery */}
              {product.images?.length > 0 && (
                <>
                  <Separator className="my-6" />
                  <div>
                    <p className="text-sm font-medium mb-3">Gallery</p>
                    <div className="flex gap-3 flex-wrap">
                      {product.images.map((img) => (
                        <img
                          key={img._id}
                          src={img.url}
                          alt="product"
                          className="h-20 w-20 rounded-md border object-cover"
                        />
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* Variants */}
              {product.variants?.length > 0 && (
                <>
                  <Separator className="my-6" />
                  <div>
                    <p className="text-sm font-medium mb-3">Variants</p>
                    <div className="flex gap-2 flex-wrap">
                      {product.variants.map((v) => (
                        <div key={v._id} className="border rounded-md px-3 py-2 text-sm">
                          <p className="font-medium">{v.value}</p>
                          <p className="text-muted-foreground text-xs">
                            ₹{v.price?.toLocaleString("en-IN")} · {v.stock} in stock
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* Attributes */}
              {product.attributes?.length > 0 && (
                <>
                  <Separator className="my-6" />
                  <div>
                    <p className="text-sm font-medium mb-3">Attributes</p>
                    <div className="grid grid-cols-2 gap-2">
                      {product.attributes.map((attr) => (
                        <div key={attr._id} className="flex justify-between text-sm border-b pb-1">
                          <span className="text-muted-foreground">{attr.name}</span>
                          <span className="font-medium">{attr.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* Tags */}
              {product.tags?.length > 0 && (
                <>
                  <Separator className="my-6" />
                  <div>
                    <p className="text-sm font-medium mb-2">Tags</p>
                    <div className="flex gap-2 flex-wrap">
                      {product.tags.map((tag) => (
                        <Badge key={tag} variant="outline">{tag}</Badge>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* ── Right Sidebar (1/3) ───────────────────────────────────── */}
          <div className="space-y-6">

            {/* Actions */}
            <Card>
              <CardHeader><CardTitle>Actions</CardTitle></CardHeader>
              <CardContent className="space-y-2 py-5">
                <Can permission={PERMISSIONS.PRODUCT_EDIT}>
                  <Button
                    variant="blue"
                    className="w-full justify-center items-center gap-2"
                    onClick={() => router.push(`/products/${id}/edit`)}
                  >
                    <Edit className="h-4 w-4" />
                    Edit Product
                  </Button>
                </Can>

                <Button variant="outline" className="w-full justify-center items-center gap-2">
                  <Copy className="h-4 w-4" />
                  Duplicate
                </Button>

                <Can permission={PERMISSIONS.PRODUCT_DELETE}>
                  <Button variant="fail" className="w-full justify-center items-center gap-2">
                    <Trash className="h-4 w-4" />
                    Delete
                  </Button>
                </Can>
              </CardContent>
            </Card>

            {/* Product Insights */}
            <Card>
              <CardHeader><CardTitle>Product Insights</CardTitle></CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Sales</span>
                  <span className="font-medium flex items-center gap-1">
                    <TrendingUp className="h-4 w-4" />
                    {product.totalSales ?? "—"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Rating</span>
                  <span className="font-medium flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-500" />
                    {product.rating ?? "—"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Reviews</span>
                  <span className="font-medium">{product.totalReviews ?? "—"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Featured</span>
                  <Badge variant={product.isFeatured ? "success" : "outline"}>
                    {product.isFeatured ? "Yes" : "No"}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Meta Info */}
            <Card>
              <CardHeader><CardTitle>Meta Info</CardTitle></CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Created By</span>
                  <span className="font-medium">{createdBy}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Created At</span>
                  <span className="font-medium">
                    {new Date(product.createdAt).toLocaleDateString("en-IN")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Updated At</span>
                  <span className="font-medium">
                    {new Date(product.updatedAt).toLocaleDateString("en-IN")}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* SEO */}
            {product.seo?.metaTitle && (
              <Card>
                <CardHeader><CardTitle>SEO</CardTitle></CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div>
                    <p className="text-muted-foreground text-xs">Meta Title</p>
                    <p className="font-medium">{product.seo.metaTitle}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Meta Description</p>
                    <p>{product.seo.metaDescription}</p>
                  </div>
                  {product.seo.keywords?.length > 0 && (
                    <div className="flex gap-1 flex-wrap pt-1">
                      {product.seo.keywords.map((kw) => (
                        <Badge key={kw} variant="outline" className="text-xs">{kw}</Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}