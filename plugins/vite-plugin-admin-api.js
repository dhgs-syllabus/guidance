import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

const ROOT = path.resolve(import.meta.dirname, '..');
const DATA_DIR = path.join(ROOT, 'src', 'data');
const BACKUP_DIR = path.join(ROOT, '.backup');

// === Body Parser ===
function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try { resolve(JSON.parse(body)); }
      catch (e) { reject(e); }
    });
    req.on('error', reject);
  });
}

function sendJson(res, data, status = 200) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(data));
}

// === Backup ===
function backup(filePath) {
  if (!fs.existsSync(filePath)) return;
  if (!fs.existsSync(BACKUP_DIR)) fs.mkdirSync(BACKUP_DIR, { recursive: true });
  const name = path.basename(filePath);
  const ts = new Date().toISOString().replace(/[:.]/g, '-');
  fs.copyFileSync(filePath, path.join(BACKUP_DIR, `${name}.${ts}.bak`));
}

// === Parsers: .js → JSON ===

function parseFaqs() {
  const content = fs.readFileSync(path.join(DATA_DIR, 'faqs.js'), 'utf8');
  const cleaned = content.replace(/^export\s+const\s+/gm, 'const ');
  const fn = new Function(cleaned + '\nreturn { FAQS, FAQ_CATS };');
  return fn();
}

function parseCareers() {
  const content = fs.readFileSync(path.join(DATA_DIR, 'careers.js'), 'utf8');
  const cleaned = content.replace(/^export\s+const\s+/gm, 'const ');
  const fn = new Function(cleaned + '\nreturn { CAREERS, CAREER_CATEGORIES };');
  return fn();
}

function parseSyllabi() {
  const content = fs.readFileSync(path.join(DATA_DIR, 'syllabi.js'), 'utf8');
  // Extract STATIC_SYLLABI array
  const match = content.match(/const STATIC_SYLLABI\s*=\s*(\[[\s\S]*?\n\];)/);
  if (!match) return [];
  const fn = new Function('return ' + match[1]);
  return fn();
}

function readConfig() {
  const configPath = path.join(DATA_DIR, 'config.json');
  return JSON.parse(fs.readFileSync(configPath, 'utf8'));
}

// === Serializers: JSON → .js ===

function serializeFaqs({ FAQS, FAQ_CATS }) {
  let out = '// DHU\u5927\u5b66\u9662 FAQ \u30c7\u30fc\u30bf\n\n';
  out += 'export const FAQS = [\n';
  for (const f of FAQS) {
    out += `    { id: ${f.id}, cat: ${JSON.stringify(f.cat)}, q: ${JSON.stringify(f.q)}, a: ${JSON.stringify(f.a)} },\n`;
  }
  out += '];\n\n';
  out += `export const FAQ_CATS = ${JSON.stringify(FAQ_CATS)};\n`;
  return out;
}

function serializeCareers({ CAREERS, CAREER_CATEGORIES }) {
  let out = '// DHU\u5927\u5b66\u9662 \u30ad\u30e3\u30ea\u30a2\u30de\u30c3\u30d7\u30c7\u30fc\u30bf\n\n';
  out += `export const CAREER_CATEGORIES = ${JSON.stringify(CAREER_CATEGORIES)};\n\n`;
  out += 'export const CAREERS = [\n';

  let currentCat = null;
  for (const c of CAREERS) {
    if (c.category !== currentCat) {
      currentCat = c.category;
      out += `  // ===== ${currentCat} =====\n`;
    }
    out += '  {\n';
    out += `    title: ${JSON.stringify(c.title)},\n`;
    out += `    icon: ${JSON.stringify(c.icon)},\n`;
    out += `    category: ${JSON.stringify(c.category)},\n`;
    out += `    desc: ${JSON.stringify(c.desc)},\n`;
    out += '    recommendations: [\n';
    for (const r of c.recommendations) {
      out += `      { id: ${r.id}, reason: ${JSON.stringify(r.reason)} },\n`;
    }
    out += '    ],\n';
    out += '  },\n';
  }
  out += '];\n';
  return out;
}

// === Validator ===

