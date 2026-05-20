"use client";

import Link from "next/link";
import { adminBtnSecondary } from "@/components/admin/AdminShell";

export default function AdminHeader({ title }: { title: string }) {
  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST", credentials: "include" });
    window.location.href = "/admin/login";
  };

  return (
    <header className="mb-10 flex flex-wrap items-end justify-between gap-6 border-b border-black pb-8">
      <div>
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-black/50">
          Omnia blog
        </p>
        <h1 className="mt-1 font-mono text-2xl tracking-tight text-black md:text-3xl">
          {title}
        </h1>
      </div>
      <nav className="flex flex-wrap items-center gap-3">
        <Link href="/admin" className={adminBtnSecondary}>
          Posts
        </Link>
        <Link href="/blog" className={adminBtnSecondary} target="_blank">
          View blog
        </Link>
        <button type="button" onClick={logout} className={adminBtnSecondary}>
          Log out
        </button>
      </nav>
    </header>
  );
}
