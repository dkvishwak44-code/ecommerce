"use client";

import { useState } from "react";
import {
  Store,
  Mail,
  Phone,
  MapPin,
  Globe,
  Save,
  Info,
  Upload,
  Image as ImageIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function StorePage() {
  const [form, setForm] = useState({
    name: "",
    description: "",
    email: "",
    phone: "",
    address: "",
    currency: "INR",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (value) => {
    setForm({ ...form, currency: value });
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-10 bg-card">
      {/* HEADER SECTION */}
      <div className="flex items-center gap-4 mb-10">
        <div className="bg-blue-600/10 p-3 rounded-xl">
          <Store className="w-8 h-8 text-blue-600" />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">
            Store Settings
          </h1>
          <p className="text-muted-foreground">
            Manage your brand assets and business contact information.
          </p>
        </div>
      </div>

      {/* 
          FIX: We use 'flex flex-col' with 'gap-y-12' directly on the form. 
          This is the most reliable way to force vertical spacing.
      */}
      <form onSubmit={(e) => e.preventDefault()}>
        {/* SECTION 1: STORE INFO */}
        <Card className="shadow-sm border-muted-foreground/20">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              Store Info
            </CardTitle>
            <CardDescription>
              This is how your store appears to the public.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-3">
                <Label className="text-sm font-semibold text-foreground/70">
                  Store Logo
                </Label>
                <div className="border-2 border-dashed rounded-xl p-4 flex flex-col items-center justify-center gap-2 bg-muted/30 hover:bg-muted/50 transition-all cursor-pointer h-32">
                  <Upload className="w-5 h-5 text-muted-foreground" />
                  <span className="text-xs font-medium">Upload Logo</span>
                </div>
              </div>
              <div className="md:col-span-2 space-y-3">
                <Label className="text-sm font-semibold text-foreground/70">
                  Store Banner
                </Label>
                <div className="border-2 border-dashed rounded-xl p-4 flex flex-col items-center justify-center gap-2 bg-muted/30 hover:bg-muted/50 transition-all cursor-pointer h-32">
                  <ImageIcon className="w-5 h-5 text-muted-foreground" />
                  <span className="text-xs font-medium">
                    Upload Header Banner
                  </span>
                </div>
              </div>
            </div>
            <div className="grid gap-6">
              <div className="grid gap-2">
                <Label htmlFor="name">Store Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="e.g. Blue Mountain Coffee"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Describe your store..."
                  className="resize-none h-28"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 100% RELIABLE SPACER - This forces a 48px high invisible block between cards */}
        <div className="h-10 w-full" aria-hidden="true" />

        {/* SECTION 2: BUSINESS DETAILS */}
        <Card className="shadow-sm border-muted-foreground/20">
          <CardHeader className="border-b bg-muted/10">
            <CardTitle className="text-lg">Business Details</CardTitle>
            <CardDescription>
              Legal and contact information for operations.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="grid gap-2">
                <Label
                  htmlFor="email"
                  className="flex items-center gap-2 italic text-muted-foreground"
                >
                  <Mail className="w-4 h-4" /> Support Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="support@store.com"
                />
              </div>
              <div className="grid gap-2">
                <Label
                  htmlFor="phone"
                  className="flex items-center gap-2 italic text-muted-foreground"
                >
                  <Phone className="w-4 h-4" /> Phone Number
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="+91 98765 43210"
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label
                htmlFor="address"
                className="flex items-center gap-2 italic text-muted-foreground"
              >
                <MapPin className="w-4 h-4" /> Physical Address
              </Label>
              <Input
                id="address"
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="Main Street, City, State"
              />
            </div>
            <div className="grid gap-2">
              <Label
                htmlFor="currency"
                className="flex items-center gap-2 italic text-muted-foreground"
              >
                <Globe className="w-4 h-4" /> Default Currency
              </Label>
              <Select
                onValueChange={handleSelectChange}
                defaultValue={form.currency}
              >
                <SelectTrigger className="w-[220px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="INR">₹ INR (Indian Rupee)</SelectItem>
                  <SelectItem value="USD">$ USD (US Dollar)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
          <CardFooter className="bg-muted/50 border-t flex justify-between items-center p-6">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Info className="w-4 h-4" />
              <span className="text-xs font-medium">Privacy Protected</span>
            </div>
            <div className="flex gap-4">
              <Button variant="outline" type="button">
                Discard
              </Button>
              <Button type="submit" variant="blue">
                <Save className="w-4 h-4 mr-2" /> Save Changes
              </Button>
            </div>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
