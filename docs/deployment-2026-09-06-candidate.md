# 2026-09-06 候选 Release 部署记录

## 状态

- 站点：`https://cell.xiaojiu.pw`
- 候选 release：`/var/www/cell.xiaojiu.pw/releases/20260906T082505Z`
- 当前线上 release：`/var/www/cell.xiaojiu.pw/releases/20260820T132521Z`
- 激活状态：未激活。负责人签核当前为 12/42，未达到第 6 周 42/42 门槛，因此没有切换 `current`。

## 部署内容

- 仅上传浏览器运行所需的 HTML、CSS、JavaScript 和优化资源。
- 候选目录包含 109 个文件，磁盘占用约 28 MB。
- 本地压缩包 SHA-256：`4e59866f218953f045c2ec9611287ec0af03374893b2185fde28bc01b05ea165`。
- 远端压缩包 SHA-256 与本地一致；解包后目录权限为 755，文件权限为 644。
- 静态资源缓存版本统一为 `20260906-1`。

## 验证结果

- 部署前 `npm test`：退出码 0，Playwright 121/121 通过（9.7 分钟）。
- `nginx -t`：通过。
- 候选目录使用服务器本机独立 HTTP 服务验证，以下资源均返回 200：
  - `index.html`
  - `styles/main.css`
  - `scripts/app.js`
  - `scene-data.js`
  - `data-compiled.js`
  - `student-step-resolver.js`
  - 首页图、PDH 图标和糖酵解学习图
- 公网站点在未切换情况下仍返回 200。

## 后续激活门槛

只有负责人签核达到 42/42、最终负责人审计通过并再次完成全量回归后，才允许把 `current` 原子切换到本候选 release。切换后还需执行公网关键资源、三档视口和控制台错误检查；失败时立即恢复到 `20260820T132521Z`。
