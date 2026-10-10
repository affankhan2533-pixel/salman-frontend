export default function robots() {
  const rawSiteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://salmanhairstudio.com';
  const baseUrl = rawSiteUrl.startsWith('http://') || rawSiteUrl.startsWith('https://')
    ? rawSiteUrl
    : `https://${rawSiteUrl}`;

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin', '/admin/*', '/api/*'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
