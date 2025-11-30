# 🔧 Turnstile Worker 403 错误排查指南

## 🚨 问题现象

```bash
curl -I https://turnstile-proxy.tesssuunmao.workers.dev/turnstile/v0/api.js
HTTP/2 403
date: Sun, 30 Nov 2025 15:19:21 GMT
content-type: text/html
```

---

## 🔍 根本原因分析

403 Forbidden 错误表示 Cloudflare 源站 (`challenges.cloudflare.com`) **拒绝了你的 Worker 的请求**。

### 可能的原因

| 原因 | 可能性 | 说明 |
|------|--------|------|
| **缺少关键请求头** | ⭐⭐⭐⭐⭐ 最可能 | 缺少 User-Agent、Referer 等头 |
| **直接 curl 测试** | ⭐⭐⭐⭐ 很可能 | curl 默认不发送浏览器头 |
| **IP 限流/拉黑** | ⭐⭐⭐ 可能 | Workers IP 被临时限流 |
| **Bot 检测** | ⭐⭐ 较少 | Cloudflare 认为请求是机器人 |

---

## ✅ 解决方案

### 方案 1: 使用增强版 Worker 代码（推荐）

我已经创建了修复版本 `worker-fixed.js`，包含以下改进：

#### 🔧 关键改进点

```javascript
// 1. 添加真实的 User-Agent
modifiedHeaders.set('User-Agent',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
);

// 2. 添加 Referer 头
modifiedHeaders.set('Referer', 'https://challenges.cloudflare.com/');

// 3. 添加正确的 Accept 头
if (url.pathname.endsWith('.js')) {
  modifiedHeaders.set('Accept', '*/*');
}

// 4. 移除 Cloudflare 内部头（可能导致冲突）
modifiedHeaders.delete('cf-connecting-ip');
modifiedHeaders.delete('cf-ray');
modifiedHeaders.delete('cf-visitor');
modifiedHeaders.delete('cf-worker');
```

#### 📦 部署步骤

```bash
# 1. 进入你的 Worker 项目目录
cd turnstile-proxy-worker

# 2. 替换 src/index.js 为修复版本
cp /root/self_code/web_vpn_v0_test/docs/turnstile/worker-fixed.js src/index.js

# 3. 重新部署
wrangler deploy

# 4. 测试（等待 30 秒让 CDN 缓存失效）
sleep 30
curl -I https://turnstile-proxy.tesssuunmao.workers.dev/turnstile/v0/api.js
```

---

### 方案 2: 直接在 Dashboard 更新

