import { Suspense } from 'react';
import SuccessClientPage from './SuccessClientPage';

function Loading() {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      <p className="ml-4 text-lg">Verifying your payment...</p>
    </div>
  );
}

export default function SuccessPageContainer() {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <Suspense fallback={<Loading />}>
        <SuccessClientPage />
      </Suspense>
    </div>
  );
}
