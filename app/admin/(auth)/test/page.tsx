export default function TestPage() {
  return (
    <div className="min-h-screen bg-green-100 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-green-800 mb-4">AUTH TEST PAGE</h1>
        <p className="text-green-600">If you can see this, the (auth) route group is working!</p>
        <p className="text-sm text-green-500 mt-2">This page is NOT using the admin layout</p>
      </div>
    </div>
  );
} 