import { Heading } from "@/components/ui/heading";
import { Subheading } from "@/components/ui/sub-heading";
import { FC } from "react";

interface PrivacyPageProps {}

const PrivacyPage: FC<PrivacyPageProps> = ({}) => {
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

export default PrivacyPage;
