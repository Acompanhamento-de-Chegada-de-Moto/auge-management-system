"use client";

import {
  Bike,
  ClipboardCheck,
  FileText,
  MapPin,
  Search,
  Truck,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  ARRIVAL_STATUS_LABELS,
  formatDate,
  getArrivalStatusColor,
  getRegistrationStatusColor,
  REGISTRATION_STATUS_LABELS,
} from "@/lib/utils/formatters";

interface Client {
  id: string;
  clientName: string;
  model: string;
  sellerName: string;
  city: string;
  chassis: string;
  billingDate: string;
  registrationStatus: string;
  arrivalStatus: string;
  arrivalDate: string;
  departureDate: string | null;
}

export default function Home() {
  const [query, setQuery] = useState("");
  const [clients, setClients] = useState<Client[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  console.log(clients);

  useEffect(() => {
    const fetchResults = async () => {
      if (query.length < 3) {
        setClients(null);
        return;
      }

      setIsLoading(true);

      try {
        const response = await fetch(
          `/api/clients?query=${encodeURIComponent(query)}`,
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Erro na busca");
        }

        const data = await response.json();
        const today = new Date().toISOString().split("T")[0];

        const mappedData = (data || []).map((row: Client) => {
          let arrivalStatus = row.arrivalStatus || "WAITING";

          if (
            row.arrivalDate &&
            row.arrivalDate <= today &&
            arrivalStatus === "WAITING"
          ) {
            arrivalStatus = "ARRIVED";
          }

          return {
            id: row.id,
            clientName: row.clientName,
            model: row.model || "-",
            sellerName: row.sellerName || "-",
            city: row.city || "-",
            chassis: row.chassis || "-",
            billingDate: row.billingDate,
            registrationStatus: row.registrationStatus || "PENDING",
            arrivalStatus: arrivalStatus,
            arrivalDate: row.arrivalDate,
            departureDate: row.departureDate || null,
          };
        });

        setClients(mappedData);
      } catch (err) {
        console.error("Erro na busca:", err);
        setClients([]);
      } finally {
        setIsLoading(false);
      }
    };

    const timer = setTimeout(fetchResults, 300);
    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 flex flex-col gap-5">
      <div className="flex flex-col gap-6">
        <Card className="border-0 shadow-none bg-transparent">
          <CardHeader className="px-0 pt-0">
            <CardTitle className="text-xl font-semibold text-foreground">
              Consultar Status da Moto
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Pesquise pelo nome do cliente ou numero do chassi
            </p>
          </CardHeader>
          <CardContent className="px-0">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                placeholder="Nome do cliente"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {isLoading && (
          <p className="text-sm text-muted-foreground">Buscando...</p>
        )}

        {query.length >= 2 && !isLoading && clients && clients.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <Search className="mx-auto size-10 text-muted-foreground/40 mb-3" />
              <p className="text-muted-foreground">
                Nenhum resultado encontrado para &ldquo;{query}&rdquo;
              </p>
            </CardContent>
          </Card>
        )}

        {query.length < 3 && (
          <Card>
            <CardContent className="py-12 text-center">
              <Bike className="mx-auto size-10 text-muted-foreground/40 mb-3" />
              <p className="text-muted-foreground">
                Digite pelo menos 3 caracteres para pesquisar
              </p>
            </CardContent>
          </Card>
        )}

        {clients && clients.length > 0 && (
          <div className="flex flex-col gap-4">
            {clients.map((client) => (
              <Card key={client.id + Math.random()} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex flex-col lg:flex-row">
                    {/* Info principal */}
                    <div className="flex-1 p-5">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-foreground">
                            {client.clientName}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {client.model}
                          </p>
                        </div>
                        <Badge
                          className={getRegistrationStatusColor(
                            client.registrationStatus,
                          )}
                        >
                          {REGISTRATION_STATUS_LABELS[
                            client.registrationStatus
                          ] || client.registrationStatus}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="flex items-center gap-2 text-sm">
                          <User className="size-4 text-muted-foreground shrink-0" />
                          <span className="text-muted-foreground">
                            Vendedor:
                          </span>
                          <span className="font-medium text-foreground">
                            {client.sellerName}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="size-4 text-muted-foreground shrink-0" />
                          <span className="text-muted-foreground">Cidade:</span>
                          <span className="font-medium text-foreground">
                            {client.city}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <FileText className="size-4 text-muted-foreground shrink-0" />
                          <span className="text-muted-foreground">Chassi:</span>
                          <span className="font-mono font-medium text-foreground text-xs">
                            {client.chassis}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <FileText className="size-4 text-muted-foreground shrink-0" />
                          <span className="text-muted-foreground">
                            Faturamento:
                          </span>
                          <span className="font-medium text-foreground">
                            {formatDate(client.billingDate)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Status lateral */}
                    <div className="border-t lg:border-t-0 lg:border-l border-border p-5 lg:w-64 flex flex-col gap-3 bg-muted/30">
                      <div className="flex items-center gap-2">
                        <Truck className="size-4 text-muted-foreground shrink-0" />
                        <span className="text-sm text-muted-foreground">
                          Chegada:
                        </span>
                        <Badge
                          className={getArrivalStatusColor(
                            client.arrivalStatus,
                          )}
                        >
                          {ARRIVAL_STATUS_LABELS[client.arrivalStatus] ||
                            client.arrivalStatus}
                        </Badge>
                      </div>
                      {client.arrivalDate && (
                        <p className="text-xs text-muted-foreground ml-6">
                          Chegou em {formatDate(client.arrivalDate)}
                        </p>
                      )}
                      <div className="flex items-center gap-2">
                        <ClipboardCheck className="size-4 text-muted-foreground shrink-0" />
                        <span className="text-sm text-muted-foreground">
                          Situacao:
                        </span>
                        <Badge
                          className={getRegistrationStatusColor(
                            client.registrationStatus,
                          )}
                        >
                          {REGISTRATION_STATUS_LABELS[
                            client.registrationStatus
                          ] || client.registrationStatus}
                        </Badge>
                      </div>
                      {client.departureDate && (
                        <p className="text-xs text-muted-foreground ml-6">
                          Saiu para emplacamento em{" "}
                          {formatDate(client.departureDate)}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
