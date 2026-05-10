const tarotCards = [
  { name: "愚者", upright: "新的开始与冒险精神。", reversed: "冲动与缺乏计划。", element: "风" },
  { name: "魔术师", upright: "资源整合与主动创造。", reversed: "分心与能力未落地。", element: "火" },
  { name: "女祭司", upright: "直觉清晰，宜静观。", reversed: "信息遮蔽，判断迟疑。", element: "水" },
  { name: "皇后", upright: "滋养、丰盛与成长。", reversed: "过度付出或怠惰。", element: "土" },
  { name: "皇帝", upright: "秩序、结构与执行力。", reversed: "控制过强或僵化。", element: "火" },
  { name: "教皇", upright: "传统智慧与稳定路径。", reversed: "教条束缚，需突破。", element: "土" },
  { name: "恋人", upright: "关系和谐与价值一致。", reversed: "关系失衡或选择摇摆。", element: "风" },
  { name: "战车", upright: "目标明确，推进顺利。", reversed: "方向分散，进退失据。", element: "水" },
  { name: "力量", upright: "温柔而坚定地掌控局面。", reversed: "内耗与信心不足。", element: "火" },
  { name: "隐者", upright: "内省求真，独立思考。", reversed: "封闭退缩，错过支持。", element: "土" },
  { name: "命运之轮", upright: "转机将至，顺势而为。", reversed: "周期受阻，需耐心。", element: "火" },
  { name: "正义", upright: "客观平衡，重视责任。", reversed: "偏见或结果延期。", element: "风" },
  { name: "倒吊人", upright: "换位思考，暂停换来洞察。", reversed: "僵持不下，拖延加重。", element: "水" },
  { name: "死神", upright: "结束旧阶段，迎接重生。", reversed: "抗拒改变，循环停滞。", element: "水" },
  { name: "节制", upright: "调和资源，循序渐进。", reversed: "失衡与极端化倾向。", element: "火" },
  { name: "恶魔", upright: "直面欲望与现实束缚。", reversed: "挣脱依赖，重获主导。", element: "土" },
  { name: "高塔", upright: "突发变化带来重建。", reversed: "风险临近，需主动调整。", element: "火" },
  { name: "星星", upright: "希望复苏，方向清晰。", reversed: "信念动摇，需恢复能量。", element: "风" },
  { name: "月亮", upright: "情绪与潜意识信息强烈。", reversed: "迷雾渐散，真相浮现。", element: "水" },
  { name: "太阳", upright: "积极成果与公开认可。", reversed: "短暂低潮，避免自满。", element: "火" },
  { name: "审判", upright: "觉醒与关键决定时刻。", reversed: "迟疑不决，错失召唤。", element: "火" },
  { name: "世界", upright: "阶段圆满，迈向新循环。", reversed: "收尾未尽，需整合资源。", element: "土" }
];

const spreads = {
  single: [{ key: "guidance", label: "当下指引" }],
  ppf: [
    { key: "past", label: "过去" },
    { key: "present", label: "现在" },
    { key: "future", label: "未来" }
  ]
};

const CARD_REVERSED_PROBABILITY = 0.5;
const HISTORY_KEY = "tarotDivinationHistory";

const questionInput = document.getElementById("questionInput");
const spreadSelect = document.getElementById("spreadSelect");
const drawBtn = document.getElementById("drawBtn");
const resultCards = document.getElementById("resultCards");
const analysisText = document.getElementById("analysisText");
const historyList = document.getElementById("historyList");
const clearHistoryBtn = document.getElementById("clearHistoryBtn");

function shuffle(cards) {
  const arr = [...cards];
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function createCardView(positionLabel, card, reversed) {
  const item = document.createElement("article");
  item.className = "card";

  const title = document.createElement("h3");
  title.textContent = `${positionLabel}：${card.name}`;

  const meta = document.createElement("p");
  meta.className = "meta";
  meta.textContent = reversed ? "逆位" : "正位";

  const meaning = document.createElement("p");
  meaning.textContent = reversed ? card.reversed : card.upright;

  item.append(title, meta, meaning);
  return item;
}

function buildAnalysis(drawn) {
  const orientationCounts = drawn.reduce((acc, item) => {
    if (item.reversed) acc.reversed += 1;
    else acc.upright += 1;
    return acc;
  }, { upright: 0, reversed: 0 });

  const elementCounter = drawn.reduce((acc, item) => {
    const el = item.card.element;
    acc[el] = (acc[el] || 0) + 1;
    return acc;
  }, {});

  const sortedElements = Object.entries(elementCounter).sort((a, b) => b[1] - a[1]);
  const dominantElement = sortedElements[0]?.[0] || "平衡";
  const orientationSummary = orientationCounts.reversed > orientationCounts.upright
    ? "逆位偏多，提示先处理内在阻力，再推进外在行动。"
    : "正位偏多，当前整体趋势较顺，可稳步推进。";

  const elementSummaryMap = {
    火: "火元素突出：行动力与突破意愿增强，适合主动争取。",
    水: "水元素突出：情绪与关系议题明显，建议先稳定内心。",
    风: "风元素突出：沟通与思考很关键，适合做信息整合。",
    土: "土元素突出：现实与执行层面最重要，宜务实落地。",
    平衡: "四元素分布均衡：保持当前节奏即可。"
  };

  return `${orientationSummary} ${elementSummaryMap[dominantElement]}`;
}

function getHistory() {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (error) {
    console.error("读取占卜历史失败：", error);
    return [];
  }
}

function saveHistory(entry) {
  const existing = getHistory();
  existing.unshift(entry);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(existing.slice(0, 30)));
}

function renderHistory() {
  const history = getHistory();
  historyList.textContent = "";

  if (!history.length) {
    const empty = document.createElement("li");
    empty.className = "history-item";
    empty.textContent = "暂无记录。";
    historyList.appendChild(empty);
    return;
  }

  history.forEach((item) => {
    const li = document.createElement("li");
    li.className = "history-item";

    const title = document.createElement("strong");
    title.textContent = `${item.time} · ${item.spreadLabel}`;

    const q = document.createElement("p");
    q.textContent = item.question ? `问题：${item.question}` : "问题：未填写";

    const cards = document.createElement("p");
    cards.textContent = `抽到：${item.cards.join("，")}`;

    const sum = document.createElement("p");
    sum.textContent = `分析：${item.analysis}`;

    li.append(title, q, cards, sum);
    historyList.appendChild(li);
  });
}

function drawCards() {
  const spread = spreads[spreadSelect.value] || spreads.single;
  const drawn = shuffle(tarotCards).slice(0, spread.length).map((card, index) => ({
    card,
    position: spread[index].label,
    reversed: Math.random() < CARD_REVERSED_PROBABILITY
  }));

  resultCards.textContent = "";
  drawn.forEach((item) => {
    resultCards.appendChild(createCardView(item.position, item.card, item.reversed));
  });

  const analysis = buildAnalysis(drawn);
  analysisText.textContent = analysis;

  const entry = {
    time: new Date().toLocaleString("zh-CN", { hour12: false }),
    question: questionInput.value.trim(),
    spreadLabel: spreadSelect.value === "ppf" ? "过去-现在-未来" : "单张指引",
    cards: drawn.map((item) => `${item.position}:${item.card.name}（${item.reversed ? "逆" : "正"}）`),
    analysis
  };

  saveHistory(entry);
  renderHistory();
}

drawBtn.addEventListener("click", drawCards);
clearHistoryBtn.addEventListener("click", () => {
  localStorage.removeItem(HISTORY_KEY);
  renderHistory();
});

renderHistory();
