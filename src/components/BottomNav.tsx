"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, LayoutGrid, ShoppingBag, User } from "lucide-react";

const ITEMS = [
  { to: "/", label: "Home", Icon: Home, exact: true },
  { to: "/categories", label: "Categories", Icon: LayoutGrid, exact: false },
  { to: "/cart", label: "Cart", Icon: ShoppingBag, exact: false },
  { to: "/profile", label: "Profile", Icon: User, exact: false },
] as const;

export function BottomNav() {
  const pathname = usePathname();
  // The bottom navigation is also rendered during the initial client render.
  // Treat an unresolved pathname as the homepage so Home does not flash as
  // inactive before Next finishes hydrating the current route.
  const activePathname = pathname || "/";

  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-40 pb-[max(0.75rem,env(safe-area-inset-bottom))] md:hidden"
    >
      <div className="mx-auto max-w-md px-4">
        <div className="flex items-center justify-between gap-1 rounded-full border border-[#e1e8f0] bg-white px-2 py-2 shadow-elevated">
          {ITEMS.map(({ to, label, Icon, exact }) => {
            const active = exact ? activePathname === to : activePathname.startsWith(to);
            return (
              <Link
                key={to}
                href={to}
                className={`group flex flex-1 flex-col items-center gap-1 px-1 py-1 text-[11px] font-semibold ${
                  active ? "text-primary" : "text-muted-foreground"
                }`}
              >
                <span
                  className={`relative grid h-10 w-10 place-items-center rounded-full transition-all ${
                    active ? "bg-[#06295f] text-white shadow-glow" : ""
                  }`}
                >
                  <Icon className="h-[18px] w-[18px]" strokeWidth={2.2} />
                </span>
                <span className="leading-none">{label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
