import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, password } = body;

    // 1. Validasi Input
    if (!name || !email || !password) {
      return NextResponse.json({ error: "Semua kolom wajib diisi!" }, { status: 400 });
    }

    // 2. Cek apakah email sudah terdaftar
    const existingUser = await prisma.user.findUnique({
      where: { email: email }
    });

    if (existingUser) {
      return NextResponse.json({ error: "Email sudah terdaftar!" }, { status: 400 });
    }

    // 3. Enkripsi Password (Hashing)
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Buat User Baru
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "USER" // Default jadi pembeli biasa
      }
    });

    // Hapus password dari respon agar aman
    const { password: newUserPassword, ...userWithoutPassword } = newUser;

    return NextResponse.json({ 
      success: true, 
      user: userWithoutPassword,
      message: "Registrasi berhasil!" 
    }, { status: 201 });

  } catch (error) {
    console.error("Register Error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 });
  }
}