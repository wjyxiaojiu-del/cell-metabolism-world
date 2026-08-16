// 共享视口数学层：只负责“算”，不碰 DOM。
// 三种画布（专家地图 viewBox、专题图 scroll/scale、单通路图 scroll/scale）
// 共用这里的缩放/居中/夹取逻辑，但各自保留自己的渲染机制。
// 同时支持 CommonJS（Node 测试）与浏览器全局（index.html 加载）。
(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.CMW_VIEWPORT_CORE = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function clampZoom(value, min, max) {
    return Math.round(clamp(value, min, max) * 100) / 100;
  }

  // 单轴滚动缩放：保持 anchor（默认视口中心）对应的内容点不动。
  function zoomScrollOffset({ scroll = 0, clientSize = 0, nextZoom = 1, fromZoom = 1, anchor }) {
    const from = fromZoom || 1;
    const anchorOffset = anchor === undefined ? clientSize / 2 : anchor;
    const contentPoint = anchorOffset + scroll;
    return Math.max(0, contentPoint * (nextZoom / from) - anchorOffset);
  }

  // 双轴滚动缩放：返回新的 zoom/scrollLeft/scrollTop。
  function zoomScrollState({ zoom = 1, scrollLeft = 0, scrollTop = 0, clientWidth = 0, clientHeight = 0, nextZoom = 1, anchorX, anchorY }) {
    return {
      zoom: nextZoom,
      scrollLeft: zoomScrollOffset({ scroll: scrollLeft, clientSize: clientWidth, nextZoom, fromZoom: zoom, anchor: anchorX }),
      scrollTop: zoomScrollOffset({ scroll: scrollTop, clientSize: clientHeight, nextZoom, fromZoom: zoom, anchor: anchorY })
    };
  }

  // 滚动式画布的“适配到视口”缩放。
  function fitScrollZoom({ baseWidth = 0, baseHeight = 0, clientWidth = 0, clientHeight = 0, paddingX = 24, paddingY = 24, maxZoom = 1 }) {
    if (!baseWidth || !baseHeight) return maxZoom;
    const zoomX = (clientWidth - paddingX) / baseWidth;
    const zoomY = (clientHeight - paddingY) / baseHeight;
    return Math.min(zoomX, zoomY, maxZoom);
  }

  // viewBox 画布：围绕用户坐标中的某个点缩放。
  function zoomViewBoxAtPoint(view, factor, point, { minW = 420, maxW = 1900, aspectRatio = .75 } = {}) {
    const nw = clamp(view.w * factor, minW, maxW);
    const nh = nw * aspectRatio;
    const rx = (point.x - view.x) / view.w;
    const ry = (point.y - view.y) / view.h;
    return { x: point.x - rx * nw, y: point.y - ry * nh, w: nw, h: nh };
  }

  // viewBox 画布：把视图夹取到允许范围内。
  function clampViewBox(view, base, { outerPadding = 40, overviewPaddingX = 110, overviewPaddingY = 90 } = {}) {
    const x = view.w >= base.w
      ? clamp(view.x, -overviewPaddingX, overviewPaddingX)
      : clamp(view.x, -outerPadding, base.w - view.w + outerPadding);
    const y = view.h >= base.h
      ? clamp(view.y, -overviewPaddingY, overviewPaddingY)
      : clamp(view.y, -outerPadding, base.h - view.h + outerPadding);
    return { x, y, w: view.w, h: view.h };
  }

  return Object.freeze({
    clamp,
    clampZoom,
    zoomScrollOffset,
    zoomScrollState,
    fitScrollZoom,
    zoomViewBoxAtPoint,
    clampViewBox
  });
});
