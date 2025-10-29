# Turnstile 环境变量修复 - Next.js 构建时替换问题

**日期**: 2025-10-09
**类型**: Bug Fix
**影响**: Turnstile 人机验证组件、环境变量配置

## 📋 问题背景

### 问题描述
在 Vercel 部署环境中，设置 `NEXT_PUBLIC_DISABLE_TURNSTILE=true` 后：
- ✅ Chrome 浏览器正常：不加载 Turnstile 验证组件
- ❌ Edge 浏览器异常：仍然加载 Turnstile，向 `challenges.cloudflare.com` 发送请求

### 初始假设
最初怀疑是 localStorage 污染导致浏览器行为不一致。

### 排查过程

#### 第一步：检查 localStorage
```javascript
// Edge 浏览器控制台
localStorage.getItem("dev_mode_disable_turnstile")
// 返回：null
```
**结论**：排除 localStorage 问题

#### 第二步：检查环境变量
```javascript
// Edge 浏览器控制台
console.log(process.env.NEXT_PUBLIC_DISABLE_TURNSTILE);
// 错误：Uncaught ReferenceError: process is not defined
```
**结论**：发现根本问题 - `process` 对象在浏览器运行时不存在

## 🎯 问题根因

### Next.js 环境变量机制

Next.js 在**构建时**会将 `process.env.NEXT_PUBLIC_*` 替换为字面值：

```typescript
// 源代码
const value = process.env.NEXT_PUBLIC_DISABLE_TURNSTILE;

// 构建后
const value = "true";  // 直接替换为字面值
```

### 错误的实现方式

```typescript
// ❌ 错误：动态访问无法在构建时被识别
export function getDevModeSetting(key: string, envDefault?: string): boolean {
  return process.env[`NEXT_PUBLIC_${key}`] === "true" || envDefault === "true";
}
```

**问题分析**：
1. **构建时**：Next.js 无法识别 `process.env[动态key]` 这种动态访问
2. **构建后**：代码中仍保留 `process.env[...]` 表达式
3. **运行时**：浏览器中没有 `process` 对象 → `ReferenceError` 或 `undefined`
4. **结果**：函数始终返回 `false`，Turnstile 被错误地启用

### 为什么 Chrome 可能正常？

可能的原因：
- 浏览器缓存差异
- 不同的错误处理行为
- 或者 Chrome 也有问题，但没有被注意到

## 💡 解决方案

### 核心思路
使用**静态映射表**，让 Next.js 能够识别并在构建时替换每个静态的环境变量访问。

### 实现代码

```typescript
// lib/config.ts

// Static environment variable mapping - enables Next.js build-time replacement
// Next.js can only replace static process.env accesses, not dynamic ones
const ENV_SETTINGS = {
  DISABLE_TURNSTILE: process.env.NEXT_PUBLIC_DISABLE_TURNSTILE === "true",
  DISABLE_AUTH_MIDDLEWARE: process.env.NEXT_PUBLIC_DISABLE_AUTH_MIDDLEWARE === "true",
} as const;

// Developer mode settings using static mapping
export function getDevModeSetting(key: string, envDefault?: string): boolean {
  // Use static mapping instead of dynamic process.env access
  const setting = ENV_SETTINGS[key as keyof typeof ENV_SETTINGS];

  if (setting !== undefined) {
    return setting;
  }

  return envDefault === "true";
}
```

### 工作原理

#### 构建时（Next.js 静态替换）
```typescript
// 源代码
const ENV_SETTINGS = {
  DISABLE_TURNSTILE: process.env.NEXT_PUBLIC_DISABLE_TURNSTILE === "true",
  //                  ↓ Next.js 识别并替换
};

// 构建后（假设环境变量为 "true"）
const ENV_SETTINGS = {
  DISABLE_TURNSTILE: "true" === "true",  // → true
};

// 进一步优化后
const ENV_SETTINGS = {
  DISABLE_TURNSTILE: true,  // 直接是布尔值
};
```

#### 运行时（浏览器执行）
```typescript
// 构建后的代码中完全没有 process 引用
const ENV_SETTINGS = {
  DISABLE_TURNSTILE: true,  // 已经是字面量
  DISABLE_AUTH_MIDDLEWARE: false,
};

// 函数直接读取编译后的常量
export function getDevModeSetting(key, envDefault) {
  const setting = ENV_SETTINGS[key];  // 读取静态值
  if (setting !== undefined) {
    return setting;  // 返回 true 或 false
  }
  return envDefault === "true";
}
```

## 📁 修改文件

### lib/config.ts
**修改内容**：
1. 添加 `ENV_SETTINGS` 静态映射表
2. 修改 `getDevModeSetting()` 函数使用映射表

**代码行数**：
- 添加：11 行（映射表 + 注释）
- 修改：7 行（函数逻辑）

## ✅ 验证方法

### 本地验证
```bash
# 1. 设置环境变量
export NEXT_PUBLIC_DISABLE_TURNSTILE=true

# 2. 构建项目
npm run build

# 3. 启动生产服务器
npm run start

# 4. 浏览器访问并检查
# - 不应有 challenges.cloudflare.com 请求
# - 不应有 "process is not defined" 错误
```

