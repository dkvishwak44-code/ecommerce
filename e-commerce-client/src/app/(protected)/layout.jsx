import Footer from "@/components/layout/footer/footer";
import Header from "@/components/layout/header/header";
import ProtectedRoute from "@/components/auth/protected-route";

export default function ProtectedLayout({ children }) {
  return (
    <ProtectedRoute>
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </ProtectedRoute>
  );
}
