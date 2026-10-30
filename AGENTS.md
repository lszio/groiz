# GROIZ 智能体工作规则

GROIZ（仓库名 `groiz`，内部 crate `grove` / `grove-app`）是研究运行平台，第二阶段才是可复用自学习框架。本文只写"改这里要注意什么"；范围与验收顺序见 [docs/project-direction.md](docs/project-direction.md)，机制合同见 [docs/self-learning-architecture.md](docs/self-learning-architecture.md)。

## 前置

- 本仓通过路径依赖指向同级 `../zio`，两个仓库必须并排克隆。改 Zio 的行为时，先在 Zio 仓按它的 `AGENTS.md` 走。
- 设计、当前事实与缺口在 `/home/lszio/Notes/projects/research-and-digital-life/projects/groiz/README.md`；那是 Notes 侧摘要，不是可以替代验收的证据。
- 任务真值以 paca 与本仓 `docs/` 为准；不要在仓库里另建并行清单。

## 入口裁决（最容易错的一点）

| 你要做的事 | 用哪个入口 |
|---|---|
| 改产品行为（CLI/HTTP/队列/评价/发布） | `tools/groiz` → `main.zio`（canonical 入口） |
| 改宿主侧合同、SQLite、评价、发布、训练、隔离 | `native/learning/src`，随后补 `native/app` |
| 本地复现真实执行→评价→门控→批准 | `native/app`（`grove demo --case dual`）目前是唯一跑通全链的路径 |
| 写论文/实验结论 | 都不是；先把 G-R1/G-R2 的缺口补齐 |

**两个执行面读写同一个 `grove.db`，但各自实现合同。** 任何改动都要回答：另一侧是否还认得这个 schema 和这些行？`main.zio` 的命令当前在 `compare/select/approve` 上是渲染层，不产生真实评价或发布记录——不要用它的输出去支撑实验结论。

## 必须保持的不变量

- **授权只在启动器**：数据根、tensor 后端、worker 脚本/解释器、jail 只读挂载、可读环境变量名（`--app-env`）、令牌角色。应用侧与候选代码不能自行扩大。
- **候选不扩权**：候选不能改评价器、真值、预算账本、隔离边界，不能提供 shell 命令或任意 Python 源码。
- **三个状态不可合并**：Candidate、Evaluation、Publication。指针切换必须带 `expected_version`，冲突返回 `conflict`。
- **评价绑定制品**：任何指标都要写明 snapshot digest + protocol id + 数据版本 + 种子；非有限值拒收，超时/崩溃记最差分而不是缩小分母。
- **holdout 预算不可 fork 绕过**：`consume_acceptance_budget` 沿谱系继承。
- **失败要诚实**：缺隔离、缺后端、缺 namespace 一律显式 `backend-failed`/skip，不回退成"完整宿主权限"或伪造通过。

## 代码习惯

- 代码即数据：业务层优先 Zio，可信边界（事务、进程、隔离、制品）留在 Rust 宿主。
- `ponytail:` 注释标记的是**已知缩水的占位路径**。碰到它要么补实现并删注释，要么在文档里保留为缺口；不要默默把它当成已完成能力引用。
- 训练 worker 走 NDJSON 控制帧 + 制品引用，张量不进消息；`stdout` 只放协议、`stderr` 放限量日志。
- 新增表/字段先在 Rust 侧 `store.rs` 落地，再决定 Zio 侧是否镜像；不要只在 `store.zio` 加表。

## 验证

| 检查 | 覆盖 | 不覆盖 |
|---|---|---|
| `cargo test --workspace` | 库与应用合同（缺 namespace/`.venv` 时显式 skip） | 真实部署入口 |
| `tools/test-zio-http.sh` | 通过启动器起真实服务：路由、角色、幂等/冲突、owner 消费 | 学习闭环正确性 |
| `tools/test-deployment.sh` | 镜像构建后的控制面、401、排队消费、重启存活 | 程序学习 |
| `tools/smoke-logic-approval.py` | native 批准边界 | Zio 部署入口 |
| `./target/debug/grove demo --case dual` | 真实训练→评价→门控→人工批准→新版本指针 | Zio 侧同等能力 |

改完后至少跑与改动面直接对应的那一行；声称"闭环"必须附上真实命令与输出，而不是 `cargo test` 通过。

## 文档同步

- 范围与验收顺序改 `docs/project-direction.md`；机制合同改 `docs/self-learning-architecture.md`；运行/部署现状改 `README.md`。
- 历史计划 `docs/plans/` 保留原日期与证据，不重标完成状态。
- 任何"已完成"表述必须落到上表某个检查入口上，否则写成缺口。
