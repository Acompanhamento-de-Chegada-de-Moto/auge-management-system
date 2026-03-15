import { supabase } from "@/lib/supabase/cliente";

export interface Motorcycle {
  id: string;
  chassis: string;
  model: string | null;
  arrival_date: string | null;
  arrival_status: "WAITING" | "ARRIVED" | "DELIVERED" | null;
  billing_date: string | null;
  seller_name: string | null;
  client_id: string | null;
  registration_status: "PENDING" | "REGISTERED" | "CANCELED" | null;
  created_at: string | null;
}

export interface MotorcycleInsertPayload {
  chassis: string;
  model: string | null;
  arrival_date: string;
}

export interface LinkMotorcyclePayload {
  client_id: string;
  seller_name: string | null;
  billing_date: string | null;
  registration_status: string;
  arrival_status: string;
}

export interface CreateLinkedMotorcyclePayload {
  client_id: string;
  chassis: string;
  model: string;
  seller_name: string | null;
  billing_date: string | null;
  arrival_status: string;
  registration_status: string;
}

export interface UpdateMotorcyclePayload {
  seller_name: string;
  arrival_date: string | null;
}

// -------------------------------------------------------------------
// GET
// -------------------------------------------------------------------

export async function getMotorcyclesPaginated(
  page: number,
  pageSize: number,
): Promise<{ data: Motorcycle[]; count: number }> {
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data, error, count } = await supabase
    .from("motorcycles")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) throw error;

  return { data: (data as Motorcycle[]) ?? [], count: count ?? 0 };
}

export async function getMotorcycleByChassis(
  chassis: string,
): Promise<Motorcycle | null> {
  const { data, error } = await supabase
    .from("motorcycles")
    .select("*")
    .eq("chassis", chassis)
    .maybeSingle();

  if (error) throw error;

  return data;
}

// -------------------------------------------------------------------
// CREATE
// -------------------------------------------------------------------

export async function insertMotorcycles(
  rows: MotorcycleInsertPayload[],
): Promise<void> {
  const { error } = await supabase
    .from("motorcycles")
    .upsert(rows, { ignoreDuplicates: true });

  if (error) throw error;
}

export async function createMotorcycle(
  payload: CreateLinkedMotorcyclePayload,
): Promise<void> {
  const { error } = await supabase
    .from("motorcycles")
    .insert([payload]);

  if (error) throw error;
}

export async function createMotorcycleArrival(payload: {
  chassis: string;
  model: string;
  arrivalDate: string;
}): Promise<void> {
  const { error } = await supabase
    .from("motorcycles")
    .insert([
      {
        chassis: payload.chassis,
        model: payload.model,
        arrivalDate: payload.arrivalDate,
      },
    ])
    .select();

  if (error) throw error;
}

// -------------------------------------------------------------------
// UPDATE
// -------------------------------------------------------------------

export async function linkMotorcycleToClient(
  motorcycleId: string,
  payload: LinkMotorcyclePayload,
): Promise<void> {
  const { error } = await supabase
    .from("motorcycles")
    .update(payload)
    .eq("id", motorcycleId);

  if (error) throw error;
}

export async function updateMotorcycle(
  motorcycleId: string,
  payload: UpdateMotorcyclePayload,
): Promise<void> {
  const { error } = await supabase
    .from("motorcycles")
    .update(payload)
    .eq("id", motorcycleId);

  if (error) throw error;
}
