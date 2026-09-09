# 贡献与致谢 / Contributing to searouter & Acknowledgments

[中文](#中文) · [English](#english)

## 中文

感谢帮助改进 searouter。提交问题或 PR 前，请阅读 [NOTICE](NOTICE) 和 [LICENSE](LICENSE)。本项目的直接上游为 [QuantumNous/new-api](https://github.com/QuantumNous/new-api)，searouter 的问题和修改请先在 [本仓库](https://github.com/MetastoneCorp/searouter)讨论。

### 提交问题

- 提供 searouter 版本或提交、部署方式、数据库类型、复现步骤、预期结果和实际结果。
- 日志、截图和配置中应删除真实 API Key、密码、Cookie、令牌和用户数据。
- 对可在未修改的 New API 中复现的问题，说明使用的上游版本并链接相关 issue；不要把 searouter 特有的问题直接归给上游。
- 安全漏洞按 [SECURITY.md](SECURITY.md) 报告至 `support@metastonecorp.com`，不要在公开 issue 中披露。

### 本地开发与验证

工具版本以 [go.mod](go.mod) 和 [Dockerfile](Dockerfile) 为准：Go 1.24+（`go.mod` 指定工具链 1.24.3）、Bun 1.3.14。Docker 构建当前使用 Go 1.26，与本地最低版本要求不同。以下命令使用全新的开发目录和 SQLite；不要连接生产数据库或复制生产配置。

```bash
git clone https://github.com/MetastoneCorp/searouter.git
cd searouter
git switch -c codex/your-change

cd web
bun install --frozen-lockfile
bun run build
cd ..
go mod download
mkdir -p data
```

终端一，在仓库根目录启动 API（端口 3000）：

```bash
SQL_DSN= LOG_SQL_DSN= REDIS_CONN_STRING= SQLITE_PATH=./data/dev.db go run .
```

终端二，在仓库根目录启动前端：

```bash
cd web
bun run dev
```

访问 Vite 输出的本地地址（通常为 `http://localhost:5173`）完成初始化。开发服务器将 `/api` 等请求代理到 `http://localhost:3000`；若 3000 端口被占用，应同时调整 API 端口和 `web/vite.config.js` 的代理目标。首次 Go 构建前必须生成 `web/dist`，其中包括被嵌入的网页和许可文件。

- 后端修改运行相关包测试，例如 `go test ./service/...`；数据库修改兼容 SQLite、MySQL 和 PostgreSQL，并报告实际验证的数据库及版本。
- 前端修改执行 `cd web && bun run build`，检查相关交互及修改文件的格式。
- 只有修改依赖时才执行 `bun install` 更新 `web/bun.lock`，将依赖声明和锁文件一起提交；普通安装使用 `--frozen-lockfile`。
- 渠道、鉴权、计费或迁移修改提供覆盖实际行为的测试与风险说明。
- 文档或许可修改核查链接、原文及分发包中的声明；无需运行无关测试。

贡献约定见 [AGENTS.md](AGENTS.md)。以上 SQLite 启动验证不代表已验证其他数据库或部署方式。

### Pull request

本仓库提供 Bug、功能建议和 PR 模板，请填写实际结果；未执行的验证明确标注。

1. 说明解决的问题、修改后的行为和验证结果；保持变更范围集中。
2. 保留上游版权、许可和署名。引用或移植第三方代码时提供项目 URL、准确版本或提交、原路径和许可证，并附带需要保留的声明。
3. 对有实质修改的上游文件保留原版权头，并补充可识别的修改者和日期；在 PR 和必要的发布说明中记录修改。
4. 修改分发方式、依赖或界面时，同步核查 [NOTICE](NOTICE) 和 [第三方许可声明](THIRD-PARTY-LICENSES.md) 中的相关要求。
5. 提交前确认没有真实部署凭据、私有配置或敏感数据。

### 贡献的授权

除非某个文件已有明确且兼容的独立授权，你提交的贡献应按 **AGPL-3.0-or-later** 提供，以便与本项目一起修改和分发。提交贡献意味着你有权作出该授权；属于雇主或第三方的内容应先取得相应许可。

贡献者保留自己的版权；本指南不要求将版权转让给维护者，也不授予维护者代表上游或所有贡献者出售闭源授权的权利。新增依赖或复制代码前应确认其授权允许与本项目组合及按预定方式分发。保留第三方原有的许可条款，不把它们全部重新标为 AGPL。

<a id="acknowledgments"></a>

### 致谢

感谢 QuantumNous 和 [New API](https://github.com/QuantumNous/new-api) 贡献者提供网关、协议适配和控制台，感谢 JustSong 和 [One API](https://github.com/songquanpeng/one-api) 贡献者奠定早期 MIT 授权基础。也感谢 [Midjourney-Proxy](https://github.com/novicezk/midjourney-proxy)，以及 Go、React、Gin、GORM、Semi Design、Vite 和其他依赖、工具与翻译的维护者。searouter 由本项目独立维护，上游不为本分支背书。

沿用的 Cherry Studio、Aion UI、北京大学、UCloud、阿里云、IO.NET 合作伙伴鸣谢，以及 JetBrains 开源开发许可证支持，描述的是 New API 的项目关系，不表示这些组织与 searouter 存在合作或赞助关系。

## English

Thank you for helping improve searouter. Before opening an issue or PR, read [NOTICE](NOTICE) and [LICENSE](LICENSE). The direct upstream is [QuantumNous/new-api](https://github.com/QuantumNous/new-api); discuss searouter issues and changes in [this repository](https://github.com/MetastoneCorp/searouter).

### Reporting issues

- Include the searouter version or commit, deployment method, database type, reproduction steps, expected result and actual result.
- Remove real API keys, passwords, cookies, tokens and user data from logs, screenshots and configuration.
- For issues reproducible in unmodified New API, identify the upstream version and link the relevant issue. Do not attribute fork-specific issues directly to upstream.
- Report vulnerabilities privately to `support@metastonecorp.com` following [SECURITY.md](SECURITY.md#english), never in a public issue.

### Local development and verification

Use [go.mod](go.mod) and [Dockerfile](Dockerfile) as the toolchain references: Go 1.24+ (toolchain 1.24.3 in `go.mod`) and Bun 1.3.14. Docker builds currently use Go 1.26, which differs from the local minimum. The following commands use a fresh development checkout and SQLite; do not connect to a production database or copy production configuration.

```bash
git clone https://github.com/MetastoneCorp/searouter.git
cd searouter
git switch -c codex/your-change

cd web
bun install --frozen-lockfile
bun run build
cd ..
go mod download
mkdir -p data
```

In terminal one, start the API from the repository root on port 3000:

```bash
SQL_DSN= LOG_SQL_DSN= REDIS_CONN_STRING= SQLITE_PATH=./data/dev.db go run .
```

In terminal two, start the frontend from the repository root:

```bash
cd web
bun run dev
```

Open the local URL printed by Vite (usually `http://localhost:5173`) to complete setup. The development server proxies `/api` and related requests to `http://localhost:3000`. If port 3000 is occupied, update both the API port and the proxy target in `web/vite.config.js`. Generate `web/dist` before the first Go build; it contains the embedded frontend and legal files.

- For backend changes, run relevant package tests, such as `go test ./service/...`. Database changes must support SQLite, MySQL and PostgreSQL; report the database types and versions actually tested.
- For frontend changes, run `cd web && bun run build`, check the affected interactions and verify formatting of changed files.
- Update `web/bun.lock` with `bun install` only when changing dependencies, and commit the manifest and lockfile together. Use `--frozen-lockfile` for ordinary installations.
- For channel, authentication, billing or migration changes, provide tests covering actual behavior and explain risks.
- For documentation or licensing changes, check links, original notices and notices in distribution artifacts; unrelated tests are unnecessary.

See [AGENTS.md](AGENTS.md) for project conventions. A successful SQLite development run does not establish that other databases or deployment methods were tested.

### Pull requests

The repository provides bug, feature request and PR templates. Record actual results and explicitly identify checks you did not run.

1. Explain the problem, resulting behavior and verification; keep the change focused.
2. Preserve upstream copyright, license and attribution notices. For imported third-party code, provide the project URL, exact version or commit, original path and license, together with required notices.
3. Retain original copyright headers in substantively modified upstream files and identify the modifier and date. Record changes in the PR and release notes where needed.
4. When changing distribution methods, dependencies or interfaces, review the applicable requirements in [NOTICE](NOTICE) and [third-party notices](THIRD-PARTY-LICENSES.md).
5. Confirm that the contribution contains no production credentials, private configuration or sensitive data.

### Contribution licensing

Unless a file has an explicit, compatible separate license, submit contributions under **AGPL-3.0-or-later** so they can be modified and distributed with this project. By contributing, you confirm that you have authority to grant that license; obtain permission for material owned by an employer or third party first.

Contributors retain their copyright. This guide does not require copyright assignment or authorize maintainers to sell closed-source licenses on behalf of upstream or all contributors. Before adding dependencies or copying code, confirm that their terms permit the intended combination and distribution. Preserve third-party terms instead of relabeling all material as AGPL.

<a id="acknowledgments-en"></a>

### Acknowledgments

We thank QuantumNous and the [New API](https://github.com/QuantumNous/new-api) contributors for the gateway, protocol adapters and console; JustSong and the [One API](https://github.com/songquanpeng/one-api) contributors for the earlier MIT-licensed foundation. We also thank [Midjourney-Proxy](https://github.com/novicezk/midjourney-proxy) and the maintainers of Go, React, Gin, GORM, Semi Design, Vite and other dependencies, tools and translations. searouter is independently maintained; upstream does not endorse this fork.

The inherited partner acknowledgments for Cherry Studio, Aion UI, Peking University, UCloud, Alibaba Cloud and IO.NET, and JetBrains' open-source development license support, describe New API's relationships. They do not imply a partnership with or sponsorship of searouter.
