"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Bell, LogOut, Menu, Shield, X } from "lucide-react";
import Image from "next/image";
import { authStorage, logout } from "@/lib/api-client";

type UserRole = "employer" | "jobseeker" | "admin";

type StoredUser = {
  firstName?: string;
  lastName?: string;
  role?: UserRole;
};

type PathRule = {
  path: string;
  exact?: boolean;
};

type NavItem = {
  label: string;
  path: string;
  matches: PathRule[];
};

const USER_KEY = "user";
const PROFILE_COMPLETION_CACHE_KEY = "profileCompletionCache";
const PROFILE_COMPLETION_CACHE_TTL_MS = 60 * 1000;

const clampPercent = (value: number) => Math.max(0, Math.min(100, Math.round(value)));

function parseStoredUser(rawUser: string | null): StoredUser | null {
  if (!rawUser) return null;

  try {
    const parsed = JSON.parse(rawUser) as StoredUser;
    if (!parsed || typeof parsed !== "object") return null;
    return parsed;
  } catch {
    return null;
  }
}

function matchesPathname(pathname: string, rule: PathRule): boolean {
  if (rule.exact) {
    return pathname === rule.path;
  }

  return pathname === rule.path || pathname.startsWith(`${rule.path}/`);
}

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  const [user, setUser] = useState<StoredUser | null>(null);
  const [hasAccessToken, setHasAccessToken] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileCompletion, setProfileCompletion] = useState<number | null>(null);

  const mobileMenuRef = useRef<HTMLDivElement>(null);

  const syncAuthState = () => {
    const token = authStorage.getAccessToken();
    const parsedUser = parseStoredUser(localStorage.getItem(USER_KEY));
    const authenticated = Boolean(token && parsedUser?.role);

    setHasAccessToken(authenticated);
    setUser(authenticated ? parsedUser : null);
  };

  useEffect(() => {
    syncAuthState();
  }, []);

  useEffect(() => {
    const handleAuthStateChange = () => {
      syncAuthState();
    };

    const handleStorage = (event: StorageEvent) => {
      if (event.key === USER_KEY || event.key === "accessToken") {
        syncAuthState();
      }
    };

    window.addEventListener("auth-state-changed", handleAuthStateChange);
    window.addEventListener("focus", handleAuthStateChange);
    window.addEventListener("storage", handleStorage);
    return () => {
      window.removeEventListener("auth-state-changed", handleAuthStateChange);
      window.removeEventListener("focus", handleAuthStateChange);
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    syncAuthState();
  }, [pathname]);

  useEffect(() => {
    const fetchProfileCompletion = async () => {
      if (!hasAccessToken || !user?.role) {
        setProfileCompletion(null);
        return;
      }

      if (user.role === "admin") {
        setProfileCompletion(100);
        return;
      }

      const token = authStorage.getAccessToken();
      if (!token) {
        setProfileCompletion(null);
        return;
      }

      try {
        const rawCache = sessionStorage.getItem(PROFILE_COMPLETION_CACHE_KEY);
        if (rawCache) {
          const cache = JSON.parse(rawCache) as { role?: UserRole; value?: number; fetchedAt?: number };
          const isFresh =
            cache?.role === user.role &&
            typeof cache?.value === "number" &&
            typeof cache?.fetchedAt === "number" &&
            Date.now() - cache.fetchedAt < PROFILE_COMPLETION_CACHE_TTL_MS;

          if (isFresh) {
            setProfileCompletion(clampPercent(cache.value!));
            return;
          }
        }
      } catch {
        // Ignore cache parse issues and fetch fresh data.
      }

      try {
        const endpoint =
          user.role === "jobseeker" ? "/api/jobseeker/profile" : "/api/employer/profile";

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        if (user.role === "jobseeker") {
          const completion = data?.data?.jobSeeker?.profileCompletion;
          if (typeof completion === "number") {
            const safeCompletion = clampPercent(completion);
            setProfileCompletion(safeCompletion);
            sessionStorage.setItem(
              PROFILE_COMPLETION_CACHE_KEY,
              JSON.stringify({ role: user.role, value: safeCompletion, fetchedAt: Date.now() })
            );
            return;
          }
        }

        if (user.role === "employer") {
          const employer = data?.data?.employer;
          if (employer) {
            const checks = [
              Boolean(employer.organizationName),
              Boolean(employer.organizationType),
              Boolean(employer.description),
              Boolean(employer.website),
              Boolean(employer.foundedYear),
              Boolean(employer.employeeCount),
              Boolean(employer.contactPerson?.name),
              Boolean(employer.contactPerson?.email),
              Boolean(employer.contactPerson?.phone),
              Boolean(employer.address?.city),
              Boolean(employer.address?.state),
              Boolean(employer.address?.country),
            ];
            const completion = Math.round((checks.filter(Boolean).length / checks.length) * 100);
            const safeCompletion = clampPercent(completion);
            setProfileCompletion(safeCompletion);
            sessionStorage.setItem(
              PROFILE_COMPLETION_CACHE_KEY,
              JSON.stringify({ role: user.role, value: safeCompletion, fetchedAt: Date.now() })
            );
            return;
          }
        }

        setProfileCompletion(null);
      } catch {
        setProfileCompletion(null);
      }
    };

    fetchProfileCompletion();
  }, [hasAccessToken, user?.role]);

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setMobileMenuOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileMenuOpen(false);
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const navigate = (path: string) => {
    router.push(path);
    setMobileMenuOpen(false);
  };

  const handleLogout = async () => {
    await logout();
    setUser(null);
    setProfileCompletion(null);
    navigate("/login");
  };

  const userDisplayName = user?.firstName
    ? `${user.firstName} ${user.lastName ?? ""}`.trim()
    : "Guest User";
  const isAuthenticated = hasAccessToken && Boolean(user?.role);

  const navItems: NavItem[] = useMemo(() => {
    if (user?.role === "jobseeker") {
      return [
        { label: "Home", path: "/", matches: [{ path: "/", exact: true }] },
        {
          label: "Jobs",
          path: "/dashboard/jobseeker",
          matches: [
            { path: "/dashboard/jobseeker", exact: true },
            { path: "/dashboard/jobseeker/jobs" },
          ],
        },
        {
          label: "Employers",
          path: "/dashboard/jobseeker/employers",
          matches: [{ path: "/dashboard/jobseeker/employers" }],
        },
        {
          label: "My Applications",
          path: "/dashboard/jobseeker/applications",
          matches: [{ path: "/dashboard/jobseeker/applications" }],
        },
        {
          label: "Saved Jobs",
          path: "/dashboard/jobseeker/bookmarks",
          matches: [{ path: "/dashboard/jobseeker/bookmarks" }],
        },
        {
          label: "Resume",
          path: "/dashboard/jobseeker/resume",
          matches: [{ path: "/dashboard/jobseeker/resume" }],
        },
        { label: "Pricing", path: "/pricing", matches: [{ path: "/pricing" }] },
        {
          label: "Profile",
          path: "/dashboard/jobseeker/profile",
          matches: [{ path: "/dashboard/jobseeker/profile" }],
        },
      ];
    }

    if (user?.role === "employer") {
      return [
        { label: "Home", path: "/", matches: [{ path: "/", exact: true }] },
        { label: "Pricing", path: "/pricing", matches: [{ path: "/pricing" }] },
        {
          label: "My Job Postings",
          path: "/dashboard/employee/jobs",
          matches: [{ path: "/dashboard/employee/jobs" }],
        },
        {
          label: "Create Job",
          path: "/dashboard/employee/jobs/create",
          matches: [{ path: "/dashboard/employee/jobs/create" }],
        },
        {
          label: "Profile",
          path: "/dashboard/employee/profile",
          matches: [{ path: "/dashboard/employee/profile" }],
        },
      ];
    }

    if (user?.role === "admin") {
      return [
        { label: "Home", path: "/", matches: [{ path: "/", exact: true }] },
        { label: "Pricing", path: "/pricing", matches: [{ path: "/pricing" }] },
        { label: "Admin", path: "/dashboard/admin", matches: [{ path: "/dashboard/admin" }] },
      ];
    }

    return [
      { label: "Home", path: "/", matches: [{ path: "/", exact: true }] },
      { label: "Pricing", path: "/pricing", matches: [{ path: "/pricing" }] },
      { label: "Jobs", path: "/view-jobs", matches: [{ path: "/view-jobs" }] },
      { label: "Employers", path: "/login", matches: [{ path: "/login" }] },
    ];
  }, [user?.role]);

  const isActive = (item: NavItem) => {
    return item.matches.some((rule) => matchesPathname(pathname, rule));
  };

  const completionBanner = useMemo(() => {
    if (!user?.role || typeof profileCompletion !== "number") return null;

    if (user.role === "jobseeker") {
      return {
        title: "Profile Completion",
        detail:
          profileCompletion < 100
            ? "Complete missing sections to increase recruiter visibility."
            : "Your profile is ready for maximum recruiter visibility.",
        cta: profileCompletion < 100 ? "Complete Profile" : "Review Profile",
        ctaPath: "/dashboard/jobseeker/profile",
      };
    }

    if (user.role === "employer") {
      return {
        title: "Company Profile Completion",
        detail:
          profileCompletion < 100
            ? "Finish company details to build trust with medical candidates."
            : "Company profile is complete and trusted by candidates.",
        cta: profileCompletion < 100 ? "Complete Company Profile" : "Review Profile",
        ctaPath: "/dashboard/employee/profile/create",
      };
    }

    return {
      title: "Admin Workspace Readiness",
      detail: "Admin access is fully configured.",
      cta: "Admin Dashboard",
      ctaPath: "/dashboard/admin",
    };
  }, [profileCompletion, user?.role]);

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.45 }}
      className="sticky top-0 z-50 border-b border-gray-200 bg-white"
    >
      {completionBanner && (
        <div className="w-full bg-gradient-to-r from-[#155DFC] to-[#00B8DB] px-4 py-1.5 text-white">
          <div className="mx-auto flex max-w-7xl items-center gap-3 text-xs sm:text-sm">
            <div className="flex min-w-0 shrink-0 items-center gap-2">
              <Shield className="h-4 w-4 shrink-0" />
              <span className="font-medium">
                {completionBanner.title}: {profileCompletion}%
              </span>
            </div>
            <div className="h-1.5 min-w-0 flex-1 overflow-hidden rounded-full bg-white/30">
              <div className="h-full rounded-full bg-white" style={{ width: `${profileCompletion}%` }} />
            </div>
            <button
              type="button"
              onClick={() => navigate(completionBanner.ctaPath)}
              className="shrink-0 rounded-md bg-white/15 px-2.5 py-0.5 text-xs font-semibold text-white transition hover:bg-white/25"
            >
              {completionBanner.cta}
            </button>
          </div>
        </div>
      )}

      <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2 lg:gap-4">
            <motion.button
              type="button"
              className="flex items-center"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/")}
              aria-label="Go to home"
            >
              <Image
                src="/logo.png"
                alt="CareerMade"
                width={140}
                height={32}
                priority
                style={{ width: "140px", height: "auto" }}
              />
            </motion.button>

            <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary navigation">
              {navItems.map((item) => (
                <button
                  key={item.label}
                  onClick={() => navigate(item.path)}
                  className={`whitespace-nowrap rounded-md px-2 py-2 text-sm font-medium transition xl:px-3 ${
                    isActive(item)
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="hidden shrink-0 items-center gap-1 sm:gap-2 lg:flex">
            {isAuthenticated && user ? (
              <>
                {user.role === "jobseeker" && (
                  <button
                    onClick={() => navigate("/dashboard/jobseeker/resume")}
                    className="flex h-9 items-center justify-center gap-1 rounded-md px-2 text-sm font-medium text-gray-800 transition hover:bg-gray-100"
                    aria-label="Open InstantCV"
                  >
                    <Image src="/star.png" alt="InstantCV" width={16} height={16} />
                    <span>InstantCV</span>
                  </button>
                )}

                <button
                  type="button"
                  className="flex h-9 w-9 items-center justify-center rounded-md text-gray-700 transition hover:bg-gray-100"
                  aria-label="Notifications"
                >
                  <Bell size={18} />
                </button>

                
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  className="rounded-md px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 hover:text-blue-600"
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/register")}
                  className="rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>

          <div className="flex items-center gap-2 lg:hidden">
            {isAuthenticated && user?.role === "jobseeker" && (
              <button
                onClick={() => navigate("/dashboard/jobseeker/resume")}
                className="flex h-9 items-center justify-center gap-1 rounded-md px-2 text-sm font-medium text-gray-800 transition hover:bg-gray-100"
                aria-label="Open InstantCV"
              >
                <Image src="/star.png" alt="InstantCV" width={16} height={16} />
                <span className="hidden sm:inline">InstantCV</span>
              </button>
            )}

            {isAuthenticated && user ? (
              <button
                type="button"
                onClick={() => setMobileMenuOpen((prev) => !prev)}
                className="flex h-9 w-9 items-center justify-center rounded-md text-gray-700 transition hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                aria-expanded={mobileMenuOpen}
                aria-haspopup="dialog"
                aria-label="Open menu"
              >
                {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  className="rounded-md border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 transition hover:bg-gray-50"
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/register")}
                  className="rounded-md bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-blue-700"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-[60] bg-black/30 lg:hidden"
          >
            <motion.div
              ref={mobileMenuRef}
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 top-0 h-full w-[min(22rem,88vw)] overflow-y-auto bg-white p-4 shadow-2xl"
              role="dialog"
              aria-label="Mobile navigation menu"
            >
              <div className="mb-4 flex items-center justify-between border-b pb-3">
                <div>
                  <p className="text-sm text-gray-500">Signed in as</p>
                  <p className="max-w-[12rem] truncate font-semibold text-gray-900">{userDisplayName}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-md p-1 text-gray-600 hover:bg-gray-100"
                  aria-label="Close menu"
                >
                  <X size={18} />
                </button>
              </div>

              <nav className="flex flex-col gap-1" aria-label="Mobile navigation">
                {navItems.map((item) => (
                  <button
                    key={`mobile-${item.label}`}
                    onClick={() => navigate(item.path)}
                    className={`rounded-md px-3 py-2 text-left text-sm font-medium transition ${
                      isActive(item)
                        ? "bg-blue-50 text-blue-700"
                        : "text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </nav>

              <div className="mt-4 border-t pt-3">
                {isAuthenticated && user ? (
                  <>
                    

                    <button
                      type="button"
                      className="mt-1 flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-gray-700 transition hover:bg-gray-50 hover:text-blue-600"
                    >
                      <Bell size={16} />
                      <span>Notifications</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="mt-1 flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-red-500 transition hover:bg-red-50 hover:text-red-600"
                    >
                      <LogOut size={16} />
                      <span>Logout</span>
                    </button>
                  </>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => navigate("/login")}
                      className="rounded-md px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 hover:text-blue-600"
                    >
                      Sign In
                    </button>
                    <button
                      type="button"
                      onClick={() => navigate("/register")}
                      className="rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
                    >
                      Sign Up
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
