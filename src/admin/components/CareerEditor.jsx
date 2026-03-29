import { useState, useEffect } from 'react';
import { useAdminApi } from '../hooks/useAdminApi';
import CoursePicker from './CoursePicker';

export default function CareerEditor({ onToast }) {
  const { fetchData, saveData, fetchSyllabi, loading } = useAdminApi();
  const [careers, setCareers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [syllabi, setSyllabi] = useState([]);
  const [editing, setEditing] = useState(null);
  const [showPicker, setShowPicker] = useState(false);
  const [filterCat, setFilterCat] = useState('\u3059\u3079\u3066');

  async function load() {
    const [careerData, sylData] = await Promise.all([
      fetchData('careers'),
      fetchSyllabi(),
    ]);
    if (careerData) {
      setCareers(careerData.CAREERS || []);
      setCategories(careerData.CAREER_CATEGORIES || []);
    }
    if (sylData) setSyllabi(sylData);
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { load(); }, []);

  function getSyllabus(id) {
    return syllabi.find(s => s.id === id);
  }

  async function save(updatedCareers, updatedCats) {
    const result = await saveData('careers', {
      CAREERS: updatedCareers,
      CAREER_CATEGORIES: updatedCats || categories,
    });
    if (result?.success) {
      onToast('\u4fdd\u5b58\u3057\u307e\u3057\u305f');
      setCareers(updatedCareers);
      if (updatedCats) setCategories(updatedCats);
    } else {
      onToast('\u4fdd\u5b58\u306b\u5931\u6557\u3057\u307e\u3057\u305f', 'error');
    }
  }

  function startEdit(career) {
    setEditing({ ...career, recommendations: [...career.recommendations] });
  }

  function startNew() {
    setEditing({
      title: '', icon: '', category: categories[1] || '',
      desc: '', recommendations: [],
    });
  }

  async function saveEdit() {
    if (!editing.title || !editing.icon || !editing.category || !editing.desc) {
      onToast('\u5168\u3066\u306e\u30d5\u30a3\u30fc\u30eb\u30c9\u3092\u5165\u529b\u3057\u3066\u304f\u3060\u3055\u3044', 'error');
      return;
    }
    const existIdx = careers.findIndex(c => c.title === editing._originalTitle || c.title === editing.title);
    let updated;
    if (existIdx >= 0 && editing._originalTitle) {
      updated = careers.map((c, i) => i === existIdx ? {
        title: editing.title, icon: editing.icon, category: editing.category,
        desc: editing.desc, recommendations: editing.recommendations,
      } : c);
    } else if (existIdx >= 0) {
      updated = careers.map((c, i) => i === existIdx ? {
        title: editing.title, icon: editing.icon, category: editing.category,
        desc: editing.desc, recommendations: editing.recommendations,
      } : c);
    } else {
      updated = [...careers, {
        title: editing.title, icon: editing.icon, category: editing.category,
        desc: editing.desc, recommendations: editing.recommendations,
      }];
    }
    await save(updated);
    setEditing(null);
  }

  async function deleteCareer(title) {
    if (!confirm(`"${title}" \u3092\u524a\u9664\u3057\u307e\u3059\u304b\uff1f`)) return;
    const updated = careers.filter(c => c.title !== title);
    await save(updated);
  }

  function removeRecommendation(idx) {
    const recs = [...editing.recommendations];
    recs.splice(idx, 1);
    setEditing({ ...editing, recommendations: recs });
  }

  function addRecommendation(rec) {
    setEditing({
      ...editing,
      recommendations: [...editing.recommendations, rec],
    });
    setShowPicker(false);
  }

  function updateReason(idx, reason) {
    const recs = [...editing.recommendations];
    recs[idx] = { ...recs[idx], reason };
    setEditing({ ...editing, recommendations: recs });
  }

  const filtered = filterCat === '\u3059\u3079\u3066'
    ? careers
    : careers.filter(c => c.category === filterCat);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold">{'\u30ad\u30e3\u30ea\u30a2\u30de\u30c3\u30d7\u7de8\u96c6'}</h2>
        <button onClick={startNew}
          className="bg-amber-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-amber-700 transition-colors">
          + {'\u65b0\u898f\u8ffd\u52a0'}
        </button>
      </div>

      {/* Filter */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {categories.map(cat => (
          <button key={cat} onClick={() => setFilterCat(cat)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
              filterCat === cat
                ? 'bg-amber-500 text-white border-amber-500'
                : 'bg-white text-gray-600 border-gray-300 hover:border-amber-300'
            }`}>
            {cat}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {filtered.map(c => (
          <div key={c.title} className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xl">{c.icon}</span>
                  <span className="text-xs bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded">{c.category}</span>
                </div>
                <h3 className="font-semibold text-sm text-gray-900">{c.title}</h3>
                <p className="text-xs text-gray-500 mt-1 line-clamp-2">{c.desc}</p>
                <p className="text-xs text-gray-400 mt-2">{'\u63a8\u5968\u79d1\u76ee: '}{c.recommendations.length}{'\u79d1\u76ee'}</p>
              </div>
              <div className="flex gap-1 flex-shrink-0 ml-2">
                <button onClick={() => { startEdit(c); }} className="text-blue-600 hover:text-blue-800 px-2 py-1 text-xs font-medium">{'\u7de8\u96c6'}</button>
                <button onClick={() => deleteCareer(c.title)} className="text-red-500 hover:text-red-700 px-2 py-1 text-xs font-medium">{'\u524a\u9664'}</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setEditing(null)}>
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="sticky top-0 bg-white/95 backdrop-blur px-6 py-4 border-b border-gray-100 flex items-center justify-between rounded-t-2xl z-10">
              <h3 className="font-bold text-gray-900">{'\u30ad\u30e3\u30ea\u30a2\u30d1\u30b9\u7de8\u96c6'}</h3>
              <button onClick={() => setEditing(null)} className="text-gray-400 hover:text-gray-600 text-xl">{'\u2715'}</button>
            </div>
            <div className="px-6 py-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">{'\u30bf\u30a4\u30c8\u30eb'}</label>
                  <input value={editing.title} onChange={e => setEditing({ ...editing, title: e.target.value })}
                    className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">{'\u30a2\u30a4\u30b3\u30f3'}</label>
                    <input value={editing.icon} onChange={e => setEditing({ ...editing, icon: e.target.value })}
                      className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-center text-xl" maxLength={2} />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">{'\u30ab\u30c6\u30b4\u30ea'}</label>
                    <select value={editing.category} onChange={e => setEditing({ ...editing, category: e.target.value })}
                      className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm">
                      {categories.filter(c => c !== '\u3059\u3079\u3066').map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">{'\u8aac\u660e'}</label>
                <textarea value={editing.desc} onChange={e => setEditing({ ...editing, desc: e.target.value })}
                  rows={2} className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm resize-y" />
              </div>

              {/* Recommendations */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-medium text-gray-500">
                    {'\u63a8\u5968\u79d1\u76ee'} ({editing.recommendations.length}{'\u79d1\u76ee'})
                  </label>
                  <button onClick={() => setShowPicker(true)}
                    className="text-amber-600 hover:text-amber-800 text-xs font-medium">
                    + {'\u79d1\u76ee\u3092\u8ffd\u52a0'}
                  </button>
                </div>
                <div className="space-y-2">
                  {editing.recommendations.map((r, idx) => {
                    const s = getSyllabus(r.id);
                    return (
                      <div key={idx} className="bg-gray-50 rounded-lg px-3 py-2.5 flex items-start gap-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-400 font-mono">#{r.id}</span>
                            <span className="text-sm font-medium text-gray-900">{s?.name || `ID:${r.id}`}</span>
                            {s && <span className="text-xs text-gray-400">{s.quarter}</span>}
                          </div>
                          <input value={r.reason}
                            onChange={e => updateReason(idx, e.target.value)}
                            className="mt-1 w-full bg-white border border-gray-200 rounded px-2 py-1 text-xs"
                            placeholder={'\u63a8\u5968\u7406\u7531...'} />
                        </div>
                        <button onClick={() => removeRecommendation(idx)}
                          className="text-red-400 hover:text-red-600 text-sm flex-shrink-0 mt-1">{'\u2715'}</button>
                      </div>
                    );
                  })}
                </div>
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

      {/* Course Picker */}
      {showPicker && editing && (
        <CoursePicker
          currentIds={editing.recommendations.map(r => r.id)}
          onSelect={addRecommendation}
          onClose={() => setShowPicker(false)}
        />
      )}
    </div>
  );
}
