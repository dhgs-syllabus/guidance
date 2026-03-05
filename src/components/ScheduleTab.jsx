import { useState, useMemo } from 'react';
import SCHEDULE_DATA from '../data/schedule.json';

const DAY_PERIOD_ORDER = [
    "月1", "月2", "月3", "月4", "月5", "月6", "月7", "月8",
    "火1", "火2", "火3", "火4", "火5", "火6", "火7", "火8",
    "水1", "水2", "水3", "水4", "水5", "水6", "水7", "水8",
    "木1", "木2", "木3", "木4", "木5", "木6", "木7", "木8",
    "金1", "金2", "金3", "金4", "金5", "金6", "金7", "金8",
    "土1", "土2", "土3", "土4", "土5", "土6", "土7", "土8",
];

export default function ScheduleTab() {
    const [selectedItem, setSelectedItem] = useState(null);

    // 曜日・時限順にソートして整理
    const sortedSchedule = useMemo(() => {
        return [...SCHEDULE_DATA].sort((a, b) => {
            const idxA = DAY_PERIOD_ORDER.indexOf(a['曜日']);
            const idxB = DAY_PERIOD_ORDER.indexOf(b['曜日']);
            if (idxA === -1 && idxB === -1) return 0;
            if (idxA === -1) return 1;
            if (idxB === -1) return -1;
            return idxA - idxB;
        });
    }, []);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <p className="text-gray-500 text-sm">2026年度 開講スケジュール（全{sortedSchedule.length}件）</p>
            </div>

            {/* スケジュール一覧 */}
            <div className="grid gap-4 md:grid-cols-2">
                {sortedSchedule.map((item, idx) => (
                    <div
                        key={idx}
                        onClick={() => setSelectedItem(item)}
                        className="bg-white border border-gray-200 rounded-xl p-5 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer group"
                    >
                        <div className="flex items-start justify-between mb-3">
                            <span className="text-sm font-bold bg-blue-50 text-blue-700 px-3 py-1 rounded-lg border border-blue-100">
                                {item['曜日']}
                            </span>
                            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                {item['教室'] || '未定'}
                            </span>
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                            {item['科目名']}
                        </h3>
                        <p className="text-sm text-gray-600 mt-2 flex items-center gap-1">
                            <span className="text-gray-400">👤</span> {item['担当教員']}
                        </p>
                    </div>
                ))}
            </div>

            {/* 詳細モーダル */}
            {selectedItem && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 min-h-screen" onClick={() => setSelectedItem(null)}>
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
                    <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
                        {/* ヘッダー */}
                        <div className="bg-white border-b border-gray-100 px-6 py-4 flex flex-col gap-2 shrink-0">
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-bold bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-100">
                                        {selectedItem['曜日']}
                                    </span>
                                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                                        {selectedItem['教室'] || '未定'}
                                    </span>
                                </div>
                                <button onClick={() => setSelectedItem(null)} className="text-gray-400 hover:text-gray-600 text-2xl leading-none p-1 transition-colors">✕</button>
                            </div>
                            <h2 className="text-xl font-bold text-gray-900">{selectedItem['科目名']}</h2>
                            <p className="text-sm text-gray-600 flex items-center gap-1">
                                <span className="text-gray-400">👤</span> {selectedItem['担当教員']}
                            </p>
                        </div>

                        {/* 詳細コンテンツ（スクロール領域） */}
                        <div className="p-6 overflow-y-auto bg-gray-50 h-full">
                            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 border-b pb-2">授業スケジュール・連絡内容</h4>
                                <div className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                                    {selectedItem['連絡内容']}
                                </div>
                            </div>

                            {/* 備考情報（Zoomリンクなどがある場合） */}
                            {(selectedItem['Zoom'] || selectedItem['収録映像（BOX）']) && (
                                <div className="mt-4 bg-white rounded-xl p-5 shadow-sm border border-gray-100 space-y-3">
                                    {selectedItem['Zoom'] && (
                                        <div>
                                            <span className="text-xs text-gray-500 block mb-1">Zoom URL</span>
                                            <a href={selectedItem['Zoom']} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline break-all">
                                                {selectedItem['Zoom']}
                                            </a>
                                        </div>
                                    )}
                                    {selectedItem['収録映像（BOX）'] && (
                                        <div>
                                            <span className="text-xs text-gray-500 block mb-1">収録映像（BOX）</span>
                                            <a href={selectedItem['収録映像（BOX）']} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline break-all">
                                                {selectedItem['収録映像（BOX）']}
                                            </a>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
