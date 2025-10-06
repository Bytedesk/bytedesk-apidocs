import React, { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { useIntl } from 'react-intl'
import { Badge } from './Badge'
import docs from '../../docs.json'

export function Sidebar() {
  const intl = useIntl()
  const loc = useLocation()
  // Remove optional basename '/apidocs' prefix to compute active page
  const current = loc.pathname.replace(/^\/apidocs\//, '').replace(/^\//, '') || 'index'
  
  // Determine active tab based on current path
  const getActiveTabIndex = () => {
    if (current.startsWith('call-center/')) {
      return 1 // 呼叫中心
    }
    return 0 // 在线客服 (default)
  }
  
  const [activeTab, setActiveTab] = useState(getActiveTabIndex())
  
  // Update active tab when location changes
  React.useEffect(() => {
    setActiveTab(getActiveTabIndex())
  }, [current])
  
  return (
    <aside className="sidebar" style={{ height: '100%', overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
      {/* Tab Switcher */}
      {docs.navigation.tabs.length > 1 && (
        <div style={{
          display: 'flex',
          gap: '8px',
          padding: '16px',
          borderBottom: '1px solid var(--border-color)',
          background: 'var(--bg-sidebar)',
          position: 'sticky',
          top: 0,
          zIndex: 10
        }}>
          {docs.navigation.tabs.map((tab: any, index: number) => (
            <button
              key={tab.tab}
              onClick={() => setActiveTab(index)}
              style={{
                flex: 1,
                padding: '8px 16px',
                borderRadius: '8px',
                background: activeTab === index 
                  ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                  : 'transparent',
                color: activeTab === index ? '#ffffff' : 'var(--text-primary)',
                fontWeight: activeTab === index ? 600 : 400,
                fontSize: '14px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: activeTab === index 
                  ? '0 2px 8px rgba(102, 126, 234, 0.3)'
                  : 'none',
                border: activeTab === index 
                  ? 'none'
                  : '1px solid var(--border-color)'
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
      
      {/* Tab Content */}
      <div style={{ flex: 1, overflow: 'auto' }}>
        {docs.navigation.tabs[activeTab].groups.map((g: any) => (
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
    </aside>
  )
}