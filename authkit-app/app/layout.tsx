import type { Metadata } from "next";
import { AuthKitProvider } from "@workos-inc/authkit-nextjs/components";
import { ServiceWorkerRegister } from "./components/service-worker-register";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mamba FX Academy",
  description: "Learn trading skills with Mamba FX Academy.",
  applicationName: "Mamba FX Academy",
  manifest: "/manifest.webmanifest",
  themeColor: "#07101c",
  appleWebApp: { capable: true, statusBarStyle: "black-translucent", title: "Mamba FX" },
  icons: { icon: "/icon.svg", apple: "/icon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><AuthKitProvider>{children}<ServiceWorkerRegister /></AuthKitProvider></body></html>;
}
