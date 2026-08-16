# 细胞代谢世界｜当前交接文档

更新时间：2026-08-13（交接前重新复核）  
项目目录：`D:\wangjunyi\Documents\cell Metabolism world`  
生产地址：`https://cell.xiaojiu.pw/`  
生产主机：`root@47.114.72.251`  
当前线上 release：`/var/www/cell.xiaojiu.pw/releases/20260813T160643Z`  

## 一、先看结论

产品的学习模式、专家地图新框架、访问量和实时在线人数均已完成并上线，但当前不能视为“发布闭环完成”。交接时有两个明确的 P0：

1. **线上当前 release 的 `cell-metabolism-assets/optimized/` 是空目录，学习模式引用的优化图片返回 404。** 本地目录有 48 个文件，说明源码资产还在，问题发生在发布打包或复制步骤。
2. **最新完整 UI 回归为 62/63，通过 62 条、失败 1 条。** 失败项是 390px 移动端顶栏：测试预期只有 1 个可见按钮，实际有 2 个 38px 按钮。该回归出现在访问统计接入之后。

主页和统计服务当前可访问：主页 GET 为 200，`GET /api/stats` 为 200；交接复核时接口返回 `visits=4`、`online=0`、在线窗口 75 秒。访问数和在线数会随实际访问变化，不应把这里的瞬时数字当固定基线。

## 二、产品范围与已确认边界

- 专家地图的产品入口固定为 **21 条核心通路 + 1 个总览**。
- 数据和审校范围仍是 55 条通路；55 是数据覆盖范围，不是需要同时铺在导航里的 UI 数量。
- 用户已明确：**专家地图不准备适配手机**，桌面端教学可读性优先。不要继续为专家地图做手机压缩布局。
- 学习模式可以保留基本移动端可用性，现有移动端顶栏回归仍需修复。
- 不要恢复教材式“一次把所有节点、酶、连线铺满”的表达。学生必须先能看出主线，再按需展开反应和酶。

## 三、本轮已经完成

### 1. 学习模式

- 学习模式已完成此前的精简与教学表达优化。
- 当前共有 269 个学习步骤。
- 170/170 条学生解释通过可读性门禁。
- 122/170 条解释已经人工细化；其余仍需科学和教学复核。
- 本地优化素材目录现有 48 个文件，约 10.76 MB，素材检查通过。

### 2. 专家地图

- 总览改为“先选问题，再看通路”的工作台，不再默认展示一团密集网络。
- 入口按四个学习问题组织，底部保留 21 条核心通路 dock。
- 聚焦具体通路后增加教学摘要：入口、出口、区室和阅读顺序。
- 主线优先显示；酶标签、细节反应降为第二或第三阅读层。
- 此方向已经明显改善总览逻辑，但 21 条通路仍需逐条做人工教学验收，尤其是高密度和跨区室通路。

### 3. 访问量与实时在线人数

- 顶栏已增加访问次数和实时在线人数显示。
- 前端接口：
  - `GET /api/stats`
  - `POST /api/visit`
  - `POST /api/heartbeat`
- 客户端优先使用 `sendBeacon`，并保留 `fetch`；浏览器本地存储不可用时有降级处理。
- localhost 和 `file:` 环境不会向静态测试服务器发送统计 POST，避免 Playwright 出现无意义的 501。
- 服务端脚本：`tools/metrics-server.js`。
- 生产数据文件：`/var/lib/cell-metabolism/metrics.json`。
- 在线判定窗口：75 秒；心跳停止后用户会从在线数中自然移除。

## 四、当前生产状态

### 正常项

- `https://cell.xiaojiu.pw/`：200。
- `GET https://cell.xiaojiu.pw/api/stats`：200。
- Nginx 站点配置实际位于：`/etc/nginx/conf.d/cell.xiaojiu.pw.conf`。
- 站点根目录：`/var/www/cell.xiaojiu.pw/current`，该路径为 release 软链接。
- 统计服务单元：`cell-metabolism-metrics.service`。
- 线上统计服务当前实际运行命令：

