# Ahlson

<p align="center">
  <strong>一个简洁、现代的自托管服务导航页</strong>
</p>

<p align="center">
  用一个漂亮的首页，快速访问你的 NAS、服务器、Docker 服务、Web 应用和常用网站。
</p>

<p align="center">
  <a href="#特性">特性</a> ·
  <a href="#快速开始">快速开始</a> ·
  <a href="#配置">配置</a> ·
  <a href="#部署">部署</a>
</p>

---

## ✨ 简介

**Ahlson** 是一个轻量级的个人服务工作台 / Homepage。

它没有复杂的后端，也不需要数据库、API 或 Docker。

只需要一个静态 Web 服务器，就可以把你常用的：

* 🖥️ NAS 服务
* 🐳 Docker 服务
* 🏠 家庭服务器
* ☁️ 公网服务
* 🔗 常用网站
* 📚 在线工具
* 💻 开发工具

统一放在一个漂亮的首页中。

Ahlson 特别适合同时拥有**内网地址和外网地址**的自建服务。

例如：

```text
内网：
http://192.168.2.88:5678

外网：
https://n8n.example.com
```

通过顶部的网络模式，可以快速选择使用内网还是外网地址。

---

## 🎨 界面

> Ahlson 采用简洁、克制的现代化设计风格。

* Apple / Linear / Vercel 风格的界面
* 毛玻璃效果
* 响应式布局
* 浅色 / 深色主题
* 服务卡片
* 收藏栏
* 搜索框
* 网络模式切换
* 实时时钟

背景图片、服务图标等资源均可以根据自己的需求替换。

---

## 🚀 特性

### 🏠 内网 / ☁️ 外网切换

针对同时存在内网和公网地址的服务，可以直接切换访问方式：

```text
⚡ 自动
🏠 内网
☁️ 外网
```

**自动模式**会根据当前页面访问地址进行简单判断：

* `localhost`
* `127.0.0.1`
* 私有 IPv4 地址

  * `10.x.x.x`
  * `192.168.x.x`
  * `172.16.x.x ~ 172.31.x.x`

默认使用内网地址。

如果当前页面通过公网域名访问，则默认使用外网地址。

> 自动模式属于启发式判断，并不能真正检测设备当前是否处于家庭局域网。

---

### ⭐ 收藏

可以将常用服务加入收藏。

收藏区域会显示在页面顶部，并支持：

* 添加收藏
* 取消收藏
* 拖拽调整顺序
* 收藏状态本地保存

收藏数据会保存到浏览器 `localStorage`，不会发送到服务器。

---

### ✏️ 网页端编辑

无需直接修改 JSON，即可在网页中管理服务。

进入 **编辑模式**后，可以：

* 添加服务
* 编辑服务
* 删除服务
* 添加分类
* 编辑分类
* 删除分类
* 移动服务
* 调整服务顺序
* 调整分类顺序
* 拖拽服务到其他分类
* 导出新的 `services.json`

网页端的修改会暂存在浏览器的 `localStorage` 中。

如果希望将修改后的配置用于其他设备，可以直接使用 **导出** 功能生成新的 `services.json`。

---

### 🔍 多搜索引擎

顶部搜索框支持：

* Bing
* Google
* 百度

可以直接切换搜索引擎，输入关键词后按 `Enter`，在新标签页打开搜索结果。

默认搜索引擎：

```text
Bing
```

---

### 🌓 深色 / 浅色主题

支持：

* 浅色模式
* 深色模式
* 跟随系统主题

主题设置会保存在浏览器本地。

---

### 🖱️ 拖拽排序

编辑模式支持直接拖拽：

```text
服务卡片
   ↓
调整服务顺序

服务卡片
   ↓
拖到其他分类
   ↓
移动服务

分类标题
   ↓
调整分类顺序
```

收藏区域同样支持拖拽排序。

---

### 📱 响应式设计

针对桌面端、平板和手机进行了适配。

桌面端：

```text
┌──────────────────────────────────────────────┐
│ Ahlson   搜索框        网络  主题  时间       │
├──────────────────────────────────────────────┤
│                                              │
│  服务        服务        服务        服务     │
│                                              │
│  服务        服务        服务        服务     │
│                                              │
└──────────────────────────────────────────────┘
```

手机端会自动调整为更加紧凑的布局。

---

## 📦 项目结构

推荐的目录结构：

```text
Ahlson/
├── index.html
├── README.md
│
├── assets/
│   ├── app.js
│   └── style.css
│
├── config/
│   └── services.json
│
├── icons/
│   ├── n8n.svg
│   ├── docker.svg
│   ├── portainer.svg
│   └── ...
│
└── images/
    └── background.jpg
```

其中：

