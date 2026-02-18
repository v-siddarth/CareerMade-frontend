"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Bell, CheckCheck, ExternalLink, LogOut, Menu, Shield, X } from "lucide-react";
import Image from "next/image";
import { authStorage, logout } from "@/lib/api-client";
import {
  type AppNotification,
  listNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from "@/lib/notifications-client";

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

function formatNotificationTime(value?: string) {
  if (!value) return "";
  const ts = new Date(value).getTime();
  if (!Number.isFinite(ts)) return "";

  const minutes = Math.max(1, Math.floor((Date.now() - ts) / (1000 * 60)));
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(ts).toLocaleDateString();
}

function notificationTypeStyle(type: AppNotification["type"]) {
  switch (type) {
    case "job_recommendation":
      return "bg-blue-50 text-blue-700 border-blue-200";
    case "application_status":
      return "bg-violet-50 text-violet-700 border-violet-200";
    case "saved_job_expiry":
      return "bg-amber-50 text-amber-700 border-amber-200";
    case "pricing":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    default:
      return "bg-gray-50 text-gray-700 border-gray-200";
  }
}

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  const [user, setUser] = useState<StoredUser | null>(null);
  const [hasAccessToken, setHasAccessToken] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [mobileNotificationOpen, setMobileNotificationOpen] = useState(false);
  const [notificationLoading, setNotificationLoading] = useState(false);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [profileCompletion, setProfileCompletion] = useState<number | null>(null);

  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);

  const syncAuthState = () => {
    const token = authStorage.getAccessToken();
    const parsedUser = parseStoredUser(localStorage.getItem(USER_KEY));
    const authenticated = Boolean(token && parsedUser?.role);

    setHasAccessToken(authenticated);
    setUser(authenticated ? parsedUser : null);
  };

  const fetchNotifications = async () => {
    if (!authStorage.getAccessToken()) {
      setNotifications([]);
      setUnreadCount(0);
      return;
    }

    try {
      setNotificationLoading(true);
      const response = await listNotifications(20);
      setNotifications(response.items);
      setUnreadCount(response.unreadCount);
    } catch {
      setNotifications([]);
      setUnreadCount(0);
    } finally {
      setNotificationLoading(false);
    }
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
    setNotificationOpen(false);
    setMobileNotificationOpen(false);
    syncAuthState();
  }, [pathname]);

  useEffect(() => {
    if (hasAccessToken && user?.role) {
      fetchNotifications();
      return;
    }
    setNotifications([]);
    setUnreadCount(0);
  }, [hasAccessToken, user?.role]);

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
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setNotificationOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileMenuOpen(false);
        setNotificationOpen(false);
        setMobileNotificationOpen(false);
      }
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
    setNotifications([]);
    setUnreadCount(0);
    navigate("/login");
  };

  const openNotifications = async () => {
    setNotificationOpen((prev) => !prev);
    setMobileNotificationOpen(false);
    if (!notificationOpen) {
      await fetchNotifications();
    }
  };

  const openMobileNotifications = async () => {
    setMobileNotificationOpen((prev) => !prev);
    setMobileMenuOpen(false);
    if (!mobileNotificationOpen) {
      await fetchNotifications();
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllNotificationsRead();
      setNotifications((prev) => prev.map((item) => ({ ...item, readAt: item.readAt || new Date().toISOString() })));
      setUnreadCount(0);
    } catch {
      // Keep UI stable if the request fails.
    }
  };

  const handleNotificationClick = async (notification: AppNotification) => {
    if (!notification.readAt) {
      try {
        await markNotificationRead(notification._id);
        setNotifications((prev) =>
          prev.map((item) =>
            item._id === notification._id ? { ...item, readAt: new Date().toISOString() } : item
          )
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
      } catch {
        // Keep navigation responsive even if read-state update fails.
      }
    }

    if (notification.ctaPath) {
      navigate(notification.ctaPath);
      setNotificationOpen(false);
      setMobileNotificationOpen(false);
    }
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

  const notificationPanel = (
    <div className="w-[min(92vw,24rem)] overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-2xl shadow-blue-100">
      <div className="flex items-center justify-between border-b border-blue-100 bg-gradient-to-r from-blue-50 to-cyan-50 px-4 py-3">
        <div>
          <p className="text-sm font-semibold text-[#0f2f60]">Notifications</p>
          <p className="text-xs text-[#4b6b95]">{unreadCount} unread</p>
        </div>
        <button
          type="button"
          onClick={handleMarkAllAsRead}
          className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-semibold text-blue-700 transition hover:bg-blue-100"
        >
          <CheckCheck className="h-3.5 w-3.5" />
          Mark all read
        </button>
      </div>

      <div className="max-h-[24rem] overflow-y-auto">
        {notificationLoading ? (
          <div className="px-4 py-8 text-center text-sm text-gray-500">Loading notifications...</div>
        ) : notifications.length === 0 ? (
          <div className="px-4 py-8 text-center text-sm text-gray-500">No notifications yet.</div>
        ) : (
          notifications.map((notification) => (
            <button
              key={notification._id}
              type="button"
              onClick={() => handleNotificationClick(notification)}
              className={`w-full border-b border-blue-50 px-4 py-3 text-left transition hover:bg-blue-50/60 ${
                notification.readAt ? "bg-white" : "bg-blue-50/40"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <span
                  className={`inline-flex rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${notificationTypeStyle(
                    notification.type
                  )}`}
                >
                  {notification.type.replaceAll("_", " ")}
                </span>
                <span className="text-[11px] text-gray-500">{formatNotificationTime(notification.createdAt)}</span>
              </div>
              <p className="mt-2 text-sm font-semibold text-[#0d2e5e]">{notification.title}</p>
              <p className="mt-1 text-xs leading-5 text-[#4f6f98]">{notification.message}</p>
              {notification.ctaPath && (
                <span className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-blue-700">
                  {notification.ctaLabel || "Open"}
                  <ExternalLink className="h-3.5 w-3.5" />
                </span>
              )}
            </button>
          ))
        )}
      </div>
    </div>
  );

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

                <div className="relative" ref={notificationRef}>
                  <button
                    type="button"
                    onClick={openNotifications}
                    className="relative flex h-9 w-9 items-center justify-center rounded-md text-gray-700 transition hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    aria-label="Notifications"
                    aria-expanded={notificationOpen}
                    aria-haspopup="dialog"
                  >
                    <Bell size={18} />
                    {unreadCount > 0 && (
                      <span className="absolute -right-1 -top-1 inline-flex min-h-5 min-w-5 items-center justify-center rounded-full bg-[#00AEDA] px-1 text-[10px] font-bold text-white">
                        {unreadCount > 9 ? "9+" : unreadCount}
                      </span>
                    )}
                  </button>

                  <AnimatePresence>
                    {notificationOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -8, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.98 }}
                        transition={{ duration: 0.16 }}
                        className="absolute right-0 top-11 z-[70]"
                        role="dialog"
                        aria-label="Notification panel"
                      >
                        {notificationPanel}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                
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
              <>
                <button
                  type="button"
                  onClick={openMobileNotifications}
                  className="relative flex h-9 w-9 items-center justify-center rounded-md text-gray-700 transition hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  aria-expanded={mobileNotificationOpen}
                  aria-haspopup="dialog"
                  aria-label="Open notifications"
                >
                  <Bell size={18} />
                  {unreadCount > 0 && (
                    <span className="absolute -right-1 -top-1 inline-flex min-h-5 min-w-5 items-center justify-center rounded-full bg-[#00AEDA] px-1 text-[10px] font-bold text-white">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setMobileNotificationOpen(false);
                    setMobileMenuOpen((prev) => !prev);
                  }}
                  className="flex h-9 w-9 items-center justify-center rounded-md text-gray-700 transition hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  aria-expanded={mobileMenuOpen}
                  aria-haspopup="dialog"
                  aria-label="Open menu"
                >
                  {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
              </>
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
        {mobileNotificationOpen && isAuthenticated && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.16 }}
            className="border-t border-blue-100 bg-white px-3 pb-3 pt-2 lg:hidden"
            role="dialog"
            aria-label="Mobile notification panel"
          >
            <div className="mx-auto max-w-7xl">{notificationPanel}</div>
          </motion.div>
        )}
      </AnimatePresence>

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
                      onClick={() => {
                        setMobileMenuOpen(false);
                        openMobileNotifications();
                      }}
                      className="mt-1 flex w-full items-center justify-between gap-2 rounded-md px-3 py-2 text-left text-sm text-gray-700 transition hover:bg-gray-50 hover:text-blue-600"
                    >
                      <span className="inline-flex items-center gap-2">
                        <Bell size={16} />
                        <span>Notifications</span>
                      </span>
                      {unreadCount > 0 && (
                        <span className="inline-flex min-h-5 min-w-5 items-center justify-center rounded-full bg-[#00AEDA] px-1 text-[10px] font-bold text-white">
                          {unreadCount > 9 ? "9+" : unreadCount}
                        </span>
                      )}
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
