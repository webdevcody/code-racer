import { prisma } from "@/lib/prisma";

const handler = async (request: Request) => {
  const object = await request.json();
  const uid = request.headers.get("Authorization")?.split("userId ")[1];
  const newName = object.newName;
  console.log(newName)
  if (!newName) {
    return new Response(
      "name-is-empty",
      { status: 400 }
    );
  };

  prisma.$connect;

  await prisma.$executeRaw`UPDATE "User" SET name = ${newName} WHERE id = ${uid}`;

  prisma.$disconnect;

  return new Response("success!", { status: 200 });
};

export {
  handler as POST
};