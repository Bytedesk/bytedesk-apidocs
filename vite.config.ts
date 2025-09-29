import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import mdx from '@mdx-js/rollup'
import remarkGfm from 'remark-gfm'
import remarkFrontmatter from 'remark-frontmatter'
import remarkMdxFrontmatter from 'remark-mdx-frontmatter'
import rehypeSlug from 'rehype-slug'

export default defineConfig({
  plugins: [
    mdx({
      // Enable MDXProvider context so shortcodes like <Card/> resolve via @mdx-js/react
      providerImportSource: '@mdx-js/react',
      remarkPlugins: [
        remarkGfm,
        remarkFrontmatter,
        [remarkMdxFrontmatter, { name: 'frontmatter' }]
      ],
      rehypePlugins: [rehypeSlug], // 移除 rehypeAutolinkHeadings 以避免标题自动生成链接
    }),
    react(),
  ],
  server: {
    port: 9018,
  },
})
