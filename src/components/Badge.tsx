import React from 'react'

interface BadgeProps {
  page: string
}

export function Badge({ page }: BadgeProps) {
  const base = page.split('/').pop()!.toLowerCase()
  // 更加详细的方法映射规则
  const map: Record<string, string> = { 
    get: 'get', 
    list: 'get',
    profile: 'get',
    'query-org': 'get',
    'list-calls': 'get',           // 呼叫中心 - 呼叫列表
    'list-recordings': 'get',      // 呼叫中心 - 录音列表
    'download-recording': 'get',   // 呼叫中心 - 下载录音
    create: 'post', 
    send: 'post',
    login: 'post',
    register: 'post',
    'chat-completions': 'post',    // AI Chat Completions 接口
    'make-call': 'post',           // 呼叫中心 - 发起呼叫
    delete: 'del', 
    webhook: 'hook' 
  }
  const type = map[base]
  if (!type) {
    // 如果没有映射，尝试从路径推断
    if (base.includes('get') || base.includes('list') || base.includes('query')) return <span className="badge get">GET</span>
    if (base.includes('create') || base.includes('send') || base.includes('login') || base.includes('register')) return <span className="badge post">POST</span>
    if (base.includes('update') || base.includes('edit')) return <span className="badge put">PUT</span>
    if (base.includes('delete') || base.includes('remove')) return <span className="badge del">DEL</span>
    return null
  }
  const text: Record<string, string> = { get: 'GET', post: 'POST', put: 'PUT', del: 'DEL', hook: 'HOOK' }
  return <span className={`badge ${type}`}>{text[type]}</span>
}