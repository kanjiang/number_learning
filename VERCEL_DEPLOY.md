# Vercel 发布说明

当前 web 目录已经补齐 Vercel 所需的基础配置：

- vercel.json
- 相对资源路径配置
- hash 路由

推荐方式：

1. 将 web 目录作为一个独立 GitHub 仓库的根目录。
2. 把代码推送到 main 分支。
3. 登录 Vercel。
4. 选择 Add New -> Project。
5. 导入这个 GitHub 仓库。
6. 保持以下默认或确认以下设置：
   - Framework Preset: Vite
   - Install Command: npm ci
   - Build Command: npm run build
   - Output Directory: dist
7. 点击 Deploy。

如果你不是把 web 目录单独作为仓库，而是把整个工作区上传到 GitHub：

1. 在 Vercel 导入仓库后，把 Root Directory 改成 web。
2. 其他设置保持不变。

当前项目使用 hash 路由，因此不需要额外的 SPA rewrite 规则。

部署完成后，每次向 GitHub 主分支推送新提交，Vercel 都会自动重新部署。