```text
/usr/bin/node /var/www/cell.xiaojiu.pw/current/tools/metrics-server.cjs
```

- 线上服务当前实际用户为 `root`，服务已启动并能返回统计数据。

### P0：线上优化图片缺失

交接复核发现当前 release 的以下目录为 0 个文件：

```text
/var/www/cell.xiaojiu.pw/current/cell-metabolism-assets/optimized/
```

已实测以下链接为 404：

```text
https://cell.xiaojiu.pw/cell-metabolism-assets/optimized/tca-cycle-overview-annotated.webp
https://cell.xiaojiu.pw/cell-metabolism-assets/optimized/etc-summary-full-chain.webp
```

本地同目录有 48 个文件，因此不要重新生成或删除源素材；应修复发布包复制范围，创建新 release，完整复制优化目录，校验后再切换 `current`。

### 配置漂移：仓库 service 模板不能直接覆盖线上

仓库文件 `deploy/cell-metabolism-metrics.service` 当前仍写着：

```text
ExecStart=.../tools/metrics-server.js
User=www-data
Group=www-data
```

它与生产实际配置不一致，并且直接使用会失败：

- 服务器没有 `www-data` 用户，Nginx 用户是 `nginx`。
- `/var/package.json` 含 `"type":"module"`，CommonJS 的 `require()` 脚本若用 `.js` 扩展名会启动失败；线上临时使用 `.cjs`。

下一次部署前必须先统一模板和线上方案。建议使用 `nginx` 用户运行统计服务，并明确给 `/var/lib/cell-metabolism/` 最小写权限；如果继续使用 CommonJS，就把仓库脚本和 service 都统一为 `.cjs`。在模板未修复前，不要把仓库 service 原样复制到 `/etc/systemd/system/`。

## 五、最新验证结果

### 数据门禁

2026-08-13 重新运行 `npm run test:data`：**通过**。

当前检查快照：

- 55 个反应文件。
- 337 条反应。
- 298 个节点。
- 55 条数据通路。
- 专家地图几何门禁 55/55 通过。
- 本地优化素材 48 个，无本地素材错误。
- 269 个学习步骤。
- 学生解释 170/170 可读。
- 人工细化 122/170。
- 待审校 53 条。
- `STATS.md` 与当前数据一致。

### UI 回归

2026-08-13 在当前源码重新运行完整 `npm run test:ui`：**62/63 通过，1 条失败**。

失败测试：

```text
tests/ui-topbar-alignment.spec.js:64
learning navigation uses a clean two-row mobile layout
```

具体差异：

```text
预期 buttonHeights: [38]
实际 buttonHeights: [38, 38]
```

即 390×844 视口下，多显示了一个顶栏按钮。修复后必须重跑完整 UI，不能只跑该单测并宣称回归闭环。

此前专家地图专项测试曾达到 12/12，通过的是布局、导航、韧性和 21 条核心通路聚焦；它不能替代本次完整 UI 的 62/63 结果。

## 六、接手后的处理顺序

### P0-1：恢复线上优化图片

1. 以当前 release 为基础创建一个新 release，不要直接在 `current` 中长期热修。
2. 把本地 `cell-metabolism-assets/optimized/` 的 48 个文件完整加入发布包。
3. 切换前检查新 release 中确实有 48 个文件，并检查页面实际引用的每个本地资源都存在。
4. 切换 `current` 后，至少验证 TCA、ETC、学习模式封面和随机 3 张图均返回 200。
5. 再用浏览器进入学习模式，确认图片不是只有 URL 200，而是能正常渲染。

### P0-2：统一统计服务部署方式

