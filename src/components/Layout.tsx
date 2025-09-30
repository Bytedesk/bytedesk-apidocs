import React from 'react'

type WithChildren<T = {}> = T & { children?: React.ReactNode }

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

// CardGroup (alias of Columns)
export function CardGroup({ cols = 2, children }: WithChildren<{ cols?: number }>) {
  return <Columns cols={cols}>{children}</Columns>
}