### Vercel 部署验证
1. 确保 Vercel 环境变量已设置：`NEXT_PUBLIC_DISABLE_TURNSTILE=true`
2. 重新部署触发构建
3. 在多个浏览器（Chrome、Edge、Firefox）中测试
4. 检查 Network 面板：不应有 Turnstile 相关请求

### 浏览器控制台验证
部署后在浏览器控制台执行：
```javascript
// 不会报错（因为构建后代码中没有 process 引用）
// 页面应该不会加载 Turnstile 组件
console.log("验证完成 - 检查 Network 面板确认无 Turnstile 请求");
```

## 🎉 修复效果

### Before（修复前）
- ❌ 动态环境变量访问无法被 Next.js 识别
- ❌ 浏览器运行时报错：`process is not defined`
- ❌ Turnstile 错误地被启用
- ❌ 不同浏览器行为可能不一致

### After（修复后）
- ✅ 静态映射表在构建时正确替换
- ✅ 浏览器运行时无 `process` 引用
- ✅ Turnstile 根据环境变量正确启用/禁用
- ✅ 所有浏览器行为完全一致
- ✅ 代码体积更小（只有字面量）
- ✅ 运行时性能更好（直接读取常量）

## 📚 技术知识点

### Next.js 环境变量替换规则

| 写法 | 构建时替换 | 运行时可用 |
|------|-----------|-----------|
| `process.env.NEXT_PUBLIC_XXX` | ✅ 可识别 | ✅ 替换为字面值 |
| `process.env["NEXT_PUBLIC_XXX"]` | ❌ 无法识别 | ❌ undefined/报错 |
| `process.env[\`NEXT_PUBLIC_${key}\`]` | ❌ 无法识别 | ❌ undefined/报错 |
| `{ XXX: process.env.NEXT_PUBLIC_XXX }` | ✅ 可识别 | ✅ 替换为字面值 |

### 最佳实践

#### ✅ 推荐方式
```typescript
// 1. 直接访问（最简单）
const value = process.env.NEXT_PUBLIC_XXX;

// 2. 静态映射表（适合多个配置）
const CONFIG = {
  setting1: process.env.NEXT_PUBLIC_SETTING1,
  setting2: process.env.NEXT_PUBLIC_SETTING2,
} as const;

// 3. 类型安全的配置对象
export const appConfig = {
  apiBase: process.env.NEXT_PUBLIC_API_BASE ?? "https://api.example.com",
  features: {
    turnstile: process.env.NEXT_PUBLIC_DISABLE_TURNSTILE !== "true",
  },
} as const;
```

#### ❌ 避免方式
```typescript
// 1. 动态键访问
process.env[`NEXT_PUBLIC_${key}`]  // 无法被替换

// 2. 运行时计算
const prefix = "NEXT_PUBLIC_";
process.env[prefix + "XXX"]  // 无法被替换

// 3. 条件访问
if (someCondition) {
  process.env.NEXT_PUBLIC_XXX  // 可能无法优化
}
```

## 🔄 相关问题

### 问题 1：为什么不直接使用环境变量？
**答**：在需要通过函数参数动态获取不同配置时，静态映射表提供了类型安全和构建时优化。

### 问题 2：如何添加新的环境变量配置？
**答**：在 `ENV_SETTINGS` 中添加新行：
```typescript
const ENV_SETTINGS = {
  DISABLE_TURNSTILE: process.env.NEXT_PUBLIC_DISABLE_TURNSTILE === "true",
  DISABLE_AUTH_MIDDLEWARE: process.env.NEXT_PUBLIC_DISABLE_AUTH_MIDDLEWARE === "true",
  NEW_FEATURE: process.env.NEXT_PUBLIC_NEW_FEATURE === "true",  // 新增
} as const;
```

### 问题 3：localStorage 功能是否还需要？
**答**：本次修复中已完全移除 localStorage 逻辑，配置完全由环境变量控制。优点是行为一致，缺点是失去运行时动态修改能力。

## 📝 经验总结

### 核心教训
1. **Next.js 环境变量有严格的使用规则**：只能静态访问，不能动态拼接
2. **构建时优化需要代码配合**：要让工具能够识别和处理
3. **浏览器环境与 Node.js 环境不同**：不能假设 `process` 对象存在
4. **不同浏览器可能暴露不同问题**：全面测试很重要

### 最佳实践
1. ✅ 使用静态映射表而非动态访问
2. ✅ 在多个浏览器中测试环境变量功能
3. ✅ 构建后检查生成的代码是否符合预期
4. ✅ 使用 TypeScript 的 `as const` 提供类型安全

### 调试技巧
1. 检查构建后的代码（`.next` 目录）
2. 浏览器控制台测试 `process` 对象是否存在
3. 使用 Network 面板验证实际行为
4. 对比不同浏览器的行为差异

## 🔗 相关资源

- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
- [Next.js Build-Time Configuration](https://nextjs.org/docs/api-reference/next.config.js/environment-variables)
- 项目文件：`lib/config.ts`
- 使用组件：`components/Turnstile.tsx`

## 📌 后续改进建议

1. **配置中心化**：考虑创建统一的配置管理模块
2. **类型安全**：为所有环境变量提供 TypeScript 类型定义
3. **文档完善**：在代码中添加更详细的注释说明
4. **测试覆盖**：添加针对环境变量配置的单元测试
5. **部署检查**：在 CI/CD 中添加环境变量验证步骤
