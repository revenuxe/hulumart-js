import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

// Real, server-side admin gating — this is the point of the migration for
// /admin/**. The old app only checked `has_role` client-side after mount
// (see docs/nextjs-migration-plan.md §7), so the admin bundle briefly
// shipped to anyone. Here, no session or no admin role means a redirect
// before any admin HTML/JS is ever sent.
export async function proxy(request: NextRequest) {
  const { supabaseResponse, supabase, user } = await updateSession(request);

  const { pathname } = request.nextUrl;
  const isAdminRoute = pathname.startsWith("/admin") && pathname !== "/admin/login";

  if (isAdminRoute) {
    if (!user) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    const { data: isAdmin } = await supabase.rpc("has_role", {
      _user_id: user.id,
      _role: "admin",
    });

    if (!isAdmin) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    // Forward the already-validated user's email via a request header so
    // admin/dashboard/layout.tsx doesn't need a second getUser() round
    // trip just to display it — this request already paid for one.
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-admin-email", user.email ?? "");
    const response = NextResponse.next({ request: { headers: requestHeaders } });
    supabaseResponse.cookies.getAll().forEach((cookie) => response.cookies.set(cookie));
    return response;
  }

  return supabaseResponse;
}

export const config = {
  // An explicit allowlist of routes that actually read the session
  // server-side, rather than a denylist of what to skip. Every match here
  // costs a Supabase round-trip before the page even starts rendering —
  // with Supabase hosted in the US and most users in India, that's real,
  // felt latency, so routes with no server-side auth dependency (/, the
  // marketing and catalogue pages are deliberately left out.
  matcher: ["/admin/:path*", "/profile/:path*", "/auth/:path*"],
};
