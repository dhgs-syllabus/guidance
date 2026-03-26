import { useState, useEffect, useCallback } from 'react';
import FaqEditor from './components/FaqEditor';
import CareerEditor from './components/CareerEditor';
import ConfigEditor from './components/ConfigEditor';
import ValidationPanel from './components/ValidationPanel';
import SyllabusEditor from './components/SyllabusEditor';
import { useAdminApi } from './hooks/useAdminApi';

const TABS = [
  { id: 'syllabus', label: 'シラバス編集' },
  { id: 'faq', label: 'FAQ編集' },
  { id: 'career', label: 'キャリアマップ' },
  { id: 'config', label: '設定・年度' },
  { id: 'validate', label: 'データ検証' },
];

export default function AdminApp() {
  const [tab, setTab] = useState('syllabus');
  const [toast, setToast] = useState(null);
  const [gitChanges, setGitChanges] = useState(0);
  const [publishing, setPublishing] = useState(false);
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [commitMsg, setCommitMsg] = useState('コンテンツ更新');
  const { fetchGitStatus, gitPush } = useAdminApi();

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const checkGitStatus = useCallback(async () => {
    const status = await fetchGitStatus();
    if (status) setGitChanges(status.changed);
  }, [fetchGitStatus]);

  // Check git status periodically
  useEffect(() => {
    checkGitStatus();
    const interval = setInterval(checkGitStatus, 10000);
    return () => clearInterval(interval);
  }, [checkGitStatus]);

  const handlePublish = async () => {
    setPublishing(true);
    const result = await gitPush(commitMsg);
    setPublishing(false);
    setShowPublishModal(false);
    setCommitMsg('コンテンツ更新');

    if (result?.success) {
      if (result.skipped) {
        showToast('変更がありません');
      } else {
        showToast('公開サイトに反映しました！（約1分後に更新）');
        setGitChanges(0);
      }
    } else {
      showToast('公開に失敗しました: ' + (result?.error || '不明なエラー'), 'error');
    }
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
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowPublishModal(true)}
              className={`text-sm font-medium px-4 py-1.5 rounded transition-colors ${
                gitChanges > 0
                  ? 'bg-white text-amber-700 hover:bg-amber-50'
                  : 'bg-white/20 text-white/70 hover:bg-white/30'
              }`}
            >
              {gitChanges > 0 ? `公開する（${gitChanges}件の変更）` : '公開する'}
            </button>
            <a href="/" target="_blank" rel="noopener noreferrer"
              className="text-xs bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded transition-colors">
              {'学生ポータルを開く →'}
            </a>
          </div>
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

      {/* Publish Modal */}
      {showPublishModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setShowPublishModal(false)}>
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full" onClick={e => e.stopPropagation()}>
            <div className="px-6 py-5">
              <h3 className="font-bold text-gray-900 text-lg mb-1">公開サイトに反映</h3>
              <p className="text-sm text-gray-500 mb-4">
                変更内容を GitHub に push して公開サイトを更新します。
                <br />push 後、約1分で反映されます。
              </p>
              <label className="block text-xs font-medium text-gray-500 mb-1">コミットメッセージ</label>
              <input
                type="text"
                value={commitMsg}
                onChange={e => setCommitMsg(e.target.value)}
                placeholder="例: シラバス更新"
                className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-400"
              />
            </div>
            <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3">
              <button
                onClick={() => setShowPublishModal(false)}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
              >
                キャンセル
              </button>
              <button
                onClick={handlePublish}
                disabled={publishing}
                className="bg-amber-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-amber-700 disabled:opacity-50 transition-colors"
              >
                {publishing ? '公開中...' : '公開する'}
              </button>
            </div>
          </div>
        </div>
      )}

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
