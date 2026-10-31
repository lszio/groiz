# Implementation Report — Quiet Tactile 重构 第一期(2026-10-31)

## 范围

按重构指南分期执行:Phase 1(审计)+ Phase 2(Foundation)+ Phase 4 前两步(Groiz、Loom)。
**zio `apps/site`(Astro)未动**——未部署上线,列入 Phase 4 第三步(audit §5 有具体映射表)。

## 修改清单

**groiz 仓(dev `ed65291`)**
- 新增 `design-system/`:tokens.css(单源)+ design-audit / design-principles / design-tokens / component-guidelines / interaction-guidelines / accessibility / 本报告。
- 新增 `tools/sync-design-tokens.sh`:令牌分发(site 拷贝 + loom 控制台标记内联)。
- 重构 `site/index.html`:玻璃浮层导航(锚点 + loom 控制台 + GitHub + 主题循环)、首帧前主题引导脚本、`<link>` tokens.css、颗粒 Hero、全部区块令牌化(loop 节点/stage feed/代码语法色/状态卡/live 面板/阶段五色 `--ph-*`)、`:root` 历史变量名 → 语义令牌映射层(JS 与内联样式零改动)。
- `site/Dockerfile`:`COPY index.html tokens.css /usr/share/nginx/html/`。

**zio 仓(dev `daa716d`)**
- 重构 `apps/loom/web/index.html`:对话空间布局(居中 760px 会话列、消息三级:用户芯片 / agent 平文+tabular 费用 / 错误左条)、顶栏(品牌 + `data-state` 连接徽章 + 主题按钮)、ui-block 卡片化(白名单渲染合同不变)、令牌以 `<style id="zt-tokens">` 内联(标记间内容由 sync 脚本生成)。

## 业务能力保留验证(JS 合同)

- 两页主脚本与新文件 diff:**逐字节一致**,仅追加主题引导/ztTheme 块(loom 另加 3 处 `state.dataset` 赋值)。
- 本地验证(127.0.0.1 静态服务 + 浏览器):Playground 状态机步进/热节点联动、REPLAY 43 事件渲染、阶段带/时间轴/调用栈点选、健康卡优雅降级(unreachable + danger 点)、hiccup 面板渲染(真实标签形状)。
- 线上验证(双站 × 双主题截图):
  - **groiz.lszio.space**:深浅两主题;03 双卡全绿真实数据(loom teach 开启/cursor、grove schema=1/owner_epoch=1/scheduler 正常);04 REPLAY 43 事件。
  - **loom.lszio.space**:深浅两主题;`session ready` 徽章;真实跑一轮 agent 循环(status exhausted · turns 2,容器 jail 诚实拒绝,与既有行为一致),trace 43 事件 cursor 7588,源码高亮 agent.zio:93,阶段五色正常。

## 部署记录

- push 自动部署:loom(zio push → 镜像重建)一次成功;groiz site 未触发(push 触发时滞,已知问题),手动 `application.deploy`(拉分支头,deployment `UJQs8GkDHeGDt4jBq3giB`)完成。
- 部署排查教训:deployment 标题 = commit 消息,可用来确认部署对应的 commit;上次会话的部署日志会和当前混淆,先看标题再读日志。

## 令牌体系要点

- 单源 `design-system/tokens.css`,三层(primitive `--zt-*` / semantic / component);页面禁止原始色值。
- 主题:light 为 `:root` 默认,`html[data-theme="dark"]` 覆盖;引导脚本内联 head 首帧前执行;偏好 `localStorage['zt-theme']` 三产品共用;`ztTheme.cycle()` system→light→dark。
- 分发:`tools/sync-design-tokens.sh`(loom serve 只托管 index.html,故 loom 侧内联)。

## 踩坑记录

1. **CJK 字体回退**:editorial/mono 栈不含中文回退 → macOS 中文标题落宋体;已补 `"PingFang SC"` 等。任何拉丁导向字体栈在中文产品里必须显式补 CJK 黑体。
2. **tokens.css 注释里写 `<script>` 字面量**:同步内联进页面后污染脚本提取(HTML 解析无害但脆弱);文档性内容一律不用标签字面量。
3. `position: fixed` 浮层在 fullPage 截图中每屏重复 —— 截图拼接伪影,非页面缺陷,用视口截图分段验证。
4. smooth-scroll 容器内 `scrollIntoView` 与测试定位冲突 —— 页面内高亮保持 pane-relative scroll(两站既有约定)。

## 遗留问题

- **zio apps/site 重构**(Phase 4 第三步):换 `:root` 调色板为语义令牌 + Base.astro 主题引导 + 清扫硬编码 `rgba(0,242,254,…)`;建议与首次部署一并做。
- **Documentation / Learn / Journal 内容页**(Phase 5):三站均无;导航按"无真实页面不加入口"原则暂缺,补内容时再加。
- trace 面板事件行仅鼠标点选,键盘激活待补(a11y 文档已记录)。
- 主题偏好跨域不同步(groiz/loom 异域各自记住;同键名,迁同域后天然同步)。
- **paca / codebase-memory MCP 本会话不可用**,AGENTS.md 要求的 detect_changes 未跑(连续第二次);以人工 `git status` + 全量 diff 审查代替,JS 合同用 git 提取对比验证。
