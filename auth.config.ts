import type { NextAuthConfig } from "next-auth"

export const authConfig = {
  pages: {
    signIn: "/login",
    error: "/error",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith("/dashboard") || nextUrl.pathname.startsWith("/learn");
      
      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      } else if (isLoggedIn) {
        // If user is logged in and on login/register page, redirect to dashboard
        // This logic can be expanded
        return true;
      }
      return true;
    },
  },
  providers: [], // Configured in auth.ts
} satisfies NextAuthConfig
