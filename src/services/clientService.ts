import { supabase } from "@/lib/supabase/cliente";

export interface Client {
  id: string;
  name: string;
  city: string;
  created_at: string;
  motorcycles?: {
    id: string;
    model: string;
    chassis: string;
    seller_name: string;
    arrival_date: string | null;
  }[];
}

export interface CreateClientPayload {
  name: string;
  city: string;
}

export interface UpdateClientPayload {
  name: string;
  city: string;
}

// -------------------------------------------------------------------
// GET
// -------------------------------------------------------------------

export async function getClientsWithMotorcycles(): Promise<Client[]> {
  const { data, error } = await supabase
    .from("clients")
    .select(
      `
      *,
      motorcycles (*)
    `,
    )
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data ?? [];
}

// -------------------------------------------------------------------
// CREATE
// -------------------------------------------------------------------

export async function createClient(payload: CreateClientPayload): Promise<Client> {
  const { data, error } = await supabase
    .from("clients")
    .insert([{ name: payload.name, city: payload.city }])
    .select()
    .single();

  if (error) throw error;

  return data;
}

// -------------------------------------------------------------------
// UPDATE
// -------------------------------------------------------------------

export async function updateClient(
  id: string,
  payload: UpdateClientPayload,
): Promise<void> {
  const { error } = await supabase
    .from("clients")
    .update({ name: payload.name, city: payload.city })
    .eq("id", id);

  if (error) throw error;
}

// -------------------------------------------------------------------
// DELETE
// -------------------------------------------------------------------

export async function deleteClient(id: string): Promise<void> {
  const { error } = await supabase
    .from("clients")
    .delete()
    .eq("id", id)
    .select();

  if (error) throw error;
}
