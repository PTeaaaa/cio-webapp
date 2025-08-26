import "@/app/globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "การค้นหาขั้นสูง",
  description: "Advanced Search Page",
  icons: "/assets/MOPHLogo.svg",
}


export default function RootLayout({ children, }: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}