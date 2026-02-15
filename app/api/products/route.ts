import { prisma } from '../../../lib/prisma';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// --- FUNGSI AMBIL SEMUA PRODUK (GET) ---
export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: { id: 'desc' },
    });
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ error: "Gagal mengambil data" }, { status: 500 });
  }
}

// --- FUNGSI TAMBAH PRODUK (POST) ---
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, price, category, description, imageUrl } = body;

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `Buatkan resep masakan pendek untuk: ${name}. Bahasa Indonesia.`;
    
    let aiRecipe = "Resep gagal dibuat.";
    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      aiRecipe = response.text();
    } catch (e) { console.error("AI Error"); }

    const newProduct = await prisma.product.create({
      data: {
        name,
        slug: name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''),
        pricePerKg: parseInt(price),
        category,
        description,
        imageUrl,
        recipeText: aiRecipe,
      },
    });

    return NextResponse.json({ success: true, data: newProduct });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Gagal simpan" }, { status: 500 });
  }
}