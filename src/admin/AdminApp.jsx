import { useState } from 'react';
import FaqEditor from './components/FaqEditor';
import CareerEditor from './components/CareerEditor';
import ConfigEditor from './components/ConfigEditor';
import ValidationPanel from './components/ValidationPanel';
import SyllabusEditor from './components/SyllabusEditor';

const TABS = [
  { id: 'syllabus', label: '\u30b7\u30e9\u30d0\u30b9\u7de8\u96c6' },
  { id: 'faq', label: 'FAQ\u7de8\u96c6' },
  { id: 'career', label: '\u30ad\u30e3\u30ea\u30a2\u30de\u30c3\u30d7' },
  { id: 'config', label: '\u8a2d\u5b9a\u30fb\u5e74\u5ea6' },
  { id: 'validate', label: '\u30c7\u30fc\u30bf\u691c\u8a3c' },
];

export default function AdminApp() {
  const [tab, setTab] = useState('syllabus');
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      {/* Header */}
      <div className="bg-amber-600 text-white px-6 py-3 shadow-sm">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-bold">DHU Guidance Admin</h1>
            <span className="text-xs bg-amber-500 px-2 py-0.5 rounded">DEV MODE</span>
          </div>
          <a href="/" target="_blank" rel="noopener noreferrer"
            className="text-xs bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded transition-colors">
            {'\u5b66\u751f\u30dd\u30fc\u30bf\u30eb\u3092\u958b\u304f \u2192'}
          </a>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto flex">
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`px-5 py-3 text-sm font-medium transition-colors border-b-2 ${
                tab === t.id
                  ? 'border-amber-500 text-amber-700'
                  : 'border-transparent text-gray-500 hover:text-gray-800'
              }`}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto p-6">
        {tab === 'syllabus' && <SyllabusEditor onToast={showToast} />}
        {tab === 'faq' && <FaqEditor onToast={showToast} />}
        {tab === 'career' && <CareerEditor onToast={showToast} />}
        {tab === 'config' && <ConfigEditor onToast={showToast} />}
        {tab === 'validate' && <ValidationPanel />}
      </div>

      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-6 right-6 px-4 py-3 rounded-lg shadow-lg text-sm font-medium z-50 ${
          toast.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
        }`}>
          {toast.message}
        </div>
      )}
    </div>
  );
}
