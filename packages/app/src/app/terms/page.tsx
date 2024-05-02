import { Heading } from "@/components/ui/heading";

// Terms Policy text
const termsPolicyText = `
Welcome to CodeRacer! These Terms of Service ("Terms") constitute a legal agreement between you and CodeRacer. Please read these Terms carefully before using our platform, which is accessible at https://code-racer-eight.vercel.app. By using CodeRacer, you agree to be bound by these Terms.
      
      1. User Accounts
      1.1. Account Creation: To use certain features of CodeRacer, you must create an account by logging in with your GitHub account.
      1.2. Account Responsibility: You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account.
   

      2. Use of the Platform
      2.1. Open Source: CodeRacer is an open-source platform, and its source code is available on GitHub for review and contributions.
      2.2. Coding Practice: CodeRacer is designed for coding practice in various languages and supports multiplayer modes.
      2.3. Privacy: We do not collect or store user data beyond what is necessary for GitHub authentication and platform functionality. For more details, please refer to our Privacy Policy.
   

      3. Intellectual Property
      3.1. Ownership: Users retain ownership of the code they create and submit on CodeRacer. CodeRacer retains ownership of the platform and its underlying software.
      
     4. CodeRacer Community
     4.1. Community Standards: Users are expected to maintain a respectful and inclusive environment while using the platform.


    5. Termination
  
      5.1. Termination Rights: CodeRacer reserves the right to terminate or suspend your access to the platform at any time for violations of these Terms or for any other reason.


     6. Limitation of Liability
     6.1. Disclaimer: CodeRacer is provided "as is," and we make no warranties or representations about the accuracy or reliability of the platform. Your use of CodeRacer is at your own risk.
     

      7. Changes to Terms
      7.1. Updates: CodeRacer may update these Terms from time to time. We will notify you of any changes, and your continued use of the platform after such changes will constitute your acceptance of the revised Terms.
     

      8. Contact Us
      8.1. Questions: If you have any questions or concerns about these Terms, please contact us at contact@coderacer.com.
      
`;

function TermsPage() {
  return (
    <div className="pt-12 pb-12">
      <Heading
        title="Terms"
        description="Terms for Code Racer"
      />
      <div className="max-w-3xl mx-auto px-4">
        <pre className="whitespace-pre-line">{termsPolicyText}</pre>
      </div>
    </div>
  );
}

export default TermsPage;

