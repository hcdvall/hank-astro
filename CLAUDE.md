# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start development server
npm run build     # Build for production
npm run preview   # Preview production build
```

There are no lint or test scripts configured.

## Architecture

This is a personal portfolio site for Henrik Sedvall (henriksedvall.com) built with Astro 5, using Astro Content Collections for blog posts and projects.

### Routing & Pages

- `src/pages/index.astro` — Landing/splash page (no navbar/footer); shows glitch animation and typing effect
- `src/pages/home.astro` — Main home page with highlighted projects and experience sections
- `src/pages/blog/index.astro` and `[...slug].astro` — Blog listing and dynamic post routes
- `src/pages/projects/index.astro` and `[...slug].astro` — Projects listing and dynamic project routes
- `src/pages/about.astro` — About page

### Layout Hierarchy

All pages use `MainLayout.astro` as the base, which provides:
- Navbar (optional via `showNavbar` prop) and Footer (optional via `showFooter` prop)
- Astro `<ClientRouter />` for client-side navigation transitions
- Global CSS variables for the two-tone theme system (dark/light)
- Self-hosted fonts loaded from `public/fonts/`: Pacifico, Loopet (PlaywriteDKLoopet), Fira Code

Content pages use specialized layouts that wrap `MainLayout`:
- `BlogPost.astro` — wraps markdown blog content
- `Project.astro` — wraps markdown project content with hero image support

### Content Collections

Defined in `src/content/config.ts`:

**Blog** (`src/content/blog/*.md`):
```
title: string
description: string
pubDate: date
author: string
```

**Projects** (`src/content/projects/*.md`):
```
title: string
description: string
startDate: date
author?: string
heroImg?: string   # path relative to public/, e.g. /images/foo.jpg
highlight?: boolean  # shows on home page (default: false)
```

Only projects with `highlight: true` appear on the home page (up to 3, sorted by `startDate` descending).

### Theme System

- `public/theme.js` — inline script that reads/writes `localStorage` and sets `data-theme` on `<body>` (`"dark"` or `"light"`)
- CSS variables for both themes are defined in `MainLayout.astro` under `body {}` (dark default) and `body[data-theme="light"] {}`
- Theme toggle buttons use IDs: `theme-toggle`, `theme-toggle-mobile`, `theme-toggle-desktop`
- Theme persists across Astro client-side navigation via `astro:after-swap` and `astro:page-load` events

### Markdoc

The `@astrojs/markdoc` integration is configured in `markdoc.config.ts`. Currently it overrides the `heading` node to render via `src/components/Heading.astro`. Blog posts and projects are written in `.md` (standard Markdown), but `.mdoc` (Markdoc) is also supported.

### Static Assets

- `public/images/` — hero images for projects (reference with leading `/` in frontmatter, e.g. `/images/foo.jpg`)
- `public/fonts/` — self-hosted font files
- `public/theme.js` — theme persistence script loaded inline in `<head>`
