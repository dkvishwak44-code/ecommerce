import AppGuard from "@/components/layout/app-gaurd";

export default function ProtectedLayout({ children }) {
  return (
    <AppGuard>
      {children}
    </AppGuard>
  );
}