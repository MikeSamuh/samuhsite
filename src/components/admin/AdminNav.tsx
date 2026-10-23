"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ADMIN_API, ADMIN_BASE } from "@/lib/admin/paths";

const TABS = [
  { href: `${ADMIN_BASE}/content`, name: "Content", note: "Every page's words" },
  { href: `${ADMIN_BASE}/blog`, name: "Blog", note: "Insights posts" },
  { href: `${ADMIN_BASE}/brand`, name: "Brand", note: "The style guide" },
  { href: `${ADMIN_BASE}/analytics`, name: "Analytics", note: "GA4 and Vercel" },
  { href: `${ADMIN_BASE}/launch`, name: "Launch", note: "Go-live checklist" },
];

export function AdminNav({ email }: { email: string }) {
  const path = usePathname();
  return (
    <aside className="adm-side">
      <div className="adm-side-brand">
        <Image src="/samuh-icon.png" alt="" width={182} height={240} className="adm-side-mark" />
        <span>
          <span className="adm-side-title">SAMUH</span>
          <span className="adm-side-sub">Admin</span>
        </span>
      </div>
      <nav className="adm-nav" aria-label="Admin sections">
        {TABS.map((t) => {
          const on = path === t.href || path.startsWith(`${t.href}/`);
          return (
            <Link key={t.href} href={t.href} className="adm-nav-link" aria-current={on ? "page" : undefined}>
              <span className="adm-nav-name">{t.name}</span>
              <span className="adm-nav-note">{t.note}</span>
            </Link>
          );
        })}
      </nav>
      <div className="adm-side-foot">
        <a className="adm-side-site" href="/" target="_blank" rel="noopener noreferrer">View site &rarr;</a>
        <span className="adm-side-user" title={email}>{email}</span>
        <form action={`${ADMIN_API}/logout`} method="post">
          <button type="submit" className="adm-btn adm-btn-small adm-btn-ghost">Sign out</button>
        </form>
      </div>
    </aside>
  );
}
