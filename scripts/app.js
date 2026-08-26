      (() => {
      // #0 ── DOM 引用捕获 ────────────────────────────────────────────────
      const app = document.getElementById('app');
      const svg = document.getElementById('viewport');
      const mapStage = document.getElementById('mapStage');
      const image = document.getElementById('cellImage');
      const mapGesturePreview = document.getElementById('mapGesturePreview');
      const mapGesturePreviewContent = document.getElementById('mapGesturePreviewContent');
      const mapGesturePreviewImage = document.getElementById('mapGesturePreviewImage');
      const fallback = document.getElementById('imageFallback');
      const syncViewportMode = () => {
        const compact = window.matchMedia('(max-width: 760px)').matches;
        svg.setAttribute('preserveAspectRatio', compact ? 'xMidYMid slice' : 'xMidYMid meet');
        const tabletTouch = (navigator.maxTouchPoints > 0 && navigator.maxTouchPoints <= 5)
          || (navigator.maxTouchPoints > 0
            && window.matchMedia('(pointer: coarse)').matches
            && window.matchMedia('(hover: none)').matches);
        document.body.classList.toggle(
          'tablet-touch',
          tabletTouch && window.matchMedia('(min-width: 700px) and (max-width: 1366px)').matches
        );
      };
      window.addEventListener('resize', syncViewportMode);
      window.addEventListener('resize', () => requestAnimationFrame(syncSceneExpertOverlayGeometry));
      syncViewportMode();
      const context = document.getElementById('context');
      const searchInput = document.getElementById('search');
      const searchStatus = document.getElementById('searchStatus');
      const topbarContent = document.getElementById('topbarContent');
      const topbarCollapseToggle = document.getElementById('topbarCollapseToggle');
      const topbarRevealZone = document.getElementById('topbarRevealZone');
      const topbarRevealButton = document.getElementById('topbarRevealButton');
      const appFullscreenToggle = document.getElementById('appFullscreenToggle');
      const inspector = document.getElementById('inspector');
      const inspectorVisual = document.getElementById('inspectorVisual');
      const inspectorVisualImage = document.getElementById('inspectorVisualImage');
      const inspectorVisualTitle = document.getElementById('inspectorVisualTitle');
      const inspectorVisualCaption = document.getElementById('inspectorVisualCaption');
      const pathNoteCopy = document.querySelector('.path-note-copy');
      const expertPathPreview = document.getElementById('expertPathPreview');
      const expertPathPreviewImage = document.getElementById('expertPathPreviewImage');
      const expertPathPreviewTitle = document.getElementById('expertPathPreviewTitle');
      const expertPathPreviewCaption = document.getElementById('expertPathPreviewCaption');
      const pathFocusStats = document.getElementById('pathFocusStats');
      const atlas = window.METABOLIC_ATLAS_DATA || { pathways: {}, scenes: {} };
      const sceneDeck = document.getElementById('sceneDeck');
      const sceneBackground = document.getElementById('sceneBackground');
      const sceneExpertOverlay = document.getElementById('sceneExpertOverlay');
      const sceneExpertOverlayLayer = document.getElementById('sceneExpertOverlayLayer');
      const sceneTitle = document.getElementById('sceneTitle');
      const sceneSubtitle = document.getElementById('sceneSubtitle');
      const sceneLevelHint = document.getElementById('sceneLevelHint');
      const sceneDescription = document.getElementById('sceneDescription');
      const sceneViews = document.getElementById('sceneViews');
      const sceneHotspots = document.getElementById('sceneHotspots');
      const sceneSource = document.getElementById('sceneSource');
      const sceneScope = document.getElementById('sceneScope');
      const sceneScopeTitle = document.getElementById('sceneScopeTitle');
      const sceneScopeBoundary = document.getElementById('sceneScopeBoundary');
      const scopeLocal = document.getElementById('scopeLocal');
      const scopeLocalLabel = document.getElementById('scopeLocalLabel');
      const scopeLocalCount = document.getElementById('scopeLocalCount');
      const scopeExchange = document.getElementById('scopeExchange');
      const scopeExchangeLabel = document.getElementById('scopeExchangeLabel');
      const scopeExchangeMeta = document.getElementById('scopeExchangeMeta');
      const scopeTransport = document.getElementById('scopeTransport');
      const scopeTransportLabel = document.getElementById('scopeTransportLabel');
      const scopeTransportCount = document.getElementById('scopeTransportCount');
      const sceneRouteLanes = document.getElementById('sceneRouteLanes');
      const sceneRouteLaneCount = document.getElementById('sceneRouteLaneCount');
      const sceneAnnotationCount = document.getElementById('sceneAnnotationCount');
      const sceneAnnotationToggle = document.getElementById('sceneAnnotationToggle');
      const pathwayVisualDialog = document.getElementById('pathwayVisualDialog');
      const pathwayVisualDialogImage = document.getElementById('pathwayVisualDialogImage');
      const pathwayVisualDialogTitle = document.getElementById('pathwayVisualDialogTitle');
      const pathwayVisualDialogClose = document.getElementById('pathwayVisualDialogClose');
      const cellCover = document.getElementById('cellCover');
      const enterLearningBtn = document.getElementById('enterLearningBtn');
      const studentWorkspace = document.getElementById('studentWorkspace');
      const studentLayout = document.querySelector('.student-layout');
      const studentCatalog = document.querySelector('.lesson-catalog');
      const studentSidebarToggle = document.getElementById('studentSidebarToggle');
      const studentCatalogBody = document.getElementById('studentCatalogBody');
      const studentHead = document.querySelector('.student-head');
      const lessonCards = document.getElementById('lessonCards');
      const studentTopics = document.getElementById('studentTopics');
      const studentPathwaySelect = document.getElementById('studentPathwaySelect');
      const studentPathwayTotal = document.getElementById('studentPathwayTotal');
      const studentTopicPanel = document.getElementById('studentTopicPanel');
      const studentPathwayPanel = document.getElementById('studentPathwayPanel');
      const studentTopicTitle = document.getElementById('studentTopicTitle');
      const studentTopicSummary = document.getElementById('studentTopicSummary');
      const studentTopicCount = document.getElementById('studentTopicCount');
      const studentTopicStructure = document.getElementById('studentTopicStructure');
      const studentTopicHomeBack = document.getElementById('studentTopicHomeBack');
      const studentTopicLessons = document.getElementById('studentTopicLessons');
      const studentTopicAtlas = document.getElementById('studentTopicAtlas');
      const studentTopicMap = document.getElementById('studentTopicMap');
      const studentTopicBands = document.getElementById('studentTopicBands');
      const studentTopicEdges = document.getElementById('studentTopicEdges');
      const studentTopicNodes = document.getElementById('studentTopicNodes');
      const studentTopicPinnedLanes = document.getElementById('studentTopicPinnedLanes');
      const studentTopicStage = document.querySelector('.student-topic-stage');
      const studentTopicLanesToggle = document.getElementById('studentTopicLanesToggle');
      const studentTopicMaximize = document.getElementById('studentTopicMaximize');
      const studentTopicGuide = document.getElementById('studentTopicGuide');
      const studentTopicRouteLegend = document.getElementById('studentTopicRouteLegend');
      const studentTopicNodeContext = document.getElementById('studentTopicNodeContext');
      const studentTopicNodeContextTitle = document.getElementById('studentTopicNodeContextTitle');
      const studentTopicNodeContextRoutes = document.getElementById('studentTopicNodeContextRoutes');
      const studentTopicNodeContextClose = document.getElementById('studentTopicNodeContextClose');
      const studentTopicRouteContext = document.getElementById('studentTopicRouteContext');
      const studentTopicRouteContextTitle = document.getElementById('studentTopicRouteContextTitle');
      const studentTopicRouteContextMeta = document.getElementById('studentTopicRouteContextMeta');
      const studentTopicRouteEnter = document.getElementById('studentTopicRouteEnter');
      const studentTopicRouteContextClose = document.getElementById('studentTopicRouteContextClose');
      const studentTopicZoomOut = document.getElementById('studentTopicZoomOut');
      const studentTopicZoomReset = document.getElementById('studentTopicZoomReset');
      const studentTopicZoomIn = document.getElementById('studentTopicZoomIn');
      const studentTopicZoomFit = document.getElementById('studentTopicZoomFit');
      const studentTopicZoomValue = document.getElementById('studentTopicZoomValue');
      const studentTopicMinimap = document.getElementById('studentTopicMinimap');
      const studentTopicMinimapSvg = document.getElementById('studentTopicMinimapSvg');
      const studentTopicMinimapEdges = document.getElementById('studentTopicMinimapEdges');
      const studentTopicMinimapNodes = document.getElementById('studentTopicMinimapNodes');
      const studentTopicMinimapViewport = document.getElementById('studentTopicMinimapViewport');
      const studentTopicViewButtons = [...document.querySelectorAll('[data-topic-view]')];
      const studentCourseHome = document.getElementById('studentCourseHome');
      const studentCourseTopics = document.getElementById('studentCourseTopics');
      const studentCourseBack = document.getElementById('studentCourseBack');
      const flowKicker = document.getElementById('flowKicker');
      const flowTitle = document.getElementById('flowTitle');
      const flowCompartment = document.getElementById('flowCompartment');
      const flowSummary = document.getElementById('flowSummary');
      const studentPathwayMap = document.getElementById('studentPathwayMap');
      const studentMapStage = document.querySelector('.student-map-stage');
      const studentPathwayMapVisual = document.getElementById('studentPathwayMapVisual');
      const studentPathwayMapVisualFrame = document.getElementById('studentPathwayMapVisualFrame');
      const studentPathwayMapVisualImage = document.getElementById('studentPathwayMapVisualImage');
      const studentPathwayMapScientificOverlay = document.getElementById('studentPathwayMapScientificOverlay');
      const studentPathwayMapScientificOverlayLayer = document.getElementById('studentPathwayMapScientificOverlayLayer');
      const studentPathwayMapVisualCaption = document.getElementById('studentPathwayMapVisualCaption');
      const studentMapBands = document.getElementById('studentMapBands');
      const studentMapEdges = document.getElementById('studentMapEdges');
      const studentMapNodes = document.getElementById('studentMapNodes');
      const studentMapCount = document.getElementById('studentMapCount');
      const studentMapZoomOut = document.getElementById('studentMapZoomOut');
      const studentMapZoomFit = document.getElementById('studentMapZoomFit');
      const studentMapZoomIn = document.getElementById('studentMapZoomIn');
      const studentMapCenter = document.getElementById('studentMapCenter');
      const studentMapZoomValue = document.getElementById('studentMapZoomValue');
      const studentMapCurrent = document.getElementById('studentMapCurrent');
      const studentMapNext = document.getElementById('studentMapNext');
      const studentDestinationPanel = document.getElementById('studentDestinationPanel');
      const studentDestinationTitle = document.getElementById('studentDestinationTitle');
      const studentDestinationCount = document.getElementById('studentDestinationCount');
      const studentDestinationMap = document.getElementById('studentDestinationMap');
      const studentDestinationStage = studentDestinationMap?.closest('.student-destination-stage');
      const studentDestinationEdges = document.getElementById('studentDestinationEdges');
      const studentDestinationNodes = document.getElementById('studentDestinationNodes');
      const flowSteps = document.getElementById('flowSteps');
      const flowLoop = document.getElementById('flowLoop');
      const studentReactionToggle = document.getElementById('studentReactionToggle');
      const studentReactionIndex = document.getElementById('studentReactionIndex');
      const studentReactions = document.getElementById('studentReactions');
      const studentReactionCount = document.getElementById('studentReactionCount');
      const studentDetail = document.getElementById('studentDetail');
      const studentPrimer = document.getElementById('studentPrimer');
      const studentPrimerLesson = document.getElementById('studentPrimerLesson');
      const studentPrimerTopic = document.getElementById('studentPrimerTopic');
      const studentPrimerTitle = document.getElementById('studentPrimerTitle');
      const studentPrimerQuestion = document.getElementById('studentPrimerQuestion');
      const studentPrimerGoal = document.getElementById('studentPrimerGoal');
      const studentPrimerStory = document.getElementById('studentPrimerStory');
      const studentPrimerProblem = document.getElementById('studentPrimerProblem');
      const studentPrimerInput = document.getElementById('studentPrimerInput');
      const studentPrimerOutput = document.getElementById('studentPrimerOutput');
      const studentPrimerLocation = document.getElementById('studentPrimerLocation');
      const studentPrimerPurpose = document.getElementById('studentPrimerPurpose');
      const studentPrimerTerms = document.getElementById('studentPrimerTerms');
      const studentLessonBody = document.getElementById('studentLessonBody');
      const studentPathStatus = document.getElementById('studentPathStatus');
      const studentPathScope = document.getElementById('studentPathScope');
      const learnBtn = document.getElementById('learnBtn');
      const focusBtn = document.getElementById('focusBtn');
      const upstreamBtn = document.getElementById('upstreamBtn');
      const enzymeProfilePanel = document.getElementById('enzymeProfile');
      const enzymeProfileName = document.getElementById('enzymeProfileName');
      const enzymeProfileKind = document.getElementById('enzymeProfileKind');
      const enzymeProfileSummary = document.getElementById('enzymeProfileSummary');
      const enzymeProfileMeta = document.getElementById('enzymeProfileMeta');
      const expertMapRegions = [
        svg,
        ...document.querySelectorAll('.overview-hud, .context, .status, .zoom-tools, .pathbar')
      ];

      // #1 ── 核心辅助函数 ──────────────────────────────────────────────
      function setRegionHidden(region, hidden) {
        if (!region) return;
        region.toggleAttribute('inert', hidden);
        if (hidden) region.setAttribute('aria-hidden', 'true');
        else region.removeAttribute('aria-hidden');
      }

      function syncAccessibilityState() {
        const studentMode = document.body.classList.contains('student-mode');
        const sceneMode = document.body.classList.contains('scene-open');
        expertMapRegions.forEach(region => setRegionHidden(region, studentMode || sceneMode));
        setRegionHidden(studentWorkspace, !studentMode);
        setRegionHidden(sceneDeck, !sceneMode);
        setRegionHidden(inspector, studentMode || !inspector.classList.contains('open'));
      }

      function revealApplication() {
        app.removeAttribute('inert');
        app.removeAttribute('aria-hidden');
      }
      const base = { x: 0, y: 0, w: 1600, h: 1200 };
      let view = { ...base };
      const mapPointers = new Map();
      const mapPointerCaptures = new Map();
      let mapGesture = null;
      let mapGestureFrame = null;
      let pendingGestureView = null;
      let previewedGestureView = null;
      let pendingGestureTransform = null;
      // Absolute performance.now() deadline used to swallow the synthetic click emitted after a moved gesture.
      let clickInterceptDeadline = 0;
      let viewAnimation = null;
      let wheelZoomFrame = null;
      let wheelZoomDelta = 0;
      let wheelZoomPoint = { x: innerWidth / 2, y: innerHeight / 2 };
      let wheelZoomEndTimer = null;
      let zoomContextTier = '';
      function visualDialogCaptionFor(imageElement) {
        if (imageElement === sceneBackground) return sceneSource?.textContent || imageElement.alt || '当前通路图';
        const figure = imageElement.closest('figure');
        const caption = figure?.querySelector('figcaption');
        return caption?.innerText?.trim() || imageElement.alt || '通路结构图';
      }

      function openPathwayVisualDialog(imageElement) {
        const source = imageElement?.currentSrc || imageElement?.src;
        if (!pathwayVisualDialog || !pathwayVisualDialogImage || !source) return;
        pathwayVisualDialogImage.src = source;
        pathwayVisualDialogImage.alt = imageElement.alt || '通路结构图大图';
        pathwayVisualDialogTitle.textContent = visualDialogCaptionFor(imageElement);
        if (typeof pathwayVisualDialog.showModal === 'function') pathwayVisualDialog.showModal();
        else pathwayVisualDialog.setAttribute('open', '');
      }

      function zoomableVisualFromEvent(event) {
      // #2 ── 缩放 / 手势 ───────────────────────────────────────────────
        const target = event.target?.closest?.('[data-visual-zoom], .student-topic-structure-visual img, [data-scene-visual-zoom]');
        if (target === sceneBackground && !sceneDeck.classList.contains('pathway-visual-active')) return null;
        return target;
      }

      document.addEventListener('click', event => {
        const imageElement = zoomableVisualFromEvent(event);
        if (!imageElement) return;
        event.stopPropagation();
        openPathwayVisualDialog(imageElement);
      });
      document.addEventListener('keydown', event => {
        if (event.key !== 'Enter' && event.key !== ' ') return;
        const imageElement = zoomableVisualFromEvent(event);
        if (!imageElement) return;
        event.preventDefault();
        openPathwayVisualDialog(imageElement);
      });
      pathwayVisualDialogClose?.addEventListener('click', () => pathwayVisualDialog.close());
      pathwayVisualDialog?.addEventListener('click', event => {
        if (event.target === pathwayVisualDialog) pathwayVisualDialog.close();
      });
      pathwayVisualDialog?.addEventListener('close', () => {
        if (!pathwayVisualDialogImage) return;
        pathwayVisualDialogImage.removeAttribute('src');
        pathwayVisualDialogImage.alt = '';
      });

      let selected = null;
      let selectedType = null;
      let activePathway = 'all';
      let currentSceneId = null;
      let currentSceneView = 0;
      let sceneImageRequest = 0;
      let sceneAnnotationsVisible = true;
      let activeStudentPathway = 'pdh';
      let studentWorkspaceReady = false;
      let activeStudentTopic = null;
      let activeStudentTopicView = 'network';
      let activeStudentTopicRouteFocus = null;
      let studentTopicApplyFocus = null;
      let studentTopicZoom = 1;
      let studentTopicMinimapFrame = null;
      let activeStudentReactionId = null;
      let activeStudentSceneAnchor = null;
      let studentMapZoom = 1;
      let activeStudentStepIndex = 0;
      const sceneHistory = [];
      let expertMapBuilt = false;
      const routeGeometry = new Map();

      const readStudentPreference = (key, fallback) => {
        try {
          const value = window.localStorage.getItem(key);
          return value === null ? fallback : value === 'true';
        } catch (_) {
          return fallback;
        }
      };
      const writeStudentPreference = (key, value) => {
        try { window.localStorage.setItem(key, String(Boolean(value))); } catch (_) {}
      };
      const setStudentCatalogCollapsed = (collapsed, persist = true) => {
        if (!studentLayout || !studentSidebarToggle) return;
        studentLayout.classList.toggle('catalog-collapsed', collapsed);
        studentSidebarToggle.setAttribute('aria-expanded', String(!collapsed));
        studentSidebarToggle.title = collapsed
          ? '目录已收起；悬停可临时查看，点击可固定展开'
          : '收起通路目录';
        const arrow = studentSidebarToggle.querySelector('.student-sidebar-toggle-arrow');
        if (arrow) arrow.textContent = collapsed ? '→' : '←';
        if (persist) writeStudentPreference('metabolism.studentCatalogCollapsed', collapsed);
      };
      const setStudentTopicLanesCollapsed = (collapsed, persist = true) => {
        if (!studentTopicStage || !studentTopicLanesToggle) return;
        studentTopicStage.classList.toggle('topic-lanes-collapsed', collapsed);
        studentTopicLanesToggle.setAttribute('aria-expanded', String(!collapsed));
        studentTopicLanesToggle.textContent = collapsed ? '固定显示通路名' : '收起通路名';
        studentTopicLanesToggle.title = collapsed
          ? '通路名称已收起；靠近画布左缘可临时查看'
          : '收起图内通路名称';
        if (persist) writeStudentPreference('metabolism.studentTopicLanesCollapsed', collapsed);
      };
      const setTopbarCollapsed = (collapsed, persist = true) => {
        if (!topbarContent || !topbarCollapseToggle || !topbarRevealButton) return;
        document.body.classList.toggle('topbar-collapsed', collapsed);
        document.body.classList.remove('topbar-peeking');
        topbarCollapseToggle.setAttribute('aria-expanded', String(!collapsed));
        topbarCollapseToggle.setAttribute('aria-label', collapsed ? '固定展开顶部导航' : '收起顶部导航');
        topbarCollapseToggle.title = collapsed ? '固定展开顶部导航' : '收起顶部导航';
        topbarCollapseToggle.textContent = collapsed ? '⌄' : '⌃';
        topbarRevealButton.setAttribute('aria-expanded', String(!collapsed));
        if (persist) writeStudentPreference('metabolism.topbarCollapsed', collapsed);
      };
      let fullscreenRestoreTopbarCollapsed = false;
      let appFullscreenWasActive = false;
      const nativeFullscreenElement = () => document.fullscreenElement || document.webkitFullscreenElement || null;
      const syncAppFullscreen = () => {
        const nativeActive = Boolean(nativeFullscreenElement());
        const fallbackActive = document.body.classList.contains('app-fullscreen-fallback');
        const active = nativeActive || fallbackActive;
        document.body.classList.toggle('app-native-fullscreen', nativeActive);
        if (appFullscreenToggle) {
          appFullscreenToggle.setAttribute('aria-pressed', String(active));
          appFullscreenToggle.setAttribute('aria-label', active ? '退出全屏' : '进入全屏');
          appFullscreenToggle.title = active ? '退出全屏' : '进入全屏';
          const icon = appFullscreenToggle.querySelector('.tablet-fullscreen-icon');
          const label = appFullscreenToggle.querySelector('[data-fullscreen-label]');
          if (icon) icon.textContent = active ? '↙' : '⛶';
          if (label) label.textContent = active ? '退出' : '全屏';
        }
        if (appFullscreenWasActive && !active && fullscreenRestoreTopbarCollapsed) {
          setTopbarCollapsed(true, false);
        }
        appFullscreenWasActive = active;
      };
      const exitAppFullscreen = async () => {
        const exitFullscreen = document.exitFullscreen || document.webkitExitFullscreen;
        if (nativeFullscreenElement() && exitFullscreen) {
          try { await Promise.resolve(exitFullscreen.call(document)); } catch (_) {}
        }
        document.body.classList.remove('app-fullscreen-fallback');
        syncAppFullscreen();
      };
      const toggleAppFullscreen = async () => {
        if (nativeFullscreenElement() || document.body.classList.contains('app-fullscreen-fallback')) {
          await exitAppFullscreen();
          return;
        }
        fullscreenRestoreTopbarCollapsed = document.body.classList.contains('topbar-collapsed');
        setTopbarCollapsed(false, false);
        const root = document.documentElement;
        const requestFullscreen = root.requestFullscreen || root.webkitRequestFullscreen;
        if (requestFullscreen) {
          try {
            await Promise.resolve(requestFullscreen.call(root));
            syncAppFullscreen();
            return;
          } catch (_) {}
        }
        document.body.classList.add('app-fullscreen-fallback');
        syncAppFullscreen();
      };
      const setStudentTopicCanvasMaximized = (maximized, restoreFocus = false) => {
        if (!studentTopicPanel || !studentTopicMaximize) return;
        const active = Boolean(maximized) && !studentTopicPanel.hidden;
        document.body.classList.toggle('student-topic-maximized', active);
        [topbarContent, studentCatalog, studentHead].forEach(region => setRegionHidden(region, active));
        studentTopicMaximize.setAttribute('aria-pressed', String(active));
        studentTopicMaximize.setAttribute('aria-label', active ? '退出放大画布' : '放大专题画布');
        studentTopicMaximize.title = active ? '退出放大画布（Esc）' : '让专题画布占满浏览器';
        const icon = studentTopicMaximize.querySelector('span[aria-hidden="true"]');
        const label = studentTopicMaximize.querySelector('[data-maximize-label]');
        if (icon) icon.textContent = active ? '↙' : '⛶';
        if (label) label.textContent = active ? '退出放大' : '放大画布';
        if (active) studentTopicStage?.focus({ preventScroll: true });
        else if (restoreFocus) studentTopicMaximize.focus({ preventScroll: true });
        window.requestAnimationFrame(syncStudentTopicMinimap);
      };
      const studentTopicReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const studentTopicScrollBehavior = () => studentTopicReducedMotion() ? 'auto' : 'smooth';
      const studentTopicZoomBounds = { min: .55, max: 1.6, step: .1 };
      const updateStudentTopicZoomControls = () => {
        if (studentTopicZoomValue) studentTopicZoomValue.textContent = `${Math.round(studentTopicZoom * 100)}%`;
        if (studentTopicZoomOut) studentTopicZoomOut.disabled = studentTopicZoom <= studentTopicZoomBounds.min + .001;
        if (studentTopicZoomIn) studentTopicZoomIn.disabled = studentTopicZoom >= studentTopicZoomBounds.max - .001;
      };
      const scheduleStudentTopicMinimapSync = () => {
        if (studentTopicMinimapFrame !== null) return;
        studentTopicMinimapFrame = window.requestAnimationFrame(() => {
          studentTopicMinimapFrame = null;
          syncStudentTopicMinimap();
        });
      };
      // #3 ── 学习模式 · 小地图同步 ─────────────────────────────────────
      function syncStudentTopicMinimap() {
        if (!studentTopicStage || !studentTopicMap || !studentTopicMinimap || !studentTopicMinimapSvg || !studentTopicMinimapViewport || studentTopicMinimap.hidden) return;
        const baseWidth = Number(studentTopicMap.dataset.baseWidth || 0);
        const baseHeight = Number(studentTopicMap.dataset.baseHeight || 0);
        const svgRect = studentTopicMinimapSvg.getBoundingClientRect();
        const minimapRect = studentTopicMinimap.getBoundingClientRect();
        if (!baseWidth || !baseHeight || !svgRect.width || !svgRect.height) return;
        const miniatureScale = Math.min(svgRect.width / baseWidth, svgRect.height / baseHeight);
        const contentWidth = baseWidth * miniatureScale;
        const contentHeight = baseHeight * miniatureScale;
        const offsetX = svgRect.left - minimapRect.left + (svgRect.width - contentWidth) / 2;
        const offsetY = svgRect.top - minimapRect.top + (svgRect.height - contentHeight) / 2;
        const visibleX = studentTopicStage.scrollLeft / studentTopicZoom;
        const visibleY = studentTopicStage.scrollTop / studentTopicZoom;
        const visibleWidth = Math.min(baseWidth, studentTopicStage.clientWidth / studentTopicZoom);
        const visibleHeight = Math.min(baseHeight, studentTopicStage.clientHeight / studentTopicZoom);
        studentTopicMinimapViewport.style.left = `${offsetX + Math.max(0, visibleX) * miniatureScale}px`;
        studentTopicMinimapViewport.style.top = `${offsetY + Math.max(0, visibleY) * miniatureScale}px`;
        studentTopicMinimapViewport.style.width = `${Math.max(12, visibleWidth * miniatureScale)}px`;
        studentTopicMinimapViewport.style.height = `${Math.max(9, visibleHeight * miniatureScale)}px`;
      }
      const applyStudentTopicMapScale = (nextZoom, preserveCenter = true) => {
        if (!studentTopicMap || !studentTopicStage) return;
        const baseWidth = Number(studentTopicMap.dataset.baseWidth || 0);
        const baseHeight = Number(studentTopicMap.dataset.baseHeight || 0);
        const previousZoom = studentTopicZoom || 1;
        const centerX = (studentTopicStage.scrollLeft + studentTopicStage.clientWidth / 2) / previousZoom;
        const centerY = (studentTopicStage.scrollTop + studentTopicStage.clientHeight / 2) / previousZoom;
        studentTopicZoom = Math.min(studentTopicZoomBounds.max, Math.max(studentTopicZoomBounds.min, Math.round(nextZoom * 100) / 100));
        studentTopicStage.style.setProperty('--topic-map-zoom', String(studentTopicZoom));
        if (baseWidth && baseHeight) {
          studentTopicMap.style.minWidth = `${baseWidth * studentTopicZoom}px`;
          studentTopicMap.style.width = `${baseWidth * studentTopicZoom}px`;
          studentTopicMap.style.height = `${baseHeight * studentTopicZoom}px`;
          studentTopicPinnedLanes?.querySelectorAll('.student-topic-pinned-lane').forEach(lane => {
            lane.style.top = `${Number(lane.dataset.baseTop || 0) * studentTopicZoom}px`;
          });
          if (preserveCenter) {
            studentTopicStage.scrollTo({
              left: Math.max(0, centerX * studentTopicZoom - studentTopicStage.clientWidth / 2),
              top: Math.max(0, centerY * studentTopicZoom - studentTopicStage.clientHeight / 2),
              behavior: 'auto'
            });
          }
        }
        updateStudentTopicZoomControls();
        scheduleStudentTopicMinimapSync();
      };
      const setStudentTopicMapDimensions = (width, height) => {
        if (!studentTopicMap) return;
        studentTopicMap.dataset.baseWidth = String(width);
        studentTopicMap.dataset.baseHeight = String(height);
        studentTopicMap.setAttribute('viewBox', `0 0 ${width} ${height}`);
        applyStudentTopicMapScale(studentTopicZoom, false);
      };
      const scrollStudentTopicToPoint = (x, y, behavior = studentTopicScrollBehavior()) => {
        if (!studentTopicStage) return;
        studentTopicStage.scrollTo({
          left: Math.max(0, x * studentTopicZoom - studentTopicStage.clientWidth / 2),
          top: Math.max(0, y * studentTopicZoom - studentTopicStage.clientHeight / 2),
          behavior
        });
      };
      const fitStudentTopicMap = () => {
        if (!studentTopicMap || !studentTopicStage) return;
        const baseWidth = Number(studentTopicMap.dataset.baseWidth || 0);
        const baseHeight = Number(studentTopicMap.dataset.baseHeight || 0);
        if (!baseWidth || !baseHeight) return;
        const fitted = Math.min((studentTopicStage.clientWidth - 24) / baseWidth, (studentTopicStage.clientHeight - 24) / baseHeight, 1);
        applyStudentTopicMapScale(fitted, false);
        studentTopicStage.scrollTo({ left: 0, top: 0, behavior: studentTopicScrollBehavior() });
      };
      const restoreStudentTopicRouteFocus = () => {
        studentTopicApplyFocus?.(activeStudentTopicRouteFocus ? [activeStudentTopicRouteFocus] : []);
      };
      const hideStudentTopicNodeContext = (restoreRoute = true) => {
        if (!studentTopicNodeContext) return;
        studentTopicNodeContext.hidden = true;
        if (studentTopicNodeContextRoutes) studentTopicNodeContextRoutes.innerHTML = '';
        if (restoreRoute) restoreStudentTopicRouteFocus();
      };
      const hideStudentTopicRouteContext = (clearFocus = true) => {
        if (studentTopicRouteContext) studentTopicRouteContext.hidden = true;
        if (clearFocus) activeStudentTopicRouteFocus = null;
        restoreStudentTopicRouteFocus();
      };
      const setStudentTopicView = (view, persist = true) => {
        const nextView = view === 'lanes' ? 'lanes' : 'network';
        activeStudentTopicView = nextView;
        const networkView = nextView === 'network';
        studentTopicStage?.classList.toggle('topic-network-view', networkView);
        studentTopicViewButtons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.topicView === nextView)));
        if (studentTopicLanesToggle) studentTopicLanesToggle.hidden = networkView;
        if (studentTopicRouteLegend) studentTopicRouteLegend.hidden = !networkView;
        if (studentTopicGuide) studentTopicGuide.textContent = networkView
          ? '同一代谢物合并为一个节点 · 点击查看关联通路'
          : '主线从左向右 · 悬停共享物质显示跨通路关联';
        activeStudentTopicRouteFocus = null;
        studentTopicApplyFocus = null;
        hideStudentTopicNodeContext(false);
        hideStudentTopicRouteContext(false);
        if (studentTopicMinimap) studentTopicMinimap.hidden = !networkView || !window.matchMedia('(min-width: 761px)').matches;
        if (persist) {
          try { window.localStorage.setItem('metabolism.studentTopicView', nextView); } catch (_) {}
        }
        if (activeStudentTopic) {
          renderStudentTopicMap(activeStudentTopic);
          if (studentTopicStage) {
            studentTopicStage.scrollLeft = 0;
            studentTopicStage.scrollTop = 0;
          }
        }
      };

      setStudentCatalogCollapsed(readStudentPreference('metabolism.studentCatalogCollapsed', true), false);
      setStudentTopicLanesCollapsed(readStudentPreference('metabolism.studentTopicLanesCollapsed', true), false);
      // 顶部导航每次打开页面默认展开；用户可用底部折叠钮临时收起，
      // 不把上一次的收起状态带到下一次打开，避免导航像“消失”一样。
      setTopbarCollapsed(false, false);
      try { activeStudentTopicView = window.localStorage.getItem('metabolism.studentTopicView') === 'lanes' ? 'lanes' : 'network'; } catch (_) {}
      setStudentTopicView(activeStudentTopicView, false);
      studentSidebarToggle?.addEventListener('click', () => {
        const collapsed = !studentLayout.classList.contains('catalog-collapsed');
        setStudentCatalogCollapsed(collapsed);
        if (collapsed) {
          studentLayout.classList.add('catalog-suppress-peek');
          const mainTarget = studentTopicPanel && !studentTopicPanel.hidden ? studentTopicStage : studentWorkspace;
          mainTarget?.focus({ preventScroll: true });
          window.setTimeout(() => studentLayout.classList.remove('catalog-suppress-peek'), 320);
        }
      });
      studentCatalog?.addEventListener('pointerleave', () => studentLayout?.classList.remove('catalog-suppress-peek'));
      studentTopicLanesToggle?.addEventListener('click', () => {
        const scrollTop = studentTopicStage?.scrollTop || 0;
        const collapsed = !studentTopicStage.classList.contains('topic-lanes-collapsed');
        setStudentTopicLanesCollapsed(collapsed);
        if (activeStudentTopic) renderStudentTopicMap(activeStudentTopic);
        if (studentTopicStage) {
          studentTopicStage.scrollLeft = 0;
          studentTopicStage.scrollTop = scrollTop;
          studentTopicStage.focus({ preventScroll: true });
        }
      });
      studentTopicMaximize?.addEventListener('click', () => {
        setStudentTopicCanvasMaximized(!document.body.classList.contains('student-topic-maximized'));
      });
      studentTopicViewButtons.forEach(button => button.addEventListener('click', () => setStudentTopicView(button.dataset.topicView)));
      studentTopicNodeContextClose?.addEventListener('click', () => {
        hideStudentTopicNodeContext();
        studentTopicStage?.focus({ preventScroll: true });
      });
      studentTopicRouteContextClose?.addEventListener('click', () => {
        hideStudentTopicRouteContext();
        studentTopicStage?.focus({ preventScroll: true });
      });
      studentTopicRouteEnter?.addEventListener('click', () => {
        if (activeStudentTopicRouteFocus) renderStudentPathway(activeStudentTopicRouteFocus);
      });
      studentTopicZoomOut?.addEventListener('click', () => applyStudentTopicMapScale(studentTopicZoom - studentTopicZoomBounds.step));
      studentTopicZoomReset?.addEventListener('click', () => applyStudentTopicMapScale(1));
      studentTopicZoomIn?.addEventListener('click', () => applyStudentTopicMapScale(studentTopicZoom + studentTopicZoomBounds.step));
      studentTopicZoomFit?.addEventListener('click', fitStudentTopicMap);
      studentTopicStage?.addEventListener('scroll', scheduleStudentTopicMinimapSync, { passive: true });
      window.addEventListener('resize', scheduleStudentTopicMinimapSync, { passive: true });
      const positionStudentTopicFromMinimap = event => {
        if (!studentTopicMinimap || !studentTopicMinimapSvg || !studentTopicMap || !studentTopicStage) return;
        const baseWidth = Number(studentTopicMap.dataset.baseWidth || 0);
        const baseHeight = Number(studentTopicMap.dataset.baseHeight || 0);
        const rect = studentTopicMinimapSvg.getBoundingClientRect();
        if (!baseWidth || !baseHeight || !rect.width || !rect.height) return;
        const miniatureScale = Math.min(rect.width / baseWidth, rect.height / baseHeight);
        const contentWidth = baseWidth * miniatureScale;
        const contentHeight = baseHeight * miniatureScale;
        const offsetX = (rect.width - contentWidth) / 2;
        const offsetY = (rect.height - contentHeight) / 2;
        const mapX = Math.max(0, Math.min(baseWidth, (event.clientX - rect.left - offsetX) / miniatureScale));
        const mapY = Math.max(0, Math.min(baseHeight, (event.clientY - rect.top - offsetY) / miniatureScale));
        scrollStudentTopicToPoint(mapX, mapY, 'auto');
      };
      let studentTopicMinimapPointer = null;
      studentTopicMinimap?.addEventListener('pointerdown', event => {
        event.preventDefault();
        studentTopicMinimapPointer = event.pointerId;
        studentTopicMinimap.setPointerCapture(event.pointerId);
        positionStudentTopicFromMinimap(event);
      });
      studentTopicMinimap?.addEventListener('click', event => {
        if (event.detail > 0) positionStudentTopicFromMinimap(event);
      });
      studentTopicMinimap?.addEventListener('pointermove', event => {
        if (studentTopicMinimapPointer !== event.pointerId) return;
        positionStudentTopicFromMinimap(event);
      });
      const releaseStudentTopicMinimap = event => {
        if (studentTopicMinimapPointer !== event.pointerId) return;
        studentTopicMinimapPointer = null;
        if (studentTopicMinimap.hasPointerCapture(event.pointerId)) studentTopicMinimap.releasePointerCapture(event.pointerId);
      };
      studentTopicMinimap?.addEventListener('pointerup', releaseStudentTopicMinimap);
      studentTopicMinimap?.addEventListener('pointercancel', releaseStudentTopicMinimap);
      studentTopicMinimap?.addEventListener('keydown', event => {
        const movement = {
          ArrowLeft: { left: -studentTopicStage.clientWidth * .45, top: 0 },
          ArrowRight: { left: studentTopicStage.clientWidth * .45, top: 0 },
          ArrowUp: { left: 0, top: -studentTopicStage.clientHeight * .45 },
          ArrowDown: { left: 0, top: studentTopicStage.clientHeight * .45 }
        }[event.key];
        if (!movement) return;
        event.preventDefault();
        studentTopicStage.scrollBy({ ...movement, behavior: studentTopicScrollBehavior() });
      });
      updateStudentTopicZoomControls();
      document.addEventListener('keydown', event => {
        if (event.key !== 'Escape' || !document.body.classList.contains('student-topic-maximized')) return;
        event.preventDefault();
        setStudentTopicCanvasMaximized(false, true);
      });
      topbarCollapseToggle?.addEventListener('click', () => {
        const collapsed = !document.body.classList.contains('topbar-collapsed');
        setTopbarCollapsed(collapsed);
        if (collapsed) topbarRevealButton?.focus({ preventScroll: true });
      });
      topbarRevealButton?.addEventListener('click', () => setTopbarCollapsed(false));
      let topbarPeekTimer = null;
      const cancelTopbarPeekClose = () => {
        if (topbarPeekTimer !== null) window.clearTimeout(topbarPeekTimer);
        topbarPeekTimer = null;
      };
      const scheduleTopbarPeekClose = () => {
        cancelTopbarPeekClose();
        topbarPeekTimer = window.setTimeout(() => {
          if (topbarContent?.matches(':hover') || topbarContent?.contains(document.activeElement)) return;
          document.body.classList.remove('topbar-peeking');
        }, 180);
      };
      topbarRevealZone?.addEventListener('pointerenter', () => {
        if (!document.body.classList.contains('topbar-collapsed')) return;
        cancelTopbarPeekClose();
        document.body.classList.add('topbar-peeking');
      });
      topbarRevealZone?.addEventListener('pointerleave', scheduleTopbarPeekClose);
      topbarContent?.addEventListener('pointerenter', cancelTopbarPeekClose);
      topbarContent?.addEventListener('pointerleave', scheduleTopbarPeekClose);
      appFullscreenToggle?.addEventListener('click', toggleAppFullscreen);
      document.addEventListener('fullscreenchange', syncAppFullscreen);
      document.addEventListener('webkitfullscreenchange', syncAppFullscreen);
      syncAppFullscreen();

      document.querySelectorAll('[data-topic-pan]').forEach(button => {
        button.addEventListener('click', () => {
          if (!studentTopicStage) return;
          const direction = button.dataset.topicPan;
          const horizontalStep = Math.max(280, Math.round(studentTopicStage.clientWidth * .72));
          const verticalStep = Math.max(220, Math.round(studentTopicStage.clientHeight * .78));
          const movement = {
            left: { left: -horizontalStep, top: 0 },
            right: { left: horizontalStep, top: 0 },
            up: { left: 0, top: -verticalStep },
            down: { left: 0, top: verticalStep }
          }[direction];
          if (!movement) return;
          studentTopicStage.scrollBy({
            ...movement,
            behavior: studentTopicScrollBehavior()
          });
          studentTopicStage.focus({ preventScroll: true });
        });
      });

      let pathwayMeta = {
        glycolysis: { label: '糖酵解', english: 'Glycolysis', tone: '#ecab47', marker: 'arrow-glycolysis', compartment: '细胞质' },
        pdh: { label: '丙酮酸氧化', english: 'Pyruvate oxidation', tone: '#e77a66', marker: 'arrow-pdh', compartment: '线粒体基质' },
        tca: { label: '三羧酸循环', english: 'TCA cycle', tone: '#df8958', marker: 'arrow-tca', compartment: '线粒体基质' },
        etc: { label: '氧化磷酸化', english: 'Oxidative phosphorylation', tone: '#2f9eb5', marker: 'arrow-etc', compartment: '线粒体内膜' },
        transport: { label: '跨区室连接', english: 'Compartment transport', tone: '#826ab1', marker: 'arrow-transport', compartment: '细胞质 ↔ 线粒体' }
      };

      let entities = [
        { id: 'glucose', name: '葡萄糖', latin: 'Glucose', kind: '代谢物', group: ['glycolysis'], compartment: '细胞质', x: 425, y: 305, label: '葡萄糖', info: '糖酵解的起始物质，在细胞质中经过一系列磷酸化和裂解反应转化为丙酮酸。', meta: { 参与通路: '糖酵解', 角色: '碳源入口', 来源: '首版人工审核' } },
        { id: 'g6p', name: '葡萄糖-6-磷酸', latin: 'Glucose-6-phosphate', kind: '代谢物', group: ['glycolysis'], compartment: '细胞质', x: 510, y: 345, label: 'G6P', info: '葡萄糖被己糖激酶磷酸化后的产物，也是糖原合成和磷酸戊糖途径的分支点。', meta: { 参与通路: '糖酵解、磷酸戊糖途径', 反应: '己糖激酶', 来源: '首版人工审核' } },
        { id: 'f6p', name: '果糖-6-磷酸', latin: 'Fructose-6-phosphate', kind: '代谢物', group: ['glycolysis'], compartment: '细胞质', x: 596, y: 397, label: 'F6P', info: '糖酵解早期的六碳中间体，经磷酸果糖激酶催化进入承诺步骤。', meta: { 反应: '磷酸葡萄糖异构酶', 来源: '首版人工审核' } },
        { id: 'f16bp', name: '果糖-1,6-二磷酸', latin: 'Fructose-1,6-bisphosphate', kind: '代谢物', group: ['glycolysis'], compartment: '细胞质', x: 675, y: 465, label: 'F-1,6-BP', info: '糖酵解的关键承诺步骤产物，随后裂解成两个三碳分子。', meta: { 反应: '磷酸果糖激酶-1', 调节: 'ATP 抑制，AMP 激活', 来源: '首版人工审核' } },
        { id: 'dhap', entityKey: 'dhap', name: '磷酸二羟丙酮', latin: 'Dihydroxyacetone phosphate', kind: '代谢物', group: ['glycolysis'], compartment: '细胞质', x: 724, y: 505, label: 'DHAP', detail: true, info: '果糖-1,6-二磷酸裂解产生的三碳物质，经磷酸丙糖异构酶转为 G3P。', meta: { 反应: '醛缩酶 / 磷酸丙糖异构酶', 来源: '用户 PDF·糖酵解区' } },
        { id: 'g3p', name: '甘油醛-3-磷酸', latin: 'Glyceraldehyde-3-phosphate', kind: '代谢物', group: ['glycolysis'], compartment: '细胞质', x: 756, y: 546, label: 'G3P', info: '进入糖酵解产能阶段的三碳中间体，在其氧化过程中生成 NADH。', meta: { 反应: '甘油醛-3-磷酸脱氢酶', 辅因子: 'NAD⁺ / NADH', 来源: '用户 PDF·糖酵解区' } },
        { id: 'bpg13', name: '1,3-二磷酸甘油酸', latin: '1,3-Bisphosphoglycerate', kind: '代谢物', group: ['glycolysis'], compartment: '细胞质', x: 777, y: 572, label: '1,3-BPG', detail: true, info: 'G3P 氧化并结合无机磷酸形成的高能中间体。', meta: { 反应: '甘油醛-3-磷酸脱氢酶', 伴随: 'NAD⁺ → NADH + H⁺', 来源: '用户 PDF·糖酵解区' } },
        { id: 'pg3', name: '3-磷酸甘油酸', latin: '3-Phosphoglycerate', kind: '代谢物', group: ['glycolysis'], compartment: '细胞质', x: 793, y: 594, label: '3-PG', detail: true, info: '由磷酸甘油酸激酶步骤生成，同时形成 ATP。', meta: { 反应: '磷酸甘油酸激酶', 伴随: 'ADP → ATP', 来源: '用户 PDF·糖酵解区' } },
        { id: 'pg2', name: '2-磷酸甘油酸', latin: '2-Phosphoglycerate', kind: '代谢物', group: ['glycolysis'], compartment: '细胞质', x: 807, y: 614, label: '2-PG', detail: true, info: '3-PG 经磷酸甘油酸变位酶重排形成的中间体。', meta: { 反应: '磷酸甘油酸变位酶', 来源: '用户 PDF·糖酵解区' } },
        { id: 'pep', name: '磷酸烯醇式丙酮酸', latin: 'Phosphoenolpyruvate', kind: '代谢物', group: ['glycolysis'], compartment: '细胞质', x: 820, y: 638, label: 'PEP', info: '高能磷酸化合物，由丙酮酸激酶催化生成丙酮酸并进行底物水平磷酸化。', meta: { 反应: '丙酮酸激酶', 产物: '丙酮酸 + ATP', 来源: '用户 PDF·糖酵解区' } },
        { id: 'nadh_c', name: 'NADH（胞质）', latin: 'Cytosolic NADH', kind: '电子载体', group: ['glycolysis', 'transport'], compartment: '细胞质', x: 862, y: 605, label: 'NADH胞质', detail: true, info: '糖酵解产生的还原当量不能直接穿过线粒体内膜，需要通过穿梭系统把电子送入呼吸链。', meta: { 生成: 'G3P 脱氢', 去向: '苹果酸-天冬氨酸或甘油-3-磷酸穿梭', 来源: '用户 PDF·穿梭系统区' } },
        { id: 'pyruvate', entityKey: 'pyruvate', name: '丙酮酸（胞质）', latin: 'Cytosolic pyruvate', kind: '代谢枢纽', group: ['glycolysis', 'transport'], compartment: '细胞质', x: 802, y: 696, label: '丙酮酸胞质', info: '糖酵解形成的丙酮酸；进入线粒体前位于细胞质。', meta: { 入口: '糖酵解', 下一步: '外膜 VDAC → 内膜 MPC', 来源: '用户 PDF·糖酵解/PDH 连接' } },
        { id: 'pyruvate_ims', entityKey: 'pyruvate', name: '丙酮酸（膜间隙）', latin: 'Intermembrane-space pyruvate', kind: '代谢物实例', group: ['transport'], compartment: '线粒体膜间隙', x: 758, y: 751, label: '丙酮酸IMS', detail: true, info: '丙酮酸通过外膜通道后到达膜间隙，是跨区室 PortalLink 的中间实例。', meta: { 跨膜: '线粒体外膜', 通道: 'VDAC', 来源: '依据 PDF 区室关系补充' } },
        { id: 'pyruvate_m', entityKey: 'pyruvate', name: '丙酮酸（基质）', latin: 'Matrix pyruvate', kind: '代谢物实例', group: ['transport', 'pdh'], compartment: '线粒体基质', x: 711, y: 794, label: '丙酮酸基质', detail: true, info: '丙酮酸经线粒体丙酮酸载体穿过内膜后进入基质。', meta: { 跨膜: '线粒体内膜', 载体: 'MPC（丙酮酸/H⁺同向转运）', 来源: '依据 PDF 区室关系补充' } },
        { id: 'acetylcoa', name: '乙酰辅酶 A', latin: 'Acetyl-CoA', kind: '代谢枢纽', group: ['pdh', 'tca'], compartment: '线粒体基质', x: 625, y: 824, label: '乙酰-CoA', info: '基质丙酮酸经 PDH 氧化脱羧产生的二碳供体，与草酰乙酸缩合进入 TCA 循环。', meta: { 生成: '丙酮酸脱氢酶复合体', 伴随: 'CO₂、NADH + H⁺', 来源: '用户 PDF·丙酮酸氧化区' } },
        { id: 'citrate', name: '柠檬酸', latin: 'Citrate', kind: '代谢物', group: ['tca'], compartment: '线粒体基质', x: 410, y: 820, label: '柠檬酸', info: '乙酰辅酶 A 与草酰乙酸缩合生成的 TCA 循环起始中间体。', meta: { 反应: '柠檬酸合酶', 产出: '异柠檬酸', 来源: '首版人工审核' } },
        { id: 'isocitrate', name: '异柠檬酸', latin: 'Isocitrate', kind: '代谢物', group: ['tca'], compartment: '线粒体基质', x: 335, y: 868, label: '异柠檬酸', info: '柠檬酸异构化后的产物，随后发生氧化脱羧并产生 NADH。', meta: { 反应: '异柠檬酸脱氢酶', 调节: '受 ADP、Ca²⁺ 等影响', 来源: '首版人工审核' } },
        { id: 'akg', name: 'α-酮戊二酸', latin: 'α-Ketoglutarate', kind: '代谢物', group: ['tca'], compartment: '线粒体基质', x: 365, y: 934, label: 'α-KG', info: 'TCA 循环与氨基酸代谢之间的重要连接点，氧化脱羧生成琥珀酰辅酶 A。', meta: { 反应: 'α-酮戊二酸脱氢酶', 产出: 'NADH、CO₂', 来源: '首版人工审核' } },
        { id: 'succinylcoa', name: '琥珀酰辅酶 A', latin: 'Succinyl-CoA', kind: '代谢物', group: ['tca'], compartment: '线粒体基质', x: 455, y: 974, label: '琥珀酰-CoA', info: '高能硫酯中间体，在琥珀酰辅酶 A 合成酶步骤驱动底物水平磷酸化。', meta: { 反应: '琥珀酰辅酶 A 合成酶', 产出: 'GTP / ATP', 来源: '首版人工审核' } },
        { id: 'succinate', name: '琥珀酸', latin: 'Succinate', kind: '代谢物', group: ['tca', 'etc'], compartment: '线粒体基质 / 内膜', x: 552, y: 968, label: '琥珀酸', info: 'TCA 循环中由琥珀酰辅酶 A 生成，并由复合体 II 氧化为延胡索酸。', meta: { 反应: '琥珀酸脱氢酶（复合体 II）', 连接: '氧化磷酸化', 来源: '首版人工审核' } },
        { id: 'fumarate', name: '延胡索酸', latin: 'Fumarate', kind: '代谢物', group: ['tca'], compartment: '线粒体基质', x: 622, y: 916, label: '延胡索酸', info: '琥珀酸氧化后的四碳中间体，水合后形成苹果酸。', meta: { 反应: '延胡索酸酶', 来源: '首版人工审核' } },
        { id: 'malate', name: '苹果酸', latin: 'Malate', kind: '代谢物', group: ['tca'], compartment: '线粒体基质', x: 596, y: 850, label: '苹果酸', info: '被苹果酸脱氢酶氧化为草酰乙酸，并产生 NADH。', meta: { 反应: '苹果酸脱氢酶', 产出: 'NADH', 来源: '首版人工审核' } },
        { id: 'oaa', name: '草酰乙酸', latin: 'Oxaloacetate', kind: '代谢物', group: ['tca'], compartment: '线粒体基质', x: 515, y: 812, label: '草酰乙酸', info: '与乙酰辅酶 A 缩合形成柠檬酸，使 TCA 循环重新开始。', meta: { 作用: '循环受体', 反应: '柠檬酸合酶', 来源: '首版人工审核' } },
        { id: 'oaa_c', entityKey: 'oaa', name: '草酰乙酸（胞质）', latin: 'Cytosolic oxaloacetate', kind: '代谢物实例', group: ['transport'], compartment: '细胞质', x: 918, y: 700, label: 'OAA胞质', detail: true, info: '苹果酸-天冬氨酸穿梭的胞质草酰乙酸实例。', meta: { 反应: '胞质苹果酸脱氢酶', 来源: '用户 PDF·苹果酸-天冬氨酸穿梭' } },
        { id: 'malate_c', entityKey: 'malate', name: '苹果酸（胞质）', latin: 'Cytosolic malate', kind: '代谢物实例', group: ['transport'], compartment: '细胞质', x: 872, y: 744, label: '苹果酸胞质', detail: true, info: '由胞质 OAA 消耗 NADH 还原形成，随后通过内膜载体进入基质。', meta: { 载体: '苹果酸-α-KG 反向转运体', 来源: '用户 PDF·苹果酸-天冬氨酸穿梭' } },
        { id: 'aspartate_m', entityKey: 'aspartate', name: '天冬氨酸（基质）', latin: 'Matrix aspartate', kind: '代谢物实例', group: ['transport'], compartment: '线粒体基质', x: 678, y: 850, label: 'Asp基质', detail: true, info: '基质 OAA 经转氨作用形成天冬氨酸，用于完成穿梭循环。', meta: { 反应: '线粒体天冬氨酸转氨酶', 来源: '用户 PDF·苹果酸-天冬氨酸穿梭' } },
        { id: 'aspartate_c', entityKey: 'aspartate', name: '天冬氨酸（胞质）', latin: 'Cytosolic aspartate', kind: '代谢物实例', group: ['transport'], compartment: '细胞质', x: 850, y: 812, label: 'Asp胞质', detail: true, info: '经天冬氨酸-谷氨酸载体输出到胞质后，再生胞质 OAA。', meta: { 载体: '天冬氨酸-谷氨酸反向转运体', 来源: '用户 PDF·苹果酸-天冬氨酸穿梭' } },
        { id: 'dhap_shuttle', entityKey: 'dhap', name: '磷酸二羟丙酮（穿梭实例）', latin: 'DHAP shuttle instance', kind: '代谢物实例', group: ['transport'], compartment: '细胞质', x: 946, y: 764, label: 'DHAP', detail: true, info: '甘油-3-磷酸穿梭中的胞质 DHAP 实例。', meta: { 反应: '胞质甘油-3-磷酸脱氢酶', 来源: '用户 PDF·甘油-3-磷酸穿梭' } },
        { id: 'glycerol3p', name: '甘油-3-磷酸', latin: 'Glycerol 3-phosphate', kind: '代谢物', group: ['transport'], compartment: '细胞质 / 内膜外侧', x: 900, y: 808, label: '甘油-3-P', detail: true, info: '把胞质 NADH 的电子交给内膜外侧的 FAD 依赖型甘油-3-磷酸脱氢酶。', meta: { 下一步: 'FAD（酶内）→ CoQ', 来源: '用户 PDF·甘油-3-磷酸穿梭' } },
        { id: 'coq_shuttle', entityKey: 'coq', name: '辅酶 Q（穿梭入口）', latin: 'Ubiquinone shuttle entry', kind: '电子载体实例', group: ['transport', 'etc'], compartment: '线粒体内膜', x: 790, y: 846, label: 'CoQ入口', detail: true, info: '甘油-3-磷酸穿梭产生的电子在此汇入辅酶 Q 池。', meta: { 输入: '酶内 FADH₂', 去向: 'CoQH₂ / 复合体 III', 来源: '用户 PDF·甘油-3-磷酸穿梭' } },
        { id: 'nadh', name: 'NADH（基质）', latin: 'Matrix NADH', kind: '电子载体', group: ['pdh', 'tca', 'etc', 'transport'], compartment: '线粒体基质', x: 626, y: 886, label: 'NADH基质', info: '由 PDH、TCA 或苹果酸-天冬氨酸穿梭在基质侧形成，并向复合体 I 提供电子。', meta: { 去向: '复合体 I', 来源: '用户 PDF·呼吸链/穿梭区' } },
        { id: 'complex1', name: '复合体 I', latin: 'NADH:Q oxidoreductase', kind: '酶复合体', group: ['etc'], compartment: '线粒体内膜', x: 654, y: 858, label: '复合体 I', info: '氧化基质 NADH、还原 CoQ，并把 4 H⁺ 从基质侧泵到膜间隙侧。', meta: { 输入: 'NADH + H⁺ + CoQ', 输出: 'NAD⁺ + CoQH₂', 质子转运: '4 H⁺', 来源: '用户 PDF·电子传递链' } },
        { id: 'complex2', name: '复合体 II', latin: 'Succinate dehydrogenase', kind: '酶复合体', group: ['etc', 'tca'], compartment: '线粒体内膜', x: 655, y: 926, label: '复合体 II', info: '氧化琥珀酸，电子经酶内 FAD 和铁硫中心传给 CoQ；不泵出质子。', meta: { 输入: '琥珀酸 + CoQ', 输出: '延胡索酸 + CoQH₂', 质子转运: '0', 来源: '用户 PDF·电子传递链' } },
        { id: 'coq', name: '辅酶 Q', latin: 'Ubiquinone', kind: '电子载体', group: ['etc'], compartment: '线粒体内膜', x: 699, y: 901, label: 'CoQ', info: '内膜脂相中的氧化型辅酶 Q，接收复合体 I、II 和甘油-3-磷酸穿梭的电子。', meta: { 状态: '氧化型 Q', 来源: '用户 PDF·电子传递链' } },
        { id: 'qh2', name: '泛醇', latin: 'Ubiquinol / CoQH₂', kind: '电子载体', group: ['etc'], compartment: '线粒体内膜', x: 720, y: 886, label: 'CoQH₂', detail: true, info: '辅酶 Q 的还原型，把电子送入复合体 III。', meta: { 状态: '还原型 QH₂', 去向: '复合体 III', 来源: '用户 PDF·电子传递链' } },
        { id: 'complex3', name: '复合体 III', latin: 'Cytochrome bc₁ complex', kind: '酶复合体', group: ['etc'], compartment: '线粒体内膜', x: 744, y: 911, label: '复合体 III', info: '通过 Q 循环把电子传给细胞色素 c，并向膜间隙侧转移 4 H⁺。', meta: { 输入: 'CoQH₂', 输出: '还原型 Cyt c', 质子转运: '4 H⁺', 来源: '用户 PDF·电子传递链' } },
        { id: 'cytc', name: '细胞色素 c', latin: 'Cytochrome c', kind: '电子载体', group: ['etc'], compartment: '膜间隙侧', x: 737, y: 857, label: 'Cyt c', info: '沿内膜外侧在复合体 III 与 IV 之间移动电子。', meta: { 位置: '膜间隙侧', 来源: '用户 PDF·电子传递链' } },
        { id: 'complex4', name: '复合体 IV', latin: 'Cytochrome c oxidase', kind: '酶复合体', group: ['etc'], compartment: '线粒体内膜', x: 768, y: 880, label: '复合体 IV', info: '把电子交给氧生成水，并按 PDF 主图标示向膜间隙侧转移 2 H⁺。', meta: { 末端受体: 'O₂', 产物: 'H₂O', 质子转运: '2 H⁺', 来源: '用户 PDF·电子传递链' } },
        { id: 'oxygen', name: '氧', latin: 'Oxygen', kind: '末端电子受体', group: ['etc'], compartment: '线粒体基质侧', x: 807, y: 852, label: 'O₂', detail: true, info: '呼吸链末端电子受体，在复合体 IV 处还原生成水。', meta: { 反应位置: '复合体 IV', 来源: '用户 PDF·电子传递链' } },
        { id: 'water', name: '水', latin: 'Water', kind: '代谢物', group: ['etc'], compartment: '线粒体基质侧', x: 811, y: 900, label: 'H₂O', detail: true, info: '氧在复合体 IV 处接受电子和质子后形成的产物。', meta: { 来源: '用户 PDF·电子传递链' } },
        { id: 'hplus_ims', name: '膜间隙 H⁺', latin: 'Intermembrane-space protons', kind: '电化学势载体', group: ['etc'], compartment: '线粒体膜间隙', x: 696, y: 812, label: 'H⁺膜间隙', detail: true, info: '由复合体 I、III、IV 建立的跨内膜质子梯度。', meta: { 来源: '用户 PDF·电子传递链', 作用: '形成质子动力势' } },
        { id: 'pmf', name: '质子动力势', latin: 'Proton-motive force', kind: '能量状态', group: ['etc'], compartment: '线粒体内膜两侧', x: 746, y: 812, label: 'Δp', detail: true, info: '膜电位和 pH 梯度共同构成的能量，用于驱动 ATP 合酶。', meta: { 来源: '依据 PDF 质子梯度关系结构化' } },
        { id: 'atpsynthase', name: 'ATP 合酶', latin: 'F₀F₁-ATP synthase', kind: '酶复合体', group: ['etc'], compartment: '线粒体内膜', x: 723, y: 977, label: 'ATP 合酶', info: 'H⁺ 从膜间隙侧经 F₀ 回流到基质侧，F₁ 催化 ADP 与 Pi 形成 ATP。', meta: { 输入: 'H⁺梯度 + ADP + Pi', 输出: 'ATP', 来源: '用户 PDF·氧化磷酸化' } },
        { id: 'adp_c', entityKey: 'adp', name: 'ADP（胞质）', latin: 'Cytosolic ADP', kind: '能量分子实例', group: ['transport', 'etc'], compartment: '细胞质', x: 849, y: 1009, label: 'ADP胞质', detail: true, info: '通过腺嘌呤核苷酸转位酶与基质 ATP 进行反向交换。', meta: { 载体: 'ANT', 来源: '依据 PDF ATP 输出关系补充' } },
        { id: 'adp_m', entityKey: 'adp', name: 'ADP（基质）', latin: 'Matrix ADP', kind: '能量分子实例', group: ['transport', 'etc'], compartment: '线粒体基质', x: 754, y: 1007, label: 'ADP基质', detail: true, info: 'ATP 合酶的直接底物。', meta: { 来源: '用户 PDF·氧化磷酸化' } },
        { id: 'pi_c', entityKey: 'pi', name: '无机磷酸（胞质）', latin: 'Cytosolic phosphate', kind: '代谢物实例', group: ['transport', 'etc'], compartment: '细胞质', x: 872, y: 1042, label: 'Pi胞质', detail: true, info: '经磷酸载体进入线粒体基质。', meta: { 载体: '磷酸/H⁺同向转运体', 来源: '依据 PDF 氧化磷酸化关系补充' } },
        { id: 'pi_m', entityKey: 'pi', name: '无机磷酸（基质）', latin: 'Matrix phosphate', kind: '代谢物实例', group: ['transport', 'etc'], compartment: '线粒体基质', x: 778, y: 1031, label: 'Pi基质', detail: true, info: '与 ADP 一起作为 ATP 合酶底物。', meta: { 来源: '用户 PDF·氧化磷酸化' } },
        { id: 'atp_m', entityKey: 'atp', name: 'ATP（基质）', latin: 'Matrix ATP', kind: '能量分子实例', group: ['etc', 'transport'], compartment: '线粒体基质', x: 780, y: 981, label: 'ATP基质', detail: true, info: 'ATP 合酶在基质侧生成的 ATP，随后由 ANT 输出。', meta: { 来源: '用户 PDF·氧化磷酸化' } },
        { id: 'atp', entityKey: 'atp', name: 'ATP（胞质）', latin: 'Cytosolic ATP', kind: '能量分子', group: ['glycolysis', 'etc', 'transport'], compartment: '细胞质', x: 878, y: 1071, label: 'ATP胞质', info: '由线粒体输出或糖酵解底物水平磷酸化形成，供细胞工作使用。', meta: { 生成: '糖酵解 / 氧化磷酸化', 来源: '用户 PDF·主干关系' } }
      ];

      // 每个可见点都绑定一个具体物质或明确的蛋白复合体标签；视觉层只负责呈现，知识字段才是事实来源。
      const formulaById = {
        glucose: 'C₆H₁₂O₆', g6p: 'C₆H₁₃O₉P', f6p: 'C₆H₁₃O₉P', f16bp: 'C₆H₁₄O₁₂P₂',
        g3p: 'C₃H₇O₆P', pep: 'C₃H₅O₆P', pyruvate: 'C₃H₃O₃⁻', acetylcoa: 'C₂₃H₃₈N₇O₁₇P₃S',
        citrate: 'C₆H₈O₇³⁻', isocitrate: 'C₆H₈O₇³⁻', akg: 'C₅H₆O₅²⁻', succinylcoa: 'C₂₅H₄₀N₇O₁₉P₃S',
        succinate: 'C₄H₄O₄²⁻', fumarate: 'C₄H₂O₄²⁻', malate: 'C₄H₆O₅²⁻', oaa: 'C₄H₄O₅²⁻',
        nadh: 'C₂₁H₂₈N₇O₁₄P₂', fadh2: 'C₂₇H₃₃N₉O₁₅P₂', coq: 'C₅₉H₉₀O₄', cytc: 'Fe–heme c', atp: 'C₁₀H₁₆N₅O₁₃P₃⁴⁻',
        complex1: 'NADH:Q oxidoreductase', complex2: 'SDH / Complex II', complex3: 'bc₁ complex', complex4: 'COX / Complex IV', atpsynthase: 'F₀F₁-ATP synthase'
      };
      let reactions = [
        { id: 'r1', from: 'glucose', to: 'g6p', group: 'glycolysis', enzyme: '己糖激酶', equation: '葡萄糖 + ATP → G6P + ADP', reversible: false, info: '第一步磷酸化反应，将葡萄糖捕获在细胞内。' },
        { id: 'r2', from: 'g6p', to: 'f6p', group: 'glycolysis', enzyme: '磷酸葡萄糖异构酶', equation: 'G6P ⇌ F6P', reversible: true, info: '六碳糖磷酸的可逆异构化。' },
        { id: 'r3', from: 'f6p', to: 'f16bp', group: 'glycolysis', enzyme: '磷酸果糖激酶-1', equation: 'F6P + ATP → F-1,6-BP + ADP', reversible: false, info: '糖酵解最重要的承诺步骤之一，受到能量状态调节。' },
        { id: 'r4a', from: 'f16bp', to: 'dhap', group: 'glycolysis', enzyme: '醛缩酶', equation: 'F-1,6-BP ⇌ DHAP + G3P', reversible: true, detail: true, info: '六碳中间体裂解为两个不同的三碳磷酸。' },
        { id: 'r4b', from: 'dhap', to: 'g3p', group: 'glycolysis', enzyme: '磷酸丙糖异构酶', equation: 'DHAP ⇌ G3P', reversible: true, detail: true, info: 'DHAP 可逆转化为进入后续糖酵解的 G3P。' },
        { id: 'r5a', from: 'g3p', to: 'bpg13', group: 'glycolysis', enzyme: '甘油醛-3-磷酸脱氢酶', equation: 'G3P + Pi + NAD⁺ ⇌ 1,3-BPG + NADH + H⁺', reversible: true, detail: true, info: 'G3P 氧化并生成胞质 NADH。' },
        { id: 'r5b', from: 'bpg13', to: 'pg3', group: 'glycolysis', enzyme: '磷酸甘油酸激酶', equation: '1,3-BPG + ADP ⇌ 3-PG + ATP', reversible: true, detail: true, info: '糖酵解第一次底物水平磷酸化。' },
        { id: 'r5c', from: 'pg3', to: 'pg2', group: 'glycolysis', enzyme: '磷酸甘油酸变位酶', equation: '3-PG ⇌ 2-PG', reversible: true, detail: true, info: '磷酸基团从 3 位移到 2 位。' },
        { id: 'r5d', from: 'pg2', to: 'pep', group: 'glycolysis', enzyme: '烯醇化酶', equation: '2-PG ⇌ PEP + H₂O', reversible: true, detail: true, info: '脱水形成高能磷酸烯醇式键。' },
        { id: 'r6', from: 'pep', to: 'pyruvate', group: 'glycolysis', enzyme: '丙酮酸激酶', equation: 'PEP + ADP → 丙酮酸 + ATP', reversible: false, info: '糖酵解末端的底物水平磷酸化反应。' },
        { id: 'r7a', from: 'pyruvate', to: 'pyruvate_ims', group: 'transport', enzyme: 'VDAC 外膜通道', equation: '丙酮酸胞质 → 丙酮酸膜间隙', reversible: true, detail: true, info: '丙酮酸先通过线粒体外膜通道进入膜间隙。' },
        { id: 'r7b', from: 'pyruvate_ims', to: 'pyruvate_m', group: 'transport', enzyme: '线粒体丙酮酸载体 MPC', equation: '丙酮酸膜间隙 + H⁺膜间隙 → 丙酮酸基质 + H⁺基质', reversible: false, detail: true, info: 'MPC 以质子协同方式把丙酮酸跨线粒体内膜送入基质。' },
        { id: 'r7c', from: 'pyruvate_m', to: 'acetylcoa', group: 'pdh', enzyme: '丙酮酸脱氢酶复合体', equation: '丙酮酸 + CoA-SH + NAD⁺ → 乙酰-CoA + CO₂ + NADH + H⁺', reversible: false, info: '该反应发生在线粒体基质，不能与跨膜转运合并。' },
        { id: 'r8', from: 'acetylcoa', to: 'citrate', group: 'tca', enzyme: '柠檬酸合酶', equation: '乙酰-CoA + OAA + H₂O → 柠檬酸 + CoA-SH', reversible: false, info: 'TCA 循环入口反应，硫酯水解释放 CoA-SH。' },
        { id: 'r9', from: 'citrate', to: 'isocitrate', group: 'tca', enzyme: '顺乌头酸酶', equation: '柠檬酸 ⇌ 异柠檬酸', reversible: true, info: '通过脱水与加水完成异构化。' },
        { id: 'r10', from: 'isocitrate', to: 'akg', group: 'tca', enzyme: '异柠檬酸脱氢酶', equation: '异柠檬酸 + NAD⁺ → α-KG + CO₂ + NADH + H⁺', reversible: false, info: 'TCA 的第一次氧化脱羧。' },
        { id: 'r11', from: 'akg', to: 'succinylcoa', group: 'tca', enzyme: 'α-酮戊二酸脱氢酶复合体', equation: 'α-KG + CoA-SH + NAD⁺ → 琥珀酰-CoA + CO₂ + NADH + H⁺', reversible: false, info: '第二次氧化脱羧，生成高能硫酯。' },
        { id: 'r12', from: 'succinylcoa', to: 'succinate', group: 'tca', enzyme: '琥珀酰-CoA 合成酶', equation: '琥珀酰-CoA + GDP + Pi → 琥珀酸 + GTP', reversible: true, info: 'TCA 循环中的底物水平磷酸化。' },
        { id: 'r13', from: 'succinate', to: 'fumarate', group: 'tca', enzyme: '琥珀酸脱氢酶（复合体 II）', equation: '琥珀酸 + CoQ → 延胡索酸 + CoQH₂', reversible: false, info: 'FAD/FADH₂ 是复合体 II 内部辅基，不作为游离载体进入复合体 II。' },
        { id: 'r14', from: 'fumarate', to: 'malate', group: 'tca', enzyme: '延胡索酸酶', equation: '延胡索酸 + H₂O ⇌ 苹果酸', reversible: true, info: '延胡索酸水合生成苹果酸。' },
        { id: 'r15', from: 'malate', to: 'oaa', group: 'tca', enzyme: '线粒体苹果酸脱氢酶', equation: '苹果酸 + NAD⁺ ⇌ OAA + NADH + H⁺', reversible: true, info: '再生草酰乙酸，也在线粒体基质侧形成 NADH。' },

        { id: 'mas1a', from: 'oaa_c', to: 'malate_c', group: 'transport', enzyme: '胞质苹果酸脱氢酶 MDH1', equation: 'OAA胞质 + NADH + H⁺ ⇌ 苹果酸胞质 + NAD⁺', reversible: true, detail: true, info: '把胞质 NADH 的还原当量装载到苹果酸。' },
        { id: 'mas1b', from: 'nadh_c', to: 'malate_c', group: 'transport', enzyme: '胞质苹果酸脱氢酶 MDH1', equation: 'OAA胞质 + NADH + H⁺ ⇌ 苹果酸胞质 + NAD⁺', reversible: true, detail: true, info: 'NADH 是该反应的共同底物。' },
        { id: 'mas2', from: 'malate_c', to: 'malate', group: 'transport', enzyme: '苹果酸-α-KG 反向转运体', equation: '苹果酸胞质 + α-KG基质 ⇌ 苹果酸基质 + α-KG胞质', reversible: true, detail: true, info: '苹果酸跨内膜进入基质。' },
        { id: 'mas2b', from: 'malate', to: 'oaa', group: 'transport', enzyme: '线粒体苹果酸脱氢酶 MDH2', equation: '苹果酸基质 + NAD⁺ ⇌ OAA基质 + NADH + H⁺', reversible: true, detail: true, info: '在基质侧把苹果酸携带的还原当量转回 NADH；该 NADH 随后进入复合体 I。' },
        { id: 'mas3', from: 'oaa', to: 'aspartate_m', group: 'transport', enzyme: '线粒体天冬氨酸转氨酶', equation: 'OAA基质 + 谷氨酸 → 天冬氨酸基质 + α-KG', reversible: true, detail: true, info: '把不能直接跨膜的 OAA 转为天冬氨酸。' },
        { id: 'mas4', from: 'aspartate_m', to: 'aspartate_c', group: 'transport', enzyme: '天冬氨酸-谷氨酸载体', equation: 'Asp基质 + 谷氨酸胞质 + H⁺ ⇌ Asp胞质 + 谷氨酸基质', reversible: true, detail: true, info: '天冬氨酸输出并与谷氨酸输入耦联。' },
        { id: 'mas5', from: 'aspartate_c', to: 'oaa_c', group: 'transport', enzyme: '胞质天冬氨酸转氨酶', equation: 'Asp胞质 + α-KG → OAA胞质 + 谷氨酸', reversible: true, detail: true, info: '在胞质侧再生 OAA，闭合穿梭。' },
        { id: 'gps1a', from: 'dhap_shuttle', to: 'glycerol3p', group: 'transport', enzyme: '胞质甘油-3-磷酸脱氢酶', equation: 'DHAP + NADH + H⁺ ⇌ 甘油-3-P + NAD⁺', reversible: true, detail: true, info: '把胞质 NADH 的电子装载到甘油-3-磷酸。' },
        { id: 'gps1b', from: 'nadh_c', to: 'glycerol3p', group: 'transport', enzyme: '胞质甘油-3-磷酸脱氢酶', equation: 'DHAP + NADH + H⁺ ⇌ 甘油-3-P + NAD⁺', reversible: true, detail: true, info: 'NADH 是该反应的共同底物。' },
        { id: 'gps2', from: 'glycerol3p', to: 'coq_shuttle', group: 'transport', enzyme: '线粒体甘油-3-磷酸脱氢酶 GPD2', equation: '甘油-3-P + FAD(酶内) → DHAP + FADH₂(酶内)；FADH₂(酶内) + CoQ → FAD(酶内) + CoQH₂', reversible: false, detail: true, info: '电子经酶内 FAD 直接汇入辅酶 Q 池，不生成游离 FADH₂，也不经过复合体 I。' },

        { id: 'r16', from: 'nadh', to: 'complex1', group: 'etc', enzyme: '复合体 I', equation: 'NADH + H⁺ → NAD⁺ + 2e⁻ + 2H⁺', reversible: false, info: '基质 NADH 是复合体 I 的电子供体。' },
        { id: 'r18', from: 'complex1', to: 'qh2', group: 'etc', enzyme: '复合体 I', equation: 'CoQ + 2e⁻ + 2H⁺ → CoQH₂；4H⁺泵入膜间隙', reversible: false, info: '复合体 I 还原 CoQ 并建立质子梯度。' },
        { id: 'r19', from: 'complex2', to: 'qh2', group: 'etc', enzyme: '复合体 II', equation: '琥珀酸 + CoQ → 延胡索酸 + CoQH₂', reversible: false, detail: true, info: '复合体 II 不泵出质子。' },
        { id: 'r19b', from: 'coq_shuttle', to: 'qh2', group: 'etc', enzyme: '辅酶 Q 池', equation: '穿梭电子 + CoQ → CoQH₂', reversible: false, detail: true, info: '甘油-3-磷酸穿梭在 CoQ 水平进入呼吸链。' },
        { id: 'r20', from: 'qh2', to: 'complex3', group: 'etc', enzyme: '复合体 III', equation: 'CoQH₂ → CoQ + 2e⁻；4H⁺转移到膜间隙侧', reversible: false, info: 'Q 循环把电子交给细胞色素 c。' },
        { id: 'r21', from: 'complex3', to: 'cytc', group: 'etc', enzyme: '细胞色素 c', equation: 'Cyt c(氧化型) + e⁻ → Cyt c(还原型)', reversible: false, info: '细胞色素 c 在膜间隙侧移动电子。' },
        { id: 'r22', from: 'cytc', to: 'complex4', group: 'etc', enzyme: '复合体 IV', equation: '还原型 Cyt c → 复合体 IV', reversible: false, info: '细胞色素 c 把电子交给复合体 IV。' },
        { id: 'r22b', from: 'oxygen', to: 'water', group: 'etc', enzyme: '复合体 IV', equation: '½O₂ + 2e⁻ + 2H⁺基质 → H₂O；另有 2H⁺泵入膜间隙', reversible: false, detail: true, info: '按每对电子计量：氧是末端电子受体，形成 1 分子水，并泵出 2 个质子。' },
        { id: 'hp1', from: 'complex1', to: 'hplus_ims', group: 'etc', enzyme: '复合体 I 质子泵', equation: '4H⁺：基质 → 膜间隙', reversible: false, detail: true, info: 'PDF 标示复合体 I 每对电子转移 4 H⁺。' },
        { id: 'hp3', from: 'complex3', to: 'hplus_ims', group: 'etc', enzyme: '复合体 III / Q循环', equation: '4H⁺：净转移至膜间隙侧', reversible: false, detail: true, info: 'PDF 标示复合体 III 对应 4 H⁺。' },
        { id: 'hp4', from: 'complex4', to: 'hplus_ims', group: 'etc', enzyme: '复合体 IV 质子泵', equation: '2H⁺：基质 → 膜间隙', reversible: false, detail: true, info: 'PDF 标示复合体 IV 对应 2 H⁺。' },
        { id: 'r23a', from: 'hplus_ims', to: 'pmf', group: 'etc', enzyme: '内膜电化学梯度', equation: 'ΔpH + Δψ → 质子动力势 Δp', reversible: false, detail: true, info: '质子在膜间隙侧积累形成质子动力势。' },
        { id: 'r23b', from: 'pmf', to: 'atpsynthase', group: 'etc', enzyme: 'F₀F₁-ATP 合酶', equation: 'H⁺膜间隙 → H⁺基质', reversible: false, info: '质子回流驱动 ATP 合酶旋转催化。' },
        { id: 'r24a', from: 'adp_m', to: 'atp_m', group: 'etc', enzyme: 'ATP 合酶', equation: 'ADP基质 + Pi基质 → ATP基质 + H₂O', reversible: false, detail: true, info: 'ADP 是 ATP 合酶底物。' },
        { id: 'r24b', from: 'pi_m', to: 'atp_m', group: 'etc', enzyme: 'ATP 合酶', equation: 'ADP基质 + Pi基质 → ATP基质 + H₂O', reversible: false, detail: true, info: '无机磷酸是 ATP 合酶共同底物。' },
        { id: 'ant1', from: 'atp_m', to: 'atp', group: 'transport', enzyme: '腺嘌呤核苷酸转位酶 ANT', equation: 'ATP基质 + ADP胞质 ⇌ ATP胞质 + ADP基质', reversible: true, detail: true, info: 'ANT 以反向交换方式输出 ATP、输入 ADP。' },
        { id: 'ant2', from: 'adp_c', to: 'adp_m', group: 'transport', enzyme: '腺嘌呤核苷酸转位酶 ANT', equation: 'ATP基质 + ADP胞质 ⇌ ATP胞质 + ADP基质', reversible: true, detail: true, info: 'ADP 输入与 ATP 输出耦联。' },
        { id: 'pic', from: 'pi_c', to: 'pi_m', group: 'transport', enzyme: '线粒体磷酸载体', equation: 'Pi胞质 + H⁺膜间隙 ⇌ Pi基质 + H⁺基质', reversible: true, detail: true, info: '无机磷酸与质子协同跨越内膜进入基质。' }
      ];

      // ---- 编译数据覆盖 ----
      // data-compiled.js 由 tools/compile.js 从 data/*.tsv 生成。
      // 存在就用它；缺失时回退到上面的硬编码数组，页面照样能打开。
      let participantCatalog = [];
      const compiled = window.METABOLIC_COMPILED;
      if (compiled && compiled.entities && compiled.entities.length) {
        // 硬编码里的 marker 按通路名对回去，对不上的用默认箭头
        const markerByLabel = {};
        for (const m of Object.values(pathwayMeta)) if (m.marker) markerByLabel[m.label] = m.marker;
        const merged = {};
        for (const [k, m] of Object.entries(compiled.pathwayMeta || {})) {
          merged[k] = Object.assign({}, m, { marker: markerByLabel[m.label] || 'arrow-etc' });
        }
        if (Object.keys(merged).length) pathwayMeta = merged;
        entities = compiled.entities;
        reactions = compiled.reactions;
        participantCatalog = compiled.participantCatalog || [];
      }
      const expertPathwayLayouts = compiled?.expertPathwayLayouts || {};
      const expertMapGuides = compiled?.expertMapGuides || {};

      // 面向复习的默认产品范围。完整数据仍保留在编译层，但不再铺满学生和专家入口。
      const coreStudyModules = {
        biooxidation: ['pdh', 'tca', 'malate_aspartate', 'glycerol_phosphate', 'etc', 'oxphos'],
        carbohydrate: ['glycolysis', 'gluconeogenesis', 'glycogenesis', 'glycogenolysis', 'ppp'],
        lipid: ['fa_synthesis', 'carnitine', 'beta_oxidation', 'ketone'],
        amino: ['transamination', 'urea', 'aa_carbon'],
        nucleotide: ['purine', 'pyrimidine', 'nucleotide_degradation']
      };
      const coreStudyPathwayIds = Object.values(coreStudyModules).flat();
      const coreStudyPathwaySet = new Set(coreStudyPathwayIds);

      // 分子式与枢纽标记按「名称」匹配，不按 id —— 编译后的 id 是 名称@区室
      const formulaByName = {
        '葡萄糖': 'C₆H₁₂O₆', '葡萄糖-6-磷酸': 'C₆H₁₃O₉P', '果糖-6-磷酸': 'C₆H₁₃O₉P',
        '果糖-1,6-二磷酸': 'C₆H₁₄O₁₂P₂', '磷酸二羟丙酮': 'C₃H₇O₆P', '甘油醛-3-磷酸': 'C₃H₇O₆P',
        '1,3-二磷酸甘油酸': 'C₃H₈O₁₀P₂', '3-磷酸甘油酸': 'C₃H₇O₇P', '2-磷酸甘油酸': 'C₃H₇O₇P',
        '磷酸烯醇式丙酮酸': 'C₃H₅O₆P', '丙酮酸': 'C₃H₃O₃⁻', '乙酰辅酶 A': 'C₂₃H₃₈N₇O₁₇P₃S',
        '柠檬酸': 'C₆H₈O₇³⁻', '异柠檬酸': 'C₆H₈O₇³⁻', 'α-酮戊二酸': 'C₅H₆O₅²⁻',
        '琥珀酰辅酶 A': 'C₂₅H₄₀N₇O₁₉P₃S', '琥珀酸': 'C₄H₄O₄²⁻', '延胡索酸': 'C₄H₂O₄²⁻',
        '苹果酸': 'C₄H₆O₅²⁻', '草酰乙酸': 'C₄H₄O₅²⁻', '天冬氨酸': 'C₄H₇NO₄',
        'NADH': 'C₂₁H₂₈N₇O₁₄P₂', '辅酶 Q': 'C₅₉H₉₀O₄', '泛醇': 'C₅₉H₉₂O₄',
        '细胞色素 c': 'Fe–heme c', 'ATP': 'C₁₀H₁₆N₅O₁₃P₃⁴⁻', 'ADP': 'C₁₀H₁₅N₅O₁₀P₂³⁻',
        '无机磷酸': 'HPO₄²⁻', '氧': 'O₂', '水': 'H₂O',
        '复合体 I': 'NADH:Q oxidoreductase', '复合体 II': 'SDH / Complex II',
        '复合体 III': 'bc₁ complex', '复合体 IV': 'COX / Complex IV',
        'ATP 合酶': 'F₀F₁-ATP synthase'
      };
      const primaryNames = new Set(['葡萄糖', '丙酮酸', '乙酰辅酶 A', '柠檬酸', '草酰乙酸',
        'NADH', 'ATP', '复合体 I', '复合体 IV', 'ATP 合酶']);
      entities.forEach(entity => {
        entity.formula = formulaById[entity.id] || formulaByName[entity.name] || '';
        entity.primary = primaryNames.has(entity.name);
        entity.substance = entity.kind === '酶复合体' ? '蛋白复合体' : '小分子实体';
      });

      const organelles = [
        { id: 'plasma-membrane', sceneId: 'plasma-membrane', name: '质膜', sub: '营养物、离子与受体入口', x: 800, y: 600, rx: 720, ry: 500, focus: { x: 40, y: 50, w: 1520, h: 1080 } },
        { id: 'cytosol', sceneId: 'cytosol', name: '细胞质', sub: '糖酵解与跨区室连接', x: 790, y: 545, rx: 360, ry: 275, focus: { x: 400, y: 250, w: 780, h: 585 } },
        { id: 'nucleus', sceneId: 'nucleus-er', name: '细胞核', sub: '核苷酸、一碳代谢与转录', x: 1050, y: 300, rx: 185, ry: 135, focus: { x: 795, y: 95, w: 510, h: 405 } },
        { id: 'er', sceneId: 'nucleus-er', name: '内质网', sub: '脂质、蛋白质与糖基化加工', x: 1325, y: 480, rx: 180, ry: 150, focus: { x: 1075, y: 245, w: 500, h: 470 } },
        { id: 'peroxisome', sceneId: 'peroxisome', name: '过氧化物酶体', sub: '极长链脂肪酸与过氧化氢', x: 1410, y: 555, rx: 95, ry: 72, focus: { x: 1240, y: 430, w: 330, h: 275 } },
        { id: 'lysosome', sceneId: 'endosome-lysosome', name: '内体 / 溶酶体', sub: '内吞、自噬与大分子回收', x: 1410, y: 715, rx: 118, ry: 86, focus: { x: 1215, y: 560, w: 365, h: 315 } },
        { id: 'golgi', sceneId: 'golgi', name: '高尔基体', sub: '糖基化、分选与囊泡运输', x: 1205, y: 805, rx: 170, ry: 125, focus: { x: 965, y: 595, w: 480, h: 420 } },
        { id: 'mitochondria', sceneId: 'mitochondria', name: '线粒体', sub: '基质 · 内膜 · 穿梭 · 呼吸链', x: 570, y: 805, rx: 350, ry: 220, focus: { x: 175, y: 545, w: 820, h: 555 } }
      ];

      const entityById = Object.fromEntries(entities.map(e => [e.id, e]));
      const reactionById = Object.fromEntries(reactions.map(r => [r.id, r]));
      const participantCatalogByKey = new Map(participantCatalog.map(entry => [entry.key, entry]));
      const pathLabel = key => pathwayMeta[key]?.label || key;
      const enzymeReactionIndex = new Map();
      reactions.filter(reaction => reaction.enzyme).forEach(reaction => {
        if (!enzymeReactionIndex.has(reaction.enzyme)) enzymeReactionIndex.set(reaction.enzyme, []);
        enzymeReactionIndex.get(reaction.enzyme).push(reaction);
      });
      const enzymeKindFor = enzyme => /系统|复合体|酶系|转运|载体|通道|池|梯度|泵|融合/.test(enzyme)
        ? '酶系 / 复合体 / 转运系统' : '酶';
      // #4 ── 酶信息辅助 ────────────────────────────────────────────────
      function enzymeProfileFor(enzyme, reaction) {
        const records = enzymeReactionIndex.get(enzyme) || (reaction ? [reaction] : []);
        const sample = reaction || records[0];
        if (!sample) return null;
        const fromName = entityById[sample.from]?.name || String(sample.from || '').split('@')[0] || '底物';
        const toName = entityById[sample.to]?.name || String(sample.to || '').split('@')[0] || '产物';
        const equation = displayText(sample.equation || `${fromName} → ${toName}`);
        const info = displayText(sample.info || '').replace(/（待审校）/g, '').trim();
        const groups = [...new Set(records.flatMap(record => Array.isArray(record.group) ? record.group : [record.group]).filter(Boolean))];
        const compartments = [...new Set(records.map(record => entityById[record.from]?.compartment).filter(Boolean))];
        const facts = studentEnzymeFactsFor(sample);
        return {
          name: enzyme,
          kind: enzymeKindFor(enzyme),
          summary: info ? studentReactionDescription(info) : `当前结构化记录中的催化单元为 ${enzyme}。`,
          reaction: equation,
          structure: facts.structure,
          factors: facts.factors,
          direction: sample.reversible ? '可逆反应' : '不可逆反应',
          pathways: groups.map(pathLabel).join('、') || '当前反应记录',
          compartment: compartments.join('、') || '区室待核对',
          recordCount: `${records.length} 条反应记录`,
          note: records.some(record => /待审校/.test(record.info || ''))
            ? '该酶的部分记录含“待审校”标记，简介以当前反应式为准。'
            : '简介依据当前结构化反应式、区室和通路备注生成。'
        };
      }
      const studentEnzymeFactRules = [
        { match: /丙酮酸脱氢酶复合体/, structure: 'E1、E2、E3 组成的多酶复合体', factors: 'TPP、硫辛酰胺、FAD、CoA、NAD⁺、Mg²⁺' },
        { match: /α-酮戊二酸脱氢酶复合体/, structure: 'E1o、E2o、E3 组成的多酶复合体', factors: 'TPP、硫辛酰胺、FAD、CoA、NAD⁺、Mg²⁺' },
        { match: /复合体 I/, structure: '线粒体内膜多亚基复合体', factors: 'FMN、铁硫簇、辅酶 Q' },
        { match: /复合体 II|琥珀酸脱氢酶/, structure: '线粒体内膜四亚基复合体', factors: 'FAD、铁硫簇、血红素 b、辅酶 Q' },
        { match: /复合体 III/, structure: '线粒体内膜二聚体复合体', factors: '血红素 bL/bH、血红素 c1、[2Fe-2S]、辅酶 Q' },
        { match: /复合体 IV/, structure: '线粒体内膜多亚基复合体', factors: '血红素 a/a3、CuA、CuB' },
        { match: /ATP 合酶|F₀F₁/, structure: 'F₀ 膜内转子与 F₁ 催化头部组成的旋转复合体', factors: 'Mg²⁺；依赖跨膜质子动力势' },
        { match: /辅酶 Q 池/, structure: '非蛋白酶；内膜中的脂溶性电子载体池', factors: '辅酶 Q / 泛醇' },
        { match: /内膜电化学梯度/, structure: '非蛋白酶；由跨膜 ΔpH 与膜电位共同形成', factors: 'H⁺ 梯度与膜电位' },
        { match: /线粒体甘油-3-磷酸脱氢酶/, structure: '内膜结合的 FAD 依赖型脱氢酶', factors: 'FAD、辅酶 Q' },
        { match: /脂肪酸合酶/, structure: '头尾排列的同源二聚体多功能酶', factors: '4′-磷酸泛酰巯基乙胺（ACP 辅基）、NADPH' },
        { match: /乙酰-CoA 羧化酶/, structure: '含 BC、BCCP 与 CT 的多结构域羧化酶', factors: '生物素、Mg²⁺ / Mn²⁺' },
        { match: /丙酮酸羧化酶/, structure: '同源四聚体多结构域羧化酶，含摆动的生物素载体臂', factors: '生物素、Mg²⁺；乙酰-CoA 为必需激活因子' },
        { match: /转酮醇酶/, structure: '同源二聚体', factors: 'TPP、Mg²⁺' },
        { match: /顺乌头酸酶/, structure: '单链铁硫酶', factors: '[4Fe-4S] 簇' },
        { match: /二氢乳清酸脱氢酶/, structure: 'N 端锚定线粒体内膜的黄素酶', factors: 'FMN、辅酶 Q' },
        { match: /核糖核苷酸还原酶/, structure: 'RRM1 大亚基与 RRM2 / RRM2B 小亚基组成的复合体', factors: '二铁-酪氨酰自由基中心、硫氧还蛋白' },
        { match: /^黄嘌呤氧化酶$/, structure: '同源二聚体钼黄素酶', factors: '钼蝶呤辅因子、FAD、两个 [2Fe-2S] 簇' },
        { match: /鸟嘌呤脱氨酶\/黄嘌呤氧化酶/, structure: '脱氨酶与黄嘌呤氧化酶组成的两步酶系', factors: 'Zn²⁺；钼蝶呤辅因子、FAD、[2Fe-2S] 簇' },
        { match: /氨基转移酶|转氨酶/, structure: '通常为同源二聚体的 PLP 依赖酶', factors: '磷酸吡哆醛（PLP）' },
        { match: /谷氨酸脱氢酶/, structure: '同源六聚体氧化还原酶', factors: 'NAD⁺ / NADP⁺' },
        { match: /葡萄糖-6-磷酸脱氢酶/, structure: '二聚体与四聚体之间转换的脱氢酶', factors: '催化性 NADP⁺；另有结构性 NADP⁺ 位点' },
        { match: /6-磷酸葡萄糖酸脱氢酶/, structure: '同源二聚体脱氢酶', factors: 'NADP⁺' },
        { match: /甘油醛-3-磷酸脱氢酶/, structure: '同源四聚体脱氢酶', factors: 'NAD⁺' },
        { match: /苹果酸脱氢酶|胞质甘油-3-磷酸脱氢酶/, structure: '同源二聚体脱氢酶', factors: 'NAD⁺ / NADH' },
        { match: /乳酸脱氢酶/, structure: '同源或异源四聚体脱氢酶', factors: 'NAD⁺ / NADH' },
        { match: /β-羟丁酸脱氢酶/, structure: '线粒体内膜相关脱氢酶', factors: 'NAD⁺ / NADH' },
        { match: /β-羟脂酰-CoA 脱氢酶/, structure: '同源二聚体或线粒体三功能蛋白中的脱氢酶结构域', factors: 'NAD⁺' },
        { match: /脂酰-CoA 脱氢酶/, structure: '链长特异的二聚体或四聚体黄素酶', factors: 'FAD' },
        { match: /异柠檬酸脱氢酶/, structure: 'NAD⁺ 依赖型异源四聚体', factors: 'NAD⁺、Mg²⁺ / Mn²⁺' },
        { match: /己糖激酶/, structure: '单链双结构域激酶', factors: 'Mg²⁺' },
        { match: /磷酸果糖激酶-1/, structure: '同源四聚体激酶', factors: 'Mg²⁺' },
        { match: /丙酮酸激酶/, structure: '同源四聚体激酶', factors: 'Mg²⁺、K⁺' },
        { match: /磷酸甘油酸激酶/, structure: '单链双结构域激酶', factors: 'Mg²⁺' },
        { match: /甘油激酶/, structure: '同源二聚体激酶', factors: 'Mg²⁺' },
        { match: /磷酸烯醇式丙酮酸羧激酶/, structure: '单链 GTP 依赖型羧激酶', factors: 'Mn²⁺ / Mg²⁺' },
        { match: /烯醇化酶/, structure: '同源二聚体', factors: 'Mg²⁺' },
        { match: /果糖-1,6-二磷酸酶/, structure: '同源四聚体水解酶', factors: 'Mg²⁺' },
        { match: /磷酸甘油酸变位酶/, structure: '同源二聚体变位酶', factors: '2,3-BPG（催化辅因子）' },
        { match: /磷酸葡萄糖变位酶/, structure: '单链磷酸丝氨酸型变位酶', factors: 'Mg²⁺、葡萄糖-1,6-二磷酸' },
        { match: /磷酸丙糖异构酶|磷酸葡萄糖异构酶/, structure: '同源二聚体异构酶', factors: '未见必需游离辅酶' },
        { match: /醛缩酶/, structure: '同源四聚体 I 类醛缩酶', factors: '未见必需游离辅酶；活性位点 Lys 形成席夫碱' },
        { match: /转醛醇酶/, structure: '单体 I 类转醛醇酶', factors: '未见必需游离辅酶；活性位点 Lys 形成席夫碱' },
        { match: /核酮糖-5-磷酸-3-差向异构酶/, structure: '金属依赖型差向异构酶', factors: '二价金属离子（常为 Fe²⁺ / Mn²⁺）' },
        { match: /核糖-5-磷酸异构酶/, structure: '单链异构酶', factors: '未见必需游离辅酶' },
        { match: /6-磷酸葡萄糖酸内酯酶/, structure: '单链水解酶', factors: '未见必需游离辅酶' },
        { match: /柠檬酸合酶/, structure: '同源二聚体缩合酶', factors: '未见必需游离辅酶' },
        { match: /琥珀酰-CoA 合成酶/, structure: 'αβ 异源二聚体', factors: 'Mg²⁺' },
        { match: /延胡索酸酶/, structure: '同源四聚体水合酶', factors: '未见必需游离辅酶' },
        { match: /烯酰-CoA 水合酶/, structure: '同源六聚体水合酶', factors: '未见必需游离辅酶' },
        { match: /HMG-CoA 合成酶/, structure: '同源二聚体缩合酶', factors: '未见必需游离辅酶' },
        { match: /HMG-CoA 裂解酶/, structure: '同源二聚体裂解酶', factors: 'Mg²⁺' },
        { match: /琥珀酰-CoA:3-酮酸 CoA 转移酶/, structure: '同源二聚体 CoA 转移酶', factors: '未见必需游离辅酶' },
        { match: /β-酮硫解酶|^硫解酶$/, structure: '同源四聚体硫解酶', factors: '未见必需游离辅酶；CoA 为反应底物' },
        { match: /糖原磷酸化酶/, structure: '同源二聚体', factors: '磷酸吡哆醛（PLP）' },
        { match: /糖原合酶/, structure: '寡聚型糖基转移酶', factors: '未见必需游离辅酶；UDP-葡萄糖供糖基' },
        { match: /精氨酸酶/, structure: '同源三聚体金属酶', factors: '双核 Mn²⁺ 中心' },
        { match: /鸟氨酸氨甲酰基转移酶/, structure: '同源三聚体转移酶', factors: '未见必需游离辅酶' },
        { match: /精氨代琥珀酸合成酶/, structure: '同源四聚体连接酶', factors: 'Mg²⁺' },
        { match: /精氨代琥珀酸裂解酶/, structure: '同源四聚体裂解酶', factors: '未见必需游离辅酶' },
        { match: /氨甲酰磷酸合成酶 I/, structure: '大型多结构域线粒体酶', factors: 'Mg²⁺；N-乙酰谷氨酸为必需激活因子' },
        { match: /氨甲酰磷酸合成酶 II/, structure: 'CAD 多功能蛋白中的 CPS II 结构域', factors: 'Mg²⁺' },
        { match: /天冬氨酸转氨甲酰酶/, structure: 'CAD 多功能蛋白中的 ATCase 结构域', factors: '未见必需游离辅酶' },
        { match: /^二氢乳清酸酶$/, structure: 'CAD 多功能蛋白中的金属水解酶结构域', factors: 'Zn²⁺' },
        { match: /乳清酸磷酸核糖转移酶\/乳清酸核苷酸脱羧酶/, structure: '两种催化结构域组成的双功能 UMP 合酶', factors: '未见必需游离辅酶' },
        { match: /胸苷酸合成酶/, structure: '同源二聚体', factors: '5,10-亚甲基-四氢叶酸' },
        { match: /AICAR 转化酶\/IMP 环水解酶/, structure: '同源二聚体双功能 ATIC 酶', factors: '10-甲酰-四氢叶酸' },
        { match: /IMP 脱氢酶\/GMP 合成酶/, structure: 'IMPDH 与 GMP 合成酶组成的两步酶系', factors: 'NAD⁺、Mg²⁺' },
        { match: /CTP 合成酶/, structure: '同源四聚体，可进一步装配成丝状结构', factors: 'Mg²⁺' },
        { match: /PRPP 合成酶/, structure: '同源六聚体磷酸核糖转移酶', factors: 'Mg²⁺' },
        { match: /GAR synthetase/, structure: '三功能 GART 蛋白中的 GAR 合成酶结构域', factors: 'Mg²⁺' },
        { match: /谷氨酰胺-PRPP 酰胺转移酶/, structure: '含谷氨酰胺酶与合成酶两个催化结构域', factors: '未见必需游离辅酶' },
        { match: /腺苷酸琥珀酸合成\/裂解酶系/, structure: '腺苷酸琥珀酸合成酶与裂解酶组成的两步酶系', factors: 'Mg²⁺' },
        { match: /腺苷酸激酶/, structure: '单链核苷酸激酶', factors: 'Mg²⁺' },
        { match: /鸟苷酸激酶\/nucleoside diphosphate kinase/, structure: '鸟苷酸激酶与 NDP 激酶组成的两步磷酸转移系统', factors: 'Mg²⁺' },
        { match: /核苷磷酸化酶/, structure: '同源三聚体磷酸解酶', factors: '未见必需游离辅酶' },
        { match: /核苷酸激酶系/, structure: '多种核苷酸激酶组成的磷酸转移系统', factors: 'Mg²⁺' },
        { match: /核酸酶|核苷酸酶/, structure: '水解酶家族；具体寡聚状态随成员而异', factors: '常需 Mg²⁺ / Mn²⁺，依具体酶而定' },
        { match: /ATP 柠檬酸裂解酶/, structure: '同源四聚体多结构域连接酶', factors: 'Mg²⁺、CoA' },
        { match: /UDP-葡萄糖焦磷酸化酶/, structure: '寡聚型核苷酸糖合成酶', factors: 'Mg²⁺' },
        { match: /葡萄糖-6-磷酸酶/, structure: '内质网膜多次跨膜催化蛋白', factors: '未见必需游离辅酶' },
        { match: /VDAC/, structure: '线粒体外膜 β-桶状通道', factors: '无游离辅酶；由电化学梯度驱动通量' },
        { match: /线粒体丙酮酸载体 MPC/, structure: 'MPC1 与 MPC2 组成的内膜异源寡聚体', factors: '无游离辅酶；与 H⁺ 协同转运' },
        { match: /腺嘌呤核苷酸转位酶 ANT/, structure: '六次跨膜的线粒体载体蛋白', factors: '无游离辅酶；以 ATP / ADP 反向交换' },
        { match: /肉碱-脂酰肉碱转位酶/, structure: '六次跨膜的线粒体内膜反向转运体', factors: '无游离辅酶；以肉碱与脂酰肉碱交换' },
        { match: /肉碱棕榈酰转移酶 1/, structure: '线粒体外膜寡聚型膜结合酶', factors: '未见必需游离辅酶；CoA 与肉碱为底物' },
        { match: /肉碱棕榈酰转移酶 2/, structure: '内膜基质侧的膜结合转移酶', factors: '未见必需游离辅酶；CoA 与肉碱为底物' },
        { match: /转运体|转位酶|载体|通道/, structure: '跨膜转运蛋白', factors: '无游离辅酶；依赖浓度梯度、质子耦联或底物交换' },
        { match: /氨基酸降解酶系/, structure: '按氨基酸分支组成的多酶系统；当前为合并净反应', factors: '常见 PLP、NAD(P)⁺、FAD、CoA；以具体分支为准' },
        { match: /嘧啶降解酶系/, structure: '由还原、水解与开环酶组成的多步系统', factors: 'NADPH' },
        { match: /多酶复合体|酶系/, structure: '多酶系统；当前记录为合并净反应', factors: '各分步酶分别需要，不能由净反应唯一确定' }
      ];
      const studentEquationCofactors = [
        { match: /NADP⁺|NADPH/, label: 'NADP⁺ / NADPH' },
        { match: /NAD⁺|NADH/, label: 'NAD⁺ / NADH' },
        { match: /FADH₂|FAD/, label: 'FAD / FADH₂' },
        { match: /CoQH₂|CoQ|辅酶 Q|泛醇/, label: '辅酶 Q / 泛醇' },
        { match: /CoA-SH|CoA/, label: '辅酶 A' },
        { match: /(?:10-甲酰|5,10-亚甲基-)?THF|DHF/, label: '四氢叶酸衍生物' },
        { match: /thioredoxin|硫氧还蛋白/i, label: '硫氧还蛋白' }
      ];
      function studentEnzymeFactsFor(reaction) {
        const enzyme = String(reaction?.enzyme || '').trim();
        const equation = String(reaction?.equation || '');
        const rule = studentEnzymeFactRules.find(item => item.match.test(enzyme));
        let structure = rule?.structure || '';
        if (!structure && enzyme.includes('/')) {
          const count = enzyme.split('/').filter(Boolean).length;
          structure = `${count} 个催化单元组成的多步或双功能酶系统`;
        }
        if (!structure) structure = /复合体|系统|酶系/.test(enzyme)
          ? '多亚基或多酶系统'
          : '单一催化酶；具体寡聚状态依同工酶而异';
        let factors = rule?.factors || '';
        if (!factors) {
          const detected = studentEquationCofactors.filter(item => item.match.test(equation)).map(item => item.label);
          if (/(?:ATP|GTP|UTP|CTP)/.test(equation)) detected.push('Mg²⁺（核苷酸反应通常需要）');
          factors = [...new Set(detected)].join('、') || '未见必需游离辅酶；主要依赖底物与活性位点催化';
        }
        return { structure, factors };
      }
      const pathwayRouteGroups = {
        glycolysis: 'glycolysis',
        pdh: 'pdh',
        tca: 'tca',
        etc: 'etc',
        oxphos: 'etc',
        malate_aspartate: 'transport',
        glycerol_phosphate: 'transport',
        atp_transport: 'transport'
      };
      const routeGroupForPathway = (pathwayId, pathway) => pathwayRouteGroups[pathwayId] || pathway?.routeGroup || null;
      const groupsFor = item => {
        if (Array.isArray(item.group)) return item.group;
        return String(item.group || '').trim().split(/[\s,]+/).filter(Boolean);
      };
      const expertSvgNamespace = 'http://www.w3.org/2000/svg';
      const warnedMissingReactionEndpoints = new Set();

      // #5 ── 专家模式 · SVG 渲染工具 ──────────────────────────────────
      function expertEntityPoint(entity) {
        if (!entity) return null;
        const focused = activePathway !== 'all' ? expertPathwayLayouts[activePathway]?.[entity.id] : null;
        return focused ? { ...entity, ...focused } : entity;
      }

      function expertEntityLabelGeometry(entity) {
        const point = expertEntityPoint(entity);
        const side = point.labelSide || 'right';
        if (side === 'left') return { point, x: point.x - 12, y: point.y - 7, anchor: 'end' };
        if (side === 'above') return { point, x: point.x, y: point.y - 15, anchor: 'middle' };
        if (side === 'below') return { point, x: point.x, y: point.y + 23, anchor: 'middle' };
        return { point, x: point.x + 12, y: point.y - 7, anchor: 'start' };
      }

      function expertSvgElement(tag, attributes = {}, textValue = '') {
        const element = document.createElementNS(expertSvgNamespace, tag);
        Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, String(value)));
        if (textValue) element.textContent = textValue;
        return element;
      }

      function expertReactionEndpoints(reaction) {
        const substrate = entityById[reaction?.from];
        const product = entityById[reaction?.to];
        if (substrate && product) return {
          substrate: expertEntityPoint(substrate),
          product: expertEntityPoint(product)
        };
        const key = reaction?.id || `${reaction?.from || '?'}>${reaction?.to || '?'}`;
        if (!warnedMissingReactionEndpoints.has(key)) {
          warnedMissingReactionEndpoints.add(key);
          console.warn(`[expert-map] 跳过缺少端点的反应 ${key}: ${reaction?.from || '?'} -> ${reaction?.to || '?'}`);
        }
        return null;
      }

      function curveBetween(a, b, bend = 0) {
        const dx = b.x - a.x, dy = b.y - a.y;
        const len = Math.max(1, Math.hypot(dx, dy));
        const nx = -dy / len, ny = dx / len;
        const c1x = a.x + dx * .34 + nx * bend;
        const c1y = a.y + dy * .34 + ny * bend;
        const c2x = b.x - dx * .34 + nx * bend;
        const c2y = b.y - dy * .34 + ny * bend;
        return `M ${a.x} ${a.y} C ${c1x} ${c1y} ${c2x} ${c2y} ${b.x} ${b.y}`;
      }

      function expertRouteBend(routeKey, a, b) {
      // #6 ── 路径几何 ──────────────────────────────────────────────────
        const dx = b.x - a.x, dy = b.y - a.y;
        const length = Math.max(1, Math.hypot(dx, dy));
        const normalX = -dy / length, normalY = dx / length;
        const midpointX = (a.x + b.x) / 2, midpointY = (a.y + b.y) / 2;
        const outwardDot = normalX * (midpointX - 800) + normalY * (midpointY - 600);
        let hash = 0;
        for (const character of String(routeKey || 'route')) hash = ((hash * 31) + character.charCodeAt(0)) >>> 0;
        const sign = Math.abs(outwardDot) > 12 ? Math.sign(outwardDot) : (hash % 2 ? 1 : -1);
        const variation = .88 + (hash % 5) * .04;
        if ((expertMapGuides.pathwayIds || []).includes(activePathway)) {
          // 局部膜剖面已经提供清晰轨道，连线只需轻微避让；继续使用全图
          // 48px 的弯曲幅度会让电子链和转运边重新交叉成团。
          return sign * Math.min(18, Math.max(3, length * .035)) * variation;
        }
        return sign * Math.min(48, Math.max(5, length * .085)) * variation;
      }

      function prepareRouteGeometry() {
        routeGeometry.clear();
        const buckets = new Map();
        reactions.forEach(reaction => {
          const key = `${reaction.from}>>${reaction.to}`;
          if (!buckets.has(key)) buckets.set(key, []);
          buckets.get(key).push(reaction);
        });
        buckets.forEach(list => {
          const firstEndpoints = expertReactionEndpoints(list[0]);
          if (!firstEndpoints) return;
          const corridorBend = expertRouteBend(`${list[0].from}>>${list[0].to}`, firstEndpoints.substrate, firstEndpoints.product);
          const corridorLength = Math.hypot(firstEndpoints.product.x - firstEndpoints.substrate.x, firstEndpoints.product.y - firstEndpoints.substrate.y);
          const laneGap = Math.min(18, Math.max(7, corridorLength * .035));
          list.forEach((reaction, index) => {
            const endpoints = expertReactionEndpoints(reaction);
            if (!endpoints) return;
            const { substrate: a, product: b } = endpoints;
            const bend = corridorBend + (index - (list.length - 1) / 2) * laneGap;
            const dx = b.x - a.x, dy = b.y - a.y;
            const length = Math.max(1, Math.hypot(dx, dy));
            const nx = -dy / length, ny = dx / length;
            routeGeometry.set(reaction.id, {
              d: curveBetween(a, b, bend),
              x: (a.x + b.x) / 2 + nx * bend * .75,
              y: (a.y + b.y) / 2 + ny * bend * .75
            });
          });
        });
      }

      // #7 ── 专家模式 · 构建地图 ──────────────────────────────────────
      function buildOrganelles() {
        const layer = document.getElementById('organelleLayer');
        organelles.forEach(o => {
          const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
          g.classList.add('organelle'); g.dataset.id = o.id; g.dataset.name = o.name;
          g.setAttribute('role', 'button'); g.setAttribute('aria-label', `${o.name}：查看并进入自由探索`); g.tabIndex = 0;
          const hit = expertSvgElement('ellipse', { class: 'organelle-hit', cx: o.x, cy: o.y, rx: o.rx, ry: o.ry });
          const labelHit = expertSvgElement('rect', { class: 'organelle-label-hit', x: o.x - o.rx + 10, y: o.y - o.ry + 7, width: 230, height: 50, rx: 10 });
          const label = expertSvgElement('text', { class: 'org-label', x: o.x - o.rx + 22, y: o.y - o.ry + 28 }, o.name);
          const sub = expertSvgElement('text', { class: 'micro-label', x: o.x - o.rx + 22, y: o.y - o.ry + 46 }, o.sub);
          g.append(hit, labelHit, label, sub);
          g.addEventListener('click', event => { event.stopPropagation(); focusOrganelles(o, false); });
          g.addEventListener('keydown', event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); o.sceneId ? openScene(o.sceneId) : focusOrganelles(o, false); } });
          layer.appendChild(g);
        });
      }

      function buildCompartmentTags() {
        const layer = document.getElementById('organelleLayer');
        [
          ['细胞质', 805, 560],
          ['外膜', 846, 610],
          ['膜间隙', 820, 651],
          ['内膜', 790, 708],
          ['线粒体基质', 680, 816]
        ].forEach(([label, x, y]) => {
          const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
          text.classList.add('compartment-tag');
          text.textContent = label; text.setAttribute('x', x); text.setAttribute('y', y);
          layer.appendChild(text);
        });
      }

      function updateExpertCompartmentGuide() {
        document.querySelectorAll('#compartmentGuideLayer .expert-compartment-guide').forEach(guideGroup => {
          const pathways = String(guideGroup.dataset.pathways || '').split(/\s+/).filter(Boolean);
          const visible = pathways.includes(activePathway);
          guideGroup.classList.toggle('active', visible);
          guideGroup.setAttribute('aria-hidden', String(!visible));
        });
      }

      function syncExpertInteractiveStates() {
        const focused = activePathway !== 'all';
        document.body.classList.toggle('selection-active', focused);
        document.body.classList.toggle('pathway-focus', focused);
        document.querySelectorAll('.route,.route-aura,.route-title,.entity,.enzyme').forEach(el => {
          const linked = !focused || groupsFor({ group: el.dataset.group }).includes(activePathway);
          el.classList.toggle('dim', focused && !linked);
          el.classList.toggle('pathway-active', focused && linked);
        });
        if (expertMapBuilt) updateExpertMapGeometry();
      }

      function buildExpertCompartmentGuides() {
        const layer = document.getElementById('compartmentGuideLayer');
        const guide = expertMapGuides.mitochondrialInnerMembrane;
        if (!layer || !guide?.zones) return;
        const group = expertSvgElement('g', {
          class: 'expert-compartment-guide',
          'data-guide': guide.id,
          'data-pathways': (expertMapGuides.pathwayIds || []).join(' '),
          'aria-hidden': 'true'
        });
        group.appendChild(expertSvgElement('rect', {
          class: 'expert-guide-surface',
          x: guide.x,
          y: guide.y,
          width: guide.width,
          height: guide.height,
          rx: 26
        }));
        ['cytosol', 'ims', 'matrix'].forEach(zoneName => {
          const zone = guide.zones[zoneName];
          group.appendChild(expertSvgElement('rect', {
            class: `expert-guide-zone expert-guide-zone-${zoneName}`,
            x: zone.x1,
            y: zone.y1,
            width: zone.x2 - zone.x1,
            height: zone.y2 - zone.y1,
            rx: zoneName === 'matrix' ? 18 : 10
          }));
        });
        ['outerMembrane', 'membrane'].forEach(zoneName => {
          const zone = guide.zones[zoneName];
          group.appendChild(expertSvgElement('rect', {
            class: 'expert-guide-membrane',
            x: zone.x1,
            y: zone.y1,
            width: zone.x2 - zone.x1,
            height: zone.y2 - zone.y1,
            rx: 5
          }));
        });
        group.append(
          expertSvgElement('text', { class: 'expert-guide-title', x: guide.x + 24, y: guide.y + 25 }, guide.title),
          expertSvgElement('text', { class: 'expert-guide-note', x: guide.x + guide.width - 24, y: guide.y + 24, 'text-anchor': 'end' }, '按膜两侧表达，不对应某一条具体嵴')
        );
        Object.entries(guide.zones).forEach(([, zone]) => {
          group.appendChild(expertSvgElement('text', {
            class: 'expert-guide-label',
            x: guide.x + 18,
            y: (zone.y1 + zone.y2) / 2 + 4,
            'text-anchor': 'start'
          }, zone.label));
        });
        layer.appendChild(group);
        updateExpertCompartmentGuide();
      }

      function buildExpertErCompartmentGuide() {
        const layer = document.getElementById('compartmentGuideLayer');
        const guide = expertMapGuides.endoplasmicReticulumMembrane;
        if (!layer || !guide?.zones) return;
        const group = expertSvgElement('g', {
          class: 'expert-compartment-guide expert-compartment-guide-er',
          'data-guide': guide.id,
          'data-pathways': (expertMapGuides.erPathwayIds || []).join(' '),
          'aria-hidden': 'true'
        });
        group.appendChild(expertSvgElement('rect', {
          class: 'expert-guide-surface',
          x: guide.x,
          y: guide.y,
          width: guide.width,
          height: guide.height,
          rx: 26
        }));
        ['cytosol', 'lumen'].forEach(zoneName => {
          const zone = guide.zones[zoneName];
          group.appendChild(expertSvgElement('rect', {
            class: `expert-guide-zone expert-guide-zone-${zoneName}`,
            x: zone.x1,
            y: zone.y1,
            width: zone.x2 - zone.x1,
            height: zone.y2 - zone.y1,
            rx: 16
          }));
        });
        const membrane = guide.zones.membrane;
        group.appendChild(expertSvgElement('rect', {
          class: 'expert-guide-membrane',
          x: membrane.x1,
          y: membrane.y1,
          width: membrane.x2 - membrane.x1,
          height: membrane.y2 - membrane.y1,
          rx: 8
        }));
        group.append(
          expertSvgElement('text', { class: 'expert-guide-title', x: guide.x + 24, y: guide.y + 27 }, guide.title),
          expertSvgElement('text', { class: 'expert-guide-note', x: guide.x + guide.width - 24, y: guide.y + 25, 'text-anchor': 'end' }, '跨膜步骤按两侧表达')
        );
        Object.values(guide.zones).forEach(zone => {
          group.appendChild(expertSvgElement('text', {
            class: 'expert-guide-label',
            x: guide.x + 18,
            y: (zone.y1 + zone.y2) / 2 + 4
          }, zone.label));
        });
        layer.appendChild(group);
        updateExpertCompartmentGuide();
      }

      function buildExpertGluconeogenesisGuide() {
        const layer = document.getElementById('compartmentGuideLayer');
        const guide = expertMapGuides.gluconeogenesisCrossCompartment;
        if (!layer || !guide?.zones) return;
        const group = expertSvgElement('g', {
          class: 'expert-compartment-guide expert-compartment-guide-gluconeogenesis',
          'data-guide': guide.id,
          'data-pathways': (expertMapGuides.gluconeogenesisPathwayIds || []).join(' '),
          'aria-hidden': 'true'
        });
        group.appendChild(expertSvgElement('rect', {
          class: 'expert-guide-surface',
          x: guide.x,
          y: guide.y,
          width: guide.width,
          height: guide.height,
          rx: 26
        }));
        ['cytosol', 'ims', 'matrix', 'erLumen'].forEach(zoneName => {
          const zone = guide.zones[zoneName];
          const visualZone = zoneName === 'erLumen' ? 'lumen' : zoneName;
          group.appendChild(expertSvgElement('rect', {
            class: `expert-guide-zone expert-guide-zone-${visualZone}`,
            x: zone.x1,
            y: zone.y1,
            width: zone.x2 - zone.x1,
            height: zone.y2 - zone.y1,
            rx: 14
          }));
        });
        ['membrane', 'erMembrane'].forEach(zoneName => {
          const zone = guide.zones[zoneName];
          group.appendChild(expertSvgElement('rect', {
            class: 'expert-guide-membrane',
            x: zone.x1,
            y: zone.y1,
            width: zone.x2 - zone.x1,
            height: zone.y2 - zone.y1,
            rx: 6
          }));
        });
        group.append(
          expertSvgElement('text', { class: 'expert-guide-title', x: guide.x + 24, y: guide.y + 27 }, guide.title),
          expertSvgElement('text', { class: 'expert-guide-note', x: guide.x + guide.width - 24, y: guide.y + 25, 'text-anchor': 'end' }, '先经线粒体绕行，再回到细胞质并进入内质网'),
          expertSvgElement('text', { class: 'expert-guide-label', x: guide.zones.cytosol.x2 - 12, y: guide.zones.cytosol.y1 + 18, 'text-anchor': 'end' }, guide.zones.cytosol.label),
          expertSvgElement('text', { class: 'expert-guide-label', x: guide.zones.ims.x2 - 10, y: guide.zones.ims.y1 + 18, 'text-anchor': 'end' }, guide.zones.ims.label),
          expertSvgElement('text', { class: 'expert-guide-label', x: guide.zones.membrane.x2 - 10, y: guide.zones.membrane.y2 - 2, 'text-anchor': 'end' }, guide.zones.membrane.label),
          expertSvgElement('text', { class: 'expert-guide-label', x: guide.zones.matrix.x2 - 10, y: guide.zones.matrix.y1 + 18, 'text-anchor': 'end' }, guide.zones.matrix.label),
          expertSvgElement('text', { class: 'expert-guide-label', x: guide.zones.erMembrane.x2 - 10, y: guide.zones.erMembrane.y2 - 3, 'text-anchor': 'end' }, guide.zones.erMembrane.label),
          expertSvgElement('text', { class: 'expert-guide-label', x: guide.zones.erLumen.x2 - 10, y: guide.zones.erLumen.y1 + 18, 'text-anchor': 'end' }, guide.zones.erLumen.label)
        );
        layer.appendChild(group);
        updateExpertCompartmentGuide();
      }

      function buildRoutes() {
        const layer = document.getElementById('routeLayer');
        prepareRouteGeometry();
        reactions.forEach((r, index) => {
          const endpoints = expertReactionEndpoints(r);
          if (!endpoints) return;
          const { substrate: a, product: b } = endpoints;
          const geometry = routeGeometry.get(r.id);
          const routeGroups = groupsFor(r);
          const visualGroup = routeGroups.map(group => routeGroupForPathway(group, atlas.pathways[group]) || group).find(group => ['glycolysis', 'pdh', 'tca', 'etc', 'transport'].includes(group)) || 'side';
          const groupData = routeGroups.join(' ');
          // 总览只展示同一核心通路内的主干反应；跨通路与转运反应在聚焦后再展开。
          // 这样不会牺牲机制数据或点击命中，只把视觉噪声从默认视图中收起来。
          const overviewMuted = visualGroup === 'transport' || routeGroups.length > 1;
          const d = geometry?.d || curveBetween(a, b);
          const aura = document.createElementNS('http://www.w3.org/2000/svg', 'path');
          aura.classList.add('route-aura', `route-${visualGroup}`);
          if (visualGroup === 'side') aura.classList.add('route-secondary');
          if (overviewMuted) aura.classList.add('route-overview-muted');
          if (r.detail) aura.classList.add('detail-route');
          aura.dataset.id = r.id; aura.dataset.group = groupData;
          aura.setAttribute('d', d); aura.setAttribute('aria-hidden', 'true');
          aura.addEventListener('mouseenter', () => document.querySelector(`.enzyme[data-id="${r.id}"]`)?.classList.add('preview'));
          aura.addEventListener('mouseleave', () => document.querySelector(`.enzyme[data-id="${r.id}"]`)?.classList.remove('preview'));
          aura.addEventListener('click', event => { event.stopPropagation(); openReaction(r, event); });
          layer.appendChild(aura);
          const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
          path.classList.add('route', `route-${visualGroup}`); path.dataset.id = r.id; path.dataset.group = groupData;
          if (overviewMuted) path.classList.add('route-overview-muted');
          path.classList.toggle('reversible', Boolean(r.reversible));
          path.dataset.direction = r.reversible ? 'reversible' : 'forward';
          if (visualGroup === 'side') path.classList.add('route-secondary');
          if (r.detail) path.classList.add('detail-route');
          path.setAttribute('d', d); path.setAttribute('pathLength', '1');
          const routeMarker = `url(#${pathwayMeta[visualGroup]?.marker || 'arrow-etc'})`;
          path.setAttribute('marker-end', routeMarker);
          if (r.reversible) path.setAttribute('marker-start', routeMarker);
          path.setAttribute('role', 'button');
          path.setAttribute('aria-label', `${r.reversible ? '可逆反应' : '单向反应'}，${a.name} 到 ${b.name}：${r.equation}`); path.tabIndex = 0;
          path.appendChild(expertSvgElement('title', {}, `${r.reversible ? '可逆' : '单向'} · ${r.equation || `${a.name} → ${b.name}`}`));
          path.addEventListener('mouseenter', () => document.querySelector(`.enzyme[data-id="${r.id}"]`)?.classList.add('preview'));
          path.addEventListener('mouseleave', () => document.querySelector(`.enzyme[data-id="${r.id}"]`)?.classList.remove('preview'));
          path.addEventListener('focus', () => document.querySelector(`.enzyme[data-id="${r.id}"]`)?.classList.add('preview'));
          path.addEventListener('blur', () => document.querySelector(`.enzyme[data-id="${r.id}"]`)?.classList.remove('preview'));
          path.addEventListener('click', event => { event.stopPropagation(); openReaction(r, event); });
          path.addEventListener('keydown', event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); openReaction(r, event); } });
          layer.appendChild(path);
        });
        const labels = [
          ['糖酵解', 410, 224, 'glycolysis'], ['丙酮酸氧化', 665, 755, 'pdh'], ['三羧酸循环', 318, 1032, 'tca'], ['氧化磷酸化', 585, 775, 'etc']
        ];
        labels.forEach(([text, x, y, group]) => {
          const t = document.createElementNS('http://www.w3.org/2000/svg', 'text'); t.classList.add('route-title'); t.dataset.group = group; t.textContent = text; t.setAttribute('x', x); t.setAttribute('y', y); layer.appendChild(t);
        });
      }

      function buildEntities() {
        const layer = document.getElementById('entityLayer');
        entities.forEach(e => {
          const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
          g.classList.add('entity'); if (e.primary) g.classList.add('primary'); g.dataset.id = e.id; g.dataset.group = e.group.join(' '); g.style.setProperty('--tone', pathwayMeta[e.group[0]]?.tone || '#2f9eb5');
          const coreGroups = ['glycolysis', 'pdh', 'tca', 'etc', 'transport'];
          if (!groupsFor(e).some(group => coreGroups.includes(routeGroupForPathway(group, atlas.pathways[group]) || group))) g.classList.add('entity-secondary');
          if (e.detail) g.classList.add('detail-node');
          g.dataset.entityKey = e.entityKey || e.id;
          const visual = expertEntityLabelGeometry(e);
          const point = visual.point;
          const formula = e.formula || e.substance;
          g.setAttribute('role', 'button'); g.setAttribute('aria-label', `${e.name} ${formula}`); g.tabIndex = 0;
          const haloRadius = e.primary ? 8.5 : 6.5;
          const coreRadius = e.primary ? 4.1 : 3.2;
          g.append(
            expertSvgElement('circle', { class: 'hit-target', cx: point.x, cy: point.y, r: 14 }),
            expertSvgElement('circle', { class: 'halo', cx: point.x, cy: point.y, r: haloRadius }),
            expertSvgElement('circle', { class: 'core', cx: point.x, cy: point.y, r: coreRadius }),
            expertSvgElement('text', { class: 'entity-label', x: visual.x, y: visual.y, 'text-anchor': visual.anchor }, e.label),
            expertSvgElement('text', { class: 'entity-formula', x: visual.x, y: visual.y + 15, 'text-anchor': visual.anchor }, formula)
          );
          g.addEventListener('click', event => { event.stopPropagation(); openEntity(e, event); });
          g.addEventListener('keydown', event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); openEntity(e, event); } });
          layer.appendChild(g);
        });
      }

      function buildEnzymes() {
        const layer = document.getElementById('enzymeLayer');
        reactions.filter(r => r.enzyme).forEach(r => {
          const endpoints = expertReactionEndpoints(r);
          if (!endpoints) return;
          const { substrate: a, product: b } = endpoints;
          const routeGroups = groupsFor(r);
          const geometry = routeGeometry.get(r.id);
          const x = geometry?.x ?? (a.x + b.x) / 2;
          const y = (geometry?.y ?? (a.y + b.y) / 2) - 18;
          const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
          g.classList.add('enzyme'); g.dataset.id = r.id; g.dataset.group = routeGroups.join(' ');
          if (r.detail) g.classList.add('detail-route');
          const short = r.enzyme.length > 12 ? r.enzyme.slice(0, 11) + '…' : r.enzyme;
          g.append(
            expertSvgElement('circle', { cx: x, cy: y, r: 5.5, class: 'enzyme-dot' }),
            expertSvgElement('text', { x, y: y + 1 }, short)
          );
          g.addEventListener('click', event => { event.stopPropagation(); openReaction(r, event); });
          layer.appendChild(g);
        });
      }

      // #8 ── 专家模式 · 几何更新 ──────────────────────────────────────
      function updateExpertMapGeometry() {
        updateExpertCompartmentGuide();
        prepareRouteGeometry();
        reactions.forEach(reaction => {
          const geometry = routeGeometry.get(reaction.id);
          if (!geometry) return;
          document.querySelectorAll(`.route[data-id="${CSS.escape(reaction.id)}"],.route-aura[data-id="${CSS.escape(reaction.id)}"]`)
            .forEach(path => path.setAttribute('d', geometry.d));
          const enzyme = document.querySelector(`.enzyme[data-id="${CSS.escape(reaction.id)}"]`);
          if (!enzyme) return;
          const x = geometry.x, y = geometry.y - 18;
          const dot = enzyme.querySelector('circle'), label = enzyme.querySelector('text');
          if (dot) { dot.setAttribute('cx', x); dot.setAttribute('cy', y); }
          if (label) { label.setAttribute('x', x); label.setAttribute('y', y + 1); }
        });
        entities.forEach(entity => {
          const group = document.querySelector(`.entity[data-id="${CSS.escape(entity.id)}"]`);
          if (!group) return;
          const visual = expertEntityLabelGeometry(entity), point = visual.point;
          group.querySelectorAll('circle').forEach(circle => {
            circle.setAttribute('cx', point.x); circle.setAttribute('cy', point.y);
          });
          const label = group.querySelector('.entity-label');
          const formula = group.querySelector('.entity-formula');
          [label, formula].forEach((text, index) => {
            if (!text) return;
            text.setAttribute('x', visual.x);
            text.setAttribute('y', visual.y + index * 15);
            text.setAttribute('text-anchor', visual.anchor);
          });
        });
      }

      const expertPathwayIconSources = {
        all: 'cell-metabolism-assets/pathway-icons/optimized/all.webp',
        pdh: 'cell-metabolism-assets/pathway-icons/optimized/pdh.webp',
        tca: 'cell-metabolism-assets/pathway-icons/optimized/tca.webp',
        malate_aspartate: 'cell-metabolism-assets/pathway-icons/optimized/malate_aspartate.webp',
        glycerol_phosphate: 'cell-metabolism-assets/pathway-icons/optimized/glycerol_phosphate.webp',
        etc: 'cell-metabolism-assets/pathway-icons/optimized/etc.webp',
        oxphos: 'cell-metabolism-assets/pathway-icons/optimized/oxphos.webp',
        glycolysis: 'cell-metabolism-assets/pathway-icons/optimized/glycolysis.webp',
        gluconeogenesis: 'cell-metabolism-assets/pathway-icons/optimized/gluconeogenesis.webp',
        glycogenesis: 'cell-metabolism-assets/pathway-icons/optimized/glycogenesis.webp',
        glycogenolysis: 'cell-metabolism-assets/pathway-icons/optimized/glycogenolysis.webp',
        ppp: 'cell-metabolism-assets/pathway-icons/optimized/ppp.webp',
        fa_synthesis: 'cell-metabolism-assets/pathway-icons/optimized/fa_synthesis.webp',
        carnitine: 'cell-metabolism-assets/pathway-icons/optimized/carnitine.webp',
        beta_oxidation: 'cell-metabolism-assets/pathway-icons/optimized/beta_oxidation.webp',
        ketone: 'cell-metabolism-assets/pathway-icons/optimized/ketone.webp',
        transamination: 'cell-metabolism-assets/pathway-icons/optimized/transamination.webp',
        urea: 'cell-metabolism-assets/pathway-icons/optimized/urea.webp',
        aa_carbon: 'cell-metabolism-assets/pathway-icons/optimized/aa_carbon.webp',
        purine: 'cell-metabolism-assets/pathway-icons/optimized/purine.webp',
        pyrimidine: 'cell-metabolism-assets/pathway-icons/optimized/pyrimidine.webp',
        nucleotide_degradation: 'cell-metabolism-assets/pathway-icons/optimized/nucleotide_degradation.webp'
      };

      // #9 ── 专家模式 · 筛选器与预览 ──────────────────────────────────
      function createPathwayFilterIcon(pathwayId, tone) {
        const icon = document.createElement('img');
        icon.className = 'path-filter-icon';
        icon.src = expertPathwayIconSources[pathwayId];
        icon.alt = '';
        icon.loading = 'eager';
        icon.decoding = 'async';
        icon.setAttribute('aria-hidden', 'true');
        icon.addEventListener('error', () => {
          const fallback = document.createElement('i');
          fallback.style.setProperty('--tone', tone || '#2f9eb5');
          icon.replaceWith(fallback);
        }, { once: true });
        return icon;
      }

      function buildFilters() {
        const wrap = document.getElementById('pathFilters');
        const all = document.createElement('button'); all.className = 'path-filter active'; all.dataset.path = 'all'; all.title = '显示全部核心通路';
        all.style.setProperty('--tone', '#2f9eb5');
        all.append(createPathwayFilterIcon('all', '#2f9eb5'), document.createTextNode('重点总览')); wrap.appendChild(all);
        coreStudyPathwayIds.forEach(key => {
          const meta = pathwayMeta[key];
          if (!meta) return;
          const b = document.createElement('button'); b.className = 'path-filter'; b.dataset.path = key; b.style.setProperty('--tone', meta.tone);
          b.title = `${meta.label} · 单击查看第 2 层通路总览`;
          b.append(createPathwayFilterIcon(key, meta.tone), document.createTextNode(meta.label)); wrap.appendChild(b);
        });
        wrap.addEventListener('click', event => {
          const btn = event.target.closest('.path-filter'); if (!btn) return;
          activePathway = btn.dataset.path;
          updateExpertPathPreview(activePathway);
          updateExpertMapGeometry();
          document.body.classList.toggle('selection-active', activePathway !== 'all');
          document.body.classList.toggle('pathway-focus', activePathway !== 'all');
          document.body.classList.remove('enzyme-visible');
          wrap.querySelectorAll('.path-filter').forEach(x => x.classList.toggle('active', x === btn));
          document.body.classList.remove('entity-focus', 'reaction-focus', 'organelle-focus');
          document.querySelectorAll('.entity.context-label').forEach(el => el.classList.remove('context-label'));
          document.querySelectorAll('.route,.route-aura,.route-title,.entity,.enzyme').forEach(el => {
            const linked = activePathway === 'all' || groupsFor({ group: el.dataset.group }).includes(activePathway);
            el.classList.toggle('dim', !linked);
            el.classList.toggle('pathway-active', activePathway !== 'all' && linked);
          });
          if (activePathway === 'all') animateViewTo(base, 360);
          else focusPathway(activePathway);
        });
      }

      // 专家导航中的图片按通路优先，而不是简单复用整个细胞器的第一张图。
      // 每条核心通路都登记自己的入口图；暂时没有专属机制图的通路，使用
      // 同一区室的干净结构图作为稳定占位，后续替换素材时无需改交互逻辑。
      const expertSceneVisualProfiles = {
        'cell-atlas': ['完整细胞结构总览', 'cell-metabolism-assets/optimized/28-cell-overview-rev2.webp'],
        cytosol: ['细胞质代谢总览', 'cell-metabolism-assets/optimized/02-cytoplasm-overview.webp'],
        mitochondria: ['线粒体整体结构图', 'cell-metabolism-assets/optimized/18-mitochondrion-isolated.webp'],
        'mitochondria-matrix': ['线粒体基质结构图', 'cell-metabolism-assets/optimized/25-mitochondrial-matrix-detailed.webp'],
        'mitochondria-inner-membrane': ['线粒体内膜能量转换图', 'cell-metabolism-assets/optimized/27-etc-electron-transport-full.webp'],
        'smooth-er-lipid': ['平滑内质网与脂滴', 'cell-metabolism-assets/optimized/10-smooth-er-lipid-droplet.webp'],
        'nucleus-er': ['细胞核与内质网', 'cell-metabolism-assets/optimized/07-nucleus-er.webp'],
        'endosome-lysosome': ['内体—溶酶体结构图', 'cell-metabolism-assets/optimized/33-endosome-lysosome-maturation-clean.webp'],
        peroxisome: ['过氧化物酶体结构图', 'cell-metabolism-assets/optimized/35-peroxisome-interior-clean.webp'],
        'plasma-membrane': ['质膜运输结构图', 'cell-metabolism-assets/optimized/36-plasma-membrane-transport-clean.webp'],
        golgi: ['高尔基体加工图', 'cell-metabolism-assets/optimized/32-golgi-cis-medial-trans-clean.webp'],
        'plant-extension': ['植物细胞区室图', 'cell-metabolism-assets/optimized/37-plant-cell-overview.svg']
      };
      const expertPathwayVisualLabels = {
        pdh: '丙酮酸跨膜进入基质与 PDH', tca: '三羧酸循环所在基质', beta_oxidation: '脂肪酸 β-氧化基质',
        ketone: '酮体生成所在基质', urea: '尿素循环基质—胞质接力', etc: '蓝白色电子传递链全貌',
        oxphos: '蓝白色电子传递链全貌', malate_aspartate: '苹果酸–天冬氨酸穿梭',
        glycerol_phosphate: '甘油-3-磷酸穿梭', atp_transport: 'ATP/ADP 与磷酸转运', carnitine: '肉碱穿梭',
        glycolysis: '糖酵解细胞质路线', gluconeogenesis: '糖异生的基质—胞质—内质网接力', glycogenesis: '糖原合成细胞质路线',
        glycogenolysis: '糖原动员与肝细胞内质网释糖', ppp: '磷酸戊糖途径细胞质路线', fa_synthesis: '脂肪酸从头合成（胞质）',
        purine: '嘌呤核苷酸合成', pyrimidine: '嘧啶核苷酸合成',
        nucleotide_degradation: '胞质核苷酸降解与补救回收'
      };
      const expertPathwayVisualSources = {
        // 第二层始终使用对应细胞器的完整解剖图；通路差异由下方 SVG 线路层表达。
        // 肉碱穿梭例外：必须同时看见外膜、膜间隙、内膜与基质。
        carnitine: 'cell-metabolism-assets/optimized/23-mitochondrion-blueprint.webp',
        pdh: 'cell-metabolism-assets/optimized/04-cytoplasm-mito-interface.webp',
        // 尿素循环横跨基质与细胞质，需要同时看到线粒体边界与外侧细胞质。
        urea: 'cell-metabolism-assets/optimized/04-cytoplasm-mito-interface.webp',
        aa_carbon: 'cell-metabolism-assets/optimized/04-cytoplasm-mito-interface.webp',
        transamination: 'cell-metabolism-assets/optimized/04-cytoplasm-mito-interface.webp',
        purine: 'cell-metabolism-assets/optimized/02-cytoplasm-overview.webp',
        gluconeogenesis: 'cell-metabolism-assets/optimized/04-cytoplasm-mito-interface.webp',
        // 嘧啶从头合成主体在细胞质，仅 DHODH 位于线粒体内膜。
        pyrimidine: 'cell-metabolism-assets/optimized/04-cytoplasm-mito-interface.webp'
      };
      const expertPathwayVisualOverrides = Object.fromEntries(
        coreStudyPathwayIds
          .map(pathwayId => {
            const pathway = atlas.pathways[pathwayId];
            const profileSceneId = expertMechanismSceneForPathway(pathway);
            const profile = expertSceneVisualProfiles[profileSceneId];
            if (!pathway || !profile) return null;
            return [pathwayId, [expertPathwayVisualLabels[pathwayId] || profile[0], expertPathwayVisualSources[pathwayId] || profile[1]]];
          })
          .filter(Boolean)
      );

      function updateExpertPathPreview(pathwayId) {
        if (!expertPathPreview || !expertPathPreviewImage) return;
        const pathway = atlas.pathways[pathwayId];
        const entrySceneId = pathway ? expertEntrySceneForPathway(pathway) : null;
        const scene = entrySceneId ? atlas.scenes[entrySceneId] : null;
        const view = scene?.views?.[0] || null;
        const source = Array.isArray(view) ? view[1] : view?.src;
        const label = Array.isArray(view) ? view[0] : view?.label;
        if (pathway && scene && source && pathwayId !== 'all') {
          expertPathPreview.hidden = false;
          if (pathNoteCopy) pathNoteCopy.hidden = true;
          expertPathPreviewImage.src = source;
          expertPathPreviewImage.alt = `${displayText(pathway.name)}通路总览`;
          expertPathPreviewTitle.textContent = displayText(pathway.name);
          expertPathPreviewCaption.textContent = `${displayText(scene.title || '所属场景')} · 点击进入通路机制图`;
          expertPathPreview.setAttribute('aria-label', `进入${displayText(pathway.name)}的通路机制图`);
          const routeGroup = routeGroupForPathway(pathwayId, pathway) || pathwayId;
          const pathwayReactions = reactions.filter(reaction => groupsFor(reaction).includes(pathwayId) || groupsFor(reaction).includes(routeGroup));
          const pathwayEntityIds = new Set(pathwayReactions.flatMap(reaction => [reaction.from, reaction.to]));
          const enzymeCount = pathwayReactions.filter(reaction => reaction.enzyme).length;
          const irreversibleCount = pathwayReactions.filter(reaction => !reaction.reversible).length;
          if (pathFocusStats) pathFocusStats.textContent = `${pathwayEntityIds.size} 个代谢物节点 · ${enzymeCount} 个酶节点 · ${irreversibleCount} 个单向步骤`;
          return;
        }
        expertPathPreview.hidden = true;
        if (pathNoteCopy) pathNoteCopy.hidden = false;
        expertPathPreviewImage.removeAttribute('src');
        if (pathFocusStats) pathFocusStats.textContent = '';
      }

      // #10 ── 专家模式 · 预览入口 ─────────────────────────────────────
      function expertEntrySceneForPathway(pathway) {
        if (pathway?.expertEntryScene && atlas.scenes[pathway.expertEntryScene]) return pathway.expertEntryScene;
        return pathway?.scene && atlas.scenes[pathway.scene] ? pathway.scene : null;
      }

      function expertMechanismSceneForPathway(pathway) {
        const sceneId = pathway?.expertMechanismScene || pathway?.scene;
        return sceneId && atlas.scenes[sceneId] ? sceneId : null;
      }

      function pathwayBelongsToScene(pathwayId, sceneId) {
        const pathway = atlas.pathways[pathwayId];
        if (!pathway || !sceneId) return false;
        // 学生/数据归属仍由 pathway.scene 表达；专家机制页使用专用机制场景。
        return expertMechanismSceneForPathway(pathway) === sceneId;
      }

      function openExpertPathPreview() {
        if (!activePathway || activePathway === 'all') return;
        const pathwayId = activePathway;
        const pathway = atlas.pathways[pathwayId];
        const entryScene = expertEntrySceneForPathway(pathway);
        if (!entryScene) return;
        // 主路径按通路理解推进：第 2 层总览卡直接进入第 3 层机制图。
        // 细胞器与区室保留在完整细胞的自由探索路径中，不再作为必经关卡。
        openScene(entryScene, { pathwayId, preservePathway: true });
      }
      expertPathPreview?.addEventListener('click', event => { event.stopPropagation(); openExpertPathPreview(); });
      expertPathPreview?.addEventListener('keydown', event => {
        if (event.key !== 'Enter' && event.key !== ' ') return;
        event.preventDefault(); event.stopPropagation(); openExpertPathPreview();
      });

      function ensureExpertMapBuilt() {
        if (expertMapBuilt) return;
        buildOrganelles();
        buildCompartmentTags();
        buildExpertCompartmentGuides();
        buildExpertErCompartmentGuide();
        buildExpertGluconeogenesisGuide();
        buildRoutes();
        buildEntities();
        buildEnzymes();
        buildFilters();
        expertMapBuilt = true;
        applyView();
      }

      const studentPathwayTones = { glycolysis: '#d99736', tca: '#d57e55', etc: '#2b91a5', beta_oxidation: '#bd7c3d', ppp: '#5e9b86' };
      const studentTopicCatalog = {
        biooxidation: {
          label: '生物氧化', badge: '生', english: 'Biological oxidation', tone: '#2b91a5',
          scope: '丙酮酸、三羧酸循环、电子传递链、氧化磷酸化',
          summary: '把含碳燃料中的电子收集起来，经呼吸链建立质子梯度，最终合成 ATP。',
          structureTitle: '从碳氧化到 ATP 的四个位置',
          structure: [['丙酮酸入场', '丙酮酸进入线粒体并形成乙酰辅酶 A'], ['循环收集电子', '三羧酸循环生成 NADH 和 FADH₂'], ['电子跨膜传递', '穿梭与呼吸链把电子送入内膜复合体'], ['梯度驱动产能', '质子回流推动 ATP 合酶']],
          pathways: ['pdh', 'tca', 'malate_aspartate', 'glycerol_phosphate', 'etc', 'oxphos'],
          links: [['pdh', 'tca'], ['tca', 'etc'], ['malate_aspartate', 'etc'], ['glycerol_phosphate', 'etc'], ['etc', 'oxphos']],
          visuals: [
            ['丙酮酸脱氢酶复合体机制', 'cell-metabolism-assets/optimized/39-pdh-complex-mechanism.svg', 'E1、E2、E3 与五种辅酶协作生成乙酰辅酶 A、CO₂ 和 NADH'],
            ['呼吸电子传递链与线粒体内膜', 'cell-metabolism-assets/optimized/27-etc-electron-transport-full.webp', '复合体 I–IV、Cyt c 与 ATP 合酶的电子传递和质子梯度']
          ]
        },
        carbohydrate: {
          label: '糖代谢', badge: '糖', english: 'Carbohydrate metabolism', tone: '#e77a66',
          scope: '糖酵解、糖异生、糖原合成与分解、磷酸戊糖途径',
          summary: '围绕葡萄糖处理四件事：即时分解、空腹再生、短期储存，以及分流产生 NADPH 和核糖。',
          structureTitle: '同一份葡萄糖的四种去向',
          structure: [['即时分解', '糖酵解生成丙酮酸、ATP 和 NADH'], ['维持血糖', '糖异生在空腹时重新制造葡萄糖'], ['储存与动员', '糖原负责快速存入和取出葡萄糖'], ['合成原料分流', '磷酸戊糖途径提供 NADPH 与核糖']],
          pathways: ['glycolysis', 'gluconeogenesis', 'glycogenesis', 'glycogenolysis', 'ppp'],
          links: [['glycolysis', 'gluconeogenesis'], ['glycolysis', 'ppp'], ['glycolysis', 'glycogenesis'], ['glycogenesis', 'glycogenolysis']]
        },
        lipid: {
          label: '脂代谢', badge: '脂', english: 'Lipid metabolism', tone: '#d99736',
          scope: '脂解与活化、脂肪酸合成、肉碱穿梭、β-氧化、酮体代谢',
          summary: '书本主线是“储存与动员相反”：进食后胰岛素促进合成和脂滴储存；空腹时脂解、脂肪酸活化，经肉碱穿梭进入线粒体，β-氧化产生乙酰-CoA和还原当量。',
          structureTitle: '先动员，再决定合成还是氧化',
          structure: [['动员与活化', '脂滴释放脂肪酸；ACSL 消耗 ATP 将其活化为脂酰-CoA'], ['合成储存', '乙酰-CoA、丙二酰-CoA 与 NADPH 延长脂肪酸并装入 TAG'], ['进入线粒体', '长链脂酰-CoA 不能直接过内膜，由 CPT1–CACT–CPT2 接力'], ['β-氧化供能', '脱氢→水合→再脱氢→硫解，重复切下乙酰-CoA'], ['空腹输出', '肝脏在草酰乙酸不足时把乙酰-CoA 转为酮体']],
          pathways: ['fa_synthesis', 'carnitine', 'beta_oxidation', 'ketone'],
          links: [['fa_synthesis', 'carnitine'], ['carnitine', 'beta_oxidation'], ['beta_oxidation', 'ketone']]
        },
        amino: {
          label: '蛋白质与氨基酸', badge: '氨', english: 'Protein and amino acid metabolism', tone: '#79a95f',
          scope: '转氨、尿素循环、氨基酸碳骨架',
          summary: '氨基酸分解后需要同时处理两部分：含氮基团集中后排出，碳骨架则重新接回中央代谢。',
          structureTitle: '氮和碳骨架分开处理',
          structure: [['汇总氨基', '转氨把不同氨基酸的氮集中到谷氨酸'], ['安全排氮', '尿素循环把有毒氨转成尿素'], ['碳骨架回流', '剩余部分进入丙酮酸、乙酰辅酶 A 或三羧酸循环']],
          pathways: ['transamination', 'urea', 'aa_carbon'],
          links: [['transamination', 'urea'], ['transamination', 'aa_carbon']]
        },
        nucleotide: {
          label: '核苷酸代谢', badge: '核', english: 'Nucleotide metabolism', tone: '#6fa6c2',
          scope: '嘌呤、嘧啶、核苷酸降解',
          summary: '分别看清嘌呤与嘧啶怎样从头合成，再理解使用后的碱基如何回收或继续降解。',
          structureTitle: '合成两类碱基，再处理旧核苷酸',
          structure: [['嘌呤从头合成', '在核糖骨架上逐步拼出嘌呤环'], ['嘧啶从头合成', '先造嘧啶环，再连接核糖骨架'], ['回收与降解', '优先补救回收，其余转为尿酸等产物']],
          pathways: ['purine', 'pyrimidine', 'nucleotide_degradation'],
          links: [['purine', 'nucleotide_degradation'], ['pyrimidine', 'nucleotide_degradation']]
        }
      };
      const studentPathwayImageSources = {
        pdh: 'cell-metabolism-assets/pathway-learning/optimized/pdh.webp',
        tca: 'cell-metabolism-assets/pathway-learning/optimized/tca.webp',
        malate_aspartate: 'cell-metabolism-assets/pathway-learning/optimized/malate_aspartate-v2.webp',
        glycerol_phosphate: 'cell-metabolism-assets/pathway-learning/optimized/glycerol_phosphate.webp',
        etc: 'cell-metabolism-assets/optimized/27-etc-electron-transport-full.webp',
        oxphos: 'cell-metabolism-assets/pathway-learning/optimized/oxphos-v2.webp',
        glycolysis: 'cell-metabolism-assets/pathway-learning/optimized/glycolysis.webp',
        gluconeogenesis: 'cell-metabolism-assets/pathway-learning/optimized/gluconeogenesis-v2.webp',
        glycogenesis: 'cell-metabolism-assets/pathway-learning/optimized/glycogenesis.webp',
        glycogenolysis: 'cell-metabolism-assets/pathway-learning/optimized/glycogenolysis.webp',
        ppp: 'cell-metabolism-assets/pathway-learning/optimized/ppp.webp',
        fa_synthesis: 'cell-metabolism-assets/pathway-learning/optimized/fa_synthesis-v4.png',
        carnitine: 'cell-metabolism-assets/pathway-learning/optimized/carnitine-v2.webp',
        beta_oxidation: 'cell-metabolism-assets/pathway-learning/optimized/beta_oxidation-v2.webp',
        ketone: 'cell-metabolism-assets/pathway-learning/optimized/ketone-v2.webp',
        transamination: 'cell-metabolism-assets/pathway-learning/optimized/transamination-v2.webp',
        urea: 'cell-metabolism-assets/pathway-learning/optimized/urea-v2.webp',
        aa_carbon: 'cell-metabolism-assets/pathway-learning/optimized/aa_carbon-v4.png',
        purine: 'cell-metabolism-assets/pathway-learning/optimized/purine-v2.webp',
        pyrimidine: 'cell-metabolism-assets/pathway-learning/optimized/pyrimidine.webp',
        nucleotide_degradation: 'cell-metabolism-assets/pathway-learning/optimized/nucleotide_degradation-v4.png'
      };
      const studentPathwayVisualOverrides = Object.fromEntries(
        Object.entries(studentPathwayImageSources).map(([pathwayId, source]) => [
          pathwayId,
          [`${atlas.pathways[pathwayId]?.name || pathwayId}独立教材机制图`, source]
        ])
      );
      const studentPathwayScientificCaptions = {
        malate_aspartate: '胞质与基质两侧通过苹果酸、草酰乙酸和天冬氨酸往返，把胞质 NADH 的电子转交给线粒体。',
        glycerol_phosphate: '胞质甘油-3-磷酸脱氢酶与内膜甘油-3-磷酸脱氢酶接力，把电子送入 CoQ 池。',
        gluconeogenesis: '丙酮酸羧化、PEPCK 绕行以及内质网葡萄糖-6-磷酸酶共同完成葡萄糖再生。',
        glycogenesis: '葡萄糖先形成 UDP-葡萄糖，再由糖原合酶延长 α-1,4 链，并由分支酶建立 α-1,6 分支。',
        glycogenolysis: '糖原磷酸化酶沿 α-1,4 链释放 G1P，去分支酶处理分支点，并产生少量游离葡萄糖。',
        ppp: '氧化阶段生成 NADPH，非氧化阶段通过转酮酶和转醛酶连接核糖与糖酵解中间体。',
        fa_synthesis: '柠檬酸把乙酰基带到胞质，ACC 生成丙二酰-CoA，脂肪酸合酶反复缩合、还原、脱水和再还原。',
        carnitine: 'CPT1、CACT 和 CPT2 跨越线粒体两层膜接力运输长链脂酰基，CoA 本身不跨内膜。',
        ketone: '肝线粒体把乙酰-CoA 汇入 HMG-CoA，再生成乙酰乙酸和 β-羟丁酸供外周组织利用。',
        transamination: 'ALT、AST 把不同氨基酸的氮集中到谷氨酸，再由谷氨酸脱氢酶释放铵离子。',
        urea: '线粒体基质与细胞质共同完成尿素循环，鸟氨酸和瓜氨酸通过 ORNT1 跨膜衔接两侧反应。',
        aa_carbon: '去除氨基后的碳骨架分别进入丙酮酸、乙酰-CoA、乙酰乙酰-CoA或三羧酸循环中间体。',
        purine: '嘌呤环在 PRPP 核糖骨架上逐步组装成 IMP，再分流形成 AMP 和 GMP。',
        pyrimidine: 'CAD 在胞质完成早期反应，DHODH 在线粒体内膜生成乳清酸，随后形成 UMP、CTP 与 dTMP。',
        nucleotide_degradation: '胞质核苷酸先去磷酸形成核苷和碱基；可补救回收的部分重新进入核苷酸池，其余继续降解。'
      };
      Object.assign(studentPathwayScientificCaptions, {
        pdh: 'E1、E2、E3 与五种辅酶接力，把丙酮酸转成乙酰-CoA、CO₂ 和 NADH。',
        tca: '乙酰-CoA 进入循环并再生草酰乙酸，每轮生成 3 NADH、1 FADH₂、1 GTP 和 2 CO₂。',
        etc: '复合体 I–IV 逐级传递电子，并由 I、III、IV 将质子泵到膜间隙。',
        oxphos: '质子经 ATP 合酶回流并驱动旋转，ANT 与磷酸载体再完成 ADP、Pi 和 ATP 的跨膜交换。',
        glycolysis: '能量投资阶段消耗 2 ATP，六碳中间体裂成两条三碳通路，最终净得 2 ATP、2 NADH 和 2 个丙酮酸。',
        beta_oxidation: '脂酰-CoA 在基质中依次完成脱氢、水合、再脱氢和硫解，每轮释放乙酰-CoA并缩短 2 个碳。'
      });
      const studentPathwayMapVisuals = Object.fromEntries(
        coreStudyPathwayIds.map(pathwayId => {
          const pathway = atlas.pathways[pathwayId];
          return [pathwayId, {
            label: `${pathway?.name || pathwayId}独立教材机制图`,
            source: studentPathwayImageSources[pathwayId],
            caption: studentPathwayScientificCaptions[pathwayId] || `${pathway?.name || pathwayId}的区室、关键节点与反应方向。`
          }];
        })
      );
      const studentPathwayRoleLabels = {
        pdh: '入场', tca: '循环', malate_aspartate: '穿梭', glycerol_phosphate: '穿梭', etc: '呼吸链', oxphos: '产能',
        glycolysis: '分解', gluconeogenesis: '产糖', glycogenesis: '储存', glycogenolysis: '动员', ppp: '分流',
        fa_synthesis: '合成', carnitine: '运输', beta_oxidation: '分解', ketone: '输出',
        transamination: '转氨', urea: '排氮', aa_carbon: '碳架',
        purine: '嘌呤', pyrimidine: '嘧啶', nucleotide_degradation: '回收'
      };
      const studentBeginnerLessons = {
        pdh: { topic: '生物氧化', lesson: '第 1 课 · 把糖的产物送进线粒体', title: '丙酮酸为什么要进入线粒体？', question: '葡萄糖已经在细胞质变成丙酮酸，但这还不是高效供能的终点。', goal: '把丙酮酸变成乙酰辅酶 A', problem: '把糖酵解留下的 3 碳丙酮酸，接到线粒体的供能主线。', input: '丙酮酸、辅酶 A、NAD⁺', output: '乙酰辅酶 A、CO₂、NADH', location: '线粒体基质', purpose: '乙酰辅酶 A 才能进入三羧酸循环；NADH 会把电子交给呼吸链。', terms: [['脱羧', '去掉一个碳，并以 CO₂ 释放'], ['乙酰辅酶 A', '携带 2 个碳进入三羧酸循环'], ['NADH', '携带高能电子的还原当量']], story: [['丙酮酸到达线粒体', '先通过外膜通道，再由内膜载体进入基质。'], ['去掉一个碳', '丙酮酸脱羧，释放 CO₂，剩下 2 个碳。'], ['接上辅酶 A', '形成乙酰辅酶 A，同时 NAD⁺ 被还原成 NADH。']] },
        tca: { topic: '生物氧化', lesson: '第 2 课 · 循环拆出电子', title: '三羧酸循环到底在循环什么？', question: '它不是只为了“绕一圈”，而是逐步氧化乙酰基，把能量装进 NADH 和 FADH₂。', goal: '把乙酰辅酶 A 的碳氧化成 CO₂', problem: '彻底氧化乙酰基，同时收集能交给呼吸链的电子。', input: '乙酰辅酶 A、NAD⁺、FAD、ADP/GDP', output: 'CO₂、NADH、FADH₂、GTP/ATP', location: '主要在线粒体基质；琥珀酸脱氢酶位于内膜', purpose: '为电子传递链持续提供 NADH 和 FADH₂。', terms: [['乙酰基', '乙酰辅酶 A 中真正被氧化的 2 个碳'], ['还原当量', '装载高能电子的 NADH 或 FADH₂'], ['补充反应', '补回被抽走的循环中间体']], story: [['2 个碳进入循环', '乙酰辅酶 A 与草酰乙酸结合，形成柠檬酸。'], ['碳以 CO₂ 离开', '连续氧化和脱羧，把乙酰基的碳释放出来。'], ['电子被收集', '每一圈生成多个 NADH、FADH₂，并产生少量 GTP/ATP。']] },
        malate_aspartate: { topic: '生物氧化', lesson: '第 3 课 · 把胞质电子送入线粒体', title: 'NADH 进不了内膜，电子怎么办？', question: 'NADH 分子不能直接穿过线粒体内膜，细胞用穿梭反应把“电子”转交进去。', goal: '把胞质 NADH 的电子交给线粒体基质', problem: '解决 NADH 不能直接穿过内膜的空间限制。', input: '胞质 NADH、苹果酸/草酰乙酸、谷氨酸', output: '基质 NADH、天冬氨酸、NAD⁺', location: '细胞质、线粒体内膜两侧与基质', purpose: '让糖酵解产生的还原当量继续支持呼吸链。', terms: [['穿梭', '不搬运 NADH 本身，而是转交它的电子'], ['草酰乙酸', '在苹果酸和天冬氨酸之间转换的枢纽'], ['转氨', '把氨基在谷氨酸和草酰乙酸之间转移']], story: [['胞质 NADH 交出电子', '草酰乙酸被还原成苹果酸，电子暂时换了载体。'], ['苹果酸进入基质', '苹果酸跨过内膜后再被氧化，生成基质 NADH。'], ['氨基完成往返', '天冬氨酸和谷氨酸帮助草酰乙酸的碳骨架回来。']] },
        glycerol_phosphate: { topic: '生物氧化', lesson: '第 4 课 · 另一条电子入口', title: '为什么同样是胞质 NADH，会有两种穿梭？', question: '不同组织和不同能量需求，可以选择更快但能量收益略低的电子转交路线。', goal: '把胞质 NADH 的电子交给辅酶 Q', problem: '让胞质还原当量在不搬运 NADH 的情况下进入呼吸链。', input: '胞质 NADH、磷酸二羟丙酮、FAD', output: '辅酶 QH₂、NAD⁺、甘油-3-磷酸', location: '细胞质与线粒体内膜外侧', purpose: '快速把电子送入辅酶 Q，接上复合体 III。', terms: [['电子入口', '电子进入呼吸链的具体位置'], ['辅酶 Q', '内膜中移动电子的脂溶性载体'], ['收益差异', '进入 Q 池通常比生成基质 NADH 少保存一些能量']], story: [['NADH 先还原底物', '磷酸二羟丙酮变成甘油-3-磷酸。'], ['内膜酶接手', '膜外侧的甘油-3-磷酸脱氢酶把电子转给 FAD。'], ['电子进入 Q 池', 'FADH₂ 再把电子交给辅酶 Q，继续向下游流动。']] },
        etc: { topic: '生物氧化', lesson: '第 5 课 · 电子流如何变成梯度', title: '呼吸链怎样把电子流变成“可用的力”？', question: 'NADH 和 FADH₂ 带来的电子，沿着内膜上的复合体逐级传递，能量被用来泵出质子。', goal: '建立质子动力势，准备合成 ATP', problem: '把分散在 NADH/FADH₂ 里的电子能量，转换成跨内膜的质子梯度。', input: 'NADH、FADH₂、氧气', output: 'NAD⁺、FAD、水、质子动力势', location: '线粒体内膜；质子积在膜间隙一侧', purpose: '建立 ATP 合酶可以利用的电化学梯度。', terms: [['电子载体', '在复合体之间接力传递电子的分子或复合体'], ['质子梯度', '内膜两侧 H⁺ 数量和电荷的差异'], ['末端电子受体', '氧气接收电子和质子，最终形成水']], story: [['电子开始接力', 'NADH 把电子交给复合体 I，FADH₂ 从复合体 II 进入。'], ['质子被泵出', '复合体 I、III、IV 利用电子能量，把 H⁺ 推到膜间隙。'], ['氧气收尾', '复合体 IV 让氧气接收电子和质子，形成水。']] },
        oxphos: { topic: '生物氧化', lesson: '第 6 课 · 梯度驱动 ATP', title: 'ATP 合酶为什么能制造 ATP？', question: '质子想回到基质，ATP 合酶把这股回流变成旋转，再推动 ADP 和 Pi 合成 ATP。', goal: '把质子动力势保存为 ATP', problem: '把线粒体内膜两侧的质子梯度转换成细胞可以直接使用的 ATP。', input: 'ADP、无机磷酸、质子动力势', output: 'ATP、水', location: '线粒体内膜与基质侧', purpose: 'ATP 是细胞最常用的即时能量货币。', terms: [['ATP', '可被细胞直接用来做功的能量货币'], ['ATP 合酶', '利用质子回流催化 ATP 形成的分子机器'], ['化学渗透', '用跨膜离子梯度驱动化学反应']], story: [['质子寻找回路', '膜间隙中的 H⁺ 不能自由穿过疏水的内膜。'], ['ATP 合酶转动', 'H⁺ 通过 ATP 合酶的通道，带动分子机器发生构象变化。'], ['ADP 变成 ATP', 'ADP 和 Pi 在基质侧结合，形成 ATP 供细胞使用。']] },
        glycolysis: { topic: '糖代谢', lesson: '糖代谢第 1 课 · 葡萄糖先变成丙酮酸', title: '一分子葡萄糖能先得到什么？', question: '糖酵解把 6 个碳的葡萄糖分成两份 3 个碳的丙酮酸，并直接得到少量 ATP。', goal: '看懂葡萄糖到丙酮酸的主干', problem: '快速取得 ATP，并把碳流送到乳酸、乙酰辅酶 A 或其他代谢方向。', input: '葡萄糖、ADP、Pi、NAD⁺', output: '丙酮酸、净 ATP、NADH', location: '细胞质', purpose: '不依赖线粒体也能供能，是所有细胞都重要的中央入口。', terms: [['底物水平磷酸化', '反应本身直接把磷酸基转给 ADP'], ['承诺步骤', '把中间体推向本通路的关键控制点'], ['丙酮酸', '糖酵解的 3 碳出口，可继续多种去路']], story: [['先投入能量', '前几步消耗 ATP，把葡萄糖变成更容易裂解的中间体。'], ['六碳裂成两条三碳', '果糖-1,6-二磷酸分成两个三碳分子。'], ['收回并赚取能量', '后半段生成 ATP 和 NADH，最后形成两个丙酮酸。']] },
        gluconeogenesis: { topic: '糖代谢', lesson: '糖代谢第 2 课 · 没有进食也要维持血糖', title: '糖异生是在“倒放”糖酵解吗？', question: '大部分步骤可以借用，但糖酵解的三个不可逆关卡需要绕路。', goal: '理解乳酸和氨基酸怎样回到葡萄糖', problem: '在空腹时为脑和红细胞维持血糖。', input: '乳酸、甘油、生糖氨基酸、ATP/GTP', output: '葡萄糖、ADP/GDP、NAD⁺', location: '线粒体、细胞质和内质网协作', purpose: '避免血糖降到影响中枢神经和红细胞供能的程度。', terms: [['不可逆关卡', '热力学上很难直接倒回去的步骤'], ['生糖原料', '能够转成葡萄糖的乳酸、甘油或氨基酸'], ['空腹', '进食间隔中需要维持血糖的状态']], story: [['碳骨架先汇合', '乳酸和生糖氨基酸先进入丙酮酸或草酰乙酸。'], ['绕开三个关卡', '用另一组酶消耗能量，绕过糖酵解的不可逆步骤。'], ['恢复六碳结构', '中间体回到葡萄糖-6-磷酸，最后释放葡萄糖。']] },
        glycogenesis: { topic: '糖代谢', lesson: '糖代谢第 3 课 · 把多余葡萄糖存起来', title: '葡萄糖怎样变成糖原？', question: '吃饱后，细胞把葡萄糖活化成 UDP-葡萄糖，再接到糖原链上。', goal: '理解糖原是可快速取用的短期储备', problem: '把暂时用不完的葡萄糖存成紧凑、可分支的糖原。', input: '葡萄糖-6-磷酸、UTP、糖原引物', output: '糖原、UDP', location: '细胞质；肝和肌肉最重要', purpose: '肝脏帮助维持血糖，肌肉为自身收缩储备燃料。', terms: [['活化糖', '先和核苷酸结合，变成更容易转移的糖基'], ['糖原引物', '糖原合成开始时必须先有的一小段链'], ['分支', '让糖原同时拥有多个添加和释放葡萄糖的末端']], story: [['葡萄糖先改造', '葡萄糖-6-磷酸变成葡萄糖-1-磷酸。'], ['准备可转移的糖基', 'UDP-葡萄糖把葡萄糖暂时“装载”起来。'], ['延长并分支', '糖原合酶延长主链，分支酶让储备更易调用。']] },
        glycogenolysis: { topic: '糖代谢', lesson: '糖代谢第 4 课 · 需要时拆糖原', title: '糖原怎样快速提供葡萄糖？', question: '糖原磷酸化酶从末端逐个释放葡萄糖-1-磷酸，而不是先拆成游离葡萄糖。', goal: '看懂糖原储备怎样接回中央代谢', problem: '运动或空腹时快速动员已储存的葡萄糖。', input: '糖原、无机磷酸', output: '葡萄糖-1-磷酸；肝脏还可释放葡萄糖', location: '细胞质；肝和肌肉的处理结果不同', purpose: '肌肉就地供能，肝脏则帮助其他组织维持血糖。', terms: [['磷酸解', '用 Pi 切断糖苷键，释放带磷酸的糖'], ['去分支', '处理分支点，让主酶继续向前拆解'], ['组织分工', '肝能释放血糖，肌肉主要为自己使用']], story: [['从末端开始', '糖原磷酸化酶沿着非还原端释放葡萄糖-1-磷酸。'], ['遇到分支就换手', '去分支酶处理分支点，再把链交回主酶。'], ['接回糖酵解', '葡萄糖-1-磷酸变成葡萄糖-6-磷酸，进入供能路线。']] },
        ppp: { topic: '糖代谢', lesson: '糖代谢第 5 课 · 同一个葡萄糖的另一种用法', title: '细胞什么时候更需要 NADPH 而不是 ATP？', question: '磷酸戊糖途径把葡萄糖-6-磷酸分流，用来造还原力和核糖。', goal: '区分“供能”和“供还原力/原料”', problem: '为抗氧化、脂肪酸合成和核苷酸合成提供 NADPH 与核糖。', input: '葡萄糖-6-磷酸、NADP⁺', output: 'NADPH、核糖-5-磷酸、CO₂', location: '细胞质', purpose: 'NADPH 支持还原合成和谷胱甘肽再生，核糖用于造核苷酸。', terms: [['NADPH', '偏向合成和抗氧化使用的还原力'], ['核糖-5-磷酸', '制造核苷酸骨架的五碳原料'], ['分流', '同一个中间体根据需要进入不同路线']], story: [['氧化支路先产 NADPH', '葡萄糖-6-磷酸氧化并释放 CO₂。'], ['碳骨架变成核糖', '剩余五碳糖可以用于核苷酸合成。'], ['不需要核糖时回流', '非氧化阶段把碳骨架接回糖酵解中间体。']] },
        fa_synthesis: { topic: '脂代谢', lesson: '脂代谢第 1 课 · 把多余碳储成脂肪酸', title: '细胞怎样把碳和还原力做成脂肪酸？', question: '能量充足时，乙酰辅酶 A 被搬到细胞质，先变成丙二酰辅酶 A，再逐轮加长。', goal: '理解脂肪酸合成是“加长 + 还原”', problem: '把多余的碳和 NADPH 保存成高能量密度的脂肪酸。', input: '乙酰辅酶 A、丙二酰辅酶 A、NADPH', output: '棕榈酸等脂肪酸', location: '细胞质；乙酰辅酶 A 由柠檬酸间接输出', purpose: '长期储能，并为膜脂和信号分子提供原料。', terms: [['丙二酰辅酶 A', '每一轮提供两个碳的延长单元'], ['乙酰辅酶 A 羧化酶', '脂肪酸合成的承诺和主要调控步骤'], ['NADPH', '为还原步骤提供电子']], story: [['准备两碳单元', '乙酰辅酶 A 被羧化成丙二酰辅酶 A。'], ['反复缩合', '每一轮把两个碳加到脂肪酸链上。'], ['两次还原并脱水', '消耗 NADPH，把中间体还原成更长的饱和链。']] },
        carnitine: { topic: '脂代谢', lesson: '长链脂肪酸进入线粒体', title: '脂肪酸为什么需要肉碱穿梭？', question: '长链脂酰辅酶 A 不能直接穿过线粒体内膜，肉碱负责临时接力。', goal: '看懂脂肪酸进入 β-氧化现场的路线', problem: '把长链脂肪酸安全、定向地送进线粒体基质。', input: '长链脂酰辅酶 A、肉碱', output: '基质侧长链脂酰辅酶 A、游离肉碱', location: '线粒体外膜、膜间隙和内膜', purpose: '把脂肪酸供给 β-氧化，同时控制脂肪酸进入速度。', terms: [['脂酰基', '脂肪酸连接到辅酶 A 后的形式'], ['脂酰肉碱', '脂酰基暂时连接肉碱后形成的跨膜运输形式'], ['限速入口', '决定后续脂肪酸氧化速度的运输关卡']], story: [['外膜完成第一次转接', 'CPT-I 把脂酰基从 CoA 转给肉碱，形成脂酰肉碱。'], ['跨内膜完成交换', 'CACT 把脂酰肉碱送入基质侧，同时把游离肉碱送出。'], ['基质侧交还辅酶 A', 'CPT-II 把脂酰基交还给 CoA，重新形成脂酰辅酶 A。']] },
        beta_oxidation: { topic: '脂代谢', lesson: '脂代谢第 3 课 · 脂肪酸每轮缩短两个碳', title: 'β-氧化怎样把脂肪酸拆开？', question: '进入基质后，每一轮严格按“脱氢→水合→再脱氢→硫解”进行，切下一个乙酰-CoA。', goal: '从脂酰-CoA的四步循环推导 ATP 产能', problem: '把长链脂肪酸拆成可进入三羧酸循环的乙酰-CoA，同时把电子交给呼吸链。', input: '脂酰-CoA、FAD、NAD⁺、H₂O、CoA-SH', output: '乙酰-CoA、NADH、FADH₂、缩短两个碳的脂酰-CoA', location: '线粒体基质；极长链脂肪酸先在过氧化物酶体缩短', purpose: '每轮产生 1 个乙酰-CoA、1 个 NADH 和 1 个 FADH₂；乙酰-CoA进 TCA，还原当量进呼吸链。', terms: [['肉碱穿梭', 'CPT1–CACT–CPT2把长链脂酰基送入基质'], ['β-碳', '从羰基碳数起的第二个碳，第三步在这里发生氧化'], ['硫解', 'β-酮硫解酶用 CoA-SH 切下两个碳的乙酰-CoA']], story: [['先准备底物', '脂肪酸先由 ACSL 活化；长链脂酰基经 CPT1、CACT 和 CPT2 进入基质。'], ['完成四步循环', '脂酰-CoA脱氢形成双键，水合成羟基，再脱氢成β-酮基。'], ['切下并回收电子', '硫解切下乙酰-CoA；缩短的脂酰-CoA继续下一轮，直到链被拆完。']] },
        ketone: { topic: '脂代谢', lesson: '脂代谢第 4 课 · 肝脏把脂肪做成备用燃料', title: '酮体为什么要在肝脏产生、别的组织使用？', question: '空腹时肝脏把过多乙酰辅酶 A 转成可运输的酮体，供心肌和脑等组织使用。', goal: '理解脂肪供能如何跨组织分配', problem: '当草酰乙酸优先用于糖异生时，给乙酰辅酶 A 找到出口。', input: '乙酰辅酶 A', output: '乙酰乙酸、β-羟丁酸、丙酮；外周组织再变回乙酰辅酶 A', location: '肝线粒体合成；肝外组织线粒体利用', purpose: '把肝脏的脂肪氧化能力变成全身可运输的燃料。', terms: [['酮体', '可在血液中运输的乙酰辅酶 A 替代燃料'], ['生酮', '把乙酰辅酶 A 合成为酮体'], ['肝脏例外', '肝脏制造酮体但缺少利用酮体的关键酶']], story: [['乙酰辅酶 A 堵在入口', '空腹时草酰乙酸被抽去做糖异生，TCA 处理能力下降。'], ['肝脏合成酮体', '两个乙酰辅酶 A 先合并，再形成乙酰乙酸等酮体。'], ['外周组织重新利用', '心肌、骨骼肌和脑把酮体变回乙酰辅酶 A。']] },
        transamination: { topic: '氨基酸与氮', lesson: '氨基酸第 1 课 · 氨基先集中到谷氨酸', title: '不同氨基酸的氨基怎样汇总处理？', question: '转氨反应把氨基从一种氨基酸转给 α-酮戊二酸，形成谷氨酸。', goal: '理解氨基转移和碳骨架分开处理', problem: '集中收集氨基，避免每种氨基酸都走一套完全不同的排氮路线。', input: '氨基酸、α-酮戊二酸', output: '对应 α-酮酸、谷氨酸', location: '细胞质与线粒体；依酶和组织而不同', purpose: '谷氨酸既能继续释放氨，也能把氮转给尿素循环。', terms: [['转氨酶', '搬运氨基而不直接释放游离氨的酶'], ['α-酮酸', '失去氨基后的碳骨架'], ['PLP', '转氨酶使用的维生素 B₆ 衍生辅酶']], story: [['氨基先交给酶', 'PLP 暂时接住氨基，形成可转移的中间状态。'], ['换给 α-酮戊二酸', '氨基转移后生成谷氨酸。'], ['两条路分开', '碳骨架回到中央代谢，氮则进入排氮处理。']] },
        urea: { topic: '氨基酸与氮', lesson: '氨基酸第 2 课 · 把有毒氨变成尿素', title: '尿素循环解决的核心问题是什么？', question: '氨对神经系统有毒，肝脏把它和另一份氮装进尿素，交给肾脏排出。', goal: '看懂两个区室接力完成的排氮路线', problem: '安全地清除氨基酸分解产生的氨。', input: '氨、碳酸氢根、天冬氨酸、ATP', output: '尿素、延胡索酸', location: '肝细胞线粒体基质与细胞质', purpose: '把有毒氨转成可溶、可排出的尿素。', terms: [['氨毒性', '游离氨升高会干扰脑能量和神经功能'], ['尿素', '哺乳动物主要的含氮排泄形式'], ['鸟氨酸', '循环中的载体，反应后被再生']], story: [['在线粒体装入第一份氮', '氨和碳酸氢根先形成氨甲酰磷酸。'], ['鸟氨酸接过氮', '瓜氨酸离开线粒体，在细胞质继续反应。'], ['尿素释放并再生载体', '第二份氮来自天冬氨酸，形成尿素后鸟氨酸回到循环。']] },
        aa_carbon: { topic: '氨基酸与氮', lesson: '氨基酸第 3 课 · 氨基酸的碳最后去哪儿', title: '去掉氨基后，氨基酸还剩什么？', question: '剩下的碳骨架会汇入糖酵解、乙酰辅酶 A 或三羧酸循环。', goal: '区分生糖氨基酸和生酮氨基酸', problem: '把氨基酸的碳资源重新接回供能、产糖或产酮体路线。', input: '去氨基后的 α-酮酸和其他碳骨架', output: '丙酮酸、乙酰辅酶 A、TCA 中间体', location: '细胞质与线粒体', purpose: '氨基酸不只是造蛋白质，也能在需要时补充能量和葡萄糖原料。', terms: [['生糖', '碳骨架可以净生成葡萄糖'], ['生酮', '碳骨架生成乙酰辅酶 A 或酮体'], ['补充循环', '把中间体补回 TCA 以维持循环']], story: [['氮先被移走', '转氨或脱氨让碳骨架与氮分开。'], ['找到中央入口', '不同碳骨架进入丙酮酸、乙酰辅酶 A 或 TCA 不同位置。'], ['按身体需要分配', '空腹偏向供糖，能量需求高时偏向氧化供能。']] },
        purine: { topic: '核苷酸代谢', lesson: '核苷酸第 1 课 · 从头搭建嘌呤', title: '嘌呤环是一次性造出来的吗？', question: '不是。细胞把氨基酸、一碳单位和 CO₂ 等小片段逐步装到核糖骨架上。', goal: '理解 IMP 是 AMP 和 GMP 的共同分叉点', problem: '从简单原料合成 DNA/RNA 和能量分子需要的嘌呤核苷酸。', input: 'PRPP、甘氨酸、谷氨酰胺、天冬氨酸、一碳单位', output: 'IMP，再分成 AMP 或 GMP', location: '细胞质', purpose: '提供 ATP、GTP 以及核酸合成所需的嘌呤骨架。', terms: [['PRPP', '被活化的核糖磷酸骨架'], ['IMP', '嘌呤从头合成的第一个共同分叉点'], ['一碳单位', '由叶酸携带、用于搭建环结构的小片段']], story: [['先活化核糖', 'PRPP 提供带能量的核糖骨架。'], ['逐片拼环', '甘氨酸、谷氨酰胺、天冬氨酸和一碳单位依次加入。'], ['在 IMP 分叉', 'IMP 继续分别走向 AMP 或 GMP。']] },
        pyrimidine: { topic: '核苷酸代谢', lesson: '核苷酸第 2 课 · 先造环，再接到核糖上', title: '嘧啶和嘌呤的搭建顺序有什么不同？', question: '嘧啶环先在核糖外组装好，再接到 PRPP 上形成核苷酸。', goal: '掌握 UMP 是嘧啶合成的入口', problem: '合成 UTP、CTP 以及 DNA 前体 dTTP 所需的嘧啶核苷酸。', input: '谷氨酰胺、CO₂、天冬氨酸、PRPP', output: 'UMP，再形成 UDP/UTP/CTP 和 dNTP', location: '细胞质；DHODH 这一步在线粒体内膜', purpose: '提供 RNA 和 DNA 合成所需的嘧啶原料。', terms: [['氨甲酰磷酸', '嘧啶环组装的含氮起始原料'], ['UMP', '嘧啶从头合成的第一个核苷酸产物'], ['RNR', '把核糖核苷酸还原成脱氧核苷酸的酶']], story: [['先拼出嘧啶环', '氨甲酰磷酸和天冬氨酸先形成环状前体。'], ['接上核糖', '乳清酸接到 PRPP 上，生成 OMP 后脱羧成 UMP。'], ['继续磷酸化和还原', 'UMP 变成 UTP/CTP，或经 RNR 进入 DNA 前体池。']] },
        nucleotide_degradation: { topic: '核苷酸代谢', lesson: '核苷酸第 3 课 · 用完的核苷酸去哪儿', title: '核苷酸分解后，细胞怎样处理它们？', question: '核苷酸和碱基不会凭空消失：有的回收，有的继续分解成尿酸或其他小分子。', goal: '看懂回收与降解是两种选择', problem: '处理细胞核苷酸池周转产生的核苷、碱基和含氮产物。', input: 'AMP、GMP、UMP、TMP 等核苷酸', output: '可回收碱基、尿酸、β-丙氨酸、β-氨基异丁酸', location: '主要在细胞质；终产物再由相应组织处理或排出', purpose: '回收有用原料，同时把不能回收的含氮部分安全处理。', terms: [['补救合成', '直接回收碱基或核苷，节省从头合成能量'], ['尿酸', '人类嘌呤分解的主要终产物'], ['周转', '核苷酸池不断消耗、降解和补充的动态过程']], story: [['先去掉磷酸', '核苷酸酶把 AMP、GMP 等变成相应核苷。'], ['优先回收', '有用的碱基和核苷可以走补救合成。'], ['多余部分继续降解', '嘌呤形成尿酸，嘧啶形成可进一步代谢的小分子。']] }
      };
      const studentStepAliases = window.STUDENT_STEP_RESOLVER?.aliasesByShortName || {};

      // #11 ── 学习模式 · 主线 / 课程 ──────────────────────────────────
      function studentPathwayMeta(pathwayId) {
        const pathway = atlas.pathways[pathwayId] || {};
        const routeGroup = routeGroupForPathway(pathwayId, pathway);
        const meta = pathwayMeta[pathwayId] || pathwayMeta[routeGroup] || {};
        return { pathway, routeGroup, tone: meta.tone || studentPathwayTones[pathwayId] || '#478f92' };
      }

      function studentTopicForPathway(pathwayId) {
        return Object.values(studentTopicCatalog).find(topic => topic.pathways.includes(pathwayId)) || null;
      }

      function fallbackBeginnerLesson(pathwayId) {
        const { pathway } = studentPathwayMeta(pathwayId);
        const topic = studentTopicForPathway(pathwayId);
        return {
          topic: topic?.label || pathway.group || '核心代谢',
          lesson: '通路概览',
          title: `${pathway.name || '这条通路'}在解决什么问题？`,
          question: pathway.summary || '先认识这条路线的入口、出口和位置，再进入反应细节。',
          goal: '找到入口、出口和它接入的下一条路线',
          problem: '把细胞面对的一个代谢任务，转成可继续利用的产物。',
          input: '查看路线的起点代谢物',
          output: '查看路线的末端代谢物',
          location: pathway.compartment || '区室待核对',
          purpose: '把本条路线放回五个核心专题的整体网络中理解。',
          terms: [['入口', '一条通路从哪里接收原料'], ['中间体', '在反应过程中暂时出现的分子'], ['出口', '下一条通路可以继续使用的产物']],
          story: [['先定位入口', '从第一个高亮节点看这条路线接收什么。'], ['跟住主干', '只沿连续主线阅读，不必先处理所有支路。'], ['认清出口', '观察产物会把碳、电子或氮带向哪里。']]
        };
      }

      function renderStudentPrimer(pathwayId) {
        if (!studentPrimer) return;
        const lesson = studentBeginnerLessons[pathwayId] || fallbackBeginnerLesson(pathwayId);
        const primerText = value => readableReactionEquation(value || '');
        studentPrimerLesson.textContent = '结构定位 · 通路主线';
        studentPrimerTopic.textContent = primerText(studentTopicCatalog[studentTopicIdForPathway(pathwayId)]?.label || lesson.topic);
        studentPrimerTitle.textContent = primerText(lesson.title);
        studentPrimerQuestion.textContent = primerText(lesson.question);
        studentPrimerGoal.textContent = primerText(lesson.goal);
        studentPrimerProblem.textContent = primerText(lesson.problem);
        studentPrimerInput.textContent = primerText(lesson.input);
        studentPrimerOutput.textContent = primerText(lesson.output);
        studentPrimerLocation.textContent = primerText(lesson.location);
        studentPrimerPurpose.textContent = primerText(lesson.purpose);
        studentPrimerStory.replaceChildren();
        lesson.story.forEach(([title, copy], index) => {
          const item = document.createElement('div');
          item.className = 'student-primer-story-step';
          const number = document.createElement('span');
          number.textContent = `0${index + 1}`;
          const heading = document.createElement('strong');
          heading.textContent = primerText(title);
          const detail = document.createElement('p');
          detail.textContent = primerText(copy);
          item.append(number, heading, detail);
          studentPrimerStory.appendChild(item);
        });
        studentPrimerTerms.replaceChildren();
        lesson.terms.forEach(([term, definition]) => {
          const item = document.createElement('span');
          item.className = 'student-primer-term';
          const name = document.createElement('strong');
          name.textContent = `${primerText(term)}：`;
          item.append(name, document.createTextNode(primerText(definition)));
          studentPrimerTerms.appendChild(item);
        });
        studentPathwayPanel.classList.add('student-lesson-started');
        setStudentReadingStep(activeStudentPathway, 0);
      }

      function studentTopicPathwayIds(topicId) {
        const topic = studentTopicCatalog[topicId];
        return topic ? topic.pathways.filter(pathwayId => atlas.pathways[pathwayId]?.name) : [];
      }

      function studentTopicIdForPathway(pathwayId) {
        return Object.keys(studentTopicCatalog).find(topicId => studentTopicCatalog[topicId].pathways.includes(pathwayId)) || null;
      }

      function renderStudentLessonCatalog(topicId, activePathwayId = null) {
        if (!lessonCards || !studentPathwayTotal) return;
        lessonCards.replaceChildren();
        const pathwayIds = studentTopicPathwayIds(topicId);
        if (!topicId || !pathwayIds.length) {
          studentPathwayTotal.textContent = '选择专题后展开';
          const hint = document.createElement('p');
          hint.className = 'student-catalog-hint';
          hint.textContent = '先选择一个专题。进入后这里只显示该专题的通路。';
          lessonCards.appendChild(hint);
          return;
        }
        const topic = studentTopicCatalog[topicId];
        studentPathwayTotal.textContent = `${pathwayIds.length} 条`;
        pathwayIds.forEach((pathwayId, index) => {
          const { pathway, tone } = studentPathwayMeta(pathwayId);
          const lesson = studentBeginnerLessons[pathwayId] || fallbackBeginnerLesson(pathwayId);
          const card = document.createElement('button');
          card.type = 'button';
          card.className = `lesson-card${pathwayId === activePathwayId ? ' active' : ''}`;
          card.dataset.pathway = pathwayId;
          card.style.setProperty('--tone', tone || topic.tone);
          card.setAttribute('aria-label', `查看${topic.label}专题的${pathway.name}通路`);
          card.innerHTML = `<i aria-hidden="true"></i><span><strong>${escapeStudentText(pathway.name)}</strong><small>${escapeStudentText(lesson.goal)}</small></span><b>${String(index + 1).padStart(2, '0')}</b>`;
          card.addEventListener('click', () => renderStudentPathway(pathwayId));
          lessonCards.appendChild(card);
        });
      }

      function renderStudentTopicLessons(topicId) {
        if (!studentTopicLessons) return;
        const topic = studentTopicCatalog[topicId];
        const pathwayIds = studentTopicPathwayIds(topicId);
        studentTopicLessons.replaceChildren();
        pathwayIds.forEach(pathwayId => {
          const { pathway } = studentPathwayMeta(pathwayId);
          const lesson = studentBeginnerLessons[pathwayId] || fallbackBeginnerLesson(pathwayId);
          const role = studentPathwayRoleLabels[pathwayId] || '通路';
          const row = document.createElement('button');
          row.type = 'button';
          row.className = 'student-topic-lesson';
          row.style.setProperty('--topic-tone', topic.tone);
          row.dataset.pathway = pathwayId;
          row.setAttribute('aria-label', `查看${pathway.name}通路`);
          row.innerHTML = `<i data-role="${escapeStudentText(role)}" aria-hidden="true" title="${escapeStudentText(role)}">${escapeStudentText(role)}</i><span><strong>${escapeStudentText(pathway.name)}</strong><small>${escapeStudentText(lesson.goal)}</small></span><b aria-hidden="true">→</b>`;
          row.addEventListener('click', () => renderStudentPathway(pathwayId));
          studentTopicLessons.appendChild(row);
        });
      }

      function renderStudentTopicStructure(topic) {
        if (!studentTopicStructure) return;
        const items = Array.isArray(topic?.structure) ? topic.structure : [];
        studentTopicStructure.hidden = !items.length;
        if (!items.length) {
          studentTopicStructure.replaceChildren();
          return;
        }
        studentTopicStructure.style.setProperty('--structure-columns', String(Math.min(4, items.length)));
        const cards = items.map(([label, detail]) => `<article class="student-topic-structure-item"><strong>${escapeStudentText(label)}</strong><small>${escapeStudentText(detail)}</small></article>`).join('');
        const visuals = Array.isArray(topic.visuals) ? topic.visuals.map(([label, src, caption]) => `<figure class="student-topic-structure-visual"><img src="${escapeStudentText(src)}" alt="${escapeStudentText(label)}" loading="lazy" decoding="async" data-visual-zoom tabindex="0" role="button" aria-label="放大查看${escapeStudentText(label)}"><span><strong>${escapeStudentText(label)}</strong><small>${escapeStudentText(caption)}</small></span></figure>`).join('') : '';
        const visualBlock = visuals ? `<div class="student-topic-structure-visuals" aria-label="专题结构图片">${visuals}</div>` : '';
        studentTopicStructure.innerHTML = `<div class="student-topic-structure-intro"><span>主题结构</span><strong>${escapeStudentText(topic.structureTitle || '先看清这组通路各自负责什么')}</strong></div><div class="student-topic-structure-content"><div class="student-topic-structure-grid">${cards}</div>${visualBlock}</div>`;
      }

      function buildStudentCourseHome() {
        if (!studentCourseTopics) return;
        studentCourseTopics.replaceChildren();
        Object.entries(studentTopicCatalog).forEach(([topicId, topic]) => {
          const pathwayIds = studentTopicPathwayIds(topicId);
          const row = document.createElement('button');
          row.type = 'button';
          row.className = 'student-course-topic';
          row.style.setProperty('--topic-tone', topic.tone);
          row.setAttribute('aria-label', `查看${topic.label}专题，共${pathwayIds.length}条通路`);

          const number = document.createElement('span');
          number.className = 'student-course-topic-index';
          number.textContent = topic.badge || topic.label.slice(0, 1);

          const title = document.createElement('strong');
          title.textContent = topic.label;
          const count = document.createElement('small');
          count.textContent = `${pathwayIds.length} 条通路`;
          title.appendChild(count);

          const copy = document.createElement('span');
          copy.className = 'student-course-topic-copy';
          copy.textContent = topic.scope;

          const action = document.createElement('span');
          action.className = 'student-course-topic-action';
          action.textContent = '进入通路 →';
          row.append(number, title, copy, action);
          row.addEventListener('click', () => renderStudentTopic(topicId, { scroll: true }));
          studentCourseTopics.appendChild(row);
        });
      }

      function showStudentCourseHome(options = {}) {
        setStudentTopicCanvasMaximized(false);
        activeStudentTopic = null;
        activeStudentTopicRouteFocus = null;
        hideStudentTopicNodeContext(false);
        hideStudentTopicRouteContext(false);
        studentCourseHome.hidden = false;
        studentTopicPanel.hidden = true;
        studentPathwayPanel.hidden = true;
        studentTopics.querySelectorAll('.student-topic-card').forEach(card => card.classList.remove('active'));
        renderStudentLessonCatalog(null);
        studentPathStatus.textContent = '主题总览';
        studentPathScope.textContent = '21 条核心通路';
        if (options.scroll && !document.body.classList.contains('cover-visible')) {
          requestAnimationFrame(() => studentCourseHome.scrollIntoView({
            behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
            block: 'start'
          }));
        }
      }

      function studentTopicConnectorPath(source, target, nodeWidth, nodeHeight, edgeIndex) {
        if (source.row === target.row) {
          const sourceX = source.x < target.x ? source.x + nodeWidth / 2 : source.x - nodeWidth / 2;
          const targetX = source.x < target.x ? target.x - nodeWidth / 2 : target.x + nodeWidth / 2;
          const bend = (edgeIndex % 3 - 1) * 8;
          return `M ${sourceX} ${source.y} C ${(sourceX + targetX) / 2} ${source.y + bend} ${(sourceX + targetX) / 2} ${target.y + bend} ${targetX} ${target.y}`;
        }
        const downward = source.y < target.y;
        const sourceY = source.y + (downward ? nodeHeight / 2 : -nodeHeight / 2);
        const targetY = target.y - (downward ? nodeHeight / 2 : -nodeHeight / 2);
        const laneY = (sourceY + targetY) / 2 + (edgeIndex % 3 - 1) * 7;
        return `M ${source.x} ${sourceY} C ${source.x} ${laneY} ${target.x} ${laneY} ${target.x} ${targetY}`;
      }

      function studentTopicCanonicalStepKey(value) {
        const normalized = studentMapNameKey(value);
        for (const [canonical, aliases] of Object.entries(studentStepAliases)) {
          const variants = [canonical, ...aliases].map(studentMapNameKey);
          if (variants.includes(normalized)) return studentMapNameKey(canonical);
        }
        const commonAliases = {
          udpglc: 'udpglucose', 'udp葡萄糖': 'udpglucose',
          udpgal: 'udpgalactose', 'udp半乳糖': 'udpgalactose',
          g1p: 'g1p', '葡萄糖1磷酸': 'g1p',
          dhap: 'dhap', '磷酸二羟丙酮': 'dhap',
          oaa: 'oaa', '草酰乙酸': 'oaa'
        };
        return commonAliases[normalized] || normalized;
      }

      function renderStudentTopicNetworkMinimap(mapWidth, mapHeight, positions, nodeInfo) {
        if (!studentTopicMinimap || !studentTopicMinimapSvg || !studentTopicMinimapEdges || !studentTopicMinimapNodes) return;
        const desktopNetwork = activeStudentTopicView === 'network' && window.matchMedia('(min-width: 761px)').matches;
        studentTopicMinimap.hidden = !desktopNetwork;
        studentTopicMinimapSvg.setAttribute('viewBox', `0 0 ${mapWidth} ${mapHeight}`);
        studentTopicMinimapEdges.innerHTML = '';
        studentTopicMinimapNodes.innerHTML = '';
        studentTopicEdges.querySelectorAll('.student-topic-network-edge').forEach(source => {
          const edge = studentSvgElement('path', {
            d: source.getAttribute('d'),
            class: `student-topic-minimap-edge${source.classList.contains('is-primary-route') ? ' is-primary-route' : ''}`,
            style: source.getAttribute('style') || ''
          });
          edge.dataset.pathway = source.dataset.pathway || '';
          edge.dataset.fromKey = source.dataset.fromKey || '';
          edge.dataset.toKey = source.dataset.toKey || '';
          studentTopicMinimapEdges.appendChild(edge);
        });
        positions.forEach((point, key) => {
          const shared = (nodeInfo.get(key)?.pathways?.size || 0) > 1;
          studentTopicMinimapNodes.appendChild(studentSvgElement('circle', {
            cx: point.x,
            cy: point.y,
            r: shared ? 12 : 8,
            class: `student-topic-minimap-node${shared ? ' shared' : ''}`
          }));
        });
        scheduleStudentTopicMinimapSync();
      }

      function renderStudentTopicNetworkMap(topicId) {
        const topic = studentTopicCatalog[topicId];
        const pathwayIds = studentTopicPathwayIds(topicId);
        if (!topic || !studentTopicMap || !studentTopicBands || !studentTopicEdges || !studentTopicNodes || !studentTopicRouteLegend) return;
        const nodeWidth = 174;
        const nodeHeight = 56;
        const stepGap = 194;
        const rowGap = 94;
        const startX = 228;
        const records = pathwayIds.map((pathwayId, originalIndex) => {
          const pathway = atlas.pathways[pathwayId];
          const tone = studentPathwayMeta(pathwayId).tone;
          const steps = (Array.isArray(pathway.steps) ? pathway.steps : []).filter(Boolean).map((step, stepIndex) => ({
            label: String(step),
            key: studentTopicCanonicalStepKey(step) || `${pathwayId}:${stepIndex}`,
            stepIndex
          }));
          return { pathwayId, pathway, tone, originalIndex, steps };
        }).filter(record => record.steps.length);
        if (!records.length) return;

        const orderedRecords = [records[0]];
        const placedKeys = new Set(records[0].steps.map(step => step.key));
        const remaining = records.slice(1);
        while (remaining.length) {
          remaining.sort((a, b) => {
            const scoreA = a.steps.filter(step => placedKeys.has(step.key)).length;
            const scoreB = b.steps.filter(step => placedKeys.has(step.key)).length;
            return scoreB - scoreA || a.originalIndex - b.originalIndex;
          });
          const record = remaining.shift();
          orderedRecords.push(record);
          record.steps.forEach(step => placedKeys.add(step.key));
        }

        const primaryY = 140 + Math.ceil((orderedRecords.length - 1) / 2) * rowGap;
        const routeRows = new Map([[orderedRecords[0].pathwayId, primaryY]]);
        orderedRecords.slice(1).forEach((record, index) => {
          const sequence = index + 1;
          const level = Math.ceil(sequence / 2);
          const direction = sequence % 2 ? -1 : 1;
          routeRows.set(record.pathwayId, primaryY + direction * level * rowGap);
        });

        const positions = new Map();
        const nodeInfo = new Map();
        const registerStep = (record, step) => {
          if (!nodeInfo.has(step.key)) nodeInfo.set(step.key, { label: step.label, pathways: new Set(), tones: [] });
          const info = nodeInfo.get(step.key);
          info.pathways.add(record.pathwayId);
          if (!info.tones.includes(record.tone)) info.tones.push(record.tone);
        };
        records.forEach(record => record.steps.forEach(step => registerStep(record, step)));
        orderedRecords[0].steps.forEach((step, index) => positions.set(step.key, { x: startX + index * stepGap, y: primaryY }));

        orderedRecords.slice(1).forEach(record => {
          const rowY = routeRows.get(record.pathwayId);
          record.steps.forEach((step, index) => {
            if (positions.has(step.key)) return;
            let previousIndex = index - 1;
            while (previousIndex >= 0 && !positions.has(record.steps[previousIndex].key)) previousIndex -= 1;
            let nextIndex = index + 1;
            while (nextIndex < record.steps.length && !positions.has(record.steps[nextIndex].key)) nextIndex += 1;
            const previousPoint = previousIndex >= 0 ? positions.get(record.steps[previousIndex].key) : null;
            const nextPoint = nextIndex < record.steps.length ? positions.get(record.steps[nextIndex].key) : null;
            let x;
            if (previousPoint && nextPoint) {
              const progress = (index - previousIndex) / (nextIndex - previousIndex);
              x = previousPoint.x + (nextPoint.x - previousPoint.x) * progress;
            } else if (previousPoint) {
              x = previousPoint.x + (index - previousIndex) * stepGap;
            } else if (nextPoint) {
              x = nextPoint.x - (nextIndex - index) * stepGap;
            } else {
              x = startX + index * stepGap;
            }
            positions.set(step.key, { x, y: rowY });
          });
        });

        const pointsByRow = new Map();
        positions.forEach(point => {
          const rowKey = Math.round(point.y);
          if (!pointsByRow.has(rowKey)) pointsByRow.set(rowKey, []);
          pointsByRow.get(rowKey).push(point);
        });
        pointsByRow.forEach(rowPoints => {
          rowPoints.sort((a, b) => a.x - b.x);
          let previousX = -Infinity;
          rowPoints.forEach(point => {
            point.x = Math.max(point.x, previousX + nodeWidth + 20);
            previousX = point.x;
          });
        });

        const rawPoints = [...positions.values()];
        const minX = Math.min(...rawPoints.map(point => point.x));
        const shiftX = minX < 150 ? 150 - minX : 0;
        if (shiftX) positions.forEach(point => { point.x += shiftX; });
        const points = [...positions.values()];
        const maxX = Math.max(...points.map(point => point.x));
        const maxY = Math.max(...points.map(point => point.y));
        const mapWidth = Math.max(1480, maxX + nodeWidth / 2 + 150);

        const currencyKeys = new Set(['atp', 'adp', 'amp', 'gtp', 'gdp', 'utp', 'udp', 'ctp', 'cdp', 'nad', 'nadh', 'nadp', 'nadph', 'h', 'h+', 'h2o', 'co2', 'o2', 'pi', 'coa']);
        const keysForPathway = pathwayId => {
          const keys = new Set((atlas.pathways[pathwayId]?.steps || []).map(studentTopicCanonicalStepKey));
          studentReactionsFor(pathwayId).forEach(reaction => {
            [reaction.from, reaction.to].map(entityId => entityById[entityId]).filter(Boolean).forEach(entity => keys.add(studentEntityIdentityKey(entity)));
          });
          return new Set([...keys].filter(key => key && !currencyKeys.has(key)));
        };
        const internalKeys = new Set(pathwayIds.flatMap(pathwayId => [...keysForPathway(pathwayId)]));
        const externalLinks = Object.entries(studentTopicCatalog)
          .filter(([otherTopicId]) => otherTopicId !== topicId)
          .map(([otherTopicId, otherTopic]) => {
            const externalKeys = new Set(studentTopicPathwayIds(otherTopicId).flatMap(pathwayId => [...keysForPathway(pathwayId)]));
            return { topicId: otherTopicId, topic: otherTopic, sharedCount: [...internalKeys].filter(key => externalKeys.has(key)).length };
          })
          .filter(link => link.sharedCount > 0)
          .sort((a, b) => b.sharedCount - a.sharedCount)
          .slice(0, 4);
        const externalTop = maxY + 112;
        const mapHeight = Math.max(660, externalTop + (externalLinks.length ? 126 : 34));

        setStudentTopicMapDimensions(mapWidth, mapHeight);
        studentTopicMap.setAttribute('aria-label', `${topic.label}关联网络，共享代谢物已合并，包含${pathwayIds.length}条通路`);
        studentTopicBands.innerHTML = '';
        studentTopicEdges.innerHTML = '';
        studentTopicNodes.innerHTML = '';
        studentTopicPinnedLanes.innerHTML = '';
        studentTopicRouteLegend.innerHTML = '';
        activeStudentTopicRouteFocus = null;
        studentTopicApplyFocus = null;
        hideStudentTopicNodeContext(false);
        hideStudentTopicRouteContext(false);

        studentTopicBands.appendChild(studentSvgElement('rect', {
          x: 52, y: primaryY - 58, width: mapWidth - 104, height: 116, rx: 26, class: 'student-topic-core-band'
        }));
        studentTopicBands.appendChild(studentSvgElement('text', {
          x: 76, y: primaryY - 72, class: 'student-topic-core-label'
        }, `核心骨架 · ${orderedRecords[0].pathway.name}`));

        const networkCurve = (from, to, routeIndex) => {
          const direction = to.x >= from.x ? 1 : -1;
          if (Math.abs(to.x - from.x) < 24) {
            const verticalDirection = to.y >= from.y ? 1 : -1;
            const startY = from.y + verticalDirection * nodeHeight / 2;
            const endY = to.y - verticalDirection * nodeHeight / 2;
            const side = routeIndex % 2 ? -1 : 1;
            const offset = side * (34 + (Math.floor(routeIndex / 2) % 3) * 8);
            return `M ${from.x} ${startY} C ${from.x + offset} ${startY + verticalDirection * 18} ${to.x + offset} ${endY - verticalDirection * 18} ${to.x} ${endY}`;
          }
          const start = { x: from.x + direction * nodeWidth / 2, y: from.y };
          const end = { x: to.x - direction * nodeWidth / 2, y: to.y };
          const control = Math.min(120, Math.max(42, Math.abs(end.x - start.x) * .36));
          return `M ${start.x} ${start.y} C ${start.x + direction * control} ${start.y} ${end.x - direction * control} ${end.y} ${end.x} ${end.y}`;
        };

        records.forEach((record, routeIndex) => {
          record.steps.slice(0, -1).forEach((step, index) => {
            const nextStep = record.steps[index + 1];
            if (step.key === nextStep.key) return;
            const from = positions.get(step.key);
            const to = positions.get(nextStep.key);
            if (!from || !to) return;
            const edge = studentSvgElement('path', {
              d: networkCurve(from, to, routeIndex),
              class: `student-topic-network-edge${record === orderedRecords[0] ? ' is-primary-route' : ''}`,
              style: `--route-tone:${record.tone}`
            });
            edge.dataset.pathway = record.pathwayId;
            edge.dataset.fromKey = step.key;
            edge.dataset.toKey = nextStep.key;
            edge.setAttribute('aria-hidden', 'true');
            studentTopicEdges.appendChild(edge);
          });
        });

        const applyNetworkFocus = pathwayList => {
          const focus = new Set(pathwayList || []);
          studentTopicRouteLegend.classList.toggle('has-focus', focus.size > 0);
          studentTopicRouteLegend.querySelectorAll('.student-topic-route-chip').forEach(chip => chip.classList.toggle('is-active', focus.has(chip.dataset.pathway)));
          studentTopicEdges.querySelectorAll('.student-topic-network-edge').forEach(edge => {
            const active = focus.has(edge.dataset.pathway);
            edge.classList.remove('is-node-active', 'is-node-dim');
            edge.classList.toggle('is-route-active', focus.size > 0 && active);
            edge.classList.toggle('is-route-dim', focus.size > 0 && !active);
          });
          studentTopicNodes.querySelectorAll('.student-topic-network-node').forEach(node => {
            const routes = new Set(String(node.dataset.pathways || '').split(' ').filter(Boolean));
            const active = [...focus].some(pathwayId => routes.has(pathwayId));
            node.classList.remove('is-node-active', 'is-node-dim');
            node.classList.toggle('is-route-active', focus.size > 0 && active);
            node.classList.toggle('is-route-dim', focus.size > 0 && !active);
          });
          studentTopicMinimapEdges?.querySelectorAll('.student-topic-minimap-edge').forEach(edge => {
            const active = focus.has(edge.dataset.pathway);
            edge.classList.remove('is-node-active', 'is-node-dim');
            edge.classList.toggle('is-route-active', focus.size > 0 && active);
            edge.classList.toggle('is-route-dim', focus.size > 0 && !active);
          });
        };
        const applyNetworkNodeFocus = nodeKey => {
          const connectedKeys = new Set([nodeKey]);
          const connectedPathways = new Set();
          studentTopicRouteLegend.classList.add('has-focus');
          studentTopicEdges.querySelectorAll('.student-topic-network-edge').forEach(edge => {
            const active = edge.dataset.fromKey === nodeKey || edge.dataset.toKey === nodeKey;
            edge.classList.remove('is-route-active', 'is-route-dim');
            edge.classList.toggle('is-node-active', active);
            edge.classList.toggle('is-node-dim', !active);
            if (!active) return;
            connectedKeys.add(edge.dataset.fromKey);
            connectedKeys.add(edge.dataset.toKey);
            connectedPathways.add(edge.dataset.pathway);
          });
          studentTopicRouteLegend.querySelectorAll('.student-topic-route-chip').forEach(chip => chip.classList.toggle('is-active', connectedPathways.has(chip.dataset.pathway)));
          studentTopicNodes.querySelectorAll('.student-topic-network-node').forEach(node => {
            const active = connectedKeys.has(node.dataset.nodeKey);
            node.classList.remove('is-route-active', 'is-route-dim');
            node.classList.toggle('is-node-active', active);
            node.classList.toggle('is-node-dim', !active);
          });
          studentTopicMinimapEdges?.querySelectorAll('.student-topic-minimap-edge').forEach(edge => {
            const active = edge.dataset.fromKey === nodeKey || edge.dataset.toKey === nodeKey;
            edge.classList.remove('is-route-active', 'is-route-dim');
            edge.classList.toggle('is-node-active', active);
            edge.classList.toggle('is-node-dim', !active);
          });
        };
        studentTopicApplyFocus = applyNetworkFocus;

        const showRouteContext = record => {
          if (!record || !studentTopicRouteContext || !studentTopicRouteContextTitle || !studentTopicRouteContextMeta) return;
          hideStudentTopicNodeContext(false);
          activeStudentTopicRouteFocus = record.pathwayId;
          studentTopicRouteContext.hidden = false;
          studentTopicRouteContext.style.setProperty('--route-tone', record.tone);
          studentTopicRouteContextTitle.textContent = record.pathway.name;
          studentTopicRouteContextMeta.textContent = `${record.steps.length} 个关键节点 · ${studentReactionsFor(record.pathwayId).length} 个反应 · ${record.pathway.compartment || '多区室'}`;
          applyNetworkFocus([record.pathwayId]);
          const routePoints = record.steps.map(step => positions.get(step.key)).filter(Boolean);
          if (routePoints.length) {
            const minRouteX = Math.min(...routePoints.map(point => point.x));
            const maxRouteX = Math.max(...routePoints.map(point => point.x));
            const minRouteY = Math.min(...routePoints.map(point => point.y));
            const maxRouteY = Math.max(...routePoints.map(point => point.y));
            scrollStudentTopicToPoint((minRouteX + maxRouteX) / 2, (minRouteY + maxRouteY) / 2);
          }
        };

        const showNodeContext = (label, routeIds, nodeKey) => {
          if (!studentTopicNodeContext || !studentTopicNodeContextTitle || !studentTopicNodeContextRoutes) return;
          hideStudentTopicRouteContext();
          studentTopicNodeContext.hidden = false;
          studentTopicNodeContextTitle.textContent = `${readableReactionEquation(label)} 连接 ${routeIds.length} 条通路`;
          studentTopicNodeContextRoutes.innerHTML = '';
          routeIds.forEach(pathwayId => {
            const record = records.find(item => item.pathwayId === pathwayId);
            if (!record) return;
            const button = document.createElement('button');
            button.type = 'button';
            button.style.setProperty('--route-tone', record.tone);
            button.textContent = `${record.pathway.name} →`;
            button.addEventListener('click', () => renderStudentPathway(pathwayId));
            studentTopicNodeContextRoutes.appendChild(button);
          });
          applyNetworkNodeFocus(nodeKey);
        };

        positions.forEach((point, key) => {
          const info = nodeInfo.get(key);
          if (!info) return;
          const routeIds = [...info.pathways];
          const shared = routeIds.length > 1;
          const tone = shared ? '#d99a29' : (info.tones[0] || topic.tone);
          const displayLabel = readableReactionEquation(info.label);
          const node = studentSvgElement('g', { class: `student-topic-node student-topic-network-node${shared ? ' shared' : ''}`, style: `--topic-tone:${tone}` });
          node.dataset.pathways = routeIds.join(' ');
          node.dataset.nodeKey = key;
          node.setAttribute('role', 'button');
          node.tabIndex = 0;
          node.setAttribute('aria-label', shared ? `${displayLabel}，连接${routeIds.length}条通路，点击选择` : `${displayLabel}，点击进入${atlas.pathways[routeIds[0]]?.name || '通路'}`);
          node.appendChild(studentSvgElement('title', {}, shared ? `${displayLabel}：${routeIds.map(pathwayId => atlas.pathways[pathwayId]?.name).filter(Boolean).join('、')}` : displayLabel));
          node.appendChild(studentSvgElement('rect', { x: point.x - nodeWidth / 2, y: point.y - nodeHeight / 2, width: nodeWidth, height: nodeHeight }));
          node.appendChild(studentSvgElement('circle', { cx: point.x - nodeWidth / 2 + 18, cy: point.y, r: 5, class: 'topic-network-dot' }));
          node.appendChild(studentSvgElement('text', { x: point.x + 7, y: point.y - 3, class: 'topic-name' }, studentMapLabel(displayLabel, 18)));
          node.appendChild(studentSvgElement('text', { x: point.x + 7, y: point.y + 16, class: 'topic-meta' }, shared ? `连接 ${routeIds.length} 条通路` : studentMapLabel(atlas.pathways[routeIds[0]]?.compartment || '多区室', 15)));
          if (shared) {
            node.appendChild(studentSvgElement('circle', { cx: point.x + nodeWidth / 2 - 12, cy: point.y - nodeHeight / 2 + 12, r: 10, class: 'topic-shared-badge' }));
            node.appendChild(studentSvgElement('text', { x: point.x + nodeWidth / 2 - 12, y: point.y - nodeHeight / 2 + 15, class: 'topic-shared-count' }, String(routeIds.length)));
          }
          node.addEventListener('mouseenter', () => applyNetworkNodeFocus(key));
          node.addEventListener('mouseleave', () => { if (studentTopicNodeContext.hidden) restoreStudentTopicRouteFocus(); });
          node.addEventListener('focus', () => applyNetworkNodeFocus(key));
          node.addEventListener('blur', () => { if (studentTopicNodeContext.hidden) restoreStudentTopicRouteFocus(); });
          node.addEventListener('click', event => {
            event.stopPropagation();
            if (shared) showNodeContext(displayLabel, routeIds, key);
            else renderStudentPathway(routeIds[0]);
          });
          node.addEventListener('keydown', event => {
            if (event.key !== 'Enter' && event.key !== ' ') return;
            event.preventDefault();
            if (shared) showNodeContext(displayLabel, routeIds, key);
            else renderStudentPathway(routeIds[0]);
          });
          studentTopicNodes.appendChild(node);
        });

        records.forEach(record => {
          const chip = document.createElement('button');
          chip.type = 'button';
          chip.className = 'student-topic-route-chip';
          chip.dataset.pathway = record.pathwayId;
          chip.style.setProperty('--route-tone', record.tone);
          chip.textContent = record.pathway.name;
          chip.setAttribute('aria-label', `在全景图中聚焦${record.pathway.name}`);
          chip.addEventListener('mouseenter', () => applyNetworkFocus([record.pathwayId]));
          chip.addEventListener('mouseleave', () => { if (studentTopicNodeContext.hidden) restoreStudentTopicRouteFocus(); });
          chip.addEventListener('focus', () => applyNetworkFocus([record.pathwayId]));
          chip.addEventListener('blur', () => { if (studentTopicNodeContext.hidden) restoreStudentTopicRouteFocus(); });
          chip.addEventListener('click', () => {
            if (activeStudentTopicRouteFocus === record.pathwayId && !studentTopicRouteContext.hidden) {
              hideStudentTopicRouteContext();
              return;
            }
            showRouteContext(record);
          });
          studentTopicRouteLegend.appendChild(chip);
        });

        if (externalLinks.length) {
          studentTopicBands.appendChild(studentSvgElement('rect', { x: 52, y: externalTop, width: mapWidth - 104, height: 100, class: 'student-topic-external-band' }));
          studentTopicBands.appendChild(studentSvgElement('text', { x: 76, y: externalTop + 24, class: 'student-topic-external-label' }, '跨专题出口（简化显示）'));
          studentTopicNodes.appendChild(studentSvgElement('circle', { cx: mapWidth / 2, cy: externalTop + 32, r: 7, class: 'student-topic-external-hub' }));
          studentTopicNodes.appendChild(studentSvgElement('text', { x: mapWidth / 2, y: externalTop + 18, class: 'student-topic-external-hub-label' }, '共享代谢池'));
          const externalGap = Math.min(270, (mapWidth - 340) / Math.max(1, externalLinks.length - 1));
          const externalStartX = (mapWidth - externalGap * (externalLinks.length - 1)) / 2;
          externalLinks.forEach((link, index) => {
            const point = { x: externalStartX + index * externalGap, y: externalTop + 65 };
            studentTopicEdges.appendChild(studentSvgElement('path', {
              d: `M ${mapWidth / 2} ${externalTop + 32} C ${mapWidth / 2} ${externalTop + 49} ${point.x} ${externalTop + 49} ${point.x} ${point.y - 27}`,
              class: 'student-topic-external-edge'
            }));
            const node = studentSvgElement('g', { class: 'student-topic-external-node', style: `--topic-tone:${link.topic.tone}` });
            node.dataset.topic = link.topicId;
            node.setAttribute('role', 'button');
            node.tabIndex = 0;
            node.setAttribute('aria-label', `进入${link.topic.label}专题`);
            node.appendChild(studentSvgElement('rect', { x: point.x - 105, y: point.y - 27, width: 210, height: 54 }));
            node.appendChild(studentSvgElement('text', { x: point.x, y: point.y - 3, class: 'topic-external-name' }, link.topic.label));
            node.appendChild(studentSvgElement('text', { x: point.x, y: point.y + 15, class: 'topic-external-meta' }, `${link.sharedCount} 个共享交点`));
            const openExternalTopic = () => renderStudentTopic(link.topicId, { openAtlas: true });
            node.addEventListener('click', event => { event.stopPropagation(); openExternalTopic(); });
            node.addEventListener('keydown', event => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                openExternalTopic();
              }
            });
            studentTopicNodes.appendChild(node);
          });
        }
        renderStudentTopicNetworkMinimap(mapWidth, mapHeight, positions, nodeInfo);
        const primaryStart = positions.get(orderedRecords[0].steps[0].key) || { x: startX + shiftX, y: primaryY };
        window.requestAnimationFrame(() => {
          if (activeStudentTopic !== topicId || activeStudentTopicView !== 'network' || !studentTopicStage) return;
          studentTopicStage.scrollLeft = Math.max(0, primaryStart.x * studentTopicZoom - Math.min(210, studentTopicStage.clientWidth * .16));
          studentTopicStage.scrollTop = Math.max(0, primaryY * studentTopicZoom - studentTopicStage.clientHeight * .48);
          scheduleStudentTopicMinimapSync();
        });
      }

      // #12 ── 学习模式 · 专题渲染 ─────────────────────────────────────
      function renderStudentTopicLaneMap(topicId) {
        const topic = studentTopicCatalog[topicId];
        const pathwayIds = studentTopicPathwayIds(topicId);
        if (!topic || !studentTopicMap || !studentTopicBands || !studentTopicEdges || !studentTopicNodes || !studentTopicPinnedLanes) return;
        const nodeWidth = 166;
        const nodeHeight = 50;
        const laneHeight = 108;
        const laneStartY = 80;
        const compactLaneRail = window.matchMedia('(min-width: 761px)').matches
          && studentTopicStage?.classList.contains('topic-lanes-collapsed');
        const stepStartX = compactLaneRail ? 176 : 410;
        const stepGap = 190;
        const records = pathwayIds.map((pathwayId, laneIndex) => {
          const pathway = atlas.pathways[pathwayId];
          const steps = (Array.isArray(pathway.steps) ? pathway.steps : []).filter(Boolean).map((step, stepIndex) => ({
            pathwayId,
            laneIndex,
            stepIndex,
            label: String(step),
            key: studentMapNameKey(step)
          }));
          return { pathwayId, pathway, laneIndex, steps, tone: studentPathwayMeta(pathwayId).tone };
        });
        const recordById = new Map(records.map(record => [record.pathwayId, record]));
        const occurrencesByKey = new Map();
        records.forEach(record => record.steps.forEach(step => {
          if (!step.key) return;
          if (!occurrencesByKey.has(step.key)) occurrencesByKey.set(step.key, []);
          occurrencesByKey.get(step.key).push(step);
        }));
        const sharedKeySet = new Set();
        occurrencesByKey.forEach((occurrences, key) => {
          if (new Set(occurrences.map(item => item.pathwayId)).size < 2) return;
          sharedKeySet.add(key);
        });
        const maxSteps = Math.max(2, ...records.map(record => record.steps.length));
        const mapWidth = Math.max(1540, stepStartX + (maxSteps - 1) * stepGap + nodeWidth / 2 + 76);
        const currencyKeys = new Set(['atp', 'adp', 'amp', 'gtp', 'gdp', 'utp', 'udp', 'ctp', 'cdp', 'nad', 'nadh', 'nadp', 'nadph', 'h', 'h+', 'h2o', 'co2', 'o2', 'pi', 'coa']);
        const networkKeysForPathway = pathwayId => {
          const keys = new Set((atlas.pathways[pathwayId]?.steps || []).map(studentMapNameKey));
          studentReactionsFor(pathwayId).forEach(reaction => {
            [reaction.from, reaction.to].map(entityId => entityById[entityId]).filter(Boolean).forEach(entity => keys.add(studentEntityIdentityKey(entity)));
          });
          return new Set([...keys].filter(key => key && !currencyKeys.has(key)));
        };
        const internalKeys = new Set(pathwayIds.flatMap(pathwayId => [...networkKeysForPathway(pathwayId)]));
        const externalLinks = Object.entries(studentTopicCatalog)
          .filter(([otherTopicId]) => otherTopicId !== topicId)
          .map(([otherTopicId, otherTopic]) => {
            const externalKeys = new Set(studentTopicPathwayIds(otherTopicId)
              .flatMap(pathwayId => [...networkKeysForPathway(pathwayId)]));
            const sharedCount = [...internalKeys].filter(key => externalKeys.has(key)).length;
            return { topicId: otherTopicId, topic: otherTopic, sharedCount };
          })
          .filter(link => link.sharedCount > 0)
          .sort((a, b) => b.sharedCount - a.sharedCount)
          .slice(0, 4);
        const externalTop = laneStartY + records.length * laneHeight + 14;
        const mapHeight = Math.max(310, externalTop + (externalLinks.length ? 126 : 24));
        setStudentTopicMapDimensions(mapWidth, mapHeight);
        studentTopicMap.setAttribute('aria-label', `${topic.label}专题全景图，展开${pathwayIds.length}条通路`);
        studentTopicBands.innerHTML = '';
        studentTopicEdges.innerHTML = '';
        studentTopicNodes.innerHTML = '';
        studentTopicPinnedLanes.innerHTML = '';
        if (studentTopicMinimap) studentTopicMinimap.hidden = true;

        records.forEach(record => {
          const y = laneStartY + record.laneIndex * laneHeight;
          studentTopicBands.appendChild(studentSvgElement('rect', {
            x: 22, y: y - 50, width: mapWidth - 44, height: 100, class: 'student-topic-band'
          }));
          const pinnedLane = document.createElement('button');
          pinnedLane.type = 'button';
          pinnedLane.className = 'student-topic-pinned-lane';
          pinnedLane.style.setProperty('--topic-tone', record.tone);
          pinnedLane.dataset.baseTop = String(y - 50);
          pinnedLane.style.top = `${(y - 50) * studentTopicZoom}px`;
          pinnedLane.setAttribute('aria-label', `进入${record.pathway.name}通路`);
          pinnedLane.innerHTML = `<span><strong>${escapeStudentText(record.pathway.name)}</strong><small>${studentReactionsFor(record.pathwayId).length} 个反应 · ${escapeStudentText(studentMapLabel(record.pathway.compartment || '多区室', 18))}</small></span>`;
          pinnedLane.addEventListener('click', () => renderStudentPathway(record.pathwayId));
          studentTopicPinnedLanes.appendChild(pinnedLane);
        });

        const basePoint = step => ({ x: stepStartX + step.stepIndex * stepGap, y: laneStartY + step.laneIndex * laneHeight });
        const pointFor = step => basePoint(step);
        const routeCurve = (from, to) => {
          const deltaX = to.x - from.x;
          const deltaY = to.y - from.y;
          if (Math.abs(deltaX) < 20) {
            const startY = from.y + (deltaY >= 0 ? nodeHeight / 2 : -nodeHeight / 2);
            const endY = to.y - (deltaY >= 0 ? nodeHeight / 2 : -nodeHeight / 2);
            return `M ${from.x} ${startY} C ${from.x + 28} ${(startY + endY) / 2} ${to.x + 28} ${(startY + endY) / 2} ${to.x} ${endY}`;
          }
          const direction = deltaX > 0 ? 1 : -1;
          const startX = from.x + direction * nodeWidth / 2;
          const endX = to.x - direction * nodeWidth / 2;
          return `M ${startX} ${from.y} C ${startX + direction * 48} ${from.y} ${endX - direction * 48} ${to.y} ${endX} ${to.y}`;
        };

        records.forEach(record => {
          record.steps.slice(0, -1).forEach((step, index) => {
            const nextStep = record.steps[index + 1];
            const from = pointFor(step);
            const to = pointFor(nextStep);
            if (from.x === to.x && from.y === to.y) return;
            studentTopicEdges.appendChild(studentSvgElement('path', {
              d: routeCurve(from, to), class: 'student-topic-edge', style: `--route-tone:${record.tone}`
            }));
          });
        });

        let sharedRailIndex = 0;
        occurrencesByKey.forEach((occurrences, key) => {
          const pathwayOccurrences = [...new Map(occurrences.map(item => [item.pathwayId, item])).values()]
            .sort((a, b) => a.laneIndex - b.laneIndex);
          if (pathwayOccurrences.length < 2) return;
          const railX = mapWidth - 46 - (sharedRailIndex % 6) * 9;
          sharedRailIndex += 1;
          pathwayOccurrences.slice(0, -1).forEach((sourceStep, index) => {
            const targetStep = pathwayOccurrences[index + 1];
            const source = pointFor(sourceStep);
            const target = pointFor(targetStep);
            const sourceX = source.x + nodeWidth / 2;
            const targetX = target.x + nodeWidth / 2;
            const sourceChannelY = source.y + nodeHeight / 2 + 14;
            const targetChannelY = target.y - nodeHeight / 2 - 14;
            const edge = studentSvgElement('path', {
              d: `M ${sourceX} ${source.y} H ${sourceX + 18} V ${sourceChannelY} H ${railX} V ${targetChannelY} H ${targetX + 18} V ${target.y} H ${targetX}`,
              class: 'student-topic-bridge-edge',
              'aria-hidden': 'true'
            });
            edge.dataset.sharedKey = key;
            studentTopicEdges.appendChild(edge);
          });
        });

        const setSharedHighlight = (key, enabled) => {
          studentTopicEdges.querySelectorAll('.student-topic-bridge-edge').forEach(edge => {
            edge.classList.toggle('is-active', enabled && edge.dataset.sharedKey === key);
          });
          studentTopicNodes.querySelectorAll('.student-topic-node.shared').forEach(node => {
            node.classList.toggle('is-shared-active', enabled && node.dataset.sharedKey === key);
          });
        };

        records.forEach(record => {
          const laneY = laneStartY + record.laneIndex * laneHeight;
          const reactionCount = studentReactionsFor(record.pathwayId).length;
          const lane = studentSvgElement('g', { class: 'student-topic-lane-title', style: `--topic-tone:${record.tone}` });
          lane.dataset.pathway = record.pathwayId;
          lane.setAttribute('role', 'button');
          lane.tabIndex = 0;
          lane.setAttribute('aria-label', `进入${record.pathway.name}通路`);
          lane.appendChild(studentSvgElement('rect', { x: 42, y: laneY - 27, width: 218, height: 54 }));
          lane.appendChild(studentSvgElement('text', { x: 62, y: laneY - 4, class: 'topic-lane-name' }, studentMapLabel(record.pathway.name, 17)));
          lane.appendChild(studentSvgElement('text', { x: 62, y: laneY + 15, class: 'topic-lane-meta' }, `${reactionCount} 个反应 · ${studentMapLabel(record.pathway.compartment || '多区室', 13)}`));
          const openTopicPathway = () => renderStudentPathway(record.pathwayId);
          lane.addEventListener('click', event => { event.stopPropagation(); openTopicPathway(); });
          lane.addEventListener('keydown', event => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault();
              openTopicPathway();
            }
          });
          studentTopicNodes.appendChild(lane);

          record.steps.forEach(step => {
            const shared = sharedKeySet.has(step.key);
            const owner = record;
            const point = pointFor(step);
            const connectedPathwayCount = shared ? new Set(occurrencesByKey.get(step.key).map(item => item.pathwayId)).size : 1;
            const node = studentSvgElement('g', { class: `student-topic-node${shared ? ' shared' : ''}`, style: `--topic-tone:${owner.tone}` });
            node.dataset.pathway = owner.pathwayId;
            if (shared) node.dataset.sharedKey = step.key;
            node.setAttribute('role', 'button');
            node.tabIndex = 0;
            node.setAttribute('aria-label', shared ? `${step.label}，连接${connectedPathwayCount}条专题通路` : `${step.label}，${owner.pathway.name}`);
            node.appendChild(studentSvgElement('title', {}, shared ? `${step.label}：还出现在 ${connectedPathwayCount - 1} 条通路中；悬停查看关联` : `${owner.pathway.name}第 ${step.stepIndex + 1} 步`));
            node.appendChild(studentSvgElement('rect', {
              x: point.x - nodeWidth / 2, y: point.y - nodeHeight / 2, width: nodeWidth, height: nodeHeight
            }));
            node.appendChild(studentSvgElement('rect', {
              x: point.x - nodeWidth / 2 + 8, y: point.y - 10, width: 22, height: 20, rx: 10, class: 'topic-step-badge'
            }));
            node.appendChild(studentSvgElement('text', {
              x: point.x - nodeWidth / 2 + 19, y: point.y + 3, class: 'topic-step-number'
            }, String(step.stepIndex + 1).padStart(2, '0')));
            node.appendChild(studentSvgElement('text', { x: point.x + 9, y: point.y - 3, class: 'topic-name' }, studentMapLabel(step.label, 16)));
            node.appendChild(studentSvgElement('text', { x: point.x + 9, y: point.y + 15, class: 'topic-meta' }, shared ? `连接 ${connectedPathwayCount} 条通路` : owner.pathway.compartment || '多区室'));
            if (shared) {
              node.appendChild(studentSvgElement('circle', { cx: point.x + nodeWidth / 2 - 11, cy: point.y - nodeHeight / 2 + 11, r: 9, class: 'topic-shared-badge' }));
              node.appendChild(studentSvgElement('text', { x: point.x + nodeWidth / 2 - 11, y: point.y - nodeHeight / 2 + 14, class: 'topic-shared-count' }, String(connectedPathwayCount)));
            }
            const openOwnerPathway = () => renderStudentPathway(owner.pathwayId);
            if (shared) {
              node.addEventListener('mouseenter', () => setSharedHighlight(step.key, true));
              node.addEventListener('mouseleave', () => setSharedHighlight(step.key, false));
              node.addEventListener('focus', () => setSharedHighlight(step.key, true));
              node.addEventListener('blur', () => setSharedHighlight(step.key, false));
            }
            node.addEventListener('click', event => { event.stopPropagation(); openOwnerPathway(); });
            node.addEventListener('keydown', event => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                openOwnerPathway();
              }
            });
            studentTopicNodes.appendChild(node);
          });
        });

        if (externalLinks.length) {
          studentTopicBands.appendChild(studentSvgElement('rect', {
            x: 22, y: externalTop, width: mapWidth - 44, height: 100, class: 'student-topic-external-band'
          }));
          studentTopicBands.appendChild(studentSvgElement('text', { x: 46, y: externalTop + 24, class: 'student-topic-external-label' }, '专题外代谢（已收拢）'));
          studentTopicNodes.appendChild(studentSvgElement('circle', {
            cx: mapWidth / 2, cy: externalTop + 32, r: 7, class: 'student-topic-external-hub'
          }));
          studentTopicNodes.appendChild(studentSvgElement('text', {
            x: mapWidth / 2, y: externalTop + 18, class: 'student-topic-external-hub-label'
          }, '专题共享池'));
          const externalGap = Math.min(270, (mapWidth - 320) / Math.max(1, externalLinks.length - 1));
          const externalStartX = (mapWidth - externalGap * (externalLinks.length - 1)) / 2;
          externalLinks.forEach((link, index) => {
            const point = { x: externalStartX + index * externalGap, y: externalTop + 62 };
            const edge = studentSvgElement('path', {
              d: `M ${mapWidth / 2} ${externalTop + 32} C ${mapWidth / 2} ${externalTop + 48} ${point.x} ${externalTop + 48} ${point.x} ${point.y - 27}`,
              class: 'student-topic-external-edge'
            });
            studentTopicEdges.appendChild(edge);
            const node = studentSvgElement('g', { class: 'student-topic-external-node', style: `--topic-tone:${link.topic.tone}` });
            node.dataset.topic = link.topicId;
            node.setAttribute('role', 'button');
            node.tabIndex = 0;
            node.setAttribute('aria-label', `进入${link.topic.label}专题`);
            node.appendChild(studentSvgElement('rect', { x: point.x - 105, y: point.y - 27, width: 210, height: 54 }));
            node.appendChild(studentSvgElement('text', { x: point.x, y: point.y - 3, class: 'topic-external-name' }, link.topic.label));
            node.appendChild(studentSvgElement('text', { x: point.x, y: point.y + 15, class: 'topic-external-meta' }, `${link.sharedCount} 个共享交点`));
            const openExternalTopic = () => renderStudentTopic(link.topicId, { openAtlas: true });
            node.addEventListener('click', event => { event.stopPropagation(); openExternalTopic(); });
            node.addEventListener('keydown', event => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                openExternalTopic();
              }
            });
            studentTopicNodes.appendChild(node);
          });
        }
      }

      // #13 ── 学习模式 · 地图泳道 ─────────────────────────────────────
      function renderStudentTopicMap(topicId) {
        if (activeStudentTopicView === 'lanes') {
          if (studentTopicRouteLegend) studentTopicRouteLegend.hidden = true;
          activeStudentTopicRouteFocus = null;
          hideStudentTopicNodeContext(false);
          hideStudentTopicRouteContext(false);
          renderStudentTopicLaneMap(topicId);
          return;
        }
        if (studentTopicRouteLegend) studentTopicRouteLegend.hidden = false;
        renderStudentTopicNetworkMap(topicId);
      }

      function renderStudentTopic(topicId, options = {}) {
        const topic = studentTopicCatalog[topicId];
        if (!topic) return;
        const pathwayIds = studentTopicPathwayIds(topicId);
        activeStudentTopic = topicId;
        activeStudentTopicRouteFocus = null;
        hideStudentTopicNodeContext(false);
        hideStudentTopicRouteContext(false);
        resetStudentDestinations();
        studentCourseHome.hidden = true;
        studentTopicPanel.hidden = false;
        studentPathwayPanel.hidden = true;
        if (studentTopicAtlas) studentTopicAtlas.open = Boolean(options.openAtlas);
        studentTopicPanel.style.setProperty('--topic-tone', topic.tone);
        studentTopicTitle.textContent = topic.label;
        studentTopicSummary.textContent = topic.summary;
        studentTopicCount.textContent = `${pathwayIds.length} 条通路`;
        renderStudentTopicStructure(topic);
        studentTopics.querySelectorAll('.student-topic-card').forEach(card => card.classList.toggle('active', card.dataset.topic === topicId));
        renderStudentLessonCatalog(topicId);
        renderStudentTopicLessons(topicId);
        studentPathStatus.textContent = `${topic.label}专题`;
        studentPathScope.textContent = `${pathwayIds.length} 条通路 · 按需查看`;
        if (studentTopicAtlas?.open) renderStudentTopicMap(topicId);
        else {
          studentTopicBands?.replaceChildren();
          studentTopicEdges?.replaceChildren();
          studentTopicNodes?.replaceChildren();
          if (studentTopicMinimap) studentTopicMinimap.hidden = true;
        }
        if (options.scroll && !document.body.classList.contains('cover-visible')) {
          requestAnimationFrame(() => studentTopicPanel.scrollIntoView({
            behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
            block: 'start'
          }));
        }
      }

      function buildStudentTopics() {
        if (!studentTopics) return;
        studentTopics.innerHTML = '';
        Object.entries(studentTopicCatalog).forEach(([topicId, topic]) => {
          const pathwayCount = studentTopicPathwayIds(topicId).length;
          const button = document.createElement('button');
          button.type = 'button';
          button.className = 'student-topic-card';
          button.dataset.topic = topicId;
          button.style.setProperty('--topic-tone', topic.tone);
          button.innerHTML = `<i aria-hidden="true"></i><span><strong>${escapeStudentText(topic.label)}</strong><small>${escapeStudentText(topic.english)}</small></span><b>${pathwayCount}</b>`;
          button.addEventListener('click', () => renderStudentTopic(topicId));
          studentTopics.appendChild(button);
        });
      }

      function studentGroupMatches(item, pathwayId) {
        const { pathway, routeGroup } = studentPathwayMeta(pathwayId);
        const groups = groupsFor(item);
        return groups.includes(pathwayId) || Boolean(routeGroup && groups.includes(routeGroup));
      }

      function studentReactionsFor(pathwayId) {
        return reactions.filter(reaction => studentGroupMatches(reaction, pathwayId));
      }

      function resolveStudentStep(pathwayId, step, index = 0) {
        const { pathway, routeGroup } = studentPathwayMeta(pathwayId);
        return window.STUDENT_STEP_RESOLVER.resolveStep({
          pathwayId, pathway, routeGroup, step, index,
          stepCount: Array.isArray(pathway.steps) ? pathway.steps.length : 0,
          entities, reactions, entityById
        });
      }

      function findStudentEntityForStep(pathwayId, step, index = 0) {
        return resolveStudentStep(pathwayId, step, index).entity;
      }

      function escapeStudentText(value) {
        return String(value ?? '').replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character]));
      }

      const readableEquationReplacements = [
        [/GAR synthetase\s*\(GART\)/gi, '甘氨酰胺核糖核苷酸合成酶'],
        [/AICAR 转化酶\/IMP 环水解酶\s*\(ATIC\)/gi, '5-氨基咪唑-4-甲酰胺核糖核苷酸转化酶／次黄嘌呤核苷酸环水解酶'],
        [/\bAICAR\b/g, '5-氨基咪唑-4-甲酰胺核糖核苷酸'],
        [/\bGAR\b/g, '甘氨酰胺核糖核苷酸'],
        [/\bVDAC\b/g, '电压依赖性阴离子通道'],
        [/\bMPC\b/g, '线粒体丙酮酸载体'],
        [/\bGPD2\b/g, '线粒体甘油-3-磷酸脱氢酶'],
        [/\bCPT1\b|CPT-I\b/g, '肉碱棕榈酰转移酶 1'],
        [/\bCACT\b/g, '肉碱-脂酰肉碱转位酶'],
        [/\bCPT2\b|CPT-II\b/g, '肉碱棕榈酰转移酶 2'],
        [/\bACC\b/g, '乙酰辅酶 A 羧化酶'],
        [/\bFAS\b/g, '脂肪酸合酶'],
        [/\bSCOT\b/g, '琥珀酰辅酶 A：3-酮酸辅酶 A 转移酶'],
        [/\bANT\b/g, '腺嘌呤核苷酸转位酶'],
        [/\bRNR\b/g, '核糖核苷酸还原酶'],
        [/\bHMG-CoA\b/g, '羟甲基戊二酰辅酶 A'],
        [/\bBCKDH\b/g, '支链 α-酮酸脱氢酶复合体'],
        [/\bBCAA\b/g, '支链氨基酸'],
        [/\bVLCFA\b/g, '极长链脂肪酸'],
        [/\bDHODH\b/g, '二氢乳清酸脱氢酶'],
        [/\bOMP\b/g, '乳清苷酸'],
        [/\bALA\b/g, '5-氨基乙酰丙酸'],
        [/\bTHF\b/g, '四氢叶酸'],
        [/\bSAM\b/g, 'S-腺苷甲硫氨酸'],
        [/\bSAH\b/g, 'S-腺苷同型半胱氨酸'],
        [/\bGSSG\b/g, '氧化型谷胱甘肽'],
        [/\bGSH\b/g, '还原型谷胱甘肽'],
        [/\bROS\b/g, '活性氧'],
        [/\bTAG\b/g, '三酰甘油'],
        [/\bGPD1\b/g, '胞质甘油-3-磷酸脱氢酶'],
        [/\bMDH1\b/g, '胞质苹果酸脱氢酶'],
        [/\bMDH2\b/g, '线粒体苹果酸脱氢酶'],
        [/\bGOT1\b/g, '胞质天冬氨酸转氨酶'],
        [/\bGOT2\b/g, '线粒体天冬氨酸转氨酶'],
        [/CoA-SH/g, '辅酶 A-SH'],
        [/-CoA\b/g, '-辅酶 A'],
        [/\bCoA\b/g, '辅酶 A'],
        [/\bPRPP\b/g, '5-磷酸核糖-1-焦磷酸'],
        [/\bIMP\b/g, '次黄嘌呤核苷酸'],
        [/F-1,6-BP/g, '果糖-1,6-二磷酸'],
        [/F1,6BP/g, '果糖-1,6-二磷酸'],
        [/1,3-BPG/g, '1,3-二磷酸甘油酸'],
        [/\bG6P\b/g, '葡萄糖-6-磷酸'],
        [/\bF6P\b/g, '果糖-6-磷酸'],
        [/\bF1P\b/g, '果糖-1-磷酸'],
        [/\bDHAP\b/g, '磷酸二羟丙酮'],
        [/\bG3P\b/g, '甘油醛-3-磷酸'],
        [/\bG1P\b/g, '葡萄糖-1-磷酸'],
        [/\b3-PG\b/g, '3-磷酸甘油酸'],
        [/\b2-PG\b/g, '2-磷酸甘油酸'],
        [/\bPEP\b/g, '磷酸烯醇式丙酮酸'],
        [/\bOAA\b/g, '草酰乙酸'],
        [/α-KG/g, 'α-酮戊二酸'],
        [/\bRu5P\b/g, '核酮糖-5-磷酸'],
        [/\bR5P\b/g, '核糖-5-磷酸'],
        [/\bX5P\b/g, '木酮糖-5-磷酸'],
        [/\bGal-1-P\b/g, '半乳糖-1-磷酸'],
        [/\bUDP-Gal\b/g, 'UDP-半乳糖'],
        [/\bUDP-Glc\b/g, 'UDP-葡萄糖'],
        [/甘油-3-P/g, '甘油-3-磷酸'],
        [/\bPi\b/g, '无机磷酸'],
        [/\bCyt c\b/g, '细胞色素 c'],
        [/\bCoQH₂\b/g, '泛醇'],
        [/\bCoQ\b/g, '辅酶 Q']
      ];
      function readableReactionEquation(value) {
        return readableEquationReplacements.reduce((text, [pattern, replacement]) => text.replace(pattern, replacement), String(value || '—'));
      }
      function reactionEquationTermsHtml(value) {
        return String(value).split(/\s+\+\s+/).map((term, index) => `${index ? '<span class="reaction-equation-plus" aria-hidden="true">+</span>' : ''}<span class="reaction-equation-term">${escapeStudentText(term.trim())}</span>`).join('');
      }
      function reactionEquationHtml(value) {
        const equation = readableReactionEquation(value);
        const lines = equation.split(/；\s*/).filter(Boolean).map(segment => {
          const match = segment.match(/⇌|↔|→/);
          if (!match) return `<span class="reaction-equation-line statement"><span class="reaction-equation-side"><small>过程</small>${reactionEquationTermsHtml(segment)}</span></span>`;
          const arrowIndex = match.index;
          const left = segment.slice(0, arrowIndex).trim();
          const right = segment.slice(arrowIndex + match[0].length).trim();
          return `<span class="reaction-equation-line"><span class="reaction-equation-side substrate"><small>底物</small>${reactionEquationTermsHtml(left)}</span><span class="reaction-equation-arrow" aria-hidden="true">${escapeStudentText(match[0])}</span><span class="reaction-equation-side product"><small>产物</small>${reactionEquationTermsHtml(right)}</span></span>`;
        }).join('');
        return `<span class="reaction-equation-lines" aria-label="${escapeStudentText(equation)}">${lines}</span>`;
      }

      const studentSvgNs = 'http://www.w3.org/2000/svg';
      function studentSvgElement(tag, attributes = {}, textValue = '') {
        const element = document.createElementNS(studentSvgNs, tag);
        Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, String(value)));
        if (textValue) element.textContent = textValue;
        return element;
      }

      function studentMapLabel(value, maxLength = 12) {
        const text = readableReactionEquation(value || '节点');
        return text.length > maxLength ? `${text.slice(0, maxLength - 1)}…` : text;
      }

      function fitStudentMapText(textElement, availableWidth, maximumSize, minimumSize) {
        if (!textElement) return;
        textElement.style.fontSize = `${maximumSize}px`;
        const measuredWidth = textElement.getComputedTextLength();
        if (!Number.isFinite(measuredWidth) || measuredWidth <= availableWidth) return;
        const fittedSize = Math.max(minimumSize, maximumSize * (availableWidth / measuredWidth));
        textElement.style.fontSize = `${Math.floor(fittedSize * 10) / 10}px`;
      }

      function fitStudentBranchLabel(textElement, availableWidth, centerX, centerY) {
        if (!textElement) return;
        textElement.style.fontSize = '11.5px';
        if (textElement.getComputedTextLength() <= availableWidth) return;
        const characters = Array.from(textElement.textContent || '');
        const splitAt = Math.max(2, Math.ceil(characters.length / 2));
        const lines = [characters.slice(0, splitAt).join(''), characters.slice(splitAt).join('')].filter(Boolean);
        textElement.textContent = '';
        lines.forEach((line, index) => {
          textElement.appendChild(studentSvgElement('tspan', {
            x: centerX,
            y: centerY + (index === 0 ? -2 : 12)
          }, line));
        });
        const longestLine = Math.max(...[...textElement.querySelectorAll('tspan')].map(line => line.getComputedTextLength()));
        if (longestLine > availableWidth) {
          const fittedSize = Math.max(9.5, 11.5 * (availableWidth / longestLine));
          textElement.style.fontSize = `${Math.floor(fittedSize * 10) / 10}px`;
        }
      }

      function studentMapNameKey(value) {
        return String(value || '').toLowerCase().replace(/辅酶\s*a/gi, 'coa').replace(/[\s\-_/,，、()（）@↔→]/g, '');
      }

      function studentEntityIdentityKey(entity) {
        if (!entity) return '';
        const stableKey = entity.entityKey || String(entity.id || '').split('@')[0] || entity.name;
        return studentMapNameKey(stableKey);
      }

      function studentParticipantSubject(participant, pathwayId) {
        const entry = participantCatalogByKey.get(participant?.key || participant?.participantKey);
        const candidateIds = [...new Set([
          ...(participant?.entityIds || []),
          ...(entry?.entityIds || [])
        ])];
        const candidates = candidateIds.map(entityId => entityById[entityId]).filter(Boolean);
        const representative = candidates.find(entity => studentGroupMatches(entity, pathwayId)) || candidates[0] || null;
        const key = participant?.key || participant?.participantKey || studentMapNameKey(participant?.name);
        return {
          ...(representative || {}),
          id: representative?.id || `participant:${key}`,
          entityKey: representative?.entityKey || participant?.name || key,
          participantKey: key,
          name: participant?.name || representative?.name || key,
          label: participant?.name || representative?.label || key,
          kind: representative?.kind || '反应参与物',
          participantRole: participant?.role || participant?.participantRole || '',
          compartment: participant?.compartment || representative?.compartment
            || atlas.pathways[pathwayId]?.compartment || '区室待核对'
        };
      }

      function studentMapReactionFor(pathwayId, fromId, toId, fallbackIndex = 0) {
        const pathwayReactions = studentReactionsFor(pathwayId);
        return pathwayReactions.find(reaction => {
          const direct = reaction.from === fromId && reaction.to === toId;
          const reverse = reaction.reversible && reaction.from === toId && reaction.to === fromId;
          return direct || reverse;
        }) || pathwayReactions[fallbackIndex] || null;
      }

      function studentMapEdgePath(a, b, width, height) {
        const direction = b.x >= a.x ? 1 : -1;
        const startX = a.x + direction * (width / 2);
        const endX = b.x - direction * (width / 2);
        if (Math.abs(a.y - b.y) < 5) return `M ${startX} ${a.y} H ${endX}`;
        const directionY = b.y >= a.y ? 1 : -1;
        const startY = a.y + directionY * (height / 2);
        const endY = b.y - directionY * (height / 2);
        if (Math.abs(a.x - b.x) < 5) return `M ${a.x} ${startY} V ${endY}`;
        const laneY = (startY + endY) / 2;
        return `M ${a.x} ${startY} V ${laneY} H ${b.x} V ${endY}`;
      }

      function studentMapBranchPath(source, target, laneY, targetHalfHeight = 22) {
        const targetY = target.y - targetHalfHeight;
        return `M ${source.x} ${source.y} V ${laneY} H ${target.x} V ${targetY}`;
      }

      function studentMapBranchInputPath(target, source, laneY, targetHalfHeight = 22, sourceHalfHeight = 34) {
        return `M ${target.x} ${target.y - targetHalfHeight} V ${laneY} H ${source.x} V ${source.y + sourceHalfHeight}`;
      }

      function studentMapLoopPath(first, last, nodeWidth, nodeHeight, twoRows, mainBandY, mainBandHeight) {
        if (twoRows) {
          const laneX = 42;
          return `M ${last.x - nodeWidth / 2} ${last.y} H ${laneX} V ${first.y} H ${first.x - nodeWidth / 2}`;
        }
        const laneY = mainBandY + mainBandHeight + 17;
        return `M ${last.x} ${last.y + nodeHeight / 2} V ${laneY} H ${first.x} V ${first.y + nodeHeight / 2}`;
      }

      function studentMapMarker(edge) {
        if (edge.classList.contains('transport')) return 'url(#student-arrow-transport)';
        if (edge.classList.contains('branch')) return 'url(#student-arrow-branch)';
        return 'url(#student-arrow)';
      }

      function applyStudentReactionDirection(edge, reaction, { showLabel = false, labelOffsetY = -12 } = {}) {
        if (!reaction) return;
        const reversible = Boolean(reaction.reversible);
        edge.classList.toggle('reversible', reversible);
        edge.dataset.direction = reversible ? 'reversible' : 'forward';
        const marker = studentMapMarker(edge);
        edge.setAttribute('marker-end', marker);
        if (reversible) edge.setAttribute('marker-start', marker);
        else edge.removeAttribute('marker-start');
        edge.setAttribute('aria-label', `${reversible ? '可逆反应' : '单向反应'}：${readableReactionEquation(reaction.equation || '查看反应详情')}`);
        if (!reversible || !showLabel) return;
        const length = edge.getTotalLength();
        const point = edge.getPointAtLength(length / 2);
        const label = studentSvgElement('g', {
          class: 'student-map-direction-label',
          transform: `translate(${point.x} ${point.y + labelOffsetY})`,
          'aria-hidden': 'true'
        });
        label.appendChild(studentSvgElement('rect', { x: -13, y: -9, width: 26, height: 18, rx: 9 }));
        label.appendChild(studentSvgElement('text', { x: 0, y: 0 }, '⇌'));
        studentMapEdges.appendChild(label);
      }

      function applyStudentMapZoom(value, { center = false } = {}) {
        if (!studentPathwayMap || !studentMapStage) return;
        const nextZoom = Math.max(1, Math.min(1.6, Math.round(value * 20) / 20));
        const previousZoom = studentMapZoom;
        const previousCenter = studentMapStage.scrollLeft + studentMapStage.clientWidth / 2;
        studentMapZoom = nextZoom;
        studentPathwayMap.style.width = `${Math.round(nextZoom * 100)}%`;
        studentPathwayMap.style.maxWidth = 'none';
        studentMapStage.classList.toggle('is-zoomed', nextZoom > 1);
        if (studentMapZoomValue) studentMapZoomValue.textContent = `${Math.round(nextZoom * 100)}%`;
        if (studentMapZoomFit) studentMapZoomFit.setAttribute('aria-label', `适配画布，当前缩放 ${Math.round(nextZoom * 100)}%`);
        requestAnimationFrame(() => {
          if (nextZoom === 1) {
            studentMapStage.scrollLeft = 0;
          } else if (center && previousZoom !== nextZoom) {
            studentMapStage.scrollLeft = Math.max(0, previousCenter * (nextZoom / previousZoom) - studentMapStage.clientWidth / 2);
          }
        });
      }

      function centerStudentMapCanvas() {
        if (!studentMapStage) return;
        studentMapStage.scrollTo({
          left: Math.max(0, (studentMapStage.scrollWidth - studentMapStage.clientWidth) / 2),
          behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
        });
      }

      const studentSceneLinkCache = new Map();

      function studentSceneRoleInfo(entity, pathwayId) {
        const identityKey = studentEntityIdentityKey(entity);
        const identityIds = new Set(entities
          .filter(candidate => studentEntityIdentityKey(candidate) === identityKey)
          .map(candidate => candidate.id));
        const roles = new Set();
        let reversible = false;
        let reactionId = null;
        studentReactionsFor(pathwayId).forEach(reaction => {
          let matched = false;
          (reaction.participants || []).forEach(participant => {
            const keyMatch = entity.participantKey && participant.key === entity.participantKey;
            const entityMatch = (participant.entityIds || []).some(id => identityIds.has(id));
            if (!keyMatch && !entityMatch) return;
            if (participant.role) roles.add(participant.role);
            matched = true;
          });
          if (!matched && identityIds.has(reaction.from)) { roles.add('substrate'); matched = true; }
          if (!matched && identityIds.has(reaction.to)) { roles.add('product'); matched = true; }
          if (!matched) return;
          reactionId ||= reaction.id;
          reversible ||= Boolean(reaction.reversible);
        });
        return { roles: [...roles], reversible, reactionId };
      }

      function studentSceneFlow(link) {
        const roles = new Set(link.roles || []);
        const hasSubstrate = roles.has('substrate');
        const hasProduct = roles.has('product');
        if (link.reversible || (hasSubstrate && hasProduct)) return { type: 'through', label: link.reversible ? '双向参与' : '通路中间体' };
        if (hasProduct) return { type: 'incoming', label: '由该通路生成' };
        if (hasSubstrate) return { type: 'outgoing', label: '流入该通路' };
        return { type: 'neutral', label: '场景关联' };
      }

      function studentEntityForScene(entity, pathwayId) {
        if (!entity || !atlas.pathways[pathwayId]) return null;
        const identityKey = studentEntityIdentityKey(entity);
        const pathwayReactions = studentReactionsFor(pathwayId);
        const reactionEntityIds = new Set(pathwayReactions.flatMap(reaction => [reaction.from, reaction.to]));
        const candidates = entities.filter(candidate => studentEntityIdentityKey(candidate) === identityKey);
        const score = candidate => {
          const explicitGroup = groupsFor(candidate).includes(pathwayId) ? 6 : 0;
          const inReaction = reactionEntityIds.has(candidate.id) ? 5 : 0;
          const sameCompartment = candidate.compartment === entity.compartment ? 2 : 0;
          return explicitGroup + inReaction + sameCompartment;
        };
        return candidates.sort((a, b) => score(b) - score(a))[0] || null;
      }

      function studentSceneLinksFor(entity, currentPathwayId) {
        if (!entity) return [];
        if (entity.participantKey) {
          const cacheKey = `participant:${entity.participantKey}|${currentPathwayId}`;
          if (studentSceneLinkCache.has(cacheKey)) return studentSceneLinkCache.get(cacheKey);
          const entry = participantCatalogByKey.get(entity.participantKey);
          if (!entry) return [];
          const pathwayOrder = Object.keys(atlas.pathways);
          const links = entry.pathwayIds.filter(pathwayId => pathwayId !== currentPathwayId && atlas.pathways[pathwayId]).map(pathwayId => {
            const occurrences = entry.occurrences.filter(item => item.pathwayIds.includes(pathwayId));
            const occurrence = occurrences[0];
            const representative = studentParticipantSubject({
              key: entry.key,
              name: entry.name,
              entityIds: occurrence?.entityIds || entry.entityIds,
              role: occurrence?.role || '',
              compartment: occurrence?.compartment || atlas.pathways[pathwayId]?.compartment
            }, pathwayId);
            return {
              pathwayId,
              pathway: atlas.pathways[pathwayId],
              entity: representative,
              reactionId: occurrence?.reactionId || null,
              roles: [...new Set(occurrences.map(item => item.role).filter(Boolean))],
              reversible: occurrences.some(item => reactionById[item.reactionId]?.reversible),
              transport: representative.compartment !== entity.compartment
            };
          }).sort((a, b) => pathwayOrder.indexOf(a.pathwayId) - pathwayOrder.indexOf(b.pathwayId));
          studentSceneLinkCache.set(cacheKey, links);
          return links;
        }
        const identityKey = studentEntityIdentityKey(entity);
        const cacheKey = `${identityKey}|${currentPathwayId}`;
        if (studentSceneLinkCache.has(cacheKey)) return studentSceneLinkCache.get(cacheKey);

        const identityEntities = entities.filter(candidate => studentEntityIdentityKey(candidate) === identityKey);
        const identityIds = new Set(identityEntities.map(candidate => candidate.id));
        const pathwayIds = new Set();
        identityEntities.forEach(candidate => groupsFor(candidate).forEach(group => { if (atlas.pathways[group]) pathwayIds.add(group); }));
        reactions.forEach(reaction => {
          if (!identityIds.has(reaction.from) && !identityIds.has(reaction.to)) return;
          groupsFor(reaction).forEach(group => { if (atlas.pathways[group]) pathwayIds.add(group); });
        });
        pathwayIds.delete(currentPathwayId);

        const pathwayOrder = Object.keys(atlas.pathways);
        const links = [...pathwayIds].map(pathwayId => {
          const representative = studentEntityForScene(entity, pathwayId) || entity;
          const roleInfo = studentSceneRoleInfo(entity, pathwayId);
          return {
            pathwayId,
            pathway: atlas.pathways[pathwayId],
            entity: representative,
            reactionId: roleInfo.reactionId,
            roles: roleInfo.roles,
            reversible: roleInfo.reversible,
            transport: representative.compartment !== entity.compartment
          };
        }).sort((a, b) => pathwayOrder.indexOf(a.pathwayId) - pathwayOrder.indexOf(b.pathwayId));
        studentSceneLinkCache.set(cacheKey, links);
        return links;
      }

      function appendStudentSceneBadge(node, point, width, height, entity, pathwayId) {
        if (!entity) return;
        const sceneCount = studentSceneLinksFor(entity, pathwayId).length;
        if (!sceneCount) return;
        const badgeX = point.x + width / 2 - 11;
        const badgeY = point.y - height / 2 + 12;
        node.classList.add('scene-portal');
        node.dataset.sceneLinks = String(sceneCount);
        node.appendChild(studentSvgElement('circle', { cx: badgeX, cy: badgeY, r: 10, class: 'node-scene-badge' }));
        node.appendChild(studentSvgElement('text', { x: badgeX, y: badgeY + 3, class: 'node-scene-count' }, sceneCount > 9 ? '9+' : String(sceneCount)));
        node.appendChild(studentSvgElement('title', {}, `关联 ${sceneCount} 个其他代谢场景`));
        const currentLabel = node.getAttribute('aria-label') || entity.name;
        node.setAttribute('aria-label', `${currentLabel}，关联 ${sceneCount} 个其他代谢场景`);
      }

      function resetStudentDestinations() {
        studentDestinationPanel.hidden = true;
        studentDestinationStage?.classList.remove('is-scrollable');
        studentDestinationEdges.innerHTML = '';
        studentDestinationNodes.innerHTML = '';
        studentMapNodes.querySelectorAll('.student-map-node').forEach(node => node.classList.remove('route-source'));
      }

      function studentDestinationPath(source, target, side = 1, sourceHalfWidth = 90, targetHalfWidth = 100, sourceOffset = 0) {
        const direction = side < 0 ? -1 : 1;
        const startX = source.x + direction * sourceHalfWidth;
        const endX = target.x - direction * targetHalfWidth;
        const startY = source.y + sourceOffset;
        const endY = target.y;
        const span = Math.max(120, Math.abs(endX - startX));
        const bend = Math.max(78, Math.min(230, span * .42));
        return `M ${startX} ${startY} C ${startX + direction * bend} ${startY}, ${endX - direction * bend} ${endY}, ${endX} ${endY}`;
      }

      function studentDestinationMobilePath(source, target, index, count, sourceWidth = 280, sourceHeight = 58, targetHalfWidth = 140) {
        const spread = (Number(index) - (Math.max(1, Number(count)) - 1) / 2) * 44;
        const startX = source.x + Math.max(-sourceWidth / 2 + 28, Math.min(sourceWidth / 2 - 28, spread));
        const startY = source.y + sourceHeight / 2;
        const endX = target.x - targetHalfWidth;
        const endY = target.y;
        const curveY = startY + (endY - startY) * .56;
        return `M ${startX} ${startY} C ${startX} ${startY + 34}, ${endX + 84} ${curveY}, ${endX} ${endY}`;
      }

      function studentDestinationBranchPath(target, side, railX, targetHalfWidth = 100) {
        const direction = side < 0 ? -1 : 1;
        const endX = target.x - direction * targetHalfWidth;
        const span = Math.max(46, Math.abs(endX - railX));
        const bend = Math.min(82, span * .56);
        return `M ${railX} ${target.y} C ${railX + direction * bend} ${target.y}, ${endX - direction * bend * .42} ${target.y}, ${endX} ${target.y}`;
      }

      function renderStudentSceneLinks(entity, currentPathwayId, options = {}) {
        if (!entity || !studentDestinationPanel) return;
        const sceneLinks = studentSceneLinksFor(entity, currentPathwayId);
        const compact = window.matchMedia('(max-width: 760px)').matches;
        const preparedLinks = sceneLinks.map(sceneLink => ({ sceneLink, flow: studentSceneFlow(sceneLink) }));
        const leftLinks = [];
        const rightLinks = [];
        preparedLinks.forEach(entry => {
          if (compact) return;
          if (entry.flow.type === 'incoming') leftLinks.push(entry);
          else if (entry.flow.type === 'outgoing') rightLinks.push(entry);
          else (leftLinks.length <= rightLinks.length ? leftLinks : rightLinks).push(entry);
        });
        const maxSideCount = compact ? sceneLinks.length : Math.max(leftLinks.length, rightLinks.length);
        const mapWidth = compact ? 360 : 1100;
        const mapHeight = compact
          ? (sceneLinks.length ? 190 + Math.max(0, sceneLinks.length - 1) * 78 : 170)
          : Math.max(220, maxSideCount * 74 + 48);
        const sourcePoint = compact ? { x: 180, y: 54 } : { x: mapWidth / 2, y: mapHeight / 2 };
        const sourceWidth = compact ? 280 : 180;
        const sourceHeight = compact ? 58 : 64;
        const destinationLayout = new Map();
        if (!compact) {
          const placeSide = (items, side) => {
            const availableHeight = mapHeight - 96;
            items.forEach((entry, row) => {
              const ratio = items.length <= 1 ? .5 : row / (items.length - 1);
              destinationLayout.set(entry.sceneLink.pathwayId, {
                side,
                point: { x: side < 0 ? 190 : 910, y: 48 + ratio * availableHeight },
                sourceOffset: (ratio - .5) * (sourceHeight - 18)
              });
            });
          };
          placeSide(leftLinks, -1);
          placeSide(rightLinks, 1);
        }
        const bundled = !compact && sceneLinks.length > 8;
        studentDestinationMap.setAttribute('viewBox', `0 0 ${mapWidth} ${mapHeight}`);
        studentDestinationMap.setAttribute('aria-label', `${entity.name}关联的代谢场景`);
        studentDestinationEdges.innerHTML = '';
        studentDestinationNodes.innerHTML = '';
        studentDestinationTitle.textContent = `${entity.name} 连接的代谢场景`;
        studentDestinationCount.textContent = `${sceneLinks.length} 个其他场景`;
        studentDestinationPanel.hidden = false;
        studentDestinationStage?.classList.toggle('is-scrollable', mapHeight > 720);
        const focusSceneTarget = () => {
          const focusTarget = options.focus === 'map' ? studentPathwayMap.closest('.student-map-stage') : studentDestinationPanel;
          requestAnimationFrame(() => {
            focusTarget?.scrollIntoView({
              behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
              block: 'start'
            });
            if (studentDestinationStage?.classList.contains('is-scrollable')) {
              const scale = studentDestinationMap.clientWidth / mapWidth;
              studentDestinationStage.scrollTop = Math.max(0, sourcePoint.y * scale - studentDestinationStage.clientHeight / 2);
            }
          });
        };

        studentMapNodes.querySelectorAll('.student-map-node').forEach(node => node.classList.toggle('route-source', node.dataset.entityId === entity.id));

        const sourceNode = studentSvgElement('g', { class: 'student-destination-node source', style: `--route-tone:${studentPathwayMeta(currentPathwayId).tone}` });
        sourceNode.appendChild(studentSvgElement('rect', { x: sourcePoint.x - sourceWidth / 2, y: sourcePoint.y - sourceHeight / 2, width: sourceWidth, height: sourceHeight }));
        sourceNode.appendChild(studentSvgElement('text', { x: sourcePoint.x, y: sourcePoint.y - 2, class: 'destination-name' }, studentMapLabel(atlas.pathways[currentPathwayId]?.name || '当前场景', 16)));
        sourceNode.appendChild(studentSvgElement('text', { x: sourcePoint.x, y: sourcePoint.y + 17, class: 'destination-meta' }, studentMapLabel(`${entity.name} · ${entity.compartment || '区室待核对'}`, compact ? 30 : 22)));
        studentDestinationNodes.appendChild(sourceNode);

        if (!sceneLinks.length) {
          studentDestinationNodes.appendChild(studentSvgElement('text', { x: compact ? 180 : 700, y: compact ? 132 : sourcePoint.y + 4, class: 'student-destination-empty' }, '当前物质仅连接本场景'));
          focusSceneTarget();
          return;
        }

        if (bundled) {
          const bundleGroups = new Map();
          preparedLinks.forEach(entry => {
            const layout = destinationLayout.get(entry.sceneLink.pathwayId);
            const key = `${layout.side}:${entry.flow.type}`;
            if (!bundleGroups.has(key)) bundleGroups.set(key, { side: layout.side, flow: entry.flow, entries: [] });
            bundleGroups.get(key).entries.push(entry);
          });
          const groupsBySide = side => [...bundleGroups.values()].filter(group => group.side === side);
          [-1, 1].forEach(side => {
            const groups = groupsBySide(side);
            groups.forEach((group, groupIndex) => {
              const typeOffset = ({ incoming: 0, through: 1, outgoing: 2, neutral: 3 })[group.flow.type] || 0;
              const railX = side < 0 ? 350 + typeOffset * 14 : 750 - typeOffset * 14;
              const points = group.entries.map(entry => destinationLayout.get(entry.sceneLink.pathwayId).point);
              const minY = Math.min(...points.map(point => point.y));
              const maxY = Math.max(...points.map(point => point.y));
              const centerY = (minY + maxY) / 2;
              const groupOffset = groups.length <= 1 ? 0 : (groupIndex - (groups.length - 1) / 2) * 15;
              group.entries.forEach(entry => { destinationLayout.get(entry.sceneLink.pathwayId).railX = railX; });
              if (maxY - minY > 2) {
                studentDestinationEdges.appendChild(studentSvgElement('path', {
                  d: `M ${railX} ${minY} C ${railX} ${minY + (maxY - minY) * .32}, ${railX} ${minY + (maxY - minY) * .68}, ${railX} ${maxY}`,
                  class: `student-destination-bundle rail ${group.flow.type}`,
                  'aria-hidden': 'true'
                }));
              }
              studentDestinationEdges.appendChild(studentSvgElement('path', {
                d: studentDestinationPath(sourcePoint, { x: railX, y: centerY }, side, sourceWidth / 2, 0, groupOffset),
                class: `student-destination-bundle trunk ${group.flow.type}`,
                'aria-hidden': 'true'
              }));
            });
          });
        }

        sceneLinks.forEach((sceneLink, index) => {
          const layout = destinationLayout.get(sceneLink.pathwayId);
          const point = compact
            ? { x: 180, y: 158 + index * 78 }
            : layout.point;
          const flow = studentSceneFlow(sceneLink);
          const pathData = compact
            ? studentDestinationMobilePath(sourcePoint, point, index, sceneLinks.length, sourceWidth, sourceHeight)
            : (bundled
                ? studentDestinationBranchPath(point, layout.side, layout.railX, 100)
                : studentDestinationPath(sourcePoint, point, layout.side, sourceWidth / 2, 100, layout.sourceOffset));
          const edge = studentSvgElement('path', {
            d: pathData,
            class: `student-destination-edge ${flow.type}${sceneLink.transport ? ' transport' : ''}`,
            'data-flow': flow.type,
            'data-side': compact ? 'down' : (layout.side < 0 ? 'left' : 'right'),
            'aria-label': `${flow.label}${sceneLink.transport ? '，跨区室' : ''}：${entity.name}与${sceneLink.pathway.name}`
          });
          const marker = `url(#student-destination-arrow-${flow.type})`;
          if (flow.type === 'incoming' || flow.type === 'through') edge.setAttribute('marker-start', marker);
          if (flow.type === 'outgoing' || flow.type === 'through' || flow.type === 'neutral') edge.setAttribute('marker-end', marker);
          edge.appendChild(studentSvgElement('title', {}, `${flow.label}${sceneLink.transport ? ' · 跨区室' : ''}`));
          studentDestinationEdges.appendChild(edge);

          const tone = studentPathwayMeta(sceneLink.pathwayId).tone;
          const node = studentSvgElement('g', { class: 'student-destination-node', style: `--route-tone:${tone}` });
          node.dataset.entityId = sceneLink.entity.id;
          node.dataset.pathway = sceneLink.pathwayId;
          node.setAttribute('role', 'button');
          node.tabIndex = 0;
          const sceneContext = [flow.label, sceneLink.transport ? '跨区室' : '', sceneLink.pathway.group, sceneLink.entity.compartment || sceneLink.pathway.compartment].filter(Boolean).join(' · ');
          node.setAttribute('aria-label', `进入${sceneLink.pathway.name}场景，${sceneContext}，并定位${entity.name}`);
          node.appendChild(studentSvgElement('rect', { x: point.x - (compact ? 140 : 100), y: point.y - 30, width: compact ? 280 : 200, height: 60 }));
          node.appendChild(studentSvgElement('text', { x: point.x, y: point.y - 1, class: 'destination-name' }, studentMapLabel(sceneLink.pathway.name, 17)));
          node.appendChild(studentSvgElement('text', { x: point.x, y: point.y + 17, class: 'destination-meta' }, studentMapLabel(sceneContext || '区室待核对', compact ? 34 : 24)));
          const followSceneLink = () => {
            renderStudentPathway(sceneLink.pathwayId, {
              anchorEntity: sceneLink.entity,
              reactionId: sceneLink.reactionId
            });
            renderStudentSceneLinks(sceneLink.entity, sceneLink.pathwayId, { focus: 'map' });
          };
          node.addEventListener('click', event => { event.stopPropagation(); followSceneLink(); });
          node.addEventListener('keydown', event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); followSceneLink(); } });
          studentDestinationNodes.appendChild(node);
        });

        focusSceneTarget();
      }

      // #14 ── 学习模式 · 路线 ─────────────────────────────────────────
      function studentStepIndexForReaction(pathwayId, reaction) {
        if (!reaction || !atlas.pathways[pathwayId]) return -1;
        const steps = Array.isArray(atlas.pathways[pathwayId].steps) ? atlas.pathways[pathwayId].steps : [];
        const records = steps.map((step, index) => ({ step, ...resolveStudentStep(pathwayId, step, index) }));
        for (let index = 0; index < records.length - 1; index += 1) {
          const current = records[index], next = records[index + 1];
          const candidate = studentMapReactionFor(pathwayId, current.entity?.id, next.entity?.id, index)
            || current.reaction || next.reaction;
          if (candidate?.id === reaction.id) return index;
        }
        const fallbackIndex = records.findIndex(record => record.reaction?.id === reaction.id);
        return fallbackIndex;
      }

      function setStudentReadingStep(pathwayId, index = 0) {
        const pathway = atlas.pathways[pathwayId];
        const steps = Array.isArray(pathway?.steps) ? pathway.steps : [];
        if (!steps.length) return;
        activeStudentStepIndex = Math.max(0, Math.min(steps.length - 1, Number(index) || 0));
        const current = readableReactionEquation(steps[activeStudentStepIndex] || '当前节点');
        const next = activeStudentStepIndex < steps.length - 1
          ? readableReactionEquation(steps[activeStudentStepIndex + 1])
          : '主链末端';
        if (studentMapCurrent) studentMapCurrent.textContent = current;
        if (studentMapNext) studentMapNext.textContent = next;
        if (studentPathwayMap) studentPathwayMap.setAttribute('aria-label', `${pathway.name}：当前 ${current}，下一步 ${next}`);
        studentMapNodes?.querySelectorAll('.student-map-node[data-step-index]').forEach(node => {
          const stepIndex = Number(node.dataset.stepIndex);
          node.classList.toggle('is-current', stepIndex === activeStudentStepIndex);
          node.classList.toggle('is-next', stepIndex === activeStudentStepIndex + 1);
          if (stepIndex === activeStudentStepIndex) node.setAttribute('aria-current', 'step');
          else node.removeAttribute('aria-current');
        });
        studentMapEdges?.querySelectorAll('.student-map-edge[data-step-index]').forEach(edge => {
          edge.classList.toggle('is-next', Number(edge.dataset.stepIndex) === activeStudentStepIndex);
        });
        flowSteps?.querySelectorAll('.flow-step').forEach((button, stepIndex) => {
          button.classList.toggle('active', stepIndex === activeStudentStepIndex);
        });
      }

      function renderStudentNodeSelection(entity, reaction, pathwayId, reactionIndex = 0, stepIndex = -1) {
        if (stepIndex >= 0) setStudentReadingStep(pathwayId, stepIndex);
        else if (reaction) {
          const reactionStepIndex = studentStepIndexForReaction(pathwayId, reaction);
          if (reactionStepIndex >= 0) setStudentReadingStep(pathwayId, reactionStepIndex);
        }
        if (reaction) renderStudentReactionDetail(reaction, pathwayId, reactionIndex);
        if (entity) renderStudentSceneLinks(entity, pathwayId, { focus: 'panel' });
      }

      function renderStudentMap(pathwayId) {
        const mapVisual = studentPathwayMapVisuals[pathwayId] || null;
        if (studentPathwayMapVisual) studentPathwayMapVisual.hidden = !mapVisual;
        if (mapVisual && studentPathwayMapVisualImage) {
          studentPathwayMapVisualImage.src = mapVisual.source;
          studentPathwayMapVisualImage.alt = mapVisual.label;
          studentPathwayMapVisual?.setAttribute('aria-label', mapVisual.label);
          if (studentPathwayMapVisualCaption) studentPathwayMapVisualCaption.textContent = mapVisual.caption;
          const usesScientificOverlay = Boolean(mapVisual.overlay);
          if (studentPathwayMapScientificOverlay) studentPathwayMapScientificOverlay.toggleAttribute('hidden', !usesScientificOverlay);
          if (studentPathwayMapScientificOverlayLayer) {
            studentPathwayMapScientificOverlayLayer.replaceChildren();
            if (usesScientificOverlay) renderSceneExpertOverlay(pathwayId, studentPathwayMapScientificOverlayLayer);
          }
          if (usesScientificOverlay) {
            studentPathwayMapVisualImage.removeAttribute('data-visual-zoom');
            studentPathwayMapVisualImage.removeAttribute('tabindex');
            studentPathwayMapVisualImage.removeAttribute('role');
            studentPathwayMapVisualImage.removeAttribute('aria-label');
          } else {
            studentPathwayMapVisualImage.setAttribute('data-visual-zoom', '');
            studentPathwayMapVisualImage.tabIndex = 0;
            studentPathwayMapVisualImage.setAttribute('role', 'button');
            studentPathwayMapVisualImage.setAttribute('aria-label', '放大查看当前通路图');
          }
          studentPathwayMapVisualFrame?.classList.toggle('has-scientific-overlay', usesScientificOverlay);
        } else if (studentPathwayMapScientificOverlayLayer) {
          studentPathwayMapScientificOverlayLayer.replaceChildren();
          if (studentPathwayMapScientificOverlay) studentPathwayMapScientificOverlay.setAttribute('hidden', '');
        }
        if (!studentPathwayMap || !studentMapBands || !studentMapEdges || !studentMapNodes) return;
        const { pathway, tone } = studentPathwayMeta(pathwayId);
        const steps = Array.isArray(pathway.steps) ? pathway.steps : [];
        const pathwayReactions = studentReactionsFor(pathwayId);
        const twoRows = steps.length > 7;
        const mapHeight = twoRows ? 540 : 455;
        const nodeWidth = twoRows ? 136 : 128;
        const nodeHeight = 68;
        studentPathwayMap.setAttribute('viewBox', `0 0 1100 ${mapHeight}`);
        studentMapBands.innerHTML = ''; studentMapEdges.innerHTML = ''; studentMapNodes.innerHTML = '';
        studentMapCount.textContent = `${pathwayReactions.length} 个反应 · ${steps.length} 个主节点`;

        const mainBandY = twoRows ? 35 : 42;
        const mainBandHeight = twoRows ? 330 : 210;
        studentMapBands.appendChild(studentSvgElement('rect', { x: 25, y: mainBandY, width: 1050, height: mainBandHeight, class: 'student-map-band' }));
        const mainBandLabel = studentSvgElement('text', { x: 48, y: mainBandY + 25, class: 'student-map-band-label' }, '主链');
        studentMapBands.appendChild(mainBandLabel);

        const positions = steps.map((step, index) => {
          if (!twoRows) {
            const gap = steps.length > 1 ? 900 / (steps.length - 1) : 0;
            return { x: 100 + gap * index, y: 150 };
          }
          const columns = 5;
          const row = Math.floor(index / columns);
          const col = index % columns;
          return { x: row % 2 === 0 ? 120 + col * 215 : 980 - col * 215, y: row === 0 ? 132 : 294 };
        });
        const stepRecords = steps.map((step, index) => ({ step, ...resolveStudentStep(pathwayId, step, index), point: positions[index] }));
        const mainEntityIds = new Set(stepRecords.map(record => record.entity?.id).filter(Boolean));
        const mainNameKeys = new Set(stepRecords.flatMap(record => [record.step, record.entity?.name, record.entity?.label]).map(studentMapNameKey).filter(Boolean));

        for (let index = 0; index < stepRecords.length - 1; index += 1) {
          const current = stepRecords[index], next = stepRecords[index + 1];
          const reaction = studentMapReactionFor(pathwayId, current.entity?.id, next.entity?.id, index)
            || current.reaction || next.reaction;
          const edge = studentSvgElement('path', { d: studentMapEdgePath(current.point, next.point, nodeWidth, nodeHeight), class: `student-map-edge${reaction?.group === 'transport' ? ' transport' : ''}` });
          edge.dataset.reaction = reaction?.id || '';
          edge.dataset.stepIndex = String(index);
          if (reaction) {
            edge.addEventListener('click', event => { event.stopPropagation(); renderStudentReactionDetail(reaction, pathwayId, pathwayReactions.indexOf(reaction)); });
            edge.addEventListener('keydown', event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); renderStudentReactionDetail(reaction, pathwayId, pathwayReactions.indexOf(reaction)); } });
            edge.setAttribute('role', 'button'); edge.tabIndex = 0;
          }
          studentMapEdges.appendChild(edge);
          applyStudentReactionDirection(edge, reaction, {
            showLabel: true,
            labelOffsetY: Math.abs(current.point.y - next.point.y) < 5 ? -48 : -12
          });
        }

        if (/循环|cycle/i.test(pathway.name) && stepRecords.length > 2) {
          const first = stepRecords[0].point, last = stepRecords[stepRecords.length - 1].point;
          const loop = studentSvgElement('path', { d: studentMapLoopPath(first, last, nodeWidth, nodeHeight, twoRows, mainBandY, mainBandHeight), class: 'student-map-edge cycle' });
          const reaction = pathwayReactions[pathwayReactions.length - 1] || null;
          if (reaction) {
            loop.addEventListener('click', event => { event.stopPropagation(); renderStudentReactionDetail(reaction, pathwayId, pathwayReactions.indexOf(reaction)); });
            loop.setAttribute('role', 'button'); loop.tabIndex = 0;
          }
          studentMapEdges.appendChild(loop);
          applyStudentReactionDirection(loop, reaction, { showLabel: true });
        }

        const sceneAnchorEntity = activeStudentSceneAnchor ? studentEntityForScene(activeStudentSceneAnchor, pathwayId) : null;
        const anchorEntity = sceneAnchorEntity && activeStudentSceneAnchor?.participantKey
          ? {
              ...sceneAnchorEntity,
              participantKey: activeStudentSceneAnchor.participantKey,
              participantRole: activeStudentSceneAnchor.participantRole
            }
          : sceneAnchorEntity;
        const selectedReaction = activeStudentReactionId
          ? pathwayReactions.find(reaction => reaction.id === activeStudentReactionId)
          : null;
        const extraCandidateIds = [anchorEntity?.id, ...pathwayReactions.flatMap(reaction => [reaction.from, reaction.to])].filter(Boolean);
        const seenExtraIdentityKeys = new Set();
        const extraIds = [...new Set(extraCandidateIds)].filter(id => {
          const entity = entityById[id];
          if (!entity || mainEntityIds.has(id)) return false;
          const identityKey = studentEntityIdentityKey(entity) || studentMapNameKey(entity.name);
          if (id === anchorEntity?.id) {
            seenExtraIdentityKeys.add(identityKey);
            return true;
          }
          if (seenExtraIdentityKeys.has(identityKey)) return false;
          if ([entity.name, entity.label].map(studentMapNameKey).some(key => key && mainNameKeys.has(key))) return false;
          const sharedPathways = new Set(groupsFor(entity).filter(group => atlas.pathways[group]));
          const catalogEntry = participantCatalogByKey.get(identityKey);
          (catalogEntry?.pathwayIds || []).forEach(group => { if (atlas.pathways[group]) sharedPathways.add(group); });
          if (sharedPathways.size < 2) return false;
          seenExtraIdentityKeys.add(identityKey);
          return true;
        }).slice(0, 6);
        if (!extraIds.length) studentPathwayMap.setAttribute('viewBox', `0 0 1100 ${twoRows ? 385 : 275}`);
        if (extraIds.length) {
          const branchBandY = twoRows ? 384 : 286;
          studentMapBands.appendChild(studentSvgElement('rect', { x: 25, y: branchBandY, width: 1050, height: twoRows ? 130 : 138, class: 'student-map-band branch-band' }));
          studentMapBands.appendChild(studentSvgElement('text', { x: 48, y: branchBandY + 24, class: 'student-map-band-label' }, '跨通路连接 · 点击节点查看关联通路'));
          const branchNodeWidth = 130;
          extraIds.slice(0, 5).forEach((id, index) => {
            const point = { x: 145 + index * 200, y: twoRows ? 470 : 394 };
            const participantAnchor = id === anchorEntity?.id && anchorEntity?.participantKey;
            const sourceReaction = pathwayReactions.find(reaction => reaction.from === id || reaction.to === id)
              || (participantAnchor ? selectedReaction : null);
            const sourceId = sourceReaction?.from === id ? sourceReaction.to : sourceReaction?.from;
            const sourceIndex = stepRecords.findIndex(record => record.entity?.id === sourceId);
            const source = stepRecords[sourceIndex >= 0 ? sourceIndex : Math.min(index, stepRecords.length - 1)]?.point;
            if (source && sourceReaction) {
              const laneY = branchBandY + 55 + (index % 2) * 8;
              const branchPath = participantAnchor && anchorEntity.participantRole === 'substrate'
                ? studentMapBranchInputPath(point, source, laneY)
                : studentMapBranchPath({ x: source.x, y: source.y + nodeHeight / 2 + 3 }, point, laneY);
              const branchEdge = studentSvgElement('path', { d: branchPath, class: 'student-map-edge branch' });
              branchEdge.dataset.reaction = sourceReaction?.id || '';
              if (sourceReaction) {
                branchEdge.addEventListener('click', event => { event.stopPropagation(); renderStudentReactionDetail(sourceReaction, pathwayId, pathwayReactions.indexOf(sourceReaction)); });
                branchEdge.addEventListener('keydown', event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); renderStudentReactionDetail(sourceReaction, pathwayId, pathwayReactions.indexOf(sourceReaction)); } });
                branchEdge.setAttribute('role', 'button'); branchEdge.tabIndex = 0;
              }
              studentMapEdges.appendChild(branchEdge);
              applyStudentReactionDirection(branchEdge, sourceReaction);
            }
            const entity = entityById[id];
            const sceneEntity = participantAnchor ? anchorEntity : entity;
            const node = studentSvgElement('g', { class: 'student-map-node branch-node', style: `--tone:${tone}` });
            const fullBranchLabel = readableReactionEquation(sceneEntity.name || sceneEntity.label || '共享节点');
            node.dataset.entityId = id; node.setAttribute('role', 'button'); node.tabIndex = 0; node.setAttribute('aria-label', fullBranchLabel);
            node.appendChild(studentSvgElement('title', {}, fullBranchLabel));
            node.appendChild(studentSvgElement('rect', { x: point.x - branchNodeWidth / 2, y: point.y - 22, width: branchNodeWidth, height: 44 }));
            const branchLabel = studentSvgElement('text', { x: point.x, y: point.y + 5, class: 'node-name' }, studentMapLabel(sceneEntity.label || sceneEntity.name, 14));
            node.appendChild(branchLabel);
            appendStudentSceneBadge(node, point, branchNodeWidth, 44, sceneEntity, pathwayId);
            const selectBranchNode = () => {
              const reaction = pathwayReactions.find(item => item.from === id || item.to === id)
                || (participantAnchor ? selectedReaction : null);
              renderStudentNodeSelection(sceneEntity, reaction, pathwayId, pathwayReactions.indexOf(reaction));
            };
            node.addEventListener('click', event => { event.stopPropagation(); selectBranchNode(); });
            node.addEventListener('keydown', event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); selectBranchNode(); } });
            studentMapNodes.appendChild(node);
            fitStudentBranchLabel(branchLabel, branchNodeWidth - 14, point.x, point.y);
          });
        }

        stepRecords.forEach((record, index) => {
          const { step, entity, point } = record;
          const stepKindLabel = entity ? '代谢物节点' : (record.kind === 'enzyme' ? '酶 / 载体步骤' : '过程步骤');
          const fullNodeLabel = readableReactionEquation(entity?.name || step);
          const node = studentSvgElement('g', { class: 'student-map-node', style: `--tone:${tone}` });
          node.dataset.entityId = entity?.id || ''; node.dataset.stepIndex = index; node.dataset.stepKind = record.kind;
          node.setAttribute('role', 'button'); node.tabIndex = 0; node.setAttribute('aria-label', `${fullNodeLabel}，${stepKindLabel}`);
          node.appendChild(studentSvgElement('title', {}, fullNodeLabel));
          node.appendChild(studentSvgElement('rect', { x: point.x - nodeWidth / 2, y: point.y - nodeHeight / 2, width: nodeWidth, height: nodeHeight }));
          const nodeLabel = studentSvgElement('text', { x: point.x, y: point.y + 5, class: 'node-name' }, studentMapLabel(fullNodeLabel, 14));
          node.appendChild(nodeLabel);
          node.appendChild(studentSvgElement('text', { x: point.x, y: point.y + 23, class: 'node-compartment' }, entity?.compartment || stepKindLabel));
          appendStudentSceneBadge(node, point, nodeWidth, nodeHeight, entity, pathwayId);
          const nextRecord = stepRecords[index + 1];
          const previousRecord = stepRecords[index - 1];
          const forwardReaction = entity && nextRecord?.entity
            ? studentMapReactionFor(pathwayId, entity.id, nextRecord.entity.id, index)
            : null;
          const backwardReaction = entity && previousRecord?.entity
            ? studentMapReactionFor(pathwayId, previousRecord.entity.id, entity.id, index - 1)
            : null;
          const reaction = forwardReaction || record.reaction || backwardReaction
            || (entity ? pathwayReactions.find(item => item.from === entity.id || item.to === entity.id) : null);
          if (reaction) {
            node.dataset.reaction = reaction.id;
          }
          const selectMainNode = () => renderStudentNodeSelection(entity, reaction, pathwayId, pathwayReactions.indexOf(reaction), index);
          if (entity || reaction) {
            node.addEventListener('click', event => { event.stopPropagation(); selectMainNode(); });
            node.addEventListener('keydown', event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); selectMainNode(); } });
          }
          studentMapNodes.appendChild(node);
          fitStudentMapText(nodeLabel, nodeWidth - 18, 15.5, 10);
        });
      }

      const studentMetaboliteFacts = new Map(Object.entries({
        '葡萄糖': { tag: '六碳糖 · 主要碳源', text: '可进入糖酵解、糖原合成或磷酸戊糖途径，是多个专题的共同入口。' },
        '葡萄糖-6-磷酸': { tag: '带电糖磷酸 · 分叉点', text: '磷酸化后被限制在细胞内，可分流到糖酵解、糖原和磷酸戊糖途径。' },
        '果糖-6-磷酸': { tag: '糖酵解中间体', text: '在磷酸果糖激酶-1之后进入糖酵解的承诺段。' },
        '果糖-1,6-二磷酸': { tag: '承诺段中间体', text: '可裂解为两个三碳磷酸，是糖酵解碳流分配的重要节点。' },
        '磷酸烯醇式丙酮酸': { tag: '高能磷酸化合物', text: '具有较高的磷酸基转移潜势，可驱动丙酮酸激酶生成 ATP。' },
        '丙酮酸': { tag: '三碳枢纽', text: '连接乳酸、丙氨酸、乙酰辅酶 A 和草酰乙酸等多条去路。' },
        '乙酰辅酶 A': { tag: '二碳单元 · 酰基载体', text: '把碳流接入三羧酸循环，也可用于酮体、脂肪酸和胆固醇合成。' },
        '柠檬酸': { tag: 'TCA 中间体 · 脂质信号', text: '既是三羧酸循环中间体，也可把线粒体碳源状态传递到胞质脂质合成。' },
        'α-酮戊二酸': { tag: 'TCA 中间体 · 氮代谢枢纽', text: '接受或释放氨基，连接三羧酸循环与谷氨酸家族合成。' },
        '草酰乙酸': { tag: '循环受体 · 糖异生入口', text: '在三羧酸循环中接受乙酰基，也可经糖异生回到磷酸烯醇式丙酮酸。' },
        '谷氨酸': { tag: '氨基供体 · 氮代谢枢纽', text: '可把氨基转移给其他碳骨架，也可生成谷氨酰胺储存酰胺氮。' },
        '谷氨酰胺': { tag: '酰胺氮载体', text: '为核苷酸、氨基糖等合成提供可转移的酰胺氮。' },
        'ATP': { tag: '能量货币 · 磷酸供体', text: '通过磷酸酐键水解释放能量，驱动磷酸化、合成和主动转运。' },
        'ADP': { tag: '能量状态信号', text: 'ATP 消耗后的产物；ADP/ATP 比值可反映细胞能量压力。' },
        'AMP': { tag: '低能量信号', text: '能量电荷下降时上升，可激活 AMPK 等能量感受机制。' },
        'NADH': { tag: '还原当量 · 呼吸链输入', text: '携带高能电子进入呼吸链，最终支持质子梯度和 ATP 合成。' },
        'NAD⁺': { tag: '氧化型辅酶', text: '接受电子形成 NADH，常参与脱氢反应；NAD⁺/NADH 比值影响氧化还原方向。' },
        'NADPH': { tag: '还原当量 · 合成与抗氧化', text: '为脂质合成、氮同化和谷胱甘肽还原等过程提供还原力。' },
        'NADP⁺': { tag: '氧化型辅酶', text: '接受电子形成 NADPH，和 NADPH 共同构成合成代谢还原对。' },
        '核糖-5-磷酸': { tag: '戊糖 · 核苷酸前体', text: '可转为 PRPP，为嘌呤、嘧啶和部分补救合成提供核糖骨架。' },
        'PRPP': { tag: '活化核糖供体', text: '把核糖-5-磷酸转成可反应形式，参与嘌呤、嘧啶和补救合成。' },
        'NH₄⁺': { tag: '无机氮源', text: '可被谷氨酸脱氢酶或谷氨酰胺合成酶固定，也可能作为脱氨产物释放。' },
        '琥珀酸': { tag: 'TCA 中间体 · 电子入口', text: '氧化为延胡索酸时把电子交给辅酶 Q，连接三羧酸循环和复合体 II。' },
        '辅酶 Q': { tag: '膜内电子载体', text: '在内膜中接收复合体 I/II 的电子并传给复合体 III。' },
        '泛醇': { tag: '还原型辅酶 Q', text: '携带电子和质子在内膜中扩散，参与呼吸链 Q 循环。' },
        '质子动力势': { tag: '电化学能', text: '由膜两侧质子浓度差和膜电势共同组成，驱动 ATP 合酶。' }
      }).map(([name, fact]) => [studentMapNameKey(name), fact]));

      // #15 ── 学习模式 · 节点 ─────────────────────────────────────────
      function studentMetaboliteFactFor(name) {
        const key = studentMapNameKey(name);
        if (studentMetaboliteFacts.has(key)) return studentMetaboliteFacts.get(key);
        if (/^(gdp|gtp|utp|ctp|dudp|dtmp|ump|imp|gmp|amp|adp|atp)$/.test(key)) {
          return { tag: '核苷酸池成员', text: '通过磷酸化、脱磷酸化或核糖修饰在核苷酸池中转换。' };
        }
        if (/氧|o2/.test(key)) return { tag: '末端电子受体', text: '在有氧呼吸末端接受电子并与质子形成水。' };
        if (/水|h2o/.test(key)) return { tag: '水解 / 水合参与物', text: '在当前反应中作为水解或水合反应物/产物出现。' };
        if (/辅酶a|coa/.test(key)) return { tag: '酰基载体', text: '以硫酯形式携带酰基，在碳流转移中发挥作用。' };
        if (/磷酸|phosphate|p/.test(key)) return { tag: '磷酸化中间体', text: '带有磷酸基，通常参与能量耦联、碳流分配或核糖活化。' };
        return { tag: '通路中间体', text: '当前图谱把它作为该反应的结构化底物或产物；更多性质待补充。' };
      }

      const studentRegulationFacts = [
        { match: '己糖激酶', tag: '产物反馈抑制', title: '入口受产物控制', text: '葡萄糖-6-磷酸可对己糖激酶产生产物抑制；肝脏葡萄糖激酶的调节方式不同。', source: '通用教学提示 · 同工酶与组织背景会改变强度' },
        { match: '磷酸果糖激酶-1', tag: '反馈抑制 · 变构调节', title: '糖酵解承诺步骤', text: 'ATP、柠檬酸倾向于抑制，AMP/ADP和果糖-2,6-二磷酸可促进活性。', source: 'UniProtKB · 人 PFKP', url: 'https://www.uniprot.org/uniprotkb/Q01813/entry' },
        { match: '丙酮酸激酶', tag: '反馈抑制 · 前馈激活', title: '末端控制步骤', text: 'ATP和丙氨酸可抑制；果糖-1,6-二磷酸可产生前馈激活，使上游碳流与末端供能相协调。', source: '通用教学提示 · 同工酶与组织背景会改变调节' },
        { match: '果糖-1,6-二磷酸酶-1', tag: '反馈抑制 · 变构调节', title: '糖异生特异步骤', text: 'AMP和果糖-2,6-二磷酸抑制该酶，避免糖酵解和糖异生在同一细胞内形成无效循环。', source: '通用教学提示 · 以哺乳动物调节为例' },
        { match: '丙酮酸脱氢酶复合体', tag: '反馈抑制 · 共价调节', title: '入口闸门的双层控制', text: 'ATP、NADH和乙酰辅酶 A 抑制通量；PDK 磷酸化使复合体失活，PDP 去磷酸化使其恢复活性。', source: 'UniProtKB · 人 PDHA1', url: 'https://www.uniprot.org/uniprotkb/P08559/entry' },
        { match: 'HMG-CoA 还原酶', tag: '反馈抑制 · 共价调节', title: '胆固醇合成控制点', text: '甾醇和甲羟戊酸来源的非甾醇代谢物参与负反馈；Ser-872 磷酸化会降低催化活性。', source: 'UniProtKB · 人 HMGCR', url: 'https://www.uniprot.org/uniprotkb/P04035/entry' },
        { match: '乙酰-CoA 羧化酶', tag: '变构调节 · 共价调节', title: '脂肪酸合成入口', text: '柠檬酸促进活性聚合体形成，棕榈酰-CoA与磷酸化抑制 ACC 活性。', source: 'UniProtKB · 人 ACACA', url: 'https://www.uniprot.org/uniprotkb/Q13085/entry' },
        { match: '糖原合酶', tag: '变构调节 · 共价调节', title: '葡萄糖-6-磷酸促进合成', text: '葡萄糖-6-磷酸可变构激活；磷酸化使酶偏向低活性构象，去磷酸化更有利于糖原合成。', source: 'UniProtKB · 人 GYS1', url: 'https://www.uniprot.org/uniprotkb/P13807/entry' },
        { match: '糖原磷酸化酶', tag: '变构调节 · 共价调节', title: '能量状态控制糖原分解', text: '肌型酶受 AMP 激活，受 ATP、ADP和葡萄糖-6-磷酸抑制；磷酸化也参与活性控制。', source: 'UniProtKB · 人 PYGM', url: 'https://www.uniprot.org/uniprotkb/P11217/entry' },
        { match: '葡萄糖-6-磷酸脱氢酶', tag: '产物反馈抑制', title: '磷酸戊糖氧化入口', text: 'NADPH/NADP⁺比值会影响该步通量；NADPH充足时通常抑制，氧化压力升高时通量需求增加。', source: '通用教学提示 · 具体响应受细胞氧化还原状态影响' },
        { match: '谷氨酸脱氢酶', tag: '变构调节', title: '氮代谢与能量状态耦联', text: 'ADP激活，GTP和ATP抑制；实际净方向仍取决于底物、产物和线粒体氧化还原状态。', source: 'UniProtKB · 人 GLUD1', url: 'https://www.uniprot.org/uniprotkb/P00367/entry' },
        { match: '异柠檬酸脱氢酶', tag: '变构调节', title: 'TCA 对能量状态作出响应', text: '线粒体 IDH3 可被 ADP和柠檬酸协同激活；高浓度 ATP 抑制复合体活性。', source: 'UniProtKB · 人 IDH3A', url: 'https://www.uniprot.org/uniprotkb/P50213/entry' },
        { match: 'α-酮戊二酸脱氢酶', tag: '变构调节', title: '高能量与还原状态抑制', text: 'Ca²⁺和ADP促进活性，ATP和NADH降低催化活性，使 TCA 通量响应能量需求。', source: 'UniProtKB · 人 OGDH', url: 'https://www.uniprot.org/uniprotkb/Q02218/entry' },
        { match: '肉碱棕榈酰转移酶 1', tag: '变构抑制', title: '脂肪酸合成关闭氧化入口', text: '丙二酰-CoA抑制 CPT1，避免脂肪酸合成活跃时长链脂酰基同时进入线粒体氧化。', source: 'UniProtKB · 人 CPT1A', url: 'https://www.uniprot.org/uniprotkb/P50416/entry' },
        { match: '脂蛋白脂肪酶', tag: '蛋白因子调节', title: '载脂蛋白决定脂解效率', text: 'APOC2 是 LPL 的共激活因子；GPIHBP1 可稳定 LPL 并保护其免受 ANGPTL4 介导的失活。', source: 'UniProtKB · 人 LPL', url: 'https://www.uniprot.org/uniprotkb/P06858/entry' },
        { match: '氨甲酰磷酸合成酶 II', tag: '反馈抑制 · 磷酸化调节', title: '嘧啶合成感受核苷酸池', text: 'PRPP激活 CAD 的 CPS II 反应，UMP和UTP反馈抑制；磷酸化也参与活性控制。', source: 'UniProtKB · 人 CAD', url: 'https://www.uniprot.org/uniprotkb/P27708/entry' },
        { match: '氨甲酰磷酸合成酶 I', tag: '必需变构激活', title: '尿素循环入口依赖 NAG', text: 'N-乙酰谷氨酸是 CPS I 的必需变构激活剂；缺少 NAG 时该入口难以有效运行。', source: 'UniProtKB · 人 CPS1', url: 'https://www.uniprot.org/uniprotkb/P31327/entry' },
        { match: '胱硫醚β-合成酶', tag: '变构激活 · 氧化还原调节', title: 'SAM 促进转硫通路', text: 'S-腺苷蛋氨酸可变构激活 CBS；其血红素辅基还可能参与氧化还原敏感性调节。', source: 'UniProtKB · 人 CBS', url: 'https://www.uniprot.org/uniprotkb/P35520/entry' },
        { match: '谷氨酸半胱氨酸连接酶', tag: '产物反馈抑制', title: '谷胱甘肽限制自身合成', text: '谷胱甘肽对该限速酶产生反馈抑制，使合成通量随细胞抗氧化需求调整。', source: 'UniProtKB · 人 GCLC', url: 'https://www.uniprot.org/uniprotkb/P48506/entry' },
        { match: '苯丙氨酸羟化酶', tag: '底物变构调节', title: '苯丙氨酸解除抑制构象', text: 'N端调节区含苯丙氨酸变构结合位点，并作为抑制性结构域控制催化区活性。', source: 'UniProtKB · 人 PAH', url: 'https://www.uniprot.org/uniprotkb/P00439/entry' },
        { match: '支链α-酮酸脱氢酶', tag: '共价调节', title: '磷酸化关闭 BCKDH', text: 'BCKDK 磷酸化 BCKDH E1α 的 Ser-337，PPM1K 去磷酸化；两者共同控制支链氨基酸氧化入口。', source: 'UniProtKB · 人 BCKDHA', url: 'https://www.uniprot.org/uniprotkb/P12694/entry' },
        { match: '天冬氨酸转氨甲酰酶', tag: '反馈抑制 · 变构调节', title: '嘧啶合成的反馈入口', text: '经典模型中 CTP 反馈抑制、ATP相对促进；真核 CAD 复合体的调节更复杂。', source: '通用教学提示 · 经典模型与真核细胞需区分' },
        { match: '核糖核苷酸还原酶', tag: '反馈调节 · 变构调节', title: '脱氧核苷酸平衡控制', text: '通过活性位点和特异性位点感受核苷酸池，维持不同 dNTP 的相对平衡。', source: '通用教学提示 · 具体机制依酶系统而定' },
        { match: '磷酸葡萄糖异构酶', tag: '可逆步骤 · 共价调节', title: '通常随 G6P/F6P 比例变化', text: '该酶双向催化 G6P 与 F6P；UniProt 还记录 CK2 对 Ser-185 的磷酸化可降低酶活性，但这不是糖酵解经典限速控制点。', source: 'UniProtKB/Rhea · 人 GPI', url: 'https://www.uniprot.org/uniprotkb/P06744/entry' },
        { match: '醛缩酶 B', tag: '可逆步骤 · 底物供给', title: '裂解或缩合取决于代谢背景', text: '醛缩酶 B 可双向处理糖磷酸；在果糖代谢中，底物供给和下游丙糖磷酸去路比经典变构反馈更直接。', source: 'UniProtKB · 人 ALDOB', url: 'https://www.uniprot.org/uniprotkb/P05062/entry' },
        { match: '醛缩酶', tag: '可逆步骤 · 底物供给', title: '裂解方向由底物与产物比例推动', text: '醛缩酶 A 双向催化 F-1,6-BP 与两个丙糖磷酸之间的转换；葡萄糖缺乏时，FBP下降还可参与溶酶体-AMPK能量感知。', source: 'UniProtKB/Rhea · 人 ALDOA', url: 'https://www.uniprot.org/uniprotkb/P04075/entry' },
        { match: '磷酸丙糖异构酶', tag: '可逆步骤 · 质量作用', title: 'DHAP/G3P 比例决定净方向', text: '该酶高效双向转换 DHAP 与 G3P，本身通常不是经典限速点；下游持续消耗 G3P 会牵引糖酵解方向。', source: 'UniProtKB/Rhea · 人 TPI1', url: 'https://www.uniprot.org/uniprotkb/P60174/entry' },
        { match: '甘油醛-3-磷酸脱氢酶', tag: '氧化还原 · 底物供给', title: 'NAD⁺/NADH 与无机磷酸共同影响通量', text: '该反应可逆并直接连接胞质氧化还原状态；UniProt 记录 Cys-152 氧化或琥珀酰化等修饰可抑制 GAPDH 活性。', source: 'UniProtKB/Rhea · 人 GAPDH', url: 'https://www.uniprot.org/uniprotkb/P04406/entry' },
        { match: '磷酸甘油酸激酶', tag: '能量耦联 · 质量作用', title: '由 ADP/ATP 和两侧底物共同推动', text: 'PGK1 是 Mg²⁺依赖的可逆底物水平磷酸化步骤；净方向取决于 1,3-BPG/3-PG 与 ADP/ATP 比例，不应误写成经典专一反馈控制点。', source: 'UniProtKB/Rhea · 人 PGK1', url: 'https://www.uniprot.org/uniprotkb/P00558/entry' },
        { match: '磷酸甘油酸变位酶', tag: '辅因子依赖 · 共价调节', title: '2,3-BPG帮助建立活性中间体', text: 'PGAM1 利用 2,3-BPG 完成 3-PG 与 2-PG 的可逆转换；高糖条件下 Lys-253/254 乙酰化可提高催化活性。', source: 'UniProtKB/Rhea · 人 PGAM1', url: 'https://www.uniprot.org/uniprotkb/P18669/entry' },
        { match: '烯醇化酶', tag: 'Mg²⁺依赖 · 可逆步骤', title: '金属辅因子和底物比例影响活性', text: 'α-烯醇化酶每个亚基结合两个 Mg²⁺，用于催化并稳定二聚体；该步双向连接 2-PG 与 PEP。', source: 'UniProtKB/Rhea · 人 ENO1', url: 'https://www.uniprot.org/uniprotkb/P06733/entry' },
        { match: '柠檬酸合酶', tag: '底物供给 · 共价调节', title: '乙酰-CoA 与草酰乙酸供应决定入口', text: '柠檬酸合酶把乙酰-CoA和草酰乙酸汇入 TCA；UniProt 记录 CSKMT 对 Lys-395 三甲基化会降低人线粒体酶活性。', source: 'UniProtKB/Rhea · 人 CS', url: 'https://www.uniprot.org/uniprotkb/O75390/entry' },
        { match: '顺乌头酸酶', tag: 'Fe–S 簇状态', title: '铁硫簇完整性决定催化能力', text: '线粒体顺乌头酸酶依赖 [4Fe–4S] 簇；转为 [3Fe–4S] 状态会失活，因此铁稳态和氧化应激可影响该步。', source: 'UniProtKB · 人 ACO2', url: 'https://www.uniprot.org/uniprotkb/Q99798/entry' },
        { match: '延胡索酸酶', tag: '可逆步骤 · 质量作用', title: '延胡索酸与苹果酸比例推动净方向', text: '线粒体延胡索酸酶双向催化延胡索酸和苹果酸的水合/脱水；TCA 中的净方向主要由相邻步骤持续供给和消耗维持。', source: 'UniProtKB/Rhea · 人 FH', url: 'https://www.uniprot.org/uniprotkb/P07954/entry' },
        { match: '线粒体苹果酸脱氢酶', tag: '氧化还原 · 共价调节', title: 'NAD⁺/NADH 比例连接 TCA 与呼吸链', text: 'MDH2 可逆转换苹果酸与草酰乙酸，并维持线粒体 NAD⁺/NADH 平衡；棕榈酰化可提高活性，SIRT3 去乙酰化可降低活性。', source: 'UniProtKB/Rhea · 人 MDH2', url: 'https://www.uniprot.org/uniprotkb/P40926/entry' },
        { match: '胞质苹果酸脱氢酶', tag: '氧化还原 · 共价调节', title: '胞质 NADH 状态控制穿梭入口', text: 'MDH1 双向催化苹果酸/草酰乙酸并参与苹果酸-天冬氨酸穿梭；Lys-118 乙酰化可增强酶活性。', source: 'UniProtKB/Rhea · 人 MDH1', url: 'https://www.uniprot.org/uniprotkb/P40925/entry' },
        { match: '乳酸脱氢酶', tag: '氧化还原 · 质量作用', title: '乳酸/丙酮酸和 NADH/NAD⁺共同决定方向', text: 'LDH 同步转换丙酮酸/乳酸和 NADH/NAD⁺；在缺氧或高糖酵解通量时，NAD⁺再生需求会推动乳酸生成。', source: 'UniProtKB/Rhea · 人 LDHA', url: 'https://www.uniprot.org/uniprotkb/P00338/entry' },
        { match: 'ATP 合酶', tag: '质子动力势 · 底物供给', title: '跨膜电化学势决定 ATP 合成通量', text: 'ATP 合成需要质子动力势、ADP和无机磷酸同时充足；呼吸链供质子梯度，ANT与磷酸载体负责补充底物。', source: '依据当前氧化磷酸化结构与反应式' }
      ];

      function studentRegulationFor(reaction) {
        const enzyme = String(reaction?.enzyme || '');
        const match = studentRegulationFacts.find(item => enzyme.includes(item.match));
        if (match) return match;
        if (/限速步/.test(reaction?.info || '')) {
          return { tag: '通路控制点', title: '备注标记为限速步', text: '当前数据确认这是通量控制步骤，但没有在 TSV 中展开具体的反馈抑制或共价调节因子。', source: '来自当前反应备注 · 调节细节待审校' };
        }
        if (/转运|通道|系统|复合体|泵|梯度|融合/.test(enzyme)) {
          return { tag: '系统级控制', title: '不是单一催化酶', text: '该记录表示转运、复合体或细胞事件；其通量主要受区室、底物供给、复合体状态或膜梯度控制。', source: '来自当前反应类型 · 不强行套用单酶反馈模型' };
        }
        const equation = String(reaction?.equation || '');
        const coupledFactors = [];
        if (/NADP?H|NADP?⁺/i.test(equation)) coupledFactors.push('氧化还原比');
        if (/ATP|ADP|AMP|GTP|GDP/i.test(equation)) coupledFactors.push('能量状态');
        if (/CoA|辅酶\s*A/i.test(equation)) coupledFactors.push('酰基辅酶供应');
        const factorText = coupledFactors.length ? `，并受${coupledFactors.join('、')}影响` : '';
        if (reaction?.reversible) {
          return { tag: '质量作用 · 可逆步骤', title: '净方向随底物和产物比例变化', text: `当前结构化数据把该步标为可逆；在未确认经典专一调节因子时，应优先依据底物供给、产物移除和相邻步骤通量理解${factorText}。`, source: '依据当前反应式与可逆性 · 未把未证实机制写成事实' };
        }
        return { tag: '底物供给 · 通路背景', title: '先看供料与下游消耗', text: `当前资料未把该酶确认为经典专一调控点；该步通量首先取决于底物供给、产物移除和所在区室${factorText}。`, source: '依据当前反应式与区室 · 专一调节仍待逐酶审校' };
      }

      const studentCompositeReactionFacts = [{
        match: reaction => reaction?.enzyme === 'PHGDH/PSAT1/PSPH',
        title: '丝氨酸从 3-磷酸甘油酸生成的三步路线',
        subtitle: '总反应由三个独立酶促步骤合并表示',
        steps: [
          { enzyme: 'PHGDH', enzymeName: '磷酸甘油酸脱氢酶', direction: '⇌', equation: '3-磷酸甘油酸 + NAD⁺ ⇌ 3-磷酸羟基丙酮酸 + NADH + H⁺' },
          { enzyme: 'PSAT1', enzymeName: '磷酸丝氨酸转氨酶', direction: '⇌', equation: '3-磷酸羟基丙酮酸 + 谷氨酸 ⇌ 3-磷酸丝氨酸 + α-酮戊二酸' },
          { enzyme: 'PSPH', enzymeName: '磷酸丝氨酸磷酸酶', direction: '→', equation: '3-磷酸丝氨酸 + H₂O → 丝氨酸 + Pi' }
        ],
        note: '顶部总箭头只表示三步合并后的净方向。前两步可双向进行，末步为磷酸酯水解；不能把“净方向”理解成三步全部不可逆。'
      }];

      function studentCompositeReactionFor(reaction) {
        return studentCompositeReactionFacts.find(item => item.match(reaction)) || null;
      }

      function isStudentCompositeReaction(reaction) {
        if (studentCompositeReactionFor(reaction)) return true;
        return /(?:[两三四五六七八九十\d]+步[^；;]*净反应|多步[^；;]*(?:压缩|合并|净出口)|多轮[^；;]*净反应|两次[^；;]*净反应|合并[^；;]*(?:两步|多步)|三次氧化[^；;]*净反应)/.test(reaction?.info || '');
      }

      function studentReactionDescription(info) {
        const raw = String(info || '').trim();
        if (!raw) return '该步骤的详细生理意义待补充。';
        const evidencePattern = /(?:KEGG\s*:|RHEA\s*:|Reactome\s+R-|UniProt\s*:|^R-HSA-)/i;
        const clean = raw.split(/[；;]/).map(part => part.trim()).filter(part => part && !evidencePattern.test(part)).join('；');
        return clean || '该步骤的数据库依据见下方折叠区域。';
      }

      function studentReactionEvidence(info) {
        const raw = String(info || '');
        const evidence = [];
        const appendMatches = (pattern, database, makeUrl) => {
          for (const match of raw.matchAll(pattern)) evidence.push({ database, id: match[1], url: makeUrl(match[1]) });
        };
        appendMatches(/KEGG\s*:\s*(R\d+)/gi, 'KEGG', id => `https://www.kegg.jp/entry/${id}`);
        appendMatches(/RHEA\s*:\s*(\d+)/gi, 'Rhea', id => `https://www.rhea-db.org/rhea/${id}`);
        appendMatches(/(?:Reactome\s+)?(R-HSA-\d+)/gi, 'Reactome', id => `https://reactome.org/content/detail/${id}`);
        appendMatches(/UniProt\s*:\s*([A-Z0-9]+)/gi, 'UniProt', id => `https://www.uniprot.org/uniprotkb/${id}/entry`);
        return [...new Map(evidence.map(item => [`${item.database}:${item.id}`, item])).values()];
      }

      function studentCompositePanel(composite) {
        if (!composite) return '';
        const steps = composite.steps.map((step, index) => `<li class="student-composite-step"><span class="step-number">步骤 ${index + 1}</span><strong>${reactionEquationHtml(step.equation)}</strong><p><span class="step-direction">${escapeStudentText(step.direction)}</span> ${escapeStudentText(step.direction === '⇌' ? '该步可双向进行' : '该步按水解方向表示')}</p><span class="step-enzyme">${escapeStudentText(step.enzyme)} · ${escapeStudentText(step.enzymeName)}</span></li>`).join('');
        return `<section class="student-composite-pathway" aria-label="${escapeStudentText(composite.title)}"><div class="student-composite-head"><strong>${escapeStudentText(composite.title)}</strong><span>${escapeStudentText(composite.subtitle)}</span></div><ol class="student-composite-flow">${steps}</ol><p class="student-composite-note">${escapeStudentText(composite.note)}</p></section>`;
      }

      function studentEvidencePanel(evidence) {
        if (!evidence.length) return '';
        const links = evidence.map(item => `<a href="${escapeStudentText(item.url)}" target="_blank" rel="noopener noreferrer">${escapeStudentText(item.database)} ${escapeStudentText(item.id)}</a>`).join('');
        return `<details class="student-evidence"><summary>查看依据（${evidence.length} 条）</summary><div class="student-evidence-list">${links}</div></details>`;
      }

      function setStudentReactionIndex(open) {
        if (!studentReactionIndex || !studentReactionToggle) return;
        const expanded = Boolean(open);
        studentReactionIndex.hidden = !expanded;
        studentReactionToggle.setAttribute('aria-expanded', String(expanded));
      }

      function renderStudentReactionDetail(reaction, pathwayId, index = 0) {
        if (!reaction) return;
        const pathwayReactions = studentReactionsFor(pathwayId);
        const indexedReaction = index >= 0 ? pathwayReactions[index] : null;
        const resolvedIndex = indexedReaction?.id === reaction.id
          ? index
          : pathwayReactions.findIndex(candidate => candidate.id === reaction.id);
        const detailIndex = Math.max(0, resolvedIndex);
        const reactionTotal = Math.max(1, pathwayReactions.length);
        const pathwayProfile = studentPathwayMeta(pathwayId);
        const reactionStepIndex = studentStepIndexForReaction(pathwayId, reaction);
        if (reactionStepIndex >= 0) setStudentReadingStep(pathwayId, reactionStepIndex);
        const substrate = entityById[reaction.from];
        const product = entityById[reaction.to];
        const crossCompartment = Boolean(
          substrate?.compartment
          && product?.compartment
          && substrate.compartment !== product.compartment
        );
        const endpointLabel = (entity, fallback) => {
          const name = entity?.name || fallback;
          return crossCompartment ? `${name}（${entity?.compartment || '区室待核对'}）` : name;
        };
        const substrateLabel = endpointLabel(substrate, reaction.from);
        const productLabel = endpointLabel(product, reaction.to);
        const participants = Array.isArray(reaction.participants) ? reaction.participants : [];
        const participantGroup = (role, label) => {
          const roleParticipants = participants.filter(participant => participant.role === role);
          if (!roleParticipants.length) return '';
          const buttons = roleParticipants.map(participant => {
            const participantIndex = participants.indexOf(participant);
            const entry = participantCatalogByKey.get(participant.key);
            const otherSceneCount = (entry?.pathwayIds || []).filter(id => id !== pathwayId && atlas.pathways[id]).length;
            const coefficient = participant.coefficient && participant.coefficient !== '1' ? `${participant.coefficient} ` : '';
            const context = participant.qualifier || (participant.compartment !== atlas.pathways[pathwayId]?.compartment ? participant.compartment : '');
            const sourceText = participant.source === 'endpoint' ? 'TSV 主端点' : '由反应式推导';
            const destinationText = otherSceneCount ? `${otherSceneCount} 个其他场景` : '仅本场景';
            return `<button type="button" class="student-participant ${participant.source === 'endpoint' ? 'endpoint' : 'inferred'}" data-participant-index="${participantIndex}" style="--tone:${pathwayProfile.tone}" title="${escapeStudentText(sourceText)}；点击查看代谢场景"><strong>${escapeStudentText(coefficient + participant.name)}</strong>${context ? `<small>${escapeStudentText(context)}</small>` : ''}<small class="student-participant-scene">${escapeStudentText(destinationText)}</small></button>`;
          }).join('');
          return `<div class="student-participant-group"><span class="student-participant-role">${label}</span><div class="student-participant-list">${buttons}</div></div>`;
        };
        const participantPanel = participants.length
          ? `<details class="student-detail-more"><summary>可选：查看这些物质还会去哪里</summary><div class="student-participants">${participantGroup('substrate', '底物')}${participantGroup('product', '产物')}</div></details>`
          : '';
        const composite = studentCompositeReactionFor(reaction);
        const isComposite = isStudentCompositeReaction(reaction);
        const evidence = studentReactionEvidence(reaction.info);
        const description = readableReactionEquation(studentReactionDescription(reaction.info));
        const compositePanel = studentCompositePanel(composite);
        const evidencePanel = studentEvidencePanel(evidence);
        const compartment = crossCompartment
          ? `${substrate.compartment} ${reaction.reversible ? '⇌' : '→'} ${product.compartment}`
          : (reaction.compartment || pathwayProfile.pathway.compartment || '区室待核对');
        const progress = Math.max(4, Math.round(((detailIndex + 1) / reactionTotal) * 100));
        activeStudentReactionId = reaction.id;
        studentDetail.style.setProperty('--tone', pathwayProfile.tone);
        studentDetail.classList.remove('empty');
        const directionStatus = isComposite
          ? `${reaction.reversible ? '⇌' : '→'} 合并后的净方向`
          : crossCompartment
          ? (reaction.reversible ? '⇌ 可逆转运' : '→ 单向转运')
          : (reaction.reversible ? '⇌ 可逆反应' : '→ 不可逆反应');
        const enzymeLabel = composite ? composite.steps.map(step => step.enzyme).join(' → ') : (reaction.enzyme || '—');
        const enzymeFacts = studentEnzymeFactsFor(reaction);
        studentDetail.innerHTML = `<div class="student-detail-header"><div class="student-detail-heading"><div class="student-detail-kicker"><span>反应学习</span><b>${escapeStudentText(pathwayProfile.pathway.name)}</b></div><h3 tabindex="-1">${escapeStudentText(substrateLabel)} ${reaction.reversible ? '⇌' : '→'} ${escapeStudentText(productLabel)}</h3><p class="student-detail-description">${escapeStudentText(description)}</p><div class="student-detail-statuses" aria-label="反应状态"><span class="direction${isComposite ? ' net' : ''}">${escapeStudentText(directionStatus)}</span><span class="${crossCompartment ? 'transport' : ''}">${escapeStudentText(compartment)}</span></div></div><nav class="student-detail-nav" aria-label="通路内反应导航"><button type="button" data-student-detail-nav="-1" aria-label="查看上一反应" title="上一反应" ${detailIndex <= 0 ? 'disabled' : ''}><span aria-hidden="true">←</span></button><div class="student-detail-count"><strong>${detailIndex + 1} / ${reactionTotal}</strong><span>通路内反应</span></div><button type="button" data-student-detail-nav="1" aria-label="查看下一反应" title="下一反应" ${detailIndex >= reactionTotal - 1 ? 'disabled' : ''}><span aria-hidden="true">→</span></button></nav></div><div class="student-detail-progress" role="progressbar" aria-label="通路内反应进度" aria-valuemin="1" aria-valuemax="${reactionTotal}" aria-valuenow="${detailIndex + 1}"><i style="--progress:${progress}%"></i></div><section class="student-reaction-core" aria-label="核心反应信息"><div class="student-detail-basic equation-summary"><span>${isComposite ? '总反应式' : '反应式'}</span><strong>${reactionEquationHtml(reaction.equation || '—')}</strong></div><div class="student-detail-basic enzyme-summary"><span>${composite ? '依次催化' : '催化酶'}</span><strong>${escapeStudentText(enzymeLabel)}</strong><div class="student-enzyme-facts"><p><span>结构</span><b>${escapeStudentText(enzymeFacts.structure)}</b></p><p><span>辅酶 / 辅因子</span><b>${escapeStudentText(enzymeFacts.factors)}</b></p></div></div></section>${compositePanel}${evidencePanel}${participantPanel}`;
        studentDetail.querySelectorAll('[data-student-detail-nav]').forEach(button => {
          button.addEventListener('click', () => {
            const directionStep = Number(button.dataset.studentDetailNav);
            const targetIndex = detailIndex + directionStep;
            const targetReaction = pathwayReactions[targetIndex];
            if (!targetReaction) return;
            renderStudentReactionDetail(targetReaction, pathwayId, targetIndex);
            requestAnimationFrame(() => {
              const sameDirection = studentDetail.querySelector(`[data-student-detail-nav="${directionStep}"]:not(:disabled)`);
              const fallbackDirection = studentDetail.querySelector(`[data-student-detail-nav="${directionStep * -1}"]:not(:disabled)`);
              (sameDirection || fallbackDirection)?.focus({ preventScroll: true });
            });
          });
        });
        studentDetail.querySelectorAll('.student-participant').forEach(button => {
          const participant = participants[Number(button.dataset.participantIndex)];
          button.addEventListener('click', () => {
            const subject = studentParticipantSubject(participant, pathwayId);
            renderStudentSceneLinks(subject, pathwayId, { focus: 'panel' });
          });
        });
        studentReactions.querySelectorAll('.student-reaction').forEach(button => button.classList.toggle('active', button.dataset.reaction === reaction.id));
        flowSteps.querySelectorAll('.flow-step').forEach((button, stepIndex) => button.classList.toggle('active', stepIndex === activeStudentStepIndex));
        studentMapEdges.querySelectorAll('.student-map-edge').forEach(edge => edge.classList.toggle('active', edge.dataset.reaction === reaction.id));
        studentMapNodes.querySelectorAll('.student-map-node').forEach(node => node.classList.toggle('active', node.dataset.entityId === reaction.from || node.dataset.entityId === reaction.to));
      }

      // #16 ── 学习模式 · 分支 ─────────────────────────────────────────
      function buildStudentCatalog() {
        buildStudentTopics();
        studentPathwaySelect.innerHTML = '';
        const pathwayIds = coreStudyPathwayIds.filter(id => atlas.pathways[id]?.name);
        const selectGroups = new Map();
        pathwayIds.forEach(pathwayId => {
          const { pathway } = studentPathwayMeta(pathwayId);
          const groupName = pathway.group || '其他代谢';
          if (!selectGroups.has(groupName)) {
            const optionGroup = document.createElement('optgroup');
            optionGroup.label = groupName;
            selectGroups.set(groupName, optionGroup);
            studentPathwaySelect.appendChild(optionGroup);
          }
          const option = document.createElement('option');
          option.value = pathwayId;
          option.textContent = pathway.name;
          selectGroups.get(groupName).appendChild(option);
        });
        renderStudentLessonCatalog(null);
        studentPathwaySelect.addEventListener('change', () => renderStudentPathway(studentPathwaySelect.value));
      }

      function renderStudentPathway(pathwayId, options = {}) {
        const { pathway, routeGroup, tone } = studentPathwayMeta(pathwayId);
        if (!pathway || !pathway.name) return;
        const topicId = studentTopicIdForPathway(pathwayId);
        setStudentTopicCanvasMaximized(false);
        activeStudentTopicRouteFocus = null;
        hideStudentTopicNodeContext(false);
        hideStudentTopicRouteContext(false);
        if (studentTopicMinimap) studentTopicMinimap.hidden = true;
        activeStudentTopic = topicId;
        activeStudentPathway = pathwayId;
        activeStudentReactionId = options.reactionId || null;
        activeStudentSceneAnchor = options.anchorEntity || null;
        activeStudentStepIndex = 0;
        resetStudentDestinations();
        setStudentReactionIndex(false);
        studentCourseHome.hidden = true;
        studentTopicPanel.hidden = true;
        studentPathwayPanel.hidden = false;
        studentTopics.querySelectorAll('.student-topic-card').forEach(card => card.classList.toggle('active', card.dataset.topic === topicId));
        renderStudentLessonCatalog(topicId, pathwayId);
        studentPathwaySelect.value = pathwayId;
        const activeCatalogCard = lessonCards.querySelector(`.lesson-card[data-pathway="${pathwayId}"]`);
        if (activeCatalogCard) {
          let firstVisibleCard = activeCatalogCard;
          for (let index = 0; index < 4 && firstVisibleCard.previousElementSibling; index += 1) firstVisibleCard = firstVisibleCard.previousElementSibling;
          lessonCards.scrollTop = Math.max(0, firstVisibleCard.offsetTop - lessonCards.offsetTop);
        }
        const beginnerLesson = studentBeginnerLessons[pathwayId] || fallbackBeginnerLesson(pathwayId);
        const topic = studentTopicCatalog[topicId];
        if (studentCourseBack) studentCourseBack.textContent = `← 返回${topic?.label || '专题'}`;
        flowKicker.textContent = `${topic?.label || beginnerLesson.topic || pathway.group || '代谢'} · 通路浏览`;
        flowTitle.textContent = pathway.name;
        flowTitle.style.setProperty('--tone', tone);
        flowCompartment.textContent = pathway.compartment || '区室待核对';
        flowSummary.textContent = readableReactionEquation(pathway.summary || '当前通路的主干步骤。');
        renderStudentPrimer(pathwayId);
        applyStudentMapZoom(1);
        renderStudentMap(pathwayId);
        studentPathStatus.textContent = pathway.name;
        studentPathScope.textContent = `${pathway.compartment || '多区室'} · ${pathway.steps?.length || 0} 个关键节点`;
        const steps = Array.isArray(pathway.steps) && pathway.steps.length ? pathway.steps : [];
        flowSteps.innerHTML = '';
        steps.forEach((step, index) => {
          const target = resolveStudentStep(pathwayId, step, index);
          const nextTarget = index < steps.length - 1 ? resolveStudentStep(pathwayId, steps[index + 1], index + 1) : null;
          const entity = target.entity;
          const transitionReaction = entity && nextTarget?.entity
            ? studentMapReactionFor(pathwayId, entity.id, nextTarget.entity.id, index)
            : (target.reaction || nextTarget?.reaction || null);
          const button = document.createElement('button');
          button.type = 'button'; button.className = 'flow-step'; button.style.setProperty('--tone', tone);
          button.dataset.stepKind = target.kind;
          button.classList.toggle('reversible-next', Boolean(transitionReaction?.reversible));
          const readableStep = readableReactionEquation(step);
          if (transitionReaction) button.setAttribute('aria-label', `${readableStep}，下一步为${transitionReaction.reversible ? '可逆反应' : '单向反应'}`);
          const stepKindLabel = entity ? '代谢物节点' : (target.kind === 'enzyme' ? '酶 / 载体步骤' : '过程步骤');
          button.innerHTML = `<span class="flow-step-index">${String(index + 1).padStart(2, '0')}</span><strong>${escapeStudentText(readableStep)}</strong><small>${stepKindLabel}</small>`;
          if (entity || target.reaction) {
            button.addEventListener('click', () => {
              setStudentReadingStep(pathwayId, index);
              const candidate = entity
                ? studentReactionsFor(pathwayId).find(reaction => reaction.from === entity.id || reaction.to === entity.id)
                : target.reaction;
              if (candidate) renderStudentReactionDetail(candidate, pathwayId, studentReactionsFor(pathwayId).indexOf(candidate));
            });
          }
          flowSteps.appendChild(button);
        });
        setStudentReadingStep(pathwayId, 0);
        flowLoop.textContent = /循环|cycle/i.test(pathway.name) ? '循环通路：末端中间体回到入口受体。' : '';

        const pathwayReactions = studentReactionsFor(pathwayId);
        studentReactionCount.textContent = `${pathwayReactions.length} 个反应`;
        studentReactions.innerHTML = '';
        pathwayReactions.forEach((reaction, index) => {
          const button = document.createElement('button');
          const substrate = entityById[reaction.from], product = entityById[reaction.to];
          button.type = 'button'; button.className = 'student-reaction'; button.dataset.reaction = reaction.id;
          const isComposite = isStudentCompositeReaction(reaction);
          const directionLabel = isComposite ? '净方向' : (reaction.reversible ? '可逆' : '单向');
          const directionSymbol = reaction.reversible ? '⇌' : '→';
          const readableEquation = readableReactionEquation(reaction.equation || `${substrate?.name || reaction.from} ${directionSymbol} ${product?.name || reaction.to}`);
          button.setAttribute('aria-label', `${isComposite ? '合并净反应' : `${directionLabel}反应`}：${readableEquation}`);
          button.innerHTML = `<span class="student-reaction-index">${String(index + 1).padStart(2, '0')}</span><span class="student-reaction-equation">${escapeStudentText(readableEquation)}</span><span class="student-reaction-direction${reaction.reversible ? ' reversible' : ''}"><b aria-hidden="true">${directionSymbol}</b>${directionLabel}</span>`;
          button.addEventListener('click', () => renderStudentReactionDetail(reaction, pathwayId, index));
          studentReactions.appendChild(button);
        });
        studentDetail.className = 'student-detail empty';
        studentDetail.textContent = '尚未选中反应';
        const requestedReaction = pathwayReactions.find(reaction => reaction.id === options.reactionId);
        if (requestedReaction) renderStudentReactionDetail(requestedReaction, pathwayId, pathwayReactions.indexOf(requestedReaction));
        const returnToPrimer = !options.reactionId && !options.anchorEntity && options.returnToPrimer !== false;
        if (returnToPrimer && !document.body.classList.contains('cover-visible')) {
          requestAnimationFrame(() => studentPrimer?.scrollIntoView({
            behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
            block: 'start'
          }));
        }
      }

      // #17 ── 学习模式 · 详情面板 ─────────────────────────────────────
      function ensureStudentWorkspaceReady() {
        if (studentWorkspaceReady) return;
        studentWorkspaceReady = true;
        buildStudentCatalog();
        buildStudentCourseHome();
        renderStudentPathway(activeStudentPathway && coreStudyPathwaySet.has(activeStudentPathway) ? activeStudentPathway : 'pdh', { returnToPrimer: false });
        showStudentCourseHome();
      }

      function setStudentMode(enabled, options = {}) {
        if (enabled && currentSceneId) closeScene({ buildExpert: false });
        if (!enabled && options.buildExpert !== false) ensureExpertMapBuilt();
        if (image) {
          const optimizedCellSrc = image.dataset.optimizedSrc || image.getAttribute('href');
          const targetCellSrc = enabled ? optimizedCellSrc : (image.dataset.expertSrc || optimizedCellSrc);
          image.dataset.optimizedSrc = optimizedCellSrc;
          if (targetCellSrc && image.getAttribute('href') !== targetCellSrc) image.setAttribute('href', targetCellSrc);
        }
        document.body.classList.toggle('student-mode', enabled);
        document.body.classList.toggle('expert-map', !enabled);
        studentWorkspace.classList.toggle('open', enabled);
        if (learnBtn) {
          learnBtn.textContent = enabled ? '专家地图' : '学习模式';
          learnBtn.setAttribute('aria-pressed', String(enabled));
          learnBtn.title = enabled ? '进入专家地图' : '返回学生学习模式';
        }
        if (enabled) {
          clearSelection();
          ensureStudentWorkspaceReady();
          showStudentCourseHome();
        }
        syncAccessibilityState();
      }

      function enterLearningFromCover() {
        if (!cellCover || cellCover.hidden || document.body.classList.contains('cover-transitioning')) return;
        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        setStudentMode(true);
        revealApplication();
        document.body.classList.remove('cover-visible');
        document.body.classList.add('cover-transitioning');
        cellCover.classList.add('is-exiting');
        cellCover.setAttribute('inert', '');
        cellCover.setAttribute('aria-hidden', 'true');
        window.setTimeout(() => {
          cellCover.hidden = true;
          document.body.classList.remove('cover-transitioning');
          studentWorkspace.focus({ preventScroll: true });
        }, reducedMotion ? 0 : 900);
      }

      function applyView(options = {}) {
        // 所有手势、动画和聚焦入口最终都经过这里；即使移动端连续捏合在
        // 一帧内产生异常值，也不能把负宽高写入 SVG viewBox。
        view.w = Math.max(420, Math.min(1900, Math.abs(Number(view.w) || base.w)));
        view.h = Math.max(315, Math.min(1500, Math.abs(Number(view.h) || view.w * .75)));
        const maxX = base.w - view.w, maxY = base.h - view.h;
        if (view.w >= base.w) {
          view.x = Math.max(-110, Math.min(110, view.x));
          view.y = Math.max(-90, Math.min(90, view.y));
        } else {
          view.x = Math.max(-40, Math.min(maxX + 40, view.x));
          view.y = Math.max(-40, Math.min(maxY + 40, view.y));
        }
        const nextViewBox = `${view.x} ${view.y} ${view.w} ${view.h}`;
        if (svg.getAttribute('viewBox') !== nextViewBox) svg.setAttribute('viewBox', nextViewBox);
        if (options.lightweight) return;
        const scale = base.w / view.w;
        const nodeScale = Math.min(2.2, Math.max(.9, .56 + scale * .44));
        svg.style.setProperty('--node-scale', nodeScale.toFixed(3));
        svg.style.setProperty('--node-halo-scale', (nodeScale * 1.28).toFixed(3));
        svg.style.setProperty('--node-core-scale', (nodeScale * 1.12).toFixed(3));
        svg.style.setProperty('--node-pulse-scale', (nodeScale * 1.42).toFixed(3));
        const compactPathwayMin = window.matchMedia('(max-width: 760px)').matches
          && document.body.classList.contains('pathway-focus') ? 6.2 : 5.4;
        const labelSize = Math.max(compactPathwayMin, 10.5 / Math.pow(scale, .55));
        svg.style.setProperty('--entity-label-size', `${labelSize.toFixed(2)}px`);
        document.body.classList.toggle('zoom-mid', scale >= 1.35);
        document.body.classList.toggle('zoom-detail', scale >= 2.05);
        const nextTier = scale < 1.25 ? 'overview' : scale < 1.9 ? 'compartment' : 'reaction';
        if (nextTier !== zoomContextTier) {
          zoomContextTier = nextTier;
          if (nextTier === 'overview') context.innerHTML = '<b>细胞</b><span> › 全景</span>';
          else if (nextTier === 'compartment') context.innerHTML = '<b>细胞</b><span> › 区室与主干通路</span>';
          else context.innerHTML = '<b>细胞</b><span> › 反应网络 › 酶与辅因子</span>';
        }
      }

      function clientToMapPoint(clientX, clientY) {
        const point = svg.createSVGPoint();
        point.x = clientX;
        point.y = clientY;
        return point.matrixTransform(svg.getScreenCTM().inverse());
      }

      function mapGesturePair() {
        return [...mapPointers.values()].slice(0, 2);
      }

      function activateMapGesturePreview() {
        if (!document.body.classList.contains('expert-map') || !mapGesturePreview || !mapGesturePreviewImage) return false;
        const rect = svg.getBoundingClientRect();
        const stageRect = mapStage.getBoundingClientRect();
        const slice = (svg.getAttribute('preserveAspectRatio') || '').includes('slice');
        const screenScale = (slice ? Math.max : Math.min)(rect.width / view.w, rect.height / view.h);
        const offsetX = (rect.width - view.w * screenScale) / 2;
        const offsetY = (rect.height - view.h * screenScale) / 2;
        const source = image.dataset.expertSrc || image.getAttribute('href');
        if (source && mapGesturePreviewImage.getAttribute('src') !== source) mapGesturePreviewImage.src = source;
        mapGesturePreviewImage.style.left = `${rect.left - stageRect.left + offsetX - view.x * screenScale}px`;
        mapGesturePreviewImage.style.top = `${rect.top - stageRect.top + offsetY - view.y * screenScale}px`;
        mapGesturePreviewImage.style.width = `${base.w * screenScale}px`;
        mapGesturePreviewImage.style.height = `${base.h * screenScale}px`;
        mapGesturePreviewContent.style.transform = '';
        mapGesturePreviewContent.style.transformOrigin = '';
        mapGesturePreview.classList.add('active');
        svg.classList.add('gesture-source-hidden');
        return true;
      }

      function deactivateMapGesturePreview() {
        if (mapGesturePreviewContent) {
          mapGesturePreviewContent.style.transform = '';
          mapGesturePreviewContent.style.transformOrigin = '';
        }
        if (mapGesturePreview) mapGesturePreview.classList.remove('active');
        svg.classList.remove('gesture-source-hidden');
      }

      function beginMapGesture() {
        if (pendingGestureView || previewedGestureView) flushMapGestureView();
        if (!mapPointers.size) {
          mapGesture = null;
          return;
        }
        const points = mapGesturePair();
        const center = points.length > 1
          ? { x: (points[0].x + points[1].x) / 2, y: (points[0].y + points[1].y) / 2 }
          : { x: points[0].x, y: points[0].y };
        mapGesture = {
          kind: points.length > 1 ? 'pinch' : 'pan',
          startView: { ...view },
          startCenter: center,
          startDistance: points.length > 1 ? Math.max(12, Math.hypot(points[1].x - points[0].x, points[1].y - points[0].y)) : 0,
          anchor: clientToMapPoint(center.x, center.y),
          viewportRect: svg.getBoundingClientRect(),
          stageRect: mapStage.getBoundingClientRect(),
          moved: false
        };
        document.body.classList.add('map-gesture-active');
        mapGesture.previewActive = activateMapGesturePreview();
      }

      function queueMapGestureView(nextView, nextTransform) {
        pendingGestureView = nextView;
        pendingGestureTransform = nextTransform;
        if (mapGestureFrame) return;
        mapGestureFrame = requestAnimationFrame(() => {
          mapGestureFrame = null;
          if (!pendingGestureView) return;
          previewedGestureView = pendingGestureView;
          pendingGestureView = null;
          const transform = pendingGestureTransform;
          pendingGestureTransform = null;
          if (!transform || !mapGesture) return;
          if (mapGesture.previewActive && mapGesturePreviewContent) {
            const originX = mapGesture.startCenter.x - mapGesture.stageRect.left;
            const originY = mapGesture.startCenter.y - mapGesture.stageRect.top;
            mapGesturePreviewContent.style.transformOrigin = `${originX}px ${originY}px`;
            mapGesturePreviewContent.style.transform = `translate3d(${transform.x}px, ${transform.y}px, 0) scale(${transform.scale})`;
            return;
          }
          view = previewedGestureView;
          applyView({ lightweight: true });
        });
      }

      function flushMapGestureView() {
        if (mapGestureFrame) cancelAnimationFrame(mapGestureFrame);
        mapGestureFrame = null;
        const nextView = pendingGestureView || previewedGestureView;
        pendingGestureView = null;
        previewedGestureView = null;
        pendingGestureTransform = null;
        if (nextView) {
          view = nextView;
          applyView({ lightweight: true });
        }
        deactivateMapGesturePreview();
      }

      function mapViewAroundGestureAnchor(center, width) {
        const height = width * .75;
        const rect = mapGesture.viewportRect;
        const slice = (svg.getAttribute('preserveAspectRatio') || '').includes('slice');
        const screenScale = (slice ? Math.max : Math.min)(rect.width / width, rect.height / height);
        const offsetX = (rect.width - width * screenScale) / 2;
        const offsetY = (rect.height - height * screenScale) / 2;
        return {
          x: mapGesture.anchor.x - (center.x - rect.left - offsetX) / screenScale,
          y: mapGesture.anchor.y - (center.y - rect.top - offsetY) / screenScale,
          w: width,
          h: height
        };
      }

      function updateMapGesture(event) {
        if (!mapPointers.has(event.pointerId)) return;
        const coalesced = typeof event.getCoalescedEvents === 'function' ? event.getCoalescedEvents() : [];
        const sample = coalesced.length ? coalesced[coalesced.length - 1] : event;
        mapPointers.set(event.pointerId, { x: sample.clientX, y: sample.clientY });
        const points = mapGesturePair();
        const gestureKind = points.length > 1 ? 'pinch' : 'pan';
        if (!mapGesture || mapGesture.kind !== gestureKind) beginMapGesture();
        if (!mapGesture) return;
        event.preventDefault();
        if (gestureKind === 'pinch') {
          const center = { x: (points[0].x + points[1].x) / 2, y: (points[0].y + points[1].y) / 2 };
          const distance = Math.max(12, Math.hypot(points[1].x - points[0].x, points[1].y - points[0].y));
          const centerTravel = Math.hypot(center.x - mapGesture.startCenter.x, center.y - mapGesture.startCenter.y);
          if (!mapGesture.moved && Math.abs(distance - mapGesture.startDistance) < 3 && centerTravel < 3) return;
          mapGesture.moved = true;
          const width = Math.max(420, Math.min(1900, mapGesture.startView.w * mapGesture.startDistance / distance));
          queueMapGestureView(mapViewAroundGestureAnchor(center, width), {
            x: center.x - mapGesture.startCenter.x,
            y: center.y - mapGesture.startCenter.y,
            scale: distance / mapGesture.startDistance
          });
        } else {
          const dx = points[0].x - mapGesture.startCenter.x;
          const dy = points[0].y - mapGesture.startCenter.y;
          if (!mapGesture.moved && Math.hypot(dx, dy) < 5) return;
          mapGesture.moved = true;
          const rect = mapGesture.viewportRect;
          const slice = (svg.getAttribute('preserveAspectRatio') || '').includes('slice');
          const screenScale = (slice ? Math.max : Math.min)(rect.width / mapGesture.startView.w, rect.height / mapGesture.startView.h);
          queueMapGestureView({
            ...mapGesture.startView,
            x: mapGesture.startView.x - dx / screenScale,
            y: mapGesture.startView.y - dy / screenScale
          }, { x: dx, y: dy, scale: 1 });
        }
        svg.classList.add('dragging');
      }

      // #18 ── 学习模式 · 导航 ─────────────────────────────────────────
      function finishMapPointer(event) {
        if (!mapPointers.has(event.pointerId)) return;
        if (mapGesture?.moved) clickInterceptDeadline = performance.now() + 360;
        flushMapGestureView();
        const captureOwner = mapPointerCaptures.get(event.pointerId);
        if (captureOwner) {
          try {
            if (captureOwner.hasPointerCapture(event.pointerId)) captureOwner.releasePointerCapture(event.pointerId);
          } catch (_) {}
        }
        mapPointerCaptures.delete(event.pointerId);
        mapPointers.delete(event.pointerId);
        if (mapPointers.size) {
          beginMapGesture();
          return;
        }
        mapGesture = null;
        svg.classList.remove('dragging');
        document.body.classList.remove('map-gesture-active');
        applyView();
      }

      function zoomAt(factor, clientX = innerWidth / 2, clientY = innerHeight / 2, options = {}) {
        cancelViewAnimation();
        const point = svg.createSVGPoint(); point.x = clientX; point.y = clientY;
        const p = point.matrixTransform(svg.getScreenCTM().inverse());
        const nw = Math.max(420, Math.min(1900, view.w * factor));
        const nh = nw * .75;
        const rx = (p.x - view.x) / view.w, ry = (p.y - view.y) / view.h;
        view = { x: p.x - rx * nw, y: p.y - ry * nh, w: nw, h: nh }; applyView(options);
      }

      function queueWheelZoom(event) {
        event.preventDefault();
        const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? innerHeight : 1;
        wheelZoomDelta = Math.max(-320, Math.min(320, wheelZoomDelta + event.deltaY * unit));
        wheelZoomPoint = { x: event.clientX, y: event.clientY };
        document.body.classList.add('map-wheel-zooming');
        if (wheelZoomEndTimer) clearTimeout(wheelZoomEndTimer);
        wheelZoomEndTimer = setTimeout(() => {
          wheelZoomEndTimer = null;
          document.body.classList.remove('map-wheel-zooming');
          applyView();
        }, 90);
        if (wheelZoomFrame) return;
        wheelZoomFrame = requestAnimationFrame(() => {
          const delta = wheelZoomDelta;
          const point = wheelZoomPoint;
          wheelZoomDelta = 0;
          wheelZoomFrame = null;
          zoomAt(Math.exp(delta * .00145), point.x, point.y, { lightweight: true });
        });
      }

      function cancelViewAnimation() {
        if (viewAnimation) cancelAnimationFrame(viewAnimation);
        viewAnimation = null;
      }

      function animateViewTo(target, duration = 520) {
        cancelViewAnimation();
        if (matchMedia('(prefers-reduced-motion: reduce)').matches) { view = { ...target }; applyView(); return; }
        const start = { ...view };
        const startedAt = performance.now();
        const tick = now => {
          const progress = Math.min(1, (now - startedAt) / duration);
          const eased = 1 - Math.pow(1 - progress, 4);
          view = {
            x: start.x + (target.x - start.x) * eased,
            y: start.y + (target.y - start.y) * eased,
            w: start.w + (target.w - start.w) * eased,
            h: start.h + (target.h - start.h) * eased
          };
          applyView();
          if (progress < 1) viewAnimation = requestAnimationFrame(tick);
          else viewAnimation = null;
        };
        viewAnimation = requestAnimationFrame(tick);
      }

      function focusBox(box) {
        const targetW = Math.max(480, Math.min(820, box.w || box.width * 2.8));
        const targetH = targetW * .75;
        animateViewTo({ x: (box.x ?? box.left) + (box.w ?? box.width) / 2 - targetW / 2, y: (box.y ?? box.top) + (box.h ?? box.height) / 2 - targetH / 2, w: targetW, h: targetH });
      }

      function focusPathway(pathwayId) {
        const points = [];
        entities.forEach(entity => {
          if (groupsFor(entity).includes(pathwayId)) points.push(expertEntityPoint(entity));
        });
        reactions.forEach(reaction => {
          if (!groupsFor(reaction).includes(pathwayId)) return;
          const substrate = entityById[reaction.from], product = entityById[reaction.to];
          if (substrate) points.push(expertEntityPoint(substrate));
          if (product) points.push(expertEntityPoint(product));
        });
        if (points.length < 2) return;
        const xs = points.map(point => point.x), ys = points.map(point => point.y);
        const minX = Math.min(...xs), maxX = Math.max(...xs);
        const minY = Math.min(...ys), maxY = Math.max(...ys);
        const viewportRatio = Math.max(.75, innerHeight / Math.max(1, innerWidth));
        const svgRect = svg.getBoundingClientRect();
        const visibleTop = Math.max(svgRect.top, document.querySelector('.topbar')?.getBoundingClientRect().bottom || svgRect.top);
        const visibleBottom = Math.min(svgRect.bottom, document.querySelector('.pathbar')?.getBoundingClientRect().top || svgRect.bottom);
        const visibleFraction = Math.max(.52, Math.min(1, (visibleBottom - visibleTop) / Math.max(1, svgRect.height)));
        const visibleCenterFraction = Math.max(0, Math.min(1,
          ((visibleTop + visibleBottom) / 2 - svgRect.top) / Math.max(1, svgRect.height)));
        const desktop = !window.matchMedia('(max-width: 760px)').matches;
        const minimumWidth = desktop ? 940 : 620;
        const maximumWidth = desktop ? 1480 : 980;
        const widthNeeded = (maxX - minX + 180) * 1.06;
        const heightNeededAsWidth = (maxY - minY + 130) / (viewportRatio * visibleFraction);
        const targetW = Math.max(minimumWidth, Math.min(maximumWidth, Math.max(widthNeeded, heightNeededAsWidth)));
        const targetH = targetW * viewportRatio;
        animateViewTo({
          x: (minX + maxX) / 2 - targetW / 2,
          // 让通路中心对齐“顶部栏与底部通路栏之间”的真实可见中心。
          y: (minY + maxY) / 2 - targetH * visibleCenterFraction,
          w: targetW,
          h: targetH
        }, 280);
      }

      function focusEntity(e) {
        const point = expertEntityPoint(e);
        focusBox({ x: point.x - 75, y: point.y - 75, w: 150, h: 150 });
      }
      function focusReaction(r) {
        const endpoints = expertReactionEndpoints(r);
        if (!endpoints) return;
        const { substrate, product } = endpoints;
        focusBox({ x: (substrate.x + product.x) / 2 - 150, y: (substrate.y + product.y) / 2 - 130, w: 300, h: 260 });
      }
      function focusOrganelles(o, moveViewport = true) {
        clearSelection();
        document.body.classList.add('organelle-focus');
        if (moveViewport) focusBox(o.focus);
        document.querySelectorAll('.organelle-hit').forEach(x => x.classList.remove('active'));
        document.querySelector(`[data-id="${o.id}"] .organelle-hit`)?.classList.add('active');
        openInspector({
          ...o,
          kind: '细胞器',
          latin: o.sub,
          info: `${o.name}是地图中的空间锚点。先查看说明，再使用下方“进入细胞器”按钮开始自由探索。`,
          group: o.id === 'mitochondria' ? ['transport', 'pdh', 'tca', 'etc'] : ['transport'],
          meta: { 交互: '单击选择 · 点击按钮进入', 分层场景: atlas.scenes[o.sceneId]?.title || '—' }
        });
        context.replaceChildren();
        const rootLabel = document.createElement('b'); rootLabel.textContent = '细胞';
        const pathLabel = document.createElement('span'); pathLabel.textContent = ` › ${o.name}`;
        context.append(rootLabel, pathLabel);
      }

      function clearSelection() {
        selected = null; selectedType = null; inspector.classList.remove('open');
        setRegionHidden(inspector, true);
        document.body.classList.remove('enzyme-visible', 'selection-active', 'inspector-open', 'entity-focus', 'reaction-focus', 'organelle-focus', 'pathway-focus');
        document.querySelectorAll('.route.active,.route-aura.active,.entity.active,.enzyme.active,.organelle-hit.active,.scene-hotspot.active').forEach(el => el.classList.remove('active'));
        document.querySelectorAll('.dim').forEach(el => el.classList.remove('dim'));
        document.querySelectorAll('.pathway-active').forEach(el => el.classList.remove('pathway-active'));
        document.querySelectorAll('.entity.context-label').forEach(el => el.classList.remove('context-label'));
        activePathway = 'all'; document.querySelectorAll('.path-filter').forEach((b, i) => b.classList.toggle('active', i === 0));
        updateExpertPathPreview('all');
        syncExpertInteractiveStates();
        animateViewTo(base, 360);
      }

      function displayText(value) {
        return readableReactionEquation(String(value ?? ''))
          .replace(/\bPDF\b/gi, '代谢总图')
          .replace(/PortalLink/gi, '跨区室连接')
          .replace(/\bTCA\b/g, '三羧酸循环')
          .replace(/α-KG/g, 'α-酮戊二酸')
          .replace(/\bOAA\b/g, '草酰乙酸');
      }

      function sceneLevelText(value) {
        const text = displayText(value);
        return text.includes('·') ? text.split('·')[0].trim() : text;
      }

      function sceneViewEntry(scene, index = 0) {
        const entry = scene?.views?.[index];
        if (Array.isArray(entry)) return { label: entry[0], src: entry[1], hotspots: entry[2] || null, hotspotMode: 'append' };
        return entry || { label: '默认视角', src: '', hotspots: null, hotspotMode: 'append' };
      }

      function sceneHotspotsForView(scene, index = 0) {
        const entry = sceneViewEntry(scene, index);
        if (!entry.hotspots) return scene.hotspots || [];
        if (entry.hotspotMode === 'replace') return entry.hotspots;
        return [...(scene.hotspots || []), ...entry.hotspots];
      }

      function sceneAnnotationsForView(scene, index = 0) {
        const profileEntry = atlas.sceneAnnotationProfileMap?.[scene.id];
        const profileId = Array.isArray(profileEntry) ? profileEntry[index] : profileEntry;
        return atlas.annotationProfiles?.[profileId] || [];
      }

      const sceneAnnotationKinds = {
        boundary: { label: '区室边界', tone: '#3a8ead' },
        structure: { label: '关键结构', tone: '#7665ad' },
        process: { label: '功能过程', tone: '#d18438' },
        transport: { label: '物质运输', tone: '#4c8b67' }
      };

      // 专家地图采用低饱和、可区分的教材配色；入口点、机制节点与线路共用同一色值。
      const expertPathwayToneById = {
        malate_aspartate: '#2f7f8d', glycerol_phosphate: '#7466a6',
        pdh: '#b65f70', tca: '#2f806b', etc: '#397aa3', oxphos: '#5967a8',
        glycolysis: '#c77a29', gluconeogenesis: '#6679a7', glycogenesis: '#478565',
        glycogenolysis: '#ad6658', ppp: '#3c897b',
        fa_synthesis: '#8a6475', carnitine: '#b66f3d', beta_oxidation: '#c47b32', ketone: '#a65f4b',
        transamination: '#5f78a5', urea: '#7b63a0', aa_carbon: '#65875e',
        purine: '#4d82ae', pyrimidine: '#7864a0', nucleotide_degradation: '#8a625e'
      };

      function setSceneAnnotationsVisible(visible) {
        sceneAnnotationsVisible = Boolean(visible);
        sceneDeck.classList.toggle('annotations-hidden', !sceneAnnotationsVisible);
        sceneAnnotationToggle.setAttribute('aria-pressed', String(sceneAnnotationsVisible));
        sceneAnnotationToggle.textContent = sceneAnnotationsVisible ? '隐藏标注' : '显示标注';
        if (sceneAnnotationsVisible) scheduleSceneAnnotationLayout();
      }

      function sceneRectsOverlap(a, b, gap = 5) {
        return a.left < b.right + gap && a.right > b.left - gap && a.top < b.bottom + gap && a.bottom > b.top - gap;
      }

      function resolveSceneAnnotationLabels() {
        if (!sceneAnnotationsVisible || !sceneHotspots.isConnected) return;
        const mapBox = sceneHotspots.getBoundingClientRect();
        const blockers = [...sceneHotspots.querySelectorAll(':scope > .scene-hotspot, :scope > .scene-annotation-reader')]
          .filter(node => getComputedStyle(node).display !== 'none')
          .map(node => node.getBoundingClientRect());
        const labels = [...sceneHotspots.querySelectorAll('.scene-landmark-label')]
          .filter(label => {
            const style = getComputedStyle(label);
            return style.display !== 'none' && style.visibility !== 'hidden';
          });
        labels.forEach(label => {
          const landmark = label.closest('.scene-landmark');
          const preferredSide = landmark.dataset.side === 'left' ? 'left' : 'right';
          let placed = false;
          for (const side of [preferredSide, preferredSide === 'left' ? 'right' : 'left']) {
            landmark.dataset.side = side;
            for (const shift of [0, -25, 25, -50, 50]) {
              label.style.setProperty('--label-shift-y', `${shift}px`);
              const box = label.getBoundingClientRect();
              const inside = box.left >= mapBox.left + 2 && box.right <= mapBox.right - 2 && box.top >= mapBox.top + 2 && box.bottom <= mapBox.bottom - 2;
              if (inside && !blockers.some(blocker => sceneRectsOverlap(box, blocker))) {
                blockers.push(box);
                placed = true;
                break;
              }
            }
            if (placed) break;
          }
          if (!placed) {
            landmark.dataset.side = preferredSide;
            label.style.setProperty('--label-shift-y', '0px');
            blockers.push(label.getBoundingClientRect());
          }
        });
      }

      // #19 ── 专家模式 · 场景渲染 ─────────────────────────────────────
      function scheduleSceneAnnotationLayout() {
        requestAnimationFrame(() => requestAnimationFrame(resolveSceneAnnotationLabels));
        window.setTimeout(resolveSceneAnnotationLabels, 460);
      }

      function resolveCompactHotspots() {
        if (!window.matchMedia('(max-width: 760px)').matches) return;
        const placed = [];
        [...sceneHotspots.querySelectorAll(':scope > .scene-hotspot')].forEach((node, index) => {
          let x = Number.parseFloat(node.style.getPropertyValue('--x')) || 50;
          let y = Number.parseFloat(node.style.getPropertyValue('--y')) || 50;
          for (let attempt = 0; attempt < 10; attempt += 1) {
            const crowded = placed.some(point => Math.abs(x - point.x) < 19 && Math.abs(y - point.y) < 10);
            if (!crowded) break;
            y += 10;
            if (y > 88) { y = 14 + (index % 3) * 9; x += 16; }
          }
          if (node.dataset.target) x = Math.max(20, Math.min(80, x));
          x = Math.max(7, Math.min(93, x));
          y = Math.max(8, Math.min(88, y));
          node.style.setProperty('--x', `${x}%`);
          node.style.setProperty('--y', `${y}%`);
          placed.push({ x, y });
        });
      }

      function openInspector(item) {
        selected = item;
        selectedType = item.selectionType || ((item.kind === '反应' || item.equation) ? 'reaction' : item.kind === '细胞器' ? 'organelle' : item.kind === '总图通路' ? 'pathway' : 'entity');
        document.getElementById('inspectorKind').textContent = displayText(item.kind || '知识节点');
        document.getElementById('inspectorName').textContent = item.name || '节点';
        const secondary = item.compartment || (/[㐀-鿿]/.test(item.latin || '') ? item.latin : '');
        document.getElementById('inspectorLatin').textContent = displayText(secondary);
        document.getElementById('inspectorInfo').textContent = displayText(item.info || '');
        const previewScene = selectedType === 'pathway' && item.sceneId ? atlas.scenes[item.sceneId] : null;
        const previewView = previewScene?.views?.[0] || null;
        const pathwayOverride = item.pathwayId ? expertPathwayVisualOverrides[item.pathwayId] : null;
        const previewSource = pathwayOverride?.[1] || (Array.isArray(previewView) ? previewView[1] : previewView?.src);
        const previewLabel = pathwayOverride?.[0] || (Array.isArray(previewView) ? previewView[0] : previewView?.label);
        if (inspectorVisual && inspectorVisualImage && previewScene && previewSource) {
          inspectorVisual.hidden = false;
          inspectorVisualImage.src = previewSource;
          inspectorVisualImage.alt = `${displayText(item.name || '通路')}结构视图`;
          inspectorVisualTitle.textContent = displayText(previewScene.title || item.compartment || '区室结构');
          inspectorVisualCaption.textContent = `${displayText(previewLabel || '详细结构')} · 点击“打开所在场景”查看完整图`;
        } else if (inspectorVisual) {
          inspectorVisual.hidden = true;
          if (inspectorVisualImage) inspectorVisualImage.removeAttribute('src');
        }
        const profile = item.enzymeProfile || null;
        enzymeProfilePanel.hidden = !profile;
        if (profile) {
          enzymeProfileName.textContent = profile.name;
          enzymeProfileKind.textContent = profile.kind;
          // 酶卡摘要与顶部简介同源（都生成自反应备注）；逐字重复时只保留简介，
          // 避免同一段话在详情栏出现两次。
          const infoClean = displayText(item.info || '').replace(/（待审校）/g, '').trim();
          const summaryDuplicatesInfo = Boolean(infoClean) && profile.summary === studentReactionDescription(infoClean);
          enzymeProfileSummary.hidden = summaryDuplicatesInfo;
          enzymeProfileSummary.textContent = summaryDuplicatesInfo ? '' : profile.summary;
          enzymeProfileMeta.innerHTML = '';
          [['催化反应', profile.reaction], ['结构', profile.structure], ['辅酶 / 辅因子', profile.factors], ['方向', profile.direction], ['所在通路', profile.pathways], ['所在区室', profile.compartment], ['记录数', profile.recordCount], ['说明', profile.note]].forEach(([key, value]) => {
            const row = document.createElement('div');
            const dt = document.createElement('dt'); dt.textContent = key;
            const dd = document.createElement('dd');
            if (key === '催化反应') { dd.className = 'equation-value'; dd.innerHTML = reactionEquationHtml(value); }
            else dd.textContent = value;
            row.append(dt, dd); enzymeProfileMeta.appendChild(row);
          });
        } else {
          enzymeProfileMeta.innerHTML = '';
        }
        const chips = document.getElementById('inspectorChips'); chips.innerHTML = '';
        const itemGroups = Array.isArray(item.group) ? item.group : item.group ? [item.group] : [];
        itemGroups.forEach(g => { const chip = document.createElement('span'); chip.textContent = pathLabel(g); chips.appendChild(chip); });
        const meta = document.getElementById('inspectorMeta'); meta.innerHTML = '';
        const values = {};
        if (item.substance) values['实体类型'] = item.substance;
        if (item.compartment) values['所在区室'] = item.compartment;
        Object.assign(values, item.meta || {});
        if (item.equation && !profile) values['反应式'] = item.equation;
        if (!Object.keys(values).length) values['来源'] = '首版人工审核';
        Object.entries(values).slice(0, 6).forEach(([key, value]) => {
          const row = document.createElement('div'); row.className = 'detail-row';
          const term = document.createElement('dt'); term.textContent = displayText(key);
          const detail = document.createElement('dd');
          if (key === '反应式') detail.innerHTML = reactionEquationHtml(value);
          else detail.textContent = displayText(value);
          row.append(term, detail); meta.appendChild(row);
        });
        focusBtn.hidden = Boolean(item.hideFocusAction);
        focusBtn.textContent = selectedType === 'organelle' && item.sceneId ? '进入细胞器' : selectedType === 'pathway' ? '打开所在场景' : '平滑聚焦';
        upstreamBtn.hidden = selectedType !== 'entity';
        document.body.classList.add('inspector-open');
        inspector.classList.add('open');
        setRegionHidden(inspector, false);
      }

      function highlightFor(groups, id) {
        document.body.classList.add('selection-active');
        document.querySelectorAll('.route,.route-aura,.route-title,.entity,.enzyme').forEach(el => {
          el.classList.remove('active', 'dim');
          const linked = groupsFor({ group: el.dataset.group }).some(g => groups.includes(g));
          if (id && el.dataset.id === id) el.classList.add('active');
          else if (!linked) el.classList.add('dim');
        });
      }

      function openEntity(e, event) {
        document.body.classList.remove('organelle-focus', 'pathway-focus');
        document.body.classList.remove('enzyme-visible');
        document.body.classList.remove('reaction-focus');
        document.body.classList.add('entity-focus');
        selected = e; selectedType = 'entity'; highlightFor(e.group, e.id);
        const neighborIds = new Set([e.id]);
        reactions.forEach(r => {
          if (r.from === e.id) neighborIds.add(r.to);
          if (r.to === e.id) neighborIds.add(r.from);
        });
        document.querySelectorAll('.entity').forEach(node => node.classList.toggle('context-label', neighborIds.has(node.dataset.id)));
        const entityKey = e.entityKey || e.id;
        document.querySelectorAll('.entity').forEach(node => {
          if (node.dataset.entityKey === entityKey) node.classList.add('active');
        });
        context.replaceChildren();
        const rootLabel = document.createElement('b'); rootLabel.textContent = '细胞';
        const pathLabel = document.createElement('span'); pathLabel.textContent = ` › ${e.compartment} › ${e.name}`;
        context.append(rootLabel, pathLabel);
        openInspector(e);
      }
      function openReaction(r, event) {
        document.body.classList.remove('organelle-focus', 'pathway-focus');
        const endpoints = expertReactionEndpoints(r);
        if (!endpoints) return;
        selected = r; selectedType = 'reaction';
        const groups = Array.isArray(r.group) ? r.group : [r.group];
        const { substrate, product } = endpoints;
        document.body.classList.remove('entity-focus');
        document.body.classList.add('reaction-focus');
        highlightFor(groups, r.id);
        document.body.classList.add('enzyme-visible');
        document.querySelectorAll('.entity').forEach(node => node.classList.toggle('context-label', node.dataset.id === r.from || node.dataset.id === r.to));
        openInspector({
          ...r,
          enzymeProfile: enzymeProfileFor(r.enzyme, r),
          name: `${substrate.name} ${r.reversible ? '⇌' : '→'} ${product.name}`,
          latin: r.enzyme,
          kind: '反应',
          group: groups,
          info: r.info,
          meta: {
            底物: substrate.name,
            产物: product.name,
            酶: r.enzyme,
            可逆性: r.reversible ? '可逆' : '不可逆',
            区室: pathwayMeta[r.group]?.compartment || '—'
          }
        });
      }

      function openPathway(pathwayId, options = {}) {
        document.body.classList.remove('organelle-focus', 'pathway-focus');
        const pathway = atlas.pathways[pathwayId];
        if (!pathway) return;
        activePathway = pathwayId;
        updateExpertPathPreview(pathwayId);
        const routeGroup = routeGroupForPathway(pathwayId, pathway);
        if (routeGroup && pathwayMeta[routeGroup]) highlightFor([routeGroup], null);
        // 从自由探索中的通路入口进入时，同样直达第 3 层机制图；
        // 空间位置由单独的“查看区室结构”入口提供。
        const mechanismScene = expertMechanismSceneForPathway(pathway);
        if (currentSceneId && currentSceneId !== mechanismScene) {
          openScene(mechanismScene, { pathwayId, preservePathway: true });
        } else if (currentSceneId === mechanismScene) {
          setScenePathwayVisual(pathwayId);
        }
        document.querySelectorAll('.scene-hotspot').forEach(node => node.classList.toggle('active', node.dataset.pathway === pathwayId));
        document.querySelectorAll('.scene-route-lane').forEach(node => node.classList.toggle('active', node.dataset.pathway === pathwayId));
        // 机制页以中央画布为主；详情栏会遮挡酶、载体和辅酶标签，因此场景内
        // 打开通路时自动收起。左侧区室卡仍保留通路名称、范围和返回入口。
        if (currentSceneId) {
          inspector.classList.remove('open');
          document.body.classList.remove('inspector-open');
          setRegionHidden(inspector, true);
          return;
        }
        if (options.openInspector === false) return;
        openInspector({
          id: pathwayId,
          pathwayId,
          sceneId: pathway.scene,
          selectionType: 'pathway',
          kind: '总图通路',
          name: pathway.name,
          latin: pathway.english,
          info: pathway.summary,
          group: [pathway.group],
          compartment: pathway.compartment,
          meta: {
            关键步骤: pathway.steps.join(' → '),
            图中位置: pathway.source,
            审核状态: pathway.review,
            所在场景: atlas.scenes[pathway.scene]?.title || pathway.scene
          }
        });
      }

      const sceneBoundaryText = {
        'cell-atlas': '完整细胞：只显示结构入口，不把不同区室的反应混在一起。',
        cytosol: '细胞质基质：糖代谢、磷酸戊糖与胞质侧反应。',
        mitochondria: '线粒体整体：外膜、膜间隙、内膜和基质的总范围。',
        'mitochondria-matrix': '线粒体基质：PDH、三羧酸循环和基质侧反应。',
        'mitochondria-inner-membrane': '线粒体内膜：电子传递、质子梯度和 ATP 合成。',
        'nucleus-er': '细胞核与内质网接口：核内反应、核膜和 ER 腔的连续界面。',
        'smooth-er-lipid': '平滑内质网与脂滴：脂质、胆固醇和膜脂合成区域。',
        golgi: '高尔基体：顺面输入、腔内修饰、反面分选。',
        'endosome-lysosome': '内体—溶酶体系统：内吞、成熟、融合和大分子回收。',
        peroxisome: '过氧化物酶体：极长链脂肪酸、过氧化氢和醚磷脂早期合成。',
        'plasma-membrane': '质膜：胞外液、膜蛋白和胞质之间的物质边界。',
        'plant-extension': '植物细胞：区分质体、细胞质、线粒体、乙醛酸体、中央液泡和细胞壁。'
      };
      const sceneTransportIds = new Set(['transport', 'malate_aspartate', 'glycerol_phosphate', 'carnitine', 'atp_transport', 'membrane_transport', 'lipoprotein']);

      function appendScopeItem(container, label, tone, onClick, suffix = '→') {
        const button = document.createElement('button');
        button.type = 'button'; button.className = 'scope-item'; button.style.setProperty('--tone', tone || '#4b9497');
        const text = document.createElement('span'); text.textContent = label;
        const mark = document.createElement('em'); mark.textContent = suffix;
        button.append(text, mark);
        if (onClick) button.addEventListener('click', event => { event.stopPropagation(); onClick(); });
        else button.disabled = true;
        container.appendChild(button);
      }

      function sceneEntryLabel(hotspot) {
        const target = hotspot?.target ? atlas.scenes[hotspot.target] : null;
        return target?.parent ? `${hotspot.label || target.title}（进入第 3 层）` : (hotspot.label || hotspot.target);
      }

      function renderSceneRouteLanes(scene, hotspots = [], selectedPathwayId = null) {
        if (!sceneRouteLanes) return;
        sceneRouteLanes.replaceChildren();
        // 第 1 层只承担结构导航，避免把所有通路线路堆叠在完整细胞总览上。
        if (scene?.id === 'cell-atlas') {
          if (sceneRouteLaneCount) sceneRouteLaneCount.textContent = '0 条';
          const hint = document.createElement('div');
          hint.className = 'scope-empty';
          hint.textContent = '完整细胞层只显示结构入口；进入细胞器后查看对应区室通路。';
          sceneRouteLanes.appendChild(hint);
          return;
        }
        const pathwayIds = [...new Set(hotspots
          .filter(hotspot => hotspot.pathway && coreStudyPathwaySet.has(hotspot.pathway) && atlas.pathways[hotspot.pathway])
          .map(hotspot => hotspot.pathway))];
        // 父级仍可列出子区室的“入口卡”，但卡片只进入第 3 层，
        // 不直接打开第 4 层机制图。
        const childEntryIds = coreStudyPathwayIds.filter(pathwayId => {
          const pathway = atlas.pathways[pathwayId];
          const child = pathway?.scene ? atlas.scenes[pathway.scene] : null;
          return child?.parent === scene.id
            && (scene.hotspots || []).some(hotspot => hotspot.pathway === pathwayId);
        });
        childEntryIds.forEach(pathwayId => { if (!pathwayIds.includes(pathwayId)) pathwayIds.push(pathwayId); });
        if (sceneRouteLaneCount) sceneRouteLaneCount.textContent = `${pathwayIds.length} 条`;
        if (!pathwayIds.length) {
          const empty = document.createElement('div');
          empty.className = 'scope-empty';
          empty.textContent = '进入细胞器后，线路会按区室显示在这里。';
          sceneRouteLanes.appendChild(empty);
          return;
        }
        pathwayIds.forEach(pathwayId => {
          const pathway = atlas.pathways[pathwayId];
          const meta = pathwayMeta[pathwayId] || pathwayMeta[routeGroupForPathway(pathwayId, pathway)] || {};
          const tone = meta.tone || scene.tone || '#338ca3';
          const lane = document.createElement('button');
          lane.type = 'button'; lane.className = 'scene-route-lane'; lane.style.setProperty('--tone', tone);
          lane.dataset.pathway = pathwayId;
          lane.setAttribute('aria-label', `查看${pathway.name}线路`);
          const childScene = atlas.scenes[pathway.scene];
          const entersChild = childScene?.parent === scene.id;
          lane.addEventListener('click', event => {
            event.stopPropagation();
            if (entersChild) openScene(childScene.id, { preservePathway: true });
            else openPathway(pathwayId);
          });

          const head = document.createElement('span'); head.className = 'scene-route-lane-head';
          const visual = expertPathwayVisualOverrides[pathwayId];
          if (visual?.[1]) {
            const thumb = document.createElement('img');
            thumb.className = 'scene-route-lane-thumb';
            thumb.src = visual[1];
            thumb.alt = '';
            thumb.loading = 'lazy';
            thumb.decoding = 'async';
            thumb.setAttribute('aria-hidden', 'true');
            thumb.addEventListener('error', () => thumb.remove());
            head.appendChild(thumb);
          }
          const title = document.createElement('strong'); title.textContent = displayText(pathway.name);
          const arrow = document.createElement('em'); arrow.textContent = '→';
          head.append(title, arrow);
          const line = document.createElement('span'); line.className = 'scene-route-line';
          const steps = (Array.isArray(pathway.steps) ? pathway.steps : []).slice(0, 5);
          line.style.setProperty('--lane-nodes', Math.max(2, steps.length));
          steps.forEach(step => {
            const node = document.createElement('span'); node.className = 'scene-route-node'; node.textContent = displayText(step);
            line.appendChild(node);
          });
          const caption = document.createElement('small'); caption.className = 'scene-route-caption';
          caption.textContent = entersChild
            ? `${displayText(childScene.title)} · 进入第 3 层区室`
            : `${displayText(pathway.compartment || scene.title || '')} · 点击查看通路详情`;
          lane.append(head, line, caption);
          sceneRouteLanes.appendChild(lane);
        });
      }

      // #20 ── 场景叠加层 ──────────────────────────────────────────────
      function renderSceneScope(scene, viewIndex = 0, hotspots = sceneHotspotsForView(scene, viewIndex), selectedPathwayId = null) {
        if (!sceneScope) return;
        sceneScopeTitle.textContent = scene.title || '细胞器';
        sceneScopeBoundary.textContent = sceneBoundaryText[scene.id] || displayText(scene.description || '当前场景的空间范围与代谢入口。');
        if (scopeLocalLabel) scopeLocalLabel.textContent = '本区室内';
        if (scopeExchangeLabel) scopeExchangeLabel.textContent = '输入 / 输出';
        if (scopeExchangeMeta) scopeExchangeMeta.textContent = '端点';
        if (scopeTransportLabel) scopeTransportLabel.textContent = '跨区室运输';
        scopeLocal.innerHTML = ''; scopeExchange.innerHTML = ''; scopeTransport.innerHTML = '';
        renderSceneRouteLanes(scene, hotspots, selectedPathwayId);
        const pathHotspots = hotspots.filter(hotspot => hotspot.pathway && coreStudyPathwaySet.has(hotspot.pathway) && atlas.pathways[hotspot.pathway]);
        const uniquePaths = [...new Map(pathHotspots.map(hotspot => [hotspot.pathway, hotspot])).values()];
        const targetHotspots = hotspots.filter(hotspot => hotspot.target);
        if (scene.id === 'cell-atlas') {
          targetHotspots.forEach(hotspot => appendScopeItem(scopeLocal, hotspot.label || hotspot.target, hotspot.tone || scene.tone, () => openScene(hotspot.target)));
          scopeLocalCount.textContent = `${targetHotspots.length} 个入口`;
          const hint = document.createElement('div'); hint.className = 'scope-empty'; hint.textContent = '先进入一个细胞器，再查看区室内通路。'; scopeExchange.appendChild(hint);
        } else {
          const childTargets = targetHotspots.filter(hotspot => atlas.scenes[hotspot.target]?.parent === scene.id);
          childTargets.forEach(hotspot => appendScopeItem(scopeLocal, sceneEntryLabel(hotspot), hotspot.tone || scene.tone, () => openScene(hotspot.target), '进入 →'));
          const transport = uniquePaths.filter(hotspot => {
            const pathway = atlas.pathways[hotspot.pathway];
            return sceneTransportIds.has(hotspot.pathway) || /穿梭|转运|运输|膜/.test(`${pathway.name} ${pathway.compartment || ''}`);
          });
          const declaredExchanges = Array.isArray(scene.exchanges) ? scene.exchanges : [];
          const crossTargetHotspots = targetHotspots.filter(hotspot => /进入线粒体|进入细胞质|进入内吞|进入过氧化物酶体|跨区室/.test(hotspot.label || ''));
          const local = uniquePaths.filter(hotspot => !transport.includes(hotspot));
          local.forEach(hotspot => {
            const pathway = atlas.pathways[hotspot.pathway];
            appendScopeItem(scopeLocal, pathway.name, hotspot.tone || scene.tone, () => openPathway(hotspot.pathway), '查看机制 →');
          });
          scopeLocalCount.textContent = `${childTargets.length + local.length} 个入口`;
          const exchanges = [];
          local.slice(0, 4).forEach(hotspot => {
            const pathway = atlas.pathways[hotspot.pathway];
            if (pathway.steps?.[0]) exchanges.push({ label: `输入 · ${pathway.steps[0]}`, pathway: hotspot.pathway, tone: hotspot.tone || scene.tone });
            if (pathway.steps?.length > 1) exchanges.push({ label: `输出 · ${pathway.steps[pathway.steps.length - 1]}`, pathway: hotspot.pathway, tone: hotspot.tone || scene.tone });
          });
          [...new Map(exchanges.map(item => [item.label, item])).values()].slice(0, 6).forEach(item => appendScopeItem(scopeExchange, item.label, item.tone, () => openPathway(item.pathway), '•'));
          if (!exchanges.length) { const hint = document.createElement('div'); hint.className = 'scope-empty'; hint.textContent = '当前视角没有独立的输入或输出标注。'; scopeExchange.appendChild(hint); }
          transport.forEach(hotspot => {
            const pathway = atlas.pathways[hotspot.pathway];
            appendScopeItem(scopeTransport, pathway.name, hotspot.tone || '#826ab1', () => openPathway(hotspot.pathway));
          });
          declaredExchanges.forEach(exchange => appendScopeItem(
            scopeTransport,
            exchange.label,
            exchange.tone || '#4c8b67',
            exchange.pathway && atlas.pathways[exchange.pathway] ? () => openPathway(exchange.pathway) : null,
            '↗'
          ));
          crossTargetHotspots.forEach(hotspot => appendScopeItem(scopeTransport, `跨区室 · ${hotspot.label}`, hotspot.tone || '#826ab1', () => openScene(hotspot.target), '↗'));
          scopeTransportCount.textContent = `${transport.length + declaredExchanges.length + crossTargetHotspots.length} 条连接`;
          if (!transport.length && !declaredExchanges.length && !crossTargetHotspots.length) { const hint = document.createElement('div'); hint.className = 'scope-empty'; hint.textContent = '本视角没有单独展开的跨区室通路。'; scopeTransport.appendChild(hint); }
        }
      }

      function pathwayReactionRows(pathwayId) {
        const pathway = atlas.pathways[pathwayId];
        // 步骤列表必须与机制图一致：优先取本通路自身的反应。
        // routeGroup（etc/transport 等）只是视觉分组，把兄弟通路的反应
        // 一并列进来会让氧化磷酸化混入整条呼吸链、穿梭混入全部转运。
        const own = reactions.filter(reaction => groupsFor(reaction).includes(pathwayId)
          && Boolean(expertReactionEndpoints(reaction)));
        if (own.length) return own;
        const routeGroup = routeGroupForPathway(pathwayId, pathway);
        return reactions.filter(reaction => {
          const groups = groupsFor(reaction);
          return Boolean(routeGroup) && groups.includes(routeGroup)
            && Boolean(expertReactionEndpoints(reaction));
        });
      }

      function closeSceneReactionDetail() {
        const pathwayId = sceneDeck.dataset.pathway || activePathway;
        sceneDeck.classList.remove('pathway-reaction-active');
        delete sceneDeck.dataset.reaction;
        sceneDeck.dataset.sceneLevel = '3';
        inspector.classList.remove('open');
        document.body.classList.remove('inspector-open', 'reaction-focus', 'entity-focus', 'enzyme-visible');
        setRegionHidden(inspector, true);
        selected = null;
        selectedType = null;
        if (pathwayId && pathwayId !== 'all' && setScenePathwayVisual(pathwayId, true)) updateSceneBackLabel();
      }

      function openSceneReactionDetail(reaction, pathwayId, stepIndex) {
        const pathway = atlas.pathways[pathwayId];
        const scene = atlas.scenes[currentSceneId];
        const endpoints = expertReactionEndpoints(reaction);
        if (!pathway || !scene || !endpoints || !sceneDeck.classList.contains('pathway-visual-active')) return;
        const { substrate, product } = endpoints;
        const direction = reaction.reversible ? '⇌' : '→';
        const groups = Array.isArray(reaction.group) ? reaction.group : [reaction.group];
        sceneDeck.classList.add('pathway-reaction-active');
        sceneDeck.dataset.sceneLevel = '4';
        sceneDeck.dataset.reaction = reaction.id;
        requestAnimationFrame(syncSceneExpertOverlayGeometry);
        sceneTitle.textContent = `${displayText(pathway.name)} · 第 ${stepIndex + 1} 步`;
        sceneSubtitle.textContent = '第 4 层 · 单步反应';
        sceneDescription.textContent = `${displayText(substrate.name)} ${direction} ${displayText(product.name)} · ${displayText(reaction.enzyme || '反应机制')}`;
        if (sceneLevelHint) sceneLevelHint.textContent = '第 4 层 · 单步反应 · 查看底物、产物与酶';
        openInspector({
          ...reaction,
          pathwayId,
          sceneId: scene.id,
          selectionType: 'reaction',
          kind: '单步反应',
          name: `${substrate.name} ${direction} ${product.name}`,
          latin: reaction.enzyme,
          info: reaction.info || `${displayText(pathway.name)}中的第 ${stepIndex + 1} 个反应步骤。`,
          enzymeProfile: enzymeProfileFor(reaction.enzyme, reaction),
          group: groups,
          compartment: pathway.compartment,
          hideFocusAction: true,
          meta: {
            底物: substrate.name,
            产物: product.name,
            酶: reaction.enzyme || '未单列',
            可逆性: reaction.reversible ? '可逆' : '不可逆'
          }
        });
        updateSceneBackLabel();
      }

      function loadSceneVisual(scene, label, src, immediate = false) {
        if (!scene || !src) return;
        const request = ++sceneImageRequest;
        sceneDeck.classList.add('loading');
        if (!immediate) sceneDeck.classList.add('switching');
        sceneSource.textContent = '图像加载中 · 知识关系仍来自代谢总图人工核对';
        let settled = false;
        const finish = async () => {
          if (settled) return;
          settled = true;
          try { await sceneBackground.decode(); } catch (_) {}
          if (request !== sceneImageRequest || currentSceneId !== scene.id) return;
          sceneBackground.alt = `${scene.title} · ${label}`;
          syncSceneExpertOverlayGeometry();
          requestAnimationFrame(() => sceneDeck.classList.remove('loading', 'switching'));
          sceneSource.textContent = `当前视角：${label} · 知识关系：代谢总图人工核对`;
        };
        sceneBackground.onload = finish;
        sceneBackground.onerror = () => {
          if (settled) return;
          settled = true;
          if (request !== sceneImageRequest) return;
          sceneDeck.classList.remove('loading', 'switching');
          sceneSource.textContent = '当前场景图片未加载 · 通路入口仍可使用';
        };
        sceneBackground.src = src;
        if (sceneBackground.complete && sceneBackground.naturalWidth > 0) finish();
      }

      function syncSceneExpertOverlayGeometry() {
        if (!sceneExpertOverlay || !sceneBackground || !sceneDeck) return;
        if (!sceneDeck.classList.contains('pathway-visual-active') || !sceneBackground.naturalWidth || !sceneBackground.naturalHeight) {
          sceneExpertOverlay.style.left = '';
          sceneExpertOverlay.style.top = '';
          sceneExpertOverlay.style.width = '';
          sceneExpertOverlay.style.height = '';
          return;
        }
        const imageRect = sceneBackground.getBoundingClientRect();
        const deckRect = sceneDeck.getBoundingClientRect();
        const style = getComputedStyle(sceneBackground);
        const padLeft = parseFloat(style.paddingLeft) || 0;
        const padRight = parseFloat(style.paddingRight) || 0;
        const padTop = parseFloat(style.paddingTop) || 0;
        const padBottom = parseFloat(style.paddingBottom) || 0;
        const contentWidth = Math.max(1, imageRect.width - padLeft - padRight);
        const contentHeight = Math.max(1, imageRect.height - padTop - padBottom);
        const sourceRatio = sceneBackground.naturalWidth / sceneBackground.naturalHeight;
        const contentRatio = contentWidth / contentHeight;
        const visualWidth = contentRatio > sourceRatio ? contentHeight * sourceRatio : contentWidth;
        const visualHeight = contentRatio > sourceRatio ? contentHeight : contentWidth / sourceRatio;
        const visualLeft = imageRect.left + padLeft + (contentWidth - visualWidth) / 2;
        const visualTop = imageRect.top + padTop + (contentHeight - visualHeight) / 2;
        sceneExpertOverlay.style.left = `${visualLeft - deckRect.left}px`;
        sceneExpertOverlay.style.top = `${visualTop - deckRect.top}px`;
        sceneExpertOverlay.style.width = `${visualWidth}px`;
        sceneExpertOverlay.style.height = `${visualHeight}px`;
        sceneExpertOverlay.style.setProperty('--overlay-text-x-scale', Math.min(1, visualHeight / Math.max(1, visualWidth)).toFixed(4));
      }

      function setSceneStructuralHeader(scene) {
        if (!scene) return;
        sceneTitle.textContent = scene.title;
        const depth = scene.parent && atlas.scenes[scene.parent]?.parent
          ? '区室结构'
          : scene.parent ? '细胞器结构' : '完整细胞';
        sceneSubtitle.textContent = `自由探索 · ${depth}`;
        sceneDescription.textContent = displayText(scene.description || '');
      }

      function setSceneMechanismHeader(scene, pathway) {
        if (!scene || !pathway) return;
        sceneTitle.textContent = displayText(pathway.name || scene.title);
        sceneSubtitle.textContent = '第 3 层 · 通路机制图';
        const scope = displayText(pathway.compartment || scene.title || '');
        const summary = displayText(pathway.summary || '按箭头追踪反应节点、酶与跨区室连接。');
        sceneDescription.textContent = scope ? `${scope} · ${summary}` : summary;
      }

      function setSceneView(index, immediate = false) {
        const scene = atlas.scenes[currentSceneId];
        if (!scene || !scene.views?.length) return;
        sceneDeck.classList.remove('pathway-visual-active', 'pathway-reaction-active');
        sceneDeck.dataset.sceneLevel = 'explore';
        delete sceneDeck.dataset.pathway;
        delete sceneDeck.dataset.reaction;
        if (sceneLevelHint) sceneLevelHint.textContent = '自由探索 · 细胞器与区室结构';
        setSceneStructuralHeader(scene);
        sceneBackground.tabIndex = -1;
        sceneBackground.removeAttribute('role');
        sceneBackground.removeAttribute('aria-label');
        currentSceneView = Math.max(0, Math.min(scene.views.length - 1, index));
        sceneViews.querySelectorAll('.scene-view').forEach(button => {
          button.classList.toggle('active', Number(button.dataset.sceneView) === currentSceneView);
        });
        const { label, src } = sceneViewEntry(scene, currentSceneView);
        renderSceneHotspots(scene, currentSceneView);
        loadSceneVisual(scene, label, src, immediate);
      }

      function setScenePathwayVisual(pathwayId, immediate = false) {
        const scene = atlas.scenes[currentSceneId];
        const pathway = atlas.pathways[pathwayId];
        if (!scene || !pathway || !pathwayBelongsToScene(pathwayId, currentSceneId)) return false;
        sceneDeck.classList.remove('pathway-reaction-active');
        sceneDeck.dataset.sceneLevel = '3';
        sceneDeck.dataset.pathway = pathwayId;
        delete sceneDeck.dataset.reaction;
        if (sceneLevelHint) sceneLevelHint.textContent = '第 3 层 · 通路机制图 · 选择反应步骤';
        setSceneMechanismHeader(scene, pathway);
        const sceneView = sceneViewEntry(scene, currentSceneView);
        const visual = expertPathwayVisualSources[pathwayId]
          ? expertPathwayVisualOverrides[pathwayId]
          : [sceneView.label || scene.title || '细胞器通路', sceneView.src];
        sceneDeck.classList.add('pathway-visual-active');
        sceneBackground.tabIndex = 0;
        sceneBackground.setAttribute('role', 'button');
        sceneBackground.setAttribute('aria-label', `查看${atlas.pathways[pathwayId]?.name || visual[0]}在${scene.title}中的位置`);
        sceneViews.querySelectorAll('.scene-view').forEach(button => {
          button.classList.toggle('active', button.dataset.pathwayView === pathwayId);
        });
        renderSceneHotspots(scene, currentSceneView, { pathwayId });
        loadSceneVisual(scene, visual[0], visual[1], immediate);
        renderSceneExpertOverlay(pathwayId);
        requestAnimationFrame(syncSceneExpertOverlayGeometry);
        return true;
      }

      function updateSceneBackLabel() {
        if (!sceneBack) return;
        if (sceneDeck.classList.contains('pathway-reaction-active')) {
          sceneBack.textContent = '← 返回通路机制图';
          sceneBack.setAttribute('aria-label', '返回当前通路的机制图');
          return;
        }
        if (sceneDeck.classList.contains('pathway-visual-active')) {
          sceneBack.textContent = '← 返回通路总览';
          sceneBack.setAttribute('aria-label', '返回当前通路的第 2 层总览');
          return;
        }
        const current = atlas.scenes[currentSceneId];
        const targetId = sceneHistory[sceneHistory.length - 1] || current?.parent;
        const target = targetId ? atlas.scenes[targetId] : null;
        sceneBack.textContent = target ? `← 返回${target.title}` : '← 返回专家地图';
        sceneBack.setAttribute('aria-label', target ? `返回${target.title}` : '返回专家地图');
      }

      // #21 ── 场景标注 ─────────────────────────────────────────────────
      function renderSceneExpertOverlay(pathwayId, targetLayer = sceneExpertOverlayLayer) {
        if (!targetLayer) return;
        targetLayer.replaceChildren();
        const pathway = atlas.pathways[pathwayId];
        if (!pathway) return;
        // 线路必须来自真实反应数据，而不是按通路名称画一条装饰性折线。
        // β-氧化的四步机制在当前知识表中以教材机制数据呈现，因此允许它走专属绘制分支。
        const schematicPathways = new Set(['malate_aspartate', 'glycerol_phosphate', 'pdh', 'beta_oxidation', 'tca', 'etc', 'oxphos', 'carnitine', 'ketone', 'urea', 'aa_carbon', 'transamination', 'glycolysis', 'gluconeogenesis', 'glycogenesis', 'glycogenolysis', 'ppp', 'fa_synthesis', 'purine', 'pyrimidine', 'nucleotide_degradation']);
        const rows = reactions.filter(reaction => groupsFor(reaction).includes(pathwayId) && entityById[reaction.from] && entityById[reaction.to]);
        if (!rows.length && !schematicPathways.has(pathwayId)) return;

        // 穿梭通路采用课本式“区室—载体—辅酶”机制图：保留当前细胞器照片，
        // 但把胞质侧、内膜和基质侧明确分层，避免只看见一圈难以解释的节点。
        if (schematicPathways.has(pathwayId)) {
          const svg = 'http://www.w3.org/2000/svg';
          const tone = expertPathwayToneById[pathwayId] || pathwayMeta[routeGroupForPathway(pathwayId, pathway) || pathwayId]?.tone || '#367c70';
          const group = document.createElementNS(svg, 'g');
          group.classList.add('overlay-schematic', `overlay-schematic-${pathwayId}`);
          group.style.setProperty('--schematic-tone', tone);
          const defs = document.createElementNS(svg, 'defs');
          const markerIds = {
            main: `scene-schematic-arrow-${pathwayId}-main`,
            cofactor: `scene-schematic-arrow-${pathwayId}-cofactor`,
            transporter: `scene-schematic-arrow-${pathwayId}-transporter`
          };
          const markerColors = { main: tone, cofactor: '#7d9141', transporter: '#315e8a' };
          Object.entries(markerIds).forEach(([kind, markerId]) => {
            const marker = document.createElementNS(svg, 'marker');
            marker.setAttribute('id', markerId); marker.setAttribute('viewBox', '0 0 10 10');
            marker.setAttribute('refX', '8'); marker.setAttribute('refY', '5');
            marker.setAttribute('markerWidth', '1.6'); marker.setAttribute('markerHeight', '1.6');
            marker.setAttribute('markerUnits', 'userSpaceOnUse'); marker.setAttribute('orient', 'auto-start-reverse');
            marker.setAttribute('overflow', 'visible');
            const arrow = document.createElementNS(svg, 'path');
            arrow.setAttribute('d', 'M 0 0 L 8.5 5 L 0 10 L 1.8 5 Z'); arrow.style.fill = markerColors[kind];
            // 白色描边让箭头在照片亮部/暗部都保持轮廓清晰。
            arrow.style.stroke = 'rgba(255,255,255,.9)';
            arrow.style.strokeWidth = '.6';
            arrow.style.strokeLinejoin = 'round';
            marker.appendChild(arrow); defs.appendChild(marker);
          });
          group.appendChild(defs);
          const add = (tag, attrs, textValue = '') => {
            const node = document.createElementNS(svg, tag);
            Object.entries(attrs).forEach(([key, value]) => node.setAttribute(key, value));
            if (textValue) node.textContent = textValue;
            group.appendChild(node); return node;
          };
          const routeKind = className => className.includes('schematic-transporter-route')
            ? 'transporter'
            : className.includes('schematic-cofactor-route') ? 'cofactor' : 'main';
          const routePath = (d, reversible = false, className = 'schematic-route') => {
            const kindClasses = className.includes('schematic-cofactor-route') ? ['schematic-cofactor-route']
              : className.includes('schematic-transporter-route') ? ['schematic-transporter-route'] : [];
            const glow = document.createElementNS(svg, 'path');
            glow.setAttribute('d', d);
            glow.setAttribute('class', ['schematic-route-glow', ...kindClasses].join(' '));
            const underlay = document.createElementNS(svg, 'path');
            underlay.setAttribute('d', d);
            underlay.setAttribute('class', ['schematic-route-underlay', ...kindClasses].join(' '));
            const pathNode = document.createElementNS(svg, 'path');
            pathNode.setAttribute('d', d); pathNode.setAttribute('class', className);
            const markerId = markerIds[routeKind(className)];
            pathNode.setAttribute('marker-end', `url(#${markerId})`);
            if (reversible) pathNode.setAttribute('marker-start', `url(#${markerId})`);
            group.insertBefore(glow, defs.nextSibling);
            group.insertBefore(underlay, glow.nextSibling);
            group.insertBefore(pathNode, underlay.nextSibling);
            return pathNode;
          };
          const line = (x1, y1, x2, y2, reversible = false, className = 'schematic-route') => {
            const dx = x2 - x1, dy = y2 - y1, length = Math.max(.01, Math.hypot(dx, dy));
            const kind = routeKind(className);
            const startInset = kind === 'transporter' ? 1.28 : kind === 'cofactor' ? 1.08 : (reversible ? 1.05 : .78);
            const endInset = kind === 'transporter' ? 1.35 : kind === 'cofactor' ? 1.16 : 1.14;
            const sx = x1 + dx / length * startInset, sy = y1 + dy / length * startInset;
            const ex = x2 - dx / length * endInset, ey = y2 - dy / length * endInset;
            return routePath(`M ${sx} ${sy} L ${ex} ${ey}`, reversible, className);
          };
          const label = (x, y, value, className = 'schematic-label', attrs = {}) => add('text', { x, y, 'text-anchor': 'middle', class: className, ...attrs }, value);
          const metabolite = (x, y, value) => {
            add('circle', { cx: x, cy: y, r: .95, class: 'schematic-node-halo' });
            add('circle', { cx: x, cy: y, r: .52, class: 'schematic-node' });
            label(x, y - 1.85, value);
          };
          // 机制节点不能只留下一个无语义的小圆点：每个连接点都要有可读名称。
          const namedNode = (x, y, value, role = '') => {
            add('circle', { cx: x, cy: y, r: 1.05, class: 'schematic-node-halo' });
            const attrs = role ? { 'data-role': role, 'aria-label': value } : { 'aria-label': value };
            add('circle', { cx: x, cy: y, r: .6, class: 'schematic-node', ...attrs });
            label(x, y - 1.95, value, 'schematic-node-label');
          };
          const stepBadge = (x, y, value) => {
            add('circle', { cx: x, cy: y, r: .95, class: 'schematic-step-halo' });
            add('circle', { cx: x, cy: y, r: .72, class: 'schematic-step-disc' });
            label(x, y + .34, String(value), 'schematic-step-number');
          };
          if (pathwayId === 'malate_aspartate' || pathwayId === 'glycerol_phosphate') {
            label(67, 24, `${pathway.name}机制图`, 'schematic-title');
            label(31, 25, '细胞质侧', 'schematic-compartment-title');
            label(61.5, 48, '线粒体内膜', 'schematic-compartment-title');
            label(32, 69, '基质侧', 'schematic-compartment-title');
          }

          if (pathwayId === 'tca') {
            const p = {
              citrate: [60, 36], isocitrate: [78, 45], alphaKg: [82, 61], succinyl: [73, 75],
              succinate: [56, 80], fumarate: [41, 74], malate: [34, 58], oaa: [40, 43], acetyl: [26, 48]
            };
            label(63, 25, '线粒体基质 · 三羧酸循环', 'schematic-title');
            label(48, 29, '柠檬酸合酶：乙酰-CoA + OAA → 柠檬酸', 'schematic-enzyme');
            metabolite(...p.citrate, '柠檬酸'); metabolite(...p.isocitrate, '异柠檬酸');
            metabolite(...p.alphaKg, 'α-酮戊二酸'); metabolite(...p.succinyl, '琥珀酰-CoA');
            metabolite(...p.succinate, '琥珀酸'); metabolite(...p.fumarate, '延胡索酸');
            metabolite(...p.malate, '苹果酸'); metabolite(...p.oaa, '草酰乙酸');
            metabolite(...p.acetyl, '乙酰-CoA');
            routePath('M 41.6 43 C 47 34, 53 34, 58.6 36', false, 'schematic-route');
            routePath('M 61.4 36 C 69 36, 76 40, 77 44', false, 'schematic-route');
            routePath('M 78.8 46 C 84 50, 85 55, 81.5 59.5', false, 'schematic-route');
            routePath('M 81 62 C 79 69, 76 72, 74 74', false, 'schematic-route');
            routePath('M 71.5 76 C 65 82, 61 83, 57.5 80', false, 'schematic-route');
            routePath('M 54.5 79 C 47 79, 43 77, 41.8 75', false, 'schematic-route');
            routePath('M 40 73 C 34 68, 32 63, 33.2 59.5', false, 'schematic-route');
            routePath('M 34 56 C 34 50, 35 46, 39 44', false, 'schematic-route');
            line(...p.acetyl, ...p.citrate);
            stepBadge(54, 33, 1); stepBadge(70, 40, 2); stepBadge(84, 52, 3); stepBadge(77, 69, 4);
            stepBadge(65, 82, 5); stepBadge(48, 80, 6); stepBadge(34, 67, 7); stepBadge(34, 49, 8);
            label(68, 40, '顺乌头酸酶', 'schematic-enzyme');
            label(87, 54, '异柠檬酸脱氢酶', 'schematic-enzyme');
            label(87, 56, 'NADH + CO₂', 'schematic-cofactor');
            label(76, 66, 'α-KGDH', 'schematic-enzyme');
            label(76, 68, 'NADH + CO₂', 'schematic-cofactor');
            label(63, 86, '琥珀酰-CoA 合成酶', 'schematic-enzyme');
            label(63, 88, 'GTP', 'schematic-cofactor');
            label(47, 87, '琥珀酸脱氢酶 · 复合体 II', 'schematic-enzyme');
            label(47, 89, 'FADH₂ → CoQH₂', 'schematic-cofactor');
            label(30, 69, '延胡索酸酶 · H₂O', 'schematic-enzyme');
            label(28, 52, '苹果酸脱氢酶', 'schematic-enzyme');
            label(28, 54, 'NADH', 'schematic-cofactor');
            label(61, 95, '每一轮：3 NADH · 1 FADH₂ · 1 GTP · 2 CO₂', 'schematic-output');
          } else if (pathwayId === 'pdh') {
            const p = {
              pyruvate: [25, 50], hydroxyethyl: [40, 50], acetylLipo: [56, 50], acetylCoa: [78, 50],
              e1: [34, 63], e2: [55, 63], e3: [68, 68], nad: [82, 68], nadh: [82, 80]
            };
            label(61, 25, '线粒体基质 · 丙酮酸脱氢酶复合体', 'schematic-title');
            label(50, 30, '不可逆氧化脱羧：丙酮酸 → 乙酰-CoA', 'schematic-enzyme');
            metabolite(...p.pyruvate, '丙酮酸');
            metabolite(...p.hydroxyethyl, '羟乙基-TPP');
            metabolite(...p.acetylLipo, '乙酰-硫辛酰胺');
            metabolite(...p.acetylCoa, '乙酰-CoA');
            add('circle', { cx: p.e1[0], cy: p.e1[1], r: 1.65, class: 'schematic-enzyme-node' });
            add('circle', { cx: p.e2[0], cy: p.e2[1], r: 1.65, class: 'schematic-enzyme-node' });
            add('circle', { cx: p.e3[0], cy: p.e3[1], r: 1.65, class: 'schematic-enzyme-node' });
            label(...p.e1, 'E1 · 脱羧酶', 'schematic-enzyme');
            label(...p.e2, 'E2 · 转乙酰酶', 'schematic-enzyme');
            label(...p.e3, 'E3 · 脱氢酶', 'schematic-enzyme');
            label(34, 68, 'TPP · 脱羧', 'schematic-cofactor');
            label(55, 68, '硫辛酰胺 · 接收乙酰基', 'schematic-cofactor');
            label(68, 76, 'FAD → FADH₂', 'schematic-cofactor');
            label(82, 76, 'NAD⁺', 'schematic-cofactor');
            label(82, 83, 'NADH + H⁺', 'schematic-cofactor');
            label(58, 39, 'CO₂', 'schematic-output');
            label(78, 39, 'CoA-SH', 'schematic-cofactor');
            line(...p.pyruvate, ...p.hydroxyethyl);
            line(...p.hydroxyethyl, ...p.acetylLipo);
            line(...p.acetylLipo, ...p.acetylCoa);
            routePath('M 25 48 C 28 42, 36 40, 40 48', false, 'schematic-route schematic-cofactor-route');
            routePath('M 56 52 C 59 58, 63 63, 67 66', false, 'schematic-route schematic-cofactor-route');
            routePath('M 70 68 C 75 65, 79 66, 81 68', false, 'schematic-route schematic-cofactor-route');
            routePath('M 82 70 C 86 73, 86 77, 82 80', false, 'schematic-route schematic-cofactor-route');
            routePath('M 68 66 C 63 63, 59 61, 56 61', true, 'schematic-route schematic-cofactor-route');
            line(58, 48, 58, 40, false, 'schematic-route schematic-cofactor-route');
            line(78, 48, 78, 40, false, 'schematic-route schematic-cofactor-route');
            stepBadge(32, 46, 1); stepBadge(48, 46, 2); stepBadge(67, 46, 3); stepBadge(84, 68, 4);
            label(51, 94, '总反应：丙酮酸 + CoA-SH + NAD⁺ → 乙酰-CoA + CO₂ + NADH + H⁺', 'schematic-output');
          } else if (pathwayId === 'beta_oxidation') {
            const p = {
              acyl: [25, 52], enoyl: [49, 40], hydroxy: [74, 52], keto: [74, 72],
              acetyl: [54, 84], shortened: [29, 71]
            };
            label(61, 25, '线粒体基质 · 脂肪酸 β-氧化四步循环', 'schematic-title');
            label(50, 30, '每轮切下 2 个碳：脂酰-CoA → 乙酰-CoA + 缩短脂酰-CoA', 'schematic-enzyme');
            metabolite(...p.acyl, '脂酰-CoA');
            metabolite(...p.enoyl, 'trans-Δ²-烯酰-CoA');
            metabolite(...p.hydroxy, 'L-β-羟脂酰-CoA');
            metabolite(...p.keto, 'β-酮脂酰-CoA');
            metabolite(...p.acetyl, '乙酰-CoA');
            metabolite(...p.shortened, '缩短脂酰-CoA');
            routePath('M 27 51 C 34 44, 41 41, 47.5 40', false, 'schematic-route');
            routePath('M 51 40 C 61 40, 68 44, 72.5 51', false, 'schematic-route');
            routePath('M 74 54 L 74 69', false, 'schematic-route');
            routePath('M 72 73 C 66 79, 60 82, 55.5 83', false, 'schematic-route');
            routePath('M 71 73 C 60 76, 43 76, 31 71', false, 'schematic-route');
            routePath('M 27 69 C 22 63, 22 56, 24 53', false, 'schematic-route');
            stepBadge(37, 43, 1); stepBadge(62, 43, 2); stepBadge(79, 61, 3); stepBadge(64, 77, 4);
            label(37, 35, '脂酰-CoA 脱氢酶', 'schematic-enzyme');
            label(37, 33, 'FAD → FADH₂ → ETF → CoQ', 'schematic-cofactor');
            label(62, 47, '烯酰-CoA 水合酶 · H₂O', 'schematic-enzyme');
            label(83, 63, 'β-羟脂酰-CoA 脱氢酶', 'schematic-enzyme');
            label(83, 65, 'NAD⁺ → NADH + H⁺', 'schematic-cofactor');
            label(64, 80, 'β-酮硫解酶 · CoA-SH', 'schematic-enzyme');
            label(54, 90, '乙酰-CoA → TCA；NADH 与 FADH₂ → 呼吸链', 'schematic-output');
            label(29, 78, '缩短 2C，进入下一轮', 'schematic-cofactor');
          } else if (pathwayId === 'etc') {
            const p = {
              nadh: [16, 69], c1: [29, 58], succinate: [16, 84], c2: [29, 78], coq: [45, 68],
              c3: [61, 58], cytc: [73, 45], c4: [84, 58], oxygen: [94, 70], water: [94, 84]
            };
            label(60, 24, '线粒体内膜 · 电子传递链', 'schematic-title');
            label(60, 30, '膜间隙侧：H⁺被泵出 · 基质侧：电子供体进入', 'schematic-enzyme');
            metabolite(...p.nadh, 'NADH'); metabolite(...p.c1, '复合体 I');
            metabolite(...p.succinate, '琥珀酸'); metabolite(...p.c2, '复合体 II');
            metabolite(...p.coq, 'CoQ / CoQH₂'); metabolite(...p.c3, '复合体 III');
            metabolite(...p.cytc, '细胞色素 c'); metabolite(...p.c4, '复合体 IV');
            metabolite(...p.oxygen, 'O₂'); metabolite(...p.water, 'H₂O');
            routePath('M 18 68 C 22 64, 25 61, 27 59', false, 'schematic-route');
            routePath('M 18 82 C 22 80, 25 79, 27 78', false, 'schematic-route');
            routePath('M 31 59 C 36 62, 40 65, 43 67', false, 'schematic-route');
            routePath('M 31 78 C 36 75, 40 71, 43 69', false, 'schematic-route');
            routePath('M 47 67 C 52 63, 56 59, 59 58', false, 'schematic-route');
            routePath('M 63 57 C 67 52, 70 48, 72 46', false, 'schematic-route');
            routePath('M 75 45 C 80 48, 82 53, 83 57', false, 'schematic-route');
            routePath('M 86 59 C 89 63, 91 67, 93 69', false, 'schematic-route');
            routePath('M 95 72 C 97 76, 97 81, 95 83', false, 'schematic-route');
            routePath('M 29 56 C 29 48, 28 42, 29 35', false, 'schematic-route schematic-cofactor-route');
            routePath('M 61 56 C 61 47, 61 41, 61 35', false, 'schematic-route schematic-cofactor-route');
            routePath('M 84 56 C 84 47, 84 41, 84 35', false, 'schematic-route schematic-cofactor-route');
            label(29, 49, '4H⁺', 'schematic-cofactor'); label(61, 49, '4H⁺', 'schematic-cofactor'); label(84, 49, '2H⁺', 'schematic-cofactor');
            label(25, 54, 'NADH 脱氢', 'schematic-enzyme'); label(23, 91, 'FADH₂ 入口', 'schematic-cofactor');
            label(38, 62, 'CoQ 还原', 'schematic-cofactor'); label(67, 52, 'Q循环', 'schematic-enzyme');
            label(78, 39, '可移动电子载体', 'schematic-cofactor'); label(91, 62, '末端受体', 'schematic-enzyme');
            stepBadge(23, 61, 1); stepBadge(38, 70, 2); stepBadge(55, 62, 3); stepBadge(78, 54, 4);
            label(60, 94, '电子方向：NADH / 琥珀酸 → CoQ → 复合体 III → Cyt c → O₂', 'schematic-output');
          } else if (pathwayId === 'oxphos') {
            const p = {
              // viewBox 是 0 0 100 100：任何 x>100 的节点和居中标签都会被裁掉，
              // 因此最右 ATP 合酶列压在 x=90，标签全部留在 100 以内。
              hHigh: [90, 35], hLow: [90, 75], atpSynthase: [90, 55],
              adpMatrix: [87, 66], piMatrix: [74, 78], atpMatrix: [81, 72],
              ant: [80, 55], atpIms: [84, 36], adpIms: [77, 36],
              piCarrier: [70, 55], piIms: [66, 36], piImported: [72, 69]
            };
            label(62, 24, '线粒体内膜 · 氧化磷酸化', 'schematic-title');
            label(36, 29, '膜间隙：质子动力势（Δψ + ΔpH）', 'schematic-enzyme');
            label(36, 89, '基质：F₁ 催化侧', 'schematic-enzyme');

            metabolite(...p.hHigh, 'H⁺'); metabolite(...p.hLow, 'H⁺');
            metabolite(...p.adpMatrix, 'ADP'); metabolite(...p.piMatrix, 'Pi'); metabolite(...p.atpMatrix, 'ATP');
            metabolite(...p.atpIms, 'ATP（输出）'); metabolite(...p.adpIms, 'ADP（输入）');
            metabolite(...p.piIms, 'Pi（输入）'); metabolite(...p.piImported, 'Pi');
            namedNode(...p.atpSynthase, 'ATP 合酶 F₀F₁', 'atp-synthase');
            namedNode(...p.ant, 'ANT 转位酶', 'ant');
            namedNode(...p.piCarrier, 'Pi/H⁺ 载体', 'phosphate-carrier');

            // ATP 合酶固定在底图最右侧的 F₀F₁ 结构：H⁺ 从膜间隙回流至基质，
            // F₁ 在基质侧催化 ADP + Pi → ATP。
            line(...p.hHigh, ...p.atpSynthase, false, 'schematic-route schematic-cofactor-route');
            line(...p.atpSynthase, ...p.hLow, false, 'schematic-route schematic-cofactor-route');
            line(...p.adpMatrix, ...p.atpSynthase, false, 'schematic-route');

            // ANT 与磷酸载体是两套独立转运机制，不能再画成 ATP 合酶的一部分。
            line(...p.atpIms, ...p.ant, true, 'schematic-route schematic-transporter-route');
            line(...p.ant, ...p.atpMatrix, true, 'schematic-route schematic-transporter-route');
            line(...p.adpIms, ...p.ant, true, 'schematic-route schematic-transporter-route');
            line(...p.ant, ...p.adpMatrix, false, 'schematic-route');
            line(...p.piIms, ...p.piCarrier, true, 'schematic-route schematic-transporter-route');
            line(...p.piCarrier, ...p.piImported, true, 'schematic-route schematic-transporter-route');
            line(...p.piImported, ...p.atpMatrix, false, 'schematic-route');
            line(...p.piMatrix, ...p.atpMatrix, false, 'schematic-route');
            // F₁ 生成的 ATP 沿右侧绕行进入 ATP 库，再交给 ANT 输出；
            // 不与 ANT/磷酸载体的转运线交叉。
            routePath('M 91.5 57 C 91.5 65, 89 69.5, 82.5 71.6', false, 'schematic-route');

            label(90, 30, 'H⁺回流驱动转子', 'schematic-cofactor');
            label(80, 44, 'ATP⁴⁻出 / ADP³⁻入', 'schematic-exchange');
            label(70, 44, 'Pi + H⁺入基质', 'schematic-exchange');
            label(86, 78, 'ADP + Pi → ATP', 'schematic-output');
            stepBadge(92.5, 44, 1); stepBadge(92, 78, 2); stepBadge(84, 48, 3); stepBadge(73, 48, 4);
            label(61, 94, '化学渗透偶联：质子回流、ATP 合成与核苷酸/磷酸转运分开定位', 'schematic-output');
          } else if (pathwayId === 'carnitine') {
            const p = {
              acylCoaCyt: [26, 36], carnitineCyt: [26, 46], acylCarnIms: [48, 42], coaCyt: [47, 33],
              acylCarnMatrix: [68, 61], coaMatrix: [76, 69], acylCoaMatrix: [88, 59],
              carnitineMatrix: [86, 74], carnitineReturn: [64, 65], carnitineCytReturn: [43, 52],
              cpt1: [39, 40], cact: [59, 50], cpt2: [78, 58]
            };
            label(61, 24, '线粒体双膜 · 肉碱穿梭', 'schematic-title');
            label(27, 29, '细胞质侧', 'schematic-compartment-title');
            label(47, 37, '外膜 / 膜间隙', 'schematic-compartment-title');
            label(72, 48, '内膜', 'schematic-compartment-title');
            label(88, 82, '基质侧', 'schematic-compartment-title');

            metabolite(...p.acylCoaCyt, '长链脂酰-CoA'); metabolite(...p.carnitineCyt, '肉碱');
            metabolite(...p.acylCarnIms, '脂酰肉碱'); metabolite(...p.coaCyt, 'CoA-SH · 胞质池');
            metabolite(...p.acylCarnMatrix, '脂酰肉碱'); metabolite(...p.coaMatrix, 'CoA-SH · 基质池');
            metabolite(...p.acylCoaMatrix, '脂酰-CoA'); metabolite(...p.carnitineMatrix, '游离肉碱');
            metabolite(...p.carnitineReturn, '肉碱'); metabolite(...p.carnitineCytReturn, '肉碱');
            namedNode(...p.cpt1, 'CPT1', 'cpt1');
            namedNode(...p.cact, 'CACT', 'cact');
            namedNode(...p.cpt2, 'CPT2', 'cpt2');

            // CPT1 位于外膜胞质侧：脂酰基转给肉碱，CoA 留在胞质池。
            routePath('M 27 36 C 31 37, 35 39, 38 40', false, 'schematic-route');
            routePath('M 27 45 C 32 44, 35 42, 38 40', false, 'schematic-route');
            routePath('M 40 40 C 43 40, 46 41, 47 42', false, 'schematic-route');
            routePath('M 39 39 C 42 36, 44 34, 46 33', false, 'schematic-route');

            // CACT 是严格的反向交换：脂酰肉碱入基质，同时游离肉碱出基质。
            routePath('M 49 43 C 53 45, 56 48, 58 50 C 61 54, 64 58, 67 60', false, 'schematic-route schematic-transporter-route');
            routePath('M 85 73 C 77 70, 70 67, 65 65 C 62 60, 60 55, 59 51 C 54 51, 49 51, 44 52', false, 'schematic-route schematic-transporter-route');
            routePath('M 42 51 C 36 50, 31 48, 27 46', false, 'schematic-route');

            // CPT2 位于内膜基质侧：使用独立基质 CoA 池再生脂酰-CoA。
            routePath('M 69 61 C 72 60, 75 59, 77 58', false, 'schematic-route');
            routePath('M 76 68 C 77 64, 78 61, 78 59', false, 'schematic-route');
            routePath('M 79 58 C 82 58, 85 59, 87 59', false, 'schematic-route');
            routePath('M 79 59 C 81 65, 83 70, 85 73', false, 'schematic-route');

            label(39, 45, 'CPT1 · 外膜胞质侧', 'schematic-transporter');
            label(59, 55, 'CACT · 内膜反向交换', 'schematic-transporter');
            label(78, 63, 'CPT2 · 内膜基质侧', 'schematic-transporter');
            label(54, 78, 'CoA 不跨内膜', 'schematic-cofactor');
            stepBadge(35, 37, 1); stepBadge(55, 46, 2); stepBadge(74, 56, 3);
            label(61, 94, '脂酰基借助肉碱跨内膜；胞质 CoA 池与基质 CoA 池彼此分开', 'schematic-output');
          } else if (pathwayId === 'ketone') {
            const p = { acetyl1: [20, 47], acetyl2: [20, 62], acoa: [37, 54], hmgcoa: [55, 54], acac: [72, 54], bhb: [88, 43], acetone: [88, 67], scot: [57, 79], succinyl: [43, 79], acetoacetylUse: [72, 79], acetylUse: [91, 79] };
            label(61, 24, '线粒体基质 · 酮体生成与利用', 'schematic-title');
            label(48, 30, '肝线粒体：乙酰-CoA 过剩时转成可输出酮体', 'schematic-enzyme');
            metabolite(...p.acetyl1, '乙酰-CoA'); metabolite(...p.acetyl2, '乙酰-CoA'); metabolite(...p.acoa, '乙酰乙酰-CoA');
            metabolite(...p.hmgcoa, 'HMG-CoA'); metabolite(...p.acac, '乙酰乙酸'); metabolite(...p.bhb, 'β-羟丁酸'); metabolite(...p.acetone, '丙酮');
            metabolite(...p.succinyl, '琥珀酰-CoA'); metabolite(...p.acetoacetylUse, '乙酰乙酰-CoA'); metabolite(...p.acetylUse, '2 乙酰-CoA');
            namedNode(...p.scot, 'SCOT', 'scot');
            routePath('M 22 48 C 27 48, 31 51, 35 53', false, 'schematic-route'); routePath('M 22 61 C 28 61, 31 58, 35 55', false, 'schematic-route');
            routePath('M 39 54 L 53 54', false, 'schematic-route'); routePath('M 57 54 L 70 54', false, 'schematic-route');
            routePath('M 74 53 C 79 49, 83 45, 86 44', false, 'schematic-route'); routePath('M 74 55 C 80 59, 83 64, 86 66', false, 'schematic-route');
            routePath('M 72 56 C 69 66, 63 75, 58 78', false, 'schematic-route schematic-transporter-route');
            routePath('M 45 79 L 56 79', false, 'schematic-route schematic-cofactor-route');
            routePath('M 58 79 L 70 79', false, 'schematic-route');
            routePath('M 74 79 L 89 79', false, 'schematic-route');
            label(29, 44, '硫解酶 · 2 个乙酰-CoA', 'schematic-enzyme'); label(46, 50, 'HMGCS2', 'schematic-enzyme');
            label(64, 50, 'HMG-CoA 裂解酶', 'schematic-enzyme'); label(84, 38, 'BDH1 · NADH', 'schematic-cofactor');
            label(85, 73, '自发脱羧', 'schematic-cofactor');
            label(57, 75, '外周组织 SCOT：琥珀酰-CoA → 琥珀酸', 'schematic-enzyme');
            label(82, 75, '硫解酶', 'schematic-enzyme');
            label(59, 89, '肝缺少 SCOT，只输出酸体；外周线粒体再生乙酰-CoA', 'schematic-note');
            stepBadge(30, 50, 1); stepBadge(46, 57, 2); stepBadge(64, 57, 3); stepBadge(80, 48, 4);
            label(60, 95, '乙酰乙酸 / β-羟丁酸经血液输出，外周组织再生乙酰-CoA', 'schematic-output');
          } else if (pathwayId === 'urea') {
            const p = {
              ammonia: [95, 38], bicarbonate: [86, 38], carbamoylP: [92, 49], ornM: [95, 61], citM: [86, 58],
              citC: [68, 58], asp: [54, 48], argSucc: [57, 69], fumarate: [70, 80],
              arginine: [43, 76], urea: [28, 84], ornC: [43, 88]
            };
            label(61, 24, '细胞质—线粒体基质 · 尿素循环', 'schematic-title');
            label(34, 30, '细胞质：ASS1 / ASL / ARG1', 'schematic-compartment-title');
            label(87, 30, '线粒体基质：CPS I / OTC', 'schematic-compartment-title');
            metabolite(...p.ammonia, 'NH₄⁺'); metabolite(...p.bicarbonate, 'HCO₃⁻'); metabolite(...p.carbamoylP, '氨甲酰磷酸');
            metabolite(...p.ornM, '鸟氨酸'); metabolite(...p.citM, '瓜氨酸'); metabolite(...p.citC, '瓜氨酸'); metabolite(...p.asp, '天冬氨酸');
            metabolite(...p.argSucc, '精氨代琥珀酸'); metabolite(...p.fumarate, '延胡索酸');
            metabolite(...p.arginine, '精氨酸'); metabolite(...p.urea, '尿素'); metabolite(...p.ornC, '鸟氨酸');

            // 基质内装入第一份氮：CPS I 合成氨甲酰磷酸，OTC 生成瓜氨酸。
            routePath('M 94 39 C 93.5 42, 93 46, 92.5 48', false, 'schematic-route');
            routePath('M 87 39 C 88 42, 90 46, 91 48', false, 'schematic-route');
            routePath('M 94 60.5 C 91 60, 89 59.5, 87 58.5', false, 'schematic-route');
            routePath('M 92 51 C 91 54, 89 56, 87 57', false, 'schematic-route');

            // ORNT1 在内膜上交换瓜氨酸与鸟氨酸；两条路线分开绘制。
            routePath('M 84 58 C 79 58, 74 58, 69 58', false, 'schematic-route schematic-transporter-route');
            routePath('M 44 87 C 60 88, 80 78, 94 62', false, 'schematic-route schematic-transporter-route');

            // 细胞质阶段：第二份氮来自天冬氨酸，ASL 分出延胡索酸，ARG1 释放尿素。
            routePath('M 67 59 C 63 62, 60 66, 58 68', false, 'schematic-route');
            routePath('M 55 50 C 56 56, 57 63, 57 68', false, 'schematic-route');
            routePath('M 55 70 C 51 72, 47 74, 44 75', false, 'schematic-route');
            routePath('M 59 70 C 63 73, 67 77, 69 79', false, 'schematic-route');
            routePath('M 41 77 C 36 79, 32 82, 29 83', false, 'schematic-route');
            routePath('M 43 78 L 43 86', false, 'schematic-route');

            label(88, 43, 'CPS I · 2 ATP · NAG 激活', 'schematic-enzyme', { 'data-role': 'cps1-label' });
            label(94, 55, 'OTC', 'schematic-enzyme');
            // 把两个长标签从瓜氨酸节点上下移开：ORNT1 靠近内膜交换线，
            // ASS1 放到细胞质侧的空白带，节点名称仍紧贴各自代谢物。
            label(73, 41, 'ORNT1', 'schematic-transporter', { 'data-role': 'ornt1-label' });
            label(73, 44, '瓜氨酸出 · 鸟氨酸入', 'schematic-exchange', { 'data-role': 'ornt1-exchange' });
            label(45, 57, 'ASS1 · ATP→AMP + PPi', 'schematic-enzyme', { 'data-role': 'ass1-label' });
            label(50, 72, 'ASL', 'schematic-enzyme');
            label(34, 78, 'ARG1', 'schematic-enzyme');
            stepBadge(91, 46, 1); stepBadge(91, 57, 2); stepBadge(62, 64, 3); stepBadge(51, 71, 4); stepBadge(36, 80, 5);
            label(61, 95, '两份氮：NH₄⁺ + 天冬氨酸 → 尿素；鸟氨酸被再生', 'schematic-output');
          } else if (pathwayId === 'aa_carbon') {
            const p = { amino: [18, 51], carbon: [36, 51], pyruvate: [58, 34], acetyl: [77, 38], acetoacetyl: [88, 52], akg: [77, 66], succinyl: [58, 78], fumarate: [39, 76], oaa: [24, 66] };
            const q = {
              amino: [21, 48], carbon: [38, 48], interface: [65, 52],
              pyruvate: [75, 36], acetyl: [91, 38], acetoacetyl: [93, 52],
              akg: [92, 66], succinyl: [81, 79], fumarate: [69, 76], oaa: [71, 63]
            };
            label(61, 24, '细胞质—线粒体 · 氨基酸碳骨架归宿', 'schematic-title');
            label(31, 31, '细胞质：转氨 / 脱氨后得到碳骨架', 'schematic-compartment-title');
            label(86, 30, '线粒体基质：7 类中央代谢入口', 'schematic-compartment-title');
            metabolite(...q.amino, '氨基酸'); metabolite(...q.carbon, '碳骨架');
            metabolite(...q.pyruvate, '丙酮酸'); metabolite(...q.acetyl, '乙酰-CoA');
            metabolite(...q.acetoacetyl, '乙酰乙酰-CoA'); metabolite(...q.akg, 'α-酮戊二酸');
            metabolite(...q.succinyl, '琥珀酰-CoA'); metabolite(...q.fumarate, '延胡索酸'); metabolite(...q.oaa, '草酰乙酸');
            namedNode(...q.interface, '碳骨架跨区室接口', 'carbon-interface');
            line(...q.amino, ...q.carbon);
            routePath('M 40 48 C 49 48, 57 50, 64 52', false, 'schematic-route schematic-transporter-route');
            routePath('M 66 51 C 69 45, 72 40, 74 37', false, 'schematic-route');
            routePath('M 66 51 C 74 44, 82 40, 90 38', false, 'schematic-route');
            routePath('M 66 52 C 77 51, 85 51, 92 52', false, 'schematic-route');
            routePath('M 66 53 C 75 58, 84 63, 91 66', false, 'schematic-route');
            routePath('M 65 54 C 70 64, 76 74, 80 78', false, 'schematic-route');
            routePath('M 64 54 C 65 63, 67 70, 69 75', false, 'schematic-route');
            routePath('M 64 53 C 67 57, 69 60, 70 62', false, 'schematic-route');
            label(29, 44, 'PLP 转氨 / 氧化脱氨', 'schematic-enzyme');
            label(54, 45, '按碳骨架种类分流', 'schematic-transporter');
            label(83, 33, '生酮入口', 'schematic-output');
            label(84, 72, 'TCA 补充入口', 'schematic-cofactor');
            label(60, 94, '生糖：丙酮酸或 TCA 中间体 · 生酮：乙酰-CoA / 乙酰乙酰-CoA', 'schematic-output');
            if (false) {
            label(61, 24, '细胞质—线粒体 · 氨基酸碳骨架归宿', 'schematic-title');
            label(43, 30, '脱去氨基后，碳骨架汇入 7 类中央代谢入口', 'schematic-enzyme');
            metabolite(...p.amino, '氨基酸'); metabolite(...p.carbon, '碳骨架'); metabolite(...p.pyruvate, '丙酮酸');
            metabolite(...p.acetyl, '乙酰-CoA'); metabolite(...p.acetoacetyl, '乙酰乙酰-CoA'); metabolite(...p.akg, 'α-KG');
            metabolite(...p.succinyl, '琥珀酰-CoA'); metabolite(...p.fumarate, '延胡索酸'); metabolite(...p.oaa, '草酰乙酸');
            line(...p.amino, ...p.carbon);
            routePath('M 38 50 C 45 43, 51 37, 56 35', false, 'schematic-route');
            routePath('M 38 50 C 51 44, 64 40, 75 38', false, 'schematic-route');
            routePath('M 38 51 C 58 50, 76 50, 86 52', false, 'schematic-route');
            routePath('M 38 52 C 52 58, 65 63, 75 66', false, 'schematic-route');
            routePath('M 37 53 C 45 63, 52 73, 57 77', false, 'schematic-route');
            routePath('M 35 53 C 36 62, 38 69, 39 74', false, 'schematic-route');
            routePath('M 34 52 C 30 57, 27 62, 25 65', false, 'schematic-route');
            label(27, 47, '转氨 / 脱氨', 'schematic-enzyme'); label(68, 30, '生糖入口', 'schematic-cofactor');
            label(84, 34, '生酮入口', 'schematic-output'); label(66, 72, 'TCA 补充入口', 'schematic-cofactor');
            label(61, 94, '生糖：丙酮酸或 TCA 中间体 · 生酮：乙酰-CoA / 乙酰乙酰-CoA', 'schematic-output');
            }
          } else if (pathwayId === 'transamination') {
            const p = { amino: [20, 43], akg: [20, 67], keto: [47, 43], glutamate: [47, 67], matrixGlu: [69, 67], ammonia: [86, 55], urea: [86, 78] };
            const q = {
              amino: [21, 39], akgC: [21, 58], keto: [43, 39], glutamateC: [43, 58], carrier: [66, 57],
              glutamateM: [78, 57], akgM: [92, 67], ammonia: [92, 43], urea: [92, 80]
            };
            label(61, 24, '细胞质—线粒体 · 转氨与氧化脱氨', 'schematic-title');
            label(31, 30, '细胞质：转氨酶用 PLP 转移氨基', 'schematic-compartment-title');
            label(86, 30, '线粒体基质：谷氨酸氧化脱氨', 'schematic-compartment-title');
            metabolite(...q.amino, '氨基酸'); metabolite(...q.akgC, 'α-酮戊二酸');
            metabolite(...q.keto, '对应 α-酮酸'); metabolite(...q.glutamateC, '谷氨酸（胞质）');
            metabolite(...q.glutamateM, '谷氨酸（基质）'); metabolite(...q.akgM, 'α-酮戊二酸');
            metabolite(...q.ammonia, 'NH₄⁺'); metabolite(...q.urea, '尿素循环第一步');
            namedNode(...q.carrier, '谷氨酸载体', 'glutamate-carrier');

            routePath('M 23 39 C 30 38, 36 38, 41 39', true, 'schematic-route');
            routePath('M 23 57 C 30 55, 36 55, 42 57', true, 'schematic-route');
            routePath('M 42 41 C 38 46, 38 52, 42 56', true, 'schematic-route schematic-cofactor-route');
            routePath('M 45 58 C 53 58, 59 58, 65 57', false, 'schematic-route schematic-transporter-route');
            routePath('M 67 57 C 71 57, 74 57, 77 57', false, 'schematic-route schematic-transporter-route');
            routePath('M 80 56 C 84 51, 88 46, 91 44', false, 'schematic-route');
            routePath('M 80 58 C 84 61, 88 65, 91 66', false, 'schematic-route');
            routePath('M 92 45 L 92 78', false, 'schematic-route schematic-cofactor-route');

            label(32, 35, 'ALT / AST · PLP', 'schematic-enzyme');
            label(32, 63, '氨基集中到谷氨酸', 'schematic-cofactor');
            label(59, 53, '谷氨酸载体', 'schematic-transporter');
            label(85, 52, '谷氨酸脱氢酶', 'schematic-enzyme');
            label(85, 61, 'NAD(P)⁺ → NAD(P)H', 'schematic-cofactor');
            label(94, 72, '基质排氮入口', 'schematic-output');
            stepBadge(32, 42, 1); stepBadge(66, 54, 2); stepBadge(86, 47, 3);
            label(60, 94, '转氨反应不释放游离氨；基质 GDH 产生 NH₄⁺，再交给 CPS I', 'schematic-output');
            if (false) {
            label(61, 24, '细胞质—线粒体 · 转氨与氧化脱氨', 'schematic-title');
            label(34, 31, '细胞质转氨：PLP 暂时接收并转移氨基', 'schematic-enzyme');
            metabolite(...p.amino, '氨基酸'); metabolite(...p.akg, 'α-KG'); metabolite(...p.keto, 'α-酮酸'); metabolite(...p.glutamate, '谷氨酸');
            metabolite(...p.matrixGlu, '谷氨酸基质'); metabolite(...p.ammonia, 'NH₄⁺'); metabolite(...p.urea, '尿素循环');
            routePath('M 22 43 C 31 42, 39 42, 45 43', false, 'schematic-route');
            routePath('M 22 66 C 31 63, 39 62, 45 66', false, 'schematic-route');
            routePath('M 45 45 C 40 51, 40 58, 46 65', true, 'schematic-route');
            routePath('M 49 67 L 67 67', false, 'schematic-route schematic-transporter-route');
            routePath('M 71 66 C 77 61, 81 57, 84 56', false, 'schematic-route');
            routePath('M 86 57 L 86 76', false, 'schematic-route');
            label(34, 39, 'ALT / AST · PLP', 'schematic-enzyme'); label(34, 72, '氨基集中到谷氨酸', 'schematic-cofactor');
            label(59, 63, '进入线粒体基质', 'schematic-transporter'); label(77, 63, '谷氨酸脱氢酶', 'schematic-enzyme');
            label(78, 69, 'NAD(P)⁺ → NAD(P)H', 'schematic-cofactor'); label(87, 70, '排氮入口', 'schematic-output');
            stepBadge(34, 46, 1); stepBadge(58, 67, 2); stepBadge(78, 59, 3);
            label(60, 94, '氨基被集中到谷氨酸，再以 NH₄⁺送入尿素循环', 'schematic-output');
            }
          } else if (pathwayId === 'glycolysis') {
            const p = { glucose: [22, 34], g6p: [41, 34], f6p: [59, 34], f16bp: [78, 34], g3p: [84, 51], bpg: [76, 68], pg3: [60, 78], pg2: [43, 78], pep: [27, 68], pyruvate: [20, 51] };
            label(61, 24, '细胞质 · 糖酵解十步主干', 'schematic-title');
            metabolite(...p.glucose, '葡萄糖'); metabolite(...p.g6p, 'G6P'); metabolite(...p.f6p, 'F6P'); metabolite(...p.f16bp, 'F-1,6-BP');
            metabolite(...p.g3p, 'G3P ×2'); metabolite(...p.bpg, '1,3-BPG'); metabolite(...p.pg3, '3-PG'); metabolite(...p.pg2, '2-PG'); metabolite(...p.pep, 'PEP'); metabolite(...p.pyruvate, '丙酮酸 ×2');
            line(...p.glucose, ...p.g6p); line(...p.g6p, ...p.f6p, true); line(...p.f6p, ...p.f16bp); routePath('M 79 36 C 83 40, 85 45, 84 49', false, 'schematic-route');
            routePath('M 83 53 C 82 59, 79 64, 77 67', false, 'schematic-route'); line(...p.bpg, ...p.pg3); line(...p.pg3, ...p.pg2, true); line(...p.pg2, ...p.pep, true);
            routePath('M 26 67 C 22 63, 20 57, 20 53', false, 'schematic-route');
            label(31, 30, '己糖激酶 · ATP→ADP', 'schematic-enzyme'); label(69, 30, 'PFK-1 · ATP→ADP', 'schematic-enzyme');
            label(82, 43, '醛缩酶 / TPI', 'schematic-enzyme'); label(84, 60, 'GAPDH · NAD⁺→NADH', 'schematic-cofactor');
            label(68, 73, 'PGK · ADP→ATP', 'schematic-cofactor'); label(35, 73, '烯醇化酶 · H₂O', 'schematic-enzyme'); label(21, 60, '丙酮酸激酶 · ADP→ATP', 'schematic-cofactor');
            stepBadge(31, 37, 1); stepBadge(68, 37, 3); stepBadge(83, 58, 6); stepBadge(68, 80, 7); stepBadge(23, 61, 10);
            label(61, 94, '净反应：葡萄糖 → 2 丙酮酸 + 2 ATP + 2 NADH', 'schematic-output');
          } else if (pathwayId === 'gluconeogenesis') {
            const p = { pyruvate: [18, 78], oaa: [31, 67], pep: [47, 57], f16bp: [62, 47], f6p: [74, 47], g6p: [85, 36], glucose: [95, 36] };
            const q = { pyruvate: [96, 77], oaa: [91, 67], pep: [73, 57], f16bp: [55, 48], f6p: [44, 48], g6p: [31, 40], glucose: [20, 36], g6pase: [27, 32] };
            label(61, 22, '线粒体—细胞质—内质网 · 糖异生', 'schematic-title');
            label(91, 87, '线粒体基质：PC 生成 OAA', 'schematic-compartment-title');
            label(59, 31, '细胞质：PEPCK 与逆糖酵解主干', 'schematic-compartment-title');
            label(39, 27, 'ER 膜 / 腔：G6Pase', 'schematic-compartment-title', { 'data-role': 'er-title' });
            metabolite(...q.pyruvate, '丙酮酸'); metabolite(...q.oaa, '草酰乙酸'); metabolite(...q.pep, 'PEP');
            metabolite(...q.f16bp, 'F-1,6-BP'); metabolite(...q.f6p, 'F6P'); metabolite(...q.g6p, 'G6P'); metabolite(...q.glucose, '葡萄糖');
            namedNode(...q.g6pase, 'G6P 转位酶', 'g6pase-er');
            line(...q.pyruvate, ...q.oaa);
            routePath('M 90 66 C 84 63, 78 60, 74 58', false, 'schematic-route schematic-transporter-route');
            line(...q.pep, ...q.f16bp); line(...q.f16bp, ...q.f6p);
            routePath('M 43 47 C 39 44, 35 42, 32 41', false, 'schematic-route');
            routePath('M 30 39 C 29 36, 28 34, 27 33', false, 'schematic-route schematic-transporter-route');
            routePath('M 26 31 C 24 32, 22 34, 21 35', false, 'schematic-route');
            label(86, 73, '丙酮酸羧化酶 · ATP · 生物素', 'schematic-enzyme');
            label(81, 58, 'OAA 以苹果酸 / 天冬氨酸形式出基质', 'schematic-transporter');
            label(67, 53, 'PEPCK · GTP → GDP', 'schematic-enzyme');
            label(51, 44, '果糖-1,6-二磷酸酶', 'schematic-enzyme');
            label(30, 36, 'G6P 转运入 ER', 'schematic-transporter');
            label(22, 31, '葡萄糖-6-磷酸酶', 'schematic-enzyme');
            stepBadge(96, 73, 1); stepBadge(81, 61, 2); stepBadge(52, 51, 3); stepBadge(25, 36, 4);
            label(61, 94, '三个不可逆关卡分属基质、细胞质与 ER；肝肾可释放游离葡萄糖', 'schematic-output');
            if (false) {
            label(61, 22, '线粒体—细胞质—内质网 · 糖异生', 'schematic-title');
            add('line', { x1: 14, y1: 63, x2: 96, y2: 63, class: 'schematic-boundary' }); add('line', { x1: 61, y1: 31, x2: 97, y2: 31, class: 'schematic-boundary' });
            label(23, 87, '线粒体基质', 'schematic-compartment-title'); label(55, 60, '细胞质', 'schematic-compartment-title'); label(83, 28, '内质网腔侧', 'schematic-compartment-title');
            metabolite(...p.pyruvate, '丙酮酸'); metabolite(...p.oaa, '草酰乙酸'); metabolite(...p.pep, 'PEP'); metabolite(...p.f16bp, 'F-1,6-BP'); metabolite(...p.f6p, 'F6P'); metabolite(...p.g6p, 'G6P'); metabolite(...p.glucose, '葡萄糖');
            line(...p.pyruvate, ...p.oaa); line(...p.oaa, ...p.pep); line(...p.pep, ...p.f16bp); line(...p.f16bp, ...p.f6p); routePath('M 76 46 C 79 42, 82 39, 84 37', false, 'schematic-route'); line(...p.g6p, ...p.glucose);
            label(24, 72, '丙酮酸羧化酶 · ATP · 生物素', 'schematic-enzyme'); label(39, 61, 'PEPCK · GTP→GDP', 'schematic-enzyme');
            label(54, 52, '逆糖酵解可逆步骤', 'schematic-cofactor'); label(68, 43, '果糖-1,6-二磷酸酶', 'schematic-enzyme'); label(90, 32, '葡萄糖-6-磷酸酶', 'schematic-enzyme');
            stepBadge(25, 72, 1); stepBadge(40, 62, 2); stepBadge(68, 50, 3); stepBadge(90, 39, 4);
            label(61, 94, '绕过三个不可逆关卡；肝肾通过 ER 内 G6Pase 释放葡萄糖', 'schematic-output');
            }
          } else if (pathwayId === 'glycogenesis') {
            const p = { glucose: [19, 48], g6p: [35, 48], g1p: [51, 48], udpGlc: [62, 48], glycogenin: [69, 60], glycogen: [76, 48], branch: [76, 70] };
            label(61, 24, '细胞质 · 糖原合成', 'schematic-title');
            metabolite(...p.glucose, '葡萄糖'); metabolite(...p.g6p, 'G6P'); metabolite(...p.g1p, 'G1P'); metabolite(...p.udpGlc, 'UDP-葡萄糖'); metabolite(...p.glycogenin, '糖原蛋白'); metabolite(...p.glycogen, '糖原主链'); metabolite(...p.branch, '分支糖原');
            line(...p.glucose, ...p.g6p); line(...p.g6p, ...p.g1p, true); line(...p.g1p, ...p.udpGlc); routePath('M 64 49 C 66 52, 67 55, 68 58', false, 'schematic-route'); routePath('M 71 58 C 73 54, 74 51, 75 50', false, 'schematic-route'); line(...p.glycogen, ...p.branch);
            label(27, 44, '己糖激酶', 'schematic-enzyme'); label(43, 44, '磷酸葡萄糖变位酶', 'schematic-enzyme'); label(54, 44, 'UTP · UDP-葡萄糖焦磷酸化酶', 'schematic-cofactor');
            label(63, 65, '自糖基化引物', 'schematic-enzyme'); label(69, 52, '糖原合酶 · α-1,4', 'schematic-enzyme'); label(76, 74, '分支酶 · α-1,6', 'schematic-enzyme');
            stepBadge(27, 51, 1); stepBadge(43, 51, 2); stepBadge(54, 51, 3); stepBadge(71, 49, 4); stepBadge(80, 62, 5);
            label(60, 89, '储存方向：G6P → UDP-葡萄糖 → 多分支糖原颗粒', 'schematic-output');
          } else if (pathwayId === 'glycogenolysis') {
            const p = { glycogen: [20, 44], branch: [14, 36], freeGlucose: [24, 28], g1p: [48, 48], g6p: [67, 48], glycolysis: [87, 40], glucose: [87, 68] };
            label(61, 24, '细胞质 · 糖原分解', 'schematic-title');
            metabolite(...p.glycogen, '糖原非还原端'); metabolite(...p.branch, 'α-1,6 分支'); metabolite(...p.freeGlucose, '少量游离葡萄糖'); metabolite(...p.g1p, 'G1P'); metabolite(...p.g6p, 'G6P'); metabolite(...p.glycolysis, '肌肉糖酵解'); metabolite(...p.glucose, '肝血糖输出');
            routePath('M 22 45 C 30 46, 39 47, 46 47.5', false, 'schematic-route');
            routePath('M 15 35 C 17 33, 20 30.5, 22 29.5', false, 'schematic-route schematic-cofactor-route');
            routePath('M 15 37 C 24 41, 36 45, 46 47.5', false, 'schematic-route');
            line(...p.g1p, ...p.g6p, true);
            routePath('M 69 47 C 76 44, 81 42, 85 41', false, 'schematic-route'); routePath('M 69 49 C 76 55, 82 62, 85 67', false, 'schematic-route');
            label(28, 43, '糖原磷酸化酶 · Pi', 'schematic-enzyme'); label(30, 31, '去分支酶：转移酶 + α-1,6-糖苷酶', 'schematic-enzyme', { 'data-role': 'debranching-label' }); label(57, 45.5, '磷酸葡萄糖变位酶', 'schematic-enzyme');
            label(78, 45, '肌：直接供能', 'schematic-cofactor'); label(79, 63, '肝：ER 内 G6Pase', 'schematic-cofactor');
            stepBadge(36, 46.5, 1); stepBadge(10, 38, 2); stepBadge(62, 51, 3); stepBadge(78, 52, 4);
            label(60, 89, '磷酸解节省 1 个 ATP；肝可释糖，肌肉主要自用', 'schematic-output');
          } else if (pathwayId === 'ppp') {
            const p = { g6p: [18, 50], pgl: [34, 50], pg6: [49, 50], ru5p: [65, 50], r5p: [82, 37], x5p: [82, 62], f6p: [92, 76], g3p: [70, 78] };
            label(61, 24, '细胞质 · 磷酸戊糖途径', 'schematic-title');
            metabolite(...p.g6p, 'G6P'); metabolite(...p.pgl, '6-P-葡萄糖酸内酯'); metabolite(...p.pg6, '6-磷酸葡萄糖酸'); metabolite(...p.ru5p, 'Ru5P');
            metabolite(...p.r5p, 'R5P'); metabolite(...p.x5p, 'X5P'); metabolite(...p.f6p, 'F6P'); metabolite(...p.g3p, 'G3P');
            line(...p.g6p, ...p.pgl); line(...p.pgl, ...p.pg6); line(...p.pg6, ...p.ru5p); routePath('M 67 49 C 72 44, 77 39, 80 38', false, 'schematic-route'); routePath('M 67 51 C 72 55, 77 59, 80 61', false, 'schematic-route');
            routePath('M 83 63 C 87 68, 90 73, 91 75', true, 'schematic-route'); routePath('M 81 63 C 77 69, 73 74, 71 77', true, 'schematic-route');
            label(26, 45, 'G6PD · NADP⁺→NADPH', 'schematic-cofactor'); label(42, 45, '内酯酶 · H₂O', 'schematic-enzyme'); label(57, 45, '6PGDH · NADPH + CO₂', 'schematic-cofactor');
            label(75, 34, '核糖-5-P · 核苷酸', 'schematic-output'); label(82, 68, '转酮酶(TPP) / 转醛酶', 'schematic-enzyme');
            stepBadge(26, 53, 1); stepBadge(42, 53, 2); stepBadge(57, 53, 3); stepBadge(74, 53, 4);
            label(61, 91, '氧化支产生 NADPH；非氧化支在 R5P 与 F6P/G3P 间可逆转换', 'schematic-output');
          } else if (pathwayId === 'fa_synthesis') {
            const p = {
              citrate: [23, 42], acetyl: [38, 42], malonyl: [54, 42], fas: [67, 54],
              palmitate: [79, 54], erEnzyme: [88, 68], elongation: [96, 78], nadph: [52, 72]
            };
            label(61, 24, '细胞质—平滑内质网 · 脂肪酸合成', 'schematic-title');
            label(38, 31, '细胞质：棕榈酸主干合成', 'schematic-compartment-title');
            label(91, 85, '平滑 ER：延长 / 去饱和', 'schematic-compartment-title');
            metabolite(...p.citrate, '柠檬酸（胞质）'); metabolite(...p.acetyl, '乙酰-CoA');
            metabolite(...p.malonyl, '丙二酰-CoA'); metabolite(...p.fas, '脂肪酸合酶 FAS');
            metabolite(...p.palmitate, '棕榈酸 C16'); metabolite(...p.elongation, '长链 / 不饱和脂肪酸');
            metabolite(...p.nadph, 'NADPH');
            namedNode(...p.erEnzyme, 'ELOVL / 去饱和酶', 'er-elongation');

            line(...p.citrate, ...p.acetyl); line(...p.acetyl, ...p.malonyl);
            // 乙酰-CoA 作为引物、丙二酰-CoA 作为 2C 供体，分别进入 FAS，不再画成单一直线反应。
            routePath('M 37 43 C 44 49, 55 52, 65 54', false, 'schematic-route schematic-cofactor-route');
            routePath('M 53 43 C 58 47, 62 51, 65 53', false, 'schematic-route');
            line(...p.fas, ...p.palmitate);
            routePath('M 80 55 C 83 59, 86 63, 87.5 67', false, 'schematic-route');
            routePath('M 88.7 69 C 91 72, 93 75, 95 77', false, 'schematic-route');
            routePath('M 54 71 C 58 65, 62 59, 65 56', false, 'schematic-route schematic-cofactor-route');

            label(27, 38, 'ATP-柠檬酸裂解酶', 'schematic-enzyme');
            label(45, 38, 'ACC · ATP + HCO₃⁻ · 生物素', 'schematic-enzyme');
            label(48, 49, '乙酰-CoA 引物', 'schematic-cofactor');
            label(62, 48, '缩合→还原→脱水→还原 ×7', 'schematic-enzyme');
            label(54, 76, '每轮 2 NADPH', 'schematic-cofactor');
            label(88, 64, 'ER 膜 ELOVL / 去饱和酶', 'schematic-transporter');
            stepBadge(27, 45, 1); stepBadge(45, 45, 2); stepBadge(61, 51, 3); stepBadge(75, 51, 4); stepBadge(91, 72, 5);
            label(61, 93, '乙酰-CoA 提供引物，丙二酰-CoA 每轮增加 2C，NADPH 提供还原力', 'schematic-output');
          } else if (pathwayId === 'purine') {
            const p = { r5p: [13, 51], prpp: [26, 51], pra: [39, 51], gar: [52, 51], aicar: [64, 51], imp: [75, 51], amp: [78, 38], gmp: [78, 66] };
            label(61, 24, '细胞质 / 细胞核 · 嘌呤核苷酸从头合成', 'schematic-title');
            group.lastChild.textContent = '细胞质（核旁供给）· \u560c呤核苷酸从头合成';
            metabolite(...p.r5p, 'R5P'); metabolite(...p.prpp, 'PRPP'); metabolite(...p.pra, '5-P-核糖胺'); metabolite(...p.gar, 'GAR'); metabolite(...p.aicar, 'AICAR'); metabolite(...p.imp, 'IMP'); metabolite(...p.amp, 'AMP'); metabolite(...p.gmp, 'GMP');
            line(...p.r5p, ...p.prpp); line(...p.prpp, ...p.pra); line(...p.pra, ...p.gar); line(...p.gar, ...p.aicar); line(...p.aicar, ...p.imp);
            routePath('M 76 49 C 76 45, 77 41, 77.5 39.5', false, 'schematic-route'); routePath('M 76 53 C 76 58, 77 62, 77.5 64.5', false, 'schematic-route');
            label(19, 47, 'PRPP 合成酶 · ATP', 'schematic-enzyme'); label(31, 47, '谷氨酰胺-PRPP 酰胺转移酶', 'schematic-enzyme');
            label(51, 46, '甘氨酸 · 甲酰-THF · 谷氨酰胺 · CO₂ · 天冬氨酸', 'schematic-cofactor'); label(70, 47, '共同分叉点', 'schematic-enzyme');
            label(73, 33, 'GTP + 天冬氨酸', 'schematic-cofactor'); label(73, 70, 'ATP + 谷氨酰胺', 'schematic-cofactor');
            stepBadge(19, 54, 1); stepBadge(32, 54, 2); stepBadge(57, 54, 3); stepBadge(79, 53, 4);
            label(61, 91, '嘌呤环逐步搭建在核糖上；IMP 分流为 AMP 与 GMP', 'schematic-output');
          } else if (pathwayId === 'pyrimidine') {
            const p = {
              carbP: [23, 38], carbAsp: [37, 38], dihydro: [51, 38], dhodh: [79, 52],
              orotate: [56, 62], omp: [42, 62], ump: [28, 62], udp: [38, 72],
              utp: [49, 79], ctp: [61, 79], dump: [27, 79], dtmp: [38, 83]
            };
            label(61, 24, '细胞质—线粒体内膜 · 嘧啶从头合成', 'schematic-title');
            label(34, 29, '细胞质：CAD、UMP 合酶与核苷酸分支', 'schematic-compartment-title');
            label(82, 39, '线粒体内膜', 'schematic-compartment-title');

            metabolite(...p.carbP, '氨甲酰磷酸'); metabolite(...p.carbAsp, '氨甲酰天冬氨酸');
            metabolite(...p.dihydro, '二氢乳清酸'); metabolite(...p.orotate, '乳清酸');
            metabolite(...p.omp, 'OMP'); metabolite(...p.ump, 'UMP'); metabolite(...p.udp, 'UDP');
            metabolite(...p.utp, 'UTP'); metabolite(...p.ctp, 'CTP'); metabolite(...p.dump, 'dUMP'); metabolite(...p.dtmp, 'dTMP');
            namedNode(...p.dhodh, 'DHODH', 'dhodh');

            // CAD 的三种活性都在细胞质：CPS II → ATCase → 二氢乳清酸酶。
            line(...p.carbP, ...p.carbAsp); line(...p.carbAsp, ...p.dihydro);
            label(30, 34, 'CAD · CPS II / ATCase', 'schematic-enzyme');
            label(44, 34, '二氢乳清酸酶', 'schematic-enzyme');
            label(30, 43, 'Gln + HCO₃⁻ + 2 ATP；再加入天冬氨酸', 'schematic-cofactor');

            // 二氢乳清酸离开胞质主线，到真实线粒体内膜完成唯一的膜上步骤，
            // 生成乳清酸后再返回胞质继续接 PRPP。
            routePath('M 52 39 C 61 41, 70 46, 78 51', false, 'schematic-route schematic-transporter-route');
            routePath('M 78 53 C 72 56, 64 59, 57 61', false, 'schematic-route schematic-transporter-route');
            label(79, 48, 'DHODH · CoQ → CoQH₂', 'schematic-transporter');
            label(84, 55, '内膜外侧催化', 'schematic-cofactor');
            stepBadge(62, 43, 3);

            // 乳清酸在胞质接上 PRPP 形成 OMP，再脱羧为 UMP。
            line(...p.orotate, ...p.omp); line(...p.omp, ...p.ump);
            label(49, 58, 'UMP 合酶 · PRPP', 'schematic-enzyme');
            label(35, 58, 'OMP 脱羧', 'schematic-enzyme');

            // UMP 的 RNA 与 DNA 去向分开，避免把 UTP 直接画成 dTMP。
            routePath('M 29 64 C 31 67, 34 70, 37 71', false, 'schematic-route');
            line(...p.udp, ...p.utp); line(...p.utp, ...p.ctp);
            routePath('M 37 73 C 33 75, 30 77, 28 78', false, 'schematic-route');
            line(...p.dump, ...p.dtmp);
            label(44, 68, '核苷酸激酶', 'schematic-enzyme');
            label(55, 75, 'CTP 合成酶 · Gln + ATP', 'schematic-enzyme');
            label(29, 75, 'RNR → dUMP', 'schematic-enzyme');
            label(39, 80, '胸苷酸合酶 · N⁵,N¹⁰-亚甲基-THF', 'schematic-cofactor');
            stepBadge(30, 41, 1); stepBadge(44, 41, 2); stepBadge(49, 65, 4); stepBadge(35, 69, 5);
            label(61, 92, '主体在细胞质；仅 DHODH 在线粒体内膜，UMP 再分流生成 UTP、CTP 与 dTMP', 'schematic-output');
          } else if (pathwayId === 'nucleotide_degradation') {
            const p = {
              nucleotide: [73, 52], nucleoside: [60, 52], base: [47, 52], salvage: [25, 52],
              purBase: [47, 38], hypoxXanthine: [61, 35], uric: [73, 35],
              pyrBase: [47, 66], soluble: [29, 76]
            };
            label(61, 24, '细胞质 · 核苷酸降解与补救回收', 'schematic-title');
            label(35, 30, '补救分支：碱基 / 核苷重新进入核苷酸池', 'schematic-compartment-title');
            label(79, 30, '降解分支：嘌呤与嘧啶分别处理', 'schematic-compartment-title');
            metabolite(...p.nucleotide, 'AMP / GMP / UMP / TMP'); metabolite(...p.nucleoside, '核苷');
            metabolite(...p.base, '嘌呤 / 嘧啶碱基'); metabolite(...p.salvage, '核苷酸池（补救）');
            metabolite(...p.purBase, '腺嘌呤 / 鸟嘌呤'); metabolite(...p.hypoxXanthine, '次黄嘌呤 / 黄嘌呤');
            metabolite(...p.uric, '尿酸'); metabolite(...p.pyrBase, '尿嘧啶 / 胸腺嘧啶');
            metabolite(...p.soluble, 'β-丙氨酸 / β-氨基异丁酸');

            line(...p.nucleotide, ...p.nucleoside); line(...p.nucleoside, ...p.base);
            routePath('M 46 52 C 40 52, 34 52, 28 52', false, 'schematic-route schematic-cofactor-route');
            routePath('M 47 51 C 47 47, 47 43, 47 39', false, 'schematic-route');
            routePath('M 49 38 C 53 36.5, 57 35.5, 60 35.5', false, 'schematic-route');
            line(...p.hypoxXanthine, ...p.uric);
            routePath('M 47 53 C 47 58, 47 62, 47 65', false, 'schematic-route');
            routePath('M 45 67 C 39 70, 34 73, 30 75', false, 'schematic-route');

            label(66, 47, '5′-核苷酸酶', 'schematic-enzyme');
            label(54, 47, '核苷磷酸化酶 / 水解酶', 'schematic-enzyme');
            label(32, 48, 'HGPRT / APRT / 核苷激酶', 'schematic-cofactor');
            label(66, 31, '黄嘌呤氧化还原酶（XOR）', 'schematic-enzyme');
            label(30, 70, '开环 → 还原 → 水解', 'schematic-enzyme');
            stepBadge(73, 57, 1); stepBadge(60, 57, 2); stepBadge(46, 57, 3);
            label(61, 92, '胞质核苷酸先去磷酸；可回收碱基返回核苷酸池，其余进入终末降解', 'schematic-output');
            if (false) {
            label(61, 24, '溶酶体—细胞质 · 核苷酸降解与回收', 'schematic-title');
            metabolite(...p.nucleic, '核酸'); metabolite(...p.nucleotide, '核苷酸'); metabolite(...p.nucleoside, '核苷'); metabolite(...p.base, '碱基'); metabolite(...p.hypox, '次黄嘌呤'); metabolite(...p.uric, '尿酸'); metabolite(...p.pyrBase, '嘧啶碱基'); metabolite(...p.betaAla, 'β-丙氨酸等'); metabolite(...p.salvage, '补救回收');
            line(...p.nucleic, ...p.nucleotide); line(...p.nucleotide, ...p.nucleoside); line(...p.nucleoside, ...p.base);
            routePath('M 63 42 C 68 38, 72 35, 74 34', false, 'schematic-route'); line(...p.hypox, ...p.uric);
            routePath('M 63 44 C 68 52, 72 58, 74 61', false, 'schematic-route'); line(...p.pyrBase, ...p.betaAla);
            routePath('M 61 45 L 61 74', true, 'schematic-route schematic-transporter-route');
            label(23, 39, '核酸酶', 'schematic-enzyme'); label(38, 39, '磷酸酶', 'schematic-enzyme'); label(53, 39, '核苷磷酸化酶', 'schematic-enzyme');
            label(83, 30, '黄嘌呤氧化还原酶', 'schematic-enzyme'); label(83, 58, '开环 / 还原 / 水解', 'schematic-enzyme'); label(62, 71, 'HGPRT / APRT 等', 'schematic-cofactor');
            stepBadge(23, 46, 1); stepBadge(38, 46, 2); stepBadge(53, 46, 3); stepBadge(69, 43, 4);
            }
            label(61, 91, '优先补救回收；嘌呤终产物为尿酸，嘧啶生成可溶性小分子', 'schematic-output');
          } else if (pathwayId === 'malate_aspartate') {
            const p = {
              oaaC: [35, 34], malC: [53, 34], malM: [53, 75], oaaM: [68, 75], aspM: [84, 75], aspC: [84, 34]
            };
            metabolite(...p.oaaC, '草酰乙酸'); metabolite(...p.malC, '苹果酸'); metabolite(...p.malM, '苹果酸');
            metabolite(...p.oaaM, '草酰乙酸'); metabolite(...p.aspM, '天冬氨酸'); metabolite(...p.aspC, '天冬氨酸');
            label(44, 28, 'MDH1 · NADH + H⁺ → NAD⁺', 'schematic-cofactor');
            label(43, 42, 'GOT1 · 天冬氨酸 + α-KG → 草酰乙酸 + 谷氨酸', 'schematic-enzyme');
            label(53, 56, '苹果酸–α-KG 反向转运体', 'schematic-transporter');
            label(84, 56, '天冬氨酸–谷氨酸载体', 'schematic-transporter');
            label(53, 59, '苹果酸 ↓　/　α-KG ↑', 'schematic-exchange');
            label(84, 59, '谷氨酸 + H⁺ ↓　/　天冬氨酸 ↑', 'schematic-exchange');
            label(60.5, 70, 'MDH2 · NAD⁺ → NADH + H⁺', 'schematic-cofactor');
            label(76, 88, 'GOT2 · 草酰乙酸 + 谷氨酸 → 天冬氨酸 + α-KG', 'schematic-enzyme');
            namedNode(53, 53, '苹果酸–α-KG 载体', 'malate-alpha-kg-carrier');
            namedNode(84, 53, '天冬氨酸–谷氨酸载体', 'aspartate-glutamate-carrier');
            line(...p.oaaC, ...p.malC);
            line(...p.malC, ...p.malM, true, 'schematic-route schematic-transporter-route');
            line(...p.malM, ...p.oaaM); line(...p.oaaM, ...p.aspM);
            line(...p.aspM, ...p.aspC, true, 'schematic-route schematic-transporter-route');
            routePath('M 82.4 34 C 76 27, 43 27, 36.6 34', true, 'schematic-route');
            stepBadge(43, 31, 1); stepBadge(53, 53, 2); stepBadge(60, 72, 3); stepBadge(76, 79, 4); stepBadge(84, 53, 5); stepBadge(61, 29, 6);
            label(44, 82, '基质 NADH → 复合体 I', 'schematic-output');
          } else {
            const p = { dhap: [37, 34], g3p: [58, 34], enzyme: [65, 53], coq: [80, 53], coqh2: [92, 53] };
            metabolite(...p.dhap, '磷酸二羟丙酮'); metabolite(...p.g3p, '甘油-3-磷酸');
            metabolite(...p.coq, 'CoQ'); metabolite(...p.coqh2, 'CoQH₂');
            label(47.5, 28, '胞质 GPD1 · NADH + H⁺ → NAD⁺', 'schematic-cofactor');
            label(...p.enzyme, '线粒体 GPD2', 'schematic-transporter');
            label(65, 57, 'FAD → FADH₂', 'schematic-cofactor');
            line(...p.dhap, ...p.g3p, true); line(...p.g3p, ...p.enzyme);
            line(...p.enzyme, ...p.coq); line(...p.coq, ...p.coqh2);
            label(80, 70, '2e⁻ → 电子传递链 CoQ 池 → 复合体 III', 'schematic-output');
            label(61.5, 80, '本穿梭不把 NADH 本身送入基质，也不生成基质 NADH', 'schematic-note');
          }
          targetLayer.appendChild(group);
          return;
        }
        const nodes = [];
        const nodeIndex = new Map();
        const addNode = id => {
          if (!nodeIndex.has(id)) { nodeIndex.set(id, nodes.length); nodes.push(id); }
          return nodeIndex.get(id);
        };
        rows.forEach(reaction => { addNode(reaction.from); addNode(reaction.to); });
        const findReactionCycle = () => {
          const adjacency = new Map();
          rows.forEach(reaction => {
            if (!adjacency.has(reaction.from)) adjacency.set(reaction.from, []);
            adjacency.get(reaction.from).push(reaction.to);
            // 可逆反应在闭环判定中必须同时提供反向边；否则谷胱甘肽、
            // 谷氨酸–谷氨酰胺等真实循环会被误排成普通直线。
            if (reaction.reversible) {
              if (!adjacency.has(reaction.to)) adjacency.set(reaction.to, []);
              adjacency.get(reaction.to).push(reaction.from);
            }
          });
          const visited = new Set(), active = new Set(), stack = [];
          let found = null;
          const visit = nodeId => {
            if (found) return;
            visited.add(nodeId); active.add(nodeId); stack.push(nodeId);
            for (const nextId of adjacency.get(nodeId) || []) {
              if (!visited.has(nextId)) visit(nextId);
              else if (active.has(nextId) && !found) {
                const start = stack.indexOf(nextId);
                const candidate = stack.slice(start);
                if (candidate.length >= 3) found = candidate;
              }
              if (found) break;
            }
            stack.pop(); active.delete(nodeId);
          };
          nodes.forEach(nodeId => { if (!visited.has(nodeId)) visit(nodeId); });
          return found || [];
        };
        const cycleNodes = findReactionCycle();
        const points = [];
        const sceneOverlayPreset = {
          mitochondria: {
            tca: { cx: 59, cy: 49, rx: 21, ry: 17 },
            pdh: [[33, 49], [44, 43], [55, 46]],
            beta_oxidation: [[62, 39], [70, 35], [79, 40], [70, 48]],
            ketone: [[65, 61], [73, 57], [82, 61], [74, 68]]
          },
          'mitochondria-matrix': {
            tca: { cx: 59, cy: 51, rx: 20, ry: 16 },
            pdh: [[33, 52], [45, 47], [57, 50]],
            beta_oxidation: [[63, 42], [71, 37], [80, 42], [71, 49]],
            ketone: [[65, 64], [74, 59], [84, 64], [75, 70]]
          },
          'mitochondria-inner-membrane': {
            etc: [[30,64], [35,49], [42,56], [35,70], [46,43], [55,50], [63,39], [71,50], [80,37], [90,38], [49,25], [62,23], [80,53], [76,72], [89,72], [85,82]],
            oxphos: [[35,63], [49,55], [62,46], [75,55], [89,63]]
          }
        };
        const preset = sceneOverlayPreset[currentSceneId]?.[pathwayId];
        if (Array.isArray(preset)) {
          preset.forEach(point => points.push(point));
        } else if (cycleNodes.length >= 3) {
          const ring = preset || { cx: 61, cy: 50, rx: 25, ry: 18 };
          const { cx, cy, rx, ry } = ring;
          cycleNodes.forEach((nodeId, index) => {
            const angle = -Math.PI / 2 + (index / cycleNodes.length) * Math.PI * 2;
            points[nodeIndex.get(nodeId)] = [cx + Math.cos(angle) * rx, cy + Math.sin(angle) * ry];
          });
          // 支路紧贴其连接的循环节点向外展开，不把循环输入/输出散落到整张图。
          // 同一循环节点可能同时接入底物和辅产物，必须沿切线错开，避免
          // 天冬氨酸 / 延胡索酸这类支路被压在同一个 SVG 点上。
          const pending = nodes.filter(nodeId => !cycleNodes.includes(nodeId));
          const branchSlots = new Map();
          for (let pass = 0; pass < nodes.length && pending.length; pass += 1) {
            for (let index = pending.length - 1; index >= 0; index -= 1) {
              const nodeId = pending[index];
              const link = rows.find(reaction =>
                (reaction.from === nodeId && points[nodeIndex.get(reaction.to)]) ||
                (reaction.to === nodeId && points[nodeIndex.get(reaction.from)]));
              if (!link) continue;
              const anchorId = link.from === nodeId ? link.to : link.from;
              const anchor = points[nodeIndex.get(anchorId)];
              const dx = anchor[0] - cx, dy = anchor[1] - cy;
              const length = Math.max(1, Math.hypot(dx, dy));
              const key = anchorId;
              const slot = branchSlots.get(key) || 0;
              branchSlots.set(key, slot + 1);
              const siblingCount = pending.filter(candidate => rows.some(reaction =>
                (reaction.from === candidate && reaction.to === anchorId) ||
                (reaction.to === candidate && reaction.from === anchorId))).length;
              const centeredSlot = slot - (Math.max(1, siblingCount) - 1) / 2;
              const tangentX = -dy / length, tangentY = dx / length;
              const radialX = dx / length, radialY = dy / length;
              const branchPoint = [
                anchor[0] + radialX * 8 + tangentX * centeredSlot * 5,
                anchor[1] + radialY * 7 + tangentY * centeredSlot * 5
              ];
              points[nodeIndex.get(nodeId)] = branchPoint.map((value, coordinate) =>
                coordinate === 0 ? Math.max(29, Math.min(94, value)) : Math.max(6, Math.min(94, value)));
              pending.splice(index, 1);
            }
          }
        } else {
          const cols = Math.min(7, Math.max(3, nodes.length));
          const rowsCount = Math.ceil(nodes.length / cols);
          nodes.forEach((_, index) => {
            const row = Math.floor(index / cols), col = index % cols;
            points[index] = [30 + (col / Math.max(1, cols - 1)) * 61, 43 + (row - (rowsCount - 1) / 2) * 18];
          });
        }
        // 数据扩充时即使专属模板暂未同步，也必须为新增节点提供安全位置。
        nodes.forEach((_, index) => {
          if (points[index]) return;
          const cols = Math.min(7, Math.max(3, nodes.length));
          const row = Math.floor(index / cols), col = index % cols;
            points[index] = [
              Math.max(29, Math.min(94, 30 + (col / Math.max(1, cols - 1)) * 61)),
              Math.max(6, Math.min(94, 43 + row * 16))
            ];
        });
        const tone = expertPathwayToneById[pathwayId] || pathwayMeta[routeGroupForPathway(pathwayId, pathway) || pathwayId]?.tone || '#367c70';
        const svg = 'http://www.w3.org/2000/svg';
        const defs = document.createElementNS(svg, 'defs');
        const marker = document.createElementNS(svg, 'marker'); marker.setAttribute('id', 'scene-overlay-arrow'); marker.setAttribute('viewBox', '0 0 10 10'); marker.setAttribute('refX', '8'); marker.setAttribute('refY', '5'); marker.setAttribute('markerWidth', '2.25'); marker.setAttribute('markerHeight', '2.25'); marker.setAttribute('orient', 'auto-start-reverse');
        const arrow = document.createElementNS(svg, 'path'); arrow.setAttribute('d', 'M 0 0 L 10 5 L 0 10 z'); arrow.style.fill = tone; marker.appendChild(arrow); defs.appendChild(marker); targetLayer.appendChild(defs);
        rows.forEach(reaction => {
          const a = points[nodeIndex.get(reaction.from)], b = points[nodeIndex.get(reaction.to)];
          const dx = b[0] - a[0], dy = b[1] - a[1], length = Math.max(.01, Math.hypot(dx, dy));
          const startInset = reaction.reversible ? 1.05 : .72, endInset = 1.08;
          const sx = a[0] + dx / length * startInset, sy = a[1] + dy / length * startInset;
          const ex = b[0] - dx / length * endInset, ey = b[1] - dy / length * endInset;
          const path = document.createElementNS(svg, 'path'); path.classList.add('overlay-route'); path.style.setProperty('--overlay-tone', tone); path.setAttribute('d', `M ${sx} ${sy} L ${ex} ${ey}`); path.setAttribute('marker-end', 'url(#scene-overlay-arrow)'); if (reaction.reversible) path.setAttribute('marker-start', 'url(#scene-overlay-arrow)'); targetLayer.appendChild(path);
        });
        nodes.forEach((nodeId, i) => {
          const point = points[i];
          const node = document.createElementNS(svg, 'circle'); node.classList.add('overlay-node'); node.style.setProperty('--overlay-tone', tone); node.setAttribute('cx', point[0]); node.setAttribute('cy', point[1]); node.setAttribute('r', '.4'); targetLayer.appendChild(node);
          const label = document.createElementNS(svg, 'text'); label.classList.add('overlay-label'); label.setAttribute('x', point[0]); label.setAttribute('y', point[1] - 1.75); label.setAttribute('text-anchor', 'middle'); label.textContent = displayText(entityById[nodeId]?.name || nodeId); targetLayer.appendChild(label);
        });
      }

      // #22 ── 搜索 ─────────────────────────────────────────────────────
      function renderSceneHotspots(scene, viewIndex = 0, options = {}) {
        sceneHotspots.innerHTML = '';
        // 场景内只显示属于当前细胞器的通路入口，避免把细胞核/内质网标注带进线粒体。
        let hotspots = sceneHotspotsForView(scene, viewIndex).filter(hotspot => {
          if (!hotspot.pathway) {
            if (currentSceneId === 'cell-atlas' || hotspot.target) return true;
            const label = String(hotspot.label || '');
            const foreignByScene = {
              mitochondria: /细胞核|内质网|高尔基体|溶酶体|过氧化物酶体/,
              'mitochondria-matrix': /细胞核|内质网|高尔基体|溶酶体|过氧化物酶体/,
              'mitochondria-inner-membrane': /细胞核|内质网|高尔基体|溶酶体|过氧化物酶体/,
              cytosol: /细胞核|内质网|高尔基体|溶酶体|过氧化物酶体/,
              'nucleus-er': /线粒体|高尔基体|溶酶体|过氧化物酶体/,
              golgi: /细胞核|线粒体|溶酶体|过氧化物酶体/,
              'endosome-lysosome': /细胞核|线粒体|内质网|高尔基体/,
              peroxisome: /细胞核|线粒体|内质网|高尔基体|溶酶体/
            };
            return !foreignByScene[currentSceneId]?.test(label);
          }
          return pathwayBelongsToScene(hotspot.pathway, currentSceneId);
        });
        if (currentSceneId === 'cell-atlas') {
          const existingPathways = new Set(hotspots.filter(hotspot => hotspot.pathway).map(hotspot => hotspot.pathway));
          const atlasPathwayIds = ['gluconeogenesis', 'glycogenolysis'].filter(pathwayId => atlas.pathways[pathwayId]);
          hotspots = hotspots.concat(atlasPathwayIds
            .filter(pathwayId => !existingPathways.has(pathwayId))
            .map((pathwayId, index) => ({ pathway: pathwayId, label: atlas.pathways[pathwayId].name, x: 28 + index * 16, y: 82, tone: pathwayMeta[pathwayId]?.tone })));
        }
        // 第 2 层只给当前选中通路提供一个“进入所属第 3 层”的导航点，
        // 不把基质/内膜通路直接铺到线粒体总览上。
        if (!options.pathwayId && currentSceneId !== 'cell-atlas' && activePathway && activePathway !== 'all') {
          const selected = atlas.pathways[activePathway];
          const child = selected?.scene ? atlas.scenes[selected.scene] : null;
          if (child?.parent === currentSceneId && !hotspots.some(hotspot => hotspot.target === child.id)) {
            hotspots = hotspots.concat({
              label: `进入${child.title}`,
              target: child.id,
              x: 52,
              y: 20,
              tone: child.tone || scene.tone
            });
          }
        }
        // 有些跨区室通路的底图入口只标了子结构目标（例如核—ER、内体—溶酶体）。
        // 在真正承载该通路的区室层补出一个明确入口，避免用户只能点进子结构却找不到通路。
        if (!options.pathwayId && !['cell-atlas', 'mitochondria'].includes(currentSceneId)) {
          const existingPathways = new Set(hotspots.filter(hotspot => hotspot.pathway).map(hotspot => hotspot.pathway));
          const explicitScenePathways = {
            'nucleus-er': ['purine', 'pyrimidine'],
            'endosome-lysosome': ['nucleotide_degradation']
          };
          const scenePathwayIds = explicitScenePathways[currentSceneId] || coreStudyPathwayIds.filter(pathwayId => atlas.pathways[pathwayId]?.scene === currentSceneId);
          const scenePathwayHotspots = scenePathwayIds
            .filter(pathwayId => atlas.pathways[pathwayId] && !existingPathways.has(pathwayId))
            .map((pathwayId, index) => ({ pathway: pathwayId, label: atlas.pathways[pathwayId].name, x: 24 + (index % 3) * 28, y: 78 - Math.floor(index / 3) * 12, tone: pathwayMeta[pathwayId]?.tone }));
          hotspots = hotspots.concat(scenePathwayHotspots);
        }
        const annotations = sceneAnnotationsForView(scene, viewIndex);
        renderSceneScope(scene, viewIndex, hotspots, options.pathwayId || null);
        if (options.pathwayId) {
          const activePathway = atlas.pathways[options.pathwayId];
          const reactionRows = pathwayReactionRows(options.pathwayId);
          scopeLocal.innerHTML = '';
          if (scopeLocalLabel) scopeLocalLabel.textContent = '第 3 层 · 当前通路';
          appendScopeItem(scopeLocal, activePathway?.name || options.pathwayId, activePathway?.tone || scene.tone, () => setScenePathwayVisual(options.pathwayId));
          scopeLocalCount.textContent = '机制图';
          scopeExchange.innerHTML = '';
          if (scopeExchangeLabel) scopeExchangeLabel.textContent = '第 4 层 · 单步反应';
          if (scopeExchangeMeta) scopeExchangeMeta.textContent = `${reactionRows.length} 步`;
          const mechanismHint = document.createElement('div');
          mechanismHint.className = 'scope-empty';
          mechanismHint.textContent = '选择一步，查看底物、产物、酶与所在区室。';
          scopeExchange.appendChild(mechanismHint);
          reactionRows.forEach((reaction, index) => {
            const endpoints = expertReactionEndpoints(reaction);
            if (!endpoints) return;
            const step = document.createElement('button');
            step.type = 'button';
            step.className = 'scope-item scene-reaction-step';
            step.style.setProperty('--tone', activePathway?.tone || scene.tone || '#338ca3');
            step.setAttribute('aria-label', `查看第 ${index + 1} 步：${endpoints.substrate.name}${reaction.reversible ? '可逆转化为' : '转化为'}${endpoints.product.name}`);
            const text = document.createElement('span');
            text.textContent = `第 ${index + 1} 步 · ${displayText(endpoints.substrate.name)} ${reaction.reversible ? '⇌' : '→'} ${displayText(endpoints.product.name)}`;
            const mark = document.createElement('em');
            mark.textContent = '查看 →';
            step.append(text, mark);
            step.addEventListener('click', event => {
              event.stopPropagation();
              openSceneReactionDetail(reaction, options.pathwayId, index);
            });
            scopeExchange.appendChild(step);
          });
          scopeTransport.innerHTML = '';
          if (scopeTransportLabel) scopeTransportLabel.textContent = '自由探索';
          appendScopeItem(scopeTransport, '查看区室结构', scene.tone, () => setSceneView(currentSceneView, true), '进入 →');
          scopeTransportCount.textContent = '空间入口';
          sceneAnnotationCount.textContent = '第 3 层 · 机制图';
          if (sceneRouteLaneCount) sceneRouteLaneCount.textContent = '1 条';
          sceneAnnotationToggle.disabled = true;
          sceneAnnotationToggle.setAttribute('aria-pressed', 'false');
          sceneAnnotationToggle.textContent = '结构图中显示';
          return;
        }
        sceneAnnotationCount.textContent = `${annotations.length} 个讲解地标`;
        sceneAnnotationToggle.disabled = annotations.length === 0;

        let annotationReader = null;
        let readerKind = null;
        let readerTitle = null;
        let readerDetail = null;
        const activateAnnotation = (button, annotation) => {
          sceneHotspots.querySelectorAll('.scene-landmark.active').forEach(node => node.classList.remove('active'));
          button.classList.add('active');
          const kind = sceneAnnotationKinds[annotation.kind] || sceneAnnotationKinds.structure;
          annotationReader.style.setProperty('--reader-tone', kind.tone);
          readerKind.textContent = kind.label;
          readerTitle.textContent = annotation.label;
          readerDetail.textContent = annotation.detail;
          scheduleSceneAnnotationLayout();
        };

        if (annotations.length) {
          annotationReader = document.createElement('aside');
          annotationReader.className = 'scene-annotation-reader';
          annotationReader.setAttribute('aria-live', 'polite');
          readerKind = document.createElement('small');
          readerTitle = document.createElement('strong');
          readerDetail = document.createElement('p');
          annotationReader.append(readerKind, readerTitle, readerDetail);
          sceneHotspots.appendChild(annotationReader);

          annotations.forEach((annotation, index) => {
            const kind = sceneAnnotationKinds[annotation.kind] || sceneAnnotationKinds.structure;
            const button = document.createElement('button');
            button.type = 'button';
            button.className = 'scene-landmark';
            button.dataset.kind = annotation.kind || 'structure';
            button.dataset.side = annotation.side || (annotation.x > 58 ? 'left' : 'right');
            button.style.setProperty('--x', `${annotation.x}%`);
            button.style.setProperty('--y', `${annotation.y}%`);
            button.style.setProperty('--i', index);
            button.style.setProperty('--landmark', kind.tone);
            button.setAttribute('aria-label', `${annotation.label}：${annotation.detail}`);
            const pin = document.createElement('span');
            pin.className = 'scene-landmark-pin';
            pin.setAttribute('aria-hidden', 'true');
            const label = document.createElement('span');
            label.className = 'scene-landmark-label';
            label.textContent = annotation.label;
            button.append(pin, label);
            button.addEventListener('mouseenter', () => activateAnnotation(button, annotation));
            button.addEventListener('focus', () => activateAnnotation(button, annotation));
            button.addEventListener('click', event => { event.stopPropagation(); activateAnnotation(button, annotation); });
            sceneHotspots.appendChild(button);
            if (index === 0) activateAnnotation(button, annotation);
          });
        }

        const hasSubcompartmentTargets = hotspots.some(hotspot => hotspot.target && atlas.scenes[hotspot.target]?.parent === currentSceneId);
        // 第二层保留“进入子区室”的结构入口，同时也保留核心通路入口；否则核—ER、
        // 内体—溶酶体等场景会只剩结构按钮，用户无法进入专属机制图。
        const mixedStructureAndPathwayScenes = new Set(['nucleus-er', 'endosome-lysosome']);
        const visibleMapHotspots = hasSubcompartmentTargets
          ? hotspots.filter(hotspot => hotspot.target || (mixedStructureAndPathwayScenes.has(currentSceneId) && hotspot.pathway && coreStudyPathwaySet.has(hotspot.pathway)))
          : hotspots;
        visibleMapHotspots.filter(hotspot => hotspot.target || hotspot.pathway).forEach((hotspot, index) => {
          const pathway = hotspot.pathway ? atlas.pathways[hotspot.pathway] : null;
          const button = document.createElement('button');
          button.className = 'scene-hotspot navigation-hotspot';
          button.type = 'button';
          button.textContent = hotspot.label || pathway?.name || hotspot.pathway;
          button.dataset.label = button.textContent;
          button.style.setProperty('--x', `${hotspot.x}%`);
          button.style.setProperty('--y', `${hotspot.y}%`);
          button.style.setProperty('--i', index);
          button.style.setProperty('--tone', expertPathwayToneById[hotspot.pathway] || hotspot.tone || scene.tone || '#338ca3');
          if (hotspot.target) button.dataset.target = hotspot.target;
          if (hotspot.pathway) button.dataset.pathway = hotspot.pathway;
          button.setAttribute('aria-label', hotspot.target ? `进入${button.textContent}` : `查看通路：${button.textContent}`);
          button.addEventListener('click', event => {
            event.stopPropagation();
            if (hotspot.target) openScene(hotspot.target);
            else if (hotspot.pathway) openPathway(hotspot.pathway);
          });
          sceneHotspots.appendChild(button);
        });
        setSceneAnnotationsVisible(sceneAnnotationsVisible);
        resolveCompactHotspots();
        scheduleSceneAnnotationLayout();
      }

      // #23 ── 全屏 ─────────────────────────────────────────────────────
      function renderScene(sceneId, viewIndex = 0, pathwayId = null) {
        const scene = atlas.scenes[sceneId];
        if (!scene) return;
        currentSceneId = sceneId;
        scene.id = sceneId;
        sceneDeck.dataset.scene = sceneId;
        sceneDeck.dataset.sceneDepth = scene.parent && atlas.scenes[scene.parent]?.parent ? 'subcompartment' : 'organelle';
        sceneDeck.dataset.sceneLevel = scene.subtitle?.match(/^第\s*(\d)\s*层/)?.[1] || (scene.parent ? '2' : '1');
        // 子区室默认只展示通路入口点；结构讲解点由用户按需打开。
        setSceneAnnotationsVisible(sceneDeck.dataset.sceneDepth !== 'subcompartment');
        sceneDeck.style.setProperty('--scene-tone', scene.tone || '#338ca3');
        setSceneStructuralHeader(scene);
        const level = sceneDeck.dataset.sceneLevel || '1';
        const levelCopy = {
          '1': '结构入口 · 选择细胞器',
          '2': '细胞器总览 · 选择区室',
          '3': '区室视图 · 选择通路',
          '4': '机制图 · 查看反应与连接'
        }[level] || '分层代谢地图';
        if (sceneLevelHint) sceneLevelHint.textContent = `第 ${level} 层 · ${levelCopy}`;
        updateSceneBackLabel();
        sceneViews.innerHTML = '';
        const pathwayVisual = pathwayId ? expertPathwayVisualOverrides[pathwayId] : null;
        if (pathwayVisual) {
          const pathwayButton = document.createElement('button');
          pathwayButton.className = 'scene-view scene-pathway-view';
          pathwayButton.type = 'button';
          pathwayButton.dataset.pathwayView = pathwayId;
          pathwayButton.textContent = '当前通路图 ⤢';
          pathwayButton.title = `${pathwayVisual[0]} · 再点一次放大`;
          pathwayButton.addEventListener('click', event => {
            event.stopPropagation();
            if (pathwayButton.classList.contains('active')) openPathwayVisualDialog(sceneBackground);
            else setScenePathwayVisual(pathwayId);
          });
          sceneViews.appendChild(pathwayButton);
        }
        scene.views.forEach((entry, index) => {
          const { label } = sceneViewEntry(scene, index);
          const button = document.createElement('button');
          button.className = 'scene-view';
          button.type = 'button';
          button.dataset.sceneView = String(index);
          button.textContent = label;
          button.addEventListener('click', event => { event.stopPropagation(); setSceneView(index); });
          sceneViews.appendChild(button);
        });
        if (!setScenePathwayVisual(pathwayId, true)) setSceneView(viewIndex, true);
        updateSceneBackLabel();
      }

      // #24 ── 导航 / 滚动工具 ─────────────────────────────────────────
      function openScene(sceneId, options = {}) {
        if (!atlas.scenes[sceneId]) return;
        setStudentMode(false, { buildExpert: false });
        // 从通路机制图回到父级时，恢复父级的完整线路列表，避免上一个通路的隐藏状态残留。
        if (!options.pathwayId) sceneDeck.classList.remove('pathway-visual-active');
        if (currentSceneId && currentSceneId !== sceneId && options.pushHistory !== false) sceneHistory.push(currentSceneId);
        if (!options.preservePathway) clearSelection();
        document.body.classList.add('scene-open');
        sceneDeck.classList.add('open');
        syncAccessibilityState();
        renderScene(sceneId, options.viewIndex || 0, options.pathwayId || null);
      }

      function closeScene(options = {}) {
        sceneImageRequest += 1;
        currentSceneId = null;
        currentSceneView = 0;
        sceneHistory.length = 0;
        sceneDeck.classList.remove('open', 'loading', 'switching');
        document.body.classList.remove('scene-open');
        if (!document.body.classList.contains('student-mode') && options.buildExpert !== false) ensureExpertMapBuilt();
        syncAccessibilityState();
        if (options.preservePathway && activePathway && activePathway !== 'all') {
          inspector.classList.remove('open');
          document.body.classList.remove('inspector-open', 'reaction-focus', 'entity-focus', 'enzyme-visible');
          setRegionHidden(inspector, true);
          updateExpertPathPreview(activePathway);
        } else {
          clearSelection();
        }
      }

      function backScene() {
        if (!currentSceneId) return;
        if (sceneDeck.classList.contains('pathway-reaction-active')) {
          closeSceneReactionDetail();
          return;
        }
        // 通路机制图返回第 2 层通路总览；区室结构只通过明确的自由探索入口进入。
        if (sceneDeck.classList.contains('pathway-visual-active')) {
          closeScene({ preservePathway: true });
          return;
        }
        const current = atlas.scenes[currentSceneId];
        const target = sceneHistory.pop() || current?.parent;
        if (target) openScene(target, { pushHistory: false });
        else closeScene();
      }

      function preferredSearchMatch(items, query, exactValues, searchableText) {
        return items.find(item => exactValues(item).some(value => String(value || '').trim().toLowerCase() === query))
          || items.find(item => String(searchableText(item) || '').toLowerCase().includes(query));
      }

      function updateSearchStatus(message, invalid = false) {
        if (invalid) searchInput.setAttribute('aria-invalid', 'true');
        else searchInput.removeAttribute('aria-invalid');
        searchStatus.textContent = '';
        if (message) requestAnimationFrame(() => { searchStatus.textContent = message; });
      }

      // #25 ── 初始化 / 事件绑定 ───────────────────────────────────────
      function searchAndFocus() {
        const rawQuery = searchInput.value.trim();
        const query = rawQuery.toLowerCase();
        if (!query) { updateSearchStatus('请输入要搜索的物质、酶、反应或通路。', true); return; }
        updateSearchStatus('');
        if (document.body.classList.contains('student-mode')) {
          const studentTopicHit = preferredSearchMatch(
            Object.entries(studentTopicCatalog), query,
            ([topicId, topic]) => [topicId, topic.label, topic.english],
            ([topicId, topic]) => `${topicId} ${topic.label} ${topic.english}`
          );
          if (studentTopicHit) {
            renderStudentTopic(studentTopicHit[0]);
            return;
          }
          const participantHit = preferredSearchMatch(
            participantCatalog, query,
            entry => [entry.name, entry.key, ...(entry.aliases || [])],
            entry => `${entry.name} ${entry.key} ${(entry.aliases || []).join(' ')}`
          );
          if (participantHit) {
            const currentPathwayId = activeStudentPathway || 'glycolysis';
            const occurrence = participantHit.occurrences.find(item => item.pathwayIds.includes(currentPathwayId));
            const subject = studentParticipantSubject({
              key: participantHit.key,
              name: participantHit.name,
              entityIds: occurrence?.entityIds || participantHit.entityIds,
              role: occurrence?.role || '',
              compartment: occurrence?.compartment || atlas.pathways[currentPathwayId]?.compartment
            }, currentPathwayId);
            const reaction = occurrence ? reactionById[occurrence.reactionId] : null;
            if (reaction) renderStudentReactionDetail(reaction, currentPathwayId, studentReactionsFor(currentPathwayId).indexOf(reaction));
            renderStudentSceneLinks(subject, currentPathwayId, { focus: 'panel' });
            return;
          }
          const studentPathwayHit = preferredSearchMatch(
            coreStudyPathwayIds.map(pathwayId => [pathwayId, atlas.pathways[pathwayId]]).filter(([, pathway]) => pathway), query,
            ([pathwayId, pathway]) => [pathwayId, pathway.name, pathway.english],
            ([pathwayId, pathway]) => `${pathwayId} ${pathway.name} ${pathway.english || ''}`
          );
          if (studentPathwayHit) {
            renderStudentPathway(studentPathwayHit[0]);
            return;
          }
        }
        const exactEnzyme = reactions.find(r => r.enzyme && r.enzyme.toLowerCase() === query);
        if (exactEnzyme) { if (currentSceneId) closeScene(); setStudentMode(false); openReaction(exactEnzyme); focusReaction(exactEnzyme); return; }
        const entity = preferredSearchMatch(
          entities, query,
          e => [e.name, e.latin, e.label, e.id],
          e => `${e.name} ${e.latin} ${e.label} ${e.id}`
        );
        if (entity) { if (currentSceneId) closeScene(); setStudentMode(false); openEntity(entity); focusEntity(entity); return; }
        const participantHit = preferredSearchMatch(
          participantCatalog, query,
          entry => [entry.name, entry.key, ...(entry.aliases || [])],
          entry => `${entry.name} ${entry.key} ${(entry.aliases || []).join(' ')}`
        );
        if (participantHit) {
          const participantEntity = participantHit.entityIds.map(id => entityById[id]).find(Boolean);
          const participantReaction = participantHit.reactionIds.map(id => reactionById[id]).find(Boolean);
          if (currentSceneId) closeScene();
          setStudentMode(false);
          if (participantEntity) { openEntity(participantEntity); focusEntity(participantEntity); return; }
          if (participantReaction) { openReaction(participantReaction); focusReaction(participantReaction); return; }
        }
        const reaction = reactions.find(r => `${r.equation} ${r.enzyme}`.toLowerCase().includes(query));
        if (reaction) { if (currentSceneId) closeScene(); setStudentMode(false); openReaction(reaction); focusReaction(reaction); return; }
        const atlasEntries = coreStudyPathwayIds.map(pathwayId => [pathwayId, atlas.pathways[pathwayId]]).filter(([, pathway]) => pathway);
        // 拉丁文查询必须对齐词首：裸子串匹配会让 "SAM" 命中 "tranSAMination"，
        // 把 S-腺苷蛋氨酸抢到转氨通路去。前缀搜索（glyco → Glycolysis）仍然有效；
        // 中文没有词边界，因此不受此规则约束。
        const looseHit = haystack => {
          const hay = haystack.toLowerCase();
          if (!/^[a-z0-9]/.test(query) || !/^[\x20-\x7e]+$/.test(query)) return hay.includes(query);
          return new RegExp('\\b' + query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).test(hay);
        };
        const atlasPath =
          atlasEntries.find(([, p]) => p.name.toLowerCase() === query || p.english.toLowerCase() === query) ||
          atlasEntries.find(([, p]) => looseHit(`${p.name} ${p.english}`)) ||
          atlasEntries.find(([, p]) => `${p.group} ${p.compartment} ${p.steps.join(' ')}`.toLowerCase().includes(query));
        if (atlasPath) { setStudentMode(false, { buildExpert: false }); openScene(atlasPath[1].scene); openPathway(atlasPath[0]); return; }
        const organelle = organelles.find(o => `${o.name} ${o.sub}`.toLowerCase().includes(query));
        if (organelle?.sceneId) { openScene(organelle.sceneId); return; }
        const atlasScene = Object.entries(atlas.scenes).find(([, s]) => `${s.title} ${s.subtitle} ${s.description}`.toLowerCase().includes(query));
        if (atlasScene) { openScene(atlasScene[0]); return; }
        const path = coreStudyPathwayIds.map(pathwayId => [pathwayId, pathwayMeta[pathwayId]]).find(([, m]) => m && `${m.label} ${m.english}`.toLowerCase().includes(query));
        if (path) { if (currentSceneId) closeScene(); setStudentMode(false); document.querySelector(`[data-path="${path[0]}"]`)?.click(); return; }
        updateSearchStatus(`未找到“${rawQuery}”。`, true);
        searchInput.animate([{ transform: 'translateX(0)' }, { transform: 'translateX(-5px)' }, { transform: 'translateX(5px)' }, { transform: 'translateX(0)' }], { duration: 250 });
      }

      svg.addEventListener('wheel', queueWheelZoom, { passive: false });
      mapStage.addEventListener('selectstart', event => event.preventDefault());
      mapStage.addEventListener('pointerdown', () => window.getSelection()?.removeAllRanges(), { capture: true });
      svg.addEventListener('pointerdown', event => {
        if (event.pointerType !== 'touch' && event.button !== 0) return;
        const interactiveTarget = event.target.closest('.entity,.route,.route-aura,.enzyme,.organelle');
        if (event.pointerType !== 'touch' && interactiveTarget) return;
        cancelViewAnimation();
        mapPointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
        const captureOwner = typeof event.target.setPointerCapture === 'function' ? event.target : svg;
        try {
          captureOwner.setPointerCapture(event.pointerId);
          mapPointerCaptures.set(event.pointerId, captureOwner);
        } catch (_) {}
        beginMapGesture();
      });
      svg.addEventListener('pointermove', updateMapGesture, { passive: false });
      svg.addEventListener('pointerup', finishMapPointer);
      svg.addEventListener('pointercancel', finishMapPointer);
      svg.addEventListener('click', event => {
        if (performance.now() >= clickInterceptDeadline) return;
        event.preventDefault();
        event.stopImmediatePropagation();
      }, { capture: true });
      searchInput.addEventListener('input', () => updateSearchStatus(''));
      searchInput.addEventListener('keydown', event => { if (event.key === 'Enter') searchAndFocus(); });
      document.getElementById('zoomIn').addEventListener('click', () => zoomAt(.8));
      document.getElementById('zoomOut').addEventListener('click', () => zoomAt(1.25));
      document.getElementById('resetBtn').addEventListener('click', () => { if (currentSceneId) closeScene(); clearSelection(); animateViewTo(base, 420); });
      document.getElementById('clearBtn').addEventListener('click', clearSelection);
      document.getElementById('closeInspector').addEventListener('click', () => {
        if (sceneDeck.classList.contains('pathway-reaction-active')) closeSceneReactionDetail();
        else clearSelection();
      });
      focusBtn.addEventListener('click', () => {
        if (!selected) return;
        if ((selectedType === 'organelle' || selectedType === 'pathway') && selected.sceneId) openScene(selected.sceneId);
        else if (selectedType === 'reaction') focusReaction(selected);
        else if (selectedType === 'entity') focusEntity(selected);
        else if (selectedType === 'organelle' && selected.focus) focusBox(selected.focus);
      });
      document.getElementById('upstreamBtn').addEventListener('click', () => { if (!selected || selectedType !== 'entity') return; const upstream = reactions.filter(r => r.to === selected.id).map(r => entityById[r.from]); if (upstream[0]) { openEntity(upstream[0]); focusEntity(upstream[0]); } });
      learnBtn.addEventListener('click', () => setStudentMode(!document.body.classList.contains('student-mode')));
      enterLearningBtn.addEventListener('click', enterLearningFromCover);
      studentTopicHomeBack?.addEventListener('click', () => showStudentCourseHome({ scroll: true }));
      studentCourseBack?.addEventListener('click', () => {
        const topicId = studentTopicIdForPathway(activeStudentPathway);
        if (topicId) renderStudentTopic(topicId, { scroll: true });
        else showStudentCourseHome({ scroll: true });
      });
      studentTopicAtlas?.addEventListener('toggle', () => {
        if (studentTopicAtlas.open && activeStudentTopic) {
          requestAnimationFrame(() => renderStudentTopicMap(activeStudentTopic));
        }
      });
      studentReactionToggle.addEventListener('click', () => setStudentReactionIndex(studentReactionIndex.hidden));
      studentMapZoomOut?.addEventListener('click', () => applyStudentMapZoom(studentMapZoom - .15, { center: true }));
      studentMapZoomFit?.addEventListener('click', () => applyStudentMapZoom(1));
      studentMapZoomIn?.addEventListener('click', () => applyStudentMapZoom(studentMapZoom + .15, { center: true }));
      studentMapCenter?.addEventListener('click', centerStudentMapCanvas);
      document.getElementById('studentOrganelleBtn').addEventListener('click', () => { setStudentMode(false, { buildExpert: false }); openScene('cell-atlas'); });
      document.getElementById('sceneBack').addEventListener('click', backScene);
      sceneAnnotationToggle.addEventListener('click', () => setSceneAnnotationsVisible(!sceneAnnotationsVisible));
      window.addEventListener('resize', scheduleSceneAnnotationLayout);
      sceneHotspots.addEventListener('click', event => { if (event.target === sceneHotspots) clearSelection(); });
      document.addEventListener('keydown', event => {
        if (event.key !== 'Escape') return;
        if (document.body.classList.contains('app-fullscreen-fallback')) exitAppFullscreen();
        else if (sceneDeck.classList.contains('pathway-reaction-active')) closeSceneReactionDetail();
        else if (inspector.classList.contains('open')) clearSelection();
        else if (currentSceneId) backScene();
      });
      image.addEventListener('error', () => { fallback.style.display = 'block'; image.style.display = 'none'; });

      const lineStrength = document.getElementById('lineStrength');
      const applyLineStrength = () => {
        const strength = Number(lineStrength.value) / 100;
        const opacity = .56 + strength * .28;
        const width = 1.65 + strength * .7;
        const activeWidth = width + 1.25;
        const aura = .006 + (1 - strength) * .035;
        document.documentElement.style.setProperty('--route-opacity', opacity.toFixed(3));
        document.documentElement.style.setProperty('--route-width', `${width.toFixed(2)}px`);
        document.documentElement.style.setProperty('--route-active-width', `${activeWidth.toFixed(2)}px`);
        document.documentElement.style.setProperty('--route-aura-opacity', aura.toFixed(3));
        lineStrength.setAttribute('aria-valuetext', `${Math.round(strength * 100)}% 清晰度`);
      };
      lineStrength.addEventListener('input', applyLineStrength);
      applyLineStrength();

      const contrastMode = document.getElementById('contrastMode');
      contrastMode.addEventListener('click', () => {
        const active = document.body.classList.toggle('high-contrast');
        contrastMode.classList.toggle('active', active);
        contrastMode.setAttribute('aria-pressed', String(active));
      });

      applyView(); syncAccessibilityState();

      const statNode = document.getElementById('overviewNodeCount');
      const statLink = document.getElementById('overviewConnectionCount');
      const statPath = document.getElementById('overviewPathwayCount');
      const pathwayCount = coreStudyPathwayIds.length;
      const sceneCount = Object.keys(atlas.scenes).length;
      if (statNode) statNode.textContent = entities.length;
      if (statLink) statLink.textContent = reactions.length;
      if (statPath) statPath.textContent = pathwayCount;
      const coverMetaPrimary = document.getElementById('coverMetaPrimary');
      const coverMetaSecondary = document.getElementById('coverMetaSecondary');
      if (coverMetaPrimary) coverMetaPrimary.textContent = `${pathwayCount} 条必考主线 · ${Object.keys(coreStudyModules).length} 个重点专题`;
      if (coverMetaSecondary) coverMetaSecondary.textContent = '从专题进入任意代谢通路';

      const statusSummary = document.getElementById('statusSummary');
      if (statusSummary) {
        statusSummary.textContent = `${pathwayCount} 条必考主线 · ${Object.keys(coreStudyModules).length} 个重点专题 · 完整数据保留在底层`;
      }

      const brandVersion = document.getElementById('brandVersion');
      if (brandVersion && atlas.version) {
        brandVersion.textContent = `${brandVersion.textContent.trim()} · 数据 ${atlas.version}`;
      }
    })();
