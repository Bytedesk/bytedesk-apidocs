import React from 'react'
import { useIntl } from 'react-intl'

export const Footer: React.FC = () => {
  const intl = useIntl()

  return (
    <footer 
      style={{
        borderTop: '1px solid var(--border-color)',
        backgroundColor: 'var(--bg-secondary)',
        padding: '24px 0',
        marginTop: 'auto',
        textAlign: 'center'
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
        {/* 链接列表 - 包含官网链接 */}
        <ul 
          style={{
            listStyle: 'none',
            padding: 0,
            margin: '0 0 16px 0',
            display: 'flex',
            justifyContent: 'center',
            flexWrap: 'wrap',
            gap: '0 24px'
          }}
        >
          <li>
            <a 
              href="https://www.weiyuai.cn/"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: 'var(--text-primary)',
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: '500',
                transition: 'color 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'var(--primary-color)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'var(--text-primary)'
              }}
            >
              🌐 {intl.formatMessage({ id: 'footer.officialWebsite' })}
            </a>
          </li>
          <li>
            <a 
              href="https://www.weiyuai.cn/protocal.html"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: 'var(--text-secondary)',
                textDecoration: 'none',
                fontSize: '14px',
                transition: 'color 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'var(--primary-color)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'var(--text-secondary)'
              }}
            >
              {intl.formatMessage({ id: 'footer.userAgreement' })}
            </a>
          </li>
          <li>
            <a 
              href="https://www.weiyuai.cn/privacy.html"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: 'var(--text-secondary)',
                textDecoration: 'none',
                fontSize: '14px',
                transition: 'color 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'var(--primary-color)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'var(--text-secondary)'
              }}
            >
              {intl.formatMessage({ id: 'footer.privacyPolicy' })}
            </a>
          </li>
          <li>
            <a 
              href="https://beian.miit.gov.cn/"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: 'var(--text-secondary)',
                textDecoration: 'none',
                fontSize: '14px',
                transition: 'color 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'var(--primary-color)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'var(--text-secondary)'
              }}
            >
              京ICP备17041763号-20
            </a>
          </li>
          <li>
            <a 
              href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=44030502008688"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: 'var(--text-secondary)',
                textDecoration: 'none',
                fontSize: '14px',
                transition: 'color 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'var(--primary-color)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'var(--text-secondary)'
              }}
            >
              粤公网安备 44030502008688号
            </a>
          </li>
        </ul>

        {/* 版权信息 */}
        <div 
          style={{
            color: 'var(--text-secondary)',
            fontSize: '12px',
            opacity: 0.8
          }}
        >
          © {new Date().getFullYear()} {intl.formatMessage({ id: 'footer.copyright' })}
        </div>
      </div>
    </footer>
  )
}