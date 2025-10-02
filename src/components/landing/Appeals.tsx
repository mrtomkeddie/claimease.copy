'use client';

import { poppins, gilroyHeavy } from '@/lib/fonts';
import { Shield } from 'lucide-react';

export function Appeals() {
  return (
    <section className="py-20 md:py-32 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="glass-effect p-8 md:p-12 rounded-3xl border border-primary/20 text-center">
            <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Shield className="h-8 w-8 text-primary-foreground" />
            </div>

            <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${gilroyHeavy.className}`}>
              And if your claim is rejected... we're still with you.
            </h2>

            <p className={`text-xl text-primary font-semibold mb-6 ${poppins.className}`}>
              Over half of PIP decisions are overturned on appeal.
            </p>

            <div className="max-w-2xl mx-auto space-y-4">
              <p className={`text-lg text-muted-foreground ${poppins.className}`}>
                If that happens to you, ClaimEase will guide you step-by-step through the appeal process — <strong className="text-foreground">free of charge</strong>.
              </p>

              <p className={`text-base text-muted-foreground italic ${poppins.className}`}>
                Because your benefits are too important to risk.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
