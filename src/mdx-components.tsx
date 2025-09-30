import React, { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { Card as AntCard, Alert, Collapse, Tabs as AntTabs, Tag, Tooltip as AntTooltip, Button } from 'antd'
import { Link } from 'react-router-dom'

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
export const Note = Info
export const Check = Tip

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
  return <AntTabs items={items} />
}

// Latex: simple fallback renderer
export function Latex({ children }: WithChildren) {
  return <code style={{ background: '#f3f4f6', padding: '2px 6px', borderRadius: 6 }}>{children}</code>
}

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

// Generic Tabs/Tab components
export function Tabs({ children }: WithChildren) {
  const arr = React.Children.toArray(children) as React.ReactElement[]
  const items = arr.map((el, idx) => ({ key: String(idx), label: el.props.title ?? `Tab ${idx + 1}`, children: el.props.children }))
  return <AntTabs items={items} />
}

export function Tab({ children }: WithChildren<{ title?: string }>) {
  return <>{children}</>
}

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

export function Expandable({ title, children }: WithChildren<{ title?: string }>) {
  return <Collapse items={[{ key: '0', label: title || 'Details', children }]} />
}

export function RequestExample({ children, title }: WithChildren<{ title?: string }>) {
  const [container, setContainer] = useState<HTMLElement | null>(null)
  const [containerWidth, setContainerWidth] = useState<number | null>(null)
  
  useEffect(() => {
    let retryCount = 0
    const maxRetries = 20 // 增加重试次数
    
    // 等待 DOM 准备好后再获取容器
    const getContainer = () => {
      const elem = document.getElementById('api-examples-container')
      if (elem) {
        console.log('RequestExample: Found container element')
        setContainer(elem)
        return true
      } else {
        retryCount++
        if (retryCount < maxRetries) {
          // 如果容器还没准备好，稍后重试，使用递增延迟
          setTimeout(getContainer, Math.min(100 * retryCount, 1000))
        } else {
          console.warn('RequestExample: Could not find api-examples-container after', maxRetries, 'retries')
        }
        return false
      }
    }
    
    // 立即尝试获取容器
    if (!getContainer()) {
      // 添加 DOM 变化监听，确保容器始终可用
      const observer = new MutationObserver((mutations) => {
        // 检查是否有新增的元素包含我们需要的容器
        for (const mutation of mutations) {
          if (mutation.type === 'childList') {
            for (const node of mutation.addedNodes) {
              if (node.nodeType === Node.ELEMENT_NODE) {
                const element = node as Element
                if (element.id === 'api-examples-container' || 
                    element.querySelector('#api-examples-container')) {
                  if (getContainer()) {
                    observer.disconnect()
                    return
                  }
                }
              }
            }
          }
        }
      })
      
      observer.observe(document.body, { 
        childList: true, 
        subtree: true,
        attributes: false,
        characterData: false
      })
      
      return () => observer.disconnect()
    }
  }, [])

  // 监听容器大小变化
  useEffect(() => {
    if (!container) return

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerWidth(entry.contentRect.width)
      }
    })

    resizeObserver.observe(container)
    return () => resizeObserver.disconnect()
  }, [container])
  
  const [selectedLang, setSelectedLang] = useState('cURL')
  const [showDropdown, setShowDropdown] = useState(false)
  
  // 点击外部关闭下拉菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element
      if (!target.closest('.language-selector')) {
        setShowDropdown(false)
      }
    }
    
    if (showDropdown) {
      document.addEventListener('click', handleClickOutside)
      return () => document.removeEventListener('click', handleClickOutside)
    }
  }, [showDropdown])
  
  const languages = [
    { name: 'cURL', icon: '▶️' },
    { name: 'Python', icon: '🐍' },
    { name: 'JavaScript', icon: '🔶' },
    { name: 'PHP', icon: '🐘' },
    { name: 'Go', icon: '🔗' },
    { name: 'Java', icon: '☕' },
    { name: 'Ruby', icon: '💎' }
  ]
  
  const content = (
    <div className="code-example-container" style={{ 
      marginBottom: '16px',
      background: 'var(--bg-primary)',
      borderRadius: '12px',
      border: '1px solid var(--border-color)',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)',
      overflow: 'hidden',
      width: '100%',
      minWidth: 0,
      position: 'relative',
      maxWidth: containerWidth ? `${containerWidth - 40}px` : '100%'
    }}>
      <div className="example-header" style={{ 
        background: 'var(--bg-secondary)', 
        padding: '10px 14px', 
        borderBottom: '1px solid var(--border-color)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div className="language-selector" style={{ position: 'relative' }}>
          <button 
            onClick={() => setShowDropdown(!showDropdown)}
            style={{ 
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'var(--bg-primary)', 
              border: '1px solid var(--border-color)', 
              padding: '8px 12px', 
              borderRadius: '8px', 
              fontSize: '13px',
              fontWeight: 500,
              color: 'var(--text-primary)',
              cursor: 'pointer',
              transition: 'all 0.2s',
              boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--primary)'
              e.currentTarget.style.boxShadow = '0 0 0 3px rgba(22, 163, 74, 0.1)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--border-color)'
              e.currentTarget.style.boxShadow = '0 1px 2px rgba(0, 0, 0, 0.05)'
            }}
          >
            <span>{languages.find(l => l.name === selectedLang)?.icon}</span>
            <span>{selectedLang}</span>
            <span style={{ marginLeft: '4px', fontSize: '10px' }}>▼</span>
          </button>
          
          {showDropdown && (
            <div style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              marginTop: '8px',
              background: 'var(--bg-primary)',
              border: '1px solid var(--border-color)',
              borderRadius: '8px',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
              zIndex: 50,
              minWidth: '140px',
              backdropFilter: 'blur(8px)'
            }}>
              {languages.map(lang => (
                <button
                  key={lang.name}
                  onClick={() => {
                    setSelectedLang(lang.name)
                    setShowDropdown(false)
                  }}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 12px',
                    border: 'none',
                    background: selectedLang === lang.name ? 'var(--bg-secondary)' : 'transparent',
                    color: 'var(--text-primary)',
                    fontSize: '13px',
                    cursor: 'pointer',
                    textAlign: 'left',
                    borderRadius: '6px',
                    margin: '2px',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-secondary)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = selectedLang === lang.name ? 'var(--bg-secondary)' : 'transparent'}
                >
                  <span>{lang.icon}</span>
                  <span>{lang.name}</span>
                  {selectedLang === lang.name && <span style={{ marginLeft: 'auto', color: '#10b981' }}>✓</span>}
                </button>
              ))}
            </div>
          )}
        </div>
        
        <button className="copy-button" 
          onClick={() => {
            const textContent = typeof children === 'string' ? children : 
              React.Children.toArray(children).map(child => 
                typeof child === 'string' ? child : 
                React.isValidElement(child) && child.props.children ? child.props.children : ''
              ).join('\n');
            
            navigator.clipboard.writeText(textContent).then(() => {
              const button = document.activeElement as HTMLElement;
              const original = button.textContent;
              button.textContent = '✓';
              setTimeout(() => button.textContent = original, 1000);
            });
          }}
          style={{ 
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: 'transparent', 
            border: '1px solid #d1d5db', 
            padding: '6px 10px', 
            borderRadius: '6px', 
            fontSize: '12px',
            color: '#6b7280',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#f3f4f6'
            e.currentTarget.style.borderColor = '#9ca3af'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent'
            e.currentTarget.style.borderColor = '#d1d5db'
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
          </svg>
          <span>Copy</span>
        </button>
      </div>
      
      <div className="code-content" style={{ 
        padding: '20px', 
        fontFamily: '"SF Mono", Monaco, "Cascadia Code", "Roboto Mono", Consolas, "Courier New", monospace', 
        fontSize: '13px', 
        background: selectedLang === 'cURL' ? '#0f172a' : '#1e293b', 
        color: '#e2e8f0', 
        overflowX: 'auto',
        lineHeight: 1.7,
        minHeight: '120px',
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word',
        width: '100%',
        boxSizing: 'border-box'
      }}>
        <div style={{ 
          color: selectedLang === 'cURL' ? '#94a3b8' : '#cbd5e1',
          fontWeight: 400 
        }}>
          {children}
        </div>
      </div>
    </div>
  )
  
  // 检查是否在API页面并且容器可用
  const isApiPage = window.location.pathname.includes('/api-reference/')
  const desktopContainer = document.getElementById('api-examples-container')
  const mobileContainer = document.getElementById('mobile-api-examples-container')
  
  // 优先尝试移动端容器，其次是桌面端容器
  if (isApiPage && (container || mobileContainer || desktopContainer)) {
    const targetContainer = container || mobileContainer || desktopContainer
    if (targetContainer) {
      return createPortal(content, targetContainer)
    }
  }
  
  // 否则正常渲染
  return content
}

