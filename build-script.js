const fs = require('fs-extra');
const path = require('path');
const { glob } = require('glob');
const matter = require('gray-matter');
const { marked } = require('marked');

// 辅助：中文/英文标题转 id
function slugify(text) {
  return String(text)
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fa5\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

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
  console.log('🌿 生成静态网站...');
    
    // 获取所有 MDX 文件
    const mdxFiles = await glob('**/*.mdx', { 
      ignore: ['node_modules/**', 'build/**'] 
    });
    
  // 创建导航工厂（根据当前页面标记激活项）
  const navigationFactory = (currentPage) => generateNavigationExpanded(docsConfig, currentPage);
    
    // 为每个 MDX 文件生成 HTML
    for (const mdxFile of mdxFiles) {
      await generateHtmlFromMdx(mdxFile, docsConfig, navigationFactory, buildDir);
    }
    
    // 3. 复制静态资源
    console.log('📋 复制静态资源...');
    await copyStaticAssets(srcDir, buildDir);
    
    // 4. 创建 CSS 文件
    await generateCSS(docsConfig, buildDir);
    
  // 5. 创建首页
  await generateIndexPage(docsConfig, buildDir, navigationFactory);
    
    console.log('✅ 构建完成！文件已生成到 build 文件夹');
    
  } catch (error) {
    console.error('❌ 构建失败:', error);
    process.exit(1);
  }
}

function generateNavigationExpanded(docsConfig, currentPage) {
  let navHtml = '<nav class="sidebar">';

  const logoLight = docsConfig.logo?.light ? `<img class="logo" src="${docsConfig.logo.light}" alt="logo" />` : '';
  navHtml += `<div class="brand">${logoLight}<span>${docsConfig.name}</span></div>`;

  if (docsConfig.navigation?.global?.anchors?.length) {
    navHtml += '<div class="global-anchors">';
    for (const a of docsConfig.navigation.global.anchors) {
      navHtml += `<a class="anchor" href="${a.href}" target="_blank" rel="noreferrer">${a.anchor}</a>`;
    }
    navHtml += '</div>';
  }

  if (docsConfig.navigation?.tabs) {
    for (const tab of docsConfig.navigation.tabs) {
      navHtml += `<div class="tab-section">`;
      navHtml += `<div class="tab-title">${tab.tab}</div>`;
      
      for (const group of tab.groups) {
        navHtml += `<div class="group">`;
        navHtml += `<div class="group-title">${group.group}</div>`;
        navHtml += `<ul class="links">`;
        
        for (const page of group.pages) {
          const pageName = page.split('/').pop();
          const isActive = currentPage === page;
          const badge = badgeForEndpoint(pageName);
          navHtml += `<li><a class="link ${isActive ? 'active' : ''}" href="${page}.html">${badge ? `<span class=\"badge ${badge.type}\">${badge.text}</span>` : ''}<span>${pageName}</span></a></li>`;
        }
        
        navHtml += `</ul></div>`;
      }
      navHtml += `</div>`;
    }
  }
  
  navHtml += '</nav>';
  return navHtml;
}

function badgeForEndpoint(pageName) {
  if (/^get$/i.test(pageName)) return { type: 'get', text: 'GET' };
  if (/^create$/i.test(pageName)) return { type: 'post', text: 'POST' };
  if (/^delete$/i.test(pageName)) return { type: 'del', text: 'DEL' };
  if (/^webhook$/i.test(pageName)) return { type: 'hook', text: 'HOOK' };
  return null;
}

