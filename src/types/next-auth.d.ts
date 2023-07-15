import type { User } from "next-auth";
import type { UserRole } from "@prisma/client";

type UserId = string;

declare module "next-auth/jwt" {
  interface JWT {
    id: UserId;
    role: UserRole;
  }
}

declare module "next-auth" {
  interface Session {
    user: User & {
      id: UserId;
      role: UserRole;
    };
  }
}
