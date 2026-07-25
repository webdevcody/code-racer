import { Heading } from "@/components/ui/heading";

function TermsTextElement({
  title,
  description,
}: {
  title: string;
  description: { type: string; content: string | string[] }[];
}) {
  return (
    <div className="container mt-6">
      <p className="text-2xl text-muted-foreground mb-2">{title}</p>
      {description.map((descriptionData, index) => (
        <>
          {descriptionData.type == "paragraph" && (
            <p key={index}>{descriptionData.content}</p>
          )}
          {descriptionData.type == "list" &&
            typeof descriptionData.content == "object" && (
              <div className="container">
                <ul key={index}>
                  {descriptionData.content.map((content, index) => (
                    <li className="mt-1" key={index}>
                      {content}
                    </li>
                  ))}
                </ul>
              </div>
            )}
        </>
      ))}
    </div>
  );
}

const page = () => {
  return (
    <>
      <Heading title="Terms" />
      <TermsTextElement
        title="CodeRacer - Terms of Service"
        description={[
          {
            type: "paragraph",
            content:
              "Welcome to CodeRacer! These Terms of Service Terms constitute a legal agreement between you and CodeRacer. By using CodeRacer, you agree to be bound by these Terms.",
          },
        ]}
      />
      <TermsTextElement
        title="User Accounts"
        description={[
          {
            type: "list",
            content: [
              "1.1 Account Creation: To use certain features of CodeRacer, you must create an account by logging in with your GitHub account.",
              "1.2 Account Responsibility: You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account.",
            ],
          },
        ]}
      />
      <TermsTextElement
        title="Use of the Platform"
        description={[
          {
            type: "list",
            content: [
              "2.1 Open Source: CodeRacer is an open-source platform, and its source code is available on GitHub for review and contributions.",
              "2.2 Coding Practice: CodeRacer is designed for coding practice in various languages and supports multiplayer modes.",
              "2.3 Privacy: We do not collect or store user data beyond what is necessary for GitHub authentication and platform functionality. For more details, please refer to our Privacy Policy.",
            ],
          },
        ]}
      />
      <TermsTextElement
        title="Intellectual Property"
        description={[
          {
            type: "list",
            content: [
              "3.1 Ownership: Users retain ownership of the code they create and submit on CodeRacer. CodeRacer retains ownership of the platform and its underlying software.",
            ],
          },
        ]}
      />
      <TermsTextElement
        title="CodeRacer Community"
        description={[
          {
            type: "list",
            content: [
              "4.1 Community Standards: Users are expected to maintain a respectful and inclusive environment while using the platform.",
            ],
          },
        ]}
      />
      <TermsTextElement
        title="Termination"
        description={[
          {
            type: "list",
            content: [
              "5.1 Termination Rights: CodeRacer reserves the right to terminate or suspend your access to the platform at any time for violations of these Terms or for any other reason.",
            ],
          },
        ]}
      />
      <TermsTextElement
        title="Limitation of Liability"
        description={[
          {
            type: "list",
            content: [
              "6.1 Disclaimer: CodeRacer is provided as is, and we make no warranties or representations about the accuracy or reliability of the platform. Your use of CodeRacer is at your own risk.",
            ],
          },
        ]}
      />
      <TermsTextElement
        title="Changes to Terms"
        description={[
          {
            type: "list",
            content: [
              "7.1 Updates: CodeRacer may update these Terms from time to time. We will notify you of any changes, and your continued use of the platform after such changes will constitute your acceptance of the revised Terms.",
            ],
          },
        ]}
      />
      <TermsTextElement
        title="Contact Us"
        description={[
          {
            type: "list",
            content: [
              "8.1 Questions: If you have any questions or concerns about these Terms, please contact us using the information below.",
            ],
          },
        ]}
      />
      <br />
      <br />
    </>
  );
};

export default page;
