import { useState, useMemo } from 'react';
import SCHEDULE_DATA from '../data/schedule.json';

const dayOrder = { '月': 1, '火': 2, '水': 3, '木': 4, '金': 5, '土': 6, '日': 7 };

const formatDayPeriod = (str) => {
    if (!str) return "未定";
    return str.split(/[\n/]+/).map(part => {
        const dMatch = part.match(/^[月火水木金土日]+/);
        const tMatch = part.match(/\d+/g);
        if (dMatch && tMatch) {
            const d = dMatch[0].length === 1 ? dMatch[0] + '曜日' : dMatch[0] + '曜';
            const t = tMatch.join('-');
            return `${d} ${t}限`;
        }
        return part;
    }).join(' / ');
};

export default function ScheduleTab() {
    const [selectedItem, setSelectedItem] = useState(null);
    const [selectedQ, setSelectedQ] = useState("すべて");

    // 対象となるQのリストを取得
    const quarters = useMemo(() => {
        const qs = new Set(SCHEDULE_DATA.map(item => item.Quarter));
        return ["すべて", ...Array.from(qs)].filter(Boolean);
    }, []);

    // 曜日・時限順にソートして整理
    const filteredSchedule = useMemo(() => {
        let raw = [...SCHEDULE_DATA];
        if (selectedQ !== "すべて") {
            raw = raw.filter(item => item.Quarter === selectedQ);
        }
        return raw.sort((a, b) => {
            // Qごとのソートを追加
            const qOrder = { '1Q': 1, '2Q': 2, '夏季集中': 3, '3Q': 4, '4Q': 5 };
            const aQ = qOrder[a.Quarter] || 99;
            const bQ = qOrder[b.Quarter] || 99;
            if (aQ !== bQ) return aQ - bQ;

            // 「月7」「水78」「土34」などをパースしてソートする
            const getOrder = (str) => {
                if (!str) return 999;
                const dMatch = str.match(/[月火水木金土日]/);
                const tMatch = str.match(/\d/);
                const d = dMatch ? dayOrder[dMatch[0]] : 99;
                const t = tMatch ? parseInt(tMatch[0], 10) : 99;
                return d * 100 + t;
            };

            return getOrder(a['曜日']) - getOrder(b['曜日']);
        });
    }, [selectedQ]);

    // Qごとにグループ分け
    const groupedByQ = useMemo(() => {
        const groups = {};
        filteredSchedule.forEach(item => {
            const q = item.Quarter || 'その他';
            if (!groups[q]) groups[q] = [];
            groups[q].push(item);
        });
        return groups;
    }, [filteredSchedule]);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
                <p className="text-gray-500 text-sm">2026年度 開講スケジュール（全{filteredSchedule.length}件）</p>
                <div className="flex gap-2">
                    {quarters.map(q => (
                        <button
                            key={q}
                            onClick={() => setSelectedQ(q)}
                            className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-colors ${selectedQ === q ? 'bg-blue-500 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'}`}
                        >
                            {q}
                        </button>
                    ))}
                </div>
            </div>

            {/* スケジュール一覧 */}
            <div className="space-y-8">
                {Object.entries(groupedByQ).map(([q, items]) => (
                    <div key={q} className="space-y-4">
                        <h3 className="text-lg font-bold text-gray-800 border-b pb-2 flex items-center gap-2">
                            <span className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded">開講時期</span>
                            {q}
                            <span className="text-xs text-gray-400 font-normal ml-2">({items.length}件)</span>
                        </h3>
                        <div className="grid gap-4 md:grid-cols-2">
                            {items.map((item, idx) => (
                                <div
                                    key={idx}
                                    onClick={() => setSelectedItem(item)}
                                    className="bg-white border border-gray-200 rounded-xl p-5 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer group"
                                >
                                    <div className="flex items-start justify-between mb-3">
                                        <span className="text-sm font-bold bg-blue-50 text-blue-700 px-3 py-1 rounded-lg border border-blue-100 whitespace-pre-wrap">
                                            {formatDayPeriod(item['曜日'])}
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
                                    <span className="text-sm font-bold bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-100 whitespace-pre-wrap">
                                        {formatDayPeriod(selectedItem['曜日'])}
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
                            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 mb-4">
                                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 border-b pb-2">授業スケジュール・連絡内容</h4>
                                <div className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                                    {selectedItem['連絡内容'] || selectedItem['内容']}
                                </div>
                            </div>

                            {/* 備考情報（Zoomリンクなどがある場合） */}
                            {(selectedItem['Zoom'] || selectedItem['収録映像（BOX）']) && (
                                <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 space-y-3">
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
