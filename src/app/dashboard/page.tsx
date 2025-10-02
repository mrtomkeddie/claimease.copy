import { PaidRouteGuard } from '@/components/PaidRouteGuard';
import { DashboardContent } from './DashboardContent';

export default function DashboardPage() {
  return (
    <PaidRouteGuard>
      <DashboardContent />
    </PaidRouteGuard>
  );
}