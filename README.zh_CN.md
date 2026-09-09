<div align="center">

<img src="./web/public/logo.png" alt="searouter logo" width="132" height="132" />

# searouter

可自行部署的 AI API 网关与模型访问管理系统

[简体中文](./README.zh_CN.md) · [繁體中文](./README.zh_TW.md) · [English](./README.md)

[![License: AGPL-3.0-or-later](https://img.shields.io/badge/license-AGPL--3.0--or--later-brightgreen)](./LICENSE)
[![searouter release](https://img.shields.io/github/v/release/MetastoneCorp/searouter?include_prereleases)](https://github.com/MetastoneCorp/searouter/releases)
[![Images: Huawei Cloud SWR](https://img.shields.io/badge/images-Huawei_Cloud_SWR-blue)](./DEPLOYMENT.md#authenticated-image-deployment)

</div>

searouter 是基于 [New API](https://github.com/QuantumNous/new-api) 独立维护的派生项目，感谢 QuantumNous 和上游贡献者；更早的代码基础来自 [One API](https://github.com/songquanpeng/one-api)（MIT）。本项目及其修改按 **AGPL-3.0-or-later** 授权。

## 📝 项目说明

> [!IMPORTANT]
>
> - 按 AGPL 第 13 条，修改后的版本通过网络为用户提供服务时，应显著向这些用户免费提供实际运行版本的完整对应源码。遵守协议时允许商业使用；软件不提供担保。
> - 使用须遵守各模型/平台条款（如 OpenAI [使用条款](https://openai.com/policies/terms-of-use)）及所在地**法律法规**，禁止违法或滥用。
> - 在中国大陆请遵守生成式人工智能服务备案等要求（如 [《生成式人工智能服务管理暂行办法》](http://www.cac.gov.cn/2023-07/13/c_1690898327029107.htm)），勿向公众提供未按规定完成的生成式 AI 服务。
> - **不作稳定性或服务承诺**：除非你自行或第三方提供支持，否则按基础设施软件自行运维。

## 快速开始

### 从源码构建

需要 Git、OpenSSL、Docker 和 Docker Compose v2。以下密钥只在首次安装时生成，升级时复用现有 `.env`。

```bash
git clone https://github.com/MetastoneCorp/searouter.git
cd searouter

test -e .env || (umask 077; for key in POSTGRES_PASSWORD SESSION_SECRET CRYPTO_SECRET; do
  printf '%s=%s\n' "$key" "$(openssl rand -hex 32)"
done > .env)
docker compose up -d --build
```

访问 `http://localhost:3000` 完成初始化。SQLite 单容器、认证镜像及升级步骤见 [部署指南（中文 / English）](./DEPLOYMENT.md)。

### 认证镜像

官方镜像仓库：`swr.cn-east-3.myhuaweicloud.com/cloud-mdgx/searouter`。拉取需要 SWR 授权；通过 [镜像权限与版本说明](./DEPLOYMENT.md#image-access) 获取可用 tag 或 digest。没有镜像权限也可以从源码自行构建。

## 文档导航

| 用途               | 文档                             |
| ------------------ | -------------------------------- |
| 安装与升级   | [部署指南（中文 / English）](./DEPLOYMENT.md)      |
| 开发与提交修改     | [贡献与致谢（中文 / English）](./CONTRIBUTING.md)    |
| 私密报告安全漏洞   | [安全说明（中文 / English）](./SECURITY.md)        |
| 项目来源与版权声明 | [来源与版权](./NOTICE)          |

[上游 New API 参考文档](https://docs.newapi.pro/zh/docs) 提供接口、供应商和配置说明。这些内容描述上游，应结合实际 searouter 版本验证；本项目部署和发布方式以仓库内文档为准。

## 支持与发布

searouter 的问题和功能建议请提交到 [本仓库 Issues](https://github.com/MetastoneCorp/searouter/issues)，附上提交或镜像 digest、复现步骤。向上游报告问题前，请先在明确版本的 New API 中复现。安全漏洞按 [SECURITY.md](./SECURITY.md) 私密报告。

已发布版本说明见 [searouter Releases](https://github.com/MetastoneCorp/searouter/releases)。源码标签不代表一定存在同名 SWR 镜像，请使用该版本交付说明提供的镜像引用及源码地址。

## 许可证

**AGPL-3.0-or-later** 允许在遵守条款时商业使用。修改后的网络服务应显著向用户免费提供实际运行版本的完整对应源码。软件不提供担保；请保留 [LICENSE](./LICENSE)、[NOTICE](./NOTICE) 和 [第三方声明（含 One API MIT 全文）](./THIRD-PARTY-LICENSES.md#one-api-mit)。
