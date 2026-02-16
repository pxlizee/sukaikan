import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth"; // <--- INI YANG HILANG TADI
import { authOptions } from "@/lib/auth"; // Pastikan ini juga di-import

export async function GET(req: Request) {
  try {
    // 1. Cek User Login
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Ambil Pesanan dari Database
    const orders = await prisma.order.findMany({
      where: {
        userId: (session.user as any).id, // Hanya ambil punya user yang login
      },
      include: {
        items: true, // Tampilkan detail ikan yang dibeli
      },
      orderBy: {
        createdAt: 'desc', // Urutkan dari yang terbaru
      }
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Gagal mengambil data" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    if (!body.userId) {
      return NextResponse.json({ error: "User ID wajib ada (harus login)" }, { status: 401 });
    }

    const order = await prisma.order.create({
      data: {
        customerName: body.customerName,
        customerPhone: body.customerPhone,
        address: body.address,
        userId: body.userId,
        totalPrice: body.total,
        status: "PENDING",
        items: {
          create: body.items.map((item: any) => ({
            productName: item.name,
            productId: item.id,
            price: item.price,
            quantity: item.qty
          }))
        }
      }
    });

    return NextResponse.json({ success: true, orderId: order.id });
  } catch (error) {
    console.error("Order Error:", error);
    return NextResponse.json({ error: "Gagal membuat pesanan" }, { status: 500 });
  }
}