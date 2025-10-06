import React from 'react'
import { Splitter } from 'antd'
import { useIntl } from 'react-intl'
import { Sidebar } from './Sidebar'
import { TableOfContents } from './TableOfContents'

const mdxModules = import.meta.glob([
  '../../*.mdx',
  '../../essentials/**/*.mdx',
  '../../ai-tools/**/*.mdx',
  '../../api/core/**/*.mdx',
  '../../api/service/**/*.mdx',
  '../../api/call/**/*.mdx',
  '../../api/ticket/**/*.mdx',
  '../../api/kbase/**/*.mdx',
  '../../api/ai/**/*.mdx',
  '../../snippets/**/*.mdx',
]) as Record<string, () => Promise<any>>

interface PageProps {
  path: string
  isMobile?: boolean
  examplesOpen?: boolean
  onCloseExamples?: () => void
  activeTab?: number
}

export function Page({ path, isMobile, examplesOpen, onCloseExamples, activeTab = 0 }: PageProps) {
  // keys in mdxModules start with ../../
  const key = `../../${path}.mdx`
  const loader = mdxModules[key]
  const Mdx = React.useMemo(() => React.lazy(loader as any), [path])
  
  // Check if it's an API endpoint page
  const isApiEndpoint = path.startsWith('api/core/') || path.startsWith('api/service/') || path.startsWith('api/call/') || path.startsWith('api/ticket/') || path.startsWith('api/kbase/') || path.startsWith('api/ai/')
  
  // Splitter size state to prevent drift
  const [sidebarSize, setSidebarSize] = React.useState(260)
  const [examplesSize, setExamplesSize] = React.useState(580)
  const [tocSize, setTocSize] = React.useState(320)
  
  const intl = useIntl()
  
  if (isMobile) {
    // 移动端保持原有布局
    return (
      <React.Suspense fallback={<div style={{padding: 24}}>{intl.formatMessage({ id: 'common.loading' })}</div>}>
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
                  <span>{intl.formatMessage({ id: 'common.codeExamples' })}</span>
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
    <React.Suspense fallback={<div style={{padding: 24}}>{intl.formatMessage({ id: 'common.loading' })}</div>}>
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
            <Sidebar activeTab={activeTab} />
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
                    <TableOfContents contentSelector=".content" />
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