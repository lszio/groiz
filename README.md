# Groiz

治理学习应用：评估、路由、蒸馏与发布治理。Groiz 以 [Zio](https://github.com/lszio/zio)
为语言基础，以 [Loom](https://github.com/lszio/zio/tree/main/contribs/native/loom)
为模型 harness，作为**独立仓库**开发与发布：Zio 侧只保留语言与库，站点、仓库内
的 compose/nginx/CI 都不再承载 Groiz。

## 与 Zio 的关系

本仓库的 workspace 通过路径依赖指向同级的 Zio 检出（`native/*/Cargo.toml` 里的
`../../../zio/langs/core` 与 `../../../zio/contribs/native/loom`），所以两个仓库要
并排克隆：

```sh
git clone https://github.com/lszio/zio.git
git clone https://github.com/lszio/groiz.git
cd groiz
cargo test --workspace
```

`tools/groiz` 启动器同样默认使用同级 Zio 检出的 CLI（`ZIO_ROOT`、`ZIO_BIN` 可显式
指向别处，包括已安装的发行树）。

## 布局

- `main.zio` — Zio 入口（启动器调用 `grove--main`），`api.zio` HTTP 路由，
  `store.zio`／`runner.zio`／`selection.zio` 等业务层
- `native/learning` — `grove` 库：评估、集成、检查点、治理学习
- `native/app` — `grove-app`：CLI/HTTP 应用壳
- `web/` — 控制台静态资源；`workers/torch/` — 张量 worker
- `examples/self-learning/` — 冻结验收任务（生成器、分组切分、冻结门槛）
- `docs/` — 整体设计、交付计划与部署规格；`tools/` — 启动器与真实合同脚本

## 运行

```sh
# 1. Zio CLI（启动器默认找 ../zio/target/{release,debug}/zio-cli）
(cd ../zio && cargo build -p zio-cli)

# 2. 带 torch 的解释器：训练 worker 与张量后端都用它
python3 -m venv .venv
.venv/bin/pip install -r workers/torch/requirements.txt

# 3. 启动
export GROIZ_TOKEN_READER=reader-1 GROIZ_TOKEN_OPERATOR=operator-1 \
       GROIZ_TOKEN_PUBLISHER=publisher-1 GROIZ_TOKEN_ANNOTATOR=annotator-1
./tools/groiz serve --root /tmp/groiz
```

启动器决定全部授权：数据根（唯一的写根）、UI 资源、tensor 后端、worker 脚本与
解释器、worker jail 的只读挂载，以及应用可读的环境变量名（`--app-env`）。
应用侧不能自行扩大这些范围。令牌环境变量为
`GROIZ_TOKEN_{READER,ANNOTATOR,OPERATOR,PUBLISHER}`；未设置任何令牌时，非
loopback 地址会被拒绝绑定（见 `api.zio`）。

## 真实合同

| 脚本 | 证明什么 |
|---|---|
| `tools/test-zio-http.sh` | 通过启动器起真实服务：路由、动态路径与查询解码、角色授权、幂等/冲突回执、owner 真正执行队列、worker 隔离与否的诚实结果 |
| `tools/test-deployment.sh` | 构建镜像后：控制面可达、无令牌 401、reader 可读、排队任务被 owner 消费、重启后 store 仍回答 |
| `tools/smoke-logic-approval.py` | 人工批准边界：受保护区提案被拒、operator 触不到批准、publisher 批准合格候选且回执/版本可复现 |
| `cargo test --workspace` | 库与应用合同；需要 namespace 与 `.venv` 的用例缺少前置时显式 skip，绝不谎报通过 |

## 部署

- `Dockerfile`：从 GitHub 取 `ZIO_REF`（默认 `main`，可用 `--build-arg` 固定版本）
  的 Zio 检出并构建 `zio-cli`，再装入启动器、控制台资源与锁定的 CPU worker venv。
  `ZIO_REF` 必须包含 `zio --app-env` 支持。
- `docker-compose.yml`：一个 `grove` 服务 + `grove-data` 卷，`expose: 8787`；
  Dokploy 域名的上游指向该服务的 8787。`docker-compose.local.yml` 加环回端口以便
  本地验证。
- 训练需要 user namespace（`unshare(CLONE_NEWUSER)`），因此 compose 设
  `security_opt: seccomp:unconfined`；未授予任何 capability，缺少 namespace 时训练
  诚实落到 `failed` 并报告隔离错误。

## 文档

- [整体设计](docs/self-learning-architecture.md)：独立应用边界、学习闭环、检查点与发布治理
- [交付计划](docs/plans/)：各阶段工作包、依赖与真实验收
- [部署规格](docs/specs/)：运行时、环境与路由合同

Zio 语言、库与工具链文档在 [Zio 仓库](https://github.com/lszio/zio)。
