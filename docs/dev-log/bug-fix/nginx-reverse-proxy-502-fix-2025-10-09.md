# Nginx反向代理502错误修复指南

**修复日期**: 2025-10-09
**问题服务器**: 47.239.122.122 (go.superjiasu.top)
**后端服务**: selfgo.asia (Cloudflare托管)

---

## 问题描述

访问 `https://go.superjiasu.top` 时出现 **502 Bad Gateway** 错误。该服务器配置了nginx反向代理，将请求转发到 `https://selfgo.asia`。

### 错误现象
- 浏览器访问返回502错误
- nginx正常运行，配置语法检查通过
- 后端服务selfgo.asia可正常访问

---

## 根本原因分析

### 问题配置
```nginx
location / {
    proxy_pass https://selfgo.asia;
    proxy_set_header Host $host;  # ❌ 错误！
    # ... 其他配置
}
```

### 原因分析

1. **Host头不匹配**
   - nginx发送的Host头为 `go.superjiasu.top`（`$host`变量）
   - 后端Cloudflare期望Host头为 `selfgo.asia`
   - Host头不匹配导致Cloudflare拒绝请求

2. **缺少SNI配置**
   - 未启用SNI (Server Name Indication)
   - SSL握手时无法正确识别证书域名

3. **错误日志证据**
```
SSL_do_handshake() failed (SSL: error:0A000410:SSL routines::sslv3 alert handshake failure:SSL alert number 40)
upstream: "https://104.21.5.112:443/"
```

---

## 完整解决方案

### 修复后的nginx配置

```nginx
server {
    listen 443 ssl http2;
    listen [::]:443 ssl ipv6only=on;
    server_name go.superjiasu.top;

    # SSL证书配置（Certbot自动管理）
    ssl_certificate /etc/letsencrypt/live/go.superjiasu.top/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/go.superjiasu.top/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    location / {
        # 反向代理到后端
        proxy_pass https://selfgo.asia;

        # ✅ 关键修复：使用后端域名作为Host头
        proxy_set_header Host selfgo.asia;

        # ✅ 启用SNI支持
        proxy_ssl_server_name on;
        proxy_ssl_name selfgo.asia;
        proxy_ssl_protocols TLSv1.2 TLSv1.3;

        # 保留客户端真实信息
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # 保留原始请求域名用于日志
        proxy_set_header X-Forwarded-Host $host;

        # 超时配置
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;

        # 缓冲配置
        proxy_buffering on;
        proxy_buffer_size 4k;
        proxy_buffers 8 4k;
        proxy_busy_buffers_size 8k;
    }
}

# HTTP到HTTPS重定向
server {
    listen 80;
    listen [::]:80;
    server_name go.superjiasu.top;

    return 301 https://$host$request_uri;
}
```

---

## 实施步骤

### 1. 备份当前配置
```bash
ssh root@47.239.122.122
cp /etc/nginx/sites-available/default /etc/nginx/sites-available/default.backup.$(date +%Y%m%d_%H%M%S)
```

### 2. 修改配置文件
```bash
nano /etc/nginx/sites-available/default
```

**关键修改点**：
- `proxy_set_header Host $host;` → `proxy_set_header Host selfgo.asia;`
- 添加 `proxy_ssl_server_name on;`
- 添加 `proxy_ssl_name selfgo.asia;`
- 添加 `proxy_set_header X-Forwarded-Host $host;`

### 3. 测试配置
```bash
nginx -t
```

预期输出：
```
nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
nginx: configuration file /etc/nginx/nginx.conf test is successful
```

### 4. 重载nginx
```bash
systemctl reload nginx
```

### 5. 验证修复
```bash
# 测试访问
curl -I https://go.superjiasu.top

# 预期返回
HTTP/1.1 200 OK
Server: nginx/1.22.1
```

---

## 诊断步骤

如果遇到类似问题，按以下步骤诊断：

### 1. 查看错误日志
```bash
tail -f /var/log/nginx/error.log
```

关键错误信息：
- `SSL_do_handshake() failed` - SSL握手失败
- `upstream prematurely closed connection` - 上游服务器关闭连接
- `no live upstreams` - 所有上游服务器不可用

### 2. 测试后端连接
```bash
# 从代理服务器测试后端域名
curl -v https://selfgo.asia

# 测试DNS解析
dig selfgo.asia +short
```

### 3. 检查nginx配置
```bash
# 查看当前配置
cat /etc/nginx/sites-available/default | grep -A 20 "location /"

# 验证语法
nginx -t
```

### 4. 检查SSL证书
```bash
# 查看证书信息
openssl s_client -connect selfgo.asia:443 -servername selfgo.asia < /dev/null
```

---

## 技术要点

### Host Header的作用
- HTTP/1.1要求所有请求必须包含Host头
- 对于Cloudflare等CDN服务，Host头用于路由到正确的后端
- 代理服务器必须发送后端期望的Host头，而非代理服务器自己的域名

### SNI (Server Name Indication)
- TLS扩展，允许在SSL握手时指定域名
- 对于托管多个域名的服务器（如Cloudflare）必需
- nginx通过 `proxy_ssl_server_name on` 启用

### X-Forwarded-Host的作用
- 保留原始请求的Host头（go.superjiasu.top）
- 后端服务可用于日志记录和分析
- 与Host头区分：Host用于路由，X-Forwarded-Host用于信息保留

---

## 常见错误

### 错误1：使用IP地址代理HTTPS
```nginx
# ❌ 错误
proxy_pass https://216.198.79.1;
```

**问题**：SSL证书是为域名签发的，不是IP地址
**解决**：使用域名而非IP

### 错误2：缺少SNI配置
```nginx
# ❌ 不完整
proxy_pass https://backend.com;
proxy_set_header Host backend.com;
# 缺少 proxy_ssl_server_name on;
```

**问题**：多域名服务器无法识别请求的域名
**解决**：添加SNI配置

### 错误3：Host头使用$host变量
```nginx
# ❌ 错误
proxy_set_header Host $host;
```

**问题**：发送代理服务器域名，后端无法识别
**解决**：发送后端期望的域名

---

## 相关资源

### nginx官方文档
- [ngx_http_proxy_module](http://nginx.org/en/docs/http/ngx_http_proxy_module.html)
- [proxy_set_header指令](http://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_set_header)
- [proxy_ssl_server_name指令](http://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_ssl_server_name)

### Cloudflare相关
- [Cloudflare SSL/TLS配置](https://developers.cloudflare.com/ssl/)
- [Origin CA证书](https://developers.cloudflare.com/ssl/origin-configuration/origin-ca/)

---

## 总结

### 问题根源
nginx反向代理到Cloudflare托管的HTTPS后端时，Host头配置错误导致502错误。

### 解决方案
将Host头设置为后端域名，启用SNI支持，保持SSL代理配置完整。

### 关键配置
```nginx
proxy_set_header Host selfgo.asia;      # 后端域名
proxy_ssl_server_name on;                # 启用SNI
proxy_ssl_name selfgo.asia;              # SNI域名
proxy_set_header X-Forwarded-Host $host; # 保留原始域名
```

### 验证成功
```bash
curl -I https://go.superjiasu.top
# HTTP/1.1 200 OK ✅
```

---

**修复状态**: ✅ 已解决
**验证时间**: 2025-10-09 13:03 UTC
**负责人**: Claude Code Assistant
