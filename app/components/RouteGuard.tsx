'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch, authStorage, refreshAccessToken, UserRole } from '@/lib/api-client';

type Props = {
  children: React.ReactNode;
  roles?: UserRole[];
};

type ProfileResponse = {
  data?: {
    user?: {
      role?: UserRole;
    };
  };
};

function resolveRolePath(role?: UserRole) {
  if (role === 'jobseeker') return '/dashboard/jobseeker';
  if (role === 'employer') return '/dashboard/employee/jobs';
  if (role === 'admin') return '/dashboard/admin';
  return '/login';
}

export default function RouteGuard({ children, roles }: Props) {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let mounted = true;

    const check = async () => {
      try {
        let token = authStorage.getAccessToken();
        if (!token) {
          token = await refreshAccessToken();
        }

        if (!token) {
          router.replace('/login');
          return;
        }

        let user = authStorage.getUser<{ role?: UserRole }>();
        if (!user?.role) {
          const profile = await apiFetch<ProfileResponse>('/api/auth/profile');
          user = profile?.data?.user || null;
          if (user) {
            authStorage.setUser(user);
          }
        }

        if (roles && roles.length > 0 && user?.role && !roles.includes(user.role)) {
          router.replace(resolveRolePath(user.role));
          return;
        }

        if (mounted) setReady(true);
      } catch {
        authStorage.clearAll();
        router.replace('/login');
      }
    };

    check();

    return () => {
      mounted = false;
    };
  }, [roles, router]);

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-700">Loading...</p>
      </div>
    );
  }

  return <>{children}</>;
}
