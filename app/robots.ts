import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/dashboard/",
          "/oauth/",
          "/api/",
        ],
      },
    ],
    sitemap: "https://www.careermed.in/sitemap.xml",
    host: "https://www.careermed.in",
  };
}
