'use client';

import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { poppins, gilroyHeavy } from '@/lib/fonts';

export function CTA() {
  return (
    <section className="py-20 md:py-32 bg-primary/5">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className={`text-3xl md:text-5xl font-bold ${gilroyHeavy.className}`}>
            Don't risk losing the benefits you deserve.
          </h2>

          <p className={`text-xl text-muted-foreground ${poppins.className}`}>
            Start today — and give your claim the best chance of success.
          </p>

          <Link href="/plans">
            <Button size="lg" className="btn-brand text-lg px-8 py-6 h-auto">
              Start My Claim for £49
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
