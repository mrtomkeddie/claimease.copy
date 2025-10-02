
'use client';

import { TopMenu } from "@/components/TopMenu";

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen">
        <TopMenu />
        <main className="container mx-auto px-4 py-8 md:py-12 pt-20 md:pt-24">
        {children}
        </main>
    </div>
  )
}
