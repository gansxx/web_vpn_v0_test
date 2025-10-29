# Stripe 支付集成总结与计划

## 📋 当前完成的 UI 更改（Phase 1-3）

### 🎯 目标
创建独立的 Stripe 支付测试环境，验证支付流程的基础功能，不影响现有产品逻辑。

### ✅ 已完成的工作

---

## 📦 一、依赖安装

### 新增依赖包
```json
{
  "@stripe/stripe-js": "8.1.0",
  "@stripe/react-stripe-js": "5.2.0"
}
```

### shadcn/ui 组件
```bash
# 新增组件
components/ui/tabs.tsx
```

---

## 🔧 二、配置文件更新

### 1. 环境变量 (`.env.local`)
```bash
# 新增
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51SCAMRBQeXEmR8EV...
```

### 2. 配置常量 (`lib/config.ts`)
```typescript
// 新增
export const STRIPE_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? "";
```

---

## 📁 三、新建文件清单

### 核心工具类（3个）

#### 1. `types/stripe.ts`
- TypeScript 类型定义
- 支付请求/响应接口
- 支付状态枚举

#### 2. `lib/stripe-utils.ts`
- Stripe 客户端初始化
- 金额格式化工具
- 支付状态文本转换
- 配置验证

#### 3. `lib/stripe-api.ts`
- `createPaymentIntent()` - 创建支付意图
- `getPaymentStatus()` - 查询订单状态
- 统一错误处理

---

### React 组件（3个）

#### 1. `components/stripe/stripe-provider.tsx`
**功能：**
- 包装 Stripe Elements Provider
- 配置支付表单样式主题
- 管理 Stripe 实例

**使用场景：**
```tsx
<StripeProvider clientSecret={clientSecret}>
  <PaymentForm />
</StripeProvider>
```

#### 2. `components/stripe/payment-form.tsx`
**功能：**
- 集成 Stripe CardElement
- 处理支付提交逻辑
- 显示加载和错误状态
- 内置测试卡号提示

**关键功能：**
- ✅ 信用卡输入（Stripe UI）
- ✅ 支付确认
- ✅ 错误处理
- ✅ 加载状态
- ✅ 成功/失败回调

#### 3. `components/stripe/payment-status.tsx`
**功能：**
- 实时查询订单状态
- 自动刷新（可配置间隔）
- 不同状态的图标和提示
- 支付成功/失败后的操作按钮

**支持的状态：**
- ✅ 支付成功 (succeeded)
- ⏳ 处理中 (processing)
- ❌ 支付失败 (payment_failed)
- 🚫 已取消 (canceled)
- ⏸️ 等待支付 (requires_payment_method)

---

### 测试页面（1个）

#### `app/stripe-test/page.tsx`
**功能：**
独立的三步骤支付测试环境

**流程：**
```
步骤1: 配置支付信息
  ↓
步骤2: 填写卡号完成支付
  ↓
步骤3: 查看支付结果
```

**特性：**
- ✅ 表单验证
- ✅ 实时金额显示
- ✅ 测试卡号快捷参考
- ✅ 环境信息展示
- ✅ 完整的错误处理
- ✅ 响应式设计

**访问地址：**
```
http://localhost:3000/stripe-test
```

---

## 🎨 四、UI/UX 特性

### 设计风格
- ✅ 使用 shadcn/ui 组件库
- ✅ Tailwind CSS 样式
- ✅ 响应式布局（移动端友好）
- ✅ 现代化卡片设计
- ✅ 清晰的状态反馈

### 用户体验
- ✅ 加载状态指示器
- ✅ 友好的错误提示
- ✅ 测试卡号提示
- ✅ 自动状态更新
- ✅ 一键重试功能

---

## 🔗 五、与后端的集成

### API 端点对接
```typescript
// 1. 创建支付意图
POST /stripe/create-payment-intent
{
  product_name: string,
  trade_num: number,
  amount: number,
  currency: string,
  email: string,
  phone?: string
}

// 2. 查询支付状态
GET /stripe/payment-status/{order_id}
```

### Webhook 流程
```
1. 用户完成支付 → Stripe 触发 webhook
2. Webhook 调用后端 /stripe/webhook
3. 后端更新数据库订单状态
4. 前端自动刷新显示最新状态
```

---

## 📊 当前架构图

