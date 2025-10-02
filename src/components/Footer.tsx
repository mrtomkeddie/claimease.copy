import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-background border-t border-border mt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center space-y-4">
          {/* Copyright */}
          <div className="text-sm text-foreground">
            © ClaimEase 2025. All rights reserved.
          </div>
          
          {/* Disclaimer */}
          <div className="text-xs text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            ClaimEase is an independent tool designed to help applicants prepare their PIP answers.<br />
            We are not affiliated with or endorsed by the Department for Work and Pensions (DWP).<br />
            We do not provide legal advice.
          </div>
          
          {/* Links */}
          <div className="flex justify-center gap-6 text-sm">
            <Link href="/privacy" className="text-primary hover:text-primary/80 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-primary hover:text-primary/80 transition-colors">
              Terms of Service
            </Link>
            <Link href="/contact" className="text-primary hover:text-primary/80 transition-colors">
              Contact
            </Link>
          </div>
          
          {/* Contact Info */}
          <div className="text-xs text-muted-foreground">
            Built in the UK | hello@claimease.co.uk
          </div>
        </div>
      </div>
    </footer>
  );
}