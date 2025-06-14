#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 颜色输出
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m'
};

function log(color, emoji, message) {
  console.log(`${colors[color]}${emoji} ${message}${colors.reset}`);
}

function exec(command, options = {}) {
  try {
    execSync(command, { stdio: 'inherit', ...options });
  } catch (error) {
    log('red', '❌', `Command failed: ${command}`);
    process.exit(1);
  }
}

async function main() {
  log('cyan', '🚀', 'Starting npm publish process...');

  // 检查 .env 文件并加载环境变量
  const envFile = path.join(process.cwd(), '.env');
  if (fs.existsSync(envFile)) {
    log('blue', '📄', 'Loading environment variables from .env file...');
    const envContent = fs.readFileSync(envFile, 'utf8');
    envContent.split('\n').forEach(line => {
      const [key, value] = line.split('=');
      if (key && value && !key.startsWith('#')) {
        process.env[key.trim()] = value.trim();
      }
    });
  }

  // 检查 NPM_TOKEN
  if (!process.env.NPM_TOKEN) {
    log('red', '❌', 'Error: NPM_TOKEN environment variable is not set');
    log('yellow', '💡', 'Please set NPM_TOKEN in .env file or export it manually:');
    log('yellow', '💡', 'export NPM_TOKEN=your_npm_token_here');
    process.exit(1);
  }

  // 验证 NPM_TOKEN 格式
  if (!process.env.NPM_TOKEN.startsWith('npm_')) {
    log('red', '❌', 'Error: NPM_TOKEN should start with \'npm_\'');
    log('yellow', '💡', 'Please check your token format');
    process.exit(1);
  }

  // 清理和构建
  log('yellow', '🧹', 'Cleaning and building project...');
  exec('npm run clean');
  exec('npm run build');

  // 创建临时的 .npmrc 文件
  log('blue', '🔑', 'Setting up npm authentication...');
  const npmrcContent = `//registry.npmjs.org/:_authToken=${process.env.NPM_TOKEN}`;
  fs.writeFileSync('.npmrc', npmrcContent);

  try {
    // 运行测试
    log('yellow', '🧪', 'Running tests...');
    exec('npm run test:run');

    // 发布到 npm
    log('blue', '📦', 'Publishing to npm...');
    exec('npm publish');

    // 获取包名
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    
    log('green', '✅', 'Successfully published to npm!');
    log('cyan', '🔗', `Check your package at: https://www.npmjs.com/package/${packageJson.name}`);
  } finally {
    // 清理临时文件
    log('yellow', '🧹', 'Cleaning up...');
    if (fs.existsSync('.npmrc')) {
      fs.unlinkSync('.npmrc');
    }
  }
}

main().catch(error => {
  log('red', '❌', `Error: ${error.message}`);
  process.exit(1);
});
