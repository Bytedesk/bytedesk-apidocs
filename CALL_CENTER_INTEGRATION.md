# 呼叫中心 API 文档集成指南

## 📋 功能概述

成功为 Bytedesk API 文档系统添加了**呼叫中心**接口文档，并实现了通过顶部 Tab 在**在线客服**和**呼叫中心**两个分类之间切换的功能。

## 🎯 实现的功能

### 1. **Tab 切换功能**
- ✅ 在侧边栏顶部添加了美观的 Tab 切换按钮
- ✅ 使用渐变紫色高亮显示当前选中的 Tab
- ✅ 支持点击切换不同的 API 分类
- ✅ 根据当前路径自动激活对应的 Tab
- ✅ 流畅的动画过渡效果

### 2. **呼叫中心文件夹结构**
```
call-center/
├── calls/
│   ├── make-call.mdx        # 发起呼叫接口
│   └── list-calls.mdx        # 呼叫列表接口
└── recordings/
    ├── list-recordings.mdx   # 录音列表接口
    └── download-recording.mdx # 下载录音接口
```

### 3. **4个完整的呼叫中心 API 文档**

#### 📞 Calls（通话管理）
1. **发起呼叫** (`POST /api/v1/call/make`)
   - 支持呼入/呼出类型
   - 实时状态追踪
   - 元数据支持

2. **呼叫列表** (`GET /api/v1/call/list`)
   - 分页查询
   - 状态筛选（ringing/connected/completed/failed）
   - 时间范围筛选
   - 完整的通话记录信息

#### 🎙️ Recordings（录音管理）
3. **录音列表** (`GET /api/v1/recording/list`)
   - 分页查询
   - 按呼叫ID筛选
   - 时间范围筛选
   - 录音文件元信息（大小、格式、时长）

4. **下载录音** (`GET /api/v1/recording/download/{recordingId}`)
   - 支持 MP3/WAV 格式
   - 流式下载
   - 二进制文件传输

## 🔧 修改的文件

### 核心组件
1. **`src/components/Sidebar.tsx`**
   - 添加 Tab 切换 UI
   - 实现 Tab 状态管理
   - 渐变紫色主题按钮
   - 自动根据路径切换 Tab

2. **`src/components/Page.tsx`**
   - 添加 `call-center/**/*.mdx` 路径到动态导入
   - 将 `call-center/` 识别为 API 端点页面

3. **`src/components/Badge.tsx`**
   - 添加呼叫中心接口的 HTTP 方法映射
   - `make-call`: POST
   - `list-calls`: GET
   - `list-recordings`: GET
   - `download-recording`: GET

### 配置文件
4. **`docs.json`**
   - 将原 "API Documentation" 改名为 "在线客服"
   - 添加新的 "呼叫中心" Tab
   - 配置 Calls 和 Recordings 两个分组

5. **`api-reference/openapi.json`**
   - 添加 `calls` 和 `recordings` 两个 tag
   - 添加 4 个新的 API 路径定义
   - 添加完整的 Schema 定义：
     - `CallRequest`/`CallResponse`/`Call`
     - `Recording`/`RecordingListResponse`
     - `Pagination`

### 样式文件
6. **`src/styles.css`**
   - 添加 `--hover-bg` CSS 变量（浅色和暗色主题）
   - 确保 Tab 悬停效果正常工作

## 🎨 设计亮点

### Tab 切换按钮样式
- **激活状态**：
  - 渐变紫色背景 (`linear-gradient(135deg, #667eea 0%, #764ba2 100%)`)
  - 白色文字
  - 发光阴影效果
  - 字体加粗（600）

- **未激活状态**：
  - 透明背景
  - 边框显示
  - 灰色文字
  - 悬停时淡灰色背景

### 代码示例
每个 API 文档都包含：
- ✅ cURL 示例
- ✅ Python 示例
- ✅ JavaScript 示例
- ✅ ApiPlayground 交互式测试组件
- ✅ 请求参数详细说明
- ✅ 响应字段详细说明
- ✅ 多种响应示例（成功/失败）

