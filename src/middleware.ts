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

  // 🔓 1. ROTAS PÚBLICAS
  const isPublicRoute =
    pathname === "/" ||
    pathname.includes("/sign-in") ||
    pathname.startsWith("/_next") ||
    pathname.includes("/api/auth");

  if (isPublicRoute) {
    return response;
  }

  // ❌ 2. PROTEÇÃO: NÃO LOGADO
  if (!user) {
    if (pathname.startsWith("/logistics")) {
      return NextResponse.redirect(new URL("/logistics/sign-in", request.url));
    }
    if (pathname.startsWith("/bdc")) {
      return NextResponse.redirect(new URL("/bdc/sign-in", request.url));
    }
    return NextResponse.redirect(new URL("/", request.url));
  }

  // 🔐 3. BUSCA DE ROLE
  const { data: userData } = await supabase
    .from("user")
    .select("role")
    .eq("id", user.id)
    .single();

  const role = userData?.role;

  // 🔄 4. REDIRECIONAMENTO CRUZADO (A mágica está aqui)

  // Se o cara é LOGISTICS e tenta entrar no BDC -> Manda pra LOGISTICS
  if (pathname.startsWith("/bdc") && role === "LOGISTICS") {
    return NextResponse.redirect(new URL("/logistics", request.url));
  }

  // Se o cara é BDC e tenta entrar no LOGISTICS -> Manda pra BDC
  if (pathname.startsWith("/logistics") && role === "BDC") {
    return NextResponse.redirect(new URL("/bdc", request.url));
  }

  // 🛡️ 5. PROTEÇÃO GERAL (Caso o role seja nulo ou diferente dos dois acima)
  if (pathname.startsWith("/logistics") && role !== "LOGISTICS") {
    return NextResponse.redirect(new URL("/", request.url));
  }
  if (pathname.startsWith("/bdc") && role !== "BDC") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
