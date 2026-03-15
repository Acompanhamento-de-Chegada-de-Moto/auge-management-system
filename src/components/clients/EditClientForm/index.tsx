import { useEffect, useState } from "react";
import { notify } from "@/lib/toast";
import { updateClient } from "@/services/clientService";
import { updateMotorcycle } from "@/services/motorcycleService";
import EditClientFormUI, { type Form } from "./EditClientFormUI";

interface Client {
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

interface EditClientFormProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  client: Client | null;
  onSuccess: () => void;
}

const initialForm: Form = {
  arrival_date: "",
  seller_name: "",
  name: "",
  city: "",
};

const EditClientForm = ({
  isOpen,
  onOpenChange,
  client,
  onSuccess,
}: EditClientFormProps) => {
  const [form, setForm] = useState<Form>(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (client && isOpen) {
      const moto = client.motorcycles?.[0];
      setForm({
        name: client.name || "",
        city: client.city || "",
        seller_name: moto?.seller_name || "",
        arrival_date: moto?.arrival_date ? moto.arrival_date.split("T")[0] : "",
      });
    } else {
      setForm(initialForm);
    }
  }, [client, isOpen]);

  const updateField = (field: keyof Form, value: string) => {
    setForm((prev: Form) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!form.name || !form.city || !client) {
      notify.warning("Preencha todos os campos obrigatórios.");
      return;
    }

    try {
      setIsSubmitting(true);

      await updateClient(client.id, { name: form.name, city: form.city });

      const moto = client.motorcycles?.[0];
      if (moto) {
        await updateMotorcycle(moto.id, {
          seller_name: form.seller_name,
          arrival_date: form.arrival_date || null,
        });
      }

      notify.success("Cliente atualizado com sucesso!");
      onSuccess();
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
    setForm(initialForm);
    onOpenChange(false);
  };

  return (
    <EditClientFormUI
      isOpen={isOpen}
      handleClose={handleClose}
      client={client}
      form={form}
      updateField={updateField}
      handleSubmit={handleSubmit}
      isSubmitting={isSubmitting}
    />
  );
};

export default EditClientForm;
