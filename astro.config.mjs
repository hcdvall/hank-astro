import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import remarkVideo from './src/plugins/remark-video.mjs';

export default defineConfig({
  site: 'https://www.henriksedvall.com',
  integrations: [sitemap()],
  markdown: {
    remarkPlugins: [remarkVideo],
  },
  redirects: {
    '/portfolio': '/',
    '/home': '/',
  },
});
