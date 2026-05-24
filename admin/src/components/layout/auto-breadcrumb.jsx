"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";

const LABEL_MAP = {
  products: "Products",
  edit: "Edit",
  new: "New",
};

function formatLabel(segment) {
  const isId = /^[0-9]+$/.test(segment);

  if (isId) return "Details";

  return (
    LABEL_MAP[segment] ||
    segment.charAt(0).toUpperCase() + segment.slice(1)
  );
}

export default function AutoBreadcrumb({
  homeLabel = "Home",
  homeHref = "/",
}) {
  const pathname = usePathname();

  const segments = pathname.split("/").filter(Boolean);

  return (
    <div className="flex items-center flex-wrap text-sm text-muted-foreground">

      {/* Home */}
      <Link href={homeHref} className="hover:text-black transition">
        {homeLabel}
      </Link>

      {segments.map((segment, index) => {
        const href = "/" + segments.slice(0, index + 1).join("/");
        const isLast = index === segments.length - 1;

        const label = formatLabel(segment);

        return (
          <div key={href} className="flex items-center">

            <ChevronRight className="h-4 w-4 mx-1" />

            {isLast ? (
              <span className="text-black font-medium">
                {label}
              </span>
            ) : (
              <Link href={href} className="hover:text-black transition">
                {label}
              </Link>
            )}

          </div>
        );
      })}
    </div>
  );
}