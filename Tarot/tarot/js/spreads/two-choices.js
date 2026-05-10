(function (global) {
    'use strict';

    var TS = global.TarotSpreads;

    TS.register({
        id: 'two_choices',
        name: '二择一牌阵',
        nameEn: 'Two Choices Spread',
        cardCount: 5,
        category: 'decision',
        difficulty: 'beginner',
        description: '专为A/B抉择设计的分叉路径牌阵。从现状出发，分别展示选项A和选项B的发展路径与可能结果，直观对比两条路的走向。',
        suitableQuestions: [
            '职业选择', '感情抉择', '城市/居住', '学业方向',
            '投资决策', '生活方式', '留在现公司还是跳槽？', '考研还是直接工作？'
        ],
        layoutType: 'fork',

        positions: [
            { index: 1, name: '现状',   nameEn: 'Situation', description: '当前处境与选择的背景', x: 50, y: 50, layer: 'core' },
            { index: 2, name: '路径A',  nameEn: 'Path A',   description: '选择A的发展路径与过程', x: 25, y: 22, layer: 'path_a' },
            { index: 3, name: '结果A',  nameEn: 'Outcome A',description: '选择A的可能结果', x: 75, y: 22, layer: 'path_a' },
            { index: 4, name: '路径B',  nameEn: 'Path B',   description: '选择B的发展路径与过程', x: 25, y: 78, layer: 'path_b' },
            { index: 5, name: '结果B',  nameEn: 'Outcome B',description: '选择B的可能结果', x: 75, y: 78, layer: 'path_b' }
        ],

        interpretationFlow: [
            '现状分析：揭示你真正的处境和需求',
            'A路径独立解读：路径+结果',
            'B路径独立解读：路径+结果',
            '对比分析：两条路的结果与过程对比',
            '综合建议：呈现两条路的图景，不替用户做决定'
        ],

        renderLayout: function (container, result) {
            var html = '<div class="spread-layout spread-two-choices">';
            result.cards.forEach(function (item, i) {
                var pos = result.spreadDef.positions[i];
                var card = item.card;
                var uri = '';
                try {
                    uri = (global.ImagePreloader && global.ImagePreloader.getUri)
                        ? global.ImagePreloader.getUri(card) : '';
                } catch (e) {
                    uri = '';
                }
                var revClass = item.orientation === '逆位' ? ' reversed' : '';

                html += '<div class="spread-card-slot" data-pos="' + (i + 1) + '" style="grid-area: p' + (i + 1) + '">' +
                    '<div class="spread-card' + revClass + '" onclick="TarotSpreads.showCardDetail(event, ' + i + ')">' +
                        '<div class="spread-card-img">' +
                            (uri ? '<img src="' + uri + '" alt="' + card.name + '" class="card-face-img" ' +
                             'onerror="this.style.display=\'none\';this.parentElement.innerHTML=\'<span class=card-placeholder>🔮</span>\'" />' :
                             '<span class="card-placeholder">🔮</span>') +
                        '</div>' +
                        '<div class="spread-card-label">' + card.name + '</div>' +
                    '</div>' +
                    '<div class="spread-position-tag">' + pos.name + '</div>' +
                '</div>';
            });
            html += '</div>';
            container.innerHTML = html;
        },

        getGridCSS: function () {
            return '.spread-two-choices { display: grid; ' +
                'grid-template-columns: 1fr 1fr 1fr 1fr 1fr; ' +
                'grid-template-rows: auto auto auto auto auto; ' +
                'grid-template-areas: ' +
                '".    .    .    .    .   " ' +
                '"p2   p2   .    p3   p3  " ' +
                '"p2   p2   p1   p3   p3  " ' +
                '"p4   p4   p1   p5   p5  " ' +
                '"p4   p4   .    p5   p5  "; ' +
                'gap: 12px; max-width: 650px; margin: 0 auto; padding: 20px; }';
        },

        interpret: function (result) {
            var cards = result.cards;
            var interp = { singleCards: [], combinations: [], overall: '', themedAdvice: '' };
            var TS = global.TarotSpreads;

            cards.forEach(function (item, i) {
                var pos = result.spreadDef.positions[i];
                var card = item.card;
                var meaning = item.orientation === '正位' ? card.meaning : card.reverse;
                interp.singleCards.push({
                    position: pos.name,
                    cardName: card.name,
                    orientation: item.orientation,
                    meaning: meaning,
                    contextNote: '「' + pos.name + '」位：' + card.name + ' ' + item.orientation + ' — ' + meaning
                });
            });

            var c1 = cards[0], c2 = cards[1], c3 = cards[2], c4 = cards[3], c5 = cards[4];

            var pathAInter = TS.getElementInteraction(c2.card.element, c3.card.element);
            interp.combinations.push({
                pair: '路径A → 结果A',
                cards: [c2.card.name, c3.card.name],
                type: pathAInter.type,
                analysis: '选项A分析：' + pathAInter.desc + ' ' +
                    (pathAInter.type === 'harmonious' ? '路径A的过程与结果能量顺畅，这是一条相对平稳的路。' :
                     pathAInter.type === 'conflicting' ? '路径A的过程与结果存在张力，这条路可能充满挑战但也会带来成长。' :
                     '路径A需要你保持耐心和灵活应对。')
            });

            var pathBInter = TS.getElementInteraction(c4.card.element, c5.card.element);
            interp.combinations.push({
                pair: '路径B → 结果B',
                cards: [c4.card.name, c5.card.name],
                type: pathBInter.type,
                analysis: '选项B分析：' + pathBInter.desc + ' ' +
                    (pathBInter.type === 'harmonious' ? '路径B的过程与结果能量顺畅，这是一条相对平稳的路。' :
                     pathBInter.type === 'conflicting' ? '路径B的过程与结果存在张力，这条路可能充满挑战但也会带来成长。' :
                     '路径B需要你保持耐心和灵活应对。')
            });

            var compareInter = TS.getElementInteraction(c3.card.element, c5.card.element);
            interp.combinations.push({
                pair: '结果A × 结果B',
                cards: [c3.card.name, c5.card.name],
                type: compareInter.type,
                analysis: '结果对比：' + compareInter.desc + ' ' +
                    (c3.orientation === '正位' && c5.orientation === '逆位' ? '结果A更为积极，选项A可能更符合你的长远利益。' :
                     c3.orientation === '逆位' && c5.orientation === '正位' ? '结果B更为积极，选项B可能更符合你的长远利益。' :
                     '两个选项各有优劣，最终选择取决于你最看重什么。')
            });

            interp.overall = '二择一牌阵为你展示了两条路径的图景。';
            if (c1.card.type === undefined) {
                interp.overall += ' 现状位出现了大阿卡纳「' + c1.card.name + '」，说明当前的选择对你的人生有重要意义，请慎重对待。';
            }
            interp.overall += ' 塔罗不会替你做出选择——它只是照亮两条路，让你看清每条路上的风景与挑战。最终的决定权在你手中。';

            interp.themedAdvice = '抉择指引：你当前处于' + c1.card.name + '所示的处境。' +
                '选择A将经历' + c2.card.name + '所示的路径，最终到达' + c3.card.name + '所示的结果。' +
                '选择B将经历' + c4.card.name + '所示的路径，最终到达' + c5.card.name + '所示的结果。' +
                '请结合自己的内心感受做出选择。' + c1.card.advice;

            return interp;
        }
    });

})(window);
