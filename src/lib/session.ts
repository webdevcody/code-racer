import { nextAuthOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";

export function getSession() {
  return getServerSession(nextAuthOptions);
}

export async function getCurrentUser() {
  const session = await getSession();

  return session?.user;
}