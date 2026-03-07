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

export interface Motorcycle {
  id: string;
  chassis: string;
  model: string | null;
  arrival_date: string | null;
  arrival_status: "WAITING" | "ARRIVED" | "DELIVERED" | null;
  billing_date: string | null;
  seller_name: string | null;
  client_id: string | null;
  registration_status: "PENDING" | "REGISTERED" | "CANCELED" | null;
  created_at: string | null;
}

const Logistics = () => {
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [dialogIsOpen, setDialogIsOpen] = useState(false);
  const [motorcyclesFetched, setMotorcycleFetched] = useState<Motorcycle[]>([]);
  const [loading, setLoading] = useState(false);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [importing, setImporting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const fetchMotorcycles = async (currentPage: number) => {
    if (isFirstLoad) setLoading(true);

    const from = (currentPage - 1) * pageSize;
    const to = from + pageSize - 1;

    const { data, error, count } = await supabase
      .from("motorcycles")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) {
      console.error(error);
    } else {
      setMotorcycleFetched((data as Motorcycle[]) ?? []);
      setTotal(count ?? 0);
    }

    if (isFirstLoad) {
      setLoading(false);
      setIsFirstLoad(false);
    }
  };

  useEffect(() => {
    fetchMotorcycles(page);
  }, [page]);

  const handleImportExcel = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImporting(true);

    try {
      const buffer = await file.arrayBuffer();
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.load(buffer);

      const worksheet = workbook.worksheets[0];
      if (!worksheet) return alert("Planilha inválida.");

      const normalize = (value: any) =>
        String(value || "")
          .trim()
          .toLowerCase();

      const headerRow = worksheet.getRow(1);
      const headers = headerRow.values as any[];

      let chassiIndex = -1;
      let modeloIndex = -1;
      let dataIndex = -1;

      headers.forEach((header, index) => {
        const normalized = normalize(header);
        if (normalized === "chassi") chassiIndex = index;
        if (normalized === "modelo") modeloIndex = index;
        if (normalized === "datachegada") dataIndex = index;
      });

      if (chassiIndex === -1 || modeloIndex === -1 || dataIndex === -1) {
        return alert("A planilha deve conter: chassi, modelo e dataChegada.");
      }

      const parseArrivalDate = (value: any): string | null => {
        if (!value) return null;

        if (value instanceof Date) {
          return value.toISOString().split("T")[0];
        }

        if (typeof value === "number") {
          const excelEpoch = new Date(1899, 11, 30);
          const parsed = new Date(excelEpoch.getTime() + value * 86400000);
          return parsed.toISOString().split("T")[0];
        }

        const raw = String(value).trim();

        if (raw.includes("/")) {
          const [day, month, year] = raw.split("/");
          return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
        }

        if (raw.includes("-")) return raw;

        return null;
      };

      const rowsToInsert: {
        chassis: string;
        model: string | null;
        arrival_date: string;
      }[] = [];

      worksheet.eachRow((row, rowNumber) => {
        if (rowNumber === 1) return;

        const chassi = row.getCell(chassiIndex).value;
        const modelo = row.getCell(modeloIndex).value;
        const dataChegada = row.getCell(dataIndex).value;

        if (!chassi || !dataChegada) return;

        const parsedDate = parseArrivalDate(dataChegada);
        if (!parsedDate) return;

        rowsToInsert.push({
          chassis: String(chassi).trim(),
          model: modelo ? String(modelo).trim() : null,
          arrival_date: parsedDate,
        });
      });

      if (!rowsToInsert.length)
        return alert("Nenhuma linha válida encontrada.");

      const { error } = await supabase
        .from("motorcycles")
        .insert(rowsToInsert, { ignoreDuplicates: true });

      if (error) {
        console.error(error);
        return alert("Erro ao inserir dados.");
      }

      await fetchMotorcycles(page);

      alert(`${rowsToInsert.length} motos importadas com sucesso!`);
    } catch (error) {
      console.error(error);
      alert("Erro ao processar planilha.");
    } finally {
      setImporting(false);
      e.target.value = "";
    }
  };

  const handleOpenDialog = () => setDialogIsOpen((prev) => !prev);

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 flex flex-col gap-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-semibold">Painel Logística</h2>
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

      <Card className="border-dashed">
        <CardContent className="flex items-start gap-3 py-3">
          <FileSpreadsheet className="size-5 text-muted-foreground shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-foreground">
              Formato da planilha para importação
            </p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              A planilha deve conter as colunas: <strong>chassi</strong>,{" "}
              <strong>modelo</strong> e <strong>dataChegada</strong>. Formatos
              de data aceitos: dd/mm/aaaa ou aaaa-mm-dd.
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

      {isFirstLoad && loading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div
          className={`transition-opacity duration-200 ${
            loading ? "opacity-60" : "opacity-100"
          }`}
        >
          <ListMotorcycleCard motorcycles={motorcyclesFetched} />
        </div>
      )}

      <div className="flex gap-2 mt-4">
        <Button
          disabled={page === 1}
          onClick={() => setPage((prev) => prev - 1)}
        >
          Anterior
        </Button>

        <span>
          Página {page} de {Math.ceil(total / pageSize) || 1}
        </span>

        <Button
          disabled={page >= Math.ceil(total / pageSize)}
          onClick={() => setPage((prev) => prev + 1)}
        >
          Próxima
        </Button>
      </div>
    </div>
  );
};

export default Logistics;
