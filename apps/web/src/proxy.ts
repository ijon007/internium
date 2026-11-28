import { clerkMiddleware } from "@clerk/nextjs/server";
import { api } from "@internium/backend/convex/_generated/api";
import { fetchQuery } from "convex/nextjs";
import type { FunctionReturnType } from "convex/server";
import { type NextRequest, NextResponse } from "next/server";
import { canSwitchDashboardRoles, ROLES } from "@/constants/roles";

function isDashboard(pathname: string) {
  return (
    pathname === "/dashboard" ||
    pathname.startsWith("/dashboard/") ||
    pathname === "/role"
  );
}

function isProtected(pathname: string) {
  return isDashboard(pathname) || pathname === "/access";
}
const clerkConfigured = Boolean(
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && process.env.CLERK_SECRET_KEY,
);
const signInUrl = "/sign-in";

function unavailable() {
  return new NextResponse("Account access is temporarily unavailable.", {
    status: 503,
  });
}

export default clerkConfigured
  ? clerkMiddleware(
      async (auth, request) => {
        const { pathname } = request.nextUrl;
        const authPage = pathname === "/sign-in" || pathname === "/sign-up";
        if (!isProtected(pathname) && !authPage) return;
        const session = await auth();
        if (!session.userId) {
          if (isProtected(pathname)) return session.redirectToSignIn();
          return;
        }
        if (authPage)
          return NextResponse.redirect(new URL("/dashboard", request.url));
        const url = process.env.NEXT_PUBLIC_CONVEX_URL;
        if (!url) return unavailable();
        if (!isDashboard(pathname)) return;
        let user: FunctionReturnType<typeof api.users.current>;
        try {
          const token = await session.getToken({ template: "convex" });
          if (!token) return unavailable();
          user = await fetchQuery(api.users.current, {}, { token, url });
        } catch {
          return unavailable();
        }

        if (user?.status === "inactive")
          return new NextResponse("Account inactive.", { status: 403 });
        if (!user?.role) {
          const access = new URL("/access", request.url);
          if (pathname.startsWith("/dashboard/")) {
            access.searchParams.set("next", pathname + request.nextUrl.search);
          }
          return NextResponse.redirect(access);
        }

        const segment = pathname.split("/")[2];
        if (
          !canSwitchDashboardRoles(user.email) &&
          (pathname === "/role" ||
            pathname === "/dashboard" ||
            ROLES.some((role) => role === segment && role !== user.role))
        ) {
          return NextResponse.redirect(
            new URL(`/dashboard/${user.role}`, request.url),
          );
        }
      },
      { signInUrl },
    )
  : (request: NextRequest) =>
      isProtected(request.nextUrl.pathname)
        ? unavailable()
        : NextResponse.next();

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
