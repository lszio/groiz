# Groiz

自学习与程序演化运行平台：当前复用已有评估、训练、检查点与发布治理能力，
先服务可复现研究，第二阶段沉淀为可被不同应用调用的智能体框架。
Groiz 以 [Zio](https://github.com/use-zio/zio) 为语言基础，
以 [Loom](https://github.com/use-zio/zio/tree/main/contribs/native/loom) 为模型 harness，
作为**独立仓库**开发与发布，不进入 Zio 语言发行树。

2026-10-25 [项目方向](docs/project-direction.md)明确两篇论文、Zio、GROIZ 与独立应用
Zioo 的分工。框架是演进目标，不代表当前部署入口已经完成程序学习、独立评价与晋升闭环；
已有组件、native 入口与 Zio 部署入口分别验收。

## 与 Zio 的关系

本仓库的 workspace 通过路径依赖指向同级的 Zio 检出（`native/*/Cargo.toml` 里的
`../../../zio/langs/core` 与 `../../../zio/contribs/native/loom`），所以两个仓库要
并排克隆：

```sh
git clone https://github.com/use-zio/zio.git
git clone https://github.com/use-zio/groiz.git
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

## Agent 循环

`grove run` 驱动真实的 agent 循环：任务与授权上下文 → 模型生成 Zio 候选 →
隔离执行 → 失败证据回给模型修订 → 停在 turn 上限。循环判定逻辑是
`libs/loom/agent.zio` 的 `agent-run`；回复→源码契约（模型回复的候选提取、
prompt 形状）单点定义在 `libs/loom/candidate.zio`，两个宿主绑定的参考实现
也在那里，由运行方装配：

- **启动器路径**（`tools/groiz run`）：`agent.zio` 把 loom 的参考绑定装配到
  provider 配置与启动器授权上——`host/http-request` 调 OpenAI 兼容接口，
  `host/process-start` 把候选放进 jail 执行，候选以 `zio --emit-framed`
  的单帧 JSON 信封回报结果。需要 Linux namespaces；其他平台执行会诚实拒绝
  （`capability-denied`），循环把该失败当证据继续。
- **Rust 路径**（`grove-app` 的 AgentHost，`cargo test` 覆盖）：绑定由
  Rust 侧装配——模型走 Loom session（测试用脚本化 ModelHost），候选走
  `grove::execution` 沙箱；回复提取用 `libs/loom/candidate.zio` 契约的
  Rust 镜像，两侧案例表逐条对拍。

```sh
# provider 配置：OpenAI 兼容端点，放在授予的读根内（数据根或仓库根）
cat > /tmp/groiz-root/provider.json <<'EOF'
{"baseURL": "https://api.openai.com/v1", "model": "gpt-4o-mini"}
EOF

export GROIZ_TOKEN_READER=reader-1 GROIZ_TOKEN_OPERATOR=operator-1 \
       GROIZ_TOKEN_PUBLISHER=publisher-1 GROIZ_TOKEN_ANNOTATOR=annotator-1
export GROIZ_LLM_API_KEY=sk-...          # 启动器通过 --app-env 授予
export GROIZ_ROOT=/tmp/groiz-root        # 数据根；provider.json 在其下
./tools/groiz run --task "..." \
  --provider-config /tmp/groiz-root/provider.json --max-turns 3
```

候选的执行上限由启动器决定（step ceiling、墙钟、jail），不是候选自己选的；
每次执行的暂存与结果留在数据根 `worker-scratch/agent/` 下作为证据。

## 真实合同

| 检查入口 | 覆盖范围（不表示本次已经执行） |
|---|---|
| `tools/test-zio-http.sh` | 通过启动器起真实服务：路由、动态路径与查询解码、角色授权、幂等/冲突回执、owner 真正执行队列、worker 隔离与否的诚实结果 |
| `tools/test-deployment.sh` | 构建镜像后：控制面可达、无令牌 401、reader 可读、排队任务被 owner 消费、重启后 store 仍回答 |
| `tools/smoke-logic-approval.py` | native `grove-app` 的人工批准边界：受保护区提案被拒、角色隔离、合格候选批准与版本回执；不能代替 Zio 部署入口验收 |
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

- [项目方向](docs/project-direction.md)：研究运行平台、框架沉淀与 Zioo 的边界和近期验收顺序
- [整体设计](docs/self-learning-architecture.md)：运行平台边界、学习闭环、检查点与发布治理
- [交付计划](docs/plans/)：各阶段工作包、依赖与真实验收
- [部署规格](docs/specs/)：运行时、环境与路由合同

Zio 语言、库与工具链文档在 [Zio 仓库](https://github.com/use-zio/zio)。
