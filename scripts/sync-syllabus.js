import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import * as xlsx from 'xlsx';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// シラバスのスプレッドシート（XLSX書き出しURL）
const SYLLABUS_XLSX_URL = 'https://docs.google.com/spreadsheets/d/1w76UXScforLpsFiM-NgH0fugEDmKzKSE/export?format=xlsx';
const OUTPUT_DIR = path.join(__dirname, '../src/data');

const IGNORE_SHEETS = [
    '表紙全体', '目次', '表紙修了課題', '修了課題構想', '修了課題計画', '修了課題制作',
    '■履修可能科目■', '履修不可科目', '（26新規登録）'
];

async function syncSyllabus() {
    try {
        console.log(`Fetching syllabus data from: ${SYLLABUS_XLSX_URL}`);
        const response = await fetch(SYLLABUS_XLSX_URL);

        if (!response.ok) {
            if (response.status === 401 || response.status === 403) {
                throw new Error(`\n\nエラー: アクセス権限がありません (${response.status})。\n`);
            }
            throw new Error(`HTTP error! status: ${response.status} ${response.statusText}`);
        }

        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const workbook = xlsx.read(buffer);

        let allSyllabi = [];

        for (const sheetName of workbook.SheetNames) {
            // テンプレートシートや目次シートなどをスキップ
            if (IGNORE_SHEETS.includes(sheetName) || sheetName.startsWith('Template') || sheetName.includes('コピー')) {
                continue;
            }

            const sheet = workbook.Sheets[sheetName];
            const rows = xlsx.utils.sheet_to_json(sheet, { header: 1, raw: false, defval: '' });

            let syllabusData = {
                title: sheetName,
                subject: '',
                term: '',
                instructor: '',
                credits: '',
                format: '',
                overview: '',
                objectives: '',
                evaluation: '',
                textbook: '',
                references: ''
            };

            for (const row of rows) {
                if (!row || row.length < 2) continue;
                const key = String(row[0]).replace(/\s+/g, '');
                const value = String(row[1]).trim();

                if (key === '科目名') syllabusData.subject = value;
                if (key === '開講時期') syllabusData.term = value;
                if (key === '担当教員') syllabusData.instructor = value;
                if (key.includes('単位')) syllabusData.credits = value;
                if (key === '授業形式') syllabusData.format = value;
                if (key === '授業概要') syllabusData.overview = value;
                if (key === '到達目標') syllabusData.objectives = value;
                if (key === '成績評価方法と基準') syllabusData.evaluation = value;
                if (key === '教科書') syllabusData.textbook = value;
                if (key === '参考文献') syllabusData.references = value;
            }

            // 最低限「科目名」が取得できていれば有効なシラバスと判定
            if (syllabusData.subject) {
                allSyllabi.push(syllabusData);
            }
        }

        const outputPath = path.join(OUTPUT_DIR, 'syllabi.json');
        fs.writeFileSync(outputPath, JSON.stringify(allSyllabi, null, 2), 'utf8');

        console.log(`\n✅ シラバスの同期が完了しました (計 ${allSyllabi.length} 件)\n出力先: ${outputPath}`);

    } catch (error) {
        console.error(`\n❌ 同期エラー: ${error.message}\n`);
        process.exit(1);
    }
}

syncSyllabus();
