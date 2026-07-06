"use client";

import { useState, useEffect } from "react";
import { useForm }              from "react-hook-form";
import { zodResolver }          from "@hookform/resolvers/zod";

import {
  Dialog, DialogContent, DialogHeader,
  DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Input }     from "@/components/ui/input";
import { Button }    from "@/components/ui/button";
import { Badge }     from "@/components/ui/badge";
import {
  Select, SelectContent, SelectGroup,
  SelectItem, SelectLabel, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Upload, Plus, X, Sparkles,
  Tag, Package, ImageIcon,
} from "lucide-react";

import { useCreateProduct } from "../hook/useProducts";
import { useSelector }      from "react-redux";
import { selectUserStore }  from "@/store/slices/authSlice";
import { imageValidation, productSchema } from "../validation/product-schema";

// ── Category Config ───────────────────────────────────────────────────────────
const CATEGORIES = {
  clothing: {
    label: "Clothing & Fashion",
    items: ["T-Shirts", "Shirts", "Jeans", "Trousers", "Dresses", "Kurta", "Jacket", "Hoodie", "Saree", "Leggings"],
    sizes:  ["XS", "S", "M", "L", "XL", "XXL", "3XL"],
    colors: ["Black", "White", "Red", "Blue", "Green", "Yellow", "Pink", "Grey", "Navy", "Beige"],
    attrs:  ["Material", "Fit", "Occasion", "Sleeve"],
  },
  electronics: {
    label: "Electronics & Tech",
    items: ["Smartphone", "Laptop", "Headphones", "Smartwatch", "Tablet", "Camera", "Speaker", "Charger", "Earbuds", "Monitor"],
    sizes:  [],
    colors: ["Black", "White", "Silver", "Gold", "Blue", "Red"],
    attrs:  ["Brand", "Warranty", "Connectivity", "Battery"],
  },
};

// ── SKU Generator ─────────────────────────────────────────────────────────────
const generateSKU = (name = "", category = "") => {
  const n = name.slice(0, 3).toUpperCase().padEnd(3, "X");
  const c = category.slice(0, 3).toUpperCase().padEnd(3, "X");
  const t = Date.now().toString().slice(-5);
  return `${n}-${c}-${t}`;
};

// ── Error Message Component ───────────────────────────────────────────────────
const FieldError = ({ message }) =>
  message ? <p className="text-xs text-destructive mt-1">{message}</p> : null;

