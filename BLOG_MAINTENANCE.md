# 📖 个人博客维护说明

> **阅读对象**：任何接手此博客维护的 AI 代理或人类开发者。
> **技术栈**：纯静态 HTML/CSS/JS，无框架，部署于 GitHub Pages。

---

## 一、文件结构树

```
/
├── index.html                 # 首页（卡片列表 + 分页，客户端渲染）
├── archive.html               # 文章归档（标题列表 + 分页，客户端渲染）
├── projects.html              # 小游戏/小软件展示页
├── about.html                 # 关于页
├── css/
│   └── style.css              # 全局样式（浅色/暗色主题、毛玻璃、响应式）
├── js/
│   ├── main.js                # 导航高亮、暗色模式切换、回到顶部
│   └── pagination.js          # 通用分页组件（首页/归档共用）
├── posts/
│   ├── posts.json             # 文章索引（所有文章的元数据）
│   └── YYYY-MM-DD-N.html      # 独立文章页面（N 为全局递增序号）
├── images/                    # 图片目录（预留）
└── BLOG_MAINTENANCE.md        # 本文件
```

---

## 二、各文件作用与修改注意事项

### `posts/posts.json` — 文章索引（核心数据文件）

所有文章列表由该文件驱动。格式：JSON 数组，每项包含：

```json
{
  "id": 1,                              // 全局递增序号
  "title": "文章标题",
  "date": "2026-05-19",                  // YYYY-MM-DD 格式
  "summary": "文章摘要（建议 100 字以内）",
  "filePath": "posts/2026-05-19-1.html"  // 文章文件相对路径
}
```

**注意**：`id` 必须全局唯一且递增；`date` 格式固定；`summary` 超过 100 字符的部分在首页自动截断。

### `index.html` — 首页

- 结构：卡片网格容器 `<div id="card-grid" class="card-grid">` + 分页容器 `<div id="pagination" class="pagination">`
- 底部内联 JS 负责 fetch `posts/posts.json`，排序后用 Pagination 类渲染
- 每页显示 10 篇文章，按日期倒序
- **修改分页数量**：找到 `new Pagination(posts, 10, ...)` 中的 `10`，改为你需要的每页数量

### `archive.html` — 归档页

- 结构：无序列表 `<ul id="archive-list" class="archive-list">` + 分页容器
- 每页显示 20 个标题，显示格式：`YYYY-MM-DD — 标题`
- **修改分页数量**：找到 `new Pagination(posts, 20, ...)` 中的 `20`

### `projects.html` — 项目展示

- 纯静态页面，每张卡片包含：占位图区域、标题、描述、"查看演示"按钮
- 每个项目卡片结构：
  ```html
  <article class="card project-card">
    <div class="project-placeholder">🎮</div>
    <div class="card-body">
      <h2 class="card-title">项目名</h2>
      <p class="card-desc">描述</p>
      <a class="btn-demo" href="外部链接">查看演示</a>
    </div>
  </article>
  ```
- 所有链接为外部链接（`href` 指向实际 URL），不在本仓库内嵌代码

### `about.html` — 关于页

- 纯静态，手动修改昵称、邮箱、简介文字即可
- 搜索 `你的昵称`、`your@email.com` 找到对应占位文本

### `css/style.css` — 全局样式

- **CSS 变量**：所有颜色、间距定义在 `:root`（浅色）和 `[data-theme="dark"]`（暗色）中
- **修改主题色**：改 `:root` 下的 `--accent`、`--accent-light` 等变量
- **毛玻璃模糊度**：改 `--card-blur: blur(10px)` 中的数值
- **卡片圆角**：改 `--radius-card: 1rem`
- **暗色模式变量**：在 `[data-theme="dark"]` 选择器中修改
- **系统暗色自动适配**：`@media (prefers-color-scheme: dark)` 中的规则用于无用户选择时
- **响应式断点**：`768px`（平板双列）、`1024px`（桌面三列）、`1400px`（宽屏四列）

### `js/main.js` — 全局交互

- **暗色模式逻辑**：优先级 localStorage > 系统偏好
  - 读取 `localStorage.getItem('blog-theme')`，值为 `'dark'` 或 `'light'`
  - 无存储值时跟随 `prefers-color-scheme`
  - 点击切换按钮调用 `toggleTheme()`，将选择写入 localStorage
- **导航高亮**：通过 `window.location.pathname` 匹配当前页面链接
- **回到顶部**：滚动超过 300px 显示，点击平滑滚动到顶部

### `js/pagination.js` — 分页组件

Pagination 类，构造参数：`(data 数组, itemsPerPage 每页条数, container 容器元素, renderFn 渲染回调)`。

主要方法：
- `goTo(page)` — 跳转到指定页，自动调用渲染回调 + 渲染页码按钮 + 滚动到顶部
- `setData(newData)` — 更新数据源并重置到第 1 页

---

## 三、如何添加新文章

### 步骤 1：准备 Markdown 文章

假设你有如下 Markdown 内容（示例）：

```markdown
# 我的新文章标题

这是正文第一段。

## 小标题

更多内容...
```

