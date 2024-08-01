import { Heading } from "@/components/ui/heading";

function PrivacyTextElement({
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
                <ul key={index} className="list-disc text-sm mt-1">
                  {descriptionData.content.map((content, index) => (
                    <li key={index}>{content}</li>
                  ))}
                </ul>
              </div>
            )}
        </>
      ))}
    </div>
  );
}

function PrivacyPage({}) {
  return (
    <div className="pt-12 pb-12">
      <Heading
        title="Privacy Policies"
        description="Privacy policies for Code Racer"
      />

      <PrivacyTextElement
        title="Privacy Policy"
        description={[
          {
            type: "paragraph",
            content:
              "At Code Racer, we are committed to protecting your privacy. This Privacy Policy outlines how we collect, use, and safeguard your personal information when you interact with our services.",
          },
        ]}
      />
      <PrivacyTextElement
        title="Information We Collect"
        description={[
          {
            type: "paragraph",
            content:
              "We may collect personal information from you in a variety of ways, including, but not limited to:",
          },
          {
            type: "list",
            content: [
              "Account Information",
              "Usage Data",
              "Cookies and Tracking Technologies",
            ],
          },
        ]}
      />
      <PrivacyTextElement
        title="How We Use Your Information"
        description={[
          {
            type: "paragraph",
            content: "We use the information we collect to:",
          },
          {
            type: "list",
            content: [
              "Provide and Maintain Services",
              "Improve Our Services",
              "Communication",
            ],
          },
        ]}
      />
      <PrivacyTextElement
        title="Sharing Your Information"
        description={[
          {
            type: "paragraph",
            content:
              "We do not sell, trade, or otherwise transfer your personal information to outside parties except as described in this policy. We may share your information with trusted third parties who assist us in operating our website, conducting our business, or servicing you, provided those parties agree to keep this information confidential.",
          },
        ]}
      />
      <PrivacyTextElement
        title="Data Security"
        description={[
          {
            type: "paragraph",
            content:
              "We implement a variety of security measures to maintain the safety of your personal information. However, no method of transmission over the internet or method of electronic storage is 100% secure, and we cannot guarantee its absolute security.",
          },
        ]}
      />
      {
        // TODO:
        // - Add contact information
        // - Improve UI, ( visuals are not my strongsuite :-) )
        // - Replace the text with the sites actuall privacy policy, i just used a generic one :I
      }
    </div>
  );
}

export default PrivacyPage;
