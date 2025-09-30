import React from 'react'
import { Link } from 'react-router-dom'

type WithChildren<T = {}> = T & { children?: React.ReactNode }

// Wrapper component to handle frontmatter and page metadata
export function MDXContent({ frontmatter, children, ...props }: any) {
  return (
    <div className="mdx-content">
      {frontmatter && (
        <div className="page-header" style={{ marginBottom: '32px' }}>
          {frontmatter.title && (
            <h1 style={{ 
              fontSize: '2.25rem', 
              fontWeight: 700, 
              lineHeight: 1.2, 
              margin: '0 0 16px 0',
              color: 'var(--text-primary)'
            }}>
              {frontmatter.title}
            </h1>
          )}
          {frontmatter.description && (
            <p style={{ 
              fontSize: '1.125rem', 
              color: 'var(--text-secondary)', 
              margin: '0 0 24px 0',
              lineHeight: 1.6
            }}>
              {frontmatter.description}
            </p>
          )}
        </div>
      )}
      <div {...props}>{children}</div>
    </div>
  )
}

// MDX <a> tag mapping: internal links become Router Links so basename (/apidocs) applies
export function A(props: React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  const href = props.href || ''
  const isExternal = /^https?:\/\//.test(href) || href.startsWith('mailto:') || href.startsWith('tel:')
  if (!href || isExternal) {
    return <a {...props} />
  }
  return <Link to={href} style={{ textDecoration: 'none' }}>{props.children as any}</Link>
}