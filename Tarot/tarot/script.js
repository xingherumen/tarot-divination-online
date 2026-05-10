(function () {
    'use strict';

    // ==================== 常量配置 ====================
    var CONFIG = {
        STORAGE_KEY: 'tarot_history',
        MAX_HISTORY: 50,
        REVERSE_PROBABILITY: 0.3,
        DEBOUNCE_DELAY: 300,
        CARD_ASPECT_RATIO: 2 / 3
    };

    // ==================== 花色定义 ====================
    var SUITS = {
        wands:    { name: '权杖', en: 'Wands',    element: '火', color: '#f59e0b', bg: '#451a03', symbol: '🔥', icon: 'wand' },
        cups:     { name: '圣杯', en: 'Cups',     element: '水', color: '#3b82f6', bg: '#0c1929', symbol: '🏆', icon: 'cup' },
        swords:   { name: '宝剑', en: 'Swords',   element: '风', color: '#a78bfa', bg: '#1a1030', symbol: '⚔️', icon: 'sword' },
        pentacles:{ name: '星币', en: 'Pentacles',element: '土', color: '#34d399', bg: '#052e16', symbol: '⭐', icon: 'pentacle' }
    };

    var COURT_RANKS = ['侍从', '骑士', '皇后', '国王'];

    // ==================== 22张大阿卡纳数据模型 ====================
    var majorArcana = [
        { id: 0,  roman: '0',   name: '愚者',     meaning: '新的开始，天真冒险。放下顾虑，勇敢踏出第一步。',       reverse: '鲁莽冲动，逃避责任。三思而后行。',               element: '风', planet: '天王星', advice: '今天做一件从未尝试过的小事。', symbol: '🌟' },
        { id: 1,  roman: 'I',   name: '魔术师',   meaning: '创造力爆发，资源齐聚。你拥有实现目标的所有条件。',     reverse: '欺骗操纵，才能被埋没。警惕花言巧语。',             element: '风', planet: '水星',   advice: '大胆说出你的想法。', symbol: '🪄' },
        { id: 2,  roman: 'II',  name: '女祭司',   meaning: '安静内省，直觉指引。答案不在外界，在你心中。',         reverse: '压抑直觉，信息不透明。再等一等。',                 element: '水', planet: '月亮',   advice: '独处片刻，聆听内心。', symbol: '🌙' },
        { id: 3,  roman: 'III', name: '皇后',     meaning: '丰盛孕育，温柔力量。爱与美围绕着你。',                 reverse: '过度依赖，缺乏自律。找回自己的重心。',             element: '土', planet: '金星',   advice: '照顾自己，享受生活的美好。', symbol: '👑' },
        { id: 4,  roman: 'IV',  name: '皇帝',     meaning: '秩序坚定，掌控局面。建立规则，脚踏实地。',             reverse: '专制固执，控制欲强。学会放手。',                   element: '火', planet: '火星',   advice: '做决定时依赖逻辑而非情绪。', symbol: '🏰' },
        { id: 5,  roman: 'V',   name: '教皇',     meaning: '传统指引，精神导师。寻求帮助或遵循规则。',             reverse: '挑战权威，找到自己的路。',                         element: '土', planet: '木星',   advice: '向有经验的人请教。', symbol: '📿' },
        { id: 6,  roman: 'VI',  name: '恋人',     meaning: '选择与吸引，关系升温。重要的抉择带来成长。',           reverse: '分离矛盾，价值观冲突。',                           element: '风', planet: '水星',   advice: '相信你的心，而不是外界的期待。', symbol: '💕' },
        { id: 7,  roman: 'VII', name: '战车',     meaning: '意志力胜利，冲突化解。保持方向，别被干扰。',           reverse: '失控横冲直撞，先停一下。',                         element: '水', planet: '月亮',   advice: '今天不要轻易妥协。', symbol: '⚔️' },
        { id: 8,  roman: 'VIII',name: '力量',     meaning: '以柔克刚，驯服内在野兽。耐心比蛮力更有效。',           reverse: '软弱不安，找回内在力量。',                         element: '火', planet: '太阳',   advice: '用温柔的方式解决问题。', symbol: '🦁' },
        { id: 9,  roman: 'IX',  name: '隐士',     meaning: '内省独处，寻找内在之光。暂时退隐思考。',               reverse: '孤独偏执，需要社交。',                             element: '土', planet: '天王星', advice: '给自己一段安静的时光。', symbol: '🏮' },
        { id: 10, roman: 'X',   name: '命运之轮', meaning: '转折变化，因果循环。顺势而为。',                       reverse: '厄运反复，不再抗拒。',                             element: '火', planet: '木星',   advice: '接受改变，它会带来惊喜。', symbol: '🎡' },
        { id: 11, roman: 'XI',  name: '正义',     meaning: '因果平衡，诚实公正。做出公平的决定。',                 reverse: '不公推卸责任，诚实面对。',                         element: '风', planet: '金星',   advice: '如实面对自己的内心。', symbol: '⚖️' },
        { id: 12, roman: 'XII', name: '倒吊人',   meaning: '牺牲视角，换位思考。暂时忍耐。',                       reverse: '挣扎无果，顺其自然。',                             element: '水', planet: '海王星', advice: '换个角度看问题。', symbol: '🙃' },
        { id: 13, roman: 'XIII',name: '死神',     meaning: '结束新生，放下旧模式。旧的不去新的不来。',             reverse: '抗拒改变，拖延痛苦。',                             element: '水', planet: '冥王星', advice: '勇敢告别不再适合的事物。', symbol: '💀' },
        { id: 14, roman: 'XIV', name: '节制',     meaning: '平衡调和，中庸之道。寻找中间点。',                     reverse: '失衡极端，回归平和。',                             element: '火', planet: '木星',   advice: '找到生活节奏的平衡点。', symbol: '🏺' },
        { id: 15, roman: 'XV',  name: '恶魔',     meaning: '束缚执念，物质沉迷。审视你的枷锁。',                   reverse: '挣脱解脱，自由将至。',                             element: '土', planet: '土星',   advice: '检查被什么困住了。', symbol: '😈' },
        { id: 16, roman: 'XVI', name: '高塔',     meaning: '突变冲击，旧有崩塌。重建的时刻。',                     reverse: '压制灾难，小心应对。',                             element: '火', planet: '火星',   advice: '接受变化，它带来新生。', symbol: '🗼' },
        { id: 17, roman: 'XVII',name: '星星',     meaning: '希望疗愈，重拾信心。相信美好。',                       reverse: '失望消极，希望犹在。',                             element: '风', planet: '天王星', advice: '保持乐观，好事将近。', symbol: '⭐' },
        { id: 18, roman: 'XVIII',name:'月亮',     meaning: '不安幻想，混乱迷惑。相信直觉。',                       reverse: '看清真相，不再恐惧。',                             element: '水', planet: '月亮',   advice: '你的直觉比你想的更准。', symbol: '🌕' },
        { id: 19, roman: 'XIX', name: '太阳',     meaning: '成功喜悦，光明活力。一切顺利。',                       reverse: '推迟成功，保持积极。',                             element: '火', planet: '太阳',   advice: '拥抱生活中的小快乐。', symbol: '☀️' },
        { id: 20, roman: 'XX',  name: '审判',     meaning: '重生觉醒，召唤回顾。做出重要决定。',                   reverse: '犹豫自责，原谅自己。',                             element: '水', planet: '冥王星', advice: '过去的选择成就了现在的你。', symbol: '📯' },
        { id: 21, roman: 'XXI', name: '世界',     meaning: '完成圆满，成就旅途。目标达成。',                       reverse: '功亏一篑，差最后一步。',                           element: '土', planet: '土星',   advice: '你已经准备好迎接新的开始。', symbol: '🌍' }
    ];

    // ==================== 构建56张小阿卡纳 ====================
    function buildMinorArcana() {
        var cards = [];
        var suitKeys = ['wands', 'cups', 'swords', 'pentacles'];
        var id = 22;

        suitKeys.forEach(function (key) {
            var suit = SUITS[key];

            for (var num = 1; num <= 10; num++) {
                var numLabel = num === 1 ? 'Ace' : String(num);
                var meaningKey = num === 1 ? 'ace' : 'pip';
                cards.push({
                    id: id++,
                    type: 'minor',
                    suit: key,
                    suitName: suit.name,
                    number: num,
                    label: numLabel,
                    name: suit.name + ' ' + numLabel,
                    element: suit.element,
                    color: suit.color,
                    bg: suit.bg,
                    symbol: suit.symbol,
                    icon: suit.icon,
                    meaning: getMinorMeaning(key, num, false),
                    reverse: getMinorMeaning(key, num, true),
                    advice: getMinorAdvice(key, num),
                    planet: '',
                    roman: ''
                });
            }

            COURT_RANKS.forEach(function (rank, ri) {
                cards.push({
                    id: id++,
                    type: 'minor',
                    suit: key,
                    suitName: suit.name,
                    number: 11 + ri,
                    label: rank,
                    name: suit.name + ' ' + rank,
                    element: suit.element,
                    color: suit.color,
                    bg: suit.bg,
                    symbol: suit.symbol,
                    icon: suit.icon,
                    meaning: getCourtMeaning(key, rank, false),
                    reverse: getCourtMeaning(key, rank, true),
                    advice: getCourtAdvice(key, rank),
                    planet: '',
                    roman: ''
                });
            });
        });

        return cards;
    }

    function getMinorMeaning(suit, num, reversed) {
        var meanings = {
            wands: [
                '新的灵感与创造力迸发，勇敢开启新计划。',
                '规划未来，确立方向，保持远见。',
                '事业拓展，合作顺利，放眼远方。',
                '庆祝成就，稳固基础，享受成果。',
                '竞争与挑战，激发斗志，突破自我。',
                '胜利在望，获得认可，自信前行。',
                '坚守立场，捍卫信念，不畏压力。',
                '快速行动，消息传来，把握时机。',
                '疲惫防御，坚持到底，即将突破。',
                '负担过重，学会放下，寻求支持。'
            ],
            cups: [
                '情感丰盈，新的恋情或友谊萌芽。',
                '深度连接，灵魂伴侣，相互理解。',
                '欢聚庆祝，分享喜悦，友情升华。',
                '沉思内省，重新评估，寻找意义。',
                '遗憾失落，放下过去，向前看。',
                '怀旧回忆，纯真时光，重拾初心。',
                '幻想选择，脚踏实地，明确目标。',
                '离开寻找，追寻更高理想。',
                '愿望成真，满足幸福，感恩当下。',
                '家庭和谐，情感圆满，内心平静。'
            ],
            swords: [
                '清晰思维，真理浮现，果断决策。',
                '僵局抉择，聆听直觉，打破平衡。',
                '心碎悲伤，接受痛苦，开始疗愈。',
                '休息恢复，静心冥想，积蓄力量。',
                '冲突失败，吸取教训，放下骄傲。',
                '过渡前行，放下包袱，迎接平静。',
                '策略计谋，灵活应变，暗中行动。',
                '束缚限制，改变视角，寻求自由。',
                '焦虑噩梦，面对恐惧，寻求光明。',
                '终结结束，彻底放下，重新开始。'
            ],
            pentacles: [
                '物质机遇，新的投资或事业开端。',
                '平衡兼顾，灵活适应，管理资源。',
                '技能精进，团队合作，品质至上。',
                '节俭守财，控制支出，稳固安全。',
                '困境求助，接受援助，共渡难关。',
                '慷慨分享，给予收获，善有善报。',
                '耐心等待，长期投入，静待花开。',
                '勤奋专注，精益求精，技艺提升。',
                '自给自足，独立成就，享受果实。',
                '财富传承，家族繁荣，长久基业。'
            ]
        };

        var reversedMeanings = {
            wands: [
                '创意受阻，拖延犹豫，错失良机。',
                '方向迷失，计划混乱，重新规划。',
                '合作受阻，视野狭窄，回归当下。',
                '根基不稳，过度庆祝，乐极生悲。',
                '恶性竞争，内耗冲突，寻求和解。',
                '虚荣自负，不被认可，谦逊自省。',
                '放弃立场，失去信心，重新振作。',
                '行动迟缓，消息延误，耐心等待。',
                '精疲力竭，放弃边缘，寻求帮助。',
                '过度承担，不懂拒绝，学会说不。'
            ],
            cups: [
                '情感封闭，压抑感受，敞开心扉。',
                '关系失衡，沟通不畅，坦诚表达。',
                '过度放纵，社交疲惫，适度收敛。',
                '冷漠退缩，错失机会，重新参与。',
                '沉溺过去，无法释怀，寻求帮助。',
                '逃避现实，沉溺幻想，活在当下。',
                '迷失幻想，不切实际，回归现实。',
                '逃避问题，不敢面对，勇敢留下。',
                '贪心不足，不知满足，珍惜已有。',
                '家庭不和，情感疏离，主动沟通。'
            ],
            swords: [
                '思维混乱，真相被掩，保持清醒。',
                '错误抉择，信息不足，多方求证。',
                '过度悲伤，无法释怀，寻求支持。',
                '焦躁不安，无法休息，强制暂停。',
                '屈辱失败，一蹶不振，重新站起。',
                '沉溺过去，拒绝前行，放下执念。',
                '诡计暴露，失信于人，诚实面对。',
                '自我设限，恐惧自由，突破心墙。',
                '恐惧消散，噩梦结束，迎来曙光。',
                '无法终结，反复纠缠，彻底了断。'
            ],
            pentacles: [
                '错失机会，投资失利，谨慎评估。',
                '失衡混乱，管理不善，重新整理。',
                '敷衍了事，质量下降，精益求精。',
                '过度吝啬，恐惧失去，适度消费。',
                '拒绝帮助，孤立无援，敞开心扉。',
                '自私吝啬，不愿分享，学会给予。',
                '急功近利，缺乏耐心，放慢脚步。',
                '粗心大意，技艺退步，专注提升。',
                '依赖他人，缺乏独立，自力更生。',
                '家族纷争，遗产问题，公平处理。'
            ]
        };

        var idx = num - 1;
        return reversed ? reversedMeanings[suit][idx] : meanings[suit][idx];
    }

    function getMinorAdvice(suit, num) {
        var advices = {
            wands:    ['大胆开始新项目。', '写下你的长远目标。', '拓展你的社交圈。', '与亲友分享你的成就。', '迎接挑战，不要退缩。', '相信自己的能力。', '坚持你的原则。', '快速响应变化。', '适当休息，恢复精力。', '学会委派任务。'],
            cups:     ['敞开心扉迎接爱。', '珍惜重要的人。', '与朋友共度时光。', '给自己思考的空间。', '放下过去的遗憾。', '回忆美好时光。', '做出实际的选择。', '追寻内心的召唤。', '感恩生活中的美好。', '与家人共度时光。'],
            swords:   ['理清你的思路。', '做出艰难的决定。', '允许自己悲伤。', '给自己放个假。', '从失败中学习。', '放下不必要的负担。', '保持灵活应变。', '换个角度看问题。', '面对你的恐惧。', '结束该结束的事。'],
            pentacles:['抓住眼前的机遇。', '平衡工作与生活。', '专注提升技能。', '审视你的开支。', '不要害怕求助。', '分享你的资源。', '保持耐心等待。', '专注于细节。', '享受劳动的果实。', '为未来做规划。']
        };
        return advices[suit][num - 1];
    }

    function getCourtMeaning(suit, rank, reversed) {
        var courtMeanings = {
            wands:    { '侍从': ['探索热情，发现新兴趣。', '缺乏方向，三分钟热度。'], '骑士': ['冒险进取，追逐梦想。', '鲁莽冲动，半途而废。'], '皇后': ['自信魅力，温暖领导。', '控制欲强，嫉妒心重。'], '国王': ['远见领袖，激励他人。', '独裁专横，好高骛远。'] },
            cups:     { '侍从': ['直觉敏锐，创意涌现。', '情感幼稚，逃避现实。'], '骑士': ['浪漫追求，理想主义。', '情绪化，不切实际。'], '皇后': ['同理关怀，心灵疗愈。', '过度依赖，情绪绑架。'], '国王': ['情感成熟，宽容智慧。', '情感压抑，冷漠疏离。'] },
            swords:   { '侍从': ['求知若渴，善于沟通。', '八卦多嘴，言多必失。'], '骑士': ['果断行动，追求真理。', '冲动好斗，不计后果。'], '皇后': ['独立睿智，清晰判断。', '苛刻冷漠，孤芳自赏。'], '国王': ['权威公正，理性决策。', '冷酷无情，滥用权力。'] },
            pentacles: { '侍从': ['踏实学习，务实进取。', '懒散拖延，缺乏动力。'], '骑士': ['勤奋可靠，稳步前行。', '固执保守，不思变通。'], '皇后': ['滋养培育，务实关怀。', '物质至上，缺乏灵性。'], '国王': ['财富管理，稳健成功。', '贪婪吝啬，唯利是图。'] }
        };
        return reversed ? courtMeanings[suit][rank][1] : courtMeanings[suit][rank][0];
    }

    function getCourtAdvice(suit, rank) {
        var advices = {
            wands:    { '侍从': '尝试一件新事物。', '骑士': '勇敢追逐你的目标。', '皇后': '用热情感染身边的人。', '国王': '为团队指明方向。' },
            cups:     { '侍从': '相信你的直觉。', '骑士': '追随你的心。', '皇后': '关心身边人的感受。', '国王': '用智慧化解情绪。' },
            swords:   { '侍从': '多学习多思考。', '骑士': '果断采取行动。', '皇后': '保持独立思考。', '国王': '做出公正的判断。' },
            pentacles: { '侍从': '脚踏实地学习。', '骑士': '坚持你的计划。', '皇后': '照顾好自己的身体。', '国王': '稳健管理你的资源。' }
        };
        return advices[suit][rank];
    }

    var minorArcana = buildMinorArcana();

    // ==================== 完整78张牌组 ====================
    function getFullDeck() {
        return majorArcana.concat(minorArcana);
    }

    window.getFullDeck = getFullDeck;
    window.majorArcana = majorArcana;
    window.minorArcana = minorArcana;

    // ==================== SVG 卡面渲染引擎 ====================
    var CardRenderer = {
        _cache: {},

        renderMajor: function (card) {
            var elColors = { '火': '#f59e0b', '水': '#3b82f6', '风': '#a78bfa', '土': '#34d399' };
            var elBgs = { '火': '#451a03', '水': '#0c1929', '风': '#1a1030', '土': '#052e16' };
            var color = elColors[card.element] || '#ec4899';
            var bg = elBgs[card.element] || '#1a0b2e';

            return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 300" width="100%" height="100%">' +
                '<defs><linearGradient id="bg' + card.id + '" x1="0%" y1="0%" x2="100%" y2="100%">' +
                '<stop offset="0%" stop-color="' + bg + '"/><stop offset="100%" stop-color="#0f0d2a"/>' +
                '</linearGradient></defs>' +
                '<rect width="200" height="300" rx="12" fill="url(#bg' + card.id + ')"/>' +
                '<rect x="8" y="8" width="184" height="284" rx="8" fill="none" stroke="' + color + '" stroke-width="1.5" opacity="0.6"/>' +
                '<rect x="14" y="14" width="172" height="272" rx="6" fill="none" stroke="' + color + '" stroke-width="0.5" opacity="0.3"/>' +
                '<text x="100" y="42" text-anchor="middle" fill="' + color + '" font-size="14" font-weight="bold" opacity="0.8">' + card.roman + '</text>' +
                '<text x="100" y="270" text-anchor="middle" fill="' + color + '" font-size="13" font-weight="bold">' + card.name + '</text>' +
                '<text x="100" y="160" text-anchor="middle" fill="' + color + '" font-size="52" opacity="0.9">' + card.symbol + '</text>' +
                '<circle cx="100" cy="155" r="48" fill="none" stroke="' + color + '" stroke-width="0.8" opacity="0.25"/>' +
                '<circle cx="100" cy="155" r="58" fill="none" stroke="' + color + '" stroke-width="0.5" opacity="0.15"/>' +
                '</svg>';
        },

        renderMinor: function (card) {
            var color = card.color;
            var bg = card.bg;
            var symbols = this._buildSuitSymbols(card.icon, card.number, color);

            return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 300" width="100%" height="100%">' +
                '<defs><linearGradient id="bg' + card.id + '" x1="0%" y1="0%" x2="100%" y2="100%">' +
                '<stop offset="0%" stop-color="' + bg + '"/><stop offset="100%" stop-color="#0f0d2a"/>' +
                '</linearGradient></defs>' +
                '<rect width="200" height="300" rx="12" fill="url(#bg' + card.id + ')"/>' +
                '<rect x="8" y="8" width="184" height="284" rx="8" fill="none" stroke="' + color + '" stroke-width="1.5" opacity="0.6"/>' +
                '<rect x="14" y="14" width="172" height="272" rx="6" fill="none" stroke="' + color + '" stroke-width="0.5" opacity="0.3"/>' +
                '<text x="100" y="40" text-anchor="middle" fill="' + color + '" font-size="13" font-weight="bold" opacity="0.8">' + card.label + '</text>' +
                symbols +
                '<text x="100" y="272" text-anchor="middle" fill="' + color + '" font-size="11" font-weight="bold">' + card.suitName + '</text>' +
                '</svg>';
        },

        _buildSuitSymbols: function (icon, number, color) {
            var paths = {
                wand:     '<rect x="-3" y="-20" width="6" height="40" rx="2" fill="' + color + '" opacity="0.9"/>' +
                          '<circle cx="0" cy="-20" r="5" fill="' + color + '" opacity="0.7"/>',
                cup:      '<path d="M-20 -14 L20 -14 L15 14 Q0 24 -15 14 Z" fill="none" stroke="' + color + '" stroke-width="2.5" opacity="0.9"/>' +
                          '<ellipse cx="0" cy="-14" rx="20" ry="5" fill="none" stroke="' + color + '" stroke-width="2" opacity="0.7"/>',
                sword:    '<line x1="0" y1="-16" x2="0" y2="16" stroke="' + color + '" stroke-width="2.5" opacity="0.9"/>' +
                          '<line x1="-14" y1="-4" x2="14" y2="-4" stroke="' + color + '" stroke-width="2" opacity="0.7"/>' +
                          '<line x1="0" y1="-16" x2="-14" y2="-4" stroke="' + color + '" stroke-width="1.5" opacity="0.6"/>' +
                          '<line x1="0" y1="-16" x2="14" y2="-4" stroke="' + color + '" stroke-width="1.5" opacity="0.6"/>',
                pentacle: '<circle cx="0" cy="0" r="16" fill="none" stroke="' + color + '" stroke-width="2.5" opacity="0.9"/>' +
                          '<circle cx="0" cy="0" r="4" fill="' + color + '" opacity="0.6"/>'
            };

            var symbolSvg = paths[icon] || paths.pentacle;
            var result = '';
            var positions;

            if (number <= 10) {
                positions = this._getPipPositions(number);
            } else {
                positions = this._getCourtPositions(number - 10);
            }

            positions.forEach(function (pos) {
                result += '<g transform="translate(' + pos.x + ', ' + pos.y + ') scale(0.9)">' + symbolSvg + '</g>';
            });

            return result;
        },

        _getPipPositions: function (num) {
            var cx = 100, cy = 155;
            var positions = {
                1:  [{ x: cx, y: cy }],
                2:  [{ x: cx, y: cy - 35 }, { x: cx, y: cy + 35 }],
                3:  [{ x: cx, y: cy - 40 }, { x: cx, y: cy }, { x: cx, y: cy + 40 }],
                4:  [{ x: cx - 25, y: cy - 35 }, { x: cx + 25, y: cy - 35 }, { x: cx - 25, y: cy + 35 }, { x: cx + 25, y: cy + 35 }],
                5:  [{ x: cx - 25, y: cy - 35 }, { x: cx + 25, y: cy - 35 }, { x: cx, y: cy }, { x: cx - 25, y: cy + 35 }, { x: cx + 25, y: cy + 35 }],
                6:  [{ x: cx - 25, y: cy - 40 }, { x: cx + 25, y: cy - 40 }, { x: cx - 25, y: cy }, { x: cx + 25, y: cy }, { x: cx - 25, y: cy + 40 }, { x: cx + 25, y: cy + 40 }],
                7:  [{ x: cx - 25, y: cy - 45 }, { x: cx + 25, y: cy - 45 }, { x: cx, y: cy - 15 }, { x: cx - 25, y: cy + 5 }, { x: cx + 25, y: cy + 5 }, { x: cx - 25, y: cy + 45 }, { x: cx + 25, y: cy + 45 }],
                8:  [{ x: cx - 25, y: cy - 45 }, { x: cx + 25, y: cy - 45 }, { x: cx - 25, y: cy - 15 }, { x: cx + 25, y: cy - 15 }, { x: cx - 25, y: cy + 15 }, { x: cx + 25, y: cy + 15 }, { x: cx - 25, y: cy + 45 }, { x: cx + 25, y: cy + 45 }],
                9:  [{ x: cx - 25, y: cy - 50 }, { x: cx + 25, y: cy - 50 }, { x: cx - 25, y: cy - 20 }, { x: cx + 25, y: cy - 20 }, { x: cx, y: cy }, { x: cx - 25, y: cy + 20 }, { x: cx + 25, y: cy + 20 }, { x: cx - 25, y: cy + 50 }, { x: cx + 25, y: cy + 50 }],
                10: [{ x: cx - 25, y: cy - 50 }, { x: cx + 25, y: cy - 50 }, { x: cx - 25, y: cy - 25 }, { x: cx + 25, y: cy - 25 }, { x: cx - 25, y: cy }, { x: cx + 25, y: cy }, { x: cx - 25, y: cy + 25 }, { x: cx + 25, y: cy + 25 }, { x: cx - 25, y: cy + 50 }, { x: cx + 25, y: cy + 50 }]
            };
            return positions[num] || positions[1];
        },

        _getCourtPositions: function (idx) {
            var cx = 100, cy = 155;
            return [{ x: cx, y: cy }];
        },

        render: function (card) {
            if (this._cache[card.id]) {
                return this._cache[card.id];
            }
            var svg = card.type === 'minor' ? this.renderMinor(card) : this.renderMajor(card);
            this._cache[card.id] = svg;
            return svg;
        },

        toDataUri: function (card) {
            var svg = this.render(card);
            var base64 = btoa(unescape(encodeURIComponent(svg)));
            return 'data:image/svg+xml;base64,' + base64;
        }
    };

    // ==================== 图案预加载器 ====================
    var ImagePreloader = {
        _loaded: {},
        _loading: false,
        _queue: [],
        _onComplete: null,

        preloadAll: function (onProgress) {
            var self = this;
            var deck = getFullDeck();
            var total = deck.length;
            var loaded = 0;

            deck.forEach(function (card) {
                var uri = CardRenderer.toDataUri(card);
                var img = new Image();
                img.onload = function () {
                    self._loaded[card.id] = uri;
                    loaded++;
                    if (onProgress) {
                        onProgress(loaded, total);
                    }
                };
                img.onerror = function () {
                    self._loaded[card.id] = uri;
                    loaded++;
                    if (onProgress) {
                        onProgress(loaded, total);
                    }
                };
                img.src = uri;
            });
        },

        getUri: function (card) {
            if (this._loaded[card.id]) {
                return this._loaded[card.id];
            }
            return CardRenderer.toDataUri(card);
        }
    };

    window.ImagePreloader = ImagePreloader;
    window.CardRenderer = CardRenderer;

    // ==================== 随机抽取引擎 ====================
    // ==================== 历史记录持久化层 ====================
    var HistoryStore = {
        getAll: function () {
            try {
                var raw = localStorage.getItem(CONFIG.STORAGE_KEY);
                return raw ? JSON.parse(raw) : [];
            } catch (e) {
                return [];
            }
        },

        add: function (record) {
            var history = this.getAll();
            history.unshift(record);
            if (history.length > CONFIG.MAX_HISTORY) {
                history.length = CONFIG.MAX_HISTORY;
            }
            try {
                localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(history));
            } catch (e) {}
        },

        clear: function () {
            try {
                localStorage.removeItem(CONFIG.STORAGE_KEY);
            } catch (e) {}
        }
    };

    function buildHistoryRecord(card, orientation) {
        return {
            id: Date.now(),
            date: new Date().toLocaleString(),
            cardName: card.name,
            orientation: orientation,
            meaning: orientation === '正位' ? card.meaning : card.reverse,
            advice: card.advice
        };
    }

    // ==================== 工具函数 ====================
    function debounce(fn, delay) {
        var timer = null;
        return function () {
            var context = this;
            var args = arguments;
            clearTimeout(timer);
            timer = setTimeout(function () {
                fn.apply(context, args);
            }, delay);
        };
    }

    function determineOrientation() {
        return Math.random() < CONFIG.REVERSE_PROBABILITY ? '逆位' : '正位';
    }

    // ==================== 自主抽牌引擎 (DrawDeckEngine) ====================
    var DrawDeckEngine = {
        isAnimating: false,
        selectedCard: null,
        currentCards: [],
        drawnCards: [],
        domCache: {},
        mode: 'single',
        multiCount: 5,
        multiDrawn: [],

        initDomCache: function () {
            this.domCache.deck = document.getElementById('deck');
            this.domCache.drawHint = document.getElementById('drawHint');
            this.domCache.resultArea = document.getElementById('resultArea');
            this.domCache.drawnCardDisplay = document.getElementById('drawnCardDisplay');
            this.domCache.reshuffleBtn = document.getElementById('reshuffleBtn');
            this.domCache.deckModeSelect = document.getElementById('deckModeSelect');
            this.domCache.modeSingle = document.getElementById('modeSingle');
            this.domCache.modeMulti = document.getElementById('modeMulti');
            this.domCache.multiDrawConfig = document.getElementById('multiDrawConfig');
            this.domCache.multiDrawOptions = document.getElementById('multiDrawOptions');
            this.domCache.progressContainer = document.getElementById('progressContainer');
            this.domCache.progressCount = document.getElementById('progressCount');
            this.domCache.progressFill = document.getElementById('progressFill');
            this.domCache.progressCards = document.getElementById('progressCards');
            this.domCache.multiRevealArea = document.getElementById('multiRevealArea');
            this.domCache.revealAllBtn = document.getElementById('revealAllBtn');
            this.domCache.multiResultGrid = document.getElementById('multiResultGrid');
        },

        getDeck: function () {
            var mode = this.domCache.deckModeSelect ? this.domCache.deckModeSelect.value : 'major';
            return mode === 'full' ? getFullDeck() : majorArcana;
        },

        createDeck: function () {
            var deck = this.domCache.deck;
            if (!deck) return;

            deck.innerHTML = '';
            this.currentCards = [];
            this.selectedCard = null;
            this.isAnimating = false;
            this.drawnCards = [];
            this.multiDrawn = [];

            var cards = this.getDeck();
            var count = cards.length;
            var container = deck.parentElement;
            var containerWidth = container.clientWidth || 520;
            var maxSpread = Math.min(count, 22);

            var angleRange = Math.min(70, maxSpread * 3);
            var startAngle = -angleRange / 2;
            var angleStep = maxSpread > 1 ? angleRange / (maxSpread - 1) : 0;
            var radius = Math.min(containerWidth * 0.38, 180);

            var displayCards = cards.slice(0, maxSpread);

            var self = this;

            displayCards.forEach(function (cardData, idx) {
                var angle = startAngle + idx * angleStep;
                var angleRad = angle * Math.PI / 180;
                var x = Math.sin(angleRad) * radius;
                var y = Math.abs(Math.cos(angleRad) * radius * 0.15) + 10;

                var cardDiv = document.createElement('div');
                cardDiv.className = 'deck-card';
                cardDiv.setAttribute('data-idx', idx);
                cardDiv.setAttribute('data-card-id', cardData.id);
                cardDiv.style.transform = 'translate(' + x + 'px, ' + y + 'px) rotate(' + angle + 'deg)';
                cardDiv.style.zIndex = idx + 1;
                cardDiv.style.transitionDelay = (idx * 20) + 'ms';

                cardDiv.innerHTML =
                    '<div class="card-inner">' +
                        '<div class="card-back-face">' +
                            '<span class="back-icon">🔮</span>' +
                            '<span class="back-label">TAROT</span>' +
                        '</div>' +
                        '<div class="card-front-face">' +
                            '<span class="front-placeholder">🔮</span>' +
                        '</div>' +
                    '</div>';

                cardDiv.addEventListener('click', (function (cData, cEl) {
                    return function (e) {
                        e.stopPropagation();
                        self.handleCardClick(cData, cEl);
                    };
                })(cardData, cardDiv));

                cardDiv.addEventListener('mouseenter', function () {
                    if (!self.selectedCard && !self.isAnimating) {
                        cardDiv.style.transform = 'translate(' + x + 'px, ' + y + 'px) rotate(' + angle + 'deg) translateY(-18px) scale(1.08)';
                        cardDiv.style.zIndex = 100;
                    }
                });

                cardDiv.addEventListener('mouseleave', function () {
                    if (!self.selectedCard && !self.isAnimating) {
                        cardDiv.style.transform = 'translate(' + x + 'px, ' + y + 'px) rotate(' + angle + 'deg)';
                        cardDiv.style.zIndex = idx + 1;
                    }
                });

                deck.appendChild(cardDiv);
                self.currentCards.push({ element: cardDiv, cardData: cardData, index: idx, origX: x, origY: y, origAngle: angle });

                requestAnimationFrame(function () {
                    cardDiv.classList.add('dealing');
                    setTimeout(function () {
                        cardDiv.classList.remove('dealing');
                    }, 500);
                });
            });

            if (this.domCache.drawHint) {
                this.domCache.drawHint.innerText = '✨ 从牌堆中选出你最有感应的那张牌 ✨';
            }
        },

        handleCardClick: function (cardData, cardElement) {
            var self = this;
            if (self.isAnimating || self.selectedCard) return;

            if (self.mode === 'multi') {
                self.handleMultiDraw(cardData, cardElement);
                return;
            }

            self.isAnimating = true;
            self.selectedCard = cardData;

            if (self.domCache.drawHint) {
                self.domCache.drawHint.innerText = '🔮 正在揭示你的命运之牌... 🔮';
            }

            cardElement.classList.add('selected');

            var otherCards = self.currentCards.filter(function (c) {
                return c.element !== cardElement;
            });

            otherCards.forEach(function (c, i) {
                setTimeout(function () {
                    c.element.classList.add('fade-out');
                }, i * 30);
            });

            setTimeout(function () {
                cardElement.classList.add('flipped');

                var uri = ImagePreloader.getUri(cardData);
                var frontFace = cardElement.querySelector('.card-front-face');
                if (frontFace) {
                    frontFace.innerHTML = '<img src="' + uri + '" alt="' + cardData.name + '" class="card-face-img" ' +
                        'onerror="this.style.display=\'none\';this.parentElement.innerHTML=\'<span class=front-placeholder>🔮</span>\'" />';
                }

                setTimeout(function () {
                    var orientation = determineOrientation();
                    var meaning = orientation === '正位' ? cardData.meaning : cardData.reverse;

                    HistoryStore.add(buildHistoryRecord(cardData, orientation));
                    self.showDrawnCard(cardData, orientation);
                    self.showResult(cardData, orientation, meaning);

                    if (self.domCache.drawHint) {
                        self.domCache.drawHint.innerText =
                            '✨ 你抽中了「' + cardData.name + '」' + orientation + ' ✨ 点击「重新洗牌」可以重新占卜 ✨';
                    }
                    self.isAnimating = false;
                }, 900);
            }, 500);
        },

        handleMultiDraw: function (cardData, cardElement) {
            var self = this;
            if (self.isAnimating) return;

            self.isAnimating = true;
            cardElement.classList.add('selected');

            if (self.multiDrawn.length === 0 && self.domCache.progressContainer) {
                self.domCache.progressContainer.classList.remove('hidden');
            }

            var orientation = determineOrientation();
            var drawnEntry = {
                card: cardData,
                orientation: orientation,
                element: cardElement
            };
            self.multiDrawn.push(drawnEntry);

            var otherCards = self.currentCards.filter(function (c) {
                return c.element !== cardElement;
            });

            otherCards.forEach(function (c, i) {
                setTimeout(function () {
                    c.element.classList.add('fade-out');
                }, i * 30);
            });

            setTimeout(function () {
                cardElement.classList.add('flipped');

                var uri = ImagePreloader.getUri(cardData);
                var frontFace = cardElement.querySelector('.card-front-face');
                if (frontFace) {
                    frontFace.innerHTML = '<img src="' + uri + '" alt="' + cardData.name + '" class="card-face-img" ' +
                        'onerror="this.style.display=\'none\';this.parentElement.innerHTML=\'<span class=front-placeholder>🔮</span>\'" />';
                }

                setTimeout(function () {
                    self.updateProgress();
                    self.isAnimating = false;

                    if (self.multiDrawn.length >= self.multiCount) {
                        self.onMultiDrawComplete();
                    } else {
                        self.prepareNextDraw();
                    }
                }, 600);
            }, 400);
        },

        prepareNextDraw: function () {
            var self = this;
            if (self.domCache.drawHint) {
                var remaining = self.multiCount - self.multiDrawn.length;
                self.domCache.drawHint.innerText = '🎴 已抽取 ' + self.multiDrawn.length + ' 张，还需抽取 ' + remaining + ' 张。请继续选牌...';
            }

            self.selectedCard = null;
            self.currentCards = [];

            var deck = self.domCache.deck;
            if (deck) deck.innerHTML = '';

            var drawnIds = {};
            self.multiDrawn.forEach(function (entry) {
                if (entry.card && entry.card.id) {
                    drawnIds[entry.card.id] = true;
                }
            });

            var allCards = self.getDeck();
            var availableCards = allCards.filter(function (card) {
                return !drawnIds[card.id];
            });

            if (availableCards.length === 0) {
                if (self.domCache.drawHint) {
                    self.domCache.drawHint.innerText = '⚠️ 牌组已空，请重新洗牌';
                }
                return;
            }

            var container = deck.parentElement;
            var containerWidth = container.clientWidth || 520;
            var maxSpread = Math.min(availableCards.length, 22);

            var angleRange = Math.min(70, maxSpread * 3);
            var startAngle = -angleRange / 2;
            var angleStep = maxSpread > 1 ? angleRange / (maxSpread - 1) : 0;
            var radius = Math.min(containerWidth * 0.38, 180);

            var displayCards = availableCards.slice(0, maxSpread);

            displayCards.forEach(function (cardData, idx) {
                var angle = startAngle + idx * angleStep;
                var angleRad = angle * Math.PI / 180;
                var x = Math.sin(angleRad) * radius;
                var y = Math.abs(Math.cos(angleRad) * radius * 0.15) + 10;

                var cardDiv = document.createElement('div');
                cardDiv.className = 'deck-card';
                cardDiv.setAttribute('data-idx', idx);
                cardDiv.setAttribute('data-card-id', cardData.id);
                cardDiv.style.transform = 'translate(' + x + 'px, ' + y + 'px) rotate(' + angle + 'deg)';
                cardDiv.style.zIndex = idx + 1;
                cardDiv.style.transitionDelay = (idx * 20) + 'ms';

                cardDiv.innerHTML =
                    '<div class="card-inner">' +
                        '<div class="card-back-face">' +
                            '<span class="back-icon">🔮</span>' +
                            '<span class="back-label">TAROT</span>' +
                        '</div>' +
                        '<div class="card-front-face">' +
                            '<span class="front-placeholder">🔮</span>' +
                        '</div>' +
                    '</div>';

                cardDiv.addEventListener('click', (function (cData, cEl) {
                    return function (e) {
                        e.stopPropagation();
                        self.handleCardClick(cData, cEl);
                    };
                })(cardData, cardDiv));

                cardDiv.addEventListener('mouseenter', function () {
                    if (!self.selectedCard && !self.isAnimating) {
                        cardDiv.style.transform = 'translate(' + x + 'px, ' + y + 'px) rotate(' + angle + 'deg) translateY(-18px) scale(1.08)';
                        cardDiv.style.zIndex = 100;
                    }
                });

                cardDiv.addEventListener('mouseleave', function () {
                    if (!self.selectedCard && !self.isAnimating) {
                        cardDiv.style.transform = 'translate(' + x + 'px, ' + y + 'px) rotate(' + angle + 'deg)';
                        cardDiv.style.zIndex = idx + 1;
                    }
                });

                deck.appendChild(cardDiv);
                self.currentCards.push({ element: cardDiv, cardData: cardData, index: idx, origX: x, origY: y, origAngle: angle });

                requestAnimationFrame(function () {
                    cardDiv.classList.add('dealing');
                    setTimeout(function () {
                        cardDiv.classList.remove('dealing');
                    }, 500);
                });
            });
        },

        updateProgress: function () {
            var drawn = this.multiDrawn.length;
            var total = this.multiCount;
            var pct = Math.round((drawn / total) * 100);

            if (this.domCache.progressCount) {
                this.domCache.progressCount.textContent = drawn + ' / ' + total;
            }
            if (this.domCache.progressFill) {
                this.domCache.progressFill.style.width = pct + '%';
            }

            var dotsContainer = this.domCache.progressCards;
            if (dotsContainer) {
                dotsContainer.innerHTML = '';
                for (var i = 0; i < total; i++) {
                    var dot = document.createElement('div');
                    dot.className = 'progress-card-dot';
                    if (i < drawn) {
                        dot.classList.add('filled');
                    } else if (i === drawn) {
                        dot.classList.add('current');
                    }
                    dot.textContent = '🃏';
                    dotsContainer.appendChild(dot);
                }
            }
        },

        onMultiDrawComplete: function () {
            var self = this;

            if (self.domCache.drawHint) {
                self.domCache.drawHint.innerText = '✨ 所有卡牌已抽取完毕！点击「统一揭开」同步揭示结果 ✨';
            }

            if (self.domCache.multiRevealArea) {
                self.domCache.multiRevealArea.classList.remove('hidden');
                self.domCache.multiRevealArea.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }

            if (self.domCache.progressContainer) {
                var allDots = self.domCache.progressCards.querySelectorAll('.progress-card-dot');
                allDots.forEach(function (d) {
                    d.classList.remove('current');
                    d.classList.add('filled');
                });
            }
        },

        revealAllCards: function () {
            var self = this;
            if (self.isAnimating) return;
            self.isAnimating = true;

            if (self.domCache.multiRevealArea) {
                self.domCache.multiRevealArea.classList.add('hidden');
            }

            if (self.domCache.drawHint) {
                self.domCache.drawHint.innerText = '✨ 命运之牌正在揭开... ✨';
            }

            var grid = self.domCache.multiResultGrid;
            if (!grid) return;

            grid.classList.remove('hidden');
            grid.innerHTML = '';

            var html = '';
            self.multiDrawn.forEach(function (entry, idx) {
                var card = entry.card;
                var orientation = entry.orientation;
                var uri = ImagePreloader.getUri(card);
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

            var totalDelay = self.multiDrawn.length * 150 + 800;

            setTimeout(function () {
                self.showMultiResult();
                self.isAnimating = false;

                if (self.domCache.drawHint) {
                    self.domCache.drawHint.innerText = '✨ 占卜完成！共揭示 ' + self.multiDrawn.length + ' 张牌 ✨';
                }
            }, totalDelay);
        },

        showMultiResult: function () {
            var self = this;
            var ra = self.domCache.resultArea;
            if (!ra) return;

            var majorCount = 0;
            var revCount = 0;
            var elementCounts = { '火': 0, '水': 0, '风': 0, '土': 0 };

            self.multiDrawn.forEach(function (entry) {
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

            var overallAdvice = self.multiDrawn[0] ? self.multiDrawn[0].card.advice : '保持开放的心态，相信自己的直觉。';

            ra.classList.remove('hidden');
            ra.innerHTML =
                '<div class="multi-result-interp">' +
                    '<h3>📊 牌阵综合分析</h3>' +
                    '<div class="interp-stats">' +
                        '<div class="interp-stat">' +
                            '<span class="stat-value">' + self.multiDrawn.length + '</span>' +
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
                        '</div>' +
                    '</div>' +
                    '<div class="interp-overall">' +
                        '<p>本次共抽取 <strong>' + self.multiDrawn.length + '</strong> 张牌，其中大阿卡纳 <strong>' + majorCount + '</strong> 张，逆位 <strong>' + revCount + '</strong> 张。' +
                        (dominantEl !== '无' ? ' <strong>' + dominantEl + '</strong> 元素能量最为突出。' : '') +
                        '</p>' +
                        '<p>牌面显示：' + overallAdvice + '</p>' +
                    '</div>' +
                    '<div class="interp-advice">' +
                        '💫 点击任意卡牌可查看详细解读。点击「重新洗牌」可重新占卜。' +
                    '</div>' +
                    '<button class="btn btn-draw-again" id="drawAgainFromDeck" style="margin-top:16px;">🔄 重新占卜</button>' +
                '</div>';

            var againBtn = document.getElementById('drawAgainFromDeck');
            if (againBtn) {
                againBtn.onclick = function () { DrawDeckEngine.reset(); };
            }

            ra.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

            var resultCards = document.querySelectorAll('.multi-result-card');
            resultCards.forEach(function (el) {
                el.addEventListener('click', function () {
                    var idx = parseInt(this.getAttribute('data-index'));
                    self.openCardDetail(idx);
                });
            });
        },

        openCardDetail: function (index) {
            var entry = this.multiDrawn[index];
            if (!entry) return;

            var card = entry.card;
            var orientation = entry.orientation;
            var meaning = orientation === '正位' ? card.meaning : card.reverse;
            var uri = ImagePreloader.getUri(card);

            var overlay = document.createElement('div');
            overlay.className = 'card-detail-overlay active';
            overlay.id = 'tempCardDetail';
            overlay.innerHTML =
                '<div class="card-detail-modal">' +
                    '<button class="card-detail-close" onclick="document.getElementById(\'tempCardDetail\').remove()">✕</button>' +
                    '<div class="card-detail-img">' +
                        '<img src="' + uri + '" alt="' + card.name + '" class="card-face-img" ' +
                        'onerror="this.style.display=\'none\';this.parentElement.innerHTML=\'<span class=card-placeholder-lg>🔮</span>\'" />' +
                    '</div>' +
                    '<div class="card-detail-info">' +
                        '<h3>' + card.name + ' <span class="' + (orientation === '逆位' ? 'reversed' : 'upright') + '">' +
                            orientation + '</span></h3>' +
                        '<p class="card-detail-meaning">「' + meaning + '」</p>' +
                        (card.element ? '<p>🔮 元素：' + card.element + '</p>' : '') +
                        (card.planet ? '<p>🌟 守护星：' + card.planet + '</p>' : '') +
                        '<p class="card-detail-advice">📜 指引：' + card.advice + '</p>' +
                    '</div>' +
                '</div>';

            document.body.appendChild(overlay);
        },

        showDrawnCard: function (cardData, orientation) {
            var dd = this.domCache.drawnCardDisplay;
            if (!dd) return;

            var uri = ImagePreloader.getUri(cardData);
            var reversedClass = orientation === '逆位' ? ' reversed' : '';

            dd.innerHTML =
                '<div class="drawn-card' + reversedClass + '">' +
                    '<div class="card-img">' +
                        '<img src="' + uri + '" alt="' + cardData.name + '" class="card-face-img" ' +
                        'onerror="this.style.display=\'none\';this.parentElement.innerHTML=\'<span class=card-placeholder>🔮</span>\'" />' +
                    '</div>' +
                    '<div class="card-name">' + cardData.name + '</div>' +
                '</div>';
        },

        showResult: function (cardData, orientation, meaning) {
            var ra = this.domCache.resultArea;
            if (!ra) return;

            ra.classList.remove('hidden');
            ra.innerHTML =
                '<div class="result-content">' +
                    '<h3>✨ ' + cardData.name + ' · ' + orientation + ' ✨</h3>' +
                    '<p class="meaning">「' + meaning + '」</p>' +
                    (cardData.element ? '<p>🔮 元素：' + cardData.element + '</p>' : '') +
                    (cardData.planet ? '<p>🌟 守护星：' + cardData.planet + '</p>' : '') +
                    '<p class="advice">📜 今日指引：' + cardData.advice + '</p>' +
                    '<button class="btn btn-draw-again" id="drawAgainFromDeck">🔄 再抽一次</button>' +
                '</div>';

            var againBtn = document.getElementById('drawAgainFromDeck');
            if (againBtn) {
                againBtn.onclick = function () { DrawDeckEngine.reset(); };
            }

            ra.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        },

        reshuffle: function () {
            var self = this;
            if (self.isAnimating) return;

            if (self.domCache.drawHint) {
                self.domCache.drawHint.innerText = '🔄 重新洗牌中... 🔄';
            }

            if (self.domCache.resultArea) self.domCache.resultArea.classList.add('hidden');
            if (self.domCache.drawnCardDisplay) self.domCache.drawnCardDisplay.innerHTML = '';
            if (self.domCache.multiResultGrid) {
                self.domCache.multiResultGrid.classList.add('hidden');
                self.domCache.multiResultGrid.innerHTML = '';
            }
            if (self.domCache.multiRevealArea) self.domCache.multiRevealArea.classList.add('hidden');
            if (self.domCache.progressContainer) self.domCache.progressContainer.classList.add('hidden');

            self.multiDrawn = [];
            self.createDeck();
        },

        reset: function () {
            var self = this;
            self.selectedCard = null;
            self.isAnimating = false;
            self.multiDrawn = [];

            if (self.domCache.resultArea) self.domCache.resultArea.classList.add('hidden');
            if (self.domCache.drawnCardDisplay) self.domCache.drawnCardDisplay.innerHTML = '';
            if (self.domCache.multiResultGrid) {
                self.domCache.multiResultGrid.classList.add('hidden');
                self.domCache.multiResultGrid.innerHTML = '';
            }
            if (self.domCache.multiRevealArea) self.domCache.multiRevealArea.classList.add('hidden');
            if (self.domCache.progressContainer) self.domCache.progressContainer.classList.add('hidden');

            self.createDeck();
        },

        switchMode: function (newMode) {
            var self = this;
            if (self.isAnimating) return;

            self.mode = newMode;
            self.reset();

            if (self.domCache.modeSingle) {
                self.domCache.modeSingle.classList.toggle('active', newMode === 'single');
            }
            if (self.domCache.modeMulti) {
                self.domCache.modeMulti.classList.toggle('active', newMode === 'multi');
            }
            if (self.domCache.multiDrawConfig) {
                self.domCache.multiDrawConfig.classList.toggle('hidden', newMode !== 'multi');
            }

            if (self.domCache.drawHint) {
                if (newMode === 'single') {
                    self.domCache.drawHint.innerText = '✨ 从牌堆中选出你最有感应的那张牌 ✨';
                } else {
                    self.domCache.drawHint.innerText = '🎴 多抽模式：依次抽取 ' + self.multiCount + ' 张牌，最后统一揭开';
                }
            }

            if (self.domCache.pageTitle) {
                self.domCache.pageTitle.textContent = newMode === 'single' ? '🔮 选 一 张 牌' : '🔮 牌 阵 抽 牌';
            }
        },

        init: function () {
            this.initDomCache();
            if (!this.domCache.deck) return;

            var self = this;

            ImagePreloader.preloadAll(function (loaded, total) {
                if (loaded === total) {
                    self.createDeck();
                }
            });

            if (self.domCache.reshuffleBtn) {
                self.domCache.reshuffleBtn.onclick = function () { self.reshuffle(); };
            }
            if (self.domCache.deckModeSelect) {
                self.domCache.deckModeSelect.onchange = function () { self.reshuffle(); };
            }

            if (self.domCache.modeSingle) {
                self.domCache.modeSingle.onclick = function () { self.switchMode('single'); };
            }
            if (self.domCache.modeMulti) {
                self.domCache.modeMulti.onclick = function () { self.switchMode('multi'); };
            }

            if (self.domCache.multiDrawOptions) {
                var opts = self.domCache.multiDrawOptions.querySelectorAll('.multi-draw-opt');
                opts.forEach(function (opt) {
                    opt.addEventListener('click', function () {
                        opts.forEach(function (o) { o.classList.remove('active'); });
                        this.classList.add('active');
                        self.multiCount = parseInt(this.getAttribute('data-count')) || 5;
                        if (self.domCache.drawHint) {
                            self.domCache.drawHint.innerText = '🎴 多抽模式：依次抽取 ' + self.multiCount + ' 张牌，最后统一揭开';
                        }
                    });
                });
            }

            if (self.domCache.revealAllBtn) {
                self.domCache.revealAllBtn.onclick = function () { self.revealAllCards(); };
            }

            window.addEventListener('resize', debounce(function () {
                if (self.currentCards.length > 0 && !self.selectedCard && self.mode === 'single') {
                    self.createDeck();
                }
            }, CONFIG.DEBOUNCE_DELAY));
        }
    };

    window.DrawDeckEngine = DrawDeckEngine;

    // ==================== 首页初始化 ====================
    function initHomePage() {
        var featureCards = document.querySelectorAll('.feature-card');
        featureCards.forEach(function (card) {
            function navigate() {
                var url = card.getAttribute('data-url');
                if (url) {
                    window.location.href = url;
                }
            }
            card.addEventListener('click', navigate);
            card.addEventListener('keydown', function (e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    navigate();
                }
            });
        });
    }

    // ==================== 历史页面初始化 ====================
    function renderHistoryList() {
        var historyList = document.getElementById('historyList');
        if (!historyList) return;

        var history = HistoryStore.getAll();

        if (history.length === 0) {
            historyList.innerHTML = '<div class="empty-history">✨ 暂无抽牌记录，开始你的第一次占卜吧 ✨</div>';
            return;
        }

        historyList.innerHTML = history.map(function (record) {
            var truncated = record.meaning.length > 60
                ? record.meaning.substring(0, 60) + '...'
                : record.meaning;
            return '<div class="history-item">' +
                '<div class="date">' + record.date + '</div>' +
                '<div class="card-name">🔮 ' + record.cardName + ' ' + record.orientation + '</div>' +
                '<div class="meaning">「' + truncated + '」</div>' +
                '<div style="font-size: 0.7rem; color: rgba(255,255,255,0.4); margin-top: 8px;">📜 ' + record.advice + '</div>' +
            '</div>';
        }).join('');
    }

    function initHistoryPage() {
        var clearBtn = document.getElementById('clearHistoryBtn');
        var refreshBtn = document.getElementById('refreshBtn');

        if (!clearBtn && !refreshBtn) return;

        renderHistoryList();

        if (clearBtn) {
            clearBtn.onclick = function () {
                if (confirm('确定要清空所有历史记录吗？')) {
                    HistoryStore.clear();
                    renderHistoryList();
                }
            };
        }
        if (refreshBtn) {
            refreshBtn.onclick = renderHistoryList;
        }
    }

    // ==================== 页面路由 ====================
    function bootstrap() {
        if (document.getElementById('deck')) {
            DrawDeckEngine.init();
        }
        if (document.querySelector('.feature-card')) {
            initHomePage();
        }
        if (document.getElementById('historyList')) {
            initHistoryPage();
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', bootstrap);
    } else {
        bootstrap();
    }
})();
