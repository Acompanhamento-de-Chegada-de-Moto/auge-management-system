import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

export interface Form {
  arrival_date: string;
  seller_name: string;
  name: string;
  city: string;
}

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

interface EditClientFormUIProps {
  isOpen: boolean;
  handleClose: () => void;
  client: Client | null;
  form: Form;
  updateField: (field: keyof Form, value: string) => void;
  handleSubmit: () => void;
  isSubmitting: boolean;
}

const EditClientFormUI = ({
  isOpen,
  handleClose,
  client,
  form,
  updateField,
  handleSubmit,
  isSubmitting,
}: EditClientFormUIProps) => {
  const moto = client?.motorcycles?.[0];

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Cliente</DialogTitle>
          <DialogDescription>
            Edite as informações do cliente e dados vinculados.
          </DialogDescription>
        </DialogHeader>

        <div className="rounded-lg border border-border p-4 mt-4">
          <p className="text-sm font-medium text-foreground mb-3">
            Dados do cliente
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              placeholder="Nome do cliente"
              value={form.name}
              onChange={(e) => updateField("name", e.target.value)}
            />
            <Input
              placeholder="Vendedor"
              value={form.seller_name}
              onChange={(e) => updateField("seller_name", e.target.value)}
            />
            <Input
              placeholder="Cidade"
              value={form.city}
              onChange={(e) => updateField("city", e.target.value)}
            />
            <Input
              placeholder="Modelo"
              value={moto?.model || ""}
              disabled
              className="bg-muted font-mono"
            />
            <Input
              placeholder="Chassi"
              value={moto?.chassis || ""}
              disabled
              className="bg-muted font-mono"
            />

            <Input
              type="date"
              value={form.arrival_date}
              onChange={(e) => updateField("arrival_date", e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <Button variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button onClick={handleSubmit} disabled={isSubmitting || !client}>
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Salvar"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditClientFormUI;
