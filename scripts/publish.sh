#!/bin/bash

# 发布脚本 - 使用 NPM_TOKEN 环境变量
set -e

echo "🚀 Starting npm publish process..."

# 检查是否设置了 NPM_TOKEN
if [ -z "$NPM_TOKEN" ]; then
    echo "❌ Error: NPM_TOKEN environment variable is not set"
    echo "Please set NPM_TOKEN in .env file or export it manually:"
    echo "export NPM_TOKEN=your_npm_token_here"
    exit 1
fi

# 加载 .env 文件中的环境变量
if [ -f .env ]; then
    echo "📄 Loading environment variables from .env file..."
    export $(cat .env | grep -v '#' | awk '/=/ {print $1}')
fi

# 验证 NPM_TOKEN 格式
if [[ ! $NPM_TOKEN =~ ^npm_ ]]; then
    echo "❌ Error: NPM_TOKEN should start with 'npm_'"
    echo "Please check your token format"
    exit 1
fi

# 清理和构建
echo "🧹 Cleaning and building project..."
npm run clean
npm run build

# 创建临时的 .npmrc 文件
echo "🔑 Setting up npm authentication..."
echo "//registry.npmjs.org/:_authToken=${NPM_TOKEN}" > .npmrc

# 运行测试
echo "🧪 Running tests..."
npm run test:run

# 发布到 npm
echo "📦 Publishing to npm..."
npm publish

# 清理临时文件
echo "🧹 Cleaning up..."
rm -f .npmrc

echo "✅ Successfully published to npm!"
echo "🔗 Check your package at: https://www.npmjs.com/package/$(node -p "require('./package.json').name")"