```
┌─────────────────────────────────────────────┐
│          前端 (Next.js 15)                  │
├─────────────────────────────────────────────┤
│                                             │
│  🧪 测试页面 (/stripe-test)                │
│  ├─ 配置步骤                                │
│  ├─ 支付表单 (StripeProvider)              │
│  └─ 状态展示 (PaymentStatus)               │
│                                             │
│  📦 组件库                                  │
│  ├─ stripe-provider.tsx                    │
│  ├─ payment-form.tsx                       │
│  └─ payment-status.tsx                     │
│                                             │
│  🛠️ 工具库                                  │
│  ├─ stripe-utils.ts (Stripe 初始化)        │
│  ├─ stripe-api.ts (API 调用)               │
│  └─ types/stripe.ts (类型定义)             │
│                                             │
└─────────────────────────────────────────────┘
                    ↕️ API 调用
┌─────────────────────────────────────────────┐
│         后端 (FastAPI + Python)             │
├─────────────────────────────────────────────┤
│                                             │
│  🚀 API 路由 (routes/stripe_routes.py)     │
│  ├─ POST /create-payment-intent            │
│  ├─ POST /webhook                          │
│  └─ GET /payment-status/{order_id}         │
│                                             │
│  💳 支付服务 (payments/stripe_payment.py)  │
│  ├─ StripePaymentService                   │
│  └─ create_payment_session()               │
│                                             │
│  💾 数据库 (PostgreSQL + Supabase)         │
│  └─ order 表 + 相关函数                    │
│                                             │
└─────────────────────────────────────────────┘
                    ↕️ Webhook
┌─────────────────────────────────────────────┐
│             Stripe                          │
│  ├─ Payment Processing                     │
│  ├─ Webhook Events                         │
│  └─ Dashboard Monitoring                   │
└─────────────────────────────────────────────┘
```

---

## 🚀 日后集成计划

### Phase 4: 产品集成（1-2周）

#### 1. 更新套餐数据模型
**文件：** `lib/plans.ts`

**修改内容：**
```typescript
export type Plan = {
  id: string
  name: string
  priceDisplay: string
  description: string
  features: string[]

  // 新增字段
  amount?: number           // 金额（分）
  currency?: string         // 货币代码
  stripePriceId?: string    // Stripe Price ID (可选)
  isAvailable?: boolean     // 是否可购买

  // 现有字段
  badgeText?: string
  ctaText: string
  ctaDisabled?: boolean
  styles?: { ... }
}
```

**示例更新：**
```typescript
{
  id: "premium",
  name: "付费套餐",
  priceDisplay: "¥99/月",
  description: "更多高级功能",

  // 新增
  amount: 9900,          // 99.00 CNY
  currency: "cny",
  isAvailable: true,

  features: [...],
  badgeText: "推荐",    // 移除 "即将推出"
  ctaText: "立即购买",   // 修改为可点击
  ctaDisabled: false,   // 启用按钮
}
```

---

#### 2. 创建支付页面
**文件：** `app/payment/page.tsx`

**URL：** `/payment?plan=premium`

**功能：**
```tsx
export default function PaymentPage() {
  // 1. 从 URL 获取 plan 参数
  const searchParams = useSearchParams()
  const planId = searchParams.get('plan')

  // 2. 获取套餐信息
  const plan = PLANS.find(p => p.id === planId)

  // 3. 创建支付意图
  const [clientSecret, setClientSecret] = useState("")

  useEffect(() => {
    if (plan && plan.amount) {
      createPaymentIntent({
        product_name: plan.name,
        amount: plan.amount,
        currency: plan.currency || 'usd',
        // ...
      })
    }
  }, [plan])

  // 4. 渲染支付表单
  return (
    <div>
      <PlanSummary plan={plan} />
      {clientSecret && (
        <StripeProvider clientSecret={clientSecret}>
          <PaymentForm onSuccess={handleSuccess} />
        </StripeProvider>
      )}
    </div>
  )
}
```

**页面结构：**
```
┌─────────────────────────────────┐
│  支付页面                        │
├─────────────────────────────────┤
│                                 │
│  📦 套餐信息卡片                │
│  ├─ 套餐名称: 付费套餐          │
│  ├─ 价格: ¥99/月                │
│  └─ 功能列表                    │
│                                 │
│  💳 支付表单                    │
│  ├─ 邮箱 (自动填充当前用户)     │
│  ├─ 信用卡信息 (Stripe UI)      │
│  └─ [确认支付] 按钮             │
│                                 │
│  🔒 安全提示                    │
│  └─ "由 Stripe 提供安全保障"    │
│                                 │
└─────────────────────────────────┘
```

---

#### 3. 创建支付结果页面
**文件：** `app/payment/result/page.tsx`

**URL：** `/payment/result?order_id=xxx&status=xxx`

**功能：**
```tsx
export default function PaymentResultPage() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get('order_id')
  const status = searchParams.get('status')

  return (
    <div>
      {orderId && <PaymentStatus orderId={orderId} />}

      {status === 'succeeded' && (
        <div>
          <h2>🎉 支付成功！</h2>
          <p>您的订阅已激活</p>
          <Button href="/dashboard">前往控制台</Button>
        </div>
      )}
    </div>
  )
}
```

