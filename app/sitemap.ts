import type { MetadataRoute } from "next";

const siteUrl = "https://www.careermed.in";

const routes = [
  "",
  "/about-us",
  "/career-resources",
  "/contact",
  "/forgot-password",
  "/login",
  "/pricing",
  "/privacy-policy",
  "/register",
  "/terms-of-service",
  "/view-jobs",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return routes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified,
    changeFrequency: route === "" ? "daily" : "weekly",
    priority: route === "" ? 1 : route === "/view-jobs" || route === "/register" ? 0.9 : 0.7,
  }));
}
