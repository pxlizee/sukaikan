import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// --- FUNGSI GET (Untuk nampilin data di tabel) ---
export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: { id: 'desc' }
    });
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ error: "Gagal mengambil data" }, { status: 500 });
  }
}

// --- FUNGSI POST (Untuk tambah produk baru) ---
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, price, category, description, imageUrl } = body;

    const newProduct = await prisma.product.create({
      data: {
        name,
        price: parseInt(price),
        category,
        description,
        imageUrl,
        recipeText: "" 
      },
    });

    return NextResponse.json({ success: true, data: newProduct }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Gagal simpan produk" }, { status: 500 });
  }
}