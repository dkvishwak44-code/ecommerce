"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Can from "@/components/rbac/Can";
import { PERMISSIONS } from "@/lib/permissions";

import { Edit, Trash, Copy, Star, Eye, TrendingUp } from "lucide-react";

import AutoBreadcrumb from "@/components/layout/auto-breadcrumb";

export default function ProductDetailsPage() {
  const { id } = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState(null);

  useEffect(() => {
    async function fetchProduct() {
      setLoading(true);

      const data = {
        id,
        name: "iPhone 15",
        category: "Smartphones",
        brand: "Apple",
        price: 999,
        stock: 10,
        status: "active",
        description:
          "Latest Apple iPhone with A17 chip, improved camera and performance.",
        image:
          "https://images.unsplash.com/photo-1591337676887-a217a6970a8a?w=600",
        sales: 1245,
        revenue: 12450,
        rating: 4.6,
        views: 8932,
      };

      setProduct(data);
      setLoading(false);
    }

    fetchProduct();
  }, [id]);

    if (loading) {
      return (
        <div className="h-screen flex items-center justify-center">
          <p className="text-muted-foreground">Loading product...</p>
        </div>
      );
    }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto  space-y-2">
        {/* Breadcrumb */}
        <AutoBreadcrumb />
       <Separator/>
        {/* TITLE */}
        <div>
          <h1 className="text-2xl font-semibold">{product.name}</h1>
          {/* <p className="text-sm text-muted-foreground">
            Product ID: {product.id}
          </p> */}
        </div>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ================= LEFT MAIN SECTION (2/3) ================= */}
          <Card className="lg:col-span-2">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* IMAGE */}
                <div className="border rounded-lg overflow-hidden bg-white">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* INFO */}
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Category</p>
                    <p className="font-medium">{product.category}</p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground">Brand</p>
                    <p className="font-medium">{product.brand}</p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground">Price</p>
                    <p className="text-xl font-bold text-blue-600">
                      ${product.price}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground">Stock</p>
                    <p className="font-medium">{product.stock}</p>
                  </div>

                  <div className="flex items-center justify-between border-b pb-2">
                    <span className="text-sm text-muted-foreground">
                      Status
                    </span>

                    <Badge
                      variant={
                        product.status === "active"
                          ? "success"
                          : product.status === "draft"
                            ? "warning"
                            : "fail"
                      }
                      className="capitalize"
                    >
                      {product.status}
                    </Badge>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Description
                    </p>
                    <p className="text-sm leading-relaxed">
                      {product.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* <Separator className="my-6" /> */}

              {/* DESCRIPTION */}
            </CardContent>
          </Card>

          {/* ================= RIGHT SIDEBAR (1/3) ================= */}
          <div className="space-y-6">
            {/* ACTIONS CARD */}
            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>

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
                <Button
                  variant="outline"
                  className="w-full justify-center items-center gap-2"
                >
                  <Copy className="h-4 w-4" />
                  Duplicate
                </Button>
            <Can permission={PERMISSIONS.PRODUCT_DELETE}> 
                <Button
                  variant="fail"
                  className="w-full justify-center items-center gap-2"
                >
                  <Trash className="h-4 w-4" />
                  Delete
                </Button>
              </Can>
              </CardContent>
            </Card>

            {/* PRODUCT STATS CARD */}
            <Card>
              <CardHeader>
                <CardTitle>Product Insights</CardTitle>
              </CardHeader>

              <CardContent className="space-y-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Sales</span>
                  <span className="font-medium flex items-center gap-1">
                    <TrendingUp className="h-4 w-4" />
                    {product.sales}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-muted-foreground">Revenue</span>
                  <span className="font-medium">${product.revenue}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-muted-foreground">Rating</span>
                  <span className="font-medium flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-500" />
                    {product.rating}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-muted-foreground">Views</span>
                  <span className="font-medium flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    {product.views}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
