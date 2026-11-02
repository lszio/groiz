# Component Guidelines

## 1. 分层:共享基础件 vs 产品业务件

共享的是设计基础与交互机制;业务件留在产品页,不抽象上提。

**共享(tokens.css + 两页一致的写法)**:Button(primary/secondary)、IconButton(主题切换)、Input、Status Dot(ok/down/idle)、Badge/Chip(阶段 chip、状态徽章)、Segmented Control(REPLAY/LIVE)、CodeBlock(pre.code + cm/kw/st/fn/hl/hl2)、Callout(.honest)、Card。

**Groiz 产品件**:loop-node 流程图(hot 状态由 Playground 状态机驱动)、stage feed、live-shell(trace 消费面板)、status-card(健康轮询)。

**Loom 产品件**:消息分级(.msg.you 芯片 / 默认平文 / .err 左条)、ui-block(hiccup 白名单渲染,标题/指标/代码组件类)、composer、trace 停靠面板(42vh)。

## 2. 状态矩阵(每个交互件必须齐)

| 状态 | 约定 |
|---|---|
| Hover | 边界变强 / 背景升一级;不位移除软表面按钮(`.btn:active` 例外 translateY(1px)) |
| Focus | 全局 `:focus-visible` 2px `--focus-ring`(tokens.css) |
| Disabled | opacity .4–.5 + 去阴影,cursor not-allowed |
| Loading/运行中 | 真实状态文字(running…/running),不做无限 spinner |
| Error | `--status-danger`,文字 + 图形(左条/点)双通道 |

## 3. 具体规则

- **按钮**:实心 = `--button-*`;次级 = elevated 面 + 边框;圆角 md;高度 ~38px。
- **代码块**:`--bg-inset` 底,语法色全部走令牌(cm=tertiary 斜体、kw=--ph-check、st=--ph-exec、fn=--accent-primary);高亮 .hl=accent-subtle、.hl2=check 16%;`line-height 1.7`。
- **阶段 chip**:`color-mix(var(--ph-*) 16–18%, var(--bg-surface))` 底 + `var(--ph-*)` 字,胶囊圆角;时间轴 tick 用 `var(--ph-*)` 实色,t-other=border-strong。
- **状态点**:.dot(border-strong)/.ok(success)/.down(danger)——颜色不是唯一通道,旁边必须有文字。
- **表格**(map-table 等):细边框 + th 用 subtle 底 + mono caption。
- **Callout**:左边 3px 实线(warning/success/danger 语义)+ surface 底,用于"诚实声明"类内容。
- **hiccup ui-block**:只经 UI_TAGS 白名单渲染,文本一律 textContent;产品 CSS 类(loom-ui-*)映射到语义令牌(panel-title=--ph-extract、metric-value=--accent-primary tabular)。

## 4. zio apps/site 落地时的映射

global.css 的 `--accent-cyan/--accent-purple/--accent-pink` → `--accent-primary`(删除粉/紫);`--bg-dark/--bg-card/--bg-terminal` → `--bg-canvas/--bg-elevated/--bg-inset`;Header 毛玻璃参数改用 `.zt-glass`;FeatureExplorer/Repl 组件内硬编码 rgba 全部换令牌。
