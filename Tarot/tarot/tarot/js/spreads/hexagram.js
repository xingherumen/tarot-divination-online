(function (global) {
    'use strict';

    var TS = global.TarotSpreads;

    TS.register({
        id: 'hexagram',
        name: '六芒星牌阵',
        nameEn: 'Hexagram Spread',
        cardCount: 7,
        category: 'analysis',
        difficulty: 'intermediate',
        description: '以六角星结构从七个角度层层剖析问题：过去、现在、未来构成时间三角，原因、环境、对策构成影响三角，中心为综合结果。适合需要找到问题根源的场景。',
        suitableQuestions: [
            '困境突破', '因果分析', '策略规划', '人际关系矛盾',
            '项目复盘', '状态诊断', '为什么我总在同一个地方卡住？', '这件事为什么会发展成这样？'
        ],
        layoutType: 'star',

        positions: [
            { index: 1, name: '过去', nameEn: 'Past',        description: '问题根源的过去因素', x: 50, y: 12, layer: 'timeline' },
            { index: 2, name: '现在', nameEn: 'Present',     description: '当前核心状态', x: 50, y: 88, layer: 'timeline' },
            { index: 3, name: '未来', nameEn: 'Future',      description: '自然发展趋势', x: 82, y: 50, layer: 'timeline' },
            { index: 4, name: '原因', nameEn: 'Cause',       description: '问题的深层原因', x: 18, y: 50, layer: 'influence' },
            { index: 5, name: '环境', nameEn: 'Environment', description: '外部环境因素', x: 30, y: 22, layer: 'influence' },
            { index: 6, name: '对策', nameEn: 'Strategy',    description: '建议采取的行动', x: 70, y: 78, layer: 'influence' },
            { index: 7, name: '结果', nameEn: 'Outcome',     description: '综合结果与答案', x: 50, y: 50, layer: 'outcome' }
        ],

        interpretationFlow: [
            '时间三角解读：过去→现在→未来的问题演变轨迹',
            '影响三角解读：原因+环境→对策',
            '两三角交汇分析：时间×影响→中心结果',
            '对策可行性评估',
            '行动路径建议'
        ],

        renderLayout: function (container, result) {
            var html = '<div class="spread-layout spread-hexagram">';
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
                var isCenter = (i === 6);

                html += '<div class="spread-card-slot hex-slot' + (isCenter ? ' hex-center' : '') +
                    '" data-pos="' + (i + 1) + '" style="grid-area: p' + (i + 1) + '">' +
                    '<div class="spread-card spread-card-sm' + revClass + '" onclick="TarotSpreads.showCardDetail(event, ' + i + ')">' +
                        '<div class="spread-card-img">' +
                            (uri ? '<img src="' + uri + '" alt="' + card.name + '" class="card-face-img" ' +
                             'onerror="this.style.display=\'none\';this.parentElement.innerHTML=\'<span class=card-placeholder>🔮</span>\'" />' :
                             '<span class="card-placeholder">🔮</span>') +
                        '</div>' +
                        '<div class="spread-card-label-sm">' + card.name + '</div>' +
                    '</div>' +
                    '<div class="spread-position-tag">' + pos.name + '</div>' +
                '</div>';
            });
            html += '</div>';
            container.innerHTML = html;
        },

        getGridCSS: function () {
            return '.spread-hexagram { display: grid; ' +
                'grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr; ' +
                'grid-template-rows: auto auto auto auto auto auto; ' +
                'grid-template-areas: ' +
                '".    .    p1   p1   .    .   " ' +
                '".    p5   p5   .    p3   p3  " ' +
                '".    p5   p5   p7   p3   p3  " ' +
                'p4   p4   .    p7   .    .   " ' +
                'p4   p4   .    .    p6   p6  " ' +
                '".    .    p2   p2   p6   p6  "; ' +
                'gap: 8px; max-width: 650px; margin: 0 auto; padding: 10px; }';
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

            var c1 = cards[0], c2 = cards[1], c3 = cards[2];
            var c4 = cards[3], c5 = cards[4], c6 = cards[5], c7 = cards[6];

            var timeInter = TS.getElementInteraction(c1.card.element, c2.card.element);
            interp.combinations.push({
                pair: '过去 → 现在',
                cards: [c1.card.name, c2.card.name],
                type: timeInter.type,
                analysis: '时间演变：' + timeInter.desc + ' ' +
                    (timeInter.type === 'conflicting' ? '过去与现在之间存在转折，说明情况已经发生了变化。' :
                     '过去的影响正在延续到当下，模式在重复。')
            });

            var causeEnvInter = TS.getElementInteraction(c4.card.element, c5.card.element);
            interp.combinations.push({
                pair: '原因 × 环境',
                cards: [c4.card.name, c5.card.name],
                type: causeEnvInter.type,
                analysis: '内外因素：' + causeEnvInter.desc + ' ' +
                    (causeEnvInter.type === 'conflicting' ? '内在原因与外部环境存在冲突，问题可能源于内外不协调。' :
                     '内在原因与外部环境相互呼应，问题根源清晰。')
            });

            var strategyOutInter = TS.getElementInteraction(c6.card.element, c7.card.element);
            interp.combinations.push({
                pair: '对策 → 结果',
                cards: [c6.card.name, c7.card.name],
                type: strategyOutInter.type,
                analysis: '行动效果：' + strategyOutInter.desc + ' ' +
                    (strategyOutInter.type === 'harmonious' ? '采取建议的对策将有效改善结果。' :
                     strategyOutInter.type === 'conflicting' ? '建议的对策可能与最终结果存在偏差，需要灵活调整。' :
                     '对策与结果之间需要更多耐心和坚持。')
            });

            var majorCount = TS.countMajors(cards);
            var revCount = TS.countReversed(cards);

            interp.overall = '六芒星牌阵从七个维度剖析了你的问题。';
            if (c7.card.type === undefined) {
                interp.overall += ' 中心结果位出现了大阿卡纳「' + c7.card.name + '」，这是牌阵的核心启示，请特别关注。';
            }
            if (revCount >= 3) {
                interp.overall += ' 牌阵中有' + revCount + '张逆位牌，表明当前存在较多需要调整的方面。';
            }
            if (majorCount >= 3) {
                interp.overall += ' ' + majorCount + '张大阿卡纳的出现说明这个问题对你的人生有重要意义。';
            }

            interp.themedAdvice = '基于六芒星的分析：问题的根源在于' + c4.card.name + '所示的' +
                (c4.orientation === '逆位' ? '内在阻碍' : '深层原因') + '，在' + c5.card.name + '所示的环境下，' +
                '建议采取' + c6.card.name + '指引的对策。' + c6.card.advice;

            return interp;
        }
    });

})(window);
