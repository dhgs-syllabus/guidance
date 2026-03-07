import { useState, useEffect } from 'react';
import { useAdminApi } from '../hooks/useAdminApi';

export default function CoursePicker({ currentIds = [], onSelect, onClose }) {
  const { fetchSyllabi } = useAdminApi();
  const [syllabi, setSyllabi] = useState([]);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const [reason, setReason] = useState('');

  useEffect(() => {
    fetchSyllabi().then(data => {
      // Filter out required courses and already-added ones
      const filtered = data.filter(s => s.type !== '\u5fc5\u4fee');
      setSyllabi(filtered);
    });
  }, []);

  const filtered = syllabi.filter(s =>
    !currentIds.includes(s.id) &&
    (search === '' || s.name.includes(search) || s.instructor?.includes(search) || s.keywords?.some(k => k.includes(search)))
  );

  const alreadyAdded = syllabi.filter(s => currentIds.includes(s.id));

  function handleAdd() {
    if (!selected || !reason.trim()) return;
    onSelect({ id: selected.id, reason: reason.trim() });
    setSelected(null);
    setReason('');
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[80vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between flex-shrink-0">
          <h3 className="font-bold text-gray-900">{'\u79d1\u76ee\u3092\u9078\u629e'}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">{'\u2715'}</button>
        </div>

        <div className="px-6 py-3 border-b border-gray-100 flex-shrink-0">
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder={'\u79d1\u76ee\u540d\u30fb\u6559\u54e1\u540d\u30fb\u30ad\u30fc\u30ef\u30fc\u30c9\u3067\u691c\u7d22...'}
            className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-400" />
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-3">
          {/* Already added */}
          {alreadyAdded.length > 0 && (
            <div className="mb-3">
              <p className="text-xs text-gray-400 mb-1">{'\u8ffd\u52a0\u6e08\u307f'}</p>
              {alreadyAdded.map(s => (
                <div key={s.id} className="text-xs text-gray-400 py-1 flex items-center gap-2">
                  <span>{'\u2713'}</span>
                  <span>#{s.id} {s.name} ({s.quarter})</span>
                </div>
              ))}
            </div>
          )}

          {/* Available courses */}
          {filtered.map(s => (
            <button key={s.id}
              onClick={() => setSelected(s)}
              className={`w-full text-left px-3 py-2.5 rounded-lg mb-1 text-sm transition-colors ${
                selected?.id === s.id
                  ? 'bg-amber-50 border border-amber-300'
                  : 'hover:bg-gray-50 border border-transparent'
              }`}>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400 font-mono w-6">#{s.id}</span>
                <span className="font-medium text-gray-900">{s.name}</span>
                <span className="text-xs text-gray-400">{s.quarter}</span>
              </div>
              <p className="text-xs text-gray-500 ml-8 mt-0.5">{s.instructor} / {s.type}</p>
            </button>
          ))}
          {filtered.length === 0 && (
            <p className="text-gray-400 text-center py-6 text-sm">{'\u8a72\u5f53\u3059\u308b\u79d1\u76ee\u304c\u3042\u308a\u307e\u305b\u3093'}</p>
          )}
        </div>

        {/* Selected course + reason input */}
        {selected && (
          <div className="px-6 py-4 border-t border-gray-100 flex-shrink-0">
            <p className="text-xs text-gray-500 mb-2">
              {'\u9078\u629e\u4e2d: '}<span className="font-medium text-gray-900">#{selected.id} {selected.name}</span>
            </p>
            <div className="flex gap-2">
              <input value={reason} onChange={e => setReason(e.target.value)}
                placeholder={'\u63a8\u5968\u7406\u7531\u3092\u5165\u529b...'}
                className="flex-1 bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-400"
                onKeyDown={e => e.key === 'Enter' && handleAdd()} />
              <button onClick={handleAdd} disabled={!reason.trim()}
                className="bg-amber-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-amber-700 disabled:opacity-50 transition-colors">
                {'\u8ffd\u52a0'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
