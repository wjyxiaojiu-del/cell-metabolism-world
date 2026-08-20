# Cell Metabolism World 交接文档

更新时间：2026-08-20

## 当前版本

本版本是在已有 `main` 历史之上新增的普通 Git 提交。推送不会覆盖旧提交，也不会改写远程历史；如需回退，可直接检出上一个提交，或使用 `git revert` 生成可追踪的回滚提交。

当前远程仓库：`https://github.com/wjyxiaojiu-del/cell-metabolism-world.git`

## 本次完成内容

- 校正 21 条核心通路的细胞器与区室归属。
- 补充 PDH 的 VDAC/MPC、尿素循环 ORNT1、肉碱穿梭 CACT、氧化磷酸化 ATP 合酶/ANT/磷酸载体等跨膜节点。
- 修正苹果酸-天冬氨酸穿梭、甘油磷酸穿梭和氨基酸碳骨架入口的反应数据。
- 将氨基酸碳骨架明确为七类中央代谢入口，增加乙酰乙酰-CoA 分支。
- 将核苷酸降解改为胞质核苷酸的去磷酸、补救回收、嘌呤/嘧啶降解，不再把它与溶酶体 DNA/RNA 水解混为一图。
- 修正专家模式整细胞、整线粒体、基质和内膜的视觉入口；通路机制图返回时先回到当前细胞器结构视图。
- 保留学习模式已有图片风格，并补齐运行时引用的独立教材机制图 WebP 资源。
- 收紧糖异生 ER 标题、糖原分解游离葡萄糖标签、尿素循环 ORNT1/ASS1 标签布局。

## 验证结果

- `npm run test:data`：通过。
- 专家地图科学几何门禁：21/21 条通路通过。
- 学习步骤链接：269 步，无法交互 0。
- 资源检查：36 个优化场景资源、22 个通路图标资源，无资源错误。
- 浏览器已验证专家导航、PDH、TCA、尿素循环、苹果酸-天冬氨酸穿梭、甘油磷酸穿梭、脂肪酸合成、核苷酸降解、肉碱穿梭和移动端入口。

完整 UI 套件在本次额度限制下没有继续跑完；后续接手者可运行：

```powershell
npm run test:ui
```

## 本地运行

```powershell
cd 'D:\wangjunyi\Documents\cell Metabolism world'
npm run preview
```

浏览器打开 `http://127.0.0.1:8000/index.html`。

## 重要文件

- `index.html`：专家/学习模式交互、机制叠加图与视觉入口。
- `scene-data.js`：通路到细胞器场景的归属和热点。
- `data/reactions/*.tsv`：可审计的反应与区室数据源。
- `data-compiled.js`：由数据源编译生成，不要手工编辑。
- `tools/check-expert-layout.js`：21 条核心通路的科学区室与几何门禁。
- `tools/expert-pathway-layout.js`：专家图人工布局覆盖。
- `cell-metabolism-assets/pathway-learning/`：学习模式运行时使用的优化机制图。

## 继续开发约定

1. 先改 `data/reactions/*.tsv` 或 `scene-data.js`，再运行 `node tools/compile.js`。
2. 专家地图改动后至少运行 `npm run test:data` 和相关 Playwright 用例。
3. 不要把 `debug.log`、`tools/__pycache__/`、`pathway-icons/pilots/`、`rejected/`、`replacements/` 实验文件加入正式提交。
4. 不要使用 `git push --force`；需要撤销时使用新提交或 `git revert`。
