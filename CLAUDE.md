# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a VPN service web application called "Z加速" (Z-Acceleration) built with Next.js 15 and React 19. The application provides a marketing landing page and a user dashboard for managing VPN subscriptions, with authentication middleware protecting dashboard routes.

## Available Commands

- `npm run dev` - Start development server
- `npm run build` - Build the application
- `npm run lint` - Run ESLint
- `npm run start` - Start production server

## Technology Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: Custom components using Radix UI primitives and shadcn/ui patterns
- **Forms**: React Hook Form with Zod validation
- **Icons**: Lucide React
- **Authentication**: Cookie-based session management

## Project Structure

### Key Directories
- `app/` - Next.js App Router pages
- `components/` - Reusable UI components
- `lib/` - Utility functions and configuration
- `public/` - Static assets

### Page Routes
- `/` - Marketing landing page (public)
- `/signin` - Sign-in page (public)
- `/register` - Registration page (public)
- `/dashboard` - User dashboard (protected by middleware)
- `/recall` - Password reset page (public)

### Key Configuration Files
- `middleware.ts` - Route protection logic
- `lib/config.ts` - API base URL configuration
- `lib/plans.ts` - Subscription plan definitions
- `lib/utils.ts` - Shared utility functions

## Architecture

### Authentication Flow
- Uses cookie-based authentication with `access_token`
- Middleware protects `/dashboard/*` routes
- Redirects to `/signin` for unauthenticated users
- Public paths: `/`, `/signin`, `/register`, `/recall`, `/api/*`, `/_next/*`

### API Integration
- Backend API base URL configurable via `NEXT_PUBLIC_API_BASE` environment variable
- Uses `credentials: "include"` for cookie-based sessions
- User management endpoints: `/user/products`, `/user/orders`, `/user/free-plan/purchase`

### UI Components
- Built with Tailwind CSS and custom component library
- Uses Radix UI primitives for accessibility
- Follows shadcn/ui patterns for consistent styling
- Theme support with dark/light modes

### State Management
- Client-side React state (useState, useEffect)
- No global state management library
- Server components where possible

### Data Models
- **Plans**: Defined in `lib/plans.ts` with type-safe plan configurations
- **User Products**: `{product_name, subscription_url, email, phone, buy_time, end_time}`
- **Orders**: Flexible mapping from various backend fields to consistent display format

## Development Notes

### Environment Variables
- `NEXT_PUBLIC_API_BASE` - Backend API URL (defaults to "https://selfgo.asia/api")

### Styling Conventions
- Use Tailwind utility classes
- Component styling follows established patterns in `/components/ui/`
- Responsive design with mobile-first approach
- Dark mode support via CSS variables

### Code Patterns
- Functional components with TypeScript
- Custom hooks for data fetching
- Error boundaries and loading states
- Server components for static content
- Client components for interactivity

### Key Features
- Multi-platform VPN service marketing site
- User dashboard with subscription management
- Order history tracking
- Real-time product status updates
- Responsive design across all screen sizes
- Chinese language interface with "Z加速" branding

## Documentation Management

### Adding New Documentation

To add a new help document to the documentation system, follow these steps:

#### Step 1: Create the Markdown File
Create your document in `/public/doc/` directory:

```bash
# Example: /public/doc/your_document.md
```

**Document Format Guidelines:**
- Use Markdown format with Chinese content
- Include colored headers: `# <font color="#1f497d">标题</font>`
- Use emoji for visual appeal: ✨ ⚙️ ➡️ ⚠️ 💡 etc.
- Add warning boxes: `> ⚠️ **重要提示**: 内容`
- Structure with clear sections using `##` headings
- Include step-by-step instructions where applicable

**Example Structure:**
```markdown
# <font color="#1f497d">文档标题</font>

> ⚠️ **重要提示**: 关键信息

## 📱 问题说明
[说明内容]

## ✅ 解决方案
### 步骤 1
### 步骤 2

## 💡 注意事项

## ❓ 常见问题
```

#### Step 2: Register in documents.ts
Add your document to `/lib/documents.ts`:

```typescript
{
  id: "unique-document-id",
  title: "文档显示标题",
  description: "简短的文档描述",
  category: "使用教程",
  filename: "your_document.md",
  icon: "🍎",  // Choose appropriate emoji
  lastUpdated: "2024-12-15"
}
```

**Document Metadata Fields:**
- `id`: Unique identifier (kebab-case)
- `title`: Display title shown in UI
- `description`: Brief description for search/preview
- `category`: Category name (e.g., "使用教程", "故障排除")
- `filename`: Markdown filename in `/public/doc/`
- `icon`: Emoji icon for visual identification
- `lastUpdated`: Last update date (YYYY-MM-DD)

**Adding as Main Document:**
```typescript
export const documents: DocumentMeta[] = [
  {
    id: "your-category",
    title: "分类标题",
    description: "分类描述",
    category: "分类名称",
    filename: "main_document.md",  // Optional if has subDocuments
    icon: "📚",
    lastUpdated: "2024-12-15",
    subDocuments: []  // Optional
  }
]
```

**Adding as Sub-Document:**
```typescript
{
  id: "tutorial",
  title: "使用教程",
  // ...
  subDocuments: [
    // ... existing documents
    {
      id: "your-subdoc-id",
      title: "子文档标题",
      description: "子文档描述",
      category: "使用教程",
      filename: "your_document.md",
      icon: "🍎",
      lastUpdated: "2024-12-15"
    }
  ]
}
```

#### Step 3: Verify Integration
```bash
# Check TypeScript compilation
npx tsc --noEmit lib/documents.ts

# Test in development
npm run dev
```

#### Complete Example: iOS Region Document

**File:** `/public/doc/ios_appstore_region.md`
```markdown
# <font color="#1f497d">iOS用户重要提示</font>

> ⚠️ **重要**: iOS应用**不支持大陆Apple ID**下载

## 📱 问题说明
[Content...]

## ✅ 解决方案
[Content...]
```

**Registration:** `/lib/documents.ts`
```typescript
{
  id: "tutorial-ios-region",
  title: "iOS用户重要提示",
  description: "iOS应用下载需要使用美区Apple ID的说明和操作指南",
  category: "使用教程",
  filename: "ios_appstore_region.md",
  icon: "🍎",
  lastUpdated: "2024-12-15"
}
```

### Document Categories
Current categories in use:
- **使用教程** - Client setup, configuration guides
- **故障排除** - Troubleshooting and problem resolution
- **常见问题** - FAQ and general questions

### Best Practices
- Use clear, concise Chinese language
- Include visual aids (emoji, colored text)
- Provide step-by-step instructions
- Add common questions section when applicable
- Test document rendering after adding
- Keep descriptions under 100 characters
- Use consistent icon themes within categories