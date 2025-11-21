import { UserRole } from "@prisma/client";
import NextAuth, { type DefaultSession } from "next-auth";

export type ExtendedUser = DefaultSession["user"] & {
  id: string;
  username: string | null;
  role: UserRole;
};

declare module "next-auth" {
  interface Session {
    user: ExtendedUser;
  }

  interface User {
    username?: string | null;
    role?: UserRole;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: UserRole;
    username?: string | null;
  }
}
