'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { poppins, gilroyHeavy } from '@/lib/fonts';

const faqs = [
  {
    question: 'What if my claim is rejected?',
    answer: "Don't panic. Over half of PIP decisions are overturned on appeal. If it happens, ClaimEase will guide you step-by-step through the appeal process — free of charge.",
  },
  {
    question: 'Is this legal?',
    answer: "Yes. ClaimEase doesn't give legal advice; we simply help you put your own experiences into clear, evidence-based answers that the DWP can easily understand.",
  },
  {
    question: 'Will you store my data?',
    answer: "No. Your answers are securely stored until you export them. We never share your information, and you're always in control of your data.",
  },
  {
    question: 'Can ClaimEase guarantee my claim will be accepted?',
    answer: "No one can promise that. What ClaimEase does is make sure your answers are clear, detailed, and focused on what the DWP needs to see — giving you the strongest chance of success.",
  },
  {
    question: 'Can I edit more claims later?',
    answer: "Your £49 covers one full PIP claim. For unlimited claims, and additional features like uploading medical documents and example texts, go for the Pro plan at £79. You get everything you need for ongoing or complex cases.",
  },
];

export function FAQ() {
  return (
    <section className="py-20 md:py-32">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className={`text-3xl md:text-5xl font-bold mb-4 ${gilroyHeavy.className}`}>
            Frequently Asked Questions
          </h2>
          <p className={`text-lg text-muted-foreground ${poppins.className}`}>
            Get answers to common questions about ClaimEase
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="glass-effect border border-primary/20 rounded-xl px-6"
              >
                <AccordionTrigger className={`text-left text-lg font-semibold hover:text-primary ${gilroyHeavy.className}`}>
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className={`text-muted-foreground pt-2 ${poppins.className}`}>
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
