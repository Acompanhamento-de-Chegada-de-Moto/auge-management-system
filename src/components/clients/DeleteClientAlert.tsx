import { Loader2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { notify } from "@/lib/toast";
import { deleteClient } from "@/services/clientService";

interface Client {
  id: string;
  name: string;
}

interface DeleteClientAlertProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  client: Client | null;
  onSuccess: () => void;
}

const DeleteClientAlert = ({
  isOpen,
  onOpenChange,
  client,
  onSuccess,
}: DeleteClientAlertProps) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!client) return;

    setIsDeleting(true);

    try {
      await deleteClient(client.id);
      notify.success("Cliente removido com sucesso!");
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      notify.error(
        `Erro ao remover cliente: ${error instanceof Error ? error.message : "Desconhecido"}`,
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Remover Cliente</DialogTitle>
          <DialogDescription>
            Tem certeza que deseja remover o cliente{" "}
            <span className="font-semibold text-foreground">
              {client?.name}
            </span>
            ? Esta ação não pode ser desfeita.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-4 flex gap-2 sm:justify-end">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isDeleting}
          >
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting || !client}
          >
            {isDeleting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            Remover
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteClientAlert;
