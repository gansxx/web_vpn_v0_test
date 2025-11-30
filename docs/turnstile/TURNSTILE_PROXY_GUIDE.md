# Cloudflare Workers Turnstile 代理方案详解

## 📖 代理逻辑说明

### 工作原理

这个方案通过 Cloudflare Workers 在**边缘网络内部**代理 Turnstile 的所有请求，避免国内用户直接访问被墙的域名。

## 🔄 完整请求流程

```
用户浏览器 (中国)
    ↓ [1] 加载网页
你的网站 (Next.js)
    ↓ [2] 引入 Turnstile 脚本
<script src="https://turnstile.yourdomain.com/turnstile/v0/api.js">
    ↓ [3] DNS 解析到 Cloudflare Workers
Cloudflare Workers (边缘节点)
    ↓ [4] 内部网络转发（不经过公网）
Cloudflare Turnstile 源站 (challenges.cloudflare.com)
    ↓ [5] 返回 api.js 脚本
Cloudflare Workers
    ↓ [6] 添加 CORS 头，返回给用户
用户浏览器
    ↓ [7] 执行 Turnstile 验证
    ↓ [8] 后续验证请求也通过 Workers 代理
Cloudflare Workers → Turnstile 源站
    ↓ [9] 验证完成，返回 token
用户提交表单
```

---

## 🎯 核心代理逻辑详解

### 1. **请求拦截与路由**

```javascript
// Worker 接收所有发往 turnstile.yourdomain.com 的请求
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // 拦截两类路径：
    // 1. /turnstile/* - JS 脚本和静态资源
    // 2. /cdn-cgi/challenge-platform/* - 验证 API 请求

    if (url.pathname.startsWith('/turnstile/')) {
      return proxyTurnstile(request, url);
    }

    if (url.pathname.startsWith('/cdn-cgi/')) {
      return proxyTurnstile(request, url);
    }

    // 其他请求返回 404
    return new Response('Not Found', { status: 404 });
  }
};
```

**关键点**：
- ✅ **路径保持不变**：只修改域名，路径完全保留
- ✅ **全量代理**：代理所有 Turnstile 相关的请求（JS、API、验证等）
- ✅ **透明转发**：用户无感知，仿佛直接访问 Cloudflare

---

### 2. **域名替换与请求转发**

```javascript
async function proxyTurnstile(request, url) {
  // 构建新的目标 URL
  const targetUrl = new URL(request.url);

  // 只替换域名，路径、查询参数全部保留
  targetUrl.hostname = 'challenges.cloudflare.com';

  // 例如：
  // 输入：https://turnstile.yourdomain.com/turnstile/v0/api.js?render=explicit
  // 输出：https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit

  // 克隆请求头
  const modifiedHeaders = new Headers(request.headers);
  modifiedHeaders.set('Host', 'challenges.cloudflare.com');

  // 发起请求（在 Cloudflare 边缘网络内部）
  const response = await fetch(targetUrl, {
    method: request.method,
    headers: modifiedHeaders,
    body: request.body,
    redirect: 'follow'
  });

  return response;
}
```

**关键点**：
- 🚀 **边缘网络优势**：请求在 Cloudflare 内部完成，延迟极低（<10ms）
- 🌍 **全球加速**：用户访问最近的 Cloudflare 边缘节点
- 🔒 **保持原始请求**：方法、Body、查询参数完全保留

---

### 3. **CORS 处理**

```javascript
function setCORSHeaders(headers, request) {
  const origin = request.headers.get('Origin');

  // 允许跨域访问
  headers.set('Access-Control-Allow-Origin', origin || '*');
  headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  headers.set('Access-Control-Allow-Credentials', 'true');
}
```

**为什么需要 CORS**：
- Turnstile 脚本会向代理域名发起跨域请求
- 浏览器安全策略要求服务器返回 CORS 头
- Workers 添加这些头，允许你的网站访问代理资源

---

### 4. **OPTIONS 预检请求处理**

```javascript
// 浏览器在发送 POST 请求前，会先发送 OPTIONS 请求确认权限
if (request.method === 'OPTIONS') {
  return new Response(null, {
    status: 204,
    headers: setCORSHeaders(new Headers(), request)
  });
}
```

**关键点**：
- ⚡ **快速响应**：OPTIONS 请求直接返回 204，不转发到源站
- 🔐 **安全检查**：浏览器确认跨域请求被允许

---

## 🔧 前端集成逻辑

### 配置系统 (`lib/turnstile-config.ts`)

```typescript
// 读取环境变量
const USE_PROXY = process.env.NEXT_PUBLIC_TURNSTILE_USE_PROXY === 'true';
const PROXY_URL = process.env.NEXT_PUBLIC_TURNSTILE_PROXY_URL;

export function getTurnstileScriptUrl(): string {
  if (USE_PROXY && PROXY_URL) {
    // 使用代理：https://turnstile.yourdomain.com/turnstile/v0/api.js
    return `${PROXY_URL}/turnstile/v0/api.js?render=explicit`;
  }

  // 默认官方源站：https://challenges.cloudflare.com/turnstile/v0/api.js
  return 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
}
```

**逻辑流程**：
1. 检查环境变量 `NEXT_PUBLIC_TURNSTILE_USE_PROXY`
2. 如果启用代理且配置了 `NEXT_PUBLIC_TURNSTILE_PROXY_URL`
3. 返回代理 URL，否则返回官方 URL

---

### Turnstile 组件集成

