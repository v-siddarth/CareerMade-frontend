'use client';

import RouteGuard from '@/app/components/RouteGuard';

export default function EmployerLayout({ children }: { children: React.ReactNode }) {
  return <RouteGuard roles={['employer']}>{children}</RouteGuard>;
}
