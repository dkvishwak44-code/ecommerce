"use client";

import { useState } from "react";
import {
  Store,
  Mail,
  Phone,
  MapPin,
  Globe,
  Save,
  Upload,
  Image as ImageIcon,
  Building2,
  Clock,
  Link2,
  ExternalLink,
  Share2,
  Loader2,
  X,
  Sparkles,
  ShieldCheck,
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
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

export default function StorePage() {
  const [form, setForm] = useState({
    name: "",
    description: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    country: "IN",
    currency: "INR",
    timezone: "Asia/Kolkata",
    facebook: "",
    instagram: "",
    twitter: "",
  });

  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => setLoading(false), 1500);
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-card">
      <form onSubmit={handleSubmit} noValidate className="flex flex-1 flex-col">

        {/* ── Sticky Top Bar ─────────────────────────────────────────── */}
        <div className="sticky top-0 z-10 border-b border-border backdrop-blur bg-card/95">
          <div className="flex h-14 items-center gap-3 px-6">
            <Separator orientation="vertical" className="h-5" />
            <div className="flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-500/10">
                <Store className="h-4 w-4 text-blue-500" />
              </div>
              <div>
                <p className="text-sm font-semibold leading-none text-foreground">
                  Store Settings
                </p>
                <p className="mt-0.5 text-[11px] leading-none text-muted-foreground">
                  Manage your brand, contact info, and store preferences
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Body ─────────────────────────────────────────────────────── */}
        <div className="flex-1 px-6 py-8">
          <div className="mx-auto w-full max-w-5xl overflow-hidden rounded-xl border border-border shadow-sm">

            {/* ── Section 1: Brand Identity ───────────────────────────── */}
            <div className="grid grid-cols-1 border-b border-border md:grid-cols-[260px_1fr]">
              <div className="border-b border-border p-6 md:border-b-0 md:border-r bg-muted/10">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="h-4 w-4 text-blue-500" />
                  <p className="text-sm font-semibold text-foreground">Brand Identity</p>
                </div>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  Upload your logo and banner. These appear on your storefront, invoices, and customer emails.
                </p>
              </div>
              <div className="bg-card p-6 space-y-6">
                {/* Logo + Banner */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Store Logo
                    </Label>
                    <div className="group relative border-2 border-dashed border-border rounded-xl p-4 flex flex-col items-center justify-center gap-2.5 bg-muted/20 hover:bg-blue-500/5 hover:border-blue-500/40 transition-all cursor-pointer h-32">
                      <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Upload className="w-4 h-4 text-blue-500" />
                      </div>
                      <div className="text-center">
                        <span className="text-xs font-semibold text-foreground">Upload Logo</span>
                        <p className="text-[10px] text-muted-foreground mt-0.5">PNG, SVG · 512×512px</p>
                      </div>
                    </div>
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Store Banner
                    </Label>
                    <div className="group relative border-2 border-dashed border-border rounded-xl p-4 flex flex-col items-center justify-center gap-2.5 bg-muted/20 hover:bg-blue-500/5 hover:border-blue-500/40 transition-all cursor-pointer h-32">
                      <div className="h-10 w-10 rounded-full bg-violet-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <ImageIcon className="w-4 h-4 text-violet-500" />
                      </div>
                      <div className="text-center">
                        <span className="text-xs font-semibold text-foreground">Upload Banner</span>
                        <p className="text-[10px] text-muted-foreground mt-0.5">1200×300px recommended</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Store Name */}
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium">
                    Store Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="e.g. Blue Mountain Coffee"
                    className="focus-visible:ring-blue-500"
                  />
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-sm font-medium">
                    Store Description
                  </Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Tell customers what makes your store special..."
                    className="resize-none h-24 focus-visible:ring-blue-500"
                  />
                  <p className="text-[11px] text-muted-foreground">
                    Appears in search results and your storefront header.
                  </p>
                </div>
              </div>
            </div>

            {/* ── Section 2: Contact Details ──────────────────────────── */}
            <div className="grid grid-cols-1 border-b border-border md:grid-cols-[260px_1fr]">
              <div className="border-b border-border p-6 md:border-b-0 md:border-r bg-muted/10">
                <div className="flex items-center gap-2 mb-2">
                  <Building2 className="h-4 w-4 text-green-500" />
                  <p className="text-sm font-semibold text-foreground">Contact Details</p>
                </div>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  Your business contact info used for customer support, invoices, and legal compliance.
                </p>
              </div>
              <div className="bg-card p-6 space-y-5">
                {/* Email & Phone */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-muted-foreground" />
                      Support Email
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="support@store.com"
                      className="focus-visible:ring-blue-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-sm font-medium flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-muted-foreground" />
                      Phone Number
                    </Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="+91 98765 43210"
                      className="focus-visible:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Address */}
                <div className="space-y-2">
                  <Label htmlFor="address" className="text-sm font-medium flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
                    Street Address
                  </Label>
                  <Input
                    id="address"
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    placeholder="123 Main Street, Block A"
                    className="focus-visible:ring-blue-500"
                  />
                </div>

                {/* City, State, Zip */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div className="space-y-2">
                    <Label htmlFor="city" className="text-sm font-medium">City</Label>
                    <Input
                      id="city"
                      name="city"
                      value={form.city}
                      onChange={handleChange}
                      placeholder="Mumbai"
                      className="focus-visible:ring-blue-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state" className="text-sm font-medium">State</Label>
                    <Input
                      id="state"
                      name="state"
                      value={form.state}
                      onChange={handleChange}
                      placeholder="Maharashtra"
                      className="focus-visible:ring-blue-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zip" className="text-sm font-medium">ZIP Code</Label>
                    <Input
                      id="zip"
                      name="zip"
                      value={form.zip}
                      onChange={handleChange}
                      placeholder="400001"
                      className="focus-visible:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* ── Section 3: Regional Settings ────────────────────────── */}
            <div className="grid grid-cols-1 border-b border-border md:grid-cols-[260px_1fr]">
              <div className="border-b border-border p-6 md:border-b-0 md:border-r bg-muted/10">
                <div className="flex items-center gap-2 mb-2">
                  <Globe className="h-4 w-4 text-orange-500" />
                  <p className="text-sm font-semibold text-foreground">Regional Settings</p>
                </div>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  Configure your default currency, country, and timezone for accurate pricing and scheduling.
                </p>
              </div>
              <div className="bg-card p-6 space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {/* Country */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Country</Label>
                    <Select
                      value={form.country}
                      onValueChange={(v) => setForm({ ...form, country: v })}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="IN">🇮🇳 India</SelectItem>
                        <SelectItem value="US">🇺🇸 United States</SelectItem>
                        <SelectItem value="GB">🇬🇧 United Kingdom</SelectItem>
                        <SelectItem value="AE">🇦🇪 UAE</SelectItem>
                        <SelectItem value="CA">🇨🇦 Canada</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Currency */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Currency</Label>
                    <Select
                      value={form.currency}
                      onValueChange={(v) => setForm({ ...form, currency: v })}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="INR">₹ INR</SelectItem>
                        <SelectItem value="USD">$ USD</SelectItem>
                        <SelectItem value="GBP">£ GBP</SelectItem>
                        <SelectItem value="AED">د.إ AED</SelectItem>
                        <SelectItem value="CAD">$ CAD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Timezone */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                      Timezone
                    </Label>
                    <Select
                      value={form.timezone}
                      onValueChange={(v) => setForm({ ...form, timezone: v })}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Asia/Kolkata">IST (UTC+5:30)</SelectItem>
                        <SelectItem value="America/New_York">EST (UTC-5)</SelectItem>
                        <SelectItem value="America/Los_Angeles">PST (UTC-8)</SelectItem>
                        <SelectItem value="Europe/London">GMT (UTC+0)</SelectItem>
                        <SelectItem value="Asia/Dubai">GST (UTC+4)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Section 4: Social Links ─────────────────────────────── */}
            <div className="grid grid-cols-1 border-b border-border md:grid-cols-[260px_1fr]">
              <div className="border-b border-border p-6 md:border-b-0 md:border-r bg-muted/10">
                <div className="flex items-center gap-2 mb-2">
                  <Share2 className="h-4 w-4 text-pink-500" />
                  <p className="text-sm font-semibold text-foreground">Social Links</p>
                </div>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  Connect your social media profiles. These are displayed on your storefront footer.
                </p>
              </div>
              <div className="bg-card p-6 space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium flex items-center gap-1.5">
                      <Link2 className="w-3.5 h-3.5 text-blue-600" />
                      Facebook
                    </Label>
                    <Input
                      name="facebook"
                      value={form.facebook}
                      onChange={handleChange}
                      placeholder="https://facebook.com/..."
                      className="focus-visible:ring-blue-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium flex items-center gap-1.5">
                      <ExternalLink className="w-3.5 h-3.5 text-pink-500" />
                      Instagram
                    </Label>
                    <Input
                      name="instagram"
                      value={form.instagram}
                      onChange={handleChange}
                      placeholder="https://instagram.com/..."
                      className="focus-visible:ring-blue-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium flex items-center gap-1.5">
                      <Share2 className="w-3.5 h-3.5 text-sky-500" />
                      Twitter / X
                    </Label>
                    <Input
                      name="twitter"
                      value={form.twitter}
                      onChange={handleChange}
                      placeholder="https://x.com/..."
                      className="focus-visible:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* ── Section 5: Maintenance Mode ─────────────────────────── */}
            <div className="grid grid-cols-1 md:grid-cols-[260px_1fr]">
              <div className="border-b border-border p-6 md:border-b-0 md:border-r bg-muted/10">
                <div className="flex items-center gap-2 mb-2">
                  <ShieldCheck className="h-4 w-4 text-amber-500" />
                  <p className="text-sm font-semibold text-foreground">Advanced</p>
                </div>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  Enable maintenance mode to temporarily take your storefront offline while you make changes.
                </p>
              </div>
              <div className="bg-card p-6">
                <div className="flex items-center justify-between rounded-lg border border-border p-4 bg-muted/10">
                  <div className="flex items-center gap-3">
                    <div className={`h-2.5 w-2.5 rounded-full ${maintenanceMode ? 'bg-amber-500 animate-pulse' : 'bg-green-500'}`} />
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {maintenanceMode ? "Maintenance Mode Active" : "Store is Live"}
                      </p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">
                        {maintenanceMode
                          ? "Your storefront is currently offline. Customers will see a maintenance page."
                          : "Your store is publicly accessible to customers."
                        }
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={maintenanceMode}
                    onChange={() => setMaintenanceMode(!maintenanceMode)}
                  />
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* ── Sticky Bottom Bar ────────────────────────────────────────── */}
        <div className="sticky bottom-0 z-10 border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
          <div className="flex h-14 items-center justify-between px-6">
            <p className="text-xs text-muted-foreground flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              Changes are saved securely and take effect immediately.
            </p>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
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
                className="h-8 gap-1.5 rounded-lg text-xs"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-3.5 w-3.5" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

      </form>
    </div>
  );
}
