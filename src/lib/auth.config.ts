import type { NextAuthConfig } from "next-auth";

// Edge-safe config: no Prisma/bcrypt imports here. This is used directly by
// src/proxy.ts, which runs on the Edge runtime on Vercel — Prisma's native
// query engine isn't Edge-compatible, so importing the full auth.ts (with
// PrismaAdapter) into the proxy crashes at module load with a bare
// "Internal Server Error". The full provider/adapter config lives in auth.ts
// and is only used by route handlers and server components (Node.js runtime).
export const authConfig: NextAuthConfig = {
  // Trust the host header Vercel forwards — without this, Auth.js's own
  // internal origin detection can come back null on Vercel's Edge network
  // (surfaces as `URL is malformed "null/"`), independent of NEXTAUTH_URL.
  trustHost: true,
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  providers: [],
  callbacks: {
    jwt: ({ token, user }) => {
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    session: ({ session, token }) => {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as "ADMIN" | "STAFF";
      }
      return session;
    },
  },
};
