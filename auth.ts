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

      if (token.languageId && session.user) {
        session.user.languageId = token.languageId as string;
      }

      if (token.isGuest !== undefined && session.user) {
        (session.user as any).isGuest = token.isGuest as boolean;
      }

      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
        token.username = user.username;
        token.languageId = (user as any).languageId;
        token.isGuest = (user as any).isGuest;
      }
      return token;
    }
  },
  providers: [
    // Standard email/password login
    Credentials({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
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
    }),
    // Guest login (no password required)
    Credentials({
      id: "guest",
      name: "Guest",
      credentials: {
        userId: { label: "User ID", type: "text" },
      },
      async authorize(credentials) {
        const userId = credentials?.userId as string | undefined;
        
        if (!userId) return null;

        const user = await prisma.user.findUnique({
          where: { id: userId },
        });

        if (!user || !user.isGuest) return null;

        return user;
      }
    })
  ],
})
