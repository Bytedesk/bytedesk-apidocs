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
    { name: 'cURL', icon: '▶' },
    { name: 'Python', icon: '🐍' },
    { name: 'JavaScript', icon: 'JS' },
    { name: 'PHP', icon: 'PHP' },
    { name: 'Go', icon: 'Go' },
    { name: 'Java', icon: '☕' },
    { name: 'Ruby', icon: '💎' }
  ]
  
  const content = (
    <div className="code-example-container" style={{ 
      marginBottom: '20px',
      background: 'var(--vocs-color_background, #ffffff)',
      borderRadius: '16px',
      border: '1px solid var(--vocs-color_border, #e5e7eb)',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      overflow: 'hidden',
      width: '100%',
      minWidth: 0,
      position: 'relative',
      maxWidth: containerWidth ? `${containerWidth - 40}px` : '100%'
    }}>
      <div className="example-header" style={{ 
        background: 'var(--vocs-color_backgroundDark, #f9fafb)', 
        padding: '14px 20px', 
        borderBottom: '1px solid var(--vocs-color_border, #e5e7eb)',
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
              background: 'var(--vocs-color_background, #ffffff)', 
              border: '1px solid var(--vocs-color_border, #d1d5db)', 
              padding: '8px 16px', 
              borderRadius: '8px', 
              fontSize: '14px',
              fontWeight: 500,
              color: 'var(--vocs-color_text, #374151)',
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
              background: 'var(--vocs-color_background, #ffffff)',
              border: '1px solid var(--vocs-color_border, #e5e7eb)',
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
                    padding: '10px 16px',
                    border: 'none',
                    background: selectedLang === lang.name ? 'var(--vocs-color_backgroundDark, #f3f4f6)' : 'transparent',
                    color: selectedLang === lang.name ? 'var(--vocs-color_text, #111827)' : 'var(--vocs-color_textSecondary, #6b7280)',
                    textAlign: 'left',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: selectedLang === lang.name ? 500 : 400,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={(e) => {
                    if (selectedLang !== lang.name) {
                      e.currentTarget.style.background = '#f9fafb'
                      e.currentTarget.style.color = '#111827'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedLang !== lang.name) {
                      e.currentTarget.style.background = 'transparent'
                      e.currentTarget.style.color = '#6b7280'
                    }
                  }}
                >
                  <span style={{ fontSize: '16px' }}>{lang.icon}</span>
                  <span>{lang.name}</span>
                  {selectedLang === lang.name && (
                    <span style={{ marginLeft: 'auto', color: '#3b82f6', fontSize: '18px' }}>✓</span>
                  )}
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
            background: 'var(--vocs-color_background, #ffffff)', 
            border: '1px solid var(--vocs-color_border, #d1d5db)', 
            padding: '7px 12px', 
            borderRadius: '6px', 
            fontSize: '13px',
            color: 'var(--vocs-color_textSecondary, #6b7280)',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
            fontWeight: 500
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#f9fafb'
            e.currentTarget.style.borderColor = '#9ca3af'
            e.currentTarget.style.color = '#374151'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#ffffff'
            e.currentTarget.style.borderColor = '#d1d5db'
            e.currentTarget.style.color = '#6b7280'
          }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
          </svg>
          <span>Copy</span>
        </button>
      </div>
      
      <div className="code-content" style={{ 
        padding: '20px', 
        fontFamily: '"SF Mono", "Monaco", "Inconsolata", "Roboto Mono", "Source Code Pro", monospace', 
        fontSize: '13.5px', 
        background: 'var(--vocs-color_codeBackground, #f8f9fa)', 
        color: 'var(--vocs-color_codeText, #1f2937)', 
        overflowX: 'auto',
        lineHeight: 1.65,
        minHeight: '140px',
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word',
        width: '100%',
        boxSizing: 'border-box',
        borderRadius: '0 0 16px 16px'
      }}>
        {children}
      </div>
    </div>
  )
  
  // 检查是否在API页面并且容器可用
  const isApiPage = window.location.pathname.includes('/api/')
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
      marginBottom: '20px',
      background: 'var(--vocs-color_background, #ffffff)',
      borderRadius: '16px',
      border: '1px solid var(--vocs-color_border, #e5e7eb)',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      overflow: 'hidden',
      width: '100%',
      minWidth: 0,
      position: 'relative',
      maxWidth: containerWidth ? `${containerWidth - 40}px` : '100%'
    }}>
      <div className="response-header" style={{ 
        background: 'var(--vocs-color_backgroundDark, #f9fafb)', 
        padding: '14px 20px', 
        borderBottom: '1px solid var(--vocs-color_border, #e5e7eb)',
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
                background: selectedStatus === status.code ? 'var(--vocs-color_text, #111827)' : 'transparent',
                color: selectedStatus === status.code ? 'var(--vocs-color_background, #ffffff)' : 'var(--vocs-color_textSecondary, #6b7280)',
                border: selectedStatus === status.code ? '1px solid var(--vocs-color_text, #111827)' : '1px solid var(--vocs-color_border, #e5e7eb)',
                padding: '6px 12px',
                borderRadius: '6px',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => {
                if (selectedStatus !== status.code) {
                  e.currentTarget.style.background = '#f3f4f6'
                  e.currentTarget.style.color = '#111827'
                  e.currentTarget.style.borderColor = '#d1d5db'
                }
              }}
              onMouseLeave={(e) => {
                if (selectedStatus !== status.code) {
                  e.currentTarget.style.background = 'transparent'
                  e.currentTarget.style.color = '#6b7280'
                  e.currentTarget.style.borderColor = '#e5e7eb'
                }
              }}
            >
              {status.label}
            </button>
          ))}
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '13px', color: 'var(--vocs-color_textSecondary, #9ca3af)', fontWeight: 500 }}>Response</span>
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
              background: '#ffffff', 
              border: '1px solid #d1d5db', 
              padding: '7px 12px', 
              borderRadius: '6px', 
              fontSize: '13px',
              color: '#6b7280',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              fontWeight: 500
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#f9fafb'
              e.currentTarget.style.borderColor = '#9ca3af'
              e.currentTarget.style.color = '#374151'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#ffffff'
              e.currentTarget.style.borderColor = '#d1d5db'
              e.currentTarget.style.color = '#6b7280'
            }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
            <span>Copy</span>
          </button>
        </div>
      </div>
      
      <div className="response-content" style={{ 
        padding: '20px', 
        fontFamily: '"SF Mono", "Monaco", "Inconsolata", "Roboto Mono", "Source Code Pro", monospace', 
        fontSize: '13.5px', 
        background: 'var(--vocs-color_codeBackground, #f8f9fa)', 
        color: 'var(--vocs-color_codeText, #1f2937)', 
        overflowX: 'auto',
        lineHeight: 1.65,
        minHeight: '120px',
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word',
        width: '100%',
        boxSizing: 'border-box',
        borderRadius: '0 0 16px 16px'
      }}>
        {children}
      </div>
    </div>
  )
  
  // 检查是否在API页面并且容器可用
  const isApiPage = window.location.pathname.includes('/api/')
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