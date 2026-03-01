"use client";

import { FileSpreadsheet, LogOut, Plus, Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import CreateMotorcycleCard from "@/components/CreateMotocycleCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { createComponentClient } from "@/lib/supabase/cliente";

type MeResponse = {
  id: string;
  role: "LOGISTICS" | "BDC";
};

const Logistics = () => {
  const [dialogIsOpen, setDialogIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const supabase = createComponentClient();
  const router = useRouter();

  useEffect(() => {
    async function checkUser() {
      try {
        // 🔎 Chama sua rota /me
        const res = await fetch("/api/me");
        console.log(res);

        if (!res.ok) {
          router.push("/logistics/sign-up");
          return;
        }

        const data: MeResponse = await res.json();
        console.log(data);

        // 🚫 Se não for LOGISTICS, bloqueia
        if (data.role !== "LOGISTICS") {
          router.push("/unauthorized");
          return;
        }

        setLoading(false);
      } catch (error) {
        router.push("/logistics/sign-up");
      }
    }

    checkUser();
  }, [router]);

  const handleOpenDialog = () => {
    setDialogIsOpen(!dialogIsOpen);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 flex flex-col gap-5 ">
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
            <Plus className="size-4" />
            Registrar Chegada
          </Button>

          <Button variant="outline" size="sm">
            <Upload className="size-4" />
            Importar Excel
          </Button>

          <input type="file" accept=".xlsx,.xls,.csv" className="hidden" />

          <Button
            variant="outline"
            size="sm"
            onClick={async () => {
              await supabase.auth.signOut();
              router.push("/logistics/sign-up");
            }}
          >
            <LogOut className="size-4" />
            Sair
          </Button>
        </div>
      </div>

      <Card className="border-dashed">
        <CardContent className="flex items-start gap-3 py-3">
          <FileSpreadsheet className="size-5 text-muted-foreground shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-foreground">
              Formato da planilha para importacao
            </p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              A planilha deve conter as colunas: <strong>chassi</strong>,{" "}
              <strong>modelo</strong> e <strong>dataChegada</strong> (ou
              &ldquo;Data Chegada&rdquo;). Formatos de data aceitos: dd/mm/aaaa
              ou aaaa-mm-dd.
            </p>
          </div>
        </CardContent>
      </Card>

      {dialogIsOpen && (
        <CreateMotorcycleCard isOpen handleOpenDialog={handleOpenDialog} />
      )}
    </div>
  );
};

export default Logistics;
