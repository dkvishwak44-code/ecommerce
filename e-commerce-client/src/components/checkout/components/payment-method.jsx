"use client";

import { useState } from "react";
import {
  CreditCard,
  Smartphone,
  Banknote,
  Lock,
  User,
  Calendar,
  ShieldCheck,
} from "lucide-react";
import {
  SiVisa,
  SiMastercard,
  SiAmericanexpress,
} from "react-icons/si";

const paymentMethods = [
  {
    id: "card",
    label: "Credit / Debit Card",
    desc: "Visa, Mastercard, Amex accepted",
    icon: CreditCard,
  },
  {
    id: "upi",
    label: "UPI Payment",
    desc: "Google Pay, PhonePe, Paytm",
    icon: Smartphone,
  },
  {
    id: "cod",
    label: "Cash on Delivery",
    desc: "Pay after receiving your order",
    icon: Banknote,
  },
];

function InputField({ label, placeholder, type = "text", icon: Icon, col2 = false, maxLength }) {
  const [focused, setFocused] = useState(false);
  const [value, setValue] = useState("");

  return (
    <div className={col2 ? "md:col-span-2" : ""}>
      <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground sm:text-xs">
        {label}
      </label>
      <div className={`flex items-center gap-2.5 rounded-xl border bg-background px-3.5 transition-all duration-200 sm:rounded-2xl sm:px-4
        ${focused ? "border-foreground ring-2 ring-foreground/10" : "border-border hover:border-muted-foreground/40"}`}
      >
        {Icon && (
          <Icon className={`h-3.5 w-3.5 shrink-0 transition-colors sm:h-4 sm:w-4 ${focused ? "text-foreground" : "text-muted-foreground"}`} />
        )}
        <input
          type={type}
          placeholder={placeholder}
          maxLength={maxLength}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="h-11 w-full bg-transparent text-xs text-foreground outline-none placeholder:text-muted-foreground/60 sm:h-12 sm:text-sm"
        />
      </div>
    </div>
  );
}

export default function PaymentMethod() {
  const [selected, setSelected] = useState("card");

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm sm:rounded-3xl">

      {/* ── HEADER ─────────────────────────────────────────── */}
      <div className="flex items-center justify-between border-b border-border bg-muted/40 px-5 py-4 sm:px-6 sm:py-5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-foreground text-background sm:h-9 sm:w-9">
            <CreditCard className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-foreground sm:text-base lg:text-lg">
              Payment Method
            </h2>
            <p className="text-[10px] text-muted-foreground sm:text-xs">
              All transactions are secure & encrypted
            </p>
          </div>
        </div>

        {/* Card brand icons */}
        <div className="hidden items-center gap-1.5 sm:flex">
          {[SiVisa, SiMastercard, SiAmericanexpress].map((Icon, i) => (
            <div key={i} className="flex h-7 w-10 items-center justify-center rounded-lg border border-border bg-white dark:bg-gray-900 shadow-sm">
              <Icon className="h-3.5 w-5" />
            </div>
          ))}
        </div>
      </div>

      <div className="px-5 py-5 sm:px-6 sm:py-6 space-y-5">

        {/* ── PAYMENT OPTIONS ────────────────────────────────── */}
        <div className="space-y-2.5 sm:space-y-3">
          {paymentMethods.map(({ id, label, desc, icon: Icon }) => {
            const isSelected = selected === id;
            return (
              <label
                key={id}
                onClick={() => setSelected(id)}
                className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3.5 transition-all sm:gap-4 sm:rounded-2xl sm:p-4
                  ${isSelected
                    ? "border-foreground bg-foreground/5 dark:bg-foreground/10"
                    : "border-border hover:border-muted-foreground/40 hover:bg-muted/30"
                  }`}
              >
                {/* Radio */}
                <div className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 transition-all sm:h-5 sm:w-5
                  ${isSelected ? "border-foreground" : "border-muted-foreground/40"}`}
                >
                  {isSelected && (
                    <div className="h-2 w-2 rounded-full bg-foreground sm:h-2.5 sm:w-2.5" />
                  )}
                </div>

                {/* Icon */}
                <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl transition-all sm:h-9 sm:w-9
                  ${isSelected ? "bg-foreground text-background" : "bg-muted text-muted-foreground"}`}
                >
                  <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </div>

                {/* Text */}
                <div className="min-w-0 flex-1">
                  <p className={`text-xs font-semibold sm:text-sm ${isSelected ? "text-foreground" : "text-foreground/80"}`}>
                    {label}
                  </p>
                  <p className="text-[10px] text-muted-foreground sm:text-xs">
                    {desc}
                  </p>
                </div>

                {/* Selected badge */}
                {isSelected && (
                  <span className="shrink-0 rounded-lg bg-foreground px-2 py-0.5 text-[9px] font-bold text-background sm:text-[10px]">
                    Selected
                  </span>
                )}
              </label>
            );
          })}
        </div>

        {/* ── CARD INPUTS (shown only when card selected) ───── */}
        {selected === "card" && (
          <div className="space-y-3 rounded-2xl border border-border bg-muted/30 p-4 sm:space-y-4 sm:p-5">

            {/* Card preview strip */}
            <div className="flex items-center justify-between rounded-xl bg-foreground px-4 py-3 text-background sm:rounded-2xl">
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4 opacity-70 sm:h-5 sm:w-5" />
                <span className="text-[10px] font-semibold opacity-70 sm:text-xs">
                  Card Details
                </span>
              </div>
              <div className="flex items-center gap-1">
                <SiVisa className="h-4 w-6 opacity-80" />
                <SiMastercard className="h-4 w-5 opacity-80" />
              </div>
            </div>

            <div className="grid gap-3 sm:gap-4 md:grid-cols-2">
              <InputField
                label="Card Holder Name"
                placeholder="John Doe"
                icon={User}
                col2
              />
              <InputField
                label="Card Number"
                placeholder="1234 5678 9012 3456"
                icon={CreditCard}
                col2
                maxLength={19}
              />
              <InputField
                label="Expiry Date"
                placeholder="MM / YY"
                icon={Calendar}
                maxLength={5}
              />
              <InputField
                label="CVV"
                placeholder="•••"
                type="password"
                icon={Lock}
                maxLength={3}
              />
            </div>

            {/* SSL note */}
            <div className="flex items-center gap-1.5 rounded-xl bg-green-50 dark:bg-green-950/40 border border-green-100 dark:border-green-900 px-3 py-2">
              <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-green-500" />
              <span className="text-[10px] font-medium text-green-600 dark:text-green-400 sm:text-xs">
                Your card details are encrypted and secure
              </span>
            </div>
          </div>
        )}

        {/* UPI placeholder */}
        {selected === "upi" && (
          <div className="rounded-2xl border border-border bg-muted/30 p-4 sm:p-5">
            <InputField
              label="UPI ID"
              placeholder="yourname@upi"
              icon={Smartphone}
              col2
            />
          </div>
        )}

        {/* COD note */}
        {selected === "cod" && (
          <div className="flex items-start gap-3 rounded-2xl border border-amber-100 dark:border-amber-900 bg-amber-50 dark:bg-amber-950/40 p-4 sm:p-5">
            <Banknote className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
            <div>
              <p className="text-xs font-semibold text-amber-700 dark:text-amber-400 sm:text-sm">
                Cash on Delivery
              </p>
              <p className="mt-0.5 text-[10px] text-amber-600/80 dark:text-amber-500/80 sm:text-xs">
                Please keep exact change ready. COD charges may apply on orders below $50.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}