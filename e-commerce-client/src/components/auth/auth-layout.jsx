// components/auth/AuthLayout.jsx

export default function AuthLayout({
  title,
  subtitle,
  children,
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-50 to-white dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <section className="min-h-screen w-full overflow-y-auto">
        <div className="grid lg:grid-cols-2">
          {/* ───────────────── LEFT PANEL ───────────────── */}
          <div className="relative hidden flex-col justify-between overflow-hidden bg-gray-950 p-8 text-white dark:bg-gray-900 xl:p-14 lg:flex">
            {/* GRID BACKGROUND */}
            <div
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
                backgroundSize:
                  "40px 40px",
              }}
            />

            {/* GLOW EFFECTS */}
            <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-indigo-600/30 blur-3xl" />

            <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-purple-600/20 blur-3xl" />

            <div className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-600/10 blur-3xl" />

            {/* TOP */}
            <div className="relative z-10">
              {/* LOGO */}
              <div className="inline-flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/20 bg-white/10 backdrop-blur">
                  <span className="text-xl font-black">
                    S
                  </span>
                </div>

                <span className="text-2xl font-black tracking-tight">
                  Shop
                  <span className="text-indigo-400">
                    Sphere
                  </span>
                </span>
              </div>

              {/* HERO TEXT */}
              <div className="mt-10">
                <h1 className="text-3xl font-bold leading-tight xl:text-5xl">
                  Shop smarter,
                  <br />

                  <span className="text-indigo-400">
                    live better.
                  </span>
                </h1>

                <p className="mt-5 max-w-md text-sm leading-7 text-white/60 xl:text-base">
                  Discover premium
                  products with fast
                  delivery, secure
                  checkout and modern
                  shopping experience.
                </p>
              </div>
            </div>

            {/* FEATURES */}
            <div className="relative z-10 mt-10 space-y-4">
              {[
                {
                  icon: "🛡️",
                  title:
                    "Secure Payments",
                  desc:
                    "256-bit SSL protected checkout",
                },

                {
                  icon: "🚀",
                  title:
                    "Fast Delivery",
                  desc:
                    "Same-day & next-day shipping",
                },

                {
                  icon: "⭐",
                  title:
                    "Premium Quality",
                  desc:
                    "Top-rated curated products",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 px-5 py-4 backdrop-blur transition hover:bg-white/10"
                >
                  <span className="text-2xl">
                    {item.icon}
                  </span>

                  <div>
                    <h3 className="text-sm font-semibold">
                      {item.title}
                    </h3>

                    <p className="mt-1 text-xs text-white/50">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* BOTTOM */}
            <div className="relative z-10 mt-10">
              <div className="flex items-center gap-4">
                {/* USERS */}
                <div className="flex -space-x-2">
                  {[
                    "🧑",
                    "👩",
                    "👨",
                    "🧕",
                    "🧔",
                  ].map((emoji, i) => (
                    <div
                      key={i}
                      className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-gray-950 bg-gray-700 text-sm"
                    >
                      {emoji}
                    </div>
                  ))}
                </div>

                {/* TEXT */}
                <div>
                  <p className="text-sm font-semibold">
                    50,000+ happy
                    customers
                  </p>

                  <p className="text-xs text-white/50">
                    ⭐⭐⭐⭐⭐ 4.9 average
                    rating
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ───────────────── RIGHT PANEL ───────────────── */}
          <div className="flex flex-col justify-center px-6 py-10 sm:px-10 lg:px-14">
            <div className="mx-auto w-full max-w-lg">
              {/* MOBILE LOGO */}
              <div className="mb-8 flex items-center gap-3 lg:hidden">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gray-950 dark:bg-white">
                  <span className="text-sm font-black text-white dark:text-black">
                    S
                  </span>
                </div>

                <span className="text-2xl font-black tracking-tight text-gray-950 dark:text-white">
                  Shop
                  <span className="text-indigo-500">
                    Sphere
                  </span>
                </span>
              </div>

              {/* HEADING */}
              <div className="mb-8">
                <h2 className="text-3xl font-bold tracking-tight text-gray-950 dark:text-white sm:text-4xl">
                  {title}
                </h2>

                <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
                  {subtitle}
                </p>
              </div>

              {/* FORM */}
              <div>{children}</div>

              {/* DIVIDER */}
              <div className="my-7 flex items-center gap-4">
                <div className="h-px flex-1 bg-gray-200 dark:bg-gray-800" />

                <span className="text-xs text-gray-400">
                  or continue with
                </span>

                <div className="h-px flex-1 bg-gray-200 dark:bg-gray-800" />
              </div>

              {/* SOCIAL LOGIN */}
              <div className="grid grid-cols-2 gap-4">
                {/* GOOGLE */}
                <button className="flex h-12 items-center justify-center gap-3 rounded-2xl border border-gray-200 bg-white text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800">
                  Google
                </button>

                {/* GITHUB */}
                <button className="flex h-12 items-center justify-center gap-3 rounded-2xl border border-gray-200 bg-white text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800">
                  GitHub
                </button>
              </div>

              {/* FOOTER */}
              <p className="mt-8 text-center text-xs leading-6 text-gray-400 dark:text-gray-600">
                By continuing, you
                agree to our{" "}
                <a
                  href="/terms"
                  className="underline transition hover:text-gray-700 dark:hover:text-gray-300"
                >
                  Terms of Service
                </a>{" "}
                and{" "}
                <a
                  href="/privacy"
                  className="underline transition hover:text-gray-700 dark:hover:text-gray-300"
                >
                  Privacy Policy
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}