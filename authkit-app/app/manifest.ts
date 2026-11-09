import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "Mamba FX Academy",
    short_name: "Mamba FX",
    description: "Learn trading skills with Mamba FX Academy.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#07101c",
    theme_color: "#07101c",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any maskable" }
    ]
  };
}
