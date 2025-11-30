# 🚀 Turnstile Worker 部署和测试指南

## 📋 当前状态

你已经：
- ✅ 创建了 Worker 项目
- ✅ 配置了自定义域名：`turnstile.superjiasu.top`
- ✅ Workers.dev 默认域名：`turnstile-proxy.tesssuunmao.workers.dev`

---

## 🔧 问题修复说明

### 问题现象

```bash
# HEAD 请求返回 403
curl -I https://turnstile-proxy.tesssuunmao.workers.dev/turnstile/v0/api.js
HTTP/2 403

# 浏览器也返回 403
"messageTemplate": "403 Error from upstream"
```

### 根本原因

1. **HEAD 请求处理不当** - Worker 在转发 HEAD 请求时，body 处理有问题
2. **缺少浏览器头** - 缺少 `User-Agent`、`Referer` 等关键头

### 已修复的内容

✅ **正确处理 HEAD 请求**
```javascript
if (request.method === 'HEAD') {
  return new Response(null, {  // HEAD 返回空 body
    status: response.status,
    headers: responseHeaders
  });
}
```

✅ **添加必需的请求头**
```javascript
modifiedHeaders.set('User-Agent', 'Mozilla/5.0 ...');
modifiedHeaders.set('Referer', 'https://challenges.cloudflare.com/');
modifiedHeaders.set('Accept', 'application/javascript, */*');
```

✅ **移除冲突的内部头**
```javascript
modifiedHeaders.delete('cf-connecting-ip');
modifiedHeaders.delete('cf-ray');
modifiedHeaders.delete('cf-visitor');
```

---

## 🚀 部署步骤

### 步骤 1: 进入项目目录

```bash
cd /root/self_code/web_vpn_v0_test/turnstile-proxy-worker
```

### 步骤 2: 检查代码（可选）

```bash
# 查看修复后的代码
cat src/index.js

# 关键检查点：
# - 第 131 行：HEAD 请求单独处理
# - 第 52-69 行：添加必需的请求头
# - 第 186 行：CORS 允许 HEAD 方法
```

### 步骤 3: 部署到 Cloudflare

```bash
# 部署
wrangler deploy

# 预期输出：
# ✨ Success! Uploaded turnstile-proxy
# 🌎 Published turnstile-proxy
#    https://turnstile-proxy.tesssuunmao.workers.dev
#    turnstile.superjiasu.top/*
```

### 步骤 4: 等待 CDN 缓存刷新

```bash
# 等待 30 秒让全球 CDN 更新
echo "⏳ 等待 CDN 缓存刷新..."
sleep 30
echo "✅ 完成"
```

---

## 🧪 测试验证

### 方法 1: 自动化测试脚本（推荐）

```bash
# 运行测试脚本
/root/self_code/web_vpn_v0_test/scripts/test-worker.sh

# 预期输出：
# ✅ 健康检查通过
# ✅ HEAD 请求 200 OK
# ✅ GET 请求成功获取内容
# ✅ CORS 头正确
```

### 方法 2: 手动测试

#### 测试 1: 健康检查

```bash
curl https://turnstile-proxy.tesssuunmao.workers.dev/health

# ✅ 预期输出：
# {"status":"ok","service":"turnstile-proxy","timestamp":...}
```

#### 测试 2: HEAD 请求（重点）

```bash
curl -I https://turnstile-proxy.tesssuunmao.workers.dev/turnstile/v0/api.js \
  -H "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"

# ✅ 预期输出：
# HTTP/2 200
# content-type: text/javascript
# access-control-allow-origin: *
# x-proxy-status: success
# x-proxy-method: HEAD
```

#### 测试 3: GET 请求

```bash
curl -s https://turnstile-proxy.tesssuunmao.workers.dev/turnstile/v0/api.js \
  -H "User-Agent: Mozilla/5.0" | head -c 200

# ✅ 预期输出：
# "use strict";(function(){function zt(e,t,n,o,c,l,g){try{var y=e[l](g)...
```

#### 测试 4: 浏览器测试

打开浏览器控制台（F12）：

```javascript
// 测试代理
fetch('https://turnstile-proxy.tesssuunmao.workers.dev/turnstile/v0/api.js')
  .then(res => {
    console.log('✅ Status:', res.status);
    console.log('✅ Headers:', {
      'content-type': res.headers.get('content-type'),
      'x-proxy-status': res.headers.get('x-proxy-status'),
      'x-proxy-method': res.headers.get('x-proxy-method')
    });
    return res.text();
  })
  .then(text => {
    console.log('✅ Content length:', text.length);
    console.log('✅ First 200 chars:', text.substring(0, 200));
  })
  .catch(err => console.error('❌ Error:', err));

// ✅ 预期输出：
// ✅ Status: 200
// ✅ Headers: {content-type: "text/javascript", x-proxy-status: "success", ...}
// ✅ Content length: 450000+
// ✅ First 200 chars: "use strict";(function(){...
```

---

## 🌐 测试两个域名

你有两个可用的域名：

### 1. Workers.dev 域名（默认）

```bash
# 测试 workers.dev 域名
curl -I https://turnstile-proxy.tesssuunmao.workers.dev/turnstile/v0/api.js \
  -H "User-Agent: Mozilla/5.0"

# 优点：自动配置，立即可用
# 缺点：国内访问可能不稳定
```

### 2. 自定义域名（推荐用于生产）

```bash
# 测试自定义域名
curl -I https://turnstile.superjiasu.top/turnstile/v0/api.js \
  -H "User-Agent: Mozilla/5.0"

# 优点：更稳定，更专业
# 缺点：需要域名备案（如果在国内）
```

