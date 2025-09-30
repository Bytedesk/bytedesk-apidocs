import React from 'react'
import { Collapse } from 'antd'

type WithChildren<T = {}> = T & { children?: React.ReactNode }

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

export function Expandable({ title, children }: WithChildren<{ title?: string }>) {
  return <Collapse items={[{ key: '0', label: title || 'Details', children }]} />
}