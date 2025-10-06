import React, { useState } from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism'

interface CurlDisplayProps {
  command: string
  theme?: 'light' | 'dark'
  showLineNumbers?: boolean
  title?: string
}

export const CurlDisplay: React.FC<CurlDisplayProps> = ({
  command,
  theme = 'light',
  showLineNumbers = false,
  title = 'cURL'
}) => {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(command)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const codeStyle = theme === 'dark' ? vscDarkPlus : oneLight

  return (
    <div
      style={{
        marginBottom: '20px',
        background: theme === 'dark' ? '#1a1b26' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: '16px',
        border: 'none',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2), 0 6px 10px rgba(0, 0, 0, 0.15)',
        overflow: 'hidden'
      }}
    >
      {/* Header */}
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          padding: '14px 20px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span
            style={{
              fontSize: '16px',
              fontWeight: 600,
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)'
            }}
          >
            <span style={{ fontSize: '18px' }}>▶</span>
            {title}
          </span>
        </div>

        <button
          onClick={handleCopy}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: 'rgba(255, 255, 255, 0.25)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            padding: '7px 14px',
            borderRadius: '8px',
            fontSize: '13px',
            color: '#ffffff',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            fontWeight: 600,
            backdropFilter: 'blur(10px)',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
          }}
          onMouseEnter={(e) => {
            if (!copied) {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.35)'
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.5)'
              e.currentTarget.style.transform = 'translateY(-1px)'
            }
          }}
          onMouseLeave={(e) => {
            if (!copied) {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.25)'
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)'
              e.currentTarget.style.transform = 'translateY(0)'
            }
          }}
        >
          {copied ? (
            <>
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              <span>Copied!</span>
            </>
          ) : (
            <>
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
              </svg>
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code Content with Syntax Highlighting */}
      <div style={{ 
        background: theme === 'dark' ? '#16161e' : 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(10px)'
      }}>
        <SyntaxHighlighter
          language="bash"
          style={theme === 'dark' ? vscDarkPlus : vscDarkPlus}
          showLineNumbers={showLineNumbers}
          customStyle={{
            margin: 0,
            padding: '24px',
            background: 'transparent',
            fontSize: '14px',
            lineHeight: '1.7',
            borderRadius: '0 0 16px 16px'
          }}
          codeTagProps={{
            style: {
              fontFamily: '"JetBrains Mono", "Fira Code", "SF Mono", "Monaco", "Cascadia Code", monospace',
              textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)'
            }
          }}
        >
          {command}
        </SyntaxHighlighter>
      </div>
    </div>
  )
}

// 用于 MDX 文档中的便捷包装器
export const Curl: React.FC<{ children: string; theme?: 'light' | 'dark' }> = ({
  children,
  theme = 'light'
}) => {
  const command = typeof children === 'string' ? children.trim() : ''
  return <CurlDisplay command={command} theme={theme} />
}
