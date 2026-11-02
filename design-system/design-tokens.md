# Design Tokens — 单源与主题合同

## 1. 单源与分发

- canonical:`groiz/design-system/tokens.css`(三层:primitive `--zt-*` → semantic → component)。
- 分发副本(**不要直接改**):
  - `groiz/site/tokens.css` —— `<link>` 引用;site/Dockerfile `COPY index.html tokens.css`。
  - `zio/apps/loom/web/index.html` —— loom serve 只托管 index.html,令牌以 `<style id="zt-tokens">` 内联在 `/* zt-tokens:begin */`…`/* zt-tokens:end */` 标记之间。
- 修改后运行 `groiz/tools/sync-design-tokens.sh`(可用 `ZIO_REPO=` 覆盖 zio 仓路径)。
- zio `apps/site`(Astro)落地时直接 import canonical 内容进 global.css 的 `:root` 段,不再复制文件。

## 2. 主题合同

- 默认 `:root` = light;`html[data-theme="dark"]` 整体覆盖。无 JS 时呈现 light,不会白屏闪黑。
- **引导脚本必须在 `<head>` 内联、首帧前执行**:读 `localStorage['zt-theme']`(system/light/dark,默认 system),按 `prefers-color-scheme` 解析后写 `data-theme` + `data-themePref` 两个 dataset。
- 切换:页面脚本提供 `ztTheme.cycle()`(system → light → dark),按钮字形 ◐/☀/☾,aria-label 同步;`matchMedia` change 事件在 system 档下跟随。
- 偏好键 `zt-theme` 三个产品共用(同域部署后天然同步;跨域时各自记住,不引入第三方存储)。

## 3. 关键令牌速查

| 层 | 令牌 | light / dark |
|---|---|---|
| 画布 | `--bg-canvas` | 月白 #EDF2F4 / #18232C |
| 表面 | `--bg-surface` `--bg-elevated` `--bg-inset` | 霜白/白/内嵌 ↔ 三级灰蓝 |
| 文字 | `--text-primary/secondary/tertiary` | 玄青系 ↔ 浅灰蓝系 |
| 边界 | `--border-default` `--border-strong` | 银灰系 |
| 主色 | `--accent-primary` `--accent-hover` `--accent-subtle` | 黛蓝 #58788B ↔ 亮黛蓝 #A4C3D2 |
| 状态 | `--status-success/warning/danger/info` | 每主题独立校准 |
| 按钮 | `--button-bg/fg/hover` | light 用**藏青**底白字(对比度优先),dark 用亮黛蓝底深字 |
| 阶段 | `--ph-ask/extract/exec/check/revise` | 黛蓝/苍/砂/灰紫/陶 ↔ 提亮版 |

## 4. 字体决策

- **不加载 webfont**(离线可靠 / 授权 / 性能),用系统栈:正文 Inter→MiSans→Noto Sans SC→PingFang SC;标题 editorial 栈(Geist→…);代码 JetBrains Mono→SFMono→ui-monospace。
- **教训**:editorial/mono 是拉丁导向的栈,CJK 必须显式回退黑体(`"PingFang SC"` 等),否则中文标题在 macOS 落到系统衬线(宋体)。两类栈均已修正。
- 数字场景加 `font-variant-numeric: tabular-nums`(工具类 `.zt-num` 或局部声明)。

## 5. 尺寸系统

- 间距 4px 基准:`--zt-space-1…20`(4/8/12/16/20/24/32/40/48/64/80)。
- 圆角按用途选:sm 6(行内代码)/ md 10(按钮输入)/ lg 14(卡片)/ xl 20 / 2xl 28 / full(胶囊仅用于导航、阶段 chip、状态徽章)。
- 字号:display 52 / h1 36 / h2 28 / h3 22 / h4 18 / body-lg 16 / body 14 / caption 12 / code 13;正文行高 1.65,代码 1.7;中文正文宽度 30–40 汉字(会话列 760px、文档正文 ≤ 800px)。
- 主内容最大宽 1120–1200px;断点 640 / 860 / 900 / 1024 / 1440。
