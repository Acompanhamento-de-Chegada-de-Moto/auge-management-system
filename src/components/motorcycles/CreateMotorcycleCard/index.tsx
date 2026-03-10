import { useState } from "react";
import { supabase } from "@/lib/supabase/cliente";
import CreateMotorcycleCardUI, { FormMotorcycle } from "./CreateMotorcycleCardUI";

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
      const { data, error } = await supabase
        .from("motorcycles")
        .insert([
          {
            chassis: formMotorcycle.chassis,
            model: formMotorcycle.model,
            arrivalDate: formMotorcycle.arrivalDate,
          },
        ])
        .select();

      if (error) {
        console.error("Erro do Supabase:", error.message);
        alert(error.message);
        return;
      }

      console.log("Moto criada:", data);

      setFormMotorcycle({
        chassis: "",
        model: "",
        arrivalDate: "",
      });

      handleOpenDialog();
    } catch (error) {
      console.error("Erro inesperado:", error);
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
