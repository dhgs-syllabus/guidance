# DHU Graduate School 履修ガイダンスポータル

デジタルハリウッド大学大学院（DHU）の履修ガイダンス情報を一元化するWebポータルアプリケーション。

## 技術構成

- **フレームワーク**: React 19 + Vite 8
- **スタイリング**: Tailwind CSS v4（@tailwindcss/vite プラグイン）
- **データソース**: Google Spreadsheet + JSON
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
| 📚 シラバス | 58科目の一覧・検索・詳細情報のモーダル表示（概要・目標・評価等） | ✅ |
| 📅 スケジュール | クォーター別（1Q〜4Q・集中）の曜日時限ごとの時間割一覧 | ✅ |
| ❓ FAQ | 14件のFAQ（カテゴリ別・アコーディオン表示） | ✅ |
| 🎯 キャリアマップ | 6つのキャリアパスと推奨科目表示 | ✅ |
| 💬 チャット | FAQ/シラバスのキーワードマッチング応答 | ✅（LLMなし） |
| 📖 ガイダンス | Googleスライド埋め込み表示 | ✅ |

## プロジェクト構成

```
src/
├── App.jsx               # メインアプリケーション
├── admin/                # 管理画面
│   ├── pages/
│   │   ├── Admin.jsx    # 管理画面ページ
│   │   └── ConfigEditor.jsx
│   └── components/
├── data/
│   ├── config.json      # サイト設定（Google Sheets URL等）
│   ├── syllabi.json     # シラバスデータ（同期元）
│   └── schedule.json    # スケジュールデータ
├── index.css            # Tailwind CSSエントリーポイント
└── main.jsx             # Reactエントリーポイント
```

## データソース

- **シラバス**: Google Spreadsheet（自動同期）
- **スケジュール**: JSON ファイル
- **FAQ/その他**: JSON ファイル
- **設定**: `src/data/config.json`（Google Sheets/Slides URL管理）

### Google Spreadsheet 連携

`src/data/config.json` で以下を管理：
- `syllabusSheetId` - シラバス原本のシートID
- `slidesEmbedUrl` - ガイダンス資料のスライドURL

`npm run sync` で自動更新

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
