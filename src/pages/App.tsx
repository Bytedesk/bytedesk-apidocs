import React from 'react'
import { Route, Routes } from 'react-router-dom'
import { useIntl } from 'react-intl'
import { Footer, Page, Sidebar, Topbar } from '../components'
import docs from '../../docs.json'

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
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Topbar 
        isMobile={isMobile}
        onSidebarToggle={() => setSidebarOpen(!sidebarOpen)}
        onExamplesToggle={() => setExamplesOpen(!examplesOpen)}
      />
      
      <div style={{ flex: 1 }}>
        {isMobile ? (
          // 移动端布局
          <div className="container">
            {/* 移动端侧边栏 Drawer */}
            {sidebarOpen && (
              <>
                <div className="drawer-overlay" onClick={closeSidebar} />
                <div className="drawer-sidebar">
                  <div className="drawer-header">
                    <span>{useIntl().formatMessage({ id: 'common.navigation' })}</span>
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
      
      <Footer />
    </div>
  )
}