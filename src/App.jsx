import { useState, useRef, useEffect, useMemo } from "react";
import { SYLLABI, MODULES, QUARTERS } from "./data/syllabi";
import { FAQS, FAQ_CATS } from "./data/faqs";

// 曜日の表示順序
const DAY_ORDER = ["月", "水", "金", "土", "集中", "-"];
const DAY_LABELS = { "月": "月曜日", "水": "水曜日", "金": "金曜日", "土": "土曜日", "集中": "集中講義", "-": "通年・その他" };
const DAY_ICONS = { "月": "🟦", "水": "🟩", "金": "🟧", "土": "🟪", "集中": "⚡", "-": "📅" };

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

// キャリアマップデータ（実際の科目系統に基づく）
const CAREERS = [
  { title: "コンテンツプロデューサー", icon: "🎬", desc: "デジタルコンテンツの企画・制作・運用を統括", skills: ["コンテンツマネジメント", "PR", "ビジネスプラン"], recommendedIds: [6, 10, 9, 19, 48] },
  { title: "UXデザイナー / クリエイティブディレクター", icon: "🎨", desc: "ユーザー体験とクリエイティブ表現の設計", skills: ["デザイン", "アートディレクション", "プロトタイピング"], recommendedIds: [1, 17, 18, 21, 44] },
  { title: "AIエンジニア / データサイエンティスト", icon: "🤖", desc: "AI・データを活用したシステム開発", skills: ["データサイエンス", "プログラミング", "機械学習"], recommendedIds: [11, 41, 51, 50, 16] },
  { title: "XR / メタバース開発者", icon: "🥽", desc: "VR/AR/MR技術で没入体験を創造", skills: ["XR開発", "リアルタイムCG", "空間設計"], recommendedIds: [53, 43, 40, 35, 21] },
  { title: "起業家 / ビジネスイノベーター", icon: "🚀", desc: "デジタル領域での新規事業創出", skills: ["ビジネスプランニング", "マーケティング", "事業設計"], recommendedIds: [9, 25, 8, 20, 7] },
  { title: "研究者 / アカデミア", icon: "📚", desc: "デジタルコンテンツ領域の学術研究", skills: ["論文執筆", "研究設計", "学会発表"], recommendedIds: [13, 3, 19, 49, 16] },
];

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
          {/* 概要 */}
          <div>
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">授業概要</h4>
            <p className="text-sm text-gray-700 leading-relaxed">{s.desc}</p>
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
          {/* 将来の拡張エリア（授業計画、到達目標、評価方法） */}
          {s.schedule && (
            <div>
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">授業計画</h4>
              <ol className="text-sm text-gray-700 space-y-1 list-decimal list-inside">
                {s.schedule.map((item, i) => <li key={i}>{item}</li>)}
              </ol>
            </div>
          )}
          {s.goals && (
            <div>
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">到達目標</h4>
              <p className="text-sm text-gray-700 leading-relaxed">{s.goals}</p>
            </div>
          )}
          {s.evaluation && (
            <div>
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">評価方法</h4>
              <p className="text-sm text-gray-700 leading-relaxed">{s.evaluation}</p>
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
  const [tab, setTab] = useState("syllabus");
  const [sylSearch, setSylSearch] = useState("");
  const [sylModule, setSylModule] = useState("すべて");
  const [sylQuarter, setSylQuarter] = useState("すべて");
  const [faqSearch, setFaqSearch] = useState("");
  const [faqCat, setFaqCat] = useState("すべて");
  const [openFaq, setOpenFaq] = useState(null);
  const [selectedCareer, setSelectedCareer] = useState(null);
  const [messages, setMessages] = useState([{ role: "assistant", content: "こんにちは！DHU大学院の履修について何でも聞いてください。シラバスやFAQの内容をもとに回答します。" }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);
  const [collapsedDays, setCollapsedDays] = useState({});
  const [selectedSyllabus, setSelectedSyllabus] = useState(null);

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  // シラバスのフィルタリング
  const filteredSyl = SYLLABI.filter(s =>
    (sylModule === "すべて" || s.module === sylModule) &&
    (sylQuarter === "すべて" || s.quarter === sylQuarter) &&
    (sylSearch === "" || s.name.includes(sylSearch) || s.instructor.includes(sylSearch) || s.keywords.some(k => k.includes(sylSearch)) || s.desc.includes(sylSearch))
  );

  // 曜日ごとにグループ化
  const groupedByDay = useMemo(() => {
    const groups = {};
    for (const day of DAY_ORDER) {
      const items = filteredSyl.filter(s => s.day === day);
      if (items.length > 0) groups[day] = items;
    }
    return groups;
  }, [filteredSyl]);

  const toggleDay = (day) => {
    setCollapsedDays(prev => ({ ...prev, [day]: !prev[day] }));
  };

  // FAQのフィルタリング
  const filteredFaq = FAQS.filter(f =>
    (faqCat === "すべて" || f.cat === faqCat) &&
    (f.q.includes(faqSearch) || f.a.includes(faqSearch))
  );

  // キャリアマップの推奨科目
  const careerCourses = selectedCareer ? SYLLABI.filter(s => selectedCareer.recommendedIds.includes(s.id)) : [];

  // チャット送信（APIキー未設定時はローカル応答）
  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput("");
    const newMsgs = [...messages, { role: "user", content: userMsg }];
    setMessages(newMsgs);
    setLoading(true);

    // ローカルFAQマッチング（API未設定時のフォールバック）
    const matched = FAQS.filter(f => userMsg.includes(f.q.slice(0, 5)) || f.q.includes(userMsg.slice(0, 5)) || f.a.includes(userMsg));
    const matchedSyl = SYLLABI.filter(s => userMsg.includes(s.name) || s.keywords.some(k => userMsg.includes(k)));

    let reply = "";
    if (matchedSyl.length > 0) {
      reply = matchedSyl.map(s => `📚 **${s.name}**\n${s.quarter} / ${s.day}${s.period} / ${s.instructor}\n${s.desc}`).join("\n\n");
    } else if (matched.length > 0) {
      reply = matched.map(f => `❓ ${f.q}\n→ ${f.a}`).join("\n\n");
    } else {
      reply = "申し訳ありません、該当する情報が見つかりませんでした。シラバスタブやFAQタブで直接検索してみてください。\n\n※AIチャット機能は現在準備中です。";
    }

    setTimeout(() => {
      setMessages([...newMsgs, { role: "assistant", content: reply }]);
      setLoading(false);
    }, 500);
  };

  const tabs = [
    { id: "syllabus", label: "📚 シラバス" },
    { id: "faq", label: "❓ FAQ" },
    { id: "career", label: "🎯 キャリアマップ" },
    { id: "chat", label: "💬 チャット" },
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
          <span className="text-xs bg-blue-50 text-blue-600 border border-blue-200 px-3 py-1 rounded-full font-medium">2026年度</span>
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

        {/* ===== シラバス ===== */}
        {tab === "syllabus" && (
          <div>
            <div className="flex gap-3 mb-2 flex-wrap">
              <input value={sylSearch} onChange={e => setSylSearch(e.target.value)}
                placeholder="科目名・教員名・キーワードで検索..."
                className="flex-1 min-w-[200px] bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 placeholder-gray-400" />
              <select value={sylQuarter} onChange={e => setSylQuarter(e.target.value)}
                className="bg-white border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-400 text-gray-600">
                {QUARTERS.map(q => <option key={q}>{q}</option>)}
              </select>
              <select value={sylModule} onChange={e => setSylModule(e.target.value)}
                className="bg-white border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-400 text-gray-600">
                {MODULES.map(m => <option key={m}>{m}</option>)}
              </select>
            </div>
            <p className="text-xs text-gray-400 mb-4">{filteredSyl.length}科目</p>

            {/* 曜日別グループ表示 */}
            <div className="space-y-4">
              {Object.entries(groupedByDay).map(([day, courses]) => (
                <div key={day} className="border border-gray-200 rounded-xl overflow-hidden bg-white">
                  {/* 曜日ヘッダー */}
                  <button
                    onClick={() => toggleDay(day)}
                    className="w-full flex items-center justify-between px-5 py-3.5 bg-gradient-to-r from-gray-50 to-white hover:from-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-lg">{DAY_ICONS[day]}</span>
                      <span className="font-semibold text-gray-800">{DAY_LABELS[day]}</span>
                      <span className="text-xs bg-blue-50 text-blue-600 border border-blue-200 px-2 py-0.5 rounded-full font-medium">
                        {courses.length}科目
                      </span>
                    </div>
                    <span className={`text-gray-400 text-sm transition-transform duration-200 ${collapsedDays[day] ? '' : 'rotate-180'}`}>▲</span>
                  </button>
                  {/* 科目リスト */}
                  {!collapsedDays[day] && (
                    <div className="grid gap-3 p-4 pt-2">
                      {courses.map(s => (
                        <div key={s.id} className="bg-white border border-gray-200 rounded-xl p-4 hover:border-blue-200 hover:shadow-sm transition-all cursor-pointer group"
                          onClick={() => setSelectedSyllabus(s)}>
                          <div className="flex items-start gap-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1 flex-wrap">
                                <Tag label={s.type} color={typeColor(s.type)} />
                                <Tag label={s.quarter} color="amber" />
                                <Tag label={`${s.credits}単位`} color="green" />
                                <Tag label={s.module} color="gray" />
                                {s.day !== "-" && <span className="text-xs text-gray-400">{s.day}{s.period}</span>}
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
                      {f.a}
                    </div>
                  )}
                </div>
              ))}
              {filteredFaq.length === 0 && <p className="text-gray-400 text-center py-10">該当するFAQが見つかりません</p>}
            </div>
          </div>
        )}

        {/* ===== チャット ===== */}
        {tab === "chat" && (
          <div className="flex flex-col" style={{ height: "calc(100vh - 230px)" }}>
            <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-1">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-xl px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${m.role === "user" ? "bg-blue-500 text-white" : "bg-white border border-gray-200 text-gray-700 shadow-sm"}`}>
                    {m.content}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-white border border-gray-200 px-4 py-3 rounded-2xl text-sm text-gray-400 shadow-sm">
                    考えています<span className="animate-pulse">...</span>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>
            <div className="flex gap-2">
              <input value={input} onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && sendMessage()}
                placeholder="質問を入力してください..."
                className="flex-1 bg-white border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 placeholder-gray-400 shadow-sm" />
              <button onClick={sendMessage} disabled={loading}
                className="bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white px-5 py-3 rounded-xl text-sm font-medium transition-colors shadow-sm">
                送信
              </button>
            </div>
          </div>
        )}

        {/* ===== キャリアマップ ===== */}
        {tab === "career" && (
          <div>
            <p className="text-gray-500 text-sm mb-5">目指すキャリアを選ぶと、推奨履修科目が表示されます。</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
              {CAREERS.map(c => (
                <button key={c.title} onClick={() => setSelectedCareer(selectedCareer?.title === c.title ? null : c)}
                  className={`p-4 rounded-xl border text-left transition-all ${selectedCareer?.title === c.title ? "border-blue-400 bg-blue-50 shadow-sm" : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"}`}>
                  <div className="text-2xl mb-2">{c.icon}</div>
                  <div className="font-semibold text-sm text-gray-900">{c.title}</div>
                  <div className="text-xs text-gray-500 mt-1">{c.desc}</div>
                </button>
              ))}
            </div>

            {selectedCareer && (
              <div className="bg-white border border-blue-200 rounded-xl p-5 shadow-sm">
                <h3 className="font-semibold text-blue-700 mb-3">{selectedCareer.icon} {selectedCareer.title} への推奨履修</h3>
                <div className="flex flex-wrap gap-2 mb-4">
                  {selectedCareer.skills.map(sk => (
                    <span key={sk} className="text-xs bg-blue-50 text-blue-600 border border-blue-200 px-2 py-1 rounded">{sk}</span>
                  ))}
                </div>
                <div className="grid gap-2">
                  {careerCourses.map(s => (
                    <div key={s.id} className="flex items-center gap-3 bg-gray-50 rounded-lg px-4 py-3">
                      <span className="text-xs text-gray-400 font-mono w-8">{s.quarter}</span>
                      <span className="text-sm text-gray-900 font-medium flex-1">{s.name}</span>
                      <Tag label={s.type} color={typeColor(s.type)} />
                      <Tag label={`${s.credits}単位`} color="green" />
                    </div>
                  ))}
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