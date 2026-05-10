(function (global) {
    'use strict';

    var TS = global.TarotSpreads;

    TS.register({
        id: 'celtic_cross',
        name: '凯尔特十字牌阵',
        nameEn: 'Celtic Cross',
        cardCount: 10,
        category: 'comprehensive',
        difficulty: 'advanced',
        description: '塔罗界最经典、最全面的牌阵。以十字核心揭示问题本质，以右侧柱状展示外部影响，从十个维度深度剖析任何人生课题。',
        suitableQuestions: [
            '人生重大决策', '全面自我剖析', '复杂关系分析', '事业长期规划',
            '深层心理探索', '危机应对', '我该不该换城市发展？', '我目前的人生卡点在哪里？'
        ],
        layoutType: 'cross',

        positions: [
            { index: 1,  name: '现状',   nameEn: 'Present',     description: '当前核心问题与处境', x: 42, y: 42, layer: 'core' },
            { index: 2,  name: '阻碍',   nameEn: 'Challenge',   description: '横在面前的挑战与障碍', x: 58, y: 42, layer: 'core' },
            { index: 3,  name: '根源',   nameEn: 'Foundation',  description: '问题的深层基础与远因', x: 50, y: 65, layer: 'foundation' },
            { index: 4,  name: '过去',   nameEn: 'Past',        description: '刚过去的影响与经验', x: 25, y: 42, layer: 'timeline' },
            { index: 5,  name: '目标',   nameEn: 'Crown',       description: '可达到的最佳状态与潜力', x: 50, y: 18, layer: 'timeline' },
            { index: 6,  name: '未来',   nameEn: 'Future',      description: '近期发展趋势与方向', x: 75, y: 42, layer: 'timeline' },
            { index: 7,  name: '自我',   nameEn: 'Self',        description: '自我认知、态度与内在状态', x: 88, y: 72, layer: 'external' },
            { index: 8,  name: '环境',   nameEn: 'Environment', description: '外部环境、他人影响与氛围', x: 88, y: 55, layer: 'external' },
            { index: 9,  name: '希望',   nameEn: 'Hopes',       description: '内心的希望与恐惧', x: 88, y: 38, layer: 'external' },
            { index: 10, name: '结果',   nameEn: 'Outcome',     description: '综合结果与最终答案', x: 88, y: 21, layer: 'external' }
        ],

        interpretationFlow: [
            '十字核心解读：现状+阻碍 → 深层根源 → 过去→目标→未来时间线',
            '右侧柱状解读：自我认知 → 外部环境 → 希望恐惧 → 综合结果',
            '核心×外部交叉分析：现状↔自我、阻碍↔环境、目标↔希望、未来↔结果',
            '大阿卡纳占比与逆位比例统计',
            '综合叙事生成与行动建议'
        ],

        renderLayout: function (container, result) {
            var html = '<div class="spread-layout spread-celtic-cross">';
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

                html += '<div class="spread-card-slot celtic-slot" data-pos="' + (i + 1) + '" style="grid-area: p' + (i + 1) + '">' +
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
            return '.spread-celtic-cross { display: grid; ' +
                'grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr; ' +
                'grid-template-rows: auto auto auto auto auto auto; ' +
                'grid-template-areas: ' +
                '".    .    .    p5   p5   .    .    .   " ' +
                '".    p4   p4   p1   p2   p6   p6   p10 " ' +
                '".    p4   p4   p1   p2   p6   p6   p10 " ' +
                '".    .    .    p3   p3   .    .    p9  " ' +
                '".    .    .    p3   p3   .    .    p8  " ' +
                '".    .    .    .    .    .    .    p7  "; ' +
                'gap: 10px; max-width: 800px; margin: 0 auto; padding: 10px; }';
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

            var c1 = cards[0], c2 = cards[1], c3 = cards[2], c4 = cards[3];
            var c5 = cards[4], c6 = cards[5], c7 = cards[6], c8 = cards[7];
            var c9 = cards[8], c10 = cards[9];

            var coreInter = TS.getElementInteraction(c1.card.element, c2.card.element);
            interp.combinations.push({
                pair: '现状 × 阻碍',
                cards: [c1.card.name, c2.card.name],
                type: coreInter.type,
                analysis: '核心矛盾分析：' + coreInter.desc + ' ' +
                    (coreInter.type === 'conflicting' ? '现状与阻碍之间存在根本张力，这是你需要突破的关键点。' :
                     '现状与阻碍能量协调，挑战虽在但你有能力应对。')
            });

            var rootInter = TS.getElementInteraction(c1.card.element, c3.card.element);
            interp.combinations.push({
                pair: '现状 × 根源',
                cards: [c1.card.name, c3.card.name],
                type: rootInter.type,
                analysis: '根源追溯：' + rootInter.desc + ' ' +
                    (c3.card.type === undefined ? '根源是一张大阿卡纳，这个问题有着深远的人生意义。' :
                     '根源来自日常经验，是可以通过具体行动调整的。')
            });

            var selfEnvInter = TS.getElementInteraction(c7.card.element, c8.card.element);
            interp.combinations.push({
                pair: '自我 × 环境',
                cards: [c7.card.name, c8.card.name],
                type: selfEnvInter.type,
                analysis: '内外协调：' + selfEnvInter.desc + ' ' +
                    (selfEnvInter.type === 'conflicting' ? '你的内心状态与外部环境存在不协调，需要调整自我认知或改变环境。' :
                     '你的内在状态与外部环境和谐一致，这是顺势而为的好时机。')
            });

            var hopeOutInter = TS.getElementInteraction(c9.card.element, c10.card.element);
            interp.combinations.push({
                pair: '希望 × 结果',
                cards: [c9.card.name, c10.card.name],
                type: hopeOutInter.type,
                analysis: '期望与现实：' + hopeOutInter.desc + ' ' +
                    (hopeOutInter.type === 'conflicting' ? '你的期望与现实走向存在差距，需要调整心态或策略。' :
                     '你的希望与最终结果方向一致，保持信心。')
            });

            var majorCount = TS.countMajors(cards);
            var revCount = TS.countReversed(cards);
            var dominant = TS.dominantElement(cards);

            interp.overall = '凯尔特十字牌阵全面揭示了你当前的处境。';
            if (majorCount >= 5) {
                interp.overall += ' 牌阵中出现' + majorCount + '张大阿卡纳，这绝非偶然——命运正在通过这个牌阵向你传递重要信息。';
            } else if (majorCount >= 3) {
                interp.overall += ' ' + majorCount + '张大阿卡纳的出现表明当前问题具有相当的重要性。';
            } else {
                interp.overall += ' 大阿卡纳较少，当前问题更多聚焦于具体事务层面。';
            }

            if (dominant) {
                interp.overall += ' ' + dominant + '元素在牌阵中占主导，建议你更多关注' +
                    (dominant === '火' ? '行动力与激情' : dominant === '水' ? '情感与直觉' :
                     dominant === '风' ? '思维与沟通' : '物质与现实') + '层面。';
            }

            if (revCount >= 4) {
                interp.overall += ' 牌阵中逆位较多（' + revCount + '张），当前处于深度调整期，建议放慢节奏，内省优先于行动。';
            }

            interp.themedAdvice = '综合凯尔特十字的启示：面对' + c1.card.name + '所示的现状，正视' +
                c2.card.name + '带来的挑战，从' + c3.card.name + '揭示的根源中学习。' +
                '以' + c5.card.name + '为目标，参考' + c10.card.name + '的最终指引，' +
                '调整' + c7.card.name + '所示的自我认知，善用' + c8.card.name + '所示的环境资源。' +
                c1.card.advice;

            return interp;
        }
    });

})(window);
