"use client";

import ExcelJS from "exceljs";
import { FileSpreadsheet, Loader2, LogOut, Plus, Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import CreateMotorcycleCard from "@/components/CreateMotorcycleCard";
import ListMotorcycleCard from "@/components/ListMotorcycleCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/lib/supabase/cliente";

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
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("motorcycle_arrival")
          .select("*")
          .order("createdAt", { ascending: false })
          .returns<FetchMotorcyclesTypeResponse[]>();

        if (error) {
          console.error("Erro ao buscar motos:", error.message);
          return;
        }

        setMotorcycleFetched(data ?? []);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleImportExcel = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImporting(true);

    try {
      const workbook = new ExcelJS.Workbook();
      const buffer = await file.arrayBuffer();
      await workbook.xlsx.load(buffer);

      const worksheet = workbook.worksheets[0];
      if (!worksheet) {
        alert("Planilha inválida.");
        return;
      }

      // 🔎 pega cabeçalhos (primeira linha)
      const headerRow = worksheet.getRow(1);
      const headers = headerRow.values as string[];

      const requiredColumns = ["chassi", "modelo", "dataChegada"];

      const normalizedHeaders = headers
        .filter(Boolean)
        .map((h) => String(h).trim());

      const isValid = requiredColumns.every((col) =>
        normalizedHeaders.includes(col),
      );

      if (!isValid) {
        alert(
          "A planilha deve conter exatamente as colunas: chassis, model e arrivalDate.",
        );
        return;
      }

      const chassisIndex = normalizedHeaders.indexOf("chassi") + 1;
      const modelIndex = normalizedHeaders.indexOf("modelo") + 1;
      const arrivalIndex = normalizedHeaders.indexOf("dataChegada") + 1;

      const motorcycles: any[] = [];

      worksheet.eachRow((row, rowNumber) => {
        if (rowNumber === 1) return; // pula header

        const chassis = row.getCell(chassisIndex).value;
        const model = row.getCell(modelIndex).value;
        const arrivalDate = row.getCell(arrivalIndex).value;

        if (!chassis || !arrivalDate) return;

        // trata data (excel pode retornar Date ou string)
        let formattedDate: string;

        if (arrivalDate instanceof Date) {
          formattedDate = arrivalDate.toISOString().split("T")[0];
        } else {
          formattedDate = String(arrivalDate);
        }

        motorcycles.push({
          chassis: String(chassis),
          model: model ? String(model) : null,
          arrivalDate: formattedDate,
        });
      });

      if (!motorcycles.length) {
        alert("Nenhum registro válido encontrado.");
        return;
      }

      const { error } = await supabase
        .from("motorcycle_arrival")
        .insert(motorcycles);

      if (error) {
        console.error(error);
        alert("Erro ao importar planilha.");
        return;
      }

      alert(`${motorcycles.length} motos importadas com sucesso!`);
    } catch (error) {
      console.error("Erro ao importar:", error);
      alert("Erro ao processar planilha.");
    } finally {
      setImporting(false);
      e.target.value = ""; // limpa input
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
              router.push("/logistics/sign-in");
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
              Use as colunas exatas: <strong>chassi</strong>,{" "}
              <strong>modelo</strong> e <strong>dataChegada</strong>.
            </p>
          </div>
        </CardContent>
      </Card>

      {dialogIsOpen && (
        <CreateMotorcycleCard
          isOpen={dialogIsOpen}
          handleOpenDialog={handleOpenDialog}
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
