import {
  SiVisa,
  SiMastercard,
  SiAmericanexpress,
  SiPaypal,
  SiApplepay,
  SiGooglepay,
} from "react-icons/si";

const methods = [
  { label: "Visa",        Icon: SiVisa,            color: "#1A1F71" },
  { label: "Mastercard",  Icon: SiMastercard,       color: "#EB001B" },
  { label: "Amex",        Icon: SiAmericanexpress,  color: "#2E77BC" },
  { label: "PayPal",      Icon: SiPaypal,           color: "#003087" },
  { label: "Apple Pay",   Icon: SiApplepay,         color: "#000000" },
  { label: "Google Pay",  Icon: SiGooglepay,        color: "#4285F4" },
];

export default function PaymentMethods() {
  return (
    <div className="mt-6 sm:mt-8 lg:mt-10">

      {/* Label */}
      <p className="mb-3 text-center text-[10px] font-semibold uppercase tracking-widest text-muted-foreground sm:text-xs">
        Secure Payment Methods
      </p>

      {/* Cards */}
      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
        {methods.map(({ label, Icon, color }) => (
          <div
            key={label}
            className="group flex flex-col items-center justify-center gap-1.5 rounded-xl border border-border bg-card px-3 py-2.5 shadow-sm transition-all hover:border-foreground/20 hover:shadow-md
                       sm:rounded-2xl sm:px-4 sm:py-3"
          >
            <Icon
              className="h-5 w-5 transition-transform group-hover:scale-110 sm:h-6 sm:w-6"
              style={{ color }}
            />
            <span className="text-[9px] font-semibold text-muted-foreground sm:text-[10px]">
              {label}
            </span>
          </div>
        ))}
      </div>

      {/* SSL note */}
      <p className="mt-3 text-center text-[10px] text-muted-foreground sm:mt-4 sm:text-xs">
        🔒 256-bit SSL encrypted & secure checkout
      </p>
    </div>
  );
}