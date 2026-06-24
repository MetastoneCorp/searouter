/*
Copyright (C) 2025 QuantumNous

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program. If not, see <https://www.gnu.org/licenses/>.

For commercial licensing, please contact support@quantumnous.com
*/

import React, { useState, useMemo, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useModelPricingData } from '../../hooks/model-pricing/useModelPricingData';
import { StatusContext } from '../../context/Status';
import { copy, showSuccess } from '../../helpers';

/* ---- 返回箭头 SVG ---- */
const BackIcon = () => (
  <svg
    width='20'
    height='20'
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth='2'
    strokeLinecap='round'
    strokeLinejoin='round'
  >
    <path d='M19 12H5M11 18l-6-6 6-6' />
  </svg>
);

/* ---- 复制图标 ---- */
const CopyIcon = () => (
  <svg
    width='15'
    height='15'
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth='2'
    strokeLinecap='round'
    strokeLinejoin='round'
  >
    <rect x='9' y='9' width='13' height='13' rx='2' ry='2' />
    <path d='M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1' />
  </svg>
);

/* ---- 勾选图标 ---- */
const CheckIcon = () => (
  <svg
    width='15'
    height='15'
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth='2.5'
    strokeLinecap='round'
    strokeLinejoin='round'
  >
    <path d='M20 6L9 17l-5-5' />
  </svg>
);

/* ---- 加载骨架屏 ---- */
const ApiSkeleton = () => (
  <div className='detail-wrap' style={{ opacity: 0.6 }}>
    <div
      style={{
        height: 32,
        width: 240,
        background: 'var(--surface-2)',
        borderRadius: 8,
        marginBottom: 16,
      }}
    />
    <div
      style={{
        height: 18,
        width: 360,
        background: 'var(--surface-2)',
        borderRadius: 6,
        marginBottom: 12,
      }}
    />
    <div
      style={{
        height: 160,
        background: 'var(--surface-2)',
        borderRadius: 10,
      }}
    />
  </div>
);

/* ---- 空态 ---- */
const NotFoundState = ({ modelName, onBack, t }) => (
  <div className='detail-wrap' style={{ textAlign: 'center', paddingTop: 80 }}>
    <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
    <div
      style={{
        fontSize: 18,
        fontWeight: 600,
        marginBottom: 8,
        color: 'var(--ink)',
      }}
    >
      {t('找不到模型')}
    </div>
    <div style={{ color: 'var(--ink-2)', marginBottom: 28 }}>
      {t('模型 "{{name}}" 不存在或已下线', { name: modelName })}
    </div>
    <button className='btn btn-primary' onClick={onBack}>
      {t('返回模型广场')}
    </button>
  </div>
);

/* ---- 代码块组件（带复制按钮） ---- */
const CodeBlock = ({ code, lang }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const ok = await copy(code);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div style={{ position: 'relative' }}>
      <div
        className='codeblock'
        style={{ whiteSpace: 'pre', overflowX: 'auto', fontSize: 13 }}
      >
        {code}
      </div>
      <button
        onClick={handleCopy}
        style={{
          position: 'absolute',
          top: 10,
          right: 10,
          background: 'rgba(255,255,255,0.08)',
          border: '1px solid rgba(255,255,255,0.15)',
          borderRadius: 6,
          color: copied ? '#8FD18B' : '#8FA4C0',
          cursor: 'pointer',
          padding: '4px 8px',
          display: 'flex',
          alignItems: 'center',
          gap: 5,
          fontSize: 12,
          fontFamily: 'inherit',
        }}
      >
        {copied ? <CheckIcon /> : <CopyIcon />}
        {lang && <span>{lang}</span>}
      </button>
    </div>
  );
};

