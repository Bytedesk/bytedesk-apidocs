// 简单的语法高亮工具
export function highlightCurl(text: string): string {
  if (!text) return text
  
  return text
    .replace(/(curl)/g, '<span class="token-curl">$1</span>')
    .replace(/(--request|--url|--header|-X|-H|-d|--data)/g, '<span class="token-flag">$1</span>')
    .replace(/(https?:\/\/[^\s]+)/g, '<span class="token-url">$1</span>')
    .replace(/('[^']*'|"[^"]*")/g, '<span class="token-string">$1</span>')
}

export function highlightJson(text: string): string {
  if (!text) return text
  
  return text
    .replace(/("[\w-]+")\s*:/g, '<span class="token-property">$1</span>:')
    .replace(/:\s*(".*?")/g, ': <span class="token-string">$1</span>')
    .replace(/:\s*(\d+)/g, ': <span class="token-number">$1</span>')
    .replace(/:\s*(true|false)/g, ': <span class="token-boolean">$1</span>')
    .replace(/:\s*(null)/g, ': <span class="token-null">$1</span>')
}