import Link from 'next/link';

export function FooterSlim() {
  return (
    <footer className="bg-background border-t border-border py-3">
      <div className="container mx-auto px-4">
        <div className="text-center text-xs text-muted-foreground">
          © ClaimEase 2025 |{' '}
          <Link href="/privacy" className="text-primary hover:text-primary/80 transition-colors">
            Privacy
          </Link>{' '}
          |{' '}
          <Link href="/terms" className="text-primary hover:text-primary/80 transition-colors">
            Terms
          </Link>
        </div>
      </div>
    </footer>
  );
}