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
            <Input id="log-chassi" placeholder="Numero do chassi" />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="log-modelo">Modelo</Label>
            <Input id="log-modelo" placeholder="Ex: Honda CG 160 Titan" />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="log-data">Data de Chegada</Label>
            <Input id="log-data" type="date" />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleOpenDialog}>
            Cancelar
          </Button>
          <Button>Registrar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
export default CreateMotorcycleCard;
