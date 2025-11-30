# Turnstile 代理快速开始指南

## 🎯 5 分钟快速部署

### 前提条件

- ✅ Cloudflare 账户
- ✅ Node.js 18+ 已安装
- ✅ Turnstile Site Key（从 [Cloudflare Dashboard](https://dash.cloudflare.com/?to=/:account/turnstile) 获取）

---

## 📝 方案选择

### 选项 1: 自动部署（推荐）

```bash
# 运行自动部署脚本
cd /root/self_code/web_vpn_v0_test
./scripts/deploy-turnstile-proxy.sh

# 跟随提示操作：
# 1. 登录 Cloudflare
# 2. 等待部署完成
# 3. 复制 Worker URL
```

### 选项 2: 手动部署

```bash
# 1. 安装 Wrangler
npm install -g wrangler

# 2. 登录 Cloudflare
wrangler login

# 3. 创建项目
mkdir turnstile-proxy-worker && cd turnstile-proxy-worker
wrangler init

# 4. 复制 Worker 代码（见下方）

# 5. 部署
wrangler deploy
```

---

## 🔧 配置前端

### 步骤 1: 设置环境变量

创建或编辑 `.env.local`：

```bash
# Turnstile 配置
NEXT_PUBLIC_TURNSTILE_SITE_KEY=0x4AAAAAAAxxxxxxxxxx

# 启用代理模式
NEXT_PUBLIC_TURNSTILE_USE_PROXY=true

# Worker URL（替换为你的实际 URL）
NEXT_PUBLIC_TURNSTILE_PROXY_URL=https://turnstile-proxy.xxx.workers.dev
```

### 步骤 2: 重启开发服务器

```bash
npm run dev
```

### 步骤 3: 验证代理

打开浏览器开发者工具 → Network 标签：

- ✅ 应该看到：`https://turnstile-proxy.xxx.workers.dev/turnstile/v0/api.js`
- ❌ 不应该看到：`https://challenges.cloudflare.com/turnstile/v0/api.js`

---

## 🌐 配置自定义域名（可选）

### 为什么需要？

`*.workers.dev` 域名在国内访问不稳定，强烈建议使用自定义域名。

### 配置步骤

#### 方法 1: Wrangler CLI

编辑 `turnstile-proxy-worker/wrangler.toml`：

```toml
name = "turnstile-proxy"
main = "src/index.js"
compatibility_date = "2024-01-01"

# 添加自定义域名路由
routes = [
  { pattern = "turnstile.yourdomain.com/*", zone_name = "yourdomain.com" }
]
```

重新部署：

```bash
wrangler deploy
```

#### 方法 2: Cloudflare Dashboard

1. 访问 [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Workers & Pages → `turnstile-proxy` → Settings → Triggers
3. Add Custom Domain → 输入 `turnstile.yourdomain.com`
4. 保存（Cloudflare 会自动添加 DNS 记录）

更新 `.env.local`：

```bash
NEXT_PUBLIC_TURNSTILE_PROXY_URL=https://turnstile.yourdomain.com
```

---

## 🧪 测试验证

### 测试 1: Worker 健康检查

```bash
curl https://turnstile-proxy.xxx.workers.dev/health

# 应该返回：
# {"status":"ok","service":"turnstile-proxy"}
```

### 测试 2: 脚本可访问性

```bash
curl -I https://turnstile-proxy.xxx.workers.dev/turnstile/v0/api.js

# 应该返回 200 OK 和 CORS 头：
# HTTP/2 200
# access-control-allow-origin: *
# content-type: text/javascript
```

### 测试 3: 前端集成

访问你的应用，打开浏览器控制台：

```javascript
// 检查脚本 URL
console.log('[Turnstile] Script source:',
  document.querySelector('script[src*="turnstile"]')?.src
);

// 应该输出代理 URL，而不是官方 URL
```

---

## 🎨 完整 Worker 代码

如果手动创建，使用此代码：

```javascript
// src/index.js
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (request.method === 'OPTIONS') {
      return handleCORS(request);
    }

    if (url.pathname.startsWith('/turnstile/') || url.pathname.startsWith('/cdn-cgi/')) {
      return proxyTurnstile(request, url);
    }

    if (url.pathname === '/health') {
      return new Response(JSON.stringify({ status: 'ok', service: 'turnstile-proxy' }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response('Not Found', { status: 404 });
  }
};

async function proxyTurnstile(request, url) {
  try {
    const targetUrl = new URL(request.url);
    targetUrl.hostname = 'challenges.cloudflare.com';

    const modifiedHeaders = new Headers(request.headers);
    modifiedHeaders.set('Host', 'challenges.cloudflare.com');

    const response = await fetch(new Request(targetUrl, {
      method: request.method,
      headers: modifiedHeaders,
      body: request.body,
      redirect: 'follow'
    }));

    const modifiedResponse = new Response(response.body, response);
    setCORSHeaders(modifiedResponse.headers, request);

    return modifiedResponse;
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Proxy failed' }), {
      status: 502,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

function handleCORS(request) {
  const headers = new Headers();
  setCORSHeaders(headers, request);
  return new Response(null, { status: 204, headers });
}

function setCORSHeaders(headers, request) {
  const origin = request.headers.get('Origin');
  headers.set('Access-Control-Allow-Origin', origin || '*');
  headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  headers.set('Access-Control-Allow-Credentials', 'true');
  headers.set('Access-Control-Max-Age', '86400');
}
```

---

## 🔍 故障排查

### 问题 1: Worker 部署失败

```bash
# 检查 Wrangler 版本
wrangler --version

# 重新登录
wrangler logout
wrangler login

# 重新部署
wrangler deploy
```

### 问题 2: CORS 错误

检查浏览器控制台，如果看到 CORS 错误：

1. 确保 Worker 代码包含 `setCORSHeaders` 函数
2. 检查 OPTIONS 请求是否被正确处理
3. 验证响应头包含 `access-control-allow-origin`

```bash
# 测试 CORS 头
curl -H "Origin: https://yourdomain.com" \
     -H "Access-Control-Request-Method: POST" \
     -X OPTIONS \
     https://turnstile-proxy.xxx.workers.dev/turnstile/v0/api.js
```

### 问题 3: 脚本加载失败

```javascript
// 在 components/Turnstile.tsx 中添加错误处理
useEffect(() => {
  const script = document.createElement("script");
  script.src = SCRIPT_SRC;
  script.async = true;

  script.onerror = () => {
    console.error('[Turnstile] Failed to load script:', SCRIPT_SRC);
    // 降级到官方源站
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
  };

  document.head.appendChild(script);
}, []);
```

### 问题 4: 验证请求失败

检查 `/cdn-cgi/` 路径是否被代理：

```bash
# 测试验证端点
curl -X POST \
  https://turnstile-proxy.xxx.workers.dev/cdn-cgi/challenge-platform/h/b/turnstile/... \
  -H "Content-Type: application/json"
```

---

## 📊 监控与日志

### 查看实时日志

```bash
cd turnstile-proxy-worker
wrangler tail

# 或指定 Worker 名称
wrangler tail turnstile-proxy
```

### Dashboard 监控

访问 [Cloudflare Dashboard](https://dash.cloudflare.com)：

1. Workers & Pages → `turnstile-proxy`
2. Metrics 标签：查看请求量、错误率、延迟
3. Logs 标签：查看请求日志

---

## 💰 成本预估

### 免费额度（每天）

- ✅ 100,000 次请求
- ✅ 每次请求 10ms CPU 时间

### 超出免费额度

付费版（$5/月）：
- 10,000,000 次请求/月
- 每次请求 50ms CPU 时间

**典型成本**（假设每天 10,000 次验证）：
- 请求数：10,000 × 30 = 300,000 次/月
- 成本：**免费**（在免费额度内）

---

## 🚀 生产环境清单

部署到生产环境前，确认：

- [ ] Worker 已部署并测试通过
- [ ] 配置了自定义域名（不使用 workers.dev）
- [ ] 设置了生产环境变量
- [ ] 测试了完整的验证流程
- [ ] 配置了监控和告警
- [ ] 准备了降级方案（官方源站备份）

---

## 📚 相关文档

- [详细代理逻辑说明](./TURNSTILE_PROXY_GUIDE.md)
- [Cloudflare Workers 文档](https://developers.cloudflare.com/workers/)
- [Turnstile 官方文档](https://developers.cloudflare.com/turnstile/)

---

## ❓ 常见问题

### Q: Workers.dev 域名被墙怎么办？

**A:** 必须配置自定义域名。参考上面的"配置自定义域名"部分。

### Q: 代理会增加延迟吗？

**A:** 不会。请求在 Cloudflare 边缘网络内部完成，延迟通常 <10ms，比直接访问还快。

### Q: 需要配置后端验证吗？

**A:** 是的。前端代理只解决加载问题，后端验证 token 时仍需调用 Cloudflare API：

```javascript
// 后端验证（不受墙影响，因为在服务器端）
const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    secret: process.env.TURNSTILE_SECRET_KEY,
    response: token,
  }),
});
```

### Q: 可以代理多个 Turnstile 站点吗？

**A:** 可以。一个 Worker 可以代理多个站点，只需确保 CORS 配置正确。

---

**部署遇到问题？** 查看详细文档或提出问题！