---

#### 4. 修改首页套餐卡片
**文件：** `app/page.tsx`

**当前：**
```tsx
<Button disabled={plan.ctaDisabled}>
  {plan.ctaText}
</Button>
```

**修改为：**
```tsx
<Button
  disabled={plan.ctaDisabled || !plan.isAvailable}
  onClick={() => {
    if (plan.id === 'free') {
      // 免费套餐：跳转到注册
      router.push('/register')
    } else if (plan.isAvailable) {
      // 付费套餐：跳转到支付页面
      router.push(`/payment?plan=${plan.id}`)
    }
  }}
>
  {plan.ctaText}
</Button>
```

---

#### 5. 修改 Dashboard
**文件：** `app/dashboard/page.tsx`

**新增功能：**

##### A. 显示当前套餐信息
```tsx
<Card>
  <CardHeader>
    <CardTitle>我的订阅</CardTitle>
  </CardHeader>
  <CardContent>
    <div className="space-y-2">
      <p>当前套餐: <Badge>免费套餐</Badge></p>
      <p>到期时间: 2025-02-20</p>
      <Button onClick={() => router.push('/payment?plan=premium')}>
        升级套餐
      </Button>
    </div>
  </CardContent>
</Card>
```

##### B. 订单历史查询
```tsx
<Card>
  <CardHeader>
    <CardTitle>订单历史</CardTitle>
  </CardHeader>
  <CardContent>
    <OrderHistory userId={currentUser.id} />
  </CardContent>
</Card>
```

##### C. 创建订单历史组件
**文件：** `components/dashboard/order-history.tsx`

```tsx
export function OrderHistory({ userId }: { userId: string }) {
  const [orders, setOrders] = useState([])

  useEffect(() => {
    // 调用后端 API 获取订单列表
    fetch(`${API_BASE}/orders?user_id=${userId}`)
      .then(res => res.json())
      .then(data => setOrders(data))
  }, [userId])

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>订单号</TableHead>
          <TableHead>产品</TableHead>
          <TableHead>金额</TableHead>
          <TableHead>状态</TableHead>
          <TableHead>时间</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.map(order => (
          <TableRow key={order.id}>
            <TableCell>{order.id.slice(0, 8)}</TableCell>
            <TableCell>{order.product_name}</TableCell>
            <TableCell>{formatAmount(order.amount, order.currency)}</TableCell>
            <TableCell>
              <Badge variant={getStatusVariant(order.status)}>
                {order.status}
              </Badge>
            </TableCell>
            <TableCell>{formatDate(order.created_at)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
```

---

### Phase 5: 后端增强（并行开发）

#### 1. 用户订单关联
**需要新增：**
- 在 `order` 表中添加 `user_id` 字段
- 创建 RPC 函数 `get_user_orders(user_id)`
- 创建 API 端点 `/orders?user_id=xxx`

#### 2. 订阅管理
**需要新增：**
- `subscription` 表（用户订阅记录）
- 订阅激活逻辑（支付成功后）
- 订阅到期检查
- 订阅续费功能

#### 3. Webhook 增强
**完善事件处理：**
```python
# routes/stripe_routes.py

@router.post("/webhook")
async def stripe_webhook(...):
    # 现有：payment_intent.succeeded

    # 新增：订阅相关事件
    elif event_type == "customer.subscription.created":
        await _handle_subscription_created(...)

    elif event_type == "customer.subscription.updated":
        await _handle_subscription_updated(...)

    elif event_type == "customer.subscription.deleted":
        await _handle_subscription_deleted(...)
```

---

### Phase 6: 用户体验优化（1周）

#### 1. 支付流程优化
- ✅ 添加支付前确认页面
- ✅ 支持优惠码输入
- ✅ 显示计算后的价格
- ✅ 添加支付进度指示器

#### 2. 邮件通知
- ✅ 支付成功邮件
- ✅ 订阅激活邮件
- ✅ 订阅到期提醒
- ✅ 支付失败通知

#### 3. 发票管理
- ✅ 自动生成发票
- ✅ 发票下载功能
- ✅ 发票历史查询

#### 4. 多语言支持
- ✅ 中文/英文切换
- ✅ 货币本地化显示
- ✅ 错误消息本地化

---

### Phase 7: 高级功能（可选）

#### 1. 订阅计划
**使用 Stripe Subscriptions：**
```typescript
// 创建订阅而非一次性支付
const subscription = await stripe.subscriptions.create({
  customer: customerId,
  items: [{ price: 'price_xxxxx' }],
  payment_behavior: 'default_incomplete',
  expand: ['latest_invoice.payment_intent'],
})
```

