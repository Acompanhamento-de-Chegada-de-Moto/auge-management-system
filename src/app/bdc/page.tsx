"use client";

import { Loader2, LogOut, Pencil, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import CreateClientForm from "@/components/clients/CreateClientForm";
import DeleteClientAlert from "@/components/clients/DeleteClientAlert";
import EditClientForm from "@/components/clients/EditClientForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { supabase } from "@/lib/supabase/cliente";
import {
  type Client,
  getClientsWithMotorcycles,
} from "@/services/clientService";

const BdcPage = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoadingClients, setIsLoadingClients] = useState(true);
  const [clientToEdit, setClientToEdit] = useState<Client | null>(null);
  const [clientToDelete, setClientToDelete] = useState<Client | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const router = useRouter();

  const fetchData = useCallback(async () => {
    try {
      setIsLoadingClients(true);
      const data = await getClientsWithMotorcycles();
      setClients(data);
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
    } finally {
      setIsLoadingClients(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleShowModal = () => setIsModalOpen((prev) => !prev);

  const handleEdit = (client: Client) => {
    setClientToEdit(client);
    setIsEditModalOpen(true);
  };

  const handleDelete = (client: Client) => {
    setClientToDelete(client);
    setIsDeleteAlertOpen(true);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 flex flex-col gap-5">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h2 className="text-xl font-semibold text-foreground">
              Painel BDC - Clientes
            </h2>
            <p className="text-sm text-muted-foreground">
              Gerencie o status de emplacamento e entrega.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" onClick={handleShowModal}>
              <Plus className="size-4 mr-1" /> Novo Cliente
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={async () => {
                await supabase.auth.signOut();
                router.push("/bdc/sign-in");
              }}
            >
              <LogOut className="size-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>

        <CreateClientForm
          isOpen={isModalOpen}
          onOpenChange={(open) => {
            setIsModalOpen(open);
            // We should refresh after create, but let's not break existing functionality, just refresh
            if (!open) fetchData();
          }}
        />

        <EditClientForm
          key={clientToEdit?.id || "none"}
          isOpen={isEditModalOpen}
          onOpenChange={(open) => setIsEditModalOpen(open)}
          client={clientToEdit}
          onSuccess={fetchData}
        />

        <DeleteClientAlert
          isOpen={isDeleteAlertOpen}
          onOpenChange={(open) => setIsDeleteAlertOpen(open)}
          client={clientToDelete}
          onSuccess={fetchData}
        />

        <div className="mt-6">
          <p className="text-sm font-medium mb-3">Clientes Cadastrados</p>
          {isLoadingClients ? (
            <div className="flex justify-center py-10">
              <Loader2 className="animate-spin text-primary" />
            </div>
          ) : (
            <Card>
              <CardContent className="p-0 overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead>Cliente</TableHead>
                      <TableHead>Cidade</TableHead>
                      <TableHead>Modelo</TableHead>
                      <TableHead>Chassi</TableHead>
                      <TableHead>Vendedor</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {clients.length > 0 ? (
                      clients.map((client) => {
                        // O Supabase retorna um array na relação 1:N
                        const moto = client.motorcycles?.[0];
                        return (
                          <TableRow key={client.id}>
                            <TableCell className="font-medium">
                              {client.name}
                            </TableCell>
                            <TableCell>{client.city || "-"}</TableCell>
                            <TableCell>{moto?.model || "-"}</TableCell>
                            <TableCell className="font-mono text-xs">
                              {moto?.chassis || "-"}
                            </TableCell>
                            <TableCell>{moto?.seller_name || "-"}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-1">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="size-8"
                                  onClick={() => handleEdit(client)}
                                >
                                  <Pencil className="size-3.5" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="size-8 text-destructive"
                                  onClick={() => handleDelete(client)}
                                >
                                  <Trash2 className="size-3.5" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={6}
                          className="h-24 text-center text-muted-foreground"
                        >
                          Nenhum cliente encontrado.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default BdcPage;
