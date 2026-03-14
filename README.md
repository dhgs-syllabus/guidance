# DHU Graduate School 履修ガイダンスポータル

デジタルハリウッド大学大学院（DHU）の履修ガイダンス情報を一元化するWebポータルアプリケーション。

## 技術構成

- **フレームワーク**: React 19 + Vite 8
- **スタイリング**: Tailwind CSS v4（@tailwindcss/vite プラグイン）
- **データソース**: Google Spreadsheet + JSON / JS
- **ホスティング**: Vercel（パスワード保護）

## セットアップ

```bash
git clone https://github.com/noball777/dhu-guidance.git
cd dhu-guidance
npm install
npm run dev
```

開発サーバーは `http://localhost:5173` で起動します。

### 管理画面

```bash
npm run admin
```

Google Spreadsheet の内容を同期：

```bash
npm run sync
npm run sync-syllabus
```

## 機能

| タブ | 内容 | 状態 |
|---|---|---|
| 📖 ガイダンス | Googleスライド埋め込み表示 | ✅ |
| 📚 シラバス | 58科目の一覧・検索・詳細情報のモーダル表示（概要・目標・評価等） | ✅ |
| 🎯 キャリアマップ | 20キャリアパスと推奨科目表示 | ✅ |
| ❓ FAQ | 14件のFAQ（カテゴリ別・アコーディオン表示） | ✅ |
| 📅 スケジュール | クォーター別（1Q〜4Q・集中）の曜日時限ごとの時間割一覧 | ⏳ 開発中 |
| 💬 チャット | FAQ/シラバスのキーワードマッチング応答 | ⏳ 開発中 |

## プロジェクト構成

```
src/
├── App.jsx               # メインアプリケーション（学生ポータル）
├── index.css             # Tailwind CSSエントリーポイント
├── main.jsx              # Reactエントリーポイント（学生ポータル）
├── admin/                # 管理画面
│   ├── AdminApp.jsx      # 管理画面ルートコンポーネント
│   ├── admin-main.jsx    # 管理画面エントリーポイント
│   ├── components/
│   │   ├── CareerEditor.jsx    # キャリアマップ編集
│   │   ├── ConfigEditor.jsx    # 設定・年度管理
│   │   ├── CoursePicker.jsx    # 科目選択ダイアログ
│   │   ├── FaqEditor.jsx       # FAQ編集
│   │   └── ValidationPanel.jsx # データ検証
│   └── hooks/
│       └── useAdminApi.js      # 管理APIフック
└── data/
    ├── config.json       # サイト設定（Google Sheets URL等）
    ├── syllabi.js        # シラバス静的データ + syllabi.json のマージ
    ├── syllabi.json      # シラバス詳細データ（npm run sync-syllabus で更新）
    ├── faqs.js           # FAQデータ（手動管理）
    └── careers.js        # キャリアマップデータ（手動管理）
```

## データソース

すべてのデータソース情報は `src/data/config.json` で一元管理します。

### Google Spreadsheet 連携

`src/data/config.json` で管理：
- `syllabusSheetId` - シラバス原本（58科目）
- `scheduleSheetId` - スケジュール・開講連絡情報
- `slidesEmbedUrl` - ガイダンス資料（Googleスライド）

`npm run sync` で開講スケジュールを同期、`npm run sync-syllabus` でシラバス詳細を同期。

### データファイル

| ファイル | 内容 | 更新方法 |
|---|---|---|
| `src/data/syllabi.json` | シラバス詳細データ | `npm run sync-syllabus` で自動更新 |
| `src/data/syllabi.js` | シラバス一覧（静的） + JSON マージ | 手動管理 |
| `src/data/faqs.js` | FAQ | 手動管理（管理画面から編集可） |
| `src/data/careers.js` | キャリアマップ | 手動管理（管理画面から編集可） |

## デプロイ

### Vercel（推奨・無料）

GitHub 連携で自動デプロイ。パスワード保護対応。

1. [Vercel](https://vercel.com) に GitHub で登録
2. このリポジトリを接続
3. `vercel.json` でパスワード設定

### ビルド

```bash
npm run build
```

`dist/` フォルダが生成されます。
