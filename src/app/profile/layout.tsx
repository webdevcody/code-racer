import "../globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ProfileNavigation } from "./_components";
import Header from "@/components/header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Code Racer",
    template: "Code Racer | %s"
  },
  description: "Check out who you battled with and how fast of a coder you truly are in this profile page!",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
          <Header />
          <main id="profile-container" className={"container bg-background py-8 h-[clamp(50rem,90dvh,70rem)] flex flex-col justify-center items-center gap-8 md:flex-row"}>
            <aside className="mx-auto md:h-full md:w-24 xl:w-[21%] w-full shadow-md shadow-monochrome rounded-lg p-2 md:p-6 xl:p-8">
              <nav className="w-full">
                <ProfileNavigation />
              </nav>
            </aside>
            <div className="h-full md:w-[88%] xl:w-[79%] w-full shadow-md shadow-monochrome rounded-lg p-8 md:p-6 lg:p-8">
              {children}
            </div>
          </main>
      </body>
    </html>
  );
}
