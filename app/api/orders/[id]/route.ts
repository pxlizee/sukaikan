import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // WAJIB di-await biar Vercel nggak ngamuk lagi nanti
    const { id } = await params; 
    
    const body = await req.json();

    // Update status di database
    const updatedOrder = await prisma.order.update({
      where: { id: id },
      data: { status: body.status },
    });

    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error("Gagal update status pesanan:", error);
    return NextResponse.json({ error: "Gagal update status" }, { status: 500 });
  }
}