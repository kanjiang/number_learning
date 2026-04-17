# GitHub Pages 发布说明

当前 web 目录已经具备 GitHub Pages 所需的基础配置：

- .github/workflows/deploy-pages.yml
- public/.nojekyll
- 相对资源路径配置

使用方式：

1. 将 web 目录作为一个独立 GitHub 仓库的根目录使用。
2. 把代码推送到 main 分支。
3. 在 GitHub 仓库的 Settings -> Pages 中，将 Source 设置为 GitHub Actions。
4. 等待 Deploy To GitHub Pages 工作流执行完成。
5. 发布后，Pages 地址会显示在 Actions 运行结果中。

当前目录已经初始化为独立 git 仓库，origin 已配置为：

- https://github.com/kanjiang/number_learning.git

首推命令：

```bash
cd "/c/My workspace/12_personal/web"
git add .
git commit -m "chore: prepare github pages and vercel deployment"
git push -u origin main
```

推送完成后：

1. 到 GitHub Actions 查看 Deploy To GitHub Pages 工作流。
2. 第一次发布时，在仓库 Settings -> Pages 中确认 Source 为 GitHub Actions。
3. 等待部署完成后访问生成的 Pages 地址。

如果你不是把 web 目录单独作为仓库根目录，而是要把整个工作区上传到 GitHub，那么需要把这个工作流改成在 web 子目录下安装依赖和构建。当前文件默认假设仓库根目录就是 web。

当前可直接上传的静态发布包：

- releases/number-miniapp-web-20260416.zip
- dist/
