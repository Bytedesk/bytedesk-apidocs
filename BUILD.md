# Bytedesk API 文档本地构建指南

本项目使用 Mintlify 构建 API 文档，并提供了本地编译功能，可以将文档编译为静态 HTML 文件。

## 🚀 快速开始

### 方法一：一键构建和预览

```bash
npm install && npm run preview
```

### 方法二：分步操作

```bash
# 1. 安装依赖
npm install

# 2. 构建文档
npm run build

# 3. 本地预览
npm run serve
```

然后在浏览器中访问 `http://localhost:8000` 来预览生成的文档。

## 📜 可用命令

| 命令 | 说明 |
|------|------|
| `npm run build` | 构建静态文档 |
| `npm run serve` | 启动本地服务器 |
| `npm run preview` | 构建并启动预览 |
| `npm run clean` | 清理构建文件 |
| `./build.sh` | 使用 shell 脚本构建 |

## 🔧 构建说明

构建脚本会执行以下操作：

1. 📖 读取 `docs.json` 配置文件
2. 🔄 将所有 `.mdx` 文件转换为 HTML 页面
3. 📁 复制静态资源（图片、logo、favicon 等）
4. 🎨 生成统一的 CSS 样式
5. 🧭 创建导航菜单
6. 🔗 处理相对路径引用

## 📂 生成的文件结构

```text
build/
├── index.html                    # 网站首页
├── styles.css                    # 全局样式文件
├── favicon.svg                   # 网站图标
├── images/                       # 图片资源目录
├── logo/                         # Logo 文件目录
├── quickstart.html              # 快速开始页面
├── development.html             # 开发指南页面
├── essentials/                   # 基础功能页面
│   ├── settings.html
│   ├── navigation.html
│   ├── markdown.html
│   ├── code.html
│   └── images.html
├── ai-tools/                     # AI 工具页面
│   ├── cursor.html
│   ├── claude-code.html
│   └── windsurf.html
└── api-reference/                # API 参考文档
    ├── introduction.html
    └── endpoint/
        ├── get.html
        ├── create.html
        ├── delete.html
        └── webhook.html
```

## 🎨 自定义样式

### 修改主题颜色

在 `docs.json` 中修改 `colors` 配置：

```json
{
  "colors": {
    "primary": "#16A34A",
    "light": "#07C983", 
    "dark": "#15803D"
  }
}
```

### 自定义 CSS

修改 `build-script.js` 中的 `generateCSS` 函数，或者构建完成后直接编辑 `build/styles.css`。

## 🌐 部署方式

构建完成后，将 `build` 文件夹部署到以下任意平台：

### 静态托管服务
- **GitHub Pages**: 将 `build` 内容推送到 `gh-pages` 分支
- **Vercel**: 连接仓库并设置构建命令为 `npm run build`，输出目录为 `build`
- **Netlify**: 拖拽 `build` 文件夹到 Netlify 或连接 Git 仓库

### 云存储服务
- **阿里云 OSS**: 上传 `build` 文件夹内容并开启静态网站功能
- **腾讯云 COS**: 配置静态网站托管
- **AWS S3**: 启用静态网站托管功能

### 传统服务器
直接将 `build` 文件夹内容复制到 Web 服务器目录。

## 🔍 故障排除

### 常见问题

**构建失败**
```bash
# 检查 Node.js 版本
node --version  # 需要 >= 14

# 重新安装依赖
rm -rf node_modules package-lock.json
npm install
```

**页面样式丢失**
- 检查 `build/styles.css` 是否存在
- 确认相对路径配置正确

**图片无法显示**
- 确认图片文件在 `images/` 或 `logo/` 目录中
- 检查 MDX 文件中的图片路径

**导航链接无效**
- 检查 `docs.json` 中的页面路径配置
- 确认对应的 `.mdx` 文件存在

### 调试技巧

```bash
# 清理并重新构建
npm run clean && npm run build

# 检查生成的文件
ls -la build/

# 验证 HTML 文件
head -20 build/index.html
```

## 📝 开发建议

1. **修改内容后**: 重新运行 `npm run build`
2. **添加新页面**: 更新 `docs.json` 并创建对应 `.mdx` 文件  
3. **更改配置**: 修改后需要重新构建
4. **测试部署**: 使用 `npm run serve` 本地验证

## 🆘 获取帮助

如果遇到问题，请检查：

1. ✅ Node.js 版本 >= 14
2. ✅ 所有 `.mdx` 文件格式正确
3. ✅ `docs.json` 配置文件有效
4. ✅ 网络连接正常（如果需要下载依赖）

更多信息请参考项目的主 README 文件。