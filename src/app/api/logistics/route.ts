import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const motorcycles = await prisma.motorcycleArrival.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        client: true,
      },
    });

    return NextResponse.json(motorcycles);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Erro ao buscar motos" },
      { status: 500 },
    );
  }
}
