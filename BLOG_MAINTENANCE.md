# KAI BLOG 维护指南

> 面向 AI Agent 和人类维护者。涵盖博客架构、发文流程、页面模板、部署命令和常见问题。

---

## 架构总览

```
myblog/
  index.html          # 首页：卡片网格 + 分页（10篇/页）
  archive.html        # 归档页：列表形式 + 分页（20篇/页）
  about.html          # 关于页
  projects.html       # 项目页
  css/style.css       # 全局样式（像素/Minecraft主题）
  js/main.js          # 共享JS：图标绘制、主题切换、滚动、显示动画
  js/pagination.js    # 通用分页组件 Pagination 类
  js/scene.js         # Canvas 英雄场景（像素天空/草地）
  posts/
    posts.json        # 文章元数据（所有文章的索引）
    YYYY-MM-DD-N.html # 单篇文章页面（N=自增ID）
    *.md              # Markdown 源文件（可选，方便编辑）
```

### 渲染管道

```
posts.json  -->  index.html（fetch + Pagination 渲染卡片）
            -->  archive.html（fetch + Pagination 渲染列表）
```

博客是纯静态前端：文章数据来自 `posts/posts.json`，由 `pagination.js` 分页组件在客户端动态渲染。HTML 页面中的卡牌/列表是骨架占位（skeleton），JS 加载后替换为真实内容。

### 关键常量

| 常量 | 值 | 位置 |
|------|----|------|
| 导航图标 canvas | `width="30" height="30"` | 所有 HTML 的 `.nav-icon` |
| 卡片图标 canvas | `width="43" height="43"` | `index.html` 内联 JS 渲染 |
| 像素网格步长 | `P = 5`（main.js）/ `PX = 5`（scene.js） | JS 文件顶部 |
| 首页每页条数 | `10` | `index.html` 中 `new Pagination(posts, 10, ...)` |
| 归档每页条数 | `20` | `archive.html` 中 `new Pagination(posts, 20, ...)` |
| CSS 网格步长 | `--px: 5px` | `css/style.css` `:root` |
| 导航栏宽度 | `--nav-width: 88px` | `css/style.css` `:root` |
| 响应式断点 | `767px` | `css/style.css` `@media` |

---

## 发文流程

每发一篇文章需要完成 4 步：

### 步骤 1：创建 Markdown 源文件

在 `posts/` 下创建 `文章标题.md`（可选，方便编辑和版本管理）：

```markdown
# 文章标题

正文内容...

---

*YYYY-MM-DD*
```

### 步骤 2：创建 HTML 页面

在 `posts/` 下创建 `YYYY-MM-DD-N.html`，命名规则：
- `YYYY-MM-DD` = 发文日期
- `N` = 全局自增序号，取 `posts.json` 中最大 `id` + 1

使用以下模板（复制后替换 `{{占位符}}`）：

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
      {{文章正文，用 <p> 标签包裹每段}}
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

> 注意：文章页面在 `posts/` 子目录中，所有资源路径用 `../css/`、`../js/`、`../index.html` 等。

### 步骤 3：更新 posts.json

在 `posts/posts.json` 数组末尾追加一条记录。格式：

```json
{
  "id": {{N}},
  "title": "{{文章标题}}",
  "date": "{{YYYY-MM-DD}}",
  "summary": "{{摘要，不超过100字符}}",
  "filePath": "posts/{{YYYY-MM-DD}}-{{N}}.html"
}
```

字段说明：
- `id`：全局自增序号，取当前最大 id + 1
- `title`：显示在卡片和归档列表中
- `date`：用于排序（降序），格式必须 YYYY-MM-DD
- `summary`：首页卡片摘要，超过 100 字符会被截断
- `filePath`：文章 HTML 文件相对于仓库根目录的路径

完整示例（当前只有一篇）：

```json
[
  {
    "id": 1,
    "title": "FRIST DAY",
    "date": "2026-05-19",
    "summary": "Today is the first day of my blog. Everything starts here.",
    "filePath": "posts/2026-05-19-1.html"
  }
]
```

