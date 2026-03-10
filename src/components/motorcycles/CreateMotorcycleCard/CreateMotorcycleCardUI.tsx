import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,            
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export interface FormMotorcycle {
  chassis: string;
  model: string;
  arrivalDate: string;
}

interface CreateMotorcycleCardUIProps {
  isOpen: boolean;
  handleOpenDialog: () => void;
  formMotorcycle: FormMotorcycle;
  setFormMotorcycle: React.Dispatch<React.SetStateAction<FormMotorcycle>>;
  handleCreateArrival: () => void;
}

const CreateMotorcycleCardUI = ({
  isOpen,
  handleOpenDialog,
  formMotorcycle,
  setFormMotorcycle,
  handleCreateArrival,
}: CreateMotorcycleCardUIProps) => {
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

export default CreateMotorcycleCardUI;
