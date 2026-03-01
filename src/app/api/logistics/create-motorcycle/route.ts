import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { chassis, model, arrivalDate } = body;

    if (!chassis || !model || !arrivalDate) {
      return NextResponse.json(
        { message: "Required fields: chassis, model, arrivalDate" },
        { status: 400 },
      );
    }

    const parsedDate = new Date(arrivalDate);

    if (isNaN(parsedDate.getTime())) {
      return NextResponse.json(
        { message: "Invalid arrivalDate format" },
        { status: 400 },
      );
    }

    const motorcycle = await prisma.motorcycleArrival.create({
      data: {
        chassis,
        model,
        arrivalDate: parsedDate,
      },
    });

    return NextResponse.json(motorcycle, { status: 201 });
  } catch (error: any) {
    // Unique constraint (duplicate chassi)
    if (error.code === "P2002") {
      return NextResponse.json(
        { message: "Chassi already exists" },
        { status: 409 },
      );
    }

    console.error(error);

    return NextResponse.json(
      { message: "Something went wrong while creating motorcycle" },
      { status: 500 },
    );
  }
}
