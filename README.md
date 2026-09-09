<div align="center">

<img src="./web/public/logo.png" alt="searouter logo" width="132" height="132" />

# searouter

Self-hosted AI API gateway and model access management

[简体中文](./README.zh_CN.md) · [繁體中文](./README.zh_TW.md) · [English](./README.md)

[![License: AGPL-3.0-or-later](https://img.shields.io/badge/license-AGPL--3.0--or--later-brightgreen)](./LICENSE)
[![searouter release](https://img.shields.io/github/v/release/MetastoneCorp/searouter?include_prereleases)](https://github.com/MetastoneCorp/searouter/releases)
[![Images: Huawei Cloud SWR](https://img.shields.io/badge/images-Huawei_Cloud_SWR-blue)](./DEPLOYMENT.md#authenticated-image-deployment-en)

</div>

searouter is an independently maintained derivative of [New API](https://github.com/QuantumNous/new-api), developed by QuantumNous and contributors. Its earlier lineage includes [One API](https://github.com/songquanpeng/one-api) (MIT). This project and its modifications use **AGPL-3.0-or-later**.

## 📝 Project Description

> [!IMPORTANT]
>
> - For a modified network service, prominently offer its users the complete Corresponding Source of the version actually running, free of charge, under AGPL section 13. Commercial use is allowed subject to the license. The software comes without warranty.
> - Use only in line with provider terms (e.g. OpenAI [Terms of Use](https://openai.com/policies/terms-of-use)) and **applicable law**. No illegal or abusive use.
> - In China, follow registration and compliance rules for generative AI services (e.g. [《生成式人工智能服务管理暂行办法》](http://www.cac.gov.cn/2023-07/13/c_1690898327029107.htm)); do not offer unregistered public generative AI services where prohibited.
> - No warranty: treat this as **self-supported** infrastructure unless you arrange your own support.

## Quick start

### SeaRouter Local Build

Requires Git, OpenSSL, Docker and Docker Compose v2. For a new installation, generate credentials once; preserve the existing `.env` for upgrades.

```bash
git clone https://github.com/MetastoneCorp/searouter.git
cd searouter

test -e .env || (umask 077; for key in POSTGRES_PASSWORD SESSION_SECRET CRYPTO_SECRET; do
  printf '%s=%s\n' "$key" "$(openssl rand -hex 32)"
done > .env)
docker compose up -d --build
```

Open `http://localhost:3000` to complete setup. For SQLite, authenticated images and upgrades, see [DEPLOYMENT.md](./DEPLOYMENT.md#english).

### Authenticated images

Official image repository: `swr.cn-east-3.myhuaweicloud.com/cloud-mdgx/searouter`. Pulling requires SWR authorization. Obtain an available tag or digest through the [image access instructions](./DEPLOYMENT.md#image-access-en); without registry access, build from source.

## Documentation

| Purpose                                 | Document                                         |
| --------------------------------------- | ------------------------------------------------ |
| Install and upgrade       | [Deployment (中文 / English)](./DEPLOYMENT.md#english)                    |
| Develop and submit changes              | [Contributing and acknowledgments (中文 / English)](./CONTRIBUTING.md#english)                |
| Report vulnerabilities privately        | [Security (中文 / English)](./SECURITY.md#english)                        |
| Project lineage and copyright          | [Notices](./NOTICE)                             |

[New API reference documentation](https://docs.newapi.pro/en/docs) covers upstream APIs, providers and configuration. It is upstream documentation; validate examples against your searouter release. The local deployment and release guides describe this fork.

## Support and releases

Report searouter bugs and feature requests in [this repository’s Issues](https://github.com/MetastoneCorp/searouter/issues). Include the commit or image digest and reproduction steps. Reproduce upstream issues on an identified New API version before reporting them upstream. Security reports follow [SECURITY.md](./SECURITY.md#english).

Check [searouter Releases](https://github.com/MetastoneCorp/searouter/releases) for published release notes. A source tag alone does not guarantee a matching SWR image; use the image reference and source information supplied for that release.

## License

**AGPL-3.0-or-later** permits commercial use subject to its terms. Modified network services must prominently offer their users the complete corresponding source of the running version at no charge. The software comes without warranty. Preserve [LICENSE](./LICENSE), [NOTICE](./NOTICE) and [third-party notices, including the full One API MIT text](./THIRD-PARTY-LICENSES.md#one-api-mit).
