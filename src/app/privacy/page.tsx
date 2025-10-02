import { TopMenu } from '@/components/TopMenu';
import { FooterSlim } from '@/components/FooterSlim';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <TopMenu />
      <main className="container mx-auto px-4 pt-20 md:pt-24 pb-12 flex-1 max-w-4xl">
        <div className="prose prose-gray max-w-none">
          <h1 className="text-3xl font-bold text-foreground mb-8">Privacy Policy</h1>
          
          <p className="text-muted-foreground mb-6">
            <strong>Effective Date:</strong> [Insert Date]
          </p>
          
          <p className="text-foreground mb-8">
            At ClaimEase, your privacy is important to us. This policy explains how we handle your data when you use our service.
          </p>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">1. Information We Collect</h2>
            <ul className="list-disc pl-6 space-y-2 text-foreground">
              <li>Information you provide directly (e.g., name, email address, answers you enter into the app).</li>
              <li>Optional supporting documents (if you choose to upload them).</li>
            </ul>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">2. How We Use Your Information</h2>
            <ul className="list-disc pl-6 space-y-2 text-foreground">
              <li>To generate clear, DWP-friendly answers for your PIP claim.</li>
              <li>To provide support if your claim is rejected (appeal guidance).</li>
              <li>To improve our service and maintain site security.</li>
            </ul>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">3. How We Protect Your Information</h2>
            <ul className="list-disc pl-6 space-y-2 text-foreground">
              <li>Your data is encrypted in transit and at rest.</li>
              <li>We do not sell, rent, or share your information with third parties.</li>
              <li>You remain in control of your answers and exports.</li>
            </ul>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">4. Data Retention</h2>
            <ul className="list-disc pl-6 space-y-2 text-foreground">
              <li>We store your claims only for as long as you need them.</li>
              <li>You can delete your data at any time by contacting support.</li>
            </ul>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">5. Your Rights</h2>
            <ul className="list-disc pl-6 space-y-2 text-foreground">
              <li>Access, correct, or delete your information.</li>
              <li>Withdraw consent at any time.</li>
              <li>Contact us for any privacy-related request: <a href="mailto:hello@claimease.co.uk" className="text-primary hover:text-primary/80 transition-colors">hello@claimease.co.uk</a></li>
            </ul>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">6. Legal Compliance</h2>
            <p className="text-foreground">
              ClaimEase is based in the UK and complies with UK GDPR.
            </p>
          </section>
        </div>
      </main>
      <FooterSlim />
    </div>
  );
}