export default function EnvCheck() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Environment Variables Check</h1>
      <div className="space-y-2">
        <div>
          <strong>NEXT_PUBLIC_SUPABASE_URL:</strong>{' '}
          <code className="bg-gray-100 p-1 rounded">
            {url || 'NOT SET'}
          </code>
        </div>
        <div>
          <strong>NEXT_PUBLIC_SUPABASE_ANON_KEY:</strong>{' '}
          <code className="bg-gray-100 p-1 rounded">
            {key ? 'SET (hidden)' : 'NOT SET'}
          </code>
        </div>
        <div className="mt-4 p-4 border rounded">
          {url && key ? (
            <p className="text-green-600">✓ Both environment variables are set correctly</p>
          ) : (
            <p className="text-red-600">✗ Environment variables are missing</p>
          )}
        </div>
      </div>
    </div>
  );
}
