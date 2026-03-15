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
  chassis: string;
  seller_name: string;
  billingDate: string;
}

export interface UpdateClientPayload {
  name: string;
  city: string;
}

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

export async function createClient(
  payload: CreateClientPayload,
): Promise<Client> {
  const { data, error } = await supabase
    .from("clients")
    .insert([
      { name: payload.name, city: payload.city, chassis: payload.chassis },
    ])
    .select()
    .single();

  if (error) throw error;

  return data;
}

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

export async function deleteClient(id: string): Promise<void> {
  const { error } = await supabase
    .from("clients")
    .delete()
    .eq("id", id)
    .select();

  if (error) throw error;
}