export function ResponseExample({ children, title }: WithChildren<{ title?: string }>) {
  const [container, setContainer] = useState<HTMLElement | null>(null)
  const [containerWidth, setContainerWidth] = useState<number | null>(null)
  
  useEffect(() => {
    let retryCount = 0
    const maxRetries = 20 // 增加重试次数
    
    // 等待 DOM 准备好后再获取容器
    const getContainer = () => {
      const elem = document.getElementById('api-examples-container')
      if (elem) {
        console.log('ResponseExample: Found container element')
        setContainer(elem)
        return true
      } else {
        retryCount++
        if (retryCount < maxRetries) {
          // 如果容器还没准备好，稍后重试，使用递增延迟
          setTimeout(getContainer, Math.min(100 * retryCount, 1000))
        } else {
          console.warn('ResponseExample: Could not find api-examples-container after', maxRetries, 'retries')
        }
        return false
      }
    }
    
    // 立即尝试获取容器
    if (!getContainer()) {
      // 添加 DOM 变化监听，确保容器始终可用
      const observer = new MutationObserver((mutations) => {
        // 检查是否有新增的元素包含我们需要的容器
        for (const mutation of mutations) {
          if (mutation.type === 'childList') {
            for (const node of mutation.addedNodes) {
              if (node.nodeType === Node.ELEMENT_NODE) {
                const element = node as Element
                if (element.id === 'api-examples-container' || 
                    element.querySelector('#api-examples-container')) {
                  if (getContainer()) {
                    observer.disconnect()
                    return
                  }
                }
              }
            }
          }
        }
      })
      
      observer.observe(document.body, { 
        childList: true, 
        subtree: true,
        attributes: false,
        characterData: false
      })
      
      return () => observer.disconnect()
    }
  }, [])

  // 监听容器大小变化
  useEffect(() => {
    if (!container) return

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerWidth(entry.contentRect.width)
      }
    })

    resizeObserver.observe(container)
    return () => resizeObserver.disconnect()
  }, [container])
  
  const [selectedStatus, setSelectedStatus] = useState('200')
  
  const statusCodes = [
    { code: '200', label: '200', color: '#059669' },
    { code: '400', label: '400', color: '#dc2626' },
    { code: '404', label: '404', color: '#ea580c' },
    { code: '500', label: '500', color: '#7c2d12' }
  ]
  
  const content = (
    <div className="response-example-container" style={{ 
      marginBottom: '16px',
      background: 'var(--bg-primary)',
      borderRadius: '12px',
      border: '1px solid var(--border-color)',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)',
      overflow: 'hidden',
      width: '100%',
      minWidth: 0,
      position: 'relative',
      maxWidth: containerWidth ? `${containerWidth - 40}px` : '100%'
    }}>
      <div className="response-header" style={{ 
        background: 'var(--bg-secondary)', 
        padding: '10px 14px', 
        borderBottom: '1px solid var(--border-color)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div className="status-codes" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {statusCodes.map(status => (
            <button
              key={status.code}
              onClick={() => setSelectedStatus(status.code)}
              style={{
                background: selectedStatus === status.code ? status.color : '#f3f4f6',
                color: selectedStatus === status.code ? 'white' : '#6b7280',
                border: 'none',
                padding: '4px 10px',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                if (selectedStatus !== status.code) {
                  e.currentTarget.style.background = '#e5e7eb'
                }
              }}
              onMouseLeave={(e) => {
                if (selectedStatus !== status.code) {
                  e.currentTarget.style.background = '#f3f4f6'
                }
              }}
            >
              {status.label}
            </button>
          ))}
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '12px', color: '#6b7280', fontWeight: 500 }}>application/json</span>
          <button className="copy-response-button" 
            onClick={() => {
              const textContent = typeof children === 'string' ? children : 
                React.Children.toArray(children).map(child => 
                  typeof child === 'string' ? child : 
                  React.isValidElement(child) && child.props.children ? child.props.children : ''
                ).join('\n');
              
              navigator.clipboard.writeText(textContent).then(() => {
                const button = document.activeElement as HTMLElement;
                const original = button.textContent;
                button.textContent = '✓';
                setTimeout(() => button.textContent = original, 1000);
              });
            }}
            style={{ 
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'transparent', 
              border: '1px solid #d1d5db', 
              padding: '6px 10px', 
              borderRadius: '6px', 
              fontSize: '12px',
              color: '#6b7280',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#f3f4f6'
              e.currentTarget.style.borderColor = '#9ca3af'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent'
              e.currentTarget.style.borderColor = '#d1d5db'
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
            <span>Copy</span>
          </button>
        </div>
      </div>
      
      <div className="response-content" style={{ 
        padding: '20px', 
        fontFamily: '"SF Mono", Monaco, "Cascadia Code", "Roboto Mono", Consolas, "Courier New", monospace', 
        fontSize: '13px', 
        background: '#0f172a', 
        color: '#e2e8f0', 
        overflowX: 'auto',
        lineHeight: 1.7,
        minHeight: '120px',
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word',
        width: '100%',
        boxSizing: 'border-box'
      }}>
        <div style={{ 
          color: '#cbd5e1',
          fontWeight: 400 
        }}>
          {children}
        </div>
      </div>
    </div>
  )
  
  // 检查是否在API页面并且容器可用
  const isApiPage = window.location.pathname.includes('/api-reference/')
  const desktopContainer = document.getElementById('api-examples-container')
  const mobileContainer = document.getElementById('mobile-api-examples-container')
  
  // 优先尝试移动端容器，其次是桌面端容器
  if (isApiPage && (container || mobileContainer || desktopContainer)) {
    const targetContainer = container || mobileContainer || desktopContainer
    if (targetContainer) {
      return createPortal(content, targetContainer)
    }
  }
  
  // 否则正常渲染
  return content
}

