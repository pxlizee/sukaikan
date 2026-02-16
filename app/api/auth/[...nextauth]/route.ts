import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { authOptions } from "@/lib/auth";

const handler = NextAuth({
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login", // Halaman login kustom kita
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // 1. Cari user di database
        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        });

        if (!user) {
          return null; // User tidak ditemukan
        }

        // 2. Cek password (bandingkan yang diketik vs database)
        const passwordMatch = await bcrypt.compare(
          credentials.password, 
          user.password
        );

        if (!passwordMatch) {
          return null; // Password salah
        }

        // 3. Login sukses! Kembalikan data user (tanpa password)
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        };
      }
    })
  ],
  callbacks: {
    // Masukkan ID dan Role ke dalam token & session biar bisa dipakai di frontend
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
      }
      return session;
    }
  }
});

export { handler as GET, handler as POST };