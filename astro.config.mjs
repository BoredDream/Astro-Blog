import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import { config } from './src/config.js';

// 内联 rehype 插件：给正文所有 <img> 加懒加载，无需额外依赖。
function rehypeLazyImages() {
  return (tree) => {
    const walk = (node) => {
      if (node.tagName === 'img') {
        node.properties = node.properties || {};
        if (node.properties.loading == null) node.properties.loading = 'lazy';
        if (node.properties.decoding == null) node.properties.decoding = 'async';
      }
      if (node.children) node.children.forEach(walk);
    };
    walk(tree);
  };
}

export default defineConfig({
  site: config.site.url,
  integrations: [react(), sitemap()],
  output: 'static',
  markdown: {
    shikiConfig: {
      themes: {
        light: 'github-light',
        dark:  'github-dark',
      },
      defaultColor: false,
      wrap: true,
    },
    rehypePlugins: [rehypeLazyImages],
  },
});
