import React from 'react'
import { Link, NavLink, Route, Routes, useLocation } from 'react-router-dom'
import docs from '../../docs.json'

function Badge({ page }: { page: string }) {
  const base = page.split('/').pop()!.toLowerCase()
  const map: Record<string, string> = { get: 'get', create: 'post', delete: 'del', webhook: 'hook' }
  const type = map[base]
  if (!type) return null
  const text: Record<string, string> = { get: 'GET', post: 'POST', del: 'DEL', hook: 'HOOK' }
  return <span className={`badge ${type}`}>{text[type]}</span>
}

function Sidebar() {
  const loc = useLocation()
  const current = loc.pathname.replace(/^\//, '') || 'index'
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

function Topbar() {
  const [isDark, setIsDark] = React.useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark' || 
             (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)
    }
    return false
  })

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
      <div><Link className="site" to="/index">{docs.name}</Link></div>
      <div className="center"><input placeholder="Search (placeholder)" /></div>
      <div className="right">
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

function Page({ path }: { path: string }) {
  // keys in mdxModules start with ../../
  const key = `../../${path}.mdx`
  const loader = mdxModules[key]
  const Mdx = React.useMemo(() => React.lazy(loader as any), [path])
  
  // Check if it's an API endpoint page
  const isApiEndpoint = path.startsWith('api-reference/endpoint/')
  
  return (
    <React.Suspense fallback={<div style={{padding: 24}}>Loading...</div>}>
      <div className={isApiEndpoint ? "content-api" : "content"}>
        <div className="main-content">
          <Mdx />
        </div>
        {isApiEndpoint ? (
          <aside className="api-examples">
            <div className="examples-sticky" id="api-examples-container">
              {/* Examples will be populated by RequestExample/ResponseExample components */}
            </div>
          </aside>
        ) : (
          <aside className="otp">
            <div className="title">On this page</div>
            {/* 运行时生成目录较复杂，这里可在后续加 rehype 解析 anchor 列表 */}
          </aside>
        )}
      </div>
    </React.Suspense>
  )
}

export default function App() {
  return (
    <div>
      <Topbar />
      <div className="container">
        <Sidebar />
        <Routes>
          <Route path="/" element={<Page path="index" />} />
          <Route path="/index" element={<Page path="index" />} />
          {docs.navigation.tabs.flatMap((t: any) => t.groups.flatMap((g: any) => g.pages)).map((p: string) => (
            <Route key={p} path={`/${p}`} element={<Page path={p} />} />
          ))}
        </Routes>
      </div>
    </div>
  )
}
