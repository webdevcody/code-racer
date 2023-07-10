import { getSession } from "@/lib/getSession";
import { prisma } from "@/lib/prisma";

export default async function handler(req:any, res:any) {
  if (req.method === "GET") {
    const session = await getSession();
    const users = await prisma.user.findMany();
    console.log(users);

    res.status(200).json({ session, users });
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
