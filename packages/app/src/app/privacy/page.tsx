import { Heading } from "@/components/ui/heading";

function PrivacyPage() {
  return (
    <div className="pt-12 pb-12 max-w-4xl mx-auto px-4">
      <Heading
        title="Privacy Policies"
        description="Privacy policies for Code Racer"
      />

      <section className="mt-8 space-y-6 text-gray-700">
        <p>
          At Code Racer, we value your privacy and are committed to protecting
          your personal information. This Privacy Policy outlines how we collect,
          use, and safeguard your data when you use our platform.
        </p>

        <h2 className="text-2xl font-semibold mt-4">Information We Collect</h2>
        <p>
          We may collect personal information such as your username, email address,
          and race statistics when you register or participate in races. We also
          collect usage data to improve the platform.
        </p>

        <h2 className="text-2xl font-semibold mt-4">How We Use Your Information</h2>
        <p>
          Your information is used to personalize your experience, track your
          progress, and communicate updates. We do not share your personal data
          with third parties without your consent.
        </p>

        <h2 className="text-2xl font-semibold mt-4">Cookies</h2>
        <p>
          We use cookies to enhance your experience on Code Racer, such as remembering
          your login session and preferences.
        </p>

        <h2 className="text-2xl font-semibold mt-4">Data Security</h2>
        <p>
          We implement appropriate security measures to protect your data from
          unauthorized access, alteration, or disclosure.
        </p>

        <h2 className="text-2xl font-semibold mt-4">Changes to This Policy</h2>
        <p>
          We may update our Privacy Policy from time to time. Any changes will be
          posted on this page, and the revised date will be updated accordingly.
        </p>

        <h2 className="text-2xl font-semibold mt-4">Contact Us</h2>
        <p>
          If you have any questions about this Privacy Policy, please contact us
          at <a href="mailto:support@coderacer.com" className="text-blue-600 underline">support@coderacer.com</a>.
        </p>
      </section>
    </div>
  );
}

export default PrivacyPage;
