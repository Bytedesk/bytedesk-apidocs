# AI Chat Completions API 文档

本次更新为 Bytedesk API 文档添加了 OpenAI 兼容的 Chat Completions 接口文档。

## 新增文件

### 1. API 文档页面

- **`api-reference/ai/chat-completions.mdx`** - 主要的 Chat Completions API 文档
  - 完整的接口说明
  - 详细的请求参数和响应格式
  - 多语言代码示例（Python, JavaScript, cURL, Java, Go）
  - 流式和非流式响应说明
  - 错误处理指南

### 2. OpenAPI 规范更新

- **`api-reference/bytedesk.yaml`** - 更新了 OpenAPI 规范
  - 添加了 `ai` 标签和标签组
  - 添加了 `/chat/completions` 接口定义
  - 新增了完整的 Schema 定义：
    - `ChatCompletionRequest` - 请求体
    - `ChatCompletionResponse` - 非流式响应
    - `ChatCompletionChunk` - 流式响应块
    - `ChatCompletionError` - 错误响应
    - 以及相关的子模型

### 3. 导航配置

- **`docs.json`** - 更新了文档导航
  - 添加了新的 "AI API" 分组
  - 包含两个文档页面链接

## API 功能特性

### 完全兼容 OpenAI

此接口完全遵循 OpenAI Chat Completions API v1 规范，支持：

1. **消息格式** - system, user, assistant 角色
2. **参数兼容** - temperature, top_p, max_tokens, stream 等所有标准参数
3. **响应格式** - 与 OpenAI 完全一致的 JSON 结构
4. **流式响应** - 完整的 SSE（Server-Sent Events）支持
5. **错误处理** - 标准的错误响应格式

### 支持的功能

- ✅ 非流式聊天完成
- ✅ 流式聊天完成（SSE）
- ✅ 多轮对话
- ✅ 系统提示词
- ✅ 温度和采样控制
- ✅ Token 使用统计
- ✅ 停止序列
- ✅ 频率和存在惩罚

## 代码示例

文档包含了以下语言的完整代码示例：

1. **Python** - 使用 OpenAI SDK
2. **JavaScript/TypeScript** - 使用 OpenAI npm 包
3. **cURL** - 命令行示例（流式和非流式）
4. **Java** - 使用 OpenAI Java SDK
5. **Go** - 使用 go-openai 库

## 使用方法

### 对于用户

用户可以通过以下方式使用此 API：

1. **直接使用 OpenAI SDK**
   ```python
   import openai
   client = openai.OpenAI(
       api_key="YOUR_API_KEY",
       base_url="https://api.weiyuai.cn/api/v1"
   )
   ```

2. **使用任何 OpenAI 兼容工具**
   - ChatGPT 桌面应用
   - Continue.dev
   - Cursor IDE
   - 其他支持自定义 OpenAI 端点的工具

3. **迁移现有应用**
   - 只需修改 `base_url` 参数
   - 代码逻辑无需更改

### 对于开发者

如果需要本地预览文档：

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 或使用 pnpm
pnpm install
pnpm run dev
```

访问 `http://localhost:3000/api-reference/ai/chat-completions` 查看文档。

## 文档结构

```
api-reference/
├── ai/
│   ├── chat-completions.mdx        # 主要文档（英文为主）
├── bytedesk.yaml                   # OpenAPI 规范（已更新）
└── ...其他现有文档
```

## 技术实现参考

此文档基于以下 Java Controller 实现：

- **类**: `com.bytedesk.ai.robot.RobotController`
- **端点**: `POST /api/v1/chat/completions`
- **特性**:
  - 支持流式和非流式响应
  - 完整的 OpenAI 请求/响应模型映射
  - 错误处理和异常管理
  - SSE 流式传输
  - Token 使用统计

## 未来改进

可能的文档增强方向：

1. 添加更多语言的代码示例（Ruby, PHP, C# 等）
2. 添加交互式 API 测试器
3. 添加性能和限流说明
4. 添加最佳实践和优化建议
5. 添加更多错误场景和解决方案

## 注意事项

1. 确保后端服务已配置 `ChatModel` Bean
2. Bearer Token 认证是必需的
3. 流式响应需要客户端支持 SSE
4. 建议实现请求重试机制以处理网络波动

## 相关资源

- [OpenAI API 文档](https://platform.openai.com/docs/api-reference/chat)
- [Spring AI 文档](https://docs.spring.io/spring-ai/reference/)
- [Bytedesk 官网](https://www.weiyuai.cn)
