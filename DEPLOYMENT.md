# searouter 部署 / Deployment

[中文](#中文) · [English](#english)

## 中文

searouter 源码按 AGPL-3.0-or-later 提供。官方预构建镜像使用华为云 SWR 认证拉取；无镜像权限也可自行构建。镜像仓库为 `swr.cn-east-3.myhuaweicloud.com/cloud-mdgx/searouter`，可用版本或 digest 由维护者提供。

### 从源码构建

需要 Git、OpenSSL、Docker 和 Docker Compose v2。前端和 Go 工具链在 Dockerfile 中安装；前端使用已提交的 `web/bun.lock` 安装固定依赖。

```bash
git clone https://github.com/MetastoneCorp/searouter.git
cd searouter

# 仅首次安装生成密钥；重启和升级时保留已有凭据。
test -e .env || (umask 077; for key in POSTGRES_PASSWORD SESSION_SECRET CRYPTO_SECRET; do
  printf '%s=%s\n' "$key" "$(openssl rand -hex 32)"
done > .env)

docker compose up -d --build
```

访问 `http://localhost:3000` 完成初始化。默认栈使用 PostgreSQL 和 Redis；数据卷名与镜像部署方式一致。在同一目录运行命令以复用 Compose 项目及数据卷。数据库密码应使用上述 URL 安全的随机值。请妥善保管 `.env`，重启和升级时保留它；缺少必填值时补齐配置，不要覆盖或重新生成现有密钥。更换数据库密码或加密密钥需要单独迁移。

<a id="authenticated-image-deployment"></a>

### 华为云认证镜像

<a id="image-access"></a>

#### 权限与版本

向 [support@metastonecorp.com](mailto:support@metastonecorp.com) 申请镜像读取权限，并说明所需版本和运行平台；维护者通过私密渠道安排账号授权。不要发送密码、访问密钥或生产 `.env`。

查看 [searouter Releases](https://github.com/MetastoneCorp/searouter/releases) 中列出的 SWR tag / digest 和对应源码地址；如果没有发布记录或所需平台的信息，请通过上述邮箱确认可用版本。不要假定存在 `latest` 或与源码标签同名的镜像。

#### 拉取与启动

1. 克隆仓库，按“从源码构建”中的密钥初始化步骤准备 `.env`，无需执行源码构建命令。在 `.env` 中添加维护者提供的完整镜像引用，优先使用不可变 digest。以下仅为格式示例，不能直接拉取：

   ```dotenv
   SEAROUTER_IMAGE=swr.cn-east-3.myhuaweicloud.com/cloud-mdgx/searouter@sha256:YOUR_IMAGE_DIGEST
   ```

2. 在本机登录 SWR。使用实际区域的仓库域名及 SWR 提供的用户名；Docker 会交互提示密码，不要把凭据写入仓库、Compose 或截图：

   ```bash
   docker login swr.cn-east-3.myhuaweicloud.com --username YOUR_SWR_USERNAME
   ```

   账号需有对应私有镜像的读取权限。参考 [华为云 SWR 拉取说明](https://support.huaweicloud.com/usermanual-swr/swr_01_0017.html)。

3. 单独使用镜像配置，它不包含源码构建步骤。不要将两个 Compose 文件叠加：

   ```bash
   docker compose -f docker-compose.image.yml pull
   docker compose -f docker-compose.image.yml up -d --no-build
   docker compose -f docker-compose.image.yml ps
   ```

4. 打开服务的“开源声明 · 源码”，确认能够免费取得实际运行版本的完整对应源码。源码入口应独立可用，网络用户不应需要私有 SWR 权限。

#### 拉取问题排查

| 现象 | 检查方式 |
| --- | --- |
| 登录失败、`unauthorized` | 核对域名为 `swr.cn-east-3.myhuaweicloud.com`、用户名和凭据是否有效；凭据过期时重新获取并登录。 |
| 登录成功但拉取 `denied` / `forbidden` | 登录不等于具有镜像读取权限，请联系支持邮箱核查 `cloud-mdgx/searouter` 的授权。 |
| `manifest unknown` / `not found` | 核对完整仓库路径、tag / digest 及发布记录；服务也可能隐藏了无权访问的资源，需由维护者确认。 |
| `no matching manifest` | 所选镜像可能不包含当前 CPU/操作系统平台，向维护者确认支持的平台或从源码构建。 |

报告问题时附上脱敏后的错误文本和所需版本；不要粘贴带密码的登录命令。

### SQLite 单容器

在仓库根目录先构建本地镜像；也可将下方 `searouter:local` 替换为已认证拉取的实际镜像引用。默认 Compose 的 PostgreSQL 数据不会自动转换为 SQLite。

```bash
docker build -t searouter:local .
docker run --name searouter -d --restart unless-stopped \
  -p 3000:3000 \
  -e TZ=Asia/Shanghai \
  -v "$(pwd)/data:/data" \
  searouter:local
```

### 升级与版本记录

升级前备份数据库、数据卷和 `.env`，阅读版本变更及迁移要求。使用镜像部署时，在 `.env` 更新到已审核版本的 `SEAROUTER_IMAGE`，再执行上述 `pull`、`up` 命令。保留原数据卷与密钥；`down -v` 会删除数据卷，不应作为升级步骤。

## English

searouter source is available under AGPL-3.0-or-later. Official prebuilt images require authorized Huawei Cloud SWR access; you can build from source without it. The registry repository is `swr.cn-east-3.myhuaweicloud.com/cloud-mdgx/searouter`. Obtain an available release tag or digest from the maintainer.

### Build from source

Requires Git, OpenSSL, Docker and Docker Compose v2. The Dockerfile installs the frontend and Go toolchains; frontend dependencies are pinned by the committed `web/bun.lock`.

```bash
git clone https://github.com/MetastoneCorp/searouter.git
cd searouter

# New installations only: preserve existing credentials on restarts/upgrades.
test -e .env || (umask 077; for key in POSTGRES_PASSWORD SESSION_SECRET CRYPTO_SECRET; do
  printf '%s=%s\n' "$key" "$(openssl rand -hex 32)"
done > .env)

docker compose up -d --build
```

Open `http://localhost:3000` to complete setup. The default stack uses PostgreSQL and Redis, with the same volume names as image deployments. Run commands from the same directory to reuse the Compose project and its volumes. Use the URL-safe random database password generated above. Keep `.env` private and preserve it across restarts and upgrades; fill in missing settings without overwriting existing credentials or regenerating keys. Changing database passwords or encryption keys requires a separate migration.

<a id="authenticated-image-deployment-en"></a>

### Authenticated image deployment

<a id="image-access-en"></a>

#### Access and versions

Request image read access at [support@metastonecorp.com](mailto:support@metastonecorp.com), specifying the desired release and platform. The maintainer will arrange authorization privately. Never send passwords, access keys or production `.env` files.

Check [searouter Releases](https://github.com/MetastoneCorp/searouter/releases) for published SWR tags / digests and matching source links. If a release record or platform is unavailable, confirm available versions by email. Do not assume that a `latest` image or an image matching every source tag exists.

#### Pull and start

1. Clone the repository and prepare `.env` using the credential initialization step under “Build from source”; you do not need to run the source build. Add the actual image reference supplied by the maintainer, preferably an immutable digest. This is a format example only and cannot be pulled as written:

   ```dotenv
   SEAROUTER_IMAGE=swr.cn-east-3.myhuaweicloud.com/cloud-mdgx/searouter@sha256:YOUR_IMAGE_DIGEST
   ```

2. Log in to SWR locally using the registry domain for the actual region and the supplied SWR username. Docker prompts for the password; keep credentials out of the repository, Compose files and screenshots:

   ```bash
   docker login swr.cn-east-3.myhuaweicloud.com --username YOUR_SWR_USERNAME
   ```

   The account needs read access to the private image. See the [Huawei Cloud SWR pull instructions (Chinese)](https://support.huaweicloud.com/usermanual-swr/swr_01_0017.html).

3. Use the image configuration on its own. It contains no source build; do not combine the two Compose files:

   ```bash
   docker compose -f docker-compose.image.yml pull
   docker compose -f docker-compose.image.yml up -d --no-build
   docker compose -f docker-compose.image.yml ps
   ```

4. Open the service's “开源声明 · 源码” (open-source notices and source) link and verify that it offers the complete source of the running version at no charge. Source access must work independently; service users must not need private SWR permissions.

#### Pull troubleshooting

| Symptom | Check |
| --- | --- |
| Login fails or returns `unauthorized` | Verify the registry is `swr.cn-east-3.myhuaweicloud.com`, and the username and credentials are valid. Renew expired credentials and log in again. |
| Login succeeds but pulling returns `denied` / `forbidden` | Logging in does not grant image read access. Ask the support address to verify authorization for `cloud-mdgx/searouter`. |
| `manifest unknown` / `not found` | Verify the full repository path, tag / digest and release record. The service may also conceal unauthorized resources; ask the maintainer to confirm. |
| `no matching manifest` | The image may not support your CPU/operating-system platform. Confirm supported platforms with the maintainer or build from source. |

When reporting a problem, include redacted error text and the desired release; never paste login commands containing passwords.

### Standalone SQLite

Build a local image from the repository root, or substitute an authorized image you have already pulled for `searouter:local` below. Existing PostgreSQL data from the default Compose stack is not automatically migrated to SQLite.

```bash
docker build -t searouter:local .
docker run --name searouter -d --restart unless-stopped \
  -p 3000:3000 \
  -e TZ=Asia/Shanghai \
  -v "$(pwd)/data:/data" \
  searouter:local
```

### Upgrades and release records

Back up the database, volumes and `.env`, and review release changes and migration requirements. For image deployments, update `SEAROUTER_IMAGE` in `.env` to the reviewed version and repeat the `pull` and `up` commands above. Preserve volumes and keys; `down -v` deletes volumes and must not be used as an upgrade step.
