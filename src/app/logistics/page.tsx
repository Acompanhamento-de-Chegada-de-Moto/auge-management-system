"use client";

import { FileSpreadsheet, Loader2, LogOut, Plus, Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import CreateMotorcycleCard from "@/components/CreateMotorcycleCard";
import ListMotorcycleCard from "@/components/ListMotorcycleCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { createComponentClient } from "@/lib/supabase/cliente";

interface MeResponse {
  id: string;
  role: "LOGISTICS" | "BDC";
}

export interface FetchMotorcyclesTypeResponse {
  id: string;
  chassis: string;
  model: string;
  arrivalDate: Date;
  createdAt: Date;
}

const Logistics = () => {
  const [dialogIsOpen, setDialogIsOpen] = useState(false);
  const [motorcyclesFetched, setMotorcycleFetched] = useState<
    FetchMotorcyclesTypeResponse[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [importing, setImporting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabase = createComponentClient();
  const router = useRouter();

  // Função para buscar motos (extraída para ser reutilizada após o upload)
  const fetchMotorcycles = useCallback(async () => {
    try {
      const res = await fetch("/api/logistics");
      if (res.ok) {
        const motorcycles: FetchMotorcyclesTypeResponse[] = await res.json();
        setMotorcycleFetched(motorcycles);
      }
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    async function checkUser() {
      try {
        const res = await fetch("/api/me");
        if (!res.ok) {
          router.push("/logistics/sign-up");
          return;
        }
        const data: MeResponse = await res.json();
        if (data.role !== "LOGISTICS") {
          router.push("/unauthorized");
          return;
        }
        fetchMotorcycles(); // Busca os dados se o usuário estiver ok
      } catch {
        router.push("/logistics/sign-up");
      }
    }
    checkUser();
  }, [router, fetchMotorcycles]);

  const handleImportExcel = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImporting(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/logistics/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        alert(`Sucesso! ${data.inserted} motos importadas.`);
        fetchMotorcycles(); // <--- Atualiza a lista automaticamente
      } else {
        alert(data.error || "Erro ao processar planilha");
      }
    } catch (error) {
      console.error("Erro no upload:", error);
      alert("Falha na conexão com o servidor.");
    } finally {
      setImporting(false);
      if (fileInputRef.current) fileInputRef.current.value = ""; // Limpa o input
    }
  };

  const handleOpenDialog = () => setDialogIsOpen((prev) => !prev);

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 flex flex-col gap-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-semibold text-foreground">
            Painel Logística
          </h2>
          <p className="text-sm text-muted-foreground">
            Registre a chegada de motos e importe planilhas Excel
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Button size="sm" onClick={handleOpenDialog}>
            <Plus className="size-4 mr-2" />
            Registrar Chegada
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={importing}
          >
            {importing ? (
              <Loader2 className="size-4 mr-2 animate-spin" />
            ) : (
              <Upload className="size-4 mr-2" />
            )}
            {importing ? "Importando..." : "Importar Excel"}
          </Button>

          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls"
            className="hidden"
            onChange={handleImportExcel}
          />

          <Button
            variant="outline"
            size="sm"
            onClick={async () => {
              await supabase.auth.signOut();
              router.push("/logistics/sign-up");
            }}
          >
            <LogOut className="size-4 mr-2" />
            Sair
          </Button>
        </div>
      </div>

      <Card className="border-dashed bg-muted/30">
        <CardContent className="flex items-start gap-3 py-3">
          <FileSpreadsheet className="size-5 text-muted-foreground shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-foreground">
              Configuração da Planilha
            </p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Use as colunas exatas: <strong>chassis</strong>,{" "}
              <strong>model</strong> e <strong>arrivalDate</strong>.
            </p>
          </div>
        </CardContent>
      </Card>

      {dialogIsOpen && (
        <CreateMotorcycleCard
          isOpen={dialogIsOpen}
          handleOpenDialog={handleOpenDialog}
          // Dica: Se quiser atualizar a lista ao criar manual, passe o fetchMotorcycles como prop
        />
      )}

      {loading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="animate-spin text-muted-foreground" />
        </div>
      ) : (
        <ListMotorcycleCard motorcycles={motorcyclesFetched} />
      )}
    </div>
  );
};

export default Logistics;