### 步骤 4：提交和部署

```bash
git add posts/NewPost.md posts/YYYY-MM-DD-N.html posts/posts.json
git commit -m "add post: {{文章标题}}"
git push origin master

# 手动触发 GitHub Pages 部署（如果自动部署缓慢）
gh api repos/Ricardo-Kai-Zheng/myblog/pages/builds -X POST

# 检查部署状态
gh api repos/Ricardo-Kai-Zheng/myblog/pages/builds/latest --jq '{status, duration, error:.error.message}'
```

部署成功标志：`"status":"built"`，然后等 30-60 秒刷新页面。

---

## 编辑现有页面

### about.html

个人信息用 `.info-row` 模式：

```html
<div class="about-card">
  <div class="info-row"><span class="about-label">NAME</span><span>Kai</span></div>
  <div class="info-row"><span class="about-label">EMAIL</span><span>1018967072@sjtu.edu.cn</span></div>
  <div class="info-row"><span class="about-label">BIO</span><span>A PERSON WHO IS A MAN</span></div>
</div>
```

### projects.html

每个项目一张卡牌：

```html
<article class="card project-card">
  <div class="project-placeholder">[ CRAFTING ]</div>
  <div class="card-body">
    <h2 class="card-title">{{项目名}}</h2>
    <p class="card-desc">{{项目描述}}</p>
    <a class="btn-demo" href="{{链接}}" target="_blank" rel="noopener">> PLAY</a>
  </div>
</article>
```

### Footer 和邮箱

邮箱 `1018967072@sjtu.edu.cn` 出现在以下位置（修改时统一替换）：
- `index.html` — footer 中 `<a href="mailto:...">`（1处）
- `about.html` — EMAIL 行 + footer（2处）
- `archive.html` — footer（1处）
- `projects.html` — footer（1处）

### 首页/归档页的分页设置

修改每页显示条数：
- `index.html`：搜索 `new Pagination(posts, 10, ...)`，改 `10` 为目标值
- `archive.html`：搜索 `new Pagination(posts, 20, ...)`，改 `20` 为目标值

---

## CSS 定制

### 颜色变量（`:root`）

```css
--sky-top: #87CEEB;     /* 白天天空顶部 */
--sky-bot: #C5E8F7;     /* 白天天空底部 */
--grass: #7BC24C;       /* 草地 */
--wood: #BC9862;        /* 木板主色 */
--plank-bg: #C4A46C;    /* 背景木板 */
--parchment: #F5E6C8;   /* 羊皮纸 */
--gold: #FFD700;        /* 金色高亮 */
--ink: #3D2B1F;         /* 文字色 */
--shadow: #2D2318;      /* 阴影 */
```

### 字体大小速查表（当前 2/3 比例）

| 元素 | 大小 |
|------|------|
| `h1` / hero name | `4.8rem` / `10rem` |
| `h2` / page-title | `3.6rem` |
| `h3` | `2.8rem` |
| card-title / archive-link | `2.6rem` |
| card-summary / about p / about info-row | `2.4rem` |
| about-label | `2.2rem` |
| card-date | `2.2rem` |
| hero-tagline | `3rem` |
| footer / btn-demo | `2rem` |
| nav-label | `0.8rem` |
| pagination / footer-nav / scroll-top | `1.8rem` |

### 图标/元素尺寸速查表

| 元素 | 尺寸 |
|------|------|
| 导航按钮 | `75×75px`（移动端 `48×48px`） |
| 卡片图标 | `43×43px`（移动端 `32×32px`） |
| 分页按钮 | `64×64px`（移动端 `38×38px`） |
| Footer 社交图标 | `54×54px`，SVG `27×27px` |
| 滚动到顶按钮 | `64×64px`（移动端 `43×43px`） |

缩放比例调整：修改 `--px`（网格步长）+ `P`（JS 像素常量）+ 逐个 CSS 值按比例换算。

---

## 主题系统

