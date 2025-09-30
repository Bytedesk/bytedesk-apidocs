import React, { useEffect, useState } from 'react'
import { useIntl } from 'react-intl'

interface TocItem {
  id: string
  text: string
  level: number
}

interface TableOfContentsProps {
  contentSelector?: string
}

export const TableOfContents: React.FC<TableOfContentsProps> = ({ 
  contentSelector = '.content' 
}) => {
  const intl = useIntl()
  const [tocItems, setTocItems] = useState<TocItem[]>([])
  const [activeId, setActiveId] = useState<string>('')

  useEffect(() => {
    // 查找所有标题元素
    const findHeadings = () => {
      const contentElement = document.querySelector(contentSelector)
      if (!contentElement) {
        return []
      }

      const headings = contentElement.querySelectorAll('h1, h2, h3, h4, h5, h6')
      const items: TocItem[] = []

      headings.forEach((heading, index) => {
        const level = parseInt(heading.tagName.charAt(1))
        const text = heading.textContent?.trim() || ''
        let id = heading.id

        if (!text) return // 跳过空标题

        // 如果标题没有 id，就生成一个
        if (!id) {
          // 创建更好的 slug
          id = text
            .toLowerCase()
            .replace(/[^\w\s\u4e00-\u9fff]/g, '') // 保留英文字符、数字、空格和中文字符
            .replace(/\s+/g, '-') // 空格替换为连字符
            .replace(/^-+|-+$/g, '') // 移除开头和结尾的连字符
            .trim()
          
          // 如果生成的 id 为空，则使用备用方案
          if (!id) {
            id = `heading-${index + 1}`
          }
          
          // 确保 id 唯一性
          let finalId = id
          let counter = 1
          while (document.getElementById(finalId)) {
            finalId = `${id}-${counter}`
            counter++
          }
          
          heading.id = finalId
          id = finalId
        }

        items.push({ id, text, level })
      })

      return items
    }

    let timeoutId: number
    let observer: MutationObserver

    const updateToc = () => {
      const items = findHeadings()
      setTocItems(items)
    }

    // 初始延迟，等待页面完全渲染
    timeoutId = window.setTimeout(updateToc, 500)

    // 创建观察器来监听 DOM 变化
    observer = new MutationObserver((mutations) => {
      let shouldUpdate = false
      
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          // 检查是否有新的标题元素被添加
          const addedNodes = Array.from(mutation.addedNodes)
          const hasHeadings = addedNodes.some(node => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const element = node as Element
              return element.matches('h1, h2, h3, h4, h5, h6') || 
                     element.querySelector('h1, h2, h3, h4, h5, h6')
            }
            return false
          })
          
          if (hasHeadings) {
            shouldUpdate = true
          }
        }
      })
      
      if (shouldUpdate) {
        // 延迟更新以避免频繁重新渲染
        clearTimeout(timeoutId)
        timeoutId = window.setTimeout(updateToc, 100)
      }
    })

    // 开始观察内容区域
    const contentElement = document.querySelector(contentSelector)
    if (contentElement) {
      observer.observe(contentElement, {
        childList: true,
        subtree: true
      })
    }

    // 清理函数
    return () => {
      window.clearTimeout(timeoutId)
      if (observer) {
        observer.disconnect()
      }
    }
  }, [contentSelector])

  useEffect(() => {
    // 监听滚动事件，高亮当前可见的标题
    const handleScroll = () => {
      const headings = tocItems.map(item => document.getElementById(item.id)).filter(Boolean)
      
      if (headings.length === 0) return

      const scrollPosition = window.scrollY + 100 // 偏移量，提前激活

      let currentActiveId = ''
      
      for (let i = headings.length - 1; i >= 0; i--) {
        const heading = headings[i]
        if (heading && heading.offsetTop <= scrollPosition) {
          currentActiveId = heading.id
          break
        }
      }

      if (currentActiveId !== activeId) {
        setActiveId(currentActiveId)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // 初始化时执行一次

    return () => window.removeEventListener('scroll', handleScroll)
  }, [tocItems, activeId])

  const handleClick = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      const yOffset = -80 // 为固定的顶部导航栏留出空间
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset
      window.scrollTo({ top: y, behavior: 'smooth' })
    }
  }

  if (tocItems.length === 0) {
    return (
      <div className="table-of-contents">
        <div className="toc-title" style={{ 
          fontWeight: 600, 
          fontSize: '14px', 
          color: 'var(--text-primary)', 
          marginBottom: '16px' 
        }}>
          {intl.formatMessage({ id: 'common.onThisPage' })}
        </div>
        <div style={{ 
          color: 'var(--text-muted)', 
          fontSize: '13px',
          fontStyle: 'italic'
        }}>
          加载中...
        </div>
      </div>
    )
  }

  return (
    <div className="table-of-contents">
      <div className="toc-title" style={{ 
        fontWeight: 600, 
        fontSize: '14px', 
        color: 'var(--text-primary)', 
        marginBottom: '16px' 
      }}>
        {intl.formatMessage({ id: 'common.onThisPage' })}
      </div>
      
      <nav className="toc-nav">
        <ul style={{ 
          listStyle: 'none', 
          padding: 0, 
          margin: 0 
        }}>
          {tocItems.map((item) => (
            <li key={item.id} style={{ marginBottom: '4px' }}>
              <a
                href={`#${item.id}`}
                onClick={(e) => {
                  e.preventDefault()
                  handleClick(item.id)
                }}
                style={{
                  display: 'block',
                  padding: '6px 0',
                  paddingLeft: `${(item.level - 1) * 12 + 8}px`,
                  fontSize: item.level === 1 ? '14px' : '13px',
                  color: activeId === item.id ? 'var(--primary)' : 'var(--text-muted)',
                  textDecoration: 'none',
                  borderLeft: activeId === item.id ? '2px solid var(--primary)' : '2px solid transparent',
                  marginLeft: '-8px',
                  transition: 'all 0.2s ease',
                  lineHeight: '1.4',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  if (activeId !== item.id) {
                    e.currentTarget.style.color = 'var(--text-primary)'
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeId !== item.id) {
                    e.currentTarget.style.color = 'var(--text-muted)'
                  }
                }}
              >
                {item.text}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}