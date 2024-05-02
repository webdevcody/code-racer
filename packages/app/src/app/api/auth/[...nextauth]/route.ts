import { PrismaAdapter } from "@next-auth/prisma-adapter";
import NextAuth, { AuthOptions, DefaultSession } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import { env } from "@/env.mjs"; // Import environment variables
import { prisma } from "@/lib/prisma"; 
import type { UserRole } from "@prisma/client"; 
import randomstring from "randomstring"; 

// Extend the Session interface to include additional properties
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      role: UserRole;
      token: string;
    } & DefaultSession["user"];
  }
}

// Define options for authentication
export const nextAuthOptions = {
  adapter: PrismaAdapter(prisma), // Use PrismaAdapter for session storage
  session: {
    strategy: "jwt", // Use JWT for session management
  },
  secret: env.NEXTAUTH_SECRET, // Set the secret for signing cookies
  providers: [
    GithubProvider({ // Configure GitHub authentication provider
      clientId: env.GITHUB_CLIENT_ID, // GitHub client ID
      clientSecret: env.GITHUB_CLIENT_SECRET, // GitHub client secret
    }),
  ],
  callbacks: {
    async signIn(options) { // Callback function executed on sign in
      // Generate a random code
      const racerCode = randomstring.generate({
        length: 4,
        charset: "numeric",
      });
      // Modify user email and name
      options.user.email = `${options.user.id}@example.com`;
      options.user.name = `Racer ${racerCode}`;
      return true; // Continue sign in process
    },
    async jwt({ token, user }) { // Callback function executed on JWT creation
      const dbUser = await prisma.user.findFirst({ // Find user in database
        where: {
          email: token.email, // Match user by email
        },
      });

      if (!dbUser) { // If user not found in database
        if (user) { // If user exists
          token.id = user.id; // Set token ID
        }
        return token; // Return token
      }

      // Return user data from database
      return {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        role: dbUser.role,
        picture: dbUser.image,
      };
    },
    async session({ token, session }) { // Callback function executed on session creation
      if (token) { // If token exists
        // Set session user properties
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.role = token.role;
        session.user.image = token.picture;
      }
      return session; // Return session
    },
  },
} as AuthOptions; // Define nextAuthOptions as AuthOptions type

// Create NextAuth handler with options
const handler = NextAuth(nextAuthOptions);

// Export NextAuth handler for both GET and POST requests
export { handler as GET, handler as POST };
