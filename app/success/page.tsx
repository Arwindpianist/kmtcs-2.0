import { Suspense } from 'react';
import SuccessClientPage from './SuccessClientPage';
import { PaymentVerificationSkeleton } from '@/app/components/skeletons/PageSkeletons';

function Loading() {
  return <PaymentVerificationSkeleton />;
}

export default function SuccessPageContainer() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16 text-center">
      <Suspense fallback={<Loading />}>
        <SuccessClientPage />
      </Suspense>
      </div>
    </main>
  );
}
