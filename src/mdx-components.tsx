import React from 'react'
import { Card as AntCard, Alert, Collapse, Tabs } from 'antd'

type WithChildren<T = {}> = T & { children?: React.ReactNode }

// Card
export function Card(props: WithChildren<{ title?: string; href?: string; icon?: string; horizontal?: boolean }>) {
  const body = (
    <AntCard
      hoverable
      style={{ width: '100%' }}
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {props.icon && <span aria-hidden>{props.icon}</span>}
          <span>{props.title}</span>
        </div>
      }
    >
      {props.children}
    </AntCard>
  )
  if (props.href) {
    const isExternal = /^https?:\/\//.test(props.href)
    return isExternal ? (
      <a href={props.href} target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }}>
        {body}
      </a>
    ) : (
      <a href={props.href} style={{ textDecoration: 'none' }}>
        {body}
      </a>
    )
  }
  return body
}

// Columns
export function Columns({ cols = 2, children }: WithChildren<{ cols?: number }>) {
  return (
    <div className="columns" style={{
      display: 'grid',
      gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
      gap: 16,
      margin: '12px 0'
    }}>
      {children}
    </div>
  )
}

// Alerts
export const Info = ({ children }: WithChildren) => (
  <Alert type="info" message={<div>{children}</div>} showIcon />
)
export const Tip = ({ children }: WithChildren) => (
  <Alert type="success" message={<div>{children}</div>} showIcon />
)
export const Warning = ({ children }: WithChildren) => (
  <Alert type="warning" message={<div>{children}</div>} showIcon />
)

// Frame (simple wrapper)
export const Frame = ({ children }: WithChildren) => (
  <div style={{ border: '1px solid #e5e7eb', borderRadius: 8, overflow: 'hidden' }}>{children}</div>
)

// Steps / Step
export function Steps({ children }: WithChildren) {
  const items = React.Children.toArray(children)
  return (
    <div className="steps">
      {items.map((child, idx) => (
        <div key={idx} className="step">
          <div className="step-index">{idx + 1}</div>
          <div className="step-body">{child}</div>
        </div>
      ))}
    </div>
  )
}

export function Step({ title, children }: WithChildren<{ title?: string }>) {
  return (
    <div>
      {title && <div style={{ fontWeight: 600, marginBottom: 8 }}>{title}</div>}
      <div>{children}</div>
    </div>
  )
}

// Accordion Group
export function AccordionGroup({ children }: WithChildren) {
  const arr = React.Children.toArray(children) as React.ReactElement[]
  const items = arr.map((el, idx) => ({
    key: String(idx),
    label: el.props.title ?? `Item ${idx + 1}`,
    children: el.props.children,
  }))
  return <Collapse items={items} />
}

export function Accordion({ children }: WithChildren<{ title?: string }>) {
  // Used only as a semantic child for AccordionGroup
  return <>{children}</>
}

// CodeGroup: tabs for multiple code blocks
export function CodeGroup({ children }: WithChildren) {
  const arr = React.Children.toArray(children) as any[]
  const items = arr.map((child, idx) => {
    // Try to derive a label from the fence meta like ```json Title
    let label = `Tab ${idx + 1}`
    const pre = child
    const code = pre?.props?.children
    const meta = code?.props?.metastring || pre?.props?.metastring || code?.props?.title
    if (typeof meta === 'string' && meta.trim()) {
      // metastring might be like "json Title Here"; drop the first token if it's a language
      const parts = meta.split(/\s+/)
      label = parts.length > 1 ? parts.slice(1).join(' ') : meta
    }
    return { key: String(idx), label, children: pre }
  })
  return <Tabs items={items} />
}

// Latex: simple fallback renderer
export function Latex({ children }: WithChildren) {
  return <code style={{ background: '#f3f4f6', padding: '2px 6px', borderRadius: 6 }}>{children}</code>
}

// Export mapping for MDXProvider
export const mdxComponents = {
  Card,
  Columns,
  Info,
  Tip,
  Warning,
  Frame,
  Steps,
  Step,
  AccordionGroup,
  Accordion,
  CodeGroup,
  Latex,
}

export default mdxComponents
