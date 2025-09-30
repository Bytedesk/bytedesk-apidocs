import React from 'react'
import { Tag, Tooltip as AntTooltip } from 'antd'

type WithChildren<T = {}> = T & { children?: React.ReactNode }

// Badge component for HTTP methods
export function Badge({ variant, children }: WithChildren<{ variant?: 'success' | 'primary' | 'danger' | 'secondary' | 'warning' }>) {
  const colors = {
    success: { bg: '#16a34a', color: 'white' },
    primary: { bg: '#3b82f6', color: 'white' },
    danger: { bg: '#dc2626', color: 'white' },
    secondary: { bg: '#6b7280', color: 'white' },
    warning: { bg: '#ea580c', color: 'white' },
  }
  const style = colors[variant || 'primary'] || colors.primary
  return (
    <span style={{
      background: style.bg,
      color: style.color,
      padding: '4px 8px',
      borderRadius: 4,
      fontSize: '12px',
      fontWeight: 600,
      textTransform: 'uppercase',
      letterSpacing: '0.5px'
    }}>
      {children}
    </span>
  )
}

// Frame (simple wrapper)
export const Frame = ({ children }: WithChildren) => (
  <div style={{ border: '1px solid #e5e7eb', borderRadius: 8, overflow: 'hidden' }}>{children}</div>
)

// Latex: simple fallback renderer
export function Latex({ children }: WithChildren) {
  return <code style={{ background: '#f3f4f6', padding: '2px 6px', borderRadius: 6 }}>{children}</code>
}

export function Tooltip({ tip, children }: WithChildren<{ tip?: string }>) {
  return <AntTooltip title={tip}>{children as any}</AntTooltip>
}