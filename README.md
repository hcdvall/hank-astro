# Hank Astro Portfolio

This is a personal portfolio site built with [Astro](https://astro.build/), featuring blog posts, project showcases, and a custom Dracula-inspired theme.

## Features

- **Astro-powered static site** for fast performance and easy deployment
- **Blog**: Write posts in Markdown with custom layouts and code highlighting
- **Projects**: Showcase your projects with hero images, descriptions, and custom Markdown content
- **Dracula color theme** for a modern, dark look
- **Responsive design** for desktop and mobile
- **Customizable Navbar** with links to Home, About, Blog, and Projects
- **Themed content areas** with terminal-inspired styling
- **Image handling**: Hero images for projects, with support for additional images in Markdown
- **Content collections** powered by Astro Content Collections

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run the development server:**
   ```bash
   npm run dev
   ```

3. **Build for production:**
   ```bash
   npm run build
   ```

4. **Preview the production build:**
   ```bash
   npm run preview
   ```

## Project Structure

```
src/
  components/      # Reusable UI components (Navbar, Footer, ThemeToggle, etc.)
  content/
    blog/          # Blog posts in Markdown
    projects/      # Project entries in Markdown
    config.ts      # Content collections schema
  layouts/         # Astro layout components (MainLayout, BlogPost, Project, etc.)
  pages/           # Astro pages (routes)
public/
  images/          # Static images (hero images, blog images, etc.)
```

## Content Collections

- **Blog posts**:  
  Located in `src/content/blog/`.  
  Frontmatter fields: `title`, `description`, `pubDate`, `author`.

- **Projects**:  
  Located in `src/content/projects/`.  
  Frontmatter fields: `title`, `description`, `startDate`, `author` (optional), `heroImg` (optional).

## Adding Content

- **Add a blog post:**  
  Create a new `.md` file in `src/content/blog/` with the required frontmatter.

- **Add a project:**  
  Create a new `.md` file in `src/content/projects/` with the required frontmatter.  
  Place hero images in `public/images/` and reference them with a leading `/`.

## Customization

- **Colors and theme:**  
  Edit CSS variables in `src/layouts/MainLayout.astro` for Dracula theme customization.

- **Navigation:**  
  Update `src/components/Navbar.astro` to add or remove links.

- **Image styles:**  
  Adjust image styling in `src/layouts/Project.astro` for hero and content images.

## License

This project is for personal use and demonstration.  
Feel free to adapt it for your own portfolio!

---

Built with [Astro](https://astro.build/) 🚀