### 步骤 2：将 Markdown 转为 HTML 文章页

手动或借助工具将 Markdown 转为 HTML（仅转换文章正文部分）。然后按以下模板创建新文件：

**文件命名**：`posts/YYYY-MM-DD-N.html`

其中 `N` = `posts.json` 中已有文章数 + 1（全局递增）。

**文章 HTML 模板**：

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>文章标题 —— 个人博客</title>
  <link rel="stylesheet" href="../css/style.css">
</head>
<body>
  <nav class="navbar">
    <div class="nav-inner">
      <a class="nav-brand" href="../index.html">📝 我的博客</a>
      <div class="nav-links">
        <a href="../index.html">首页</a>
        <a href="../archive.html">文章</a>
        <a href="../projects.html">项目</a>
        <a href="../about.html">关于</a>
        <button id="theme-toggle" class="theme-toggle" aria-label="切换暗色模式">🌙</button>
      </div>
    </div>
  </nav>

  <main class="article-container">
    <article>
      <header class="article-header">
        <h1>文章标题</h1>
        <div class="article-meta">📅 YYYY-MM-DD</div>
      </header>

      <div class="article-body">
        <!-- 将 Markdown 转换后的 HTML 贴在这里 -->
      </div>
    </article>

    <div class="article-footer">
      <a class="btn-back" href="../index.html">← 返回首页</a>
      <button id="scroll-top-btn" class="scroll-top-btn" aria-label="回到顶部">↑</button>
    </div>
  </main>

  <!-- 在此插入 counter.dev 脚本 -->

  <footer class="site-footer">
    <p>&copy; 2026 我的博客 | Powered by GitHub Pages</p>
  </footer>

  <script src="../js/main.js"></script>
</body>
</html>
```

### 步骤 3：更新 `posts/posts.json`

在 JSON 数组末尾添加一条记录：

```json
{
  "id": 3,
  "title": "我的新文章标题",
  "date": "2026-06-01",
  "summary": "文章的前 100 字摘要...",
  "filePath": "posts/2026-06-01-3.html"
}
```

**注意**：JSON 语法严格——最后一条记录末尾不加逗号；字符串中的双引号需转义。

### 步骤 4：无需重新生成首页和归档页

因为首页和归档页是客户端渲染——它们从 `posts.json` 动态加载数据。更新 `posts.json` 后刷新页面即自动反映新文章。

### 步骤 5：本地预览

在项目根目录启动本地服务器（因为 fetch 需要 HTTP 协议）：

```bash
# Python 方式
python -m http.server 8080

# Node.js 方式（需安装 http-server）
npx http-server -p 8080

# 然后打开浏览器访问 http://localhost:8080
```

### 步骤 6：提交并推送

```bash
git add posts/新文件名.html posts/posts.json
git commit -m "add post: 文章标题"
git push
```

---

## 四、部署到 GitHub Pages

### 首次部署（完整流程）

#### 1. 在 GitHub 创建仓库

- 登录 [GitHub](https://github.com)，点击 New repository
- 仓库名建议：`<your-username>.github.io`（用户站点）或任意名（项目站点）
- 选择 Public，不勾选任何初始化选项（README、.gitignore 等）

#### 2. 本地初始化 Git 并关联远程

```bash
cd D:\Projects\Myblog

# 如果尚未初始化
git init
git add .
git commit -m "Initial commit: 个人博客"

# 关联远程仓库（替换为你的仓库地址）
git remote add origin https://github.com/<your-username>/<repo-name>.git

# 推送到 GitHub
git branch -M main
git push -u origin main
```

#### 3. 开启 GitHub Pages

- 进入仓库 → Settings → Pages
- Source 选择 "Deploy from a branch"
- Branch 选择 `main`，目录选择 `/ (root)`
- 点击 Save
- 等待 1-2 分钟，页面会显示你的站点 URL（如 `https://<username>.github.io`）

#### 4. 验证部署

访问显示的 URL，确认所有页面正常渲染。

### 后续更新部署

每次修改后：

```bash
git add .
git commit -m "描述你的更改"
git push
```

GitHub Pages 会自动重新部署（通常 1 分钟内生效）。

### 绑定自定义域名（可选）

1. 在仓库 Settings → Pages → Custom domain 填入你的域名
2. 在域名 DNS 中添加 CNAME 记录指向 `<username>.github.io`
3. 仓库根目录会自动生成 `CNAME` 文件
4. 等待 DNS 生效（最长 48 小时）

---

## 五、统计服务

### counter.dev 插入位置

每个 HTML 页面的底部（`</footer>` 和 `<script>` 之间）有注释：

```html
<!-- 在此插入 counter.dev 脚本 -->
```

