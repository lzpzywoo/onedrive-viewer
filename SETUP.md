# OneDrive文件查看器项目设置指南

## 项目说明

这是一个现代化的OneDrive文件浏览和预览应用，支持多种文件格式的预览、搜索和下载功能。项目使用Next.js、Vue 3和Tailwind CSS构建，可以部署在Vercel或Cloudflare Pages上。

## 项目结构

```
onedrive-viewer/
├── public/                    # 静态资源目录
├── src/                       # 源代码目录
│   ├── components/            # React组件
│   │   ├── previewers/        # 各类文件预览组件
│   │   │   ├── ImagePreview.tsx
│   │   │   ├── VideoPreview.tsx
│   │   │   ├── AudioPreview.tsx
│   │   │   ├── OfficePreview.tsx
│   │   │   ├── PDFPreview.tsx
│   │   │   ├── TextPreview.tsx
│   │   │   └── MarkdownPreview.tsx
│   │   ├── FileExplorer.tsx   # 文件浏览器组件
│   │   ├── FileList.tsx       # 列表视图
│   │   ├── FileGrid.tsx       # 网格视图
│   │   ├── FilePreview.tsx    # 文件预览容器
│   │   ├── Header.tsx         # 页头组件
│   │   ├── LoginButton.tsx    # 登录按钮
│   │   ├── PathBreadcrumb.tsx # 路径导航
│   │   └── SearchBar.tsx      # 搜索栏
│   ├── pages/                 # Next.js页面
│   │   ├── api/               # API路由
│   │   │   ├── auth/          # 认证相关API
│   │   │   ├── files/         # 文件操作API
│   │   │   └── search.ts      # 搜索API
│   │   ├── index.tsx          # 主页
│   │   ├── _app.tsx           # 应用程序入口
│   │   └── _document.tsx      # 文档结构
│   ├── styles/                # 样式文件
│   │   └── globals.css        # 全局CSS样式
│   └── utils/                 # 工具函数
│       ├── api.ts             # API调用
│       ├── auth.tsx           # 认证逻辑
│       ├── fileHelpers.tsx    # 文件操作辅助
│       └── types.ts           # TypeScript类型定义
├── .env.example               # 环境变量示例
├── .gitignore                 # Git忽略文件
├── next.config.js             # Next.js配置
├── package.json               # 项目依赖
├── postcss.config.js          # PostCSS配置
├── README.md                  # 项目说明
├── tailwind.config.js         # Tailwind CSS配置
├── tsconfig.json              # TypeScript配置
├── vercel.json                # Vercel部署配置
└── wrangler.toml              # Cloudflare Pages配置
```

## 设置步骤

1. **安装依赖**

```bash
npm install
# 或
yarn install
```

2. **配置环境变量**

创建一个`.env.local`文件，复制`.env.example`的内容并填入相应的值。

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

3. **配置Microsoft应用**

- 前往[Microsoft Azure门户](https://portal.azure.com/)注册应用
- 创建一个新的应用注册
- 设置重定向URI为`http://localhost/api/auth/callback`
  - 或者使用特定端口：`http://localhost:3000/api/auth/callback`
- 生成客户端密钥
- 配置所需的API权限（files.read, files.read.all, sites.read.all）

4. **开发模式运行**

```bash
npm run dev
# 或
yarn dev
```

5. **构建生产版本**

```bash
npm run build
# 或
yarn build
```

## 灵活的重定向配置

项目已经进行了优化，可以适应不同的部署环境：

- 如果您使用默认端口3000，可以直接配置`BASE_URL=http://localhost`
- 如果您需要使用不同的端口，添加`PORT=你的端口号`
- 如果您希望明确指定完整的重定向URI，可以设置`MICROSOFT_REDIRECT_URI=你的完整URL`

重要：确保Microsoft Azure门户中注册的重定向URI与您的环境配置匹配。

## 部署说明

### Vercel部署

1. 在Vercel上导入GitHub仓库
2. 配置环境变量（必须包含）：
   - `NEXT_PUBLIC_MICROSOFT_CLIENT_ID`
   - `MICROSOFT_CLIENT_SECRET`
   - `MICROSOFT_REDIRECT_URI` (使用完整的生产URL)
   - `SESSION_SECRET`
3. 部署

### Cloudflare Pages部署

1. 在Cloudflare Pages上连接GitHub仓库
2. 配置构建命令：`npm run build`
3. 配置构建输出目录：`out`
4. 添加环境变量（同上）
5. 部署

## 可能需要的依赖包

请确认`package.json`中包含以下依赖：

- next
- react
- react-dom
- vue
- @vue/compiler-sfc
- @vue/server-renderer
- axios
- tailwindcss
- postcss
- autoprefixer
- lodash
- video.js
- @microsoft/microsoft-graph-client
- jszip
- marked (用于Markdown预览)

## 注意事项

- 确保Microsoft Graph API的权限配置正确
- 本地开发时，可能需要使用HTTPS或配置代理以防止CORS问题
- 在生产环境中，确保使用安全的会话管理方式
- 如果遇到错误"microsoft-graph-client not found"，请检查package.json中是否只包含了`@microsoft/microsoft-graph-client`
