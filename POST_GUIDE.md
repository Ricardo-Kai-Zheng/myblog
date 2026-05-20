# KAI BLOG 发文指南

> 面向 AI Agent 和人类维护者。涵盖博客发文流程、模板、格式规范和常见问题。

---

## 架构速览

```
myblog/
  index.html          # 首页：卡片网格 + 分页（10篇/页）
  archive.html        # Post List：标题+日期列表 + 分页（20篇/页）
  about.html          # 关于页
  projects.html       # 项目页
  css/style.css       # 全局样式
  js/main.js          # 图标绘制、主题切换、滚动动效
  js/pagination.js    # Pagination 分页类
  js/scene.js         # Canvas 像素天空场景
  posts/
    posts.json        # 文章元数据（核心：所有页面的数据来源）
    YYYY-MM-DD-N.html # 单篇文章页面（N = 自增 ID）
    *.md              # 可选 Markdown 源文件
```

**渲染机制**：`index.html` 和 `archive.html` 通过 `fetch('posts/posts.json')` 获取数据，`pagination.js` 分页后在客户端动态渲染。数据源是 `posts.json` 一个文件。

---

## 发文流程（4 步）

### 步骤 1：创建 Markdown 源文件（可选）

在 `posts/` 下创建 `文章标题.md`：

```markdown
# 文章标题

正文内容...

---

*YYYY-MM-DD*
```

### 步骤 2：创建 HTML 页面

在 `posts/` 下创建 `YYYY-MM-DD-N.html`。

命名规则：`YYYY-MM-DD` = 发文日期，`N` = `posts.json` 中最大 `id` + 1。

复制以下模板，替换 `{{}}` 部分：

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{{文章标题}} | Kai Blog</title>
  <link rel="stylesheet" href="../css/style.css">
</head>
<body>
  <div id="reading-progress"></div>
  <section class="hero-canvas-wrap" style="height:25vh;min-height:160px">
    <canvas id="scene-canvas"></canvas>
  </section>
  <main class="container">
    <h1 class="page-title">{{文章标题}}</h1>
    <article class="about-card" style="max-width:800px;margin:0 auto;color:#E0E0E0;font-family:var(--font-pixel),var(--font-cn);font-size:2.4rem;line-height:1.8;padding:40px 34px;">
      {{正文，用 <p> 标签分段}}
      <p style="margin-top:32px;color:var(--ink-light);font-size:1.8rem;">{{YYYY-MM-DD}}</p>
    </article>
  </main>
  <nav class="navbar">
    <div class="nav-inner"><div class="nav-links">
      <a href="../index.html"><canvas class="nav-icon" width="30" height="30" data-icon="home"></canvas><span class="nav-label">HOME</span></a>
      <a href="../archive.html"><canvas class="nav-icon" width="30" height="30" data-icon="book"></canvas><span class="nav-label">POSTS</span></a>
      <a href="../projects.html"><canvas class="nav-icon" width="30" height="30" data-icon="pickaxe"></canvas><span class="nav-label">PROJ</span></a>
      <a href="../about.html"><canvas class="nav-icon" width="30" height="30" data-icon="player"></canvas><span class="nav-label">ABOUT</span></a>
      <button id="theme-toggle" class="theme-toggle" aria-label="toggle day/night"><canvas class="nav-icon" width="30" height="30" data-icon="sun"></canvas><span class="nav-label">MODE</span></button>
    </div></div>
  </nav>
  <footer class="site-footer">
    <div class="footer-social">
      <a href="https://github.com/Ricardo-Kai-Zheng" target="_blank" rel="noopener"><svg viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.605-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12 24 5.37 18.63 0 12 0z"/></svg></a>
      <a href="mailto:1018967072@sjtu.edu.cn"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 4L12 13 2 4"/></svg></a>
    </div>
    <div class="footer-nav">
      <a href="../index.html">Home</a><a href="../archive.html">Posts</a><a href="../projects.html">Projects</a><a href="../about.html">About</a>
    </div>
    <p class="footer-copy">(c) 2026 KAI BLOG</p>
  </footer>
  <button id="scroll-top-btn" class="scroll-top-btn">^</button>
  <script src="../js/scene.js"></script>
  <script src="../js/main.js"></script>
