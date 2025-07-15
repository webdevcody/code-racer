import { Heading } from "@/components/ui/heading";
import Link from "next/link";

const page = () => {
  return (
    <div className="pt-12 pb-12 md:w-3/4 w-full md:pl-12 ">
      <Heading title="Privacy Policies" />
      <p className="text-sm md:text-md text-gray-600 dark:text-gray-300 text-left">Privacy policies for Code Racer</p>
      <p className="text-left mt-6 text-sm lg:text-md">
        At Code Racer, we value your privacy and are committed to protecting your personal information. This Privacy Policy outlines how we collect, use, and protect any data you share while using our platform.
      </p>

        <div className="flex flex-col justify-center mt-8 gap-4">
          <section>
            <h2 className="text-lg md:text-xl font-semibold">Information We Collect</h2>
          <p className="mb-4 text-sm md:text-md">
            At Code Racer, we collect limited information to offer you a smooth, competitive, and personalized experience. When you register or sign in (optionally via services like GitHub), we may collect basic user data such as your name, email, and profile image.        
          </p>
          </section>

          <section className="my-2">
            <h2 className="text-lg md:text-xl font-semibold">How We Use Your Information</h2>
          <p className="text-sm md:text-md">
            All collected information is used solely to enhance your experience on Code Racer. We use it to manage races, maintain leaderboards, track progress, and occasionally communicate important updates.
          </p>
          </section>

          <section className="my-2 ">
            <h2 className="text-lg md:text-xl font-semibold">Cookies and Tracking</h2>
            <p className="text-sm md:text-md">
              Cookies may be used to remember your session, improve navigation, and gather usage analytics. You can disable cookies in your browser settings if you prefer, but please note that some features of the site might not function as intended.
            </p>
          </section>

          <section className="my-2">
            <h2 className="text-lg md:text-xl font-semibold">Data Security</h2>
            <p className="text-sm md:text-md">
              We implement industry-standard security measures to protect your data. However, no system is 100% secure, so we advise users to keep strong passwords and log out after sessions.
            </p>
          </section>
          
          <section className="my-2">
            <h2 className="text-lg md:text-xl font-semibold">Third-Party Services</h2>
            <p className="text-sm md:text-md">
              If we integrate with third-party services (like GitHub OAuth), their respective privacy policies will apply. We encourage users to review those policies before use.
            </p>
          </section>
          
        </div>
    </div>
  );
};

export default page;
