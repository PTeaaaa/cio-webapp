import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/app/globals.css";
import Header from "@/mycomponents/Header";
import DirectoryBar from "@/mycomponents/DirectoryBar";
import Footer from "@/mycomponents/Footer";
import CookieConsent from "@/mycomponents/cookieConsent";
import NavHori from "@/mycomponents/navbar-hori";
import { BreadcrumbProvider } from "@/context/BreadcrumbContext";
import Breadcrumbs from "@/mycomponents/breadcrumbs";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CIO Info System",
  description: "Manage and view CIO data",
  icons: "/assets/MOPHLogo.svg",
};

export default function RootLayout({ children, }: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`flex flex-col min-h-lvh ${geistSans.variable} ${geistMono.variable} antialiased bg-[#ededed]`}>
        <Header />
        <BreadcrumbProvider>
          <div className="flex-grow flex flex-col relative">
            <div className="flex items-center gap-2 px-4 lg:hidden">
              <div className="mt-[50px]">
              </div>
              <Breadcrumbs />
            </div>

            <div className="hidden lg:block">
              <div className="pt-[70px]">
                <NavHori />
              </div>
              <Breadcrumbs />
            </div>

            <main className="flex-grow pb-8">
              {children}
              <CookieConsent />
            </main>
          </div>
        </BreadcrumbProvider>
        <Footer />
      </body>
    </html>
  );
}