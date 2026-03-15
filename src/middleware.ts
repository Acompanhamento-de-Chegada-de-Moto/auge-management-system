import { type NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function middleware(request: NextRequest) {
  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  const pathname = request.nextUrl.pathname;

  if (pathname.startsWith("/_next") || pathname.includes("/api/auth")) {
    return response;
  }

  if (user) {
    const { data: userData } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single();
    const role = userData?.role;

    if (pathname.includes("/sign-in")) {
      if (role === "logistics")
        return NextResponse.redirect(new URL("/logistics", request.url));
      if (role === "bdc")
        return NextResponse.redirect(new URL("/bdc", request.url));
    }

    if (pathname.startsWith("/bdc") && role === "logistics") {
      return NextResponse.redirect(new URL("/logistics", request.url));
    }

    if (pathname.startsWith("/logistics") && role === "bdc") {
      return NextResponse.redirect(new URL("/bdc", request.url));
    }

    return response;
  }

  const isPublicPage = pathname === "/" || pathname.includes("/sign-in");

  if (!isPublicPage) {
    if (pathname.startsWith("/logistics")) {
      return NextResponse.redirect(new URL("/logistics/sign-in", request.url));
    }
    if (pathname.startsWith("/bdc")) {
      return NextResponse.redirect(new URL("/bdc/sign-in", request.url));
    }
    return NextResponse.redirect(new URL("/", request.url));
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
