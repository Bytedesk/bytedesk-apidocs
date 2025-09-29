import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import mdx from '@mdx-js/rollup'
import remarkGfm from 'remark-gfm'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'

export default defineConfig({
  plugins: [
    mdx({
      // Enable MDXProvider context so shortcodes like <Card/> resolve via @mdx-js/react
      providerImportSource: '@mdx-js/react',
      remarkPlugins: [remarkGfm],
      rehypePlugins: [rehypeSlug, [rehypeAutolinkHeadings, { behavior: 'wrap' }]],
    }),
    react(),
  ],
  server: {
    port: 9018,
  },
})
