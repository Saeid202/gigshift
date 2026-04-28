import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  // Get role from user metadata
  const role = user?.user_metadata?.role as string | undefined;

  const path = request.nextUrl.pathname;

  // Redirect old auth pages to home (auth is now modal-based)
  const authPages = ["/employer/login", "/employer/signup", "/worker/login", "/worker/signup"];
  if (authPages.includes(path)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Protect employer dashboard — must be logged in as employer
  if (path.startsWith("/employer/dashboard")) {
    if (!user) return NextResponse.redirect(new URL("/", request.url));
    if (role !== "employer") return NextResponse.redirect(new URL("/worker/dashboard", request.url));
  }

  // Protect worker dashboard — must be logged in as worker
  if (path.startsWith("/worker/dashboard")) {
    if (!user) return NextResponse.redirect(new URL("/", request.url));
    if (role !== "worker") return NextResponse.redirect(new URL("/employer/dashboard", request.url));
  }

  // Redirect already logged-in employer away from employer auth pages
  if (user && role === "employer" && (path === "/employer/login" || path === "/employer/signup")) {
    return NextResponse.redirect(new URL("/employer/dashboard", request.url));
  }

  // Redirect already logged-in worker away from worker auth pages
  if (user && role === "worker" && (path === "/worker/login" || path === "/worker/signup")) {
    return NextResponse.redirect(new URL("/worker/dashboard", request.url));
  }

  return supabaseResponse;
}

export const config = {
  matcher: ["/employer/:path*", "/worker/:path*"],
};