</body>
</html>
```

> 注意：文章页面在 `posts/` 子目录，所有资源路径用 `../`。

### 步骤 3：更新 posts.json

在 `posts/posts.json` 数组末尾追加一条记录：

```json
{
  "id": {{N}},
  "title": "{{文章标题}}",
  "date": "{{YYYY-MM-DD}}",
  "summary": "{{摘要，不超过100字符}}",
  "filePath": "posts/{{YYYY-MM-DD}}-{{N}}.html"
}
```

当前示例：

```json
[
  {
    "id": 1,
    "title": "FRIST DAY",
    "date": "2026-05-20",
    "summary": "Today is the first day of my blog. Everything starts here.",
    "filePath": "posts/2026-05-20-1.html"
  }
]
```

**重要**：`posts.json` 必须是纯 UTF-8 编码，**不能有 BOM**。BOM 会导致 `JSON.parse()` 失败，所有页面的帖子都不显示。

### 步骤 4：提交部署

```bash
git add posts/文章标题.md posts/YYYY-MM-DD-N.html posts/posts.json
git commit -m "add post: 文章标题"
git push origin master

# 手动触发 GitHub Pages 部署
gn api repos/Ricardo-Kai-Zheng/myblog/pages/builds -X POST

# 检查部署状态
gn api repos/Ricardo-Kai-Zheng/myblog/pages/builds/latest --jq '{status, error:.error.message}'
```

状态 `"built"` 表示成功，等 30-60 秒生效。

---

## 渲染细节

### 首页卡片（index.html）
- 每页 10 篇，标题可点击跳转
- 卡片包含：标题、日期、摘要（超过 100 字符截断加 `...`）
- 排序：按日期降序，同日期按 id 降序

### Post List（archive.html）
- 每页 20 篇
- 显示格式：`标题 日期`（标题加粗深色 `#1a1a1a`，日期浅色）
- 已移除 `[ ]` 占位符，改为简洁列表

---

## 编辑现有页面

### about.html
```html
<div class="about-card">
  <div class="info-row"><span class="about-label">NAME</span><span>Kai</span></div>
  <div class="info-row"><span class="about-label">EMAIL</span><span>1018967072@sjtu.edu.cn</span></div>
  <div class="info-row"><span class="about-label">BIO</span><span>A HUMAN</span></div>
</div>
```

### projects.html — 项目卡片模板
```html
<article class="card project-card">
  <div class="project-placeholder">[ CRAFTING ]</div>
  <div class="card-body">
    <h2 class="card-title">项目名</h2>
    <p class="card-desc">描述</p>
    <a class="btn-demo" href="链接" target="_blank" rel="noopener">> PLAY</a>
  </div>
</article>
```

### 邮箱位置（共 5 处）
- `index.html` footer（1 处）
- `about.html` EMAIL 行 + footer（2 处）
- `archive.html` footer（1 处）
- `projects.html` footer（1 处）

---

## 关键常量

| 常量 | 值 | 位置 |
|------|----|------|
| 导航图标 canvas | `30x30` | 所有 HTML |
| 卡片图标 canvas | `43x43` | index.html 内联 JS |
| 像素网格步长 | `P=5`（main.js）/ `PX=5`（scene.js） | JS 顶部 |
| 首页每页条数 | `10` | index.html `new Pagination(posts, 10, ...)` |
| 归档每页条数 | `20` | archive.html `new Pagination(posts, 20, ...)` |
| CSS 网格步长 | `--px: 5px` | style.css `:root` |
| 响应式断点 | `767px` | style.css `@media` |
| archive 标题色 | `#1a1a1a` bold | style.css `.archive-link` |

---

## 故障排查

### 帖子不显示
1. 检查 `posts.json` 文件**不能有 BOM 头**（`0xEF 0xBB 0xBF`）。BOM 会导致 `JSON.parse()` 报错，所有页面静默失败
2. 浏览器硬刷新：`Ctrl+Shift+R`
3. GitHub Pages 部署需 30-90 秒，检查构建状态是否为 `"built"`
4. **不能用 curl 测试** — 内容由 JS 动态渲染，curl 不执行 JavaScript
5. 打开浏览器 DevTools → Console 查看 JS 错误

### GitHub Pages 构建失败
最常见原因：仓库中有文件含非法 UTF-8 字节（如 GBK 编码的中文）。Jekyll 对编码零容忍。
- 修复：所有 `.md` 文件必须用 UTF-8 保存
- 查看错误：`gn api repos/Ricardo-Kai-Zheng/myblog/pages/builds/latest --jq '.error.message'`

### 文章链接 404
确认 `filePath` 字段正确：`"posts/YYYY-MM-DD-N.html"`，从仓库根目录的相对路径。

### 样式错乱
- 修改 font-size 后需同步更新 `--px` 和 JS 中的 `P` 常量
- 修改导航栏大小后需同步更新 `--nav-width`
- 桌面端和移动端（`@media max-width:767px`）需同步修改
