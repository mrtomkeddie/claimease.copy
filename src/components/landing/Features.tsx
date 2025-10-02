'use client';

import { FileText, Sparkles, Link as LinkIcon, Shield } from 'lucide-react';
import { poppins, gilroyHeavy } from '@/lib/fonts';

const features = [
  {
    icon: FileText,
    title: 'Built for PIP, not generic forms',
    description: 'Every question is designed specifically for the PIP form — no confusing jargon or complex forms to navigate.',
  },
  {
    icon: Sparkles,
    title: 'AI-Optimised Answers',
    description: 'Our AI transforms your responses into clear, DWP-friendly language that highlights your needs and maximises your chances of approval.',
  },
  {
    icon: LinkIcon,
    title: 'Evidence Integration',
    description: 'Integrate the reality test results or link the DWP guidance directly next to your answers for a more compelling claim.',
  },
  {
    icon: Shield,
    title: 'Secure & Private',
    description: 'Your data is yours and never shared. We stay up to date with the latest legal requirements so you can claim with total confidence.',
  },
];

export function Features() {
  return (
    <section className="py-20 md:py-32">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className={`text-3xl md:text-5xl font-bold mb-4 ${gilroyHeavy.className}`}>
            Why Choose ClaimEase?
          </h2>
          <p className={`text-lg text-muted-foreground max-w-2xl mx-auto ${poppins.className}`}>
            Built specifically for PIP applications, with features that make the difference
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="glass-effect p-6 rounded-2xl border border-primary/20 hover:border-primary/40 transition-all duration-300 hover:scale-105"
            >
              <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center mb-4">
                <feature.icon className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className={`text-xl font-bold mb-2 ${gilroyHeavy.className}`}>
                {feature.title}
              </h3>
              <p className={`text-muted-foreground ${poppins.className}`}>
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
