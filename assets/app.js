/* =============================================================================
   Ahlson · 主脚本
   - 无依赖、纯原生 JS
   - 状态持久化: localStorage
   - 安全: 不使用 innerHTML 处理用户数据
   ============================================================================= */

(function () {
    'use strict';

    /* -------------------------------------------------------------------------
       常量与本地存储键
       ------------------------------------------------------------------------- */
    const STORAGE = {
        mode:   'homepage_network_mode',     // 'auto' | 'internal' | 'external'
        theme:  'homepage_theme',            // 'auto' | 'light' | 'dark'
        favs:   'homepage_favorites',        // JSON array of service IDs
        engine: 'homepage_search_engine',    // 'bing' | 'google' | 'baidu'
        overrides: 'homepage_overrides',     // 网页端增删改/排序后的完整配置 (优先于 services.json)
    };

    const MODE = { AUTO: 'auto', INTERNAL: 'internal', EXTERNAL: 'external' };

    // 网页搜索引擎
    const ENGINES = {
        bing:   { label: 'Bing',   url: 'https://www.bing.com/search?q=' },
        google: { label: 'Google', url: 'https://www.google.com/search?q=' },
        baidu:  { label: '百度',   url: 'https://www.baidu.com/s?wd=' },
    };
    const DEFAULT_ENGINE = 'bing';

    /* -------------------------------------------------------------------------
       状态
       ------------------------------------------------------------------------- */
    const state = {
        config: null,         // services.json 内容 (或 localStorage 覆盖层)
        mode: MODE.AUTO,      // 当前模式
        actualMode: MODE.INTERNAL, // 自动模式解析后的真实模式
        theme: 'auto',        // 当前主题
        engine: DEFAULT_ENGINE, // 搜索引擎
        favorites: new Set(), // 收藏的 service ID (插入顺序即显示顺序)
        favsCustomized: false, // 用户是否在浏览器里改过收藏 (改过则 localStorage 优先于 JSON 预设)
        flatIndex: [],        // 扁平化索引: [{ id, category, item, element }]
        drag: null,           // 当前拖拽: { kind: 'fav'|'item'|'cat', ... }
        editing: false,       // 编辑模式 (增删改 + 导出)
        hasOverrides: false,  // localStorage 是否存在网页端修改的配置
        modalCtx: null,       // 编辑弹窗上下文
    };

    /* -------------------------------------------------------------------------
       DOM 引用
       ------------------------------------------------------------------------- */
    const $ = (sel) => document.querySelector(sel);
    const els = {
        title:       $('#siteTitle'),
        clockTime:   $('#clockTime'),
        clockDate:   $('#clockDate'),
        search:      $('#searchInput'),
        searchKbd:   $('#searchKbd'),
        engineBtn:   $('#engineBtn'),
        engineMenu:  $('#engineMenu'),
        engineOpts:  document.querySelectorAll('.engine-option'),
        seg:         document.querySelectorAll('.seg-btn'),
        themeToggle: $('#themeToggle'),
        backTop:     $('#backTop'),
        editToggle:  $('#editToggle'),
        exportBtn:   $('#exportBtn'),
        resetBtn:    $('#resetBtn'),
        addCatBtn:   $('#addCategoryBtn'),
        modalOverlay: $('#editModal'),
        modal:       document.querySelector('#editModal .modal'),
        modalTitle:  $('#modalTitle'),
        editForm:    $('#editForm'),
        fNameLabel:  $('#fNameLabel'),
        fName:       $('#fName'),
        fDesc:       $('#fDesc'),
        fIcon:       $('#fIcon'),
        fIconPreview: $('#fIconPreview'),
        fType:       $('#fType'),
        fCategory:   $('#fCategory'),
        fInternal:   $('#fInternal'),
        fExternal:   $('#fExternal'),
        modalCancel: $('#modalCancel'),
        favSection:  $('#favSection'),
        favGrid:     $('#favGrid'),
        categories:  $('#categoriesContainer'),
        empty:       $('#emptyState'),
        cardTpl:     $('#cardTemplate'),
    };

    /* -------------------------------------------------------------------------
       工具函数
       ------------------------------------------------------------------------- */
    const safeText = (el, value) => {
        el.textContent = value == null ? '' : String(value);
    };

    const hostOf = (url) => {
        if (!url) return '';
        try {
            const u = new URL(url);
            return u.host + (u.pathname !== '/' ? u.pathname : '');
        } catch (_) {
            return url;
        }
    };

    const makeId = (category, name) => `${category}::${name}`;

    /* -------------------------------------------------------------------------
       数据加载
       ------------------------------------------------------------------------- */
    async function loadConfig() {
        try {
            const res = await fetch('config/services.json', { cache: 'no-cache' });
            if (!res.ok) throw new Error('HTTP ' + res.status);
            state.config = await res.json();
            // 网页端修改过的配置 (localStorage 覆盖层) 优先于文件
            try {
                const ov = localStorage.getItem(STORAGE.overrides);
                if (ov) {
                    const parsed = JSON.parse(ov);
                    if (parsed && Array.isArray(parsed.categories) && parsed.categories.length) {
                        state.config = parsed;
                        state.hasOverrides = true;
                    }
                }
            } catch (_) {}
            return true;
        } catch (e) {
            console.error('[homepage] 加载配置失败:', e);
            renderLoadError();
            return false;
        }
    }

    function renderLoadError() {
        els.categories.innerHTML = '';
        const div = document.createElement('div');
        div.className = 'empty';
        const e = document.createElement('div');
        e.className = 'empty-emoji';
        e.textContent = '⚠️';
        const t = document.createElement('div');
        t.className = 'empty-title';
        t.textContent = '无法加载服务配置';
        const d = document.createElement('div');
        d.className = 'empty-desc';
        d.textContent = '请确认 config/services.json 存在并可访问';
        div.append(e, t, d);
        els.categories.appendChild(div);
    }

    /* -------------------------------------------------------------------------
       偏好持久化
       ------------------------------------------------------------------------- */
    function loadPreferences() {
        state.mode = localStorage.getItem(STORAGE.mode) || MODE.AUTO;
        state.theme = localStorage.getItem(STORAGE.theme) || 'auto';
        state.engine = localStorage.getItem(STORAGE.engine) || DEFAULT_ENGINE;
        if (!ENGINES[state.engine]) state.engine = DEFAULT_ENGINE;

        try {
            const stored = localStorage.getItem(STORAGE.favs);
            // 记录用户是否改过收藏: 改过 → localStorage 优先; 没改过 → 用 JSON 里的 favorites 预设
            state.favsCustomized = stored != null;
            if (stored) {
                state.favorites = new Set(JSON.parse(stored));
            }
        } catch (_) {}
    }

    function savePreferences() {
        localStorage.setItem(STORAGE.mode, state.mode);
        localStorage.setItem(STORAGE.theme, state.theme);
        localStorage.setItem(STORAGE.engine, state.engine);
        localStorage.setItem(STORAGE.favs, JSON.stringify([...state.favorites]));
    }

    /* -------------------------------------------------------------------------
       主题
       ------------------------------------------------------------------------- */
    function getEffectiveTheme() {
        if (state.theme === 'auto') {
            return window.matchMedia('(prefers-color-scheme: dark)').matches
                ? 'dark'
                : 'light';
        }
        return state.theme;
    }

    function applyTheme() {
        const effective = getEffectiveTheme();
        document.documentElement.setAttribute('data-theme', effective);
        els.themeToggle.setAttribute('aria-label',
            state.theme === 'auto'
                ? `主题: 跟随系统 (${effective})`
                : `主题: ${effective === 'dark' ? '深色' : '浅色'}`);
    }

    function setupTheme() {
        applyTheme();

        els.themeToggle.addEventListener('click', () => {
            // 按当前"生效"主题直接取反: 深色 → 浅色, 浅色 → 深色 (一次点击必生效)
            const effective = getEffectiveTheme();
            state.theme = effective === 'dark' ? 'light' : 'dark';
            savePreferences();
            applyTheme();
        });

        const mq = window.matchMedia('(prefers-color-scheme: dark)');
        mq.addEventListener('change', () => {
            if (state.theme === 'auto') applyTheme();
        });
    }

    /* -------------------------------------------------------------------------
       模式 (auto / internal / external)
       只有 server 服务才有内网/外网之分; 书签始终使用外网地址。
       ------------------------------------------------------------------------- */
    function resolveAutoMode() {
        // 静态页面无法可靠判断公网/内网。
        // 启发式: 如果 hostname 是 localhost / 127.0.0.1 / 私有 IP，使用 internal。
        const h = location.hostname;
        if (h === 'localhost' || h === '127.0.0.1' || h === '::1' || h === '') {
            return MODE.INTERNAL;
        }
        // 简单判断 IPv4 私有地址
        const m = h.match(/^(\d+)\.(\d+)\.(\d+)\.(\d+)$/);
        if (m) {
            const [_, a, b] = m.map(Number);
            if (a === 10 || a === 192 && b === 168 || a === 172 && b >= 16 && b <= 31) {
                return MODE.INTERNAL;
            }
        }
        // 公网域名 → 外网优先
        return MODE.EXTERNAL;
    }

    function getActualMode() {
        if (state.mode === MODE.AUTO) return resolveAutoMode();
        return state.mode;
    }

    function applyMode() {
        state.actualMode = getActualMode();
        // segmented control UI
        els.seg.forEach((b) => {
            const isActive = b.dataset.mode === state.mode;
            b.setAttribute('aria-selected', String(isActive));
        });
        // 刷新所有卡片可用状态
        refreshAllCardsState();
    }

    function setupMode() {
        els.seg.forEach((b) => {
            b.addEventListener('click', () => {
                state.mode = b.dataset.mode;
                savePreferences();
                applyMode();
            });
        });
        applyMode();
    }

    /* -------------------------------------------------------------------------
       时间
       ------------------------------------------------------------------------- */
    function pad(n) { return String(n).padStart(2, '0'); }

    function tickClock() {
        const now = new Date();
        const h = pad(now.getHours());
        const m = pad(now.getMinutes());
        const s = pad(now.getSeconds());
        // 秒数小一号、加 muted 色 (用户要求看到秒)
        els.clockTime.innerHTML = `${h}<span class="clock-colon">:</span>${m}<span class="clock-sec">:${s}</span>`;

        const date = now.toLocaleDateString('zh-CN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            weekday: 'long'
        });
        safeText(els.clockDate, date);
    }

    function setupClock() {
        tickClock();
        // 每秒刷新以便秒数可见
        setInterval(tickClock, 1000);
    }

    /* -------------------------------------------------------------------------
       渲染卡片
       ------------------------------------------------------------------------- */
    function resolveIconUrl(iconPath) {
        if (!iconPath) return '';
        // 已经是完整 URL
        if (/^https?:\/\//i.test(iconPath)) return iconPath;
        // 已是根相对路径 / 或显式 ./ 开头
        if (iconPath.startsWith('/') || iconPath.startsWith('./')) return iconPath;
        // 已有目录前缀 (如 "icons/..."  或 "images/...")
        if (iconPath.includes('/')) return iconPath;
        // 否则默认从 icons/ 目录读取
        return 'icons/' + iconPath;
    }

    // 自动识别 server / bookmark, 作为 type 缺失时的回退
    function detectType(item) {
        if (item.internalUrl) return 'server';
        const ext = item.externalUrl || '';
        if (/\.(ahlson|home)\.uk/i.test(ext)) return 'server';
        return 'bookmark';
    }

    function isServerItem(item) {
        return (item.type || detectType(item)) === 'server';
    }

    function createCard(categoryName, item, opts) {
        opts = opts || {};
        const tpl = els.cardTpl.content.cloneNode(true);
        const card = tpl.querySelector('.card');
        const img  = tpl.querySelector('.card-icon img');
        const star = tpl.querySelector('.card-star');
        const name = tpl.querySelector('.card-name');
        const desc = tpl.querySelector('.card-desc');
        const host = tpl.querySelector('.card-host');

        const id = makeId(categoryName, item.name);
        card.dataset.id = id;

        // 区分服务/书签, 卡片视觉尺寸不同
        const cardType = item.type || detectType(item);
        card.classList.add(cardType === 'server' ? 'is-server' : 'is-bookmark');
        card.dataset.type = cardType;

        // 图标 - 安全加载
        img.alt = item.name + ' 图标';
        img.src = resolveIconUrl(item.icon || '');
        img.addEventListener('error', () => {
            const fallback = document.createElement('div');
            fallback.className = 'card-icon-fallback';
            fallback.textContent = (item.name || '?').charAt(0).toUpperCase();
            img.replaceWith(fallback);
        }, { once: true });

        safeText(name, item.name);
        safeText(desc, item.description || '');

        // 当前模式 host 预览
        updateCardHostDisplay(host, item);

        card.href = '#'; // 默认无链接，由 updateCardState 决定

        // 收藏按钮
        if (state.favorites.has(id)) {
            star.classList.add('is-on');
        }
        star.addEventListener('click', (ev) => {
            ev.preventDefault();
            ev.stopPropagation();
            toggleFavorite(id);
        });

        // 悬停记录光标位置 (用于光晕效果)
        card.addEventListener('mousemove', (ev) => {
            const r = card.getBoundingClientRect();
            const x = ((ev.clientX - r.left) / r.width)  * 100;
            const y = ((ev.clientY - r.top)  / r.height) * 100;
            card.style.setProperty('--mx', x + '%');
            card.style.setProperty('--my', y + '%');
        });

        // 键盘可达性
        card.addEventListener('keydown', (ev) => {
            if (ev.key === 'Enter' || ev.key === ' ') {
                ev.preventDefault();
                card.click();
            }
        });

        // 编辑模式下点卡片不打开链接 (只用按钮操作)
        card.addEventListener('click', (ev) => {
            if (state.editing) ev.preventDefault();
        });

        // 编辑动作层: ✎ 编辑 / ✕ 删除 (仅编辑模式可见; 收藏区卡片不带)
        if (!opts.fav) {
            const acts = document.createElement('div');
            acts.className = 'card-acts';

            const editBtn = document.createElement('button');
            editBtn.type = 'button';
            editBtn.className = 'card-act is-edit';
            editBtn.title = '编辑';
            editBtn.setAttribute('aria-label', '编辑 ' + item.name);
            editBtn.innerHTML = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>';
            editBtn.addEventListener('click', (ev) => {
                ev.preventDefault();
                ev.stopPropagation();
                openModal({ mode: 'item-edit', category: categoryName, name: item.name });
            });

            const delBtn = document.createElement('button');
            delBtn.type = 'button';
            delBtn.className = 'card-act is-del';
            delBtn.title = '删除';
            delBtn.setAttribute('aria-label', '删除 ' + item.name);
            delBtn.innerHTML = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>';
            delBtn.addEventListener('click', (ev) => {
                ev.preventDefault();
                ev.stopPropagation();
                deleteItem(categoryName, item.name);
            });

            acts.append(editBtn, delBtn);
            // 点遮罩本身不触发链接
            acts.addEventListener('click', (ev) => {
                if (!ev.target.closest('button')) {
                    ev.preventDefault();
                    ev.stopPropagation();
                }
            });
            card.appendChild(acts);
        }

        return card;
    }

    // 解析卡片当前应该使用的 URL
    // - server: 内网模式用 internalUrl, 外网模式用 externalUrl
    // - bookmark: 永远使用 externalUrl (书签没有内网地址)
    function resolveUrl(item) {
        const useInternal = state.actualMode === MODE.INTERNAL && isServerItem(item);
        return useInternal ? item.internalUrl : item.externalUrl;
    }

    function updateCardHostDisplay(hostEl, item) {
        safeText(hostEl, hostOf(resolveUrl(item)));
    }

    function updateCardState(card) {
        const id = card.dataset.id;
        const indexEntry = state.flatIndex.find((x) => x.id === id);
        if (!indexEntry) return;
        const item = indexEntry.item;
        const url = resolveUrl(item);

        if (url) {
            card.classList.remove('is-disabled');
            card.removeAttribute('aria-disabled');
            // 所有链接一律新标签页打开
            card.target = '_blank';
            card.href = url;
            card.rel = 'noopener noreferrer';
        } else {
            card.classList.add('is-disabled');
            card.setAttribute('aria-disabled', 'true');
            card.removeAttribute('href');
        }
    }

    function refreshAllCardsState() {
        // 主列表卡片
        state.flatIndex.forEach(({ card, item }) => {
            updateCardState(card);
            updateCardHostDisplay(card.querySelector('.card-host'), item);
        });
        // 收藏区卡片
        els.favGrid.querySelectorAll('.card').forEach((card) => {
            const id = card.dataset.id;
            const entry = state.flatIndex.find((x) => x.id === id);
            if (entry) {
                updateCardState(card);
                updateCardHostDisplay(card.querySelector('.card-host'), entry.item);
            }
        });
    }

    /* -------------------------------------------------------------------------
       渲染结构
       ------------------------------------------------------------------------- */
    function render() {
        if (!state.config) return;
        const { site, categories } = state.config;

        safeText(els.title, site.title || 'Ahlson');
        document.title = site.title || 'Ahlson';

        // 渲染分类 (render 可被多次调用, 先清空旧索引)
        els.categories.innerHTML = '';
        state.flatIndex = [];

        categories.forEach((cat) => {
            const section = document.createElement('section');
            section.className = 'category';
            section.dataset.category = cat.name;

            // header (可拖拽排序分类)
            const header = document.createElement('div');
            header.className = 'category-header';
            header.draggable = true;
            attachCategoryDrag(header, cat.name);

            const h2 = document.createElement('h2');
            h2.className = 'category-title';

            const iconSpan = document.createElement('span');
            iconSpan.className = 'category-icon';
            iconSpan.textContent = cat.icon ? emojiForCategory(cat.icon) : '•';
            const nameSpan = document.createElement('span');
            nameSpan.textContent = cat.name;

            h2.append(iconSpan, nameSpan);

            const countSpan = document.createElement('span');
            countSpan.className = 'category-count';
            countSpan.textContent = String(cat.items.length);

            // 编辑模式: ＋添加服务 / ✎编辑分类 / 🗑删除分类
            const actGroup = document.createElement('div');
            actGroup.className = 'cat-act-group';
            actGroup.append(
                mkCatAct('＋', '在「' + cat.name + '」中添加服务', () =>
                    openModal({ mode: 'item-add', category: cat.name })),
                mkCatAct('✎', '编辑分类', () =>
                    openModal({ mode: 'cat-edit', name: cat.name, icon: cat.icon })),
                mkCatAct('🗑', '删除分类', () =>
                    deleteCategory(cat.name))
            );

            header.append(h2, countSpan, actGroup);
            section.appendChild(header);

            // grid
            const grid = document.createElement('div');
            grid.className = 'grid';

            // 多数为书签时使用紧凑网格
            const srvCount = cat.items.filter((it) => isServerItem(it)).length;
            if (srvCount < cat.items.length / 2) {
                grid.classList.add('is-bookmark-grid');
            }

            // 拖到网格空白处 = 移到该分类末尾 (跨分类移动也走这里)
            grid.addEventListener('dragover', (e) => {
                if (state.drag && state.drag.kind === 'item') e.preventDefault();
            });
            grid.addEventListener('drop', (e) => {
                e.preventDefault();
                if (state.drag && state.drag.kind === 'item') {
                    moveItem(state.drag.category, state.drag.name, cat.name, null);
                }
            });

            cat.items.forEach((item) => {
                const card = createCard(cat.name, item);
                // 主网格卡片可拖拽排序 / 跨分类移动
                card.draggable = true;
                attachItemDrag(card, cat.name, item.name);
                grid.appendChild(card);
                state.flatIndex.push({
                    id: makeId(cat.name, item.name),
                    category: cat.name,
                    name: item.name,
                    item: item,
                    card: card
                });
            });

            section.appendChild(grid);
            els.categories.appendChild(section);
        });

        // 初始化所有卡片状态
        refreshAllCardsState();

        // 首次访问: 用 JSON 里的 favorites 预设初始化收藏 (用户在浏览器改过则跳过)
        if (!state.favsCustomized) seedFavoritesFromConfig();

        // 渲染收藏区 (如果已有收藏)
        renderFavorites();
    }

    // 从 services.json 的 "favorites" 数组初始化收藏 (按名字匹配, 顺序即数组顺序)
    function seedFavoritesFromConfig() {
        const names = state.config && state.config.favorites;
        if (!Array.isArray(names) || names.length === 0) return;
        names.forEach((name) => {
            const entry = state.flatIndex.find((x) => x.name === name);
            if (entry) state.favorites.add(entry.id);
        });
    }

    function emojiForCategory(key) {
        const map = {
            star: '⭐', code: '⌨', database: '🗄', terminal: '⌘',
            bot: '🤖', play: '▶', cloud: '☁', sparkles: '✨'
        };
        // 已知 key 用映射; 直接写 emoji 也可以原样显示
        return map[key] || key || '•';
    }

    // 编辑模式的分类操作小按钮
    function mkCatAct(label, title, onClick) {
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'cat-act';
        b.title = title;
        b.setAttribute('aria-label', title);
        b.textContent = label;
        b.addEventListener('click', (ev) => {
            ev.preventDefault();
            ev.stopPropagation();
            onClick();
        });
        return b;
    }

    /* -------------------------------------------------------------------------
       收藏
       ------------------------------------------------------------------------- */
    function toggleFavorite(id) {
        state.favsCustomized = true; // 用户手动改过收藏, 之后 localStorage 优先
        let changed = false;
        if (state.favorites.has(id)) {
            state.favorites.delete(id);
            changed = true;
        } else {
            state.favorites.add(id);
            changed = true;
        }
        if (changed) {
            savePreferences();
            // 更新所有卡片上对应 star 的 UI
            document.querySelectorAll(`.card[data-id="${cssEscape(id)}"] .card-star`)
                .forEach((s) => s.classList.toggle('is-on', state.favorites.has(id)));
            renderFavorites();
        }
    }

    function renderFavorites() {
        const favs = [...state.favorites];
        els.favGrid.innerHTML = '';

        if (favs.length === 0) {
            els.favSection.hidden = true;
            return;
        }
        els.favSection.hidden = false;

        favs.forEach((id) => {
            const entry = state.flatIndex.find((x) => x.id === id);
            if (!entry) return;
            const card = createCard(entry.category, entry.item, { fav: true });
            card.classList.add('is-fav');
            card.title = entry.item.name; // 悬停显示名称
            // 可拖拽排序
            card.draggable = true;
            attachFavDrag(card, id);
            els.favGrid.appendChild(card);
            // 立即更新这张收藏卡片的可用状态 (因为它不在 flatIndex 里)
            updateCardState(card);
        });
    }

    /* -------------------------------------------------------------------------
       拖拽系统 (HTML5 Drag & Drop)
       - 收藏卡: 拖到另一张前 = 调整顺序; 空白处 = 移到最后
       - 服务卡: 同分类拖 = 排序; 拖到其他分类 = 移动归属; 拖到收藏区 = 加入收藏
       - 分类标题: 拖到另一个标题上 = 调整分类顺序
       ------------------------------------------------------------------------- */
    function clearDragVisuals() {
        state.drag = null;
        document.querySelectorAll('.is-dragging, .is-drag-over')
            .forEach((el) => el.classList.remove('is-dragging', 'is-drag-over'));
    }

    function attachFavDrag(card, id) {
        card.addEventListener('dragstart', (e) => {
            state.drag = { kind: 'fav', id };
            card.classList.add('is-dragging');
            e.dataTransfer.effectAllowed = 'move';
            try { e.dataTransfer.setData('text/plain', id); } catch (_) {}
        });

        card.addEventListener('dragend', clearDragVisuals);

        card.addEventListener('dragover', (e) => {
            if (!state.drag) return;
            if (state.drag.kind === 'fav' && state.drag.id === id) return;
            if (state.drag.kind === 'item') {
                e.preventDefault();
                card.classList.add('is-drag-over');
                return;
            }
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
            card.classList.add('is-drag-over');
        });

        card.addEventListener('dragleave', () => {
            card.classList.remove('is-drag-over');
        });

        card.addEventListener('drop', (e) => {
            e.preventDefault();
            e.stopPropagation(); // 防止冒泡到 grid 的"移到最后"逻辑
            card.classList.remove('is-drag-over');
            if (!state.drag) return;
            if (state.drag.kind === 'fav') {
                if (state.drag.id !== id) reorderFavorites(state.drag.id, id);
            } else if (state.drag.kind === 'item') {
                // 把服务卡拖到收藏区某张卡前 = 插入收藏
                addFavoriteBefore(state.drag.category, state.drag.name, id);
            }
        });
    }

    // 收藏区空白处: 收藏卡拖放 = 移到最后; 服务卡拖放 = 加入收藏 (末尾)
    function setupFavoritesDrag() {
        els.favGrid.addEventListener('dragover', (e) => {
            if (state.drag) e.preventDefault();
        });
        els.favGrid.addEventListener('drop', (e) => {
            e.preventDefault();
            if (!state.drag) return;
            if (state.drag.kind === 'fav') {
                reorderFavorites(state.drag.id, null);
            } else if (state.drag.kind === 'item') {
                addFavoriteBefore(state.drag.category, state.drag.name, null);
            }
        });
    }

    // 把 dragId 移到 targetId 前面 (targetId 为 null 则移到最后)
    function reorderFavorites(dragId, targetId) {
        const arr = [...state.favorites];
        const from = arr.indexOf(dragId);
        if (from === -1) return;
        const [moved] = arr.splice(from, 1);
        if (targetId == null) {
            arr.push(moved);
        } else {
            const to = arr.indexOf(targetId);
            if (to === -1) { arr.splice(from, 0, moved); return; }
            arr.splice(to, 0, moved);
        }
        state.favorites = new Set(arr);
        savePreferences();
        renderFavorites();
    }

    // 把某个服务加入收藏 (beforeId 为 null 则加到最后) — 用于拖服务卡到收藏区
    function addFavoriteBefore(categoryName, itemName, beforeId) {
        const id = makeId(categoryName, itemName);
        if (!state.favorites.has(id)) {
            const arr = [...state.favorites];
            const to = beforeId != null ? arr.indexOf(beforeId) : -1;
            if (to === -1) arr.push(id); else arr.splice(to, 0, id);
            state.favorites = new Set(arr);
        }
        state.favsCustomized = true;
        savePreferences();
        document.querySelectorAll(`.card[data-id="${cssEscape(id)}"] .card-star`)
            .forEach((s) => s.classList.add('is-on'));
        renderFavorites();
    }

    // ----- 主网格服务卡拖拽 -----
    function attachItemDrag(card, categoryName, itemName) {
        card.addEventListener('dragstart', (e) => {
            state.drag = { kind: 'item', category: categoryName, name: itemName };
            card.classList.add('is-dragging');
            e.dataTransfer.effectAllowed = 'move';
            try { e.dataTransfer.setData('text/plain', itemName); } catch (_) {}
        });

        card.addEventListener('dragend', clearDragVisuals);

        card.addEventListener('dragover', (e) => {
            if (!state.drag || state.drag.kind !== 'item') return;
            if (state.drag.category === categoryName && state.drag.name === itemName) return;
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
            card.classList.add('is-drag-over');
        });

        card.addEventListener('dragleave', () => {
            card.classList.remove('is-drag-over');
        });

        card.addEventListener('drop', (e) => {
            e.preventDefault();
            e.stopPropagation(); // 已处理, 不再冒泡给 grid
            card.classList.remove('is-drag-over');
            if (!state.drag || state.drag.kind !== 'item') return;
            if (state.drag.category === categoryName && state.drag.name === itemName) return;
            moveItem(state.drag.category, state.drag.name, categoryName, itemName);
        });
    }

    // ----- 分类标题拖拽 -----
    function attachCategoryDrag(header, name) {
        header.addEventListener('dragstart', (e) => {
            state.drag = { kind: 'cat', name };
            header.classList.add('is-dragging');
            e.dataTransfer.effectAllowed = 'move';
            try { e.dataTransfer.setData('text/plain', name); } catch (_) {}
        });

        header.addEventListener('dragend', clearDragVisuals);

        header.addEventListener('dragover', (e) => {
            if (!state.drag) return;
            if (state.drag.kind === 'cat') {
                if (state.drag.name === name) return;
                e.preventDefault();
                header.classList.add('is-drag-over');
            } else if (state.drag.kind === 'item') {
                // 允许把服务卡拖到分类标题上 = 移入该分类 (末尾)
                e.preventDefault();
                header.classList.add('is-drag-over');
            }
        });

        header.addEventListener('dragleave', () => {
            header.classList.remove('is-drag-over');
        });

        header.addEventListener('drop', (e) => {
            e.preventDefault();
            header.classList.remove('is-drag-over');
            if (!state.drag) return;
            if (state.drag.kind === 'cat') {
                if (state.drag.name !== name) moveCategory(state.drag.name, name);
            } else if (state.drag.kind === 'item') {
                moveItem(state.drag.category, state.drag.name, name, null);
            }
        });
    }

    function cssEscape(s) {
        return s.replace(/(["\\])/g, '\\$1');
    }

    /* -------------------------------------------------------------------------
       配置修改 (网页端增删改 + 排序)
       所有修改写入 localStorage 覆盖层 (homepage_overrides), 优先于 services.json;
       点「导出」可下载新的 services.json 替换文件后重新部署。
       ------------------------------------------------------------------------- */
    function persistOverrides() {
        try {
            localStorage.setItem(STORAGE.overrides, JSON.stringify(state.config));
            state.hasOverrides = true;
        } catch (e) {
            console.error('[homepage] 保存修改失败:', e);
        }
    }

    function findCategory(name) {
        return state.config.categories.find((c) => c.name === name);
    }

    // 收藏 ID 形如 "分类::名称", 改名/移动/改分类时同步映射
    function remapFavoriteId(oldId, newId) {
        if (oldId === newId || !state.favorites.has(oldId)) return;
        state.favorites = new Set([...state.favorites].map((x) => (x === oldId ? newId : x)));
        state.favsCustomized = true;
        savePreferences();
    }

    // 移动服务: fromCat 的 name 移到 toCat 中 beforeName 之前 (null = 末尾)
    function moveItem(fromCat, name, toCat, beforeName) {
        const src = findCategory(fromCat);
        const dst = findCategory(toCat);
        if (!src || !dst) return;
        const idx = src.items.findIndex((it) => it.name === name);
        if (idx === -1) return;
        const [item] = src.items.splice(idx, 1);
        if (beforeName == null) {
            dst.items.push(item);
        } else {
            const to = dst.items.findIndex((it) => it.name === beforeName);
            if (to === -1) dst.items.push(item);
            else dst.items.splice(to, 0, item);
        }
        if (fromCat !== toCat) {
            remapFavoriteId(makeId(fromCat, name), makeId(toCat, name));
        }
        persistOverrides();
        render();
    }

    // 移动分类: fromName 移到 toName 之前
    function moveCategory(fromName, toName) {
        const cats = state.config.categories;
        const from = cats.findIndex((c) => c.name === fromName);
        if (from === -1) return;
        const [cat] = cats.splice(from, 1);
        const to = cats.findIndex((c) => c.name === toName);
        if (to === -1) cats.push(cat);
        else cats.splice(to, 0, cat);
        persistOverrides();
        render();
    }

    function deleteItem(categoryName, name) {
        const cat = findCategory(categoryName);
        if (!cat) return;
        const idx = cat.items.findIndex((it) => it.name === name);
        if (idx === -1) return;
        if (!confirm(`删除「${name}」？`)) return;
        cat.items.splice(idx, 1);
        state.favorites.delete(makeId(categoryName, name));
        state.favsCustomized = true;
        savePreferences();
        persistOverrides();
        render();
    }

    function deleteCategory(name) {
        const cat = findCategory(name);
        if (!cat) return;
        const msg = cat.items.length
            ? `删除分类「${name}」及其中的 ${cat.items.length} 个服务？`
            : `删除空分类「${name}」？`;
        if (!confirm(msg)) return;
        // 清掉该分类下所有服务的收藏
        const prefix = name + '::';
        [...state.favorites].forEach((id) => {
            if (id.startsWith(prefix)) state.favorites.delete(id);
        });
        state.favsCustomized = true;
        savePreferences();
        state.config.categories.splice(state.config.categories.indexOf(cat), 1);
        persistOverrides();
        render();
    }

    /* -------------------------------------------------------------------------
       编辑模式 + 弹窗
       ------------------------------------------------------------------------- */
    function toggleEditMode() {
        state.editing = !state.editing;
        document.body.classList.toggle('is-editing', state.editing);
        els.editToggle.classList.toggle('is-on', state.editing);
        const label = state.editing ? '退出编辑模式' : '编辑模式';
        els.editToggle.title = label;
        els.editToggle.setAttribute('aria-label', label);
    }

    function setupEditMode() {
        els.editToggle.addEventListener('click', toggleEditMode);
        els.exportBtn.addEventListener('click', exportConfig);
        els.resetBtn.addEventListener('click', resetOverrides);
        els.addCatBtn.addEventListener('click', () => openModal({ mode: 'cat-add' }));
        setupModal();
    }

    function setupModal() {
        els.modalCancel.addEventListener('click', closeModal);
        els.modalOverlay.addEventListener('mousedown', (e) => {
            if (e.target === els.modalOverlay) closeModal();
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !els.modalOverlay.hidden) closeModal();
        });
        els.editForm.addEventListener('submit', (e) => {
            e.preventDefault();
            saveModal();
        });
        els.fIcon.addEventListener('input', updateIconPreview);
        els.fType.addEventListener('change', () => {
            const isServer = els.fType.value === 'server';
            els.fInternal.disabled = !isServer;
            els.fInternalField.style.opacity = isServer ? '' : '0.45';
        });
    }

    function updateIconPreview() {
        const v = els.fIcon.value.trim();
        if (!v) {
            els.fIconPreview.hidden = true;
            els.fIconPreview.removeAttribute('src');
            return;
        }
        els.fIconPreview.hidden = false;
        els.fIconPreview.src = resolveIconUrl(v);
    }

    function openModal(ctx) {
        state.modalCtx = ctx;
        const isCat = ctx.mode === 'cat-add' || ctx.mode === 'cat-edit';
        els.modal.classList.toggle('is-cat-mode', isCat);

        // 分类下拉
        els.fCategory.innerHTML = '';
        state.config.categories.forEach((c) => {
            const opt = document.createElement('option');
            opt.value = c.name;
            opt.textContent = c.name;
            els.fCategory.appendChild(opt);
        });

        if (isCat) {
            safeText(els.modalTitle, ctx.mode === 'cat-add' ? '新增分类' : '编辑分类');
            safeText(els.fNameLabel, '分类名称');
            els.fIcon.placeholder = 'emoji，或 star / code / cloud …';
            els.fName.value = ctx.mode === 'cat-edit' ? ctx.name : '';
            els.fIcon.value = ctx.mode === 'cat-edit' ? (ctx.icon || '') : '';
        } else {
            safeText(els.modalTitle, ctx.mode === 'item-add' ? '添加服务' : '编辑服务');
            safeText(els.fNameLabel, '名称');
            els.fIcon.placeholder = 'icons/ 下的文件名，或 https:// 完整链接';
            if (ctx.mode === 'item-add') {
                els.fName.value = '';
                els.fDesc.value = '';
                els.fIcon.value = '';
                els.fType.value = 'server';
                els.fInternal.value = '';
                els.fExternal.value = '';
                if (ctx.category) els.fCategory.value = ctx.category;
            } else {
                const cat = findCategory(ctx.category);
                const item = cat && cat.items.find((it) => it.name === ctx.name);
                if (!item) return;
                els.fName.value = item.name;
                els.fDesc.value = item.description || '';
                els.fIcon.value = item.icon || '';
                els.fType.value = item.type || (item.internalUrl ? 'server' : 'bookmark');
                els.fInternal.value = item.internalUrl || '';
                els.fExternal.value = item.externalUrl || '';
                els.fCategory.value = ctx.category;
            }
        }
        updateIconPreview();
        els.fType.dispatchEvent(new Event('change'));
        els.modalOverlay.hidden = false;
        els.fName.focus();
    }

    function closeModal() {
        els.modalOverlay.hidden = true;
        state.modalCtx = null;
    }

    function saveModal() {
        const ctx = state.modalCtx;
        if (!ctx) return;
        const name = els.fName.value.trim();
        if (!name) { els.fName.focus(); return; }
        const icon = els.fIcon.value.trim();

        if (ctx.mode === 'cat-add' || ctx.mode === 'cat-edit') {
            if (ctx.mode === 'cat-add') {
                if (findCategory(name)) { alert('已存在同名分类'); return; }
                state.config.categories.push({ name, icon: icon || 'star', items: [] });
            } else {
                const cat = findCategory(ctx.name);
                if (!cat) return;
                if (name !== ctx.name) {
                    if (findCategory(name)) { alert('已存在同名分类'); return; }
                    // 改分类名 → 收藏 ID 前缀同步
                    const oldPrefix = ctx.name + '::';
                    [...state.favorites].forEach((id) => {
                        if (id.startsWith(oldPrefix)) {
                            remapFavoriteId(id, name + '::' + id.slice(oldPrefix.length));
                        }
                    });
                    cat.name = name;
                }
                cat.icon = icon || cat.icon;
            }
        } else {
            const type = els.fType.value === 'bookmark' ? 'bookmark' : 'server';
            const internalUrl = type === 'server' ? els.fInternal.value.trim() : '';
            const externalUrl = els.fExternal.value.trim();
            const targetCat = findCategory(els.fCategory.value);
            if (!targetCat) return;

            if (ctx.mode === 'item-add') {
                targetCat.items.push({
                    name: name,
                    description: els.fDesc.value.trim(),
                    icon: icon,
                    internalUrl: internalUrl,
                    externalUrl: externalUrl,
                    type: type
                });
            } else {
                const srcCat = findCategory(ctx.category);
                if (!srcCat) return;
                const idx = srcCat.items.findIndex((it) => it.name === ctx.name);
                if (idx === -1) return;
                const newItem = {
                    name: name,
                    description: els.fDesc.value.trim(),
                    icon: icon,
                    internalUrl: internalUrl,
                    externalUrl: externalUrl,
                    type: type
                };
                if (srcCat === targetCat) {
                    srcCat.items[idx] = newItem;
                } else {
                    srcCat.items.splice(idx, 1);
                    targetCat.items.push(newItem);
                }
                remapFavoriteId(makeId(ctx.category, ctx.name), makeId(targetCat.name, name));
            }
        }
        persistOverrides();
        closeModal();
        render();
    }

    /* -------------------------------------------------------------------------
       导出 / 重置
       ------------------------------------------------------------------------- */
    function exportConfig() {
        // 把当前收藏状态写回 favorites 字段, 保证导出文件完整
        const names = [...state.favorites].map((id) => {
            const entry = state.flatIndex.find((x) => x.id === id);
            return entry ? entry.name : null;
        }).filter(Boolean);
        state.config.favorites = names;

        const data = JSON.stringify(state.config, null, 2);
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'services.json';
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(() => URL.revokeObjectURL(url), 2000);
    }

    function resetOverrides() {
        if (!state.hasOverrides) return;
        if (!confirm('丢弃所有网页端的修改，恢复到 services.json 文件的配置？')) return;
        localStorage.removeItem(STORAGE.overrides);
        try { location.reload(); } catch (_) {}
    }

    /* -------------------------------------------------------------------------
       网页搜索 (Google / Bing / Baidu)
       ------------------------------------------------------------------------- */
    function applyEngineUI() {
        const eng = ENGINES[state.engine];
        safeText(els.engineBtn, eng.label);
        els.search.placeholder = `使用 ${eng.label} 搜索网页…`;
        els.engineOpts.forEach((b) => {
            b.classList.toggle('is-active', b.dataset.engine === state.engine);
        });
    }

    function openWebSearch(query) {
        const q = (query || '').trim();
        if (!q) return;
        const url = ENGINES[state.engine].url + encodeURIComponent(q);
        window.open(url, '_blank', 'noopener');
    }

    function setupSearch() {
        applyEngineUI();

        // 回车 → 用当前搜索引擎在新标签页搜索
        els.search.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                openWebSearch(e.target.value);
            } else if (e.key === 'Escape') {
                els.search.value = '';
                els.search.blur();
            }
        });

        // 引擎菜单
        els.engineBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const expanded = els.engineMenu.hidden;
            els.engineMenu.hidden = !expanded;
            els.engineBtn.setAttribute('aria-expanded', String(expanded));
        });

        els.engineOpts.forEach((b) => {
            b.addEventListener('click', (e) => {
                e.stopPropagation();
                state.engine = b.dataset.engine;
                savePreferences();
                applyEngineUI();
                els.engineMenu.hidden = true;
                els.engineBtn.setAttribute('aria-expanded', 'false');
                els.search.focus();
            });
        });

        // 点击其他区域关闭菜单
        document.addEventListener('click', () => {
            if (!els.engineMenu.hidden) {
                els.engineMenu.hidden = true;
                els.engineBtn.setAttribute('aria-expanded', 'false');
            }
        });
    }

    /* -------------------------------------------------------------------------
       键盘快捷键
       ------------------------------------------------------------------------- */
    function setupKeyboard() {
        document.addEventListener('keydown', (e) => {
            // 忽略输入框中的 / 键
            if (e.target.matches('input, textarea')) return;
            if (e.key === '/') {
                e.preventDefault();
                els.search.focus();
                els.search.select();
            }
            // 数字键 1/2/3 切换模式
            if (e.key === '1') setMode(MODE.AUTO);
            if (e.key === '2') setMode(MODE.INTERNAL);
            if (e.key === '3') setMode(MODE.EXTERNAL);
            // E 切换编辑模式
            if (e.key === 'e' || e.key === 'E') toggleEditMode();
        });
    }

    function setMode(m) {
        if (state.mode === m) return;
        state.mode = m;
        savePreferences();
        applyMode();
    }

    /* -------------------------------------------------------------------------
       背景图
       ------------------------------------------------------------------------- */
    function setupBackground() {
        // 检查图片是否实际加载成功
        const img = new Image();
        img.onload = () => {
            // OK, 保留默认显示
        };
        img.onerror = () => {
            const bg = document.querySelector('.bg-layer');
            if (bg) bg.style.display = 'none';
        };
        img.src = 'images/background.jpg';
    }

    /* -------------------------------------------------------------------------
       回到顶部
       ------------------------------------------------------------------------- */
    function setupBackTop() {
        const onScroll = () => {
            const show = window.scrollY > 300;
            els.backTop.classList.toggle('is-visible', show);
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();

        els.backTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    /* -------------------------------------------------------------------------
       启动
       ------------------------------------------------------------------------- */
    async function boot() {
        loadPreferences();
        setupTheme();
        setupMode();
        setupClock();
        setupSearch();
        setupKeyboard();
        setupBackground();
        setupBackTop();
        setupFavoritesDrag();
        setupEditMode();

        const ok = await loadConfig();
        if (ok) render();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', boot);
    } else {
        boot();
    }
})();
