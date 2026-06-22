# 个人主页

现代风格单页个人作品集，参考 [vcard-personal-portfolio](https://github.com/codewithsadee/vcard-personal-portfolio) 布局，采用 shadcn 设计语言（zinc 色板、卡片、圆角）。零构建依赖，纯 HTML + CSS + JS，可直接部署到 GitHub Pages。

当前内容基于 GitHub 账号的公开资料填充。

## 功能特性

- 侧边栏个人资料 + 主内容区（关于 / 技能 / 项目 / 联系）
- 响应式布局（移动端抽屉侧边栏）
- 亮/暗色模式（跟随系统 + 手动切换，偏好保存在 localStorage）
- 滚动渐入动画与卡片悬停效果
- 运行时尝试从 GitHub API 刷新最新资料（失败时使用内置回退数据）

## 本地预览

```bash
cd personal-homepage
python3 -m http.server 8000
```

访问 http://localhost:8000

## 自定义内容

### 更换 GitHub 账号

编辑 `main.js` 顶部的 `GITHUB_USER` 常量，页面会自动拉取该用户的公开资料与仓库。

### 手动调整

- `index.html` — 静态文案、技能卡片、社交链接
- `style.css` — CSS 变量（`--background`、`--primary` 等）与布局
- `main.js` — `PROFILE_FALLBACK` / `REPOS_FALLBACK` 回退数据

## 部署到 GitHub Pages

### 用户主页

访问地址：`https://你的用户名.github.io`

1. 新建仓库 `你的用户名.github.io`
2. 推送本项目到 `main` 分支
3. 在 **Settings → Pages** 启用 `main` / `(root)`

### 项目主页

访问地址：`https://你的用户名.github.io/personal-homepage`

1. 新建任意名称仓库并推送
2. 在 **Settings → Pages** 启用发布

## 文件结构

```
personal-homepage/
├── index.html    # 页面结构
├── style.css     # 样式与主题
├── main.js       # 交互、主题切换、GitHub API
└── README.md     # 说明文档
```
