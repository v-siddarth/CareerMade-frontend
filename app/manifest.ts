import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "CareerMed — Healthcare Jobs & Medical Careers in India",
    short_name: "CareerMed",
    description:
      "India's leading healthcare job platform — Find verified doctor, nurse, technician & medical jobs at top hospitals, clinics, and diagnostic centres across India.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#155DFC",
    orientation: "portrait-primary",
    categories: ["business", "medical", "productivity"],
    icons: [
      {
        src: "/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
