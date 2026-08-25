"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  ShieldCheck,
  LogOut,
  LayoutGrid,
  Layers,
  FolderTree,
  Users as UsersIcon,
  House,
  Boxes,
  HandCoins,
  ShoppingBag,
  FileText,
} from "lucide-react";

const NAV = [
  {
    href: "/admin/dashboard",
    label: "Overview",
    icon: LayoutGrid,
    exact: true,
  },
  {
    href: "/admin/dashboard/inventory",
    label: "Inventory",
    icon: Boxes,
    exact: false,
  },
  {
    href: "/admin/dashboard/categories",
    label: "Listings",
    icon: Layers,
    exact: false,
  },
  {
    href: "/admin/dashboard/homepage",
    label: "Homepage",
    icon: House,
    exact: false,
  },
  {
    href: "/admin/dashboard/users",
    label: "Users",
    icon: UsersIcon,
    exact: false,
  },
  {
    href: "/admin/dashboard/orders",
    label: "Orders",
    icon: ShoppingBag,
    exact: false,
  },
  {
    href: "/admin/dashboard/sell",
    label: "Sell Now",
    icon: HandCoins,
    exact: false,
  },
];

const SELL_TABS = [
  { href: "/admin/dashboard/sell", label: "Leads", icon: HandCoins },
];

const LISTING_TABS = [
  { href: "/admin/dashboard/categories", label: "Categories", icon: Layers },
  {
    href: "/admin/dashboard/subcategories",
    label: "Subcategories",
    icon: FolderTree,
  },
  {
    href: "/admin/dashboard/product-types",
    label: "Product types",
    icon: FolderTree,
  },
  { href: "/admin/dashboard/products", label: "Used items", icon: Layers },
  {
    href: "/admin/dashboard/content-library",
    label: "Content library",
    icon: FileText,
  },
];

const HOMEPAGE_TABS = [
  { href: "/admin/dashboard/homepage", label: "Hero carousel", icon: House },
];

export function AdminShell({
  email,
  children,
}: {
  email: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const activeListing = LISTING_TABS.some((tab) =>
    pathname.startsWith(tab.href),
  );
  const activeHomepage = pathname.startsWith("/admin/dashboard/homepage");
  const activeSell = pathname.startsWith("/admin/dashboard/sell");

  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="min-h-dvh bg-muted/30">
      <header className="sticky top-0 z-30 border-b border-border bg-background/85 backdrop-blur-lg">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3">
          <Link href="/" className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-brand text-primary-foreground shadow-glow">
              <ShieldCheck className="h-4 w-4" />
            </span>
            <span>
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                Hulumart
              </p>
              <p className="-mt-0.5 text-sm font-bold">Admin Console</p>
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <span className="hidden text-xs text-muted-foreground sm:block">
              {email}
            </span>
            <button
              onClick={signOut}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-semibold"
            >
              <LogOut className="h-3.5 w-3.5" /> Sign out
            </button>
          </div>
        </div>
        <nav className="no-scrollbar mx-auto flex max-w-7xl gap-1 overflow-x-auto px-3 pb-2">
          {NAV.map((n) => {
            const Icon = n.icon;
            const active =
              n.label === "Listings"
                ? activeListing
                : n.label === "Homepage"
                  ? activeHomepage
                  : n.label === "Sell Now"
                    ? activeSell
                    : n.exact
                      ? pathname === n.href
                      : pathname.startsWith(n.href);
            return (
              <Link
                key={n.href}
                href={n.href}
                className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                  active
                    ? "bg-gradient-brand text-primary-foreground shadow-glow"
                    : "border border-border bg-card"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {n.label}
              </Link>
            );
          })}
        </nav>
        {(activeListing || activeHomepage || activeSell) && (
          <nav
            aria-label={
              activeListing ? "Listing sections" : "Homepage sections"
            }
            className="border-t border-border/70 bg-muted/30"
          >
            <div className="no-scrollbar mx-auto flex max-w-7xl gap-2 overflow-x-auto px-4 py-2">
              {(activeListing
                ? LISTING_TABS
                : activeSell
                  ? SELL_TABS
                  : HOMEPAGE_TABS
              ).map((tab) => {
                const active = pathname.startsWith(tab.href);
                const Icon = tab.icon;
                return (
                  <Link
                    key={tab.href}
                    href={tab.href}
                    className={`inline-flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition ${active ? "bg-card text-primary shadow-sm ring-1 ring-border" : "text-muted-foreground hover:bg-card/70 hover:text-primary"}`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {tab.label}
                  </Link>
                );
              })}
            </div>
          </nav>
        )}
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6">{children}</main>
    </div>
  );
}
