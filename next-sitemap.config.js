/** @type {import('next-sitemap').IConfig} */
module.exports = {
    siteUrl: process.env.SITE_URL || 'https://www.kmtcs.com.my', // Your website's URL
    generateRobotsTxt: true, // (Optional) Generates a robots.txt file
    sitemapSize: 7000, // Number of URLs per sitemap file
    changefreq: 'weekly',
    priority: 0.7,
    exclude: [
      '/admin/*',
      '/api/*',
      '/login',
      '/signup',
      '/_next/*',
      '/404',
      '/500',
    ],
    robotsTxtOptions: {
      policies: [
        {
          userAgent: '*',
          allow: '/',
          disallow: [
            '/admin/',
            '/api/',
            '/_next/',
            '/login',
            '/signup',
            '/*.json$',
            '/*.xml$',
            '/temp/',
            '/cache/',
            '/tmp/',
            '/.env',
            '/.git/',
            '/node_modules/',
          ],
        },
        {
          userAgent: 'Googlebot',
          allow: '/',
          disallow: [
            '/admin/',
            '/api/',
            '/_next/',
            '/login',
            '/signup',
          ],
        },
        {
          userAgent: 'Bingbot',
          allow: '/',
          disallow: [
            '/admin/',
            '/api/',
            '/_next/',
            '/login',
            '/signup',
          ],
        },
      ],
      additionalSitemaps: [
        'https://www.kmtcs.com.my/sitemap.xml',
      ],
    },
    transform: async (config, path) => {
      // Custom priority and changefreq based on path
      let priority = 0.7;
      let changefreq = 'weekly';

      // Home page gets highest priority
      if (path === '/') {
        priority = 1.0;
        changefreq = 'daily';
      }
      // Main service pages get high priority
      else if (path.startsWith('/services/')) {
        priority = 0.9;
        changefreq = 'weekly';
      }
      // About and contact pages get high priority
      else if (path === '/about' || path === '/contact' || path === '/consultants') {
        priority = 0.8;
        changefreq = 'monthly';
      }
      // News pages get medium priority
      else if (path.startsWith('/news/')) {
        priority = 0.6;
        changefreq = 'weekly';
      }

      return {
        loc: path,
        changefreq,
        priority,
        lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
        alternateRefs: config.alternateRefs ?? [],
      };
    },
  }