# design.md — Zio Ecosystem Locked Design System

> hallmark locked-system 声明。读到本文件即视为 DESIGN.md 存在：**不要 deal 主题，不要引入本系统之外的色板/字体/圆角**。Floor 16 条照常全部适用。
> P4 在各产品仓工作时，将本文件（或指本文件）放/链接到仓根。

## Tokens

单源 `groiz/design-system/tokens.css`（三层：--zt-* primitive → 语义 --bg/--text/--border/--accent/--status → 组件 --button/--card/--ph）。全表与规则：zio-eco-docs/docs/design-system/tokens.md。禁止原始色值/字面 font-family（令牌块除外）。

## Themes

light(:root 默认) / dark(html[data-theme="dark"]) / system(zt-theme 键，首帧前内联引导，ztTheme.cycle 切换)。产品识别色仅允许对 --accent-primary 的 override：zio 原值 / loom #17708A·#6FB4CB / groiz #2A7A72·#55A6A0。主按钮永远共享 primary。

## Type

--zt-font-sans / --zt-font-editorial / --zt-font-mono（栈见 typography.md，CJK 黑体回退必须保留）。标签正文脸小一号句首大写；禁大写间隔字母/眉题/小 caps；指标 .zt-num tabular。

## Motion

120–280ms，--zt-ease cubic-bezier(.2,0,0,1)；只动 transform/opacity；禁 transition:all 与宽高/top/left 动画；每个动画有 prefers-reduced-motion 回退。

## Surfaces

普通表面实心；玻璃仅粘性栏/浮层(.zt-glass)；禁颗粒纹理(.zt-grain 已废弃)、渐变按钮、发光、紫蓝渐变、卡片套卡片、装饰状态点、无数据图表。

## States

九态语义(components.md)；空态=说明+真实动作；错误=原文+Retry(幂等才给)+网络/权限分述；Pending/Paused 仅后端真有该态时出现；Demo 显式标注。
