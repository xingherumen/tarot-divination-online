(function (global) {
    'use strict';

    var TS = global.TarotSpreads;

    TS.register({
        id: 'zodiac',
        name: '黄道十二宫牌阵',
        nameEn: 'Zodiac Spread',
        cardCount: 12,
        category: 'annual',
        difficulty: 'intermediate',
        description: '以12张牌对应12个星座宫位，覆盖自我、财富、沟通、家庭、创造、健康、合作、蜕变、探索、事业、社交、潜意识等人生全领域。适合年度运势和全方位检视。',
        suitableQuestions: [
            '年度运势', '生日占卜', '全面检视', '新年规划',
            '人生阶段总结', '全方位诊断', '今年整体运势如何？', '我的人生哪个领域最需要关注？'
        ],
        layoutType: 'circle',

        positions: [
            { index: 1,  name: '自我',   nameEn: 'Self',        description: '个性形象、外在表现与自我认同', pairedWith: 7 },
            { index: 2,  name: '财富',   nameEn: 'Wealth',      description: '财务状况、价值观与物质资源', pairedWith: 8 },
            { index: 3,  name: '沟通',   nameEn: 'Communication',description: '学习、交流、短途出行与思维', pairedWith: 9 },
            { index: 4,  name: '家庭',   nameEn: 'Home',        description: '家庭、根基、居住环境与内心安全感', pairedWith: 10 },
            { index: 5,  name: '创造',   nameEn: 'Creativity',  description: '恋爱、创意、自我表达与快乐', pairedWith: 11 },
            { index: 6,  name: '健康',   nameEn: 'Health',      description: '工作、健康、日常生活与习惯', pairedWith: 12 },
            { index: 7,  name: '合作',   nameEn: 'Partnership', description: '伴侣、合作、一对一关系', pairedWith: 1 },
            { index: 8,  name: '蜕变',   nameEn: 'Transformation',description: '深层转变、共享资源与心理', pairedWith: 2 },
            { index: 9,  name: '探索',   nameEn: 'Exploration', description: '信仰、长途旅行、高等教育与哲学', pairedWith: 3 },
            { index: 10, name: '事业',   nameEn: 'Career',      description: '事业、声望、人生方向与成就', pairedWith: 4 },
            { index: 11, name: '社交',   nameEn: 'Community',   description: '朋友、社群、理想与团体', pairedWith: 5 },
            { index: 12, name: '潜意识', nameEn: 'Subconscious',description: '潜意识、隐秘、灵性与内在世界', pairedWith: 6 }
        ],

        interpretationFlow: [
            '逐宫解读：12张牌各自在宫位中的含义',
            '对宫分析：6组对宫的能量对比',
            '领域聚类：个人域/家庭域/关系域/社会域',
            '大阿卡纳热点：哪些宫位出现大牌→年度重点领域',
            '年度综合叙事 + 分领域建议'
        ],

        renderLayout: function (container, result) {
            var html = '<div class="spread-layout spread-zodiac">';
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

                html += '<div class="spread-card-slot zodiac-slot" data-pos="' + (i + 1) + '" style="grid-area: h' + (i + 1) + '">' +
                    '<div class="spread-card spread-card-xs' + revClass + '" onclick="TarotSpreads.showCardDetail(event, ' + i + ')">' +
                        '<div class="spread-card-img">' +
                            (uri ? '<img src="' + uri + '" alt="' + card.name + '" class="card-face-img" ' +
                             'onerror="this.style.display=\'none\';this.parentElement.innerHTML=\'<span class=card-placeholder>🔮</span>\'" />' :
                             '<span class="card-placeholder">🔮</span>') +
                        '</div>' +
                        '<div class="spread-card-label-xs">' + card.name + '</div>' +
                    '</div>' +
                    '<div class="spread-position-tag zodiac-tag">' + pos.name + '</div>' +
                '</div>';
            });
            html += '</div>';
            container.innerHTML = html;
        },

        getGridCSS: function () {
            return '.spread-zodiac { display: grid; ' +
                'grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr; ' +
                'grid-template-rows: auto auto auto auto auto auto auto auto auto auto; ' +
                'grid-template-areas: ' +
                '".    .    .    .    .    .    .    .    .    .    .    .   " ' +
                '".    .    .    .    h11  h11  h12  h12  .    .    .    .   " ' +
                '".    .    h10  h10  .    .    .    .    h1   h1   .    .   " ' +
                '".    .    h10  h10  .    zodiac-center    .    h1   h1   .    .   " ' +
                '".    h9   h9   .    .    zodiac-center    .    .    h2   h2   .   " ' +
                '".    h9   h9   .    .    zodiac-center    .    .    h2   h2   .   " ' +
                '".    .    h8   h8   .    zodiac-center    .    h3   h3   .    .   " ' +
                '".    .    h8   h8   .    .    .    .    h3   h3   .    .   " ' +
                '".    .    .    .    h7   h7   h6   h6   .    .    .    .   " ' +
                '".    .    .    .    h7   h7   h5   h5   .    .    .    .   " ' +
                '".    .    .    .    .    h4   h4   .    .    .    .    .   "; ' +
                'gap: 4px; max-width: 900px; margin: 0 auto; padding: 5px; } ' +
                '.zodiac-center { grid-area: zodiac-center; display: flex; align-items: center; justify-content: center; } ' +
                '.zodiac-center-inner { text-align: center; color: rgba(236,72,153,0.6); font-size: 0.8rem; }';
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
                    contextNote: '「' + pos.name + '」宫：' + card.name + ' ' + item.orientation + ' — ' + meaning
                });
            });

            var pairs = [[0,6], [1,7], [2,8], [3,9], [4,10], [5,11]];
            var pairNames = [
                '自我 ↔ 合作', '财富 ↔ 蜕变', '沟通 ↔ 探索',
                '家庭 ↔ 事业', '创造 ↔ 社交', '健康 ↔ 潜意识'
            ];

            pairs.forEach(function (pair, pi) {
                var cA = cards[pair[0]];
                var cB = cards[pair[1]];
                var inter = TS.getElementInteraction(cA.card.element, cB.card.element);
                interp.combinations.push({
                    pair: pairNames[pi],
                    cards: [cA.card.name, cB.card.name],
                    type: inter.type,
                    analysis: '对宫分析（' + pairNames[pi] + '）：' + inter.desc + ' ' +
                        (inter.type === 'harmonious' ? '这两个领域能量协调，内外平衡。' :
                         inter.type === 'conflicting' ? '这两个领域存在张力，需要在两者之间找到平衡。' :
                         '这两个领域各自独立发展，互不影响。')
                });
            });

            var majorCount = TS.countMajors(cards);
            var revCount = TS.countReversed(cards);
            var dominant = TS.dominantElement(cards);

            var majorPositions = [];
            cards.forEach(function (item, i) {
                if (item.card.type === undefined) {
                    majorPositions.push(result.spreadDef.positions[i].name);
                }
            });

            interp.overall = '黄道十二宫牌阵全面扫描了你人生的12个领域。';
            if (majorPositions.length > 0) {
                interp.overall += ' 大阿卡纳出现在：' + majorPositions.join('、') + '——这些领域是你今年的核心课题。';
            }
            if (dominant) {
                interp.overall += ' ' + dominant + '元素能量主导全年，' +
                    (dominant === '火' ? '今年是行动之年，适合开拓新方向。' :
                     dominant === '水' ? '今年是情感之年，适合深化关系和内省。' :
                     dominant === '风' ? '今年是思维之年，适合学习和沟通。' :
                     '今年是务实之年，适合积累和建设。');
            }
            if (revCount >= 5) {
                interp.overall += ' 逆位较多（' + revCount + '张），今年整体是内省调整年，不宜激进。';
            }

            interp.themedAdvice = '年度指引：重点关注' + (majorPositions.length > 0 ? majorPositions.slice(0, 3).join('、') : '各领域平衡发展') +
                '。' + (dominant === '火' ? '勇敢行动，但避免冲动。' :
                dominant === '水' ? '信任直觉，但保持理性。' :
                dominant === '风' ? '多学多思，但记得落地。' :
                '稳扎稳打，但保持开放。') +
                (revCount >= 5 ? ' 今年适合向内探索，不必急于向外扩张。' : ' 今年能量整体积极，适合推进重要计划。');

            return interp;
        }
    });

})(window);