export function Tooltip({ tip, children }: WithChildren<{ tip?: string }>) {
  return <AntTooltip title={tip}>{children as any}</AntTooltip>
}

export function Update({ label, description, children }: WithChildren<{ label?: string; description?: string }>) {
  return <Alert type="info" message={label || 'Update'} description={description || children} showIcon />
}

export function SnippetIntro() {
  return <Alert type="info" message="Snippet introduction" showIcon />
}

export function TryButton({ 
  title = "Try it", 
  endpoint, 
  method = "POST",
  apiTitle
}: { 
  title?: string; 
  endpoint?: string; 
  method?: string;
  apiTitle?: string;
}) {
  const handleTryIt = () => {
    const modal = document.createElement('div');
    modal.innerHTML = `
      <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 9999; display: flex; justify-content: center; align-items: center;">
        <div style="background: white; padding: 20px; border-radius: 8px; width: 80%; max-width: 1000px; height: 80%; overflow-y: auto;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
            <h2>Try API - ${apiTitle || title}</h2>
            <button onclick="this.closest('.modal-overlay').remove()" style="background: none; border: none; font-size: 24px; cursor: pointer;">&times;</button>
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; height: calc(100% - 60px);">
            <div>
              <h3>Request</h3>
              <div style="margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 5px; font-weight: bold;">参数</label>
                <textarea placeholder="请输入JSON格式的请求参数" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; height: 120px;" id="requestParams">{}</textarea>
              </div>
              <button onclick="sendRequest()" style="background: #16A34A; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer;">Send Request</button>
            </div>
            <div>
              <h3>Response</h3>
              <div style="background: #f8f9fa; border: 1px solid #ddd; border-radius: 4px; padding: 15px; height: 400px; overflow-y: auto;" id="response-area">
                点击 "Send Request" 查看响应结果
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
    modal.className = 'modal-overlay';
    document.body.appendChild(modal);
    
    // 创建发送请求的函数，传递当前的 endpoint 和 method
    (window as any).sendRequest = async function() {
      const responseArea = document.getElementById('response-area');
      const paramsTextarea = document.getElementById('requestParams') as HTMLTextAreaElement;
      
      if (!responseArea || !paramsTextarea) return;
      
      let params = paramsTextarea.value.trim();
      
      // 验证JSON格式
      if (params && params !== '{}') {
        try {
          JSON.parse(params);
        } catch (e) {
          responseArea.innerHTML = '<div style="color: red;">请输入有效的JSON格式</div>';
          return;
        }
      }
      
      responseArea.innerHTML = '<div>发送请求中...</div>';
      
      try {
        const fetchOptions: RequestInit = {
          method: method,
          headers: {
            'Content-Type': 'application/json'
          }
        };
        
        if (method === 'GET') {
          // GET 请求
          const response = await fetch(endpoint || '');
          const data = await response.json();
          responseArea.innerHTML = '<pre style="margin: 0; white-space: pre-wrap;">' + JSON.stringify(data, null, 2) + '</pre>';
        } else {
          // POST/PUT/DELETE 请求
          if (params && params !== '{}') {
            fetchOptions.body = params;
          }
          const response = await fetch(endpoint || '', fetchOptions);
          const data = await response.json();
          responseArea.innerHTML = '<pre style="margin: 0; white-space: pre-wrap;">' + JSON.stringify(data, null, 2) + '</pre>';
        }
      } catch (error: any) {
        responseArea.innerHTML = '<div style="color: red;">请求失败: ' + error.message + '</div>';
      }
    };
  };

  return (
    <Button
      type="primary"
      size="middle"
      onClick={handleTryIt}
      style={{
        background: 'var(--primary)',
        borderColor: 'var(--primary)',
        borderRadius: '6px',
        fontWeight: 500,
        display: 'flex',
        alignItems: 'center',
        gap: '6px'
      }}
    >
      {title} →
    </Button>
  );
}

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

// Export mapping for MDXProvider
export const mdxComponents = {
  wrapper: MDXContent,
  a: A,
  Card,
  Columns,
  CardGroup,
  Info,
  Tip,
  Warning,
  Note,
  Check,
  Frame,
  Steps,
  Step,
  AccordionGroup,
  Accordion,
  CodeGroup,
  Latex,
  Tabs,
  Tab,
  ParamField,
  ResponseField,
  Expandable,
  RequestExample,
  ResponseExample,
  Tooltip,
  Update,
  SnippetIntro,
  Badge,
  TryButton,
}

export default mdxComponents
