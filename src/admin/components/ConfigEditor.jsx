import { useState, useEffect } from 'react';
import { useAdminApi } from '../hooks/useAdminApi';

export default function ConfigEditor({ onToast }) {
  const { fetchConfig, saveConfig, syncSyllabus, loading } = useAdminApi();
  const [config, setConfig] = useState(null);
  const [syncResult, setSyncResult] = useState(null);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => { load(); }, []);

  async function load() {
    const data = await fetchConfig();
    if (data) setConfig(data);
  }

  async function handleSave() {
    const result = await saveConfig(config);
    if (result?.success) {
      onToast('\u8a2d\u5b9a\u3092\u4fdd\u5b58\u3057\u307e\u3057\u305f');
    } else {
      onToast('\u4fdd\u5b58\u306b\u5931\u6557\u3057\u307e\u3057\u305f', 'error');
    }
  }

  async function handleSync() {
    setSyncing(true);
    setSyncResult(null);
    const result = await syncSyllabus();
    setSyncing(false);
    if (result?.success) {
      setSyncResult(result.diff);
      onToast('\u30b7\u30e9\u30d0\u30b9\u3092\u540c\u671f\u3057\u307e\u3057\u305f');
    } else {
      onToast('\u540c\u671f\u306b\u5931\u6557\u3057\u307e\u3057\u305f', 'error');
    }
  }

  function update(key, value) {
    let finalValue = value;

    // スライドURLの場合、自動で /embed 形式に変換
    if (key === 'slidesEmbedUrl' && value.includes('/presentation/d/')) {
      const slideId = value.match(/\/d\/([^/]+)/)?.[1];
      if (slideId && !value.includes('/embed')) {
        finalValue = `https://docs.google.com/presentation/d/${slideId}/embed?start=false&loop=false&delayms=3000&rm=minimal`;
      }
    }
    // スプレッドシートURLの場合、IDのみを抽出
    if ((key === 'syllabusSheetId' || key === 'scheduleSheetId') && value.includes('/spreadsheets/d/')) {
      const sheetId = value.match(/\/d\/([^/]+)/)?.[1];
      if (sheetId) {
        finalValue = sheetId;
      }
    }

    setConfig({ ...config, [key]: finalValue });
  }

  if (!config) return <p className="text-gray-400 py-10 text-center">{'\u8aad\u307f\u8fbc\u307f\u4e2d...'}</p>;

  return (
    <div className="space-y-8">
      {/* Basic Settings */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h2 className="text-lg font-bold mb-4">{'\u57fa\u672c\u8a2d\u5b9a'}</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">{'\u5e74\u5ea6\u8868\u793a'}</label>
            <input value={config.academicYear || ''} onChange={e => update('academicYear', e.target.value)}
              className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm"
              placeholder="2026\u5e74\u5ea6" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">{'\u30ac\u30a4\u30c0\u30f3\u30b9\u30bf\u30a4\u30c8\u30eb'}</label>
            <input value={config.guidanceTitle || ''} onChange={e => update('guidanceTitle', e.target.value)}
              className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm"
              placeholder="2026\u5e74\u5ea6\u524d\u671f \u5c65\u4fee\u30ac\u30a4\u30c0\u30f3\u30b9" />
          </div>
        </div>
      </div>

      {/* Google Integration */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h2 className="text-lg font-bold mb-4">Google{'\u9023\u643a'}</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">ガイダンス資料 (GoogleスライドURL)</label>
            <input
              value={config.slidesEmbedUrl || ''}
              onChange={e => update('slidesEmbedUrl', e.target.value)}
              className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm font-mono text-xs"
              placeholder="https://docs.google.com/presentation/d/.../edit を貼り付け"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">シラバス原本 (GoogleスプレッドシートURL)</label>
            <input
              value={config.syllabusSheetId || ''}
              onChange={e => update('syllabusSheetId', e.target.value)}
              className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm font-mono text-xs"
              placeholder="https://docs.google.com/spreadsheets/d/.../edit を貼り付け"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">開講連絡情報 (GoogleスプレッドシートURL)</label>
            <input
              value={config.scheduleSheetId || ''}
              onChange={e => update('scheduleSheetId', e.target.value)}
              className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm font-mono text-xs"
              placeholder="https://docs.google.com/spreadsheets/d/.../edit を貼り付け"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button onClick={handleSave} disabled={loading}
          className="bg-amber-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-amber-700 disabled:opacity-50 transition-colors">
          {loading ? '\u4fdd\u5b58\u4e2d...' : '\u8a2d\u5b9a\u3092\u4fdd\u5b58\u3059\u308b'}
        </button>
      </div>

      {/* Syllabus Sync */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h2 className="text-lg font-bold mb-2">{'\u30b7\u30e9\u30d0\u30b9\u540c\u671f'}</h2>
        <p className="text-xs text-gray-500 mb-4">Google Spreadsheet{'\u304b\u3089\u30b7\u30e9\u30d0\u30b9\u30c7\u30fc\u30bf\u3092\u53d6\u5f97\u3057\u307e\u3059\u3002'}</p>
        <button onClick={handleSync} disabled={syncing}
          className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors">
          {syncing ? '\u540c\u671f\u4e2d...' : '\u30b7\u30e9\u30d0\u30b9\u3092\u540c\u671f\u3059\u308b'}
        </button>

        {/* Sync Result */}
        {syncResult && (
          <div className="mt-4 border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
              <p className="text-sm font-medium text-gray-800">
                {'\u540c\u671f\u7d50\u679c: '}{syncResult.totalAfter}{'\u4ef6\u53d6\u5f97'}
                {syncResult.totalBefore > 0 && ` (\u524d\u56de: ${syncResult.totalBefore}\u4ef6)`}
              </p>
            </div>
            <div className="p-4 space-y-3 text-sm">
              {syncResult.added.length > 0 && (
                <div>
                  <p className="text-green-600 font-medium mb-1">{'\u65b0\u898f\u8ffd\u52a0: '}{syncResult.added.length}{'\u4ef6'}</p>
                  {syncResult.added.map(name => (
                    <p key={name} className="text-xs text-gray-600 ml-4">+ {name}</p>
                  ))}
                </div>
              )}
              {syncResult.removed.length > 0 && (
                <div>
                  <p className="text-red-600 font-medium mb-1">{'\u524a\u9664: '}{syncResult.removed.length}{'\u4ef6'}</p>
                  {syncResult.removed.map(name => (
                    <p key={name} className="text-xs text-gray-600 ml-4">- {name}</p>
                  ))}
                </div>
              )}
              {syncResult.changed.length > 0 && (
                <div>
                  <p className="text-amber-600 font-medium mb-1">{'\u5909\u66f4\u3042\u308a: '}{syncResult.changed.length}{'\u4ef6'}</p>
                  {syncResult.changed.map(({ name, diffs }) => (
                    <div key={name} className="ml-4 mb-2">
                      <p className="text-xs font-medium text-gray-800">{name}</p>
                      {diffs.map((d, i) => (
                        <p key={i} className="text-xs text-gray-500 ml-4">
                          {d.field}: {'\u5909\u66f4\u3042\u308a'}
                        </p>
                      ))}
                    </div>
                  ))}
                </div>
              )}
              {syncResult.added.length === 0 && syncResult.removed.length === 0 && syncResult.changed.length === 0 && (
                <p className="text-gray-500">{'\u5909\u66f4\u306a\u3057'}</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
