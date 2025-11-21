import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma/client"
import { authConfig } from "@/auth.config"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { LoginSchema } from "@/schemas"

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  callbacks: {
    async session({ token, session }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }

      if (token.username && session.user) {
        session.user.username = token.username as string;
      }

      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
        token.username = user.username;
      }
      return token;
    }
  },
  providers: [
    Credentials({
      async authorize(credentials) {
        const validatedFields = LoginSchema.safeParse(credentials);

        if (validatedFields.success) {
          const { email, password } = validatedFields.data;

          const user = await prisma.user.findUnique({ where: { email } });
          if (!user || !user.password) return null;

          const passwordsMatch = await bcrypt.compare(password, user.password);

          if (passwordsMatch) return user;
        }

        return null;
      }
    })
  ],
})
