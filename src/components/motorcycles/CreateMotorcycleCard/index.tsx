import { useState } from "react";
import { createMotorcycleArrival } from "@/services/motorcycleService";
import CreateMotorcycleCardUI, {
  type FormMotorcycle,
} from "./CreateMotorcycleCardUI";

interface CreateMotorcycleCardProps {
  isOpen: boolean;
  handleOpenDialog: () => void;
}

const CreateMotorcycleCard = ({
  isOpen,
  handleOpenDialog,
}: CreateMotorcycleCardProps) => {
  const [formMotorcycle, setFormMotorcycle] = useState<FormMotorcycle>({
    chassis: "",
    model: "",
    arrivalDate: "",
  });

  const handleCreateArrival = async () => {
    if (!formMotorcycle.chassis || !formMotorcycle.arrivalDate) {
      alert("Por favor, preencha todos os campos.");
      return;
    }

    try {
      await createMotorcycleArrival({
        chassis: formMotorcycle.chassis,
        model: formMotorcycle.model,
        arrivalDate: formMotorcycle.arrivalDate,
      });

      setFormMotorcycle({
        chassis: "",
        model: "",
        arrivalDate: "",
      });

      handleOpenDialog();
    } catch (error) {
      console.error("Erro inesperado:", error);
      alert(
        error instanceof Error ? error.message : "Erro ao registrar chegada.",
      );
    }
  };

  return (
    <CreateMotorcycleCardUI
      isOpen={isOpen}
      handleOpenDialog={handleOpenDialog}
      formMotorcycle={formMotorcycle}
      setFormMotorcycle={setFormMotorcycle}
      handleCreateArrival={handleCreateArrival}
    />
  );
};

export default CreateMotorcycleCard;
