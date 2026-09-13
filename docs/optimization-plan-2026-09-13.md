# 优化方案（2026-09-13）

基线：307/368 行有机器可识别证据（81%），249/308 已终审行证据闭合；CI workflow 已建未推送；性能剩余瓶颈 app.js（762KB 原始/162KB gzip）；负责人签核 12/42（2026-09-06 口径）。本方案按「是否依赖签核」分三个阶段，每项含做法、验证方式和风险。

## 阶段〇：现在就能做（零视觉风险，不碰运行时像素）

> **执行状态（2026-09-13 当日）**：0.1 已推送且 CI 全绿（data-gates + ubuntu UI 阻塞 + windows 可读性信息项）；0.2 证据覆盖 327→334/368（90.8%），已终审带证据 276/308，Reactome 通道已建成；0.3 钩子已建并加 versions --check；0.4 完成。另完成两件计划外项：发布构建管线（terser 最小化，126/126 对产物全绿，解析字节 -17%）与 pre-commit 自动 bump 缓存版本（关闭 30 天旧缓存缺口）。1.1 签核包工具、1.2 flaky 修复（5 连绿）、1.3 版本号脚本均已完成。

### 0.1 推送仓库并确认 CI 首跑
- 做法：`git push origin codex/map-polish`；打开 GitHub Actions 看 `gates` 两个 job（data-gates 约 3 分钟、ui-regression 约 12 分钟）。
- 验证：两个 job 绿；若 Playwright 安装浏览器失败，改用 `npx playwright install chromium --with-deps` 的输出定位。
- 风险：低。本地与 CI 环境差异（Windows→ubuntu）可能暴露路径/换行问题，属一次性修复。
- 注意：首跑若红，修复属于 CI 配置调整，不算地图质量改动。

### 0.2 剩余 61 行证据的分类收尾
做法（按三类分别处理）：
- Reactome 可覆盖（约 15–20 行）：为 fa_synthesis FAS 净反应、fa_elongation 延长净反应、tag 脂解 2 行、folate 叶酸→THF 净反应、autophagy 货物流行、aromatic_aa 剩余行跑 ContentService 搜索，选名称对应的通路 ID，沿用本轮「通路级证据，不表示单一反应」格式。`suggest-citations.js` 已支持 reactome 字段。
- 需要逐链长对应的脂质行（约 20 行）：为 tag/phospholipid/sphingolipid/plasmalogen/vlcfa 的通用模板行逐个查找 KEGG 具体链长代表反应（如 R01923→C16 的先例），备注显式声明链长口径；找不到的保持留空。
- 政策性留空（约 20 行）：机制未明转运、KEGG 表示与教学语义不合（FECH、果糖激酶 F1P 分支、植物 Fd 电子传递）保持留空，在 `data/review-log.tsv` 备注列写明「按政策不配数据库级引用」的理由，让留空成为显式决定而非欠账。
- 验证：每轮 `check-citations.js --online` 全绿 + `review-helper.js --write` 覆盖数上升 + 抽查 5 行备注语义。
- 风险：低。全部走已验证的写入流程；留空行只加台账注释不动引用。

### 0.3 本地预推送钩子
- 做法：提交 `hooks/pre-push`（跑 `npm run test:data`，约 90 秒），README 写一行启用说明 `git config core.hooksPath hooks`。
- 验证：故意改坏一个 TSV，push 被拒。
- 风险：无。本地可选，不影响 CI。

### 0.4 文档小收口
- `README.md` 的目录结构表加 `.github/workflows`、`.gitattributes`；`HANDOFF-WEEK5-CLOSEOUT.md` 已过时（签核 0/42），改为指向 `docs/map-polish/owner-signoff.md` 的实时口径，避免双源矛盾。
- 验证：通读一遍无数字矛盾。

## 阶段一：签核期并行项（配合 12/42 → 42/42）

### 1.1 签核加速工具（最值得做的非代码优化）
- 做法：新增 `tools/generate-signoff-packet.js --pathway=<id>`：读取 `docs/map-polish/audit-register.md` 的评分、`evidence/learning|expert/<id>/` 的三档截图清单、`data/review-log.tsv` 的该通路证据状态，生成一页 markdown（内嵌相对路径图片引用），负责人核对后只在 `owner-signoff.md` 填一行日期。
- 验证：对已签核的 12 对生成回溯清单，与 owner-signoff.md 记录比对无出入。
- 风险：零（只读工具）。

### 1.2 已知 flaky 用例治理
- 背景：roadmap 记录 `ui-topic-network` 一次 `nodeCount=0` 采样失败（单跑通过）。
- 做法：定位该用例的等待条件（网络采样前未等渲染稳定），把轮询改成 `expect.poll` 显式条件；若确属环境抖动，在 playwright.config 对该 spec 加 `retries: 1` 并注明原因。
- 验证：连续 5 次 `npx playwright test tests/ui-topic-network.spec.js` 全绿。
- 风险：低。改动限于测试文件。

