import { Heading } from "@/components/ui/heading";
import { Subheading } from "@/components/ui/sub-heading";
import { FC } from "react";

interface pageProps {}

const page: FC<pageProps> = ({}) => {
  return (
    <>
      <Heading
        title="Privacy Policies"
        description="Privacy policies for Code Racer"
      />
      <Subheading title="Policy" description="" />
    </>
  );
};

export default page;
