import { PrismaAdapter } from "@next-auth/prisma-adapter";
import NextAuth, { AuthOptions, DefaultSession } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import { env } from "@/env.mjs";
import { prisma } from "@/lib/prisma";
import type { UserRole } from "@prisma/client";
import randomstring from "randomstring";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      role: UserRole;
    } & DefaultSession["user"];
  }
}

export const nextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "database",
  },
  secret: env.NEXTAUTH_SECRET,
  providers: [
    GithubProvider({
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      const racerCode = randomstring.generate({
        length: 4,
        charset: "numeric",
      });

      // Check if user exists
      const existingUser = await prisma.user.findUnique({
        where: { email: user.email || `${user.id}@example.com` },
      });

      if (!existingUser) {
        // Create new user if doesn't exist
        await prisma.user.create({
          data: {
            email: user.email || `${user.id}@example.com`,
            name: `Racer ${racerCode}`,
            averageAccuracy: 0,
            averageCpm: 0,
            averageWpm: 0,
            role: "USER",
            image: user.image,
          },
        });
      }

      return true;
    },
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
        session.user.role = user.role;
      }
      return session;
    },
  },
} satisfies AuthOptions;

const handler = NextAuth(nextAuthOptions);

export { handler as GET, handler as POST };
