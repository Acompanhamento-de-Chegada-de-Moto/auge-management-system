import { useState } from "react";
import { supabase } from "@/lib/supabase/cliente";
import { notify } from "@/lib/toast";
import CreateClientFormUI, {
  type Form,
  type Motorcycle,
} from "./CreateClientFormUI";

interface CreateClientFormProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const initialForm: Form = {
  arrival_date: "",
  seller_name: "",
  name: "",
  city: "",
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

      const { data: motorcycle, error } = await supabase
        .from("motorcycles")
        .select("*")
        .eq("chassis", chassisQuery.toUpperCase())
        .maybeSingle();
      if (error) throw error;

      if (!motorcycle) {
        setFetchedMotorcycle(null);
        setNotFoundMotorcycle(true);
        notify.info("Moto não encontrada para este chassi.");
        return;
      }

      setFetchedMotorcycle(motorcycle);
      setNotFoundMotorcycle(false);
      setForm(initialForm);
      notify.success("Moto encontrada com sucesso!");
    } catch {
      notify.error("Erro ao buscar a moto. Tente novamente.");
    } finally {
      setIsLoadingMotorcycle(false);
    }
  };

  const handleSubmit = async () => {
    if (!form.name || !form.city || !fetchedMotorcycle) {
      notify.warning("Preencha todos os campos obrigatórios.");
      return;
    }

    try {
      setIsSubmitting(true);

      const { data: newClient, error: clientError } = await supabase
        .from("clients")
        .insert([{ name: form.name, city: form.city }])
        .select()
        .single();

      if (clientError) throw clientError;

      const { error: motoError } = await supabase
        .from("motorcycles")
        .update({
          client_id: newClient.id,
          seller_name: form.seller_name,
          arrival_date: form.arrival_date || null,
        })
        .eq("id", fetchedMotorcycle.id);

      if (motoError) throw motoError;

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

export default CreateClientForm;
