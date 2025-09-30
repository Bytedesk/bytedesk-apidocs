import React from 'react'
import { Card as AntCard } from 'antd'
import { Link } from 'react-router-dom'

type WithChildren<T = {}> = T & { children?: React.ReactNode }

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
    if (isExternal) {
      return (
        <a href={props.href} target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }}>
          {body}
        </a>
      )
    }
    return (
      <Link to={props.href} style={{ textDecoration: 'none' }}>
        {body}
      </Link>
    )
  }
  return body
}