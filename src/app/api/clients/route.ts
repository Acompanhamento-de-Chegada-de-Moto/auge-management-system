import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

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
    let supabaseQuery = supabase.from("motorcycles").select(`
        id,
        chassis,
        model,
        arrival_date,
        arrival_status,
        billing_date,
        seller_name,
        registration_status,
        clients!inner (
          name,
          city
        )
      `);

    if (query) {
      const words = query.trim().split(/\s+/);
      for (const word of words) {
        if (word) {
          supabaseQuery = supabaseQuery.ilike("clients.name", `%${word}%`);
        }
      }
    }

    const { data, error } = await supabaseQuery;
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    interface ClientJoin {
      name: string;
      city: string;
    }

    const formattedData = (data || []).map((item) => {
      const client = item.clients as unknown as ClientJoin;
      return {
        id: item.id,
        chassis: item.chassis || "-",
        model: item.model || "-",
        arrivalDate: item.arrival_date || undefined,
        arrivalStatus: item.arrival_status,
        billingDate: item.billing_date || undefined,
        sellerName: item.seller_name || "-",
        registrationStatus: item.registration_status,
        city: client?.city || "Não informada",
        clientName: maskName(client?.name || "Sem nome"),
      };
    });

    return NextResponse.json(formattedData);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Erro interno";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
