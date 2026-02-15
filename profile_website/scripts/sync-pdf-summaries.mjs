import { glob } from 'glob';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const PDFS_DIR = path.join(ROOT, 'public', 'pdfs');
const SUMMARIES_PATH = path.join(ROOT, 'data', 'summaries.json');

const DEFAULT_AUTHOR = 'Nathan Lozeron';

function filenameToId(filename) {
  return path.basename(filename, '.pdf').toLowerCase().replace(/\s+/g, '-');
}

/** Parse leading day number (up to 3 digits) and return { day, titleWithoutNumber } */
function parseDayAndTitle(filename) {
  const base = path.basename(filename, '.pdf');
  const match = base.match(/^(\d{1,3})[\s\-_]+(.*)$/);
  if (match) {
    const day = parseInt(match[1], 10);
    const rest = match[2].replace(/[-_]+/g, ' ').trim();
    const title = rest
      .replace(/\b\w/g, (c) => c.toUpperCase())
      .trim();
    return { day, title: title || base };
  }
  const title = base
    .replace(/[-_]+/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .trim();
  return { day: 0, title };
}

async function ensureDir(dirPath) {
  try {
    await fs.mkdir(dirPath, { recursive: true });
  } catch (err) {
    if (err.code !== 'EEXIST') throw err;
  }
}

async function syncPdfSummaries() {
  console.log('📚 Syncing PDF summaries...');

  await ensureDir(PDFS_DIR);
  await ensureDir(path.dirname(SUMMARIES_PATH));

  let pdfFiles = [];
  try {
    pdfFiles = await glob('public/pdfs/*.pdf', { cwd: ROOT });
  } catch (err) {
    console.warn('No PDFs found or pdfs dir missing:', err.message);
  }

  const pdfUrls = new Set(pdfFiles.map((f) => '/pdfs/' + path.basename(f)));

  let data = { summaries: [] };
  try {
    const raw = await fs.readFile(SUMMARIES_PATH, 'utf-8');
    data = JSON.parse(raw);
    if (!Array.isArray(data.summaries)) data.summaries = [];
  } catch (err) {
    if (err.code !== 'ENOENT') throw err;
  }

  const byPdfUrl = new Map();
  for (const s of data.summaries) {
    if (s.pdfUrl) byPdfUrl.set(s.pdfUrl, s);
  }

  let added = 0;
  for (const file of pdfFiles) {
    const filename = path.basename(file);
    const pdfUrl = '/pdfs/' + filename;
    const { day, title } = parseDayAndTitle(filename);
    if (byPdfUrl.has(pdfUrl)) {
      const entry = byPdfUrl.get(pdfUrl);
      entry.title = title;
      if (entry.day === undefined) entry.day = day;
      if (entry.date === undefined) entry.date = '';
      if (entry.bookName === undefined) entry.bookName = '';
      if (entry.bookAuthor === undefined) entry.bookAuthor = '';
      if (entry.amazonUrl === undefined) entry.amazonUrl = '';
      continue;
    }
    const id = filenameToId(filename);
    data.summaries.push({
      id,
      title,
      day,
      date: '',
      bookName: '',
      bookAuthor: '',
      amazonUrl: '',
      pdfUrl,
      author: DEFAULT_AUTHOR,
      sourceUrl: '',
      description: ''
    });
    byPdfUrl.set(pdfUrl, data.summaries[data.summaries.length - 1]);
    added++;
    console.log('  +', title, `(Day ${day})`);
  }

  // Ensure all existing entries have stripped title, day/date, and optional book/amazon fields
  for (const s of data.summaries) {
    if (!s.pdfUrl) continue;
    const filename = path.basename(s.pdfUrl);
    const { day, title } = parseDayAndTitle(filename);
    s.title = title;
    if (s.day === undefined) s.day = day;
    if (s.date === undefined) s.date = '';
    if (s.bookName === undefined) s.bookName = '';
    if (s.bookAuthor === undefined) s.bookAuthor = '';
    if (s.amazonUrl === undefined) s.amazonUrl = '';
  }

  const beforeCount = data.summaries.length;
  data.summaries = data.summaries.filter((s) => pdfUrls.has(s.pdfUrl));
  const removedCount = beforeCount - data.summaries.length;

  await fs.writeFile(SUMMARIES_PATH, JSON.stringify(data, null, 2), 'utf-8');
  console.log('---');
  console.log(`✅ summaries.json updated: ${data.summaries.length} total, ${added} added${removedCount > 0 ? `, ${removedCount} removed` : ''}.`);
}

syncPdfSummaries().catch((err) => {
  console.error('❌ sync-pdf-summaries failed:', err);
  process.exit(1);
});