| 文件 / 目录                | 作用   |
| ---------------------- | ---- |
| `index.html`           | 页面主体 |
| `assets/app.js`        | 页面逻辑 |
| `assets/style.css`     | 页面样式 |
| `config/services.json` | 服务配置 |
| `icons/`               | 服务图标 |
| `images/`              | 背景图片 |

---

# ⚙️ 配置

Ahlson 的服务数据放在：

```text
config/services.json
```

基本结构：

```json
{
  "site": {
    "title": "Ahlson"
  },
  "favorites": [
    "n8n",
    "Portainer"
  ],
  "categories": [
    {
      "name": "自建服务",
      "icon": "star",
      "items": [
        {
          "name": "n8n",
          "description": "工作流自动化",
          "icon": "n8n.svg",
          "type": "server",
          "internalUrl": "http://192.168.2.88:5678",
          "externalUrl": "https://n8n.example.com"
        }
      ]
    }
  ]
}
```

---

## 服务类型

Ahlson 支持两种类型：

### Server

适用于同时具有内网和外网地址的服务：

```json
{
  "name": "n8n",
  "description": "工作流自动化",
  "icon": "n8n.svg",
  "type": "server",
  "internalUrl": "http://192.168.2.88:5678",
  "externalUrl": "https://n8n.example.com"
}
```

访问逻辑：

```text
内网模式
    ↓
internalUrl

外网模式
    ↓
externalUrl
```

---

### Bookmark

适用于只有一个公网地址的网站或书签：

```json
{
  "name": "GitHub",
  "description": "代码托管平台",
  "icon": "github.svg",
  "type": "bookmark",
  "externalUrl": "https://github.com"
}
```

书签没有内网地址，无论当前网络模式是什么，都会使用：

```text
externalUrl
```

---

## 图标

图标可以使用：

### 相对路径

```json
"icon": "n8n.svg"
```

默认会从：

```text
icons/
```

目录加载。

也可以直接指定：

```json
"icon": "icons/n8n.svg"
```

或者：

```json
"icon": "images/example.svg"
```

还可以使用完整 URL：

```json
"icon": "https://example.com/icon.svg"
```

程序会自动识别不同形式的图标路径。

---

# 💾 数据保存

Ahlson 是纯前端应用。

用户在网页中的设置会保存在浏览器：

```text
localStorage
```

主要包括：

```text
homepage_network_mode
homepage_theme
homepage_favorites
homepage_search_engine
homepage_overrides
```

因此：

> **不同浏览器、不同设备之间不会自动同步设置。**

例如你在电脑上收藏了一个服务，手机访问时不会自动拥有相同的浏览器收藏状态。

---

## 网页编辑与 services.json

网页编辑不会直接修改服务器上的：

```text
config/services.json
```

而是先保存到：

```text
localStorage
```

中的配置覆盖层。

网页端修改后的配置优先级更高：

```text
config/services.json
        ↓
读取
        ↓
检查 localStorage
        ↓
存在网页修改？
   ↙          ↘
  是            否
  ↓             ↓
使用修改配置    使用 JSON
```

如果需要把网页端修改正式保存到项目中：

1. 进入编辑模式
2. 修改服务
3. 点击导出
4. 下载新的 `services.json`
5. 用导出的文件替换项目中的：

```text
config/services.json
```

导出的文件名固定为：

```text
services.json
```

---

# 🚀 快速开始

## 方法一：直接使用静态服务器

Ahlson 不需要 Node.js，也不需要数据库。

只要能够提供静态文件即可。

例如使用 Python：

```bash
python3 -m http.server 8080
```

然后访问：

```text
http://localhost:8080
```

---

## 方法二：Nginx

将项目放到 Nginx 网站目录：

```text
/var/www/ahlson/
```

例如：

```text
/var/www/ahlson/
├── index.html
├── assets/
├── config/
├── icons/
└── images/
```

然后通过 Nginx 提供静态文件。

---

## 方法三：Docker

如果你已经有自己的 Nginx、Caddy、Traefik 等反向代理，也可以直接将 Ahlson 作为一个静态站点运行。

Ahlson 本身不要求 Docker。

因此你可以根据自己的环境选择：

```text
Ahlson
   │
   ├── Nginx
   │
   ├── Caddy
   │
   ├── Apache
   │
   ├── GitHub Pages
   │
   ├── Cloudflare Pages
   │
   └── 任意静态 Web Server
```

---

# 🌐 GitHub Pages

Ahlson 是纯静态网页，因此可以直接部署到 GitHub Pages。

基本步骤：

```text
1. 创建 GitHub Repository
2. 上传 Ahlson 项目
3. 打开 Settings
4. 进入 Pages
5. 选择部署分支
6. 保存
```