/* ---- 主页面组件 ---- */
const ModelApiPage = () => {
  const { t } = useTranslation();
  const { modelName } = useParams();
  const navigate = useNavigate();
  const [statusState] = useContext(StatusContext);
  const [activeTab, setActiveTab] = useState('curl');

  const serverAddress =
    statusState?.status?.server_address || window.location.origin;

  const decodedName = useMemo(() => {
    try {
      return decodeURIComponent(modelName || '');
    } catch {
      return modelName || '';
    }
  }, [modelName]);

  const { models, loading, endpointMap } = useModelPricingData();

  const modelData = useMemo(() => {
    if (models && models.length > 0) {
      return models.find((m) => m.model_name === decodedName) || null;
    }
    return null;
  }, [models, decodedName]);

  const isLoaded = !loading;
  const notFound = isLoaded && !modelData;

  const handleBack = () => {
    if (window.history.length > 2) {
      navigate(-1);
    } else {
      navigate('/pricing/model/' + encodeURIComponent(decodedName));
    }
  };

  /* ---- 支持的端点列表 ---- */
  const supportedEndpoints = useMemo(() => {
    if (!modelData) return [];
    const types = modelData.supported_endpoint_types || [];
    return types.map((type) => {
      const info = endpointMap[type] || {};
      let path = info.path || '';
      if (path.includes('{model}')) {
        path = path.replaceAll('{model}', modelData.model_name || '');
      }
      const method = info.method || 'POST';
      return { type, path, method };
    });
  }, [modelData, endpointMap]);

  /* ---- 代码示例 ---- */
  const baseUrl = `${serverAddress}/v1`;
  const mn = decodedName;

  // 取第一个 chat/completions 端点，若无则取第一个可用端点路径
  const chatPath =
    supportedEndpoints.find(
      (ep) => ep.path && ep.path.includes('chat/completions'),
    )?.path ||
    supportedEndpoints.find((ep) => ep.path)?.path ||
    'v1/chat/completions';

  const curlExample = `curl ${serverAddress}/${chatPath} \\
  -H "Authorization: Bearer $SEAROUTER_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "${mn}",
    "messages": [{"role": "user", "content": "Hello!"}]
  }'`;

  const pythonExample = `from openai import OpenAI

client = OpenAI(
    base_url="${baseUrl}",
    api_key="sk-your-api-key",
)

resp = client.chat.completions.create(
    model="${mn}",
    messages=[{"role": "user", "content": "Hello!"}],
)
print(resp.choices[0].message.content)`;

  const jsExample = `import OpenAI from "openai";

const client = new OpenAI({
  baseURL: "${baseUrl}",
  apiKey: "sk-your-api-key",
});

const resp = await client.chat.completions.create({
  model: "${mn}",
  messages: [{ role: "user", content: "Hello!" }],
});
console.log(resp.choices[0].message.content);`;

  const responseExample = `{
  "id": "chatcmpl-xxxxxxxx",
  "object": "chat.completion",
  "model": "${mn}",
  "choices": [{
    "index": 0,
    "message": {
      "role": "assistant",
      "content": "Hello! How can I help you today?"
    },
    "finish_reason": "stop"
  }],
  "usage": {
    "prompt_tokens": 10,
    "completion_tokens": 12,
    "total_tokens": 22
  }
}`;

  /* ---- 代码示例 tabs ---- */
  const codeTabs = [
    { key: 'curl', label: 'cURL', code: curlExample },
    { key: 'python', label: 'Python', code: pythonExample },
    { key: 'javascript', label: 'JavaScript', code: jsExample },
  ];

  /* ---- 加载中 ---- */
  if (loading) {
    return (
      <div className='plaza-shell'>
        <div className='detail-wrap'>
          <ApiSkeleton />
        </div>
      </div>
    );
  }

  /* ---- 找不到模型 ---- */
  if (notFound) {
    return (
      <div className='plaza-shell'>
        <NotFoundState modelName={decodedName} onBack={handleBack} t={t} />
      </div>
    );
  }

  return (
    <div className='plaza-shell'>
      <div className='detail-wrap'>
        {/* 头部 */}
        <div className='detail-head'>
          <button
            className='detail-back'
            onClick={handleBack}
            title={t('返回详情页')}
          >
            <BackIcon />
          </button>

          <span className='detail-title'>
            {mn} · {t('API 调用说明')}
          </span>

          <div className='detail-actions'>
            <button
              className='btn btn-ghost'
              onClick={() =>
                navigate('/pricing/model/' + encodeURIComponent(decodedName))
              }
            >
              {t('模型详情')}
            </button>
            <button
              className='btn btn-primary'
              onClick={() => navigate('/console/playground')}
            >
              {t('立即体验')}
            </button>
          </div>
        </div>

        {/* ---- 区块1：API Key ---- */}
        <div className='dsec'>
          <h4>{t('API Key')}</h4>
          <p>
            {t('使用令牌管理页创建或获取 API Key，用于鉴权。')}{' '}
            <a className='lk' href='/console/token'>
              {t('前往令牌管理')}
            </a>
          </p>
        </div>

        {/* ---- 区块2：Base URL ---- */}
        <div className='dsec'>
          <h4>{t('Base URL')}</h4>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              background: 'var(--surface-2)',
              border: '1px solid var(--border-2)',
              borderRadius: 8,
              padding: '10px 14px',
              fontFamily: 'var(--mono)',
              fontSize: 14,
              color: 'var(--ink)',
              maxWidth: 600,
            }}
          >
            <span style={{ flex: 1 }}>{baseUrl}</span>
            <button
              className='api-copy-btn'
              onClick={async () => {
                const ok = await copy(baseUrl);
                if (ok) showSuccess(t('已复制到剪切板'));
              }}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--ink-2)',
                display: 'flex',
                alignItems: 'center',
                padding: 4,
              }}
            >
              <CopyIcon />
            </button>
          </div>
        </div>

        {/* ---- 区块3：支持端点 ---- */}
        {supportedEndpoints.length > 0 && (
          <div className='dsec'>
            <h4>{t('支持端点')}</h4>
            {supportedEndpoints.map((ep, i) => (
              <div key={i} className='endpoint-row'>
                <span className='ep-name'>{ep.type}：</span>
                {ep.path && <code>{ep.path}</code>}
                {ep.path && (
                  <span
                    style={{
                      fontSize: 12,
                      color: 'var(--ink-3)',
                      fontFamily: 'var(--mono)',
                    }}
                  >
                    {ep.method}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}

        {/* ---- 区块4：请求示例（多语言 tabs） ---- */}
        <div className='dsec'>
          <h4>{t('请求示例')}</h4>
          {/* Tab 切换 */}
          <div
            className='detail-tabs'
            style={{
              marginBottom: 16,
              borderBottom: '1px solid var(--border)',
            }}
          >
            {codeTabs.map((tab) => (
              <button
                key={tab.key}
                className={activeTab === tab.key ? 'on' : ''}
                onClick={() => setActiveTab(tab.key)}
              >
                {tab.label}
              </button>
            ))}
          </div>
          {codeTabs.map((tab) =>
            activeTab === tab.key ? (
              <CodeBlock key={tab.key} code={tab.code} lang={tab.label} />
            ) : null,
          )}
        </div>

        {/* ---- 区块5：响应示例 ---- */}
        <div className='dsec'>
          <h4>{t('响应示例')}</h4>
          <CodeBlock code={responseExample} lang='JSON' />
        </div>

        {/* ---- 区块6：请求参数说明 ---- */}
        <div className='dsec'>
          <h4>{t('请求参数')}</h4>
          <table className='tbl' style={{ width: '100%', maxWidth: 900 }}>
            <thead>
              <tr>
                <th style={{ width: 160 }}>{t('参数名')}</th>
                <th style={{ width: 100 }}>{t('类型')}</th>
                <th style={{ width: 80 }}>{t('必填')}</th>
                <th>{t('说明')}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <code
                    style={{
                      fontFamily: 'var(--mono)',
                      background: 'var(--surface-2)',
                      padding: '2px 6px',
                      borderRadius: 4,
                      fontSize: 13,
                    }}
                  >
                    model
                  </code>
                </td>
                <td
                  style={{
                    color: 'var(--ink-2)',
                    fontFamily: 'var(--mono)',
                    fontSize: 13,
                  }}
                >
                  string
                </td>
                <td>
                  <span className='tag' style={{ fontSize: 12 }}>
                    {t('是')}
                  </span>
                </td>
                <td style={{ color: 'var(--ink)', fontSize: 14 }}>
                  {t('模型名称，本模型填写')}{' '}
                  <code
                    style={{
                      fontFamily: 'var(--mono)',
                      background: 'var(--surface-2)',
                      padding: '2px 6px',
                      borderRadius: 4,
                      fontSize: 13,
                    }}
                  >
                    {mn}
                  </code>
                </td>
              </tr>
              <tr>
                <td>
                  <code
                    style={{
                      fontFamily: 'var(--mono)',
                      background: 'var(--surface-2)',
                      padding: '2px 6px',
                      borderRadius: 4,
                      fontSize: 13,
                    }}
                  >
                    messages
                  </code>
                </td>
                <td
                  style={{
                    color: 'var(--ink-2)',
                    fontFamily: 'var(--mono)',
                    fontSize: 13,
                  }}
                >
                  array
                </td>
                <td>
                  <span className='tag' style={{ fontSize: 12 }}>
                    {t('是')}
                  </span>
                </td>
                <td style={{ color: 'var(--ink)', fontSize: 14 }}>
                  {t(
                    '对话消息列表，每条包含 role（user/assistant/system）和 content',
                  )}
                </td>
              </tr>
              <tr>
                <td>
                  <code
                    style={{
                      fontFamily: 'var(--mono)',
                      background: 'var(--surface-2)',
                      padding: '2px 6px',
                      borderRadius: 4,
                      fontSize: 13,
                    }}
                  >
                    stream
                  </code>
                </td>
                <td
                  style={{
                    color: 'var(--ink-2)',
                    fontFamily: 'var(--mono)',
                    fontSize: 13,
                  }}
                >
                  boolean
                </td>
                <td>
                  <span className='tag gray' style={{ fontSize: 12 }}>
                    {t('否')}
                  </span>
                </td>
                <td style={{ color: 'var(--ink)', fontSize: 14 }}>
                  {t('是否流式返回，默认 false')}
                </td>
              </tr>
              <tr>
                <td>
                  <code
                    style={{
                      fontFamily: 'var(--mono)',
                      background: 'var(--surface-2)',
                      padding: '2px 6px',
                      borderRadius: 4,
                      fontSize: 13,
                    }}
                  >
                    temperature
                  </code>
                </td>
                <td
                  style={{
                    color: 'var(--ink-2)',
                    fontFamily: 'var(--mono)',
                    fontSize: 13,
                  }}
                >
                  number
                </td>
                <td>
                  <span className='tag gray' style={{ fontSize: 12 }}>
                    {t('否')}
                  </span>
                </td>
                <td style={{ color: 'var(--ink)', fontSize: 14 }}>
                  {t('采样温度，范围 0–2，值越高输出越随机，默认 1')}
                </td>
              </tr>
              <tr>
                <td>
                  <code
                    style={{
                      fontFamily: 'var(--mono)',
                      background: 'var(--surface-2)',
                      padding: '2px 6px',
                      borderRadius: 4,
                      fontSize: 13,
                    }}
                  >
                    max_tokens
                  </code>
                </td>
                <td
                  style={{
                    color: 'var(--ink-2)',
                    fontFamily: 'var(--mono)',
                    fontSize: 13,
                  }}
                >
                  integer
                </td>
                <td>
                  <span className='tag gray' style={{ fontSize: 12 }}>
                    {t('否')}
                  </span>
                </td>
                <td style={{ color: 'var(--ink)', fontSize: 14 }}>
                  {t('最大生成 token 数')}
                  {modelData?.max_output_num
                    ? `，${t('本模型最大')} ${modelData.max_output_num}`
                    : ''}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* ---- 区块7：调用配置 ---- */}
        <div className='dsec'>
          <h4>{t('调用配置')}</h4>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: 16,
              maxWidth: 900,
            }}
          >
            <div
              style={{
                background: 'var(--surface-2)',
                border: '1px solid var(--border-2)',
                borderRadius: 10,
                padding: '16px 18px',
              }}
            >
              <div
                style={{ fontSize: 13, color: 'var(--ink-3)', marginBottom: 6 }}
              >
                {t('模型名称')}
              </div>
              <div
                style={{
                  fontFamily: 'var(--mono)',
                  fontSize: 14,
                  color: 'var(--ink)',
                  fontWeight: 500,
                }}
              >
                {mn}
              </div>
            </div>
            <div
              style={{
                background: 'var(--surface-2)',
                border: '1px solid var(--border-2)',
                borderRadius: 10,
                padding: '16px 18px',
              }}
            >
              <div
                style={{ fontSize: 13, color: 'var(--ink-3)', marginBottom: 6 }}
              >
                Base URL
              </div>
              <div
                style={{
                  fontFamily: 'var(--mono)',
                  fontSize: 13,
                  color: 'var(--ink)',
                  wordBreak: 'break-all',
                }}
              >
                {baseUrl}
              </div>
            </div>
            <div
              style={{
                background: 'var(--surface-2)',
                border: '1px solid var(--border-2)',
                borderRadius: 10,
                padding: '16px 18px',
              }}
            >
              <div
                style={{ fontSize: 13, color: 'var(--ink-3)', marginBottom: 6 }}
              >
                API Key
              </div>
              <div style={{ fontSize: 14, color: 'var(--ink-2)' }}>
                {t('在令牌管理页获取')}
              </div>
            </div>
            {modelData?.max_input_num != null && (
              <div
                style={{
                  background: 'var(--surface-2)',
                  border: '1px solid var(--border-2)',
                  borderRadius: 10,
                  padding: '16px 18px',
                }}
              >
                <div
                  style={{
                    fontSize: 13,
                    color: 'var(--ink-3)',
                    marginBottom: 6,
                  }}
                >
                  {t('上下文长度')}
                </div>
                <div
                  style={{
                    fontFamily: 'var(--mono)',
                    fontSize: 14,
                    color: 'var(--ink)',
                    fontWeight: 500,
                  }}
                >
                  {(modelData.max_input_num / 1000).toFixed(0)}K tokens
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModelApiPage;
