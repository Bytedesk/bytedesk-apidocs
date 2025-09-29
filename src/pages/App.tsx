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
  return (
    <header className="topbar">
      <div><Link className="site" to="/index">{docs.name}</Link></div>
      <div className="center"><input placeholder="Search (placeholder)" /></div>
      <div className="right">
        {docs.navbar?.links?.[0]?.href && <a href={docs.navbar.links[0].href}>Support</a>}
        {docs.navbar?.primary?.href && <a className="primary" href={docs.navbar.primary.href}>{docs.navbar.primary.label || 'Dashboard'}</a>}
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