等待 GitHub Pages 完成部署即可。

---

# ☁️ Cloudflare Pages

同样可以直接部署到 Cloudflare Pages。

由于项目没有后端：

```text
HTML
CSS
JavaScript
JSON
SVG
图片
```

均可以直接作为静态资源部署。

---

# 🔒 安全说明

Ahlson 本身不包含后端服务，也不会主动收集用户数据。

服务配置运行在浏览器中。

项目代码尽量避免使用 `innerHTML` 处理用户配置中的文本，而是使用 DOM API 和 `textContent` 写入用户数据。

需要注意的是：

### 服务地址仍然是公开配置

如果你把以下内容直接提交到公开 GitHub 仓库：

```json
"internalUrl": "http://192.168.2.88:5678"
```

虽然 `192.168.x.x` 属于私有网络地址，但你的公网地址：

```json
"externalUrl": "https://example.com"
```

可能会被所有人看到。

如果这是一个公开项目，建议：

```text
services.example.json
```

作为示例配置，

并避免把自己的真实公网服务地址直接提交到公开仓库。

---

# 🧩 为什么不使用后端？

Ahlson 的定位就是：

> **一个简单的服务入口，而不是一个服务监控平台。**

因此它不会强制集成：

* Docker API
* Kubernetes API
* NAS API
* 天气 API
* Jellyfin API
* 数据库
* 用户系统
* 后端管理面板

这样做的好处是：

* ⚡ 加载速度快
* 📦 部署简单
* 🔧 维护成本低
* 🔒 不需要暴露 Docker Socket
* 🌐 可以直接部署到静态托管
* 💻 不依赖 Node.js
* 🐳 不强制依赖 Docker

如果你只是需要：

> **“打开网页 → 找到服务 → 点击进入”**

那么一个纯静态 Homepage 就足够了。

---

# 🛠️ 技术栈

Ahlson 使用非常简单的 Web 技术：

```text
HTML5
CSS3
Vanilla JavaScript
JSON
localStorage
```

**零运行时依赖。**

核心 JavaScript 使用原生 DOM API 实现，项目不依赖 React、Vue、jQuery 等前端框架。

---

# 📱 浏览器支持

建议使用现代浏览器：

* Chrome
* Edge
* Firefox
* Safari

部分视觉效果使用了：

```text
backdrop-filter
CSS Grid
CSS Variables
HTML5 Drag & Drop
localStorage
```

较老的浏览器可能无法获得完整视觉效果。

---

# 🤝 自定义

你可以非常自由地修改：

### 网站名称

```json
{
  "site": {
    "title": "Ahlson"
  }
}
```

### 背景

替换：

```text
images/background.jpg
```

### 图标

将图标放入：

```text
icons/
```

然后在 `services.json` 中引用。

### 服务分类

例如：

```text
⭐ 常用
⌨ 开发
🗄 存储
⌘ 服务器
🤖 AI
▶ 媒体
☁ 云服务
✨ 其他
```

分类图标支持内置 Emoji 映射，也可以直接使用 Emoji。

---

# 📌 适合谁？

Ahlson 特别适合：

* 🏠 有家庭服务器的人
* 🖥️ NAS 用户
* 🐳 Docker 用户
* ☁️ 有公网服务器的人
* 🧑‍💻 开发者
* 🛠️ 自建服务爱好者
* 📦 拥有很多 Web 服务的人

如果你的浏览器书签已经变成这样：

```text
n8n
Portainer
Jellyfin
OpenWebUI
Alist
Nextcloud
Grafana
Prometheus
GitLab
Gitea
...
```

那么可以考虑把它们全部放进 Ahlson。

---

# ⭐ Roadmap

未来可以考虑加入：

* [ ] 更完善的服务搜索
* [ ] 自定义主题色
* [ ] 自定义布局
* [ ] 配置导入
* [ ] 配置备份 / 恢复
* [ ] 更丰富的图标支持
* [ ] PWA 支持
* [ ] 键盘快捷键
* [ ] 多配置文件
* [ ] 更完善的移动端体验

> Roadmap 不代表一定会实现，项目会尽量保持轻量。

---

# 📄 License

本项目采用 **MIT License**。

你可以自由地：

* 使用
* 修改
* 二次开发
* 自托管
* 商业使用

具体请以仓库中的 `LICENSE` 文件为准。

---

# ❤️ 致谢

Ahlson 的设计目标很简单：

> **少一点复杂功能，多一点真正好用。**

如果这个项目对你有帮助，欢迎：

⭐ Star
🍴 Fork
🐛 提交 Issue
💡 提交 Pull Request

---

<p align="center">
  Made with ❤️ for self-hosters.
</p>
