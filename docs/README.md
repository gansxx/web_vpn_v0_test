# 项目文档索引

本目录包含 VPN Web 应用的所有技术文档和开发记录。

---

## 📚 部署文档

### Docker 部署相关

- **[Docker 部署快速指南](./DEPLOYMENT_QUICK_START.md)**
  适用于快速部署到生产环境，包含自动化和手动部署两种方式

- **[GitHub Secrets 配置指南](./GITHUB_SECRETS_SETUP.md)**
  详细的 GitHub Actions 密钥配置说明，包含 SSH 密钥生成和故障排查

- **[Docker 完整部署文档](../README.docker.md)**
  Docker 多容器架构完整文档，包含架构说明、配置详解和运维指南

### 故障排查

- **[Docker 部署故障修复记录 (2025-10-03)](./DOCKER_DEPLOYMENT_BUGFIX_2025-10-03.md)**
  Nginx 容器重启、SSL 证书配置错误的完整排查和修复过程

---

## 🛠️ 开发文档

- **[开发指南](./DEVELOPMENT.md)**
  本地开发环境搭建、开发工作流程和最佳实践

---

## 📝 维护记录

### 功能开发与重构

- **[Markdown 渲染器修复记录 (2025-09-28)](./fix-markdown-renderer-2025-09-28.md)**
  修复 Markdown 图片渲染问题，优化组件加载和错误处理

- **[Dashboard 重构记录 (2025-09-27)](./refactoring-dashboard-2025-09-27.md)**
  用户仪表板重构，改进组件结构和数据处理逻辑

---

## 🗂️ 文档组织

```
docs/
├── README.md                                    # 本文件 - 文档索引
│
├── 部署相关/
│   ├── DEPLOYMENT_QUICK_START.md               # 快速部署指南
│   ├── GITHUB_SECRETS_SETUP.md                 # GitHub Secrets 配置
│   └── DOCKER_DEPLOYMENT_BUGFIX_2025-10-03.md  # 部署故障修复记录
│
├── 开发相关/
│   └── DEVELOPMENT.md                           # 开发指南
│
└── 维护记录/
    ├── fix-markdown-renderer-2025-09-28.md     # Markdown 渲染器修复
    └── refactoring-dashboard-2025-09-27.md     # Dashboard 重构
```

---

## 📌 文档约定

### 命名规则

1. **部署文档**: 使用大写命名，如 `DEPLOYMENT_QUICK_START.md`
2. **开发文档**: 使用大写命名，如 `DEVELOPMENT.md`
3. **维护记录**: 使用小写 + 日期，如 `fix-markdown-renderer-2025-09-28.md`
4. **故障修复**: 使用大写 + 日期，如 `DOCKER_DEPLOYMENT_BUGFIX_2025-10-03.md`

### 文档结构

每个文档应包含：
- **标题**: 清晰描述文档主题
- **日期**: 创建或最后更新日期
- **摘要**: 简短说明文档内容
- **详细内容**: 分段说明，使用标题、列表、代码块等格式
- **相关文档**: 链接到相关文档

### Markdown 格式

- 使用 GitHub Flavored Markdown (GFM)
- 代码块指定语言高亮
- 使用表格展示对比信息
- 使用 emoji 增强可读性（适度使用）

---

## 🔄 文档维护

### 新增文档

在 `docs/` 目录创建新文档后，请更新本 README.md 索引。

### 更新文档

修改现有文档时，请在文档顶部更新"最后更新"日期。

### 归档文档

过时或不再相关的文档移至 `docs/archive/` 目录（如需创建）。

---

## 📞 联系方式

如有文档相关问题或建议，请创建 GitHub Issue。

**最后更新**: 2025-10-03
