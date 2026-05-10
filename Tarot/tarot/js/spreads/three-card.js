(function (global) {
    'use strict';

    var TS = global.TarotSpreads;

    TS.register({
        id: 'three_card',
        name: '三张牌阵',
        nameEn: 'Three Card Spread',
        cardCount: 3,
        category: 'quick',
        difficulty: 'beginner',
        description: '最经典的快速占卜牌阵，以过去、现在、未来三张牌揭示事件的时间线发展。简洁直观，适合日常运势和短期决策。',
        suitableQuestions: [
            '日常运势', '短期决策', '关系速览', '事件推演', '自我反思',
            '今天运势如何？', '这件事的发展趋势？', '我目前最需要关注什么？'
        ],
        layoutType: 'linear',

        positions: [
            { index: 1, name: '过去', nameEn: 'Past', description: '导致现状的过往因素与经验', x: 15, y: 50, layer: 'timeline' },
            { index: 2, name: '现在', nameEn: 'Present', description: '当前核心状态与面临的挑战', x: 50, y: 50, layer: 'timeline' },
            { index: 3, name: '未来', nameEn: 'Future', description: '发展趋势与可能的结果', x: 85, y: 50, layer: 'timeline' }
        ],

        interpretationFlow: [
            '逐张解读每张牌在时间线位置上的含义',
            '串联过去→现在→未来的因果叙事',
            '分析三张牌的元素流动是否顺畅',
            '结合正逆位比例给出综合建议'
        ],

        renderLayout: function (container, result) {
            var html = '<div class="spread-layout spread-three-card">';
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

                html += '<div class="spread-card-slot" data-pos="' + (i + 1) + '" style="grid-area: pos' + (i + 1) + '">' +
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
            return '.spread-three-card { display: grid; grid-template-columns: 1fr 1fr 1fr; ' +
                'grid-template-areas: "pos1 pos2 pos3"; gap: 24px; max-width: 700px; margin: 0 auto; padding: 20px; }';
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
                    contextNote: pos.name + '位出现「' + card.name + '」' + item.orientation + '，' + meaning
                });
            });

            var el1 = cards[0].card.element;
            var el2 = cards[1].card.element;
            var el3 = cards[2].card.element;

            var inter12 = TS.getElementInteraction(el1, el2);
            interp.combinations.push({
                pair: '过去 → 现在',
                cards: [cards[0].card.name, cards[1].card.name],
                type: inter12.type,
                analysis: inter12.desc + ' 过去的' + el1 + '能量' + inter12.label + '现在的' + el2 + '能量。'
            });

            var inter23 = TS.getElementInteraction(el2, el3);
            interp.combinations.push({
                pair: '现在 → 未来',
                cards: [cards[1].card.name, cards[2].card.name],
                type: inter23.type,
                analysis: inter23.desc + ' 当前的' + el2 + '能量' + inter23.label + '未来的' + el3 + '能量。'
            });

            var majorCount = TS.countMajors(cards);
            var revCount = TS.countReversed(cards);

            if (majorCount === 3) {
                interp.overall = '三张大阿卡纳齐聚——这不是普通的日常占卜，命运正在对你说话。每一张都承载着深刻的人生课题，请认真对待这次占卜的启示。';
            } else if (majorCount === 0) {
                interp.overall = '三张小牌聚焦日常事务，这是关于具体行动而非宏大命题的时刻。关注细节，脚踏实地，小改变也能带来大不同。';
            } else {
                interp.overall = '大牌与小牌交织，既有深层的人生课题，也有具体的行动指引。' +
                    (revCount >= 2 ? '逆位较多，当前处于调整期，向内看比向外求更重要。' : '能量整体通畅，顺势而为即可。');
            }

            if (revCount === 3) {
                interp.overall += ' 三张全逆——这是深度内省的召唤。不是坏消息，而是提醒你暂停、反思、调整方向。';
            }

            interp.themedAdvice = '基于三张牌的时间线，建议你：回顾' + cards[0].card.name + '带来的经验，正视' +
                cards[1].card.name + '揭示的现状，朝着' + cards[2].card.name + '指引的方向前行。' +
                cards[1].card.advice;

            return interp;
        }
    });

})(window);
