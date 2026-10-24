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
      // 状态行双层语义：idle 是当前视角/加载状态；hint 是悬停目标的「点击进入」去向提示。
      let sceneSourceIdleText = '知识关系：代谢总图人工核对 · 图像仅作空间底图';
      function setSceneSourceIdle(text) {
        sceneSourceIdleText = text;
        if (!sceneSource) return;
        delete sceneSource.dataset.hint;
        sceneSource.textContent = text;
      }
      function setSceneSourceHint(text) {
        if (!sceneSource) return;
        if (!text) { delete sceneSource.dataset.hint; sceneSource.textContent = sceneSourceIdleText; return; }
        sceneSource.dataset.hint = '1';
        sceneSource.textContent = text;
      }
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
      const studentPathwayCopy = document.getElementById('studentPathwayCopy');
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
      const reactionNotePanel = document.getElementById('inspectorReactionNote');
      const reactionNoteDoing = document.getElementById('reactionNoteDoing');
      const reactionNoteWhy = document.getElementById('reactionNoteWhy');
      const reactionNoteHook = document.getElementById('reactionNoteHook');
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
        if (imageElement === sceneBackground) return sceneSourceIdleText || imageElement.alt || '当前通路图';
        const figure = imageElement.closest('figure');
        const caption = figure?.querySelector('figcaption');
        return caption?.innerText?.trim() || imageElement.alt || '通路结构图';
      }

      function openPathwayVisualDialog(imageElement) {
        const source = imageElement?.currentSrc || imageElement?.src;
        if (!pathwayVisualDialog || !pathwayVisualDialogImage || !source) return;
        const canvas = pathwayVisualDialog.querySelector('.pathway-visual-dialog-canvas');
        const stage = pathwayVisualDialog.querySelector('.pathway-visual-dialog-stage');
        canvas.querySelector('svg')?.remove();
        const sourceOverlay = imageElement === sceneBackground
          ? (sceneDeck.classList.contains('pathway-visual-active') && !sceneDeck.classList.contains('pathway-station-active') ? sceneExpertOverlay : null)
          : imageElement.closest('figure')?.querySelector('svg:not([hidden])');
        const hasOverlay = Boolean(sourceOverlay && !sourceOverlay.hidden && sourceOverlay.querySelector('text'));
        pathwayVisualDialog.classList.toggle('has-mechanism', hasOverlay);
        if (hasOverlay) {
          // Snapshot the visible mechanism, including styles scoped to its scene.
          // Copying only the raster background discards the reviewed annotations.
          const clone = sourceOverlay.cloneNode(true);
          const originals = [sourceOverlay, ...sourceOverlay.querySelectorAll('*')];
          const copies = [clone, ...clone.querySelectorAll('*')];
          const properties = ['fill', 'fill-opacity', 'stroke', 'stroke-width', 'stroke-opacity',
            'stroke-dasharray', 'stroke-linecap', 'stroke-linejoin', 'opacity', 'paint-order',
            'font-family', 'font-size', 'font-weight', 'font-style', 'letter-spacing',
            'text-anchor', 'dominant-baseline', 'transform', 'transform-origin', 'transform-box',
            'filter', 'vector-effect'];
          originals.forEach((node, index) => {
            const style = getComputedStyle(node);
            for (const property of properties) copies[index].style.setProperty(property, style.getPropertyValue(property));
            if (copies[index].id) copies[index].removeAttribute('id');
          });
          clone.removeAttribute('aria-hidden');
          clone.setAttribute('role', 'img');
          clone.setAttribute('aria-label', `${imageElement.alt || '当前通路'}机制标注`);
          Object.assign(clone.style, { left: '0', top: '0', width: '100%', height: '100%' });
          canvas.style.aspectRatio = `${imageElement.naturalWidth} / ${imageElement.naturalHeight}`;
          canvas.appendChild(clone);
        } else {
          canvas.style.removeProperty('aspect-ratio');
        }
        pathwayVisualDialogImage.src = source;
        pathwayVisualDialogImage.alt = imageElement.alt || '通路结构图大图';
        pathwayVisualDialogTitle.textContent = visualDialogCaptionFor(imageElement)
          + (hasOverlay ? ' · 左右滑动查看完整机制图' : '');
        if (typeof pathwayVisualDialog.showModal === 'function') pathwayVisualDialog.showModal();
        else pathwayVisualDialog.setAttribute('open', '');
        stage.scrollTo(0, 0);
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
        pathwayVisualDialog.querySelector('.pathway-visual-dialog-canvas svg')?.remove();
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
        { match: /脂酰-CoA 脱氢酶/, structure: '链长特异的二聚体或四聚体黄素酶', factors: '酶内 FAD；电子经 ETF / ETF:QO 进入辅酶 Q' },
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
          b.title = `${meta.label} · 查看所属区室与通路机制`;
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
        oxphos: '无文字内膜蛋白定位图', malate_aspartate: '苹果酸–天冬氨酸穿梭',
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
        // 氧化磷酸化由 SVG 叠加层承担文字与方向；无文字底图避免重复标签。
        oxphos: 'cell-metabolism-assets/optimized/19-inner-membrane-proteins.webp',
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
      // ETC 五站机制图（2K 无文字图版，生成规格见 docs/etc-station-plates-2k.md）：
      // 呼吸链按因果顺序分五步讲解，在机制页视角条内切换，再点一次放大。
      const expertPathwayStationPlates = {
        etc: [
          { label: '站 1 · 复合体 I', src: 'cell-metabolism-assets/optimized/etc-step-1-complex-i.webp', caption: 'NADH 在基质侧把两个电子交给复合体 I，电子沿复合体传向膜内辅酶 Q，同时 4 个 H⁺ 被泵到膜间隙侧。' },
          { label: '站 2 · 复合体 III', src: 'cell-metabolism-assets/optimized/etc-step-2-complex-iii.webp', caption: '还原型辅酶 Q 把电子送入复合体 III，经 Q 循环分流后交给膜间隙侧的细胞色素 c，净转移 4 个 H⁺ 到膜间隙。' },
          { label: '站 3 · 复合体 IV', src: 'cell-metabolism-assets/optimized/etc-step-3-complex-iv.webp', caption: '细胞色素 c 携带电子靠近复合体 IV，电子汇合后交给氧，氧结合基质侧质子生成水，同时泵出 2 个 H⁺。' },
          { label: '站 4 · H⁺ 梯度', src: 'cell-metabolism-assets/optimized/etc-step-4-proton-gradient.webp', caption: '膜间隙侧聚集更多质子，浓度差与电位差共同构成跨内膜电化学梯度，储存呼吸链释出的能量。' },
          { label: '站 5 · ATP 合酶', src: 'cell-metabolism-assets/optimized/etc-step-5-atp-synthase.webp', caption: 'H⁺ 经 F₀ 通道回流基质侧，F₁ 利用质子动力势把 ADP 与 Pi 合成 ATP。' }
        ]
      };

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
          expertPathPreviewCaption.textContent = `${displayText(scene.title || '所属场景')} · 点这里进入机制图 →`;
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
        // 主路径按通路理解推进：通路总览卡直接进入所属区室的机制图。
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
          structure: [['丙酮酸入场', '丙酮酸进入线粒体并形成乙酰辅酶 A'], ['循环收集电子', '三羧酸循环生成 NADH，并由复合体 II 把电子送入 CoQ'], ['电子跨膜传递', '穿梭与呼吸链把电子送入内膜复合体'], ['梯度驱动产能', '质子回流推动 ATP 合酶']],
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
          structure: [['汇总氨基', '转氨把许多氨基酸的氮集中到谷氨酸'], ['安全排氮', '尿素循环把有毒氨转成尿素'], ['碳骨架回流', '剩余部分进入丙酮酸、乙酰辅酶 A 或三羧酸循环']],
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
        transamination: 'ALT、AST 把许多氨基酸的氮集中到谷氨酸，再由谷氨酸脱氢酶释放铵离子。',
        urea: '线粒体基质与细胞质共同完成尿素循环；每合成 1 个尿素直接消耗 3 ATP，折算为 4 个高能磷酸键，鸟氨酸和瓜氨酸通过 ORNT1 衔接两侧反应。',
        aa_carbon: '去除氨基后的碳骨架分别进入丙酮酸、乙酰-CoA、乙酰乙酰-CoA或三羧酸循环中间体。',
        purine: '嘌呤环在 PRPP 核糖骨架上十步组装成 IMP；按本图从 R5P 到 IMP 直接计数为 5 个 ATP 分子、6 个高能磷酸键等价物，AMP/GMP 分支再分别使用 GTP/ATP。',
        pyrimidine: 'CAD 在胞质用 2 ATP 完成早期造环，DHODH 在线粒体内膜生成乳清酸；UMP 先到 UDP/CDP，再由 RNR 进入 dTTP/dCTP 分支。',
        nucleotide_degradation: '胞质核苷酸先去磷酸形成核苷和碱基；可补救回收的部分重新进入核苷酸池，其余继续降解。'
      };
      Object.assign(studentPathwayScientificCaptions, {
        pdh: 'E1、E2、E3 与五种辅酶接力，把丙酮酸转成乙酰-CoA、CO₂ 和 NADH。',
        tca: '乙酰-CoA 进入循环并再生草酰乙酸；每轮生成 3 NADH、1 GTP、2 CO₂，并由内膜复合体 II 把电子送入 CoQ 形成 CoQH₂。',
        etc: '复合体 I–IV 逐级传递电子，并由 I、III、IV 将质子泵到膜间隙；参考图中的 FADH₂ 是复合体 II 酶内电子中继，真实底物入口为琥珀酸。',
        oxphos: '质子经 ATP 合酶回流并驱动旋转，ANT 与磷酸载体再完成 ADP、Pi 和 ATP 的跨膜交换。',
        glycolysis: '能量投资阶段消耗 2 ATP，六碳中间体裂成两条三碳通路，最终净得 2 ATP、2 NADH 和 2 个丙酮酸。',
        beta_oxidation: '以饱和偶数碳链为例，脂酰-CoA 在基质中依次完成脱氢、水合、再脱氢和硫解；通常每轮释放 1 个乙酰-CoA，末轮 C4 释放 2 个。'
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
        tca: { topic: '生物氧化', lesson: '第 2 课 · 循环拆出电子', title: '三羧酸循环到底在循环什么？', question: '它不是只为了“绕一圈”，而是逐步氧化乙酰基：电子装进 NADH，或经琥珀酸脱氢酶的酶内 FAD 直接交给 CoQ。', goal: '把乙酰辅酶 A 的碳氧化成 CO₂', problem: '彻底氧化乙酰基，同时收集能交给呼吸链的电子。', input: '乙酰辅酶 A、NAD⁺、GDP + Pi、CoQ', output: 'CO₂、NADH、GTP、CoQH₂', location: '主要在线粒体基质；琥珀酸脱氢酶是内膜复合体 II', purpose: '为电子传递链持续提供 NADH，并把一对电子直接送入 CoQ 池。', terms: [['乙酰基', '乙酰辅酶 A 中真正被氧化的 2 个碳'], ['还原当量', 'NADH 或 CoQH₂携带、可交给呼吸链的高能电子'], ['补充反应', '补回被抽走的循环中间体']], story: [['2 个碳进入循环', '乙酰辅酶 A 与草酰乙酸结合，形成柠檬酸。'], ['脱羧释放 CO₂', '循环中的脱羧步骤释放 CO₂；乙酰基碳要经过连续多轮才完成氧化。'], ['电子被收集', '每一圈生成 3 NADH；复合体 II 的酶内 FAD 再把一对电子交给 CoQ，同时形成 1 GTP。']] },
        malate_aspartate: { topic: '生物氧化', lesson: '第 3 课 · 把胞质电子送入线粒体', title: 'NADH 进不了内膜，电子怎么办？', question: 'NADH 分子不能直接穿过线粒体内膜，细胞用穿梭反应把还原当量转交进去。', goal: '把胞质 NADH 的电子交给线粒体基质', problem: '解决 NADH 不能直接穿过内膜的空间限制。', input: '胞质 NADH + H⁺、基质 NAD⁺；OAA/苹果酸与谷氨酸/α-KG/天冬氨酸循环', output: '胞质 NAD⁺、基质 NADH + H⁺；循环中间体再生', location: '细胞质、线粒体内膜与基质', purpose: '把糖酵解等产生的胞质还原当量接到基质 NADH，再送入呼吸链复合体 I。', terms: [['穿梭', '不搬运 NADH 本身，而是借代谢物转交它的电子'], ['两台交换器', 'SLC25A11 交换苹果酸/α-KG；SLC25A12/13 交换天冬氨酸/谷氨酸 + H⁺'], ['转氨', 'GOT1/2 让 OAA 与天冬氨酸在两侧互换并闭合循环']], story: [['胞质 MDH1 接电子', 'OAA 消耗胞质 NADH + H⁺还原成苹果酸，同时再生胞质 NAD⁺。'], ['两台载体跨内膜交换', '苹果酸与 α-KG 反向交换；天冬氨酸输出与谷氨酸 + H⁺输入配对。'], ['基质 MDH2 重新生成 NADH', '苹果酸在基质被氧化为 OAA，基质 NAD⁺得到电子形成 NADH + H⁺并进入复合体 I。']] },
        glycerol_phosphate: { topic: '生物氧化', lesson: '第 4 课 · 另一条电子入口', title: '为什么同样是胞质 NADH，会有两种穿梭？', question: '甘油-3-磷酸穿梭不把 NADH 搬进基质，而是用代谢物与酶内辅基把电子直接交给 CoQ。', goal: '把胞质 NADH 的还原当量交给 CoQ 池', problem: '在 NADH 不能穿过内膜的前提下再生胞质 NAD⁺，并让电子进入呼吸链。', input: '胞质 NADH + H⁺、DHAP、CoQ', output: '胞质 NAD⁺、CoQH₂；DHAP 与甘油-3-磷酸循环再生', location: '细胞质、线粒体外膜/膜间隙与线粒体内膜', purpose: '电子由 CoQH₂接到复合体 III，绕过复合体 I；不生成基质 NADH。', terms: [['GPD1', '胞质酶，用 NADH 把 DHAP 还原为甘油-3-磷酸'], ['VDAC', '外膜通道，让甘油-3-磷酸和 DHAP 在胞质与膜间隙之间往返'], ['GPD2', '内膜酶，活性位点朝膜间隙；酶内 FAD 接电子后再还原 CoQ']], story: [['胞质 GPD1 先接电子', 'DHAP 消耗胞质 NADH + H⁺变成甘油-3-磷酸，同时再生胞质 NAD⁺。'], ['两种三碳磷酸经 VDAC 往返', '甘油-3-磷酸到膜间隙侧交出电子；形成的 DHAP 再返回胞质闭环。'], ['GPD2 把电子送入 CoQ 池', 'GPD2 的酶内 FAD/FADH₂完成接力，形成 CoQH₂并从复合体 III继续；NADH 本身不跨膜。']] },
        etc: { topic: '生物氧化', lesson: '第 5 课 · 电子流如何变成梯度', title: '呼吸链怎样把电子流变成“可用的力”？', question: 'NADH 和琥珀酸带来的电子，沿着内膜上的复合体逐级传递；复合体 II 先用酶内 FAD 接力，再把电子交给 CoQ，能量被用来泵出质子。', goal: '建立质子动力势，准备合成 ATP', problem: '把分散在 NADH 和琥珀酸里的电子能量，转换成跨内膜的质子梯度。', input: 'NADH、琥珀酸、氧气', output: 'NAD⁺、延胡索酸、CoQH₂、水、质子动力势', location: '线粒体内膜；质子积在膜间隙一侧', purpose: '建立 ATP 合酶可以利用的电化学梯度。', terms: [['电子载体', '在复合体之间接力传递电子的分子或复合体'], ['质子梯度', '内膜两侧 H⁺ 数量和电荷的差异'], ['末端电子受体', '氧气接收电子和质子，最终形成水']], story: [['电子开始接力', 'NADH 把电子交给复合体 I；琥珀酸在复合体 II 内由酶内 FAD 接收电子，再交给 CoQ。'], ['质子被泵出', '复合体 I、III、IV 利用电子能量，把 H⁺ 推到膜间隙。'], ['氧气收尾', '复合体 IV 让氧气接收电子和质子，形成水。']] },
        oxphos: { topic: '生物氧化', lesson: '第 6 课 · 梯度驱动 ATP', title: 'ATP 合酶为什么能制造 ATP？', question: '质子想回到基质，ATP 合酶把这股回流变成旋转，再推动 ADP 和 Pi 合成 ATP。', goal: '把质子动力势保存为 ATP', problem: '把线粒体内膜两侧的质子梯度转换成细胞可以直接使用的 ATP。', input: 'ADP、无机磷酸、质子动力势', output: 'ATP、水', location: '线粒体内膜与基质侧', purpose: 'ATP 是细胞最常用的即时能量货币。', terms: [['ATP', '可被细胞直接用来做功的能量货币'], ['ATP 合酶', '利用质子回流催化 ATP 形成的分子机器'], ['化学渗透', '用跨膜离子梯度驱动化学反应']], story: [['质子寻找回路', '膜间隙中的 H⁺ 不能自由穿过疏水的内膜。'], ['ATP 合酶转动', 'H⁺ 通过 ATP 合酶的通道，带动分子机器发生构象变化。'], ['ADP 变成 ATP', 'ADP 和 Pi 在基质侧结合，形成 ATP 供细胞使用。']] },
        glycolysis: { topic: '糖代谢', lesson: '糖代谢第 1 课 · 葡萄糖先变成丙酮酸', title: '一分子葡萄糖能先得到什么？', question: '糖酵解把 6 个碳的葡萄糖分成两份 3 个碳的丙酮酸，并直接得到少量 ATP。', goal: '看懂葡萄糖到丙酮酸的主干', problem: '快速取得 ATP，并把碳流送到乳酸、乙酰辅酶 A 或其他代谢方向。', input: '葡萄糖；先投入 2 ATP，再使用 ADP、Pi 和 NAD⁺', output: '2 个丙酮酸、净得 2 ATP、2 NADH', location: '细胞质', purpose: '不依赖线粒体也能供能，是所有细胞都重要的中央入口。', terms: [['底物水平磷酸化', '反应本身直接把磷酸基转给 ADP'], ['承诺步骤', '把中间体推向本通路的关键控制点'], ['丙酮酸', '糖酵解的 3 碳出口，可继续多种去路']], story: [['先投入能量', '前几步消耗 ATP，把葡萄糖变成更容易裂解的中间体。'], ['六碳裂成两条三碳', '果糖-1,6-二磷酸分成两个三碳分子。'], ['收回并赚取能量', '后半段生成 ATP 和 NADH，最后形成两个丙酮酸。']] },
        gluconeogenesis: { topic: '糖代谢', lesson: '糖代谢第 2 课 · 没有进食也要维持血糖', title: '糖异生是在“倒放”糖酵解吗？', question: '大部分步骤可以借用，但糖酵解的三个不可逆关卡需要绕路。', goal: '理解乳酸和氨基酸怎样回到葡萄糖', problem: '在空腹时为脑和红细胞维持血糖。', input: '乳酸、甘油、生糖氨基酸；还需 ATP/GTP 和 NADH', output: '葡萄糖、ADP/GDP、NAD⁺', location: '线粒体、细胞质和内质网协作', purpose: '避免血糖降到影响中枢神经和红细胞供能的程度。', terms: [['不可逆关卡', '热力学上很难直接倒回去的步骤'], ['生糖原料', '能够转成葡萄糖的乳酸、甘油或氨基酸'], ['空腹', '进食间隔中需要维持血糖的状态']], story: [['碳骨架先汇合', '乳酸和生糖氨基酸先进入丙酮酸或草酰乙酸。'], ['绕开三个关卡', '用另一组酶消耗能量和还原力，绕过糖酵解的不可逆步骤。'], ['恢复六碳结构', '中间体回到葡萄糖-6-磷酸，最后释放葡萄糖。']] },
        glycogenesis: { topic: '糖代谢', lesson: '糖代谢第 3 课 · 把多余葡萄糖存起来', title: '葡萄糖怎样变成糖原？', question: '吃饱后，细胞把葡萄糖活化成 UDP-葡萄糖，再接到糖原链上。', goal: '理解糖原是可快速取用的短期储备', problem: '把暂时用不完的葡萄糖存成紧凑、可分支的糖原。', input: '葡萄糖-6-磷酸、UTP、糖原引物', output: '糖原、UDP', location: '细胞质；肝和肌肉最重要', purpose: '肝脏帮助维持血糖，肌肉为自身收缩储备燃料。', terms: [['活化糖', '先和核苷酸结合，变成更容易转移的糖基'], ['糖原引物', '糖原合成开始时必须先有的一小段链'], ['分支', '让糖原同时拥有多个添加和释放葡萄糖的末端']], story: [['葡萄糖先改造', '葡萄糖-6-磷酸变成葡萄糖-1-磷酸。'], ['准备可转移的糖基', 'UDP-葡萄糖把葡萄糖暂时“装载”起来。'], ['延长并分支', '糖原合酶延长主链，分支酶让储备更易调用。']] },
        glycogenolysis: { topic: '糖代谢', lesson: '糖代谢第 4 课 · 需要时拆糖原', title: '糖原怎样快速提供葡萄糖？', question: '糖原磷酸化酶从末端逐个释放葡萄糖-1-磷酸，而不是先拆成游离葡萄糖。', goal: '看懂糖原储备怎样接回中央代谢', problem: '运动或空腹时快速动员已储存的葡萄糖。', input: '糖原、无机磷酸', output: '葡萄糖-1-磷酸；肝脏还可释放葡萄糖', location: '细胞质；肝和肌肉的处理结果不同', purpose: '肌肉就地供能，肝脏则帮助其他组织维持血糖。', terms: [['磷酸解', '用 Pi 切断糖苷键，释放带磷酸的糖'], ['去分支', '处理分支点，让主酶继续向前拆解'], ['组织分工', '肝能释放血糖，肌肉主要为自己使用']], story: [['从末端开始', '糖原磷酸化酶沿着非还原端释放葡萄糖-1-磷酸。'], ['遇到分支就换手', '去分支酶处理分支点，再把链交回主酶。'], ['接回糖酵解', '葡萄糖-1-磷酸变成葡萄糖-6-磷酸，进入供能路线。']] },
        ppp: { topic: '糖代谢', lesson: '糖代谢第 5 课 · 同一个葡萄糖的另一种用法', title: '细胞什么时候更需要 NADPH 而不是 ATP？', question: '磷酸戊糖途径把葡萄糖-6-磷酸分流，用来造还原力和核糖。', goal: '区分“供能”和“供还原力/原料”', problem: '为抗氧化、脂肪酸合成和核苷酸合成提供 NADPH 与核糖。', input: '葡萄糖-6-磷酸、NADP⁺', output: 'NADPH、核糖-5-磷酸、CO₂', location: '细胞质', purpose: 'NADPH 支持还原合成和谷胱甘肽再生，核糖用于造核苷酸。', terms: [['NADPH', '偏向合成和抗氧化使用的还原力'], ['核糖-5-磷酸', '制造核苷酸骨架的五碳原料'], ['分流', '同一个中间体根据需要进入不同路线']], story: [['氧化支路先产 NADPH', '葡萄糖-6-磷酸氧化并释放 CO₂。'], ['碳骨架变成核糖', '剩余五碳糖可以用于核苷酸合成。'], ['不需要核糖时回流', '非氧化阶段把碳骨架接回糖酵解中间体。']] },
        fa_synthesis: { topic: '脂代谢', lesson: '脂代谢第 1 课 · 把多余碳储成脂肪酸', title: '细胞怎样把碳和还原力做成脂肪酸？', question: '能量充足时，线粒体的乙酰辅酶 A 先以柠檬酸形式送到细胞质，再由 ATP-柠檬酸裂解酶释放乙酰辅酶 A，随后生成丙二酰辅酶 A 并逐轮加长。', goal: '理解脂肪酸合成是“加长 + 还原”', problem: '把多余的碳和 NADPH 保存成高能量密度的脂肪酸。', input: '细胞质乙酰辅酶 A、丙二酰辅酶 A、NADPH', output: '棕榈酸等脂肪酸', location: '细胞质；乙酰辅酶 A 由柠檬酸间接输出', purpose: '长期储能，并为膜脂和信号分子提供原料。', terms: [['丙二酰辅酶 A', '每一轮提供两个碳的延长单元'], ['乙酰辅酶 A 羧化酶', '脂肪酸合成的承诺和主要调控步骤'], ['NADPH', '为还原步骤提供电子']], story: [['先把碳送到细胞质', '线粒体乙酰辅酶 A 以柠檬酸形式输出，再由 ATP-柠檬酸裂解酶释放乙酰辅酶 A。'], ['准备两碳单元', '胞质乙酰辅酶 A 被羧化成丙二酰辅酶 A。'], ['反复缩合并还原', '脂肪酸合酶逐轮加入两个碳，并消耗 NADPH 完成还原。']] },
        carnitine: { topic: '脂代谢', lesson: '长链脂肪酸进入线粒体', title: '脂肪酸为什么需要肉碱穿梭？', question: '长链脂酰辅酶 A 不能直接穿过线粒体内膜，肉碱负责临时接力。', goal: '看懂脂肪酸进入 β-氧化现场的路线', problem: '把长链脂肪酸安全、定向地送进线粒体基质。', input: '长链脂酰辅酶 A、肉碱', output: '基质侧长链脂酰辅酶 A、游离肉碱', location: '线粒体外膜、膜间隙和内膜', purpose: '把脂肪酸供给 β-氧化，同时控制脂肪酸进入速度。', terms: [['脂酰基', '脂肪酸连接到辅酶 A 后的形式'], ['脂酰肉碱', '脂酰基暂时连接肉碱后形成的跨膜运输形式'], ['限速入口', '决定后续脂肪酸氧化速度的运输关卡']], story: [['外膜完成第一次转接', 'CPT-I 把脂酰基从 CoA 转给肉碱，形成脂酰肉碱。'], ['跨内膜完成交换', 'CACT 把脂酰肉碱送入基质侧，同时把游离肉碱送出。'], ['基质侧交还辅酶 A', 'CPT-II 把脂酰基交还给 CoA，重新形成脂酰辅酶 A。']] },
        beta_oxidation: { topic: '脂代谢', lesson: '脂代谢第 3 课 · 脂肪酸每轮缩短两个碳', title: 'β-氧化怎样把脂肪酸拆开？', question: '以饱和偶数碳链为例，进入基质后依次完成“脱氢→水合→再脱氢→硫解”；通常每轮切下 1 个乙酰-CoA，末轮 C4 会切下 2 个。', goal: '从脂酰-CoA的四步循环推导 ATP 产能', problem: '把长链脂肪酸拆成可进入三羧酸循环的乙酰-CoA，同时把电子交给呼吸链。', input: '脂酰-CoA、酶内 FAD、NAD⁺、H₂O、CoA-SH', output: '乙酰-CoA、NADH、酶内 FADH₂；缩短两个碳的脂酰-CoA', location: '线粒体基质；极长链脂肪酸先在过氧化物酶体缩短', purpose: '以 C16 为例，7 轮得到 8 个乙酰-CoA、7 个 NADH，FAD 电子经 ETF/ETF:QO 进入 CoQ；β-氧化本身不直接产生 ATP。', terms: [['肉碱穿梭', 'CPT1–CACT–CPT2把长链脂酰基送入基质'], ['β-碳', '从羰基碳数起的第二个碳，第三步在这里发生氧化'], ['硫解', 'β-酮硫解酶用 CoA-SH 切下两个碳的乙酰-CoA']], story: [['先准备底物', '脂肪酸先由 ACSL 活化；长链脂酰基经 CPT1、CACT 和 CPT2 进入基质。'], ['完成四步循环', '脂酰-CoA 在酶内 FAD、ETF/ETF:QO 和 NAD⁺的接力下完成两次脱氢，中间经过水合。'], ['切下并继续循环', '硫解切下乙酰-CoA；C16 的末轮 C4 释放 2 个乙酰-CoA，其他缩短脂酰-CoA继续下一轮。']] },
        ketone: { topic: '脂代谢', lesson: '脂代谢第 4 课 · 肝脏把脂肪做成备用燃料', title: '酮体为什么要在肝脏产生、别的组织使用？', question: '空腹时肝脏把过多乙酰辅酶 A 转成可运输的酮体，供心肌和脑等组织使用。', goal: '理解脂肪供能如何跨组织分配', problem: '当草酰乙酸优先用于糖异生时，给乙酰辅酶 A 找到出口。', input: '乙酰辅酶 A', output: '乙酰乙酸、β-羟丁酸、丙酮；外周组织再变回乙酰辅酶 A', location: '肝线粒体合成；肝外组织线粒体利用', purpose: '把肝脏的脂肪氧化能力变成全身可运输的燃料。', terms: [['酮体', '可在血液中运输的乙酰辅酶 A 替代燃料'], ['生酮', '把乙酰辅酶 A 合成为酮体'], ['肝脏例外', '肝脏制造酮体但缺少利用酮体的关键酶']], story: [['乙酰辅酶 A 堵在入口', '空腹时草酰乙酸被抽去做糖异生，TCA 处理能力下降。'], ['肝脏合成酮体', '两个乙酰辅酶 A 先合并，再形成乙酰乙酸等酮体。'], ['外周组织重新利用', '心肌、骨骼肌和脑把酮体变回乙酰辅酶 A。']] },
        transamination: { topic: '氨基酸与氮', lesson: '氨基酸第 1 课 · 氨基先集中到谷氨酸', title: '许多氨基酸的氨基怎样汇总处理？', question: '许多氨基酸可以把氨基转给 α-酮戊二酸，形成谷氨酸；具体去路依氨基酸、酶和组织而不同。', goal: '理解氨基转移和碳骨架分开处理', problem: '集中收集氨基，避免每种氨基酸都走一套完全不同的排氮路线。', input: '可转氨的氨基酸、α-酮戊二酸', output: '对应 α-酮酸、谷氨酸', location: '细胞质与线粒体；依酶和组织而不同', purpose: '谷氨酸既能继续释放氨，也能把氮转给尿素循环。', terms: [['转氨酶', '搬运氨基而不直接释放游离氨的酶'], ['α-酮酸', '失去氨基后的碳骨架'], ['PLP', '转氨酶使用的维生素 B₆ 衍生辅酶']], story: [['氨基先交给酶', 'PLP 暂时接住氨基，形成可转移的中间状态。'], ['换给 α-酮戊二酸', '氨基转移后生成谷氨酸。'], ['两条路分开', '碳骨架回到中央代谢，氮则进入排氮处理。']] },
        urea: { topic: '氨基酸与氮', lesson: '氨基酸第 2 课 · 把有毒氨变成尿素', title: '尿素循环解决的核心问题是什么？', question: '氨对神经系统有毒；肝脏把 NH₄⁺ 和天冬氨酸提供的两份氮装进尿素。', goal: '看懂两个区室接力完成的排氮路线', problem: '安全地清除氨基酸分解产生的氨。', input: 'NH₄⁺、HCO₃⁻、天冬氨酸；直接消耗 3 ATP', output: '尿素、延胡索酸；4 个高能磷酸键等价物', location: '肝细胞线粒体基质与细胞质', purpose: '把有毒氨转成可溶、可排出的尿素；ASS1 的 ATP→AMP + PPi 使 3 个 ATP 折算为 4 个高能磷酸键。', terms: [['两份氮', '第一份来自 NH₄⁺，第二份随天冬氨酸进入'], ['ATP→AMP', 'ASS1 这一步消耗 ATP 并生成 AMP + PPi'], ['鸟氨酸', '循环中的载体，反应后被再生']], story: [['在线粒体装入第一份氮', 'CPS1 用 2 ATP 把 NH₄⁺ 和 HCO₃⁻装入氨甲酰磷酸。'], ['接入第二份氮', 'ASS1 把天冬氨酸接到瓜氨酸上，同时 ATP→AMP + PPi。'], ['尿素释放并再生载体', 'ARG1 释放尿素，鸟氨酸回到线粒体；直接用了 3 个 ATP，但能量账是 4 个高能磷酸键。']] },
        aa_carbon: { topic: '氨基酸与氮', lesson: '氨基酸第 3 课 · 氨基酸的碳最后去哪儿', title: '去掉氨基后，氨基酸还剩什么？', question: '剩下的碳骨架会汇入丙酮酸、乙酰辅酶 A、乙酰乙酰-CoA 或三羧酸循环中间体。', goal: '区分生糖氨基酸和生酮氨基酸', problem: '把氨基酸的碳资源重新接回供能、产糖或产酮体路线。', input: '去氨基后的 α-酮酸和其他碳骨架', output: '丙酮酸、乙酰辅酶 A、乙酰乙酰-CoA、TCA 中间体', location: '细胞质与线粒体', purpose: '氨基酸不只是造蛋白质，也能在需要时补充能量和葡萄糖原料。', terms: [['生糖', '碳骨架可以净生成葡萄糖'], ['生酮', '碳骨架生成乙酰辅酶 A、乙酰乙酰-CoA 或酮体'], ['补充循环', '把中间体补回 TCA 以维持循环']], story: [['氮先被移走', '转氨或脱氨让碳骨架与氮分开。'], ['找到中央入口', '不同碳骨架进入丙酮酸、乙酰辅酶 A、乙酰乙酰-CoA 或 TCA 不同位置。'], ['按身体需要分配', '空腹偏向供糖，能量需求高时偏向氧化供能。']] },
        purine: { topic: '核苷酸代谢', lesson: '核苷酸第 1 课 · 从头搭建嘌呤', title: '嘌呤环是一次性造出来的吗？', question: '不是。细胞把氨基酸、一碳单位和 CO₂ 等小片段逐步装到核糖骨架上，先形成 IMP，再分到 AMP/GMP。', goal: '理解 IMP 是 AMP 和 GMP 的共同分叉点', problem: '从简单原料合成 DNA/RNA 和能量分子需要的嘌呤核苷酸。', input: '核糖-5-磷酸、ATP、甘氨酸、谷氨酰胺、天冬氨酸、10-甲酰-THF', output: 'IMP；AMP 分支用 GTP，GMP 分支用 ATP', location: '细胞质', purpose: '按本图从 R5P 到 IMP 直接计数需要 5 个 ATP 分子；PRPP 的 ATP→AMP 使能量账为 6 个高能磷酸键等价物。', terms: [['PRPP', '被活化的核糖磷酸骨架'], ['IMP', '嘌呤从头合成的第一个共同分叉点'], ['能量账', '5 个 ATP 分子中含 1 次 ATP→AMP，折算 6 个高能磷酸键']], story: [['先活化核糖', 'PRPP 合成酶用 ATP 把核糖-5-磷酸活化成 PRPP，同时释放 AMP。'], ['逐片拼环', '甘氨酸、谷氨酰胺、天冬氨酸、一碳单位和 CO₂依次加入；其中四步还要消耗 ATP。'], ['在 IMP 分叉', 'AMP 分支消耗 GTP，GMP 分支经 XMP 消耗 ATP；补救合成另有自己的计量。']] },
        pyrimidine: { topic: '核苷酸代谢', lesson: '核苷酸第 2 课 · 先造环，再接到核糖上', title: '从 UMP 到 DNA 前体，RNA 分支和 dNTP 分支怎样接上？', question: '嘧啶环先在核糖外组装好，再接到 PRPP 上形成 UMP；之后必须经过 UDP/CDP，才能进入 DNA 前体分支。', goal: '掌握 UMP 是嘧啶合成的入口', problem: '合成 UTP、CTP 以及 DNA 前体 dTTP、dCTP 所需的嘧啶核苷酸。', input: '谷氨酰胺、CO₂、天冬氨酸、PRPP、ATP；硫氧还蛋白和 5,10-亚甲基-THF', output: 'UMP、UTP、CTP；dTTP 和 dCTP', location: '细胞质；DHODH 这一步在线粒体内膜', purpose: 'CAD 造环阶段直接消耗 2 ATP；RNR 只还原 UDP/CDP 等二磷酸核苷酸，再分别进入 dTTP/dCTP 分支。', terms: [['UMP', '嘧啶从头合成的第一个核苷酸产物'], ['RNR', '把 UDP/CDP 等核糖核苷二磷酸还原成 dUDP/dCDP'], ['dTMP', 'TYMS 用 5,10-亚甲基-THF 把 dUMP 甲基化']], story: [['先拼出嘧啶环', 'CAD 用谷氨酰胺、CO₂、天冬氨酸和 2 ATP 形成环状前体。'], ['接上核糖并走 RNA 分支', '乳清酸接到 PRPP 上，生成 OMP 后脱羧成 UMP；UMP→UDP→UTP，CTP 合成酶再生成 CTP。'], ['进入 DNA 前体分支', 'RNR 把 UDP 或 CDP 还原为 dUDP/dCDP；dUDP 经 dUTP→dUMP→dTMP→dTTP，dCDP 经 dCTP 支路供 DNA。']] },
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

      function visibleReactionRows(pathwayId, rows) {
        if (pathwayId === 'tca') {
          // The graph stores citrate synthase twice so both acetyl-CoA and OAA can
          // connect to citrate. They are two substrate edges of one biochemical
          // event, not a ninth canonical TCA step. Keep the complete equation row.
          return rows.filter(reaction => !(
            reaction.from === '草酰乙酸@mito-matrix'
            && reaction.to === '柠檬酸@mito-matrix'
            && /柠檬酸合酶/.test(reaction.enzyme || '')
          ));
        }
        if (pathwayId === 'malate_aspartate') {
          const seen = new Set();
          return rows.filter(reaction => {
            const group = malateAspartateEventKey(reaction);
            if (!group || seen.has(group)) return false;
            seen.add(group);
            return true;
          });
        }
        if (pathwayId === 'glycerol_phosphate') {
          const seen = new Set();
          return rows.filter(reaction => {
            const group = glycerolPhosphateEventKey(reaction);
            if (!group || seen.has(group)) return false;
            seen.add(group);
            return true;
          });
        }
        return rows;
      }

      function malateAspartateEventKey(reaction) {
        const enzyme = String(reaction?.enzyme || '');
        if (/MDH1|胞质苹果酸脱氢酶/.test(enzyme)) return 'mdh1';
        if (/SLC25A11|苹果酸-α-KG/.test(enzyme)) return 'slc25a11';
        if (/MDH2|线粒体苹果酸脱氢酶/.test(enzyme)) return 'mdh2';
        if (/GOT2|线粒体天冬氨酸转氨酶/.test(enzyme)) return 'got2';
        if (/SLC25A12|SLC25A13|天冬氨酸-谷氨酸/.test(enzyme)) return 'slc25a12-13';
        if (/GOT1|胞质天冬氨酸转氨酶/.test(enzyme)) return 'got1';
        return '';
      }

      function glycerolPhosphateEventKey(reaction) {
        const enzyme = String(reaction?.enzyme || '');
        const from = String(reaction?.from || '');
        const to = String(reaction?.to || '');
        if (/GPD1|胞质甘油-3-磷酸脱氢酶/.test(enzyme)) return 'gpd1';
        if (/GPD2|线粒体甘油-3-磷酸脱氢酶/.test(enzyme)) return 'gpd2';
        if (/VDAC|外膜通道/.test(enzyme)) {
          if (/甘油-3-磷酸/.test(`${from} ${to}`)) return 'vdac-g3p';
          if (/磷酸二羟丙酮/.test(`${from} ${to}`)) return 'vdac-dhap';
        }
        return '';
      }

      function visibleReactionAliases(pathwayId, reaction, rows) {
        if (pathwayId === 'tca' && /柠檬酸合酶/.test(reaction.enzyme || '')) {
          return rows.filter(candidate => candidate.id !== reaction.id
            && /柠檬酸合酶/.test(candidate.enzyme || '')
            && candidate.to === reaction.to);
        }
        if (pathwayId === 'malate_aspartate') {
          const eventKey = malateAspartateEventKey(reaction);
          return rows.filter(candidate => candidate.id !== reaction.id
            && malateAspartateEventKey(candidate) === eventKey);
        }
        if (pathwayId === 'glycerol_phosphate') {
          const eventKey = glycerolPhosphateEventKey(reaction);
          return rows.filter(candidate => candidate.id !== reaction.id
            && glycerolPhosphateEventKey(candidate) === eventKey);
        }
        return [];
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
          studentPathwayMapVisualFrame?.classList.toggle('is-etc-cropped', pathwayId === 'etc');
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
          studentPathwayMapVisualFrame?.classList.remove('is-etc-cropped');
        }
        if (!studentPathwayMap || !studentMapBands || !studentMapEdges || !studentMapNodes) return;
        const { pathway, tone } = studentPathwayMeta(pathwayId);
        const steps = Array.isArray(pathway.steps) ? pathway.steps : [];
        const pathwayReactions = studentReactionsFor(pathwayId);
        studentPathwayMap.removeAttribute('data-map-layout');
        if (pathwayId === 'malate_aspartate') {
          renderMalateAspartateStudentMap(pathwayId, pathwayReactions, tone);
          return;
        }
        if (pathwayId === 'glycerol_phosphate') {
          renderGlycerolPhosphateStudentMap(pathwayId, pathwayReactions, tone);
          return;
        }
        if (pathwayId === 'glycolysis') {
          renderGlycolysisStudentMap(pathwayId, pathwayReactions, tone);
          return;
        }
        if (pathwayId === 'gluconeogenesis') {
          renderGluconeogenesisStudentMap(pathwayId, pathwayReactions, tone);
          return;
        }
        if (pathwayId === 'glycogenesis') {
          renderGlycogenesisStudentMap(pathwayId, pathwayReactions, tone);
          return;
        }
        if (pathwayId === 'glycogenolysis') {
          renderGlycogenolysisStudentMap(pathwayId, pathwayReactions, tone);
          return;
        }
        if (pathwayId === 'ppp') {
          renderPppStudentMap(pathwayId, pathwayReactions, tone);
          return;
        }
        if (pathwayId === 'fa_synthesis') {
          renderFaSynthesisStudentMap(pathwayId, pathwayReactions, tone);
          return;
        }
        if (pathwayId === 'carnitine') {
          renderCarnitineStudentMap(pathwayId, pathwayReactions, tone);
          return;
        }
        if (pathwayId === 'beta_oxidation') {
          renderBetaOxidationStudentMap(pathwayId, pathwayReactions, tone);
          return;
        }
        if (pathwayId === 'ketone') {
          renderKetoneStudentMap(pathwayId, pathwayReactions, tone);
          return;
        }
        if (pathwayId === 'transamination') {
          renderTransaminationStudentMap(pathwayId, pathwayReactions, tone);
          return;
        }
        if (pathwayId === 'urea') {
          renderUreaStudentMap(pathwayId, pathwayReactions, tone);
          return;
        }
        if (pathwayId === 'aa_carbon') {
          renderAaCarbonStudentMap(pathwayId, pathwayReactions, tone);
          return;
        }
        if (pathwayId === 'purine') {
          renderPurineStudentMap(pathwayId, pathwayReactions, tone);
          return;
        }
        if (pathwayId === 'pyrimidine') {
          renderPyrimidineStudentMap(pathwayId, pathwayReactions, tone);
          return;
        }
        if (pathwayId === 'nucleotide_degradation') {
          renderNucleotideDegradationStudentMap(pathwayId, pathwayReactions, tone);
          return;
        }
        if (pathwayId === 'tca') {
          renderTcaStudentMap(pathwayId, pathwayReactions, tone);
          return;
        }
        if (pathwayId === 'pdh') {
          renderPdhStudentMap(pathwayId, pathwayReactions, tone);
          return;
        }
        if (pathwayId === 'etc') {
          renderEtcStudentMap(pathwayId, pathwayReactions, tone);
          return;
        }
        if (pathwayId === 'oxphos') {
          renderOxphosStudentMap(pathwayId, pathwayReactions, tone);
          return;
        }
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

      function renderMalateAspartateStudentMap(pathwayId, pathwayReactions, tone) {
        const viewWidth = 1280;
        const viewHeight = 930;
        const nodeWidth = 136;
        const nodeHeight = 54;
        const ownReactions = pathwayReactions.filter(reaction => groupsFor(reaction).includes(pathwayId));
        const eventRows = visibleReactionRows(pathwayId, ownReactions);
        const eventByKey = new Map(eventRows.map(reaction => [malateAspartateEventKey(reaction), reaction]));

        studentPathwayMap.setAttribute('viewBox', `0 0 ${viewWidth} ${viewHeight}`);
        studentPathwayMap.dataset.mapLayout = 'malate-aspartate-cycle';
        studentPathwayMap.setAttribute('aria-label', '苹果酸-天冬氨酸穿梭：六个机制事件在胞质、线粒体内膜与基质之间闭环，把胞质NADH的还原当量转成基质NADH，NADH分子本身不跨内膜');
        studentMapBands.replaceChildren();
        studentMapEdges.replaceChildren();
        studentMapNodes.replaceChildren();
        studentMapCount.textContent = '6 个机制事件 · 2 台内膜交换器';

        [
          { key: 'cytosol', y: 22, height: 242, className: 'mas-cytosol-band', label: '细胞质半环 · MDH1 接收糖酵解 NADH；GOT1 闭合 OAA' },
          { key: 'transport', y: 280, height: 210, className: 'mas-transport-band', label: '线粒体内膜 · 两台交换器搬运代谢物，不搬运 NADH' },
          { key: 'matrix', y: 506, height: 252, className: 'mas-matrix-band', label: '线粒体基质半环 · MDH2 生成基质 NADH；GOT2 生成天冬氨酸' },
          { key: 'net', y: 776, height: 112, className: 'mas-net-band', label: '净效果 · 还原当量由胞质转到基质' }
        ].forEach(zone => {
          studentMapBands.appendChild(studentSvgElement('rect', {
            x: 24, y: zone.y, width: 1232, height: zone.height,
            class: `student-map-band ${zone.className}`, 'data-shuttle-zone': zone.key
          }));
          if (zone.key !== 'net') {
            studentMapBands.appendChild(studentSvgElement('text', {
              x: 48, y: zone.y + 30, class: 'student-map-band-label'
            }, zone.label));
          }
        });

        const nodeDefinitions = [
          { key: 'oaa-c', entityId: '草酰乙酸@cytosol', label: '草酰乙酸', meta: 'OAA · 胞质', x: 110, y: 140, reaction: eventByKey.get('mdh1') },
          { key: 'malate-c', entityId: '苹果酸@cytosol', label: '苹果酸', meta: '胞质', x: 370, y: 140, reaction: eventByKey.get('slc25a11') },
          { key: 'aspartate-c', entityId: '天冬氨酸@cytosol', label: '天冬氨酸', meta: '胞质', x: 920, y: 140, reaction: eventByKey.get('got1') },
          { key: 'alpha-kg-c', entityId: 'α-酮戊二酸@cytosol', label: 'α-KG', meta: '胞质 · 交换出', x: 650, y: 225, reaction: eventByKey.get('got1'), className: 'mas-companion-node' },
          { key: 'glutamate-c', entityId: '谷氨酸@cytosol', label: '谷氨酸 + H⁺', meta: '胞质 · 交换入', x: 1120, y: 225, reaction: eventByKey.get('slc25a12-13'), className: 'mas-companion-node' },
          { key: 'nadh-c', entityId: 'NADH@cytosol', label: 'NADH + H⁺', meta: '胞质 · 交出电子', x: 120, y: 225, reaction: eventByKey.get('mdh1'), className: 'mas-redox-node' },
          { key: 'nad-c', entityId: 'NAD⁺@cytosol', label: 'NAD⁺', meta: '胞质 · 再生', x: 360, y: 225, reaction: eventByKey.get('mdh1'), className: 'mas-redox-node' },
          { key: 'slc25a11', entityId: '', label: 'SLC25A11', meta: '苹果酸 / α-KG 反向交换', x: 370, y: 385, reaction: eventByKey.get('slc25a11'), className: 'mas-carrier-node', width: 190 },
          { key: 'slc25a12-13', entityId: '', label: 'SLC25A12/13', meta: '天冬氨酸 / 谷氨酸-H⁺交换', x: 920, y: 385, reaction: eventByKey.get('slc25a12-13'), className: 'mas-carrier-node', width: 206 },
          { key: 'malate-m', entityId: '苹果酸@mito-matrix', label: '苹果酸', meta: '基质', x: 370, y: 630, reaction: eventByKey.get('mdh2') },
          { key: 'oaa-m', entityId: '草酰乙酸@mito-matrix', label: '草酰乙酸', meta: 'OAA · 基质', x: 620, y: 630, reaction: eventByKey.get('got2') },
          { key: 'aspartate-m', entityId: '天冬氨酸@mito-matrix', label: '天冬氨酸', meta: '基质', x: 920, y: 630, reaction: eventByKey.get('slc25a12-13') },
          { key: 'alpha-kg-m', entityId: 'α-酮戊二酸@mito-matrix', label: 'α-KG', meta: '基质 · 交换出', x: 650, y: 710, reaction: eventByKey.get('slc25a11'), className: 'mas-companion-node' },
          { key: 'glutamate-m', entityId: '谷氨酸@mito-matrix', label: '谷氨酸', meta: '基质 · 交换入', x: 1120, y: 710, reaction: eventByKey.get('got2'), className: 'mas-companion-node' },
          { key: 'nad-m', entityId: 'NAD⁺@mito-matrix', label: 'NAD⁺', meta: '基质 · 接收电子', x: 350, y: 545, reaction: eventByKey.get('mdh2'), className: 'mas-redox-node' },
          { key: 'nadh-m', entityId: 'NADH@mito-matrix', label: 'NADH + H⁺', meta: '基质 · 进入复合体 I', x: 560, y: 545, reaction: eventByKey.get('mdh2'), className: 'mas-redox-node' }
        ];
        const nodeRecords = new Map(nodeDefinitions.map(definition => [definition.key, {
          ...definition,
          entity: definition.entityId ? entityById[definition.entityId] || null : null
        }]));

        const edgeDefinitions = [
          { from: 'oaa-c', to: 'malate-c', reaction: eventByKey.get('mdh1') },
          { from: 'nadh-c', to: 'nad-c', reaction: eventByKey.get('mdh1'), className: 'mas-redox-edge' },
          { from: 'malate-c', to: 'slc25a11', reaction: eventByKey.get('slc25a11'), className: 'transport' },
          { from: 'slc25a11', to: 'malate-m', reaction: eventByKey.get('slc25a11'), className: 'transport' },
          { from: 'alpha-kg-m', to: 'slc25a11', reaction: eventByKey.get('slc25a11'), className: 'mas-exchange-edge transport' },
          { from: 'slc25a11', to: 'alpha-kg-c', reaction: eventByKey.get('slc25a11'), className: 'mas-exchange-edge transport' },
          { from: 'malate-m', to: 'oaa-m', reaction: eventByKey.get('mdh2') },
          { from: 'nad-m', to: 'nadh-m', reaction: eventByKey.get('mdh2'), className: 'mas-redox-edge' },
          { from: 'oaa-m', to: 'aspartate-m', reaction: eventByKey.get('got2') },
          { from: 'glutamate-m', to: 'alpha-kg-m', reaction: eventByKey.get('got2'), className: 'mas-companion-edge' },
          { from: 'aspartate-m', to: 'slc25a12-13', reaction: eventByKey.get('slc25a12-13'), className: 'transport' },
          { from: 'slc25a12-13', to: 'aspartate-c', reaction: eventByKey.get('slc25a12-13'), className: 'transport' },
          { from: 'glutamate-c', to: 'slc25a12-13', reaction: eventByKey.get('slc25a12-13'), className: 'mas-exchange-edge transport' },
          { from: 'slc25a12-13', to: 'glutamate-m', reaction: eventByKey.get('slc25a12-13'), className: 'mas-exchange-edge transport' },
          { from: 'aspartate-c', to: 'oaa-c', reaction: eventByKey.get('got1'), path: 'M 852 140 C 770 72, 260 72, 178 140' },
          { from: 'alpha-kg-c', to: 'glutamate-c', reaction: eventByKey.get('got1'), className: 'mas-companion-edge' }
        ];

        edgeDefinitions.forEach(definition => {
          const source = nodeRecords.get(definition.from);
          const target = nodeRecords.get(definition.to);
          if (!source || !target) return;
          const sourceWidth = source.width || nodeWidth;
          const targetWidth = target.width || nodeWidth;
          const edge = studentSvgElement('path', {
            d: definition.path || studentMapEdgePath(source, target, Math.max(sourceWidth, targetWidth), nodeHeight),
            class: `student-map-edge mas-edge ${definition.className || ''}`,
            'data-edge-from': definition.from,
            'data-edge-to': definition.to,
            'data-reaction': definition.reaction?.id || ''
          });
          if (definition.reaction) {
            const openReaction = () => renderStudentReactionDetail(definition.reaction, pathwayId, eventRows.indexOf(definition.reaction));
            edge.setAttribute('role', 'button');
            edge.tabIndex = 0;
            edge.addEventListener('click', event => { event.stopPropagation(); openReaction(); });
            edge.addEventListener('keydown', event => {
              if (event.key !== 'Enter' && event.key !== ' ') return;
              event.preventDefault();
              openReaction();
            });
          }
          studentMapEdges.appendChild(edge);
          applyStudentReactionDirection(edge, definition.reaction);
        });

        nodeRecords.forEach(record => {
          const width = record.width || nodeWidth;
          const node = studentSvgElement('g', {
            class: `student-map-node mas-node ${record.className || ''}`,
            style: `--tone:${tone}`,
            'data-map-key': record.key,
            'data-entity-id': record.entityId,
            'data-reaction': record.reaction?.id || '',
            role: 'button', tabindex: '0',
            'aria-label': `${record.label}，${record.meta}`
          });
          node.appendChild(studentSvgElement('title', {}, `${record.label} · ${record.meta}`));
          node.appendChild(studentSvgElement('rect', {
            x: record.x - width / 2, y: record.y - nodeHeight / 2, width, height: nodeHeight, rx: 14
          }));
          const name = studentSvgElement('text', { x: record.x, y: record.y + 1, class: 'node-name' }, record.label);
          node.appendChild(name);
          node.appendChild(studentSvgElement('text', { x: record.x, y: record.y + 19, class: 'node-compartment' }, record.meta));
          const selectNode = () => renderStudentNodeSelection(record.entity, record.reaction, pathwayId, eventRows.indexOf(record.reaction), 0);
          node.addEventListener('click', event => { event.stopPropagation(); selectNode(); });
          node.addEventListener('keydown', event => {
            if (event.key !== 'Enter' && event.key !== ' ') return;
            event.preventDefault();
            selectNode();
          });
          studentMapNodes.appendChild(node);
          fitStudentMapText(name, width - 16, 15.5, 9.5);
        });

        [
          { key: 'mdh1', label: 'MDH1', x: 245, y: 112 },
          { key: 'slc25a11', label: 'SLC25A11', x: 515, y: 355 },
          { key: 'mdh2', label: 'MDH2', x: 495, y: 608 },
          { key: 'got2', label: 'GOT2', x: 770, y: 608 },
          { key: 'slc25a12-13', label: 'SLC25A12/13', x: 1065, y: 355 },
          { key: 'got1', label: 'GOT1', x: 650, y: 82 }
        ].forEach(eventDefinition => {
          const reaction = eventByKey.get(eventDefinition.key);
          const eventLabel = studentSvgElement('text', {
            x: eventDefinition.x, y: eventDefinition.y,
            class: 'student-mas-event', 'data-mas-event': eventDefinition.key,
            'text-anchor': 'middle', role: 'button', tabindex: '0'
          }, eventDefinition.label);
          const openReaction = () => reaction && renderStudentReactionDetail(reaction, pathwayId, eventRows.indexOf(reaction));
          eventLabel.addEventListener('click', event => { event.stopPropagation(); openReaction(); });
          eventLabel.addEventListener('keydown', event => {
            if (event.key !== 'Enter' && event.key !== ' ') return;
            event.preventDefault();
            openReaction();
          });
          studentMapNodes.appendChild(eventLabel);
        });

        [
          { x: 245, y: 190, text: '胞质 NADH → NAD⁺', className: 'student-mas-redox-label' },
          { x: 370, y: 470, text: '苹果酸入 · α-KG 出', className: 'student-mas-exchange-label' },
          { x: 455, y: 700, text: '基质 NAD⁺ → NADH', className: 'student-mas-redox-label' },
          { x: 920, y: 470, text: '天冬氨酸出 · 谷氨酸 + H⁺入', className: 'student-mas-exchange-label' }
        ].forEach(item => studentMapNodes.appendChild(studentSvgElement('text', {
          x: item.x, y: item.y, class: item.className, 'text-anchor': 'middle'
        }, item.text)));

        const summary = studentSvgElement('g', {
          class: 'student-mas-summary',
          'aria-label': '净效果：还原当量转移，胞质NADH的电子成为基质NADH，NADH不跨膜'
        });
        summary.appendChild(studentSvgElement('rect', { x: 48, y: 798, width: 820, height: 68, rx: 18 }));
        summary.appendChild(studentSvgElement('text', { x: 458, y: 825, class: 'summary-main', 'text-anchor': 'middle' }, '还原当量转移 · NADH 不跨膜'));
        summary.appendChild(studentSvgElement('text', { x: 458, y: 852, class: 'summary-note', 'text-anchor': 'middle' }, '胞质 NADH → NAD⁺　|　基质 NAD⁺ → NADH'));
        studentMapNodes.appendChild(summary);

        const nextPath = studentSvgElement('g', {
          class: 'student-map-next-pathway mas-next-pathway',
          'data-next-pathway': 'etc', role: 'button', tabindex: '0',
          'aria-label': '基质NADH下一站：电子传递链复合体I'
        });
        nextPath.appendChild(studentSvgElement('rect', { x: 930, y: 798, width: 292, height: 68, rx: 16 }));
        nextPath.appendChild(studentSvgElement('text', { x: 1076, y: 825, class: 'next-label' }, '电子传递链下一站'));
        nextPath.appendChild(studentSvgElement('text', { x: 1076, y: 852, class: 'next-name' }, '基质 NADH → 复合体 I'));
        const openEtc = () => renderStudentPathway('etc', { returnToPrimer: false });
        nextPath.addEventListener('click', event => { event.stopPropagation(); openEtc(); });
        nextPath.addEventListener('keydown', event => {
          if (event.key !== 'Enter' && event.key !== ' ') return;
          event.preventDefault();
          openEtc();
        });
        studentMapNodes.appendChild(nextPath);

        studentMapBands.appendChild(studentSvgElement('text', {
          x: 48, y: 918, class: 'student-map-pan-hint', 'data-map-hint': 'horizontal'
        }, '横向查看：胞质半环 → 两台交换器 → 基质半环 →'));
        setStudentReadingStep(pathwayId, 0);
      }

      function renderGlycerolPhosphateStudentMap(pathwayId, pathwayReactions, tone) {
        const viewWidth = 1280;
        const viewHeight = 900;
        const nodeWidth = 148;
        const nodeHeight = 56;
        const ownReactions = pathwayReactions.filter(reaction => groupsFor(reaction).includes(pathwayId));
        const eventRows = visibleReactionRows(pathwayId, ownReactions);
        const eventByKey = new Map(eventRows.map(reaction => [glycerolPhosphateEventKey(reaction), reaction]));

        studentPathwayMap.setAttribute('viewBox', `0 0 ${viewWidth} ${viewHeight}`);
        studentPathwayMap.dataset.mapLayout = 'glycerol-phosphate-cycle';
        studentPathwayMap.setAttribute('aria-label', '甘油-3-磷酸穿梭：胞质GPD1、外膜VDAC与内膜GPD2组成四事件闭环，把胞质NADH的还原当量交给CoQ池；NADH不跨膜，也不生成基质NADH');
        studentMapBands.replaceChildren();
        studentMapEdges.replaceChildren();
        studentMapNodes.replaceChildren();
        studentMapCount.textContent = '4 个机制事件 · 2 次外膜通过 · 1 个 CoQ 入口';

        [
          { key: 'cytosol', y: 22, height: 214, className: 'gp-cytosol-band', label: '细胞质 · GPD1 用胞质 NADH 把 DHAP 还原为甘油-3-磷酸' },
          { key: 'outer-membrane', y: 250, height: 94, className: 'gp-outer-band', label: '线粒体外膜 · VDAC 让两种三碳磷酸往返' },
          { key: 'intermembrane', y: 358, height: 236, className: 'gp-ims-band', label: '膜间隙侧 · GPD2 活性位点接收甘油-3-磷酸' },
          { key: 'inner-membrane', y: 608, height: 116, className: 'gp-inner-band', label: '线粒体内膜 · GPD2 的酶内 FAD 把电子送入 CoQ 池' },
          { key: 'net', y: 740, height: 112, className: 'gp-net-band', label: '净效果 · 胞质 NADH 的还原当量进入 CoQ，不进入基质 NADH 池' }
        ].forEach(zone => {
          studentMapBands.appendChild(studentSvgElement('rect', {
            x: 24, y: zone.y, width: 1232, height: zone.height,
            class: `student-map-band ${zone.className}`, 'data-gp-zone': zone.key
          }));
          if (zone.key !== 'net') {
            studentMapBands.appendChild(studentSvgElement('text', {
              x: 48, y: zone.y + 29, class: 'student-map-band-label'
            }, zone.label));
          }
        });

        const nodeDefinitions = [
          { key: 'dhap-c', entityId: '磷酸二羟丙酮@cytosol', label: 'DHAP', meta: '磷酸二羟丙酮 · 胞质', x: 126, y: 132, reaction: eventByKey.get('gpd1') },
          { key: 'g3p-c', entityId: '甘油-3-磷酸@cytosol', label: '甘油-3-磷酸', meta: '胞质 · 携带电子', x: 420, y: 132, reaction: eventByKey.get('vdac-g3p') },
          { key: 'nadh-c', entityId: 'NADH@cytosol', label: 'NADH + H⁺', meta: '胞质 · 交出电子', x: 126, y: 204, reaction: eventByKey.get('gpd1'), className: 'gp-redox-node' },
          { key: 'nad-c', entityId: 'NAD⁺@cytosol', label: 'NAD⁺', meta: '胞质 · 再生', x: 420, y: 204, reaction: eventByKey.get('gpd1'), className: 'gp-redox-node' },
          { key: 'vdac-g3p', entityId: '', label: 'VDAC', meta: '甘油-3-P 到膜间隙侧', x: 420, y: 297, reaction: eventByKey.get('vdac-g3p'), className: 'gp-carrier-node', width: 190 },
          { key: 'vdac-dhap', entityId: '', label: 'VDAC', meta: 'DHAP 返回胞质', x: 126, y: 297, reaction: eventByKey.get('vdac-dhap'), className: 'gp-carrier-node', width: 178 },
          { key: 'g3p-ims', entityId: '甘油-3-磷酸@mito-ims', label: '甘油-3-磷酸', meta: '膜间隙侧', x: 420, y: 470, reaction: eventByKey.get('gpd2') },
          { key: 'gpd2', entityId: '', label: 'GPD2', meta: '内膜酶 · 活性位点朝膜间隙', x: 650, y: 470, reaction: eventByKey.get('gpd2'), className: 'gp-enzyme-node', width: 212 },
          { key: 'dhap-ims', entityId: '磷酸二羟丙酮@mito-ims', label: 'DHAP', meta: '膜间隙侧 · 返回', x: 888, y: 470, reaction: eventByKey.get('vdac-dhap') },
          { key: 'fad', entityId: '', label: 'FAD', meta: 'GPD2 酶内辅基', x: 565, y: 555, reaction: eventByKey.get('gpd2'), className: 'gp-flavin-node' },
          { key: 'fadh2', entityId: '', label: 'FADH₂', meta: 'GPD2 酶内还原态', x: 742, y: 555, reaction: eventByKey.get('gpd2'), className: 'gp-flavin-node' },
          { key: 'coq', entityId: '辅酶 Q@mito-inner-membrane', label: 'CoQ', meta: '内膜 Q 池', x: 930, y: 667, reaction: eventByKey.get('gpd2'), className: 'gp-q-node' },
          { key: 'coqh2', entityId: '泛醇@mito-inner-membrane', label: 'CoQH₂', meta: '电子进入复合体 III', x: 1120, y: 667, reaction: eventByKey.get('gpd2'), className: 'gp-q-node' }
        ];
        const nodeRecords = new Map(nodeDefinitions.map(definition => [definition.key, {
          ...definition,
          entity: definition.entityId ? entityById[definition.entityId] || null : null
        }]));

        const edgeDefinitions = [
          { from: 'dhap-c', to: 'g3p-c', reaction: eventByKey.get('gpd1') },
          { from: 'nadh-c', to: 'nad-c', reaction: eventByKey.get('gpd1'), className: 'gp-redox-edge' },
          { from: 'g3p-c', to: 'vdac-g3p', reaction: eventByKey.get('vdac-g3p'), className: 'transport' },
          { from: 'vdac-g3p', to: 'g3p-ims', reaction: eventByKey.get('vdac-g3p'), className: 'transport' },
          { from: 'g3p-ims', to: 'gpd2', reaction: eventByKey.get('gpd2') },
          { from: 'gpd2', to: 'dhap-ims', reaction: eventByKey.get('gpd2') },
          { from: 'fad', to: 'fadh2', reaction: eventByKey.get('gpd2'), className: 'gp-flavin-edge' },
          { from: 'fadh2', to: 'coq', reaction: eventByKey.get('gpd2'), className: 'gp-electron-edge', path: 'M 816 555 C 870 570, 900 606, 926 640' },
          { from: 'coq', to: 'coqh2', reaction: eventByKey.get('gpd2'), className: 'gp-electron-edge' },
          { from: 'dhap-ims', to: 'vdac-dhap', reaction: eventByKey.get('vdac-dhap'), className: 'transport', path: 'M 814 470 C 630 398, 260 400, 142 269' },
          { from: 'vdac-dhap', to: 'dhap-c', reaction: eventByKey.get('vdac-dhap'), className: 'transport' }
        ];

        edgeDefinitions.forEach(definition => {
          const source = nodeRecords.get(definition.from);
          const target = nodeRecords.get(definition.to);
          if (!source || !target) return;
          const edge = studentSvgElement('path', {
            d: definition.path || studentMapEdgePath(source, target, Math.max(source.width || nodeWidth, target.width || nodeWidth), nodeHeight),
            class: `student-map-edge gp-edge ${definition.className || ''}`,
            'data-edge-from': definition.from,
            'data-edge-to': definition.to,
            'data-reaction': definition.reaction?.id || ''
          });
          if (definition.reaction) {
            const openReaction = () => renderStudentReactionDetail(definition.reaction, pathwayId, eventRows.indexOf(definition.reaction));
            edge.setAttribute('role', 'button');
            edge.tabIndex = 0;
            edge.addEventListener('click', event => { event.stopPropagation(); openReaction(); });
            edge.addEventListener('keydown', event => {
              if (event.key !== 'Enter' && event.key !== ' ') return;
              event.preventDefault();
              openReaction();
            });
          }
          studentMapEdges.appendChild(edge);
          applyStudentReactionDirection(edge, definition.reaction);
        });

        nodeRecords.forEach(record => {
          const width = record.width || nodeWidth;
          const node = studentSvgElement('g', {
            class: `student-map-node gp-node ${record.className || ''}`,
            style: `--tone:${tone}`,
            'data-map-key': record.key,
            'data-entity-id': record.entityId,
            'data-reaction': record.reaction?.id || '',
            role: 'button', tabindex: '0',
            'aria-label': `${record.label}，${record.meta}`
          });
          node.appendChild(studentSvgElement('title', {}, `${record.label} · ${record.meta}`));
          node.appendChild(studentSvgElement('rect', {
            x: record.x - width / 2, y: record.y - nodeHeight / 2, width, height: nodeHeight, rx: 14
          }));
          const name = studentSvgElement('text', { x: record.x, y: record.y + 1, class: 'node-name' }, record.label);
          node.appendChild(name);
          node.appendChild(studentSvgElement('text', { x: record.x, y: record.y + 19, class: 'node-compartment' }, record.meta));
          const selectNode = () => renderStudentNodeSelection(record.entity, record.reaction, pathwayId, eventRows.indexOf(record.reaction), 0);
          node.addEventListener('click', event => { event.stopPropagation(); selectNode(); });
          node.addEventListener('keydown', event => {
            if (event.key !== 'Enter' && event.key !== ' ') return;
            event.preventDefault();
            selectNode();
          });
          studentMapNodes.appendChild(node);
          fitStudentMapText(name, width - 16, 15.5, 9.5);
        });

        [
          { key: 'gpd1', label: 'GPD1', x: 273, y: 102 },
          { key: 'vdac-g3p', label: 'VDAC · 甘油-3-P', x: 560, y: 331 },
          { key: 'gpd2', label: 'GPD2', x: 650, y: 425 },
          { key: 'vdac-dhap', label: 'VDAC · DHAP', x: 270, y: 424 }
        ].forEach(eventDefinition => {
          const reaction = eventByKey.get(eventDefinition.key);
          const eventLabel = studentSvgElement('text', {
            x: eventDefinition.x, y: eventDefinition.y,
            class: 'student-gp-event', 'data-gp-event': eventDefinition.key,
            'text-anchor': 'middle', role: 'button', tabindex: '0'
          }, eventDefinition.label);
          const openReaction = () => reaction && renderStudentReactionDetail(reaction, pathwayId, eventRows.indexOf(reaction));
          eventLabel.addEventListener('click', event => { event.stopPropagation(); openReaction(); });
          eventLabel.addEventListener('keydown', event => {
            if (event.key !== 'Enter' && event.key !== ' ') return;
            event.preventDefault();
            openReaction();
          });
          studentMapNodes.appendChild(eventLabel);
        });

        [
          { x: 273, y: 182, text: '胞质 NADH → NAD⁺', className: 'student-gp-redox-label' },
          { x: 653, y: 595, text: '酶内 FAD → FADH₂', className: 'student-gp-flavin-label' },
          { x: 1025, y: 628, text: 'CoQ → CoQH₂', className: 'student-gp-q-label' }
        ].forEach(item => studentMapNodes.appendChild(studentSvgElement('text', {
          x: item.x, y: item.y, class: item.className, 'text-anchor': 'middle'
        }, item.text)));

        const summary = studentSvgElement('g', {
          class: 'student-gp-summary',
          'aria-label': '净效果：还原当量进入CoQ，NADH不跨膜，不生成基质NADH，绕过复合体I'
        });
        summary.appendChild(studentSvgElement('rect', { x: 48, y: 760, width: 836, height: 70, rx: 18 }));
        summary.appendChild(studentSvgElement('text', { x: 466, y: 787, class: 'summary-main', 'text-anchor': 'middle' }, '还原当量进入 CoQ · NADH 不跨膜'));
        summary.appendChild(studentSvgElement('text', { x: 466, y: 814, class: 'summary-note', 'text-anchor': 'middle' }, '不生成基质 NADH · 绕过复合体 I'));
        studentMapNodes.appendChild(summary);

        const nextPath = studentSvgElement('g', {
          class: 'student-map-next-pathway gp-next-pathway',
          'data-next-pathway': 'etc', role: 'button', tabindex: '0',
          'aria-label': 'CoQH2下一站：电子传递链复合体III'
        });
        nextPath.appendChild(studentSvgElement('rect', { x: 926, y: 760, width: 296, height: 70, rx: 16 }));
        nextPath.appendChild(studentSvgElement('text', { x: 1074, y: 787, class: 'next-label' }, '电子传递链下一站'));
        nextPath.appendChild(studentSvgElement('text', { x: 1074, y: 814, class: 'next-name' }, 'CoQH₂ → 复合体 III'));
        const openEtc = () => renderStudentPathway('etc', { returnToPrimer: false });
        nextPath.addEventListener('click', event => { event.stopPropagation(); openEtc(); });
        nextPath.addEventListener('keydown', event => {
          if (event.key !== 'Enter' && event.key !== ' ') return;
          event.preventDefault();
          openEtc();
        });
        studentMapNodes.appendChild(nextPath);

        studentMapBands.appendChild(studentSvgElement('text', {
          x: 48, y: 882, class: 'student-map-pan-hint', 'data-map-hint': 'horizontal'
        }, '横向查看：GPD1 → VDAC → GPD2 → CoQ 池 →'));
        setStudentReadingStep(pathwayId, 0);
      }

      function renderGlycolysisStudentMap(pathwayId, pathwayReactions, tone) {
        const viewWidth = 1460;
        const viewHeight = 900;
        const nodeWidth = 154;
        const nodeHeight = 58;
        const ownReactions = pathwayReactions.filter(reaction => groupsFor(reaction).includes(pathwayId));
        const stepReactions = ownReactions.slice(0, 10);

        studentPathwayMap.setAttribute('viewBox', `0 0 ${viewWidth} ${viewHeight}`);
        studentPathwayMap.dataset.mapLayout = 'glycolysis-ten-step';
        studentPathwayMap.setAttribute('aria-label', '糖酵解十步：投资两分子ATP，把六碳糖裂解为两份三碳骨架，后半程每步发生两次，产生四分子ATP和两分子NADH，净得两分子ATP、两分子NADH和两分子丙酮酸');
        studentMapBands.replaceChildren();
        studentMapEdges.replaceChildren();
        studentMapNodes.replaceChildren();
        studentMapCount.textContent = '10 个酶步骤 · 3 个不可逆关卡 · 后半程 ×2';

        [
          { key: 'investment', y: 22, height: 210, className: 'gly-investment-band', label: '能量投资 · 六碳糖活化 · 消耗 2 ATP' },
          { key: 'cleavage', y: 246, height: 166, className: 'gly-cleavage-band', label: '六碳裂解 · 醛缩酶生成 DHAP + GAP · TPI 汇合为 2 GAP' },
          { key: 'payoff', y: 426, height: 292, className: 'gly-payoff-band', label: '能量收益 · 后半程每步 ×2 · 产生 4 ATP + 2 NADH' },
          { key: 'net', y: 732, height: 116, className: 'gly-net-band', label: '净收支与丙酮酸出口' }
        ].forEach(zone => {
          studentMapBands.appendChild(studentSvgElement('rect', {
            x: 24, y: zone.y, width: 1412, height: zone.height,
            class: `student-map-band ${zone.className}`, 'data-glycolysis-zone': zone.key
          }));
          if (zone.key !== 'net') {
            studentMapBands.appendChild(studentSvgElement('text', {
              x: 48, y: zone.y + 30, class: 'student-map-band-label'
            }, zone.label));
          }
        });

        const nodeDefinitions = [
          { key: 'glucose', entityId: '葡萄糖@cytosol', label: '葡萄糖', meta: '6C · 起点', x: 115, y: 138, reaction: stepReactions[0], stepIndex: 0 },
          { key: 'g6p', entityId: '葡萄糖-6-磷酸@cytosol', label: '葡萄糖-6-磷酸', meta: 'G6P · 6C', x: 340, y: 138, reaction: stepReactions[1], stepIndex: 1 },
          { key: 'f6p', entityId: '果糖-6-磷酸@cytosol', label: '果糖-6-磷酸', meta: 'F6P · 6C', x: 565, y: 138, reaction: stepReactions[2], stepIndex: 2 },
          { key: 'f16bp', entityId: '果糖-1,6-二磷酸@cytosol', label: '果糖-1,6-二磷酸', meta: 'F-1,6-BP · 6C', x: 790, y: 138, reaction: stepReactions[3], width: 178, stepIndex: 3 },
          { key: 'dhap', entityId: '磷酸二羟丙酮@cytosol', label: 'DHAP', meta: '3C · 经 TPI 汇合', x: 1030, y: 330, reaction: stepReactions[4], readingStepIndex: 4, className: 'gly-branch-node' },
          { key: 'gap', entityId: '甘油醛-3-磷酸@cytosol', label: 'GAP ×2', meta: '3C ×2 · 收益起点', x: 1280, y: 330, reaction: stepReactions[5], stepIndex: 4, className: 'gly-double-node' },
          { key: 'bpg13', entityId: '1,3-二磷酸甘油酸@cytosol', label: '1,3-BPG ×2', meta: '高能磷酸中间体', x: 1250, y: 565, reaction: stepReactions[6], stepIndex: 5, className: 'gly-double-node' },
          { key: 'pg3', entityId: '3-磷酸甘油酸@cytosol', label: '3-PG ×2', meta: '形成第 1 批 ATP', x: 1010, y: 565, reaction: stepReactions[7], stepIndex: 6, className: 'gly-double-node' },
          { key: 'pg2', entityId: '2-磷酸甘油酸@cytosol', label: '2-PG ×2', meta: '重排', x: 770, y: 565, reaction: stepReactions[8], stepIndex: 7, className: 'gly-double-node' },
          { key: 'pep', entityId: '磷酸烯醇式丙酮酸@cytosol', label: 'PEP ×2', meta: '高能烯醇磷酸', x: 530, y: 565, reaction: stepReactions[9], stepIndex: 8, className: 'gly-double-node' },
          { key: 'pyruvate', entityId: '丙酮酸@cytosol', label: '丙酮酸 ×2', meta: '3C ×2 · 出口', x: 250, y: 565, reaction: stepReactions[9], stepIndex: 9, className: 'gly-product-node' }
        ];
        const nodeRecords = new Map(nodeDefinitions.map(definition => [definition.key, {
          ...definition,
          entity: entityById[definition.entityId] || null
        }]));

        const edgeDefinitions = [
          ['glucose', 'g6p', 0, 0], ['g6p', 'f6p', 1, 1], ['f6p', 'f16bp', 2, 2],
          ['f16bp', 'dhap', 3, 3], ['f16bp', 'gap', 3, 3], ['dhap', 'gap', 4, 4],
          ['gap', 'bpg13', 5, 4], ['bpg13', 'pg3', 6, 5], ['pg3', 'pg2', 7, 6],
          ['pg2', 'pep', 8, 7], ['pep', 'pyruvate', 9, 8]
        ];
        edgeDefinitions.forEach(([from, to, reactionIndex, stepIndex], edgeIndex) => {
          const source = nodeRecords.get(from);
          const target = nodeRecords.get(to);
          const reaction = stepReactions[reactionIndex];
          const specialPath = from === 'f16bp' && to === 'dhap'
            ? 'M 878 138 C 950 178, 990 246, 1020 300'
            : from === 'f16bp' && to === 'gap'
              ? 'M 878 138 C 1090 176, 1215 240, 1270 300'
              : from === 'gap' && to === 'bpg13'
                ? 'M 1280 359 C 1280 430, 1270 493, 1255 535'
                : null;
          const edge = studentSvgElement('path', {
            d: specialPath || studentMapEdgePath(source, target, Math.max(source.width || nodeWidth, target.width || nodeWidth), nodeHeight),
            class: `student-map-edge glycolysis-edge${reaction && !reaction.reversible ? ' irreversible' : ''}`,
            'data-edge-from': from,
            'data-edge-to': to,
            'data-reaction': reaction?.id || '',
            'data-step-index': String(stepIndex)
          });
          if (reaction) {
            const openReaction = () => renderStudentReactionDetail(reaction, pathwayId, reactionIndex);
            edge.setAttribute('role', 'button');
            edge.tabIndex = 0;
            edge.addEventListener('click', event => { event.stopPropagation(); openReaction(); });
            edge.addEventListener('keydown', event => {
              if (event.key !== 'Enter' && event.key !== ' ') return;
              event.preventDefault();
              openReaction();
            });
          }
          studentMapEdges.appendChild(edge);
          applyStudentReactionDirection(edge, reaction, {
            showLabel: Boolean(reaction?.reversible),
            labelOffsetY: edgeIndex % 2 === 0 ? -13 : 15
          });
        });

        nodeRecords.forEach(record => {
          const width = record.width || nodeWidth;
          const nodeAttributes = {
            class: `student-map-node glycolysis-node ${record.className || ''}`,
            style: `--tone:${tone}`,
            'data-map-key': record.key,
            'data-entity-id': record.entityId,
            'data-reaction': record.reaction?.id || '',
            role: 'button', tabindex: '0',
            'aria-label': `${record.label}，${record.meta}`
          };
          if (Number.isInteger(record.stepIndex)) nodeAttributes['data-step-index'] = String(record.stepIndex);
          const node = studentSvgElement('g', nodeAttributes);
          node.appendChild(studentSvgElement('title', {}, `${record.label} · ${record.meta}`));
          node.appendChild(studentSvgElement('rect', {
            x: record.x - width / 2, y: record.y - nodeHeight / 2, width, height: nodeHeight, rx: 14
          }));
          const name = studentSvgElement('text', { x: record.x, y: record.y + 1, class: 'node-name' }, record.label);
          node.appendChild(name);
          node.appendChild(studentSvgElement('text', { x: record.x, y: record.y + 20, class: 'node-compartment' }, record.meta));
          const reactionIndex = stepReactions.indexOf(record.reaction);
          const readingStepIndex = Number.isInteger(record.stepIndex) ? record.stepIndex : record.readingStepIndex;
          const selectNode = () => renderStudentNodeSelection(record.entity, record.reaction, pathwayId, reactionIndex, readingStepIndex);
          node.addEventListener('click', event => { event.stopPropagation(); selectNode(); });
          node.addEventListener('keydown', event => {
            if (event.key !== 'Enter' && event.key !== ' ') return;
            event.preventDefault();
            selectNode();
          });
          studentMapNodes.appendChild(node);
          fitStudentMapText(name, width - 16, 15.5, 9.5);
        });

        const eventDefinitions = [
          [1, '己糖激酶', 225, 102, true], [2, 'PGI', 452, 102, false], [3, 'PFK-1 · 承诺步骤', 678, 102, true],
          [4, '醛缩酶', 918, 250, false], [5, 'TPI', 1155, 302, false], [6, 'GAPDH', 1260, 495, false],
          [7, 'PGK', 1130, 530, false], [8, 'PGAM', 890, 530, false], [9, '烯醇化酶', 650, 530, false],
          [10, '丙酮酸激酶', 390, 530, true]
        ];
        eventDefinitions.forEach(([step, labelText, x, y, irreversible]) => {
          const reaction = stepReactions[step - 1];
          const eventLabel = studentSvgElement('text', {
            x, y,
            class: `student-glycolysis-event${irreversible ? ' irreversible' : ''}`,
            'data-glycolysis-event': String(step),
            'text-anchor': 'middle', role: 'button', tabindex: '0'
          }, `${step} · ${labelText}`);
          const openReaction = () => reaction && renderStudentReactionDetail(reaction, pathwayId, step - 1);
          eventLabel.addEventListener('click', event => { event.stopPropagation(); openReaction(); });
          eventLabel.addEventListener('keydown', event => {
            if (event.key !== 'Enter' && event.key !== ' ') return;
            event.preventDefault();
            openReaction();
          });
          studentMapNodes.appendChild(eventLabel);
        });

        [
          { x: 225, y: 190, text: 'ATP → ADP', className: 'student-gly-energy-cost' },
          { x: 678, y: 190, text: 'ATP → ADP', className: 'student-gly-energy-cost' },
          { x: 1170, y: 455, text: '后半程每步 ×2', className: 'student-gly-double-label' },
          { x: 1260, y: 650, text: '2 NAD⁺ + 2 Pi → 2 NADH + 2 H⁺', className: 'student-gly-energy-gain' },
          { x: 1010, y: 650, text: '2 ADP → 2 ATP', className: 'student-gly-energy-gain' },
          { x: 250, y: 650, text: '2 ADP → 2 ATP', className: 'student-gly-energy-gain' }
        ].forEach(item => studentMapNodes.appendChild(studentSvgElement('text', {
          x: item.x, y: item.y, class: item.className, 'text-anchor': 'middle'
        }, item.text)));

        const summary = studentSvgElement('g', {
          class: 'student-glycolysis-summary',
          'aria-label': '糖酵解收支：投入2ATP，产生4ATP和2NADH，净得2ATP、2NADH和2丙酮酸'
        });
        summary.appendChild(studentSvgElement('rect', { x: 48, y: 750, width: 748, height: 76, rx: 18 }));
        summary.appendChild(studentSvgElement('text', { x: 422, y: 778, class: 'summary-main', 'text-anchor': 'middle' }, '投入 2 ATP　→　产生 4 ATP + 2 NADH'));
        summary.appendChild(studentSvgElement('text', { x: 422, y: 807, class: 'summary-note', 'text-anchor': 'middle' }, '净 2 ATP + 2 NADH + 2 丙酮酸'));
        studentMapNodes.appendChild(summary);

        const nextPath = studentSvgElement('g', {
          class: 'student-map-next-pathway glycolysis-next-pathway',
          'data-next-pathway': 'pdh', role: 'button', tabindex: '0',
          'aria-label': '需氧条件下丙酮酸下一站：丙酮酸脱氢酶复合体'
        });
        nextPath.appendChild(studentSvgElement('rect', { x: 824, y: 750, width: 274, height: 76, rx: 16 }));
        nextPath.appendChild(studentSvgElement('text', { x: 961, y: 778, class: 'next-label' }, '需氧：丙酮酸 → PDH'));
        nextPath.appendChild(studentSvgElement('text', { x: 961, y: 807, class: 'next-name' }, '乙酰-CoA → TCA'));
        const openPdh = () => renderStudentPathway('pdh', { returnToPrimer: false });
        nextPath.addEventListener('click', event => { event.stopPropagation(); openPdh(); });
        nextPath.addEventListener('keydown', event => {
          if (event.key !== 'Enter' && event.key !== ' ') return;
          event.preventDefault();
          openPdh();
        });
        studentMapNodes.appendChild(nextPath);

        const altExit = studentSvgElement('g', {
          class: 'student-glycolysis-alt-exit',
          'aria-label': '缺氧或红细胞中，乳酸脱氢酶把丙酮酸还原为乳酸并再生NAD正'
        });
        altExit.appendChild(studentSvgElement('rect', { x: 1126, y: 750, width: 282, height: 76, rx: 16 }));
        altExit.appendChild(studentSvgElement('text', { x: 1267, y: 778, class: 'exit-label', 'text-anchor': 'middle' }, '缺氧 / 红细胞：LDH 再生 NAD⁺'));
        altExit.appendChild(studentSvgElement('text', { x: 1267, y: 807, class: 'exit-note', 'text-anchor': 'middle' }, '丙酮酸 → 乳酸，不属于十步主干'));
        studentMapNodes.appendChild(altExit);

        studentMapBands.appendChild(studentSvgElement('text', {
          x: 48, y: 882, class: 'student-map-pan-hint', 'data-map-hint': 'horizontal'
        }, '横向查看：投资 → 裂解 → 后半程 ×2 → 净收支 →'));
        setStudentReadingStep(pathwayId, 0);
      }

      function renderGluconeogenesisStudentMap(pathwayId, pathwayReactions, tone) {
        const viewWidth = 1740;
        const viewHeight = 1050;
        const nodeWidth = 146;
        const nodeHeight = 56;
        const ownReactions = pathwayReactions.filter(reaction => groupsFor(reaction).includes(pathwayId));
        const byEnzyme = pattern => ownReactions.find(reaction => pattern.test(reaction.enzyme || '')) || null;
        const reactions = {
          lactate: byEnzyme(/乳酸脱氢酶/), alanine: byEnzyme(/丙氨酸转氨酶/), glycerol: byEnzyme(/甘油激酶/),
          pc: byEnzyme(/丙酮酸羧化酶/), mdh2: byEnzyme(/MDH2/), carrier: byEnzyme(/苹果酸-α-KG/), mdh1: byEnzyme(/MDH1/),
          pepck: byEnzyme(/磷酸烯醇式丙酮酸羧激酶/), enolase: byEnzyme(/烯醇化酶/), pgam: byEnzyme(/磷酸甘油酸变位酶/),
          pgk: byEnzyme(/磷酸甘油酸激酶/), gapdh: byEnzyme(/甘油醛-3-磷酸脱氢酶/), tpi: byEnzyme(/磷酸丙糖异构酶/),
          aldolase: byEnzyme(/醛缩酶/), fbp1: byEnzyme(/果糖-1,6-二磷酸酶/), gpi: byEnzyme(/磷酸葡萄糖异构酶/),
          g6pTransport: byEnzyme(/葡萄糖-6-磷酸转位酶/), g6pase: byEnzyme(/^葡萄糖-6-磷酸酶$/), glucoseTransport: byEnzyme(/^葡萄糖转位酶$/)
        };

        studentPathwayMap.setAttribute('viewBox', `0 0 ${viewWidth} ${viewHeight}`);
        studentPathwayMap.dataset.mapLayout = 'gluconeogenesis-three-bypass';
        studentPathwayMap.setAttribute('aria-label', '糖异生三个绕行：线粒体基质内PC与苹果酸穿梭和胞质PEPCK共同绕过丙酮酸激酶，胞质FBP1绕过PFK-1，内质网腔G6Pase绕过己糖激酶；从两分子丙酮酸合成一分子葡萄糖消耗四ATP、二GTP和二NADH');
        studentMapBands.replaceChildren();
        studentMapEdges.replaceChildren();
        studentMapNodes.replaceChildren();
        studentMapCount.textContent = '3 个绕行 · 4 个区室 · 22 个原始反应';

        [
          { key: 'inputs', y: 20, height: 130, className: 'gng-inputs-band', label: '前体入口 · 入口不同，前段成本不同' },
          { key: 'matrix', y: 164, height: 192, className: 'gng-matrix-band', label: '线粒体基质 · PC 用 ATP 固定 HCO₃⁻，生成 OAA' },
          { key: 'shuttle', y: 370, height: 144, className: 'gng-shuttle-band', label: '线粒体内膜 · OAA 不能直接跨内膜；代表性苹果酸路线搬运碳骨架与还原当量' },
          { key: 'cytosol', y: 528, height: 330, className: 'gng-cytosol-band', label: '细胞质 · PEPCK 与逆糖酵解共享段' },
          { key: 'er-ledger', y: 872, height: 142, className: 'gng-er-band', label: '内质网膜 / 腔 · G6P 转运入 ER 后水解释放葡萄糖' }
        ].forEach(zone => {
          studentMapBands.appendChild(studentSvgElement('rect', {
            x: 22, y: zone.y, width: 1696, height: zone.height,
            class: `student-map-band ${zone.className}`, 'data-gluconeogenesis-zone': zone.key
          }));
          studentMapBands.appendChild(studentSvgElement('text', {
            x: 44, y: zone.y + 28, class: 'student-map-band-label'
          }, zone.label));
        });

        const addEntry = ({ key, x, title, route, reaction }) => {
          const entry = studentSvgElement('g', {
            class: 'student-gluconeogenesis-entry', 'data-entry': key,
            role: 'button', tabindex: '0', 'data-reaction': reaction?.id || '',
            'aria-label': `${title}：${route}`
          });
          entry.appendChild(studentSvgElement('rect', { x: x - 126, y: 58, width: 252, height: 68, rx: 16 }));
          entry.appendChild(studentSvgElement('text', { x, y: 84, class: 'entry-title', 'text-anchor': 'middle' }, title));
          entry.appendChild(studentSvgElement('text', { x, y: 109, class: 'entry-route', 'text-anchor': 'middle' }, route));
          const openReaction = () => reaction && renderStudentReactionDetail(reaction, pathwayId, ownReactions.indexOf(reaction));
          entry.addEventListener('click', event => { event.stopPropagation(); openReaction(); });
          entry.addEventListener('keydown', event => {
            if (event.key !== 'Enter' && event.key !== ' ') return;
            event.preventDefault();
            openReaction();
          });
          studentMapNodes.appendChild(entry);
        };
        addEntry({ key: 'lactate', x: 190, title: '乳酸', route: 'LDH → 丙酮酸 + 胞质 NADH', reaction: reactions.lactate });
        addEntry({ key: 'alanine', x: 480, title: '丙氨酸', route: 'ALT → 丙酮酸池', reaction: reactions.alanine });
        addEntry({ key: 'glycerol', x: 770, title: '甘油', route: '甘油-3-P → DHAP 层进入', reaction: reactions.glycerol });

        const nodeDefinitions = [
          { key: 'glycerol3p', entityId: '甘油-3-磷酸@cytosol', label: '甘油-3-P', meta: '甘油入口中间体', x: 1110, y: 93, reaction: reactions.glycerol },
          { key: 'pyruvate', entityId: '丙酮酸@mito-matrix', label: '丙酮酸 ×2', meta: '线粒体基质', x: 1030, y: 270, reaction: reactions.pc, stepIndex: 0 },
          { key: 'oaa-matrix', entityId: '草酰乙酸@mito-matrix', label: 'OAA ×2', meta: 'PC · 2 ATP', x: 1270, y: 270, reaction: reactions.mdh2, readingStepIndex: 1 },
          { key: 'malate-matrix', entityId: '苹果酸@mito-matrix', label: '苹果酸 ×2', meta: 'MDH2 · 2 NADH', x: 1510, y: 270, reaction: reactions.carrier, readingStepIndex: 1 },
          { key: 'malate-cytosol', entityId: '苹果酸@cytosol', label: '苹果酸 ×2', meta: '跨内膜输出', x: 1510, y: 446, reaction: reactions.mdh1, readingStepIndex: 1 },
          { key: 'oaa-cytosol', entityId: '草酰乙酸@cytosol', label: 'OAA ×2', meta: 'MDH1 · 产胞质 NADH', x: 1270, y: 446, reaction: reactions.pepck, stepIndex: 1 },
          { key: 'pep', entityId: '磷酸烯醇式丙酮酸@cytosol', label: 'PEP ×2', meta: 'PCK1 · 2 GTP', x: 1450, y: 640, reaction: reactions.enolase, stepIndex: 2 },
          { key: 'pg2', entityId: '2-磷酸甘油酸@cytosol', label: '2-PG ×2', meta: '烯醇化酶逆向', x: 1240, y: 640, reaction: reactions.pgam, readingStepIndex: 2 },
          { key: 'pg3', entityId: '3-磷酸甘油酸@cytosol', label: '3-PG ×2', meta: 'PGAM 逆向', x: 1040, y: 640, reaction: reactions.pgk, readingStepIndex: 2 },
          { key: 'bpg13', entityId: '1,3-二磷酸甘油酸@cytosol', label: '1,3-BPG ×2', meta: 'PGK · 2 ATP', x: 835, y: 640, reaction: reactions.gapdh, readingStepIndex: 2 },
          { key: 'gap', entityId: '甘油醛-3-磷酸@cytosol', label: 'GAP ×2', meta: 'GAPDH · 2 NADH', x: 650, y: 605, reaction: reactions.tpi, readingStepIndex: 2 },
          { key: 'dhap', entityId: '磷酸二羟丙酮@cytosol', label: 'DHAP', meta: 'TPI 提供第二份三碳', x: 650, y: 755, reaction: reactions.aldolase, readingStepIndex: 2 },
          { key: 'f16bp', entityId: '果糖-1,6-二磷酸@cytosol', label: 'F-1,6-BP', meta: '醛缩酶汇合', x: 450, y: 680, reaction: reactions.fbp1, stepIndex: 3 },
          { key: 'f6p', entityId: '果糖-6-磷酸@cytosol', label: 'F6P', meta: 'FBP1 · 水解', x: 270, y: 680, reaction: reactions.gpi, stepIndex: 4 },
          { key: 'g6p-cytosol', entityId: '葡萄糖-6-磷酸@cytosol', label: 'G6P', meta: '细胞质', x: 100, y: 680, reaction: reactions.g6pTransport, stepIndex: 5 },
          { key: 'g6p-er', entityId: '葡萄糖-6-磷酸@er-lumen', label: 'G6P', meta: '内质网腔', x: 260, y: 948, reaction: reactions.g6pase, readingStepIndex: 5 },
          { key: 'glucose-er', entityId: '葡萄糖@er-lumen', label: '葡萄糖', meta: 'G6Pase 腔侧产物', x: 500, y: 948, reaction: reactions.glucoseTransport, readingStepIndex: 6 },
          { key: 'glucose-cytosol', entityId: '葡萄糖@cytosol', label: '葡萄糖', meta: '肝 / 肾释糖出口', x: 740, y: 948, reaction: reactions.glucoseTransport, stepIndex: 6 }
        ];
        const nodeRecords = new Map(nodeDefinitions.map(definition => [definition.key, {
          ...definition, entity: entityById[definition.entityId] || null
        }]));

        const edgeDefinitions = [
          ['pyruvate', 'oaa-matrix', reactions.pc, 0], ['oaa-matrix', 'malate-matrix', reactions.mdh2, 1],
          ['malate-matrix', 'malate-cytosol', reactions.carrier, 1, 'M 1510 298 L 1510 418'],
          ['malate-cytosol', 'oaa-cytosol', reactions.mdh1, 1],
          ['oaa-cytosol', 'pep', reactions.pepck, 1, 'M 1270 474 C 1320 530, 1385 585, 1435 615'],
          ['pep', 'pg2', reactions.enolase, 2], ['pg2', 'pg3', reactions.pgam, 2], ['pg3', 'bpg13', reactions.pgk, 2],
          ['bpg13', 'gap', reactions.gapdh, 2], ['gap', 'dhap', reactions.tpi, 2, 'M 650 633 L 650 727'],
          ['gap', 'f16bp', reactions.aldolase, 2, 'M 577 605 C 535 615, 500 635, 470 658'],
          ['dhap', 'f16bp', reactions.aldolase, 2, 'M 577 755 C 525 744, 490 715, 470 700'],
          ['f16bp', 'f6p', reactions.fbp1, 3], ['f6p', 'g6p-cytosol', reactions.gpi, 4],
          ['g6p-cytosol', 'g6p-er', reactions.g6pTransport, 5, 'M 100 708 C 105 820, 165 900, 232 936'],
          ['g6p-er', 'glucose-er', reactions.g6pase, 5], ['glucose-er', 'glucose-cytosol', reactions.glucoseTransport, 6]
        ];
        edgeDefinitions.forEach(([from, to, reaction, stepIndex, specialPath], edgeIndex) => {
          const source = nodeRecords.get(from);
          const target = nodeRecords.get(to);
          const edge = studentSvgElement('path', {
            d: specialPath || studentMapEdgePath(source, target, nodeWidth, nodeHeight),
            class: `student-map-edge gluconeogenesis-edge${reaction && !reaction.reversible ? ' irreversible' : ''}`,
            'data-edge-from': from, 'data-edge-to': to,
            'data-reaction': reaction?.id || '', 'data-step-index': String(stepIndex)
          });
          if (reaction) {
            const reactionIndex = ownReactions.indexOf(reaction);
            const openReaction = () => renderStudentReactionDetail(reaction, pathwayId, reactionIndex);
            edge.setAttribute('role', 'button'); edge.tabIndex = 0;
            edge.addEventListener('click', event => { event.stopPropagation(); openReaction(); });
            edge.addEventListener('keydown', event => {
              if (event.key !== 'Enter' && event.key !== ' ') return;
              event.preventDefault(); openReaction();
            });
          }
          studentMapEdges.appendChild(edge);
          applyStudentReactionDirection(edge, reaction, { showLabel: false, labelOffsetY: edgeIndex % 2 ? 14 : -14 });
        });

        nodeRecords.forEach(record => {
          const nodeAttributes = {
            class: 'student-map-node gluconeogenesis-node', style: `--tone:${tone}`,
            'data-map-key': record.key, 'data-entity-id': record.entityId,
            'data-reaction': record.reaction?.id || '', role: 'button', tabindex: '0',
            'aria-label': `${record.label}，${record.meta}`
          };
          if (Number.isInteger(record.stepIndex)) nodeAttributes['data-step-index'] = String(record.stepIndex);
          const node = studentSvgElement('g', nodeAttributes);
          node.appendChild(studentSvgElement('title', {}, `${record.label} · ${record.meta}`));
          node.appendChild(studentSvgElement('rect', {
            x: record.x - nodeWidth / 2, y: record.y - nodeHeight / 2, width: nodeWidth, height: nodeHeight, rx: 14
          }));
          const name = studentSvgElement('text', { x: record.x, y: record.y + 1, class: 'node-name' }, record.label);
          node.appendChild(name);
          node.appendChild(studentSvgElement('text', { x: record.x, y: record.y + 20, class: 'node-compartment' }, record.meta));
          const reactionIndex = ownReactions.indexOf(record.reaction);
          const readingStepIndex = Number.isInteger(record.stepIndex) ? record.stepIndex : record.readingStepIndex;
          const selectNode = () => renderStudentNodeSelection(record.entity, record.reaction, pathwayId, reactionIndex, readingStepIndex);
          node.addEventListener('click', event => { event.stopPropagation(); selectNode(); });
          node.addEventListener('keydown', event => {
            if (event.key !== 'Enter' && event.key !== ' ') return;
            event.preventDefault(); selectNode();
          });
          studentMapNodes.appendChild(node);
          fitStudentMapText(name, nodeWidth - 16, 15.5, 9.5);
        });

        const eventDefinitions = [
          { key: 'pc', label: 'PC · 2 ATP · 生物素', x: 1150, y: 226, reaction: reactions.pc },
          { key: 'shuttle', label: '苹果酸穿梭 · OAA 不直接跨膜', x: 1390, y: 400, reaction: reactions.carrier },
          { key: 'pepck', label: 'PCK1 · 2 GTP → 2 GDP + 2 CO₂', x: 1390, y: 570, reaction: reactions.pepck },
          { key: 'reverse', label: '逆向共享段 ×2 · PGK 2 ATP · GAPDH 2 NADH', x: 1000, y: 570, reaction: reactions.pgk },
          { key: 'aldolase', label: '醛缩酶 · GAP + DHAP → F-1,6-BP', x: 540, y: 575, reaction: reactions.aldolase },
          { key: 'fbp1', label: 'FBP1 · 水解绕行', x: 360, y: 635, reaction: reactions.fbp1 },
          { key: 'g6p-transport', label: 'G6P 转运入 ER', x: 155, y: 835, reaction: reactions.g6pTransport },
          { key: 'g6pase', label: 'G6Pase · 腔侧水解', x: 380, y: 908, reaction: reactions.g6pase }
        ];
        eventDefinitions.forEach(eventDefinition => {
          const eventLabel = studentSvgElement('text', {
            x: eventDefinition.x, y: eventDefinition.y,
            class: 'student-gluconeogenesis-event',
            'data-gluconeogenesis-event': eventDefinition.key,
            'data-reaction': eventDefinition.reaction?.id || '',
            'text-anchor': 'middle', role: 'button', tabindex: '0'
          }, eventDefinition.label);
          const openReaction = () => eventDefinition.reaction
            && renderStudentReactionDetail(eventDefinition.reaction, pathwayId, ownReactions.indexOf(eventDefinition.reaction));
          eventLabel.addEventListener('click', clickEvent => { clickEvent.stopPropagation(); openReaction(); });
          eventLabel.addEventListener('keydown', keyEvent => {
            if (keyEvent.key !== 'Enter' && keyEvent.key !== ' ') return;
            keyEvent.preventDefault(); openReaction();
          });
          studentMapNodes.appendChild(eventLabel);
        });

        [
          { key: 'pk', x: 1190, y: 320, width: 700, text: '绕过 PK：PC + 苹果酸穿梭 + PEPCK' },
          { key: 'pfk1', x: 360, y: 810, width: 330, text: '绕过 PFK-1：FBP1' },
          { key: 'hk-gk', x: 470, y: 990, width: 420, text: '绕过 HK / GK：ER 腔 G6Pase' }
        ].forEach(bypass => {
          const badge = studentSvgElement('g', {
            class: 'student-gluconeogenesis-bypass', 'data-gluconeogenesis-bypass': bypass.key
          });
          badge.appendChild(studentSvgElement('rect', { x: bypass.x - bypass.width / 2, y: bypass.y - 22, width: bypass.width, height: 44, rx: 16 }));
          badge.appendChild(studentSvgElement('text', { x: bypass.x, y: bypass.y + 6, 'text-anchor': 'middle' }, bypass.text));
          studentMapNodes.appendChild(badge);
        });

        const ledger = studentSvgElement('g', {
          class: 'student-gluconeogenesis-ledger',
          'aria-label': '从2丙酮酸合成1葡萄糖，消耗4ATP、2GTP、2NADH，共6个高能磷酸键'
        });
        ledger.appendChild(studentSvgElement('rect', { x: 920, y: 900, width: 760, height: 90, rx: 18 }));
        ledger.appendChild(studentSvgElement('text', { x: 1300, y: 935, class: 'ledger-main', 'text-anchor': 'middle' }, '2 丙酮酸 → 1 葡萄糖：4 ATP + 2 GTP + 2 NADH'));
        ledger.appendChild(studentSvgElement('text', { x: 1300, y: 966, class: 'ledger-note', 'text-anchor': 'middle' }, '共 6 个高能磷酸键 · 代表性苹果酸路线；实际出口依前体 / 组织而变'));
        studentMapNodes.appendChild(ledger);

        studentMapBands.appendChild(studentSvgElement('text', {
          x: 44, y: 1035, class: 'student-map-pan-hint', 'data-map-hint': 'horizontal'
        }, '横向查看：前体入口 → 基质 PC → 苹果酸穿梭 → 胞质逆向主干 → ER 释糖 →'));
        setStudentReadingStep(pathwayId, 0);
      }

      function renderGlycogenesisStudentMap(pathwayId, pathwayReactions, tone) {
        const viewWidth = 1500;
        const viewHeight = 820;
        const nodeWidth = 150;
        const nodeHeight = 58;
        const ownReactions = pathwayReactions.filter(reaction => groupsFor(reaction).includes(pathwayId));
        const reactions = {
          hexokinase: ownReactions.find(reaction => /己糖激酶/.test(reaction.enzyme || '')) || null,
          pgm: ownReactions.find(reaction => /磷酸葡萄糖变位酶/.test(reaction.enzyme || '')) || null,
          ugp: ownReactions.find(reaction => /UDP-葡萄糖焦磷酸化酶/.test(reaction.enzyme || '')) || null,
          synthase: ownReactions.find(reaction => /糖原合酶/.test(reaction.enzyme || '')) || null
        };

        studentPathwayMap.setAttribute('viewBox', `0 0 ${viewWidth} ${viewHeight}`);
        studentPathwayMap.dataset.mapLayout = 'glycogenesis-branched-granule';
        studentPathwayMap.setAttribute('aria-label', '糖原合成：葡萄糖活化为UDP-葡萄糖，糖原蛋白形成短引物，糖原合酶在非还原端形成α-1,4键，分支酶通过链段转移形成α-1,6分支和多个非还原端');
        studentMapBands.replaceChildren();
        studentMapEdges.replaceChildren();
        studentMapNodes.replaceChildren();
        studentMapCount.textContent = '6 个教学事件 · 4 个原始反应 · 多分支颗粒';

        [
          { key: 'activation', y: 20, height: 205, className: 'ggs-activation-band', label: '糖核苷酸活化 · 葡萄糖 → G6P → G1P → UDP-葡萄糖' },
          { key: 'primer', y: 239, height: 165, className: 'ggs-primer-band', label: '从零起始 · 糖原蛋白自糖基化形成短 α-1,4 引物' },
          { key: 'elongation', y: 418, height: 165, className: 'ggs-elongation-band', label: '链延长 · 糖原合酶只能延长既有链的非还原端' },
          { key: 'branching', y: 597, height: 185, className: 'ggs-branching-band', label: '分支成粒 · 分支酶转移链段形成 α-1,6 键与多个非还原端' }
        ].forEach(zone => {
          studentMapBands.appendChild(studentSvgElement('rect', {
            x: 22, y: zone.y, width: 1456, height: zone.height,
            class: `student-map-band ${zone.className}`, 'data-glycogenesis-zone': zone.key
          }));
          studentMapBands.appendChild(studentSvgElement('text', {
            x: 44, y: zone.y + 29, class: 'student-map-band-label'
          }, zone.label));
        });

        const nodeDefinitions = [
          { key: 'glucose', entityId: '葡萄糖@cytosol', label: '葡萄糖', meta: '游离葡萄糖起点', x: 115, y: 132, reaction: reactions.hexokinase, stepIndex: 0 },
          { key: 'g6p', entityId: '葡萄糖-6-磷酸@cytosol', label: 'G6P', meta: '己糖激酶 · 1 ATP', x: 335, y: 132, reaction: reactions.pgm, stepIndex: 1 },
          { key: 'g1p', entityId: '葡萄糖-1-磷酸@cytosol', label: 'G1P', meta: 'PGM 可逆', x: 555, y: 132, reaction: reactions.ugp, stepIndex: 2 },
          { key: 'utp', entityId: 'UTP@cytosol', label: 'UTP', meta: '活化能量', x: 690, y: 190, reaction: reactions.ugp, readingStepIndex: 2 },
          { key: 'udp-glucose', entityId: 'UDP-葡萄糖@cytosol', label: 'UDP-葡萄糖', meta: '直接葡萄糖供体', x: 800, y: 132, reaction: reactions.synthase, stepIndex: 3 },
          { key: 'ppi', entityId: '焦磷酸@cytosol', label: 'PPi', meta: '水解驱动活化', x: 930, y: 190, reaction: reactions.ugp, readingStepIndex: 3 },
          { key: 'glycogenin', label: '糖原蛋白', meta: '自糖基化核心', x: 930, y: 322, reaction: reactions.synthase, readingStepIndex: 3 },
          { key: 'primer', label: '短 α-1,4 引物', meta: '糖原合酶的起点', x: 1190, y: 322, reaction: reactions.synthase, readingStepIndex: 3 },
          { key: 'linear-chain', label: 'α-1,4 线性链', meta: '非还原端不断延长', x: 940, y: 505, reaction: reactions.synthase, readingStepIndex: 4 },
          { key: 'branch-point', label: 'α-1,6 分支点', meta: '链段转移，不新增葡萄糖', x: 1040, y: 685, readingStepIndex: 4 },
          { key: 'granule', entityId: '糖原@cytosol', label: '多分支糖原颗粒', meta: '多个非还原端', x: 1320, y: 685, reaction: reactions.synthase, stepIndex: 4 }
        ];
        const nodeRecords = new Map(nodeDefinitions.map(definition => [definition.key, {
          ...definition, entity: definition.entityId ? entityById[definition.entityId] || null : null
        }]));

        const edgeDefinitions = [
          ['glucose', 'g6p', reactions.hexokinase, 0], ['g6p', 'g1p', reactions.pgm, 1],
          ['g1p', 'udp-glucose', reactions.ugp, 2], ['utp', 'udp-glucose', reactions.ugp, 2, 'M 700 173 C 725 160, 750 148, 775 138'],
          ['udp-glucose', 'ppi', reactions.ugp, 2, 'M 825 150 C 860 165, 890 180, 905 187'],
          ['udp-glucose', 'glycogenin', reactions.synthase, 3, 'M 820 160 C 850 225, 890 270, 920 293'],
          ['glycogenin', 'primer', reactions.synthase, 3],
          ['primer', 'linear-chain', reactions.synthase, 3, 'M 1165 350 C 1110 400, 1030 460, 965 490'],
          ['linear-chain', 'branch-point', null, 4, 'M 960 533 C 985 590, 1010 635, 1030 657'],
          ['branch-point', 'granule', null, 4]
        ];
        edgeDefinitions.forEach(([from, to, reaction, stepIndex, specialPath]) => {
          const source = nodeRecords.get(from);
          const target = nodeRecords.get(to);
          const edge = studentSvgElement('path', {
            d: specialPath || studentMapEdgePath(source, target, nodeWidth, nodeHeight),
            class: `student-map-edge glycogenesis-edge${reaction && !reaction.reversible ? ' irreversible' : ''}`,
            'data-edge-from': from, 'data-edge-to': to,
            'data-reaction': reaction?.id || '', 'data-step-index': String(stepIndex)
          });
          if (reaction) {
            const reactionIndex = ownReactions.indexOf(reaction);
            const openReaction = () => renderStudentReactionDetail(reaction, pathwayId, reactionIndex);
            edge.setAttribute('role', 'button'); edge.tabIndex = 0;
            edge.addEventListener('click', event => { event.stopPropagation(); openReaction(); });
            edge.addEventListener('keydown', event => {
              if (event.key !== 'Enter' && event.key !== ' ') return;
              event.preventDefault(); openReaction();
            });
          }
          studentMapEdges.appendChild(edge);
          applyStudentReactionDirection(edge, reaction, { showLabel: Boolean(reaction?.reversible), labelOffsetY: -14 });
        });

        nodeRecords.forEach(record => {
          const attributes = {
            class: 'student-map-node glycogenesis-node', style: `--tone:${tone}`,
            'data-map-key': record.key, 'data-entity-id': record.entityId || '',
            'data-reaction': record.reaction?.id || '', 'aria-label': `${record.label}，${record.meta}`
          };
          if (record.entity || record.reaction) { attributes.role = 'button'; attributes.tabindex = '0'; }
          if (Number.isInteger(record.stepIndex)) attributes['data-step-index'] = String(record.stepIndex);
          const node = studentSvgElement('g', attributes);
          node.appendChild(studentSvgElement('title', {}, `${record.label} · ${record.meta}`));
          node.appendChild(studentSvgElement('rect', {
            x: record.x - nodeWidth / 2, y: record.y - nodeHeight / 2, width: nodeWidth, height: nodeHeight, rx: 14
          }));
          const name = studentSvgElement('text', { x: record.x, y: record.y + 1, class: 'node-name' }, record.label);
          node.appendChild(name);
          node.appendChild(studentSvgElement('text', { x: record.x, y: record.y + 20, class: 'node-compartment' }, record.meta));
          if (record.entity || record.reaction) {
            const reactionIndex = ownReactions.indexOf(record.reaction);
            const readingStepIndex = Number.isInteger(record.stepIndex) ? record.stepIndex : record.readingStepIndex;
            const selectNode = () => renderStudentNodeSelection(record.entity, record.reaction, pathwayId, reactionIndex, readingStepIndex);
            node.addEventListener('click', event => { event.stopPropagation(); selectNode(); });
            node.addEventListener('keydown', event => {
              if (event.key !== 'Enter' && event.key !== ' ') return;
              event.preventDefault(); selectNode();
            });
          }
          studentMapNodes.appendChild(node);
          fitStudentMapText(name, nodeWidth - 16, 15.5, 9.5);
        });

        const eventDefinitions = [
          { key: 'hexokinase', label: '1 · HK / GK · ATP → ADP', x: 225, y: 90, reaction: reactions.hexokinase },
          { key: 'pgm', label: '2 · 磷酸葡萄糖变位酶', x: 445, y: 90, reaction: reactions.pgm },
          { key: 'ugp', label: '3 · UDP-葡萄糖焦磷酸化酶', x: 675, y: 90, reaction: reactions.ugp },
          { key: 'glycogenin', label: '4 · 糖原蛋白 · 自糖基化', x: 1060, y: 280, reaction: reactions.synthase },
          { key: 'synthase', label: '5 · 糖原合酶 · α-1,4 延长', x: 1060, y: 462, reaction: reactions.synthase },
          { key: 'branching', label: '6 · 分支酶 · α-1,6 分支', x: 1180, y: 642, reaction: reactions.synthase }
        ];
        eventDefinitions.forEach(eventDefinition => {
          const eventLabel = studentSvgElement('text', {
            x: eventDefinition.x, y: eventDefinition.y,
            class: 'student-glycogenesis-event', 'data-glycogenesis-event': eventDefinition.key,
            'data-reaction': eventDefinition.reaction?.id || '',
            'text-anchor': 'middle', role: 'button', tabindex: '0'
          }, eventDefinition.label);
          const openReaction = () => eventDefinition.reaction
            && renderStudentReactionDetail(eventDefinition.reaction, pathwayId, ownReactions.indexOf(eventDefinition.reaction));
          eventLabel.addEventListener('click', clickEvent => { clickEvent.stopPropagation(); openReaction(); });
          eventLabel.addEventListener('keydown', keyEvent => {
            if (keyEvent.key !== 'Enter' && keyEvent.key !== ' ') return;
            keyEvent.preventDefault(); openReaction();
          });
          studentMapNodes.appendChild(eventLabel);
        });

        studentMapNodes.appendChild(studentSvgElement('text', {
          x: 810, y: 229, class: 'student-glycogenesis-drive', 'text-anchor': 'middle'
        }, 'UTP → UDP-葡萄糖 + PPi · PPi 水解驱动'));
        studentMapNodes.appendChild(studentSvgElement('text', {
          x: 1060, y: 380, class: 'student-glycogenesis-primer-note', 'text-anchor': 'middle'
        }, '糖原合酶不能从零起始'));
        studentMapNodes.appendChild(studentSvgElement('text', {
          x: 1280, y: 750, class: 'student-glycogenesis-end-note', 'text-anchor': 'middle'
        }, '高分支结构 → 多个非还原端'));

        const energy = studentSvgElement('g', {
          class: 'student-glycogenesis-energy',
          'aria-label': '从游离葡萄糖起算消耗1 ATP和1 UTP；从G6P起算只消耗1 UTP'
        });
        energy.appendChild(studentSvgElement('rect', { x: 58, y: 640, width: 640, height: 92, rx: 18 }));
        energy.appendChild(studentSvgElement('text', { x: 378, y: 675, class: 'energy-main', 'text-anchor': 'middle' }, '从游离葡萄糖：1 ATP + 1 UTP'));
        energy.appendChild(studentSvgElement('text', { x: 378, y: 708, class: 'energy-note', 'text-anchor': 'middle' }, '从 G6P：1 UTP · 分支重排不再消耗 UDP-葡萄糖'));
        studentMapNodes.appendChild(energy);

        studentMapBands.appendChild(studentSvgElement('text', {
          x: 44, y: 806, class: 'student-map-pan-hint', 'data-map-hint': 'horizontal'
        }, '横向查看：活化 → 糖原蛋白引物 → 非还原端延长 → α-1,6 分支 →'));
        setStudentReadingStep(pathwayId, 0);
      }

      function renderGlycogenolysisStudentMap(pathwayId, pathwayReactions, tone) {
        const ownReactions = pathwayReactions.filter(reaction => groupsFor(reaction).includes(pathwayId));
        const byEnzyme = pattern => ownReactions.find(reaction => pattern.test(reaction.enzyme || '')) || null;
        const rx = {
          phosphorylase: byEnzyme(/糖原磷酸化酶/), debranch: byEnzyme(/去分支酶/),
          pgm: byEnzyme(/磷酸葡萄糖变位酶/), g6pt: byEnzyme(/葡萄糖-6-磷酸转位酶/),
          g6pase: byEnzyme(/葡萄糖-6-磷酸酶$/), glucoseExport: byEnzyme(/葡萄糖转位酶/)
        };
        studentPathwayMap.setAttribute('viewBox', '0 0 1500 820');
        studentPathwayMap.dataset.mapLayout = 'glycogenolysis-debranch-tissue-split';
        studentPathwayMap.setAttribute('aria-label', '糖原分解：非还原端磷酸解形成G1P，去分支酶先转移三个残基再水解α-1,6分支，G6P随后分流到肌肉糖酵解或肝脏内质网释糖');
        studentMapBands.replaceChildren(); studentMapEdges.replaceChildren(); studentMapNodes.replaceChildren();
        studentMapCount.textContent = '7 个教学事件 · 6 个原始反应 · 肌肉/肝脏双去向';
        [
          ['chain', 20, 190, 'ggl-chain-band', '外链磷酸解 · 多个非还原端同步动员'],
          ['debranching', 224, 185, 'ggl-debranch-band', '极限糊精去分支 · AGL 的两种催化活性'],
          ['conversion', 423, 120, 'ggl-conversion-band', '中央转换 · G1P ⇌ G6P，不消耗 ATP'],
          ['tissue-fates', 557, 225, 'ggl-fates-band', '组织分工 · 肌肉就地供能；肝/肾经 ER 释糖']
        ].forEach(([key, y, height, className, title]) => {
          studentMapBands.appendChild(studentSvgElement('rect', { x: 22, y, width: 1456, height, class: `student-map-band ${className}`, 'data-glycogenolysis-zone': key }));
          studentMapBands.appendChild(studentSvgElement('text', { x: 44, y: y + 29, class: 'student-map-band-label' }, title));
        });
        const defs = [
          ['granule', '糖原颗粒', '多个非还原端', 110, 125, rx.phosphorylase, 0],
          ['end', '非还原端', 'α-1,4 外链', 315, 125, rx.phosphorylase, 0],
          ['limit', '极限糊精', '距分支还剩 4 个残基', 525, 125, rx.debranch, 1],
          ['g1p-main', 'G1P', '磷酸解主产物', 790, 125, rx.pgm, 3],
          ['transfer', '转移的 3 个残基', '接到邻近 α-1,4 链', 690, 315, rx.debranch, 1],
          ['branch', '暴露的 α-1,6 点', '仅剩 1 个分支葡萄糖', 930, 315, rx.debranch, 2],
          ['free', '游离葡萄糖', '分支点少量产物', 1165, 315, rx.debranch, 2],
          ['reopened', '重新开放的外链', '磷酸化酶继续工作', 1350, 315, rx.phosphorylase, 2],
          ['g1p', 'G1P', '进入 PGM', 505, 485, rx.pgm, 3],
          ['g6p', 'G6P', '组织去向分叉点', 800, 485, rx.g6pt, 4],
          ['muscle', '肌肉糖酵解', '缺少 G6Pase · 就地供能', 1100, 620, null, 4],
          ['er-g6p', 'ER 腔 G6P', 'G6P 转运入 ER', 650, 740, rx.g6pase, 5],
          ['er-glucose', 'ER 腔葡萄糖', '腔面 G6Pase 水解产物', 950, 740, rx.glucoseExport, 6],
          ['blood', '血糖输出', '葡萄糖离开产糖细胞', 1250, 740, rx.glucoseExport, 6]
        ];
        const records = new Map(defs.map(([key, label, meta, x, y, reaction, stepIndex]) => [key, { key, label, meta, x, y, reaction, stepIndex }]));
        const edge = (from, to, reaction, path = '') => {
          const a = records.get(from), b = records.get(to);
          const node = studentSvgElement('path', { d: path || studentMapEdgePath(a, b, 156, 60), class: `student-map-edge glycogenolysis-edge${reaction && !reaction.reversible ? ' irreversible' : ''}`, 'data-reaction': reaction?.id || '', 'data-step-index': String(a.stepIndex) });
          studentMapEdges.appendChild(node); applyStudentReactionDirection(node, reaction, { showLabel: Boolean(reaction?.reversible), labelOffsetY: -14 });
        };
        edge('granule', 'end', rx.phosphorylase); edge('end', 'limit', rx.phosphorylase); edge('limit', 'g1p-main', rx.phosphorylase);
        edge('limit', 'transfer', rx.debranch, 'M 545 153 C 575 220, 625 275, 670 305'); edge('transfer', 'branch', rx.debranch);
        edge('branch', 'free', rx.debranch); edge('branch', 'reopened', rx.debranch); edge('g1p', 'g6p', rx.pgm);
        edge('g6p', 'muscle', null, 'M 825 505 C 910 540, 1010 580, 1070 610');
        edge('g6p', 'er-g6p', rx.g6pt, 'M 785 515 C 750 595, 700 690, 665 715');
        edge('er-g6p', 'er-glucose', rx.g6pase); edge('er-glucose', 'blood', rx.glucoseExport);
        records.forEach(record => {
          const group = studentSvgElement('g', { class: 'student-map-node glycogenolysis-node', style: `--tone:${tone}`, 'data-map-key': record.key, 'data-reaction': record.reaction?.id || '', 'data-step-index': String(record.stepIndex), role: 'button', tabindex: '0' });
          group.appendChild(studentSvgElement('rect', { x: record.x - 78, y: record.y - 30, width: 156, height: 60, rx: 14 }));
          const name = studentSvgElement('text', { x: record.x, y: record.y + 1, class: 'node-name' }, record.label);
          group.append(name, studentSvgElement('text', { x: record.x, y: record.y + 21, class: 'node-compartment' }, record.meta));
          if (record.reaction) group.addEventListener('click', () => renderStudentReactionDetail(record.reaction, pathwayId, ownReactions.indexOf(record.reaction)));
          studentMapNodes.appendChild(group); fitStudentMapText(name, 140, 15.5, 9.5);
        });
        const events = [
          ['phosphorolysis', '1 · 磷酸化酶 + Pi · α-1,4 磷酸解', 320, 78, rx.phosphorylase],
          ['transferase', '2 · AGL 转移酶 · 转移 3 个残基', 700, 270, rx.debranch],
          ['glucosidase', '3 · AGL 糖苷酶 · 水解 α-1,6', 1050, 270, rx.debranch],
          ['pgm', '4 · 磷酸葡萄糖变位酶', 650, 450, rx.pgm],
          ['muscle', '5 · 肌肉：就地进入糖酵解', 1100, 580, null],
          ['g6pt', '6 · 肝：G6P 转运入 ER', 650, 690, rx.g6pt],
          ['g6pase', '7 · 腔面 G6Pase → 葡萄糖输出', 1040, 690, rx.g6pase]
        ];
        events.forEach(([key, value, x, y, reaction]) => studentMapNodes.appendChild(studentSvgElement('text', { x, y, class: 'student-glycogenolysis-event', 'data-glycogenolysis-event': key, 'data-reaction': reaction?.id || '', 'text-anchor': 'middle' }, value)));
        studentMapNodes.appendChild(studentSvgElement('text', { x: 525, y: 185, class: 'student-glycogenolysis-note', 'text-anchor': 'middle' }, '停在分支前 4 个残基'));
        studentMapNodes.appendChild(studentSvgElement('text', { x: 1060, y: 365, class: 'student-glycogenolysis-note', 'text-anchor': 'middle' }, '释放 1 个游离葡萄糖 · 主体仍为 G1P'));
        studentMapNodes.appendChild(studentSvgElement('text', { x: 1100, y: 665, class: 'student-glycogenolysis-note', 'text-anchor': 'middle' }, '肌肉缺少 G6Pase · 绕过己糖激酶，节省 1 ATP'));
        setStudentReadingStep(pathwayId, 0);
      }

      function renderPppStudentMap(pathwayId, pathwayReactions, tone) {
        const ownReactions = pathwayReactions.filter(reaction => groupsFor(reaction).includes(pathwayId));
        const byEnzyme = pattern => ownReactions.find(reaction => pattern.test(reaction.enzyme || '')) || null;
        const rx = {
          g6pd: byEnzyme(/^葡萄糖-6-磷酸脱氢酶$/), lactonase: byEnzyme(/内酯酶/),
          pgdh: byEnzyme(/^6-磷酸葡萄糖酸脱氢酶$/), rpi: byEnzyme(/核糖-5-磷酸异构酶/),
          rpe: byEnzyme(/差向异构酶/), tkt1: ownReactions.filter(reaction => /转酮醇酶/.test(reaction.enzyme || ''))[0] || null,
          tal: byEnzyme(/转醛醇酶/), tkt2: ownReactions.filter(reaction => /转酮醇酶/.test(reaction.enzyme || ''))[1] || null
        };
        studentPathwayMap.setAttribute('viewBox', '0 0 1500 820');
        studentPathwayMap.dataset.mapLayout = 'ppp-demand-carbon-balance';
        studentPathwayMap.setAttribute('aria-label', '磷酸戊糖途径：不可逆氧化支产生两个NADPH与二氧化碳，可逆非氧化支按细胞需求在核糖和糖酵解中间体之间重排十五个碳');
        studentMapBands.replaceChildren(); studentMapEdges.replaceChildren(); studentMapNodes.replaceChildren();
        studentMapCount.textContent = '8 个教学事件 · 8 个原始反应 · 3 种需求模式';
        [
          ['oxidative', 20, 190, 'ppp-oxidative-band', '不可逆氧化支 · 每个 G6P 产生 2 NADPH + CO₂'],
          ['pentose-hub', 224, 145, 'ppp-pentose-band', '五碳糖枢纽 · Ru5P 可逆分成 R5P 与 X5P'],
          ['rearrangement', 383, 245, 'ppp-rearrangement-band', '可逆非氧化支 · TKT / TAL 重排 2C 与 3C 单元'],
          ['demand-modes', 642, 140, 'ppp-demand-band', '按细胞需求选路线 · 不是固定单向通路']
        ].forEach(([key, y, height, className, title]) => {
          studentMapBands.appendChild(studentSvgElement('rect', { x: 22, y, width: 1456, height, class: `student-map-band ${className}`, 'data-ppp-zone': key }));
          studentMapBands.appendChild(studentSvgElement('text', { x: 44, y: y + 29, class: 'student-map-band-label' }, title));
        });
        const defs = [
          ['g6p', 'G6P', '6C · 氧化支入口', 105, 125, rx.g6pd, 0],
          ['lactone', '6-P-葡萄糖酸内酯', '第 1 个 NADPH', 350, 125, rx.lactonase, 1],
          ['sixpg', '6-磷酸葡萄糖酸', '水解开环', 600, 125, rx.pgdh, 2],
          ['ru5p', 'Ru5P', '5C · 第 2 个 NADPH + CO₂', 850, 125, rx.rpi, 3],
          ['r5p', 'R5P', '核苷酸骨架', 1080, 285, rx.tkt1, 4],
          ['x5p', 'X5P', '差向异构产物', 760, 285, rx.tkt1, 4],
          ['x5p-a', 'X5P', '5C · TKT1 供体', 155, 475, rx.tkt1, 5],
          ['r5p-a', 'R5P', '5C · TKT1 受体', 155, 565, rx.tkt1, 5],
          ['g3p-a', 'G3P', '3C', 500, 475, rx.tal, 6],
          ['s7p', 'S7P', '7C', 500, 565, rx.tal, 6],
          ['f6p-a', 'F6P', '6C', 850, 475, rx.tkt2, 7],
          ['e4p', 'E4P', '4C', 850, 565, rx.tkt2, 7],
          ['f6p-out', 'F6P', '6C · 回到糖酵解', 1235, 475, rx.tkt2, 7],
          ['g3p-out', 'G3P', '3C · 回到糖酵解', 1235, 565, rx.tkt2, 7]
        ];
        const records = new Map(defs.map(([key, label, meta, x, y, reaction, stepIndex]) => [key, { key, label, meta, x, y, reaction, stepIndex }]));
        const addEdge = (from, to, reaction, path = '') => {
          const a = records.get(from), b = records.get(to);
          const node = studentSvgElement('path', { d: path || studentMapEdgePath(a, b, 170, 60), class: `student-map-edge ppp-edge${reaction?.reversible ? ' reversible' : ' irreversible'}`, 'data-reaction': reaction?.id || '', 'data-step-index': String(a.stepIndex) });
          studentMapEdges.appendChild(node); applyStudentReactionDirection(node, reaction, { showLabel: Boolean(reaction?.reversible), labelOffsetY: -13 });
        };
        addEdge('g6p', 'lactone', rx.g6pd); addEdge('lactone', 'sixpg', rx.lactonase); addEdge('sixpg', 'ru5p', rx.pgdh);
        addEdge('ru5p', 'r5p', rx.rpi, 'M 875 140 C 935 190, 1010 245, 1055 270'); addEdge('ru5p', 'x5p', rx.rpe, 'M 840 155 C 815 205, 785 245, 770 265');
        addEdge('x5p-a', 'g3p-a', rx.tkt1); addEdge('r5p-a', 's7p', rx.tkt1); addEdge('g3p-a', 'f6p-a', rx.tal); addEdge('s7p', 'e4p', rx.tal);
        addEdge('e4p', 'f6p-out', rx.tkt2, 'M 875 550 C 980 520, 1110 490, 1205 480'); addEdge('f6p-a', 'g3p-out', rx.tkt2, 'M 875 490 C 980 520, 1110 550, 1205 560');
        records.forEach(record => {
          const group = studentSvgElement('g', { class: 'student-map-node ppp-node', style: `--tone:${tone}`, 'data-map-key': record.key, 'data-reaction': record.reaction?.id || '', 'data-step-index': String(record.stepIndex), role: 'button', tabindex: '0' });
          group.appendChild(studentSvgElement('rect', { x: record.x - 85, y: record.y - 30, width: 170, height: 60, rx: 14 }));
          const name = studentSvgElement('text', { x: record.x, y: record.y + 1, class: 'node-name' }, record.label);
          group.append(name, studentSvgElement('text', { x: record.x, y: record.y + 21, class: 'node-compartment' }, record.meta));
          if (record.reaction) group.addEventListener('click', () => renderStudentReactionDetail(record.reaction, pathwayId, ownReactions.indexOf(record.reaction)));
          studentMapNodes.appendChild(group); fitStudentMapText(name, 154, 15.5, 9.5);
        });
        [
          ['g6pd', '1 · G6PD · 第 1 个 NADPH', 230, 78], ['lactonase', '2 · 6PGL · H₂O', 475, 78],
          ['pgdh', '3 · 6PGDH · 第 2 个 NADPH + CO₂', 725, 78], ['rpi', '4 · RPI', 1000, 250],
          ['rpe', '5 · RPE', 730, 250], ['tkt1', '6 · 转酮酶 1 · TPP · 转移 2C', 330, 430],
          ['tal', '7 · 转醛酶 · 转移 3C', 675, 430], ['tkt2', '8 · 转酮酶 2 · TPP · 转移 2C', 1040, 430]
        ].forEach(([key, value, x, y]) => studentMapNodes.appendChild(studentSvgElement('text', { x, y, class: 'student-ppp-event', 'data-ppp-event': key, 'text-anchor': 'middle' }, value)));
        studentMapNodes.appendChild(studentSvgElement('text', { x: 475, y: 185, class: 'student-ppp-net', 'text-anchor': 'middle' }, '净：2 NADPH + CO₂ + Ru5P · PPP 不直接产生 ATP'));
        studentMapNodes.appendChild(studentSvgElement('text', { x: 820, y: 615, class: 'student-ppp-balance', 'text-anchor': 'middle' }, '3×5C ⇌ 2×6C + 1×3C · 15C ⇌ 15C'));
        [
          [270, 'R5P 优先', '糖酵解中间体反向重排 → R5P'],
          [750, '同时需要 NADPH 与 R5P', '氧化支 → Ru5P → R5P'],
          [1230, 'NADPH 优先', '多余五碳糖 → F6P / G3P 回流']
        ].forEach(([x, title, note]) => {
          const card = studentSvgElement('g', { class: 'student-ppp-demand-card' });
          card.appendChild(studentSvgElement('rect', { x: x - 195, y: 680, width: 390, height: 70, rx: 16 }));
          card.appendChild(studentSvgElement('text', { x, y: 708, class: 'demand-title', 'text-anchor': 'middle' }, title));
          card.appendChild(studentSvgElement('text', { x, y: 733, class: 'demand-note', 'text-anchor': 'middle' }, note));
          studentMapNodes.appendChild(card);
        });
        setStudentReadingStep(pathwayId, 0);
      }

      function renderFaSynthesisStudentMap(pathwayId, pathwayReactions, tone) {
        const ownReactions = pathwayReactions.filter(reaction => groupsFor(reaction).includes(pathwayId));
        const byEnzyme = pattern => ownReactions.find(reaction => pattern.test(reaction.enzyme || '')) || null;
        const rx = {
          acly: byEnzyme(/柠檬酸裂解酶/),
          acc: byEnzyme(/羧化酶|\bACC\b/i),
          fasCarbon: ownReactions.find(reaction => /脂肪酸合酶/.test(reaction.enzyme || '') && /丙二酰/.test(reaction.from || '')) || null,
          fasNadph: ownReactions.find(reaction => /脂肪酸合酶/.test(reaction.enzyme || '') && /NADPH/.test(reaction.from || '')) || null
        };
        studentPathwayMap.setAttribute('viewBox', '0 0 1500 900');
        studentPathwayMap.dataset.mapLayout = 'fa-synthesis-citrate-fas-cycle';
        studentPathwayMap.setAttribute('aria-label', '脂肪酸合成：柠檬酸输出提供胞质乙酰辅酶A，ACC生成丙二酰辅酶A，FAS重复四步七轮生成棕榈酸');
        studentMapBands.replaceChildren(); studentMapEdges.replaceChildren(); studentMapNodes.replaceChildren();
        studentMapCount.textContent = '7 个教学事件 · 4 个原始反应 · 7 轮延长至 C16';

        [
          ['carbon-export', 20, 185, 'fa-carbon-band', '① 碳源输出 · 乙酰-CoA不能直接穿过线粒体内膜'],
          ['commitment', 218, 150, 'fa-commitment-band', '② 承诺步骤 · 两个 ATP 消耗点要分开'],
          ['fas-cycle', 382, 282, 'fa-cycle-band', '③ FAS 七轮循环 · 每轮加 2C、用 2 NADPH'],
          ['ledger-downstream', 678, 202, 'fa-ledger-band', '④ 总账与边界 · FAS 产物是 C16:0，ER 加工属于下游']
        ].forEach(([key, y, height, className, title]) => {
          studentMapBands.appendChild(studentSvgElement('rect', { x: 22, y, width: 1456, height, class: `student-map-band ${className}`, 'data-fa-synthesis-zone': key }));
          studentMapBands.appendChild(studentSvgElement('text', { x: 44, y: y + 29, class: 'student-map-band-label' }, title));
        });

        const defs = [
          ['matrix-acetyl', '乙酰-CoA', '线粒体基质 · 不能直接跨内膜', 105, 118, rx.acly, 0],
          ['matrix-oaa', 'OAA', '线粒体基质', 105, 172, rx.acly, 0],
          ['matrix-citrate', '柠檬酸', '把乙酰基装进可输出形式', 330, 145, rx.acly, 0],
          ['slc25a1', 'SLC25A1', '内膜柠檬酸载体', 545, 145, rx.acly, 0],
          ['cytosol-citrate', '柠檬酸', '细胞质', 760, 145, rx.acly, 1],
          ['cytosol-acetyl', '乙酰-CoA', '细胞质 · 合成碳源', 1010, 115, rx.acc, 2],
          ['cytosol-oaa', 'OAA', '细胞质 · ACLY 另一产物', 1010, 175, rx.acly, 1],
          ['acetyl-commit', '乙酰-CoA', 'ACC 底物', 225, 300, rx.acc, 2],
          ['acc', 'ACC', '生物素依赖', 500, 300, rx.acc, 2],
          ['malonyl', '丙二酰-CoA', '二碳供体 · 抑制 CPT1', 775, 300, rx.fasCarbon, 3],
          ['cpt1', 'CPT1', '长链脂酰基入线粒体关口', 1115, 300, rx.acc, 2],
          ['primer', '乙酰基引物', '1 个 · 起始 2C', 125, 505, rx.fasCarbon, 3],
          ['malonyl-seven', '丙二酰基 ×7', '每轮贡献 2C', 125, 600, rx.fasCarbon, 3],
          ['acp', 'ACP', '携带生长中的脂酰链', 360, 550, rx.fasCarbon, 3],
          ['beta-keto', 'β-酮脂酰-ACP', '缩合后', 580, 475, rx.fasCarbon, 3],
          ['beta-hydroxy', 'β-羟脂酰-ACP', '第 1 次还原后', 800, 475, rx.fasNadph, 4],
          ['enoyl', '烯脂酰-ACP', '脱水后', 1020, 475, rx.fasCarbon, 5],
          ['acyl-plus-two', '饱和脂酰-ACP', '第 2 次还原 · 链长 +2C', 800, 600, rx.fasNadph, 6],
          ['palmitate', '棕榈酸 C16:0', '7 轮后由硫酯酶释放', 1265, 550, rx.fasCarbon, 6]
        ];
        const records = new Map(defs.map(([key, label, meta, x, y, reaction, stepIndex]) => [key, { key, label, meta, x, y, reaction, stepIndex }]));
        const addEdge = (from, to, reaction, path = '', className = '') => {
          const a = records.get(from), b = records.get(to);
          const edge = studentSvgElement('path', {
            d: path || studentMapEdgePath(a, b, 170, 60),
            class: `student-map-edge fa-synthesis-edge ${className}`.trim(),
            'data-edge-from': from, 'data-edge-to': to, 'data-reaction': reaction?.id || '',
            'data-step-index': String(a.stepIndex)
          });
          if (reaction) {
            edge.addEventListener('click', event => { event.stopPropagation(); renderStudentReactionDetail(reaction, pathwayId, ownReactions.indexOf(reaction)); });
            edge.setAttribute('role', 'button'); edge.tabIndex = 0;
          }
          studentMapEdges.appendChild(edge);
          applyStudentReactionDirection(edge, reaction, { showLabel: false });
        };
        addEdge('matrix-acetyl', 'matrix-citrate', rx.acly); addEdge('matrix-oaa', 'matrix-citrate', rx.acly);
        addEdge('matrix-citrate', 'slc25a1', rx.acly, '', 'transport'); addEdge('slc25a1', 'cytosol-citrate', rx.acly, '', 'transport');
        addEdge('cytosol-citrate', 'cytosol-acetyl', rx.acly); addEdge('cytosol-citrate', 'cytosol-oaa', rx.acly);
        addEdge('acetyl-commit', 'acc', rx.acc); addEdge('acc', 'malonyl', rx.acc);
        addEdge('malonyl', 'cpt1', rx.acc, '', 'inhibition');
        addEdge('primer', 'acp', rx.fasCarbon); addEdge('malonyl-seven', 'acp', rx.fasCarbon);
        addEdge('acp', 'beta-keto', rx.fasCarbon); addEdge('beta-keto', 'beta-hydroxy', rx.fasNadph);
        addEdge('beta-hydroxy', 'enoyl', rx.fasCarbon); addEdge('enoyl', 'acyl-plus-two', rx.fasNadph, 'M 1040 495 C 1045 550, 950 600, 885 600');
        addEdge('acyl-plus-two', 'beta-keto', rx.fasCarbon, 'M 715 600 C 635 600, 560 555, 565 505', 'cycle-return');
        addEdge('acyl-plus-two', 'palmitate', rx.fasCarbon, 'M 885 600 C 1030 620, 1145 590, 1180 560');

        records.forEach(record => {
          const group = studentSvgElement('g', { class: 'student-map-node fa-synthesis-node', style: `--tone:${tone}`, 'data-map-key': record.key, 'data-reaction': record.reaction?.id || '', 'data-step-index': String(record.stepIndex), role: 'button', tabindex: '0' });
          group.appendChild(studentSvgElement('rect', { x: record.x - 85, y: record.y - 30, width: 170, height: 60, rx: 14 }));
          const name = studentSvgElement('text', { x: record.x, y: record.y + 1, class: 'node-name' }, record.label);
          group.append(name, studentSvgElement('text', { x: record.x, y: record.y + 21, class: 'node-compartment' }, record.meta));
          if (record.reaction) {
            const open = () => renderStudentReactionDetail(record.reaction, pathwayId, ownReactions.indexOf(record.reaction));
            group.addEventListener('click', open);
            group.addEventListener('keydown', event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); open(); } });
          }
          studentMapNodes.appendChild(group); fitStudentMapText(name, 154, 15.5, 9.5);
        });

        const events = [
          [0, '1 · SLC25A1 · 柠檬酸输出', 545, 82, rx.acly],
          [1, '2 · ACLY · 消耗 1 ATP', 885, 82, rx.acly],
          [2, '3 · ACC · HCO₃⁻ + 1 ATP · 生物素', 500, 246, rx.acc],
          [3, '4 · 缩合 · 丙二酰基脱羧驱动', 470, 425, rx.fasCarbon],
          [4, '5 · 还原 1 · NADPH', 690, 425, rx.fasNadph],
          [5, '6 · 脱水', 910, 425, rx.fasCarbon],
          [6, '7 · 还原 2 · NADPH', 1015, 635, rx.fasNadph]
        ];
        events.forEach(([stepIndex, value, x, y, reaction]) => {
          const event = studentSvgElement('text', { x, y, class: 'student-fa-synthesis-event', 'data-fa-synthesis-event': String(stepIndex + 1), 'data-step-index': String(stepIndex), 'text-anchor': 'middle', role: 'button', tabindex: '0' }, value);
          if (reaction) {
            const open = () => renderStudentReactionDetail(reaction, pathwayId, ownReactions.indexOf(reaction));
            event.addEventListener('click', open);
            event.addEventListener('keydown', keyEvent => { if (keyEvent.key === 'Enter' || keyEvent.key === ' ') { keyEvent.preventDefault(); open(); } });
          }
          studentMapNodes.appendChild(event);
        });
        studentMapNodes.appendChild(studentSvgElement('text', { x: 500, y: 350, class: 'student-fa-synthesis-commitment', 'text-anchor': 'middle' }, '承诺 / 主要调控步骤'));
        studentMapNodes.appendChild(studentSvgElement('text', { x: 1115, y: 350, class: 'student-fa-synthesis-regulation', 'text-anchor': 'middle' }, 'malonyl-CoA 抑制 CPT1 · 协调合成与氧化'));
        studentMapNodes.appendChild(studentSvgElement('text', { x: 760, y: 648, class: 'student-fa-synthesis-cycle-ledger', 'text-anchor': 'middle' }, '每轮 +2C · 2 NADPH · 7 轮：C2 → C4 → C6 → C8 → C10 → C12 → C14 → C16'));

        [
          [270, 'FAS 净反应', '1 乙酰-CoA + 7 丙二酰-CoA + 14 NADPH', '→ 棕榈酸 C16:0 + 7 CO₂'],
          [750, '从乙酰-CoA起算', '8 乙酰-CoA + 7 ATP + 14 NADPH', 'ACLY 的输出成本另计'],
          [1230, '来源与下游', 'PPP / 苹果酸酶 → NADPH', 'ER · ELOVL / SCD → 延长 / 去饱和']
        ].forEach(([x, title, line1, line2]) => {
          const card = studentSvgElement('g', { class: 'student-fa-synthesis-ledger-card' });
          card.appendChild(studentSvgElement('rect', { x: x - 205, y: 730, width: 410, height: 105, rx: 16 }));
          card.appendChild(studentSvgElement('text', { x, y: 761, class: 'ledger-title', 'text-anchor': 'middle' }, title));
          card.appendChild(studentSvgElement('text', { x, y: 790, class: 'ledger-line', 'text-anchor': 'middle' }, line1));
          card.appendChild(studentSvgElement('text', { x, y: 817, class: 'ledger-note', 'text-anchor': 'middle' }, line2));
          studentMapNodes.appendChild(card);
        });
        setStudentReadingStep(pathwayId, 0);
      }

      function renderCarnitineStudentMap(pathwayId, pathwayReactions, tone) {
        const ownReactions = pathwayReactions.filter(reaction => groupsFor(reaction).includes(pathwayId));
        const byEnzyme = pattern => ownReactions.find(reaction => pattern.test(reaction.enzyme || '')) || null;
        const rx = {
          cpt1: byEnzyme(/转移酶 1|CPT1/i),
          vdac: byEnzyme(/VDAC/i),
          cactIn: ownReactions.find(reaction => /CACT|SLC25A20/i.test(reaction.enzyme || '') && /脂酰肉碱/.test(reaction.from || '')) || null,
          cactOut: ownReactions.find(reaction => /CACT|SLC25A20/i.test(reaction.enzyme || '') && /肉碱@/.test(reaction.from || '') && !/脂酰/.test(reaction.from || '')) || null,
          cpt2: byEnzyme(/转移酶 2|CPT2/i)
        };
        studentPathwayMap.setAttribute('viewBox', '0 0 1500 900');
        studentPathwayMap.dataset.mapLayout = 'carnitine-double-membrane-antiport';
        studentPathwayMap.setAttribute('aria-label', '肉碱穿梭：CPT1在外膜胞质侧生成脂酰肉碱，CACT跨内膜反向交换，CPT2在基质侧再生脂酰辅酶A');
        studentMapBands.replaceChildren(); studentMapEdges.replaceChildren(); studentMapNodes.replaceChildren();
        studentMapCount.textContent = '4 个核心事件 · 6 个原始反应 · 2 个独立 CoA 池';

        [
          ['cytosol-gate', 20, 185, 'carnitine-cytosol-band', '① 胞质侧入口 · 长链脂酰-CoA不跨内膜'],
          ['outer-membrane', 218, 120, 'carnitine-outer-band', '② 外膜 / 膜间隙 · 项目数据以 VDAC 标记外膜通道'],
          ['inner-membrane-exchange', 351, 212, 'carnitine-inner-band', '③ 内膜 · CACT 把脂酰肉碱输入与游离肉碱输出配成反向交换'],
          ['matrix-handoff', 576, 154, 'carnitine-matrix-band', '④ 基质侧交接 · CPT2 再生脂酰-CoA，接入 β-氧化'],
          ['net', 743, 137, 'carnitine-net-band', '净结果 · 搬运脂酰基，肉碱循环，两侧 CoA 池不混合']
        ].forEach(([key, y, height, className, title]) => {
          studentMapBands.appendChild(studentSvgElement('rect', { x: 22, y, width: 1456, height, class: `student-map-band ${className}`, 'data-carnitine-zone': key }));
          studentMapBands.appendChild(studentSvgElement('text', { x: 44, y: y + 29, class: 'student-map-band-label' }, title));
        });

        const defs = [
          ['malonyl', 'malonyl-CoA', '合成开启时抑制 CPT1', 1120, 82, rx.cpt1, 0],
          ['acyl-coa-cyt', '长链脂酰-CoA', '胞质侧 · 不直接跨内膜', 155, 125, rx.cpt1, 0],
          ['carnitine-cyt', '游离肉碱', '胞质侧载体', 155, 185, rx.cpt1, 0],
          ['cpt1', 'CPT1', '外膜胞质侧', 470, 155, rx.cpt1, 0],
          ['acyl-carnitine-cyt', '脂酰肉碱', '可跨膜形式', 770, 125, rx.vdac, 1],
          ['coa-cyt', 'CoA-SH', '胞质 CoA 池', 770, 185, rx.cpt1, 0],
          ['acyl-carnitine-outer', '脂酰肉碱', '外膜外侧', 260, 282, rx.vdac, 1],
          ['vdac', 'VDAC', '外膜通道', 590, 282, rx.vdac, 1],
          ['acyl-carnitine-ims', '脂酰肉碱', '膜间隙', 920, 282, rx.cactIn, 2],
          ['acyl-carnitine-ims-antiport', '脂酰肉碱', '膜间隙侧 · 输入', 235, 425, rx.cactIn, 2],
          ['carnitine-ims', '游离肉碱', '膜间隙侧 · 输出', 235, 520, rx.cactOut, 2],
          ['cact', 'CACT / SLC25A20', '内膜反向交换器', 745, 470, rx.cactIn, 2],
          ['acyl-carnitine-matrix', '脂酰肉碱', '基质侧 · 输入完成', 1250, 425, rx.cpt2, 3],
          ['carnitine-matrix-return', '游离肉碱', '基质侧 · 向外交换', 1250, 520, rx.cactOut, 2],
          ['acyl-carnitine-matrix-cpt2', '脂酰肉碱', '基质侧', 205, 638, rx.cpt2, 3],
          ['coa-matrix', 'CoA-SH', '基质 CoA 池', 205, 700, rx.cpt2, 3],
          ['cpt2', 'CPT2', '内膜基质侧', 560, 669, rx.cpt2, 3],
          ['acyl-coa-matrix', '长链脂酰-CoA', '基质 · 进入 β-氧化', 900, 638, rx.cpt2, 3],
          ['carnitine-matrix', '游离肉碱', '释放后循环再用', 900, 700, rx.cactOut, 2]
        ];
        const records = new Map(defs.map(([key, label, meta, x, y, reaction, stepIndex]) => [key, { key, label, meta, x, y, reaction, stepIndex }]));
        const addEdge = (from, to, reaction, path = '', className = '') => {
          const a = records.get(from), b = records.get(to);
          const edge = studentSvgElement('path', {
            d: path || studentMapEdgePath(a, b, 170, 60),
            class: `student-map-edge carnitine-edge ${className}`.trim(),
            'data-edge-from': from, 'data-edge-to': to, 'data-reaction': reaction?.id || '',
            'data-step-index': String(a.stepIndex)
          });
          if (reaction) {
            edge.addEventListener('click', event => { event.stopPropagation(); renderStudentReactionDetail(reaction, pathwayId, ownReactions.indexOf(reaction)); });
            edge.setAttribute('role', 'button'); edge.tabIndex = 0;
          }
          studentMapEdges.appendChild(edge); applyStudentReactionDirection(edge, reaction, { showLabel: false });
        };
        addEdge('acyl-coa-cyt', 'cpt1', rx.cpt1); addEdge('carnitine-cyt', 'cpt1', rx.cpt1);
        addEdge('cpt1', 'acyl-carnitine-cyt', rx.cpt1); addEdge('cpt1', 'coa-cyt', rx.cpt1);
        addEdge('malonyl', 'cpt1', rx.cpt1, 'M 1035 88 C 850 92, 650 115, 545 145', 'inhibition');
        addEdge('acyl-carnitine-outer', 'vdac', rx.vdac, '', 'transport'); addEdge('vdac', 'acyl-carnitine-ims', rx.vdac, '', 'transport');
        addEdge('acyl-carnitine-ims-antiport', 'cact', rx.cactIn, '', 'antiport-in'); addEdge('cact', 'acyl-carnitine-matrix', rx.cactIn, '', 'antiport-in');
        addEdge('carnitine-matrix-return', 'cact', rx.cactOut, '', 'antiport-out'); addEdge('cact', 'carnitine-ims', rx.cactOut, '', 'antiport-out');
        addEdge('acyl-carnitine-matrix-cpt2', 'cpt2', rx.cpt2); addEdge('coa-matrix', 'cpt2', rx.cpt2);
        addEdge('cpt2', 'acyl-coa-matrix', rx.cpt2); addEdge('cpt2', 'carnitine-matrix', rx.cpt2);

        records.forEach(record => {
          const group = studentSvgElement('g', { class: 'student-map-node carnitine-node', style: `--tone:${tone}`, 'data-map-key': record.key, 'data-reaction': record.reaction?.id || '', 'data-step-index': String(record.stepIndex), role: 'button', tabindex: '0' });
          group.appendChild(studentSvgElement('rect', { x: record.x - 86, y: record.y - 29, width: 172, height: 58, rx: 14 }));
          const name = studentSvgElement('text', { x: record.x, y: record.y + 1, class: 'node-name' }, record.label);
          group.append(name, studentSvgElement('text', { x: record.x, y: record.y + 20, class: 'node-compartment' }, record.meta));
          if (record.reaction) {
            const open = () => renderStudentReactionDetail(record.reaction, pathwayId, ownReactions.indexOf(record.reaction));
            group.addEventListener('click', open);
            group.addEventListener('keydown', event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); open(); } });
          }
          studentMapNodes.appendChild(group); fitStudentMapText(name, 156, 15.5, 9.5);
        });

        [
          [0, '1 · CPT1 · 外膜胞质侧', 470, 88, rx.cpt1],
          [1, '2 · VDAC · 外膜通道', 590, 245, rx.vdac],
          [2, '3 · CACT / SLC25A20 · 内膜反向交换', 745, 386, rx.cactIn],
          [3, '4 · CPT2 · 内膜基质侧', 560, 615, rx.cpt2]
        ].forEach(([stepIndex, value, x, y, reaction]) => {
          const event = studentSvgElement('text', { x, y, class: 'student-carnitine-event', 'data-carnitine-event': String(stepIndex + 1), 'data-step-index': String(stepIndex), 'text-anchor': 'middle', role: 'button', tabindex: '0' }, value);
          if (reaction) event.addEventListener('click', () => renderStudentReactionDetail(reaction, pathwayId, ownReactions.indexOf(reaction)));
          studentMapNodes.appendChild(event);
        });
        studentMapNodes.appendChild(studentSvgElement('text', { x: 470, y: 198, class: 'student-carnitine-regulation', 'text-anchor': 'middle' }, 'malonyl-CoA 抑制 CPT1'));
        studentMapNodes.appendChild(studentSvgElement('text', { x: 500, y: 548, class: 'student-carnitine-inflow', 'text-anchor': 'middle' }, '脂酰肉碱入基质 →'));
        studentMapNodes.appendChild(studentSvgElement('text', { x: 995, y: 548, class: 'student-carnitine-outflow', 'text-anchor': 'middle' }, '← 游离肉碱向外'));

        const nextPath = studentSvgElement('g', { class: 'student-map-next-pathway carnitine-next-pathway', 'data-next-pathway': 'beta_oxidation', role: 'button', tabindex: '0', 'aria-label': '长链脂酰辅酶A下一站：脂肪酸β-氧化' });
        nextPath.appendChild(studentSvgElement('rect', { x: 1130, y: 626, width: 280, height: 90, rx: 16 }));
        nextPath.appendChild(studentSvgElement('text', { x: 1270, y: 660, class: 'next-label' }, '长链脂酰-CoA 下一站'));
        nextPath.appendChild(studentSvgElement('text', { x: 1270, y: 694, class: 'next-name' }, '进入 β-氧化 →'));
        const openBetaOxidation = () => renderStudentPathway('beta_oxidation', { returnToPrimer: false });
        nextPath.addEventListener('click', event => { event.stopPropagation(); openBetaOxidation(); });
        nextPath.addEventListener('keydown', event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); openBetaOxidation(); } });
        studentMapNodes.appendChild(nextPath);

        [
          [270, '净搬运对象', '长链脂酰基 → 线粒体基质', '中短链依赖较低'],
          [750, '池与循环', 'CoA 不跨内膜', '游离肉碱循环再用'],
          [1230, '能量边界', '穿梭本身不额外耗 ATP', '上游 ACSL：ATP → AMP + PPi']
        ].forEach(([x, title, line1, line2]) => {
          const card = studentSvgElement('g', { class: 'student-carnitine-net-card' });
          card.appendChild(studentSvgElement('rect', { x: x - 205, y: 780, width: 410, height: 82, rx: 16 }));
          card.appendChild(studentSvgElement('text', { x, y: 807, class: 'net-title', 'text-anchor': 'middle' }, title));
          card.appendChild(studentSvgElement('text', { x, y: 833, class: 'net-line', 'text-anchor': 'middle' }, line1));
          card.appendChild(studentSvgElement('text', { x, y: 854, class: 'net-note', 'text-anchor': 'middle' }, line2));
          studentMapNodes.appendChild(card);
        });
        setStudentReadingStep(pathwayId, 0);
      }

      function renderBetaOxidationStudentMap(pathwayId, pathwayReactions, tone) {
        const ownReactions = pathwayReactions.filter(reaction => groupsFor(reaction).includes(pathwayId));
        const byEnzyme = pattern => ownReactions.find(reaction => pattern.test(reaction.enzyme || '')) || null;
        const rx = {
          dehydrogenation: byEnzyme(/脂酰-CoA 脱氢酶/),
          hydration: byEnzyme(/烯酰-CoA 水合酶/),
          oxidation: byEnzyme(/β-羟脂酰-CoA 脱氢酶/),
          thiolysis: byEnzyme(/β-酮硫解酶/)
        };
        studentPathwayMap.setAttribute('viewBox', '0 0 1500 900');
        studentPathwayMap.dataset.mapLayout = 'beta-oxidation-four-step-spiral';
        studentPathwayMap.setAttribute('aria-label', '脂肪酸β-氧化：基质脂酰辅酶A经过脱氢、水合、再脱氢和硫解，每轮缩短两个碳并输出乙酰辅酶A与还原当量');
        studentMapBands.replaceChildren(); studentMapEdges.replaceChildren(); studentMapNodes.replaceChildren();
        studentMapCount.textContent = '4 个核心事件 · 4 个原始反应 · C16 完成 7 轮';

        [
          ['entry-boundary', 20, 145, 'beta-entry-band', '入口边界 · 上游活化与肉碱穿梭已经完成，本图从基质脂酰-CoA开始'],
          ['four-step-cycle', 178, 390, 'beta-cycle-band', '四步螺旋 · 脱氢 → 水合 → 再脱氢 → 硫解 → 缩短链返回'],
          ['spiral-ledger', 581, 150, 'beta-ledger-band', '每轮账本与 C16 总账 · 不把“每轮 1 个乙酰-CoA”误写成最终总产量'],
          ['pathway-outputs', 744, 136, 'beta-output-band', '通路交接 · β-氧化本身不直接产生 ATP，产物进入 TCA 与呼吸链']
        ].forEach(([key, y, height, className, title]) => {
          studentMapBands.appendChild(studentSvgElement('rect', { x: 22, y, width: 1456, height, class: `student-map-band ${className}`, 'data-beta-oxidation-zone': key }));
          studentMapBands.appendChild(studentSvgElement('text', { x: 44, y: y + 29, class: 'student-map-band-label' }, title));
        });

        const defs = [
          ['activation', '脂肪酸活化', '上游 · ATP → AMP + PPi', 185, 105, rx.dehydrogenation, 0],
          ['carnitine', '肉碱穿梭', '长链脂酰基跨内膜', 515, 105, rx.dehydrogenation, 0],
          ['matrix-acyl-entry', '基质脂酰-CoA', '饱和偶数链主线入口', 845, 105, rx.dehydrogenation, 0],
          ['spiral-start', '四步螺旋', '从此开始，不重复计算上游', 1175, 105, rx.dehydrogenation, 0],
          ['acyl', '脂酰-CoA', '本轮 n 个碳', 105, 330, rx.dehydrogenation, 0],
          ['acad', 'ACAD', '脂酰-CoA 脱氢酶', 345, 330, rx.dehydrogenation, 0],
          ['enoyl', 'trans-Δ²-烯酰-CoA', '形成 α,β 双键', 585, 330, rx.hydration, 1],
          ['hydratase', '烯酰-CoA 水合酶', '加入 H₂O', 825, 330, rx.hydration, 1],
          ['hydroxy', 'L-β-羟脂酰-CoA', '立体专一的水合产物', 1065, 330, rx.oxidation, 2],
          ['had', 'β-羟脂酰-CoA脱氢酶', 'NAD⁺依赖', 1065, 485, rx.oxidation, 2],
          ['keto', 'β-酮脂酰-CoA', '准备发生硫解', 825, 485, rx.thiolysis, 3],
          ['thiolase', 'β-酮硫解酶', 'CoA-SH 参与断键', 585, 485, rx.thiolysis, 3],
          ['acetyl', '乙酰-CoA', '本轮释放 1 个', 345, 485, rx.thiolysis, 3],
          ['shortened', '缩短脂酰-CoA', '链长 −2C，返回下一轮', 105, 485, rx.dehydrogenation, 0]
        ];
        const records = new Map(defs.map(([key, label, meta, x, y, reaction, stepIndex]) => [key, { key, label, meta, x, y, reaction, stepIndex }]));
        const addEdge = (from, to, reaction, path = '', className = '') => {
          const a = records.get(from), b = records.get(to);
          const edge = studentSvgElement('path', {
            d: path || studentMapEdgePath(a, b, 170, 60),
            class: `student-map-edge beta-oxidation-edge ${className}`.trim(),
            'data-edge-from': from, 'data-edge-to': to, 'data-reaction': reaction?.id || '',
            'data-step-index': String(a.stepIndex)
          });
          if (reaction) {
            const open = () => renderStudentReactionDetail(reaction, pathwayId, ownReactions.indexOf(reaction));
            edge.addEventListener('click', event => { event.stopPropagation(); open(); });
            edge.addEventListener('keydown', event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); open(); } });
            edge.setAttribute('role', 'button'); edge.tabIndex = 0;
          }
          studentMapEdges.appendChild(edge); applyStudentReactionDirection(edge, reaction, { showLabel: false });
        };
        addEdge('activation', 'carnitine', rx.dehydrogenation, '', 'boundary');
        addEdge('carnitine', 'matrix-acyl-entry', rx.dehydrogenation, '', 'boundary');
        addEdge('matrix-acyl-entry', 'spiral-start', rx.dehydrogenation, '', 'boundary');
        addEdge('spiral-start', 'acyl', rx.dehydrogenation, 'M 1175 135 C 1080 195, 475 220, 105 298', 'boundary');
        addEdge('acyl', 'acad', rx.dehydrogenation); addEdge('acad', 'enoyl', rx.dehydrogenation);
        addEdge('enoyl', 'hydratase', rx.hydration); addEdge('hydratase', 'hydroxy', rx.hydration);
        addEdge('hydroxy', 'had', rx.oxidation, 'M 1065 360 L 1065 454');
        addEdge('had', 'keto', rx.oxidation); addEdge('keto', 'thiolase', rx.thiolysis);
        addEdge('thiolase', 'acetyl', rx.thiolysis); addEdge('thiolase', 'shortened', rx.thiolysis, 'M 500 485 C 390 550, 215 550, 190 505');
        addEdge('shortened', 'acyl', rx.dehydrogenation, 'M 105 455 C 32 435, 32 375, 105 360', 'cycle-return');

        records.forEach(record => {
          const group = studentSvgElement('g', { class: 'student-map-node beta-oxidation-node', style: `--tone:${tone}`, 'data-map-key': record.key, 'data-reaction': record.reaction?.id || '', 'data-step-index': String(record.stepIndex), role: 'button', tabindex: '0' });
          group.appendChild(studentSvgElement('rect', { x: record.x - 88, y: record.y - 30, width: 176, height: 60, rx: 14 }));
          const name = studentSvgElement('text', { x: record.x, y: record.y + 1, class: 'node-name' }, record.label);
          group.append(name, studentSvgElement('text', { x: record.x, y: record.y + 21, class: 'node-compartment' }, record.meta));
          if (record.reaction) {
            const open = () => renderStudentReactionDetail(record.reaction, pathwayId, ownReactions.indexOf(record.reaction));
            group.addEventListener('click', open);
            group.addEventListener('keydown', event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); open(); } });
          }
          studentMapNodes.appendChild(group); fitStudentMapText(name, 160, 15.5, 9.5);
        });

        [
          [0, '1 · 第一次脱氢', 345, 270, rx.dehydrogenation],
          [1, '2 · 水合', 825, 270, rx.hydration],
          [2, '3 · 第二次脱氢', 1165, 405, rx.oxidation],
          [3, '4 · 硫解', 585, 540, rx.thiolysis]
        ].forEach(([stepIndex, value, x, y, reaction]) => {
          const event = studentSvgElement('text', { x, y, class: 'student-beta-oxidation-event', 'data-beta-oxidation-event': String(stepIndex + 1), 'data-step-index': String(stepIndex), 'text-anchor': 'middle', role: 'button', tabindex: '0' }, value);
          if (reaction) event.addEventListener('click', () => renderStudentReactionDetail(reaction, pathwayId, ownReactions.indexOf(reaction)));
          studentMapNodes.appendChild(event);
        });
        studentMapNodes.appendChild(studentSvgElement('text', { x: 345, y: 390, class: 'student-beta-oxidation-electron', 'text-anchor': 'middle' }, '酶内 FAD → ETF → ETF:QO → CoQ'));
        studentMapNodes.appendChild(studentSvgElement('text', { x: 825, y: 390, class: 'student-beta-oxidation-cofactor', 'text-anchor': 'middle' }, 'H₂O'));
        studentMapNodes.appendChild(studentSvgElement('text', { x: 1065, y: 548, class: 'student-beta-oxidation-electron', 'text-anchor': 'middle' }, 'NAD⁺ → NADH + H⁺'));
        studentMapNodes.appendChild(studentSvgElement('text', { x: 585, y: 455, class: 'student-beta-oxidation-cofactor', 'text-anchor': 'middle' }, 'CoA-SH'));
        studentMapNodes.appendChild(studentSvgElement('text', { x: 190, y: 555, class: 'student-beta-oxidation-return', 'text-anchor': 'middle' }, '缩短 2C，返回下一轮'));
        studentMapNodes.appendChild(studentSvgElement('text', { x: 750, y: 154, class: 'student-beta-oxidation-boundary', 'text-anchor': 'middle' }, '上游：活化 + 肉碱穿梭 · 本图范围：线粒体内饱和偶数链主线'));

        [
          [270, '每轮账本', '脂酰链 −2C', '每轮：1 乙酰-CoA + 1 NADH + 1 对电子进入 CoQ'],
          [750, '棕榈酰-CoA 碳链', 'C16 → C14 → C12 → C10 → C8 → C6 → C4', '末轮 C4 → 2 乙酰-CoA'],
          [1230, 'C16 完整总账', '7 轮 → 8 乙酰-CoA + 7 NADH + 7 对电子进入 CoQ', '活化成本与穿梭不在四步循环内']
        ].forEach(([x, title, line1, line2]) => {
          const card = studentSvgElement('g', { class: 'student-beta-oxidation-ledger-card' });
          card.appendChild(studentSvgElement('rect', { x: x - 215, y: 625, width: 430, height: 82, rx: 16 }));
          card.appendChild(studentSvgElement('text', { x, y: 653, class: 'ledger-title', 'text-anchor': 'middle' }, title));
          card.appendChild(studentSvgElement('text', { x, y: 680, class: 'ledger-line', 'text-anchor': 'middle' }, line1));
          card.appendChild(studentSvgElement('text', { x, y: 700, class: 'ledger-note', 'text-anchor': 'middle' }, line2));
          studentMapNodes.appendChild(card);
        });

        const addNextPathway = (id, x, title, note) => {
          const next = studentSvgElement('g', { class: 'student-map-next-pathway beta-oxidation-next-pathway', 'data-next-pathway': id, role: 'button', tabindex: '0', 'aria-label': `${title}：${note}` });
          next.appendChild(studentSvgElement('rect', { x: x - 205, y: 795, width: 410, height: 64, rx: 16 }));
          next.appendChild(studentSvgElement('text', { x, y: 822, class: 'next-label' }, title));
          next.appendChild(studentSvgElement('text', { x, y: 847, class: 'next-name' }, note));
          const open = () => renderStudentPathway(id, { returnToPrimer: false });
          next.addEventListener('click', event => { event.stopPropagation(); open(); });
          next.addEventListener('keydown', event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); open(); } });
          studentMapNodes.appendChild(next);
        };
        addNextPathway('tca', 380, '乙酰-CoA', '进入 TCA →');
        addNextPathway('etc', 1120, 'NADH / CoQH₂', '进入呼吸链 →');
        studentMapNodes.appendChild(studentSvgElement('text', { x: 750, y: 775, class: 'student-beta-oxidation-atp', 'text-anchor': 'middle' }, 'β-氧化本身不直接产生 ATP'));
        setStudentReadingStep(pathwayId, 0);
      }

      function renderKetoneStudentMap(pathwayId, pathwayReactions, tone) {
        const ownReactions = pathwayReactions.filter(reaction => groupsFor(reaction).includes(pathwayId));
        const byEnzyme = pattern => ownReactions.find(reaction => pattern.test(reaction.enzyme || '')) || null;
        const rx = {
          synthThiolase: ownReactions.find(reaction => /硫解酶/.test(reaction.enzyme || '') && reaction.reversible) || null,
          hmgcs2: byEnzyme(/HMG-CoA 合成酶/),
          hmgcl: byEnzyme(/HMG-CoA 裂解酶/),
          bdhReduction: ownReactions.find(reaction => /β-羟丁酸脱氢酶/.test(reaction.enzyme || '') && /乙酰乙酸/.test(reaction.from || '')) || null,
          scot: byEnzyme(/SCOT/),
          useThiolase: ownReactions.find(reaction => /β-酮硫解酶/.test(reaction.enzyme || '')) || null,
          bdhOxidation: ownReactions.find(reaction => /β-羟丁酸脱氢酶/.test(reaction.enzyme || '') && /β-羟丁酸/.test(reaction.from || '')) || null
        };
        studentPathwayMap.setAttribute('viewBox', '0 0 1500 900');
        studentPathwayMap.dataset.mapLayout = 'ketone-liver-blood-periphery';
        studentPathwayMap.setAttribute('aria-label', '酮体代谢：肝线粒体生成乙酰乙酸和D-β-羟丁酸，经血液送至外周线粒体，再由SCOT接入乙酰辅酶A与三羧酸循环');
        studentMapBands.replaceChildren(); studentMapEdges.replaceChildren(); studentMapNodes.replaceChildren();
        studentMapCount.textContent = '7 个核心事件 · 7 个原始反应 · 肝生成 / 外周利用';

        [
          ['hepatic-ketogenesis', 22, 20, 560, 666, 'ketone-liver-band', '① 肝线粒体 · 生成'],
          ['circulation-redox', 596, 20, 310, 666, 'ketone-blood-band', '② 血液运输 · 两种循环酮体'],
          ['extrahepatic-ketolysis', 920, 20, 558, 666, 'ketone-periphery-band', '③ 外周线粒体 · 利用'],
          ['tissue-boundary', 22, 700, 1456, 180, 'ketone-boundary-band', '④ 组织分工与化学边界']
        ].forEach(([key, x, y, width, height, className, title]) => {
          studentMapBands.appendChild(studentSvgElement('rect', { x, y, width, height, class: `student-map-band ${className}`, 'data-ketone-zone': key }));
          studentMapBands.appendChild(studentSvgElement('text', { x: x + 22, y: y + 30, class: 'student-map-band-label' }, title));
        });

        const defs = [
          ['beta-oxidation', 'β-氧化', '提供乙酰-CoA', 120, 82, rx.synthThiolase, 0],
          ['acetyl-a', '乙酰-CoA', '第 1 个', 100, 150, rx.synthThiolase, 0],
          ['acetyl-b', '乙酰-CoA', '第 2 个', 100, 215, rx.synthThiolase, 0],
          ['liver-thiolase', '硫解酶', '可逆缩合', 330, 182, rx.synthThiolase, 0],
          ['liver-acetoacetyl', '乙酰乙酰-CoA', '四碳中间体', 215, 285, rx.hmgcs2, 1],
          ['acetyl-c', '乙酰-CoA', '第 3 个参与者', 100, 350, rx.hmgcs2, 1],
          ['hmgcs2', 'HMGCS2', '线粒体 HMG-CoA合成酶', 455, 320, rx.hmgcs2, 1],
          ['hmg-coa', 'HMG-CoA', '六碳中间体', 215, 415, rx.hmgcl, 2],
          ['hmgcl', 'HMGCL', 'HMG-CoA裂解酶', 455, 415, rx.hmgcl, 2],
          ['liver-acac', '乙酰乙酸', '肝输出 · 四碳', 240, 555, rx.bdhReduction, 3],
          ['liver-bdh1', 'BDH1', '线粒体内膜相关酶', 455, 545, rx.bdhReduction, 3],
          ['liver-bhb', 'D-β-羟丁酸', '主要循环还原型', 455, 635, rx.bdhReduction, 3],
          ['acetone', '丙酮', '少量自发脱羧旁支', 110, 635, null, 2],
          ['mct-out', 'MCT', '肝细胞膜输出', 660, 500, rx.bdhReduction, 3],
          ['blood-acac', '乙酰乙酸', '血液', 750, 425, rx.scot, 4],
          ['blood-bhb', 'D-β-羟丁酸', '血液', 750, 560, rx.bdhOxidation, 4],
          ['mct-in', 'MCT', '外周细胞膜摄取', 840, 500, rx.bdhOxidation, 4],
          ['periphery-bhb', 'D-β-羟丁酸', '外周线粒体', 1030, 120, rx.bdhOxidation, 4],
          ['periphery-bdh1', 'BDH1', '氧化回乙酰乙酸', 1320, 120, rx.bdhOxidation, 4],
          ['periphery-acac', '乙酰乙酸', '外周线粒体', 1030, 250, rx.scot, 5],
          ['scot', 'SCOT / OXCT1', '肝细胞缺少此酶', 1320, 295, rx.scot, 5],
          ['succinyl', '琥珀酰-CoA', 'CoA 供体', 1030, 375, rx.scot, 5],
          ['succinate', '琥珀酸', 'SCOT 另一产物', 1320, 395, rx.scot, 5],
          ['periphery-acetoacetyl', '乙酰乙酰-CoA', '已被 CoA 活化', 1030, 475, rx.useThiolase, 6],
          ['periphery-thiolase', 'β-酮硫解酶', 'CoA-SH 参与', 1320, 510, rx.useThiolase, 6],
          ['two-acetyl', '2 乙酰-CoA', '进入 TCA 氧化', 1030, 610, rx.useThiolase, 6]
        ];
        const records = new Map(defs.map(([key, label, meta, x, y, reaction, stepIndex]) => [key, { key, label, meta, x, y, reaction, stepIndex }]));
        const addEdge = (from, to, reaction, path = '', className = '') => {
          const a = records.get(from), b = records.get(to);
          const edge = studentSvgElement('path', {
            d: path || studentMapEdgePath(a, b, 170, 60),
            class: `student-map-edge ketone-edge ${className}`.trim(),
            'data-edge-from': from, 'data-edge-to': to, 'data-reaction': reaction?.id || '',
            'data-step-index': String(a.stepIndex)
          });
          if (reaction) {
            const open = () => renderStudentReactionDetail(reaction, pathwayId, ownReactions.indexOf(reaction));
            edge.addEventListener('click', event => { event.stopPropagation(); open(); });
            edge.setAttribute('role', 'button'); edge.tabIndex = 0;
          }
          studentMapEdges.appendChild(edge); applyStudentReactionDirection(edge, reaction, { showLabel: false });
        };
        addEdge('beta-oxidation', 'acetyl-a', rx.synthThiolase, '', 'upstream');
        addEdge('acetyl-a', 'liver-thiolase', rx.synthThiolase); addEdge('acetyl-b', 'liver-thiolase', rx.synthThiolase);
        addEdge('liver-thiolase', 'liver-acetoacetyl', rx.synthThiolase, 'M 330 212 C 315 245, 260 275, 228 280');
        addEdge('liver-acetoacetyl', 'hmgcs2', rx.hmgcs2); addEdge('acetyl-c', 'hmgcs2', rx.hmgcs2);
        addEdge('hmgcs2', 'hmg-coa', rx.hmgcs2, 'M 440 345 C 390 375, 300 405, 228 410');
        addEdge('hmg-coa', 'hmgcl', rx.hmgcl); addEdge('hmgcl', 'liver-acac', rx.hmgcl, 'M 440 440 C 390 475, 310 530, 253 548');
        addEdge('liver-acac', 'liver-bdh1', rx.bdhReduction); addEdge('liver-bdh1', 'liver-bhb', rx.bdhReduction, 'M 455 575 L 455 605');
        addEdge('liver-acac', 'acetone', null, 'M 230 575 C 210 600, 200 620, 192 630', 'minor');
        addEdge('liver-acac', 'mct-out', rx.bdhReduction, 'M 325 555 C 450 545, 560 515, 575 502', 'transport');
        addEdge('liver-bhb', 'mct-out', rx.bdhReduction, 'M 540 635 C 600 610, 645 550, 660 530', 'transport');
        addEdge('mct-out', 'blood-acac', rx.scot, 'M 742 493 C 756 470, 758 450, 750 455', 'transport');
        addEdge('mct-out', 'blood-bhb', rx.bdhOxidation, 'M 742 507 C 758 530, 760 548, 750 530', 'transport');
        addEdge('blood-acac', 'mct-in', rx.scot, 'M 750 455 C 750 470, 755 490, 758 495', 'transport');
        addEdge('blood-bhb', 'mct-in', rx.bdhOxidation, 'M 750 530 C 760 520, 760 505, 758 505', 'transport');
        addEdge('mct-in', 'periphery-bhb', rx.bdhOxidation, 'M 922 480 C 965 390, 980 210, 1020 150', 'transport');
        addEdge('periphery-bhb', 'periphery-bdh1', rx.bdhOxidation); addEdge('periphery-bdh1', 'periphery-acac', rx.bdhOxidation, 'M 1320 150 C 1280 195, 1110 230, 1040 245');
        addEdge('periphery-acac', 'scot', rx.scot); addEdge('succinyl', 'scot', rx.scot, 'M 1115 375 C 1180 355, 1260 320, 1305 300');
        addEdge('scot', 'succinate', rx.scot, 'M 1320 325 L 1320 365');
        addEdge('scot', 'periphery-acetoacetyl', rx.scot, 'M 1305 315 C 1230 360, 1100 430, 1040 465');
        addEdge('periphery-acetoacetyl', 'periphery-thiolase', rx.useThiolase); addEdge('periphery-thiolase', 'two-acetyl', rx.useThiolase, 'M 1305 530 C 1230 560, 1100 595, 1040 605');

        records.forEach(record => {
          const nodeAttrs = { class: 'student-map-node ketone-node', style: `--tone:${tone}`, 'data-map-key': record.key, 'data-reaction': record.reaction?.id || '', 'data-step-index': String(record.stepIndex) };
          if (record.reaction) Object.assign(nodeAttrs, { role: 'button', tabindex: '0' });
          const group = studentSvgElement('g', nodeAttrs);
          group.appendChild(studentSvgElement('rect', { x: record.x - 82, y: record.y - 28, width: 164, height: 56, rx: 13 }));
          const name = studentSvgElement('text', { x: record.x, y: record.y + 1, class: 'node-name' }, record.label);
          group.append(name, studentSvgElement('text', { x: record.x, y: record.y + 19, class: 'node-compartment' }, record.meta));
          if (record.reaction) {
            const open = () => renderStudentReactionDetail(record.reaction, pathwayId, ownReactions.indexOf(record.reaction));
            group.addEventListener('click', open);
            group.addEventListener('keydown', event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); open(); } });
          }
          studentMapNodes.appendChild(group); fitStudentMapText(name, 148, 15, 9.5);
        });

        [
          [0, '1 · 硫解酶 · 2 乙酰-CoA', 330, 125, rx.synthThiolase],
          [1, '2 · HMGCS2 · 再加 1 乙酰-CoA', 385, 255, rx.hmgcs2],
          [2, '3 · HMGCL · 返还 1 乙酰-CoA', 350, 385, rx.hmgcl],
          [3, '4 · BDH1 · NADH + H⁺ → NAD⁺', 430, 505, rx.bdhReduction],
          [4, '5 · BDH1 · NAD⁺ → NADH + H⁺', 1180, 82, rx.bdhOxidation],
          [5, '6 · SCOT / OXCT1', 1180, 220, rx.scot],
          [6, '7 · β-酮硫解酶', 1180, 445, rx.useThiolase]
        ].forEach(([stepIndex, value, x, y, reaction]) => {
          const event = studentSvgElement('text', { x, y, class: 'student-ketone-event', 'data-ketone-event': String(stepIndex + 1), 'data-step-index': String(stepIndex), 'text-anchor': 'middle', role: 'button', tabindex: '0' }, value);
          if (reaction) event.addEventListener('click', () => renderStudentReactionDetail(reaction, pathwayId, ownReactions.indexOf(reaction)));
          studentMapNodes.appendChild(event);
        });
        studentMapNodes.appendChild(studentSvgElement('text', { x: 260, y: 480, class: 'student-ketone-ledger', 'text-anchor': 'middle' }, '3 个乙酰-CoA参与，1 个返还；净耗 2 个'));
        studentMapNodes.appendChild(studentSvgElement('text', { x: 370, y: 680, class: 'student-ketone-redox', 'text-anchor': 'middle' }, '高 NADH/NAD⁺ 推动 D-β-羟丁酸'));
        studentMapNodes.appendChild(studentSvgElement('text', { x: 110, y: 680, class: 'student-ketone-minor', 'text-anchor': 'middle' }, '丙酮：少量自发脱羧，主要呼出'));
        studentMapNodes.appendChild(studentSvgElement('text', { x: 750, y: 355, class: 'student-ketone-transport', 'text-anchor': 'middle' }, 'MCT · 血液运输'));
        studentMapNodes.appendChild(studentSvgElement('text', { x: 1175, y: 350, class: 'student-ketone-scot', 'text-anchor': 'middle' }, '琥珀酰-CoA → 琥珀酸 · SCOT 不直接消耗 ATP'));

        const next = studentSvgElement('g', { class: 'student-map-next-pathway ketone-next-pathway', 'data-next-pathway': 'tca', role: 'button', tabindex: '0', 'aria-label': '两个乙酰辅酶A进入三羧酸循环' });
        next.appendChild(studentSvgElement('rect', { x: 1245, y: 590, width: 205, height: 72, rx: 15 }));
        next.appendChild(studentSvgElement('text', { x: 1348, y: 618, class: 'next-label' }, '2 乙酰-CoA'));
        next.appendChild(studentSvgElement('text', { x: 1348, y: 646, class: 'next-name' }, '进入 TCA →'));
        const openTca = () => renderStudentPathway('tca', { returnToPrimer: false });
        next.addEventListener('click', event => { event.stopPropagation(); openTca(); });
        next.addEventListener('keydown', event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); openTca(); } });
        studentMapNodes.appendChild(next);

        [
          [270, '肝的分工', '肝细胞缺少 SCOT，不能利用自己生成的酮体'],
          [750, '组织边界', '红细胞没有线粒体，不能利用酮体'],
          [1230, '可利用组织', '心 / 骨骼肌 / 肾 / 脑可利用']
        ].forEach(([x, title, line]) => {
          const card = studentSvgElement('g', { class: 'student-ketone-boundary-card' });
          card.appendChild(studentSvgElement('rect', { x: x - 210, y: 755, width: 420, height: 82, rx: 16 }));
          card.appendChild(studentSvgElement('text', { x, y: 785, class: 'boundary-title', 'text-anchor': 'middle' }, title));
          card.appendChild(studentSvgElement('text', { x, y: 817, class: 'boundary-line', 'text-anchor': 'middle' }, line));
          studentMapNodes.appendChild(card);
        });
        studentMapNodes.appendChild(studentSvgElement('text', { x: 750, y: 860, class: 'student-ketone-chemistry', 'text-anchor': 'middle' }, 'D-β-羟丁酸不是化学意义的酮，但按代谢定义属于酮体'));
        setStudentReadingStep(pathwayId, 0);
      }

      function renderTransaminationStudentMap(pathwayId, pathwayReactions, tone) {
        const ownReactions = pathwayReactions.filter(reaction => groupsFor(reaction).includes(pathwayId));
        const rx = {
          transfer: ownReactions.find(reaction => /^氨基转移酶$/.test(reaction.enzyme || '')) || ownReactions[0] || null,
          carrier: ownReactions.find(reaction => /SLC25A18\/22/.test(reaction.enzyme || '')) || null,
          gdhAkg: ownReactions.find(reaction => /谷氨酸脱氢酶/.test(reaction.enzyme || '') && /α-酮戊二酸/.test(reaction.to || '')) || null,
          gdhAmmonium: ownReactions.find(reaction => /谷氨酸脱氢酶/.test(reaction.enzyme || '') && /NH₄/.test(reaction.to || '')) || null
        };
        studentPathwayMap.setAttribute('viewBox', '0 0 1500 920');
        studentPathwayMap.dataset.mapLayout = 'transamination-nitrogen-funnel';
        studentPathwayMap.setAttribute('aria-label', '转氨与氧化脱氨：胞质氨基转移酶用PLP把氮汇入谷氨酸，谷氨酸经GC1或GC2进入线粒体基质，再由GDH释放铵离子并连接尿素循环');
        studentMapBands.replaceChildren(); studentMapEdges.replaceChildren(); studentMapNodes.replaceChildren();
        studentMapCount.textContent = '4 个核心事件 · 4 个原始反应 · 氮汇聚 / 释放 / 排出';

        [
          ['amino-transfer', 22, 20, 650, 560, 'transamination-transfer-band', '① 细胞质 · PLP 依赖转氨'],
          ['inner-membrane-entry', 688, 20, 220, 560, 'transamination-membrane-band', '② 线粒体内膜 · 载体输入'],
          ['matrix-deamination', 924, 20, 554, 560, 'transamination-matrix-band', '③ 线粒体基质 · 氧化脱氨'],
          ['urea-handoff', 22, 596, 1456, 304, 'transamination-handoff-band', '④ 氮与碳骨架的下游交接']
        ].forEach(([key, x, y, width, height, className, title]) => {
          studentMapBands.appendChild(studentSvgElement('rect', { x, y, width, height, class: `student-map-band ${className}`, 'data-transamination-zone': key }));
          studentMapBands.appendChild(studentSvgElement('text', { x: x + 22, y: y + 31, class: 'student-map-band-label' }, title));
        });

        const defs = [
          ['amino-acid', '氨基酸', '氨基供体类别', 115, 145, rx.transfer, 0],
          ['akg-c', 'α-KG', '主要氨基受体', 115, 275, rx.transfer, 0],
          ['aminotransferase', '氨基转移酶', '可逆 · 不释放游离氨', 335, 210, rx.transfer, 0],
          ['keto-acid', '对应 α-酮酸', '保留原碳骨架', 555, 145, rx.transfer, 0],
          ['glutamate-c', '谷氨酸', '胞质氮汇聚点', 555, 275, rx.transfer, 1],
          ['plp', 'PLP', '酶结合辅酶 · 不被净消耗', 335, 325, null, 0],
          ['gc-carrier', 'GC1 / GC2', 'SLC25A22 / SLC25A18', 798, 220, rx.carrier, 2],
          ['proton', 'H⁺', '与谷氨酸同向输入', 798, 360, rx.carrier, 2],
          ['glutamate-m', '谷氨酸', '线粒体基质', 1035, 145, rx.gdhAkg, 3],
          ['gdh', 'GDH / GLUD', '谷氨酸脱氢酶', 1210, 235, rx.gdhAkg, 3],
          ['nadp', 'NAD(P)⁺ + H₂O', '受体与水', 1370, 145, rx.gdhAkg, 3],
          ['akg-m', 'α-KG', '返回碳骨架池', 1035, 405, rx.gdhAkg, 4],
          ['ammonium', 'NH₄⁺', '真正释放的游离氨', 1370, 405, rx.gdhAmmonium, 4],
          ['first-nitrogen', 'NH₄⁺', '尿素第 1 份氮', 165, 720, null, 4],
          ['cps1', 'CPS1', '基质氨甲酰磷酸入口', 405, 720, null, 4],
          ['aspartate', '天冬氨酸', '尿素第 2 份氮', 665, 720, null, 4],
          ['urea-interface', '尿素循环', '两份氮在循环中汇合', 925, 720, null, 4],
          ['akg-return', 'α-KG', 'TCA / 转氨受体池', 1210, 720, null, 4]
        ];
        const records = new Map(defs.map(([key, label, meta, x, y, reaction, stepIndex]) => [key, { key, label, meta, x, y, reaction, stepIndex }]));
        const addEdge = (from, to, reaction, path = '', className = '') => {
          const a = records.get(from), b = records.get(to);
          const edge = studentSvgElement('path', {
            d: path || studentMapEdgePath(a, b, 176, 60),
            class: `student-map-edge transamination-edge ${className}`.trim(),
            'data-edge-from': from, 'data-edge-to': to, 'data-reaction': reaction?.id || '',
            'data-step-index': String(a.stepIndex)
          });
          if (reaction) {
            const open = () => renderStudentReactionDetail(reaction, pathwayId, ownReactions.indexOf(reaction));
            edge.addEventListener('click', event => { event.stopPropagation(); open(); });
            edge.setAttribute('role', 'button'); edge.tabIndex = 0;
          }
          studentMapEdges.appendChild(edge);
          applyStudentReactionDirection(edge, reaction, { showLabel: Boolean(reaction?.reversible), labelOffsetY: -13 });
        };
        addEdge('amino-acid', 'aminotransferase', rx.transfer);
        addEdge('akg-c', 'aminotransferase', rx.transfer);
        addEdge('aminotransferase', 'keto-acid', rx.transfer);
        addEdge('aminotransferase', 'glutamate-c', rx.transfer);
        addEdge('glutamate-c', 'gc-carrier', rx.carrier, 'M 643 275 C 690 270, 735 240, 710 225', 'transport');
        addEdge('proton', 'gc-carrier', rx.carrier, 'M 798 330 L 798 250', 'transport');
        addEdge('gc-carrier', 'glutamate-m', rx.carrier, 'M 886 220 C 930 200, 975 165, 1015 150', 'transport');
        addEdge('glutamate-m', 'gdh', rx.gdhAkg);
        addEdge('nadp', 'gdh', rx.gdhAkg);
        addEdge('gdh', 'akg-m', rx.gdhAkg, 'M 1190 265 C 1150 315, 1080 365, 1048 390');
        addEdge('gdh', 'ammonium', rx.gdhAmmonium, 'M 1230 265 C 1270 315, 1330 365, 1355 390');
        addEdge('ammonium', 'first-nitrogen', null, 'M 1370 435 C 1230 555, 460 615, 165 690', 'handoff');
        addEdge('first-nitrogen', 'cps1', null, '', 'handoff');
        addEdge('aspartate', 'urea-interface', null, '', 'handoff');
        addEdge('cps1', 'urea-interface', null, '', 'handoff');
        addEdge('akg-m', 'akg-return', null, 'M 1035 435 C 1080 525, 1175 610, 1210 690', 'carbon-return');

        records.forEach(record => {
          const attrs = {
            class: 'student-map-node transamination-node', style: `--tone:${tone}`,
            'data-map-key': record.key, 'data-reaction': record.reaction?.id || '',
            'data-step-index': String(record.stepIndex)
          };
          if (record.reaction) Object.assign(attrs, { role: 'button', tabindex: '0' });
          const group = studentSvgElement('g', attrs);
          group.appendChild(studentSvgElement('rect', { x: record.x - 88, y: record.y - 30, width: 176, height: 60, rx: 14 }));
          const name = studentSvgElement('text', { x: record.x, y: record.y + 1, class: 'node-name' }, record.label);
          group.append(name, studentSvgElement('text', { x: record.x, y: record.y + 21, class: 'node-compartment' }, record.meta));
          if (record.reaction) {
            const open = () => renderStudentReactionDetail(record.reaction, pathwayId, ownReactions.indexOf(record.reaction));
            group.addEventListener('click', open);
            group.addEventListener('keydown', event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); open(); } });
          }
          studentMapNodes.appendChild(group); fitStudentMapText(name, 158, 15, 9.5);
        });

        [
          [0, '1 · 氨基汇聚 · PLP', 335, 80, rx.transfer],
          [1, '2 · GC1 / GC2 · 谷氨酸 + H⁺同向输入基质', 798, 80, rx.carrier],
          [2, '3 · GDH / GLUD · 氧化脱氨', 1210, 80, rx.gdhAkg],
          [3, '4 · 两份氮交给尿素循环', 750, 645, null]
        ].forEach(([stepIndex, value, x, y, reaction]) => {
          const attrs = { x, y, class: 'student-transamination-event', 'data-transamination-event': String(stepIndex + 1), 'data-step-index': String(stepIndex), 'text-anchor': 'middle' };
          if (reaction) Object.assign(attrs, { role: 'button', tabindex: '0' });
          const event = studentSvgElement('text', attrs, value);
          if (reaction) event.addEventListener('click', () => renderStudentReactionDetail(reaction, pathwayId, ownReactions.indexOf(reaction)));
          studentMapNodes.appendChild(event);
        });

        studentMapNodes.appendChild(studentSvgElement('text', { x: 335, y: 375, class: 'student-transamination-equation', 'text-anchor': 'middle' }, '氨基酸 + α-KG ⇌ 对应 α-酮酸 + 谷氨酸'));
        studentMapNodes.appendChild(studentSvgElement('text', { x: 335, y: 400, class: 'student-transamination-plp', 'text-anchor': 'middle' }, 'PLP · 维生素 B₆衍生辅酶 · 不被净消耗'));
        studentMapNodes.appendChild(studentSvgElement('text', { x: 335, y: 425, class: 'student-transamination-warning', 'text-anchor': 'middle' }, '转氨不释放游离 NH₄⁺'));

        [
          [60, 'ALT / GPT', '丙氨酸 ⇌ 丙酮酸', '其余共底物：α-KG ⇌ 谷氨酸'],
          [360, 'AST / GOT', '天冬氨酸 ⇌ 草酰乙酸', '天冬氨酸还提供尿素第 2 份氮']
        ].forEach(([x, title, equation, note]) => {
          const card = studentSvgElement('g', { class: 'student-transamination-example-card' });
          card.appendChild(studentSvgElement('rect', { x, y: 445, width: 260, height: 118, rx: 16 }));
          card.appendChild(studentSvgElement('text', { x: x + 130, y: 478, class: 'example-title', 'text-anchor': 'middle' }, title));
          card.appendChild(studentSvgElement('text', { x: x + 130, y: 510, class: 'example-equation', 'text-anchor': 'middle' }, equation));
          card.appendChild(studentSvgElement('text', { x: x + 130, y: 538, class: 'example-note', 'text-anchor': 'middle' }, note));
          studentMapNodes.appendChild(card);
        });

        studentMapNodes.appendChild(studentSvgElement('text', { x: 1210, y: 305, class: 'student-transamination-gdh', 'text-anchor': 'middle' }, 'NAD(P)⁺ + H₂O → NAD(P)H + H⁺'));
        studentMapNodes.appendChild(studentSvgElement('text', { x: 1210, y: 335, class: 'student-transamination-regulation', 'text-anchor': 'middle' }, '能量状态调节：GTP抑制；ADP / 亮氨酸激活'));
        studentMapNodes.appendChild(studentSvgElement('text', { x: 285, y: 675, class: 'student-transamination-first-n', 'text-anchor': 'middle' }, 'NH₄⁺ → CPS1 · 尿素第 1 份氮'));
        studentMapNodes.appendChild(studentSvgElement('text', { x: 795, y: 675, class: 'student-transamination-second-n', 'text-anchor': 'middle' }, 'AST生成的天冬氨酸 · 尿素第 2 份氮'));
        studentMapNodes.appendChild(studentSvgElement('text', { x: 1210, y: 675, class: 'student-transamination-carbon', 'text-anchor': 'middle' }, 'α-KG 回到 TCA / 转氨受体池'));

        const makeExit = (pathway, x, title, note) => {
          const next = studentSvgElement('g', { class: 'student-map-next-pathway transamination-next-pathway', 'data-next-pathway': pathway, role: 'button', tabindex: '0', 'aria-label': `${title}${note}` });
          next.appendChild(studentSvgElement('rect', { x, y: 800, width: 245, height: 72, rx: 15 }));
          next.appendChild(studentSvgElement('text', { x: x + 122.5, y: 829, class: 'next-label' }, title));
          next.appendChild(studentSvgElement('text', { x: x + 122.5, y: 854, class: 'next-name' }, note));
          const open = () => renderStudentPathway(pathway, { returnToPrimer: false });
          next.addEventListener('click', event => { event.stopPropagation(); open(); });
          next.addEventListener('keydown', event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); open(); } });
          studentMapNodes.appendChild(next);
        };
        makeExit('urea', 805, '两份氮', '进入尿素循环 →');
        makeExit('tca', 1120, 'α-KG', '进入 TCA / 碳骨架 →');
        setStudentReadingStep(pathwayId, 0);
      }

      function renderUreaStudentMap(pathwayId, pathwayReactions, tone) {
        const ownReactions = pathwayReactions.filter(reaction => groupsFor(reaction).includes(pathwayId));
        const byEnzyme = pattern => ownReactions.find(reaction => pattern.test(reaction.enzyme || '')) || null;
        const rx = {
          cps1: byEnzyme(/氨甲酰磷酸合成酶 I/),
          otc: byEnzyme(/鸟氨酸氨甲酰基转移酶/),
          orntCit: ownReactions.find(reaction => /ORNT1/.test(reaction.enzyme || '') && /瓜氨酸@mito-matrix/.test(reaction.from || '')) || byEnzyme(/ORNT1/),
          orntOrn: ownReactions.find(reaction => /ORNT1/.test(reaction.enzyme || '') && /鸟氨酸@cytosol/.test(reaction.from || '')) || byEnzyme(/ORNT1/),
          ass1: byEnzyme(/精氨代琥珀酸合成酶/),
          asl: byEnzyme(/精氨代琥珀酸裂解酶/),
          arg1: byEnzyme(/精氨酸酶/)
        };
        studentPathwayMap.setAttribute('viewBox', '0 0 1500 940');
        studentPathwayMap.dataset.mapLayout = 'urea-two-compartment-cycle';
        studentPathwayMap.setAttribute('aria-label', '尿素循环：线粒体基质装入第一份氮，ORNT1交换鸟氨酸与瓜氨酸，胞质三步装入天冬氨酸的第二份氮并释放尿素，同时再生鸟氨酸');
        studentMapBands.replaceChildren(); studentMapEdges.replaceChildren(); studentMapNodes.replaceChildren();
        studentMapCount.textContent = '5 个核心步骤 · 11 个原始反应 · 2 区室 / 2 载体 / 1 个循环';

        [
          ['matrix-entry', 22, 20, 510, 570, 'urea-matrix-band', '①–② 线粒体基质 · 装入第一份氮'],
          ['inner-membrane-exchange', 548, 20, 260, 570, 'urea-membrane-band', '③ 线粒体内膜 · 两台载体'],
          ['cytosolic-cycle', 824, 20, 654, 570, 'urea-cytosol-band', '④–⑤ 胞质 · 装入第二份氮并释放尿素'],
          ['atom-energy-ledger', 22, 606, 1456, 314, 'urea-ledger-band', '原子来源、能量账与旁路接口']
        ].forEach(([key, x, y, width, height, className, title]) => {
          studentMapBands.appendChild(studentSvgElement('rect', { x, y, width, height, class: `student-map-band ${className}`, 'data-urea-zone': key }));
          studentMapBands.appendChild(studentSvgElement('text', { x: x + 22, y: y + 31, class: 'student-map-band-label' }, title));
        });

        const defs = [
          ['ammonium', 'NH₄⁺', '尿素第 1 份氮', 105, 170, rx.cps1, 0],
          ['bicarbonate', 'HCO₃⁻', '尿素羰基碳', 105, 285, rx.cps1, 0],
          ['nag', 'NAG', 'CPS1 必需激活因子', 105, 455, null, 0],
          ['cps1', 'CPS1', '2 ATP · 基质入口', 295, 235, rx.cps1, 0],
          ['carbamoyl-p', '氨甲酰磷酸', '第一份氮已被固定', 455, 235, rx.cps1, 0],
          ['ornithine-m', '鸟氨酸', '线粒体基质', 295, 405, rx.otc, 1],
          ['otc', 'OTC', '鸟氨酸氨甲酰基转移酶', 455, 405, rx.otc, 1],
          ['citrulline-m', '瓜氨酸', '线粒体基质', 455, 525, rx.orntCit, 2],
          ['ornt1', 'ORNT1', 'SLC25A15 · 反向交换', 678, 300, rx.orntCit, 2],
          ['citrin', 'citrin', 'SLC25A13 · 天冬氨酸输出', 678, 485, null, 3],
          ['citrulline-c', '瓜氨酸', '细胞质', 900, 170, rx.ass1, 3],
          ['aspartate-c', '天冬氨酸', '尿素第 2 份氮', 900, 340, rx.ass1, 3],
          ['ass1', 'ASS1', 'ATP → AMP + PPi', 1070, 255, rx.ass1, 3],
          ['argininosuccinate', '精氨代琥珀酸', '两份氮已汇合', 1235, 255, rx.asl, 3],
          ['asl', 'ASL', '精氨代琥珀酸裂解酶', 1390, 255, rx.asl, 3],
          ['arginine', '精氨酸', '尿素直接前体', 1390, 425, rx.arg1, 4],
          ['fumarate', '延胡索酸', '回到旁路 / TCA', 1235, 515, rx.asl, 3],
          ['arg1', 'ARG1', '精氨酸酶 1', 1120, 425, rx.arg1, 4],
          ['urea', '尿素', '交给血液与肾脏排出', 930, 515, rx.arg1, 4],
          ['ornithine-c', '鸟氨酸', '胞质 · 循环再生', 930, 425, rx.orntOrn, 4]
        ];
        const records = new Map(defs.map(([key, label, meta, x, y, reaction, stepIndex]) => [key, { key, label, meta, x, y, reaction, stepIndex }]));
        const addEdge = (from, to, reaction, path = '', className = '') => {
          const a = records.get(from), b = records.get(to);
          const edge = studentSvgElement('path', {
            d: path || studentMapEdgePath(a, b, 176, 60),
            class: `student-map-edge urea-edge ${className}`.trim(),
            'data-edge-from': from, 'data-edge-to': to, 'data-reaction': reaction?.id || '',
            'data-step-index': String(a.stepIndex)
          });
          if (reaction) {
            const open = () => renderStudentReactionDetail(reaction, pathwayId, ownReactions.indexOf(reaction));
            edge.addEventListener('click', event => { event.stopPropagation(); open(); });
            edge.setAttribute('role', 'button'); edge.tabIndex = 0;
          }
          studentMapEdges.appendChild(edge);
          applyStudentReactionDirection(edge, reaction, { showLabel: Boolean(reaction?.reversible), labelOffsetY: -13 });
        };
        addEdge('ammonium', 'cps1', rx.cps1);
        addEdge('bicarbonate', 'cps1', rx.cps1);
        addEdge('nag', 'cps1', null, 'M 190 455 C 235 420, 270 330, 288 265', 'activation');
        addEdge('cps1', 'carbamoyl-p', rx.cps1);
        addEdge('carbamoyl-p', 'otc', rx.otc, 'M 455 265 L 455 375');
        addEdge('ornithine-m', 'otc', rx.otc);
        addEdge('otc', 'citrulline-m', rx.otc, 'M 455 435 L 455 495');
        addEdge('citrulline-m', 'ornt1', rx.orntCit, 'M 543 525 C 590 500, 640 390, 675 330', 'transport');
        addEdge('ornt1', 'citrulline-c', rx.orntCit, 'M 681 270 C 720 220, 795 180, 812 175', 'transport');
        addEdge('ornithine-c', 'ornt1', rx.orntOrn, 'M 842 425 C 790 400, 730 350, 681 310', 'transport');
        addEdge('ornt1', 'ornithine-m', rx.orntOrn, 'M 675 310 C 600 330, 470 370, 383 400', 'transport');
        addEdge('citrin', 'aspartate-c', null, 'M 766 485 C 810 455, 850 390, 893 370', 'transport');
        addEdge('citrulline-c', 'ass1', rx.ass1);
        addEdge('aspartate-c', 'ass1', rx.ass1);
        addEdge('ass1', 'argininosuccinate', rx.ass1);
        addEdge('argininosuccinate', 'asl', rx.asl);
        addEdge('asl', 'arginine', rx.asl, 'M 1390 285 L 1390 395');
        addEdge('asl', 'fumarate', rx.asl, 'M 1365 280 C 1320 350, 1260 440, 1240 485');
        addEdge('arginine', 'arg1', rx.arg1);
        addEdge('arg1', 'urea', rx.arg1, 'M 1090 445 C 1030 465, 970 495, 948 505');
        addEdge('arg1', 'ornithine-c', rx.arg1);

        records.forEach(record => {
          const attrs = {
            class: 'student-map-node urea-node', style: `--tone:${tone}`,
            'data-map-key': record.key, 'data-reaction': record.reaction?.id || '',
            'data-step-index': String(record.stepIndex)
          };
          if (record.reaction) Object.assign(attrs, { role: 'button', tabindex: '0' });
          const group = studentSvgElement('g', attrs);
          group.appendChild(studentSvgElement('rect', { x: record.x - 86, y: record.y - 30, width: 172, height: 60, rx: 14 }));
          const name = studentSvgElement('text', { x: record.x, y: record.y + 1, class: 'node-name' }, record.label);
          group.append(name, studentSvgElement('text', { x: record.x, y: record.y + 21, class: 'node-compartment' }, record.meta));
          if (record.reaction) {
            const open = () => renderStudentReactionDetail(record.reaction, pathwayId, ownReactions.indexOf(record.reaction));
            group.addEventListener('click', open);
            group.addEventListener('keydown', event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); open(); } });
          }
          studentMapNodes.appendChild(group); fitStudentMapText(name, 154, 15, 9.5);
        });

        [
          [1, '1 · CPS1 固定第一份氮', 295, 78, rx.cps1],
          [2, '2 · OTC 生成瓜氨酸', 455, 350, rx.otc],
          [3, '3 · ORNT1 反向交换', 678, 78, rx.orntCit],
          [4, '4 · ASS1 + ASL 装入第二份氮', 1150, 78, rx.ass1],
          [5, '5 · ARG1 释放尿素并再生鸟氨酸', 1180, 385, rx.arg1]
        ].forEach(([number, value, x, y, reaction]) => {
          const attrs = { x, y, class: 'student-urea-event', 'data-urea-step': String(number), 'data-step-index': String(number - 1), 'text-anchor': 'middle', role: 'button', tabindex: '0' };
          const event = studentSvgElement('text', attrs, value);
          event.addEventListener('click', () => renderStudentReactionDetail(reaction, pathwayId, ownReactions.indexOf(reaction)));
          studentMapNodes.appendChild(event);
        });

        studentMapNodes.appendChild(studentSvgElement('text', { x: 210, y: 525, class: 'student-urea-activation', 'text-anchor': 'middle' }, 'NAGS → NAG'));
        studentMapNodes.appendChild(studentSvgElement('text', { x: 295, y: 320, class: 'student-urea-equation', 'text-anchor': 'middle' }, 'NH₄⁺ + HCO₃⁻ + 2 ATP'));
        studentMapNodes.appendChild(studentSvgElement('text', { x: 295, y: 345, class: 'student-urea-activation', 'text-anchor': 'middle' }, 'NAG · CPS1 必需激活因子'));
        studentMapNodes.appendChild(studentSvgElement('text', { x: 678, y: 355, class: 'student-urea-transport', 'text-anchor': 'middle' }, 'ORNT1 / SLC25A15'));
        studentMapNodes.appendChild(studentSvgElement('text', { x: 678, y: 382, class: 'student-urea-exchange', 'text-anchor': 'middle' }, '鸟氨酸入基质 · 瓜氨酸出胞质'));
        studentMapNodes.appendChild(studentSvgElement('text', { x: 678, y: 540, class: 'student-urea-transport', 'text-anchor': 'middle' }, 'citrin / SLC25A13'));
        studentMapNodes.appendChild(studentSvgElement('text', { x: 678, y: 565, class: 'student-urea-exchange', 'text-anchor': 'middle' }, '天冬氨酸出基质'));
        studentMapNodes.appendChild(studentSvgElement('text', { x: 1070, y: 325, class: 'student-urea-energy', 'text-anchor': 'middle' }, 'ASS1 · ATP → AMP + PPi'));
        studentMapNodes.appendChild(studentSvgElement('text', { x: 1180, y: 475, class: 'student-urea-regeneration', 'text-anchor': 'middle' }, '尿素 + 鸟氨酸 · 鸟氨酸循环再生'));

        [
          [45, 655, 270, '第 1 份氮：NH₄⁺', 'CPS1 装入'],
          [335, 655, 270, '第 2 份氮：天冬氨酸', 'ASS1 装入'],
          [625, 655, 250, '羰基碳：HCO₃⁻', 'CPS1 装入'],
          [895, 655, 275, '3 ATP · 4 个高能磷酸键', 'CPS1: 2 ATP；ASS1: ATP→AMP'],
          [1190, 655, 265, '天冬氨酸—精氨代琥珀酸旁路', '延胡索酸 → 苹果酸 → OAA → 天冬氨酸']
        ].forEach(([x, y, width, title, note]) => {
          const card = studentSvgElement('g', { class: 'student-urea-ledger-card' });
          card.appendChild(studentSvgElement('rect', { x, y, width, height: 112, rx: 16 }));
          card.appendChild(studentSvgElement('text', { x: x + width / 2, y: y + 40, class: 'ledger-title', 'text-anchor': 'middle' }, title));
          card.appendChild(studentSvgElement('text', { x: x + width / 2, y: y + 76, class: 'ledger-note', 'text-anchor': 'middle' }, note));
          studentMapNodes.appendChild(card);
        });

        const makeExit = (pathway, x, title, note) => {
          const next = studentSvgElement('g', { class: 'student-map-next-pathway urea-next-pathway', 'data-next-pathway': pathway, role: 'button', tabindex: '0', 'aria-label': `${title}${note}` });
          next.appendChild(studentSvgElement('rect', { x, y: 805, width: 260, height: 76, rx: 15 }));
          next.appendChild(studentSvgElement('text', { x: x + 130, y: 835, class: 'next-label' }, title));
          next.appendChild(studentSvgElement('text', { x: x + 130, y: 862, class: 'next-name' }, note));
          const open = () => renderStudentPathway(pathway, { returnToPrimer: false });
          next.addEventListener('click', event => { event.stopPropagation(); open(); });
          next.addEventListener('keydown', event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); open(); } });
          studentMapNodes.appendChild(next);
        };
        makeExit('transamination', 895, '氮从哪里来', '返回转氨 / 氧化脱氨 →');
        makeExit('tca', 1190, '延胡索酸旁路', '进入 TCA 接口 →');
        setStudentReadingStep(pathwayId, 0);
      }

      function renderAaCarbonStudentMap(pathwayId, pathwayReactions, tone) {
        const ownReactions = pathwayReactions.filter(reaction => groupsFor(reaction).includes(pathwayId));
        const rx = {
          pyruvate: ownReactions[0] || null,
          acetyl: ownReactions[1] || null,
          acetoacetate: ownReactions[2] || null,
          akg: ownReactions[3] || null,
          succinyl: ownReactions[4] || null,
          fumarate: ownReactions[5] || null,
          oaa: ownReactions[6] || null
        };
        studentPathwayMap.setAttribute('viewBox', '0 0 1500 980');
        studentPathwayMap.dataset.mapLayout = 'aa-carbon-seven-gateways';
        studentPathwayMap.setAttribute('aria-label', '氨基酸去氮后经不同多步分解路径汇入七类中央代谢入口；五类入口生糖，两类入口生酮，亮氨酸和赖氨酸为纯生酮氨基酸');
        studentMapBands.replaceChildren(); studentMapEdges.replaceChildren(); studentMapNodes.replaceChildren();
        studentMapCount.textContent = '7 类中央代谢入口 · 7 个原始分类记录 · 3 类代谢命运';

        [
          ['nitrogen-handoff', 22, 20, 302, 585, 'aa-carbon-nitrogen-band', '① 去氮 · 氮与碳分流'],
          ['seven-gateways', 340, 20, 744, 585, 'aa-carbon-gateway-band', '② 七类中央代谢入口 · 不同多步路径'],
          ['metabolic-fates', 1100, 20, 378, 585, 'aa-carbon-fate-band', '③ 中央代谢命运'],
          ['classification-ledger', 22, 621, 1456, 337, 'aa-carbon-ledger-band', '分类账与边界 · 先判入口，再判生糖 / 生酮']
        ].forEach(([key, x, y, width, height, className, title]) => {
          studentMapBands.appendChild(studentSvgElement('rect', { x, y, width, height, class: `student-map-band ${className}`, 'data-aa-carbon-zone': key }));
          studentMapBands.appendChild(studentSvgElement('text', { x: x + 22, y: y + 31, class: 'student-map-band-label' }, title));
        });

        const addNode = ({ key, label, meta, x, y, width = 240, reaction = null, stepIndex = 0, className = '', entry = '' }) => {
          const attrs = {
            class: `student-map-node aa-carbon-node ${className}`.trim(), style: `--tone:${tone}`,
            'data-map-key': key, 'data-reaction': reaction?.id || '', 'data-step-index': String(stepIndex)
          };
          if (entry) attrs['data-aa-carbon-entry'] = entry;
          if (reaction) Object.assign(attrs, { role: 'button', tabindex: '0' });
          const group = studentSvgElement('g', attrs);
          group.appendChild(studentSvgElement('rect', { x: x - width / 2, y: y - 38, width, height: 76, rx: 15 }));
          const name = studentSvgElement('text', { x, y: y - 5, class: 'node-name' }, label);
          const detail = studentSvgElement('text', { x, y: y + 20, class: 'node-compartment' }, meta);
          group.append(name, detail);
          fitStudentMapText(name, width - 24, 15.5, 9.5);
          fitStudentMapText(detail, width - 20, 12.5, 8.5);
          if (reaction) {
            const open = () => renderStudentReactionDetail(reaction, pathwayId, ownReactions.indexOf(reaction));
            group.addEventListener('click', open);
            group.addEventListener('keydown', event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); open(); } });
          }
          studentMapNodes.appendChild(group);
          return { key, x, y, width };
        };

        const source = addNode({ key: 'amino-pool', label: '20 种蛋白质氨基酸', meta: '先处理氨基，再利用碳骨架', x: 173, y: 130, width: 246 });
        const nitrogen = addNode({ key: 'nitrogen', label: '转氨 / 脱氨', meta: '氮 → 尿素循环', x: 173, y: 265, width: 246 });
        const carbon = addNode({ key: 'carbon-skeleton', label: 'α-酮酸与其他碳骨架', meta: '不是一种统一底物', x: 173, y: 400, width: 246 });
        const routing = addNode({ key: 'multi-route', label: '不同多步分解路径', meta: '区室依具体路径而异', x: 173, y: 535, width: 246 });

        const gateways = [
          addNode({ key: 'pyruvate', label: '丙酮酸', meta: '丙氨酸 · 半胱氨酸 · 甘氨酸 · 丝氨酸 · 苏氨酸 · 色氨酸', x: 525, y: 130, width: 322, reaction: rx.pyruvate, stepIndex: 0, className: 'is-glucogenic', entry: '1' }),
          addNode({ key: 'akg', label: 'α-酮戊二酸', meta: '精氨酸 · 谷氨酸 · 谷氨酰胺 · 组氨酸 · 脯氨酸', x: 895, y: 130, width: 322, reaction: rx.akg, stepIndex: 3, className: 'is-glucogenic', entry: '4' }),
          addNode({ key: 'succinyl', label: '琥珀酰-CoA', meta: '异亮氨酸 · 蛋氨酸 · 苏氨酸 · 缬氨酸', x: 525, y: 265, width: 322, reaction: rx.succinyl, stepIndex: 4, className: 'is-glucogenic', entry: '5' }),
          addNode({ key: 'fumarate', label: '延胡索酸', meta: '苯丙氨酸 · 酪氨酸', x: 895, y: 265, width: 322, reaction: rx.fumarate, stepIndex: 5, className: 'is-dual', entry: '6' }),
          addNode({ key: 'oaa', label: '草酰乙酸', meta: '天冬氨酸 · 天冬酰胺', x: 525, y: 400, width: 322, reaction: rx.oaa, stepIndex: 6, className: 'is-glucogenic', entry: '7' }),
          addNode({ key: 'acetyl', label: '乙酰-CoA', meta: '亮氨酸 · 异亮氨酸 · 苏氨酸 · 色氨酸等', x: 895, y: 400, width: 322, reaction: rx.acetyl, stepIndex: 1, className: 'is-ketogenic', entry: '2' }),
          addNode({ key: 'acetoacetate', label: '乙酰乙酸 / 乙酰乙酰-CoA', meta: '亮氨酸 · 赖氨酸 · 苯丙氨酸 · 酪氨酸 · 色氨酸', x: 710, y: 535, width: 430, reaction: rx.acetoacetate, stepIndex: 2, className: 'is-ketogenic', entry: '3' })
        ];

        const glucogenic = addNode({ key: 'glucose-fate', label: '生糖入口', meta: '丙酮酸 + 4 个 TCA 中间体', x: 1289, y: 150, width: 310, className: 'is-glucogenic' });
        const oxidation = addNode({ key: 'oxidation-fate', label: '氧化供能 / 补充 TCA', meta: '实际流向依组织与代谢状态', x: 1289, y: 305, width: 310, className: 'is-oxidative' });
        const ketogenic = addNode({ key: 'ketone-fate', label: '生酮入口', meta: '乙酰-CoA + 乙酰乙酸方向', x: 1289, y: 460, width: 310, className: 'is-ketogenic' });

        const edge = (from, to, className = '') => studentMapEdges.appendChild(studentSvgElement('path', {
          d: `M ${from.x + Math.min(from.width / 2, 150)} ${from.y} C ${(from.x + to.x) / 2} ${from.y}, ${(from.x + to.x) / 2} ${to.y}, ${to.x - Math.min(to.width / 2, 150)} ${to.y}`,
          class: `student-map-edge aa-carbon-edge ${className}`.trim()
        }));
        studentMapEdges.appendChild(studentSvgElement('path', { d: 'M 173 168 L 173 227', class: 'student-map-edge aa-carbon-edge nitrogen-route' }));
        studentMapEdges.appendChild(studentSvgElement('path', { d: 'M 173 303 L 173 362', class: 'student-map-edge aa-carbon-edge' }));
        studentMapEdges.appendChild(studentSvgElement('path', { d: 'M 173 438 L 173 497', class: 'student-map-edge aa-carbon-edge' }));
        gateways.forEach(gateway => edge(routing, gateway, gateway.key === 'acetyl' || gateway.key === 'acetoacetate' ? 'ketogenic-route' : 'glucogenic-route'));
        gateways.slice(0, 5).forEach(gateway => edge(gateway, glucogenic, 'glucogenic-route'));
        gateways.forEach(gateway => edge(gateway, oxidation, 'oxidative-route'));
        gateways.slice(5).forEach(gateway => edge(gateway, ketogenic, 'ketogenic-route'));

        [
          [45, 672, 330, '生糖入口：丙酮酸 + 4 个 TCA 中间体', '可形成糖异生前体'],
          [393, 672, 310, '生酮入口：乙酰-CoA + 乙酰乙酸方向', '乙酰-CoA不能净生糖'],
          [721, 672, 300, '纯生酮：亮氨酸 · 赖氨酸', '只有这 2 种'],
          [1039, 672, 394, '兼具两类：异亮氨酸 · 苯丙氨酸 · 苏氨酸 · 色氨酸 · 酪氨酸', '同时有生糖与生酮产物']
        ].forEach(([x, y, width, title, note], index) => {
          const card = studentSvgElement('g', { class: `student-map-node aa-carbon-node aa-carbon-ledger-card ledger-${index + 1}` });
          card.appendChild(studentSvgElement('rect', { x, y, width, height: 108, rx: 16 }));
          const titleText = studentSvgElement('text', { x: x + width / 2, y: y + 42, class: 'ledger-title', 'text-anchor': 'middle' }, title);
          const noteText = studentSvgElement('text', { x: x + width / 2, y: y + 76, class: 'ledger-note', 'text-anchor': 'middle' }, note);
          card.append(titleText, noteText); studentMapNodes.appendChild(card);
          fitStudentMapText(titleText, width - 26, 14, 8.5); fitStudentMapText(noteText, width - 26, 12, 8.5);
        });
        studentMapNodes.appendChild(studentSvgElement('text', { x: 750, y: 817, class: 'student-aa-carbon-boundary', 'text-anchor': 'middle' }, '分类映射，不是单一反应或统一计量 · 所有入口都可参与氧化，但只有五类入口可净生糖'));

        const makeExit = (pathway, x, title, note) => {
          const next = studentSvgElement('g', { class: 'student-map-next-pathway aa-carbon-next-pathway', 'data-next-pathway': pathway, role: 'button', tabindex: '0', 'aria-label': `${title}${note}` });
          next.appendChild(studentSvgElement('rect', { x, y: 850, width: 330, height: 76, rx: 15 }));
          next.appendChild(studentSvgElement('text', { x: x + 165, y: 880, class: 'next-label' }, title));
          next.appendChild(studentSvgElement('text', { x: x + 165, y: 907, class: 'next-name' }, note));
          const open = () => renderStudentPathway(pathway, { returnToPrimer: false });
          next.addEventListener('click', event => { event.stopPropagation(); open(); });
          next.addEventListener('keydown', event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); open(); } });
          studentMapNodes.appendChild(next);
        };
        makeExit('transamination', 45, '氮与碳怎样分开', '转氨 / 氧化脱氨 →');
        makeExit('tca', 393, '五类入口怎样供能', '进入 TCA →');
        makeExit('gluconeogenesis', 741, '生糖入口怎样产糖', '进入糖异生 →');
        makeExit('ketone', 1089, '生酮入口怎样利用', '进入酮体代谢 →');
        setStudentReadingStep(pathwayId, 0);
      }

      function renderPurineStudentMap(pathwayId, pathwayReactions, tone) {
        const ownReactions = pathwayReactions.filter(reaction => groupsFor(reaction).includes(pathwayId));
        studentPathwayMap.setAttribute('viewBox', '0 0 1600 1050');
        studentPathwayMap.dataset.mapLayout = 'purine-imp-two-branch';
        studentPathwayMap.setAttribute('aria-label', '嘌呤核苷酸从头合成：核糖-5-磷酸活化为PRPP，六个酶完成十步形成IMP，再分别以GTP或ATP驱动AMP与GMP分支');
        studentMapBands.replaceChildren(); studentMapEdges.replaceChildren(); studentMapNodes.replaceChildren();
        studentMapCount.textContent = '10 步成 IMP · 2 个核苷酸分支 · 9 个原始反应记录';

        [
          ['prpp-entry', 22, 20, 298, 560, 'purine-entry-band', '① PRPP入口 · 第一承诺步骤'],
          ['imp-assembly', 336, 20, 832, 560, 'purine-assembly-band', '② 六个酶 · 十步逐片搭建 IMP'],
          ['amp-gmp-branch', 1184, 20, 394, 560, 'purine-branch-band', '③ IMP共同分叉 · AMP / GMP'],
          ['atom-energy-regulation', 22, 596, 1556, 432, 'purine-ledger-band', '④ 原子来源、能量、反馈与补救边界']
        ].forEach(([key, x, y, width, height, className, title]) => {
          studentMapBands.appendChild(studentSvgElement('rect', { x, y, width, height, class: `student-map-band ${className}`, 'data-purine-zone': key }));
          studentMapBands.appendChild(studentSvgElement('text', { x: x + 22, y: y + 31, class: 'student-map-band-label' }, title));
        });

        const records = new Map();
        const addNode = ({ key, label, title = '', meta, x, y, width = 240, reaction = null, step = 0, className = '' }) => {
          const attrs = {
            class: `student-map-node purine-node ${className}`.trim(), style: `--tone:${tone}`,
            'data-map-key': key, 'data-reaction': reaction?.id || '', 'data-step-index': String(Math.max(0, step - 1))
          };
          if (step) attrs['data-purine-step'] = String(step);
          if (reaction) Object.assign(attrs, { role: 'button', tabindex: '0' });
          const accessibleName = title ? `${title}（${label}）` : label;
          attrs['aria-label'] = `${accessibleName}，${meta}`;
          const group = studentSvgElement('g', attrs);
          group.appendChild(studentSvgElement('title', {}, `${accessibleName} · ${meta}`));
          group.appendChild(studentSvgElement('rect', { x: x - width / 2, y: y - 37, width, height: 74, rx: 15 }));
          const name = studentSvgElement('text', { x, y: y - 5, class: 'node-name' }, label);
          const detail = studentSvgElement('text', { x, y: y + 20, class: 'node-compartment' }, meta);
          group.append(name, detail); fitStudentMapText(name, width - 24, 15.5, 9.5); fitStudentMapText(detail, width - 20, 12, 8.3);
          if (reaction) {
            const open = () => renderStudentReactionDetail(reaction, pathwayId, ownReactions.indexOf(reaction));
            group.addEventListener('click', open);
            group.addEventListener('keydown', event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); open(); } });
          }
          studentMapNodes.appendChild(group);
          const record = { key, x, y, width, reaction, step };
          records.set(key, record); return record;
        };
        const reactionAt = index => ownReactions[index] || null;

        addNode({ key: 'r5p', label: 'R5P · 核糖-5-磷酸', meta: '来自磷酸戊糖途径', x: 171, y: 115, width: 246, reaction: reactionAt(0) });
        addNode({ key: 'prpp-synthetase', label: 'PRPP synthetase', meta: 'R5P + ATP → PRPP + AMP', x: 171, y: 245, width: 246, reaction: reactionAt(0) });
        addNode({ key: 'prpp', label: 'PRPP', meta: '活化核糖骨架', x: 171, y: 375, width: 246, reaction: reactionAt(1) });
        addNode({ key: 'ppat', label: 'PPAT · 第一承诺步骤', meta: 'Gln → Glu + PPi', x: 171, y: 505, width: 246, reaction: reactionAt(1) });

        const impSteps = [
          ['pra', '5-PRA', '5-磷酸核糖胺', '1 · PPAT', 505, 112, reactionAt(1), 1],
          ['gar', 'GAR', '甘氨酰胺核糖核苷酸', '2 · GART · GAR synthetase', 995, 112, reactionAt(2), 2],
          ['fgar', 'FGAR', 'N¹⁰-甲酰-GAR', '3 · GART · GAR transformylase', 995, 210, reactionAt(3), 3],
          ['fgam', 'FGAM', '甲酰甘氨脒核糖核苷酸', '4 · PFAS · FGAM synthetase', 505, 210, reactionAt(3), 4],
          ['air', 'AIR', '5-氨基咪唑核糖核苷酸', '5 · GART · AIR synthetase', 505, 308, reactionAt(3), 5],
          ['cair', 'CAIR', '5-氨基咪唑-4-羧酸核糖核苷酸', '6 · PAICS · AIR carboxylase', 995, 308, reactionAt(3), 6],
          ['saicar', 'SAICAR', '琥珀酰-AICAR', '7 · PAICS · SAICAR synthetase', 995, 406, reactionAt(3), 7],
          ['aicar', 'AICAR', '5-氨基咪唑-4-甲酰胺核糖核苷酸', '8 · ADSL · SAICAR lyase', 505, 406, reactionAt(3), 8],
          ['faicar', 'FAICAR', '5-甲酰氨基咪唑-4-甲酰胺核糖核苷酸', '9 · ATIC · AICAR transformylase', 505, 504, reactionAt(4), 9],
          ['imp', 'IMP', '次黄嘌呤核苷酸', '10 · ATIC · IMP cyclohydrolase', 995, 504, reactionAt(4), 10]
        ];
        impSteps.forEach(([key, label, title, meta, x, y, reaction, step]) => addNode({ key, label, title, meta, x, y, width: 320, reaction, step, className: 'purine-imp-node' }));

        addNode({ key: 'branch-imp', label: 'IMP · AMP / GMP共同分叉', meta: '两条分支交叉使用 GTP / ATP', x: 1381, y: 110, width: 330, reaction: reactionAt(5) });
        addNode({ key: 'adenylosuccinate', label: '腺苷代琥珀酸', meta: 'ADSS · Asp + GTP', x: 1280, y: 270, width: 182, reaction: reactionAt(5), className: 'is-amp' });
        addNode({ key: 'amp', label: 'AMP', meta: 'ADSL · AMP + 延胡索酸', x: 1280, y: 455, width: 182, reaction: reactionAt(5), className: 'is-amp' });
        addNode({ key: 'xmp', label: 'XMP', meta: 'IMPDH · NAD⁺ → NADH', x: 1482, y: 270, width: 182, reaction: reactionAt(6), className: 'is-gmp' });
        addNode({ key: 'gmp', label: 'GMP', meta: 'GMPS · Gln + ATP → AMP + PPi', x: 1482, y: 455, width: 182, reaction: reactionAt(6), className: 'is-gmp' });

        const addEdge = (fromKey, toKey, className = '', path = '') => {
          const from = records.get(fromKey), to = records.get(toKey);
          if (!from || !to) return;
          const edge = studentSvgElement('path', {
            d: path || studentMapEdgePath(from, to, Math.min(from.width, 220), 74),
            class: `student-map-edge purine-edge ${className}`.trim(),
            'data-edge-from': fromKey, 'data-edge-to': toKey
          });
          studentMapEdges.appendChild(edge);
        };
        addEdge('r5p', 'prpp-synthetase'); addEdge('prpp-synthetase', 'prpp'); addEdge('prpp', 'ppat');
        addEdge('ppat', 'pra', 'commitment', 'M 294 505 C 350 505, 390 150, 345 112');
        for (let index = 0; index < impSteps.length - 1; index += 1) addEdge(impSteps[index][0], impSteps[index + 1][0], 'imp-route');
        addEdge('imp', 'branch-imp', 'branch-route');
        addEdge('branch-imp', 'adenylosuccinate', 'amp-route'); addEdge('adenylosuccinate', 'amp', 'amp-route');
        addEdge('branch-imp', 'xmp', 'gmp-route'); addEdge('xmp', 'gmp', 'gmp-route');

        [
          [44, 648, 286, 'N3/N9：谷氨酰胺', '两次提供酰胺氮'],
          [350, 648, 286, 'C4/C5/N7：甘氨酸', '整段并入嘌呤环'],
          [656, 648, 286, 'C2/C8：10-甲酰-THF', '两次提供一碳单位'],
          [962, 648, 286, 'C6：CO₂', 'PAICS 羧化步骤'],
          [1268, 648, 286, 'N1：天冬氨酸', '随后释放延胡索酸']
        ].forEach(([x, y, width, title, note]) => {
          const card = studentSvgElement('g', { class: 'student-map-node purine-node purine-ledger-card' });
          card.appendChild(studentSvgElement('rect', { x, y, width, height: 106, rx: 16 }));
          const titleText = studentSvgElement('text', { x: x + width / 2, y: y + 40, class: 'ledger-title', 'text-anchor': 'middle' }, title);
          const noteText = studentSvgElement('text', { x: x + width / 2, y: y + 75, class: 'ledger-note', 'text-anchor': 'middle' }, note);
          card.append(titleText, noteText); studentMapNodes.appendChild(card);
          fitStudentMapText(titleText, width - 24, 14, 8.5); fitStudentMapText(noteText, width - 24, 11.5, 8.2);
        });

        [
          [44, 780, 480, '从 R5P 到 IMP：5 个 ATP分子', 'PRPP: ATP→AMP；其余四步 ATP→ADP'],
          [542, 780, 490, 'AMP分支用 GTP · GMP分支用 ATP', '交叉供能帮助平衡两类核苷酸池'],
          [1050, 780, 504, 'AMP抑制 ADSS · GMP抑制 IMPDH', 'IMP / AMP / GMP反馈上游 PPAT']
        ].forEach(([x, y, width, title, note]) => {
          const card = studentSvgElement('g', { class: 'student-map-node purine-node purine-regulation-card' });
          card.appendChild(studentSvgElement('rect', { x, y, width, height: 100, rx: 16 }));
          const titleText = studentSvgElement('text', { x: x + width / 2, y: y + 38, class: 'reg-title', 'text-anchor': 'middle' }, title);
          const noteText = studentSvgElement('text', { x: x + width / 2, y: y + 71, class: 'reg-note', 'text-anchor': 'middle' }, note);
          card.append(titleText, noteText); studentMapNodes.appendChild(card);
          fitStudentMapText(titleText, width - 24, 14, 8.5); fitStudentMapText(noteText, width - 24, 11.5, 8.2);
        });
        studentMapNodes.appendChild(studentSvgElement('text', { x: 800, y: 904, class: 'student-purine-salvage', 'text-anchor': 'middle' }, 'APRT / HGPRT · 补救合成使用 PRPP · 补救合成不属于十步从头主干'));

        const makeExit = (pathway, x, title, note) => {
          const next = studentSvgElement('g', { class: 'student-map-next-pathway purine-next-pathway', 'data-next-pathway': pathway, role: 'button', tabindex: '0', 'aria-label': `${title}${note}` });
          next.appendChild(studentSvgElement('rect', { x, y: 934, width: 410, height: 72, rx: 15 }));
          next.appendChild(studentSvgElement('text', { x: x + 205, y: 963, class: 'next-label' }, title));
          next.appendChild(studentSvgElement('text', { x: x + 205, y: 989, class: 'next-name' }, note));
          const open = () => renderStudentPathway(pathway, { returnToPrimer: false });
          next.addEventListener('click', event => { event.stopPropagation(); open(); });
          next.addEventListener('keydown', event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); open(); } });
          studentMapNodes.appendChild(next);
        };
        makeExit('ppp', 340, '核糖骨架从哪里来', '返回磷酸戊糖途径 →');
        makeExit('nucleotide_degradation', 850, '碱基怎样回收', '进入降解与补救合成 →');
        setStudentReadingStep(pathwayId, 0);
      }

      function renderPyrimidineStudentMap(pathwayId, pathwayReactions, tone) {
        const ownReactions = pathwayReactions.filter(reaction => groupsFor(reaction).includes(pathwayId));
        studentPathwayMap.setAttribute('viewBox', '0 0 1600 1120');
        studentPathwayMap.dataset.mapLayout = 'pyrimidine-ring-first-branch';
        studentPathwayMap.setAttribute('aria-label', '嘧啶从头合成：CAD先在胞质组装嘧啶环，DHODH在线粒体内膜以辅酶Q氧化，UMPS再把乳清酸接到PRPP形成UMP，随后分流为RNA和DNA前体');
        studentMapBands.replaceChildren(); studentMapEdges.replaceChildren(); studentMapNodes.replaceChildren();
        studentMapCount.textContent = '6 步成 UMP · 2 条核苷酸分支 · 11 个原始反应记录';

        [
          ['cad-ring', 22, 20, 558, 370, 'pyrimidine-cad-band', '① 胞质 CAD · 三步先造嘧啶环'],
          ['dhodh-interface', 596, 20, 310, 370, 'pyrimidine-dhodh-band', '② 线粒体内膜外侧 · DHODH 接 CoQ'],
          ['umps-ump', 922, 20, 656, 370, 'pyrimidine-umps-band', '③ 回到胞质 · UMPS 两步接上 PRPP'],
          ['rna-dna-branch', 22, 408, 1556, 408, 'pyrimidine-branch-band', '④ UMP 共同入口 · RNA / DNA 双分支'],
          ['atom-energy-regulation', 22, 834, 1556, 264, 'pyrimidine-ledger-band', '⑤ 原子来源、能量、反馈与旁路边界']
        ].forEach(([key, x, y, width, height, className, title]) => {
          studentMapBands.appendChild(studentSvgElement('rect', { x, y, width, height, class: `student-map-band ${className}`, 'data-pyrimidine-zone': key }));
          studentMapBands.appendChild(studentSvgElement('text', { x: x + 22, y: y + 31, class: 'student-map-band-label' }, title));
        });

        const records = new Map();
        const addNode = ({ key, label, meta, x, y, width = 210, height = 72, reaction = null, step = 0, className = '' }) => {
          const attrs = {
            class: `student-map-node pyrimidine-node ${className}`.trim(), style: `--tone:${tone}`,
            'data-map-key': key, 'data-reaction': reaction?.id || '', 'data-step-index': String(Math.max(0, step - 1)),
            'aria-label': `${label}，${meta}`
          };
          if (step) attrs['data-pyrimidine-step'] = String(step);
          if (reaction) Object.assign(attrs, { role: 'button', tabindex: '0' });
          const group = studentSvgElement('g', attrs);
          group.appendChild(studentSvgElement('title', {}, `${label} · ${meta}`));
          group.appendChild(studentSvgElement('rect', { x: x - width / 2, y: y - height / 2, width, height, rx: 15 }));
          const name = studentSvgElement('text', { x, y: y - 4, class: 'node-name' }, label);
          const detail = studentSvgElement('text', { x, y: y + 21, class: 'node-compartment' }, meta);
          group.append(name, detail); fitStudentMapText(name, width - 22, 15.5, 9.2); fitStudentMapText(detail, width - 18, 11.8, 8.1);
          if (reaction) {
            const open = () => renderStudentReactionDetail(reaction, pathwayId, ownReactions.indexOf(reaction));
            group.addEventListener('click', open);
            group.addEventListener('keydown', event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); open(); } });
          }
          studentMapNodes.appendChild(group);
          const record = { key, x, y, width, height, reaction, step };
          records.set(key, record); return record;
        };
        const reactionAt = index => ownReactions[index] || null;
        const addEdge = (fromKey, toKey, className = '', path = '') => {
          const from = records.get(fromKey), to = records.get(toKey);
          if (!from || !to) return;
          studentMapEdges.appendChild(studentSvgElement('path', {
            d: path || studentMapEdgePath(from, to, Math.min(from.width, 190), Math.min(from.height, 72)),
            class: `student-map-edge pyrimidine-edge ${className}`.trim(),
            'data-edge-from': fromKey, 'data-edge-to': toKey
          }));
        };

        addNode({ key: 'carbamoyl-phosphate', label: '氨甲酰磷酸', meta: '1 · CAD · CPS II', x: 118, y: 150, width: 174, reaction: reactionAt(0), step: 1, className: 'is-cad' });
        addNode({ key: 'carbamoyl-aspartate', label: '氨甲酰天冬氨酸', meta: '2 · CAD · ATCase', x: 302, y: 150, width: 190, reaction: reactionAt(1), step: 2, className: 'is-cad' });
        addNode({ key: 'dihydroorotate', label: '二氢乳清酸', meta: '3 · CAD · DHOase', x: 492, y: 150, width: 170, reaction: reactionAt(2), step: 3, className: 'is-cad' });
        addNode({ key: 'orotate', label: '乳清酸', meta: '4 · DHODH · FMN', x: 752, y: 150, width: 180, reaction: reactionAt(3), step: 4, className: 'is-dhodh' });
        addNode({ key: 'omp', label: 'OMP', meta: '5 · UMPS · OPRTase', x: 1090, y: 150, width: 205, reaction: reactionAt(4), step: 5, className: 'is-umps' });
        addNode({ key: 'ump', label: 'UMP', meta: '6 · UMPS · OMP decarboxylase', x: 1420, y: 150, width: 244, reaction: reactionAt(4), step: 6, className: 'is-umps' });

        addNode({ key: 'cad-input', label: 'Gln + HCO₃⁻ + 2 ATP', meta: '形成氨甲酰磷酸', x: 118, y: 300, width: 220, className: 'pyrimidine-input-card' });
        addNode({ key: 'aspartate-input', label: '天冬氨酸', meta: '加入 N1 / C4 / C5 / C6', x: 302, y: 300, width: 210, className: 'pyrimidine-input-card' });
        addNode({ key: 'coq-redox', label: 'CoQ → CoQH₂', meta: '不使用 NAD⁺', x: 752, y: 300, width: 210, className: 'pyrimidine-redox-card' });
        addNode({ key: 'prpp-input', label: '乳清酸 + PRPP → OMP + PPi', meta: '环先合成，再接 PRPP', x: 1090, y: 300, width: 290, className: 'pyrimidine-input-card' });
        addNode({ key: 'co2-output', label: 'OMP → UMP + CO₂', meta: 'UMPS 脱羧活性', x: 1420, y: 300, width: 230, className: 'pyrimidine-output-card' });

        addEdge('carbamoyl-phosphate', 'carbamoyl-aspartate', 'cad-route');
        addEdge('carbamoyl-aspartate', 'dihydroorotate', 'cad-route');
        addEdge('dihydroorotate', 'orotate', 'dhodh-route');
        addEdge('orotate', 'omp', 'umps-route');
        addEdge('omp', 'ump', 'umps-route');
        addEdge('cad-input', 'carbamoyl-phosphate', 'input-route');
        addEdge('aspartate-input', 'carbamoyl-aspartate', 'input-route');
        addEdge('coq-redox', 'orotate', 'redox-route');
        addEdge('prpp-input', 'omp', 'input-route');

        addNode({ key: 'udp', label: 'UDP', meta: 'UMP-CMP kinase', x: 300, y: 520, width: 170, reaction: reactionAt(5), className: 'is-rna' });
        addNode({ key: 'utp', label: 'UTP', meta: 'NDPK · ATP→ADP', x: 520, y: 520, width: 170, reaction: reactionAt(5), className: 'is-rna' });
        addNode({ key: 'ctp', label: 'CTP', meta: 'CTPS · Gln + ATP', x: 760, y: 520, width: 190, reaction: reactionAt(6), className: 'is-rna' });
        addNode({ key: 'dudp', label: 'dUDP', meta: 'RNR · thioredoxin(red)', x: 300, y: 690, width: 205, reaction: reactionAt(7), className: 'is-dna' });
        addNode({ key: 'dutp', label: 'dUTP', meta: 'NDPK', x: 520, y: 690, width: 170, reaction: reactionAt(8), className: 'is-dna' });
        addNode({ key: 'dump', label: 'dUMP', meta: 'DUT · dUTPase', x: 760, y: 690, width: 190, reaction: reactionAt(9), className: 'is-dna' });
        addNode({ key: 'dtmp', label: 'dTMP', meta: 'TYMS · 5,10-亚甲基-THF', x: 1020, y: 690, width: 235, reaction: reactionAt(10), className: 'is-dna' });
        addNode({ key: 'dhf', label: 'DHF', meta: 'TYMS 的一碳输出', x: 1020, y: 520, width: 190, className: 'pyrimidine-folate-card' });
        addNode({ key: 'dttp', label: 'dTTP', meta: 'TMPK + NDPK', x: 1320, y: 690, width: 190, className: 'is-dna' });

        addEdge('ump', 'udp', 'rna-route', 'M 1420 186 C 1290 430, 530 430, 300 484');
        addEdge('udp', 'utp', 'rna-route'); addEdge('utp', 'ctp', 'rna-route');
        addEdge('udp', 'dudp', 'dna-route'); addEdge('dudp', 'dutp', 'dna-route');
        addEdge('dutp', 'dump', 'dna-route'); addEdge('dump', 'dtmp', 'dna-route'); addEdge('dtmp', 'dttp', 'dna-route');
        addEdge('dtmp', 'dhf', 'folate-route');

        [
          ['atom-gln', 'N3：谷氨酰胺', '提供酰胺氮', 155, 900, 220, 'pyrimidine-ledger-card'],
          ['atom-carbon', 'C2：HCO₃⁻', '来自碳酸氢根', 405, 900, 220, 'pyrimidine-ledger-card'],
          ['atom-asp', 'N1/C4/C5/C6：天冬氨酸', '四个环原子来自 Asp', 675, 900, 270, 'pyrimidine-ledger-card'],
          ['energy', '形成 UMP：CAD/CPS II 直接消耗 2 ATP', 'PRPP 的活化成本另计', 1040, 900, 390, 'pyrimidine-regulation-card'],
          ['regulation', 'UTP抑制 CAD/CPS II · PRPP激活', '入口按嘧啶池需求调节', 1400, 900, 300, 'pyrimidine-regulation-card'],
          ['dhodh-boundary', 'DHODH锚定线粒体内膜外侧 · 不需要专用转运体', '胞质底物和产物可接近催化域', 260, 992, 450, 'pyrimidine-boundary-card'],
          ['dctp-boundary', 'dCTP 分支：CDP→dCDP 经 RNR', '与 UDP 还原遵循同类逻辑', 655, 992, 300, 'pyrimidine-boundary-card'],
          ['dcmp-boundary', 'dCMP 脱氨也可形成 dUMP', '本图主线采用 dUTPase 路径', 970, 992, 300, 'pyrimidine-boundary-card'],
          ['folate-boundary', '5,10-亚甲基-THF → DHF', 'DHFR / SHMT 负责一碳循环补充', 1305, 992, 330, 'pyrimidine-folate-card']
        ].forEach(([key, label, meta, x, y, width, className]) => addNode({ key, label, meta, x, y, width, height: 72, className }));

        const makeExit = (pathway, x, title, note) => {
          const next = studentSvgElement('g', { class: 'student-map-next-pathway pyrimidine-next-pathway', 'data-next-pathway': pathway, role: 'button', tabindex: '0', 'aria-label': `${title}${note}` });
          next.appendChild(studentSvgElement('rect', { x, y: 1050, width: 350, height: 58, rx: 14 }));
          next.appendChild(studentSvgElement('text', { x: x + 175, y: 1075, class: 'next-label' }, title));
          next.appendChild(studentSvgElement('text', { x: x + 175, y: 1096, class: 'next-name' }, note));
          const open = () => renderStudentPathway(pathway, { returnToPrimer: false });
          next.addEventListener('click', event => { event.stopPropagation(); open(); });
          next.addEventListener('keydown', event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); open(); } });
          studentMapNodes.appendChild(next);
        };
        makeExit('ppp', 235, 'PRPP 从哪里来', '进入磷酸戊糖途径 →');
        makeExit('etc', 625, 'CoQH₂ 去哪里', '进入电子传递链 →');
        makeExit('nucleotide_degradation', 1015, '核苷酸怎样回收', '进入降解与补救合成 →');
        setStudentReadingStep(pathwayId, 0);
      }

      function renderNucleotideDegradationStudentMap(pathwayId, pathwayReactions, tone) {
        const ownReactions = pathwayReactions.filter(reaction => groupsFor(reaction).includes(pathwayId));
        const reactionAt = index => ownReactions[index] || null;
        studentPathwayMap.setAttribute('viewBox', '0 0 1500 980');
        studentPathwayMap.dataset.mapLayout = 'nucleotide-degradation-branch-ledger';
        studentPathwayMap.setAttribute('aria-label', '核苷酸降解：核苷酸先去磷酸成为核苷，再裂解为碱基；嘌呤支路形成尿酸，嘧啶支路形成可进一步代谢的小分子，能回收的碱基通过补救接口回到核苷酸池');
        studentMapBands.replaceChildren(); studentMapEdges.replaceChildren(); studentMapNodes.replaceChildren();
        studentMapCount.textContent = `${ownReactions.length} 个终审反应 · 2 段共同前处理 · 嘌呤 / 嘧啶双分支`;

        [
          ['phosphate-release', 22, 20, 420, 390, 'nucleotide-degradation-release-band', '① 去磷酸 · 核苷酸 → 核苷'],
          ['nucleoside-cleavage', 462, 20, 420, 390, 'nucleotide-degradation-cleavage-band', '② 裂解 · 核苷 ⇌ 碱基 + 核糖-1-P'],
          ['purine-branch', 902, 20, 576, 390, 'nucleotide-degradation-purine-band', '③ 嘌呤支路 · 最终到尿酸'],
          ['pyrimidine-branch', 22, 430, 1456, 310, 'nucleotide-degradation-pyrimidine-band', '④ 嘧啶支路 · 进入小分子代谢'],
          ['salvage-ledger', 22, 760, 1456, 190, 'nucleotide-degradation-salvage-band', '⑤ 补救接口、区室与终产物边界']
        ].forEach(([key, x, y, width, height, className, title]) => {
          studentMapBands.appendChild(studentSvgElement('rect', { x, y, width, height, class: `student-map-band ${className}`, 'data-nucleotide-degradation-zone': key }));
          studentMapBands.appendChild(studentSvgElement('text', { x: x + 22, y: y + 30, class: 'student-map-band-label' }, title));
        });

        const records = new Map();
        const addNode = ({ key, label, meta, x, y, width = 220, height = 78, reaction = null, step = 0, className = '' }) => {
          const attrs = {
            class: `student-map-node nucleotide-degradation-node ${className}`.trim(), style: `--tone:${tone}`,
            'data-map-key': key, 'data-reaction': reaction?.id || '', 'data-step-index': String(Math.max(0, step - 1)),
            'aria-label': `${label}，${meta}`
          };
          if (step) attrs['data-nucleotide-degradation-step'] = String(step);
          if (reaction) Object.assign(attrs, { role: 'button', tabindex: '0' });
          const group = studentSvgElement('g', attrs);
          group.appendChild(studentSvgElement('title', {}, `${label} · ${meta}`));
          group.appendChild(studentSvgElement('rect', { x: x - width / 2, y: y - height / 2, width, height, rx: 15 }));
          const name = studentSvgElement('text', { x, y: y - 5, class: 'node-name' }, label);
          const detail = studentSvgElement('text', { x, y: y + 21, class: 'node-compartment' }, meta);
          group.append(name, detail); fitStudentMapText(name, width - 22, 15.5, 9.2); fitStudentMapText(detail, width - 18, 11.8, 8.1);
          if (reaction) {
            const open = () => renderStudentReactionDetail(reaction, pathwayId, ownReactions.indexOf(reaction));
            group.addEventListener('click', open);
            group.addEventListener('keydown', event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); open(); } });
          }
          studentMapNodes.appendChild(group);
          const record = { key, x, y, width, height, reaction, step };
          records.set(key, record); return record;
        };
        const addEdge = (fromKey, toKey, className = '', path = '') => {
          const from = records.get(fromKey), to = records.get(toKey);
          if (!from || !to) return;
          const edge = studentSvgElement('path', {
            d: path || studentMapEdgePath(from, to, Math.min(from.width, 190), Math.min(from.height, 72)),
            class: `student-map-edge nucleotide-degradation-edge ${className}`.trim(),
            'data-edge-from': fromKey, 'data-edge-to': toKey, 'data-step-index': String(Math.max(0, (from.step || 1) - 1))
          });
          if (from.reaction || to.reaction) {
            const reaction = from.reaction || to.reaction;
            edge.dataset.reaction = reaction.id;
            edge.setAttribute('role', 'button'); edge.tabIndex = 0;
            edge.addEventListener('click', event => { event.stopPropagation(); renderStudentReactionDetail(reaction, pathwayId, ownReactions.indexOf(reaction)); });
            edge.addEventListener('keydown', event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); renderStudentReactionDetail(reaction, pathwayId, ownReactions.indexOf(reaction)); } });
          }
          studentMapEdges.appendChild(edge);
        };

        addNode({ key: 'nucleotide', label: '核苷酸', meta: 'AMP / GMP / UMP / TMP · 核苷酸酶 · 细胞质', x: 130, y: 150, width: 230, reaction: reactionAt(0), step: 1, className: 'is-input' });
        addNode({ key: 'nucleoside', label: '核苷', meta: '去掉 Pi · 核苷磷酸化酶 · 共同中间体', x: 330, y: 150, width: 220, reaction: reactionAt(1), step: 2, className: 'is-cleavage' });
        addNode({ key: 'base', label: '碱基', meta: '嘌呤或嘧啶碱基', x: 530, y: 150, width: 220, step: 3, className: 'is-cleavage' });
        addNode({ key: 'phosphate', label: 'Pi', meta: '核苷酸酶释放的磷酸', x: 130, y: 315, width: 180, className: 'is-byproduct' });
        addNode({ key: 'ribose', label: '核糖-1-磷酸', meta: '可进入糖代谢接口', x: 530, y: 315, width: 220, className: 'is-byproduct' });
        addNode({ key: 'hypoxanthine', label: '次黄嘌呤', meta: '嘌呤碱基 · 黄嘌呤氧化酶', x: 1030, y: 145, width: 230, reaction: reactionAt(2), step: 4, className: 'is-purine' });
        addNode({ key: 'guanine', label: '鸟嘌呤', meta: '鸟嘌呤脱氨酶 · 再由黄嘌呤氧化酶', x: 1030, y: 300, width: 230, reaction: reactionAt(3), step: 5, className: 'is-purine' });
        addNode({ key: 'uric-acid', label: '尿酸', meta: '人类嘌呤主要终产物', x: 1320, y: 220, width: 250, className: 'is-terminal' });
        addNode({ key: 'uracil', label: '尿嘧啶', meta: '嘧啶碱基 · 还原后开环', x: 250, y: 565, width: 240, reaction: reactionAt(4), step: 6, className: 'is-pyrimidine' });
        addNode({ key: 'beta-alanine', label: 'β-丙氨酸', meta: '进入后续小分子代谢', x: 600, y: 565, width: 250, className: 'is-terminal' });
        addNode({ key: 'thymine', label: '胸腺嘧啶', meta: '嘧啶碱基 · DNA 周转', x: 950, y: 565, width: 240, reaction: reactionAt(5), step: 7, className: 'is-pyrimidine' });
        addNode({ key: 'beta-aminoisobutyrate', label: 'β-氨基异丁酸', meta: '进入后续小分子代谢', x: 1300, y: 565, width: 270, className: 'is-terminal' });

        addEdge('nucleotide', 'nucleoside', 'release');
        addEdge('nucleoside', 'base', 'cleavage');
        addEdge('nucleotide', 'phosphate', 'byproduct', 'M 130 189 C 130 235, 130 260, 130 276');
        addEdge('base', 'ribose', 'byproduct', 'M 530 189 C 530 235, 530 260, 530 276');
        addEdge('base', 'hypoxanthine', 'purine-route', 'M 640 150 C 760 125, 860 125, 910 145');
        addEdge('base', 'guanine', 'purine-route', 'M 640 165 C 760 235, 860 290, 910 300');
        addEdge('hypoxanthine', 'uric-acid', 'purine-route');
        addEdge('guanine', 'uric-acid', 'purine-route', 'M 1145 300 C 1210 295, 1260 260, 1320 240');
        addEdge('base', 'uracil', 'pyrimidine-route', 'M 530 189 C 460 320, 350 410, 250 526');
        addEdge('uracil', 'beta-alanine', 'pyrimidine-route');
        addEdge('base', 'thymine', 'pyrimidine-route', 'M 580 189 C 690 320, 800 430, 950 526');
        addEdge('thymine', 'beta-aminoisobutyrate', 'pyrimidine-route');

        [
          [70, 825, 430, '补救回收接口', '可回收碱基 / 核苷重新接回核苷酸池；APRT / HGPRT 不属于本图主干'],
          [520, 825, 430, '区室边界', '主干按细胞质简化；核酸输入可先经溶酶体处理'],
          [970, 825, 430, '终产物去向', '尿酸、β-丙氨酸和 β-氨基异丁酸进入组织特异的后续处理']
        ].forEach(([x, y, width, title, note]) => {
          const card = studentSvgElement('g', { class: 'student-map-node nucleotide-degradation-ledger-card' });
          card.appendChild(studentSvgElement('rect', { x, y, width, height: 92, rx: 15 }));
          card.appendChild(studentSvgElement('text', { x: x + width / 2, y: y + 35, class: 'ledger-title', 'text-anchor': 'middle' }, title));
          const noteText = studentSvgElement('text', { x: x + width / 2, y: y + 66, class: 'ledger-note', 'text-anchor': 'middle' }, note);
          card.appendChild(noteText); fitStudentMapText(noteText, width - 24, 12, 8.2); studentMapNodes.appendChild(card);
        });
        studentMapNodes.appendChild(studentSvgElement('text', { x: 750, y: 948, class: 'student-nucleotide-degradation-boundary', 'text-anchor': 'middle' }, '降解释放的碱基不必全部排出：能回收的部分优先节省从头合成成本'));
        setStudentReadingStep(pathwayId, 0);
      }

      function renderTcaStudentMap(pathwayId, pathwayReactions, tone) {
        const viewWidth = 1280;
        const viewHeight = 820;
        const nodeWidth = 142;
        const nodeHeight = 60;
        const ownReactions = pathwayReactions.filter(reaction => groupsFor(reaction).includes(pathwayId));
        const byEnzyme = pattern => ownReactions.find(reaction => pattern.test(reaction.enzyme || '')) || null;
        const citrateFromAcetyl = ownReactions.find(reaction => reaction.from === '乙酰辅酶 A@mito-matrix') || byEnzyme(/柠檬酸合酶/);
        const citrateFromOaa = ownReactions.find(reaction => reaction.from === '草酰乙酸@mito-matrix' && reaction.to === '柠檬酸@mito-matrix') || citrateFromAcetyl;
        const aconitase = byEnzyme(/顺乌头酸酶/);
        const idh = byEnzyme(/异柠檬酸脱氢酶/);
        const ogdh = byEnzyme(/α-酮戊二酸脱氢酶/);
        const sucl = byEnzyme(/琥珀酰-CoA 合成酶/);
        const sdh = byEnzyme(/琥珀酸脱氢酶/);
        const fumarase = byEnzyme(/延胡索酸酶/);
        const mdh = byEnzyme(/苹果酸脱氢酶|MDH2/);

        studentPathwayMap.setAttribute('viewBox', `0 0 ${viewWidth} ${viewHeight}`);
        studentPathwayMap.dataset.mapLayout = 'tca-yield-cycle';
        studentPathwayMap.setAttribute('aria-label', '三羧酸循环：乙酰辅酶A进入八个经典酶步骤，产生三分子NADH、一分子GTP、两分子二氧化碳，并由内膜复合体II把电子送给辅酶Q，同时再生草酰乙酸');
        studentMapBands.replaceChildren();
        studentMapEdges.replaceChildren();
        studentMapNodes.replaceChildren();
        studentMapCount.textContent = '8 个酶步骤 · 9 个循环节点';

        studentMapBands.appendChild(studentSvgElement('rect', {
          x: 24, y: 22, width: 1232, height: 620, class: 'student-map-band tca-matrix-band'
        }));
        studentMapBands.appendChild(studentSvgElement('text', {
          x: 48, y: 54, class: 'student-map-band-label'
        }, '线粒体基质 · 八个经典酶步骤把乙酰基氧化，并再生 OAA'));
        studentMapBands.appendChild(studentSvgElement('rect', {
          x: 24, y: 656, width: 1232, height: 118, class: 'student-map-band tca-inner-membrane-band'
        }));
        studentMapBands.appendChild(studentSvgElement('text', {
          x: 48, y: 686, class: 'student-map-band-label'
        }, '线粒体内膜接口 · 琥珀酸脱氢酶 = 呼吸链复合体 II'));

        const nodeDefinitions = [
          { key: 'acetyl-coa', entityId: '乙酰辅酶 A@mito-matrix', label: '乙酰-CoA', meta: '2C 输入', x: 105, y: 265, stepIndex: 0, reaction: citrateFromAcetyl, className: 'tca-input-node' },
          { key: 'citrate', entityId: '柠檬酸@mito-matrix', label: '柠檬酸', meta: '6C', x: 300, y: 135, stepIndex: 1, reaction: aconitase },
          { key: 'isocitrate', entityId: '异柠檬酸@mito-matrix', label: '异柠檬酸', meta: '6C', x: 535, y: 115, stepIndex: 2, reaction: idh },
          { key: 'alpha-ketoglutarate', entityId: 'α-酮戊二酸@mito-matrix', label: 'α-酮戊二酸', meta: '5C', x: 790, y: 135, stepIndex: 3, reaction: ogdh },
          { key: 'succinyl-coa', entityId: '琥珀酰辅酶 A@mito-matrix', label: '琥珀酰-CoA', meta: '4C', x: 1040, y: 220, stepIndex: 4, reaction: sucl },
          { key: 'succinate', entityId: '琥珀酸@mito-matrix', label: '琥珀酸', meta: '4C', x: 1080, y: 500, stepIndex: 5, reaction: sdh },
          { key: 'fumarate', entityId: '延胡索酸@mito-matrix', label: '延胡索酸', meta: '4C', x: 850, y: 585, stepIndex: 6, reaction: fumarase },
          { key: 'malate', entityId: '苹果酸@mito-matrix', label: '苹果酸', meta: '4C', x: 580, y: 585, stepIndex: 7, reaction: mdh },
          { key: 'oaa', entityId: '草酰乙酸@mito-matrix', label: '草酰乙酸', meta: 'OAA 再生 · 4C', x: 300, y: 505, stepIndex: 8, reaction: mdh, className: 'tca-regenerated-node' }
        ];
        const nodeRecords = new Map(nodeDefinitions.map(definition => [definition.key, {
          ...definition,
          entity: entityById[definition.entityId] || null
        }]));

        const edgeDefinitions = [
          { from: 'acetyl-coa', to: 'citrate', reaction: citrateFromAcetyl, className: 'tca-carbon-entry', path: 'M 170 245 C 205 215, 250 170, 285 155' },
          { from: 'oaa', to: 'citrate', reaction: citrateFromOaa, className: 'tca-regeneration-edge', path: 'M 278 475 C 205 430, 205 230, 282 158' },
          { from: 'citrate', to: 'isocitrate', reaction: aconitase },
          { from: 'isocitrate', to: 'alpha-ketoglutarate', reaction: idh, className: 'tca-oxidation-edge' },
          { from: 'alpha-ketoglutarate', to: 'succinyl-coa', reaction: ogdh, className: 'tca-oxidation-edge' },
          { from: 'succinyl-coa', to: 'succinate', reaction: sucl, className: 'tca-phosphorylation-edge' },
          { from: 'succinate', to: 'fumarate', reaction: sdh, className: 'tca-sdh-edge' },
          { from: 'fumarate', to: 'malate', reaction: fumarase },
          { from: 'malate', to: 'oaa', reaction: mdh, className: 'tca-oxidation-edge' }
        ];

        edgeDefinitions.forEach((definition, edgeIndex) => {
          const source = nodeRecords.get(definition.from);
          const target = nodeRecords.get(definition.to);
          if (!source || !target) return;
          const edge = studentSvgElement('path', {
            d: definition.path || studentMapEdgePath(source, target, nodeWidth, nodeHeight),
            class: `student-map-edge tca-edge ${definition.className || ''}`,
            'data-edge-from': definition.from,
            'data-edge-to': definition.to,
            'data-reaction': definition.reaction?.id || '',
            'data-step-index': String(Math.min(source.stepIndex, target.stepIndex))
          });
          if (definition.reaction) {
            const openReaction = () => renderStudentReactionDetail(definition.reaction, pathwayId, ownReactions.indexOf(definition.reaction));
            edge.setAttribute('role', 'button');
            edge.tabIndex = 0;
            edge.addEventListener('click', event => { event.stopPropagation(); openReaction(); });
            edge.addEventListener('keydown', event => {
              if (event.key !== 'Enter' && event.key !== ' ') return;
              event.preventDefault();
              openReaction();
            });
          }
          studentMapEdges.appendChild(edge);
          applyStudentReactionDirection(edge, definition.reaction, {
            showLabel: true,
            labelOffsetY: edgeIndex % 2 === 0 ? -14 : 14
          });
        });

        nodeRecords.forEach(record => {
          const node = studentSvgElement('g', {
            class: `student-map-node tca-node ${record.className || ''}`,
            style: `--tone:${tone}`,
            'data-map-key': record.key,
            'data-entity-id': record.entityId,
            'data-step-index': String(record.stepIndex),
            'data-reaction': record.reaction?.id || '',
            role: 'button',
            tabindex: '0',
            'aria-label': `${record.label}，${record.meta}`
          });
          node.appendChild(studentSvgElement('title', {}, `${record.label} · ${record.meta}`));
          node.appendChild(studentSvgElement('rect', {
            x: record.x - nodeWidth / 2, y: record.y - nodeHeight / 2, width: nodeWidth, height: nodeHeight
          }));
          const name = studentSvgElement('text', { x: record.x, y: record.y + 2, class: 'node-name' }, record.label);
          node.appendChild(name);
          node.appendChild(studentSvgElement('text', { x: record.x, y: record.y + 21, class: 'node-compartment' }, record.meta));
          const selectNode = () => renderStudentNodeSelection(record.entity, record.reaction, pathwayId, ownReactions.indexOf(record.reaction), record.stepIndex);
          node.addEventListener('click', event => { event.stopPropagation(); selectNode(); });
          node.addEventListener('keydown', event => {
            if (event.key !== 'Enter' && event.key !== ' ') return;
            event.preventDefault();
            selectNode();
          });
          studentMapNodes.appendChild(node);
          fitStudentMapText(name, nodeWidth - 16, 15.5, 9.5);
        });

        [
          { x: 215, y: 198, label: '柠檬酸合酶', reaction: citrateFromAcetyl },
          { x: 420, y: 82, label: '顺乌头酸酶', reaction: aconitase },
          { x: 660, y: 82, label: '异柠檬酸脱氢酶', reaction: idh },
          { x: 920, y: 130, label: 'α-酮戊二酸脱氢酶复合体', reaction: ogdh },
          { x: 1115, y: 350, label: '琥珀酰-CoA 合成酶', reaction: sucl },
          { x: 965, y: 555, label: '琥珀酸脱氢酶', reaction: sdh },
          { x: 715, y: 632, label: '延胡索酸酶', reaction: fumarase },
          { x: 435, y: 555, label: 'MDH2', reaction: mdh }
        ].forEach(record => {
          const enzyme = studentSvgElement('text', {
            x: record.x, y: record.y, class: 'student-tca-enzyme', 'data-tca-enzyme': '', 'text-anchor': 'middle'
          }, record.label);
          if (record.reaction) {
            enzyme.setAttribute('role', 'button');
            enzyme.tabIndex = 0;
            const openReaction = () => renderStudentReactionDetail(record.reaction, pathwayId, ownReactions.indexOf(record.reaction));
            enzyme.addEventListener('click', event => { event.stopPropagation(); openReaction(); });
            enzyme.addEventListener('keydown', event => {
              if (event.key !== 'Enter' && event.key !== ' ') return;
              event.preventDefault();
              openReaction();
            });
          }
          studentMapNodes.appendChild(enzyme);
        });

        const addYield = ({ key, x, y, label, className = '' }) => {
          const width = Math.max(86, label.length * 15 + 24);
          const yieldNode = studentSvgElement('g', {
            class: `student-tca-yield ${className}`,
            'data-tca-yield': key,
            'aria-label': label
          });
          yieldNode.appendChild(studentSvgElement('rect', { x: x - width / 2, y: y - 20, width, height: 40, rx: 16 }));
          yieldNode.appendChild(studentSvgElement('text', { x, y: y + 5, 'text-anchor': 'middle' }, label));
          studentMapNodes.appendChild(yieldNode);
        };
        addYield({ key: 'nadh-idh', x: 660, y: 220, label: 'NADH + H⁺' });
        addYield({ key: 'co2-idh', x: 790, y: 220, label: 'CO₂', className: 'carbon-output' });
        addYield({ key: 'nadh-ogdh', x: 915, y: 315, label: 'NADH + H⁺' });
        addYield({ key: 'co2-ogdh', x: 1045, y: 315, label: 'CO₂', className: 'carbon-output' });
        addYield({ key: 'gtp', x: 1130, y: 405, label: 'GTP', className: 'energy-output' });
        addYield({ key: 'nadh-mdh', x: 430, y: 620, label: 'NADH + H⁺' });
        addYield({ key: 'coqh2', x: 890, y: 718, label: '酶内 FAD → CoQH₂', className: 'membrane-output' });

        const summary = studentSvgElement('g', {
          class: 'student-tca-summary', 'aria-label': '每轮净收支：3 NADH，1 CoQH₂，1 GTP，2 CO₂，草酰乙酸再生'
        });
        summary.appendChild(studentSvgElement('rect', { x: 440, y: 278, width: 430, height: 158, rx: 22 }));
        summary.appendChild(studentSvgElement('text', { x: 655, y: 315, class: 'summary-kicker', 'text-anchor': 'middle' }, '每轮净收支'));
        summary.appendChild(studentSvgElement('text', { x: 655, y: 352, class: 'summary-main', 'text-anchor': 'middle' }, '3 NADH · 1 CoQH₂ · 1 GTP · 2 CO₂'));
        summary.appendChild(studentSvgElement('text', { x: 655, y: 386, class: 'summary-note', 'text-anchor': 'middle' }, 'OAA 再生，不计入净消耗'));
        summary.appendChild(studentSvgElement('text', { x: 655, y: 415, class: 'summary-note', 'text-anchor': 'middle' }, 'SDH：内膜复合体 II · 电子进入 CoQ 池'));
        studentMapNodes.appendChild(summary);

        const nextPath = studentSvgElement('g', {
          class: 'student-map-next-pathway tca-next-pathway',
          'data-next-pathway': 'etc',
          role: 'button',
          tabindex: '0',
          'aria-label': '还原当量下一站：电子传递链'
        });
        nextPath.appendChild(studentSvgElement('rect', { x: 1030, y: 690, width: 210, height: 64, rx: 14 }));
        nextPath.appendChild(studentSvgElement('text', { x: 1135, y: 715, class: 'next-label' }, 'NADH / CoQH₂ 下一站'));
        nextPath.appendChild(studentSvgElement('text', { x: 1135, y: 741, class: 'next-name' }, '电子传递链 →'));
        const openEtc = () => renderStudentPathway('etc', { returnToPrimer: false });
        nextPath.addEventListener('click', event => { event.stopPropagation(); openEtc(); });
        nextPath.addEventListener('keydown', event => {
          if (event.key !== 'Enter' && event.key !== ' ') return;
          event.preventDefault();
          openEtc();
        });
        studentMapNodes.appendChild(nextPath);

        studentMapBands.appendChild(studentSvgElement('text', {
          x: 48, y: 806, class: 'student-map-pan-hint', 'data-map-hint': 'horizontal'
        }, '横向查看：碳进入 → 两次脱羧 → 产能 → OAA 再生 →'));
        setStudentReadingStep(pathwayId, 0);
      }

      function renderPdhStudentMap(pathwayId, pathwayReactions, tone) {
        const viewWidth = 1280;
        const viewHeight = 720;
        const nodeWidth = 126;
        const nodeHeight = 58;
        const ownReactions = pathwayReactions.filter(reaction => groupsFor(reaction).includes(pathwayId));
        const vdacReaction = ownReactions.find(reaction => /VDAC/.test(reaction.enzyme || '')) || null;
        const mpcReaction = ownReactions.find(reaction => /MPC|丙酮酸载体/.test(reaction.enzyme || '')) || null;
        const pdhReaction = ownReactions.find(reaction => /丙酮酸脱氢酶复合体/.test(reaction.enzyme || '')) || null;

        studentPathwayMap.setAttribute('viewBox', `0 0 ${viewWidth} ${viewHeight}`);
        studentPathwayMap.dataset.mapLayout = 'pdh-entry-handoff';
        studentPathwayMap.setAttribute('aria-label', '丙酮酸脱氢酶复合体：丙酮酸依次经VDAC和MPC进入基质，再由E1、E2、E3与五种辅酶完成不可逆氧化脱羧');
        studentMapBands.replaceChildren();
        studentMapEdges.replaceChildren();
        studentMapNodes.replaceChildren();
        studentMapCount.textContent = `${ownReactions.length} 个反应 · 14 个教学节点`;

        [
          { y: 22, height: 88, className: 'student-map-band pdh-cytosol-band', label: '细胞质 · 糖酵解产生丙酮酸', labelY: 48 },
          { y: 122, height: 48, className: 'student-map-band pdh-outer-membrane-band', label: '线粒体外膜 · VDAC 低选择性通道', labelY: 152 },
          { y: 182, height: 88, className: 'student-map-band pdh-ims-band', label: '膜间隙 · 两层膜之间的丙酮酸池', labelY: 210 },
          { y: 282, height: 54, className: 'student-map-band pdh-inner-membrane-band', label: '线粒体内膜 · MPC1/2 与 H⁺同向输入', labelY: 315 },
          { y: 348, height: 328, className: 'student-map-band pdh-matrix-band', label: '线粒体基质 · PDH 不可逆氧化脱羧与五辅酶接力', labelY: 378 }
        ].forEach(band => {
          studentMapBands.appendChild(studentSvgElement('rect', { x: 24, y: band.y, width: 1232, height: band.height, class: band.className }));
          studentMapBands.appendChild(studentSvgElement('text', { x: 48, y: band.labelY, class: 'student-map-band-label' }, band.label));
        });

        const nodeDefinitions = [
          { key: 'pyruvate-cytosol', entityId: '丙酮酸@cytosol', label: '丙酮酸', meta: '胞质 · 3C', x: 120, y: 76, stepIndex: 0, reaction: vdacReaction },
          { key: 'vdac', entityId: '', label: 'VDAC', title: '电压依赖性阴离子通道（VDAC）', meta: '外膜可逆通道', x: 300, y: 146, stepIndex: 1, reaction: vdacReaction, className: 'pdh-carrier-node' },
          { key: 'pyruvate-ims', entityId: '丙酮酸@mito-ims', label: '丙酮酸', meta: '膜间隙', x: 455, y: 230, stepIndex: 2, reaction: mpcReaction },
          { key: 'mpc', entityId: '', label: 'MPC1/2', title: '线粒体丙酮酸载体（MPC1/2）', meta: 'H⁺同向输入', x: 610, y: 308, stepIndex: 3, reaction: mpcReaction, className: 'pdh-carrier-node' },
          { key: 'pyruvate-matrix', entityId: '丙酮酸@mito-matrix', label: '丙酮酸', meta: '基质 · 3C', x: 730, y: 424, stepIndex: 4, reaction: pdhReaction },
          { key: 'e1', entityId: '', label: 'E1 · TPP', meta: '脱羧 · 放出 CO₂', x: 870, y: 424, stepIndex: 4, reaction: pdhReaction, className: 'pdh-enzyme-node' },
          { key: 'hydroxyethyl-tpp', entityId: '', label: '羟乙基-TPP', meta: '2C 中间体', x: 1010, y: 424, stepIndex: 4, reaction: pdhReaction, className: 'pdh-intermediate-node' },
          { key: 'e2', entityId: '', label: 'E2 · 硫辛酰胺摆臂', meta: '接收并转移乙酰基', x: 1140, y: 424, stepIndex: 4, reaction: pdhReaction, className: 'pdh-enzyme-node' },
          { key: 'co2', entityId: '', label: 'CO₂', meta: '第 3 个碳离开', x: 840, y: 535, stepIndex: 4, reaction: pdhReaction, className: 'pdh-output-node' },
          { key: 'coa', entityId: '', label: 'CoA-SH', meta: '接收乙酰基', x: 980, y: 535, stepIndex: 4, reaction: pdhReaction, className: 'pdh-input-node' },
          { key: 'acetyl-coa', entityId: '乙酰辅酶 A@mito-matrix', label: '乙酰-CoA', meta: '2C · 进入 TCA', x: 1140, y: 535, stepIndex: 5, reaction: pdhReaction, className: 'pdh-output-node' },
          { key: 'e3', entityId: '', label: 'E3 · FAD', meta: '再氧化硫辛酰胺', x: 820, y: 625, stepIndex: 5, reaction: pdhReaction, className: 'pdh-enzyme-node' },
          { key: 'nad', entityId: '', label: 'NAD⁺', meta: '最终电子受体', x: 650, y: 625, stepIndex: 5, reaction: pdhReaction, className: 'pdh-input-node' },
          { key: 'nadh', entityId: '', label: 'NADH + H⁺', meta: '送往呼吸链', x: 970, y: 625, stepIndex: 5, reaction: pdhReaction, className: 'pdh-output-node' }
        ];
        const nodeRecords = new Map(nodeDefinitions.map(definition => [definition.key, {
          ...definition,
          entity: definition.entityId ? entityById[definition.entityId] || null : null
        }]));

        const edgeDefinitions = [
          { from: 'pyruvate-cytosol', to: 'vdac', reaction: vdacReaction, className: 'transport' },
          { from: 'vdac', to: 'pyruvate-ims', reaction: vdacReaction, className: 'transport' },
          { from: 'pyruvate-ims', to: 'mpc', reaction: mpcReaction, className: 'transport' },
          { from: 'mpc', to: 'pyruvate-matrix', reaction: mpcReaction, className: 'transport', label: 'H⁺同向输入' },
          { from: 'pyruvate-matrix', to: 'e1', reaction: pdhReaction },
          { from: 'e1', to: 'hydroxyethyl-tpp', reaction: pdhReaction },
          { from: 'e1', to: 'co2', reaction: pdhReaction, className: 'pdh-product-edge', label: '脱羧' },
          { from: 'hydroxyethyl-tpp', to: 'e2', reaction: pdhReaction },
          { from: 'coa', to: 'e2', reaction: pdhReaction, className: 'pdh-cofactor-edge' },
          { from: 'e2', to: 'acetyl-coa', reaction: pdhReaction, className: 'pdh-product-edge' },
          { from: 'e2', to: 'e3', reaction: pdhReaction, className: 'pdh-cofactor-edge', path: 'M 1100 450 C 1045 510, 920 575, 850 602' },
          { from: 'nad', to: 'e3', reaction: pdhReaction, className: 'pdh-cofactor-edge' },
          { from: 'e3', to: 'nadh', reaction: pdhReaction, className: 'pdh-product-edge' },
          { from: 'e3', to: 'e2', reaction: pdhReaction, className: 'pdh-regeneration-edge', path: 'M 850 642 C 970 680, 1185 605, 1140 455', label: '硫辛酰胺再生' }
        ];

        edgeDefinitions.forEach((definition, edgeIndex) => {
          const source = nodeRecords.get(definition.from);
          const target = nodeRecords.get(definition.to);
          if (!source || !target) return;
          const edge = studentSvgElement('path', {
            d: definition.path || studentMapEdgePath(source, target, nodeWidth, nodeHeight),
            class: `student-map-edge pdh-edge ${definition.className || ''}`,
            'data-edge-from': definition.from,
            'data-edge-to': definition.to,
            'data-reaction': definition.reaction?.id || '',
            'data-step-index': String(Math.min(source.stepIndex, target.stepIndex))
          });
          if (definition.reaction) {
            const openReaction = () => renderStudentReactionDetail(definition.reaction, pathwayId, ownReactions.indexOf(definition.reaction));
            edge.setAttribute('role', 'button');
            edge.tabIndex = 0;
            edge.addEventListener('click', event => { event.stopPropagation(); openReaction(); });
            edge.addEventListener('keydown', event => {
              if (event.key !== 'Enter' && event.key !== ' ') return;
              event.preventDefault();
              openReaction();
            });
          }
          studentMapEdges.appendChild(edge);
          applyStudentReactionDirection(edge, definition.reaction, {
            showLabel: Boolean(definition.label),
            labelOffsetY: -10 - (edgeIndex % 2) * 8
          });
          if (definition.label) edge.setAttribute('aria-label', `${definition.label}：${source.label}到${target.label}`);
        });

        nodeRecords.forEach(record => {
          const node = studentSvgElement('g', {
            class: `student-map-node pdh-node ${record.className || ''}`,
            style: `--tone:${tone}`,
            'data-map-key': record.key,
            'data-entity-id': record.entityId,
            'data-step-index': String(record.stepIndex),
            'data-reaction': record.reaction?.id || '',
            role: 'button',
            tabindex: '0',
            'aria-label': `${record.title || record.label}，${record.meta}`
          });
          node.appendChild(studentSvgElement('title', {}, `${record.title || record.label} · ${record.meta}`));
          node.appendChild(studentSvgElement('rect', { x: record.x - nodeWidth / 2, y: record.y - nodeHeight / 2, width: nodeWidth, height: nodeHeight }));
          const name = studentSvgElement('text', { x: record.x, y: record.y + 2, class: 'node-name' }, record.label);
          node.appendChild(name);
          node.appendChild(studentSvgElement('text', { x: record.x, y: record.y + 20, class: 'node-compartment' }, record.meta));
          const selectNode = () => renderStudentNodeSelection(record.entity, record.reaction, pathwayId, ownReactions.indexOf(record.reaction), record.stepIndex);
          node.addEventListener('click', event => { event.stopPropagation(); selectNode(); });
          node.addEventListener('keydown', event => {
            if (event.key !== 'Enter' && event.key !== ' ') return;
            event.preventDefault();
            selectNode();
          });
          studentMapNodes.appendChild(node);
          fitStudentMapText(name, nodeWidth - 14, 15.5, 9.5);
        });

        const nextPath = studentSvgElement('g', {
          class: 'student-map-next-pathway pdh-next-pathway',
          'data-next-pathway': 'tca',
          role: 'button',
          tabindex: '0',
          'aria-label': '下一站：三羧酸循环'
        });
        nextPath.appendChild(studentSvgElement('rect', { x: 1060, y: 590, width: 190, height: 58, rx: 14 }));
        nextPath.appendChild(studentSvgElement('text', { x: 1155, y: 614, class: 'next-label' }, '乙酰-CoA 下一站'));
        nextPath.appendChild(studentSvgElement('text', { x: 1155, y: 636, class: 'next-name' }, '三羧酸循环 →'));
        const openTca = () => renderStudentPathway('tca', { returnToPrimer: false });
        nextPath.addEventListener('click', event => { event.stopPropagation(); openTca(); });
        nextPath.addEventListener('keydown', event => {
          if (event.key !== 'Enter' && event.key !== ' ') return;
          event.preventDefault();
          openTca();
        });
        studentMapNodes.appendChild(nextPath);

        studentMapBands.appendChild(studentSvgElement('text', {
          x: 48,
          y: 704,
          class: 'student-map-pan-hint',
          'data-map-hint': 'horizontal'
        }, '横向查看：跨膜进入 → 三酶接力 → TCA →'));
        setStudentReadingStep(pathwayId, 0);
      }

      function renderEtcStudentMap(pathwayId, pathwayReactions, tone) {
        const viewWidth = 1180;
        const viewHeight = 600;
        const nodeWidth = 126;
        const nodeHeight = 62;
        studentPathwayMap.setAttribute('viewBox', `0 0 ${viewWidth} ${viewHeight}`);
        studentPathwayMap.dataset.mapLayout = 'etc-electron-flow';
        studentPathwayMap.setAttribute('aria-label', '呼吸电子传递链：NADH与琥珀酸双入口在辅酶Q池汇合，并建立质子动力势');
        studentMapBands.replaceChildren();
        studentMapEdges.replaceChildren();
        studentMapNodes.replaceChildren();
        studentMapCount.textContent = `${pathwayReactions.length} 个反应 · 12 个教学节点`;

        [
          { y: 28, height: 150, className: 'student-map-band etc-ims-band', label: '膜间隙侧 · H⁺积累形成电化学势', labelY: 55 },
          { y: 190, height: 165, className: 'student-map-band etc-membrane-band', label: '线粒体内膜 · 电子沿载体复合体传递', labelY: 217 },
          { y: 368, height: 170, className: 'student-map-band etc-matrix-band', label: '基质侧 · 两个电子入口', labelY: 395 }
        ].forEach(band => {
          studentMapBands.appendChild(studentSvgElement('rect', { x: 25, y: band.y, width: 1130, height: band.height, class: band.className }));
          studentMapBands.appendChild(studentSvgElement('text', { x: 48, y: band.labelY, class: 'student-map-band-label' }, band.label));
        });

        const nodeDefinitions = [
          { key: 'nadh', entityId: 'NADH@mito-matrix', label: 'NADH', meta: '基质电子入口', x: 92, y: 438, stepIndex: 0 },
          { key: 'complex-i', entityId: '复合体 I@mito-inner-membrane', label: '复合体 I', meta: '泵出 4 H⁺', x: 258, y: 286, stepIndex: 1 },
          { key: 'succinate', entityId: '琥珀酸@mito-matrix', label: '琥珀酸', meta: '经酶内 FAD/FADH₂', x: 92, y: 500, stepIndex: 0 },
          { key: 'complex-ii', entityId: '复合体 II@mito-inner-membrane', label: '复合体 II', meta: '不泵质子', x: 258, y: 452, stepIndex: 1 },
          { key: 'coq', entityId: '泛醇@mito-inner-membrane', label: 'CoQ 池', meta: 'Q / QH₂汇合', x: 438, y: 364, stepIndex: 2 },
          { key: 'complex-iii', entityId: '复合体 III@mito-inner-membrane', label: '复合体 III', meta: 'Q循环 · 4 H⁺', x: 616, y: 286, stepIndex: 3 },
          { key: 'cyt-c', entityId: '细胞色素 c@mito-ims', label: '细胞色素 c', meta: '膜间隙侧载体', x: 758, y: 214, stepIndex: 4 },
          { key: 'complex-iv', entityId: '复合体 IV@mito-inner-membrane', label: '复合体 IV', meta: '泵出 2 H⁺', x: 874, y: 286, stepIndex: 5 },
          { key: 'oxygen', entityId: '氧@mito-matrix', label: 'O₂', meta: '末端电子受体', x: 874, y: 462, stepIndex: 6 },
          { key: 'water', entityId: '水@mito-matrix', label: 'H₂O', meta: '末端还原产物', x: 1042, y: 394, stepIndex: 6 },
          { key: 'hplus', entityId: '膜间隙 H⁺@mito-ims', label: '膜间隙 H⁺', meta: 'I、III、IV共同建立', x: 900, y: 104, stepIndex: 6 },
          { key: 'pmf', entityId: '质子动力势@mito-inner-membrane', label: '质子动力势 Δp', meta: 'ETC 的能量输出', x: 1050, y: 104, stepIndex: 6 }
        ];
        const nodeRecords = new Map(nodeDefinitions.map(definition => [definition.key, {
          ...definition,
          entity: entityById[definition.entityId] || null,
          reactions: []
        }]));

        const reactionFor = (from, to, match = null) => {
          const source = nodeRecords.get(from)?.entityId;
          const target = nodeRecords.get(to)?.entityId;
          return pathwayReactions.find(reaction => reaction.from === source && reaction.to === target)
            || pathwayReactions.find(reaction => match && match(reaction))
            || null;
        };
        const edgeDefinitions = [
          { from: 'nadh', to: 'complex-i' },
          { from: 'succinate', to: 'complex-ii' },
          { from: 'complex-i', to: 'coq' },
          { from: 'complex-ii', to: 'coq' },
          { from: 'coq', to: 'complex-iii' },
          { from: 'complex-iii', to: 'cyt-c' },
          { from: 'cyt-c', to: 'complex-iv' },
          { from: 'oxygen', to: 'complex-iv', className: 'substrate-input' },
          { from: 'complex-iv', to: 'water' },
          { from: 'complex-i', to: 'hplus', className: 'proton', label: '4 H⁺' },
          { from: 'complex-iii', to: 'hplus', className: 'proton', label: '4 H⁺' },
          { from: 'complex-iv', to: 'hplus', className: 'proton', label: '2 H⁺' },
          { from: 'hplus', to: 'pmf', className: 'proton-output' }
        ];

        edgeDefinitions.forEach((definition, edgeIndex) => {
          const source = nodeRecords.get(definition.from);
          const target = nodeRecords.get(definition.to);
          if (!source || !target) return;
          const reaction = reactionFor(definition.from, definition.to, candidate => {
            if (definition.from === 'coq' && definition.to === 'complex-iii') return candidate.from === source.entityId && /复合体 III/.test(candidate.enzyme || '');
            return false;
          });
          if (reaction) {
            source.reactions.push(reaction);
            target.reactions.push(reaction);
          }
          const edge = studentSvgElement('path', {
            d: studentMapEdgePath(source, target, nodeWidth, nodeHeight),
            class: `student-map-edge etc-edge${definition.className ? ` ${definition.className}` : ''}`,
            'data-edge-from': definition.from,
            'data-edge-to': definition.to,
            'data-reaction': reaction?.id || '',
            'data-step-index': String(Math.min(source.stepIndex, target.stepIndex))
          });
          if (reaction) {
            const openReaction = () => renderStudentReactionDetail(reaction, pathwayId, pathwayReactions.indexOf(reaction));
            edge.setAttribute('role', 'button');
            edge.tabIndex = 0;
            edge.addEventListener('click', event => { event.stopPropagation(); openReaction(); });
            edge.addEventListener('keydown', event => {
              if (event.key !== 'Enter' && event.key !== ' ') return;
              event.preventDefault();
              openReaction();
            });
          }
          studentMapEdges.appendChild(edge);
          applyStudentReactionDirection(edge, reaction, {
            showLabel: Boolean(definition.label),
            labelOffsetY: definition.className === 'proton' ? -10 - (edgeIndex % 2) * 9 : -12
          });
          if (definition.label) {
            edge.setAttribute('aria-label', `${definition.label}：${source.label}到${target.label}`);
          }
        });

        nodeRecords.forEach(record => {
          const node = studentSvgElement('g', {
            class: `student-map-node etc-node${record.key === 'pmf' ? ' etc-output-node' : ''}`,
            style: `--tone:${tone}`,
            'data-map-key': record.key,
            'data-entity-id': record.entityId,
            'data-step-index': String(record.stepIndex),
            role: 'button',
            tabindex: '0',
            'aria-label': `${record.label}，${record.meta}`
          });
          node.appendChild(studentSvgElement('title', {}, `${record.label} · ${record.meta}`));
          node.appendChild(studentSvgElement('rect', { x: record.x - nodeWidth / 2, y: record.y - nodeHeight / 2, width: nodeWidth, height: nodeHeight }));
          const name = studentSvgElement('text', { x: record.x, y: record.y + 2, class: 'node-name' }, record.label);
          node.appendChild(name);
          node.appendChild(studentSvgElement('text', { x: record.x, y: record.y + 21, class: 'node-compartment' }, record.meta));
          const reaction = record.reactions[0] || null;
          if (reaction) node.dataset.reaction = reaction.id;
          const selectNode = () => renderStudentNodeSelection(record.entity, reaction, pathwayId, pathwayReactions.indexOf(reaction), record.stepIndex);
          node.addEventListener('click', event => { event.stopPropagation(); selectNode(); });
          node.addEventListener('keydown', event => {
            if (event.key !== 'Enter' && event.key !== ' ') return;
            event.preventDefault();
            selectNode();
          });
          studentMapNodes.appendChild(node);
          fitStudentMapText(name, nodeWidth - 16, 15.5, 10);
        });

        const nextPath = studentSvgElement('g', {
          class: 'student-map-next-pathway',
          'data-next-pathway': 'oxphos',
          role: 'button',
          tabindex: '0',
          'aria-label': '下一站：氧化磷酸化'
        });
        nextPath.appendChild(studentSvgElement('rect', { x: 930, y: 246, width: 220, height: 58, rx: 14 }));
        nextPath.appendChild(studentSvgElement('text', { x: 1040, y: 270, class: 'next-label' }, '下一站'));
        nextPath.appendChild(studentSvgElement('text', { x: 1040, y: 290, class: 'next-name' }, '氧化磷酸化 →'));
        const openOxphos = () => renderStudentPathway('oxphos', { returnToPrimer: false });
        nextPath.addEventListener('click', event => { event.stopPropagation(); openOxphos(); });
        nextPath.addEventListener('keydown', event => {
          if (event.key !== 'Enter' && event.key !== ' ') return;
          event.preventDefault();
          openOxphos();
        });
        studentMapNodes.appendChild(nextPath);

        studentMapBands.appendChild(studentSvgElement('text', {
          x: 48,
          y: 575,
          class: 'student-map-pan-hint',
          'data-map-hint': 'horizontal'
        }, '横向查看完整主线 →'));
        setStudentReadingStep(pathwayId, 0);
      }

      function renderOxphosStudentMap(pathwayId, pathwayReactions, tone) {
        const viewWidth = 1200;
        const viewHeight = 660;
        const nodeWidth = 126;
        const nodeHeight = 58;
        const ownReactions = pathwayReactions.filter(reaction => groupsFor(reaction).includes(pathwayId));
        studentPathwayMap.setAttribute('viewBox', `0 0 ${viewWidth} ${viewHeight}`);
        studentPathwayMap.dataset.mapLayout = 'oxphos-coupling';
        studentPathwayMap.setAttribute('aria-label', '氧化磷酸化：质子回流驱动ATP合成，并由ANT、磷酸载体和VDAC完成底物与产物交换');
        studentMapBands.replaceChildren();
        studentMapEdges.replaceChildren();
        studentMapNodes.replaceChildren();
        studentMapCount.textContent = `${ownReactions.length} 个反应 · 15 个教学节点`;

        [
          { y: 22, height: 105, className: 'student-map-band ox-cytosol-band', label: '细胞质 · ADP 与 Pi 输入，ATP 输出', labelY: 48 },
          { y: 140, height: 48, className: 'student-map-band ox-outer-membrane-band', label: '线粒体外膜 · VDAC 通道', labelY: 170 },
          { y: 202, height: 105, className: 'student-map-band ox-ims-band', label: '膜间隙 · H⁺梯度与交换池', labelY: 228 },
          { y: 322, height: 132, className: 'student-map-band ox-inner-membrane-band', label: '线粒体内膜 · 三个独立机制通道', labelY: 349 },
          { y: 468, height: 145, className: 'student-map-band ox-matrix-band', label: '基质 · F₁催化侧生成 ATP', labelY: 496 }
        ].forEach(band => {
          studentMapBands.appendChild(studentSvgElement('rect', { x: 25, y: band.y, width: 1150, height: band.height, class: band.className }));
          studentMapBands.appendChild(studentSvgElement('text', { x: 48, y: band.labelY, class: 'student-map-band-label' }, band.label));
        });

        const nodeDefinitions = [
          { key: 'h-ims', entityId: '膜间隙 H⁺@mito-ims', label: '膜间隙 H⁺', meta: '质子动力势', x: 250, y: 263, stepIndex: 0, className: 'ox-proton-node' },
          { key: 'atp-synthase', entityId: 'ATP 合酶@mito-inner-membrane', label: 'F₀F₁-ATP 合酶', meta: 'H⁺回流驱动旋转', x: 430, y: 398, stepIndex: 1, className: 'ox-carrier-node' },
          { key: 'h-matrix', entityId: '', label: '基质 H⁺', meta: '回流终点', x: 250, y: 558, stepIndex: 1, className: 'ox-proton-node' },
          { key: 'adp-matrix', entityId: 'ADP@mito-matrix', label: 'ADP', meta: '基质底物', x: 420, y: 558, stepIndex: 2, className: 'ox-input-node' },
          { key: 'pi-matrix', entityId: '无机磷酸@mito-matrix', label: 'Pi', meta: '基质底物', x: 570, y: 558, stepIndex: 2, className: 'ox-input-node' },
          { key: 'atp-matrix', entityId: 'ATP@mito-matrix', label: 'ATP', meta: '基质产物', x: 720, y: 558, stepIndex: 2, className: 'ox-product-node' },
          { key: 'ant', entityId: '', label: 'ANT / SLC25A4', meta: 'ATP⁴⁻出 · ADP³⁻入', x: 720, y: 398, stepIndex: 3, className: 'ox-carrier-node' },
          { key: 'atp-ims', entityId: 'ATP@mito-ims', label: 'ATP', meta: '膜间隙输出池', x: 650, y: 263, stepIndex: 3 },
          { key: 'adp-ims', entityId: 'ADP@mito-ims', label: 'ADP', meta: '膜间隙输入池', x: 800, y: 263, stepIndex: 3 },
          { key: 'phosphate-carrier', entityId: '', label: 'SLC25A3', meta: 'Pi/H⁺同向输入', x: 1010, y: 398, stepIndex: 3, className: 'ox-carrier-node' },
          { key: 'pi-ims', entityId: '无机磷酸@mito-ims', label: 'Pi + H⁺', meta: '膜间隙输入池', x: 1010, y: 263, stepIndex: 3 },
          { key: 'vdac', entityId: '', label: 'VDAC', meta: '外膜开放通道', x: 850, y: 164, stepIndex: 4, className: 'ox-carrier-node' },
          { key: 'atp-cytosol', entityId: 'ATP@cytosol', label: 'ATP', meta: '输出到细胞质', x: 650, y: 82, stepIndex: 4, className: 'ox-product-node' },
          { key: 'adp-cytosol', entityId: 'ADP@cytosol', label: 'ADP', meta: '从细胞质输入', x: 850, y: 82, stepIndex: 4, className: 'ox-input-node' },
          { key: 'pi-cytosol', entityId: '无机磷酸@cytosol', label: 'Pi', meta: '从细胞质输入', x: 1050, y: 82, stepIndex: 4, className: 'ox-input-node' }
        ];
        const nodeRecords = new Map(nodeDefinitions.map(definition => [definition.key, {
          ...definition,
          entity: definition.entityId ? entityById[definition.entityId] || null : null,
          reactions: []
        }]));

        const reactionMatching = match => ownReactions.find(match) || null;
        const edgeDefinitions = [
          { from: 'h-ims', to: 'atp-synthase', className: 'proton', match: r => r.from === '膜间隙 H⁺@mito-ims' && r.to === 'ATP 合酶@mito-inner-membrane' },
          { from: 'atp-synthase', to: 'h-matrix', className: 'proton', label: 'H⁺回流', match: r => r.from === '膜间隙 H⁺@mito-ims' && r.to === 'ATP 合酶@mito-inner-membrane' },
          { from: 'adp-matrix', to: 'atp-synthase', className: 'synthesis-input', match: r => r.from === 'ADP@mito-matrix' && r.to === 'ATP@mito-matrix' },
          { from: 'pi-matrix', to: 'atp-synthase', className: 'synthesis-input', match: r => r.from === '无机磷酸@mito-matrix' && r.to === 'ATP@mito-matrix' },
          { from: 'atp-synthase', to: 'atp-matrix', className: 'synthesis-output', label: 'ADP + Pi → ATP', match: r => r.from === 'ATP 合酶@mito-inner-membrane' && r.to === 'ATP@mito-matrix' },
          { from: 'atp-matrix', to: 'ant', className: 'nucleotide-transport', match: r => r.from === 'ATP@mito-matrix' && /ANT|SLC25A4/.test(r.enzyme || '') },
          { from: 'ant', to: 'atp-ims', className: 'nucleotide-transport', label: 'ATP⁴⁻出', match: r => r.from === 'ATP@mito-matrix' && /ANT|SLC25A4/.test(r.enzyme || '') },
          { from: 'adp-ims', to: 'ant', className: 'nucleotide-transport', label: 'ADP³⁻入', match: r => r.from === 'ADP@mito-ims' && /ANT|SLC25A4/.test(r.enzyme || '') },
          { from: 'ant', to: 'adp-matrix', className: 'nucleotide-transport', match: r => r.from === 'ADP@mito-ims' && /ANT|SLC25A4/.test(r.enzyme || '') },
          { from: 'pi-ims', to: 'phosphate-carrier', className: 'phosphate-transport', label: 'Pi + H⁺入', match: r => r.from === '无机磷酸@mito-ims' && /SLC25A3|磷酸载体/.test(r.enzyme || '') },
          { from: 'phosphate-carrier', to: 'pi-matrix', className: 'phosphate-transport', match: r => r.from === '无机磷酸@mito-ims' && /SLC25A3|磷酸载体/.test(r.enzyme || '') },
          { from: 'atp-ims', to: 'vdac', className: 'outer-transport', match: r => r.from === 'ATP@mito-ims' && /VDAC/.test(r.enzyme || '') },
          { from: 'vdac', to: 'atp-cytosol', className: 'outer-transport', match: r => r.from === 'ATP@mito-ims' && /VDAC/.test(r.enzyme || '') },
          { from: 'adp-cytosol', to: 'vdac', className: 'outer-transport', match: r => r.from === 'ADP@cytosol' && /VDAC/.test(r.enzyme || '') },
          { from: 'vdac', to: 'adp-ims', className: 'outer-transport', match: r => r.from === 'ADP@cytosol' && /VDAC/.test(r.enzyme || '') },
          { from: 'pi-cytosol', to: 'vdac', className: 'outer-transport', match: r => r.from === '无机磷酸@cytosol' && /VDAC/.test(r.enzyme || '') },
          { from: 'vdac', to: 'pi-ims', className: 'outer-transport', match: r => r.from === '无机磷酸@cytosol' && /VDAC/.test(r.enzyme || '') }
        ];

        edgeDefinitions.forEach((definition, edgeIndex) => {
          const source = nodeRecords.get(definition.from);
          const target = nodeRecords.get(definition.to);
          if (!source || !target) return;
          const reaction = reactionMatching(definition.match);
          if (reaction) {
            source.reactions.push(reaction);
            target.reactions.push(reaction);
          }
          const edge = studentSvgElement('path', {
            d: studentMapEdgePath(source, target, nodeWidth, nodeHeight),
            class: `student-map-edge oxphos-edge ${definition.className || ''}`,
            'data-edge-from': definition.from,
            'data-edge-to': definition.to,
            'data-reaction': reaction?.id || '',
            'data-step-index': String(Math.min(source.stepIndex, target.stepIndex))
          });
          if (reaction) {
            const openReaction = () => renderStudentReactionDetail(reaction, pathwayId, pathwayReactions.indexOf(reaction));
            edge.setAttribute('role', 'button');
            edge.tabIndex = 0;
            edge.addEventListener('click', event => { event.stopPropagation(); openReaction(); });
            edge.addEventListener('keydown', event => {
              if (event.key !== 'Enter' && event.key !== ' ') return;
              event.preventDefault();
              openReaction();
            });
          }
          studentMapEdges.appendChild(edge);
          applyStudentReactionDirection(edge, reaction, {
            showLabel: Boolean(definition.label),
            labelOffsetY: -10 - (edgeIndex % 2) * 8
          });
          if (definition.label) edge.setAttribute('aria-label', `${definition.label}：${source.label}到${target.label}`);
        });

        nodeRecords.forEach(record => {
          const node = studentSvgElement('g', {
            class: `student-map-node oxphos-node ${record.className || ''}`,
            style: `--tone:${tone}`,
            'data-map-key': record.key,
            'data-entity-id': record.entityId,
            'data-step-index': String(record.stepIndex),
            role: 'button',
            tabindex: '0',
            'aria-label': `${record.label}，${record.meta}`
          });
          node.appendChild(studentSvgElement('title', {}, `${record.label} · ${record.meta}`));
          node.appendChild(studentSvgElement('rect', { x: record.x - nodeWidth / 2, y: record.y - nodeHeight / 2, width: nodeWidth, height: nodeHeight }));
          const name = studentSvgElement('text', { x: record.x, y: record.y + 2, class: 'node-name' }, record.label);
          node.appendChild(name);
          node.appendChild(studentSvgElement('text', { x: record.x, y: record.y + 20, class: 'node-compartment' }, record.meta));
          const reaction = record.reactions[0] || null;
          if (reaction) node.dataset.reaction = reaction.id;
          const selectNode = () => renderStudentNodeSelection(record.entity, reaction, pathwayId, pathwayReactions.indexOf(reaction), record.stepIndex);
          node.addEventListener('click', event => { event.stopPropagation(); selectNode(); });
          node.addEventListener('keydown', event => {
            if (event.key !== 'Enter' && event.key !== ' ') return;
            event.preventDefault();
            selectNode();
          });
          studentMapNodes.appendChild(node);
          fitStudentMapText(name, nodeWidth - 14, 15.5, 9.5);
        });

        const previousPath = studentSvgElement('g', {
          class: 'student-map-next-pathway oxphos-previous-pathway',
          'data-previous-pathway': 'etc',
          role: 'button',
          tabindex: '0',
          'aria-label': '梯度来源：电子传递链'
        });
        previousPath.appendChild(studentSvgElement('rect', { x: 40, y: 238, width: 145, height: 50, rx: 14 }));
        previousPath.appendChild(studentSvgElement('text', { x: 112.5, y: 259, class: 'next-label' }, '梯度来源'));
        previousPath.appendChild(studentSvgElement('text', { x: 112.5, y: 277, class: 'next-name' }, '← 电子传递链'));
        const openEtc = () => renderStudentPathway('etc', { returnToPrimer: false });
        previousPath.addEventListener('click', event => { event.stopPropagation(); openEtc(); });
        previousPath.addEventListener('keydown', event => {
          if (event.key !== 'Enter' && event.key !== ' ') return;
          event.preventDefault();
          openEtc();
        });
        studentMapNodes.appendChild(previousPath);

        studentMapBands.appendChild(studentSvgElement('text', {
          x: 48,
          y: 642,
          class: 'student-map-pan-hint',
          'data-map-hint': 'horizontal'
        }, '横向查看三条机制通道：ATP 合成 · ANT 交换 · Pi/H⁺输入 →'));
        setStudentReadingStep(pathwayId, 0);
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

        const allPathwayReactions = studentReactionsFor(pathwayId);
        const pathwayReactions = visibleReactionRows(pathwayId, allPathwayReactions);
        studentReactionCount.textContent = `${pathwayReactions.length} 个反应`;
        studentReactions.innerHTML = '';
        pathwayReactions.forEach((reaction, index) => {
          const button = document.createElement('button');
          const substrate = entityById[reaction.from], product = entityById[reaction.to];
          button.type = 'button'; button.className = 'student-reaction'; button.dataset.reaction = reaction.id;
          const aliases = visibleReactionAliases(pathwayId, reaction, allPathwayReactions);
          if (aliases.length) button.dataset.reactionAliases = aliases.map(candidate => candidate.id).join(' ');
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

      function studentPathwayIdFromHash() {
        const match = window.location.hash.match(/^#learn=([^&]+)$/i);
        if (!match) return null;
        let pathwayId = '';
        try { pathwayId = decodeURIComponent(match[1]); } catch (_) { return null; }
        return coreStudyPathwaySet.has(pathwayId) ? pathwayId : null;
      }

      function openStudentPathwayFromHash(pathwayId = studentPathwayIdFromHash()) {
        if (!pathwayId) return false;
        setStudentMode(true);
        revealApplication();
        document.body.classList.remove('cover-visible', 'cover-transitioning');
        cellCover.classList.remove('is-exiting');
        cellCover.hidden = true;
        cellCover.setAttribute('inert', '');
        cellCover.setAttribute('aria-hidden', 'true');
        renderStudentPathway(pathwayId, { returnToPrimer: false });
        syncAccessibilityState();
        studentWorkspace.focus({ preventScroll: true });
        return true;
      }

      async function copyStudentPathwayLink() {
        const pathwayId = activeStudentPathway;
        if (!pathwayId || !studentPathwayCopy) return;
        const url = new URL(window.location.href);
        url.hash = `learn=${encodeURIComponent(pathwayId)}`;
        let copied = false;
        try {
          if (navigator.clipboard?.writeText) {
            await navigator.clipboard.writeText(url.href);
            copied = true;
          }
        } catch (_) {}
        if (!copied) {
          const field = document.createElement('textarea');
          field.value = url.href;
          field.setAttribute('readonly', '');
          field.style.position = 'fixed';
          field.style.opacity = '0';
          document.body.appendChild(field);
          field.select();
          try { copied = document.execCommand('copy'); } catch (_) { copied = false; }
          field.remove();
        }
        studentPathwayCopy.textContent = copied ? '已复制链接' : '复制失败，请重试';
        studentPathwayCopy.dataset.copyState = copied ? 'copied' : 'failed';
        window.setTimeout(() => {
          if (!studentPathwayCopy) return;
          studentPathwayCopy.textContent = '复制通路链接';
          delete studentPathwayCopy.dataset.copyState;
        }, 2200);
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
        if (reactionNotePanel) reactionNotePanel.hidden = true;
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
        // 反应白话精讲：按「通路|起点>终点」指纹查表，仅反应详情展示；无精讲时整块隐藏。
        const reactionNote = selectedType === 'reaction' && item.pathwayId && item.from && item.to
          ? (window.STUDENT_REACTION_NOTES || {})[`${item.pathwayId}|${item.from}>${item.to}`]
          : null;
        if (reactionNotePanel) {
          reactionNotePanel.hidden = !reactionNote;
          if (reactionNote) {
            reactionNoteDoing.textContent = displayText(reactionNote.doing || '');
            reactionNoteWhy.textContent = displayText(reactionNote.why || '');
            reactionNoteHook.textContent = displayText(reactionNote.hook || '');
          }
        }
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
        // 从自由探索中的通路入口进入时，同样直达通路机制图；
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
        return target?.parent ? `${hotspot.label || target.title}（进入区室结构）` : (hotspot.label || hotspot.target);
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
          const childScene = atlas.scenes[pathway.scene];
          const entersChild = childScene?.parent === scene.id;
          lane.setAttribute('aria-label', entersChild ? `进入${displayText(childScene.title)}` : `进入${displayText(pathway.name)}机制图`);
          const laneDestination = entersChild
            ? `点击进入：${displayText(childScene.title)}（子区室）`
            : `点击进入：${displayText(pathway.name)} 机制图`;
          lane.addEventListener('mouseenter', () => setSceneSourceHint(laneDestination));
          lane.addEventListener('focus', () => setSceneSourceHint(laneDestination));
          lane.addEventListener('mouseleave', () => setSceneSourceHint(null));
          lane.addEventListener('blur', () => setSceneSourceHint(null));
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
              ? `${displayText(childScene.title)} · 点击进入子区室`
            : `${displayText(pathway.compartment || scene.title || '')} · 点击进入${displayText(pathway.name)}机制图`;
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
        const own = visibleReactionRows(pathwayId, reactions.filter(reaction => groupsFor(reaction).includes(pathwayId)
          && Boolean(expertReactionEndpoints(reaction))));
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
        if (reactionNotePanel) reactionNotePanel.hidden = true;
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
        sceneSubtitle.textContent = '单步反应';
        sceneDescription.textContent = `${displayText(substrate.name)} ${direction} ${displayText(product.name)} · ${displayText(reaction.enzyme || '反应机制')}`;
        if (sceneLevelHint) sceneLevelHint.textContent = '单步反应 · 查看底物、产物与酶';
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
        setSceneSourceIdle('图像加载中 · 知识关系仍来自代谢总图人工核对');
        let settled = false;
        const finish = async () => {
          if (settled) return;
          settled = true;
          try { await sceneBackground.decode(); } catch (_) {}
          if (request !== sceneImageRequest || currentSceneId !== scene.id) return;
          sceneBackground.alt = `${scene.title} · ${label}`;
          syncSceneExpertOverlayGeometry();
          requestAnimationFrame(() => sceneDeck.classList.remove('loading', 'switching'));
          setSceneSourceIdle(`当前视角：${label} · 知识关系：代谢总图人工核对`);
        };
        sceneBackground.onload = finish;
        sceneBackground.onerror = () => {
          if (settled) return;
          settled = true;
          if (request !== sceneImageRequest) return;
          sceneDeck.classList.remove('loading', 'switching');
          setSceneSourceIdle('当前场景图片未加载 · 通路入口仍可使用');
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
        sceneSubtitle.textContent = `通路机制 · ${displayText(pathway.compartment || scene.title || '')}`;
        const scope = displayText(pathway.compartment || scene.title || '');
        const summary = displayText(pathway.summary || '按箭头追踪反应节点、酶与跨区室连接。');
        sceneDescription.textContent = scope ? `${scope} · ${summary}` : summary;
      }

      function setSceneView(index, immediate = false) {
        const scene = atlas.scenes[currentSceneId];
        if (!scene || !scene.views?.length) return;
        sceneDeck.classList.remove('pathway-visual-active', 'pathway-reaction-active', 'pathway-station-active');
        delete sceneDeck.dataset.station;
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
        sceneDeck.classList.remove('pathway-reaction-active', 'pathway-station-active');
        delete sceneDeck.dataset.station;
        sceneDeck.dataset.sceneLevel = '3';
        sceneDeck.dataset.pathway = pathwayId;
        delete sceneDeck.dataset.reaction;
        if (sceneLevelHint) sceneLevelHint.textContent = '通路机制 · 选择反应步骤';
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

      // 五站机制图：在通路机制页内切换独立 2K 图版；反应叠加与热点由 CSS 隐藏，图版自明。
      function setSceneStationVisual(index) {
        const scene = atlas.scenes[currentSceneId];
        const pathwayId = sceneDeck.dataset.pathway;
        const stations = pathwayId ? expertPathwayStationPlates[pathwayId] : null;
        const station = Array.isArray(stations) ? stations[index] : null;
        if (!scene || !station) return false;
        sceneDeck.classList.remove('pathway-reaction-active');
        sceneDeck.classList.add('pathway-visual-active', 'pathway-station-active');
        sceneDeck.dataset.sceneLevel = '3';
        sceneDeck.dataset.station = String(index);
        if (sceneLevelHint) sceneLevelHint.textContent = `五站机制图 · ${station.label}`;
        sceneTitle.textContent = station.label;
        const compartment = displayText(atlas.pathways[pathwayId]?.compartment || scene.title || '');
        sceneSubtitle.textContent = compartment ? `通路机制 · ${compartment}` : '通路机制';
        sceneDescription.textContent = station.caption;
        sceneViews.querySelectorAll('.scene-view').forEach(button => {
          button.classList.toggle('active', button.dataset.stationView === String(index));
        });
        sceneBackground.tabIndex = 0;
        sceneBackground.setAttribute('role', 'button');
        sceneBackground.setAttribute('aria-label', `放大查看${station.label}机制图`);
        loadSceneVisual(scene, station.label, station.src);
        return true;
      }

      function updateSceneBackLabel() {
        if (!sceneBack) return;
        if (sceneDeck.classList.contains('pathway-reaction-active')) {
          sceneBack.textContent = '← 返回通路机制图';
          sceneBack.setAttribute('aria-label', '返回当前通路的机制图');
          return;
        }
        if (sceneDeck.classList.contains('pathway-station-active')) {
          sceneBack.textContent = '← 返回通路机制图';
          sceneBack.setAttribute('aria-label', '返回当前通路的机制图');
          return;
        }
        if (sceneDeck.classList.contains('pathway-visual-active')) {
          sceneBack.textContent = '← 返回通路总览';
        sceneBack.setAttribute('aria-label', '返回当前通路总览');
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
          const stackedLabel = (x, y, lines, className, lineGap = 3.25, attrs = {}) => {
            const node = add('text', { x, y, 'text-anchor': 'middle', class: className, ...attrs });
            lines.forEach((lineValue, index) => {
              const tspan = document.createElementNS(svg, 'tspan');
              tspan.setAttribute('x', x);
              tspan.setAttribute('dy', index === 0 ? '0' : String(lineGap));
              tspan.textContent = lineValue;
              node.appendChild(tspan);
            });
            return node;
          };
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
          if (pathwayId === 'tca') {
            const tcaPoint = (x, y, value, labelY) => {
              add('circle', { cx: x, cy: y, r: 1.05, class: 'schematic-node-halo' });
              add('circle', { cx: x, cy: y, r: .52, class: 'schematic-node', 'aria-label': value });
              label(x, labelY, value, 'schematic-label');
            };
            const p = {
              acetyl: [12, 30], citrate: [34, 28], isocitrate: [58, 28], alphaKg: [82, 35],
              succinyl: [86, 53], succinate: [72, 68], fumarate: [50, 72], malate: [29, 69], oaa: [14, 52]
            };
            label(50, 15, '线粒体基质 · 三羧酸循环八步与每轮收支', 'schematic-title');
            add('rect', { x: 4, y: 19, width: 92, height: 59, rx: 3, class: 'schematic-tca-zone schematic-tca-cycle-zone', 'data-tca-zone': 'cycle' });
            add('rect', { x: 4, y: 80, width: 92, height: 16, rx: 3, class: 'schematic-tca-zone schematic-tca-yield-zone', 'data-tca-zone': 'yield' });

            tcaPoint(...p.acetyl, '乙酰-CoA', 24);
            tcaPoint(...p.citrate, '柠檬酸', 23);
            tcaPoint(...p.isocitrate, '异柠檬酸', 23);
            tcaPoint(...p.alphaKg, 'α-KG', 29);
            tcaPoint(...p.succinyl, '琥珀酰-CoA', 58);
            tcaPoint(...p.succinate, '琥珀酸', 75);
            tcaPoint(...p.fumarate, '延胡索酸', 77);
            tcaPoint(...p.malate, '苹果酸', 75);
            tcaPoint(...p.oaa, 'OAA', 57);

            line(...p.acetyl, ...p.citrate);
            line(...p.oaa, ...p.citrate);
            line(...p.citrate, ...p.isocitrate, true);
            line(...p.isocitrate, ...p.alphaKg);
            line(...p.alphaKg, ...p.succinyl);
            line(...p.succinyl, ...p.succinate, true);
            line(...p.succinate, ...p.fumarate);
            line(...p.fumarate, ...p.malate, true);
            line(...p.malate, ...p.oaa, true);

            label(22, 35, 'CS', 'schematic-enzyme');
            label(46, 35, 'ACO2', 'schematic-enzyme');
            label(70, 36, 'IDH3', 'schematic-enzyme');
            label(84, 44, 'OGDH', 'schematic-enzyme');
            label(82, 64, 'SUCL', 'schematic-enzyme');
            label(61, 65, 'SDH / CII', 'schematic-enzyme');
            label(39, 65, 'FH', 'schematic-enzyme');
            label(22, 61, 'MDH2', 'schematic-enzyme');

            label(16, 86, '每轮净收支', 'schematic-title');
            label(40, 86, '3 NADH · 2 CO₂', 'schematic-output');
            label(65, 86, '1 GTP', 'schematic-output');
            label(84, 86, '1 CoQH₂', 'schematic-output');
            label(23, 93, 'OAA 再生', 'schematic-output');
            label(66, 93, '内膜复合体 II · 酶内 FAD → CoQH₂', 'schematic-output');
          } else if (pathwayId === 'pdh') {
            const pdhPoint = (x, y, value, labelY, className = 'schematic-node-label') => {
              add('circle', { cx: x, cy: y, r: 1.05, class: 'schematic-node-halo' });
              add('circle', { cx: x, cy: y, r: .52, class: 'schematic-node', 'aria-label': value });
              label(x, labelY, value, className);
            };

            label(50, 20, '胞质丙酮酸进入基质，再由 PDH 复合体完成氧化脱羧', 'schematic-title');
            add('rect', { x: 8, y: 27, width: 84, height: 23, rx: 3, class: 'schematic-pdh-zone schematic-pdh-transport-zone', 'data-pdh-zone': 'transport' });
            label(50, 27, '跨膜输入 · VDAC 外膜通道 + MPC/H⁺同向输入', 'schematic-transporter');
            const transport = {
              cytosol: [14, 41], vdac: [32, 41], ims: [50, 41], mpc: [68, 41], matrix: [86, 41]
            };
            pdhPoint(...transport.cytosol, '胞质丙酮酸', 35);
            pdhPoint(...transport.vdac, 'VDAC', 47, 'schematic-transporter');
            pdhPoint(...transport.ims, '膜间隙丙酮酸', 35);
            pdhPoint(...transport.mpc, 'MPC1/2', 47, 'schematic-transporter');
            pdhPoint(...transport.matrix, '基质丙酮酸', 35);
            line(...transport.cytosol, ...transport.vdac, true, 'schematic-route schematic-transporter-route');
            line(...transport.vdac, ...transport.ims, true, 'schematic-route schematic-transporter-route');
            line(...transport.ims, ...transport.mpc, false, 'schematic-route schematic-transporter-route');
            line(...transport.mpc, ...transport.matrix, false, 'schematic-route schematic-transporter-route');
            label(68, 37, 'H⁺', 'schematic-cofactor');

            add('rect', { x: 8, y: 53, width: 84, height: 40, rx: 3, class: 'schematic-pdh-zone schematic-pdh-complex-zone', 'data-pdh-zone': 'complex' });
            label(50, 57, '基质 PDH · 3C → 2C + CO₂ · 不可逆', 'schematic-title');
            const complex = {
              pyruvate: [15, 70], e1: [33, 70], e2: [52, 70], acetylCoa: [72, 70], coa: [86, 58],
              co2: [16, 86], e3: [52, 86], nad: [70, 86], nadh: [88, 86]
            };
            pdhPoint(...complex.pyruvate, '丙酮酸', 64);
            pdhPoint(...complex.e1, 'E1 · TPP', 77, 'schematic-enzyme');
            pdhPoint(...complex.e2, 'E2 · 硫辛酰胺', 64, 'schematic-enzyme');
            pdhPoint(...complex.acetylCoa, '乙酰-CoA', 64);
            pdhPoint(...complex.coa, 'CoA-SH', 63, 'schematic-cofactor');
            pdhPoint(...complex.co2, 'CO₂', 92, 'schematic-output');
            pdhPoint(...complex.e3, 'E3 · FAD', 92, 'schematic-enzyme');
            pdhPoint(...complex.nad, 'NAD⁺', 80, 'schematic-cofactor');
            pdhPoint(...complex.nadh, 'NADH + H⁺', 92, 'schematic-output');
            line(...complex.pyruvate, ...complex.e1);
            line(...complex.e1, ...complex.e2);
            line(...complex.e2, ...complex.acetylCoa);
            line(...complex.coa, ...complex.e2, false, 'schematic-route schematic-cofactor-route');
            routePath('M 33 71 C 30 78, 24 84, 17 86', false, 'schematic-route schematic-cofactor-route');
            routePath('M 52 71 C 57 77, 57 81, 53 85', false, 'schematic-route schematic-cofactor-route');
            line(...complex.nad, ...complex.e3, false, 'schematic-route schematic-cofactor-route');
            line(...complex.e3, ...complex.nadh, false, 'schematic-route schematic-cofactor-route');
            routePath('M 53 84 C 62 80, 63 74, 53 71', false, 'schematic-route schematic-cofactor-route');
            stepBadge(24, 70, 1); stepBadge(43, 70, 2); stepBadge(62, 70, 3); stepBadge(61, 86, 4);
            label(50, 98, '净：CoA-SH + NAD⁺ → 乙酰-CoA + CO₂ + NADH + H⁺', 'schematic-output');
          } else if (pathwayId === 'beta_oxidation') {
            const p = {
              upstream: [10, 18], carnitine: [34, 18], matrixAcyl: [63, 18], spiral: [88, 18],
              acyl: [8, 42], acad: [25, 42], enoyl: [44, 42], hydratase: [63, 42], hydroxy: [84, 42],
              had: [84, 61], keto: [64, 61], thiolase: [44, 61], acetyl: [25, 61], shortened: [8, 61],
              tca: [25, 98], etc: [52, 98], scope: [82, 98]
            };
            label(50, 4.2, '脂肪酸 β-氧化：四步螺旋、电子去向与 C16 碳账本', 'schematic-title');
            [
              [3, 7, 94, 16, 'schematic-beta-zone schematic-beta-entry-zone', 'entry-boundary'],
              [3, 24, 94, 46, 'schematic-beta-zone schematic-beta-cycle-zone', 'four-step-cycle'],
              [3, 71, 94, 21, 'schematic-beta-zone schematic-beta-ledger-zone', 'spiral-ledger'],
              [3, 93, 94, 6, 'schematic-beta-zone schematic-beta-output-zone', 'pathway-outputs']
            ].forEach(([x, y, width, height, className, zone]) => add('rect', { x, y, width, height, rx: 3, class: className, 'data-beta-oxidation-zone': zone }));
            label(6, 10.5, '入口边界 · 基质侧', 'schematic-compartment-title', { 'text-anchor': 'start' });
            label(6, 27.5, '四步螺旋 · 每轮链长 −2C', 'schematic-compartment-title', { 'text-anchor': 'start' });

            namedNode(...p.upstream, '上游边界', 'upstream'); namedNode(...p.carnitine, '肉碱穿梭', 'carnitine');
            metabolite(...p.matrixAcyl, '基质脂酰-CoA'); namedNode(...p.spiral, '四步螺旋', 'spiral');
            line(...p.upstream, ...p.carnitine, false, 'schematic-route schematic-transporter-route');
            line(...p.carnitine, ...p.matrixAcyl, false, 'schematic-route schematic-transporter-route');
            line(...p.matrixAcyl, ...p.spiral);
            label(50, 22.3, '上游：活化 + 肉碱穿梭 · ATP→AMP+PPi 不计入本循环', 'schematic-note');

            metabolite(...p.acyl, '脂酰-CoA'); namedNode(...p.acad, 'ACAD', 'acad');
            metabolite(...p.enoyl, 'trans-Δ²-烯酰-CoA'); namedNode(...p.hydratase, '水合酶', 'hydratase');
            metabolite(...p.hydroxy, 'L-β-羟脂酰-CoA'); namedNode(...p.had, 'HAD', 'had');
            metabolite(...p.keto, 'β-酮脂酰-CoA'); namedNode(...p.thiolase, '硫解酶', 'thiolase');
            metabolite(...p.acetyl, '乙酰-CoA'); metabolite(...p.shortened, '缩短脂酰-CoA');
            line(...p.acyl, ...p.acad); line(...p.acad, ...p.enoyl);
            line(...p.enoyl, ...p.hydratase); line(...p.hydratase, ...p.hydroxy);
            line(...p.hydroxy, ...p.had); line(...p.had, ...p.keto);
            line(...p.keto, ...p.thiolase); line(...p.thiolase, ...p.acetyl);
            line(...p.thiolase, ...p.shortened);
            routePath('M 7 60 C 1 55, 1 48, 7 43', false, 'schematic-route schematic-cycle-route');
            label(27, 34.2, '脂酰-CoA 脱氢酶 · 酶内 FAD → ETF → ETF:QO → CoQ', 'schematic-cofactor');
            label(76, 34.2, '烯酰-CoA 水合酶 · H₂O', 'schematic-cofactor');
            label(78, 68.2, 'β-羟脂酰-CoA 脱氢酶 · NAD⁺ → NADH + H⁺', 'schematic-cofactor');
            label(39, 68.2, 'β-酮硫解酶 · CoA-SH', 'schematic-cofactor');
            label(10, 68.2, '缩短 2C，返回下一轮', 'schematic-output');
            stepBadge(34, 45.5, 1); stepBadge(72, 45.5, 2); stepBadge(75, 58, 3); stepBadge(53, 58, 4);

            stackedLabel(50, 74.1, [
              '每轮与 C16 总账',
              '每轮：1 乙酰-CoA + 1 NADH + 1 对电子进入 CoQ',
              'C16 → C14 → C12 → C10 → C8 → C6 → C4',
              '末轮 C4 → 2 乙酰-CoA',
              '7 轮 → 8 乙酰-CoA + 7 NADH + 7 对电子进入 CoQ',
              'β-氧化本身不直接产生 ATP'
            ], 'schematic-output', 3.35);

            namedNode(...p.tca, '→ TCA', 'tca'); namedNode(...p.etc, '→ 呼吸链', 'etc'); namedNode(...p.scope, '饱和偶数链主线', 'scope');
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
            label(25, 54, 'NADH 脱氢', 'schematic-enzyme'); label(23, 91, '琥珀酸脱氢 · 酶内 FAD', 'schematic-cofactor');
            label(38, 62, 'CoQ 还原', 'schematic-cofactor'); label(67, 52, 'Q循环', 'schematic-enzyme');
            label(78, 39, '可移动电子载体', 'schematic-cofactor'); label(91, 62, '末端受体', 'schematic-enzyme');
            stepBadge(23, 61, 1); stepBadge(38, 70, 2); stepBadge(55, 62, 3); stepBadge(78, 54, 4);
            label(60, 94, '电子方向：NADH / 琥珀酸 → CoQ → 复合体 III → Cyt c → O₂', 'schematic-output');
          } else if (pathwayId === 'oxphos') {
            const p = {
              // viewBox 是 0 0 100 100：任何 x>100 的节点和居中标签都会被裁掉，
              // ATP 合酶保留在最右侧，其余两种载体向左拉开，避免名称与方向标注重叠。
              hHigh: [94, 36], hLow: [92, 78], atpSynthase: [90, 56],
              adpMatrix: [84, 70], piMatrix: [68, 78], atpMatrix: [77, 72],
              ant: [74, 56], atpIms: [82, 24], adpIms: [68, 36],
              piCarrier: [56, 56], piIms: [48, 24], piImported: [60, 70]
            };
            label(58, 7, '线粒体内膜 · 氧化磷酸化', 'schematic-title');
            label(25, 17, '膜间隙：质子动力势（Δψ + ΔpH）', 'schematic-enzyme');
            label(22, 88, '基质：F₁ 催化侧', 'schematic-enzyme');

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
            routePath('M 91.5 58 C 91 65, 86 69, 78.5 71.6', false, 'schematic-route');

            label(91, 16, 'H⁺回流驱动转子', 'schematic-cofactor');
            label(74, 48, 'ATP⁴⁻出 / ADP³⁻入', 'schematic-exchange');
            label(56, 41, 'Pi + H⁺入基质', 'schematic-exchange');
            label(81, 84, 'ADP + Pi → ATP', 'schematic-output');
            stepBadge(96, 46, 1); stepBadge(92, 82, 2); stepBadge(78, 51, 3); stepBadge(59, 48, 4);
            label(55, 97, '化学渗透偶联：质子回流、ATP 合成与核苷酸/磷酸转运分开定位', 'schematic-output');
          } else if (pathwayId === 'carnitine') {
            const p = {
              malonyl: [10, 18], acylCoaCyt: [28, 18], carnitineCyt: [28, 25], cpt1: [52, 18],
              acylCarnCyt: [77, 18], coaCyt: [77, 25], outerAcylCarn: [25, 38], vdac: [50, 38], acylCarnIms: [75, 38],
              antiportAcylIms: [12, 54], cact: [50, 54], antiportAcylMatrix: [88, 53],
              carnitineMatrixReturn: [88, 61], carnitineImsReturn: [12, 62],
              cpt2AcylCarn: [10, 77], coaMatrix: [28, 82], cpt2: [48, 77],
              acylCoaMatrix: [72, 74], carnitineMatrix: [72, 82], betaOxidation: [93, 74]
            };
            label(50, 4.2, '肉碱穿梭：长链脂酰-CoA不跨内膜；跨膜形式是脂酰肉碱', 'schematic-title');
            [
              [3, 7, 94, 20, 'schematic-carnitine-zone schematic-carnitine-cytosol-zone', 'cytosol-gate'],
              [3, 28, 94, 14, 'schematic-carnitine-zone schematic-carnitine-outer-zone', 'outer-membrane'],
              [3, 43, 94, 22, 'schematic-carnitine-zone schematic-carnitine-inner-zone', 'inner-membrane-exchange'],
              [3, 66, 94, 19, 'schematic-carnitine-zone schematic-carnitine-matrix-zone', 'matrix-handoff'],
              [3, 86, 94, 13, 'schematic-carnitine-zone schematic-carnitine-net-zone', 'net']
            ].forEach(([x, y, width, height, className, zone]) => add('rect', { x, y, width, height, rx: 3, class: className, 'data-carnitine-zone': zone }));
            label(6, 10.5, '① 胞质侧 CPT1 门控', 'schematic-compartment-title', { 'text-anchor': 'start' });
            label(75, 10.5, 'malonyl-CoA ┤ CPT1', 'schematic-note');
            label(6, 30.5, '② 外膜 / 膜间隙', 'schematic-compartment-title', { 'text-anchor': 'start' });
            label(6, 46.5, '③ CACT / SLC25A20 · 内膜反向交换', 'schematic-compartment-title', { 'text-anchor': 'start' });
            label(6, 69.5, '④ 基质侧 CPT2 交接', 'schematic-compartment-title', { 'text-anchor': 'start' });
            label(6, 88.5, '净账与能量边界', 'schematic-compartment-title', { 'text-anchor': 'start' });

            metabolite(...p.malonyl, 'malonyl-CoA'); metabolite(...p.acylCoaCyt, '长链脂酰-CoA');
            metabolite(...p.carnitineCyt, '游离肉碱'); namedNode(...p.cpt1, 'CPT1', 'cpt1');
            metabolite(...p.acylCarnCyt, '脂酰肉碱'); metabolite(...p.coaCyt, '胞质 CoA 池');
            line(...p.acylCoaCyt, ...p.cpt1); routePath('M 29 24 C 37 23, 44 20, 51 18.5', true, 'schematic-route');
            line(...p.cpt1, ...p.acylCarnCyt); routePath('M 53 18.5 C 61 22, 69 25, 76 25', true, 'schematic-route');
            routePath('M 11 18 C 24 13, 39 13, 51 17', false, 'schematic-route schematic-inhibition-route');
            label(52, 25.2, 'CPT1 · 外膜胞质侧', 'schematic-transporter');

            metabolite(...p.outerAcylCarn, '脂酰肉碱'); namedNode(...p.vdac, 'VDAC', 'vdac'); metabolite(...p.acylCarnIms, '脂酰肉碱');
            line(...p.outerAcylCarn, ...p.vdac, true, 'schematic-route schematic-transporter-route');
            line(...p.vdac, ...p.acylCarnIms, true, 'schematic-route schematic-transporter-route');
            label(50, 41, 'VDAC · 外膜通道', 'schematic-transporter');

            metabolite(...p.antiportAcylIms, '脂酰肉碱'); namedNode(...p.cact, 'CACT', 'cact');
            metabolite(...p.antiportAcylMatrix, '脂酰肉碱'); metabolite(...p.carnitineMatrixReturn, '游离肉碱');
            metabolite(...p.carnitineImsReturn, '游离肉碱');
            line(...p.antiportAcylIms, ...p.cact, true, 'schematic-route schematic-transporter-route');
            line(...p.cact, ...p.antiportAcylMatrix, true, 'schematic-route schematic-transporter-route');
            routePath('M 87 60 C 75 62, 63 60, 51 55', true, 'schematic-route schematic-transporter-route schematic-carnitine-return-route');
            routePath('M 49 55 C 37 60, 25 62, 13 62', true, 'schematic-route schematic-transporter-route schematic-carnitine-return-route');
            label(31, 58.2, '脂酰肉碱入基质', 'schematic-output');
            label(69, 63, '游离肉碱向外', 'schematic-output');

            metabolite(...p.cpt2AcylCarn, '脂酰肉碱'); metabolite(...p.coaMatrix, '基质 CoA 池'); namedNode(...p.cpt2, 'CPT2', 'cpt2');
            metabolite(...p.acylCoaMatrix, '长链脂酰-CoA'); metabolite(...p.carnitineMatrix, '游离肉碱'); namedNode(...p.betaOxidation, 'β-氧化', 'beta-oxidation');
            line(...p.cpt2AcylCarn, ...p.cpt2, true); routePath('M 29 81 C 36 80, 42 78, 47 77.5', true, 'schematic-route');
            line(...p.cpt2, ...p.acylCoaMatrix, true); routePath('M 49 77.5 C 57 80, 64 82, 71 82', true, 'schematic-route');
            line(...p.acylCoaMatrix, ...p.betaOxidation);
            label(48, 83.2, 'CPT2 · 内膜基质侧', 'schematic-transporter');
            label(86, 82.5, '→ β-氧化', 'schematic-output');

            label(18, 93.8, 'CoA 不跨内膜', 'schematic-cofactor');
            label(48, 93.8, '游离肉碱循环再用', 'schematic-output');
            label(82, 93.8, '穿梭本身不额外耗 ATP', 'schematic-output');
            label(25, 99.1, 'ACSL 激活：ATP → AMP + PPi', 'schematic-note');
            label(75, 99.1, '净：长链脂酰基 → 基质', 'schematic-output');
            stepBadge(52, 21.2, 1); stepBadge(50, 34.2, 2); stepBadge(50, 58.2, 3); stepBadge(48, 80.2, 4);
          } else if (pathwayId === 'ketone') {
            const p = {
              acetyl2: [8, 19], thiolaseL: [22, 19], acetoacetylL: [38, 19], hmgcs2: [54, 19],
              hmgcoa: [70, 19], hmgcl: [86, 19], acacL: [68, 37], bdh1L: [82, 37], bhbL: [94, 37],
              mctOut: [16, 55], bloodKetones: [50, 55], mctIn: [84, 55],
              bhbP: [8, 72], bdh1P: [21, 72], acacP: [34, 72], scot: [52, 72],
              acetoacetylP: [69, 72], thiolaseP: [84, 72], acetyl2P: [95, 72]
            };
            label(50, 4.2, '酮体代谢：肝线粒体生成 → 血液运输 → 外周线粒体利用', 'schematic-title');
            [
              [3, 7, 94, 37, 'schematic-ketone-zone schematic-ketone-liver-zone', 'hepatic-ketogenesis'],
              [3, 45, 94, 15, 'schematic-ketone-zone schematic-ketone-blood-zone', 'circulation-redox'],
              [3, 61, 94, 26, 'schematic-ketone-zone schematic-ketone-periphery-zone', 'extrahepatic-ketolysis'],
              [3, 88, 94, 11, 'schematic-ketone-zone schematic-ketone-boundary-zone', 'tissue-boundary']
            ].forEach(([x, y, width, height, className, zone]) => add('rect', { x, y, width, height, rx: 3, class: className, 'data-ketone-zone': zone }));
            label(6, 10.5, '肝线粒体 · 生成', 'schematic-compartment-title', { 'text-anchor': 'start' });

            metabolite(...p.acetyl2, '2 乙酰-CoA'); namedNode(...p.thiolaseL, '硫解酶', 'liver-thiolase');
            metabolite(...p.acetoacetylL, '乙酰乙酰-CoA'); namedNode(...p.hmgcs2, 'HMGCS2', 'hmgcs2');
            metabolite(...p.hmgcoa, 'HMG-CoA'); namedNode(...p.hmgcl, 'HMGCL', 'hmgcl');
            metabolite(...p.acacL, '乙酰乙酸'); namedNode(...p.bdh1L, 'BDH1', 'liver-bdh1'); metabolite(...p.bhbL, 'D-β-羟丁酸');
            line(...p.acetyl2, ...p.thiolaseL); line(...p.thiolaseL, ...p.acetoacetylL);
            line(...p.acetoacetylL, ...p.hmgcs2); line(...p.hmgcs2, ...p.hmgcoa); line(...p.hmgcoa, ...p.hmgcl);
            routePath('M 86 20 C 84 27, 77 34, 69 36', false, 'schematic-route');
            line(...p.acacL, ...p.bdh1L, true); line(...p.bdh1L, ...p.bhbL, true);
            stepBadge(22, 23.2, 1); stepBadge(54, 23.2, 2); stepBadge(86, 23.2, 3); stepBadge(82, 40.8, 4);
            label(50, 29.5, 'HMGCS2 加入第 3 个乙酰-CoA；HMGCL 返还 1 个 · 净耗 2 乙酰-CoA', 'schematic-enzyme');
            label(50, 42.3, 'BDH1 · NADH + H⁺ → NAD⁺ · 丙酮 · 少量旁支', 'schematic-cofactor');

            label(50, 47.2, 'MCT · 血液运输', 'schematic-transporter');
            namedNode(...p.mctOut, 'MCT 输出', 'mct-out'); namedNode(...p.bloodKetones, 'AcAc / D-βOHB', 'blood-ketones'); namedNode(...p.mctIn, 'MCT 摄取', 'mct-in');
            line(...p.mctOut, ...p.bloodKetones, true, 'schematic-route schematic-transporter-route');
            line(...p.bloodKetones, ...p.mctIn, true, 'schematic-route schematic-transporter-route');

            label(6, 64.5, '外周线粒体 · 利用', 'schematic-compartment-title', { 'text-anchor': 'start' });
            metabolite(...p.bhbP, 'D-βOHB'); namedNode(...p.bdh1P, 'BDH1', 'periphery-bdh1');
            metabolite(...p.acacP, '乙酰乙酸'); namedNode(...p.scot, 'SCOT / OXCT1', 'scot');
            metabolite(...p.acetoacetylP, '乙酰乙酰-CoA'); namedNode(...p.thiolaseP, '硫解酶', 'periphery-thiolase'); metabolite(...p.acetyl2P, '2 乙酰-CoA');
            line(...p.bhbP, ...p.bdh1P, true); line(...p.bdh1P, ...p.acacP, true);
            line(...p.acacP, ...p.scot); line(...p.scot, ...p.acetoacetylP); line(...p.acetoacetylP, ...p.thiolaseP); line(...p.thiolaseP, ...p.acetyl2P);
            stepBadge(21, 75.8, 5); stepBadge(52, 75.8, 6); stepBadge(84, 75.8, 7);
            stackedLabel(50, 79.2, [
              'BDH1 · NAD⁺ → NADH + H⁺',
              'SCOT / OXCT1 · 琥珀酰-CoA → 琥珀酸 · SCOT 不直接耗 ATP',
              '2 乙酰-CoA → TCA'
            ], 'schematic-output', 3.35);

            stackedLabel(50, 91.2, [
              '肝缺少 SCOT · 只净输出，不消费自己生成的酮体',
              '红细胞无线粒体，不能利用',
              '心 / 肌 / 肾 / 脑可利用'
            ], 'schematic-note', 3.25);
          } else if (pathwayId === 'urea') {
            const p = {
              ammonia: [7, 16], bicarbonate: [19, 16], nag: [32, 16], cps1: [47, 16], carbamoylP: [64, 16],
              ornM: [69, 22.5], otc: [83, 22.5], citM: [95, 22.5],
              ornCExchange: [10, 40], ornt1: [28, 40], citCExchange: [45, 40],
              glutamateH: [58, 46], citrin: [73, 39], aspExchange: [92, 39],
              citC: [7, 63.5], asp: [19, 63.5], ass1: [32, 63.5], argSucc: [50, 63.5], asl: [68, 63.5], arginine: [86, 63.5],
              fumarate: [44, 77], ornC: [62, 77], urea: [80, 77], arg1: [94, 77]
            };
            label(50, 3.7, '尿素循环 · 两区室五步 · 两台内膜载体', 'schematic-title');
            [
              [3, 6, 94, 23, 'schematic-urea-zone schematic-urea-matrix-zone', 'matrix-entry'],
              [3, 31, 94, 18, 'schematic-urea-zone schematic-urea-membrane-zone', 'inner-membrane-exchange'],
              [3, 51, 94, 30, 'schematic-urea-zone schematic-urea-cytosol-zone', 'cytosolic-cycle'],
              [3, 83, 94, 16, 'schematic-urea-zone schematic-urea-ledger-zone', 'atom-energy-ledger']
            ].forEach(([x, y, width, height, className, zone]) => add('rect', { x, y, width, height, rx: 3, class: className, 'data-urea-zone': zone }));

            label(6, 7.9, '线粒体基质 · 入口两步', 'schematic-compartment-title', { 'text-anchor': 'start' });
            metabolite(...p.ammonia, 'NH₄⁺'); metabolite(...p.bicarbonate, 'HCO₃⁻'); namedNode(...p.nag, 'NAG', 'nag');
            namedNode(...p.cps1, 'CPS1', 'cps1'); metabolite(...p.carbamoylP, '氨甲酰磷酸');
            metabolite(...p.ornM, '鸟氨酸'); namedNode(...p.otc, 'OTC', 'otc'); metabolite(...p.citM, '瓜氨酸');
            line(...p.ammonia, ...p.cps1); line(...p.bicarbonate, ...p.cps1);
            line(...p.nag, ...p.cps1, false, 'schematic-route schematic-cofactor-route');
            line(...p.cps1, ...p.carbamoylP); line(...p.carbamoylP, ...p.otc); line(...p.ornM, ...p.otc); line(...p.otc, ...p.citM);
            label(25, 27, 'NH₄⁺ + HCO₃⁻ + 2 ATP', 'schematic-enzyme', { 'data-role': 'cps1-label' });
            label(50, 27, 'NAGS / NAG · NAG 必需变构激活', 'schematic-cofactor');
            label(79, 27, '鸟氨酸 + 氨甲酰磷酸 → 瓜氨酸', 'schematic-enzyme');
            stepBadge(47, 20.5, 1); stepBadge(83, 26.1, 2);

            label(6, 32.5, '线粒体内膜 · 两台载体', 'schematic-compartment-title', { 'text-anchor': 'start' });
            metabolite(...p.ornCExchange, '鸟氨酸'); namedNode(...p.ornt1, 'ORNT1', 'ornt1'); metabolite(...p.citCExchange, '瓜氨酸');
            metabolite(...p.glutamateH, '谷氨酸 + H⁺'); namedNode(...p.citrin, 'citrin', 'citrin'); metabolite(...p.aspExchange, '天冬氨酸');
            line(...p.ornCExchange, ...p.ornt1, true, 'schematic-route schematic-transporter-route');
            line(...p.ornt1, ...p.citCExchange, true, 'schematic-route schematic-transporter-route');
            routePath('M 28 40 C 40 44, 55 45, 68 40', true, 'schematic-route schematic-transporter-route');
            line(...p.citrin, ...p.aspExchange, true, 'schematic-route schematic-transporter-route');
            label(26, 44.4, 'ORNT1 / SLC25A15', 'schematic-transporter', { 'data-role': 'ornt1-label' });
            label(26, 47.7, '鸟氨酸入 / 瓜氨酸出', 'schematic-exchange', { 'data-role': 'ornt1-exchange' });
            label(75, 44.4, 'citrin / SLC25A13', 'schematic-transporter', { 'data-role': 'citrin-label' });
            label(75, 47.7, '天冬氨酸出 / 谷氨酸 + H⁺入', 'schematic-exchange');
            stepBadge(28, 43, 3);

            label(6, 54.3, '胞质 · 循环后三步', 'schematic-compartment-title', { 'text-anchor': 'start' });
            metabolite(...p.citC, '瓜氨酸'); metabolite(...p.asp, '天冬氨酸'); namedNode(...p.ass1, 'ASS1', 'ass1');
            metabolite(...p.argSucc, '精氨代琥珀酸'); namedNode(...p.asl, 'ASL', 'asl'); metabolite(...p.arginine, '精氨酸');
            metabolite(...p.fumarate, '延胡索酸'); metabolite(...p.ornC, '鸟氨酸'); metabolite(...p.urea, '尿素'); namedNode(...p.arg1, 'ARG1', 'arg1');
            line(...p.citC, ...p.ass1); line(...p.asp, ...p.ass1); line(...p.ass1, ...p.argSucc); line(...p.argSucc, ...p.asl);
            line(...p.asl, ...p.arginine); routePath('M 68 62 C 62 68, 54 74, 45 76', false, 'schematic-route');
            routePath('M 86 62 C 90 66, 92 71, 94 76', false, 'schematic-route');
            line(...p.arg1, ...p.urea); routePath('M 93 77 C 82 81, 73 80, 63 78', false, 'schematic-route');
            routePath('M 61 76 C 48 70, 34 58, 29 40', false, 'schematic-route schematic-transporter-route');
            label(28, 69.2, 'ASS1 · ATP → AMP + PPi', 'schematic-enzyme', { 'data-role': 'ass1-label' });
            label(65, 69.2, 'ASL · 精氨酸 + 延胡索酸', 'schematic-enzyme');
            label(78, 80.5, 'ARG1 · H₂O → 尿素 + 鸟氨酸', 'schematic-enzyme');
            stepBadge(32, 64.9, 4); stepBadge(94, 72.3, 5);

            label(6, 84, '原子来源 · 能量账 · 旁路', 'schematic-compartment-title', { 'text-anchor': 'start' });
            label(50, 89.5, '第 1 份氮 · NH₄⁺    第 2 份氮 · 天冬氨酸    羰基碳 · HCO₃⁻', 'schematic-output');
            label(20, 95.2, '3 ATP / 4 个高能磷酸键', 'schematic-cofactor');
            label(68, 95.2, '天冬氨酸—精氨代琥珀酸旁路', 'schematic-note');
          } else if (pathwayId === 'aa_carbon') {
            const cards = [
              { key: 'pyruvate', x: 5, y: 27, source: [13, 32], target: [39, 32], sourceLabel: '6 种', targetLabel: '丙酮酸', mapping: 'Ala · Cys · Gly · Ser · Thr · Trp', step: 1, kind: 'glucogenic' },
              { key: 'akg', x: 52, y: 27, source: [60, 32], target: [87, 32], sourceLabel: '5 种', targetLabel: 'α-酮戊二酸', mapping: 'Arg · Glu · Gln · His · Pro', step: 4, kind: 'glucogenic' },
              { key: 'succinyl', x: 5, y: 38, source: [13, 43], target: [39, 43], sourceLabel: '4 种', targetLabel: '琥珀酰-CoA', mapping: 'Ile · Met · Thr · Val', step: 5, kind: 'glucogenic' },
              { key: 'fumarate', x: 52, y: 38, source: [60, 43], target: [87, 43], sourceLabel: '2 种', targetLabel: '延胡索酸', mapping: 'Phe · Tyr', step: 6, kind: 'dual' },
              { key: 'oaa', x: 5, y: 49, source: [13, 54], target: [39, 54], sourceLabel: '2 种', targetLabel: '草酰乙酸', mapping: 'Asp · Asn', step: 7, kind: 'glucogenic' },
              { key: 'acetyl', x: 52, y: 49, source: [60, 54], target: [87, 54], sourceLabel: '生酮支路', targetLabel: '乙酰-CoA', mapping: 'Leu · Ile · Thr · Trp 等', step: 2, kind: 'ketogenic' },
              { key: 'acetoacetate', x: 28.5, y: 60, source: [37, 65], target: [64, 65], sourceLabel: '生酮支路', targetLabel: '乙酰乙酸 / 乙酰乙酰-CoA', mapping: 'Leu · Lys · Phe · Tyr · Trp', step: 3, kind: 'ketogenic' }
            ];
            label(50, 4.4, '氨基酸碳骨架归宿 · 7 类中央代谢入口与生糖 / 生酮边界', 'schematic-title');
            [
              [3, 7, 94, 14, 'schematic-aa-carbon-zone schematic-aa-carbon-nitrogen-zone', 'nitrogen-handoff'],
              [3, 23, 94, 47, 'schematic-aa-carbon-zone schematic-aa-carbon-gateway-zone', 'seven-gateways'],
              [3, 72, 94, 11, 'schematic-aa-carbon-zone schematic-aa-carbon-fate-zone', 'metabolic-fates'],
              [3, 85, 94, 13, 'schematic-aa-carbon-zone schematic-aa-carbon-ledger-zone', 'classification-ledger']
            ].forEach(([x, y, width, height, className, zone]) => add('rect', { x, y, width, height, rx: 3, class: className, 'data-aa-carbon-zone': zone }));

            namedNode(11, 14, '氨基酸', 'amino-acids');
            namedNode(29, 14, '转氨 / 脱氨', 'nitrogen-removal');
            namedNode(48, 14, '碳骨架', 'carbon-skeleton');
            namedNode(68, 14, '多条分解路径 · 非统一载体', 'multiple-pathways');
            namedNode(90, 14, '七入口', 'seven-gateways');
            line(11, 14, 29, 14); line(29, 14, 48, 14); line(48, 14, 68, 14); line(68, 14, 90, 14);
            label(29, 20, '氮 → 尿素循环', 'schematic-enzyme');
            label(68, 20, '区室依具体路径而异', 'schematic-note');

            cards.forEach(card => {
              add('rect', { x: card.x, y: card.y, width: 43, height: 10, rx: 2, class: `schematic-aa-carbon-card is-${card.kind}`, 'data-aa-carbon-card': card.key });
              namedNode(...card.source, card.sourceLabel, `${card.key}-source`);
              namedNode(...card.target, card.targetLabel, `${card.key}-target`);
              line(...card.source, ...card.target, false, card.kind === 'ketogenic' ? 'schematic-route schematic-cofactor-route' : 'schematic-route');
              label(card.x + 21.5, card.y + 8.8, card.mapping, card.kind === 'ketogenic' ? 'schematic-output' : card.kind === 'dual' ? 'schematic-cofactor' : 'schematic-note');
              stepBadge(card.x + 2.7, card.y + 2.5, card.step);
            });

            label(5, 73.8, '③ 三类代谢命运', 'schematic-compartment-title', { 'text-anchor': 'start' });
            namedNode(18, 81, '生糖 · 可形成糖异生前体', 'glucogenic-fate');
            namedNode(50, 81, 'TCA 氧化 / 补充循环', 'oxidative-fate');
            namedNode(82, 81, '生酮 · 乙酰-CoA不能净生糖', 'ketogenic-fate');

            namedNode(18, 91, '纯生酮 · Leu / Lys', 'ketogenic-only');
            namedNode(53, 91, '兼具两类 · Ile / Phe / Thr / Trp / Tyr', 'dual-class');
            namedNode(86, 91, '其余为生糖', 'glucogenic-only');
            label(50, 96, '教学分类映射 · 不表示单一反应或统一计量', 'schematic-output');
          } else if (pathwayId === 'transamination') {
            const q = {
              amino: [7, 21], akgC: [7, 30], transferase: [29, 25.5], keto: [52, 21], glutamateC: [52, 30],
              glutamateTransportC: [12, 46], carrier: [50, 46], proton: [50, 41], glutamateTransportM: [88, 46],
              glutamateM: [9, 64], gdh: [30, 64], akgM: [52, 60], ammonia: [52, 72], nadp: [72, 60], nadh: [72, 72],
              firstNitrogen: [8, 89], cps1: [25, 89], aspartate: [47, 89], urea: [68, 89], tca: [91, 89]
            };
            label(50, 4.2, '转氨与氧化脱氨：氨基汇聚 → 基质释放 → 尿素交接', 'schematic-title');
            [
              [3, 7, 94, 28, 'schematic-transamination-zone schematic-transamination-transfer-zone', 'amino-transfer'],
              [3, 37, 94, 14, 'schematic-transamination-zone schematic-transamination-membrane-zone', 'inner-membrane-entry'],
              [3, 53, 94, 24, 'schematic-transamination-zone schematic-transamination-matrix-zone', 'matrix-deamination'],
              [3, 79, 94, 19, 'schematic-transamination-zone schematic-transamination-handoff-zone', 'urea-handoff']
            ].forEach(([x, y, width, height, className, zone]) => add('rect', { x, y, width, height, rx: 3, class: className, 'data-transamination-zone': zone }));

            label(5, 56.5, '③ 基质 · GDH 氧化脱氨', 'schematic-compartment-title', { 'text-anchor': 'start' });
            label(50, 81.5, '④ 尿素两份氮与 α-KG 碳骨架交接', 'schematic-compartment-title');

            metabolite(...q.amino, '氨基酸'); metabolite(...q.akgC, 'α-酮戊二酸');
            metabolite(...q.keto, '对应 α-酮酸'); metabolite(...q.glutamateC, '谷氨酸（胞质）');
            namedNode(...q.transferase, '氨基转移酶', 'aminotransferase');
            metabolite(...q.glutamateTransportC, '谷氨酸（胞质）'); namedNode(...q.carrier, 'GC1 / GC2', 'glutamate-carrier');
            metabolite(...q.glutamateTransportM, '谷氨酸（基质）');
            metabolite(...q.glutamateM, '谷氨酸'); metabolite(...q.akgM, 'α-KG');
            metabolite(...q.ammonia, 'NH₄⁺');
            namedNode(...q.gdh, 'GDH / GLUD', 'glutamate-dehydrogenase');
            metabolite(...q.firstNitrogen, 'NH₄⁺'); namedNode(...q.cps1, 'CPS1', 'cps1');
            metabolite(...q.aspartate, '天冬氨酸'); namedNode(...q.urea, '尿素循环', 'urea-cycle');
            metabolite(...q.tca, 'α-KG');

            line(...q.amino, ...q.transferase, true); line(...q.akgC, ...q.transferase, true);
            line(...q.transferase, ...q.keto, true); line(...q.transferase, ...q.glutamateC, true);
            line(...q.glutamateTransportC, ...q.carrier, false, 'schematic-route schematic-transporter-route');
            line(...q.carrier, ...q.glutamateTransportM, false, 'schematic-route schematic-transporter-route');
            line(...q.glutamateM, ...q.gdh);
            line(...q.gdh, ...q.akgM); line(...q.gdh, ...q.ammonia);
            line(...q.firstNitrogen, ...q.cps1); line(...q.aspartate, ...q.urea); line(...q.cps1, ...q.urea);

            label(29, 13.5, '① 胞质转氨：氨基酸 + α-KG ⇌ α-酮酸 + 谷氨酸', 'schematic-output');
            stackedLabel(76, 13.5, ['ALT / GPT', '丙氨酸氨基转移酶', '丙氨酸 ⇌ 丙酮酸'], 'schematic-enzyme', 3.25);
            stackedLabel(76, 25.5, ['AST / GOT', '天冬氨酸氨基转移酶', '天冬氨酸 ⇌ 草酰乙酸'], 'schematic-enzyme', 3.25);
            label(29, 33.5, 'PLP · 酶结合辅酶 · 转氨不释放游离 NH₄⁺', 'schematic-cofactor');
            label(75, 49.5, 'SLC25A22 / SLC25A18', 'schematic-transporter');
            label(32, 49.5, '② 谷氨酸 + H⁺入基质', 'schematic-transporter');
            stackedLabel(82, 58.5, ['谷氨酸脱氢酶', 'GTP 抑制', 'ADP / 亮氨酸激活'], 'schematic-note', 5.5);
            label(45, 76, 'NAD(P)⁺ + H₂O → NAD(P)H + H⁺', 'schematic-cofactor');
            label(16, 97, 'NH₄⁺ → CPS1 · 尿素第 1 份氮', 'schematic-output');
            label(55, 97, '天冬氨酸 · 尿素第 2 份氮', 'schematic-output');
            label(86, 97, 'α-KG → TCA / 转氨受体池', 'schematic-output');
            stepBadge(29, 18, 1); stepBadge(50, 43, 2); stepBadge(30, 59, 3); stepBadge(68, 84, 4);
          } else if (pathwayId === 'glycolysis') {
            const p = {
              glucose: [9, 31], g6p: [25, 31], f6p: [41, 31], f16bp: [58, 31],
              dhap: [73, 27], gap: [89, 34], bpg: [88, 54], pg3: [72, 67],
              pg2: [55, 67], pep: [38, 56], pyruvate: [18, 52]
            };
            label(50, 13, '细胞质 · 糖酵解十步 · 一分子葡萄糖的能量账', 'schematic-title');
            add('rect', { x: 4, y: 18, width: 62, height: 22, rx: 3, class: 'schematic-glycolysis-zone schematic-gly-investment-zone', 'data-glycolysis-zone': 'investment' });
            add('rect', { x: 68, y: 18, width: 28, height: 22, rx: 3, class: 'schematic-glycolysis-zone schematic-gly-cleavage-zone', 'data-glycolysis-zone': 'cleavage' });
            add('rect', { x: 4, y: 42, width: 92, height: 38, rx: 3, class: 'schematic-glycolysis-zone schematic-gly-payoff-zone', 'data-glycolysis-zone': 'payoff' });
            add('rect', { x: 4, y: 82, width: 92, height: 14, rx: 3, class: 'schematic-glycolysis-zone schematic-gly-net-zone', 'data-glycolysis-zone': 'net' });
            label(8, 22, '投资阶段 · 投入 2 ATP', 'schematic-compartment-title', { 'text-anchor': 'start' });
            label(71, 22, '裂解 · 2 GAP', 'schematic-compartment-title', { 'text-anchor': 'start' });
            label(8, 46, '收益阶段 · 后半程每步 ×2 · 产生 4 ATP + 2 NADH', 'schematic-compartment-title', { 'text-anchor': 'start' });

            metabolite(...p.glucose, '葡萄糖'); metabolite(...p.g6p, 'G6P'); metabolite(...p.f6p, 'F6P'); metabolite(...p.f16bp, 'F-1,6-BP');
            metabolite(...p.dhap, 'DHAP'); metabolite(...p.gap, 'GAP ×2'); metabolite(...p.bpg, '1,3-BPG');
            metabolite(...p.pg3, '3-PG'); metabolite(...p.pg2, '2-PG'); metabolite(...p.pep, 'PEP'); metabolite(...p.pyruvate, '丙酮酸 ×2');
            line(...p.glucose, ...p.g6p); line(...p.g6p, ...p.f6p, true); line(...p.f6p, ...p.f16bp);
            line(...p.f16bp, ...p.dhap, true); line(...p.f16bp, ...p.gap, true); line(...p.dhap, ...p.gap, true);
            routePath('M 89 36 C 90 42, 90 48, 88.5 52', false, 'schematic-route');
            line(...p.bpg, ...p.pg3); line(...p.pg3, ...p.pg2, true); line(...p.pg2, ...p.pep, true);
            routePath('M 36.5 55 C 30 54, 24 53, 19.5 52', false, 'schematic-route');

            label(17, 27, 'HK · ATP→ADP', 'schematic-enzyme');
            label(50, 27, 'PFK-1 · 承诺步骤 · ATP→ADP', 'schematic-enzyme');
            label(81, 24, '醛缩酶', 'schematic-enzyme'); label(81, 39, 'TPI · DHAP→GAP', 'schematic-enzyme');
            label(88, 48, 'GAPDH · 2 NAD⁺→2 NADH', 'schematic-cofactor');
            label(80, 63, 'PGK · 2 ADP→2 ATP', 'schematic-cofactor');
            label(46, 62, '烯醇化酶 · 2 H₂O', 'schematic-enzyme');
            label(24, 58, 'PK · 2 ADP→2 ATP', 'schematic-cofactor');

            stepBadge(17, 34, 1); stepBadge(33, 34, 2); stepBadge(50, 34, 3);
            stepBadge(66, 29, 4); stepBadge(81, 32, 5); stepBadge(91, 45, 6);
            stepBadge(80, 69, 7); stepBadge(63, 69, 8); stepBadge(46, 56, 9); stepBadge(28, 52, 10);
            label(24, 87, '3 个不可逆关卡：HK · PFK-1 · PK', 'schematic-note');
            label(68, 87, '净 2 ATP + 2 NADH + 2 丙酮酸', 'schematic-output');
            label(50, 93, '需氧：丙酮酸→PDH；缺氧 / 红细胞：LDH 再生 NAD⁺', 'schematic-note');
          } else if (pathwayId === 'gluconeogenesis') {
            const p = {
              pyruvate: [94, 72], oaaMatrix: [87, 72], malateMatrix: [81, 66],
              malateCytosol: [74, 57], oaaCytosol: [63, 57], pep: [55, 57],
              pg3: [47, 68], bpg: [39, 68], triose: [31, 60], f16bp: [30, 47],
              f6p: [24, 47], g6pCytosol: [24, 38], g6pEr: [16, 38], glucoseEr: [8.5, 32], glucoseCytosol: [8.5, 47]
            };
            label(50, 12, '线粒体—细胞质—内质网 · 糖异生三个绕行', 'schematic-title');
            add('rect', { x: 79, y: 57, width: 18, height: 27, rx: 3, class: 'schematic-gluconeogenesis-zone schematic-gng-matrix-zone', 'data-gluconeogenesis-zone': 'matrix' });
            add('rect', { x: 65, y: 50, width: 14, height: 34, rx: 3, class: 'schematic-gluconeogenesis-zone schematic-gng-shuttle-zone', 'data-gluconeogenesis-zone': 'shuttle' });
            add('rect', { x: 22, y: 22, width: 43, height: 60, rx: 3, class: 'schematic-gluconeogenesis-zone schematic-gng-cytosol-zone', 'data-gluconeogenesis-zone': 'cytosol' });
            add('rect', { x: 3, y: 20, width: 19, height: 44, rx: 3, class: 'schematic-gluconeogenesis-zone schematic-gng-er-zone', 'data-gluconeogenesis-zone': 'er' });
            add('rect', { x: 3, y: 85, width: 94, height: 12, rx: 3, class: 'schematic-gluconeogenesis-zone schematic-gng-ledger-zone', 'data-gluconeogenesis-zone': 'ledger' });
            label(88, 61, '线粒体基质 · PC', 'schematic-compartment-title');
            label(72, 54, '内膜穿梭', 'schematic-compartment-title');
            label(43, 27, '细胞质 · PCK1 与逆糖酵解主干', 'schematic-compartment-title');
            label(12.5, 24, 'ER 膜 / 腔 · G6Pase', 'schematic-compartment-title', { 'data-role': 'er-title' });

            metabolite(...p.pyruvate, '丙酮酸 ×2'); metabolite(...p.oaaMatrix, 'OAA ×2'); metabolite(...p.malateMatrix, '苹果酸');
            metabolite(...p.malateCytosol, '苹果酸'); metabolite(...p.oaaCytosol, 'OAA'); metabolite(...p.pep, 'PEP ×2');
            metabolite(...p.pg3, '3-PG'); metabolite(...p.bpg, '1,3-BPG'); metabolite(...p.triose, 'GAP / DHAP');
            metabolite(...p.f16bp, 'F-1,6-BP'); metabolite(...p.f6p, 'F6P'); metabolite(...p.g6pCytosol, 'G6P 胞质');
            metabolite(...p.g6pEr, 'G6P 腔内'); metabolite(...p.glucoseEr, '葡萄糖 腔内'); metabolite(...p.glucoseCytosol, '葡萄糖');

            line(...p.pyruvate, ...p.oaaMatrix);
            routePath('M 86 71 C 84 69, 82 67, 82 66', false, 'schematic-route');
            routePath('M 80 65 C 78 62, 76 59, 75 58', false, 'schematic-route schematic-transporter-route');
            line(...p.malateCytosol, ...p.oaaCytosol, true); line(...p.oaaCytosol, ...p.pep);
            routePath('M 54 58 C 52 61, 49 65, 48 67', true, 'schematic-route');
            line(...p.pg3, ...p.bpg, true); routePath('M 38 67 C 36 64, 33 62, 32 61', true, 'schematic-route');
            routePath('M 30 59 C 30 55, 30 51, 30 48', true, 'schematic-route');
            line(...p.f16bp, ...p.f6p); routePath('M 24 46 L 24 39', true, 'schematic-route');
            line(...p.g6pCytosol, ...p.g6pEr, true, 'schematic-route schematic-transporter-route');
            routePath('M 15 37 C 13 35, 11 33, 9.5 32', false, 'schematic-route'); routePath('M 8.5 33 L 8.5 46', true, 'schematic-route schematic-transporter-route');

            label(91, 68, 'PC · 丙酮酸羧化酶 · 2 ATP', 'schematic-enzyme');
            label(72, 74, 'MDH2 / 载体 / MDH1', 'schematic-transporter');
            label(72, 80, 'OAA 不能直接跨内膜', 'schematic-note');
            label(59, 53, 'PCK1 · 2 GTP → 2 GDP + 2 CO₂', 'schematic-enzyme');
            label(44, 74, 'PGK · 2 ATP', 'schematic-cofactor'); label(35, 74, 'GAPDH · 2 NADH', 'schematic-cofactor');
            label(27, 42, 'FBP1 · 水解', 'schematic-enzyme');
            label(19, 35, 'G6P 转运入 ER', 'schematic-transporter'); label(10, 28, '葡萄糖-6-磷酸酶 G6Pase', 'schematic-enzyme', { 'data-role': 'g6pase-er' });

            add('rect', { x: 80, y: 77, width: 16, height: 5, rx: 2, class: 'schematic-gng-bypass', 'data-gluconeogenesis-bypass': 'pk' });
            label(88, 80.5, 'PC + 穿梭 + PEPCK', 'schematic-note');
            add('rect', { x: 22.5, y: 34, width: 15, height: 5, rx: 2, class: 'schematic-gng-bypass', 'data-gluconeogenesis-bypass': 'pfk1' });
            label(30, 37.5, '绕过 PFK-1', 'schematic-note');
            add('rect', { x: 3.5, y: 55, width: 17, height: 5, rx: 2, class: 'schematic-gng-bypass', 'data-gluconeogenesis-bypass': 'hk-gk' });
            label(12, 58.5, '绕过 HK / GK', 'schematic-note');

            label(24, 89, '代表性苹果酸路线；实际出口依前体 / 组织而变', 'schematic-note');
            label(70, 89, '2 丙酮酸 → 1 葡萄糖：4 ATP + 2 GTP + 2 NADH', 'schematic-output');
            label(70, 94, '共 6 个高能磷酸键 · 三个绕行跨越基质、胞质与 ER', 'schematic-note');
          } else if (pathwayId === 'glycogenesis') {
            const p = {
              glucose: [10, 39], g6p: [24, 39], g1p: [38, 39], utp: [48, 52],
              udpGlc: [52, 39], ppi: [52, 24], glycogenin: [65, 39], primer: [84, 39],
              linear: [68, 63], branchPoint: [84, 62], granule: [92, 76]
            };
            label(50, 8, '细胞质 · 糖原合成：先活化、再起始、后延长与分支', 'schematic-title');
            add('rect', { x: 3, y: 12, width: 53, height: 47, rx: 3, class: 'schematic-glycogenesis-zone schematic-glycogenesis-activation-zone', 'data-glycogenesis-zone': 'activation' });
            add('rect', { x: 58, y: 12, width: 38, height: 34, rx: 3, class: 'schematic-glycogenesis-zone schematic-glycogenesis-primer-zone', 'data-glycogenesis-zone': 'primer' });
            add('rect', { x: 58, y: 48, width: 18, height: 31, rx: 3, class: 'schematic-glycogenesis-zone schematic-glycogenesis-elongation-zone', 'data-glycogenesis-zone': 'elongation' });
            add('rect', { x: 78, y: 48, width: 18, height: 31, rx: 3, class: 'schematic-glycogenesis-zone schematic-glycogenesis-branching-zone', 'data-glycogenesis-zone': 'branching' });
            add('rect', { x: 3, y: 82, width: 93, height: 14, rx: 3, class: 'schematic-glycogenesis-zone schematic-glycogenesis-energy-zone', 'data-glycogenesis-zone': 'energy' });
            label(7, 17, '① 核苷酸糖活化', 'schematic-compartment-title', { 'text-anchor': 'start' });
            label(62, 17, '② 糖原蛋白起始', 'schematic-compartment-title', { 'text-anchor': 'start' });
            label(62, 53, '③ 主链延长', 'schematic-compartment-title', { 'text-anchor': 'start' });
            label(81, 53, '④ 分支', 'schematic-compartment-title', { 'text-anchor': 'start' });

            metabolite(...p.glucose, '葡萄糖'); metabolite(...p.g6p, 'G6P');
            metabolite(...p.g1p, 'G1P'); metabolite(...p.utp, 'UTP');
            metabolite(...p.udpGlc, 'UDP-葡萄糖'); metabolite(...p.ppi, 'PPi');
            namedNode(...p.glycogenin, '糖原蛋白', 'glycogenin');
            metabolite(...p.primer, '短 α-1,4 引物'); metabolite(...p.linear, '延长中的主链');
            namedNode(...p.branchPoint, 'α-1,6 分支点', 'branch-point');
            metabolite(...p.granule, '多分支糖原颗粒');

            line(...p.glucose, ...p.g6p); line(...p.g6p, ...p.g1p, true);
            line(...p.g1p, ...p.udpGlc); routePath('M 48 50 C 49 46, 50 43, 51 40', false, 'schematic-route schematic-cofactor-route');
            routePath('M 52 38 C 52 34, 52 29, 52 25.5', false, 'schematic-route schematic-cofactor-route');
            line(...p.udpGlc, ...p.glycogenin); line(...p.glycogenin, ...p.primer);
            routePath('M 83.5 41 C 80 48, 73 56, 69 61.5', false, 'schematic-route');
            line(...p.linear, ...p.branchPoint);
            routePath('M 89 64 C 92 67, 93.5 71, 94 75.5', false, 'schematic-route');

            label(17, 34, '己糖激酶 · ATP→ADP', 'schematic-enzyme');
            label(31, 34, '磷酸葡萄糖变位酶', 'schematic-enzyme');
            label(45, 32, 'UDP-葡萄糖焦磷酸化酶', 'schematic-enzyme');
            label(47, 56, 'UTP → UDP-葡萄糖 + PPi', 'schematic-cofactor');
            label(52, 20, 'PPi 水解驱动', 'schematic-cofactor');
            label(76, 28, '糖原蛋白自糖基化，形成短引物', 'schematic-enzyme');
            label(76, 44, '糖原合酶不能从零起始', 'schematic-note');
            label(68, 70, '糖原合酶 · α-1,4 延长', 'schematic-enzyme');
            label(87, 67, '分支酶 · 链段转移', 'schematic-enzyme');
            label(87, 71, '形成 α-1,6 分支', 'schematic-note');
            label(92, 79, '多个非还原端', 'schematic-output');
            stepBadge(17, 42, 1); stepBadge(31, 42, 2); stepBadge(45, 42, 3);
            stepBadge(74, 36, 4); stepBadge(63, 62, 5); stepBadge(80, 62, 6);
            label(28, 88, '从游离葡萄糖：1 ATP + 1 UTP / 加入单位', 'schematic-output');
            label(72, 88, '从 G6P 起算只需 1 UTP / 加入单位', 'schematic-output');
            label(50, 93, '分支酶只重排链段，不额外加入葡萄糖', 'schematic-note');
          } else if (pathwayId === 'glycogenolysis') {
            const p = {
              granule: [8, 26.5], end: [34, 26.5], limit: [60, 26.5], g1pMain: [87, 26.5],
              transfer: [12, 54], branch: [50, 54], free: [88, 52],
              g1p: [10, 77], g6p: [39, 77], muscle: [80, 75.5],
              g6pC: [10, 95], g6pEr: [35, 95], glucoseEr: [61, 95], blood: [89, 95]
            };
            label(50, 7, '糖原分解：外链磷酸解、去分支双活性与组织分流', 'schematic-title');
            add('rect', { x: 3, y: 10, width: 94, height: 23.5, rx: 3, class: 'schematic-glycogenolysis-zone schematic-ggl-chain-zone', 'data-glycogenolysis-zone': 'chain' });
            add('rect', { x: 3, y: 35, width: 94, height: 25, rx: 3, class: 'schematic-glycogenolysis-zone schematic-ggl-debranch-zone', 'data-glycogenolysis-zone': 'debranching' });
            add('rect', { x: 3, y: 62, width: 44, height: 18, rx: 3, class: 'schematic-glycogenolysis-zone schematic-ggl-conversion-zone', 'data-glycogenolysis-zone': 'conversion' });
            add('rect', { x: 49, y: 62, width: 48, height: 18, rx: 3, class: 'schematic-glycogenolysis-zone schematic-ggl-muscle-zone', 'data-glycogenolysis-zone': 'muscle' });
            add('rect', { x: 3, y: 81.5, width: 94, height: 17.5, rx: 3, class: 'schematic-glycogenolysis-zone schematic-ggl-liver-zone', 'data-glycogenolysis-zone': 'liver-er' });
            label(6, 14, '① 外链磷酸解', 'schematic-compartment-title', { 'text-anchor': 'start' });
            label(6, 38, '② 去分支酶 AGL · 双催化活性', 'schematic-compartment-title', { 'text-anchor': 'start' });
            label(6, 63.5, '③ G1P → G6P', 'schematic-compartment-title', { 'text-anchor': 'start' });
            label(53, 63.5, '④ 肌肉：本地供能', 'schematic-compartment-title', { 'text-anchor': 'start' });
            label(6, 83.5, '⑤ 肝 / 肾：ER 释糖', 'schematic-compartment-title', { 'text-anchor': 'start' });
            metabolite(...p.granule, '糖原颗粒'); metabolite(...p.end, '非还原端'); metabolite(...p.limit, '极限糊精'); metabolite(...p.g1pMain, 'G1P');
            metabolite(...p.transfer, '转移的 3 个残基'); namedNode(...p.branch, '暴露 α-1,6 点', 'debranching-label'); metabolite(...p.free, '少量游离葡萄糖');
            metabolite(...p.g1p, 'G1P'); metabolite(...p.g6p, 'G6P'); metabolite(...p.muscle, '肌肉糖酵解');
            metabolite(...p.g6pC, '胞质 G6P'); namedNode(...p.g6pEr, 'ER 腔 G6P', 'g6p-er'); metabolite(...p.glucoseEr, 'ER 腔葡萄糖'); metabolite(...p.blood, '血糖输出');
            line(...p.granule, ...p.end); line(...p.end, ...p.limit); line(...p.limit, ...p.g1pMain);
            line(...p.transfer, ...p.branch); line(...p.branch, ...p.free); line(...p.g1p, ...p.g6p, true); line(...p.g6p, ...p.muscle);
            line(...p.g6pC, ...p.g6pEr, true, 'schematic-route schematic-transporter-route'); line(...p.g6pEr, ...p.glucoseEr); line(...p.glucoseEr, ...p.blood, true, 'schematic-route schematic-transporter-route');
            stackedLabel(50, 16.5, ['糖原磷酸化酶 · Pi', '· α-1,4 磷酸解'], 'schematic-enzyme');
            label(50, 32, '停在分支前 4 个残基', 'schematic-note');
            stackedLabel(27, 43.5, ['4-α-葡聚糖转移酶', '· 转移 3 个残基'], 'schematic-enzyme');
            stackedLabel(73, 43.5, ['α-1,6-糖苷酶活性', '· 水解 α-1,6'], 'schematic-enzyme');
            label(86, 59, '释放 1 个游离葡萄糖', 'schematic-note');
            stackedLabel(25, 68.5, ['磷酸葡萄糖变位酶', '· 不耗 ATP'], 'schematic-enzyme', 3.1);
            label(74, 68.5, '肌肉缺少 G6Pase', 'schematic-note'); label(80, 79.5, '就地进入糖酵解', 'schematic-output');
            label(23, 88.2, 'G6P 转运入 ER', 'schematic-transporter'); label(48, 88.2, '腔面 G6Pase', 'schematic-enzyme'); label(75, 88.2, '葡萄糖输出', 'schematic-transporter');
            label(50, 98.8, '糖原来源 G6P 绕过己糖激酶，节省 1 ATP', 'schematic-output');
            stepBadge(21, 29.5, 1); stepBadge(27, 56.5, 2); stepBadge(73, 56.5, 3); stepBadge(25, 78.5, 4);
            stepBadge(69, 78.5, 5); stepBadge(23, 96.8, 6); stepBadge(48, 96.8, 7);
          } else if (pathwayId === 'ppp') {
            const p = {
              g6p: [8, 31.5], lactone: [34, 31.5], sixpg: [60, 31.5], ru5p: [87, 31.5],
              r5p: [45, 53], x5p: [67, 53], nucleotide: [88, 53],
              x5pA: [10, 78], r5pA: [10, 83.5], g3pA: [34, 78], s7p: [34, 83.5],
              f6pA: [58, 78], e4p: [58, 83.5], f6pOut: [85, 78], g3pOut: [85, 83.5]
            };
            label(50, 7, '磷酸戊糖途径：氧化产 NADPH，可逆重排按需求分配碳', 'schematic-title');
            add('rect', { x: 3, y: 10, width: 94, height: 31, rx: 3, class: 'schematic-ppp-zone schematic-ppp-oxidative-zone', 'data-ppp-zone': 'oxidative' });
            add('rect', { x: 3, y: 41, width: 94, height: 18.5, rx: 3, class: 'schematic-ppp-zone schematic-ppp-pentose-zone', 'data-ppp-zone': 'pentose-hub' });
            add('rect', { x: 3, y: 61, width: 94, height: 28.5, rx: 3, class: 'schematic-ppp-zone schematic-ppp-rearrangement-zone', 'data-ppp-zone': 'rearrangement' });
            add('rect', { x: 3, y: 89, width: 94, height: 10, rx: 3, class: 'schematic-ppp-zone schematic-ppp-demand-zone', 'data-ppp-zone': 'demand-modes' });
            label(6, 13, '① 不可逆氧化支', 'schematic-compartment-title', { 'text-anchor': 'start' });
            label(6, 44, '② 五碳糖枢纽', 'schematic-compartment-title', { 'text-anchor': 'start' });
            label(6, 63.5, '③ 可逆非氧化支 · 15C 碳重排', 'schematic-compartment-title', { 'text-anchor': 'start' });
            metabolite(...p.g6p, 'G6P'); metabolite(...p.lactone, '6-P-葡萄糖酸内酯'); metabolite(...p.sixpg, '6-磷酸葡萄糖酸'); metabolite(...p.ru5p, 'Ru5P');
            metabolite(...p.r5p, 'R5P'); metabolite(...p.x5p, 'X5P'); metabolite(...p.nucleotide, '核苷酸');
            metabolite(...p.x5pA, 'X5P'); metabolite(...p.r5pA, 'R5P'); metabolite(...p.g3pA, 'G3P'); metabolite(...p.s7p, 'S7P');
            metabolite(...p.f6pA, 'F6P'); metabolite(...p.e4p, 'E4P'); metabolite(...p.f6pOut, 'F6P'); metabolite(...p.g3pOut, 'G3P');
            line(...p.g6p, ...p.lactone); line(...p.lactone, ...p.sixpg, true); line(...p.sixpg, ...p.ru5p);
            routePath('M 87 32.5 C 80 39, 60 45, 46 52', true, 'schematic-route'); routePath('M 87 32.5 C 82 40, 73 46, 68 52', true, 'schematic-route'); line(...p.r5p, ...p.nucleotide);
            line(...p.x5pA, ...p.g3pA, true); line(...p.r5pA, ...p.s7p, true); line(...p.g3pA, ...p.f6pA, true); line(...p.s7p, ...p.e4p, true);
            routePath('M 59 83 C 68 81.5, 76 79, 83.5 78.3', true, 'schematic-route'); routePath('M 59 78.5 C 68 80, 76 82.5, 83.5 83.2', true, 'schematic-route');
            stackedLabel(21, 19.5, ['G6PD · ', '第 1 个 NADPH'], 'schematic-cofactor');
            label(47, 21, '6PGL · H₂O', 'schematic-enzyme');
            stackedLabel(73, 19.5, ['6PGDH · ', '第 2 个 NADPH + CO₂'], 'schematic-cofactor');
            label(50, 39.5, '净：2 NADPH + CO₂ + Ru5P · PPP 不直接产生 ATP', 'schematic-output');
            label(62, 45, 'RPI / RPE 可逆分流', 'schematic-enzyme'); label(75, 58, 'R5P → 核苷酸合成', 'schematic-output');
            stackedLabel(21, 68.5, ['转酮酶 1 · TPP ', '· 转移 2C'], 'schematic-enzyme');
            stackedLabel(47, 68.5, ['转醛酶 ', '· 转移 3C'], 'schematic-enzyme');
            stackedLabel(74, 68.5, ['转酮酶 2 · TPP ', '· 转移 2C'], 'schematic-enzyme');
            label(50, 86.8, '3×5C ⇌ 2×6C + 1×3C · 15C ⇌ 15C', 'schematic-output');
            label(18, 92.3, 'R5P 优先', 'schematic-compartment-title'); label(18, 97.8, '糖酵解中间体 → R5P', 'schematic-note');
            label(50, 92.3, '同时需要 NADPH 与 R5P', 'schematic-compartment-title'); label(50, 97.8, '氧化支后保留 R5P', 'schematic-note');
            label(82, 92.3, 'NADPH 优先', 'schematic-compartment-title'); label(82, 97.8, '五碳糖回流糖酵解', 'schematic-note');
            stepBadge(21, 35, 1); stepBadge(47, 35, 2); stepBadge(73, 35, 3); stepBadge(45, 56, 4);
            stepBadge(67, 56, 5); stepBadge(21, 80.7, 6); stepBadge(47, 80.7, 7); stepBadge(74, 80.7, 8);
          } else if (pathwayId === 'fa_synthesis') {
            const p = {
              matrixAcetyl: [7, 18], matrixOaa: [7, 25], matrixCitrate: [22, 18], carrier: [38, 18],
              cytosolCitrate: [55, 18], acly: [72, 18], cytosolAcetyl: [90, 18], cytosolOaa: [90, 25],
              commitmentAcetyl: [8, 38], acc: [33, 38], malonyl: [59, 38], cpt1: [87, 38],
              primer: [8, 57], malonylSeven: [8, 70], acp: [25, 63.5], keto: [43, 57],
              hydroxy: [61, 57], enoyl: [79, 57], acylPlusTwo: [79, 70], palmitate: [94, 63.5]
            };
            label(50, 4.2, '脂肪酸合酶 FAS：上游先输出碳，四步循环七轮生成 C16:0', 'schematic-title');
            [
              [3, 7, 94, 20, 'schematic-fa-zone schematic-fa-carbon-zone', 'carbon-export'],
              [3, 28, 94, 18, 'schematic-fa-zone schematic-fa-commitment-zone', 'commitment'],
              [3, 47, 94, 32, 'schematic-fa-zone schematic-fa-cycle-zone', 'fas-cycle'],
              [3, 80, 94, 19, 'schematic-fa-zone schematic-fa-ledger-zone', 'ledger-downstream']
            ].forEach(([x, y, width, height, className, zone]) => add('rect', { x, y, width, height, rx: 3, class: className, 'data-fa-synthesis-zone': zone }));
            label(6, 10.5, '① 柠檬酸输出', 'schematic-compartment-title', { 'text-anchor': 'start' });
            label(68, 10.5, '乙酰-CoA不能直接跨内膜', 'schematic-note');
            label(6, 31.5, '② ACC 承诺步骤', 'schematic-compartment-title', { 'text-anchor': 'start' });
            label(6, 50.5, '③ FAS 四步循环 ×7', 'schematic-compartment-title', { 'text-anchor': 'start' });
            label(6, 83.2, '④ 净账 / 调控 / 下游', 'schematic-compartment-title', { 'text-anchor': 'start' });

            metabolite(...p.matrixAcetyl, '乙酰-CoA'); metabolite(...p.matrixOaa, 'OAA');
            metabolite(...p.matrixCitrate, '柠檬酸'); namedNode(...p.carrier, 'SLC25A1', 'citrate-carrier');
            metabolite(...p.cytosolCitrate, '柠檬酸'); namedNode(...p.acly, 'ACLY', 'acly');
            metabolite(...p.cytosolAcetyl, '乙酰-CoA'); metabolite(...p.cytosolOaa, 'OAA');
            line(...p.matrixAcetyl, ...p.matrixCitrate); line(...p.matrixOaa, ...p.matrixCitrate);
            line(...p.matrixCitrate, ...p.carrier, true, 'schematic-route schematic-transporter-route');
            line(...p.carrier, ...p.cytosolCitrate, true, 'schematic-route schematic-transporter-route');
            line(...p.cytosolCitrate, ...p.acly); line(...p.acly, ...p.cytosolAcetyl); line(...p.acly, ...p.cytosolOaa);
            label(55, 25.7, 'ACLY · 1 ATP', 'schematic-enzyme');

            metabolite(...p.commitmentAcetyl, '乙酰-CoA'); namedNode(...p.acc, 'ACC', 'acc');
            metabolite(...p.malonyl, '丙二酰-CoA'); namedNode(...p.cpt1, 'CPT1', 'cpt1');
            line(...p.commitmentAcetyl, ...p.acc); line(...p.acc, ...p.malonyl);
            routePath('M 60 38 C 69 38, 77 38, 86 38', false, 'schematic-route schematic-inhibition-route');
            label(30, 44, 'ACC · HCO₃⁻ + 1 ATP · 生物素', 'schematic-enzyme');
            label(74, 44, '承诺 / 主要调控步骤', 'schematic-output');

            metabolite(...p.primer, '乙酰基引物'); metabolite(...p.malonylSeven, '丙二酰基 ×7');
            namedNode(...p.acp, 'ACP', 'acp'); metabolite(...p.keto, 'β-酮脂酰');
            metabolite(...p.hydroxy, 'β-羟脂酰'); metabolite(...p.enoyl, '烯脂酰');
            metabolite(...p.acylPlusTwo, '饱和脂酰 +2C'); metabolite(...p.palmitate, 'C16:0');
            line(...p.primer, ...p.acp); line(...p.malonylSeven, ...p.acp);
            line(...p.acp, ...p.keto); line(...p.keto, ...p.hydroxy, false, 'schematic-route schematic-cofactor-route');
            line(...p.hydroxy, ...p.enoyl); routePath('M 79 58 C 86 61, 86 67, 80 69', false, 'schematic-route schematic-cofactor-route');
            routePath('M 78 70 C 63 76, 45 74, 27 65', false, 'schematic-route schematic-cycle-route');
            routePath('M 80 70 C 86 69, 90 66, 93 64', false, 'schematic-route');
            label(34, 62.5, '缩合', 'schematic-enzyme'); label(52, 62.5, '还原 1', 'schematic-cofactor');
            label(70, 62.5, '脱水', 'schematic-enzyme'); label(88, 62.5, '还原 2', 'schematic-cofactor');
            stackedLabel(18, 74, ['ACP 携带', '中间体'], 'schematic-note', 3.2);
            stackedLabel(50, 74, ['每轮 +2C ', '· 2 NADPH'], 'schematic-output', 3.2);
            stackedLabel(82, 74, ['×7 → ', '棕榈酸 C16:0'], 'schematic-output', 3.2);

            stackedLabel(26, 89.5, ['FAS净：1 acetyl + 7 malonyl ', '+ 14 NADPH → C16'], 'schematic-output', 3.2);
            stackedLabel(74, 89.5, ['总成本：8 acetyl + 7 ATP ', '+ 14 NADPH'], 'schematic-output', 3.2);
            label(17, 98.1, 'PPP / 苹果酸酶', 'schematic-cofactor');
            label(49, 98.1, 'malonyl-CoA ┤ CPT1', 'schematic-note');
            label(82, 98.1, 'ER · ELOVL / SCD', 'schematic-transporter');
            stepBadge(38, 24.3, 1); stepBadge(72, 24.3, 2); stepBadge(33, 41.6, 3);
            stepBadge(34, 66, 4); stepBadge(52, 66, 5); stepBadge(70, 66, 6); stepBadge(88, 66, 7);
          } else if (pathwayId === 'purine') {
            const entry = { r5p: [8, 15], prpps: [24, 15], prpp: [40, 15], ppat: [59, 15], pra: [78, 15] };
            const spine = {
              pra: [8, 33], gar: [27, 33], fgar: [46, 33], fgam: [65, 33], air: [84, 33],
              cair: [84, 52], saicar: [65, 52], aicar: [46, 52], faicar: [27, 52], imp: [8, 52]
            };
            const branch = { imp: [50, 67], adss: [25, 74], amp: [25, 80], xmp: [75, 74], gmp: [75, 80] };
            label(50, 4.3, '嘌呤从头合成 · PRPP上十步搭环 → IMP → AMP / GMP', 'schematic-title');
            [
              [3, 7, 94, 15, 'schematic-purine-zone schematic-purine-entry-zone', 'prpp-entry'],
              [3, 24, 94, 36, 'schematic-purine-zone schematic-purine-assembly-zone', 'imp-assembly'],
              [3, 62, 94, 19, 'schematic-purine-zone schematic-purine-branch-zone', 'amp-gmp-branch'],
              [3, 83, 94, 15, 'schematic-purine-zone schematic-purine-ledger-zone', 'atom-energy-regulation']
            ].forEach(([x, y, width, height, className, zone]) => add('rect', { x, y, width, height, rx: 3, class: className, 'data-purine-zone': zone }));

            namedNode(...entry.r5p, 'R5P', 'r5p'); namedNode(...entry.prpps, 'PRPP-S', 'prpp-synthetase');
            namedNode(...entry.prpp, 'PRPP', 'prpp'); namedNode(...entry.ppat, 'PPAT · 第一承诺步骤', 'ppat'); namedNode(...entry.pra, '5-PRA', 'pra-entry');
            line(...entry.r5p, ...entry.prpps); line(...entry.prpps, ...entry.prpp); line(...entry.prpp, ...entry.ppat); line(...entry.ppat, ...entry.pra);
            label(24, 20.3, 'PRPP synthetase · ATP → AMP', 'schematic-enzyme');
            label(72, 20.3, 'Gln → Glu + PPi', 'schematic-cofactor');

            [
              [spine.pra, '5-PRA', 'pra'], [spine.gar, 'GAR', 'gar'], [spine.fgar, 'FGAR', 'fgar'], [spine.fgam, 'FGAM', 'fgam'], [spine.air, 'AIR', 'air'],
              [spine.cair, 'CAIR', 'cair'], [spine.saicar, 'SAICAR', 'saicar'], [spine.aicar, 'AICAR', 'aicar'], [spine.faicar, 'FAICAR', 'faicar'], [spine.imp, 'IMP', 'imp']
            ].forEach(([point, value, role]) => namedNode(...point, value, role));
            line(...spine.pra, ...spine.gar); line(...spine.gar, ...spine.fgar); line(...spine.fgar, ...spine.fgam); line(...spine.fgam, ...spine.air);
            line(...spine.air, ...spine.cair); line(...spine.cair, ...spine.saicar); line(...spine.saicar, ...spine.aicar); line(...spine.aicar, ...spine.faicar); line(...spine.faicar, ...spine.imp);
            routePath('M 78 16 C 60 23, 28 27, 9 32', false, 'schematic-route');
            [
              [8, 38.5, 'PPAT'], [27, 38.5, 'GART · GAR-S'], [46, 38.5, 'GART · GAR-T'], [65, 38.5, 'PFAS · FGAM-S'], [84, 38.5, 'GART · AIR-S'],
              [84, 57.5, 'PAICS · AIR-C'], [65, 57.5, 'PAICS · SAICAR-S'], [46, 57.5, 'ADSL'], [27, 57.5, 'ATIC · AICAR-T'], [8, 57.5, 'ATIC · IMP-C']
            ].forEach(([x, y, value]) => label(x, y, value, 'schematic-enzyme'));
            [spine.pra, spine.gar, spine.fgar, spine.fgam, spine.air, spine.cair, spine.saicar, spine.aicar, spine.faicar, spine.imp]
              .forEach((point, index) => stepBadge(point[0], point[1] + 3.05, index + 1));

            namedNode(...branch.imp, 'IMP', 'branch-imp');
            namedNode(...branch.adss, 'ADSS · Asp + GTP', 'adss');
            namedNode(...branch.amp, 'ADSL · AMP + fumarate', 'amp');
            namedNode(...branch.xmp, 'XMP · IMPDH · NAD⁺ → NADH', 'xmp');
            namedNode(...branch.gmp, 'GMP · GMPS · Gln + ATP → AMP + PPi', 'gmp');
            line(...branch.imp, ...branch.adss); line(...branch.adss, ...branch.amp);
            line(...branch.imp, ...branch.xmp, false, 'schematic-route schematic-cofactor-route'); line(...branch.xmp, ...branch.gmp, false, 'schematic-route schematic-cofactor-route');

            [
              [10, 87, 'N3/N9 · Gln', 'atom-gln'], [29, 87, 'C4/C5/N7 · Gly', 'atom-gly'], [49, 87, 'C2/C8 · 10-formyl-THF', 'atom-formyl'],
              [69, 87, 'C6 · CO₂', 'atom-carbon'], [88, 87, 'N1 · Asp', 'atom-asp']
            ].forEach(([x, y, value, role]) => namedNode(x, y, value, role));
            stackedLabel(25, 92, [
              'R5P→IMP · 5 ATP分子 · 6高能键',
              'AMP用GTP · GMP用ATP',
              'AMP⊣ADSS · GMP⊣IMPDH'
            ], 'schematic-output', 2.75);
            stackedLabel(74, 92, [
              'APRT / HGPRT · salvage uses PRPP',
              'salvage不属于十步从头主干'
            ], 'schematic-note', 3.1);
          } else if (pathwayId === 'pyrimidine') {
            const cad = { carbP: [8, 18], carbAsp: [21, 18], dho: [34, 18], gln: [8, 35], hco3: [21, 35], atp: [34, 35] };
            const dh = { dho: [44, 17], enzyme: [52, 26], orotate: [60, 35], coq: [45, 41], coqh2: [58, 41] };
            const umps = { orotate: [69, 17], prpp: [70, 36], omp: [81, 22], ppi: [82, 37], ump: [93, 29], co2: [93, 39] };
            const branch = { ump: [8, 53], udp: [24, 53], utp: [40, 53], ctp: [56, 53], dudp: [24, 70], dutp: [40, 70], dump: [56, 70], dtmp: [72, 70], dttp: [88, 70] };

            label(50, 2.6, '环先合成 · 再接 PRPP · 六步形成 UMP 后分流 RNA / DNA', 'schematic-title');
            [
              [3, 7, 36, 38, 'schematic-pyrimidine-zone schematic-pyrimidine-cad-zone', 'cad-cytosol'],
              [41, 7, 22, 38, 'schematic-pyrimidine-zone schematic-pyrimidine-dhodh-zone', 'dhodh-imm'],
              [65, 7, 32, 38, 'schematic-pyrimidine-zone schematic-pyrimidine-umps-zone', 'umps-cytosol'],
              [3, 47, 94, 34, 'schematic-pyrimidine-zone schematic-pyrimidine-branch-zone', 'rna-dna-branches'],
              [3, 83, 94, 16, 'schematic-pyrimidine-zone schematic-pyrimidine-ledger-zone', 'atom-energy-regulation']
            ].forEach(([x, y, width, height, className, zone]) => add('rect', { x, y, width, height, rx: 3, class: className, 'data-pyrimidine-zone': zone }));

            label(21, 8.5, '胞质 · CAD 三活性', 'schematic-compartment-title');
            namedNode(...cad.carbP, '氨甲酰磷酸', 'carbamoyl-phosphate');
            namedNode(...cad.carbAsp, '氨甲酰天冬氨酸', 'carbamoyl-aspartate');
            namedNode(...cad.dho, '二氢乳清酸', 'dihydroorotate-cad');
            line(...cad.carbP, ...cad.carbAsp); line(...cad.carbAsp, ...cad.dho);
            label(8, 27, 'CAD · CPS II', 'schematic-enzyme');
            label(21, 31, 'CAD · ATCase', 'schematic-enzyme');
            label(34, 33, 'CAD · DHOase', 'schematic-enzyme');
            namedNode(8, 40, 'Gln', 'cad-gln'); namedNode(21, 40, 'HCO₃⁻', 'cad-bicarbonate'); namedNode(34, 40, '2 ATP', 'cad-atp');
            stepBadge(8, 21.2, 1); stepBadge(21, 21.2, 2); stepBadge(34, 21.2, 3);

            label(52, 8.5, '线粒体内膜外侧', 'schematic-compartment-title');
            namedNode(...dh.dho, 'DHO 输入', 'dihydroorotate-dhodh');
            namedNode(...dh.enzyme, 'DHODH', 'dhodh-active');
            add('circle', { cx: 79, cy: 52, r: 0, 'data-role': 'dhodh', 'aria-label': 'DHODH 锚点兼容标记' });
            namedNode(...dh.orotate, '乳清酸', 'orotate-dhodh');
            routePath('M 45 18 C 48 20, 50 23, 51 25', false, 'schematic-route schematic-transporter-route');
            routePath('M 53 27 C 56 29, 58 32, 59 34', false, 'schematic-route schematic-transporter-route');
            label(57, 17.5, 'DHODH · FMN', 'schematic-transporter');
            namedNode(45, 41, 'CoQ', 'coq'); namedNode(58, 41, 'CoQH₂', 'coqh2');
            line(...dh.coq, ...dh.coqh2, false, 'schematic-route schematic-cofactor-route');
            label(52, 47, 'CoQ → CoQH₂', 'schematic-cofactor');
            label(48, 52, '内膜外侧 · 底物/产物保持胞质可达', 'schematic-note');
            stepBadge(55, 29.5, 4);

            label(81, 8.5, '胞质 · UMPS 双活性', 'schematic-compartment-title');
            add('title', {}, '主体在细胞质；DHODH 锚定在线粒体内膜，代谢物端点保持胞质可达');
            namedNode(...umps.orotate, '乳清酸', 'orotate-umps'); namedNode(...umps.prpp, 'PRPP', 'prpp');
            namedNode(...umps.omp, 'OMP', 'omp'); namedNode(82, 42, 'PPi', 'ppi');
            namedNode(...umps.ump, 'UMP', 'ump'); namedNode(93, 42, 'CO₂', 'co2');
            line(...umps.orotate, ...umps.omp); line(...umps.omp, ...umps.ump);
            routePath('M 71 35 C 74 31, 77 26, 80 23', false, 'schematic-route schematic-cofactor-route');
            routePath('M 82 23 C 82 28, 82 32, 82 36', false, 'schematic-route schematic-cofactor-route');
            routePath('M 92 30 C 92 33, 93 36, 93 38', false, 'schematic-route schematic-cofactor-route');
            label(75, 29, 'UMPS · OPRTase', 'schematic-enzyme');
            label(88, 35, 'UMPS · OMP decarboxylase', 'schematic-enzyme');
            stepBadge(81, 25.2, 5); stepBadge(93, 32.2, 6);

            label(29, 53, 'RNA 分支', 'schematic-compartment-title');
            label(70, 56, 'DNA 胸苷酸分支', 'schematic-compartment-title');
            branch.ump[1] = 60; branch.udp[1] = 60; branch.utp[1] = 60; branch.ctp[1] = 60;
            namedNode(...branch.ump, 'UMP', 'branch-ump'); namedNode(...branch.udp, 'UDP', 'udp');
            namedNode(...branch.utp, 'UTP', 'utp'); namedNode(...branch.ctp, 'CTP', 'ctp');
            line(...branch.ump, ...branch.udp); line(...branch.udp, ...branch.utp); line(...branch.utp, ...branch.ctp);
            label(16, 67, 'UMP-CMP kinase', 'schematic-enzyme'); label(32, 67, 'NDPK', 'schematic-enzyme');
            label(48, 67, 'CTPS · Gln + ATP', 'schematic-cofactor');

            branch.dudp[1] = 74; branch.dutp[1] = 74; branch.dump[1] = 74; branch.dtmp[1] = 74; branch.dttp[1] = 74;
            namedNode(...branch.dudp, 'dUDP', 'dudp'); namedNode(...branch.dutp, 'dUTP', 'dutp');
            namedNode(...branch.dump, 'dUMP', 'dump'); namedNode(...branch.dtmp, 'dTMP', 'dtmp'); namedNode(...branch.dttp, 'dTTP', 'dttp');
            routePath('M 24 61 C 24 65, 24 69, 24 73', false, 'schematic-route');
            line(...branch.dudp, ...branch.dutp); line(...branch.dutp, ...branch.dump); line(...branch.dump, ...branch.dtmp); line(...branch.dtmp, ...branch.dttp);
            label(24, 79, 'RNR · NDP→dNDP', 'schematic-enzyme'); label(24, 84, 'thioredoxin(red)', 'schematic-cofactor');
            label(40, 79, 'NDPK', 'schematic-enzyme'); label(56, 79, 'DUT', 'schematic-enzyme');
            label(72, 77, 'TYMS', 'schematic-enzyme'); label(88, 77, 'TMPK / NDPK', 'schematic-enzyme');
            label(78, 82, '5,10-亚甲基-THF → DHF', 'schematic-cofactor');

            namedNode(12, 90, 'N3 · Gln', 'atom-gln'); namedNode(32, 93, 'C2 · HCO₃⁻', 'atom-carbon'); namedNode(53, 90, 'N1/C4/C5/C6 · Asp', 'atom-aspartate');
            label(19, 97, 'CAD/CPS II · 2 ATP', 'schematic-output');
            label(50, 97, 'UTP⊣CAD · PRPP→CAD', 'schematic-output');
            label(88, 87.5, 'dCTP：CDP→dCDP 经 RNR', 'schematic-note');
            label(88, 93, 'dCMP deaminase → dUMP', 'schematic-note');
            label(88, 98.5, '不虚构 DHODH 专用转运体', 'schematic-note');
          } else if (pathwayId === 'nucleotide_degradation') {
            const p = {
              nucleotide: [16, 37], nucleoside: [34, 37], base: [52, 37], phosphate: [16, 52], ribose: [52, 52],
              hypox: [72, 29], guanine: [72, 45], uric: [90, 37], uracil: [27, 73], betaAla: [48, 73],
              thymine: [67, 73], betaAib: [88, 73], salvage: [52, 91]
            };
            label(50, 3.8, '核苷酸降解 · 去磷酸后按嘌呤 / 嘧啶分流', 'schematic-title');
            add('title', {}, 'AMP / GMP / UMP / TMP 经过去磷酸和核苷裂解后，可回到核苷酸池（补救）或进入终末降解');
            [
              [3, 7, 27, 45, 'schematic-nucleotide-degradation-zone schematic-ndg-release-zone', 'phosphate-release'],
              [31, 7, 29, 45, 'schematic-nucleotide-degradation-zone schematic-ndg-cleavage-zone', 'nucleoside-cleavage'],
              [61, 7, 36, 45, 'schematic-nucleotide-degradation-zone schematic-ndg-purine-zone', 'purine-branch'],
              [3, 54, 94, 29, 'schematic-nucleotide-degradation-zone schematic-ndg-pyrimidine-zone', 'pyrimidine-branch'],
              [3, 85, 94, 13, 'schematic-nucleotide-degradation-zone schematic-ndg-salvage-zone', 'salvage-ledger']
            ].forEach(([x, y, width, height, className, zone]) => add('rect', { x, y, width, height, rx: 3, class: className, 'data-nucleotide-degradation-zone': zone }));
            label(15, 10, '细胞质 · 去磷酸', 'schematic-compartment-title'); label(45, 10, '核苷裂解', 'schematic-compartment-title'); label(79, 10, '嘌呤氧化', 'schematic-compartment-title');
            metabolite(...p.nucleotide, '核苷酸'); metabolite(...p.nucleoside, '核苷'); metabolite(...p.base, '碱基'); metabolite(...p.phosphate, 'Pi'); metabolite(...p.ribose, '核糖-1-P');
            metabolite(...p.hypox, '次黄嘌呤'); metabolite(...p.guanine, '鸟嘌呤'); metabolite(...p.uric, '尿酸'); metabolite(...p.uracil, '尿嘧啶'); metabolite(...p.betaAla, 'β-丙氨酸'); metabolite(...p.thymine, '胸腺嘧啶'); metabolite(...p.betaAib, 'β-氨基异丁酸'); metabolite(...p.salvage, '补救回收');
            line(...p.nucleotide, ...p.nucleoside); line(...p.nucleoside, ...p.base); routePath('M 16 42 C 16 46, 16 48, 16 49', false, 'schematic-route'); routePath('M 52 42 C 52 46, 52 48, 52 49', false, 'schematic-route');
            routePath('M 58 37 C 64 30, 68 29, 70 29', false, 'schematic-route'); routePath('M 58 39 C 64 43, 68 45, 70 45', false, 'schematic-route'); line(...p.hypox, ...p.uric); line(...p.guanine, ...p.uric);
            routePath('M 52 42 C 46 55, 35 64, 27 70', false, 'schematic-route'); routePath('M 54 42 C 59 55, 63 64, 67 70', false, 'schematic-route'); line(...p.uracil, ...p.betaAla); line(...p.thymine, ...p.betaAib);
            routePath('M 52 83 C 52 87, 52 88, 52 89', true, 'schematic-route schematic-salvage-route');
            label(18, 47, '核苷酸酶 · H₂O → Pi', 'schematic-enzyme'); label(45, 48, '核苷磷酸化酶 · ⇌', 'schematic-enzyme'); label(80, 24, '黄嘌呤氧化酶（XOR）', 'schematic-enzyme'); label(80, 51, '鸟嘌呤先脱氨', 'schematic-enzyme'); label(47, 68, '嘧啶降解酶系 · NADPH', 'schematic-enzyme');
            stepBadge(16, 31, 1); stepBadge(34, 31, 2); stepBadge(52, 31, 3); stepBadge(72, 23, 4); stepBadge(72, 39, 5); stepBadge(27, 67, 6);
            label(52, 96, '补救回收接口 · APRT / HGPRT 不属于本图主干', 'schematic-note');
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
              oaaC: [10, 30], malC: [30, 30], alphaKgC: [54, 36], aspC: [70, 30], gluC: [89, 36],
              malM: [30, 70], oaaM: [50, 70], alphaKgM: [56, 80], aspM: [70, 70], gluM: [89, 80],
              slc25a11: [32, 51], slc25a12: [72, 51]
            };
            label(50, 13, '苹果酸-天冬氨酸穿梭 · 六事件还原当量闭环', 'schematic-title');
            add('rect', { x: 4, y: 18, width: 92, height: 22, rx: 3, class: 'schematic-mas-zone schematic-mas-cytosol-zone', 'data-mas-zone': 'cytosol' });
            add('rect', { x: 4, y: 42, width: 92, height: 18, rx: 3, class: 'schematic-mas-zone schematic-mas-transport-zone', 'data-mas-zone': 'transport' });
            add('rect', { x: 4, y: 62, width: 92, height: 22, rx: 3, class: 'schematic-mas-zone schematic-mas-matrix-zone', 'data-mas-zone': 'matrix' });
            add('rect', { x: 4, y: 86, width: 92, height: 10, rx: 3, class: 'schematic-mas-zone schematic-mas-net-zone', 'data-mas-zone': 'net' });
            label(9, 22, '胞质半环', 'schematic-compartment-title', { 'text-anchor': 'start' });
            label(9, 47, '内膜交换', 'schematic-compartment-title', { 'text-anchor': 'start' });
            label(9, 66, '基质半环', 'schematic-compartment-title', { 'text-anchor': 'start' });

            metabolite(...p.oaaC, '草酰乙酸'); metabolite(...p.malC, '苹果酸');
            metabolite(...p.alphaKgC, 'α-KG'); metabolite(...p.aspC, '天冬氨酸'); metabolite(...p.gluC, '谷氨酸');
            metabolite(...p.malM, '苹果酸'); metabolite(...p.oaaM, '草酰乙酸');
            metabolite(...p.alphaKgM, 'α-KG'); metabolite(...p.aspM, '天冬氨酸'); metabolite(...p.gluM, '谷氨酸');
            namedNode(...p.slc25a11, 'SLC25A11', 'malate-alpha-kg-carrier');
            namedNode(...p.slc25a12, 'SLC25A12/13', 'aspartate-glutamate-carrier');

            label(20, 24, 'MDH1', 'schematic-enzyme');
            label(20, 37, '胞质 NADH → NAD⁺', 'schematic-cofactor');
            label(61, 24, 'GOT1', 'schematic-enzyme');
            label(32, 57, '苹果酸入 · α-KG 出', 'schematic-exchange');
            label(72, 57, '天冬氨酸出 · 谷氨酸 + H⁺入', 'schematic-exchange');
            label(40, 65, 'MDH2', 'schematic-enzyme');
            label(39, 81, '基质 NAD⁺ → NADH', 'schematic-cofactor');
            label(62, 65, 'GOT2', 'schematic-enzyme');

            line(...p.oaaC, ...p.malC);
            line(...p.malC, ...p.slc25a11, true, 'schematic-route schematic-transporter-route');
            line(...p.slc25a11, ...p.malM, true, 'schematic-route schematic-transporter-route');
            line(...p.alphaKgM, ...p.slc25a11, true, 'schematic-route schematic-transporter-route');
            line(...p.slc25a11, ...p.alphaKgC, true, 'schematic-route schematic-transporter-route');
            line(...p.malM, ...p.oaaM); line(...p.oaaM, ...p.aspM);
            line(...p.gluM, ...p.alphaKgM, true, 'schematic-route schematic-cofactor-route');
            line(...p.aspM, ...p.slc25a12, true, 'schematic-route schematic-transporter-route');
            line(...p.slc25a12, ...p.aspC, true, 'schematic-route schematic-transporter-route');
            line(...p.gluC, ...p.slc25a12, true, 'schematic-route schematic-transporter-route');
            line(...p.slc25a12, ...p.gluM, true, 'schematic-route schematic-transporter-route');
            routePath('M 68.5 29 C 61 20, 19 20, 11.5 29', true, 'schematic-route');
            line(...p.alphaKgC, ...p.gluC, true, 'schematic-route schematic-cofactor-route');

            stepBadge(20, 27, 1); stepBadge(32, 45, 2); stepBadge(40, 68, 3);
            stepBadge(62, 68, 4); stepBadge(72, 45, 5); stepBadge(61, 27, 6);
            label(29, 91, '还原当量转移 · NADH 不跨膜', 'schematic-note');
            label(73, 91, '基质 NADH → 复合体 I', 'schematic-output');
          } else if (pathwayId === 'glycerol_phosphate') {
            const p = {
              dhapC: [11, 35], g3pC: [34, 35], vdacG3p: [36, 49],
              g3pIms: [44, 68], gpd2: [64, 68], dhapIms: [85, 68], vdacDhap: [84, 49],
              coq: [71, 84], coqh2: [89, 84]
            };
            label(50, 13, '甘油-3-磷酸穿梭 · 四事件把胞质还原当量送入 CoQ', 'schematic-title');
            add('rect', { x: 4, y: 18, width: 92, height: 20, rx: 3, class: 'schematic-gp-zone schematic-gp-cytosol-zone', 'data-gp-zone': 'cytosol' });
            add('rect', { x: 4, y: 40, width: 92, height: 12, rx: 3, class: 'schematic-gp-zone schematic-gp-outer-zone', 'data-gp-zone': 'outer-membrane' });
            add('rect', { x: 4, y: 54, width: 92, height: 22, rx: 3, class: 'schematic-gp-zone schematic-gp-ims-zone', 'data-gp-zone': 'intermembrane' });
            add('rect', { x: 4, y: 78, width: 92, height: 10, rx: 3, class: 'schematic-gp-zone schematic-gp-inner-zone', 'data-gp-zone': 'inner-membrane' });
            add('rect', { x: 4, y: 90, width: 92, height: 7, rx: 3, class: 'schematic-gp-zone schematic-gp-net-zone', 'data-gp-zone': 'net' });
            label(8, 22, '胞质', 'schematic-compartment-title', { 'text-anchor': 'start' });
            label(8, 43.5, '外膜', 'schematic-compartment-title', { 'text-anchor': 'start' });
            label(8, 58, '膜间隙侧 · GPD2 活性位点', 'schematic-compartment-title', { 'text-anchor': 'start' });
            label(8, 81.5, '内膜 · CoQ 池', 'schematic-compartment-title', { 'text-anchor': 'start' });

            metabolite(...p.dhapC, 'DHAP'); metabolite(...p.g3pC, '甘油-3-磷酸');
            namedNode(...p.vdacG3p, 'VDAC', 'vdac-g3p');
            metabolite(...p.g3pIms, '甘油-3-磷酸');
            namedNode(...p.gpd2, 'GPD2', 'gpd2');
            metabolite(...p.dhapIms, 'DHAP');
            namedNode(...p.vdacDhap, 'VDAC', 'vdac-dhap');
            metabolite(...p.coq, 'CoQ'); metabolite(...p.coqh2, 'CoQH₂');

            line(...p.dhapC, ...p.g3pC, true);
            line(...p.g3pC, ...p.vdacG3p, true, 'schematic-route schematic-transporter-route');
            line(...p.vdacG3p, ...p.g3pIms, true, 'schematic-route schematic-transporter-route');
            line(...p.g3pIms, ...p.gpd2);
            line(...p.gpd2, ...p.dhapIms);
            line(...p.dhapIms, ...p.vdacDhap, true, 'schematic-route schematic-transporter-route');
            routePath('M 82.5 48 C 68 41, 25 41, 12 34', true, 'schematic-route schematic-transporter-route');
            routePath('M 65 69 C 66 74, 68 78, 70 82', false, 'schematic-route schematic-cofactor-route');
            line(...p.coq, ...p.coqh2);

            label(50, 23, 'GPD1 · NADH + H⁺ → NAD⁺', 'schematic-cofactor');
            label(64, 75, '酶内 FAD → FADH₂', 'schematic-cofactor');
            label(80, 88, 'CoQ → CoQH₂', 'schematic-output');
            label(51, 51, '甘油-3-P 入 · DHAP 回', 'schematic-exchange');
            stepBadge(22, 29, 1); stepBadge(47, 45, 2); stepBadge(54, 64, 3); stepBadge(73, 45, 4);
            label(29, 94, 'NADH 不跨膜 · 不生成基质 NADH', 'schematic-note');
            label(74, 94, '绕过复合体 I · CoQH₂ → 复合体 III', 'schematic-output');
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
          const representedReactionRows = reactions.filter(reaction => groupsFor(reaction).includes(options.pathwayId)
            && Boolean(expertReactionEndpoints(reaction)));
          scopeLocal.innerHTML = '';
        if (scopeLocalLabel) scopeLocalLabel.textContent = '当前通路';
          appendScopeItem(scopeLocal, activePathway?.name || options.pathwayId, activePathway?.tone || scene.tone, () => setScenePathwayVisual(options.pathwayId));
          scopeLocalCount.textContent = '机制图';
          scopeExchange.innerHTML = '';
        if (scopeExchangeLabel) scopeExchangeLabel.textContent = '单步反应';
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
            step.dataset.reaction = reaction.id;
            const aliases = visibleReactionAliases(options.pathwayId, reaction, representedReactionRows);
            if (aliases.length) step.dataset.reactionAliases = aliases.map(candidate => candidate.id).join(' ');
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
        sceneAnnotationCount.textContent = '机制图';
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
            // 地标是就地讲解，不跳转：去向提示明确说「查看讲解」，与带 ↗ 的跳转目标区分。
            button.addEventListener('mouseenter', () => setSceneSourceHint(`查看讲解：${displayText(annotation.label)}（不跳转）`));
            button.addEventListener('focus', () => setSceneSourceHint(`查看讲解：${displayText(annotation.label)}（不跳转）`));
            button.addEventListener('mouseleave', () => setSceneSourceHint(null));
            button.addEventListener('blur', () => setSceneSourceHint(null));
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
          button.setAttribute('aria-label', hotspot.target ? `进入${button.textContent}` : `进入${button.textContent}机制图`);
          const hotspotDestination = hotspot.target
            ? `点击进入：${displayText(atlas.scenes[hotspot.target]?.title) || button.textContent}`
            : `点击进入：${displayText(pathway?.name) || button.textContent} 机制图`;
          button.addEventListener('mouseenter', () => setSceneSourceHint(hotspotDestination));
          button.addEventListener('focus', () => setSceneSourceHint(hotspotDestination));
          button.addEventListener('mouseleave', () => setSceneSourceHint(null));
          button.addEventListener('blur', () => setSceneSourceHint(null));
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
          pathwayButton.textContent = '当前通路图 · 放大 ⤢';
          pathwayButton.title = `${pathwayVisual[0]} · 再点一次放大`;
          const pathwayViewHint = () => pathwayButton.classList.contains('active')
            ? `再点一次放大：${pathwayVisual[0]} 大图`
            : `点击进入：${pathwayVisual[0]}`;
          pathwayButton.addEventListener('mouseenter', () => setSceneSourceHint(pathwayViewHint()));
          pathwayButton.addEventListener('focus', () => setSceneSourceHint(pathwayViewHint()));
          pathwayButton.addEventListener('mouseleave', () => setSceneSourceHint(null));
          pathwayButton.addEventListener('blur', () => setSceneSourceHint(null));
          pathwayButton.addEventListener('click', event => {
            event.stopPropagation();
            if (pathwayButton.classList.contains('active')) openPathwayVisualDialog(sceneBackground);
            else setScenePathwayVisual(pathwayId);
          });
          sceneViews.appendChild(pathwayButton);
        }
        const stationPlates = pathwayVisual ? expertPathwayStationPlates[pathwayId] : null;
        if (stationPlates) {
          stationPlates.forEach((station, index) => {
            const stationButton = document.createElement('button');
            stationButton.className = 'scene-view scene-station-view';
            stationButton.type = 'button';
            stationButton.dataset.stationView = String(index);
            stationButton.textContent = station.label;
            stationButton.title = `${station.label} · 再点一次放大`;
            const stationHint = () => stationButton.classList.contains('active')
              ? `再点一次放大：${station.label} 2K 图`
              : `点击查看：${station.label}`;
            stationButton.addEventListener('mouseenter', () => setSceneSourceHint(stationHint()));
            stationButton.addEventListener('focus', () => setSceneSourceHint(stationHint()));
            stationButton.addEventListener('mouseleave', () => setSceneSourceHint(null));
            stationButton.addEventListener('blur', () => setSceneSourceHint(null));
            stationButton.addEventListener('click', event => {
              event.stopPropagation();
              if (stationButton.classList.contains('active')) openPathwayVisualDialog(sceneBackground);
              else setSceneStationVisual(index);
            });
            sceneViews.appendChild(stationButton);
          });
        }
        scene.views.forEach((entry, index) => {
          const { label } = sceneViewEntry(scene, index);
          const button = document.createElement('button');
          button.className = 'scene-view';
          button.type = 'button';
          button.dataset.sceneView = String(index);
          button.textContent = label;
          button.addEventListener('click', event => { event.stopPropagation(); setSceneView(index); });
          button.addEventListener('mouseenter', () => setSceneSourceHint(`切换视角：${label}`));
          button.addEventListener('focus', () => setSceneSourceHint(`切换视角：${label}`));
          button.addEventListener('mouseleave', () => setSceneSourceHint(null));
          button.addEventListener('blur', () => setSceneSourceHint(null));
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
        if (sceneDeck.classList.contains('pathway-station-active')) {
          const stationPathwayId = sceneDeck.dataset.pathway;
          if (stationPathwayId && setScenePathwayVisual(stationPathwayId)) {
            updateSceneBackLabel();
            return;
          }
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
            updateSearchStatus(`已定位到专题：${studentTopicHit[1].label}`);
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
            updateSearchStatus(`已定位到：${participantHit.name}`);
            return;
          }
          const studentPathwayHit = preferredSearchMatch(
            coreStudyPathwayIds.map(pathwayId => [pathwayId, atlas.pathways[pathwayId]]).filter(([, pathway]) => pathway), query,
            ([pathwayId, pathway]) => [pathwayId, pathway.name, pathway.english],
            ([pathwayId, pathway]) => `${pathwayId} ${pathway.name} ${pathway.english || ''}`
          );
          if (studentPathwayHit) {
            renderStudentPathway(studentPathwayHit[0]);
            updateSearchStatus(`已定位到通路：${studentPathwayHit[1].name}`);
            return;
          }
        }
        const exactEnzyme = reactions.find(r => r.enzyme && r.enzyme.toLowerCase() === query);
        if (exactEnzyme) { if (currentSceneId) closeScene(); setStudentMode(false); openReaction(exactEnzyme); focusReaction(exactEnzyme); updateSearchStatus(`已定位到酶：${exactEnzyme.enzyme}`); return; }
        const entity = preferredSearchMatch(
          entities, query,
          e => [e.name, e.latin, e.label, e.id],
          e => `${e.name} ${e.latin} ${e.label} ${e.id}`
        );
        if (entity) { if (currentSceneId) closeScene(); setStudentMode(false); openEntity(entity); focusEntity(entity); updateSearchStatus(`已定位到：${entity.name}`); return; }
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
          if (participantEntity) { openEntity(participantEntity); focusEntity(participantEntity); updateSearchStatus(`已定位到：${participantEntity.name}`); return; }
          if (participantReaction) { openReaction(participantReaction); focusReaction(participantReaction); updateSearchStatus(`已定位到反应：${participantReaction.enzyme || participantReaction.equation || ''}`); return; }
        }
        const reaction = reactions.find(r => `${r.equation} ${r.enzyme}`.toLowerCase().includes(query));
        if (reaction) { if (currentSceneId) closeScene(); setStudentMode(false); openReaction(reaction); focusReaction(reaction); updateSearchStatus(`已定位到反应：${reaction.enzyme || reaction.equation || ''}`); return; }
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
        if (atlasPath) { setStudentMode(false, { buildExpert: false }); openScene(atlasPath[1].scene); openPathway(atlasPath[0]); updateSearchStatus(`已定位到通路：${atlasPath[1].name}`); return; }
        const organelle = organelles.find(o => `${o.name} ${o.sub}`.toLowerCase().includes(query));
        if (organelle?.sceneId) { openScene(organelle.sceneId); updateSearchStatus(`已定位到细胞器：${organelle.name}`); return; }
        const atlasScene = Object.entries(atlas.scenes).find(([, s]) => `${s.title} ${s.subtitle} ${s.description}`.toLowerCase().includes(query));
        if (atlasScene) { openScene(atlasScene[0]); updateSearchStatus(`已定位到场景：${atlasScene[1].title}`); return; }
        const path = coreStudyPathwayIds.map(pathwayId => [pathwayId, pathwayMeta[pathwayId]]).find(([, m]) => m && `${m.label} ${m.english}`.toLowerCase().includes(query));
        if (path) { if (currentSceneId) closeScene(); setStudentMode(false); document.querySelector(`[data-path="${path[0]}"]`)?.click(); updateSearchStatus(`已定位到通路：${path[1].label}`); return; }
        updateSearchStatus(`未找到“${rawQuery}”。`, true);
        if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
          searchInput.animate([{ transform: 'translateX(0)' }, { transform: 'translateX(-5px)' }, { transform: 'translateX(5px)' }, { transform: 'translateX(0)' }], { duration: 250 });
        }
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
      studentPathwayCopy?.addEventListener('click', copyStudentPathwayLink);
      window.addEventListener('hashchange', () => {
        const pathwayId = studentPathwayIdFromHash();
        if (pathwayId) openStudentPathwayFromHash(pathwayId);
      });
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
      if (coverMetaPrimary) coverMetaPrimary.textContent = `${pathwayCount} 条核心主线 · ${Object.keys(coreStudyModules).length} 个重点专题`;
      if (coverMetaSecondary) coverMetaSecondary.textContent = '从专题进入任意代谢通路';

      const statusSummary = document.getElementById('statusSummary');
      if (statusSummary) {
        statusSummary.textContent = `${pathwayCount} 条核心主线 · ${Object.keys(coreStudyModules).length} 个重点专题 · 完整数据保留在底层`;
      }

      const brandVersion = document.getElementById('brandVersion');
      if (brandVersion && atlas.version) {
        brandVersion.textContent = `${brandVersion.textContent.trim()} · 数据 ${atlas.version}`;
      }

      openStudentPathwayFromHash();
    })();
