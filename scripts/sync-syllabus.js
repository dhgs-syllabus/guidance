import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import * as xlsx from 'xlsx';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// シラバスのスプレッドシート（XLSX書き出しURL）
const SYLLABUS_XLSX_URLS = [
    'https://docs.google.com/spreadsheets/d/1w76UXScforLpsFiM-NgH0fugEDmKzKSE/export?format=xlsx',
    'https://docs.google.com/spreadsheets/d/1z171fJCIMySfNwgmVjRJy1LD5cKsztPR-h-S6IkAwGc/export?format=xlsx'
];
const OUTPUT_DIR = path.join(__dirname, '../src/data');

const IGNORE_SHEETS = [
    '表紙全体', '目次', '表紙修了課題',
    '■履修可能科目■', '履修不可科目', '（26新規登録）'
];

async function syncSyllabus() {
    try {
        let allSyllabi = [];

        // 複数のスプレッドシートから取得（後のものが優先されるように逆順で処理するか、単に後ろに追加）
        // ここでは単純に追加し、後で重複を排除する
        for (const url of SYLLABUS_XLSX_URLS) {
            console.log(`Fetching syllabus data from: ${url}`);
            const response = await fetch(url);

            if (!response.ok) {
                console.error(`HTTP error! status: ${response.status} for ${url}`);
                continue;
            }

            const arrayBuffer = await response.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            const workbook = xlsx.read(buffer);

            for (const sheetName of workbook.SheetNames) {
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

                if (syllabusData.subject) {
                    // 同名科目の場合は後のスプレッドシートのデータを優先（上書き）
                    const existingIndex = allSyllabi.findIndex(s => s.subject === syllabusData.subject);
                    if (existingIndex !== -1) {
                        allSyllabi[existingIndex] = syllabusData;
                    } else {
                        allSyllabi.push(syllabusData);
                    }
                }
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
