import Navbar from "@/app/components/Navbar";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

type FooterPageShellProps = {
  eyebrow: string;
  title: string;
  description: string;
  icon: LucideIcon;
  updated?: string;
  children: ReactNode;
};

export default function FooterPageShell({
  eyebrow,
  title,
  description,
  icon: Icon,
  updated,
  children,
}: FooterPageShellProps) {
  return (
    <>
      <Navbar />
      <main className="min-h-screen overflow-hidden bg-slate-50">
        <section className="relative border-b border-blue-100 bg-gradient-to-br from-blue-50 via-white to-cyan-50">
          <div className="absolute -left-28 top-0 h-72 w-72 rounded-full bg-blue-200/30 blur-3xl" />
          <div className="absolute -right-28 bottom-0 h-72 w-72 rounded-full bg-cyan-200/35 blur-3xl" />
          <div className="relative mx-auto max-w-5xl px-4 py-16 text-center sm:px-6 lg:px-8 lg:py-20">
            <span className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white/80 px-3 py-1.5 text-sm font-semibold text-blue-700 shadow-sm">
              <Icon className="h-4 w-4" aria-hidden="true" />
              {eyebrow}
            </span>
            <h1 className="mt-5 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
              {title}
            </h1>
            <p className="mx-auto mt-4 max-w-3xl text-base leading-7 text-slate-600 sm:text-lg">
              {description}
            </p>
            {updated && (
              <p className="mt-5 text-sm font-medium text-slate-500">Last updated: {updated}</p>
            )}
          </div>
        </section>
        <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          {children}
        </section>
      </main>
    </>
  );
}