## 📦 文档特性

### RequestExample / ResponseExample
- 自动渲染到右侧栏
- Mintlify 风格的浅色主题
- 语法高亮
- 一键复制功能

### ApiPlayground
- 交互式 API 测试
- 支持自定义请求参数
- 生成 5 种语言代码示例
- 实时响应预览

## 🚀 使用方法

### 启动开发服务器
```bash
pnpm run dev
```

### 访问文档
- **本地开发**: http://localhost:9019/apidocs/
- **在线客服 Tab**: 包含原有的所有接口（AI、认证、用户、会话、消息、工单）
- **呼叫中心 Tab**: 包含呼叫和录音管理接口

### 切换 Tab
1. 打开文档首页
2. 在左侧边栏顶部看到两个 Tab 按钮
3. 点击 "呼叫中心" 切换到呼叫中心接口
4. 点击 "在线客服" 切换回在线客服接口

## 🔄 自动特性

### 路径自动识别
- 访问 `call-center/` 开头的路径时，自动激活 "呼叫中心" Tab
- 访问 `api-reference/` 开头的路径时，自动激活 "在线客服" Tab

### 右侧代码示例
- 所有 `call-center/` 路径自动启用右侧代码示例栏
- 与 `api-reference/` 路径保持一致的体验

## 📝 扩展指南

### 添加新的呼叫中心接口

1. **创建 MDX 文件**
   ```bash
   # 在 call-center 下创建新文件
   call-center/
   └── new-group/
       └── new-api.mdx
   ```

2. **更新 docs.json**
   ```json
   {
     "tab": "呼叫中心",
     "groups": [
       {
         "group": "New Group",
         "pages": [
           "call-center/new-group/new-api"
         ]
       }
     ]
   }
   ```

3. **更新 Badge.tsx**（如果是新的文件名模式）
   ```typescript
   const map: Record<string, string> = { 
     'new-api': 'post',  // 或 'get', 'put', 'del'
     // ...
   }
   ```

4. **更新 openapi.json**（可选，用于 OpenAPI 规范）
   ```json
   {
     "paths": {
       "/api/v1/new/endpoint": {
         "post": {
           "tags": ["calls"],
           "summary": "新接口",
           // ...
         }
       }
     }
   }
   ```

### 添加新的 Tab

1. 在 `docs.json` 的 `navigation.tabs` 数组中添加新对象
2. Sidebar 组件会自动渲染新的 Tab 按钮
3. 更新 `Page.tsx` 中的 `isApiEndpoint` 逻辑（如果需要右侧代码示例）

## 🎯 技术栈

- **框架**: Vite + React 18.3.1 + TypeScript
- **文档**: MDX 3.0.1
- **UI 组件**: Ant Design 5.21.2
- **路由**: React Router
- **代码高亮**: react-syntax-highlighter
- **国际化**: react-intl

## ✅ 质量保证

- ✅ 所有组件类型安全（TypeScript）
- ✅ 响应式设计（支持移动端）
- ✅ 暗色主题支持
- ✅ 平滑过渡动画
- ✅ 无控制台错误或警告
- ✅ OpenAPI 3.0.3 规范兼容

## 🌟 视觉效果

### Tab 切换按钮
- 现代化渐变设计
- 玻璃态材质效果
- 流畅的悬停动画
- 清晰的激活状态指示

### 整体风格
- 与 Mintlify 文档风格保持一致
- 专业的 API 文档布局
- 清晰的信息层次
- 优秀的可读性

---

## 📌 注意事项

1. **端口占用**: 如果 9018 端口被占用，Vite 会自动尝试其他端口（如 9019）
2. **MDX 组件**: 所有 MDX 组件（ParamField、ResponseField、Expandable 等）已正确配置
3. **路径一致性**: 确保 docs.json 中的路径与实际文件路径一致
4. **OpenAPI 同步**: 建议保持 MDX 文档与 openapi.json 同步

---

**开发时间**: 2025-10-06  
**开发者**: GitHub Copilot  
**项目**: Bytedesk API Docs
