import { useState } from "react";
import { supabase } from "@/lib/supabase/cliente";
import ErrorFetchingMotorcycle from "./ErrorFetchingMotorcycle";
import SuccessFetchingMotorcycle from "./SuccessFetchingMotorcycle";

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

interface CreateClientFormProps {
  isOpen: boolean;
  onOpenChange: () => void;
}

const CreateClientForm = ({ isOpen, onOpenChange }: CreateClientFormProps) => {
  const [form, setForm] = useState({});

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Novo Cliente</DialogTitle>
          <DialogDescription>
            Consulte o chassi para vincular a moto ao cliente
          </DialogDescription>
        </DialogHeader>

        {/* PASSO 1 */}
        <div className="rounded-lg border border-border bg-muted/30 p-4">
          <p className="text-sm font-medium mb-3">
            1. Consultar chassi na logística
          </p>

          <div className="flex gap-2">
            <Input
              placeholder="Digite o número do chassi"
              className="font-mono"
            />

            <Button variant="secondary">Buscar</Button>
          </div>
        </div>

        {/* PASSO 2 */}
      </DialogContent>
    </Dialog>
  );
};

export default CreateClientForm;
