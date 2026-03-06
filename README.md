# DHU Graduate School 履修ガイダンスポータル

デジタルハリウッド大学大学院（DHU）の履修ガイダンス情報を一元化するWebポータルアプリケーション。

## 技術構成

- **フレームワーク**: React 19 + Vite 8
- **スタイリング**: Tailwind CSS v4（@tailwindcss/vite プラグイン）
- **データソース**: Google Spreadsheet（ID: `1w76UXScforLpsFiM-NgH0fugEDmKzKSE`）

## セットアップ

```bash
git clone <repo-url>
cd dhu-guidance
npm install
npm run dev
```

## 機能

| タブ | 内容 | 状態 |
|---|---|---|
| 📚 シラバス | 58科目の一覧・検索・詳細情報のモーダル表示（概要・目標・評価等） | ✅ |
| 📅 スケジュール | クォーター別（1Q〜4Q・集中）の曜日時限ごとの時間割一覧 | ✅ |
| ❓ FAQ | 14件のFAQ（カテゴリ別・アコーディオン表示） | ✅ |
| 🎯 キャリアマップ | 6つのキャリアパスと推奨科目表示 | ✅ |
| 💬 チャット | FAQ/シラバスのキーワードマッチング応答 | ✅（LLMなし） |
| 📋 ガイダンス | ガイダンス資料の表示 | 🔜 |

## プロジェクト構成

```
src/
├── App.jsx          # メインアプリケーション
├── data/
│   ├── syllabi.js   # シラバスデータ（58科目）
│   └── faqs.js      # FAQデータ（14件）
├── index.css        # Tailwind CSSエントリーポイント
└── main.jsx         # Reactエントリーポイント
```

## データソース

- **シラバス**: Google Spreadsheet（68シート、各科目ごと）
- **スプレッドシートID**: `1w76UXScforLpsFiM-NgH0fugEDmKzKSE`
