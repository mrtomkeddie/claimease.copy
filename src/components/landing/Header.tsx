'use client';

import { Button } from '@/components/ui/button';
import { ClaimEaseLogo } from '@/components/ClaimEaseLogo';
import Link from 'next/link';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center">
            <ClaimEaseLogo className="h-8" />
          </Link>

          <nav className="flex items-center gap-4">
            <Link href="/auth">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/plans">
              <Button className="btn-brand">Get Started</Button>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
