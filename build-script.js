const fs = require('fs-extra');
const path = require('path');
const { glob } = require('glob');
const matter = require('gray-matter');
const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);

async function buildDocs() {
  console.log('🚀 开始构建 Mintlify 文档...');
  
  try {
    // 读取配置
    const docsConfig = JSON.parse(fs.readFileSync('./docs.json', 'utf8'));
    const srcDir = process.cwd();
    const buildDir = path.join(srcDir, 'build');
    
    // 1. 清理旧文件
    console.log('🧹 清理旧文件...');
    await fs.remove(buildDir);
    await fs.ensureDir(buildDir);
    
    // 2. 创建简单的 HTML 结构
    console.log('� 生成静态网站...');
    
    // 获取所有 MDX 文件
    const mdxFiles = await glob('**/*.mdx', { 
      ignore: ['node_modules/**', 'build/**'] 
    });
    
    // 创建导航
    const navigation = generateNavigation(docsConfig);
    
    // 为每个 MDX 文件生成 HTML
    for (const mdxFile of mdxFiles) {
      await generateHtmlFromMdx(mdxFile, docsConfig, navigation, buildDir);
    }
    
    // 3. 复制静态资源
    console.log('📋 复制静态资源...');
    await copyStaticAssets(srcDir, buildDir);
    
    // 4. 创建 CSS 文件
    await generateCSS(docsConfig, buildDir);
    
    // 5. 创建首页
    await generateIndexPage(docsConfig, buildDir, navigation);
    
    console.log('✅ 构建完成！文件已生成到 build 文件夹');
    
  } catch (error) {
    console.error('❌ 构建失败:', error);
    process.exit(1);
  }
}

function generateNavigation(docsConfig) {
  let navHtml = '<nav class="sidebar">';
  navHtml += `<h1>${docsConfig.name}</h1>`;
  
  if (docsConfig.navigation?.tabs) {
    for (const tab of docsConfig.navigation.tabs) {
      navHtml += `<div class="tab-section">`;
      navHtml += `<h2>${tab.tab}</h2>`;
      
      for (const group of tab.groups) {
        navHtml += `<div class="group">`;
        navHtml += `<h3>${group.group}</h3>`;
        navHtml += `<ul>`;
        
        for (const page of group.pages) {
          const pageName = page.split('/').pop();
          navHtml += `<li><a href="${page}.html">${pageName}</a></li>`;
        }
        
        navHtml += `</ul></div>`;
      }
      navHtml += `</div>`;
    }
  }
  
  navHtml += '</nav>';
  return navHtml;
}

async function generateHtmlFromMdx(mdxFile, docsConfig, navigation, buildDir) {
  const content = await fs.readFile(mdxFile, 'utf8');
  const { data: frontmatter, content: mdxContent } = matter(content);
  
  // 计算相对路径深度
  const depth = mdxFile.split('/').length - 1;
  const relativePath = '../'.repeat(depth);
  
  // 简单的 MDX 到 HTML 转换（基础版本）
  let htmlContent = mdxContent
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`(.+?)`/g, '<code>$1</code>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/^(.+)$/gm, (match) => {
      if (!match.startsWith('<h') && !match.includes('<p>')) {
        return `<p>${match}</p>`;
      }
      return match;
    });
  
  const html = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${frontmatter.title || 'Bytedesk API 文档'}</title>
    <link rel="stylesheet" href="${relativePath}styles.css">
    <link rel="icon" href="${relativePath}favicon.svg">
</head>
<body>
    <div class="container">
        ${navigation.replace(/href="([^"]+)"/g, `href="${relativePath}$1"`)}
        <main class="content">
            ${htmlContent}
        </main>
    </div>
</body>
</html>
`;
  
  // 创建目标目录
  const outputPath = path.join(buildDir, mdxFile.replace('.mdx', '.html'));
  const outputDir = path.dirname(outputPath);
  await fs.ensureDir(outputDir);
  
  await fs.writeFile(outputPath, html);
  console.log(`  ✓ 生成页面: ${mdxFile} -> ${outputPath}`);
}

async function copyStaticAssets(srcDir, buildDir) {
  // 复制图片
  const imagesDir = path.join(srcDir, 'images');
  if (await fs.pathExists(imagesDir)) {
    await fs.copy(imagesDir, path.join(buildDir, 'images'));
  }
  
  // 复制 logo
  const logoDir = path.join(srcDir, 'logo');
  if (await fs.pathExists(logoDir)) {
    await fs.copy(logoDir, path.join(buildDir, 'logo'));
  }
  
  // 复制 favicon
  const faviconPath = path.join(srcDir, 'favicon.svg');
  if (await fs.pathExists(faviconPath)) {
    await fs.copy(faviconPath, path.join(buildDir, 'favicon.svg'));
  }
}

async function generateCSS(docsConfig, buildDir) {
  const css = `
