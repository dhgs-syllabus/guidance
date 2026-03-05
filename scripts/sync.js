import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import * as xlsx from 'xlsx';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 開講スケジュールのスプレッドシート（XLSX書き出しURL）
const SCHEDULE_XLSX_URL = 'https://docs.google.com/spreadsheets/d/1-pFGe656VQiJoij2wP92jsEmA_edNen4OH7-0aMLcUQ/export?format=xlsx';
const OUTPUT_DIR = path.join(__dirname, '../src/data');

const TARGET_SHEETS = [
    '2026_1Q',
    '2026_2Q',
    '2026_夏季集中',
    '2026_3Q',
    '2026_4Q'
];

async function syncSchedule() {
    try {
        console.log(`Fetching schedule data from: ${SCHEDULE_XLSX_URL}`);
        const response = await fetch(SCHEDULE_XLSX_URL);

        if (!response.ok) {
            if (response.status === 401 || response.status === 403) {
                throw new Error(`\n\nエラー: アクセス権限がありません (${response.status} Unauthorized / Forbidden)。\nスプレッドシートの共有設定が「リンクを知っている全員が閲覧可」に設定されているか確認してください。\n\n`);
            }
            throw new Error(`HTTP error! status: ${response.status} ${response.statusText}`);
        }

        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const workbook = xlsx.read(buffer);

        let allRecords = [];

        for (const sheetName of TARGET_SHEETS) {
            if (workbook.SheetNames.includes(sheetName)) {
                console.log(`- Parsing sheet: ${sheetName}`);
                const sheet = workbook.Sheets[sheetName];
                const records = xlsx.utils.sheet_to_json(sheet, {
                    raw: false, // 日付などをフォーマットされた文字列として扱う
                    defval: '' // 空セルは空文字列とする
                });

                // シート名からクォーター名を抽出（例: "2026_1Q" -> "1Q", "2026_夏季集中" -> "夏季集中"）
                const quarter = sheetName.replace('2026_', '');

                records.forEach(row => {
                    // 曜日や科目名がない空行はスキップ
                    if (row['曜日'] && row['科目名']) {
                        allRecords.push({
                            Quarter: quarter,
                            ...row
                        });
                    }
                });
            } else {
                console.warn(`! Sheet not found: ${sheetName}`);
            }
        }

        // JSONファイルとして保存
        const outputPath = path.join(OUTPUT_DIR, 'schedule.json');
        fs.writeFileSync(outputPath, JSON.stringify(allRecords, null, 2), 'utf8');

        console.log(`\n✅ 開講スケジュールの同期が完了しました (計 ${allRecords.length} 件)\n出力先: ${outputPath}`);

    } catch (error) {
        console.error(`\n❌ 同期エラー: ${error.message}\n`);
        process.exit(1);
    }
}

// 実行
syncSchedule();
