# Groiz

治理学习应用：评估、路由、蒸馏与发布治理。Groiz 以 [Zio](https://github.com/lszio/zio)
为语言基础，以 [Loom](https://github.com/lszio/zio/tree/main/contribs/native/loom)
为模型 harness。

## 与 Zio 的关系

Groiz 是 Zio 的独立应用仓库，在 Zio 中以 submodule 挂载于 `apps/grove`
（挂载点路径保持历史名称）：

```sh
git clone --recurse-submodules https://github.com/lszio/zio.git
cd zio
cargo test --manifest-path apps/grove/Cargo.toml --workspace
```

`native/*/Cargo.toml` 的 `zio-core` / `loom` 是路径依赖，指向 Zio 检出中的
`langs/core` 与 `contribs/native/loom`；单独克隆本仓库时，请把 Zio 检出放在
满足这些相对路径的位置，或在 Zio 检出内工作。

## 布局

- `native/learning` — `grove` 库：评估、集成、检查点、治理学习
- `native/app` — `grove-app`：CLI/HTTP 应用壳
- `*.zio` — Zio 业务层（入口 `main.zio`、筛选 `selection.zio` 等）
- `web/` — 控制台静态资源；`workers/` — 张量 worker

令牌环境变量为 `GROIZ_TOKEN_{READER,ANNOTATOR,OPERATOR,PUBLISHER}`
（安装后的启动器由 `tools/install.sh` 写入）。

构建与合同见 Zio 仓库的 `tools/test-grove-*.sh` 与 `.github/workflows/ci.yml`。