- 存储键：`localStorage` 中的 `blog-theme`（值 `"dark"` 或 `"light"`）
- 切换按钮：`#theme-toggle`，位于导航栏
- 图标：通过 `main.js` 的 `drawIcon()` 在 canvas 上绘制像素太阳/月亮
- 深色模式颜色：由 `applyTheme()` 动态设置 CSS 变量（天空、草地、木头、文字等）
- 系统偏好：首次访问遵循 `prefers-color-scheme`，用户手动选择后覆盖

---

## 像素图标系统

所有图标通过 `main.js` 中的 `drawIcon(canvas, iconType)` 函数在 canvas 上逐像素绘制。

支持的图标类型（`data-icon` 属性值）：
- `home` — 像素小屋
- `book` — 像素书
- `pickaxe` — 像素镐
- `player` — 像素头像
- `paper` — 像素卷轴（文章卡片用）
- `sun` — 8射线日轮（亮色模式）
- `moon` — 新月（暗色模式）
- `github` — GitHub 猫（未使用，保留）
- `mail` — 信封（未使用，保留）

添加新图标：在 `main.js` 的 `sprites` 对象中新增一个函数，用 `px(x, y, color)` 按坐标画像素块。画布为 6×6 网格，每个像素块 `P×P`（当前 `5×5`）。

---

## 部署

- 平台：GitHub Pages
- 方式：分支部署，源分支 `master`，目录 `/ (root)`
- 自动部署：每次 push 到 master 后GitHub Pages 自动构建
- 手动触发：
  ```bash
  gh api repos/Ricardo-Kai-Zheng/myblog/pages/builds -X POST
  ```
- 检查状态：
  ```bash
  gh api repos/Ricardo-Kai-Zheng/myblog/pages/builds/latest --jq '{status, duration, error:.error.message}'
  ```
- 构建时间：通常 60-90 秒
- 网站地址：`https://ricardo-kai-zheng.github.io/myblog/`

---

## 故障排查

### GitHub Pages 构建失败

**症状**：push 后收到构建错误邮件，状态显示 `"errored"`

**常见原因**：
1. **文件编码问题** — `.md` 文件必须 UTF-8 编码，不能含 GBK/GB2312 字符。Jekyll 对非法 UTF-8 字节零容忍。
   - 修复：用 VS Code 右下角点击编码 → "Save with Encoding" → UTF-8
2. **YAML front matter 语法错误**（如有 `_config.yml`）

**查看错误详情**：
```bash
gh api repos/Ricardo-Kai-Zheng/myblog/pages/builds/latest --jq '.error.message'
```

### 文章不显示

**症状**：首页/归档页看不到新文章

**排查顺序**：
1. 确认 `posts/posts.json` 已更新且格式正确（用浏览器直接访问 `https://ricardo-kai-zheng.github.io/myblog/posts/posts.json`）
2. **不能用 curl/Invoke-WebRequest 测试** — 文章由客户端 JS 动态渲染，这些工具不执行 JavaScript。请用浏览器打开页面查看。
3. 浏览器缓存：`Ctrl + Shift + R` 硬刷新
4. GitHub Pages 部署延迟：检查构建状态是否 `"built"`
5. 检查 `filePath` 是否正确：相对于仓库根的路径，如 `posts/2026-05-19-1.html`

### 图标不显示或显示错误

**症状**：导航栏/主题切换图标空白或显示旧图标

**原因**：
1. Canvas 尺寸与 `P` 步长不匹配 — nav-icon 应为 `30×30`（P=5 × 6格），card-icon 应为 `43×43`
2. `main.js` 中 `sprites` 对象缺少对应的 `data-icon` 名称
3. 主题切换图标由 `applyTheme()` 重新绘制，如果 `#theme-toggle` 内无 `<canvas>` 则不会更新

### 样式错乱

**常见问题**：
- 修改了 `style.css` 中任一 font-size 但忘记同步修改 `--px` 或 JS 中的 `P` 常量
- 导航栏大小改了 CSS 的 `width` 但没改 `--nav-width`，导致 body padding 对不齐
- 响应式样式只改了桌面端忘了改 `@media (max-width:767px)` 内的值