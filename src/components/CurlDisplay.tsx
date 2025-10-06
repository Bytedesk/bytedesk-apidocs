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
        background: '#ffffff',
        borderRadius: '16px',
        border: '1px solid #e5e7eb',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        overflow: 'hidden'
      }}
    >
      {/* Header */}
      <div
        style={{
          background: '#f9fafb',
          padding: '14px 20px',
          borderBottom: '1px solid #e5e7eb',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span
            style={{
              fontSize: '16px',
              fontWeight: 500,
              color: '#374151',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
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
            background: '#ffffff',
            border: '1px solid #d1d5db',
            padding: '7px 12px',
            borderRadius: '6px',
            fontSize: '13px',
            color: copied ? '#059669' : '#6b7280',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
            fontWeight: 500
          }}
          onMouseEnter={(e) => {
            if (!copied) {
              e.currentTarget.style.background = '#f9fafb'
              e.currentTarget.style.borderColor = '#9ca3af'
              e.currentTarget.style.color = '#374151'
            }
          }}
          onMouseLeave={(e) => {
            if (!copied) {
              e.currentTarget.style.background = '#ffffff'
              e.currentTarget.style.borderColor = '#d1d5db'
              e.currentTarget.style.color = '#6b7280'
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
      <div style={{ background: theme === 'dark' ? '#1e1e1e' : '#f8f9fa' }}>
        <SyntaxHighlighter
          language="bash"
          style={codeStyle}
          showLineNumbers={showLineNumbers}
          customStyle={{
            margin: 0,
            padding: '20px',
            background: 'transparent',
            fontSize: '13.5px',
            lineHeight: '1.65',
            borderRadius: '0 0 16px 16px'
          }}
          codeTagProps={{
            style: {
              fontFamily:
                '"SF Mono", "Monaco", "Inconsolata", "Roboto Mono", "Source Code Pro", monospace'
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
