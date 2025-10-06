import React, { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'

type WithChildren<T = {}> = T & { children?: React.ReactNode }

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
                if (element.id === 'api-examples-container' || element.querySelector('#api-examples-container')) {
                  getContainer()
                  return
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
      marginBottom: '20px',
      background: '#ffffff',
      borderRadius: '16px',
      border: '1px solid #e5e7eb',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      overflow: 'hidden',
      width: '100%',
      minWidth: 0,
      position: 'relative',
      maxWidth: containerWidth ? `${containerWidth - 40}px` : '100%'
    }}>
      <div className="example-header" style={{ 
        background: '#f9fafb', 
        padding: '14px 20px', 
        borderBottom: '1px solid #e5e7eb',
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
              gap: '10px',
              background: '#ffffff', 
              border: '1px solid #d1d5db', 
              padding: '8px 16px', 
              borderRadius: '8px', 
              fontSize: '14px',
              fontWeight: 500,
              color: '#374151',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#9ca3af'
              e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#d1d5db'
              e.currentTarget.style.boxShadow = '0 1px 2px rgba(0, 0, 0, 0.05)'
            }}
          >
            <span style={{ fontSize: '16px' }}>{languages.find(l => l.name === selectedLang)?.icon}</span>
            <span>{selectedLang}</span>
            <span style={{ fontSize: '10px', marginLeft: '2px' }}>▼</span>
          </button>
          
          {showDropdown && (
            <div style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              minWidth: '180px',
              background: '#ffffff',
              border: '1px solid #e5e7eb',
              borderRadius: '10px',
              marginTop: '8px',
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15), 0 4px 6px rgba(0, 0, 0, 0.1)',
              zIndex: 1000,
              overflow: 'hidden'
            }}>
              {languages.map((lang) => (
                <button
                  key={lang.name}
                  onClick={() => {
                    setSelectedLang(lang.name)
                    setShowDropdown(false)
                  }}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: 'none',
                    background: selectedLang === lang.name ? 'var(--bg-secondary)' : 'transparent',
                    color: 'var(--text-primary)',
                    textAlign: 'left',
                    cursor: 'pointer',
                    fontSize: '13px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    transition: 'background 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    if (selectedLang !== lang.name) {
                      e.currentTarget.style.background = 'var(--bg-secondary)'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedLang !== lang.name) {
                      e.currentTarget.style.background = 'transparent'
                    }
                  }}
                >
                  <span>{lang.icon}</span>
                  <span>{lang.name}</span>
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
              // Optional: show copy success feedback
              const button = document.querySelector('.copy-button') as HTMLElement
              if (button) {
                const originalText = button.textContent
                button.textContent = '✓ Copied!'
                setTimeout(() => button.textContent = originalText, 2000)
              }
            });
          }}
          style={{ 
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: 'rgba(255, 255, 255, 0.2)', 
            border: '1px solid rgba(255, 255, 255, 0.3)', 
            padding: '6px 12px', 
            borderRadius: '6px', 
            fontSize: '12px',
            color: '#ffffff',
            cursor: 'pointer',
            transition: 'all 0.2s',
            fontWeight: 500
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)'
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.5)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)'
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
          </svg>
          <span>Copy</span>
        </button>
      </div>
      
      <div className="code-content" style={{ 
        padding: '24px', 
        fontFamily: '"JetBrains Mono", "Fira Code", "SF Mono", Monaco, "Cascadia Code", "Roboto Mono", Consolas, monospace', 
        fontSize: '13px', 
        background: '#0a0e27', 
        color: '#e2e8f0', 
        overflowX: 'auto',
        lineHeight: 1.8,
        minHeight: '160px',
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word',
        width: '100%',
        boxSizing: 'border-box',
        borderRadius: '0 0 12px 12px'
      }}>
        <div style={{ 
          color: '#f1f5f9',
          fontWeight: 400,
          textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)' 
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
                if (element.id === 'api-examples-container' || element.querySelector('#api-examples-container')) {
                  getContainer()
                  return
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
          {statusCodes.map((status) => (
            <button
              key={status.code}
              onClick={() => setSelectedStatus(status.code)}
              style={{
                background: selectedStatus === status.code ? status.color : 'transparent',
                color: selectedStatus === status.code ? 'white' : status.color,
                border: `1px solid ${status.color}`,
                padding: '4px 8px',
                borderRadius: '4px',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                if (selectedStatus !== status.code) {
                  e.currentTarget.style.background = status.color + '20'
                }
              }}
              onMouseLeave={(e) => {
                if (selectedStatus !== status.code) {
                  e.currentTarget.style.background = 'transparent'
                }
              }}
            >
              {status.label}
            </button>
          ))}
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '12px', color: '#6b7280' }}>Response</span>
          <button className="copy-response-button" 
            onClick={() => {
              const textContent = typeof children === 'string' ? children : 
                React.Children.toArray(children).map(child => 
                  typeof child === 'string' ? child : 
                  React.isValidElement(child) && child.props.children ? child.props.children : ''
                ).join('\n');
              
              navigator.clipboard.writeText(textContent).then(() => {
                // Optional: show copy success feedback
                const button = document.querySelector('.copy-response-button') as HTMLElement
                if (button) {
                  const originalText = button.textContent
                  button.textContent = '✓ Copied!'
                  setTimeout(() => button.textContent = originalText, 2000)
                }
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
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
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