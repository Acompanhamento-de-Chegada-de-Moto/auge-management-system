import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const clients = await prisma.client.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        motorcycles: true, // remove se não tiver relação
      },
    });

    return NextResponse.json(clients);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Error fetching clients" },
      { status: 500 },
    );
  }
}
