import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

//@ts-ignore
import snap from "midtrans-client";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const orders = await prisma.order.findMany({
      where: { userId: (session.user as any).id },
      include: { items: true },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(orders);
  } catch (error) {
    return NextResponse.json({ error: "Gagal memuat data" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!body.userId) return NextResponse.json({ error: "Harus login dulu" }, { status: 401 });

    // 1. Simpan pesanan ke Database
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

    let snapToken = null;

    // 2. Cek apakah Server Key Midtrans ada isinya di .env
    if (process.env.MIDTRANS_SERVER_KEY && process.env.MIDTRANS_SERVER_KEY !== "") {
      const snapClient = new snap.Snap({
        isProduction: false,
        serverKey: process.env.MIDTRANS_SERVER_KEY,
        clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || "",
      });

      const parameter = {
        transaction_details: {
          order_id: order.id,
          gross_amount: body.total,
        },
        customer_details: {
          first_name: body.customerName,
          phone: body.customerPhone,
        },
      };

      const transaction = await snapClient.createTransaction(parameter);
      snapToken = transaction.token;
    }

    // 3. Kembalikan respons. Kalau snapToken null, frontend akan masuk mode simulasi.
    return NextResponse.json({ 
      success: true, 
      orderId: order.id, 
      snapToken: snapToken 
    });

  } catch (error) {
    console.error("Order Error:", error);
    return NextResponse.json({ error: "Gagal membuat pesanan" }, { status: 500 });
  }
}