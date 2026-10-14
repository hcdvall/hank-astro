---
title: "Building My Personal Astro Website"
description: "A behind-the-scenes look at how I created this site with Astro, custom themes, and smooth navigation."
pubDate: 2025-06-10
author: "Henrik Sedvall"
---

# Building My Personal Astro Website

Welcome to my blog! In this post, I want to share the journey of creating this website, the tools I chose, and some of the challenges I faced along the way.

## Why Astro?

After exploring several static site generators, I decided on [Astro](https://astro.build) for its modern approach to building fast, content-focused websites. Astro’s component-based architecture and support for partial hydration (Astro Islands) made it easy to combine static content with interactive features.

## Customizing the Look

I wanted a unique, retro-inspired look, so I spent time customizing fonts and colors. The site uses a combination of the “Good Old DOS” and “Fira Code” fonts, along with a Dracula-inspired color palette. This gives the site a distinct personality while keeping it readable.

## Smooth Navigation

One of my goals was to make navigation feel seamless. By using Astro’s `<ClientRouter />` and view transitions, page changes are smooth and the navigation bar stays persistent without flickering. This required moving some scripts (like the theme toggle) into a global JavaScript file to ensure they work after client-side navigation.

## Theme Toggle

A fun feature is the dark/light theme toggle. To make it reliable across all navigation, I implemented the logic in a global script and used `localStorage` to remember the user’s preference. This way, the theme stays consistent even as you browse different pages.

## Markdown Content

All blog posts, including this one, are written in Markdown. Astro makes it easy to manage content and layouts, so I can focus on writing instead of worrying about the technical details.

## What’s Next?

I’m planning to add more features, like a projects page and maybe some interactive demos. If you have feedback or suggestions, feel free to reach out!

Thanks for visiting and reading about how this site was built. Stay tuned for more posts!
