import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "CareerMed",
    short_name: "CareerMed",
    description:
      "CareerMed connects healthcare professionals with verified hospital, clinic, diagnostics, and medical employer opportunities across India.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#155DFC",
    icons: [
      {
        src: "/heart.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/heart.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
