import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { parse } from 'csv-parse/sync';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 開講スケジュールのスプレッドシート（CSV書き出しURL）
const SCHEDULE_CSV_URL = 'https://docs.google.com/spreadsheets/d/1-pFGe656VQiJoij2wP92jsEmA_edNen4OH7-0aMLcUQ/export?format=csv';

const OUTPUT_DIR = path.join(__dirname, '../src/data');

async function fetchCSV(url) {
    console.log(`Fetching data from: ${url}`);
    const response = await fetch(url);

    if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
            throw new Error(`\n\nエラー: アクセス権限がありません (${response.status} Unauthorized / Forbidden)。\nスプレッドシートの共有設定が「リンクを知っている全員が閲覧可」に設定されているか確認してください。\n\n`);
        }
        throw new Error(`HTTP error! status: ${response.status} ${response.statusText}`);
    }

    return await response.text();
}

async function syncSchedule() {
    try {
        const csvData = await fetchCSV(SCHEDULE_CSV_URL);

        // CSVをパース
        const records = parse(csvData, {
            columns: true, // 1行目をヘッダーとして扱う
            skip_empty_lines: true
        });

        // JSONファイルとして保存
        const outputPath = path.join(OUTPUT_DIR, 'schedule.json');
        fs.writeFileSync(outputPath, JSON.stringify(records, null, 2), 'utf8');

        console.log(`\n✅ 開講スケジュールの同期が完了しました (${records.length} 件)\n出力先: ${outputPath}`);

    } catch (error) {
        console.error(`\n❌ 同期エラー: ${error.message}\n`);
        process.exit(1);
    }
}

// 実行
syncSchedule();
