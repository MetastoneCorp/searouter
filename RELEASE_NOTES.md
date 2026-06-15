# SeaRouter Release Notes

> SeaRouter 是一款企业级 LLM Gateway 与 AI 资产管理系统，提供统一的 OpenAI 兼容 API 接口。

---

## v1.1.0（2026-06-16）— 全新前端 UI

按新设计（Figma「MetaStone AI 系统开发 UI 设计」）对前端进行整体重构，统一品牌蓝（#015BBA）tech-utility 视觉风格。

- **访问域名（更新）**：<https://searouter.metastonecorp.com/>

### 全局
- 全站 UI 按新设计整体重构。
- 支持语言精简为 **英文 / 简体中文 / 繁体中文**（移除 fr/ja/ru/vi）。
- 自托管字体：品牌字标 **Roboto** + 正文 **Noto Sans SC**，跨平台渲染一致、对齐设计稿字形。
- 品牌 logo 与 favicon 更新为新设计图标。
- 顶栏固定磨砂背景，滚动时始终置顶。

### 首页（按 Figma 100% 还原）
- **Hero 双图轮播**：机器人主视觉 +「解锁智能业务天花板」/ AI 云朵主视觉 +「统一云端，守护边缘」，自动切换 + 圆点手动切换；主视觉采用 4x 高清 WebP。
- 数据条、快速开始、客户端配置示例、合作伙伴、核心特性、为什么选择、方案对比、引言、CTA、页脚 全部按设计还原（字号 / 字重 / 行高 / 间距 / 配色 / 图标 / 文案）。

### 操练场（Playground）
- 移植全新架构：Shell 布局、会话 turn、设置侧拉、调试抽屉、消息编辑、推理展开、starter chips。
- 支持**未登录使用 API Key** 调用；改为公开路由 `/playground` 并加入顶栏导航。

### 控制台与其它页面
- 数据看板、令牌管理、使用日志、任务日志、钱包管理、个人设置 按新设计重构。
- 模型广场重构；新增「模型详情」「模型 API」独立路由页。
- 登录 / 注册 / 重置 页重构（左侧插画大图 + 居中卡片，认证页隐藏 App 顶栏）。

### 主要修复
- 操练场用户消息白底白字看不清。
- 顶栏 logo 多余背景、导航顺序（模型广场 / 操练场）。
- 方案对比表分割线与 ✗ 对齐、数据条与快速开始间距。
- 首页多处文案与图标与 Figma 对齐。

---

## v1.0.0（2026-03-16）— 首次发布

SeaRouter 是一款企业级 LLM Gateway 和 AI 资产管理系统，提供统一的 OpenAI 兼容 API 接口，支持 40+ AI 服务商以及企业私有模型，具备智能路由、计费管理、企业级用户监控、安全等功能。SeaRouter 接通 SeaBed MaaS 提供强大的模型接入能力，同时满足企业本地化部署与 Cloud MaaS 的需求。

### 核心功能特性
- **多模型支持**：支持 OpenAI、Claude、Gemini、DeepSeek 等 40+ AI 服务商以及企业私有模型。
- **智能路由**：渠道加权随机、失败自动重试、用户级模型限流。
- **计费系统**：按量计费、缓存计费支持。
- **权限管理**：Token 分组、模型限制、用户管理。
- **多语言**：支持中 / 英 / 日 / 法 / 俄 / 越 6 种语言。
- **文档系统**：新增用户文档与管理员文档，支持按角色权限查看对应文档。

### 开放注册（元石计算全体员工）
- 统一注册与登录入口：<https://searouter.nutsflush.com/>
- 首次注册可获得 **1 亿 token 额度**，并免费使用公司当前所有自 Host 模型：`gpt-oss:120b`、`qwen3.5-122b-a10b`、`MinMax-2.5`。
- **VIP group** 可访问 `GLM-5`、`Anthropic Claude Sonnet/Opus 4.6`、`GPT5.4`。
- 当前所有用户均为 default group，需要升级 VIP 的用户按需加入——请统一到维明处汇总需求。
- 注册后使用 SeaRouter GetKey 的手册：<https://searouter-docs.nutsflush.com/guide/user-guide/register-login.html>
