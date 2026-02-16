import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const { isAvailable } = await req.json();
    const updated = await prisma.product.update({
      where: { id: params.id },
      data: { isAvailable }
    });
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: "Gagal update" }, { status: 500 });
  }
}