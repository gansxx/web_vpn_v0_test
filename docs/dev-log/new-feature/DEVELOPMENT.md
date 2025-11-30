# 开发日志

## 2025-01-26

### 新增功能

#### 1. 工单系统
- **新增工单表单组件** (`components/ticket-form.tsx`)
  - 支持标题、优先级（低/中/高）、分类（技术支持/账户问题/套餐相关/连接问题/其他）、问题描述字段
  - 向后端API `${API_BASE}/support/tickets` 发送POST请求提交工单
  - 包含完整的表单验证和错误处理机制

- **新增UI组件支持**
  - `components/ui/textarea.tsx` - 多行文本输入框组件
  - `components/ui/select.tsx` - 下拉选择器组件（基于Radix UI）

- **集成工单列表功能到Dashboard**
  - 从后端API `${API_BASE}/support/tickets` 获取工单数据
  - 支持刷新操作和实时状态更新
  - 显示工单号、标题、分类、优先级、状态、创建时间
  - 支持列表和提交表单之间的无缝切换

#### 2. 一键订阅功能
- **主页横幅优化**：将"优惠购买"按钮改为"一键订阅"按钮，点击直接跳转到套餐页面
- **浮动操作按钮组**：
  - 蓝色"一键订阅"按钮（闪电图标）
  - 绿色"提交工单"按钮（对话图标）
  - 支持hover显示文字标签

#### 3. 开发者模式系统
- **环境配置管理**
  - 新增 `.env.local.example` 配置文件模板
  - 扩展 `lib/config.ts` 支持开发者模式配置
  - 支持环境变量和localStorage双重配置方式

- **Turnstile验证控制**
  - 修改 `components/Turnstile.tsx` 支持动态禁用
  - 禁用时显示橙色警告提示，自动返回模拟token
  - 支持实时切换，无需重启服务

- **路由保护控制**
  - 修改 `middleware.ts` 支持认证中间件bypas
  - 可禁用dashboard的登录验证要求
  - 通过环境变量 `NEXT_PUBLIC_DISABLE_AUTH_MIDDLEWARE` 控制

- **可视化控制面板**
  - 新增 `components/developer-mode-panel.tsx`
  - 橙色主题突出开发环境标识
  - 实时显示功能状态
  - 支持一键重置所有开发者设置

### 技术改进

#### API集成
- 所有新API端点使用统一的 `credentials: "include"` 认证方式
- 完善的错误处理和用户反馈机制
- 支持动态刷新和状态同步

#### UI/UX优化
- 保持现有设计系统一致性
- 响应式设计支持所有屏幕尺寸
- 清晰的状态指示和用户反馈

#### 开发体验
- 开发者模式提供便捷的调试选项
- 环境变量和localStorage双重配置灵活性
- 明确的警告和安全提示

### 文件变更清单

**新增文件：**
- `components/ticket-form.tsx` - 工单提交表单组件
- `components/ui/textarea.tsx` - 多行文本输入组件
- `components/ui/select.tsx` - 下拉选择器组件
- `components/developer-mode-panel.tsx` - 开发者模式控制面板
- `.env.local.example` - 环境变量配置模板

**修改文件：**
- `app/dashboard/page.tsx` - 集成工单系统、一键订阅和开发者模式
- `components/Turnstile.tsx` - 添加开发者模式禁用支持
- `middleware.ts` - 添加认证bypas功能
- `lib/config.ts` - 扩展开发者模式配置管理

### API端点

**工单系统：**
- `GET ${API_BASE}/support/tickets` - 获取用户工单列表
- `POST ${API_BASE}/support/tickets` - 提交新工单

### 安全考虑

- 开发者模式仅在开发环境或明确启用时可用
- 所有开发者功能都有明显的视觉警告
- localStorage设置不会影响生产环境安全性
- 中间件bypas功能有清晰的日志记录

### 下一步计划

- [ ] 添加工单详情查看功能
- [ ] 实现工单状态实时更新
- [ ] 添加管理员工单管理界面
- [ ] 完善一键订阅的支付集成
- [ ] 添加更多开发者调试工具