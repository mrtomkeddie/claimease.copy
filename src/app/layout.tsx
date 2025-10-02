import React from 'react';
import './globals.css';
import { inter, poppins } from '@/lib/fonts';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/toaster';
import { UserProvider } from '@/contexts/UserContext';
import { AuthProvider } from '@/contexts/AuthContext';

export const metadata = {
  title: 'ClaimEase — Make your PIP claim easier',
  description: 'Turn your daily experiences into clear, DWP‑friendly answers. ClaimEase rewrites your words for PIP in 10–15 minutes. One‑time £49. Free appeal support.',
  robots: 'index,follow',
  openGraph: {
    type: 'website',
    siteName: 'ClaimEase',
    title: 'ClaimEase — Make your PIP claim easier',
    description: 'Turn your daily experiences into clear, DWP‑friendly answers. One‑time £49. Free appeal support.',
    url: 'https://www.claimease.app/',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ClaimEase — Make your PIP claim easier',
    description: 'Turn your daily experiences into clear, DWP‑friendly answers. One‑time £49. Free appeal support.',
  },
};

export const viewport = {
  themeColor: '#000000',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" type="image/svg+xml" href="/icon.svg" />
        <link rel="alternate icon" href="/favicon.ico" />
      </head>
      <body 
        suppressHydrationWarning 
        className={`${inter.className} ${poppins.variable} min-h-screen font-sans antialiased bg-background text-foreground`}
      >
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <AuthProvider>
            <UserProvider>
              {children}
              <Toaster />
            </UserProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}