"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Menu, Store, Tag } from "lucide-react";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";
import { CONTACT } from "@/lib/site";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
export function BottomNav() {
  const pathname = usePathname() || "/";
  const navLink = (to: string, label: string, Icon: typeof Home) => {
    const active =
      to === "/"
        ? pathname === "/"
        : to === "/store"
          ? [
              "/store",
              "/categories",
              "/featured",
              "/trending",
              "/cart",
              "/checkout",
            ].some(
              (route) => pathname === route || pathname.startsWith(`${route}/`),
            )
          : pathname === to;
    return (
      <Link
        href={to}
        aria-current={active ? "page" : undefined}
        className={`flex min-h-16 flex-col items-center justify-center gap-1.5 text-xs font-semibold ${active ? "text-primary" : "text-muted-foreground"}`}
      >
        <Icon size={23} strokeWidth={1.8} />
        <span>{label}</span>
      </Link>
    );
  };
  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background pb-[env(safe-area-inset-bottom)] md:hidden"
    >
      <div className="mx-auto grid h-[78px] max-w-xl grid-cols-5 items-center">
        {navLink("/", "Home", Home)}
        {navLink("/sell", "Sell items", Tag)}
        <a
          href={CONTACT.whatsappHref}
          aria-label="Chat on WhatsApp"
          className="relative flex h-full flex-col items-center justify-end gap-1 pb-3 text-xs font-semibold text-primary"
        >
          <span className="absolute -top-6 grid h-[68px] w-[68px] place-items-center rounded-full border-[5px] border-background bg-accent">
            <WhatsAppIcon className="h-9 w-9 text-white" />
          </span>
          <span>WhatsApp</span>
        </a>
        {navLink("/store", "Store", Store)}
        <Sheet>
          <SheetTrigger className="flex min-h-16 flex-col items-center justify-center gap-1.5 text-xs font-semibold text-muted-foreground">
            <Menu size={23} strokeWidth={1.8} />
            Menu
          </SheetTrigger>
          <SheetContent
            side="bottom"
            className="rounded-t-3xl p-6 pb-[max(1.5rem,env(safe-area-inset-bottom))]"
          >
            <SheetTitle>Explore Hulumart</SheetTitle>
            <SheetDescription>
              Buy and sell pre-loved items in Bangalore.
            </SheetDescription>
            <div className="grid grid-cols-2 gap-3">
              {[
                ["/sell", "Sell an item"],
                ["/store", "Store"],
                ["/categories", "All categories"],
                ["/cart", "Cart"],
                ["/profile", "My account"],
                [CONTACT.whatsappHref, "WhatsApp us"],
              ].map(([href, label]) => (
                <SheetClose asChild key={href}>
                  <Link
                    href={href}
                    className="rounded-xl border border-border p-4 text-sm font-semibold"
                  >
                    {label}
                  </Link>
                </SheetClose>
              ))}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
}
