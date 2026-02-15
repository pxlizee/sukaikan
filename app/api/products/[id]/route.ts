import { prisma } from '../../../../lib/prisma';
import { NextResponse } from 'next/server';

export async function DELETE(req: Request, { params }: { params: any }) {
  try {
    // FIX: Await params agar kompatibel dengan Next.js 15+
    const resolvedParams = await params;
    const id = parseInt(resolvedParams.id);

    console.log("🗑️  Mencoba menghapus produk ID:", id);

    await prisma.product.delete({
      where: { id: id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("❌ Gagal hapus di database:", error.message);
    return NextResponse.json(
      { success: false, error: error.message }, 
      { status: 500 }
    );
  }
}