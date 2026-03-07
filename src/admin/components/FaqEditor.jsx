import { useState, useEffect } from 'react';
import { useAdminApi } from '../hooks/useAdminApi';

export default function FaqEditor({ onToast }) {
  const { fetchData, saveData, loading } = useAdminApi();
  const [faqs, setFaqs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [editing, setEditing] = useState(null); // faq object being edited
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('\u3059\u3079\u3066');

  useEffect(() => { load(); }, []);

  async function load() {
    const data = await fetchData('faqs');
    if (data) {
      setFaqs(data.FAQS || []);
      setCategories(data.FAQ_CATS || []);
    }
  }

  async function save(updatedFaqs, updatedCats) {
    const result = await saveData('faqs', { FAQS: updatedFaqs, FAQ_CATS: updatedCats || categories });
    if (result?.success) {
      onToast('\u4fdd\u5b58\u3057\u307e\u3057\u305f');
      setFaqs(updatedFaqs);
      if (updatedCats) setCategories(updatedCats);
    } else {
      onToast('\u4fdd\u5b58\u306b\u5931\u6557\u3057\u307e\u3057\u305f', 'error');
    }
  }

  function startEdit(faq) {
    setEditing({ ...faq });
  }

  function startNew() {
    const maxId = faqs.reduce((max, f) => Math.max(max, f.id), 0);
    setEditing({ id: maxId + 1, cat: categories[1] || '', q: '', a: '' });
  }

  async function saveEdit() {
    if (!editing.cat || !editing.q || !editing.a) {
      onToast('\u5168\u3066\u306e\u30d5\u30a3\u30fc\u30eb\u30c9\u3092\u5165\u529b\u3057\u3066\u304f\u3060\u3055\u3044', 'error');
      return;
    }
    const exists = faqs.find(f => f.id === editing.id);
    let updated;
    if (exists) {
      updated = faqs.map(f => f.id === editing.id ? editing : f);
    } else {
      updated = [...faqs, editing];
    }
    // Ensure category exists
    let cats = categories;
    if (!categories.includes(editing.cat)) {
      cats = [...categories, editing.cat];
    }
    await save(updated, cats);
    setEditing(null);
  }

  async function deleteFaq(id) {
    if (!confirm(`FAQ #${id} \u3092\u524a\u9664\u3057\u307e\u3059\u304b\uff1f`)) return;
    const updated = faqs.filter(f => f.id !== id);
    await save(updated);
  }

  async function moveFaq(id, direction) {
    const idx = faqs.findIndex(f => f.id === id);
    if (idx < 0) return;
    const newIdx = idx + direction;
    if (newIdx < 0 || newIdx >= faqs.length) return;
    const updated = [...faqs];
    [updated[idx], updated[newIdx]] = [updated[newIdx], updated[idx]];
    await save(updated);
  }

  const filtered = faqs.filter(f =>
    (filterCat === '\u3059\u3079\u3066' || f.cat === filterCat) &&
    (search === '' || f.q.includes(search) || f.a.includes(search))
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold">FAQ\u7de8\u96c6</h2>
        <button onClick={startNew}
          className="bg-amber-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-amber-700 transition-colors">
          + \u65b0\u898f\u8ffd\u52a0
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-4">
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="\u691c\u7d22..."
          className="flex-1 bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-400" />
        <select value={filterCat} onChange={e => setFilterCat(e.target.value)}
          className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm">
          {categories.map(c => <option key={c}>{c}</option>)}
        </select>
      </div>

      {/* List */}
      <div className="space-y-2">
        {filtered.map((f, idx) => (
          <div key={f.id} className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded">#{f.id}</span>
                  <span className="text-xs bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded">{f.cat}</span>
                </div>
                <p className="text-sm font-medium text-gray-900">{f.q}</p>
                <p className="text-xs text-gray-500 mt-1 line-clamp-2">{f.a}</p>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <button onClick={() => moveFaq(f.id, -1)} className="text-gray-400 hover:text-gray-600 p-1 text-xs" title="\u4e0a\u3078">{'\u25b2'}</button>
                <button onClick={() => moveFaq(f.id, 1)} className="text-gray-400 hover:text-gray-600 p-1 text-xs" title="\u4e0b\u3078">{'\u25bc'}</button>
                <button onClick={() => startEdit(f)} className="text-blue-600 hover:text-blue-800 px-2 py-1 text-xs font-medium">{'\u7de8\u96c6'}</button>
                <button onClick={() => deleteFaq(f.id)} className="text-red-500 hover:text-red-700 px-2 py-1 text-xs font-medium">{'\u524a\u9664'}</button>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="text-gray-400 text-center py-10">{'\u8a72\u5f53\u3059\u308bFAQ\u304c\u3042\u308a\u307e\u305b\u3093'}</p>
        )}
      </div>

      {/* Edit Modal */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setEditing(null)}>
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-xl w-full" onClick={e => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-bold text-gray-900">
                {faqs.find(f => f.id === editing.id) ? `FAQ #${editing.id} \u3092\u7de8\u96c6` : '\u65b0\u898fFAQ\u3092\u8ffd\u52a0'}
              </h3>
              <button onClick={() => setEditing(null)} className="text-gray-400 hover:text-gray-600 text-xl">{'\u2715'}</button>
            </div>
            <div className="px-6 py-5 space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">{'\u30ab\u30c6\u30b4\u30ea'}</label>
                <select value={editing.cat} onChange={e => setEditing({ ...editing, cat: e.target.value })}
                  className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm">
                  {categories.filter(c => c !== '\u3059\u3079\u3066').map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">{'\u8cea\u554f'}</label>
                <input value={editing.q} onChange={e => setEditing({ ...editing, q: e.target.value })}
                  className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">{'\u56de\u7b54'}</label>
                <textarea value={editing.a} onChange={e => setEditing({ ...editing, a: e.target.value })}
                  rows={5}
                  className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm resize-y" />
                <p className="text-xs text-gray-400 mt-1">{'\u30d2\u30f3\u30c8: [表示テキスト](URL) 形式でリンクを埋め込めます'}</p>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3">
              <button onClick={() => setEditing(null)}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800">{'\u30ad\u30e3\u30f3\u30bb\u30eb'}</button>
              <button onClick={saveEdit} disabled={loading}
                className="bg-amber-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-amber-700 disabled:opacity-50 transition-colors">
                {loading ? '\u4fdd\u5b58\u4e2d...' : '\u4fdd\u5b58\u3059\u308b'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
