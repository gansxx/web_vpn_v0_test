# Google Analytics 追踪设置指南

## 最小可行性 Demo - 已实现功能

### ✅ 已实现的功能

1. **基础追踪工具** (`lib/analytics.ts`)
   - 外部链接点击追踪
   - 页面浏览追踪
   - 通用事件追踪
   - 开发环境控制台日志

2. **"发现世界"页面追踪** (`app/blog/page.tsx`)
   - 所有外部链接自动追踪
   - 记录：分类名称、链接名称、URL
   - 每次点击都会在控制台输出日志

3. **GA4 集成** (`app/layout.tsx`)
   - 支持 Google Analytics 4
   - 支持 Google Ads（已有）
   - 开发环境 debug 模式

## 🚀 快速开始

### 步骤 1：获取 Google Analytics ID

1. 访问 [Google Analytics](https://analytics.google.com/)
2. 创建账号和资源（如果还没有）
3. 设置数据流（选择"网站"）
4. 复制 **衡量 ID**（格式：`G-XXXXXXXXXX`）

### 步骤 2：配置环境变量

在 `.env.local` 文件中添加：

```bash
# Google Analytics 4
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

**注意**：如果文件不存在，复制 `.env.example` 并重命名为 `.env.local`

### 步骤 3：重启开发服务器

```bash
npm run dev
```

### 步骤 4：测试追踪

1. 访问 `http://localhost:3001/blog`（发现世界页面）
2. 打开浏览器控制台（F12）
3. 点击任意外部链接
4. 查看控制台输出：

```
📊 Analytics Event: {
  event: "link_click",
  category: "AI 工具",
  linkName: "ChatGPT",
  linkUrl: "https://chat.openai.com/"
}
```

## 📊 查看数据

### 实时报告（测试时使用）

1. 登录 [Google Analytics](https://analytics.google.com/)
2. 选择您的资源
3. 点击左侧菜单：**报告** → **实时**
4. 打开"发现世界"页面并点击链接
5. 几秒后在实时报告中看到事件

### 自定义报告（配置后使用）

1. 进入 **探索** 菜单
2. 创建新的探索报告
3. 添加维度：
   - `event_category`（分类名称）
   - `event_label`（链接名称）
4. 添加指标：
   - `事件计数`
5. 保存报告

## 🔍 追踪的数据

每次用户点击"发现世界"页面的链接时，会追踪：

| 字段 | 说明 | 示例 |
|------|------|------|
| `event_category` | 分类名称 | "AI 工具" |
| `event_label` | 链接名称 | "ChatGPT" |
| `link_url` | 目标 URL | "https://chat.openai.com/" |
| `page_section` | 页面区域 | "discover_world" |

## 🛠️ 开发模式

**无需 GA4 ID 也能测试**！

- 没有配置 `NEXT_PUBLIC_GA_MEASUREMENT_ID` 时
- 所有事件会输出到浏览器控制台
- 方便本地开发和调试

控制台输出示例：
```
📊 [Dev Mode] Link click tracked: {
  category: "YouTube 博主推荐",
  linkName: "MrBeast",
  linkUrl: "https://www.youtube.com/@MrBeast"
}
```

## 📈 后续扩展（未实现）

如需更高级功能，可以扩展：

1. **转化漏斗追踪**
   - "发现世界" → 点击链接 → 注册
2. **A/B 测试**
   - 不同分类顺序的效果对比
3. **用户行为分析**
   - 热力图、滚动深度
4. **自定义维度**
   - 用户来源、设备类型

## 🔒 隐私合规

当前实现：
- ✅ 仅追踪匿名行为数据
- ✅ 不收集个人身份信息
- ⚠️ 建议添加 Cookie 同意横幅（未实现）

## 🐛 故障排查

### 控制台没有看到追踪日志

1. 检查浏览器控制台（F12）
2. 确认没有 JavaScript 错误
3. 确认点击的是外部链接（有 ExternalLink 图标）

### GA4 没有收到数据

1. 确认 `.env.local` 中的 ID 正确
2. 确认服务器已重启
3. 等待 5-10 分钟（GA4 有延迟）
4. 检查实时报告而非标准报告

### TypeScript 错误

如果看到 `window.gtag` 类型错误：
- 已在 `lib/analytics.ts` 中声明类型
- 重启 TypeScript 服务器

## 📝 总结

这是一个**最小可行性 Demo**，包含：
- ✅ 基础追踪功能
- ✅ 开发环境友好
- ✅ 易于测试和验证
- ✅ 可扩展架构

适合用于：
- 验证追踪功能是否工作
- 了解用户最感兴趣的内容
- 为后续优化提供数据支持