// ── Main Component ────────────────────────────────────────────────────────────
export default function ProductDialog({ trigger }) {
  const [open, setOpen]               = useState(false);
  const [images, setImages]           = useState([]);
  const [imageError, setImageError]   = useState(null);
  const [activeGroup, setActiveGroup] = useState("clothing");
  const [selectedSizes,  setSelectedSizes]  = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags]         = useState([]);
  const [attrs, setAttrs]       = useState([{ name: "", value: "" }]);

  const store = useSelector(selectUserStore);
  const { mutate: createProduct, isPending } = useCreateProduct();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(productSchema),   // ← zod connected
    defaultValues: {
      name:              "",
      subCategory:       "",
      price:             "",
      salePrice:         "",
      costPrice:         "",
      stock:             "",
      lowStockThreshold: 5,
      description:       "",
      shortDescription:  "",
      sku:               "",
      status:            "active",
      isPublished:       true,
      isFeatured:        false,
    },
  });

  const formValues   = watch();
  const currentGroup = CATEGORIES[activeGroup];

  // Auto-generate SKU
  useEffect(() => {
    if (formValues.name) {
      setValue("sku", generateSKU(formValues.name, activeGroup), { shouldValidate: true });
    }
  }, [formValues.name, activeGroup]);

  // ── Image Handlers ────────────────────────────────────────────────────────
  const handleImageAdd = (e) => {
    const files = Array.from(e.target.files || []);
    const newImages = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setImages((prev) => [...prev, ...newImages].slice(0, 5));
    setImageError(null); // clear error on add
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  // ── Tag Handlers ──────────────────────────────────────────────────────────
  const addTag = (e) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags((prev) => [...prev, tagInput.trim()]);
      }
      setTagInput("");
    }
  };

  const removeTag = (tag) => setTags((prev) => prev.filter((t) => t !== tag));

  // ── Toggle Size/Color ─────────────────────────────────────────────────────
  const toggleSize  = (s) => setSelectedSizes((p)  => p.includes(s) ? p.filter((x) => x !== s) : [...p, s]);
  const toggleColor = (c) => setSelectedColors((p) => p.includes(c) ? p.filter((x) => x !== c) : [...p, c]);

  // ── Attribute Handlers ────────────────────────────────────────────────────
  const updateAttr  = (i, field, val) => setAttrs((p) => p.map((a, idx) => idx === i ? { ...a, [field]: val } : a));
  const addAttr     = () => setAttrs((p) => [...p, { name: "", value: "" }]);
  const removeAttr  = (i) => setAttrs((p) => p.filter((_, idx) => idx !== i));

  // ── Submit ────────────────────────────────────────────────────────────────
  const onSubmit = (data) => {
    // Validate images manually (not in zod — it's a file array)
    const imgErr = imageValidation(images);
    if (imgErr) {
      setImageError(imgErr);
      return;
    }

    const formData = new FormData();

    // Basic fields
    Object.entries(data).forEach(([key, val]) => {
      if (val !== "" && val !== null && val !== undefined) {
        formData.append(key, val);
      }
    });

    // Category
    formData.append("category", activeGroup);

    // Images
    images.forEach((img) => formData.append("images", img.file));

    // Variants — sizes
    selectedSizes.forEach((size, i) => {
      formData.append(`variants[${i}][name]`,  "Size");
      formData.append(`variants[${i}][value]`, size);
      formData.append(`variants[${i}][price]`, data.price);
      formData.append(`variants[${i}][stock]`, 0);
    });

    // Tags
    tags.forEach((tag) => formData.append("tags[]", tag));

    // Attributes
    attrs
      .filter((a) => a.name && a.value)
      .forEach((attr, i) => {
        formData.append(`attributes[${i}][name]`,  attr.name);
        formData.append(`attributes[${i}][value]`, attr.value);
      });


    // Store
    if (store) formData.append("storeId", store[1]?.value);
    console.log("Submitting form data:", formData); // Debug log

    createProduct(formData, {
      onSuccess: () => {
        setOpen(false);
        handleReset();
      },
    });
  };

  const handleReset = () => {
    reset();
    setImages([]);
    setImageError(null);
    setSelectedSizes([]);
    setSelectedColors([]);
    setTags([]);
    setTagInput("");
    setAttrs([{ name: "", value: "" }]);
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="blue">
            <Plus className="h-4 w-4 mr-1" /> Add Product
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="!w-[98vw] !max-w-[960px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Add New Product
          </DialogTitle>
        </DialogHeader>

        {/* Category Tabs */}
        <div className="flex gap-2 border-b pb-3">
          {Object.entries(CATEGORIES).map(([key, val]) => (
            <button
              key={key}
              type="button"
              onClick={() => setActiveGroup(key)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors
                ${activeGroup === key
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
            >
              {val.label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-2">

            {/* ══════════════ LEFT — FORM ══════════════ */}
            <div className="space-y-4">

              {/* Images */}
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Images <span className="text-muted-foreground text-xs">(max 5)</span>
                </label>
                <div className="flex gap-2 flex-wrap">
                  {images.map((img, i) => (
                    <div key={i} className="relative h-16 w-16">
                      <img src={img.preview} className="h-16 w-16 object-cover rounded-md border" />
                      <button
                        type="button"
                        onClick={() => removeImage(i)}
                        className="absolute -top-1.5 -right-1.5 bg-destructive text-white rounded-full h-4 w-4 flex items-center justify-center"
                      >
                        <X className="h-2.5 w-2.5" />
                      </button>
                    </div>
                  ))}
                  {images.length < 5 && (
                    <label className={`h-16 w-16 flex flex-col items-center justify-center border-2 border-dashed rounded-md cursor-pointer hover:bg-muted transition
                      ${imageError ? "border-destructive" : ""}`}
                    >
                      <Input type="file" accept="image/*" multiple className="hidden" onChange={handleImageAdd} />
                      <Upload className="h-5 w-5 text-muted-foreground" />
                      <span className="text-[10px] text-muted-foreground">Add</span>
                    </label>
                  )}
                </div>
                <FieldError message={imageError} />
              </div>

              {/* Name */}
              <div>
                <Input
                  placeholder="Product name *"
                  {...register("name")}
                  className={errors.name ? "border-destructive" : ""}
                />
                <FieldError message={errors.name?.message} />
              </div>

              {/* Sub-category */}
              <div>
                <Select onValueChange={(val) => setValue("subCategory", val, { shouldValidate: true })}>
                  <SelectTrigger className={errors.subCategory ? "border-destructive" : ""}>
                    <SelectValue placeholder={`Select ${currentGroup.label} type`} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>{currentGroup.label}</SelectLabel>
                      {currentGroup.items.map((item) => (
                        <SelectItem key={item} value={item.toLowerCase()}>{item}</SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <FieldError message={errors.subCategory?.message} />
              </div>

              {/* Price Row */}
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <Input
                    type="number"
                    placeholder="Price *"
                    {...register("price")}
                    className={errors.price ? "border-destructive" : ""}
                  />
                  <FieldError message={errors.price?.message} />
                </div>
                <div>
                  <Input type="number" placeholder="Sale price" {...register("salePrice")}
                    className={errors.salePrice ? "border-destructive" : ""} />
                  <FieldError message={errors.salePrice?.message} />
                </div>
                <Input type="number" placeholder="Cost price" {...register("costPrice")} />
              </div>

              {/* Stock Row */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Input type="number" placeholder="Stock *" {...register("stock")}
                    className={errors.stock ? "border-destructive" : ""} />
                  <FieldError message={errors.stock?.message} />
                </div>
                <Input type="number" placeholder="Low stock alert" {...register("lowStockThreshold")} />
              </div>

              {/* Short Description */}
              <div>
                <Input placeholder="Short description" {...register("shortDescription")}
                  className={errors.shortDescription ? "border-destructive" : ""} />
                <FieldError message={errors.shortDescription?.message} />
              </div>

              {/* Description */}
              <div>
                <textarea
                  placeholder="Full description"
                  {...register("description")}
                  rows={3}
                  className={`w-full border rounded-md p-2 text-sm bg-background resize-none focus:outline-none focus:ring-1 focus:ring-ring
                    ${errors.description ? "border-destructive" : ""}`}
                />
                <FieldError message={errors.description?.message} />
              </div>

              {/* Sizes — clothing only */}
              {activeGroup === "clothing" && currentGroup.sizes.length > 0 && (
                <div>
                  <p className="text-sm font-medium mb-2">Sizes</p>
                  <div className="flex flex-wrap gap-1.5">
                    {currentGroup.sizes.map((size) => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => toggleSize(size)}
                        className={`px-3 py-1 rounded-md text-sm border transition-colors
                          ${selectedSizes.includes(size)
                            ? "bg-primary text-primary-foreground border-primary"
                            : "border-input hover:bg-muted"}`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Colors */}
              {currentGroup.colors.length > 0 && (
                <div>
                  <p className="text-sm font-medium mb-2">Colors</p>
                  <div className="flex flex-wrap gap-1.5">
                    {currentGroup.colors.map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => toggleColor(color)}
                        className={`px-3 py-1 rounded-md text-sm border transition-colors
                          ${selectedColors.includes(color)
                            ? "bg-primary text-primary-foreground border-primary"
                            : "border-input hover:bg-muted"}`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Tags */}
              <div>
                <p className="text-sm font-medium mb-2 flex items-center gap-1">
                  <Tag className="h-3.5 w-3.5" /> Tags
                  <span className="text-xs text-muted-foreground font-normal">(Enter to add)</span>
                </p>
                <Input
                  placeholder="Type tag and press Enter"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={addTag}
                />
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="gap-1">
                        {tag}
                        <X className="h-3 w-3 cursor-pointer" onClick={() => removeTag(tag)} />
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* Attributes */}
              <div>
                <p className="text-sm font-medium mb-2">Attributes</p>
                <div className="space-y-2">
                  {attrs.map((attr, i) => (
                    <div key={i} className="flex gap-2 items-center">
                      <Select onValueChange={(val) => updateAttr(i, "name", val)}>
                        <SelectTrigger className="w-36">
                          <SelectValue placeholder="Name" />
                        </SelectTrigger>
                        <SelectContent>
                          {currentGroup.attrs.map((a) => (
                            <SelectItem key={a} value={a}>{a}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Input
                        placeholder="Value"
                        value={attr.value}
                        onChange={(e) => updateAttr(i, "value", e.target.value)}
                        className="flex-1"
                      />
                      {attrs.length > 1 && (
                        <button type="button" onClick={() => removeAttr(i)}>
                          <X className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addAttr}
                    className="text-xs text-primary flex items-center gap-1 hover:underline"
                  >
                    <Plus className="h-3 w-3" /> Add attribute
                  </button>
                </div>
              </div>

              {/* SKU + Status */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">SKU (auto)</label>
                  <Input {...register("sku")} className={`font-mono text-xs ${errors.sku ? "border-destructive" : ""}`} />
                  <FieldError message={errors.sku?.message} />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Status</label>
                  <Select defaultValue="active" onValueChange={(v) => setValue("status", v, { shouldValidate: true })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Checkboxes */}
              <div className="flex gap-4 text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" {...register("isPublished")} defaultChecked />
                  Published
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" {...register("isFeatured")} />
                  Featured
                </label>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <Button type="submit" className="flex-1" variant="blue" disabled={isPending}>
                  {isPending ? "Saving..." : "Save Product"}
                </Button>
                <Button type="button" variant="outline" onClick={handleReset}>
                  Reset
                </Button>
              </div>
            </div>

            {/* ══════════════ RIGHT — LIVE PREVIEW ══════════════ */}
            <div className="border rounded-xl p-5 space-y-4 bg-muted/20 sticky top-0 self-start">
              <h2 className="text-sm font-semibold flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                Live Preview
              </h2>

              {images.length > 0 ? (
                <div className="flex gap-2 flex-wrap">
                  {images.map((img, i) => (
                    <img key={i} src={img.preview}
                      className={`object-cover rounded-lg border ${i === 0 ? "h-32 w-32" : "h-16 w-16"}`} />
                  ))}
                </div>
              ) : (
                <div className="h-32 w-32 flex items-center justify-center border rounded-lg text-muted-foreground bg-muted">
                  <ImageIcon className="h-8 w-8" />
                </div>
              )}

              <div>
                <p className="text-lg font-bold leading-tight">
                  {formValues.name || <span className="text-muted-foreground font-normal text-sm">Product name</span>}
                </p>
                <Badge variant="outline" className="mt-1 capitalize text-xs">{activeGroup}</Badge>
              </div>

              <div className="flex items-center gap-3">
                <p className="text-xl font-bold text-primary">
                  ₹{formValues.price ? Number(formValues.price).toLocaleString("en-IN") : "0"}
                </p>
                {formValues.salePrice && (
                  <p className="text-sm text-green-600 font-medium">
                    Sale: ₹{Number(formValues.salePrice).toLocaleString("en-IN")}
                  </p>
                )}
              </div>

              <Separator />

              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Stock</span>
                  <span className="font-medium">{formValues.stock || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <Badge variant={formValues.status === "active" ? "success" : "warning"} className="capitalize text-xs">
                    {formValues.status}
                  </Badge>
                </div>
                {selectedSizes.length > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Sizes</span>
                    <span className="font-medium">{selectedSizes.join(", ")}</span>
                  </div>
                )}
                {selectedColors.length > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Colors</span>
                    <span className="font-medium">{selectedColors.join(", ")}</span>
                  </div>
                )}
              </div>

              {tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                  ))}
                </div>
              )}

              {attrs.some((a) => a.name && a.value) && (
                <>
                  <Separator />
                  <div className="space-y-1">
                    {attrs.filter((a) => a.name && a.value).map((a, i) => (
                      <div key={i} className="flex justify-between text-sm">
                        <span className="text-muted-foreground">{a.name}</span>
                        <span className="font-medium">{a.value}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}

              <Separator />
              <div>
                <p className="text-xs text-muted-foreground">SKU</p>
                <p className="font-mono text-xs font-bold">{formValues.sku || "—"}</p>
              </div>
            </div>

          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}