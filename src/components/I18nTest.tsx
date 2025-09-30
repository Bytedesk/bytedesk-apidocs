import React from 'react'
import { useIntl } from 'react-intl'

export const I18nTest: React.FC = () => {
  const intl = useIntl()
  
  return (
    <div style={{ 
      padding: '24px', 
      border: '1px solid #e5e7eb', 
      borderRadius: '12px', 
      margin: '24px 0',
      background: 'var(--bg-secondary)',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <h3 style={{ 
        marginTop: 0, 
        marginBottom: '16px',
        color: 'var(--text-primary)',
        fontSize: '18px',
        fontWeight: 600
      }}>
        🌍 国际化功能测试
      </h3>
      
      <div style={{ display: 'grid', gap: '12px' }}>
        <div>
          <strong>通用翻译:</strong>
          <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
            <li>{intl.formatMessage({ id: 'common.search' })}</li>
            <li>{intl.formatMessage({ id: 'common.loading' })}</li>
            <li>{intl.formatMessage({ id: 'common.codeExamples' })}</li>
            <li>{intl.formatMessage({ id: 'common.onThisPage' })}</li>
          </ul>
        </div>
        
        <div>
          <strong>API 方法:</strong>
          <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
            <li>GET → {intl.formatMessage({ id: 'methods.get' })}</li>
            <li>POST → {intl.formatMessage({ id: 'methods.post' })}</li>
            <li>PUT → {intl.formatMessage({ id: 'methods.put' })}</li>
            <li>DELETE → {intl.formatMessage({ id: 'methods.delete' })}</li>
          </ul>
        </div>
        
        <div>
          <strong>导航标签:</strong>
          <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
            <li>{intl.formatMessage({ id: 'nav.authentication' })}</li>
            <li>{intl.formatMessage({ id: 'nav.messages' })}</li>
            <li>{intl.formatMessage({ id: 'nav.threads' })}</li>
            <li>{intl.formatMessage({ id: 'nav.users' })}</li>
          </ul>
        </div>
      </div>
      
      <div style={{ 
        marginTop: '20px', 
        padding: '12px', 
        background: 'rgba(34, 197, 94, 0.1)', 
        borderRadius: '8px',
        border: '1px solid rgba(34, 197, 94, 0.2)'
      }}>
        <strong style={{ color: '#16a34a' }}>💡 提示:</strong> 
        <span style={{ marginLeft: '8px', color: 'var(--text-secondary)' }}>
          在页面顶部的语言选择器中切换语言，查看翻译效果！
        </span>
      </div>
    </div>
  )
}