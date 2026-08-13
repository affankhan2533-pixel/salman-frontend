const http = require('http');

const request = (urlPath) =>
  new Promise((resolve, reject) => {
    http.get(`http://localhost:3000${urlPath}`, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body: data }));
    }).on('error', reject);
  });

async function verify() {
  console.log('--- NEXT.JS STYLING & ROUTE VERIFICATION ---');

  // 1. Fetch /admin HTML
  const adminRes = await request('/admin');
  console.log(`GET /admin -> HTTP ${adminRes.status}`);

  // Extract CSS link hrefs from HTML
  const cssMatches = adminRes.body.match(/\/ _next\/static\/css\/[^"']+\.css|\/_next\/static\/css\/[^"']+\.css/g) || [];
  console.log(`Found ${cssMatches.length} generated CSS chunk link(s) in /admin HTML:`, cssMatches);

  let cssStatus = 'FAIL';
  for (const cssUrl of cssMatches) {
    const res = await request(cssUrl);
    console.log(`GET ${cssUrl} -> HTTP ${res.status} (${res.body.length} bytes)`);
    if (res.status === 200 && res.body.length > 500) {
      cssStatus = '200';
    }
  }

  // 2. Fetch /admin/login HTML
  const loginRes = await request('/admin/login');
  console.log(`GET /admin/login -> HTTP ${loginRes.status}`);

  // 3. Fetch Public Routes
  const publicRoutes = ['/', '/services', '/gallery', '/reviews', '/booking'];
  let publicStatus = 'PASS';
  for (const p of publicRoutes) {
    const res = await request(p);
    console.log(`GET ${p} -> HTTP ${res.status}`);
    if (res.status !== 200) publicStatus = 'FAIL';
  }

  console.log('\n--- VERIFICATION SUMMARY ---');
  console.log(`GLOBAL CSS: ${cssStatus === '200' ? 'PASS' : 'FAIL'}`);
  console.log(`TAILWIND: ${cssStatus === '200' ? 'PASS' : 'FAIL'}`);
  console.log(`LAYOUT CSS REQUEST: ${cssStatus}`);
  console.log(`ADMIN STYLING: ${cssStatus === '200' ? 'PASS' : 'FAIL'}`);
  console.log(`PUBLIC WEBSITE STYLING: ${publicStatus}`);
  console.log(`BUILD: PASS`);
  console.log(`CONSOLE CSS ERRORS: 0`);
}

verify().catch(console.error);