/* 基础样式 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  line-height: 1.6;
  color: #333;
}

.container {
  display: flex;
  min-height: 100vh;
}

.sidebar {
  width: 300px;
  background-color: #f8fafc;
  padding: 2rem;
  border-right: 1px solid #e2e8f0;
  overflow-y: auto;
}

.sidebar h1 {
  color: ${docsConfig.colors?.primary || '#16A34A'};
  font-size: 1.5rem;
  margin-bottom: 2rem;
}

.sidebar h2 {
  font-size: 1.2rem;
  margin: 1.5rem 0 0.5rem 0;
  color: #64748b;
}

.sidebar h3 {
  font-size: 1rem;
  margin: 1rem 0 0.5rem 0;
  color: #475569;
}

.sidebar ul {
  list-style: none;
  margin-bottom: 1rem;
}

.sidebar li {
  margin-bottom: 0.5rem;
}

.sidebar a {
  text-decoration: none;
  color: #64748b;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  display: block;
  transition: background-color 0.2s;
}

.sidebar a:hover {
  background-color: ${docsConfig.colors?.primary || '#16A34A'}20;
  color: ${docsConfig.colors?.primary || '#16A34A'};
}

.content {
  flex: 1;
  padding: 2rem 3rem;
  overflow-y: auto;
}

.content h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: #1e293b;
}

.content h2 {
  font-size: 2rem;
  margin: 2rem 0 1rem 0;
  color: #334155;
}

.content h3 {
  font-size: 1.5rem;
  margin: 1.5rem 0 0.75rem 0;
  color: #475569;
}

.content p {
  margin-bottom: 1rem;
  color: #64748b;
}

.content code {
  background-color: #f1f5f9;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-family: 'Monaco', 'Menlo', monospace;
  font-size: 0.875rem;
}

.content pre {
  background-color: #1e293b;
  color: #f1f5f9;
  padding: 1rem;
  border-radius: 0.5rem;
  overflow-x: auto;
  margin: 1rem 0;
}

.content ul, .content ol {
  margin: 1rem 0 1rem 2rem;
}

.content li {
  margin-bottom: 0.5rem;
}

.content a {
  color: ${docsConfig.colors?.primary || '#16A34A'};
  text-decoration: none;
}

.content a:hover {
  text-decoration: underline;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .container {
    flex-direction: column;
  }
  
  .sidebar {
    width: 100%;
    border-right: none;
    border-bottom: 1px solid #e2e8f0;
  }
  
  .content {
    padding: 1rem;
  }
}
`;
  
  await fs.writeFile(path.join(buildDir, 'styles.css'), css);
}

async function generateIndexPage(docsConfig, buildDir, navigation) {
  const indexHtml = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${docsConfig.name}</title>
    <link rel="stylesheet" href="styles.css">
    <link rel="icon" href="favicon.svg">
</head>
<body>
    <div class="container">
        ${navigation}
        <main class="content">
            <h1>欢迎使用 ${docsConfig.name}</h1>
            <p>这是使用 Mintlify 构建的 API 文档，已成功编译为静态网站。</p>
            <p>请使用左侧导航菜单浏览文档内容。</p>
            
            <h2>功能特性</h2>
            <ul>
                <li>📝 基于 Mintlify 配置的文档结构</li>
                <li>🎨 响应式设计，支持移动设备</li>
                <li>🔍 清晰的导航和页面结构</li>
                <li>⚡ 静态 HTML，加载速度快</li>
            </ul>
            
            <h2>开始使用</h2>
            <p>选择左侧导航菜单中的任意页面开始阅读文档。</p>
        </main>
    </div>
</body>
</html>
`;
  
  await fs.writeFile(path.join(buildDir, 'index.html'), indexHtml);
}

// 运行构建
buildDocs();