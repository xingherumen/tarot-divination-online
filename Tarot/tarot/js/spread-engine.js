(function (global) {
    'use strict';

    var TS = global.TarotSpreads;

    TS.SpreadEngine = {
        currentSpread: null,
        currentResult: null,
        isDrawing: false,
        drawEngine: null,
        drawnCardsBuffer: [],

        init: function () {
            this.bindEvents();
            this.renderSpreadSelector();
            this.initDrawIntegration();
        },

        initDrawIntegration: function () {
            var self = this;
            if (global.DrawDeckEngine) {
                self.drawEngine = global.DrawDeckEngine;
                self.drawEngine._spreadCallback = null;
            } else {
                var retryCount = 0;
                var retryInterval = setInterval(function () {
                    if (global.DrawDeckEngine) {
                        self.drawEngine = global.DrawDeckEngine;
                        self.drawEngine._spreadCallback = null;
                        clearInterval(retryInterval);
                    }
                    retryCount++;
                    if (retryCount > 20) {
                        clearInterval(retryInterval);
                        console.error('TarotSpreads: DrawDeckEngine 加载超时');
                    }
                }, 250);
            }
        },

        bindEvents: function () {
            var self = this;
            var drawBtn = document.getElementById('spreadDrawBtn');
            var resetBtn = document.getElementById('spreadResetBtn');
            var saveBtn = document.getElementById('spreadSaveBtn');
            var revealBtn = document.getElementById('spreadRevealBtn');

            if (drawBtn) {
                drawBtn.onclick = function () { self.startDraw(); };
            }
            if (resetBtn) {
                resetBtn.onclick = function () { self.reset(); };
            }
            if (saveBtn) {
                saveBtn.onclick = function () { self.saveToHistory(); };
            }
            if (revealBtn) {
                revealBtn.onclick = function () { self.onRevealClicked(); };
            }
        },

        renderSpreadSelector: function () {
            var container = document.getElementById('spreadSelector');
            if (!container) return;

            var spreads = TS.getAll();
            var html = '';

            spreads.forEach(function (spread) {
                var diffLabel = spread.difficulty === 'beginner' ? '入门' :
                                spread.difficulty === 'intermediate' ? '进阶' : '高级';
                var catLabel = spread.category === 'quick' ? '快问' :
                               spread.category === 'comprehensive' ? '综合' :
                               spread.category === 'analysis' ? '剖析' :
                               spread.category === 'relationship' ? '关系' :
                               spread.category === 'decision' ? '抉择' : '年度';

                html += '<div class="spread-option" data-spread-id="' + spread.id + '" ' +
                    'onclick="TarotSpreads.SpreadEngine.selectSpread(\'' + spread.id + '\')" ' +
                    'tabindex="0" role="button" aria-pressed="false">' +
                    '<div class="spread-option-header">' +
                        '<span class="spread-option-name">' + spread.name + '</span>' +
                        '<span class="spread-option-badge badge-' + spread.difficulty + '">' + diffLabel + '</span>' +
                    '</div>' +
                    '<div class="spread-option-meta">' +
                        '<span>' + spread.cardCount + '张牌</span>' +
                        '<span class="spread-option-cat">' + catLabel + '</span>' +
                    '</div>' +
                    '<div class="spread-option-desc">' + spread.description + '</div>' +
                '</div>';
            });

            container.innerHTML = html;
        },

        selectSpread: function (spreadId) {
            var self = this;
            var spread = TS.get(spreadId);
            if (!spread) return;

            if (self.isDrawing) return;

            self.currentSpread = spread;
            self.currentResult = null;
            self.drawnCardsBuffer = [];

            var options = document.querySelectorAll('.spread-option');
            options.forEach(function (opt) {
                opt.classList.remove('selected');
                opt.setAttribute('aria-pressed', 'false');
            });

            var selected = document.querySelector('[data-spread-id="' + spreadId + '"]');
            if (selected) {
                selected.classList.add('selected');
                selected.setAttribute('aria-pressed', 'true');
            }

            var infoPanel = document.getElementById('spreadInfo');
            if (infoPanel) {
                infoPanel.innerHTML =
                    '<h3>已选择：' + spread.name + '</h3>' +
                    '<p>' + spread.description + '</p>' +
                    '<p class="spread-suitable">适用场景：' + spread.suitableQuestions.slice(0, 4).join('、') + '</p>' +
                    '<p class="spread-flow">解读流程：' + spread.interpretationFlow.join(' → ') + '</p>';
                infoPanel.classList.remove('hidden');
            }

            var drawBtn = document.getElementById('spreadDrawBtn');
            if (drawBtn) {
                drawBtn.disabled = false;
                drawBtn.textContent = '🎴 抽取 ' + spread.cardCount + ' 张牌';
            }

            var layoutContainer = document.getElementById('spreadLayoutContainer');
            if (layoutContainer) {
                layoutContainer.innerHTML = '';
                layoutContainer.classList.add('hidden');
            }

            var interpContainer = document.getElementById('interpretationContainer');
            if (interpContainer) {
                interpContainer.innerHTML = '';
                interpContainer.classList.add('hidden');
            }

            var saveSection = document.querySelector('.spread-save-section');
            if (saveSection) saveSection.classList.add('hidden');

            var drawSection = document.getElementById('spreadDrawSection');
            if (drawSection) drawSection.classList.add('hidden');

            document.getElementById('spreadStep2').classList.remove('hidden');

            if (self.drawnCardsBuffer.length > 0) {
                self.drawnCardsBuffer = [];
            }
        },

        startDraw: function () {
            var self = this;
            if (!self.currentSpread || self.isDrawing) return;

            self.isDrawing = true;

            var drawBtn = document.getElementById('spreadDrawBtn');
            if (drawBtn) {
                drawBtn.disabled = true;
                drawBtn.textContent = '⏳ 准备中...';
            }

            document.getElementById('spreadStep2').classList.add('hidden');
            var statusEl = document.getElementById('spreadStatus');
            if (statusEl) statusEl.classList.add('hidden');

            var drawSection = document.getElementById('spreadDrawSection');
            if (drawSection) {
                drawSection.classList.remove('hidden');
                drawSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }

            var errorEl = document.getElementById('spreadDrawError');
            if (errorEl) errorEl.classList.add('hidden');

            var titleEl = document.getElementById('spreadDrawTitle');
            if (titleEl) titleEl.textContent = '🎴 请依次抽取 ' + self.currentSpread.cardCount + ' 张牌';

            var nameEl = document.getElementById('spreadDrawName');
            if (nameEl) nameEl.textContent = '牌阵：' + self.currentSpread.name;

            var countEl = document.getElementById('spreadDrawCount');
            if (countEl) countEl.textContent = '需抽 ' + self.currentSpread.cardCount + ' 张';

            var hintEl = document.getElementById('spreadDrawHint');
            if (hintEl) hintEl.textContent = '从牌堆中抽选，每次选一张你最有感应的牌';

            var deckModeSelect = document.getElementById('deckModeSelect');
            if (deckModeSelect) deckModeSelect.value = 'full';

            var deckContainer = document.getElementById('spreadDeckContainer');
            if (deckContainer) deckContainer.classList.remove('hidden');

            var remainEl = document.getElementById('spreadDeckRemain');
            if (remainEl) remainEl.classList.remove('hidden');

            self.drawnCardsBuffer = [];

            var totalDeckSize = 78;
            var remainCountEl = document.getElementById('remainCount');
            if (remainCountEl) remainCountEl.textContent = totalDeckSize;

            if (self.drawEngine) {
                self.drawEngine.mode = 'multi';
                self.drawEngine.multiCount = self.currentSpread.cardCount;
                self.drawEngine.multiDrawn = [];
                self.drawEngine.selectedCard = null;
                self.drawEngine.isAnimating = false;
                self.drawEngine.currentCards = [];
                self.drawEngine.drawnCards = [];

                self.drawEngine._spreadMode = true;
                self.drawEngine._spreadSelf = self;

                self.drawEngine.getDeck = function () {
                    return typeof getFullDeck === 'function' ? getFullDeck() :
                           window.majorArcana && window.minorArcana ? window.majorArcana.concat(window.minorArcana) :
                           window.majorArcana || [];
                };

                var origUpdateProgress = self.drawEngine.updateProgress;
                var origOnComplete = self.drawEngine.onMultiDrawComplete;

                self.drawEngine.updateProgress = function () {
                    var drawn = this.multiDrawn.length;
                    var total = this.multiCount;
                    var pct = Math.round((drawn / total) * 100);

                    var countEl = document.getElementById('spreadProgressCount');
                    var fillEl = document.getElementById('spreadProgressFill');
                    var dotsContainer = document.getElementById('spreadProgressCards');

                    if (countEl) countEl.textContent = drawn + ' / ' + total;
                    if (fillEl) fillEl.style.width = pct + '%';

                    if (dotsContainer) {
                        dotsContainer.innerHTML = '';
                        for (var i = 0; i < total; i++) {
                            var dot = document.createElement('div');
                            dot.className = 'progress-card-dot';
                            if (i < drawn) dot.classList.add('filled');
                            else if (i === drawn) dot.classList.add('current');
                            dot.textContent = '🃏';
                            dotsContainer.appendChild(dot);
                        }
                    }

                    var remainCountEl = document.getElementById('remainCount');
                    if (remainCountEl) {
                        var remaining = 78 - drawn;
                        remainCountEl.textContent = Math.max(0, remaining);
                    }

                    var progressContainer = document.getElementById('spreadProgressContainer');
                    if (progressContainer) progressContainer.classList.remove('hidden');
                };

                self.drawEngine.onMultiDrawComplete = function () {
                    var drawn = this.multiDrawn.length;
                    var hintEl = document.getElementById('spreadDrawHint');
                    if (hintEl) hintEl.textContent = '✨ 所有卡牌已抽取完毕！点击「统一揭开」同步揭示结果 ✨';

                    var revealArea = document.getElementById('spreadRevealArea');
                    if (revealArea) {
                        revealArea.classList.remove('hidden');
                        revealArea.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }

                    var progressContainer = document.getElementById('spreadProgressContainer');
                    if (progressContainer) {
                        var allDots = progressContainer.querySelectorAll('.progress-card-dot');
                        allDots.forEach(function (d) {
                            d.classList.remove('current');
                            d.classList.add('filled');
                        });
                    }

                    var remainCountEl = document.getElementById('remainCount');
                    if (remainCountEl) {
                        var remaining = 78 - drawn;
                        remainCountEl.textContent = Math.max(0, remaining);
                    }
                };

                var remainCountEl = document.getElementById('remainCount');
                if (remainCountEl) remainCountEl.textContent = 78;

                self.drawEngine.domCache.deck = document.getElementById('spreadDeck');
                self.drawEngine.domCache.drawHint = document.getElementById('spreadDrawHint');

                if (self.drawEngine.domCache.deck) {
                    self.drawEngine.createDeck();
                } else {
                    self.showError('⚠️ 牌堆容器未找到，请刷新页面后重试。');
                    self.isDrawing = false;
                    if (drawBtn) {
                        drawBtn.disabled = false;
                        drawBtn.textContent = '🎴 重新抽取';
                    }
                    return;
                }

                self.drawEngine.isAnimating = false;

                setTimeout(function () {
                    self.isDrawing = false;
                }, 300);
            } else {
                self.showError('⚠️ 抽牌引擎暂未就绪，系统将在后台自动重试，请稍候...');
                var retryLoad = setInterval(function () {
                    if (global.DrawDeckEngine) {
                        clearInterval(retryLoad);
                        self.drawEngine = global.DrawDeckEngine;
                        self.isDrawing = false;
                        self.startDraw();
                    }
                }, 500);
                setTimeout(function () {
                    clearInterval(retryLoad);
                    if (!self.drawEngine) {
                        self.showError('抽牌引擎加载超时，请<a href="#" style="color:#ec4899;text-decoration:underline;" onclick="location.reload()">刷新页面</a>后重试，或检查网络连接是否正常。');
                        self.isDrawing = false;
                        if (drawBtn) {
                            drawBtn.disabled = false;
                            drawBtn.textContent = '🔄 重试';
                            drawBtn.onclick = function () { location.reload(); };
                        }
                    }
                }, 10000);
            }
        },

        onRevealClicked: function () {
            var self = this;
            if (!self.drawEngine || self.isDrawing) return;

            var drawn = self.drawEngine.multiDrawn;
            if (!drawn || drawn.length === 0) return;
            if (drawn.length < self.currentSpread.cardCount) {
                var hintEl = document.getElementById('spreadDrawHint');
                if (hintEl) hintEl.textContent = '🎴 还有 ' + (self.currentSpread.cardCount - drawn.length) + ' 张牌未抽取，请继续选牌';
                return;
            }

            self.isDrawing = true;

            var revealArea = document.getElementById('spreadRevealArea');
            if (revealArea) revealArea.classList.add('hidden');

            var hintEl = document.getElementById('spreadDrawHint');
            if (hintEl) hintEl.textContent = '✨ 命运之牌正在揭开... ✨';

            var grid = document.getElementById('spreadMultiResultGrid');
            if (!grid) return;

            grid.classList.remove('hidden');
            grid.innerHTML = '';

            var html = '';
            drawn.forEach(function (entry, idx) {
                var card = entry.card;
                var orientation = entry.orientation;
                var uri = global.ImagePreloader && global.ImagePreloader.getUri ? global.ImagePreloader.getUri(card) : '';
                var revClass = orientation === '逆位' ? ' reversed' : '';
                var orientClass = orientation === '逆位' ? 'rev' : 'up';
                var orientSymbol = orientation === '逆位' ? '▼' : '▲';

                html += '<div class="multi-result-card' + revClass + '" data-index="' + idx + '" style="animation-delay:' + (idx * 0.12) + 's">' +
                    '<div class="result-card-inner">' +
                        '<div class="result-card-img">' +
                            '<img src="' + uri + '" alt="' + card.name + '" class="card-face-img" ' +
                            'onerror="this.style.display=\'none\';this.parentElement.innerHTML=\'<span class=card-placeholder-lg>🔮</span>\'" />' +
                        '</div>' +
                        '<div class="result-card-footer">' +
                            '<span class="rc-name">' + card.name + '</span>' +
                            '<span class="rc-orient ' + orientClass + '">' + orientSymbol + '</span>' +
                        '</div>' +
                    '</div>' +
                '</div>';
            });

            grid.innerHTML = html;

            var cardElements = grid.querySelectorAll('.multi-result-card');
            cardElements.forEach(function (el, idx) {
                setTimeout(function () {
                    el.classList.add('revealing');
                }, idx * 150);
            });

            var totalDelay = drawn.length * 150 + 800;

            setTimeout(function () {
                self.drawnCardsBuffer = drawn.slice();
                self.currentResult = {
                    id: Date.now(),
                    timestamp: new Date().toLocaleString(),
                    spreadId: self.currentSpread.id,
                    spreadName: self.currentSpread.name,
                    spreadDef: self.currentSpread,
                    question: document.getElementById('spreadQuestion') ?
                        document.getElementById('spreadQuestion').value || '' : '',
                    cards: drawn.map(function (entry) {
                        return {
                            card: entry.card,
                            orientation: entry.orientation
                        };
                    })
                };

                self.generateAndShowInterpretation();

                if (hintEl) hintEl.textContent = '✨ 占卜完成！共揭示 ' + drawn.length + ' 张牌 ✨';

                var remainCountEl = document.getElementById('remainCount');
                if (remainCountEl) remainCountEl.textContent = Math.max(0, 78 - drawn.length);

                self.isDrawing = false;
            }, totalDelay);

            var resultCards = grid.querySelectorAll('.multi-result-card');
            resultCards.forEach(function (el) {
                el.addEventListener('click', function () {
                    var idx = parseInt(this.getAttribute('data-index'));
                    self.openDrawnCardDetail(idx);
                });
            });
        },

        generateAndShowInterpretation: function () {
            var self = this;
            if (!self.currentResult || !self.currentSpread) return;

            try {
                var interp = self.currentSpread.interpret(self.currentResult);
                self.currentResult.interpretation = interp;
            } catch (e) {
                console.error('TarotSpreads: 解读生成失败', e);
                self.currentResult.interpretation = {
                    singleCards: [],
                    combinations: [],
                    overall: '解读生成时出现错误，请重试。',
                    themedAdvice: '请重新抽取牌阵。'
                };
            }

            try {
                sessionStorage.setItem('tarot_spread_result', JSON.stringify(self.currentResult));
            } catch (e) {
                console.error('TarotSpreads: 存储结果失败', e);
                self.showError('⚠️ 存储空间不足，请清理浏览器缓存后重试。');
                return;
            }

            self.renderInterpretation(self.currentResult.interpretation);

            var saveSection = document.querySelector('.spread-save-section');
            if (saveSection) saveSection.classList.remove('hidden');

            var interpretationContainer = document.getElementById('interpretationContainer');
            if (interpretationContainer) {
                interpretationContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }

            var resultArea = document.getElementById('spreadDrawResultArea');
            if (resultArea) {
                resultArea.innerHTML =
                    '<div class="multi-result-interp">' +
                        '<h3>📊 牌阵综合分析</h3>' +
                        '<div class="interp-stats">' +
                            self._buildStatBlocks() +
                        '</div>' +
                        '<div class="interp-overall">' +
                            '<p>' + interp.overall + '</p>' +
                        '</div>' +
                        '<div class="interp-advice">' +
                            '💫 ' + interp.themedAdvice +
                        '</div>' +
                    '</div>';
                resultArea.classList.remove('hidden');
            }
        },

        _buildStatBlocks: function () {
            var cards = this.currentResult.cards;
            var majorCount = 0;
            var revCount = 0;
            var elementCounts = { '火': 0, '水': 0, '风': 0, '土': 0 };

            cards.forEach(function (entry) {
                var card = entry.card;
                if (!card.type) majorCount++;
                if (entry.orientation === '逆位') revCount++;
                if (card.element && elementCounts[card.element] !== undefined) {
                    elementCounts[card.element]++;
                }
            });

            var dominantEl = '无';
            var maxEl = 0;
            Object.keys(elementCounts).forEach(function (el) {
                if (elementCounts[el] > maxEl) {
                    maxEl = elementCounts[el];
                    dominantEl = el;
                }
            });

            return '<div class="interp-stat">' +
                        '<span class="stat-value">' + cards.length + '</span>' +
                        '<span class="stat-label">总牌数</span>' +
                    '</div>' +
                    '<div class="interp-stat">' +
                        '<span class="stat-value">' + majorCount + '</span>' +
                        '<span class="stat-label">大阿卡纳</span>' +
                    '</div>' +
                    '<div class="interp-stat">' +
                        '<span class="stat-value">' + revCount + '</span>' +
                        '<span class="stat-label">逆位</span>' +
                    '</div>' +
                    '<div class="interp-stat">' +
                        '<span class="stat-value">' + dominantEl + '</span>' +
                        '<span class="stat-label">主导元素</span>' +
                    '</div>';
        },

        openDrawnCardDetail: function (index) {
            var entry = this.drawnCardsBuffer[index];
            if (!entry) return;

            var card = entry.card;
            var orientation = entry.orientation;
            var meaning = orientation === '正位' ? card.meaning : card.reverse;
            var uri = global.ImagePreloader && global.ImagePreloader.getUri ? global.ImagePreloader.getUri(card) : '';
            var pos = this.currentSpread && this.currentSpread.positions && this.currentSpread.positions[index]
                ? this.currentSpread.positions[index] : null;

            var overlay = document.getElementById('cardDetailOverlay');
            if (!overlay) {
                overlay = document.createElement('div');
                overlay.id = 'cardDetailOverlay';
                overlay.className = 'card-detail-overlay';
                overlay.onclick = function (e) {
                    if (e.target === overlay) overlay.classList.remove('active');
                };
                document.body.appendChild(overlay);
            }

            overlay.innerHTML =
                '<div class="card-detail-modal">' +
                    '<button class="card-detail-close" onclick="document.getElementById(\'cardDetailOverlay\').classList.remove(\'active\')">✕</button>' +
                    '<div class="card-detail-img">' +
                        '<img src="' + uri + '" alt="' + card.name + '" class="card-face-img" ' +
                        'onerror="this.style.display=\'none\';this.parentElement.innerHTML=\'<span class=card-placeholder-lg>🔮</span>\'" />' +
                    '</div>' +
                    '<div class="card-detail-info">' +
                        '<h3>' + card.name + ' <span class="' + (orientation === '逆位' ? 'reversed' : 'upright') + '">' +
                            orientation + '</span></h3>' +
                        (pos ? '<p class="card-detail-pos">📍 位置：' + pos.name + ' — ' + (pos.description || '') + '</p>' : '') +
                        '<p class="card-detail-meaning">「' + meaning + '」</p>' +
                        (card.element ? '<p>🔮 元素：' + card.element + '</p>' : '') +
                        (card.planet ? '<p>🌟 守护星：' + card.planet + '</p>' : '') +
                        '<p class="card-detail-advice">📜 指引：' + card.advice + '</p>' +
                    '</div>' +
                '</div>';

            overlay.classList.add('active');
        },

        showError: function (msg) {
            var errorEl = document.getElementById('spreadDrawError');
            if (errorEl) {
                errorEl.innerHTML = msg;
                errorEl.classList.remove('hidden');
                errorEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        },

        renderInterpretation: function (interp) {
            var container = document.getElementById('interpretationContainer');
            if (!container || !interp) return;

            var html = '<div class="interp-tabs">' +
                '<button class="interp-tab active" onclick="TarotSpreads.SpreadEngine.switchTab(\'single\')">单牌释义</button>' +
                '<button class="interp-tab" onclick="TarotSpreads.SpreadEngine.switchTab(\'combo\')">组合分析</button>' +
                '<button class="interp-tab" onclick="TarotSpreads.SpreadEngine.switchTab(\'overall\')">综合解读</button>' +
                '</div>' +
                '<div class="interp-panels">' +
                '<div class="interp-panel active" id="panel-single">' +
                    (interp.singleCards && interp.singleCards.length > 0 ? interp.singleCards.map(function (sc) {
                        return '<div class="interp-card-item">' +
                            '<div class="interp-card-header">' +
                                '<span class="interp-pos">' + sc.position + '</span>' +
                                '<span class="interp-card-name">' + sc.cardName + '</span>' +
                                '<span class="interp-orientation ' + (sc.orientation === '逆位' ? 'reversed' : 'upright') + '">' +
                                    sc.orientation + '</span>' +
                            '</div>' +
                            '<p class="interp-meaning">' + sc.contextNote + '</p>' +
                        '</div>';
                    }).join('') : '<p class="interp-empty">暂无单牌释义</p>') +
                '</div>' +
                '<div class="interp-panel" id="panel-combo">' +
                    (interp.combinations && interp.combinations.length > 0 ? interp.combinations.map(function (cb) {
                        return '<div class="interp-combo-item">' +
                            '<div class="interp-combo-header">' +
                                '<span class="interp-combo-pair">' + cb.pair + '</span>' +
                                '<span class="interp-combo-type ' + cb.type + '">' +
                                    (cb.type === 'harmonious' ? '和谐' : cb.type === 'conflicting' ? '冲突' : '中立') +
                                '</span>' +
                            '</div>' +
                            '<p class="interp-combo-desc">' + cb.analysis + '</p>' +
                        '</div>';
                    }).join('') : '<p class="interp-empty">暂无组合分析</p>') +
                '</div>' +
                '<div class="interp-panel" id="panel-overall">' +
                    '<div class="interp-overall-section">' +
                        '<h4>综合解读</h4>' +
                        '<p>' + (interp.overall || '暂无综合解读') + '</p>' +
                    '</div>' +
                    '<div class="interp-overall-section">' +
                        '<h4>行动建议</h4>' +
                        '<p class="interp-advice">' + (interp.themedAdvice || '暂无建议') + '</p>' +
                    '</div>' +
                '</div>' +
            '</div>';

            container.innerHTML = html;
            container.classList.remove('hidden');
        },

        switchTab: function (tabName) {
            var tabs = document.querySelectorAll('.interp-tab');
            var panels = document.querySelectorAll('.interp-panel');

            tabs.forEach(function (t) { t.classList.remove('active'); });
            panels.forEach(function (p) { p.classList.remove('active'); });

            var activeTab = document.querySelector('.interp-tab[onclick*="' + tabName + '"]');
            var activePanel = document.getElementById('panel-' + tabName);

            if (activeTab) activeTab.classList.add('active');
            if (activePanel) activePanel.classList.add('active');
        },

        reset: function () {
            var self = this;
            if (self.isDrawing) return;

            self.currentSpread = null;
            self.currentResult = null;
            self.drawnCardsBuffer = [];

            if (self.drawEngine) {
                self.drawEngine.multiDrawn = [];
                self.drawEngine.selectedCard = null;
                self.drawEngine.isAnimating = false;
                self.drawEngine.currentCards = [];
                self.drawEngine._spreadMode = false;
            }

            var layoutContainer = document.getElementById('spreadLayoutContainer');
            var interpContainer = document.getElementById('interpretationContainer');
            var infoPanel = document.getElementById('spreadInfo');
            var statusEl = document.getElementById('spreadStatus');
            var saveSection = document.querySelector('.spread-save-section');
            var drawBtn = document.getElementById('spreadDrawBtn');
            var step2 = document.getElementById('spreadStep2');
            var drawSection = document.getElementById('spreadDrawSection');
            var drawResultArea = document.getElementById('spreadDrawResultArea');
            var multiResultGrid = document.getElementById('spreadMultiResultGrid');
            var revealArea = document.getElementById('spreadRevealArea');
            var progressContainer = document.getElementById('spreadProgressContainer');
            var deckContainer = document.getElementById('spreadDeckContainer');
            var remainEl = document.getElementById('spreadDeckRemain');
            var errorEl = document.getElementById('spreadDrawError');

            if (layoutContainer) { layoutContainer.innerHTML = ''; layoutContainer.classList.add('hidden'); }
            if (interpContainer) { interpContainer.innerHTML = ''; interpContainer.classList.add('hidden'); }
            if (infoPanel) { infoPanel.classList.add('hidden'); }
            if (statusEl) statusEl.classList.add('hidden');
            if (saveSection) saveSection.classList.add('hidden');
            if (drawBtn) { drawBtn.disabled = true; drawBtn.textContent = '🎴 请先选择牌阵'; }
            if (step2) step2.classList.add('hidden');
            if (drawSection) drawSection.classList.add('hidden');
            if (drawResultArea) { drawResultArea.innerHTML = ''; drawResultArea.classList.add('hidden'); }
            if (multiResultGrid) { multiResultGrid.innerHTML = ''; multiResultGrid.classList.add('hidden'); }
            if (revealArea) revealArea.classList.add('hidden');
            if (progressContainer) progressContainer.classList.add('hidden');
            if (deckContainer) deckContainer.classList.add('hidden');
            if (remainEl) remainEl.classList.add('hidden');
            if (errorEl) errorEl.classList.add('hidden');

            var deckEl = document.getElementById('spreadDeck');
            if (deckEl) deckEl.innerHTML = '';

            var options = document.querySelectorAll('.spread-option');
            options.forEach(function (opt) {
                opt.classList.remove('selected');
                opt.setAttribute('aria-pressed', 'false');
            });

            this.renderSpreadSelector();
        },

        saveToHistory: function () {
            if (!this.currentResult) return;

            var record = {
                id: this.currentResult.id,
                date: this.currentResult.timestamp,
                type: 'spread',
                spreadId: this.currentResult.spreadId,
                spreadName: this.currentResult.spreadName,
                question: this.currentResult.question,
                cards: this.currentResult.cards.map(function (item) {
                    return {
                        position: '',
                        cardName: item.card.name,
                        orientation: item.orientation,
                        meaning: item.orientation === '正位' ? item.card.meaning : item.card.reverse
                    };
                }),
                interpretation: this.currentResult.interpretation
            };

            if (typeof HistoryStore !== 'undefined' && HistoryStore.add) {
                HistoryStore.add(record);
            } else {
                var history = [];
                try {
                    var raw = localStorage.getItem('tarot_history');
                    history = raw ? JSON.parse(raw) : [];
                } catch (e) {}
                history.unshift(record);
                if (history.length > 50) history.length = 50;
                try {
                    localStorage.setItem('tarot_history', JSON.stringify(history));
                } catch (e) {}
            }

            var saveBtn = document.getElementById('spreadSaveBtn');
            if (saveBtn) {
                saveBtn.textContent = '✅ 已保存';
                saveBtn.disabled = true;
                setTimeout(function () {
                    saveBtn.textContent = '💾 保存记录';
                    saveBtn.disabled = false;
                }, 2000);
            }
        },

        showCardDetail: function (event, cardIndex) {
            this.openDrawnCardDetail(cardIndex);
        },

        _shuffle: function (deck) {
            var arr = deck.slice();
            for (var i = arr.length - 1; i > 0; i--) {
                var j = Math.floor(Math.random() * (i + 1));
                var tmp = arr[i];
                arr[i] = arr[j];
                arr[j] = tmp;
            }
            return arr;
        }
    };

    TS.showCardDetail = function (event, cardIndex) {
        TS.SpreadEngine.showCardDetail(event, cardIndex);
    };

})(window);
