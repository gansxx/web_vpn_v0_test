# Stripe 支付验证清单

## ✅ 测试模式验证（推荐）

### 1. 支付成功流程
- [ ] 使用 4242 4242 4242 4242 成功支付
- [ ] Stripe Dashboard 显示 Payment Intent 记录
- [ ] 后端日志显示 "payment_intent.succeeded"
- [ ] 数据库订单状态更新为 "已支付"
- [ ] 前端显示支付成功页面
- [ ] Webhook 返回 200 状态码

### 2. 支付失败场景
- [ ] 使用 4000 0000 0000 0002 测试卡被拒绝
- [ ] 前端显示友好的错误提示
- [ ] 订单状态保持 "待支付" 或更新为 "失败"
- [ ] 用户可以重新尝试支付

### 3. 3D Secure 验证
- [ ] 使用 4000 0027 6000 3184 触发 3D Secure
- [ ] 正确处理额外验证步骤
- [ ] 验证完成后支付成功

### 4. Webhook 完整性
- [ ] Stripe CLI 正确转发 webhook
- [ ] 后端正确验证 webhook 签名
- [ ] 各种支付事件都被正确处理
- [ ] Webhook 失败时有重试机制

### 5. 数据库一致性
```sql
-- 检查订单记录
SELECT
  id,
  product_name,
  amount,
  status,
  stripe_payment_intent_id,
  stripe_payment_status,
  created_at
FROM "order"
WHERE payment_provider = 'stripe'
ORDER BY created_at DESC
LIMIT 10;

-- 检查订单超时跟踪
SELECT
  o.id,
  o.status,
  t.check_at,
  t.processed
FROM "order" o
JOIN order_timeout_tracker t ON o.id = t.order_id
WHERE o.payment_provider = 'stripe'
ORDER BY o.created_at DESC
LIMIT 10;
```

### 6. 前端体验
- [ ] 支付表单样式美观
- [ ] 加载状态显示正确
- [ ] 错误提示清晰友好
- [ ] 移动端适配良好
- [ ] 支付流程流畅无卡顿

---

## 💰 生产模式真实支付（可选）

### 前置条件
- [ ] 已完成所有测试模式验证
- [ ] 获取 Stripe 生产模式密钥
- [ ] 后端部署到公网（有 HTTPS）
- [ ] 配置生产 Webhook 端点

### 小额支付验证
- [ ] 配置生产环境变量
- [ ] 使用真实银行卡支付 $0.50
- [ ] 验证资金真实扣款
- [ ] 验证生产 Webhook 调用
- [ ] 检查 Stripe Dashboard (Live mode)
- [ ] 测试退款功能

### 生产环境配置
```bash
# 后端 .env
STRIPE_SECRET_KEY=sk_live_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx  # 从 Stripe Dashboard 获取

# 前端 .env.local
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxxxx

# Webhook 端点配置
# Stripe Dashboard → Webhooks → Add endpoint
# URL: https://api.yourdomain.com/stripe/webhook
# Events: payment_intent.succeeded, payment_intent.payment_failed, etc.
```

---

## 🔍 验证工具

### Stripe Dashboard
- **测试模式**: https://dashboard.stripe.com/test/payments
- **生产模式**: https://dashboard.stripe.com/payments

### 数据库查询
```bash
# 查看最近订单
source .env
psql "postgresql://postgres:$POSTGRES_PASSWORD@localhost:5438/postgres" \
  -c "SELECT * FROM \"order\" WHERE payment_provider = 'stripe' ORDER BY created_at DESC LIMIT 5;"
```

### Webhook 日志
```bash
# Stripe CLI 实时监控
stripe listen --forward-to http://localhost:8001/stripe/webhook --print-json

# 触发测试事件
stripe trigger payment_intent.succeeded
```

### API 测试
```bash
# 创建支付意图
curl -X POST http://localhost:8001/stripe/create-payment-intent \
  -H "Content-Type: application/json" \
  -d '{
    "product_name": "验证测试",
    "trade_num": 1,
    "amount": 50,
    "currency": "usd",
    "email": "validation@test.com",
    "phone": "+1234567890"
  }' | jq .

# 查询支付状态
curl http://localhost:8001/stripe/payment-status/{order_id} | jq .
```

---

## 🎯 推荐验证流程

### 阶段 1: 本地测试（1-2小时）
1. 启动所有服务（后端 + Stripe CLI + 前端）
2. 访问 http://localhost:3000/stripe-test
3. 完成所有测试模式验证清单
4. 确保所有场景都能正确处理

### 阶段 2: 集成验证（可选）
1. 将支付流程集成到现有产品
2. 测试从产品选择到支付完成的完整流程
3. 验证用户权限和订阅激活

### 阶段 3: 生产预演（部署前）
1. 部署到测试环境（有 HTTPS）
2. 配置测试环境 Webhook
3. 进行端到端测试
4. 压力测试（可选）

### 阶段 4: 生产验证（可选）
1. 配置生产密钥和 Webhook
2. 小额真实支付测试（$0.50）
3. 验证完整后正式上线

---

## ⚠️ 重要提醒

1. **测试模式已经足够**：Stripe 的测试模式完全模拟真实支付流程，包括 webhook、数据库更新等
2. **生产测试需谨慎**：真实支付会产生 Stripe 手续费（约 2.9% + $0.30），即使是小额支付
3. **先完成测试模式**：确保所有功能在测试模式下工作正常后再考虑生产测试
4. **Webhook 签名验证**：测试环境和生产环境的 webhook secret 不同，需要分别配置
5. **退款手续费**：Stripe 退款不退还手续费

---

## 📊 成功标准

### 测试模式成功标准
- ✅ 所有测试用例通过
- ✅ Webhook 100% 成功率
- ✅ 数据库状态一致
- ✅ 无控制台错误
- ✅ 前端体验流畅

### 生产就绪标准
- ✅ 测试模式所有验证通过
- ✅ 代码经过 Code Review
- ✅ 错误处理完善
- ✅ 日志记录完整
- ✅ 监控告警配置
- ✅ 备份和回滚方案

---

## 🔗 相关文档

- [Stripe 测试指南](/root/self_code/web_backend/docs/STRIPE_TESTING_GUIDE.md)
- [Stripe 集成文档](/root/self_code/web_backend/payments/STRIPE_INTEGRATION.md)
- [后端 API 文档](/root/self_code/web_backend/routes/stripe_routes.py)