function validate() {
  const results = [];
  const ok = (msg) => results.push({ level: 'ok', message: msg });
  const warn = (msg) => results.push({ level: 'warn', message: msg });
  const error = (msg) => results.push({ level: 'error', message: msg });

  try {
    const { FAQS, FAQ_CATS } = parseFaqs();
    const { CAREERS, CAREER_CATEGORIES } = parseCareers();
    const syllabi = parseSyllabi();
    const syllabiIds = new Set(syllabi.map(s => s.id));

    // FAQ checks
    const faqIds = FAQS.map(f => f.id);
    if (new Set(faqIds).size === faqIds.length) ok('FAQ: ID\u306e\u91cd\u8907\u306a\u3057');
    else error('FAQ: ID\u304c\u91cd\u8907\u3057\u3066\u3044\u307e\u3059');

    const faqMissing = FAQS.filter(f => !f.id || !f.cat || !f.q || !f.a);
    if (faqMissing.length === 0) ok('FAQ: \u5168\u30a8\u30f3\u30c8\u30ea\u306b\u5fc5\u9808\u30d5\u30a3\u30fc\u30eb\u30c9\u304c\u5b58\u5728');
    else error(`FAQ: ${faqMissing.length}\u4ef6\u306e\u30a8\u30f3\u30c8\u30ea\u306b\u5fc5\u9808\u30d5\u30a3\u30fc\u30eb\u30c9\u304c\u6b20\u843d`);

    const faqCatsUsed = new Set(FAQS.map(f => f.cat));
    for (const cat of faqCatsUsed) {
      if (cat !== '\u3059\u3079\u3066' && !FAQ_CATS.includes(cat)) {
        error(`FAQ: \u30ab\u30c6\u30b4\u30ea "${cat}" \u304c FAQ_CATS \u306b\u5b58\u5728\u3057\u307e\u305b\u3093`);
      }
    }

    // Career checks
    const careerMissing = CAREERS.filter(c => !c.title || !c.icon || !c.category || !c.desc);
    if (careerMissing.length === 0) ok('\u30ad\u30e3\u30ea\u30a2: \u5168\u30d1\u30b9\u306b\u5fc5\u9808\u30d5\u30a3\u30fc\u30eb\u30c9\u304c\u5b58\u5728');
    else error(`\u30ad\u30e3\u30ea\u30a2: ${careerMissing.length}\u4ef6\u306e\u30d1\u30b9\u306b\u5fc5\u9808\u30d5\u30a3\u30fc\u30eb\u30c9\u304c\u6b20\u843d`);

    for (const c of CAREERS) {
      if (!CAREER_CATEGORIES.includes(c.category)) {
        error(`\u30ad\u30e3\u30ea\u30a2: "${c.title}" \u306e\u30ab\u30c6\u30b4\u30ea "${c.category}" \u304c\u672a\u5b9a\u7fa9`);
      }
      for (const r of c.recommendations) {
        if (!syllabiIds.has(r.id)) {
          error(`\u30ad\u30e3\u30ea\u30a2: "${c.title}" \u306e\u63a8\u5968\u79d1\u76ee id:${r.id} \u304c\u30b7\u30e9\u30d0\u30b9\u306b\u5b58\u5728\u3057\u307e\u305b\u3093`);
        }
      }
      if (c.recommendations.length === 0) {
        warn(`\u30ad\u30e3\u30ea\u30a2: "${c.title}" \u306b\u63a8\u5968\u79d1\u76ee\u304c\u3042\u308a\u307e\u305b\u3093`);
      }
    }

    // Config checks
    const cfg = readConfig();
    if (cfg.academicYear) ok('\u8a2d\u5b9a: academicYear\u304c\u8a2d\u5b9a\u6e08\u307f');
    else error('\u8a2d\u5b9a: academicYear\u304c\u672a\u8a2d\u5b9a');
    if (cfg.slidesEmbedUrl) ok('\u8a2d\u5b9a: slidesEmbedUrl\u304c\u8a2d\u5b9a\u6e08\u307f');
    else warn('\u8a2d\u5b9a: slidesEmbedUrl\u304c\u672a\u8a2d\u5b9a');

    // Syllabus ID uniqueness
    if (syllabiIds.size === syllabi.length) ok('\u30b7\u30e9\u30d0\u30b9: \u5168\u79d1\u76ee\u306bID\u304c\u5b58\u5728\u3057\u91cd\u8907\u306a\u3057');
    else error('\u30b7\u30e9\u30d0\u30b9: ID\u304c\u91cd\u8907\u3057\u3066\u3044\u307e\u3059');

  } catch (e) {
    error(`\u691c\u8a3c\u5b9f\u884c\u4e2d\u306b\u30a8\u30e9\u30fc: ${e.message}`);
  }
  return results;
}

