// app/(shop)/layout.jsx

import Footer from "@/components/layout/footer/footer";
import Header from "@/components/layout/header/header";

// import Header from "@/components/layout/Header";

// import Footer from "@/components/layout/Footer";

export default function ShopLayout({ children }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
