import React from 'react'
import { Tabs as AntTabs } from 'antd'

type WithChildren<T = {}> = T & { children?: React.ReactNode }

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
  return <AntTabs items={items} />
}

// Generic Tabs/Tab components
export function Tabs({ children }: WithChildren) {
  const arr = React.Children.toArray(children) as React.ReactElement[]
  const items = arr.map((el, idx) => ({ key: String(idx), label: el.props.title ?? `Tab ${idx + 1}`, children: el.props.children }))
  return <AntTabs items={items} />
}

export function Tab({ children }: WithChildren<{ title?: string }>) {
  return <>{children}</>
}