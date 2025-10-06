import React from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { useIntl } from 'react-intl'
import { Footer, Page, Sidebar, Topbar } from '../components'
import docs from '../../docs.json'

export default function App() {
  const [sidebarOpen, setSidebarOpen] = React.useState(false)
  const [examplesOpen, setExamplesOpen] = React.useState(false)
  const [isMobile, setIsMobile] = React.useState(false)
  
  const location = useLocation()
  
  // Determine active tab based on current path
  const getActiveTabIndex = () => {
    const current = location.pathname.replace(/^\/apidocs\//, '').replace(/^\//, '') || 'index'
    if (current.startsWith('call-center/')) {
      return 1 // 呼叫中心
    }
    if (current.startsWith('ticket-system/')) {
      return 2 // 工单系统
    }
    if (current.startsWith('knowledge-base/')) {
      return 3 // 知识库
    }
    if (current.startsWith('ai-qa/')) {
      return 4 // AI问答
    }
    return 0 // 在线客服 (default)
  }
  
  const [activeTab, setActiveTab] = React.useState(getActiveTabIndex())
  
  // Update active tab when location changes
  React.useEffect(() => {
    setActiveTab(getActiveTabIndex())
  }, [location.pathname])
  
  // Handle tab change
  const handleTabChange = (index: number) => {
    setActiveTab(index)
    // Navigate to first page of the selected tab
    const firstPage = docs.navigation.tabs[index].groups[0].pages[0]
    window.location.href = `/${firstPage}`
  }
  
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
        activeTab={activeTab}
        onTabChange={handleTabChange}
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
                  <Sidebar activeTab={activeTab} />
                </div>
              </>
            )}
            
            {/* 主内容区域 */}
            <div className="main-wrapper">
              <Routes>
                <Route path="/" element={<Page path="index" isMobile={isMobile} examplesOpen={examplesOpen} onCloseExamples={closeExamples} activeTab={activeTab} />} />
                <Route path="/index" element={<Page path="index" isMobile={isMobile} examplesOpen={examplesOpen} onCloseExamples={closeExamples} activeTab={activeTab} />} />
                {docs.navigation.tabs.flatMap((t: any) => t.groups.flatMap((g: any) => g.pages)).map((p: string) => (
                  <Route key={p} path={`/${p}`} element={<Page path={p} isMobile={isMobile} examplesOpen={examplesOpen} onCloseExamples={closeExamples} activeTab={activeTab} />} />
                ))}
              </Routes>
            </div>
          </div>
        ) : (
          // 桌面端 Splitter 布局
          <Routes>
            <Route path="/" element={<Page path="index" isMobile={isMobile} activeTab={activeTab} />} />
            <Route path="/index" element={<Page path="index" isMobile={isMobile} activeTab={activeTab} />} />
            {docs.navigation.tabs.flatMap((t: any) => t.groups.flatMap((g: any) => g.pages)).map((p: string) => (
              <Route key={p} path={`/${p}`} element={<Page path={p} isMobile={isMobile} activeTab={activeTab} />} />
            ))}
          </Routes>
        )}
      </div>
      
      <Footer />
    </div>
  )
}