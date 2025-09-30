import React from 'react'
import { Button } from 'antd'

export function TryButton({ 
  title = "Try it", 
  endpoint, 
  method = "POST",
  apiTitle
}: { 
  title?: string; 
  endpoint?: string; 
  method?: string;
  apiTitle?: string;
}) {
  const handleTryIt = () => {
    const modal = document.createElement('div');
    modal.innerHTML = `
      <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 9999; display: flex; justify-content: center; align-items: center;">
        <div style="background: white; padding: 20px; border-radius: 8px; width: 80%; max-width: 1000px; height: 80%; overflow-y: auto;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
            <h2>Try API - ${apiTitle || title}</h2>
            <button onclick="this.closest('.modal-overlay').remove()" style="background: none; border: none; font-size: 24px; cursor: pointer;">&times;</button>
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; height: calc(100% - 60px);">
            <div>
              <h3>Request</h3>
              <div style="margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 5px; font-weight: bold;">参数</label>
                <textarea placeholder="请输入JSON格式的请求参数" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; height: 120px;" id="requestParams">{}</textarea>
              </div>
              <button onclick="sendRequest()" style="background: #16A34A; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer;">Send Request</button>
            </div>
            <div>
              <h3>Response</h3>
              <div style="background: #f8f9fa; border: 1px solid #ddd; border-radius: 4px; padding: 15px; height: 400px; overflow-y: auto;" id="response-area">
                点击 "Send Request" 查看响应结果
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
    modal.className = 'modal-overlay';
    document.body.appendChild(modal);
    
    // 创建发送请求的函数，传递当前的 endpoint 和 method
    (window as any).sendRequest = async function() {
      const responseArea = document.getElementById('response-area');
      const paramsTextarea = document.getElementById('requestParams') as HTMLTextAreaElement;
      
      if (!responseArea || !paramsTextarea) return;
      
      let params = paramsTextarea.value.trim();
      
      // 验证JSON格式
      if (params && params !== '{}') {
        try {
          JSON.parse(params);
        } catch (e) {
          responseArea.innerHTML = '<div style="color: red;">JSON格式错误</div>';
          return;
        }
      }
      
      responseArea.innerHTML = '<div>发送请求中...</div>';
      
      try {
        const fetchOptions: RequestInit = {
          method: method,
          headers: {
            'Content-Type': 'application/json'
          }
        };
        
        if (method === 'GET') {
          // GET请求将参数作为查询参数
          const url = new URL(endpoint!);
          if (params && params !== '{}') {
            const paramObj = JSON.parse(params);
            Object.keys(paramObj).forEach(key => url.searchParams.append(key, paramObj[key]));
          }
          const response = await fetch(url.toString(), fetchOptions);
          const data = await response.json();
          responseArea.innerHTML = '<pre style="margin: 0; white-space: pre-wrap;">' + JSON.stringify(data, null, 2) + '</pre>';
        } else {
          // POST等请求将参数作为请求体
          if (params && params !== '{}') {
            fetchOptions.body = params;
          }
          const response = await fetch(endpoint!, fetchOptions);
          const data = await response.json();
          responseArea.innerHTML = '<pre style="margin: 0; white-space: pre-wrap;">' + JSON.stringify(data, null, 2) + '</pre>';
        }
      } catch (error: any) {
        responseArea.innerHTML = '<div style="color: red;">请求失败: ' + error.message + '</div>';
      }
    };
  };

  return (
    <Button
      type="primary"
      size="middle"
      onClick={handleTryIt}
      style={{
        background: 'var(--primary)',
        borderColor: 'var(--primary)',
        borderRadius: '6px',
        fontWeight: 500,
        display: 'flex',
        alignItems: 'center',
        gap: '6px'
      }}
    >
      {title} →
    </Button>
  );
}