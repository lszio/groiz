# Design Principles — Quiet Tactile 在 Zio 生态的具体化

设计语言:Quiet · Tactile · Modern · Adaptive。统一的是设计语言,不是产品形态。

## 1. 三个产品的性格

| 产品 | 关键词 | 界面应有的感觉 | 主角 |
|---|---|---|---|
| Groiz | Observe · Intervene · Collaborate | 可观察、可理解的控制空间 | 执行时间线 / 状态卡 / trace 面板 |
| Loom | Connect · Converse · Listen | 安静的对话空间 | 会话列(居中 760px) |
| Zio | Explore · Compose · Evaluate | 可以运行的技术书 | 编辑器 / playground |

## 2. 材质分配(材质服从信息类型,不为统一而统一)

| 材质 | 用在哪 | 不用在哪 |
|---|---|---|
| M1 Soft Surface(软表面,--card-shadow) | 按钮、输入框、状态卡、用户消息芯片、UI 面板卡 | 长文、日志、表格 |
| M2 Frosted Glass(backdrop 20px/120%,仅浮层) | groiz 浮动导航;loom/groiz 顶部栏若改浮层时 | 内容区、面板内部 |
| M3 Grain(细颗粒,light 3% / dark 4%) | groiz Hero 一处 | 任何正文/代码区 |
| M4 Flat Surface(平面 + 边框) | 代码块、trace 面板、表格、文档正文——内容区默认 | — |

## 3. 色彩纪律

- 只用 tokens.css 的 semantic/component 层;**页面禁止出现原始色值**(groiz 页内唯一遗留是历史变量名映射层,值全部指向令牌)。
- 主色 黛蓝/藏青;状态色 success/warning/danger/info;五个教学阶段色(黛蓝→苍→砂→灰紫→陶)是唯一的多彩区,全部低饱和,且每主题各有一套亮度。
- 深色不是"黑底霓虹":dark 画布 #18232C,accent 变亮而非更饱和。

## 4. 诚实展示(生态铁律,优先级高于美观)

- 失败/降级状态原样呈现:unreachable 就显示 unreachable + danger 点,不做骨架屏伪装加载;教学端口未开启就写明"启动器未授予",不假装在加载。
- 执行状态动画必须对应真实状态;没有后端就没有假数据。
- 数字(游标、turns、预算、micros)一律 tabular-nums。

## 5. 禁止清单

大面积高饱和渐变;全页玻璃;每卡重阴影;万物胶囊圆角;发光/霓虹/科技蓝;装饰性国风水墨符号;为视觉牺牲可读性;假按钮、假数据、静态假状态;把所有页面做成卡片堆叠。
