import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./components/theme-provider";
import Navbar from "./components/Navbar";
import prisma from "./lib/db";
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/react"
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { unstable_noStore as noStore } from "next/cache";
import CustomButton from "./components/AuthorButton";


const inter = Inter({ subsets: ["latin"] });


async function getData(userId: string) {
  noStore()
  if (userId) {
    const data = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        colorScheme: true
      }
    })
    return data

  }
}

export const metadata: Metadata = {
  generator: 'Next.js',
  title: 'NoteIt',
  description: 'Gere anotações de maneira fácil',
  applicationName: 'NoteIt',
  referrer: 'origin-when-cross-origin',
  keywords: ['Next.js', 'React', 'JavaScript', 'typescript', 'nextjs', 'frontend', 'developer', 'front end', 'programmer'],
  authors: [{ name: 'Eduardo Rigo', url: 'https://eduardev.com' }],
  creator: 'Eduardo Rigo',
  publisher: 'Eduardo Rigo',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: 'NoteIt',
    description: 'Gere anotações de maneira fácil',
    url: 'https://note.eduardev.com',
    siteName: 'NoteIt',
    images: [
      {
        url: 'https://note.eduardev.com/images/bg.png',
        width: 800,
        height: 600,
      },
      {
        url: 'https://note.eduardev.com/images/bg-g.png',
        width: 1800,
        height: 1600,
      },
    ],
    type: 'website',
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
  },
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { getUser } = getKindeServerSession()
  const user = await getUser()
  const data = await getData(user?.id as string)
  return (
    <html lang="en">
      <body className={`${inter.className} ${data?.colorScheme ?? 'theme-yellow'}`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar />
          {children}
          <SpeedInsights />
          <Analytics />
          <footer className="py-6 h-full flex justify-center">
            <CustomButton />
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}