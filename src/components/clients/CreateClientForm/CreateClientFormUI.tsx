import { CheckCircle2, Loader2, Search, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatDate } from "@/lib/utils/formatters";

export type SituacaoEmplacamento =
  | "pendente"
  | "em_emplacamento"
  | "emplacado"
  | "entregue";

export const SITUACAO_EMPLACAMENTO_LABELS: Record<
  SituacaoEmplacamento,
  string
> = {
  pendente: "Pendente",
  em_emplacamento: "Em Emplacamento",
  emplacado: "Emplacado",
  entregue: "Entregue",
};

export interface Motorcycle {
  id: string;
  chassis: string;
  model: string | null;
  arrival_date: string | null;
  arrival_status: "WAITING" | "ARRIVED" | string | null;
  billing_date: string | null;
  client_id: string | null;
  created_at: string | null;
  registration_status: "PENDING" | "REGISTERED" | string | null;
  seller_name: string | null;
}

export interface Form {
  name: string;
  city: string;
  seller_name: string;
  model: string;
  billing_date: string;
  registration_status: SituacaoEmplacamento;
  registration_exit_date: string;
  chassis: string;
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
  const motorcycleFound = fetchedMotorcycle !== null;
  const showForm = motorcycleFound || notFoundMotorcycle;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Novo Cliente</DialogTitle>
          <DialogDescription>
            Consulte o chassi para vincular a moto ao cliente
          </DialogDescription>
        </DialogHeader>

        {/* Step 1: Chassis search */}
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

        {/* Step 2: Client data */}
        {showForm && (
          <div className="rounded-lg border border-border p-4">
            <p className="text-sm font-medium text-foreground mb-3">
              2. Preencher dados do cliente
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="name">Cliente</Label>
                <Input
                  id="name"
                  value={form.name}
                  onChange={(e) => updateField("name", e.target.value)}
                  placeholder="Nome do cliente"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="seller_name">Vendedor</Label>
                <Input
                  id="seller_name"
                  value={form.seller_name}
                  onChange={(e) => updateField("seller_name", e.target.value)}
                  placeholder="Nome do vendedor"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="city">Cidade</Label>
                <Input
                  id="city"
                  value={form.city}
                  onChange={(e) => updateField("city", e.target.value)}
                  placeholder="Cidade"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="model">Modelo</Label>
                <Input
                  id="model"
                  value={
                    motorcycleFound ? fetchedMotorcycle.model || "" : form.model
                  }
                  onChange={(e) => updateField("model", e.target.value)}
                  placeholder="Ex: Honda CG 160 Titan"
                  disabled={motorcycleFound}
                  className={motorcycleFound ? "bg-muted" : ""}
                />
                {motorcycleFound && (
                  <p className="text-xs text-muted-foreground">
                    Preenchido automaticamente pela logística
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="chassis">Chassi</Label>
                <Input
                  id="chassis"
                  value={fetchedMotorcycle?.chassis || chassisQuery}
                  disabled
                  className="bg-muted font-mono"
                />
                <p className="text-xs text-muted-foreground">
                  Definido pela busca acima
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="billing_date">Data de Faturamento</Label>
                <Input
                  id="billing_date"
                  type="date"
                  value={form.billing_date}
                  onChange={(e) => updateField("billing_date", e.target.value)}
                />
              </div>

              {/* Status de Chegada - somente leitura, derivado automaticamente */}
              <div className="flex flex-col gap-2">
                <Label>Status de Chegada</Label>
                <div className="flex items-center gap-2 h-9 px-3 rounded-md border border-input bg-muted">
                  {motorcycleFound ? (
                    <>
                      <CheckCircle2 className="size-4 text-emerald-600" />
                      <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
                        Chegou
                      </span>
                      <span className="text-xs text-muted-foreground ml-auto">
                        {formatDate(fetchedMotorcycle?.arrival_date ?? null)}
                      </span>
                    </>
                  ) : (
                    <>
                      <XCircle className="size-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        Aguardando
                      </span>
                    </>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  Atualizado automaticamente pela logistica
                </p>
              </div>

              <div className="flex flex-col gap-2">
                <Label>Situacao de Emplacamento</Label>
                <Select
                  value={form.registration_status}
                  onValueChange={(v) =>
                    updateField(
                      "registration_status",
                      v as SituacaoEmplacamento,
                    )
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(SITUACAO_EMPLACAMENTO_LABELS).map(
                      ([key, label]) => (
                        <SelectItem key={key} value={key}>
                          {label}
                        </SelectItem>
                      ),
                    )}
                  </SelectContent>
                </Select>
              </div>

              {(form.registration_status === "em_emplacamento" ||
                form.registration_status === "emplacado" ||
                form.registration_status === "entregue") && (
                <div className="flex flex-col gap-2 sm:col-span-2">
                  <Label htmlFor="registration_exit_date">
                    Data de Saida para Emplacamento
                  </Label>
                  <Input
                    id="registration_exit_date"
                    type="date"
                    value={form.registration_exit_date}
                    onChange={(e) =>
                      updateField("registration_exit_date", e.target.value)
                    }
                  />
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline" onClick={handleClose}>
                Cancelar
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={
                  isSubmitting || (!motorcycleFound && !notFoundMotorcycle)
                }
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
