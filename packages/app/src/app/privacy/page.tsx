import { Heading } from "@/components/ui/heading";

function PrivacyPage({}) {
  return (
    <div className="pt-12 pb-12">
      <Heading
        title="Privacy Policies"
        description="Privacy policies for Code Racer"
      />
      {/* ADD PRIVACY POLICY */}
      <section className="text-left mt-4 text-sm lg:text-md" >
        <h2 className="text-xl font-semibold">Introduction</h2>
        <p className="mt-2">  
          Welcome to Code Racer. We are comitted to protecting your personal information and your right to Privacy.
        </p>

        <h2 className="text-xl font-semibold mt-4">Information We Collect</h2>
        <p className="mt-2">
          We collect personal information that you provide to us, such as name,
          address, contact information, passwords and security data, and payment
          information.
        </p>

        <h2 className="text-xl font-semibold mt-4">How We Use Your Information</h2>
        <p className="mt-2">
          We use personal information collected via our services for a variety
          of business purposes described below. We process your personal
          information for these purposes with your consent, to comply with legal
          obligations, and/or because we have a legitimate interest in doing so.
        </p>

        <h2 className="text-xl font-semibold mt-4">Sharing Your Information</h2>
        <p className="mt-2">
          We only share information with your consent, to comply with laws, to
          provide you with services, to protect your rights, or to fulfill
          business obligations.
        </p>

        <h2 className="text-xl font-semibold mt-4">Cookies and Tracking Technologies</h2>
        <p className="mt-2">
          We may use cookies and similar tracking technologies to access or
          store information. Specific information about how we use such
          technologies and how you can refuse certain cookies is set out in our
          Cookie Policy.
        </p>

        <h2 className="text-xl font-semibold mt-4">Your Privacy Rights</h2>
        <p className="mt-2">
          In some regions, you have rights that allow you greater access to and
          control over your personal information. You may review, change, or
          terminate your account at any time.
        </p>

        <h2 className="text-xl font-semibold mt-4">Data Security</h2>
        <p className="mt-2">
          We aim to protect your personal information through a system of
          organizational and technical security measures.
        </p>

        <h2 className="text-xl font-semibold mt-4">Contact Us</h2>
        <p className="mt-2">
          If you have questions or comments about this policy, you may email us
          at support@coderacer.com.
        </p>
      </section>
    </div>
  );
}

export default PrivacyPage;
