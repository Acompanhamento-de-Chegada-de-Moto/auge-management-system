import { useState } from "react";
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
      await fetch("/api/logistics/create-motorcycle", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: formMotorcycle.model,
          chassis: formMotorcycle.chassis,
          arrivalDate: formMotorcycle.arrivalDate,
        }),
      });
      handleOpenDialog();
    } catch (error) {
      console.error("Erro ao cadastrar moto:", error);
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
