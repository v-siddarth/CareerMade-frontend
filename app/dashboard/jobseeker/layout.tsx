'use client';

import RouteGuard from '@/app/components/RouteGuard';

export default function JobSeekerLayout({ children }: { children: React.ReactNode }) {
  return <RouteGuard roles={['jobseeker']}>{children}</RouteGuard>;
}
