import { TopMenu } from '@/components/TopMenu';
import { FooterSlim } from '@/components/FooterSlim';

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <TopMenu />
      <main className="container mx-auto px-4 pt-20 md:pt-24 pb-12 flex-1 max-w-4xl">
        <div className="prose prose-gray max-w-none">
          <h1 className="text-3xl font-bold text-foreground mb-8">Terms Of Service</h1>
          
          <p className="text-muted-foreground mb-6">
            <strong>Effective Date:</strong> [Insert Date]
          </p>
          
          <p className="text-foreground mb-8">
            By using ClaimEase, you agree to these terms:
          </p>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">1. Service Provided</h2>
            <ul className="list-disc pl-6 space-y-2 text-foreground">
              <li>ClaimEase helps you rewrite your PIP claim answers into clear, DWP-friendly language.</li>
              <li>We do not provide legal advice.</li>
              <li>ClaimEase is not affiliated with or endorsed by the Department for Work and Pensions (DWP).</li>
            </ul>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">2. Eligibility</h2>
            <ul className="list-disc pl-6 space-y-2 text-foreground">
              <li>You must be 18 or older to use ClaimEase.</li>
              <li>You are responsible for ensuring all information you provide is accurate and truthful.</li>
            </ul>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">3. Payments</h2>
            <ul className="list-disc pl-6 space-y-2 text-foreground">
              <li>ClaimEase is a one-time purchase (unless otherwise stated).</li>
              <li>Refunds are not guaranteed once answers have been generated, but we will review refund requests on a case-by-case basis.</li>
            </ul>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">4. User Responsibilities</h2>
            <ul className="list-disc pl-6 space-y-2 text-foreground">
              <li>You are responsible for copying your answers into the official PIP2 form.</li>
              <li>ClaimEase does not submit applications to the DWP on your behalf.</li>
              <li>Misuse of the service (e.g., false information, fraud) is prohibited.</li>
            </ul>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">5. Limitation of Liability</h2>
            <ul className="list-disc pl-6 space-y-2 text-foreground">
              <li>ClaimEase cannot guarantee your claim will be accepted.</li>
              <li>We are not liable for any outcomes, delays, or decisions made by the DWP.</li>
            </ul>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">6. Contact</h2>
            <p className="text-foreground">
              For any questions or support, contact us at: <a href="mailto:hello@claimease.co.uk" className="text-primary hover:text-primary/80 transition-colors">hello@claimease.co.uk</a>
            </p>
          </section>
        </div>
      </main>
      <FooterSlim />
    </div>
  );
}