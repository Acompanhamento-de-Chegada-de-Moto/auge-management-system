import ExcelJS from "exceljs";
import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(arrayBuffer);

    const worksheet = workbook.worksheets[0];
    if (!worksheet) {
      return NextResponse.json({ error: "Invalid worksheet" }, { status: 400 });
    }

    // Mapeamento dos cabeçalhos esperados na primeira linha da planilha
    const expectedHeaders = ["chassi", "modelo", "dataChegada"];
    const headerRow = worksheet.getRow(1);
    const actualHeaders = [
      String(headerRow.getCell(1).value || "").trim(),
      String(headerRow.getCell(2).value || "").trim(),
      String(headerRow.getCell(3).value || "").trim(),
    ];

    if (JSON.stringify(actualHeaders) !== JSON.stringify(expectedHeaders)) {
      return NextResponse.json(
        { error: "Invalid headers. Expected: chassis, model, arrivalDate" },
        { status: 400 },
      );
    }

    const motorcycles: any[] = [];
    const errors: any[] = [];

    // Itera pelas linhas pulando o cabeçalho
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return;

      const chassis = String(row.getCell(1).value || "").trim();
      const model = String(row.getCell(2).value || "").trim();
      const rawDate = row.getCell(3).value;

      if (!chassis || !model || !rawDate) {
        errors.push({ line: rowNumber, error: "Missing required fields" });
        return;
      }

      const arrivalDate = new Date(rawDate as any);
      if (isNaN(arrivalDate.getTime())) {
        errors.push({ line: rowNumber, error: "Invalid date format" });
        return;
      }

      motorcycles.push({
        chassis,
        model,
        arrivalDate,
        createdAt: new Date(),
      });
    });

    if (motorcycles.length === 0) {
      return NextResponse.json(
        { error: "No valid data found", details: errors },
        { status: 400 },
      );
    }

    // Salva tudo no banco ignorando chassis duplicados
    const result = await prisma.motorcycleArrival.createMany({
      data: motorcycles,
      skipDuplicates: true,
    });

    return NextResponse.json({
      success: true,
      inserted: result.count,
      errors: errors.length,
      errorDetails: errors,
    });
  } catch (error) {
    console.error("Excel processing error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
