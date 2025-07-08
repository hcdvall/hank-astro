import { defineConfig } from 'astro/config';
import markdoc from '@astrojs/markdoc';  

export default defineConfig({
  integrations: [markdoc()],
  site: 'https://hcdvall.github.io',
  base: 'hank-astro',
});