### 1.3 缓存版本号自动化
- 现状：index.html 的 `?v=` 靠手工 sed 递增，漏 bump 会让 iPad 拿 30 天旧缓存。
- 做法：新增 `tools/bump-cache-versions.js`：对比 git HEAD 与工作区的 data-compiled.js/app.js/main.css/scene-data.js 摘要，有变的自动递增 index.html 对应 `?v=YYYYMMDD-N`；挂进 `npm run stats` 或作为独立 `predeploy` 脚本。
- 验证：改一个 TSV→重编译→跑脚本→index.html 版本号变化且其他不变。
- 风险：低。纯构建脚本。

## 阶段二：签核 42/42 后、Beta 门禁前（改像素/行为，需批量重拍证据）

### 2.1 性能第二轮（一次改动，一次重拍）
按收益排序，全部打包进同一轮改动，然后一次性重拍 126 张 final 证据（`capture-map-polish.js` 有现成流程，机器时间约 1–2 小时）：
- app.js 最小化：引入 terser 作为可选构建（`npm run build`，产出 `scripts/app.min.js`，index.html 引用之；源码保持可读）。预期 762KB→约 380KB 原始、gzip 162→约 95KB。
- app.js 按模式拆分：专家模式逻辑（约 1/3 体量）延迟到切换时动态 import 或独立脚本。预期首屏脚本再减约 200KB 原始。这是结构性改动，126 项 UI 回归是安全网。
- 首屏封面重编码：01-home-cell-cover.webp（372KB）以质量 78 重出，预计 250KB 左右，肉眼应无差异。
- main.css 体检：用 Chrome DevTools coverage 跑五个主题页面，统计未命中规则；只删覆盖率 0% 且明显废弃的块（预计能砍 5–15%），删除后跑全量 UI 回归。
- 验证：重拍前后用 Playwright 节流脚本对比（沿用本次 DCL/LCP 指标），并在 390/768/1440 三档人工抽查封面与地图渲染。
- 风险：中。全部被 126 项回归 + 三档新证据覆盖；任一用例失败即回滚该子项。

### 2.2 可访问性审计（第 8 周 Beta 门禁项）
- 做法：引入 `@axe-core/playwright`，对封面、学习地图、专家地图、详情面板写 4 个 spec（390/1440 两档），先跑出基线违规清单，再逐条修（焦点顺序、aria-label、对比度）。
- 验证：axe 扫描 critical 违规归零；键盘可完成「进入学习模式→选专题→进地图→返回」全流程。
- 风险：中。a11y 修复可能改 DOM 结构，需要与 2.1 同轮重拍证据。

### 2.3 部署与回滚演练
- 做法：把部署文档的手工步骤脚本化（`tools/deploy-release.sh`：打包→上传→远端解包→`nginx -t`→本机验证关键 200→输出切换/回滚命令但不自动切换）；预压缩 `.gz`（nginx `gzip_static on`）减少线上 CPU。
- 验证：对 staging 目录完整演练一次切换+回滚，公网三档视口冒烟脚本化。
- 风险：低。不自动切换，保持现行治理。

## 阶段三：Beta 验证期

- 受控教学验证材料：5–8 人的任务脚本（三条预定任务：初学者沿学习地图走通一条主线；专业用户确认一条通路的区室/方向；查找一个参与物的跨通路场景）、任务完成度记录表、匿名反馈表。不收集身份信息，不加后端。
- 崩溃遥测：当前无后端，保持零遥测；验证期用人工记录即可，不加埋点（符合「不默认收集信息」的治理语言）。

## 明确不做（含理由）

- 框架/打包器迁移：roadmap 明令禁止，收益不抵风险。
- data-compiled.js 按通路懒加载：gzip 后仅 85KB，解析收益小，代价是加载逻辑复杂化和证据重拍，不值。
- main.css 全面重写：405KB 是真实规则量，重写必改视觉，触发全量重拍。
- 签核完成前任何改像素的优化：126 张 final 证据作废，违背质量门槛顺序。
- 给页面加遥测/埋点：治理语言明确不默认收集信息。

## 推荐执行顺序

1. 0.1 推送 + CI 首跑确认（半小时）
2. 0.2 证据分类收尾（1–2 个工作日，可与 1.1 并行）
3. 1.1 签核加速工具 + 1.2 flaky 治理 + 1.3 版本号脚本（各半天）
4. 主线：负责人签核 12/42 → 42/42（唯一正式门槛）
5. 签核完成：2.1+2.2 合并一轮改完、一次重拍，然后 2.3 部署演练
6. 3.x 验证材料
