# Accessibility

## 已实现

- **键盘可达**:导航/按钮/输入全部原生元素;全局 `:focus-visible` 2px 焦点环(`--focus-ring`),不删除 outline。
- **aria**:浮动导航 `aria-label="页面导航"`;主题按钮 aria-label + title 动态播报当前档位(切换主题/当前:跟随系统);装饰性分隔 `.sep` `aria-hidden`。
- **颜色非唯一状态**:状态点必有文字(unreachable/开启/正常…);阶段 chip 有文字标签;错误消息有 `loom!` 前缀 + 左条双通道。
- **对比度**:正文 primary on canvas ≥ 7:1(light #283B49/#EDF2F4);实心按钮 light 用藏青 #344D60 底 + 霜白字(深于品牌黛蓝,正是为了对比度);dark 反转为亮底深字。secondary/tertiary 只用于辅助文字,不用于小号正文。
- **reduced-motion**:`prefers-reduced-motion` 全局关闭动画/过渡/smooth-scroll。
- **tabular-nums**:数字列(游标、turns、budget、micros)不跳动。
- **语义化**:`nav`/`header`/`section`/`footer`/`h1–h3`;表单 label 包裹 checkbox(轮询)。

## 约定与待办

- 主题切换不依赖 JS 也可用(无 JS = light,内容完整可读)。
- 装饰纹理(grain)pointer-events:none、≤4% 不影响识别。
- 待办:整页走一遍屏幕阅读器(本轮未做);trace 面板事件行补 `role="button"` + 键盘激活(当前仅鼠标点选,键盘用户可用 tab 输入/run 仍可用);移动端触达目标全部 ≥ 30px(已满足)但未做触屏实测。
