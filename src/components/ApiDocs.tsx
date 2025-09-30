import React from 'react'
import { Tag } from 'antd'

type WithChildren<T = {}> = T & { children?: React.ReactNode }

// API Docs helpers
export function ParamField({ name, type, required, default: def, children, path, query, header, body }: WithChildren<{ name?: string; type?: string; required?: boolean; default?: string; path?: string; query?: string; header?: string; body?: string }>) {
  const label = name || path || query || header || body
  const paramType = path ? 'path' : query ? 'query' : header ? 'header' : body ? 'body' : 'param'
  
  return (
    <div className="param-field" style={{ margin: '16px 0', padding: '16px', border: '1px solid #e5e7eb', borderRadius: 8, background: '#fafbfc' }}>
      <div className="param-name" style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <code style={{ background: '#f1f5f9', color: '#374151', padding: '4px 8px', borderRadius: 4, fontWeight: 600 }}>
          {label}
        </code>
        {type && <Tag color="blue" style={{ fontSize: '11px', padding: '2px 8px' }}>{type}</Tag>}
        {required && <Tag color="red" style={{ fontSize: '11px', padding: '2px 8px' }}>required</Tag>}
        {def && <Tag color="green" style={{ fontSize: '11px', padding: '2px 8px' }}>default: {def}</Tag>}
      </div>
      {children && <div style={{ color: '#4b5563', fontSize: '14px', lineHeight: 1.6 }}>{children}</div>}
    </div>
  )
}

export function ResponseField(props: WithChildren<{ name?: string; type?: string; required?: boolean; default?: string }>) {
  return (
    <div className="response-field" style={{ margin: '16px 0', padding: '16px', border: '1px solid #e5e7eb', borderRadius: 8, background: '#f8fafb' }}>
      <div className="param-name" style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <code style={{ background: '#f1f5f9', color: '#374151', padding: '4px 8px', borderRadius: 4, fontWeight: 600 }}>
          {props.name}
        </code>
        {props.type && <Tag color="purple" style={{ fontSize: '11px', padding: '2px 8px' }}>{props.type}</Tag>}
        {props.required && <Tag color="red" style={{ fontSize: '11px', padding: '2px 8px' }}>required</Tag>}
        {props.default && <Tag color="green" style={{ fontSize: '11px', padding: '2px 8px' }}>default: {props.default}</Tag>}
      </div>
      {props.children && <div style={{ color: '#4b5563', fontSize: '14px', lineHeight: 1.6 }}>{props.children}</div>}
    </div>
  )
}