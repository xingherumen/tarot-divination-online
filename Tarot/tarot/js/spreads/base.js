(function (global) {
    'use strict';

    global.TarotSpreads = global.TarotSpreads || {};

    var ELEMENT_INTERACTIONS = {
        '火火': { type: 'harmonious', label: '强化', desc: '火元素叠加，能量倍增，行动力与创造力达到高峰。' },
        '火水': { type: 'conflicting', label: '蒸发', desc: '火水相遇，热情与情感产生张力，需在行动与感受间找平衡。' },
        '火风': { type: 'harmonious', label: '助燃', desc: '风助火势，思维推动行动，想法能快速落地。' },
        '火土': { type: 'harmonious', label: '生土', desc: '火生土，行动力转化为实际成果，付出有回报。' },
        '水火': { type: 'conflicting', label: '蒸发', desc: '水火相激，情感与行动互相消耗，需冷静处理。' },
        '水水': { type: 'harmonious', label: '汇聚', desc: '水元素叠加，情感与直觉深度共鸣，内心世界丰富。' },
        '水风': { type: 'neutral', label: '波动', desc: '水风相遇，情感与思维交织，灵感涌现但需落地。' },
        '水土': { type: 'harmonious', label: '滋养', desc: '水润土，情感滋养现实，温柔的力量带来成长。' },
        '风火': { type: 'harmonious', label: '助燃', desc: '风助火势，思维点燃行动，创意转化为实践。' },
        '风水': { type: 'neutral', label: '波动', desc: '风水相遇，理性与感性交织，需在逻辑与直觉间平衡。' },
        '风风': { type: 'harmonious', label: '激化', desc: '风元素叠加，思维活跃，沟通与学习能力达到高峰。' },
        '风土': { type: 'conflicting', label: '吹散', desc: '风土相克，想法与现实的碰撞，需将计划落到实处。' },
        '土火': { type: 'harmonious', label: '生土', desc: '火生土，行动孕育成果，脚踏实地收获。' },
        '土水': { type: 'harmonious', label: '滋养', desc: '土纳水，现实承载情感，稳定中孕育成长。' },
        '土风': { type: 'conflicting', label: '吹散', desc: '土风相克，现实与理想的拉锯，需务实前行。' },
        '土土': { type: 'harmonious', label: '稳固', desc: '土元素叠加，根基扎实，物质与安全感稳固。' }
    };

    global.TarotSpreads.getElementInteraction = function (el1, el2) {
        var key = (el1 || '') + (el2 || '');
        return ELEMENT_INTERACTIONS[key] || { type: 'neutral', label: '共存', desc: '两种能量各自独立运作。' };
    };

    global.TarotSpreads.countMajors = function (cards) {
        return cards.filter(function (c) { return c.card && !c.card.type; }).length;
    };

    global.TarotSpreads.countReversed = function (cards) {
        return cards.filter(function (c) { return c.orientation === '逆位'; }).length;
    };

    global.TarotSpreads.countByElement = function (cards) {
        var counts = { '火': 0, '水': 0, '风': 0, '土': 0 };
        cards.forEach(function (c) {
            if (c.card && c.card.element && counts[c.card.element] !== undefined) {
                counts[c.card.element]++;
            }
        });
        return counts;
    };

    global.TarotSpreads.countBySuit = function (cards) {
        var counts = {};
        cards.forEach(function (c) {
            if (c.card && c.card.suit) {
                counts[c.card.suit] = (counts[c.card.suit] || 0) + 1;
            }
        });
        return counts;
    };

    global.TarotSpreads.dominantElement = function (cards) {
        var counts = global.TarotSpreads.countByElement(cards);
        var max = 0;
        var dominant = null;
        Object.keys(counts).forEach(function (el) {
            if (counts[el] > max) { max = counts[el]; dominant = el; }
        });
        return dominant;
    };

    global.TarotSpreads.dominantSuit = function (cards) {
        var counts = global.TarotSpreads.countBySuit(cards);
        var max = 0;
        var dominant = null;
        Object.keys(counts).forEach(function (s) {
            if (counts[s] > max) { max = counts[s]; dominant = s; }
        });
        return dominant;
    };

    global.TarotSpreads.registry = {};

    global.TarotSpreads.register = function (spreadDef) {
        if (!spreadDef || !spreadDef.id) {
            console.error('TarotSpreads: 牌阵注册失败，缺少 id');
            return;
        }
        global.TarotSpreads.registry[spreadDef.id] = spreadDef;
    };

    global.TarotSpreads.get = function (id) {
        return global.TarotSpreads.registry[id] || null;
    };

    global.TarotSpreads.getAll = function () {
        return Object.values(global.TarotSpreads.registry);
    };

    global.TarotSpreads.getByCategory = function (category) {
        return global.TarotSpreads.getAll().filter(function (s) {
            return s.category === category;
        });
    };

})(window);
