import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// 1. GET: Ambil SEMUA pesanan (Khusus Admin)
export async function GET(req: Request) {
  const session = await getServerSession(authOptions);

  // Cek apakah yang akses beneran ADMIN?
  if ((session?.user as any)?.role !== "ADMIN") {
    return NextResponse.json({ error: "Access Denied" }, { status: 403 });
  }

  try {
    const orders = await prisma.order.findMany({
      include: {
        user: { select: { name: true, email: true } }, // Ambil nama user
        items: true, // Ambil detail barang
      },
      orderBy: {
        createdAt: 'desc', // Pesanan terbaru paling atas
      }
    });

    return NextResponse.json(orders);
  } catch (error) {
    return NextResponse.json({ error: "Gagal ambil data" }, { status: 500 });
  }
}

// 2. PATCH: Update Status Pesanan (Misal: PENDING -> SHIPPED)
export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);

  if ((session?.user as any)?.role !== "ADMIN") {
    return NextResponse.json({ error: "Access Denied" }, { status: 403 });
  }

  try {
    const { orderId, status } = await req.json();

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { status: status },
    });

    return NextResponse.json(updatedOrder);
  } catch (error) {
    return NextResponse.json({ error: "Gagal update status" }, { status: 500 });
  }
}