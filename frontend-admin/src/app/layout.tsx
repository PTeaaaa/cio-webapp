import { Outfit, Prompt } from 'next/font/google';
import { GeistMono } from "geist/font/mono";
import './globals.css';
import { SidebarProvider } from '@/contexts/SidebarContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { NavigationProvider } from '@/contexts/NavigationContext';
import { AuthProvider } from '@/contexts/AuthContext-alternative';
import { getServerSessionUser } from '@/lib/serverSession';

export const dynamic = 'force-dynamic';

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

const prompt = Prompt({
  subsets: ["latin", "thai"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-prompt",
});

const geistMono = GeistMono;

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const session = await getServerSessionUser();
  const initialUser = session?.user ?? null;

  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body className={`${outfit.variable} ${prompt.variable} ${geistMono.variable} dark:bg-gray-900`}>
        <ThemeProvider>
          <SidebarProvider>
            <AuthProvider initialUser={initialUser} >
              <NavigationProvider>
                {children}
              </NavigationProvider>
            </AuthProvider>
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
