'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Check } from 'lucide-react';
import Link from 'next/link';
import { poppins, gilroyHeavy } from '@/lib/fonts';

const plans = [
  {
    name: 'ClaimEase Standard',
    price: '£49',
    description: 'per form',
    features: [
      'One full PIP claim',
      'Export answers PDF/Word',
      'Free appeal support if needed',
    ],
    cta: 'Start My Claim for £49',
    href: '/plans?plan=standard',
    popular: true,
  },
  {
    name: 'ClaimEase Pro',
    price: '£79',
    description: 'one time',
    features: [
      'Unlimited PIP claims',
      'Upload medical documents, prescriptions, evidence etc',
      'Full support for every claim',
    ],
    cta: 'Get Pro for £79',
    href: '/plans?plan=pro',
    popular: false,
  },
];

export function Pricing() {
  return (
    <section className="py-20 md:py-32">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className={`text-3xl md:text-5xl font-bold mb-4 ${gilroyHeavy.className}`}>
            Choose Your Plan
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <Card
              key={index}
              className={`relative glass-effect border-2 ${
                plan.popular ? 'border-primary' : 'border-primary/20'
              } hover:border-primary/60 transition-all duration-300`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold">
                    Most Popular
                  </span>
                </div>
              )}

              <CardHeader className="text-center pb-8 pt-8">
                <CardTitle className={`text-2xl mb-2 ${gilroyHeavy.className}`}>
                  {plan.name}
                </CardTitle>
                <div className="mb-2">
                  <span className={`text-5xl font-bold ${gilroyHeavy.className}`}>
                    {plan.price}
                  </span>
                  <span className={`text-muted-foreground ml-2 ${poppins.className}`}>
                    {plan.description}
                  </span>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                <ul className="space-y-4">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center mt-0.5">
                        <Check className="h-3 w-3 text-primary" />
                      </div>
                      <span className={`text-foreground ${poppins.className}`}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <Link href={plan.href} className="block">
                  <Button
                    size="lg"
                    className={`w-full ${plan.popular ? 'btn-brand' : ''}`}
                    variant={plan.popular ? 'default' : 'outline'}
                  >
                    {plan.cta}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