1. 把脚本扩展名、service 的 `ExecStart` 和发布包文件名统一。
2. 把 service 用户从不存在的 `www-data` 改为服务器实际用户方案。
3. 给统计数据目录单独设置最小写权限，不要依赖 root 才能运行。
4. 运行 `systemd-analyze verify`、`systemctl daemon-reload`、重启服务并检查日志。
5. 实测一次新访客：访问数应加 1；75 秒内在线数应至少为 1，停止心跳后应回落。

### P0-3：修复移动端顶栏回归

重点检查访问统计接入后 `.top-actions` 内可见按钮数量、移动端隐藏规则和测试选择器边界。修复后运行：

```powershell
npx playwright test tests/ui-topbar-alignment.spec.js --reporter=line
npm run test:ui
```

验收目标必须是完整 63/63，而不是只让截图看起来正常。

### P1：继续专家地图的教学化验收

不要继续大改总览框架。按 21 条核心通路逐条验收，优先处理：

- 呼吸电子传递链与氧化磷酸化。
- 糖异生与糖酵解跨区室主线。
- 嘌呤、嘧啶与核苷酸降解。
- 脂肪酸合成、肉碱穿梭和 β-氧化。
- 苹果酸-天冬氨酸穿梭等跨膜路径。

每条通路统一检查：入口在哪里、主线按什么顺序读、最终产物是什么、在哪些区室发生、哪些酶应默认隐藏、是否出现不合逻辑的长距离回线或重复节点。

### P1：完成剩余教学解释与科学审校

当前还有 48 条解释未人工细化，53 条审校项未完成。优先补齐专家地图最难理解的核苷酸与脂质代谢，再处理低密度通路。

## 七、常用检查命令

本地完整验证：

```powershell
cd 'D:\wangjunyi\Documents\cell Metabolism world'
npm run test:data
npm run test:ui
```

本地预览：

```powershell
npm run preview
```

生产接口检查：

```powershell
Invoke-WebRequest 'https://cell.xiaojiu.pw/' -UseBasicParsing
Invoke-RestMethod 'https://cell.xiaojiu.pw/api/stats'
Invoke-WebRequest 'https://cell.xiaojiu.pw/cell-metabolism-assets/optimized/tca-cycle-overview-annotated.webp' -UseBasicParsing
```

服务器只读检查：

```bash
readlink -f /var/www/cell.xiaojiu.pw/current
find /var/www/cell.xiaojiu.pw/current/cell-metabolism-assets/optimized -maxdepth 1 -type f | wc -l
systemctl status cell-metabolism-metrics.service --no-pager
journalctl -u cell-metabolism-metrics.service -n 100 --no-pager
nginx -t
```

发布前必须检查：

```text
新 release 文件完整
optimized 文件数为 48
index.html 与脚本缓存版本一致
统计脚本文件名与 service 一致
npm run test:data 通过
npm run test:ui 63/63 通过
nginx -t 通过
主页、API、关键图片均为 200
回滚 release 路径已记录
```

## 八、不要误改的内容

- 不要把 55 条通路全部加进专家导航。
- 不要再为专家地图做手机适配；用户明确不需要。
- 不要把酶名、每条支线和每个反应默认全部展开。
- 不要覆盖或删除源 PNG；运行时 WebP 与源素材分开保存。
- 不要因为主页 200 就判断发布成功，必须检查静态资源、API 和浏览器渲染。
- 不要把仓库里的旧 service 模板直接覆盖线上。
- 不要直接修改持久统计 JSON 来伪造访问数。
- 不要在完整测试未通过时写“全部完成”。

## 九、交接状态

当前产品方向已经从“密集代谢网络”转向“可教学的专家工作台”，学习模式也已进入精修阶段。最紧急的不是继续增加功能，而是先恢复线上优化图片、统一统计服务部署配置、清掉最后一条 UI 回归。完成这三个 P0 并重新得到完整绿灯后，再继续逐条打磨 21 条专家通路。

## 十、2026-08-13 专家地图接手进展

