import { useState } from 'react';
import { useAdminApi } from '../hooks/useAdminApi';

export default function ValidationPanel() {
  const { runValidation, loading } = useAdminApi();
  const [results, setResults] = useState(null);

  async function handleValidate() {
    const data = await runValidation();
    if (data) setResults(data);
  }

  const okCount = results?.filter(r => r.level === 'ok').length || 0;
  const warnCount = results?.filter(r => r.level === 'warn').length || 0;
  const errorCount = results?.filter(r => r.level === 'error').length || 0;

  const ICONS = { ok: '\u2705', warn: '\u26a0\ufe0f', error: '\u274c' };
  const COLORS = {
    ok: 'text-green-700 bg-green-50',
    warn: 'text-amber-700 bg-amber-50',
    error: 'text-red-700 bg-red-50',
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold">{'\u30c7\u30fc\u30bf\u691c\u8a3c'}</h2>
        <button onClick={handleValidate} disabled={loading}
          className="bg-amber-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-amber-700 disabled:opacity-50 transition-colors">
          {loading ? '\u691c\u8a3c\u4e2d...' : '\u691c\u8a3c\u3092\u5b9f\u884c'}
        </button>
      </div>

      {!results && (
        <div className="bg-white border border-gray-200 rounded-xl p-10 text-center">
          <p className="text-gray-400 text-sm">{'\u300c\u691c\u8a3c\u3092\u5b9f\u884c\u300d\u30dc\u30bf\u30f3\u3092\u62bc\u3059\u3068\u3001\u5168\u30c7\u30fc\u30bf\u306e\u6574\u5408\u6027\u3092\u30c1\u30a7\u30c3\u30af\u3057\u307e\u3059\u3002'}</p>
        </div>
      )}

      {results && (
        <div className="space-y-4">
          {/* Summary */}
          <div className="flex gap-4">
            <div className="bg-green-50 border border-green-200 rounded-xl px-5 py-3 flex-1 text-center">
              <p className="text-2xl font-bold text-green-700">{okCount}</p>
              <p className="text-xs text-green-600">{'\u5408\u683c'}</p>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-xl px-5 py-3 flex-1 text-center">
              <p className="text-2xl font-bold text-amber-700">{warnCount}</p>
              <p className="text-xs text-amber-600">{'\u8b66\u544a'}</p>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-xl px-5 py-3 flex-1 text-center">
              <p className="text-2xl font-bold text-red-700">{errorCount}</p>
              <p className="text-xs text-red-600">{'\u30a8\u30e9\u30fc'}</p>
            </div>
          </div>

          {/* Details */}
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            {/* Errors first, then warnings, then ok */}
            {[...results].sort((a, b) => {
              const order = { error: 0, warn: 1, ok: 2 };
              return (order[a.level] ?? 3) - (order[b.level] ?? 3);
            }).map((r, i) => (
              <div key={i} className={`px-4 py-2.5 flex items-start gap-3 border-b border-gray-100 last:border-b-0 ${COLORS[r.level]}`}>
                <span className="flex-shrink-0">{ICONS[r.level]}</span>
                <span className="text-sm">{r.message}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
