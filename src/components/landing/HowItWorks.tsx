'use client';

import { poppins, gilroyHeavy } from '@/lib/fonts';

const steps = [
  {
    number: '01',
    title: 'Answer simple questions',
    description: "We'll guide you through plain-English questions about your condition and daily challenges. No confusing jargon or complex forms to navigate.",
  },
  {
    number: '02',
    title: 'Get AI-optimised answers',
    description: "Our AI transforms your responses into clear, DWP-friendly language that highlights your needs and maximises your chances of approval.",
  },
  {
    number: '03',
    title: 'Export & submit with confidence',
    description: "Download your completed answers as a PDF or Word document. Each response is clearly matched to the correct section of the PIP form, so you can copy them across quickly and confidently.",
  },
];

export function HowItWorks() {
  return (
    <section className="py-20 md:py-32 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className={`text-3xl md:text-5xl font-bold mb-4 ${gilroyHeavy.className}`}>
            How It Works
          </h2>
          <p className={`text-lg text-muted-foreground ${poppins.className}`}>
            Three simple steps to complete your PIP claim
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-12">
          {steps.map((step, index) => (
            <div key={index} className="flex gap-6 items-start">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center">
                  <span className={`text-2xl font-bold text-primary-foreground ${gilroyHeavy.className}`}>
                    {step.number}
                  </span>
                </div>
              </div>
              <div className="flex-1 pt-2">
                <h3 className={`text-2xl font-bold mb-3 ${gilroyHeavy.className}`}>
                  {step.title}
                </h3>
                <p className={`text-lg text-muted-foreground ${poppins.className}`}>
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
