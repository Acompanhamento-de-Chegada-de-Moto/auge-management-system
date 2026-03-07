import { useState } from "react";
import { supabase } from "@/lib/supabase/cliente";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

interface CreateMotorcycleCardProps {
  isOpen: boolean;
  handleOpenDialog: () => void;
}

const CreateMotorcycleCard = ({
  isOpen,
  handleOpenDialog,
}: CreateMotorcycleCardProps) => {
  const [formMotorcycle, setFormMotorcycle] = useState({
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

      // limpa o form
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
    <Dialog open={isOpen} onOpenChange={handleOpenDialog}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Registrar Chegada de Moto</DialogTitle>
          <DialogDescription>
            Informe os dados da moto que chegou na concessionaria
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="log-chassi">Chassi</Label>
            <Input
              id="log-chassi"
              value={formMotorcycle.chassis}
              onChange={({ target }) =>
                setFormMotorcycle((prev) => ({
                  ...prev,
                  chassis: target.value,
                }))
              }
              placeholder="Numero do chassi"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="log-modelo">Modelo</Label>
            <Input
              id="log-modelo"
              value={formMotorcycle.model}
              onChange={({ target }) =>
                setFormMotorcycle((prev) => ({
                  ...prev,
                  model: target.value,
                }))
              }
              placeholder="Ex: Honda CG 160 Titan"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="log-data">Data de Chegada</Label>
            <Input
              id="log-data"
              type="date"
              onChange={({ target }) =>
                setFormMotorcycle((prev) => ({
                  ...prev,
                  arrivalDate: target.value,
                }))
              }
              value={formMotorcycle.arrivalDate}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleOpenDialog}>
            Cancelar
          </Button>
          <Button onClick={handleCreateArrival}>Registrar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
export default CreateMotorcycleCard;