> 本节是专家地图当前最新快照；覆盖上文“专家专项 12/12”和“21 条仍需逐条验收”等旧数字。未部署。

### 1. 本轮范围与边界

- 专家导航仍固定为 21 条核心通路 + 重点总览；55 条只用于数据、几何和审校门禁。
- 桌面教学可读性优先，不增加手机适配范围。
- 不修改反应 TSV、`data/review-log.tsv` 或 `REVIEW_PROGRESS.md`。

### 2. 已完成的教学层

- 21 条核心通路均有独立的“目的、入口、出口、区室、读图顺序”合同。
- 默认只显示主线；酶名可由真实路线悬停预览，“显示酶与细节”再展开教学支路和详情实体。
- 隐藏的详情路线、实体和酶退出键盘焦点；展开后恢复交互，切换通路或清空选择时统一重算状态。
- 展开氨基酸碳骨架详情时重新取景，把线粒体延伸节点纳入桌面可见区；关闭后恢复主线优先。

### 3. 科学与拓扑修复

- ETC 主线以质子动力势和水收束；ATP 合成与 ANT 交给氧化磷酸化通路说明。
- 糖异生补齐 DHAP 作为醛缩酶第二底物，并明确细胞质、线粒体、内质网腔的读图顺序。
- 嘌呤主线停在 AMP/GMP，ATP/GTP 作为核苷酸池扩展；核苷酸降解的分类点线不再伪装为单一反应。
- 嘧啶通路明确 DHODH 的线粒体内膜定位；dUDP/dTMP 为按需展开层。
- 氨基酸碳骨架保留 1→6 主分支，跨区室和后续中央代谢连接移入教学详情；线粒体 α-酮戊二酸坐标为 `(570,700)`，当前几何门禁通过。

### 4. 当前验证结果

- `npm run test:data`：通过；55 个反应文件、337 条反应、298 个节点，专家几何 55/55，资源 48/48，审校台账一致，`STATS.md` 为当前生成物。
- 专家 UI 文件现为 8 个测试，项目统计为 65 个浏览器测试。
- 2026-08-13 在清理遗留浏览器进程后，专家布局 / 导航 / 韧性专项完整通过：14/14，耗时 1.9 分钟。
- `npm run test:ui` 已完整跑完：64/65，耗时 5.2 分钟。专家地图相关 14 项全部通过；唯一失败为既有的 `ui-topbar-alignment.spec.js` 手机顶部栏断言。
- 失败现场为 390×844 学生模式：实际显示“清除选择”和“专家地图”两个 38px 按钮，旧断言要求只显示一个。根因是移动端 CSS 使用 `.top-actions .btn:first-child`，但 `.top-actions` 的首个子元素已经是 `.site-metrics`，所以没有任何 `.btn` 匹配 `:first-child`。该问题不属于专家地图桌面适配范围，本轮只记录、不修改。

### 5. 浏览器实测与截图

- 已用真实 Playwright 浏览器检查 ETC 主线、ETC 详情和糖异生教学摘要；主线默认无酶名堆叠，详情开关可工作。
- 截图：`output/playwright/expert-takeover-etc-main.png`、`output/playwright/expert-takeover-etc-details.png`。

### 6. 文件与后续

- 产品源码：`index.html`、`tools/expert-map-geometry.js`、`tools/expert-pathway-layout.js`。
- 测试：`tests/ui-expert-layout.spec.js`、`tests/ui-expert-navigation.spec.js`。
- 生成物：`data-compiled.js`、`STATS.md`。
- 本地预览改用 `tools/serve-static.js`；`package.json` 和 `playwright.config.js` 已同步，避免依赖当前损坏的 Python 启动器。
- 接手前备份在 `delivery/backups/expert-map-20260813-takeover/`，其中包含本交接文档的原始版本。
- 下一步若授权处理手机导航，可将选择器改为精确隐藏目标按钮并重跑 65 项；随后再处理上文生产 P0。仍保持不部署边界。
