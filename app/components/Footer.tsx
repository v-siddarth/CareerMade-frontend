"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type UserRole = "jobseeker" | "employer" | "admin" | null;

const Footer = () => {
  const [role, setRole] = useState<UserRole>(null);
  const [hasAccessToken, setHasAccessToken] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const syncAuth = () => {
      try {
        const token = localStorage.getItem("accessToken");
        const raw = localStorage.getItem("user");
        setHasAccessToken(Boolean(token));

        if (!raw) {
          setRole(null);
          return;
        }

        const parsed = JSON.parse(raw) as { role?: UserRole };
        setRole(parsed?.role || null);
      } catch {
        setRole(null);
      } finally {
        setHydrated(true);
      }
    };

    syncAuth();
    window.addEventListener("auth-state-changed", syncAuth);
    window.addEventListener("focus", syncAuth);
    window.addEventListener("storage", syncAuth);

    return () => {
      window.removeEventListener("auth-state-changed", syncAuth);
      window.removeEventListener("focus", syncAuth);
      window.removeEventListener("storage", syncAuth);
    };
  }, []);

  const isAuthenticated = hydrated && hasAccessToken && Boolean(role);
  const showJobSeekerSection = isAuthenticated ? role === "jobseeker" : true;
  const showEmployerSection = isAuthenticated ? role === "employer" : true;

  return (
    <footer className="bg-gray-900 py-12 text-gray-400">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 grid gap-8 [grid-template-columns:repeat(auto-fit,minmax(220px,1fr))]">
          <div>
            <div className="mb-4 text-2xl font-bold text-white">
              <img src="/logo.png" alt="CareerMade" className="h-13" />
            </div>
            <p className="mb-4 text-sm">
              Empowering healthcare professionals to find their dream careers
            </p>
            <div className="flex space-x-4">
              <a href="https://www.linkedin.com" target="_blank" rel="noreferrer" className="hover:text-white">LinkedIn</a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="hover:text-white">Twitter</a>
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="hover:text-white">Facebook</a>
            </div>
          </div>

          {showJobSeekerSection && (
            <div>
              <h4 className="mb-4 font-semibold text-white">For Job Seekers</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/view-jobs" className="hover:text-white">Browse Jobs</Link></li>
                <li><Link href="/career-resources" className="hover:text-white">Career Resources</Link></li>
                <li><Link href="/dashboard/jobseeker/resume/build" className="hover:text-white">Resume Builder</Link></li>
                <li><Link href="/pricing" className="hover:text-white">Pricing</Link></li>
              </ul>
            </div>
          )}

          {showEmployerSection && (
            <div>
              <h4 className="mb-4 font-semibold text-white">For Employers</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/dashboard/employee/jobs/create" className="hover:text-white">Post a Job</Link></li>
                <li><Link href="/dashboard/employee/jobs" className="hover:text-white">Manage Job Posts</Link></li>
                <li><Link href="/dashboard/employee/applications" className="hover:text-white">Applications</Link></li>
                <li><Link href="/pricing" className="hover:text-white">Pricing</Link></li>
              </ul>
            </div>
          )}

          <div>
            <h4 className="mb-4 font-semibold text-white">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about-us" className="hover:text-white">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
              <li><Link href="/privacy-policy" className="hover:text-white">Privacy Policy</Link></li>
              <li><Link href="/terms-of-service" className="hover:text-white">Terms of Service</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-semibold text-white">Trust & Credits</h4>
            <p className="text-sm leading-6">
              CareerMed is proudly owned by{" "}
              <a
                href="https://lifematecare.com/"
                target="_blank"
                rel="noreferrer"
                className="font-semibold text-white underline decoration-gray-600 underline-offset-4 transition hover:text-cyan-300"
              >
                Lifemate Healthcare Pvt Ltd
              </a>
              , focused on building trusted healthcare hiring experiences.
            </p>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 text-center text-sm">
          <p className="mb-2">
            Support Email:{" "}
            <a href="mailto:support@carreermed.in" className="text-gray-200 transition hover:text-white">
              support@carreermed.in
            </a>{" "}
            <span className="mx-2 hidden sm:inline">|</span>
            <span className="block sm:inline">Contact: +91 98765 43210</span>
          </p>
          <p>© 2026 CareerMade. All rights reserved.</p>
          <p className="mt-2">
            Designed, developed, and maintained by{" "}
            <a
              href="https://20sdevelopers.com/"
              target="_blank"
              rel="noreferrer"
              className="font-semibold text-white underline decoration-gray-600 underline-offset-4 transition hover:text-cyan-300"
            >
              20s Developers
            </a>
            .
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
