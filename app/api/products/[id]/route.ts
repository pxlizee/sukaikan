import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: Request,
  // Di Next.js 15, params wajib dibungkus Promise
  { params }: { params: Promise<{ id: string }> } 
) {
  try {
    // WAJIB di-await sebelum digunakan
    const { id } = await params; 
    
    const body = await req.json();
    const { isAvailable } = body;

    const updatedProduct = await prisma.product.update({
      where: { id: id },
      data: { isAvailable },
    });

    return NextResponse.json(updatedProduct);
  } catch (error) {
    return NextResponse.json({ error: "Gagal update" }, { status: 500 });
  }
}

// Lakukan hal yang sama untuk fungsi DELETE jika ada
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await prisma.product.delete({ where: { id } });
  return NextResponse.json({ success: true });
}