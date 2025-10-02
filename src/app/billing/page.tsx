import { PaidRouteGuard } from '@/components/PaidRouteGuard';
import { BillingContent } from './BillingContent';

export default function BillingPage() {
  return (
    <PaidRouteGuard>
      <BillingContent />
    </PaidRouteGuard>
  );
}