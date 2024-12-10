import { Heading } from "@/components/ui/heading";

function PrivacyPage({}) {
  return (
    <div className="pt-12 pb-12">
      <Heading
        title="Privacy Policies"
        description="Privacy policies for Code Racer"
      />
       <div className="mt-8 space-y-4">
        <p>
          At Code Racer, we are committed to protecting your privacy. This
          document explains how we handle your data.
        </p>
        <ul className="list-disc list-inside">
          <li>
            <strong>Data Collection:</strong> We collect user data such as names,
            email addresses, and activity logs to enhance the user experience.
          </li>
          <li>
            <strong>Data Usage:</strong> Your data is used for improving
            features, analytics, and delivering a personalized experience.
          </li>
          <li>
            <strong>Third-Party Sharing:</strong> We do not share your data with
            third parties without your consent.
          </li>
        </ul>
        <p>
          If you have any concerns, contact us at privacy@coderacer.com.
        </p>
      </div>
    </div>
  );
}
export default PrivacyPage;

