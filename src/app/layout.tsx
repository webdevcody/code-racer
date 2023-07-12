import "./globals.css";
import Header from "@/components/header";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import NextTopLoader from "nextjs-toploader";
import { Footer } from "@/components/footer";
import { ThemeProvider } from "@/components/theme-provider";
import { TailwindIndicator } from "@/components/tailwind-indicator";
import { siteConfig } from "@/config/site";

const inter = Inter({ subsets: ["latin"] });

const domain = process.env.NEXT_PUBLIC_DOMAIN;

export const metadata: Metadata = {
  title: siteConfig.name,
  description: siteConfig.description,
  icons: {
    icon: "/static/logo.png",
  },
  openGraph: {
    type: "website",
    url: domain,
    title: siteConfig.name,
    description: siteConfig.description,
    images: `${domain}/static/logo.png`,
  },
  twitter: {
    card: "summary_large_image",
    title: "Checkout Code Racer!",
    description: siteConfig.description,
    images: `${domain}/static/logo.png`,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <NextTopLoader showSpinner={false} />
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Header />
          {children}
          <Footer />
          <TailwindIndicator />
        </ThemeProvider>
      </body>
    </html>
  );
}
