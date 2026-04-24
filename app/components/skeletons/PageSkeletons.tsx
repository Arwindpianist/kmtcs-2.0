import { Skeleton } from '@/app/components/ui/skeleton';

export function PublicListingPageSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-slate-200 to-slate-300 px-4 py-16">
        <div className="mx-auto max-w-7xl text-center">
          <Skeleton className="mx-auto mb-4 h-10 w-80 max-w-full" />
          <Skeleton className="mx-auto mb-2 h-5 w-[32rem] max-w-full" />
          <Skeleton className="mx-auto h-5 w-72 max-w-full" />
        </div>
      </div>

      <div className="border-b bg-white py-8">
        <div className="mx-auto max-w-7xl px-4">
          <Skeleton className="mx-auto h-12 w-full max-w-md rounded-xl" />
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <Skeleton className="h-6 w-28 rounded-full" />
                <Skeleton className="h-6 w-20" />
              </div>
              <Skeleton className="mb-3 h-6 w-11/12" />
              <Skeleton className="mb-2 h-4 w-full" />
              <Skeleton className="mb-2 h-4 w-5/6" />
              <Skeleton className="mb-6 h-4 w-2/3" />
              <Skeleton className="h-5 w-28" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function AdminTablePageSkeleton() {
  return (
    <div className="mx-auto max-w-7xl p-4 lg:p-8">
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-5 w-96 max-w-full" />
        </div>
        <Skeleton className="h-11 w-40 rounded-lg" />
      </div>

      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b bg-gray-50 p-4">
          <Skeleton className="h-10 w-full rounded-lg" />
        </div>
        <div className="space-y-4 p-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="grid grid-cols-12 items-center gap-4">
              <Skeleton className="col-span-5 h-5" />
              <Skeleton className="col-span-2 h-5" />
              <Skeleton className="col-span-2 h-5" />
              <Skeleton className="col-span-1 h-6 rounded-full" />
              <Skeleton className="col-span-2 h-8 rounded-lg" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function AdminDashboardSkeleton() {
  return (
    <div className="mx-auto max-w-7xl p-4 lg:p-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-5 w-80 max-w-full" />
        </div>
        <Skeleton className="h-10 w-28 rounded-lg" />
      </div>

      <div className="mb-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <Skeleton className="h-12 w-12 rounded-xl" />
              <Skeleton className="h-8 w-14" />
            </div>
            <Skeleton className="mb-2 h-6 w-40" />
            <Skeleton className="h-4 w-28" />
          </div>
        ))}
      </div>

      <Skeleton className="mb-8 h-56 w-full rounded-xl" />
      <Skeleton className="h-56 w-full rounded-xl" />
    </div>
  );
}

export function AdminAuthSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="border-b bg-white px-4 py-6">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-4">
            <Skeleton className="h-9 w-9 rounded-md" />
            <Skeleton className="h-8 w-48" />
          </div>
          <Skeleton className="h-10 w-32 rounded-lg" />
        </div>
      </div>
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 p-6 lg:grid-cols-[280px_1fr]">
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <div className="space-y-3">
            {Array.from({ length: 7 }).map((_, index) => (
              <Skeleton key={index} className="h-9 w-full rounded-lg" />
            ))}
          </div>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="mt-4 h-5 w-3/4" />
          <Skeleton className="mt-8 h-64 w-full rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export function PaymentVerificationSkeleton() {
  return (
    <div className="mx-auto max-w-2xl rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
      <div className="mb-6 flex justify-center">
        <Skeleton className="h-16 w-16 rounded-full" />
      </div>
      <Skeleton className="mx-auto mb-3 h-8 w-64 max-w-full" />
      <Skeleton className="mx-auto mb-2 h-5 w-80 max-w-full" />
      <Skeleton className="mx-auto mb-8 h-5 w-72 max-w-full" />
      <div className="space-y-3 rounded-lg bg-gray-50 p-4">
        <Skeleton className="h-5 w-48" />
        <Skeleton className="h-5 w-56" />
      </div>
      <Skeleton className="mx-auto mt-8 h-11 w-52 rounded-md" />
    </div>
  );
}
