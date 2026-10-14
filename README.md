# henriksedvall.com

Personal site built with [Astro](https://astro.build/): a blog, game dev projects and an about page.

## Running it

```bash
npm install
npm run dev       # http://localhost:4321, drafts included
npm run build     # static site in dist/, drafts excluded
npm run preview   # serve dist/
npm run check     # type-check .astro/.ts files
```

## Adding a blog post

```bash
npm run new:post "My title"
```

This creates `src/content/blog/my-title/index.md` with `draft: true`. Write in it, then set `draft: false` (or delete the line) to publish. The URL is `/blog/my-title/`, taken from the folder name.

- **Images** go in the same folder: `![Alt text](./diagram.png)`. Astro optimizes them at build time.
- **Headings** start at `##`. The post title is already rendered as the page's `<h1>`.
- **Drafts** are visible in `npm run dev` and left out of `npm run build`.

## Adding a project

```bash
npm run new:project "My project"
```

This creates `src/content/projects/my-project/index.md`. It works like a post, plus:

- **Cover**: put a still image in the folder and set `cover: ./cover.jpg`. It is used on the home page card and the project page header.
- **Cover clip** (optional): set `coverVideo: /media/my-project/cover.mp4`. The `cover` image becomes its poster.
- **Clips in the text**: convert GIFs to MP4 and put them in `public/media/<slug>/`:

  ```bash
  scripts/convert-media.sh capture.gif public/media/my-project/jump.mp4
  # also extract the first frame as a cover image:
  scripts/convert-media.sh capture.gif public/media/my-project/cover.mp4 src/content/projects/my-project/cover.jpg
  ```

  Then reference a clip with normal image syntax: `![Jump](/media/my-project/jump.mp4)`. It renders as an autoplaying, looping, muted video (see `src/plugins/remark-video.mjs`). Clips are kept in `public/` because Astro can't bundle videos referenced from Markdown. Astro caches rendered Markdown, so after editing that plugin restart with `npx astro dev --force`.
- **Home page**: set `highlight: true` to feature the project on the home page (newest three are shown).

## Frontmatter reference

Schemas live in `src/content.config.ts`.

| Field | Blog | Projects | Notes |
| --- | --- | --- | --- |
| `title` | required | required | |
| `description` | required | required | Used for meta description and cards |
| `pubDate` | required | | `YYYY-MM-DD` |
| `startDate` | | required | `YYYY-MM-DD` |
| `updatedDate` | optional | optional | |
| `draft` | default `false` | default `false` | Hidden from production builds |
| `author` | optional | optional | Not rendered |
| `cover` | | optional | Path to an image next to `index.md` |
| `coverVideo` | | optional | Path under `public/`, e.g. `/media/<slug>/cover.mp4` |
| `highlight` | | default `false` | Show on the home page |
| `links` | | optional | `repo`, `itch`, `video` URLs, shown under the project |

## Project structure

```
src/
  assets/             images imported by pages (profile photo)
  components/         Navbar, Footer, ProjectCard, EntryList, CoverMedia
  content/
    blog/<slug>/      index.md + its images
    projects/<slug>/  index.md + cover.jpg + other images
  layouts/            MainLayout (head, SEO, theme), BlogPost, Project
  pages/              routes
  plugins/            remark-video.mjs
  styles/global.css   design tokens, fonts, light/dark theme, .prose
  consts.ts           site name, description, nav and social links
  content.config.ts   collection schemas
  utils.ts            formatDate, getPosts, getProjects (sorted, drafts filtered)
public/
  media/<slug>/       video clips
  fonts/              VT323, Press Start 2P, Fira Code
scripts/
  new.mjs             scaffolds posts and projects
  convert-media.sh    GIF -> MP4
```

Colors and fonts live in `src/styles/global.css`. The light theme overrides the variables under `html[data-theme="light"]`. Nav and social links are in `src/consts.ts`.

## Deployment

Pushing to `main` runs `.github/workflows/deploy.yml`, which builds with `withastro/action` and publishes to GitHub Pages. `public/CNAME` maps the site to `www.henriksedvall.com`, which must match `site` in `astro.config.mjs` (used for canonical URLs and the sitemap).
