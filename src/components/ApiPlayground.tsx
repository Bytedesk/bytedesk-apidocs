import React, { useState } from 'react'
import { Modal, Button, Input, Select, Tabs, message, Spin, Space } from 'antd'
import { PlayCircleOutlined, CopyOutlined, CodeOutlined } from '@ant-design/icons'

const { TextArea } = Input

interface ApiPlaygroundProps {
  method?: string
  endpoint?: string
  defaultBody?: string
  defaultHeaders?: Record<string, string>
}

// 代码生成器
const generateCode = (
  language: string,
  method: string,
  url: string,
  headers: Record<string, string>,
  body: string
) => {
  const headersArray = Object.entries(headers).filter(([_, v]) => v)

  switch (language) {
    case 'curl':
      const headerFlags = headersArray
        .map(([k, v]) => `  -H "${k}: ${v}"`)
        .join(' \\\n')
      return `curl --request ${method} \\\n  --url ${url} \\\n${headerFlags}${
        body ? ' \\\n  --data \'' + body + '\'' : ''
      }`

    case 'python':
      const pyHeaders = headersArray
        .map(([k, v]) => `        "${k}": "${v}"`)
        .join(',\n')
      return `import requests
import json

url = "${url}"

headers = {
${pyHeaders}
}

${body ? `payload = json.loads('''${body}''')` : 'payload = {}'}

response = requests.${method.toLowerCase()}(url, json=payload, headers=headers)

print(response.status_code)
print(response.json())`

    case 'javascript':
      const jsHeaders = headersArray
        .map(([k, v]) => `    "${k}": "${v}"`)
        .join(',\n')
      return `const url = "${url}";

const options = {
  method: "${method}",
  headers: {
${jsHeaders}
  }${body ? ',\n  body: JSON.stringify(' + body + ')' : ''}
};

fetch(url, options)
  .then(res => res.json())
  .then(json => console.log(json))
  .catch(err => console.error(err));`

    case 'go':
      return `package main

import (
    "bytes"
    "encoding/json"
    "fmt"
    "io"
    "net/http"
)

func main() {
    url := "${url}"
    ${
      body
        ? `
    payload := []byte(\`${body}\`)`
        : 'payload := []byte{}'
    }
    
    req, _ := http.NewRequest("${method}", url, bytes.NewBuffer(payload))
    ${headersArray.map(([k, v]) => `req.Header.Add("${k}", "${v}")`).join('\n    ')}
    
    client := &http.Client{}
    res, err := client.Do(req)
    if err != nil {
        fmt.Println(err)
        return
    }
    defer res.Body.Close()
    
    body, _ := io.ReadAll(res.Body)
    fmt.Println(string(body))
}`

    case 'java':
      return `import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.net.URI;

public class ApiRequest {
    public static void main(String[] args) throws Exception {
        HttpClient client = HttpClient.newHttpClient();
        
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create("${url}"))
                .${method}(${body ? `HttpRequest.BodyPublishers.ofString("""
${body}
""")` : 'HttpRequest.BodyPublishers.noBody()'})
                ${headersArray.map(([k, v]) => `.header("${k}", "${v}")`).join('\n                ')}
                .build();
        
        HttpResponse<String> response = client.send(request, 
                HttpResponse.BodyHandlers.ofString());
        
        System.out.println(response.statusCode());
        System.out.println(response.body());
    }
}`

    default:
      return ''
  }
}

export const ApiPlayground: React.FC<ApiPlaygroundProps> = ({
  method = 'POST',
  endpoint = '/api/v1/chat/completions',
  defaultBody = '',
  defaultHeaders = {}
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [apiUrl, setApiUrl] = useState('https://api.weiyuai.cn' + endpoint)
  const [requestBody, setRequestBody] = useState(
    defaultBody ||
      JSON.stringify(
        {
          model: 'bytedesk-ai',
          messages: [
            {
              role: 'user',
              content: 'Hello, how are you?'
            }
          ]
        },
        null,
        2
      )
  )
  const [headers, setHeaders] = useState<Record<string, string>>({
    'Content-Type': 'application/json',
    Authorization: 'Bearer YOUR_API_KEY',
    ...defaultHeaders
  })
  const [response, setResponse] = useState<{
    status: number
    statusText: string
    data: any
    headers: any
  } | null>(null)
  const [selectedLanguage, setSelectedLanguage] = useState('curl')

  const showModal = () => {
    setIsModalOpen(true)
  }

  const handleCancel = () => {
    setIsModalOpen(false)
  }

  const handleSend = async () => {
    setLoading(true)
    setResponse(null)

    try {
      const requestHeaders: Record<string, string> = {}
      Object.entries(headers).forEach(([key, value]) => {
        if (value && value.trim()) {
          requestHeaders[key] = value
        }
      })

      const options: RequestInit = {
        method,
        headers: requestHeaders
      }

      if (requestBody && method !== 'GET') {
        options.body = requestBody
      }

      const res = await fetch(apiUrl, options)
      const contentType = res.headers.get('content-type')
      let data

      if (contentType?.includes('application/json')) {
        data = await res.json()
      } else {
        data = await res.text()
      }

      setResponse({
        status: res.status,
        statusText: res.statusText,
        data,
        headers: Object.fromEntries(res.headers.entries())
      })

      if (res.ok) {
        message.success('请求成功！')
      } else {
        message.error(`请求失败: ${res.status} ${res.statusText}`)
      }
    } catch (error: any) {
      message.error('请求出错: ' + error.message)
      setResponse({
        status: 0,
        statusText: 'Network Error',
        data: { error: error.message },
        headers: {}
      })
    } finally {
      setLoading(false)
    }
  }

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code)
    message.success('代码已复制到剪贴板')
  }

  const updateHeader = (key: string, value: string) => {
    setHeaders((prev) => ({ ...prev, [key]: value }))
  }

  const codeExample = generateCode(
    selectedLanguage,
    method,
    apiUrl,
    headers,
    requestBody
  )

  return (
    <>
      <Button
        type="primary"
        icon={<PlayCircleOutlined />}
        onClick={showModal}
        size="large"
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          border: 'none',
          borderRadius: 8,
          height: 44,
          fontSize: 16,
          fontWeight: 600,
          boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)'
        }}
      >
        测试 API
      </Button>

      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <CodeOutlined style={{ fontSize: 20 }} />
            <span style={{ fontSize: 18, fontWeight: 600 }}>API 测试工具</span>
          </div>
        }
        open={isModalOpen}
        onCancel={handleCancel}
        width={1200}
        footer={null}
        styles={{
          body: { padding: '24px' }
        }}
      >
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          {/* 左侧：请求配置 */}
          <div>
            <Tabs
              defaultActiveKey="request"
              items={[
                {
                  key: 'request',
                  label: '请求配置',
                  children: (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                      {/* URL */}
                      <div>
                        <label
                          style={{
                            display: 'block',
                            marginBottom: 8,
                            fontWeight: 600,
                            color: '#374151'
                          }}
                        >
                          请求 URL
                        </label>
                        <Space.Compact style={{ display: 'flex', width: '100%' }}>
                          <Select
                            value={method}
                            disabled
                            style={{ width: 120 }}
                            size="large"
                          >
                            <Select.Option value="GET">GET</Select.Option>
                            <Select.Option value="POST">POST</Select.Option>
                            <Select.Option value="PUT">PUT</Select.Option>
                            <Select.Option value="DELETE">DELETE</Select.Option>
                          </Select>
                          <Input
                            value={apiUrl}
                            onChange={(e) => setApiUrl(e.target.value)}
                            size="large"
                            style={{ flex: 1 }}
                          />
                        </Space.Compact>
                      </div>

                      {/* Headers */}
                      <div>
                        <label
                          style={{
                            display: 'block',
                            marginBottom: 8,
                            fontWeight: 600,
                            color: '#374151'
                          }}
                        >
                          请求头 (Headers)
                        </label>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                          {Object.entries(headers).map(([key, value]) => (
                            <div key={key} style={{ display: 'flex', gap: 8 }}>
                              <Input
                                value={key}
                                disabled
                                style={{ width: 180 }}
                                placeholder="Header Key"
                              />
                              <Input
                                value={value}
                                onChange={(e) => updateHeader(key, e.target.value)}
                                placeholder="Header Value"
                                style={{ flex: 1 }}
                              />
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Body */}
                      {method !== 'GET' && (
                        <div>
                          <label
                            style={{
                              display: 'block',
                              marginBottom: 8,
                              fontWeight: 600,
                              color: '#374151'
                            }}
                          >
                            请求体 (Body)
                          </label>
                          <TextArea
                            value={requestBody}
                            onChange={(e) => setRequestBody(e.target.value)}
                            rows={12}
                            style={{
                              fontFamily: 'Monaco, Consolas, monospace',
                              fontSize: 13
                            }}
                          />
                        </div>
                      )}

                      {/* 发送按钮 */}
                      <Button
                        type="primary"
                        size="large"
                        onClick={handleSend}
                        loading={loading}
                        icon={<PlayCircleOutlined />}
                        block
                        style={{
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          border: 'none',
                          height: 48,
                          fontSize: 16,
                          fontWeight: 600
                        }}
                      >
                        {loading ? '请求中...' : '发送请求'}
                      </Button>
                    </div>
                  )
                },
                {
                  key: 'code',
                  label: '代码生成',
                  children: (
                    <div>
                      <div style={{ marginBottom: 16 }}>
                        <Select
                          value={selectedLanguage}
                          onChange={setSelectedLanguage}
                          style={{ width: '100%' }}
                          size="large"
                          options={[
                            { label: 'cURL', value: 'curl' },
                            { label: 'Python', value: 'python' },
                            { label: 'JavaScript', value: 'javascript' },
                            { label: 'Go', value: 'go' },
                            { label: 'Java', value: 'java' }
                          ]}
                        />
                      </div>
                      <div style={{ position: 'relative' }}>
                        <Button
                          icon={<CopyOutlined />}
                          onClick={() => copyCode(codeExample)}
                          style={{
                            position: 'absolute',
                            right: 8,
                            top: 8,
                            zIndex: 1
                          }}
                        >
                          复制
                        </Button>
                        <pre
                          style={{
                            background: '#1e1e1e',
                            color: '#d4d4d4',
                            padding: 16,
                            borderRadius: 8,
                            overflow: 'auto',
                            maxHeight: 500,
                            fontFamily: 'Monaco, Consolas, monospace',
                            fontSize: 13,
                            lineHeight: 1.6
                          }}
                        >
                          {codeExample}
                        </pre>
                      </div>
                    </div>
                  )
                }
              ]}
            />
          </div>

          {/* 右侧：响应结果 */}
          <div>
            <div
              style={{
                background: '#f9fafb',
                border: '1px solid #e5e7eb',
                borderRadius: 8,
                padding: 16
              }}
            >
              <h3
                style={{
                  margin: 0,
                  marginBottom: 16,
                  fontSize: 16,
                  fontWeight: 600,
                  color: '#374151'
                }}
              >
                响应结果
              </h3>

              {loading && (
                <div style={{ textAlign: 'center', padding: 60 }}>
                  <Spin size="large" />
                  <div style={{ marginTop: 16, color: '#6b7280' }}>
                    正在请求中...
                  </div>
                </div>
              )}

              {!loading && !response && (
                <div
                  style={{
                    textAlign: 'center',
                    padding: 60,
                    color: '#9ca3af'
                  }}
                >
                  <PlayCircleOutlined style={{ fontSize: 48, marginBottom: 16 }} />
                  <div>点击"发送请求"按钮查看响应结果</div>
                </div>
              )}

              {!loading && response && (
                <div>
                  {/* 状态码 */}
                  <div style={{ marginBottom: 16 }}>
                    <div
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 8,
                        padding: '8px 16px',
                        borderRadius: 6,
                        background:
                          response.status >= 200 && response.status < 300
                            ? '#d1fae5'
                            : '#fee2e2',
                        color:
                          response.status >= 200 && response.status < 300
                            ? '#065f46'
                            : '#991b1b',
                        fontWeight: 600,
                        fontSize: 14
                      }}
                    >
                      <span>状态码:</span>
                      <span style={{ fontSize: 16 }}>{response.status}</span>
                      <span>{response.statusText}</span>
                    </div>
                  </div>

                  {/* 响应数据 */}
                  <Tabs
                    defaultActiveKey="body"
                    items={[
                      {
                        key: 'body',
                        label: '响应体',
                        children: (
                          <div style={{ position: 'relative' }}>
                            <Button
                              icon={<CopyOutlined />}
                              onClick={() =>
                                copyCode(
                                  typeof response.data === 'string'
                                    ? response.data
                                    : JSON.stringify(response.data, null, 2)
                                )
                              }
                              size="small"
                              style={{
                                position: 'absolute',
                                right: 8,
                                top: 8,
                                zIndex: 1
                              }}
                            >
                              复制
                            </Button>
                            <pre
                              style={{
                                background: '#1e1e1e',
                                color: '#d4d4d4',
                                padding: 16,
                                borderRadius: 8,
                                overflow: 'auto',
                                maxHeight: 400,
                                fontFamily: 'Monaco, Consolas, monospace',
                                fontSize: 13,
                                lineHeight: 1.6,
                                margin: 0
                              }}
                            >
                              {typeof response.data === 'string'
                                ? response.data
                                : JSON.stringify(response.data, null, 2)}
                            </pre>
                          </div>
                        )
                      },
                      {
                        key: 'headers',
                        label: '响应头',
                        children: (
                          <div style={{ position: 'relative' }}>
                            <Button
                              icon={<CopyOutlined />}
                              onClick={() =>
                                copyCode(JSON.stringify(response.headers, null, 2))
                              }
                              size="small"
                              style={{
                                position: 'absolute',
                                right: 8,
                                top: 8,
                                zIndex: 1
                              }}
                            >
                              复制
                            </Button>
                            <pre
                              style={{
                                background: '#1e1e1e',
                                color: '#d4d4d4',
                                padding: 16,
                                borderRadius: 8,
                                overflow: 'auto',
                                maxHeight: 400,
                                fontFamily: 'Monaco, Consolas, monospace',
                                fontSize: 13,
                                lineHeight: 1.6,
                                margin: 0
                              }}
                            >
                              {JSON.stringify(response.headers, null, 2)}
                            </pre>
                          </div>
                        )
                      }
                    ]}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </Modal>
    </>
  )
}

export default ApiPlayground
