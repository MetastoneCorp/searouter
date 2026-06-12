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

import React, { useContext, useState, useEffect } from 'react';
import { Tabs, TabPane } from '@douyinfe/semi-ui';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  IconCopy,
  IconTickCircle,
} from '@douyinfe/semi-icons';
import {
  IconApiPlug,
  IconStepRegister,
  IconStepConfig,
  IconStepUse,
} from '../../components/icons/LandingIcons';
import { StatusContext } from '../../context/Status';
import { useIsMobile } from '../../hooks/common/useIsMobile';
import { API, copy, showSuccess } from '../../helpers';
import {
  OpenAI,
  Claude,
  Gemini,
  DeepSeek,
  Zhipu,
  Qwen,
  Moonshot,
  XAI,
  Minimax,
  Cohere,
} from '@lobehub/icons';
import NoticeModal from '../../components/layout/NoticeModal';
import './Landing.css';

const Landing = () => {
  const { t } = useTranslation();
  const [statusState] = useContext(StatusContext);
  const isMobile = useIsMobile();
  const [noticeVisible, setNoticeVisible] = useState(false);
  const [endpointCopied, setEndpointCopied] = useState(false);

  const serverAddress = statusState?.status?.server_address || `${window.location.origin}`;

  const handleCopyEndpoint = async () => {
    const ok = await copy(`${serverAddress}/v1`);
    if (ok) {
      setEndpointCopied(true);
      showSuccess(t('已复制到剪切板'));
      setTimeout(() => setEndpointCopied(false), 2000);
    }
  };

  // Code example content for tabs
  const claudeCodeExample = `# ${t('landing.quickstart.clients.env_hint')}
export ANTHROPIC_BASE_URL=${serverAddress}/v1
export ANTHROPIC_API_KEY=sk-your-api-key

# ${t('landing.quickstart.clients.config_file')} ~/.claude/config.json
{
  "baseURL": "${serverAddress}/v1",
  "apiKey": "sk-your-api-key"
}`;

  const openCodeExample = `# Open Code · settings.json
{
  "provider": "openai-compatible",
  "base_url": "${serverAddress}/v1",
  "api_key": "sk-your-api-key"
}`;

  const sdkCodeExample = `from openai import OpenAI

client = OpenAI(
    base_url="${serverAddress}/v1",
    api_key="sk-your-api-key",
)
resp = client.chat.completions.create(
    model="gpt-4o",
    messages=[{"role": "user", "content": "Hello!"}],
)`;

  const cherryConfigItems = [
    { label: t('landing.quickstart.clients.api_address'), value: `${serverAddress}/v1` },
    { label: 'API Key', value: 'sk-your-api-key' },
    { label: t('模型'), value: t('landing.quickstart.clients.model_select') },
  ];

  // Copy states for each tab
  const [copiedTab, setCopiedTab] = useState(null);

  const handleCopyCode = async (code, tabKey) => {
    const ok = await copy(code);
    if (ok) {
      setCopiedTab(tabKey);
      showSuccess(t('已复制到剪切板'));
      setTimeout(() => setCopiedTab(null), 2000);
    }
  };

  const handleCopyKeyDown = (e, code, tabKey) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleCopyCode(code, tabKey);
    }
  };

  // Client tabs configuration
  const clientTabs = [
    {
      key: 'claude',
      label: t('landing.quickstart.clients.claude'),
      icon: <Claude size={16} />,
      code: claudeCodeExample,
      type: 'code',
    },
    {
      key: 'opencode',
      label: t('landing.quickstart.clients.opencode'),
      icon: <OpenAI size={16} />,
      code: openCodeExample,
      type: 'code',
    },
    {
      key: 'cherry',
      label: t('landing.quickstart.clients.cherry'),
      icon: <span className='landing-client-icon-text'>🍒</span>,
      code: null,
      type: 'config',
      items: cherryConfigItems,
    },
    {
      key: 'sdk',
      label: t('landing.quickstart.clients.sdk'),
      icon: <span className='landing-client-icon-text'>{'</>'}</span>,
      code: sdkCodeExample,
      type: 'code',
    },
  ];

  // Check and show notice
  useEffect(() => {
    const checkNoticeAndShow = async () => {
      const lastCloseDate = localStorage.getItem('notice_close_date');
      const today = new Date().toDateString();
      if (lastCloseDate !== today) {
        try {
          const res = await API.get('/api/notice');
          const { success, data } = res.data;
          if (success && data && data.trim() !== '') {
            setNoticeVisible(true);
          }
        } catch (error) {
          console.error('获取公告失败:', error);
        }
      }
    };
    checkNoticeAndShow();
  }, []);

  return (
    <div className='landing-page'>
      <NoticeModal
        visible={noticeVisible}
        onClose={() => setNoticeVisible(false)}
        isMobile={isMobile}
      />

      {/* 1. Hero Section */}
      <section className='landing-hero'>
        <div className='landing-section-container landing-hero-inner'>
          <span className='landing-hero-pill'>{t('landing.hero.tagline')}</span>
          <h1 className='landing-hero-title'>
            {t('landing.hero.title1')}<br />{t('landing.hero.title2')}
          </h1>
          <p className='landing-hero-subtitle'>{t('landing.hero.subtitle')}</p>
          <div className='landing-hero-cta'>
            <Link to='/register' className='landing-btn-primary'>
              {t('landing.hero.cta1')}
            </Link>
            <a href='#why' className='landing-btn-ghost'>
              {t('landing.hero.cta2')}
            </a>
          </div>
        </div>
      </section>

      {/* 2. Stats Section */}
      <div className='landing-stats'>
        <div className='landing-section-container'>
          <div className='landing-stats-row'>
            <div className='landing-stat-item'>
              <div className='landing-stat-num'>30T+</div>
              <div className='landing-stat-lbl'>{t('landing.stats.tokens')}</div>
            </div>
            <div className='landing-stat-item'>
              <div className='landing-stat-num'>50+</div>
              <div className='landing-stat-lbl'>{t('landing.hero.stat1')}</div>
            </div>
            <div className='landing-stat-item'>
              <div className='landing-stat-num'>99.9%</div>
              <div className='landing-stat-lbl'>{t('landing.hero.stat2')}</div>
            </div>
            <div className='landing-stat-item'>
              <div className='landing-stat-num'>&lt;50ms</div>
              <div className='landing-stat-lbl'>{t('landing.hero.stat3')}</div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Quick Start Section */}
      <section className='landing-quickstart'>
        <div className='landing-section-container'>
          <h2 className='landing-section-h'>{t('landing.quickstart.title')}</h2>
          <p className='landing-section-sub'>{t('landing.quickstart.subtitle')}</p>

          <div className='landing-quickstart-steps'>
            {/* Step 1: Register */}
            <div className='landing-step'>
              <div className='landing-step-no'>01.</div>
              <span className='landing-step-ic'>
                <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.9' strokeLinecap='round' strokeLinejoin='round'>
                  <circle cx='12' cy='8' r='4' /><path d='M4 21a8 8 0 0 1 16 0' />
                </svg>
              </span>
              <h3 className='landing-step-title'>{t('landing.quickstart.step1.title')}</h3>
              <p className='landing-step-desc'>{t('landing.quickstart.step1.desc')}</p>
              <Link to='/register' className='landing-step-btn'>{t('landing.quickstart.step1.action')}</Link>
            </div>

            {/* Step 2: Configure Endpoint */}
            <div className='landing-step'>
              <div className='landing-step-no'>02.</div>
              <span className='landing-step-ic'>
                <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.9' strokeLinecap='round' strokeLinejoin='round'>
                  <circle cx='12' cy='12' r='3' />
                  <path d='M19.4 13.5a7.8 7.8 0 0 0 0-3l1.6-1.2-2-3.4-1.9.8a7.6 7.6 0 0 0-2.6-1.5L14 2h-4l-.5 2.2a7.6 7.6 0 0 0-2.6 1.5l-1.9-.8-2 3.4 1.6 1.2a7.8 7.8 0 0 0 0 3L3 14.7l2 3.4 1.9-.8a7.6 7.6 0 0 0 2.6 1.5L10 22h4l.5-2.2a7.6 7.6 0 0 0 2.6-1.5l1.9.8 2-3.4z' />
                </svg>
              </span>
              <h3 className='landing-step-title'>{t('landing.quickstart.step2.title')}</h3>
              <p className='landing-step-desc'>{t('landing.quickstart.step2.desc')}</p>
              <div className='landing-endpoint-box'>
                <code className='landing-endpoint-code'>{serverAddress}/v1</code>
                <button
                  className={`landing-copy-icon-btn ${endpointCopied ? 'copied' : ''}`}
                  onClick={handleCopyEndpoint}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleCopyEndpoint(); }
                  }}
                  aria-label={endpointCopied ? t('已复制') : t('复制端点地址')}
                  title={t('复制端点地址')}
                >
                  {endpointCopied ? <IconTickCircle size={14} /> : <IconCopy size={14} />}
                </button>
              </div>
            </div>

            {/* Step 3: Start Using */}
            <div className='landing-step'>
              <div className='landing-step-no'>03.</div>
              <span className='landing-step-ic'>
                <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.9' strokeLinecap='round' strokeLinejoin='round'>
                  <path d='m8 9-3 3 3 3M16 9l3 3-3 3' />
                </svg>
              </span>
              <h3 className='landing-step-title'>{t('landing.quickstart.step3.title')}</h3>
              <p className='landing-step-desc'>{t('landing.quickstart.step3.desc')}</p>
              <Link to='/console' className='landing-step-btn'>{t('landing.quickstart.step3.action')}</Link>
            </div>
          </div>

          {/* Client Configuration Examples */}
          <div className='landing-cfg'>
            <div className='landing-cfg-head'>
              <span className='landing-cfg-sq'>
                <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
                  <path d='m8 9-3 3 3 3M16 9l3 3-3 3' />
                </svg>
              </span>
              {t('landing.quickstart.clients.title')}
            </div>
            <div>
              <Tabs type='line' size='large' className='landing-client-tabs'>
                {clientTabs.map((tab) => (
                  <TabPane
                    tab={
                      <span className='landing-client-tab'>
                        <span className='landing-client-tab-icon'>{tab.icon}</span>
                        <span className='landing-client-tab-label'>{tab.label}</span>
                      </span>
                    }
                    itemKey={tab.key}
                    key={tab.key}
                  >
                    {tab.type === 'code' ? (
                      <div className='landing-code-block-wrapper'>
                        <pre
                          className='landing-quickstart-code-block'
                          aria-label={`${tab.label} ${t('配置示例')}`}
                        >
                          <code>{tab.code}</code>
                        </pre>
                        <button
                          className={`landing-code-copy-btn ${copiedTab === tab.key ? 'copied' : ''}`}
                          onClick={() => handleCopyCode(tab.code, tab.key)}
                          onKeyDown={(e) => handleCopyKeyDown(e, tab.code, tab.key)}
                          aria-label={copiedTab === tab.key ? t('已复制') : t('复制代码')}
                          title={t('复制代码')}
                        >
                          {copiedTab === tab.key ? (
                            <>
                              <IconTickCircle size={14} />
                              <span className='landing-code-copy-text'>{t('已复制')}</span>
                            </>
                          ) : (
                            <>
                              <IconCopy size={14} />
                              <span className='landing-code-copy-text'>{t('复制')}</span>
                            </>
                          )}
                        </button>
                      </div>
                    ) : (
                      <div
                        className='landing-quickstart-client-config'
                        role='list'
                        aria-label={`${tab.label} ${t('配置项')}`}
                      >
                        {tab.items.map((item, index) => (
                          <div className='landing-quickstart-config-item' key={index} role='listitem'>
                            <span className='landing-quickstart-config-label'>{item.label}:</span>
                            <code className='landing-quickstart-config-value'>{item.value}</code>
                          </div>
                        ))}
                      </div>
                    )}
                  </TabPane>
                ))}
              </Tabs>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Partners Section */}
      <section className='landing-partners'>
        <div className='landing-section-container'>
          <div className='landing-partners-grid'>
            <div>
              <h2 className='landing-partners-title'>{t('landing.partners.title')}</h2>
              <p className='landing-partners-desc'>{t('landing.partners.desc')}</p>
              <Link to='/register' className='landing-partners-btn'>{t('landing.partners.cta')}</Link>
            </div>
            <div>
              <div className='landing-orbit'>
                <div className='landing-orbit-ring'></div>
                <div className='landing-orbit-ring r2'></div>
                <div className='landing-orbit-ring r3'></div>
                <div className='landing-orbit-spin'>
                  <span className='landing-orbit-dot' style={{ left: '50%', top: '2%', color: '#F59E0B' }}>xAI</span>
                  <span className='landing-orbit-dot' style={{ left: '96%', top: '48%', color: '#10A37F' }}>GPT</span>
                  <span className='landing-orbit-dot' style={{ left: '50%', top: '97%', color: '#015BBA' }}>智谱</span>
                  <span className='landing-orbit-dot' style={{ left: '4%', top: '48%', color: '#7C3AED' }}>M</span>
                </div>
                <div className='landing-orbit-spin rev'>
                  <span className='landing-orbit-dot' style={{ left: '81%', top: '16%', color: '#2563EB' }}>Ge</span>
                  <span className='landing-orbit-dot' style={{ left: '82%', top: '80%', color: '#DC2626' }}>DS</span>
                  <span className='landing-orbit-dot' style={{ left: '17%', top: '80%', color: '#0891B2' }}>Qw</span>
                  <span className='landing-orbit-dot' style={{ left: '17%', top: '17%', color: '#16A34A' }}>Ll</span>
                </div>
                <div className='landing-orbit-core' aria-label='SeaRouter'>
                  <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
                    <path d='M3 16c2.5 0 2.5-2 5-2s2.5 2 5 2 2.5-2 5-2' />
                    <path d='M4 11l8-6 8 6' />
                    <path d='M6 11v4M18 11v4' />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Feature Cards */}
      <section className='landing-features'>
        <div className='landing-section-container'>
          <h2 className='landing-section-h'>{t('landing.features2.title')}</h2>
          <div className='landing-feat4'>
            <div className='landing-feat'>
              <span className='landing-feat-sq'>
                <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.9' strokeLinecap='round' strokeLinejoin='round'>
                  <path d='M4 7h16M4 12h16M4 17h10' />
                </svg>
              </span>
              <h3 className='landing-feat-title'>{t('landing.highlights.card1.title')}</h3>
              <p className='landing-feat-desc'>{t('landing.highlights.card1.desc')}</p>
              <div className='landing-feat-tags'>
                <span className='landing-tag'>OpenAI</span>
                <span className='landing-tag'>Claude</span>
                <span className='landing-tag'>Gemini</span>
                <span className='landing-tag'>DeepSeek</span>
                <span className='landing-tag'>GLM</span>
                <span className='landing-tag'>+50</span>
              </div>
            </div>
            <div className='landing-feat'>
              <span className='landing-feat-sq'>
                <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.9' strokeLinecap='round' strokeLinejoin='round'>
                  <path d='M17.5 19a4.5 4.5 0 0 0 .5-9 6 6 0 0 0-11.6-1.5A4 4 0 0 0 6.5 19z' />
                  <path d='M12 13v6M9 16l3 3 3-3' />
                </svg>
              </span>
              <h3 className='landing-feat-title'>{t('landing.highlights.card2.title')}</h3>
              <p className='landing-feat-desc'>{t('landing.highlights.card2.desc')}</p>
            </div>
            <div className='landing-feat'>
              <span className='landing-feat-sq'>
                <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.9' strokeLinecap='round' strokeLinejoin='round'>
                  <path d='M3 17l5-6 4 4 5-7 4 5' />
                </svg>
              </span>
              <h3 className='landing-feat-title'>{t('landing.highlights.card3.title')}</h3>
              <p className='landing-feat-desc'>{t('landing.highlights.card3.desc')}</p>
            </div>
            <div className='landing-feat'>
              <span className='landing-feat-sq'>
                <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.9' strokeLinecap='round' strokeLinejoin='round'>
                  <path d='M12 3l8 4v5c0 5-3.5 8-8 9-4.5-1-8-4-8-9V7z' />
                  <path d='m9 12 2 2 4-4' />
                </svg>
              </span>
              <h3 className='landing-feat-title'>{t('landing.highlights.card4.title')}</h3>
              <p className='landing-feat-desc'>{t('landing.highlights.card4.desc')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Why SeaRouter Section */}
      <section className='landing-why' id='why'>
        <div className='landing-section-container'>
          <h2 className='landing-section-h'>{t('landing.features.title')}</h2>
          <p className='landing-section-sub'>{t('landing.features.desc')}</p>
          <div className='landing-why4'>
            {/* 全球模型中转 */}
            <div className='landing-why-card'>
              <span className='landing-why-sq'>
                <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.9' strokeLinecap='round' strokeLinejoin='round'>
                  <circle cx='12' cy='12' r='9' />
                  <path d='M3 12h18M12 3a14 14 0 0 1 0 18 14 14 0 0 1 0-18' />
                </svg>
              </span>
              <h3 className='landing-why-title'>{t('landing.features.relay.title')}</h3>
              <p className='landing-why-desc'>{t('landing.features.relay.desc')}</p>
              <ul className='landing-checks'>
                <li>
                  <span className='landing-check-svg'>
                    <svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2.4' strokeLinecap='round' strokeLinejoin='round'><path d='m5 12 4 4 10-10' /></svg>
                  </span>
                  {t('landing.features.relay.item1')}
                </li>
                <li>
                  <span className='landing-check-svg'>
                    <svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2.4' strokeLinecap='round' strokeLinejoin='round'><path d='m5 12 4 4 10-10' /></svg>
                  </span>
                  {t('landing.features.relay.item2')}
                </li>
                <li>
                  <span className='landing-check-svg'>
                    <svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2.4' strokeLinecap='round' strokeLinejoin='round'><path d='m5 12 4 4 10-10' /></svg>
                  </span>
                  {t('landing.features.relay.item3')}
                </li>
              </ul>
            </div>

            {/* 本地算力融合 */}
            <div className='landing-why-card'>
              <span className='landing-why-sq'>
                <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.9' strokeLinecap='round' strokeLinejoin='round'>
                  <rect x='3' y='4' width='18' height='12' rx='2' />
                  <path d='M7 20h10M9 16v4M15 16v4' />
                </svg>
              </span>
              <h3 className='landing-why-title'>{t('landing.features.onprem.title')}</h3>
              <p className='landing-why-desc'>{t('landing.features.onprem.desc')}</p>
              <ul className='landing-checks'>
                <li>
                  <span className='landing-check-svg'>
                    <svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2.4' strokeLinecap='round' strokeLinejoin='round'><path d='m5 12 4 4 10-10' /></svg>
                  </span>
                  {t('landing.features.onprem.item1')}
                </li>
                <li>
                  <span className='landing-check-svg'>
                    <svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2.4' strokeLinecap='round' strokeLinejoin='round'><path d='m5 12 4 4 10-10' /></svg>
                  </span>
                  {t('landing.features.onprem.item2')}
                </li>
                <li>
                  <span className='landing-check-svg'>
                    <svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2.4' strokeLinecap='round' strokeLinejoin='round'><path d='m5 12 4 4 10-10' /></svg>
                  </span>
                  {t('landing.features.onprem.item3')}
                </li>
              </ul>
            </div>

            {/* 智能弹性路由 */}
            <div className='landing-why-card'>
              <span className='landing-why-sq'>
                <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.9' strokeLinecap='round' strokeLinejoin='round'>
                  <circle cx='6' cy='6' r='2.5' /><circle cx='18' cy='18' r='2.5' />
                  <path d='M8.5 6H15a3 3 0 0 1 3 3v6.5M6 8.5V15' />
                </svg>
              </span>
              <h3 className='landing-why-title'>{t('landing.features.routing.title')}</h3>
              <p className='landing-why-desc'>{t('landing.features.routing.desc')}</p>
              <ul className='landing-checks'>
                <li>
                  <span className='landing-check-svg'>
                    <svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2.4' strokeLinecap='round' strokeLinejoin='round'><path d='m5 12 4 4 10-10' /></svg>
                  </span>
                  {t('landing.features.routing.item1')}
                </li>
                <li>
                  <span className='landing-check-svg'>
                    <svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2.4' strokeLinecap='round' strokeLinejoin='round'><path d='m5 12 4 4 10-10' /></svg>
                  </span>
                  {t('landing.features.routing.item2')}
                </li>
                <li>
                  <span className='landing-check-svg'>
                    <svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2.4' strokeLinecap='round' strokeLinejoin='round'><path d='m5 12 4 4 10-10' /></svg>
                  </span>
                  {t('landing.features.routing.item3')}
                </li>
              </ul>
            </div>

            {/* 算力主权 */}
            <div className='landing-why-card'>
              <span className='landing-why-sq'>
                <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.9' strokeLinecap='round' strokeLinejoin='round'>
                  <path d='M13 2 3 14h7l-1 8 10-12h-7z' />
                </svg>
              </span>
              <h3 className='landing-why-title'>{t('landing.features.sovereignty.title')}</h3>
              <p className='landing-why-desc'>{t('landing.features.sovereignty.desc')}</p>
              <ul className='landing-checks'>
                <li>
                  <span className='landing-check-svg'>
                    <svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2.4' strokeLinecap='round' strokeLinejoin='round'><path d='m5 12 4 4 10-10' /></svg>
                  </span>
                  {t('landing.features.sovereignty.item1')}
                </li>
                <li>
                  <span className='landing-check-svg'>
                    <svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2.4' strokeLinecap='round' strokeLinejoin='round'><path d='m5 12 4 4 10-10' /></svg>
                  </span>
                  {t('landing.features.sovereignty.item2')}
                </li>
                <li>
                  <span className='landing-check-svg'>
                    <svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2.4' strokeLinecap='round' strokeLinejoin='round'><path d='m5 12 4 4 10-10' /></svg>
                  </span>
                  {t('landing.features.sovereignty.item3')}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Comparison Table */}
      <section className='landing-comparison'>
        <div className='landing-section-container'>
          <h2 className='landing-section-h'>{t('landing.comparison.title')}</h2>
          <p className='landing-section-sub'>{t('landing.comparison.desc')}</p>
          <table className='landing-comparison-table'>
            <thead>
              <tr>
                <th>{t('landing.comparison.feature')}</th>
                <th style={{ textAlign: 'center' }}>{t('landing.comparison.others')}</th>
                <th className='landing-col-hl'>SeaRouter</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className='landing-feat-name'>{t('landing.comparison.row1')}</td>
                <td className='landing-col'><span className='landing-yes'>✓</span></td>
                <td className='landing-col-hl'><span className='landing-yes'>✓</span></td>
              </tr>
              <tr>
                <td className='landing-feat-name'>{t('landing.comparison.row2')}</td>
                <td className='landing-col'><span className='landing-yes'>✓</span></td>
                <td className='landing-col-hl'><span className='landing-yes'>✓</span></td>
              </tr>
              <tr>
                <td className='landing-feat-name'>{t('landing.comparison.row3')}</td>
                <td className='landing-col'><span className='landing-no'>✕</span></td>
                <td className='landing-col-hl'>
                  <span className='landing-badge-ok'>{t('landing.comparison.badge1')}</span>
                </td>
              </tr>
              <tr>
                <td className='landing-feat-name'>{t('landing.comparison.row4')}</td>
                <td className='landing-col'>{t('landing.comparison.weak')}</td>
                <td className='landing-col-hl'>
                  <span className='landing-badge-ok'>{t('landing.comparison.badge2')}</span>
                </td>
              </tr>
              <tr>
                <td className='landing-feat-name'>{t('landing.comparison.row5')}</td>
                <td className='landing-col'><span className='landing-no'>✕</span></td>
                <td className='landing-col-hl'>
                  <span className='landing-badge-ok'>{t('landing.comparison.badge3')}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* 8. Quote / Mission Section */}
      <section className='landing-quote'>
        <div className='landing-section-container'>
          <q className='landing-quote-q'>{t('landing.mission.quote')}</q>
          <p className='landing-quote-desc'>{t('landing.mission.desc')}</p>
        </div>
      </section>

      {/* 9. CTA Section */}
      <section className='landing-cta'>
        <div className='landing-section-container'>
          <h2 className='landing-cta-title'>{t('landing.cta.title')}</h2>
          <p className='landing-section-sub'>{t('landing.cta.desc')}</p>
          <div className='landing-cta-row'>
            <Link to='/register' className='landing-btn-primary'>
              {t('landing.cta.btn1')}
            </Link>
            <Link to='/console/channel' className='landing-btn-ghost'>
              {t('landing.cta.btn2')}
            </Link>
            <Link to='/console/token' className='landing-btn-ghost'>
              {t('landing.cta.btn3')}
            </Link>
          </div>
        </div>
      </section>

      {/* 10. Footer */}
      <footer className='landing-footer'>
        <div className='landing-section-container'>
          <div className='landing-footer-row'>
            <span className='landing-footer-copy'>
              © 2026 MetaStone. {t('landing.footer.tagline')}
            </span>
            <div className='landing-footer-links'>
              <Link to='/'>{t('landing.footer.home')}</Link>
              <Link to='/console'>{t('landing.footer.console')}</Link>
              <Link to='/pricing'>{t('landing.footer.pricing')}</Link>
              <a href='https://github.com/metastone-ai' target='_blank' rel='noopener noreferrer' aria-label='GitHub (opens in new tab)'>
                GitHub
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
