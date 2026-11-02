# Interaction Guidelines

## 1. 动效预算(统一缓动 `--zt-ease: cubic-bezier(.2,0,0,1)`)

| 场景 | 时长 | 令牌 |
|---|---|---|
| Hover/颜色 | 120ms | --zt-motion-fast |
| Button/输入 | 150ms | --zt-motion-base |
| Chip/小浮层 | 180ms | --zt-motion-pop |
| Panel/stage 入场 | 220ms | --zt-motion-panel |
| 页面级过渡 | 280ms | --zt-motion-page |

- 位移距离小(≤6px),不弹跳;禁止持续无意义动画。
- **`prefers-reduced-motion: reduce` 全局关闭**(tokens.css 内 `!important` 兜底,含 smooth-scroll)。
- 执行状态动画必须对应真实状态:预算条宽度绑定真实 turn 数;hot 节点由 Playground 状态机驱动;LIVE 面板只渲染教学端口已上报的事件——没有"假执行动画"。

## 2. 滚动

- 锚点导航:`html { scroll-behavior: smooth; scroll-padding-top: 88px }`(浮動导航高度补偿);reduced-motion 时自动失效。
- **面板内高亮必须 pane-relative**:`pane.scrollTop = el.offsetTop - pane.clientHeight / 2`。教训:`scrollIntoView()` 会把整个页面拽到面板(两站都踩过,已修)。
- 面板自身滚动(scrollbar-width thin + webkit 令牌化)。

## 3. 真实交互原则

- 每个按钮有真实行为:Playground 步进/重置、主题循环、REPLAY/LIVE 切换、trace 事件点选回看、token 输入触发台账查询。
- 轮询是真实合同:groiz 页 8s /api/health;loom trace 400ms 游标轮询;LIVE 600ms 跨源轮询。网络失败安静降级、下一次轮询继续,不弹错误风暴。
- 无假链接:导航里 Documentation/Learn/Journal 在真实页面存在之前不出现入口(见 design-audit §5 路线)。

## 4. 主题切换交互

- 循环 system → light → dark,按钮字形 ◐/☀/☾ 即当前档位;aria-label 同步播报当前档。
- 切换零结构位移:所有组件双主题同布局,无 DOM 变化。
- 首帧无闪烁:引导脚本内联在 `<head>`、样式表之前。
