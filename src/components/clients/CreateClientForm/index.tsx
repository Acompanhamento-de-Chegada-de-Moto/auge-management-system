import { useState } from "react";
import { notify } from "@/lib/toast";
import { createClient } from "@/services/clientService";
import {
  createMotorcycle,
  getMotorcycleByChassis,
  linkMotorcycleToClient,
  type Motorcycle,
} from "@/services/motorcycleService";
import CreateClientFormUI, {
  type Form,
  type SituacaoEmplacamento,
} from "./CreateClientFormUI";

interface CreateClientFormProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const initialForm: Form = {
  name: "",
  city: "",
  seller_name: "",
  model: "",
  billing_date: "",
  registration_status: "pendente",
  registration_exit_date: "",
  chassis: "",
};

const CreateClientForm = ({ isOpen, onOpenChange }: CreateClientFormProps) => {
  const [chassisQuery, setChassisQuery] = useState("");
  const [fetchedMotorcycle, setFetchedMotorcycle] = useState<Motorcycle | null>(
    null,
  );
  const [notFoundMotorcycle, setNotFoundMotorcycle] = useState(false);
  const [form, setForm] = useState<Form>(initialForm);
  const [isLoadingMotorcycle, setIsLoadingMotorcycle] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = (field: keyof Form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSearchMotorcycle = async () => {
    const chassisRegex = /^[A-HJ-NPR-Z0-9]{17}$/;

    if (!chassisQuery.trim()) {
      notify.warning("Digite um número de chassi.");
      return;
    }

    if (!chassisRegex.test(chassisQuery.toUpperCase())) {
      notify.warning("Digite um chassi válido.");
      return;
    }

    try {
      setIsLoadingMotorcycle(true);
      setNotFoundMotorcycle(false);
      setFetchedMotorcycle(null);

      const motorcycle = await getMotorcycleByChassis(
        chassisQuery.toUpperCase(),
      );

      if (!motorcycle) {
        setNotFoundMotorcycle(true);
        notify.info("Moto não encontrada para este chassi.");
        return;
      }

      setFetchedMotorcycle(motorcycle);
      // Pre-fill seller and billing date from the motorcycle record when found
      setForm((prev) => ({
        ...prev,
        seller_name: motorcycle.seller_name || "",
        billing_date: motorcycle.billing_date
          ? motorcycle.billing_date.split("T")[0]
          : "",
        chassis: motorcycle.chassis,
      }));
      notify.success("Moto encontrada com sucesso!");
    } catch {
      notify.error("Erro ao buscar a moto. Tente novamente.");
    } finally {
      setIsLoadingMotorcycle(false);
    }
  };

  const handleSubmit = async () => {
    if (!form.name || !form.city) {
      notify.warning("Preencha o nome e a cidade do cliente.");
      return;
    }

    if (notFoundMotorcycle && !form.model) {
      notify.warning("Informe o modelo da moto.");
      return;
    }

    try {
      setIsSubmitting(true);

      // 1. Create the client
      const newClient = await createClient({
        name: form.name,
        city: form.city,
        chassis: form.chassis,
        billingDate: form.billing_date,
        seller_name: form.seller_name,
      });

      if (fetchedMotorcycle) {
        // 2a. Motorcycle already exists in logistics — link it and update fields
        const arrivedStatus = hasArrived(fetchedMotorcycle.arrival_date)
          ? "ARRIVED"
          : (fetchedMotorcycle.arrival_status ?? "WAITING");

        await linkMotorcycleToClient(fetchedMotorcycle.id, {
          client_id: newClient.id,
          seller_name: form.seller_name || null,
          billing_date: form.billing_date || null,
          registration_status: mapRegistrationStatus(form.registration_status),
          arrival_status: arrivedStatus,
        });
      } else {
        // 2b. Motorcycle not in logistics yet — create a new record
        await createMotorcycle({
          client_id: newClient.id,
          chassis: chassisQuery.toUpperCase(),
          model: form.model,
          seller_name: form.seller_name || null,
          billing_date: form.billing_date || null,
          arrival_status: "WAITING",
          registration_status: mapRegistrationStatus(form.registration_status),
        });
      }

      notify.success("Cliente cadastrado e vinculado com sucesso!");
      handleClose();
    } catch (error) {
      notify.error(
        `Erro ao salvar: ${error instanceof Error ? error.message : "Desconhecido"}`,
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setChassisQuery("");
    setFetchedMotorcycle(null);
    setNotFoundMotorcycle(false);
    setForm(initialForm);
    onOpenChange(false);
  };

  return (
    <CreateClientFormUI
      isOpen={isOpen}
      handleClose={handleClose}
      chassisQuery={chassisQuery}
      setChassisQuery={setChassisQuery}
      handleSearchMotorcycle={handleSearchMotorcycle}
      isLoadingMotorcycle={isLoadingMotorcycle}
      notFoundMotorcycle={notFoundMotorcycle}
      fetchedMotorcycle={fetchedMotorcycle}
      form={form}
      updateField={updateField}
      handleSubmit={handleSubmit}
      isSubmitting={isSubmitting}
    />
  );
};

function mapRegistrationStatus(status: SituacaoEmplacamento): string {
  switch (status) {
    case "emplacado":
    case "entregue":
      return "REGISTERED";
    default:
      return "PENDING";
  }
}

/**
 * Returns true if arrival_date is today or in the past.
 */
function hasArrived(arrival_date: string | null): boolean {
  if (!arrival_date) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const arrival = new Date(arrival_date);
  arrival.setHours(0, 0, 0, 0);
  return arrival <= today;
}

export default CreateClientForm;
