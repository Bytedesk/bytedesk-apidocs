import React from 'react'
import { Link, NavLink, Route, Routes, useLocation } from 'react-router-dom'
import { Splitter } from 'antd'
import docs from '../../docs.json'

function Badge({ page }: { page: string }) {
  const base = page.split('/').pop()!.toLowerCase()
  // 更加详细的方法映射规则
  const map: Record<string, string> = { 
    get: 'get', 
    list: 'get',
    profile: 'get',
    'query-org': 'get',
    create: 'post', 
    send: 'post',
    login: 'post',
    'admin-login': 'post',
    register: 'post',
    'refresh-token': 'post',
    delete: 'del', 
    webhook: 'hook' 
  }
  const type = map[base]
  if (!type) {
    // 如果没有映射，尝试从路径推断
    if (base.includes('get') || base.includes('list') || base.includes('query')) return <span className="badge get">GET</span>
    if (base.includes('create') || base.includes('send') || base.includes('login') || base.includes('register')) return <span className="badge post">POST</span>
    if (base.includes('update') || base.includes('edit')) return <span className="badge put">PUT</span>
    if (base.includes('delete') || base.includes('remove')) return <span className="badge del">DEL</span>
    return null
  }
  const text: Record<string, string> = { get: 'GET', post: 'POST', put: 'PUT', del: 'DEL', hook: 'HOOK' }
  return <span className={`badge ${type}`}>{text[type]}</span>
}

