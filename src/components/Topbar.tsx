import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useIntl } from 'react-intl'
import { LanguageSelector } from './LanguageSelector'
import docs from '../../docs.json'

interface TopbarProps {
  isMobile: boolean
  onSidebarToggle: () => void
  onExamplesToggle: () => void
  activeTab: number
  onTabChange: (index: number) => void
}

export function Topbar({ isMobile, onSidebarToggle, onExamplesToggle, activeTab, onTabChange }: TopbarProps) {
  const intl = useIntl()
  const [isDark, setIsDark] = React.useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark' || 
             (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)
    }
    return false
  })
  
  const location = useLocation()
  const isApiPage = location.pathname.includes('/api/service/') || location.pathname.includes('/api/call/') || location.pathname.includes('/api/ticket/') || location.pathname.includes('/api/kbase/') || location.pathname.includes('/api/ai/')

  const toggleTheme = () => {
    const newTheme = !isDark
    setIsDark(newTheme)
    localStorage.setItem('theme', newTheme ? 'dark' : 'light')
    document.documentElement.setAttribute('data-theme', newTheme ? 'dark' : 'light')
  }

  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light')
  }, [isDark])

  return (
    <header className="topbar">
      <div className="topbar-left">
        {isMobile && (
          <button onClick={onSidebarToggle} className="mobile-menu-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
        )}
        <Link className="site" to="/index">{intl.formatMessage({ id: 'app.title' })}</Link>
      </div>
      <div className="center">
        {/* Tab 切换 */}
        {docs.navigation.tabs.length > 1 && (
          <div style={{
            display: 'flex',
            gap: isMobile ? '4px' : '8px',
            alignItems: 'center'
          }}>
            {docs.navigation.tabs.map((tab: any, index: number) => (
              <button
                key={tab.tab}
                onClick={() => onTabChange(index)}
                style={{
                  padding: isMobile ? '6px 12px' : '8px 20px',
                  borderRadius: '8px',
                  background: activeTab === index 
                    ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                    : 'transparent',
                  color: activeTab === index ? '#ffffff' : 'var(--text-primary)',
                  fontWeight: activeTab === index ? 600 : 400,
                  fontSize: isMobile ? '13px' : '14px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: activeTab === index 
                    ? '0 2px 8px rgba(102, 126, 234, 0.3)'
                    : 'none',
                  border: activeTab === index 
                    ? 'none'
                    : '1px solid var(--border-color)',
                  whiteSpace: 'nowrap' as const
                }}
                onMouseEnter={(e) => {
                  if (activeTab !== index) {
                    e.currentTarget.style.background = 'var(--hover-bg)'
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeTab !== index) {
                    e.currentTarget.style.background = 'transparent'
                  }
                }}
              >
                {tab.tab}
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="right">
        {isMobile && isApiPage && (
          <button onClick={onExamplesToggle} className="mobile-menu-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="9" y1="9" x2="15" y2="9"></line>
              <line x1="9" y1="15" x2="15" y2="15"></line>
            </svg>
          </button>
        )}
        
        {/* 语言选择器 */}
        <LanguageSelector style={{ marginRight: '8px' }} />
        
        <a 
          href="https://github.com/Bytedesk/bytedesk-apidocs"
          target="_blank"
          rel="noopener noreferrer"
          className="github-link"
          title={intl.formatMessage({ id: 'common.viewOnGitHub' })}
          style={{
            background: 'transparent',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            padding: '8px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#6b7280',
            transition: 'all 0.2s',
            textDecoration: 'none',
            marginRight: '8px'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#f3f4f6'
            e.currentTarget.style.borderColor = '#d1d5db'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent'
            e.currentTarget.style.borderColor = '#e5e7eb'
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
          </svg>
        </a>
        <button 
          onClick={toggleTheme}
          className="theme-toggle"
          title={isDark ? intl.formatMessage({ id: 'common.lightMode' }) : intl.formatMessage({ id: 'common.darkMode' })}
          style={{
            background: 'transparent',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            padding: '8px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#6b7280',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#f3f4f6'
            e.currentTarget.style.borderColor = '#d1d5db'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent'
            e.currentTarget.style.borderColor = '#e5e7eb'
          }}
        >
          {isDark ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="5"/>
              <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
            </svg>
          )}
        </button>
      </div>
    </header>
  )
}