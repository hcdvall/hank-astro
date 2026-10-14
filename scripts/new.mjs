#!/usr/bin/env node
// Scaffold a new blog post or project as a draft.
//   npm run new:post "My title"
//   npm run new:project "My project"
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const [kind, ...words] = process.argv.slice(2);
const title = words.join(' ').trim();
const collection = { post: 'blog', project: 'projects' }[kind];

if (!collection || !title) {
  console.error('Usage: npm run new:post "Title"  |  npm run new:project "Title"');
  process.exit(1);
}

const slug = title
  .toLowerCase()
  .normalize('NFKD')
  .replace(/[̀-ͯ]/g, '')
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-|-$/g, '');
const dir = join('src/content', collection, slug);
const today = new Date().toLocaleDateString('sv-SE'); // YYYY-MM-DD, local time

if (existsSync(dir)) {
  console.error(`${dir} already exists`);
  process.exit(1);
}

const frontmatter = {
  post: `title: ${JSON.stringify(title)}
description: "One sentence shown in lists and search results."
pubDate: ${today}
# updatedDate: ${today}
draft: true`,
  project: `title: ${JSON.stringify(title)}
description: "One sentence shown on the project card."
startDate: ${today}
draft: true
highlight: false
# cover: ./cover.jpg
# coverVideo: /media/${slug}/cover.mp4
# links:
#   repo: https://github.com/...
#   itch: https://....itch.io/...
#   video: https://youtube.com/...`,
}[kind];

const body = `## Intro

Start headings at \`##\`; the page title is already the \`<h1>\`.

<!-- Images: put them in this folder and link them as ![Alt text](./image.png)
     Clips:  scripts/convert-media.sh clip.gif public/media/${slug}/clip.mp4
             then link them as ![Alt text](/media/${slug}/clip.mp4) -->
`;

mkdirSync(dir, { recursive: true });
writeFileSync(join(dir, 'index.md'), `---\n${frontmatter}\n---\n\n${body}`);
console.log(`Created ${join(dir, 'index.md')} -> /${collection}/${slug}/ (draft)`);
