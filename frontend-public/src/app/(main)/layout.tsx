import type { Metadata } from "next";
import { Geist, Geist_Mono, Prompt } from "next/font/google";
import "@/app/globals.css";
import Header from "@/components/mycomponents/Header";
import { SidebarProvider, SidebarTrigger } from "@/components/sidebar";
import Footer from "@/components/mycomponents/Footer";
import CookieConsent from "@/components/mycomponents/cookieConsent";
import NavHori from "@/components/mycomponents/navbar-hori";
import { BreadcrumbProvider } from "@/context/BreadcrumbContext";
import Breadcrumbs from "@/components/mycomponents/breadcrumbs";
import { AppSidebar } from "@/components/app-sidebar";
import MSWProvider from "../_msw-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const prompt = Prompt({
  variable: "--font-prompt",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
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
    <html lang="en" suppressHydrationWarning={false}>
      <body className={`flex flex-col min-h-lvh antialiased bg-[#ededed] ${geistSans.variable} ${geistMono.variable} ${prompt.variable}`}>
        <Header />
        <SidebarProvider>
          <BreadcrumbProvider>
            <div className="flex-grow flex flex-col relative">

              <div className="hidden lg:block">
                <div className="pt-[70px]">
                  <NavHori />
                </div>
              </div>

              <span className="lg:hidden mt-[30px] flex justify-end">
                <SidebarTrigger />
                <AppSidebar />
              </span>

              <div className="flex flex-col items-center py-4">
                {/* Wrapper container for both objects */}
                <div className="w-full">
                  {/* Object 1 - Breadcrumbs */}
                  <div className="flex justify-center lg:mt-[30px]">
                    <Breadcrumbs />
                  </div>

                  {/* Object 2 - Main content card */}
                  <main>
                    <div className="flex-grow justify-center">
                      <MSWProvider>
                        {children}
                      </MSWProvider>
                    </div>
                    <CookieConsent />
                  </main>
                </div>
              </div>

            </div>
          </BreadcrumbProvider>
        </SidebarProvider>
        <Footer />
      </body>
    </html>
  );
}