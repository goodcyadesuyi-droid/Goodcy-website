import type { Metadata } from "next";
import { AuthKitProvider } from "@workos-inc/authkit-nextjs/components";
import { ServiceWorkerRegister } from "./components/service-worker-register";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://mambafxacademy.com"),
  title: {
    default: "Mamba FX Academy | Forex Education",
    template: "%s | Mamba FX Academy",
  },
  description: "Mamba FX Academy is a Nigeria-based online forex education brand founded by Adesuyi Goodness and Adesuyi Mercy. Learn forex fundamentals, market analysis, trading psychology and risk awareness.",
  applicationName: "Mamba FX Academy",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "https://mambafxacademy.com",
    siteName: "Mamba FX Academy",
    title: "Mamba FX Academy | Learn the Market. Build Your Discipline.",
    description: "Online forex education from Nigeria. Learn market fundamentals, analysis concepts and responsible trading practices.",
  },
  robots: { index: true, follow: true },
  manifest: "/manifest.webmanifest",
  themeColor: "#07101c",
  appleWebApp: { capable: true, statusBarStyle: "black-translucent", title: "Mamba FX" },
  icons: { icon: "/icon.svg", apple: "/icon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en-NG"><body><AuthKitProvider>{children}<ServiceWorkerRegister /></AuthKitProvider></body></html>;
}