async function generateHtmlFromMdx(mdxFile, docsConfig, navigationFactory, buildDir) {
  const content = await fs.readFile(mdxFile, 'utf8');
  const { data: frontmatter, content: mdxContent } = matter(content);
  
  // 计算相对路径深度
  const depth = mdxFile.split('/').length - 1;
  const relativePath = '../'.repeat(depth);
  
  // 使用 marked 渲染 Markdown（忽略简单的 MDX 扩展）
  const sanitizedMdx = mdxContent
    .replace(/^import .+$/gm, '')
    .replace(/^export .+$/gm, '')
    .replace(/<[^>]+\/>/g, '');

  let htmlContent = marked.parse(sanitizedMdx);

  // 为 h2/h3 添加 id，生成 TOC
  const headings = [];
  htmlContent = htmlContent.replace(/<h([23])>(.*?)<\/h\1>/g, (m, level, text) => {
    const id = slugify(text.replace(/<[^>]+>/g, ''));
    headings.push({ level: Number(level), text, id });
    return `<h${level} id="${id}">${text}</h${level}>`;
  });

  const tocHtml = generateTOC(headings);
  
  const navHtml = navigationFactory(mdxFile.replace(/\.mdx$/, ''));
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
    <header class="topbar">
      <div class="left">
        <a class="site" href="${relativePath}index.html">${docsConfig.name}</a>
      </div>
      <div class="center"><input class="search" placeholder="Search (stub)" /></div>
      <div class="right">
        <a class="support" href="${docsConfig.navbar?.links?.[0]?.href || '#'}">Support</a>
        <a class="primary" href="${docsConfig.navbar?.primary?.href || '#'}">${docsConfig.navbar?.primary?.label || 'Dashboard'}</a>
      </div>
    </header>
    <div class="container">
        ${navHtml.replace(/href=\"([^\"]+)\"/g, `href=\"${relativePath}$1\"`)}
        <main class="content">
            ${htmlContent}
        </main>
        <aside class="on-this-page">
          <div class="otp-title">On this page</div>
          ${tocHtml}
        </aside>
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
  background-color: #ffffff;
}

.topbar {
  position: sticky;
  top: 0;
  z-index: 50;
  height: 56px;
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  align-items: center;
  background: #fff;
  border-bottom: 1px solid #e2e8f0;
  padding: 0 16px;
}
.topbar .site { font-weight: 600; color: #111827; text-decoration: none; }
.topbar .center { display: flex; justify-content: center; }
.topbar .search {
  width: 60%;
  max-width: 520px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 8px 12px;
  background: #fafafa;
}
.topbar .right { display: flex; gap: 12px; justify-content: flex-end; }
.topbar .support { color: #4b5563; text-decoration: none; }
.topbar .primary {
  color: #fff; text-decoration: none; background: ${docsConfig.colors?.primary || '#16A34A'}; padding: 6px 12px; border-radius: 8px;
}

.container {
  display: flex;
  min-height: 100vh;
}

.sidebar {
  width: 280px;
  background-color: #f8fafc;
  padding: 1.5rem;
  border-right: 1px solid #e2e8f0;
  overflow-y: auto;
}

.sidebar .brand { display:flex; align-items:center; gap: 10px; margin-bottom: 16px; }
.sidebar .brand .logo { height: 24px; }
.sidebar .brand span { color: #111827; font-weight: 600; }
.sidebar .global-anchors { display:flex; flex-direction:column; gap:8px; margin-bottom: 20px; }
.sidebar .anchor { color:#4b5563; text-decoration:none; padding:6px 8px; border-radius:6px; }
.sidebar .anchor:hover { background:#eef2f7; }
.sidebar .tab-title { font-size: 12px; color:#6b7280; text-transform:uppercase; letter-spacing:.04em; margin: 16px 0 8px; }
.sidebar .group { margin-bottom: 10px; }
.sidebar .group-title { font-size: 13px; color:#374151; margin: 8px 0; font-weight: 600; }
.sidebar .links { list-style:none; margin-left: 0; }
.sidebar .link { display:flex; align-items:center; gap:8px; color:#4b5563; text-decoration:none; padding:6px 8px; border-radius:8px; }
.sidebar .link:hover { background:#eef2f7; color:#111827; }
.sidebar .link.active { background:${docsConfig.colors?.primary || '#16A34A'}15; color:${docsConfig.colors?.primary || '#16A34A'}; }
.badge { font-size: 10px; border-radius: 6px; padding: 2px 6px; font-weight: 700; }
.badge.get { background:#10b98120; color:#047857; }
.badge.post { background:#3b82f620; color:#1d4ed8; }
.badge.del { background:#f8717120; color:#b91c1c; }
.badge.hook { background:#f59e0b20; color:#b45309; }

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

.on-this-page {
  width: 240px;
  padding: 1rem 1rem 1rem 0.5rem;
  border-left: 1px solid #e2e8f0;
  color: #6b7280;
}
.on-this-page .otp-title { font-size: 12px; text-transform: uppercase; margin-bottom: 8px; }
.on-this-page ul { list-style: none; }
.on-this-page li { margin: 6px 0; }
.on-this-page a { color:#6b7280; text-decoration: none; }
.on-this-page a:hover { color:#111827; }

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

  .on-this-page { display: none; }
}
`;
  
  await fs.writeFile(path.join(buildDir, 'styles.css'), css);
}

function generateTOC(headings) {
  if (!headings.length) return '<div class="otp-empty">—</div>';
  let html = '<ul>';
  for (const h of headings) {
    html += `<li class="level-${h.level}"><a href="#${h.id}">${h.text}</a></li>`;
  }
  html += '</ul>';
  return html;
}

async function generateIndexPage(docsConfig, buildDir, navigationFactory) {
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
    <header class="topbar">
      <div class="left">
        <a class="site" href="index.html">${docsConfig.name}</a>
      </div>
      <div class="center"><input class="search" placeholder="Search (stub)" /></div>
      <div class="right">
        <a class="support" href="${docsConfig.navbar?.links?.[0]?.href || '#'}">Support</a>
        <a class="primary" href="${docsConfig.navbar?.primary?.href || '#'}">${docsConfig.navbar?.primary?.label || 'Dashboard'}</a>
      </div>
    </header>
    <div class="container">
        ${navigationFactory('index')}
        <main class="content">
            <h1>欢迎使用 ${docsConfig.name}</h1>
            <p>这是使用 Mintlify 配置的文档，已编译为静态网站以便离线预览。</p>
            <p>左侧为导航，右侧为当前页面目录，顶部提供 Support/Dashboard 入口（静态占位）。</p>
            
            <h2>功能特性</h2>
            <ul>
                <li>🧭 Mint 风格的三列布局（左侧导航 / 正文 / 右侧目录）</li>
                <li>🎨 接近 dev 的配色与导航样式</li>
                <li>🧩 Markdown 渲染与代码块样式</li>
                <li>🔗 自动为标题生成锚点，右侧 TOC 同步</li>
            </ul>
            
            <h2>开始使用</h2>
            <p>选择左侧导航菜单中的任意页面开始阅读文档。</p>
        </main>
        <aside class="on-this-page">
          <div class="otp-title">On this page</div>
          <div class="otp-empty">—</div>
        </aside>
    </div>
</body>
</html>
`;
  
  await fs.writeFile(path.join(buildDir, 'index.html'), indexHtml);
}

// 运行构建
buildDocs();