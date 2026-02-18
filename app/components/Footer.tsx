"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type UserRole = "jobseeker" | "employer" | "admin" | null;

const Footer = () => {
  const [role, setRole] = useState<UserRole>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("user");
      if (!raw) {
        setRole(null);
        return;
      }
      const parsed = JSON.parse(raw) as { role?: UserRole };
      setRole(parsed?.role || null);
    } catch {
      setRole(null);
    }
  }, []);

  const showJobSeekerSection = role === "jobseeker" || role === null;
  const showEmployerSection = role === "employer" || role === null;

  return (
    <footer className="bg-gray-900 py-12 text-gray-400">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 grid gap-8 md:grid-cols-4">
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
        </div>

        <div className="border-t border-gray-800 pt-8 text-center text-sm">
          <p>© 2025 CareerMade. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