// === Vite Plugin ===

export function dhuAdminApi() {
  return {
    name: 'dhu-admin-api',
    configureServer(server) {
      // Data endpoints
      server.middlewares.use(async (req, res, next) => {
        try {
          // GET /api/data/:name
          const dataMatch = req.url.match(/^\/api\/data\/([a-z-]+)$/);
          if (dataMatch && req.method === 'GET') {
            const name = dataMatch[1];
            if (name === 'faqs') return sendJson(res, parseFaqs());
            if (name === 'careers') return sendJson(res, parseCareers());
            return sendJson(res, { error: `Unknown data: ${name}` }, 404);
          }

          // POST /api/data/:name
          if (dataMatch && req.method === 'POST') {
            const name = dataMatch[1];
            const body = await parseBody(req);

            if (name === 'faqs') {
              const filePath = path.join(DATA_DIR, 'faqs.js');
              backup(filePath);
              fs.writeFileSync(filePath, serializeFaqs(body), 'utf8');
              return sendJson(res, { success: true });
            }
            if (name === 'careers') {
              const filePath = path.join(DATA_DIR, 'careers.js');
              backup(filePath);
              fs.writeFileSync(filePath, serializeCareers(body), 'utf8');
              return sendJson(res, { success: true });
            }
            return sendJson(res, { error: `Unknown data: ${name}` }, 404);
          }

          // GET /api/config
          if (req.url === '/api/config' && req.method === 'GET') {
            return sendJson(res, readConfig());
          }

          // POST /api/config
          if (req.url === '/api/config' && req.method === 'POST') {
            const body = await parseBody(req);
            const configPath = path.join(DATA_DIR, 'config.json');
            backup(configPath);
            fs.writeFileSync(configPath, JSON.stringify(body, null, 2) + '\n', 'utf8');
            return sendJson(res, { success: true });
          }

          // GET /api/syllabi (read-only)
          if (req.url === '/api/syllabi' && req.method === 'GET') {
            return sendJson(res, parseSyllabi());
          }

          // POST /api/sync-syllabus
          if (req.url === '/api/sync-syllabus' && req.method === 'POST') {
            const jsonPath = path.join(DATA_DIR, 'syllabi.json');
            const before = fs.existsSync(jsonPath) ? JSON.parse(fs.readFileSync(jsonPath, 'utf8')) : [];
            try {
              execSync('node scripts/sync-syllabus.js', { cwd: ROOT, timeout: 60000 });
              const after = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
              // Compute diff
              const diff = computeSyllabiDiff(before, after);
              return sendJson(res, { success: true, diff });
            } catch (e) {
              return sendJson(res, { success: false, error: e.message }, 500);
            }
          }

          // GET /api/validate
          if (req.url === '/api/validate' && req.method === 'GET') {
            return sendJson(res, validate());
          }

          next();
        } catch (e) {
          sendJson(res, { error: e.message }, 500);
        }
      });
    }
  };
}

function computeSyllabiDiff(before, after) {
  const beforeMap = new Map(before.map(s => [s.subject || s.title, s]));
  const afterMap = new Map(after.map(s => [s.subject || s.title, s]));

  const added = [];
  const removed = [];
  const changed = [];

  for (const [name, data] of afterMap) {
    if (!beforeMap.has(name)) {
      added.push(name);
    } else {
      const old = beforeMap.get(name);
      const diffs = [];
      for (const key of Object.keys(data)) {
        if (JSON.stringify(old[key]) !== JSON.stringify(data[key])) {
          diffs.push({ field: key, before: old[key], after: data[key] });
        }
      }
      if (diffs.length > 0) changed.push({ name, diffs });
    }
  }
  for (const name of beforeMap.keys()) {
    if (!afterMap.has(name)) removed.push(name);
  }

  return { added, removed, changed, totalBefore: before.length, totalAfter: after.length };
}
