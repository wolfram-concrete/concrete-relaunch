// Read-only live crawl and media inventory; no forms or conversions are submitted.
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const output = process.argv[2];
if (!output) throw new Error('Pass a JSON report output path.');
const urls = [...fs.readFileSync(path.join(root, 'sitemap.xml'), 'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
const pages = [];
async function worker() {
  while (urls.length) {
    const url = urls.shift();
    const started = Date.now();
    try {
      const response = await fetch(url, {signal: AbortSignal.timeout(30000)});
      const source = await response.text();
      const canonical = source.match(/<link\b[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["']/i)?.[1];
      pages.push({url, status: response.status, finalURL: response.url, canonical, noindex: /<meta\b[^>]*name=["']robots["'][^>]*content=["'][^"']*noindex/i.test(source) || /noindex/i.test(response.headers.get('x-robots-tag') || ''), elapsedMs: Date.now() - started});
    } catch (e) { pages.push({url, error: e.message}); }
  }
}
function inventory(dir, result = []) {
  for (const item of fs.readdirSync(dir, {withFileTypes: true})) {
    const full = path.join(dir, item.name);
    if (item.isDirectory()) inventory(full, result);
    else if (/\.(webp|avif|png|jpe?g|mp4|woff2)$/i.test(item.name)) result.push({path: path.relative(root, full), bytes: fs.statSync(full).size});
  }
  return result;
}
(async () => {
  await Promise.all(Array.from({length: 6}, worker));
  pages.sort((a,b) => a.url.localeCompare(b.url));
  const issues = pages.filter(p => p.error || p.status !== 200 || p.url !== p.finalURL || p.canonical !== p.url || p.noindex);
  const media = inventory(path.join(root, 'assets')).sort((a,b) => b.bytes - a.bytes);
  fs.writeFileSync(output, JSON.stringify({testedAt: new Date().toISOString(), pages, issues, media}, null, 2));
  console.log(JSON.stringify({pages: pages.length, issues: issues.length, details: issues, largestMedia: media.slice(0, 12)}, null, 2));
})();
