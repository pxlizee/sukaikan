import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt"; // Wajib import ini

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, password } = body;

    // 1. Validasi input kosong
    if (!name || !email || !password) {
      return NextResponse.json({ error: "Data tidak boleh kosong" }, { status: 400 });
    }

    // 2. Cek apakah email sudah pernah dipakai
    const existingUser = await prisma.user.findUnique({
      where: { email: email }
    });

    if (existingUser) {
      return NextResponse.json({ error: "Email sudah terdaftar" }, { status: 400 });
    }

    // 3. PROSES HASHING PASSWORD (Ini Kunci Utamanya!)
    // Angka 10 adalah 'salt rounds' (tingkat kerumitan acakan)
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Simpan ke Database
    const user = await prisma.user.create({
      data: {
        name: name,
        email: email,
        password: hashedPassword, // Yang disimpan yang udah diacak, BUKAN yang asli
        role: "USER" // Default selalu jadi pembeli biasa
      }
    });

    return NextResponse.json({ success: true, message: "Berhasil mendaftar" });

  } catch (error) {
    console.error("Register Error:", error);
    return NextResponse.json({ error: "Gagal membuat akun" }, { status: 500 });
  }
}