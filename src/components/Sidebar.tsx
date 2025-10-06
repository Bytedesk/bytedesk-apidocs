import React from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { useIntl } from 'react-intl'
import { Badge } from './Badge'
import docs from '../../docs.json'

interface SidebarProps {
  activeTab: number
}

export function Sidebar({ activeTab }: SidebarProps) {
  const intl = useIntl()
  const loc = useLocation()
  // Remove optional basename '/apidocs' prefix to compute active page
  const current = loc.pathname.replace(/^\/apidocs\//, '').replace(/^\//, '') || 'index'
  
  return (
    <aside className="sidebar" style={{ height: '100%', overflow: 'auto' }}>
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
    </aside>
  )
}