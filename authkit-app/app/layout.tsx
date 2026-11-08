import type { Metadata } from "next";
import { AuthKitProvider } from "@workos-inc/authkit-nextjs/components";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mamba FX Academy",
  description: "Learn trading skills with Mamba FX Academy.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><AuthKitProvider>{children}</AuthKitProvider></body></html>;
}
