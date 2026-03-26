import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center px-4">
      <div className="text-center">
        <div className="text-8xl mb-6">🔍</div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Patio Not Found</h1>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          Looks like this patio doesn't exist or has moved. Let's find you another great spot!
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
        >
          ← Back to All Patios
        </Link>
      </div>
    </div>
  );
}