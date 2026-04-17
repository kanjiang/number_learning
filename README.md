# Web 调试版

这是基于现有微信小程序功能整理出的 Vite Web 版，当前包含以下能力：

- 首页数字卡片
- 学习页图片热点
- 数字口诀播放
- 中英数字发音
- 小汽车鸣笛音效
- 独立数字学习动画页
- 积木拼数字页
- 闯关答题页
- 闯关选项点选后朗读对应数字
- 关于与发布说明页

## 启动方式

1. 进入 web 目录
2. 运行 npm install
3. 运行 npm run dev
4. 浏览器打开终端输出的本地地址

说明：开发时不要直接双击打开项目根目录下的 index.html。这个项目的源码模式依赖 Vite 处理模块和样式导入，直接打开源文件会导致资源加载异常。

## 打包查看

1. 运行 npm run build
2. 打包结果在 dist 目录
3. 当前已改为相对资源路径，dist/index.html 可用于静态部署，也可以直接打开查看
4. 如需本地预览打包结果，可运行 npm run preview
5. 如需交付发布包，可直接压缩整个 dist 目录上传到静态托管平台

## 资源来源

Web 版使用 public/assets 中的图片和音频资源。

## 调试说明

- 语言选择和最高分使用浏览器 localStorage 保存
- 路由使用 hash 模式，方便直接本地调试
- 页面逻辑集中在 src/main.js
- 图片和音频资源统一来自 public/assets

## 发布到 GitHub 与 Vercel

如果把 web 目录作为独立仓库根目录：

1. 推送到 GitHub main 分支。
2. GitHub Pages 使用 .github/workflows/deploy-pages.yml 自动发布。
3. Vercel 直接导入同一个 GitHub 仓库，首发后后续会随 push 自动部署。

相关说明：

- GitHub Pages: GITHUB_PAGES_DEPLOY.md
- Vercel: VERCEL_DEPLOY.md

如果你打算把整个工作区作为仓库上传，而不是只上传 web 目录：

1. GitHub Pages 工作流需要改成在 web 子目录安装依赖和构建。
2. Vercel 需要把 Root Directory 设为 web。
