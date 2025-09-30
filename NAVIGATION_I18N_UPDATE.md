# 导航标题国际化更新

## 更新摘要

成功将导航左上角的标题 "Bytedesk API Docs" 进行了国际化处理，支持多语言显示。

## 具体变更

### 1. 翻译文件更新

在三个语言文件中添加了新的翻译键 `app.title`：

#### 简体中文 (zh-CN.json)

```json
"app.title": "微语 API 文档"
```

#### 英文 (en.json)

```json
"app.title": "Bytedesk API Docs"
```

#### 繁体中文 (zh-TW.json)

```json
"app.title": "微語 API 文檔"
```

### 2. 组件代码更新

**文件：** `src/pages/App.tsx`

#### 修改前

```tsx
<Link className="site" to="/index">{docs.name}</Link>
```

#### 修改后

```tsx
<Link className="site" to="/index">{intl.formatMessage({ id: 'app.title' })}</Link>
```

## 实现效果

- ✅ 中文环境下显示：**微语 API 文档**
- ✅ 英文环境下显示：**Bytedesk API Docs**  
- ✅ 繁体中文环境下显示：**微語 API 文檔**

## 技术实现

1. **国际化框架**：使用 react-intl 库的 `useIntl()` hook
2. **动态切换**：标题会根据用户选择的语言自动切换
3. **品牌一致性**：中文版本使用 "微语" 品牌名称，英文版本保持 "Bytedesk"

## 构建验证

项目构建成功，所有国际化功能正常工作：

```bash
✓ built in 3.52s
```

## 文件修改列表

- `src/locales/zh-CN.json` - 新增中文标题翻译
- `src/locales/en.json` - 新增英文标题翻译  
- `src/locales/zh-TW.json` - 新增繁体中文标题翻译
- `src/pages/App.tsx` - 更新组件使用国际化标题

所有更改已完成并通过构建验证。
