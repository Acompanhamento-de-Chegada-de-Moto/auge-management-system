"use client";

import {
  Badge,
  ClipboardCheck,
  FileText,
  LogOut,
  MapPin,
  Plus,
  Truck,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";
import CreateClientForm from "@/components/CreateClientForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/lib/supabase/cliente";

export type MotorcycleArrival = {
  id: string;
  chassis: string;
  model: string;
  arrivalDate: string;
  clientId: string | null;
  createdAt: string;
  updatedAt: string;
};

export type RegistrationStatus =
  | "Pendente"
  | "Em_Emplacamento"
  | "Emplacado"
  | "Entregue";

export type Client = {
  id: string;
  name: string;
  salesperson: string;
  registration_status: RegistrationStatus;
  billing_date: string;
  created_at: string;
  city?: string | null;
  motorcycle_arrival?: MotorcycleArrival[] | MotorcycleArrival | null;
};

const BdcPage = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Buscando clientes e os dados da moto vinculada
        const { data, error } = await supabase
          .from("client")
          .select(
            `
            *,
            motorcycle_arrival (*)
          `,
          )
          .order("createdAt", { ascending: false });

        console.log(data);

        if (error) throw error;
        setClients(data || []);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      }
    };
    fetchData();
  }, []);

  const handleShowModal = () => setIsModalOpen((prev) => !prev);

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 flex flex-col gap-5">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h2 className="text-xl font-semibold text-foreground">
              Painel BDC - Clientes
            </h2>
            <p className="text-sm text-muted-foreground">
              Gerencie o status de emplacamento e entrega.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" onClick={handleShowModal}>
              <Plus className="size-4 mr-1" /> Novo Cliente
            </Button>
          </div>
        </div>

        <CreateClientForm
          isOpen={isModalOpen}
          onOpenChange={setIsModalOpen}
          onSubmit={handleShowModal}
        />
      </div>
    </div>
  );
};

export default BdcPage;
