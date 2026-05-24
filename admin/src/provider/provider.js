"use client";
// import { Provider } from "react-redux";
// import { store } from "@/redux/store";


import { ThemeProvider } from "./theme-provider";
import { QueryProvider } from "./query-provider";
import { Toaster } from "sonner";
import ReduxProvider from "./redux-provider";


export function Providers({ children }) {
  return (
    <ReduxProvider>
    <ThemeProvider>
      <QueryProvider>
        {children}

        {/*  correct Sonner usage */}
        <Toaster position="top-center" richColors />
      </QueryProvider>
    </ThemeProvider>
    </ReduxProvider>
  );
}