import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createSupabaseServerClient();

  try {
    const motorcycles = supabase.from("motorcycle_arrival").select("*");

    console.log(motorcycles);

    return NextResponse.json(motorcycles);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Erro ao buscar motos" },
      { status: 500 },
    );
  }
}
