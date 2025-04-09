# OneDrive 文件查看器

一个使用 Next.js、Vue 3 和 Tailwind CSS 构建的现代化 OneDrive 文件浏览和预览应用。

## 特性

- 💠 列表/网格布局切换
- 📄 Office 文档预览
- 🎥 视频和音频播放器
- 🔎 原生搜索功能
- 📝 Markdown 预览
- 📑 分页加载
- 🔒 受保护文件夹支持
- ⏬ 多文件下载

## 技术栈

- **Next.js** - React 框架，提供服务器端渲染和API路由
- **Vue 3** - 渐进式 JavaScript 框架
- **Tailwind CSS** - 实用工具优先的 CSS 框架
- **Microsoft Graph API** - 用于与 OneDrive 交互
- **TypeScript** - 增强的 JavaScript 类型系统

## 快速开始

### 前提条件

- Node.js 16.x 或更高版本
- npm 或 yarn

### 安装

1. 克隆项目:

```bash
git clone https://your-repository-url/onedrive-viewer.git
cd onedrive-viewer
```

2. 安装依赖:

```bash
npm install
# 或
yarn install
```

3. 创建 `.env.local` 文件:

```
# Microsoft Graph API 配置
NEXT_PUBLIC_MICROSOFT_CLIENT_ID=your-client-id
MICROSOFT_CLIENT_SECRET=your-client-secret
MICROSOFT_REDIRECT_URI=http://localhost/api/auth/callback
MICROSOFT_SCOPES=files.read,files.read.all,sites.read.all

# 安全配置
NEXT_PUBLIC_API_ENDPOINT=/api
SESSION_SECRET=your-session-secret
BASE_URL=http://localhost
PORT=3000  # 可选，默认为3000

# 功能配置
ENABLE_PROTECTED_FOLDERS=true
MAX_FILES_PER_PAGE=50
```

4. 启动开发服务器:

```bash
npm run dev
# 或
yarn dev
```

5. 在浏览器中打开 [http://localhost:3000](http://localhost:3000)

## Microsoft 应用注册设置

1. 前往 [Azure 门户](https://portal.azure.com/)
2. 导航至 "应用注册"
3. 创建新应用
4. 添加重定向 URI：`http://localhost/api/auth/callback`
   - 对于自定义端口，使用 `http://localhost:你的端口/api/auth/callback`
5. 在 "API 权限" 中添加以下 Microsoft Graph 权限:
   - Files.Read
   - Files.Read.All
   - Sites.Read.All
6. 在 "证书和密码" 中创建新的客户端密码
7. 将应用 ID 和客户端密码复制到您的 `.env.local` 文件中

## 部署

### Vercel 部署

1. 将项目推送到 GitHub 仓库
2. 在 Vercel 控制台中导入该仓库
3. 添加环境变量
4. 部署!

### Cloudflare Pages 部署

1. 将项目推送到 GitHub 仓库
2. 在 Cloudflare Pages 控制台中连接该仓库
3. 配置以下构建设置:
   - 构建命令: `npm run build`
   - 构建输出目录: `out`
4. 添加环境变量
5. 部署!

## 许可证

MIT
