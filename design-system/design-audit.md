# Design Audit — Zio 生态界面现状(2026-10-31)

Phase 1 产出。审计先于修改;本文记录三个产品界面的现状、可保留能力、问题与分期路线。

## 1. 站点清单

| 站点 | 位置 | 技术形态 | 托管 | 状态 |
|---|---|---|---|---|
| Groiz 落地页 | `groiz/site/index.html` | 单文件静态页(内联 CSS/JS) | dokploy:nginx(site/Dockerfile 只 COPY index.html + tokens.css)→ https://groiz.lszio.space | 已上线,本轮重构 |
| Loom 控制台 | `zio/apps/loom/web/index.html` | 单文件(serve.zio 只托管该文件) | dokploy:loom app(镜像内 loom serve 7512)→ https://loom.lszio.space | 已上线,本轮重构 |
| Zio 产品站 | `zio/apps/site/`(Astro:playground/WASM、docs、reference、roadmap、agent 页) | Astro + global.css(869 行) | **未部署**(dokploy 无对应 app) | 未重构,Phase 4 第三优先级 |

## 2. 必须保留的业务能力(均已保留,零删减)

- **Groiz**:Playground 状态机(下一步/运行到底/重置)、真实源码高亮面板、循环总览图(热节点联动)、03 运行状态(loom/grove 真实 /api/health 轮询 + token 台账)、04 函数执行实况(REPLAY 内嵌 trace + LIVE 跨源轮询、阶段带、时间轴、调用栈、pane 内滚动)。
- **Loom**:/api/chat 会话(含 cost_micros)、hiccup UI 渲染合同(白名单标签 + textContent)、/api/run 同步运行、教学端口 trace 面板(轮询/源码/调用栈/阶段带/时间轴)、健康状态显示。
- **Zio apps/site**(未动):WASM playground、doc-execution、reference 等,全部原样。

## 3. 重构前的问题

1. **霓虹高饱和**:groiz 用 teal `#5eead4` + indigo `#818cf8` + 粉 `#f5a7c4`;zio site 更是 `#00f2fe`/`#7f00ff`/`#ff007f` 赛博配色——指南点名的反例("避免发光、霓虹和科技蓝")。
2. **无主题系统**:三站皆纯暗色硬编码色值,无 light/dark/system。
3. **令牌缺失**:间距/圆角/阴影/动效各页随手定义;loom 全页等宽字体;groiz 标题无 CJK 回退风险。
4. **导航缺失**:groiz 落地页无顶部导航(锚点只有 hero 按钮);无生态内互链入口(仅 footer)。
5. **消息模型单一**:loom 所有输出一种样式,用户/系统/错误不分级。
6. **信息架构缺口**(三站共有):指南要求的 Documentation / Learn / Journal 独立页面不存在(groiz 02 原理节承担了 Learn 职能;zio site 有 docs/reference 但未部署)。本轮**不新增假入口**——只链接真实存在的内容。

## 4. 共性与差异

- 共性:都是深色工程师审美、单文件优先、无构建步骤(groiz/loom),真实数据驱动(没有假状态)。
- 差异:Groiz = 观察控制面(时间线/状态/trace 是主角);Loom = 对话空间(会话是中心);Zio = 语言产品(编辑器/playground 是主角)。共享设计语言,不共享产品形态。

## 5. 分期路线

- ✅ **本轮(Phase 1+2+4 前两步)**:token 单源 + 双主题系统;Groiz、Loom 按 Quiet Tactile 重构并上线。
- ⬜ **Phase 4 第三步**:zio `apps/site` 重构 —— global.css 869 行是 var 驱动的,替换 `:root` 调色板为语义令牌 + Base.astro 加主题引导脚本 + 清扫硬编码 `rgba(0,242,254,…)`;Repl/DocExecution/FeatureExplorer 组件跟随 token。部署后一并验收。
- ⬜ **Phase 5**:Documentation / Learn / Journal 内容页(真实内容驱动,逐产品补齐);Groiz Workspace/Entities/Rooms 的产品级 IA(拓扑图、Room 视图)按 spec §8.3 另行排期。
- ⬜ **Phase 6**:响应式补强(当前两站已有基础断点)、浏览器兼容矩阵、性能。
