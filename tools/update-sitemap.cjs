// Generate canonical sitemap URLs and reliable modification dates from Git.
const fs = require('node:fs');
const path = require('node:path');
const {execFileSync} = require('node:child_process');
const root = path.resolve(__dirname, '..');
const previous = fs.readFileSync(path.join(root, 'sitemap.xml'), 'utf8');
const entries = [];
for (const file of fs.readdirSync(root).filter(f => f.endsWith('.html') && !f.startsWith('_')).sort()) {
  const source = fs.readFileSync(path.join(root, file), 'utf8');
  if (/<meta\b[^>]*name=["']robots["'][^>]*content=["'][^"']*noindex/i.test(source)) continue;
  const canonical = source.match(/<link\b[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["']/i)?.[1];
  if (!canonical?.startsWith('https://www.concrete-designs.de/')) throw new Error('Missing production canonical: ' + file);
  const old = previous.split('<url>').find(row => row.includes('<loc>' + canonical + '</loc>')) || '';
  const lastmod = execFileSync('git', ['log', '-1', '--format=%cs', '--', file], {cwd: root, encoding: 'utf8'}).trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(lastmod)) throw new Error('Missing Git modification date: ' + file);
  const priority = old.match(/<priority>([^<]+)<\/priority>/)?.[1] || (file.startsWith('case-') ? '0.7' : '0.6');
  entries.push(`  <url><loc>${canonical}</loc><lastmod>${lastmod}</lastmod><changefreq>monthly</changefreq><priority>${priority}</priority></url>`);
}
fs.writeFileSync(path.join(root, 'sitemap.xml'), '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + entries.join('\n') + '\n</urlset>\n');
console.log('Updated sitemap: ' + entries.length + ' canonical, indexable URLs; lastmod from Git.');
