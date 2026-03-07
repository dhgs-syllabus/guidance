import { useState, useMemo } from "react";
import { SYLLABI, MODULES } from "./data/syllabi";
import { FAQS, FAQ_CATS } from "./data/faqs";
import { CAREERS, CAREER_CATEGORIES } from "./data/careers";
import config from "./data/config.json";

// クォータータブ定義
const QUARTER_TABS = [
  { id: "1Q", label: "1Q", quarter: "1Q" },
  { id: "2Q", label: "2Q", quarter: "2Q" },
  { id: "集中", label: "集中", quarter: "夏季集中" },
  { id: "3Q", label: "3Q", quarter: "3Q" },
  { id: "4Q", label: "4Q", quarter: "4Q" },
  { id: "修了課題", label: "修了課題", quarter: "通年" },
];

// 曜日グループ定義
const DAY_ORDER = ["月", "火", "水", "木", "金", "土"];
const DAY_LABELS = { "月": "月曜日", "火": "火曜日", "水": "水曜日", "木": "木曜日", "金": "金曜日", "土": "土曜日" };

// タグコンポーネント
const Tag = ({ label, color = "blue" }) => {
  const c = {
    blue: "bg-blue-50 text-blue-700 border-blue-200",
    green: "bg-green-50 text-green-700 border-green-200",
    purple: "bg-purple-50 text-purple-700 border-purple-200",
    amber: "bg-amber-50 text-amber-700 border-amber-200",
    red: "bg-red-50 text-red-700 border-red-200",
    gray: "bg-gray-100 text-gray-600 border-gray-200",
  }[color] || "bg-gray-100 text-gray-600 border-gray-200";
  return <span className={`text-xs px-2 py-0.5 rounded border font-medium ${c}`}>{label}</span>;
};

// 必修/選択のタグ色を返す
const typeColor = (type) => {
  if (type === "必修") return "red";
  if (type.includes("選択必修")) return "purple";
  return "blue";
};


