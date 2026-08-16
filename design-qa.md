# ETC 五站机制图设计 QA

## 比较目标

- 用户原图：
  - 第 1 站：`C:\Users\wangjunyi\Downloads\canvas-image-image-1786457999763-ub9nw.png`
  - 第 2 站：`C:\Users\wangjunyi\Downloads\canvas-image-MO11_fNSdWj2ixTtGLn-l.png`
  - 第 3 站：`C:\Users\wangjunyi\Downloads\canvas-image-QuAo6G0h5k3OQJdYEVL5W.png`
  - 第 4 站：`C:\Users\wangjunyi\Downloads\canvas-image-hseuAZ4uEk1yYM6YKss9-.png`
  - 第 5 站：`C:\Users\wangjunyi\Downloads\canvas-image-yhr7DQByYt-V9f13lEDKb.png`
  - 复合体 II 补充：`C:\Users\wangjunyi\Downloads\canvas-image-DxSZ4C_GXuCTCqEwv9_9o.png`
  - 呼吸链全景：`C:\Users\wangjunyi\Downloads\canvas-image-YLCWXOQGo-Lhd0NTF65n9.png`
- 浏览器完整组件截图：`output/playwright/etc-progressive-mechanism.png`
- 五站图片区域截图：`output/playwright/etc-stage-1-image.png` 至 `etc-stage-5-image.png`
- 五站并排对照：`output/playwright/etc-five-stage-asset-comparison.png`
- 补充区组件截图：`output/playwright/etc-supplementary-complex-ii.png`、`output/playwright/etc-supplementary-overview.png`
- 补充区并排对照：`output/playwright/etc-supplementary-comparison.png`
- 状态：学习模式 → 电子传递链 → 五个站点分别激活。

## 尺寸与归一化

- 浏览器 CSS 视口：1440 × 1024；deviceScaleFactor：1。
- 第 1–3 站原图：3200 × 2400；网页 WebP：2400 × 1800。
- 第 4–5 站原图及网页 WebP：2048 × 1152。
- 两张补充原图：2048 × 1152；网页 WebP：2400 × 1350（源文件实际像素更高，优化器限制最长边为 2400）。
- 网页可见图片槽：556 × 331 CSS px。
- 归一化方式：使用 `object-fit: cover`，中心裁切原图的外层空白；没有拉伸图片，也没有裁断主要复合体、电子、H⁺、底物或产物。

## Findings

- P0：无。
- P1：无。
- P2：无剩余项。五张机制图均使用用户原始图像，不存在占位图或代码绘图替代。

## 五个必查表面

- 字体与层级：网页标题、站点、说明和净结果继续使用现有学习模式字体系统；图片内文字保持为原图组成部分，没有重复覆盖。
- 间距与布局：图片槽、说明面板和三段因果步骤保持同一网格；五站切换不改变组件高度。
- 颜色与视觉令牌：网页蓝灰色与插图的冰蓝膜结构、深蓝当前复合体和珊瑚橙 H⁺ 保持一致。
- 图片质量：原图保留在 `cell-metabolism-assets/source-user-2k/`；运行时 WebP 五张合计约 0.51 MB，边缘和文字在当前显示尺寸下清晰。
- 补充素材：两张 WebP 约 0.23 MB；全套 ETC 七张网页图约 0.74 MB。
- 文案内容：网页的输入、关键变化、下一步准备和净结果与每张图的机制一致；第 2、3 站分别对应复合体 III 和 IV。

## 完整与聚焦证据

- 完整组件：`output/playwright/etc-progressive-mechanism.png` 显示站点导航、图像、说明、因果步骤和前后按钮均在首个组件视图内。
- 聚焦对照：`output/playwright/etc-five-stage-asset-comparison.png` 将五张用户原图与网页实际裁切置于同一张图中；主要机制全部保留，裁切只减少外层空白，因此无需额外局部放大图。
- 补充区对照：`output/playwright/etc-supplementary-comparison.png` 同时展示两张原图及其卡片落地状态；图片没有被拉伸或重绘，网页文字只承担教学解释。

## 比较历史

1. 初次替换后，第 1–3 站的 4:3 图片使用 `contain`，主体在网页槽中偏小（P2）。修复为中心 `cover` 裁切；复查显示主体放大且无关键内容缺失。
2. 点击下一站后，固定顶部栏会覆盖组件标题（P2）。为 `.etc-mechanism` 添加 `scroll-margin-top: 112px`；复查截图中标题与进度完整可见。
3. 第 5 站在自动截图的瞬间可能短暂出现空白（P2）。预加载五张 WebP，并在回归测试中等待 `currentSrc` 与 `decode()`；复查显示 ATP 合酶图片稳定出现。
4. 补充区最初整段截图超过单个浏览器视口，证据图下部被捕获工具截断（QA 证据问题，不是页面裁切）。改为分别捕获复合体 II 卡片和全景卡片；两张卡片均完整显示，无内容溢出。

## 交互与工程检查

- 五站前进、后退、直接点击及键盘方向键逻辑保持可用。
- 第 5 站结束后可以展开补充区；补充区默认收起，并提供继续进入完整反应图的按钮。
- ETC 专项浏览器测试：1/1 passed。
- 资源检查：错误 0。

final result: passed
