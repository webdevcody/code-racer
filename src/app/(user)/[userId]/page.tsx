import { Heading } from "@/components/ui/heading";
import { prisma } from "@/lib/prisma";

const page = async ({
  params,
}: {
  params: {
    userId: string;
  };
}) => {
  const { userId } = params;
  const user = await prisma.user.findFirst({
    where: { id: userId },
  });

  return (
    <>
      <Heading
        title="Hello, Welcome to my profile"
        description="Here you can find information about the user"
      />
      <h1>
        If anyone works on the design of this page let me know discord
        @trace2798
      </h1>
      {/* <h1>Account Created:{formatTime}</h1> */}
      <h1>My Id is: {user?.id}</h1>
      <h2>Name: {user?.name}</h2>
      {/* <h1>Account Created: {user?.email}</h1> */}
    </>
  );
};

export default page;
