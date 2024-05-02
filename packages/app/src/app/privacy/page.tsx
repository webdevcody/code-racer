import { Heading } from "@/components/ui/heading";

// Privacy Policy text
const privacyPolicyText = `
When you log in to our game using your GitHub token, we collect the following information:

GitHub Token: We collect your GitHub token to authenticate your login and provide you access to our game.
Username: We may collect your GitHub username to personalize your gaming experience and to identify you within the game.
Email Address: If you grant us access, we may collect your email address associated with your GitHub account for communication purposes and to provide you with important updates about our game.
Usage Data: We may collect information about your interactions with our game, such as gameplay activity and performance metrics, to improve our services and provide you with a better gaming experience.
How We Use Your Information

We use the information we collect for the following purposes:

Authentication: We use your GitHub token to authenticate your login and provide you access to our game.
Personalization: We may use your GitHub username to personalize your gaming experience and to address you within the game.
Communication: If you provide us with your email address, we may use it to communicate with you, respond to your inquiries, and send you important updates about our game.
Improvement: We may use usage data to analyze trends, track user engagement, and improve our game's features and performance.
Data Sharing and Disclosure

We do not sell, trade, or otherwise transfer your personal information to third parties. However, we may share your information with trusted third-party service providers who assist us in operating our game and website, conducting our business, or servicing you, as long as those parties agree to keep this information confidential. We may also disclose your information when we believe release is appropriate to comply with the law, enforce our site policies, or protect ours or others' rights, property, or safety.

Data Retention

We will retain your personal information for as long as necessary to fulfill the purposes outlined in this Privacy Policy unless a longer retention period is required or permitted by law.

Your Rights

You have the right to access, correct, update, or delete your personal information. You may also have the right to restrict or object to certain processing of your information. To exercise these rights, please contact us using the contact information provided below.

Changes to This Privacy Policy

We reserve the right to modify this Privacy Policy at any time. If we make material changes to this policy, we will notify you here or by means of a notice on our website prior to the change becoming effective.

Contact Us

If you have any questions or concerns about this Privacy Policy or our practices regarding your personal information, please contact us at contact@coderacer.com.
`;

function PrivacyPage() {
  return (
    <div className="pt-12 pb-12">
      <Heading
        title="Privacy Policies"
        description="Privacy policies for Code Racer"
      />
      <div className="max-w-3xl mx-auto px-4">
        <pre className="whitespace-pre-line">{privacyPolicyText}</pre>
      </div>
    </div>
  );
}

export default PrivacyPage;

