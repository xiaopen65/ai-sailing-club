# 部署说明

## 线上地址

GitHub Pages：

```text
https://xiaopen65.github.io/ai-sailing-club/
```

仓库：

```text
https://github.com/xiaopen65/ai-sailing-club
```

## 站点结构

这是一个纯静态多页面站，不需要构建：

```text
index.html        首页
route.html        学习
cases.html        赋能
test.html         能力测试
report.html       能力报告
exchange.html     交流
about.html        关于
assets/           CSS / JS / 图片
demo/             可在线运行的 Demo
version.json      版本号
```

## 发布新版本

1. 修改页面 / 数据 / 样式。
2. 把 `version.json`、页面资源版本号、`assets/js/update.js` 的 `BUILD` 改成同一个版本号。
3. 提交并推送 `main` 分支。
4. GitHub Pages 会自动重新发布。

```bash
git add .
git commit -m "update site"
git push
```

## 本地预览

不要用 `file://` 作为最终预览，尽量用本地 HTTP 服务：

```bash
npx serve .
```

或：

```bash
python -m http.server 8080
```

## 本地编辑模式

`edit-server.mjs` 和两个 `.bat` 文件是本地工具，GitHub Pages 不会运行它们。线上访客看不到编辑入口。

本地编辑仍然使用：

```text
打开案例库.bat   浏览
编辑文案.bat     编辑并写回 edits.js
```

## 内容备份

部署前备份：

```text
D:\桌面\AI案例库\备份与归档\AI案例库-部署前备份-20261106-105.zip
D:\桌面\AI案例库\备份与归档\AI案例库-部署完成备份-20261106-107.zip
D:\桌面\AI案例库\备份与归档\AI案例库-更新前备份-20261106-107.zip
D:\桌面\AI案例库\备份与归档\AI案例库-部署完成备份-20261106-109.zip
```

浏览器内容导出备份：

```text
D:\桌面\AI案例库\备份与归档\内容备份-20261106-1926.json
```

> 当前版本已用 2026-11-14 22:39 导出的内容备份烘焙进 `edits.js` 和学习地图课程；晚于这个时间的浏览器修改仍需重新导出 / 导入。案例课链接和卡片标签属于 localStorage 数据，尚未迁移进 `data.js`。

## 内测访问

GitHub Pages 默认公开，链接可被知道链接的人访问。若需要邮箱白名单，可把仓库接到 Cloudflare Pages，并开启 Cloudflare Access。