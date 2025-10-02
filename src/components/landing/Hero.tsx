'use client';

import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { gilroyHeavy, poppins } from '@/lib/fonts';

export function Hero() {
  return (
    <section className="relative py-20 md:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h1 className={`text-4xl md:text-6xl lg:text-7xl font-bold leading-tight ${gilroyHeavy.className}`}>
            Struggling with your PIP application?{' '}
            <span className="text-primary">ClaimEase</span> makes it easier.
          </h1>

          <p className={`text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto ${poppins.className}`}>
            Answer simple questions. We'll turn them into clear, DWP-friendly answers. In your words, made stronger.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Link href="/plans">
              <Button size="lg" className="btn-brand text-lg px-8 py-6 h-auto">
                Start My Claim for £49
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/auth">
              <Button size="lg" variant="outline" className="text-lg px-8 py-6 h-auto">
                Sign In
              </Button>
            </Link>
          </div>

          <div className="pt-8 flex flex-wrap justify-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full" />
              <span>One full PIP claim</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full" />
              <span>Expert appeal support</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full" />
              <span>Free appeal guidance</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
