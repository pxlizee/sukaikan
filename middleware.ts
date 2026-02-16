import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  // Fungsi ini jalan setelah user login
  function middleware(req) {
    // Cek: Kalau mau masuk ke /admin TAPI role-nya bukan ADMIN
    if (req.nextUrl.pathname.startsWith("/admin") && req.nextauth.token?.role !== "ADMIN") {
      // Tendang balik ke halaman utama
      return NextResponse.redirect(new URL("/", req.url));
    }
  },
  {
    callbacks: {
      // Middleware hanya jalan kalau user sudah punya token (sudah login)
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = { 
  matcher: ["/checkout", "/admin/:path*"] 
};