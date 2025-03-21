const fs = require('fs');
const path = require('path');

const urls = [
  { loc: 'http://www.fewo-alegria.de/', lastmod: '2025-03-21' },
  { loc: 'http://www.fewo-alegria.de/login', lastmod: '2025-03-21' },
  { loc: 'http://www.fewo-alegria.de/register', lastmod: '2025-03-21' },
  { loc: 'http://www.fewo-alegria.de/forgot-password', lastmod: '2025-03-21' },
  { loc: 'http://www.fewo-alegria.de/reset-password', lastmod: '2025-03-21' },
  { loc: 'http://www.fewo-alegria.de/owner/dashboard', lastmod: '2025-03-21' },
  { loc: 'http://www.fewo-alegria.de/guest/dashboard', lastmod: '2025-03-21' },
];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urls.map(url => `
  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
  </url>`).join('')}
</urlset>`;

fs.writeFileSync(path.join(__dirname, 'sitemap.xml'), sitemap);

console.log('Sitemap generated successfully.');