function Sidebar() {
  const loc = useLocation()
  // Remove optional basename '/apidocs' prefix to compute active page
  const current = loc.pathname.replace(/^\/apidocs\//, '').replace(/^\//, '') || 'index'
  return (
    <aside className="sidebar" style={{ height: '100%', overflow: 'auto' }}>
      {/* {docs.navigation?.global?.anchors?.length ? (
        <div>
          {docs.navigation.global.anchors.map((a: any) => (
            <a key={a.href} href={a.href} target="_blank" rel="noreferrer">{a.anchor}</a>
          ))}
        </div>
      ) : null} */}
      {docs.navigation.tabs.map((tab: any) => (
        <div key={tab.tab}>
          <div className="tab">{tab.tab}</div>
          {tab.groups.map((g: any) => (
            <div key={g.group}>
              <div className="group-title">{g.group}</div>
              <ul>
                {g.pages.map((p: string) => (
                  <li key={p}>
                    <NavLink to={`/${p}`} className={({ isActive }) => (isActive || current===p ? 'active' : '')}>
                      <Badge page={p} />
                      <span>{p.split('/').pop()}</span>
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ))}
    </aside>
  )
}

function Topbar({ isMobile, onSidebarToggle, onExamplesToggle }: { isMobile: boolean, onSidebarToggle: () => void, onExamplesToggle: () => void }) {
  const [isDark, setIsDark] = React.useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark' || 
             (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)
    }
    return false
  })
  
  const location = useLocation()
  const isApiPage = location.pathname.includes('/api-reference/')

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
  <Link className="site" to="/index">{docs.name}</Link>
      </div>
      <div className="center">
        {/* <input placeholder="Search (placeholder)" /> */}
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
        <a 
          href="https://github.com/Bytedesk/bytedesk-apidocs"
          target="_blank"
          rel="noopener noreferrer"
          className="github-link"
          title="View on GitHub"
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
          title={isDark ? "Switch to light mode" : "Switch to dark mode"}
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

const mdxModules = import.meta.glob([
  '../../*.mdx',
  '../../essentials/**/*.mdx',
  '../../ai-tools/**/*.mdx',
  '../../api-reference/**/*.mdx',
  '../../snippets/**/*.mdx',
]) as Record<string, () => Promise<any>>

function Page({ path, isMobile, examplesOpen, onCloseExamples }: { path: string, isMobile?: boolean, examplesOpen?: boolean, onCloseExamples?: () => void }) {
  // keys in mdxModules start with ../../
  const key = `../../${path}.mdx`
  const loader = mdxModules[key]
  const Mdx = React.useMemo(() => React.lazy(loader as any), [path])
  
  // Check if it's an API endpoint page
  const isApiEndpoint = path.startsWith('api-reference/')
  
  // Splitter size state to prevent drift
  const [sidebarSize, setSidebarSize] = React.useState(260)
  const [examplesSize, setExamplesSize] = React.useState(580)
  const [tocSize, setTocSize] = React.useState(320)
  
  if (isMobile) {
    // 移动端保持原有布局
    return (
      <React.Suspense fallback={<div style={{padding: 24}}>Loading...</div>}>
        <div className={isApiEndpoint ? "content-api" : "content"}>
          <div className="main-content">
            <Mdx />
          </div>
          
          {/* 移动端代码示例 Drawer */}
          {isApiEndpoint && examplesOpen && (
            <>
              <div className="drawer-overlay" onClick={onCloseExamples} />
              <div className="drawer-examples">
                <div className="drawer-header">
                  <span>代码示例</span>
                  <button onClick={onCloseExamples} className="close-btn">×</button>
                </div>
                <div className="examples-sticky" id="mobile-api-examples-container">
                  {/* Mobile examples will be populated here */}
                </div>
              </div>
            </>
          )}
        </div>
      </React.Suspense>
    )
  }

  // 桌面端使用 Splitter 布局
  return (
    <React.Suspense fallback={<div style={{padding: 24}}>Loading...</div>}>
      <div className="page-container" style={{ height: 'calc(100vh - 64px)' }}>
        <Splitter
          style={{ height: '100%' }}
          onResize={(sizes) => {
            if (sizes && sizes.length >= 1) {
              setSidebarSize(sizes[0])
            }
          }}
        >
          {/* 左侧栏 - 侧边导航 */}
          <Splitter.Panel 
            size={sidebarSize}
            min={250} 
            style={{ 
              background: 'var(--sidebar-bg)', 
              borderRight: '1px solid var(--border-color)',
              overflow: 'auto',
              height: '100%'
            }}
          >
            <Sidebar />
          </Splitter.Panel>

          {/* 中间和右侧 */}
          <Splitter.Panel style={{ display: 'flex', flexDirection: 'column' }}>
            {isApiEndpoint ? (
              // API 页面：主内容 + 代码示例
              <Splitter
                style={{ height: '100%' }}
                onResize={(sizes) => {
                  if (sizes && sizes.length >= 2) {
                    setExamplesSize(sizes[1])
                  }
                }}
              >
                {/* 主内容区域 */}
                <Splitter.Panel 
                  style={{ 
                    background: 'var(--bg-primary)',
                    overflow: 'auto',
                    padding: 0
                  }}
                >
                  <div className="main-content" style={{ padding: '32px 40px' }}>
                    <Mdx />
                  </div>
                </Splitter.Panel>

                {/* 右侧代码示例栏 */}
                <Splitter.Panel 
                  size={examplesSize}
                  min={320} 
                  style={{ 
                    background: 'var(--bg-secondary)', 
                    borderLeft: '1px solid var(--border-color)',
                    overflow: 'hidden'
                  }}
                >
                  <div className="api-examples" style={{ height: '100%', padding: 0, width: '100%', overflow: 'hidden' }}>
                    <div 
                      className="examples-sticky" 
                      id="api-examples-container" 
                      style={{ 
                        height: '100%', 
                        overflow: 'auto',
                        width: '100%',
                        padding: '20px',
                        boxSizing: 'border-box'
                      }}
                    >
                      {/* Examples will be populated by RequestExample/ResponseExample components */}
                    </div>
                  </div>
                </Splitter.Panel>
              </Splitter>
            ) : (
              // 非 API 页面：主内容 + 目录
              <Splitter
                style={{ height: '100%' }}
                onResize={(sizes) => {
                  if (sizes && sizes.length >= 2) {
                    setTocSize(sizes[1])
                  }
                }}
              >
                {/* 主内容区域 */}
                <Splitter.Panel 
                  style={{ 
                    background: 'var(--bg-primary)',
                    overflow: 'auto',
                    padding: 0
                  }}
                >
                  <div className="content" style={{ padding: '40px 48px', maxWidth: '1000px', lineHeight: 1.7 }}>
                    <Mdx />
                  </div>
                </Splitter.Panel>

                {/* 右侧目录栏 */}
                <Splitter.Panel 
                  size={tocSize}
                  min={200} 
                  max={400}
                  style={{ 
                    background: 'var(--bg-secondary)', 
                    borderLeft: '1px solid var(--border-color)',
                    overflow: 'hidden'
                  }}
                >
                  <div className="otp" style={{ padding: '24px 16px' }}>
                    <div className="title" style={{ fontWeight: 600, fontSize: '14px', color: 'var(--text-primary)', marginBottom: '16px' }}>
                      On this page
                    </div>
                    {/* 运行时生成目录较复杂，这里可在后续加 rehype 解析 anchor 列表 */}
                  </div>
                </Splitter.Panel>
              </Splitter>
            )}
          </Splitter.Panel>
        </Splitter>
      </div>
    </React.Suspense>
  )
}

export default function App() {
  const [sidebarOpen, setSidebarOpen] = React.useState(false)
  const [examplesOpen, setExamplesOpen] = React.useState(false)
  const [isMobile, setIsMobile] = React.useState(false)
  
  // 检测移动端
  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])
  
  // 关闭 drawer 当点击背景时
  const closeSidebar = () => setSidebarOpen(false)
  const closeExamples = () => setExamplesOpen(false)
  
  return (
    <div>
      <Topbar 
        isMobile={isMobile}
        onSidebarToggle={() => setSidebarOpen(!sidebarOpen)}
        onExamplesToggle={() => setExamplesOpen(!examplesOpen)}
      />
      
      {isMobile ? (
        // 移动端布局
        <div className="container">
          {/* 移动端侧边栏 Drawer */}
          {sidebarOpen && (
            <>
              <div className="drawer-overlay" onClick={closeSidebar} />
              <div className="drawer-sidebar">
                <div className="drawer-header">
                  <span>导航</span>
                  <button onClick={closeSidebar} className="close-btn">×</button>
                </div>
                <Sidebar />
              </div>
            </>
          )}
          
          {/* 主内容区域 */}
          <div className="main-wrapper">
            <Routes>
              <Route path="/" element={<Page path="index" isMobile={isMobile} examplesOpen={examplesOpen} onCloseExamples={closeExamples} />} />
              <Route path="/index" element={<Page path="index" isMobile={isMobile} examplesOpen={examplesOpen} onCloseExamples={closeExamples} />} />
              {docs.navigation.tabs.flatMap((t: any) => t.groups.flatMap((g: any) => g.pages)).map((p: string) => (
                <Route key={p} path={`/${p}`} element={<Page path={p} isMobile={isMobile} examplesOpen={examplesOpen} onCloseExamples={closeExamples} />} />
              ))}
            </Routes>
          </div>
        </div>
      ) : (
        // 桌面端 Splitter 布局
        <Routes>
          <Route path="/" element={<Page path="index" isMobile={isMobile} />} />
          <Route path="/index" element={<Page path="index" isMobile={isMobile} />} />
          {docs.navigation.tabs.flatMap((t: any) => t.groups.flatMap((g: any) => g.pages)).map((p: string) => (
            <Route key={p} path={`/${p}`} element={<Page path={p} isMobile={isMobile} />} />
          ))}
        </Routes>
      )}
    </div>
  )
}
