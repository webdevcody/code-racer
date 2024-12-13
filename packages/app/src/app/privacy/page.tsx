import { Heading } from "@/components/ui/heading";

function PrivacyPage({}) {
  return (
    <div className="pt-12 pb-12">
      <Heading
        title="Privacy Policies"
        description="Privacy policies for Code Racer"
      />
      <div className="prose mx-auto">
        <p>
          Welcome to Code Racer! Your privacy is important to us. This Privacy
          Policy outlines how we collect, use, and protect your information
          when you use our platform.
        </p>
        <h2>1. Information We Collect</h2>
        <p>
          Code Racer collects the following types of information to provide you
          with a seamless and competitive experience:
        </p>
        <ul>
          <li>
            <strong>Account Information:</strong> If you sign up, we may collect
            your name, email address, and username.
          </li>
          <li>
            <strong>Game Data:</strong> This includes your typing progress,
            race participation data, and leaderboard standings.
          </li>
          <li>
            <strong>Device and Usage Data:</strong> Information such as your
            IP address, browser type, and interaction logs to improve
            performance and detect anomalies.
          </li>
        </ul>

        <h2>2. How We Use Your Information</h2>
        <p>We use your information to:</p>
        <ul>
          <li>Facilitate multiplayer coding races and game functionalities.</li>
          <li>Analyze usage to enhance the platform's performance.</li>
          <li>
            Prevent cheating or abuse and ensure a fair and secure gaming
            experience.
          </li>
          <li>Communicate important updates about the platform.</li>
        </ul>

        <h2>3. Data Sharing</h2>
        <p>
          Code Racer does not sell your personal data. However, we may share
          information with:
        </p>
        <ul>
          <li>
            <strong>Service Providers:</strong> Third-party services that help
            us maintain and improve the platform (e.g., hosting providers,
            analytics tools).
          </li>
          <li>
            <strong>Legal Requirements:</strong> If required by law or to
            protect our rights and users.
          </li>
        </ul>

        <h2>4. Data Retention</h2>
        <p>
          We retain your information for as long as necessary to provide our
          services, comply with legal obligations, resolve disputes, and
          enforce agreements.
        </p>

        <h2>5. Security</h2>
        <p>
          Code Racer implements industry-standard security measures to protect
          your data. However, no method of transmission over the Internet or
          electronic storage is 100% secure.
        </p>

        <h2>6. Cookies</h2>
        <p>
          Code Racer uses cookies to improve your experience. These cookies
          help us remember your preferences, track your progress, and analyze
          usage data.
        </p>

        <h2>7. Your Rights</h2>
        <p>
          Depending on your location, you may have rights regarding your
          personal data, such as accessing, correcting, or deleting it. Please
          contact us if you have any requests or questions about your data.
        </p>

        <h2>8. Updates to This Policy</h2>
        <p>
          We may update this Privacy Policy to reflect changes to our
          practices. We will notify you of significant updates and encourage
          you to review this page periodically.
        </p>

        <h2>9. Contact Us</h2>
        <p>
          If you have questions about this Privacy Policy, please reach out to
          us via the WebDevCody Discord server or email us at support@code-racer.com.
        </p>
      </div>
    </div>
  );
}

export default PrivacyPage;
