(function (global) {
    'use strict';

    var TS = global.TarotSpreads;

    TS.SpreadInterpreter = {
        analyzeElementDistribution: function (cards) {
            var counts = TS.countByElement(cards);
            var total = cards.length;
            var result = [];

            Object.keys(counts).forEach(function (el) {
                var pct = Math.round((counts[el] / total) * 100);
                result.push({
                    element: el,
                    count: counts[el],
                    percentage: pct,
                    note: pct >= 40 ? el + '元素占主导（' + pct + '%），该领域是当前核心课题。' :
                          pct === 0 ? el + '元素缺失，该领域可能需要更多关注。' : ''
                });
            });

            return result;
        },

        analyzeMajorMinorRatio: function (cards) {
            var majorCount = TS.countMajors(cards);
            var total = cards.length;
            var pct = Math.round((majorCount / total) * 100);

            return {
                majorCount: majorCount,
                minorCount: total - majorCount,
                majorPercentage: pct,
                assessment: pct >= 50 ? '大阿卡纳占多数，当前问题具有深远的人生意义，不是普通的日常事务。' :
                            pct >= 30 ? '大阿卡纳与小阿卡纳均衡，既有深层课题也有具体指引。' :
                            '小阿卡纳占多数，当前问题聚焦于具体事务和日常行动层面。'
            };
        },

        analyzeReversalRatio: function (cards) {
            var revCount = TS.countReversed(cards);
            var total = cards.length;
            var pct = Math.round((revCount / total) * 100);

            return {
                reversedCount: revCount,
                uprightCount: total - revCount,
                reversedPercentage: pct,
                assessment: pct >= 50 ? '逆位占多数（' + pct + '%），当前处于深度调整期。向内看比向外求更重要，反思优先于行动。' :
                            pct >= 25 ? '有一定比例的逆位（' + pct + '%），部分领域需要调整和重新审视。' :
                            '逆位较少（' + pct + '%），能量整体通畅，适合积极推进。'
            };
        },

        analyzeNumberSequence: function (cards) {
            var numbers = cards.map(function (c) {
                return c.card.number || 0;
            }).filter(function (n) { return n > 0; });

            if (numbers.length < 2) return null;

            var sequences = [];
            var currentSeq = [numbers[0]];

            for (var i = 1; i < numbers.length; i++) {
                if (numbers[i] === currentSeq[currentSeq.length - 1] + 1) {
                    currentSeq.push(numbers[i]);
                } else {
                    if (currentSeq.length >= 2) sequences.push(currentSeq.slice());
                    currentSeq = [numbers[i]];
                }
            }
            if (currentSeq.length >= 2) sequences.push(currentSeq);

            if (sequences.length === 0) return null;

            return {
                sequences: sequences,
                note: '牌阵中出现数字序列' + sequences.map(function (s) {
                    return s.join('→');
                }).join('、') + '，暗示渐进式的发展过程，事情正在逐步推进。'
            };
        },

        generateThemedAdvice: function (result, question) {
            var cards = result.cards;
            var spread = result.spreadDef;
            var theme = this._detectTheme(question);

            var advice = '基于' + spread.name + '的启示';

            switch (theme) {
                case 'love':
                    advice += '，在感情方面：' + this._loveAdvice(cards);
                    break;
                case 'career':
                    advice += '，在事业方面：' + this._careerAdvice(cards);
                    break;
                case 'decision':
                    advice += '，在做决定时：' + this._decisionAdvice(cards);
                    break;
                case 'growth':
                    advice += '，在个人成长方面：' + this._growthAdvice(cards);
                    break;
                default:
                    advice += '：' + this._generalAdvice(cards);
            }

            return advice;
        },

        _detectTheme: function (question) {
            if (!question) return 'general';
            var q = question.toLowerCase();
            if (/爱|情|恋|婚|对象|TA|他|她|喜欢/.test(q)) return 'love';
            if (/工作|事业|职业|跳槽|公司|老板|同事|升职/.test(q)) return 'career';
            if (/选择|决定|选|还是|或者|A|B/.test(q)) return 'decision';
            if (/成长|自己|人生|方向|目标|改变|未来/.test(q)) return 'growth';
            return 'general';
        },

        _loveAdvice: function (cards) {
            var majors = cards.filter(function (c) { return !c.card.type; });
            if (majors.length > 0) {
                return '这段关系承载着重要的成长课题。' + majors[0].card.name + '的出现提醒你，' +
                    (majors[0].orientation === '正位' ? '真诚面对自己的感受。' : '需要审视关系中隐藏的问题。');
            }
            return '关注日常的相处细节，小行动比大承诺更能滋养关系。';
        },

        _careerAdvice: function (cards) {
            var fireCards = cards.filter(function (c) { return c.card.element === '火'; });
            if (fireCards.length >= cards.length * 0.3) {
                return '行动力是你的优势，但注意不要冲动。在推进计划的同时，留出反思的空间。';
            }
            return '稳扎稳打是当前最好的策略。专注于提升核心技能，机会会在合适的时候出现。';
        },

        _decisionAdvice: function (cards) {
            var revCount = TS.countReversed(cards);
            if (revCount >= cards.length * 0.4) {
                return '当前可能不是做重大决定的最佳时机。建议先收集更多信息，等局势明朗后再行动。';
            }
            return '牌面显示你有足够的信息做出判断。相信自己的直觉，同时参考客观事实。';
        },

        _growthAdvice: function (cards) {
            var dominant = TS.dominantElement(cards);
            var advice = '';
            if (dominant === '火') advice = '勇敢走出舒适区，行动是成长的最好方式。';
            else if (dominant === '水') advice = '深入探索内心世界，情感和直觉是你最好的老师。';
            else if (dominant === '风') advice = '学习和思考是当前成长的关键。多读书，多交流。';
            else if (dominant === '土') advice = '脚踏实地，一步一个脚印。耐心和坚持会带来丰硕的成果。';
            else advice = '保持开放的心态，从生活的各个方面汲取成长的养分。';
            return advice;
        },

        _generalAdvice: function (cards) {
            var firstCard = cards[0];
            return '关注' + firstCard.card.name + '带来的启示：' + firstCard.card.advice;
        }
    };

})(window);