将你从 [counter.dev](https://counter.dev) 获取的统计脚本替换该注释即可。需要替换的文件：
- `index.html`
- `archive.html`
- `projects.html`
- `about.html`
- `posts/` 下每一篇文章

### 更换为其他统计服务

1. 删除或替换上述注释处的脚本
2. 常见替代方案：
   - [Google Analytics](https://analytics.google.com)：需注册，提供 `gtag.js` 脚本
   - [Umami](https://umami.is)：开源、隐私友好的自托管方案
   - [Plausible](https://plausible.io)：轻量级、隐私友好

### 添加评论系统

如果需要评论功能，可引入第三方服务（纯静态友好）：

- **[Giscus](https://giscus.app)**（推荐）：基于 GitHub Discussions，免费、无广告
  1. 在 GitHub 仓库开启 Discussions
  2. 安装 Giscus App
  3. 在 giscus.app 生成配置
  4. 将生成的 `<script>` 标签插入文章页 `</article>` 之后

- **[utterances](https://utteranc.es)**：类似 Giscus，基于 GitHub Issues
- **[Disqus](https://disqus.com)**：传统方案，有广告

---

## 六、如何修改样式

### 当前配色方案（暖调人文）

浅色模式：奶油暖白底 `#fef9f0 → #f5ebe0`，强调色琥珀 `#d97706`
暗色模式：浓缩咖啡底 `#1a120b → #2d1f14`，强调色金赭 `#f59e0b`

所有颜色通过 CSS 变量控制，位于 `css/style.css` 的 `:root`（浅色）、`[data-theme="dark"]`（暗色）和 `@media (prefers-color-scheme: dark)`（系统自动）三处。

### 修改毛玻璃模糊度

编辑 `css/style.css`，找到 `:root` 和 `[data-theme="dark"]` 中的：

```css
--card-blur: blur(10px);   /* 卡片模糊度 */
--nav-blur: blur(10px);    /* 导航栏模糊度 */
```

增大数值 = 更模糊，减小 = 更清晰。建议范围 5px ~ 20px。

### 修改卡片圆角

```css
--radius-card: 1rem;   /* 卡片圆角 */
--radius-btn: 0.5rem;  /* 按钮圆角 */
```

### 修改暗色模式颜色

在 `[data-theme="dark"]` 和 `@media (prefers-color-scheme: dark)` 中修改对应变量。

**快速配色参考**：
- `--bg-start / --bg-end`：页面背景渐变
- `--card-bg`：卡片/导航栏背景（含透明度）
- `--text-primary`：主要文字颜色
- `--accent`：主题色（链接、按钮、活跃页码）

### 修改字体

标题字体（h1-h6、导航栏、按钮等）使用系统无衬线：

```css
font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
```

正文字体（段落）使用衬线：

```css
font-family: Georgia, "Times New Roman", serif;
```

在 `css/style.css` 中搜索上述 `font-family` 声明即可找到并修改。

### 修改布局宽度

- 首页卡片区最大宽度：`.container { max-width: 1400px }`
- 文章正文最大宽度：`.article-container { max-width: 720px }`
- 归档区最大宽度：`.archive-container { max-width: 800px }`

---

## 七、常见问题（FAQ）

### Q1：首页打不开 / 文章卡片不显示？

**原因**：直接双击打开 HTML 文件时，浏览器的 `fetch` 无法读取本地 JSON 文件（跨域限制）。

**解决**：必须通过 HTTP 服务器访问。在项目根目录运行：
```bash
python -m http.server 8080
```
然后访问 `http://localhost:8080`。

### Q2：新文章加入 `posts.json` 后首页没变化？

**检查**：
1. JSON 语法是否正确（逗号、引号、括号）
2. `filePath` 路径是否正确（相对于根目录）
3. `date` 格式是否为 `YYYY-MM-DD`
4. 强制刷新浏览器（Ctrl+Shift+R）

### Q3：暗色模式切换后刷新页面又变回去了？

检查 `js/main.js` 中是否正常读写 `localStorage`。在浏览器控制台执行：
```js
localStorage.getItem('blog-theme')  // 应返回 'dark' 或 'light'
```

### Q4：部署到 GitHub Pages 后样式丢失？

检查浏览器控制台是否有 404 错误。常见原因：
- 仓库名不是 `<username>.github.io`，需要配置 base path
- CSS/JS 文件路径使用了绝对路径而非相对路径

### Q5：如何批量添加文章？

当前无批量工具。推荐流程：
1. 准备好所有 Markdown 文件
2. 逐篇转为 HTML 保存到 `posts/`
3. 在 `posts.json` 中追加所有文章元数据
4. 提交推送

### Q6：分页太多页码（如 100 篇），控件太宽？

`pagination.js` 的 `getPageNumbers` 方法自动限制显示 7 个页码 + 省略号，无需额外处理。

### Q7：如何增加每页显示的文章数？

- 首页：编辑 `index.html`，找到 `new Pagination(posts, 10, ...)`，改 `10` 为目标数量
- 归档页：编辑 `archive.html`，找到 `new Pagination(posts, 20, ...)`，改 `20` 为目标数量

### Q8：换了一个 AI 代理，如何让它快速上手？

**请它阅读本文件。** 本文件包含了所有必要信息：文件结构、数据格式、修改方法、部署流程。

---

> **最后更新：2026-05-19（暖调人文视觉改造 v2.0）
> **版本：v2.0