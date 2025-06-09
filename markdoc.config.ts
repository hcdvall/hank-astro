// src/content/config.ts (or markdoc.config.ts depending on your setup)

import { defineMarkdocConfig, nodes, component } from '@astrojs/markdoc/config';

export default defineMarkdocConfig({
  nodes: {
    heading: {
      ...nodes.heading, // Keep default anchor links
      render: component('./src/components/Heading.astro'), // Path to your custom heading
    },
  },
});
