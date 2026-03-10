import { Loader2, Search, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

export interface Motorcycle {
  id: string;
  chassis: string;
  model: string;
  arrival_date: string | null;
  arrival_status: "WAITING" | "ARRIVED" | string;
  billing_date: string | null;
  client_id: string | null;
  created_at: string;
  registration_status: "PENDING" | "REGISTERED" | string;
  seller_name: string | null;
}

export interface Form {
  arrival_date: string;
  seller_name: string;
  name: string;
  city: string;
}

interface CreateClientFormUIProps {
  isOpen: boolean;
  handleClose: () => void;
  chassisQuery: string;
  setChassisQuery: (val: string) => void;
  handleSearchMotorcycle: () => void;
  isLoadingMotorcycle: boolean;
  notFoundMotorcycle: boolean;
  fetchedMotorcycle: Motorcycle | null;
  form: Form;
  updateField: (field: keyof Form, value: string) => void;
  handleSubmit: () => void;
  isSubmitting: boolean;
}

const CreateClientFormUI = ({
  isOpen,
  handleClose,
  chassisQuery,
  setChassisQuery,
  handleSearchMotorcycle,
  isLoadingMotorcycle,
  notFoundMotorcycle,
  fetchedMotorcycle,
  form,
  updateField,
  handleSubmit,
  isSubmitting,
}: CreateClientFormUIProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Novo Cliente</DialogTitle>
          <DialogDescription>
            Consulte o chassi para vincular a moto ao cliente
          </DialogDescription>
        </DialogHeader>

        <div className="rounded-lg border border-border bg-muted/30 p-4">
          <p className="text-sm font-medium mb-3">
            1. Consultar chassi na logística
          </p>

          <div className="flex gap-2">
            <Input
              placeholder="Digite o número do chassi"
              value={chassisQuery}
              onChange={({ target }) =>
                setChassisQuery(target.value.toUpperCase())
              }
              className="font-mono"
              maxLength={17}
            />

            <Button
              variant="secondary"
              onClick={handleSearchMotorcycle}
              disabled={isLoadingMotorcycle}
              className="w-32"
            >
              {isLoadingMotorcycle ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Buscando
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <Search className="h-4 w-4" />
                  Buscar
                </span>
              )}
            </Button>
          </div>
        </div>

        {notFoundMotorcycle && (
          <div className="mt-3 flex items-start gap-2 rounded-md border border-amber-200 bg-amber-50 p-3 dark:border-amber-900 dark:bg-amber-950/30">
            <XCircle className="size-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="flex flex-col gap-0.5">
              <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
                Chassi não encontrado na logística
              </p>
              <p className="text-xs text-amber-700 dark:text-amber-300">
                A moto ainda não chegou na concessionária. O cadastro será feito
                com status &ldquo;Aguardando&rdquo;.
              </p>
            </div>
          </div>
        )}

        {(notFoundMotorcycle || fetchedMotorcycle) && (
          <div className="rounded-lg border border-border p-4 mt-4">
            <p className="text-sm font-medium text-foreground mb-3">
              2. Preencher dados do cliente
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
                value={fetchedMotorcycle?.model || ""}
                disabled
                className="bg-muted font-mono"
              />
              <Input
                placeholder="Chassi"
                value={fetchedMotorcycle?.chassis || ""}
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
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting || !fetchedMotorcycle}
              >
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Cadastrar"
                )}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CreateClientFormUI;
