"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Upload } from "lucide-react";

export default function ProductDialog() {
  const [open, setOpen] = useState(false);
  const [preview, setPreview] = useState(null);
  const [watchData, setWatchData] = useState({});

  const sizes = ["S", "M", "L", "XL"];
  const colors = ["Red", "Blue", "Black", "White"];

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      sizes: [],
      colors: [],
      category: "",
    },
  });

  const formValues = watch();

  // SKU generator
  const generateSKU = () => {
    const name = formValues.name || "PROD";
    const cat = formValues.category || "CAT";
    return `${name.slice(0, 3)}-${cat.slice(0, 3)}-${Date.now()
      .toString()
      .slice(-4)}`.toUpperCase();
  };

  const onSubmit = (data) => {
    console.log(data);
    setOpen(false);
    reset();
    setPreview(null);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen} >
      <DialogTrigger asChild>
        <Button variant="blue">+ Add Product</Button>
      </DialogTrigger>

      {/* FULL WIDTH MODAL */}
      {/* <DialogContent className="w-[95vw] max-w-325 max-h-[90vh] overflow-y-auto">
       */}
       {/* <DialogContent className="w-[95vw] max-w-[1400px] max-h-[90vh] overflow-y-auto"> */}
       <DialogContent className="!w-[98vw] !max-w-[900px] max-h-[90vh] overflow-y-auto rounded-none">
        <DialogHeader>
          <DialogTitle>Add Product</DialogTitle>
        </DialogHeader>

        {/* 2 COLUMN LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* ================= LEFT FORM ================= */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

            {/* IMAGE */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Product Image
              </label>

              <label className="flex flex-col items-center justify-center border-2 border-dashed p-6 cursor-pointer hover:bg-muted transition">
                <Input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  {...register("image")}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) setPreview(URL.createObjectURL(file));
                  }}
                />
                <span className="text-sm text-muted-foreground">
                  <span className="flex justify-center items-center gap-1"><Upload/><p> image</p> </span>
                 <p>PNG,JPG GIF up to 5MB</p>
                </span>
              </label>
            </div>

            {/* NAME */}
            <Input
              placeholder="Product name"
              {...register("name", { required: true })}
            />

            {/* CATEGORY */}
            <Select onValueChange={(value) => setValue("category", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="electronics">Electronics</SelectItem>
                <SelectItem value="fashion">Fashion</SelectItem>
                <SelectItem value="shoes">Shoes</SelectItem>
              </SelectContent>
            </Select>

            {/* PRICE + STOCK */}
            <div className="grid grid-cols-2 gap-3">
              <Input type="number" placeholder="Price" {...register("price")} />
              <Input type="number" placeholder="Stock" {...register("stock")} />
            </div>

            {/* DESCRIPTION */}
            <textarea
              placeholder="Description"
              {...register("description")}
              className="w-full border rounded-md p-2"
            />

            {/* SIZES */}
            <div>
              <p className="text-sm font-medium mb-2">Sizes</p>
              <div className="flex flex-wrap gap-2">
                {sizes.map((size) => (
                  <label
                    key={size}
                    className="border px-3 py-1 rounded-md cursor-pointer"
                  >
                    <input type="checkbox" value={size} {...register("sizes")} />
                    {" "}{size}
                  </label>
                ))}
              </div>
            </div>

            {/* COLORS */}
            <div>
              <p className="text-sm font-medium mb-2">Colors</p>
              <div className="flex flex-wrap gap-2">
                {colors.map((color) => (
                  <label
                    key={color}
                    className="border px-3 py-1 rounded-md cursor-pointer"
                  >
                    <input type="checkbox" value={color} {...register("colors")} />
                    {" "}{color}
                  </label>
                ))}
              </div>
            </div>

            {/* ACTIONS */}
            <div className="flex gap-3 pt-3">
              <Button type="submit" className="flex-1" variant="blue">
                Save Product
              </Button>

              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => {
                  reset();
                  setPreview(null);
                }}
              >
                Reset
              </Button>
            </div>
          </form>

          {/* ================= RIGHT LIVE PREVIEW ================= */}
          <div className="border rounded-xl p-5 space-y-4 bg-muted/30">

            <h2 className="text-lg font-semibold">Live Preview</h2>

            {/* IMAGE PREVIEW */}
            {preview ? (
              <img
                src={preview}
                className="h-40 w-40 object-cover rounded-lg border"
              />
            ) : (
              <div className="h-40 w-40 flex items-center justify-center border rounded-lg text-sm text-muted-foreground">
                No Image
              </div>
            )}

            {/* NAME */}
            <p className="text-xl font-bold">
              {formValues.name || "Product Name"}
            </p>

            {/* PRICE */}
            <p className="text-green-600 font-semibold">
              ₹{formValues.price || "0"}
            </p>

            {/* CATEGORY */}
            <p className="text-sm text-muted-foreground">
              Category: {formValues.category || "-"}
            </p>

            {/* SIZE */}
            <p className="text-sm">
              Sizes: {formValues.sizes?.join(", ") || "-"}
            </p>

            {/* COLORS */}
            <p className="text-sm">
              Colors: {formValues.colors?.join(", ") || "-"}
            </p>

            {/* SKU */}
            <div className="pt-4 border-t">
              <p className="text-xs text-muted-foreground">Auto SKU</p>
              <p className="font-mono font-bold">{generateSKU()}</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}