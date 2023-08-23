import nodemailer from "nodemailer";
import dotenv from "dotenv";
import emails from "../data/emails.json";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.APP_PASS,
  },
});

function sendSecurityUpdateEmailTo(toEmail: string, name: string) {
  return new Promise((resolve, reject) => {
    transporter.sendMail(
      {
        from: `CodeRacer Online<${process.env.EMAIL}>`,
        to: toEmail,
        subject: "Important Security Update for CodeRacer Web Application",
        text: `Dear CodeRacer Community User ${name},
  
  We hope this email finds you well. We want to inform you about a recent security issue that has come to our attention regarding our web application, CodeRacer. Our top priority is the security and privacy of our users, and we take any potential vulnerabilities very seriously. We want to assure you that we have taken immediate action to address the issue and enhance the security of our platform.
  
  In our ongoing commitment to transparency, we want to share the details of the situation with you. A security vulnerability was discovered that may have exposed a limited number of user email addresses. We want to emphasize that this vulnerability impacted only a small subset of our users, specifically 120 individuals.
  
  To provide some context, the exposure of emails required a deep understanding of how Next.js works and the ability to inspect the JavaScript (.js) files that power our leaderboard feature. Furthermore, this issue was isolated to the leaderboard section and only affected users who had participated in at least 5 races.
  
  We want to stress that we have taken immediate steps to rectify the situation and improve the overall security of our application. Our development team has implemented additional measures to ensure that user emails are consistently stripped from the application's data. We also want to inform you that, as part of our commitment to your security and privacy, we are actively working towards removing email storage from our system entirely. This proactive step will help prevent similar incidents from occurring in the future.
  
  At its core, CodeRacer is a community-driven project designed to provide an environment where individuals can learn coding in a supportive and engaging way. We recognize that as a prototype, there might be occasional bugs or issues that arise as we refine and polish the application into a fully functional, production-ready platform. For any inconvenience this situation may have caused, we sincerely apologize.
  
  Your trust and security are of utmost importance to us. We are here to address any concerns you may have, and we encourage you to reach out to our support team at coderaceronline@gmail.com if you have any questions or require further assistance.
  
  Thank you for your continued support, understanding, and enthusiasm as we work together to create an exceptional learning platform for all aspiring coders.
  
  Best regards,
  
  CodeRacer Development Team`,
      },
      function (error, info) {
        if (error) return reject(error);
        resolve(info);
      }
    );
  });
}

(async function () {
  let processed = 0;
  for (const { email, name } of emails) {
    try {
      await sendSecurityUpdateEmailTo(email, name);
    } catch (err) {
      console.log(`an issue occured sending email to ${email} ${name}`);
    }
    processed++;
    console.log(`emails ${processed} of ${emails.length} sent`);
    await new Promise((resolve) => setTimeout(resolve, 5000));
  }
})();
