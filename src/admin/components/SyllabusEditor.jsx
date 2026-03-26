import { useState, useEffect } from 'react';
import { useAdminApi } from '../hooks/useAdminApi';

export default function SyllabusEditor({ onToast }) {
  const { fetchSyllabi, saveSyllabi, loading } = useAdminApi();
  const [syllabi, setSyllabi] = useState([]);
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState(null);
  const [filteredList, setFilteredList] = useState([]);

  useEffect(() => { load(); }, []);

  async function load() {
    const data = await fetchSyllabi();
    setSyllabi(data || []);
  }

  useEffect(() => {
    const filtered = syllabi.filter(s => {
      const searchLower = search.toLowerCase();
      return (
        s.subject?.toLowerCase().includes(searchLower) ||
        s.title?.toLowerCase().includes(searchLower) ||
        s.instructor?.toLowerCase().includes(searchLower)
      );
    });
    setFilteredList(filtered);
  }, [search, syllabi]);

  async function saveEdit() {
    if (!editing.subject) {
      onToast('科目名は必須です', 'error');
      return;
    }
    const idx = syllabi.findIndex(s => s.subject === editing.subject && s.id === editing.id);
    let updated;
    if (idx >= 0) {
      updated = [...syllabi];
      updated[idx] = editing;
    } else {
      updated = [...syllabi, editing];
    }
    const result = await saveSyllabi(updated);
    if (result?.success) {
      onToast('保存しました');
      setSyllabi(updated);
      setEditing(null);
      load();
    } else {
      onToast('保存に失敗しました', 'error');
    }
  }

  const fields = [
    { key: 'subject', label: '科目名', type: 'text', required: true },
    { key: 'title', label: 'タイトル', type: 'text' },
    { key: 'term', label: '開講期', type: 'text' },
    { key: 'instructor', label: '担当教員', type: 'text' },
    { key: 'credits', label: '単位', type: 'text' },
    { key: 'format', label: '形式', type: 'text' },
    { key: 'overview', label: '授業概要', type: 'textarea' },
    { key: 'objectives', label: '到達目標', type: 'textarea' },
    { key: 'evaluation', label: '評価方法', type: 'textarea' },
    { key: 'textbook', label: '教科書', type: 'textarea' },
    { key: 'references', label: '参考文献', type: 'textarea' },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold">シラバス編集</h2>
      </div>

      {/* Search */}
      <div className="mb-4">
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="科目名で検索..."
          className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-400"
        />
      </div>

      {/* List */}
      <div className="space-y-2">
        {filteredList.map((s, idx) => (
          <div key={`${s.subject}-${idx}`} className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-gray-900">{s.subject}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {s.instructor && <span>{s.instructor}</span>}
                  {s.term && <span> / {s.term}</span>}
                </p>
                <p className="text-xs text-gray-400 mt-1 line-clamp-2">{s.overview}</p>
              </div>
              <div className="flex-shrink-0">
                <button
                  onClick={() => setEditing({ ...s })}
                  className="text-blue-600 hover:text-blue-800 px-3 py-1 text-sm font-medium"
                >
                  編集
                </button>
              </div>
            </div>
          </div>
        ))}
        {filteredList.length === 0 && (
          <p className="text-gray-400 text-center py-10">該当する科目がありません</p>
        )}
      </div>

      {/* Edit Modal */}
      {editing && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={() => setEditing(null)}
        >
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          <div
            className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-bold text-gray-900">
                {editing.subject} を編集
              </h3>
              <button
                onClick={() => setEditing(null)}
                className="text-gray-400 hover:text-gray-600 text-xl"
              >
                ✕
              </button>
            </div>

            <div className="px-6 py-5 space-y-4">
              {fields.map(field => (
                <div key={field.key}>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    {field.label}
                    {field.required && <span className="text-red-500">*</span>}
                  </label>
                  {field.type === 'textarea' ? (
                    <textarea
                      value={editing[field.key] || ''}
                      onChange={e => setEditing({ ...editing, [field.key]: e.target.value })}
                      rows={4}
                      className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm resize-y"
                    />
                  ) : (
                    <input
                      type="text"
                      value={editing[field.key] || ''}
                      onChange={e => setEditing({ ...editing, [field.key]: e.target.value })}
                      className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm"
                    />
                  )}
                </div>
              ))}
            </div>

            <div className="sticky bottom-0 bg-white px-6 py-4 border-t border-gray-100 flex justify-end gap-3">
              <button
                onClick={() => setEditing(null)}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
              >
                キャンセル
              </button>
              <button
                onClick={saveEdit}
                disabled={loading}
                className="bg-amber-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-amber-700 disabled:opacity-50 transition-colors"
              >
                {loading ? '保存中...' : '保存する'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
