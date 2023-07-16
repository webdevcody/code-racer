import "@/styles/globals.css";
import Header from "@/components/header";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import NextTopLoader from "nextjs-toploader";
import { Footer } from "@/components/footer";
import { TailwindIndicator } from "@/components/tailwind-indicator";
import { ContextProvider } from "@/components/context-provider";
import { siteConfig } from "@/config/site";
import { Toaster } from "@/components/ui/toaster";
import { cn } from "@/lib/utils";

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
      <body
        className={cn(
          "min-h-screen flex flex-col bg-background",
          inter.className,
        )}
      >
        <NextTopLoader showSpinner={false} color="#E7B008" />
        <ContextProvider>
          <Header />
          <div className="container py-2 h-fit md:py-18 grow">{children}</div>
          <Footer />
          <Toaster />
          <TailwindIndicator />
        </ContextProvider>
      </body>
    </html>
  );
}
