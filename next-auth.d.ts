// next-auth.d.ts
import NextAuth, { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      /** ID User dari Database */
      id: string
      /** Role User (ADMIN / USER) */
      role: string
    } & DefaultSession["user"]
  }
}