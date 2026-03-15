import { createSupabaseServerClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

function maskName(name: string): string {
  if (!name) return "";
  const parts = name.trim().split(/\s+/);
  if (parts.length <= 2) return name;
  return `${parts[0]} **** ${parts[parts.length - 1]}`;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query") || "";

  try {
    const supabase = await createSupabaseServerClient();
    let supabaseQuery = supabase
      .from("clients_view_public")
      .select("*");

    if (query) {
      const words = query.trim().split(/\s+/);
      for (const word of words) {
        if (word) {
          supabaseQuery = supabaseQuery.ilike("name", `%${word}%`);
        }
      }
    }

    const { data, error } = await supabaseQuery;
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const maskedData = (data || []).map((client: any) => ({
      ...client,
      client_name: maskName(client.name),
      name: 'Olha aqui não man, ta mascarado'
    }));

    return NextResponse.json(maskedData);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}