---

## 🔧 配置前端

### 更新环境变量

编辑 `.env.local`：

```bash
# Turnstile 配置
NEXT_PUBLIC_TURNSTILE_SITE_KEY=你的站点密钥

# 启用代理
NEXT_PUBLIC_TURNSTILE_USE_PROXY=true

# 选择一个域名（二选一）

# 选项 1: Workers.dev 域名（开发环境）
NEXT_PUBLIC_TURNSTILE_PROXY_URL=https://turnstile-proxy.tesssuunmao.workers.dev

# 选项 2: 自定义域名（生产环境推荐）
# NEXT_PUBLIC_TURNSTILE_PROXY_URL=https://turnstile.superjiasu.top
```

### 重启应用

```bash
cd /root/self_code/web_vpn_v0_test
npm run dev
```

### 验证前端集成

1. 打开浏览器访问你的应用
2. 打开开发者工具 → Network 标签
3. 查找 Turnstile 脚本加载请求
4. 确认 URL 是代理域名，而不是 `challenges.cloudflare.com`

```
✅ 正确：
https://turnstile-proxy.tesssuunmao.workers.dev/turnstile/v0/api.js

❌ 错误：
https://challenges.cloudflare.com/turnstile/v0/api.js
```

---

## 🔍 故障排查

### 问题 1: 仍然返回 403

**检查清单**：

```bash
# 1. 确认部署成功
wrangler deploy

# 2. 等待缓存刷新
sleep 30

# 3. 查看实时日志
wrangler tail turnstile-proxy

# 在另一个终端测试
curl -I https://turnstile-proxy.tesssuunmao.workers.dev/turnstile/v0/api.js \
  -H "User-Agent: Mozilla/5.0"

# 4. 检查日志输出
# 如果看到 "403 Error from upstream"，说明源站拒绝请求
```

**解决方案**：

```bash
# 直接测试源站
curl -I https://challenges.cloudflare.com/turnstile/v0/api.js \
  -H "User-Agent: Mozilla/5.0"

# 如果源站也返回 403 → Cloudflare 可能在限流
# 等待 5-10 分钟后重试

# 如果源站返回 200 → Worker 代码问题
# 检查 src/index.js 是否包含最新修复
```

### 问题 2: CORS 错误

```bash
# 检查响应头
curl -I https://turnstile-proxy.tesssuunmao.workers.dev/turnstile/v0/api.js \
  | grep -i "access-control"

# 应该看到：
# access-control-allow-origin: *
# access-control-allow-methods: GET, POST, PUT, DELETE, HEAD, OPTIONS
```

### 问题 3: 自定义域名无法访问

```bash
# 检查 DNS 记录
dig turnstile.superjiasu.top

# 检查 wrangler.toml 配置
cat wrangler.toml | grep -A 2 "routes"

# 应该看到：
# routes = [
#   { pattern = "turnstile.superjiasu.top/*", zone_name = "superjiasu.top" }
# ]
```

---

## 📊 监控和日志

### 实时日志

```bash
# 查看实时日志
wrangler tail turnstile-proxy

# 在另一个终端发送请求
curl https://turnstile-proxy.tesssuunmao.workers.dev/turnstile/v0/api.js

# 查看日志输出
# - 请求方法（GET/HEAD/POST）
# - 响应状态码
# - 错误信息（如果有）
```

### Dashboard 监控

1. 访问 [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Workers & Pages → `turnstile-proxy`
3. Metrics 标签：
   - 请求量
   - 错误率
   - P50/P99 延迟

---

## ✅ 验收标准

部署成功的标志：

- [ ] 健康检查返回 200 OK
- [ ] HEAD 请求返回 200 OK（不是 403）
- [ ] GET 请求成功获取脚本内容
- [ ] 响应包含 CORS 头
- [ ] 响应包含 `x-proxy-status: success`
- [ ] 浏览器可以成功加载脚本
- [ ] 前端 Network 显示代理 URL

---

## 🎯 完整测试命令

复制以下命令一次性测试所有功能：

```bash
#!/bin/bash
WORKER_URL="https://turnstile-proxy.tesssuunmao.workers.dev"

echo "🧪 测试 1: 健康检查"
curl -s "$WORKER_URL/health" | jq '.'

echo ""
echo "🧪 测试 2: HEAD 请求"
curl -I "$WORKER_URL/turnstile/v0/api.js" \
  -H "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"

echo ""
echo "🧪 测试 3: GET 请求"
curl -s "$WORKER_URL/turnstile/v0/api.js" \
  -H "User-Agent: Mozilla/5.0" | head -c 200

echo ""
echo "✅ 测试完成！"
```

---

## 📞 需要帮助？

如果测试失败，提供以下信息：

1. **部署输出**：`wrangler deploy` 的完整输出
2. **测试结果**：`curl -v` 的完整输出
3. **Worker 日志**：`wrangler tail` 的日志
4. **错误截图**：浏览器 Network 标签截图

---

## 🎓 下一步

1. ✅ **完成部署和测试**
2. ✅ **配置前端环境变量**
3. ✅ **在浏览器中验证完整流程**
4. ⏭️ **配置后端验证** - 使用 Turnstile Secret Key 验证 token
5. ⏭️ **生产环境部署** - 使用自定义域名
6. ⏭️ **监控和优化** - 设置告警和性能优化

---

**准备好了吗？** 运行部署命令开始测试！🚀
