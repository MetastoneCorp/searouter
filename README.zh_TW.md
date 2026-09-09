<div align="center">

<img src="./web/public/logo.png" alt="searouter logo" width="132" height="132" />

# searouter

可自行部署的 AI API 閘道與模型存取管理系統

[简体中文](./README.zh_CN.md) · [繁體中文](./README.zh_TW.md) · [English](./README.md)

[![License: AGPL-3.0-or-later](https://img.shields.io/badge/license-AGPL--3.0--or--later-brightgreen)](./LICENSE)
[![searouter release](https://img.shields.io/github/v/release/MetastoneCorp/searouter?include_prereleases)](https://github.com/MetastoneCorp/searouter/releases)
[![Images: Huawei Cloud SWR](https://img.shields.io/badge/images-Huawei_Cloud_SWR-blue)](./DEPLOYMENT.md#authenticated-image-deployment)

</div>

searouter 是基於 [New API](https://github.com/QuantumNous/new-api) 獨立維護的衍生專案，感謝 QuantumNous 和上游貢獻者；更早的程式碼基礎來自 [One API](https://github.com/songquanpeng/one-api)（MIT）。本專案及其修改依 **AGPL-3.0-or-later** 授權。

## 📝 項目說明

> [!IMPORTANT]
>
> - 依 AGPL 第 13 條，修改後的版本透過網路為使用者提供服務時，應顯著向這些使用者免費提供實際執行版本的完整對應原始碼。遵守協定時允許商業使用；軟體不提供擔保。
> - 使用須遵守各模型／平台條款（如 OpenAI [使用條款](https://openai.com/policies/terms-of-use)）及所在地**法律法規**，禁止違法或濫用。
> - 在中國大陸請遵守生成式人工智慧服務備案等要求（如 [《生成式人工智能服務管理暫行辦法》](http://www.cac.gov.cn/2023-07/13/c_1690898327029107.htm)），勿向公眾提供未按規定完成的生成式 AI 服務。
> - **不作穩定性或服務承諾**：除非你自行或第三方提供支援，否則按基礎設施軟體自行維運。

## 快速開始

### 從原始碼建置

需要 Git、OpenSSL、Docker 和 Docker Compose v2。以下金鑰只在首次安裝時產生，升級時沿用現有 `.env`。

```bash
git clone https://github.com/MetastoneCorp/searouter.git
cd searouter

test -e .env || (umask 077; for key in POSTGRES_PASSWORD SESSION_SECRET CRYPTO_SECRET; do
  printf '%s=%s\n' "$key" "$(openssl rand -hex 32)"
done > .env)
docker compose up -d --build
```

開啟 `http://localhost:3000` 完成初始化。SQLite 單容器、認證映像及升級步驟見 [部署指南（中文 / English）](./DEPLOYMENT.md)。

### 認證映像

官方映像倉庫：`swr.cn-east-3.myhuaweicloud.com/cloud-mdgx/searouter`。拉取需要 SWR 授權；透過 [映像權限與版本說明](./DEPLOYMENT.md#image-access) 取得可用 tag 或 digest。沒有映像權限也可以從原始碼自行建置。

## 文件導覽

| 用途                 | 文件                             |
| -------------------- | -------------------------------- |
| 安裝與升級     | [部署指南（中文 / English）](./DEPLOYMENT.md)      |
| 開發與提交修改       | [貢獻與致謝（中文 / English）](./CONTRIBUTING.md)    |
| 私密報告安全漏洞     | [安全說明（中文 / English）](./SECURITY.md)        |
| 專案來源與版權聲明   | [來源與版權](./NOTICE)          |

[上游 New API 參考文件](https://docs.newapi.pro/zh/docs) 提供介面、供應商和設定說明。這些內容描述上游，應結合實際 searouter 版本驗證；本專案部署和發布方式以倉庫內文件為準。

## 支援與發布

searouter 的問題和功能建議請提交到 [本倉庫 Issues](https://github.com/MetastoneCorp/searouter/issues)，附上提交或映像 digest、重現步驟。向上游報告問題前，請先在明確版本的 New API 中重現。安全漏洞依 [SECURITY.md](./SECURITY.md) 私密報告。

已發布版本說明見 [searouter Releases](https://github.com/MetastoneCorp/searouter/releases)。原始碼標籤不代表一定存在同名 SWR 映像，請使用該版本交付說明提供的映像引用及原始碼位址。

## 授權條款

**AGPL-3.0-or-later** 允許在遵守條款時商業使用。修改後的網路服務應顯著向使用者免費提供實際執行版本的完整對應原始碼。軟體不提供擔保；請保留 [LICENSE](./LICENSE)、[NOTICE](./NOTICE) 和 [第三方聲明（含 One API MIT 全文）](./THIRD-PARTY-LICENSES.md#one-api-mit)。
