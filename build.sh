#!/bin/bash

# Mintlify 本地构建脚本
# 用于将 Mintlify 文档编译为静态 HTML

set -e  # 遇到错误时退出

echo "🚀 开始构建 Mintlify 文档..."

# 检查 Node.js 是否安装
if ! command -v node &> /dev/null; then
    echo "❌ 错误: 未找到 Node.js，请先安装 Node.js"
    exit 1
fi

# 检查 npm 是否安装
if ! command -v npm &> /dev/null; then
    echo "❌ 错误: 未找到 npm，请先安装 npm"
    exit 1
fi

# 安装依赖（保证一致性）
echo "📦 安装依赖..."
if [ -f "package-lock.json" ]; then
    npm ci || npm install
else
    npm install
fi

# 运行构建
echo "⚙️ 开始编译..."
npm run build

echo "✅ 构建完成！"
echo ""
echo "📁 生成的文件在 'build' 文件夹中"
echo "🌐 要预览文档，请运行: npm run serve"
echo "📖 然后访问: http://localhost:8000"