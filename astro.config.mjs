import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://www.henriksedvall.com',
  integrations: [sitemap()],
  redirects: {
    '/portfolio': '/',
    '/home': '/',
  },
});
