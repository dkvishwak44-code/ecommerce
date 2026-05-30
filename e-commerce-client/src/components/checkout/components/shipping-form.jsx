"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  User, Mail, Phone, MapPin, Building,
  Hash, Globe, Package, CreditCard,
  ClipboardList, ChevronRight, Check,
  Lock, Calendar, Banknote, Smartphone,
  ShieldCheck, ArrowRight, ArrowLeft,
} from "lucide-react";
import { SiVisa, SiMastercard } from "react-icons/si";

// ─── STEPS CONFIG ─────────────────────────────────────────────────────────────

const steps = [
  { id: 1, label: "Shipping",  shortLabel: "Ship",    icon: Package     },
  { id: 2, label: "Payment",   shortLabel: "Pay",     icon: CreditCard  },
  { id: 3, label: "Review",    shortLabel: "Review",  icon: ClipboardList },
];

// ─── PROGRESS BAR ─────────────────────────────────────────────────────────────

function ProgressBar({ current }) {
  return (
    <div className="px-5 py-4 sm:px-6 sm:py-5 border-b border-border bg-muted/30">
      <div className="flex items-center justify-between">
        {steps.map((step, i) => {
          const done    = current > step.id;
          const active  = current === step.id;
          const Icon    = step.icon;
          const isLast  = i === steps.length - 1;

          return (
            <div key={step.id} className="flex flex-1 items-center">
              {/* Step pill */}
              <div className="flex flex-col items-center gap-1">
                <div className={`flex h-8 w-8 items-center justify-center rounded-xl transition-all duration-300 sm:h-9 sm:w-9 sm:rounded-2xl
                  ${done   ? "bg-green-500 text-white"
                  : active ? "bg-foreground text-background shadow-md"
                           : "bg-muted text-muted-foreground border border-border"}`}
                >
                  {done
                    ? <Check className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    : <Icon  className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  }
                </div>
                <span className={`hidden text-[9px] font-semibold sm:block sm:text-[10px]
                  ${active ? "text-foreground" : done ? "text-green-500" : "text-muted-foreground"}`}
                >
                  {step.label}
                </span>
                <span className={`text-[9px] font-semibold sm:hidden
                  ${active ? "text-foreground" : done ? "text-green-500" : "text-muted-foreground"}`}
                >
                  {step.shortLabel}
                </span>
              </div>

              {/* Connector */}
              {!isLast && (
                <div className="mx-1.5 flex flex-1 items-center gap-0.5 sm:mx-2">
                  <div className={`h-0.5 flex-1 rounded-full transition-all duration-500 ${done ? "bg-green-500" : "bg-border"}`} />
                  <ChevronRight className={`h-3 w-3 shrink-0 ${done ? "text-green-500" : "text-muted-foreground/40"}`} />
                  <div className={`h-0.5 flex-1 rounded-full transition-all duration-500 ${current > step.id + 1 ? "bg-green-500" : "bg-border"}`} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── INPUT FIELD ──────────────────────────────────────────────────────────────

function InputField({ label, placeholder, type = "text", icon: Icon, col2, register, error, maxLength }) {
  const [focused, setFocused] = useState(false);

  return (
    <div className={col2 ? "md:col-span-2" : ""}>
      <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground sm:text-xs">
        {label}
      </label>
      <div className={`flex items-center gap-2.5 rounded-xl border bg-background px-3.5 transition-all duration-200 sm:rounded-2xl sm:px-4
        ${error   ? "border-red-400 ring-2 ring-red-400/10"
        : focused ? "border-foreground ring-2 ring-foreground/10"
                  : "border-border hover:border-muted-foreground/40"}`}
      >
        {Icon && (
          <Icon className={`h-3.5 w-3.5 shrink-0 transition-colors sm:h-4 sm:w-4
            ${error ? "text-red-400" : focused ? "text-foreground" : "text-muted-foreground"}`}
          />
        )}
        <input
          type={type}
          placeholder={placeholder}
          maxLength={maxLength}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          {...register}
          className="h-11 w-full bg-transparent text-xs text-foreground outline-none placeholder:text-muted-foreground/60 sm:h-12 sm:text-sm"
        />
      </div>
      {error && (
        <p className="mt-1 text-[10px] text-red-500 sm:text-xs">{error.message}</p>
      )}
    </div>
  );
}

// ─── STEP 1 — SHIPPING ────────────────────────────────────────────────────────

function ShippingStep({ onNext }) {
  const { register, handleSubmit, watch, formState: { errors } } = useForm();

  const values  = watch();
  const filled  = Object.values(values).filter(Boolean).length;
  const total   = 8;
  const progress = Math.round((filled / total) * 100);

  return (
    <form onSubmit={handleSubmit(onNext)} className="space-y-5 px-5 py-5 sm:px-6 sm:py-6">

      {/* Progress fill */}
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-semibold text-muted-foreground sm:text-xs">
          {filled}/{total} fields filled
        </span>
        <div className="h-1.5 w-28 overflow-hidden rounded-full bg-muted sm:w-36">
          <div className="h-full rounded-full bg-foreground transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="grid gap-3.5 sm:gap-4 md:grid-cols-2">
        <InputField label="First Name"     placeholder="John"              icon={User}     register={register("firstName",  { required: "Required" })} error={errors.firstName} />
        <InputField label="Last Name"      placeholder="Doe"               icon={User}     register={register("lastName",   { required: "Required" })} error={errors.lastName} />
        <InputField label="Email Address"  placeholder="john@example.com"  icon={Mail}     register={register("email",      { required: "Required", pattern: { value: /^\S+@\S+$/i, message: "Invalid email" } })} error={errors.email}  col2 type="email" />
        <InputField label="Phone Number"   placeholder="+1 (555) 000-0000" icon={Phone}    register={register("phone",      { required: "Required" })} error={errors.phone}  col2 type="tel" />
        <InputField label="Street Address" placeholder="123 Main Street"   icon={MapPin}   register={register("address",    { required: "Required" })} error={errors.address} col2 />
        <InputField label="City"           placeholder="New York"          icon={Building} register={register("city",       { required: "Required" })} error={errors.city} />
        <InputField label="Postal Code"    placeholder="10001"             icon={Hash}     register={register("postal",     { required: "Required" })} error={errors.postal} />
        <InputField label="Country"        placeholder="United States"     icon={Globe}    register={register("country",    { required: "Required" })} error={errors.country} col2 />
      </div>

      {/* Save address */}
      <label className="flex cursor-pointer items-center gap-2.5">
        <div className="relative">
          <input type="checkbox" className="peer sr-only" />
          <div className="h-4 w-4 rounded border-2 border-border bg-background transition-all peer-checked:border-foreground peer-checked:bg-foreground" />
          <div className="pointer-events-none absolute inset-0 hidden items-center justify-center peer-checked:flex">
            <svg className="h-2.5 w-2.5 text-background" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
        <span className="text-xs text-muted-foreground sm:text-sm">Save this address for future orders</span>
      </label>

      <button type="submit" className="group flex w-full items-center justify-center gap-2 rounded-xl bg-foreground px-4 py-3 text-xs font-bold text-background transition-all hover:opacity-90 active:scale-[0.98] sm:rounded-2xl sm:py-3.5 sm:text-sm">
        Continue to Payment
        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 sm:h-4 sm:w-4" />
      </button>
    </form>
  );
}

// ─── STEP 2 — PAYMENT ─────────────────────────────────────────────────────────

const paymentMethods = [
  { id: "card", label: "Credit / Debit Card", desc: "Visa, Mastercard, Amex", icon: CreditCard },
  { id: "upi",  label: "UPI Payment",         desc: "Google Pay, PhonePe",    icon: Smartphone },
  { id: "cod",  label: "Cash on Delivery",    desc: "Pay on receipt",         icon: Banknote   },
];

function PaymentStep({ onNext, onBack }) {
  const [method, setMethod] = useState("card");
  const { register, handleSubmit, formState: { errors } } = useForm();

  return (
    <form onSubmit={handleSubmit(onNext)} className="space-y-4 px-5 py-5 sm:px-6 sm:py-6">

      {/* Method selector */}
      <div className="space-y-2.5">
        {paymentMethods.map(({ id, label, desc, icon: Icon }) => {
          const active = method === id;
          return (
            <div key={id} onClick={() => setMethod(id)}
              className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3.5 transition-all sm:gap-4 sm:rounded-2xl sm:p-4
                ${active ? "border-foreground bg-foreground/5 dark:bg-foreground/10" : "border-border hover:border-muted-foreground/40 hover:bg-muted/30"}`}
            >
              <div className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 transition-all sm:h-5 sm:w-5
                ${active ? "border-foreground" : "border-muted-foreground/40"}`}
              >
                {active && <div className="h-2 w-2 rounded-full bg-foreground sm:h-2.5 sm:w-2.5" />}
              </div>
              <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl sm:h-9 sm:w-9
                ${active ? "bg-foreground text-background" : "bg-muted text-muted-foreground"}`}
              >
                <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-foreground sm:text-sm">{label}</p>
                <p className="text-[10px] text-muted-foreground sm:text-xs">{desc}</p>
              </div>
              {active && <span className="shrink-0 rounded-lg bg-foreground px-2 py-0.5 text-[9px] font-bold text-background">Selected</span>}
            </div>
          );
        })}
      </div>

      {/* Card fields */}
      {method === "card" && (
        <div className="space-y-3 rounded-2xl border border-border bg-muted/30 p-4 sm:space-y-4 sm:p-5">
          <div className="flex items-center justify-between rounded-xl bg-foreground px-4 py-3 text-background">
            <div className="flex items-center gap-2">
              <CreditCard className="h-4 w-4 opacity-70" />
              <span className="text-[10px] font-semibold opacity-70 sm:text-xs">Card Details</span>
            </div>
            <div className="flex items-center gap-1">
              <SiVisa className="h-4 w-6 opacity-80" />
              <SiMastercard className="h-4 w-5 opacity-80" />
            </div>
          </div>
          <div className="grid gap-3 sm:gap-4 md:grid-cols-2">
            <InputField label="Card Holder" placeholder="John Doe"             icon={User}       register={register("cardName",   { required: "Required" })} error={errors.cardName}   col2 />
            <InputField label="Card Number" placeholder="1234 5678 9012 3456"  icon={CreditCard} register={register("cardNumber", { required: "Required" })} error={errors.cardNumber} col2 maxLength={19} />
            <InputField label="Expiry"      placeholder="MM / YY"              icon={Calendar}   register={register("expiry",     { required: "Required" })} error={errors.expiry}     maxLength={5} />
            <InputField label="CVV"         placeholder="•••"                  icon={Lock}       register={register("cvv",        { required: "Required" })} error={errors.cvv}        type="password" maxLength={3} />
          </div>
          <div className="flex items-center gap-1.5 rounded-xl bg-green-50 dark:bg-green-950/40 border border-green-100 dark:border-green-900 px-3 py-2">
            <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-green-500" />
            <span className="text-[10px] font-medium text-green-600 dark:text-green-400 sm:text-xs">Your card details are encrypted and secure</span>
          </div>
        </div>
      )}

      {method === "upi" && (
        <div className="rounded-2xl border border-border bg-muted/30 p-4 sm:p-5">
          <InputField label="UPI ID" placeholder="yourname@upi" icon={Smartphone} register={register("upiId", { required: "Required" })} error={errors.upiId} col2 />
        </div>
      )}

      {method === "cod" && (
        <div className="flex items-start gap-3 rounded-2xl border border-amber-100 dark:border-amber-900 bg-amber-50 dark:bg-amber-950/40 p-4 sm:p-5">
          <Banknote className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
          <div>
            <p className="text-xs font-semibold text-amber-700 dark:text-amber-400 sm:text-sm">Cash on Delivery</p>
            <p className="mt-0.5 text-[10px] text-amber-600/80 sm:text-xs">Please keep exact change ready. COD charges may apply on orders below $50.</p>
          </div>
        </div>
      )}

      {/* Nav buttons */}
      <div className="flex gap-3">
        <button type="button" onClick={onBack}
          className="group flex items-center gap-1.5 rounded-xl border border-border bg-white dark:bg-gray-900 px-4 py-3 text-xs font-semibold text-muted-foreground transition-all hover:border-foreground hover:text-foreground sm:rounded-2xl sm:text-sm"
        >
          <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
          Back
        </button>
        <button type="submit"
          className="group flex flex-1 items-center justify-center gap-2 rounded-xl bg-foreground px-4 py-3 text-xs font-bold text-background transition-all hover:opacity-90 active:scale-[0.98] sm:rounded-2xl sm:text-sm"
        >
          Review Order
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>
    </form>
  );
}

// ─── STEP 3 — REVIEW ──────────────────────────────────────────────────────────

function ReviewStep({ shippingData, onBack, onPlace }) {
  const rows = [
    { label: "Name",    value: `${shippingData?.firstName ?? ""} ${shippingData?.lastName ?? ""}` },
    { label: "Email",   value: shippingData?.email   },
    { label: "Phone",   value: shippingData?.phone   },
    { label: "Address", value: shippingData?.address },
    { label: "City",    value: `${shippingData?.city ?? ""}, ${shippingData?.postal ?? ""}` },
    { label: "Country", value: shippingData?.country },
  ];

  return (
    <div className="space-y-5 px-5 py-5 sm:px-6 sm:py-6">

      {/* Shipping summary */}
      <div className="rounded-xl border border-border bg-muted/30 sm:rounded-2xl overflow-hidden">
        <div className="flex items-center gap-2 border-b border-border bg-muted/50 px-4 py-3">
          <Package className="h-3.5 w-3.5 text-muted-foreground sm:h-4 sm:w-4" />
          <span className="text-xs font-bold text-foreground sm:text-sm">Shipping Details</span>
        </div>
        <div className="divide-y divide-border">
          {rows.map(({ label, value }) => value?.trim() && (
            <div key={label} className="flex items-center justify-between px-4 py-2.5">
              <span className="text-[10px] text-muted-foreground sm:text-xs">{label}</span>
              <span className="text-[10px] font-semibold text-foreground sm:text-xs">{value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Confirm note */}
      <div className="flex items-start gap-2.5 rounded-xl border border-blue-100 dark:border-blue-900 bg-blue-50 dark:bg-blue-950/40 px-4 py-3">
        <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-blue-500 sm:h-4 sm:w-4" />
        <p className="text-[10px] text-blue-600 dark:text-blue-400 sm:text-xs">
          Please review your details before placing the order. You'll receive a confirmation email once your order is placed.
        </p>
      </div>

      {/* Nav buttons */}
      <div className="flex gap-3">
        <button onClick={onBack}
          className="group flex items-center gap-1.5 rounded-xl border border-border bg-white dark:bg-gray-900 px-4 py-3 text-xs font-semibold text-muted-foreground transition-all hover:border-foreground hover:text-foreground sm:rounded-2xl sm:text-sm"
        >
          <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
          Back
        </button>
        <button onClick={onPlace}
          className="group flex flex-1 items-center justify-center gap-2 rounded-xl bg-foreground px-4 py-3 text-xs font-bold text-background transition-all hover:opacity-90 active:scale-[0.98] sm:rounded-2xl sm:text-sm"
        >
          Place Order
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>
    </div>
  );
}

// ─── SUCCESS ──────────────────────────────────────────────────────────────────

function SuccessScreen() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 px-5 py-14 text-center sm:px-6 sm:py-16">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-950">
        <Check className="h-8 w-8 text-green-500" />
      </div>
      <div>
        <h3 className="text-base font-bold text-foreground sm:text-lg">Order Placed!</h3>
        <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
          Thank you! Your order has been confirmed.
        </p>
        <p className="mt-0.5 text-[10px] text-muted-foreground sm:text-xs">
          A confirmation email has been sent to you.
        </p>
      </div>
      <a href="/products"
        className="mt-2 inline-flex items-center gap-2 rounded-xl bg-foreground px-5 py-2.5 text-xs font-bold text-background transition-all hover:opacity-90 sm:rounded-2xl sm:text-sm"
      >
        Continue Shopping
        <ArrowRight className="h-3.5 w-3.5" />
      </a>
    </div>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────

export default function ShippingForm() {
  const [step, setStep]             = useState(1);
  const [shippingData, setShipping] = useState(null);
  const [placed, setPlaced]         = useState(false);

  const stepConfig = steps.find((s) => s.id === step);
  const StepIcon   = stepConfig?.icon;

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm sm:rounded-3xl">

      {/* ── CARD HEADER ──────────────────────────────────────── */}
      {!placed && (
        <div className="flex items-center gap-2.5 border-b border-border bg-muted/40 px-5 py-4 sm:px-6 sm:py-5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-foreground text-background sm:h-9 sm:w-9">
            {StepIcon && <StepIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />}
          </div>
          <div>
            <h2 className="text-sm font-bold text-foreground sm:text-base lg:text-lg">
              {stepConfig?.label}
            </h2>
            <p className="text-[10px] text-muted-foreground sm:text-xs">
              Step {step} of {steps.length}
            </p>
          </div>
        </div>
      )}

      {/* ── PROGRESS BAR ─────────────────────────────────────── */}
      {!placed && <ProgressBar current={step} />}

      {/* ── STEP CONTENT ─────────────────────────────────────── */}
      {placed ? (
        <SuccessScreen />
      ) : step === 1 ? (
        <ShippingStep onNext={(data) => { setShipping(data); setStep(2); }} />
      ) : step === 2 ? (
        <PaymentStep  onNext={() => setStep(3)} onBack={() => setStep(1)} />
      ) : (
        <ReviewStep   shippingData={shippingData} onBack={() => setStep(2)} onPlace={() => setPlaced(true)} />
      )}
    </div>
  );
}