```typescript
// components/Turnstile.tsx
import { getTurnstileScriptUrl } from "@/lib/turnstile-config"

// 获取脚本 URL（自动根据配置选择代理或官方源站）
const SCRIPT_SRC = getTurnstileScriptUrl()

// 加载脚本
useEffect(() => {
  const script = document.createElement("script")
  script.src = SCRIPT_SRC  // 这里会是代理 URL 或官方 URL
  script.async = true
  document.head.appendChild(script)
}, [])
```

**关键点**：
- 🎛️ **一键切换**：通过环境变量控制是否使用代理
- 🔄 **向后兼容**：不使用代理时，行为与原来完全一致
- 🛡️ **降级保护**：代理失败时可以切换回官方源站

---

## 🚀 部署步骤

### 步骤 1: 部署 Cloudflare Worker

```bash
# 创建 Worker
wrangler init turnstile-proxy

# 复制代理代码到 src/index.js

# 部署
wrangler deploy

# 输出：
# Published turnstile-proxy
# https://turnstile-proxy.<your-account>.workers.dev
```

### 步骤 2: 配置自定义域名（可选）

```bash
# 方式 A: wrangler.toml
routes = [
  { pattern = "turnstile.yourdomain.com/*", zone_name = "yourdomain.com" }
]

# 方式 B: Dashboard
# Workers → turnstile-proxy → Settings → Triggers → Add Custom Domain
```

### 步骤 3: 配置前端环境变量

```bash
# .env.local
NEXT_PUBLIC_TURNSTILE_SITE_KEY=0x4AAAAAAAxxxxxxxxxx
NEXT_PUBLIC_TURNSTILE_USE_PROXY=true
NEXT_PUBLIC_TURNSTILE_PROXY_URL=https://turnstile.yourdomain.com

# 或者使用 workers.dev 域名
# NEXT_PUBLIC_TURNSTILE_PROXY_URL=https://turnstile-proxy.<account>.workers.dev
```

### 步骤 4: 重启应用

```bash
npm run dev
```

---

## 🧪 验证代理是否生效

### 方法 1: 浏览器开发者工具

```javascript
// 打开 Network 标签
// 查找 api.js 请求
// 请求 URL 应该是：
// https://turnstile.yourdomain.com/turnstile/v0/api.js?render=explicit

// 而不是：
// https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit
```

### 方法 2: 命令行测试

```bash
# 测试代理是否可访问
curl -I https://turnstile.yourdomain.com/turnstile/v0/api.js

# 应该返回 200 OK 和 CORS 头
# access-control-allow-origin: *
# content-type: text/javascript
```

### 方法 3: 控制台日志

```javascript
// 在 Turnstile.tsx 中添加日志
console.log('[Turnstile] Loading script from:', SCRIPT_SRC);

// 输出应该是：
// [Turnstile] Loading script from: https://turnstile.yourdomain.com/turnstile/v0/api.js?render=explicit
```

---

## 🎯 核心优势总结

| 特性 | 说明 |
|------|------|
| **零延迟** | 请求在 Cloudflare 边缘网络内部完成，不经过公网 |
| **高可用** | Cloudflare 300+ 边缘节点，99.99% SLA |
| **免费额度** | 每天 10 万次请求免费 |
| **简单部署** | 一个 Worker 脚本，无需服务器 |
| **透明代理** | 用户无感知，API 完全兼容 |
| **智能降级** | 代理失败时可切换回官方源站 |

---

## ⚠️ 注意事项

### 1. **自定义域名仍可能被墙**

即使使用 Workers，如果你的域名被加入黑名单，仍会失效。

**解决方案**：
- 准备多个备用域名
- 使用 CDN 服务商的域名（如阿里云 CDN）

### 2. **Workers.dev 域名在国内访问**

`*.workers.dev` 域名在国内访问**不稳定**，强烈建议使用自定义域名。

### 3. **调试困难**

Workers 的日志需要在 Cloudflare Dashboard 中查看，本地调试有限。

**解决方案**：
```bash
# 使用 wrangler dev 本地测试
wrangler dev

# 查看实时日志
wrangler tail
```

---

## 🔧 故障排查

### 问题 1: 脚本加载失败

```javascript
// 检查环境变量
console.log('USE_PROXY:', process.env.NEXT_PUBLIC_TURNSTILE_USE_PROXY);
console.log('PROXY_URL:', process.env.NEXT_PUBLIC_TURNSTILE_PROXY_URL);

// 检查脚本 URL
console.log('SCRIPT_SRC:', SCRIPT_SRC);
```

### 问题 2: CORS 错误

```javascript
// 确保 Worker 返回了正确的 CORS 头
// 检查 Network 响应头：
// access-control-allow-origin: *
// access-control-allow-credentials: true
```

### 问题 3: 验证请求失败

```javascript
// 确保 /cdn-cgi/* 路径也被代理
// 检查 Worker 代码是否包含：
if (url.pathname.startsWith('/cdn-cgi/')) {
  return proxyTurnstile(request, url);
}
```

---

## 📚 参考资料

- [Cloudflare Workers 文档](https://developers.cloudflare.com/workers/)
- [Turnstile 官方文档](https://developers.cloudflare.com/turnstile/)
- [Wrangler CLI 文档](https://developers.cloudflare.com/workers/wrangler/)

---

## 🎓 下一步

1. **测试验证**：在开发环境测试代理功能
2. **性能监控**：监控 Workers 的请求量和延迟
3. **备用方案**：配置降级策略（官方源站 + 代理）
4. **生产部署**：更新生产环境变量，启用代理

---

**需要帮助？** 随时提问！
