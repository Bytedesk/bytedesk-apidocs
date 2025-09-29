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
    <aside className="sidebar">
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
        >
          {/* 左侧栏 - 侧边导航 */}
          <Splitter.Panel 
            defaultSize="300px" 
            min="250px" 
            max="450px"
            style={{ 
              background: 'var(--sidebar-bg)', 
              borderRight: '1px solid var(--border-color)',
              overflow: 'hidden'
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
                  defaultSize="420px" 
                  min="320px" 
                  max="600px"
                  style={{ 
                    background: 'var(--bg-secondary)', 
                    borderLeft: '1px solid var(--border-color)',
                    overflow: 'hidden'
                  }}
                >
                  <div className="api-examples" style={{ height: '100%', padding: 0 }}>
                    <div className="examples-sticky" id="api-examples-container" style={{ height: '100%', overflow: 'auto' }}>
                      {/* Examples will be populated by RequestExample/ResponseExample components */}
                    </div>
                  </div>
                </Splitter.Panel>
              </Splitter>
            ) : (
              // 非 API 页面：主内容 + 目录
              <Splitter
                style={{ height: '100%' }}
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
                  defaultSize="280px" 
                  min="200px" 
                  max="400px"
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
