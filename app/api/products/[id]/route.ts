import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// 1. Handler untuk UPDATE (PATCH)
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> } // WAJIB pakai Promise di sini
) {
  try {
    // WAJIB di-await dulu sebelum mengambil id
    const resolvedParams = await params;
    const id = resolvedParams.id;

    const body = await req.json();
    
    // Sesuaikan field dengan schema kamu (name, price, category, dll)
    const updatedProduct = await prisma.product.update({
      where: { id: id },
      data: {
        name: body.name,
        price: body.price ? parseInt(body.price) : undefined,
        category: body.category,
        description: body.description,
        imageUrl: body.imageUrl,
        isAvailable: body.isAvailable,
      },
    });

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error("Patch Error:", error);
    return NextResponse.json({ error: "Gagal update produk" }, { status: 500 });
  }
}

// 2. Handler untuk DELETE
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> } // WAJIB pakai Promise juga
) {
  try {
    const resolvedParams = await params;
    const id = resolvedParams.id;

    await prisma.product.delete({
      where: { id: id },
    });

    return NextResponse.json({ success: true, message: "Produk dihapus" });
  } catch (error) {
    console.error("Delete Error:", error);
    return NextResponse.json({ error: "Gagal menghapus produk" }, { status: 500 });
  }
}

// 3. Handler untuk GET Detail (Jika kamu pakai untuk halaman edit)
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const id = resolvedParams.id;

    const product = await prisma.product.findUnique({
      where: { id: id },
    });

    if (!product) {
      return NextResponse.json({ error: "Produk tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json({ error: "Gagal memuat produk" }, { status: 500 });
  }
}