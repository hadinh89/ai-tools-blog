// scripts/generate-sitemap.mjs
// Auto-generate sitemap.xml for a static site on Vercel.
// - Scans .html files
// - Uses clean URLs for blog posts via a mapping
// - Writes sitemap.xml at project root
import { promises as fs } from 'fs';
import { join, resolve, relative, posix } from 'path';

const ROOT = resolve('.');
const OUTPUT = resolve('./sitemap.xml');

// Configure your site domain
const SITE = process.env.SITE_ORIGIN || 'https://tooltuonglai.com';

// Files/folders to ignore during scan
const IGNORE_DIRS = new Set(['assets', '.git', 'node_modules', '.vercel', 'scripts']);
const IGNORE_FILES = new Set(['index_inline_test.html','index_inline_simple.html','inline_main.html','inline_test.html','simple_script_test.html','test_data_inline.html','test3.html']);

// Map HTML paths -> pretty (clean) URLs
const CLEAN_MAP = new Map([
  ['blog/notion-ai.html',                '/blog/notion-ai'],
  ['blog/elevenlabs-review.html',        '/blog/elevenlabs'],
  ['blog/synthesia-video-guide.html',    '/blog/synthesia'],
  ['blog/leonardo-ai-review.html',       '/blog/leonardo-ai'],
  ['blog/canva-magic-studio-guide.html', '/blog/canva-magic-studio'],
]);

// Changefreq/priority heuristics
function metaFor(urlPath) {
  if (urlPath === '/') return { changefreq: 'daily', priority: '1.0' };
  if (urlPath.startsWith('/blog/')) return { changefreq: 'monthly', priority: '0.8' };
  if (urlPath.endsWith('/categories.html') || urlPath.endsWith('/blog/index.html')) return { changefreq: 'weekly', priority: '0.8' };
  return { changefreq: 'yearly', priority: '0.4' };
}

async function* walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    if (e.name.startsWith('.')) continue;
    if (e.isDirectory()) {
      if (IGNORE_DIRS.has(e.name)) continue;
      yield* walk(join(dir, e.name));
    } else if (e.isFile()) {
      if (!e.name.endsWith('.html')) continue;
      if (IGNORE_FILES.has(e.name)) continue;
      yield join(dir, e.name);
    }
  }
}

function toUrlPath(absPath) {
  const rel = relative(ROOT, absPath).split('\\').join('/'); // normalize windows
  // Home
  if (rel === 'index.html') return '/';
  // Use clean map for known blog posts
  if (CLEAN_MAP.has(rel)) return CLEAN_MAP.get(rel);
  // Default: keep .html for non-blog pages (rewrites may not exist for them)
  return '/' + rel;
}

function xmlEscape(s) {
  return s.replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&apos;');
}

async function main() {
  const urls = [];
  for await (const file of walk(ROOT)) {
    const urlPath = toUrlPath(file);
    const stat = await fs.stat(file);
    const lastmod = stat.mtime.toISOString().slice(0,10);
    const { changefreq, priority } = metaFor(urlPath);
    urls.push({ urlPath, lastmod, changefreq, priority });
  }

  // Ensure home and blog index are present even if missed
  const ensure = (p) => {
    if (!urls.some(u => u.urlPath === p)) {
      urls.push({ urlPath: p, lastmod: new Date().toISOString().slice(0,10), ...metaFor(p) });
    }
  };
  ensure('/');
  ensure('/blog/index.html');
  ensure('/categories.html');

  // Sort: home first, then others alpha
  urls.sort((a,b) => (a.urlPath === '/' ? -1 : b.urlPath === '/' ? 1 : a.urlPath.localeCompare(b.urlPath)));

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls.map(({urlPath,lastmod,changefreq,priority}) => {
      const loc = xmlEscape(SITE.replace(/\/$/,'') + urlPath);
      return `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`;
    }),
    '</urlset>',
    ''
  ].join('\n');

  await fs.writeFile(OUTPUT, xml, 'utf8');
  console.log(`✅ Generated ${OUTPUT} with ${urls.length} URLs.`);
}

main().catch(err => {
  console.error('Sitemap generation failed:', err);
  process.exit(1);
});