1. 访问 [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Workers & Pages → `turnstile-proxy`
3. Quick Edit → 粘贴 `worker-fixed.js` 的代码
4. Save and Deploy
5. 等待 30 秒后测试

---

### 方案 3: 测试时使用浏览器头

如果只是测试，可以在 curl 中添加头：

```bash
curl -I https://turnstile-proxy.tesssuunmao.workers.dev/turnstile/v0/api.js \
  -H "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" \
  -H "Referer: https://challenges.cloudflare.com/" \
  -H "Accept: */*"
```

**注意**：这只是测试方法，不解决根本问题。

---

## 🧪 验证修复

### 步骤 1: 测试健康检查

```bash
curl https://turnstile-proxy.tesssuunmao.workers.dev/health

# 预期输出：
# {"status":"ok","service":"turnstile-proxy","timestamp":1701357561000}
```

### 步骤 2: 测试代理（带浏览器头）

```bash
curl -I https://turnstile-proxy.tesssuunmao.workers.dev/turnstile/v0/api.js \
  -H "User-Agent: Mozilla/5.0"

# 预期输出：
# HTTP/2 200
# content-type: text/javascript
# access-control-allow-origin: *
# x-proxy-status: success
```

### 步骤 3: 测试真实浏览器

打开浏览器控制台：

```javascript
fetch('https://turnstile-proxy.tesssuunmao.workers.dev/turnstile/v0/api.js')
  .then(res => {
    console.log('Status:', res.status);
    console.log('Headers:', Object.fromEntries(res.headers));
    return res.text();
  })
  .then(text => console.log('Content length:', text.length))
  .catch(err => console.error('Error:', err));

// 预期输出：
// Status: 200
// Headers: {content-type: "text/javascript", ...}
// Content length: 450000+ (脚本大小)
```

---

## 🔬 深度诊断

### 查看 Worker 日志

```bash
# 实时查看日志
wrangler tail turnstile-proxy

# 然后在另一个终端测试
curl https://turnstile-proxy.tesssuunmao.workers.dev/turnstile/v0/api.js
```

**查找以下信息**：
- ✅ 请求是否到达 Worker
- ✅ 发送到源站的请求头
- ❌ 403 错误的详细信息

---

## 🚧 如果问题仍然存在

### 方法 1: 直接测试源站

```bash
# 测试 Cloudflare 源站是否正常
curl -I https://challenges.cloudflare.com/turnstile/v0/api.js \
  -H "User-Agent: Mozilla/5.0"

# 如果返回 403 → 源站本身有问题
# 如果返回 200 → Worker 配置问题
```

### 方法 2: 检查 IP 是否被限流

```bash
# 在 Worker 中添加日志查看源站响应
console.log('Response status:', response.status);
console.log('Response headers:', Object.fromEntries(response.headers));
```

### 方法 3: 使用备用源站

Cloudflare 有多个 Turnstile 源站：

```javascript
// 尝试备用源站
const BACKUP_HOSTS = [
  'challenges.cloudflare.com',
  'challenges-staging.cloudflare.com',
  'challenges.fed.cloudflare.com'
];

// 轮询尝试
for (const host of BACKUP_HOSTS) {
  targetUrl.hostname = host;
  const response = await fetch(targetUrl);
  if (response.ok) break;
}
```

---

## 🎯 预防措施

### 1. 添加请求头白名单

```javascript
// 确保关键头总是存在
const REQUIRED_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
  'Accept': '*/*',
  'Referer': 'https://challenges.cloudflare.com/'
};

for (const [key, value] of Object.entries(REQUIRED_HEADERS)) {
  if (!modifiedHeaders.has(key)) {
    modifiedHeaders.set(key, value);
  }
}
```

### 2. 添加重试逻辑

```javascript
async function fetchWithRetry(request, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    const response = await fetch(request);
    if (response.ok || response.status !== 403) {
      return response;
    }
    // 等待 1 秒后重试
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  throw new Error('Max retries exceeded');
}
```

### 3. 监控和告警

```javascript
// 记录 403 错误
if (response.status === 403) {
  // 发送告警（可以集成 Sentry、Webhook 等）
  await sendAlert({
    type: '403_error',
    url: targetUrl.toString(),
    timestamp: Date.now()
  });
}
```

---

## 📊 常见错误代码对照表

| 状态码 | 原因 | 解决方案 |
|--------|------|----------|
| 403 | 请求被拒绝 | 添加正确的请求头 |
| 429 | 速率限制 | 添加重试逻辑，降低请求频率 |
| 502 | Worker 超时 | 增加超时时间，检查网络 |
| 520 | 源站错误 | 检查源站状态 |

---

## 💡 最佳实践

### ✅ DO（应该做）

- ✅ 总是添加 User-Agent 头
- ✅ 添加 Referer 头指向源站
- ✅ 设置正确的 Accept 头
- ✅ 移除 Cloudflare 内部头
- ✅ 添加超时控制（30秒）
- ✅ 实现错误日志和告警

### ❌ DON'T（不应该做）

- ❌ 不要在 Worker 中硬编码敏感信息
- ❌ 不要跳过 CORS 头设置
- ❌ 不要忽略错误处理
- ❌ 不要在生产环境直接用 curl 测试（缺少浏览器头）

---

## 🔄 完整修复流程

```bash
# 1. 备份当前代码
wrangler download turnstile-proxy backup-$(date +%Y%m%d)

# 2. 更新为修复版本
cp /path/to/worker-fixed.js src/index.js

# 3. 本地测试
wrangler dev
# 在另一个终端测试: curl http://localhost:8787/health

# 4. 部署到生产
wrangler deploy

# 5. 等待 CDN 缓存刷新
sleep 30

# 6. 验证修复
curl -I https://turnstile-proxy.tesssuunmao.workers.dev/turnstile/v0/api.js \
  -H "User-Agent: Mozilla/5.0"

# 7. 前端集成测试
# 访问你的应用，检查 Network 标签
```

---

## 📞 仍然无法解决？

如果按照上述步骤仍然出现 403 错误：

### 1. 收集诊断信息

```bash
# 收集完整的响应信息
curl -v https://turnstile-proxy.tesssuunmao.workers.dev/turnstile/v0/api.js \
  -H "User-Agent: Mozilla/5.0" \
  > debug.log 2>&1

# 查看 Worker 日志
wrangler tail turnstile-proxy > worker.log
```

### 2. 检查 Cloudflare 状态

访问 [Cloudflare Status](https://www.cloudflarestatus.com/) 查看是否有服务中断。

### 3. 联系支持

- Cloudflare Workers 社区：https://community.cloudflare.com/c/developers/workers/40
- GitHub Issues：提供完整的错误日志和配置

---

## 🎓 理解 403 vs 其他错误

```
403 Forbidden：服务器理解请求，但拒绝执行（权限/验证问题）
401 Unauthorized：需要身份验证
404 Not Found：资源不存在
429 Too Many Requests：速率限制
502 Bad Gateway：上游服务器错误
503 Service Unavailable：服务暂时不可用
```

---

## 📝 检查清单

部署前确认：

- [ ] Worker 代码包含 User-Agent 头
- [ ] Worker 代码包含 Referer 头
- [ ] Worker 代码移除了 Cloudflare 内部头
- [ ] Worker 代码设置了 CORS 头
- [ ] 已测试 /health 端点
- [ ] 已使用浏览器测试实际请求
- [ ] 已检查 Worker 日志

---

**需要更多帮助？** 提供以下信息：
1. Worker 当前代码
2. `curl -v` 的完整输出
3. `wrangler tail` 的日志
4. 浏览器 Network 标签的截图
