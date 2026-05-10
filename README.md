# Mystic Tarot 神秘塔罗
✨ 纯前端在线塔罗占卜网站，无需后端、开箱即用，支持多牌阵占卜、智能解读、历史记录保存

## 项目介绍
Mystic Tarot 是一款基于 **原生HTML/CSS/JavaScript** 开发的在线塔罗占卜Web应用，无需服务器、无需数据库，所有数据存储在浏览器本地（LocalStorage），支持单张抽牌、多牌阵占卜、卡牌元素分析、逆位解读、历史记录管理等完整功能。

## 功能特性
- 🎴 **单张抽牌**：快速抽牌，获取当日指引
- 📜 **多牌阵支持**
  - 三张牌阵（过去/现在/未来）
  - 凯尔特十字牌阵（10张，综合深度占卜）
  - 关系牌阵（5张，双人关系分析）
  - 六芒星牌阵（7张，因果剖析）
  - 二择一牌阵（5张，选择困难）
  - 黄道十二宫牌阵（12张，年度运势）
- 🔮 **智能解读**：元素分布、正逆位分析、组合能量解读
- 💾 **本地存储**：历史记录永久保存，无需登录
- 🎨 **视觉设计**：SVG原生卡牌渲染、星空背景、响应式布局
- 📱 **全端适配**：桌面/平板/手机完美兼容

## 技术栈
- **HTML5**：语义化标签、页面结构
- **CSS3**：CSS Grid/Flex布局、渐变、动画、响应式
- **原生JavaScript**：ES5、抽牌引擎、牌阵逻辑、LocalStorage
- **SVG**：塔罗牌面矢量渲染
- **LocalStorage**：历史记录本地持久化

## 文件结构
- mystic-tarot-web/
- ├── index.html # 首页
- ├── draw.html # 抽牌页面
- ├── spread.html # 牌阵占卜
- ├── spread-result.html # 结果页
- ├── history.html # 历史记录
- ├── assets/css/ # 样式文件
- ├── assets/js/ # 核心脚本
- └── assets/js/spreads/ # 牌阵逻辑


## 快速开始
### 本地运行
1. 克隆仓库到本地
```bash
git clone https://github.com/xingerumen/mystic-tarot-web.git
