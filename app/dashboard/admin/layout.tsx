'use client';

import RouteGuard from '@/app/components/RouteGuard';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <RouteGuard roles={['admin']}>{children}</RouteGuard>;
}