// シラバス詳細モーダル
const SyllabusModal = ({ syllabus, onClose }) => {
  if (!syllabus) return null;
  const s = syllabus;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        {/* ヘッダー */}
        <div className="sticky top-0 bg-white/95 backdrop-blur border-b border-gray-100 px-6 py-4 flex items-start justify-between rounded-t-2xl">
          <div className="flex-1 pr-4">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <Tag label={s.type} color={typeColor(s.type)} />
              <Tag label={s.quarter} color="amber" />
              <Tag label={`${s.credits}単位`} color="green" />
              <Tag label={s.module} color="gray" />
            </div>
            <h2 className="text-lg font-bold text-gray-900">{s.name}</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none p-1 transition-colors">✕</button>
        </div>
        {/* 本文 */}
        <div className="px-6 py-5 space-y-5">
          {/* 基本情報 */}
          <div className="grid grid-cols-2 gap-3">
            <InfoRow label="担当教員" value={s.instructor} />
            <InfoRow label="曜日・時限" value={s.day !== "-" ? `${s.day}曜 ${s.period}` : "通年"} />
            <InfoRow label="授業形式" value={s.delivery} />
            <InfoRow label="定員" value={s.capacity ? `${s.capacity}名` : "制限なし"} />
            <InfoRow label="科目区分" value={s.type} />
            <InfoRow label="モジュール" value={s.module} />
          </div>

          {/* キーワード */}
          <div>
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">キーワード</h4>
            <div className="flex flex-wrap gap-1.5">
              {s.keywords.map(k => (
                <span key={k} className="text-xs bg-blue-50 text-blue-600 border border-blue-200 px-2.5 py-1 rounded-full">{k}</span>
              ))}
            </div>
          </div>

          {/* 概要 */}
          <div>
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">授業概要</h4>
            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{s.overview}</p>
          </div>

          {s.goals && (
            <div>
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">到達目標</h4>
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{s.goals}</p>
            </div>
          )}
          {s.evaluation && (
            <div>
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">評価方法</h4>
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{s.evaluation}</p>
            </div>
          )}
          {s.textbook && s.textbook !== "なし" && s.textbook !== "特になし" && (
            <div>
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">教科書</h4>
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{s.textbook}</p>
            </div>
          )}
          {s.references && s.references !== "なし" && s.references !== "特になし" && (
            <div>
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">参考文献</h4>
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{s.references}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// 情報行コンポーネント
const InfoRow = ({ label, value }) => (
  <div className="bg-gray-50 rounded-lg px-3 py-2">
    <span className="text-xs text-gray-400 block">{label}</span>
    <span className="text-sm text-gray-800 font-medium">{value}</span>
  </div>
);

export default function App() {
  const [tab, setTab] = useState("guidance");
  const [sylSearch, setSylSearch] = useState("");
  const [sylModule, setSylModule] = useState("すべて");
  const [sylSubTab, setSylSubTab] = useState("1Q");
  const [faqSearch, setFaqSearch] = useState("");
  const [faqCat, setFaqCat] = useState("すべて");
  const [openFaq, setOpenFaq] = useState(null);
  const [selectedCareer, setSelectedCareer] = useState(null);
  const [careerCat, setCareerCat] = useState("すべて");
  const [selectedSyllabus, setSelectedSyllabus] = useState(null);
  const [collapsedDays, setCollapsedDays] = useState({});

  // 現在のクォータータブに対応するquarter値
  const activeQuarter = QUARTER_TABS.find(t => t.id === sylSubTab)?.quarter;

  // シラバスのフィルタリング（クォータータブ + モジュール + 検索）
  const filteredSyl = SYLLABI.filter(s =>
    s.quarter === activeQuarter &&
    (sylModule === "すべて" || s.module === sylModule) &&
    (sylSearch === "" || s.name.includes(sylSearch) || s.instructor.includes(sylSearch) || s.keywords.some(k => k.includes(sylSearch)) || s.desc.includes(sylSearch))
  );

  // 各タブの科目数カウント
  const quarterCounts = useMemo(() => {
    const counts = {};
    for (const qt of QUARTER_TABS) {
      counts[qt.id] = SYLLABI.filter(s =>
        s.quarter === qt.quarter &&
        (sylModule === "すべて" || s.module === sylModule) &&
        (sylSearch === "" || s.name.includes(sylSearch) || s.instructor.includes(sylSearch) || s.keywords.some(k => k.includes(sylSearch)) || s.desc.includes(sylSearch))
      ).length;
    }
    return counts;
  }, [sylModule, sylSearch]);

  // 曜日ごとにグループ化
  const groupedByDay = useMemo(() => {
    const groups = {};
    for (const s of filteredSyl) {
      // 曜日が1文字（月〜土）ならそのまま、それ以外は「その他」
      const dayKey = DAY_ORDER.includes(s.day) ? s.day : "other";
      if (!groups[dayKey]) groups[dayKey] = [];
      groups[dayKey].push(s);
    }
    // DAY_ORDER順にソート、otherは末尾
    const sorted = {};
    for (const d of DAY_ORDER) {
      if (groups[d]) sorted[d] = groups[d];
    }
    if (groups["other"]) sorted["other"] = groups["other"];
    return sorted;
  }, [filteredSyl]);

  // FAQのフィルタリング
  const filteredFaq = FAQS.filter(f =>
    (faqCat === "すべて" || f.cat === faqCat) &&
    (f.q.includes(faqSearch) || f.a.includes(faqSearch))
  );

  // キャリアマップのフィルタリング
  const filteredCareers = careerCat === "すべて" ? CAREERS : CAREERS.filter(c => c.category === careerCat);
  const careerRecommendations = selectedCareer
    ? selectedCareer.recommendations.map(r => ({ ...r, course: SYLLABI.find(s => s.id === r.id) })).filter(r => r.course)
    : [];


  const tabs = [
    { id: "guidance", label: "📖 ガイダンス" },
    { id: "syllabus", label: "📚 シラバス" },
    { id: "career", label: "🎯 キャリアマップ" },
    { id: "faq", label: "❓ FAQ" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      {/* ヘッダー */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">DHU Graduate School</h1>
            <p className="text-xs text-gray-500 mt-0.5">デジタルハリウッド大学大学院 履修ガイダンスポータル</p>
          </div>
          <span className="text-xs bg-blue-50 text-blue-600 border border-blue-200 px-3 py-1 rounded-full font-medium">{config.academicYear}</span>
        </div>
      </div>

      {/* タブ */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto flex">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`px-5 py-3 text-sm font-medium transition-colors border-b-2 ${tab === t.id ? "border-blue-500 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-800"}`}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-5xl mx-auto p-6">

        {/* ===== ガイダンス資料 ===== */}
        {tab === "guidance" && (
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
            <div className="bg-gradient-to-r from-gray-50 to-white px-5 py-4 border-b border-gray-200">
              <h3 className="font-bold text-gray-800 text-base">{config.guidanceTitle}</h3>
              <p className="text-xs text-gray-500 mt-1">カリキュラムの全体像や修了要件についてはこちらのスライドをご確認ください。</p>
            </div>
            <div className="aspect-video w-full bg-gray-100 flex items-center justify-center">
              <iframe
                src={config.slidesEmbedUrl}
                frameBorder="0"
                width="100%"
                height="100%"
                allowFullScreen={true}
                title={config.guidanceTitle}
              ></iframe>
            </div>
          </div>
        )}

        {/* ===== シラバス ===== */}
        {tab === "syllabus" && (
          <div>
            {/* クォータータブ */}
            <div className="flex gap-1 mb-4 bg-gray-100 rounded-lg p-1">
              {QUARTER_TABS.map(qt => (
                <button key={qt.id} onClick={() => setSylSubTab(qt.id)}
                  className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-all ${
                    sylSubTab === qt.id
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-gray-500 hover:text-gray-800"
                  }`}>
                  {qt.label}
                  <span className={`ml-1.5 text-xs ${sylSubTab === qt.id ? "text-blue-400" : "text-gray-400"}`}>
                    {quarterCounts[qt.id]}
                  </span>
                </button>
              ))}
            </div>

            {/* 検索 + モジュールフィルタ */}
            <div className="flex gap-3 mb-2 flex-wrap">
              <input value={sylSearch} onChange={e => setSylSearch(e.target.value)}
                placeholder="科目名・教員名・キーワードで検索..."
                className="flex-1 min-w-[200px] bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 placeholder-gray-400" />
              <select value={sylModule} onChange={e => setSylModule(e.target.value)}
                className="bg-white border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-400 text-gray-600">
                {MODULES.map(m => <option key={m}>{m}</option>)}
              </select>
            </div>
            <p className="text-xs text-gray-400 mb-4">{filteredSyl.length}科目</p>

            {/* 曜日別グループ表示 */}
            <div className="space-y-3">
              {Object.entries(groupedByDay).map(([day, courses]) => (
                <div key={day} className="border border-gray-200 rounded-xl overflow-hidden bg-white">
                  <button
                    onClick={() => setCollapsedDays(prev => ({ ...prev, [day]: !prev[day] }))}
                    className="w-full flex items-center justify-between px-4 py-3 bg-gradient-to-r from-gray-50 to-white hover:from-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-700 text-sm">{DAY_LABELS[day] || "その他"}</span>
                      <span className="text-xs bg-blue-50 text-blue-600 border border-blue-200 px-2 py-0.5 rounded-full font-medium">
                        {courses.length}科目
                      </span>
                    </div>
                    <span className={`text-gray-400 text-sm transition-transform duration-200 ${collapsedDays[day] ? '' : 'rotate-180'}`}>▲</span>
                  </button>
                  {!collapsedDays[day] && (
                    <div className="grid gap-3 p-4 pt-2">
                      {courses.map(s => (
                        <div key={s.id} className="bg-white border border-gray-200 rounded-xl p-4 hover:border-blue-200 hover:shadow-sm transition-all cursor-pointer group"
                          onClick={() => setSelectedSyllabus(s)}>
                          <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 w-14 text-center pt-0.5">
                              {s.period && s.period !== "-" ? (
                                <div className="text-xs text-gray-500 font-medium">{s.period}</div>
                              ) : (
                                <div className="text-sm font-bold text-gray-400">-</div>
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1 flex-wrap">
                                <Tag label={s.type} color={typeColor(s.type)} />
                                <Tag label={`${s.credits}単位`} color="green" />
                                <Tag label={s.module} color="gray" />
                              </div>
                              <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">{s.name}</h3>
                              <p className="text-xs text-gray-500 mt-1">{s.instructor}{s.capacity ? ` ／ 定員${s.capacity}名` : ""} ／ {s.delivery}</p>
                              <p className="text-xs text-gray-500 mt-1 line-clamp-2">{s.desc}</p>
                              <div className="mt-2 flex flex-wrap gap-1.5">
                                {s.keywords.map(k => (
                                  <span key={k} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded cursor-pointer hover:bg-blue-50 hover:text-blue-600 transition-colors"
                                    onClick={(e) => { e.stopPropagation(); setSylSearch(k); }}>{k}</span>
                                ))}
                              </div>
                            </div>
                            <span className="text-xs text-gray-300 group-hover:text-blue-400 transition-colors mt-1">詳細 →</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              {filteredSyl.length === 0 && <p className="text-gray-400 text-center py-10">該当する科目が見つかりません</p>}
            </div>
          </div>
        )}

        {/* ===== FAQ ===== */}
        {tab === "faq" && (
          <div>
            <div className="flex gap-3 mb-5">
              <input value={faqSearch} onChange={e => setFaqSearch(e.target.value)}
                placeholder="キーワードで検索..."
                className="flex-1 bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-400 placeholder-gray-400" />
              <select value={faqCat} onChange={e => setFaqCat(e.target.value)}
                className="bg-white border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-400 text-gray-600">
                {FAQ_CATS.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="grid gap-2">
              {filteredFaq.map(f => (
                <div key={f.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:border-gray-300 transition-colors">
                  <button onClick={() => setOpenFaq(openFaq === f.id ? null : f.id)}
                    className="w-full text-left px-4 py-3.5 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded">{f.cat}</span>
                      <span className="text-sm text-gray-800">{f.q}</span>
                    </div>
                    <span className="text-gray-400 text-lg flex-shrink-0">{openFaq === f.id ? "−" : "+"}</span>
                  </button>
                  {openFaq === f.id && (
                    <div className="px-4 pb-4 pt-1 text-sm text-gray-600 leading-relaxed border-t border-gray-100 bg-gray-50">
                      {f.a.split(/(\[[^\]]+\]\([^)]+\))/).map((part, i) => {
                        const m = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
                        return m ? <a key={i} href={m[2]} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline hover:text-blue-800">{m[1]}</a> : part;
                      })}
                    </div>
                  )}
                </div>
              ))}
              {filteredFaq.length === 0 && <p className="text-gray-400 text-center py-10">該当するFAQが見つかりません</p>}
            </div>
          </div>
        )}


        {/* ===== キャリアマップ ===== */}
        {tab === "career" && (
          <div>
            <p className="text-gray-500 text-sm mb-4">目指すキャリアを選ぶと、推奨履修科目とその理由が表示されます。</p>

            {/* カテゴリフィルタ */}
            <div className="flex flex-wrap gap-2 mb-5">
              {CAREER_CATEGORIES.map(cat => (
                <button key={cat} onClick={() => { setCareerCat(cat); setSelectedCareer(null); }}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${careerCat === cat ? "bg-blue-500 text-white border-blue-500" : "bg-white text-gray-600 border-gray-300 hover:border-blue-300 hover:text-blue-600"}`}>
                  {cat}
                </button>
              ))}
            </div>

            {/* キャリアカード一覧 */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
              {filteredCareers.map(c => (
                <button key={c.title} onClick={() => setSelectedCareer(selectedCareer?.title === c.title ? null : c)}
                  className={`p-3.5 rounded-xl border text-left transition-all ${selectedCareer?.title === c.title ? "border-blue-400 bg-blue-50 shadow-md ring-1 ring-blue-200" : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"}`}>
                  <div className="text-2xl mb-1.5">{c.icon}</div>
                  <div className="font-semibold text-xs text-gray-900 leading-snug">{c.title}</div>
                  <div className="text-xs text-gray-400 mt-1 leading-relaxed line-clamp-2">{c.desc}</div>
                  <div className="mt-2">
                    <span className={`text-xs px-1.5 py-0.5 rounded border ${selectedCareer?.title === c.title ? "bg-blue-100 text-blue-600 border-blue-200" : "bg-gray-50 text-gray-400 border-gray-200"}`}>{c.category}</span>
                  </div>
                </button>
              ))}
            </div>

            {/* キャリア詳細モーダル */}
            {selectedCareer && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setSelectedCareer(null)}>
                <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
                <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                  <div className="sticky top-0 bg-white/95 backdrop-blur border-b border-gray-100 px-6 py-4 flex items-start justify-between rounded-t-2xl">
                    <div className="flex-1 pr-4">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-2xl">{selectedCareer.icon}</span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-200">{selectedCareer.category}</span>
                      </div>
                      <h2 className="text-lg font-bold text-gray-900">{selectedCareer.title}</h2>
                      <p className="text-sm text-gray-500 mt-1">{selectedCareer.desc}</p>
                    </div>
                    <button onClick={() => setSelectedCareer(null)} className="text-gray-400 hover:text-gray-600 text-2xl leading-none p-1 transition-colors">✕</button>
                  </div>
                  <div className="px-6 py-5">
                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">推奨履修科目（{careerRecommendations.length}科目）</h4>
                    <div className="grid gap-2">
                      {careerRecommendations.map(({ course: s, reason }) => (
                        <div key={s.id}
                          className="flex items-start gap-3 bg-gray-50 hover:bg-blue-50 rounded-lg px-4 py-3 cursor-pointer transition-colors group"
                          onClick={() => setSelectedSyllabus(s)}>
                          <span className="text-xs text-gray-400 font-mono w-8 mt-0.5 flex-shrink-0">{s.quarter}</span>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-sm text-gray-900 font-medium group-hover:text-blue-700 transition-colors">{s.name}</span>
                              <Tag label={s.type} color={typeColor(s.type)} />
                              <Tag label={`${s.credits}単位`} color="green" />
                            </div>
                            <p className="text-xs text-gray-500 mt-1">{reason}</p>
                          </div>
                          <span className="text-xs text-gray-300 group-hover:text-blue-400 mt-0.5 flex-shrink-0 transition-colors">詳細→</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* シラバス詳細モーダル */}
      <SyllabusModal syllabus={selectedSyllabus} onClose={() => setSelectedSyllabus(null)} />
    </div>
  );
}