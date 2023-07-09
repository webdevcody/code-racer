import Header from "@/components/header";
import { Button } from "@/components/ui/button";
import { LoginButton, LogoutButton } from "@/components/ui/buttons";
import { getSession } from "@/lib/getSession";
import { prisma } from "@/lib/prisma";
import Image from "next/image";

export default async function Home() {
  const users = await prisma.user.findMany();
  const session = await getSession();

  return (
    <>
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <Button>Button</Button>
        {session ? (
          <div className="flex space-x-2 items-center">
            <Image
              className="rounded-full"
              src={session?.user?.image!}
              alt="user avatar"
              height={40}
              width={40}
            />
            <p className="text-gray-700 font-bold">{session?.user?.name}</p>
            <LogoutButton />
          </div>
        ) : (
          <LoginButton />
        )}
      </main>
    </>
  );
}
