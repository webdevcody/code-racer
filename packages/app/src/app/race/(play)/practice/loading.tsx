import { Loader } from "lucide-react";
import type { NextPage } from "next";

const LoadingPage: NextPage = () => {
  return (
    <div className="grid place-items-center min-h-screen">
      <div className="flex flex-col gap-4">
        <Loader className="animate-spin w-6 h-6" />
        Fetching snippet...
      </div>
    </div>
  );
};

export default LoadingPage;
