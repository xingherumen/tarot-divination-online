(function (global) {
    'use strict';

    var TS = global.TarotSpreads;

    TS.register({
        id: 'relationship',
        name: '关系牌阵',
        nameEn: 'Relationship Spread',
        cardCount: 5,
        category: 'relationship',
        difficulty: 'beginner',
        description: '专为双人关系设计的十字牌阵，分别揭示你、对方、关系现状、阻碍和结果。适用于恋爱、婚姻、友情、合作等各类人际关系。',
        suitableQuestions: [
            '恋爱发展', '婚姻状态', '暧昧困惑', '友情合作',
            '家庭关系', '复合可能', '和TA有没有未来？', 'TA对我到底是什么感觉？'
        ],
        layoutType: 'cross',

        positions: [
            { index: 1, name: '你',     nameEn: 'You',         description: '你在这段关系中的状态与心态', x: 18, y: 42, layer: 'self' },
            { index: 2, name: '对方',   nameEn: 'Partner',     description: '对方的状态、态度与感受', x: 82, y: 42, layer: 'other' },
            { index: 3, name: '关系',   nameEn: 'Relationship',description: '关系当前的本质与核心动力', x: 50, y: 42, layer: 'core' },
            { index: 4, name: '阻碍',   nameEn: 'Obstacle',    description: '关系中的障碍与挑战', x: 50, y: 78, layer: 'obstacle' },
            { index: 5, name: '结果',   nameEn: 'Outcome',     description: '关系的发展趋势与可能结果', x: 50, y: 12, layer: 'outcome' }
        ],

        interpretationFlow: [
            '双方独立解读：你的状态 + 对方的状态',
            '关系本质分析：揭示关系的核心动力',
            '双方匹配度对比：元素/牌面对比',
            '障碍分析：阻碍如何影响关系',
            '结果预测与建议'
        ],

        renderLayout: function (container, result) {
            var html = '<div class="spread-layout spread-relationship">';
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
            return '.spread-relationship { display: grid; ' +
                'grid-template-columns: 1fr 1fr 1fr 1fr 1fr; ' +
                'grid-template-rows: auto auto auto; ' +
                'grid-template-areas: ' +
                '".    .    p5   .    .   " ' +
                '"p1   p1   p3   p2   p2  " ' +
                '".    .    p4   .    .   "; ' +
                'gap: 16px; max-width: 650px; margin: 0 auto; padding: 20px; }';
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

            var matchInter = TS.getElementInteraction(c1.card.element, c2.card.element);
            interp.combinations.push({
                pair: '你 × 对方',
                cards: [c1.card.name, c2.card.name],
                type: matchInter.type,
                analysis: '双方匹配度：' + matchInter.desc + ' ' +
                    (matchInter.type === 'harmonious' ? '你们的能量本质契合，有良好的共鸣基础。' :
                     matchInter.type === 'conflicting' ? '你们的能量存在根本差异，需要更多的理解和包容。' :
                     '你们的关系需要双方共同努力来维持平衡。')
            });

            var coreInter = TS.getElementInteraction(c3.card.element, c4.card.element);
            interp.combinations.push({
                pair: '关系 × 阻碍',
                cards: [c3.card.name, c4.card.name],
                type: coreInter.type,
                analysis: '关系挑战：' + coreInter.desc + ' ' +
                    (coreInter.type === 'conflicting' ? '关系的核心本质与当前阻碍存在冲突，需要正视问题。' :
                     '阻碍虽然存在，但与关系的本质并不矛盾，可以通过沟通化解。')
            });

            var outcomeInter = TS.getElementInteraction(c3.card.element, c5.card.element);
            interp.combinations.push({
                pair: '关系 → 结果',
                cards: [c3.card.name, c5.card.name],
                type: outcomeInter.type,
                analysis: '发展趋势：' + outcomeInter.desc + ' ' +
                    (outcomeInter.type === 'harmonious' ? '关系的核心能量与未来走向一致，发展前景积极。' :
                     '关系的发展需要经历转变，结果取决于双方的选择。')
            });

            var majorCount = TS.countMajors(cards);
            var revCount = TS.countReversed(cards);

            interp.overall = '关系牌阵揭示了你与对方之间的核心动态。';
            if (c3.card.type === undefined) {
                interp.overall += ' 关系位出现了大阿卡纳「' + c3.card.name + '」，说明这段关系对你的人生有重要意义。';
            }
            if (c1.orientation === '正位' && c2.orientation === '逆位') {
                interp.overall += ' 你在这段关系中更为投入，对方可能存在保留或困惑。';
            } else if (c1.orientation === '逆位' && c2.orientation === '正位') {
                interp.overall += ' 对方似乎比你更投入这段关系，你需要审视自己的真实感受。';
            }
            if (revCount >= 3) {
                interp.overall += ' 牌阵中逆位较多，关系当前处于调整期，需要双方更多的耐心和沟通。';
            }

            interp.themedAdvice = '关系指引：你当前的状态是' + c1.card.name + '所示，对方呈现' +
                c2.card.name + '的特质。关系的核心是' + c3.card.name + '，需要克服' +
                c4.card.name + '所示的障碍，才能走向' + c5.card.name + '指引的结果。' +
                c3.card.advice;

            return interp;
        }
    });

})(window);
