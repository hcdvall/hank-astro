import { defineConfig } from 'astro/config';
import markdoc from '@astrojs/markdoc';  

export default defineConfig({
  integrations: [markdoc()],
  site: 'https://henriksedvall.com',
});