#### 2. 多支付方式
- ✅ 支付宝 (Alipay)
- ✅ 微信支付 (WeChat Pay)
- ✅ 银行转账

**需要修改：**
```typescript
// stripe-utils.ts
const options = {
  mode: 'payment',
  amount: amount,
  currency: currency,
  payment_method_types: ['card', 'alipay', 'wechat_pay'], // 多种支付方式
}
```

#### 3. 优惠券系统
**集成 Stripe Coupons：**
```typescript
const paymentIntent = await stripe.paymentIntents.create({
  amount: amount,
  currency: currency,
  metadata: {
    coupon_code: 'SUMMER2025', // 优惠码
  },
})
```

#### 4. 推荐奖励
- ✅ 生成推荐链接
- ✅ 推荐成功奖励
- ✅ 推荐历史追踪

---

## 📅 完整实施时间表

### 第 1 周：基础集成
- [x] Day 1-2: 完成独立测试页面（已完成）
- [ ] Day 3-4: 更新套餐数据模型
- [ ] Day 5-7: 创建支付页面和结果页面

### 第 2 周：产品集成
- [ ] Day 1-3: 修改首页和 Dashboard
- [ ] Day 4-5: 创建订单历史组件
- [ ] Day 6-7: 用户订单关联和测试

### 第 3 周：功能完善
- [ ] Day 1-3: Webhook 事件完善
- [ ] Day 4-5: 邮件通知系统
- [ ] Day 6-7: 综合测试和修复

### 第 4 周：上线准备
- [ ] Day 1-2: 生产环境配置
- [ ] Day 3-4: 性能优化
- [ ] Day 5: 小额真实支付测试
- [ ] Day 6-7: 正式上线和监控

---

## 🔐 安全性考虑

### 前端安全
- ✅ 只存储 Publishable Key（公开安全）
- ✅ 不处理敏感卡号数据（由 Stripe 处理）
- ✅ 使用 HTTPS（生产环境）
- ✅ 实现 CSRF 保护

### 后端安全
- ✅ Secret Key 存储在环境变量
- ✅ Webhook 签名验证
- ✅ 订单金额服务端验证
- ✅ 用户权限检查

### 数据安全
- ✅ 不存储完整卡号
- ✅ 加密敏感信息
- ✅ 定期备份数据
- ✅ 审计日志记录

---

## 📊 监控和分析

### 关键指标
- 支付成功率
- 平均支付时长
- 错误率和类型
- 用户转化率
- 退款率

### 监控工具
- Stripe Dashboard
- 后端日志（loguru）
- 数据库查询统计
- 前端错误追踪（可选：Sentry）

---

## 📚 相关文档

### 已创建文档
1. `/root/self_code/web_vpn_v0_test/docs/STRIPE_VALIDATION_CHECKLIST.md` - 验证清单
2. `/root/self_code/web_backend/docs/STRIPE_TESTING_GUIDE.md` - 测试指南
3. `/root/self_code/web_backend/payments/STRIPE_INTEGRATION.md` - 后端集成文档

### 推荐阅读
- [Stripe 官方文档](https://stripe.com/docs)
- [Stripe.js 参考](https://stripe.com/docs/js)
- [Next.js 文档](https://nextjs.org/docs)
- [shadcn/ui 组件库](https://ui.shadcn.com)

---

## 🎯 成功标准

### 测试环境
- [x] 独立测试页面正常运行
- [x] 所有测试卡号场景通过
- [x] Webhook 回调成功
- [x] 数据库状态正确

### 集成环境
- [ ] 从产品选择到支付完成流程顺畅
- [ ] Dashboard 正确显示订阅信息
- [ ] 订单历史准确记录
- [ ] 所有错误场景有友好提示

### 生产环境
- [ ] 真实支付成功
- [ ] 订阅自动激活
- [ ] 邮件通知发送
- [ ] 监控和告警正常

---

## 💡 下一步行动

### 立即可做
1. 访问 `http://localhost:3000/stripe-test` 测试当前功能
2. 使用测试卡号完成一次完整支付
3. 查看 Stripe Dashboard 和数据库记录

### 准备工作
1. 确定最终的套餐定价
2. 设计订阅激活后的用户权限
3. 准备邮件模板内容
4. 规划优惠活动策略

### 开发排期
1. 与团队确认集成优先级
2. 分配开发任务
3. 设定里程碑和 deadline
4. 安排代码审查和测试

---

**📝 文档版本**: v1.0
**📅 更新时间**: 2025-01-24
**👤 维护人**: Development Team
