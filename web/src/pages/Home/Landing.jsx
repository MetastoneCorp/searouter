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
import { Button, Typography, Input, ScrollList, ScrollItem, Tabs, TabPane } from '@douyinfe/semi-ui';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  IconCopy,
  IconArrowRight,
  IconTickCircle,
} from '@douyinfe/semi-icons';
import {
  IconApiPlug,
  IconHybridCloud,
  IconHighAvailability,
  IconDataSovereignty,
  IconGlobalRelay,
  IconOnPremise,
  IconSmartRouting,
  IconComputeSovereignty,
  IconStepRegister,
  IconStepConfig,
  IconStepUse,
} from '../../components/icons/LandingIcons';
import { StatusContext } from '../../context/Status';
import { useActualTheme } from '../../context/Theme';
import { useIsMobile } from '../../hooks/common/useIsMobile';
import { API, showError, copy, showSuccess } from '../../helpers';
import { API_ENDPOINTS } from '../../constants/common.constant';
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

const { Text } = Typography;

const Landing = () => {
  const { t, i18n } = useTranslation();
  const [statusState] = useContext(StatusContext);
  const actualTheme = useActualTheme();
  const isMobile = useIsMobile();
  const [noticeVisible, setNoticeVisible] = useState(false);
  const [endpointCopied, setEndpointCopied] = useState(false);

  const serverAddress = statusState?.status?.server_address || `${window.location.origin}`;
  const endpointItems = API_ENDPOINTS.map((e) => ({ value: e }));
  const [endpointIndex, setEndpointIndex] = useState(0);

  const handleCopyBaseURL = async () => {
    const ok = await copy(serverAddress);
    if (ok) {
      showSuccess(t('已复制到剪切板'));
    }
  };

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

  const openCodeExample = `# ${t('landing.quickstart.clients.env_hint')}
export OPENAI_BASE_URL=${serverAddress}/v1
export OPENAI_API_KEY=sk-your-api-key`;

  const sdkCodeExample = `# Python
from openai import OpenAI

client = OpenAI(
    base_url="${serverAddress}/v1",
    api_key="sk-your-api-key"
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
      icon: <Claude size={20} />,
      code: claudeCodeExample,
      type: 'code',
    },
    {
      key: 'opencode',
      label: t('landing.quickstart.clients.opencode'),
      icon: <OpenAI size={20} />,
      code: openCodeExample,
      type: 'code',
    },
    {
      key: 'cherry',
      label: t('landing.quickstart.clients.cherry'),
      icon: <span className="landing-client-icon-text">🍒</span>,
      code: null,
      type: 'config',
      items: cherryConfigItems,
    },
    {
      key: 'sdk',
      label: t('landing.quickstart.clients.sdk'),
      icon: <span className="landing-client-icon-text">{'</>'}</span>,
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

  // Endpoint rotation
  useEffect(() => {
    const timer = setInterval(() => {
      setEndpointIndex((prev) => (prev + 1) % endpointItems.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [endpointItems.length]);

  return (
    <div className='landing-page'>
      <NoticeModal
        visible={noticeVisible}
        onClose={() => setNoticeVisible(false)}
        isMobile={isMobile}
      />

      {/* Hero Section */}
      <section className='landing-hero'>
        <div className='landing-hero-grid'></div>
        <div className='landing-hero-content'>
          <div className='landing-hero-text'>
            <div className='landing-hero-tagline'>
              <span className='landing-hero-tagline-dot'></span>
              <span>{t('landing.hero.tagline')}</span>
            </div>

            <h1 className='landing-hero-title'>
              <span>{t('landing.hero.title1')}</span>
              <br />
              <span className='landing-hero-title-gradient'>{t('landing.hero.title2')}</span>
            </h1>

            <p className='landing-hero-subtitle'>{t('landing.hero.subtitle')}</p>

            <div className='landing-hero-actions'>
              <Link to='/register'>
                <Button theme='solid' type='primary' size={isMobile ? 'default' : 'large'}>
                  {t('landing.hero.cta1')}
                </Button>
              </Link>
              <Link to='#features'>
                <Button size={isMobile ? 'default' : 'large'}>
                  {t('landing.hero.cta2')}
                </Button>
              </Link>
            </div>

            <div className='landing-hero-stats'>
              <div>
                <div className='landing-hero-stat-value'>50+</div>
                <div className='landing-hero-stat-label'>{t('landing.hero.stat1')}</div>
              </div>
              <div>
                <div className='landing-hero-stat-value'>99.9%</div>
                <div className='landing-hero-stat-label'>{t('landing.hero.stat2')}</div>
              </div>
              <div>
                <div className='landing-hero-stat-value'>&lt;50ms</div>
                <div className='landing-hero-stat-label'>{t('landing.hero.stat3')}</div>
              </div>
            </div>
          </div>

          <div className='landing-code-window'>
            <div className='landing-code-header'>
              <span className='landing-code-dot landing-code-dot-red'></span>
              <span className='landing-code-dot landing-code-dot-yellow'></span>
              <span className='landing-code-dot landing-code-dot-green'></span>
              <span className='landing-code-title'>api-request.sh</span>
            </div>
            <div className='landing-code-body'>
              <div className='landing-code-line'>
                <span className='landing-code-comment'># {t('landing.code.comment')}</span>
              </div>
              <div className='landing-code-line'>
                <span className='landing-code-keyword'>curl</span>{' '}
                <span className='landing-code-url'>{serverAddress}/v1/chat/completions</span> \
              </div>
              <div className='landing-code-line'>
                {'  '}-H{' '}
                <span className='landing-code-string'>"Authorization: Bearer $API_KEY"</span> \
              </div>
              <div className='landing-code-line'>
                {'  '}-H{' '}
                <span className='landing-code-string'>"Content-Type: application/json"</span> \
              </div>
              <div className='landing-code-line'>
                {"  "}-d <span className='landing-code-string'>{"'{"}</span>
              </div>
              <div className='landing-code-line'>
                <span className='landing-code-string'>    "model": "gpt-4o",</span>
              </div>
              <div className='landing-code-line'>
                <span className='landing-code-string'>    "messages": [</span>
              </div>
              <div className='landing-code-line'>
                <span className='landing-code-string'>      {"{"}"role": "user", "content": "Hello!"{"}"}</span>
              </div>
              <div className='landing-code-line'>
                <span className='landing-code-string'>    ]</span>
              </div>
              <div className='landing-code-line'>
                <span className='landing-code-string'>  {"}"}{"'"}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Start Section */}
      <section className='landing-quickstart'>
        <div className='landing-section-container'>
          <div className='landing-quickstart-header'>
            <h2 className='landing-quickstart-title'>{t('landing.quickstart.title')}</h2>
            <p className='landing-quickstart-subtitle'>{t('landing.quickstart.subtitle')}</p>
          </div>

          <div className='landing-quickstart-steps'>
            {/* Step 1: Register */}
            <div className='landing-quickstart-step'>
              <div className='landing-quickstart-step-number'>1</div>
              <div className='landing-quickstart-step-icon'>
                <IconStepRegister size={28} />
              </div>
              <h3 className='landing-quickstart-step-title'>{t('landing.quickstart.step1.title')}</h3>
              <p className='landing-quickstart-step-desc'>{t('landing.quickstart.step1.desc')}</p>
              <Link to='/register'>
                <Button type='primary' size='default'>
                  {t('landing.quickstart.step1.action')}
                </Button>
              </Link>
            </div>

            {/* Step 2: Configure Endpoint */}
            <div className='landing-quickstart-step'>
              <div className='landing-quickstart-step-number'>2</div>
              <div className='landing-quickstart-step-icon'>
                <IconStepConfig size={28} />
              </div>
              <h3 className='landing-quickstart-step-title'>{t('landing.quickstart.step2.title')}</h3>
              <p className='landing-quickstart-step-desc'>{t('landing.quickstart.step2.desc')}</p>
              <div className='landing-quickstart-endpoint-box'>
                <span className='landing-quickstart-endpoint-url'>{serverAddress}/v1</span>
                <button
                  className={`landing-quickstart-copy-btn ${endpointCopied ? 'copied' : ''}`}
                  onClick={handleCopyEndpoint}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleCopyEndpoint();
                    }
                  }}
                  aria-label={endpointCopied ? t('已复制') : t('复制端点地址')}
                  title={t('复制端点地址')}
                >
                  {endpointCopied ? (
                    <IconTickCircle size={16} />
                  ) : (
                    <IconCopy size={16} />
                  )}
                </button>
              </div>
            </div>

            {/* Step 3: Start Using */}
            <div className='landing-quickstart-step'>
              <div className='landing-quickstart-step-number'>3</div>
              <div className='landing-quickstart-step-icon'>
                <IconStepUse size={28} />
              </div>
              <h3 className='landing-quickstart-step-title'>{t('landing.quickstart.step3.title')}</h3>
              <p className='landing-quickstart-step-desc'>{t('landing.quickstart.step3.desc')}</p>
              <Link to='/console'>
                <Button type='primary' size='default'>
                  {t('landing.quickstart.step3.action')}
                </Button>
              </Link>
            </div>
          </div>

          {/* Client Configuration Examples */}
          <div className='landing-quickstart-clients'>
            <div className='landing-quickstart-clients-header'>
              <div className='landing-quickstart-clients-header-inner'>
                <span className='landing-quickstart-clients-icon'>
                  <IconApiPlug size={18} />
                </span>
                <span>{t('landing.quickstart.clients.title')}</span>
              </div>
            </div>
            <div className='landing-quickstart-clients-body'>
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
                        <pre className='landing-quickstart-code-block' aria-label={`${tab.label} ${t('配置示例')}`}>
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
                              <IconTickCircle size={16} />
                              <span className='landing-code-copy-text'>{t('已复制')}</span>
                            </>
                          ) : (
                            <>
                              <IconCopy size={16} />
                              <span className='landing-code-copy-text'>{t('复制')}</span>
                            </>
                          )}
                        </button>
                      </div>
                    ) : (
                      <div className='landing-quickstart-client-config' role='list' aria-label={`${tab.label} ${t('配置项')}`}>
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

      {/* Model Logo Wall */}
      <section className='landing-models'>
        <div className='landing-section-container'>
          <div className='landing-models-title'>
            {t('landing.models.title')}
          </div>
          <div className='landing-models-grid'>
            <div className='landing-model-item' title='OpenAI'>
              <OpenAI size={32} />
            </div>
            <div className='landing-model-item' title='Claude'>
              <Claude size={32} />
            </div>
            <div className='landing-model-item' title='Gemini'>
              <Gemini size={32} />
            </div>
            <div className='landing-model-item' title='DeepSeek'>
              <DeepSeek size={32} />
            </div>
            <div className='landing-model-item' title='GLM'>
              <Zhipu size={32} />
            </div>
            <div className='landing-model-item' title='Qwen'>
              <Qwen size={32} />
            </div>
            <div className='landing-model-item' title='Moonshot'>
              <Moonshot size={32} />
            </div>
            <div className='landing-model-item' title='xAI'>
              <XAI size={32} />
            </div>
            <div className='landing-model-item' title='Minimax'>
              <Minimax size={32} />
            </div>
            <div className='landing-model-item' title='Cohere'>
              <Cohere size={32} />
            </div>
          </div>
        </div>
      </section>

      {/* Highlights Section - 4 Cards */}
      <section className='landing-highlights'>
        <div className='landing-section-container'>
          <div className='landing-highlights-grid'>
            {/* Card 1: One API for All Models */}
            <div className='landing-highlight-card'>
              <div className='landing-highlight-icon'>
                <IconApiPlug size={24} />
              </div>
              <h3 className='landing-highlight-title'>{t('landing.highlights.card1.title')}</h3>
              <p className='landing-highlight-desc'>{t('landing.highlights.card1.desc')}</p>
              <div className='landing-model-badges'>
                <span className='landing-model-badge'>OpenAI</span>
                <span className='landing-model-badge'>Claude</span>
                <span className='landing-model-badge'>Gemini</span>
                <span className='landing-model-badge'>DeepSeek</span>
                <span className='landing-model-badge'>GLM</span>
                <span className='landing-model-badge'>+50</span>
              </div>
              <Link to='#features' className='landing-highlight-link'>
                {t('landing.highlights.card1.link')} <IconArrowRight />
              </Link>
            </div>

            {/* Card 2: Hybrid Cloud + On-Prem */}
            <div className='landing-highlight-card'>
              <div className='landing-highlight-icon'>
                <IconHybridCloud size={24} />
              </div>
              <h3 className='landing-highlight-title'>{t('landing.highlights.card2.title')}</h3>
              <p className='landing-highlight-desc'>{t('landing.highlights.card2.desc')}</p>
              <Link to='#features' className='landing-highlight-link'>
                {t('landing.highlights.card2.link')} <IconArrowRight />
              </Link>
            </div>

            {/* Card 3: High Availability */}
            <div className='landing-highlight-card'>
              <div className='landing-highlight-icon'>
                <IconHighAvailability size={24} />
              </div>
              <h3 className='landing-highlight-title'>{t('landing.highlights.card3.title')}</h3>
              <p className='landing-highlight-desc'>{t('landing.highlights.card3.desc')}</p>
              <div className='landing-graph-placeholder'></div>
              <Link to='#comparison' className='landing-highlight-link'>
                {t('landing.highlights.card3.link')} <IconArrowRight />
              </Link>
            </div>

            {/* Card 4: Data Sovereignty */}
            <div className='landing-highlight-card'>
              <div className='landing-highlight-icon'>
                <IconDataSovereignty size={24} />
              </div>
              <h3 className='landing-highlight-title'>{t('landing.highlights.card4.title')}</h3>
              <p className='landing-highlight-desc'>{t('landing.highlights.card4.desc')}</p>
              <Link to='#features' className='landing-highlight-link'>
                {t('landing.highlights.card4.link')} <IconArrowRight />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - 4 Cards */}
      <section id='features' className='landing-features'>
        <div className='landing-section-container'>
          <div className='landing-section-header'>
            <span className='landing-section-label'>{t('landing.features.label')}</span>
            <h2 className='landing-section-title'>{t('landing.features.title')}</h2>
            <p className='landing-section-desc'>{t('landing.features.desc')}</p>
          </div>

          <div className='landing-features-grid'>
            {/* Feature 1: Global Model Relay */}
            <div className='landing-feature-card'>
              <div className='landing-feature-icon'>
                <IconGlobalRelay size={24} />
              </div>
              <h3 className='landing-feature-title'>{t('landing.features.relay.title')}</h3>
              <p className='landing-feature-desc'>{t('landing.features.relay.desc')}</p>
              <ul className='landing-feature-list'>
                <li>
                  <span className='landing-feature-list-icon'>
                    <IconTickCircle size={12} style={{ color: 'var(--semi-color-success)' }} />
                  </span>
                  {t('landing.features.relay.item1')}
                </li>
                <li>
                  <span className='landing-feature-list-icon'>
                    <IconTickCircle size={12} style={{ color: 'var(--semi-color-success)' }} />
                  </span>
                  {t('landing.features.relay.item2')}
                </li>
                <li>
                  <span className='landing-feature-list-icon'>
                    <IconTickCircle size={12} style={{ color: 'var(--semi-color-success)' }} />
                  </span>
                  {t('landing.features.relay.item3')}
                </li>
              </ul>
            </div>

            {/* Feature 2: On-Premise Integration */}
            <div className='landing-feature-card'>
              <div className='landing-feature-icon'>
                <IconOnPremise size={24} />
              </div>
              <h3 className='landing-feature-title'>{t('landing.features.onprem.title')}</h3>
              <p className='landing-feature-desc'>{t('landing.features.onprem.desc')}</p>
              <ul className='landing-feature-list'>
                <li>
                  <span className='landing-feature-list-icon'>
                    <IconTickCircle size={12} style={{ color: 'var(--semi-color-success)' }} />
                  </span>
                  {t('landing.features.onprem.item1')}
                </li>
                <li>
                  <span className='landing-feature-list-icon'>
                    <IconTickCircle size={12} style={{ color: 'var(--semi-color-success)' }} />
                  </span>
                  {t('landing.features.onprem.item2')}
                </li>
                <li>
                  <span className='landing-feature-list-icon'>
                    <IconTickCircle size={12} style={{ color: 'var(--semi-color-success)' }} />
                  </span>
                  {t('landing.features.onprem.item3')}
                </li>
              </ul>
            </div>

            {/* Feature 3: Smart Routing */}
            <div className='landing-feature-card'>
              <div className='landing-feature-icon'>
                <IconSmartRouting size={24} />
              </div>
              <h3 className='landing-feature-title'>{t('landing.features.routing.title')}</h3>
              <p className='landing-feature-desc'>{t('landing.features.routing.desc')}</p>
              <ul className='landing-feature-list'>
                <li>
                  <span className='landing-feature-list-icon'>
                    <IconTickCircle size={12} style={{ color: 'var(--semi-color-success)' }} />
                  </span>
                  {t('landing.features.routing.item1')}
                </li>
                <li>
                  <span className='landing-feature-list-icon'>
                    <IconTickCircle size={12} style={{ color: 'var(--semi-color-success)' }} />
                  </span>
                  {t('landing.features.routing.item2')}
                </li>
                <li>
                  <span className='landing-feature-list-icon'>
                    <IconTickCircle size={12} style={{ color: 'var(--semi-color-success)' }} />
                  </span>
                  {t('landing.features.routing.item3')}
                </li>
              </ul>
            </div>

            {/* Feature 4: Compute Sovereignty */}
            <div className='landing-feature-card'>
              <div className='landing-feature-icon'>
                <IconComputeSovereignty size={24} />
              </div>
              <h3 className='landing-feature-title'>{t('landing.features.sovereignty.title')}</h3>
              <p className='landing-feature-desc'>{t('landing.features.sovereignty.desc')}</p>
              <ul className='landing-feature-list'>
                <li>
                  <span className='landing-feature-list-icon'>
                    <IconTickCircle size={12} style={{ color: 'var(--semi-color-success)' }} />
                  </span>
                  {t('landing.features.sovereignty.item1')}
                </li>
                <li>
                  <span className='landing-feature-list-icon'>
                    <IconTickCircle size={12} style={{ color: 'var(--semi-color-success)' }} />
                  </span>
                  {t('landing.features.sovereignty.item2')}
                </li>
                <li>
                  <span className='landing-feature-list-icon'>
                    <IconTickCircle size={12} style={{ color: 'var(--semi-color-success)' }} />
                  </span>
                  {t('landing.features.sovereignty.item3')}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section id='comparison' className='landing-comparison'>
        <div className='landing-section-container'>
          <div className='landing-section-header'>
            <span className='landing-section-label'>{t('landing.comparison.label')}</span>
            <h2 className='landing-section-title'>{t('landing.comparison.title')}</h2>
            <p className='landing-section-desc'>{t('landing.comparison.desc')}</p>
          </div>

          <table className='landing-comparison-table'>
            <thead>
              <tr>
                <th>{t('landing.comparison.feature')}</th>
                <th>{t('landing.comparison.others')}</th>
                <th className='landing-highlight-col'>SeaRouter</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{t('landing.comparison.row1')}</td>
                <td>
                  <span className='landing-check-icon'>
                    <IconTickCircle size={16} style={{ color: 'var(--semi-color-success)' }} />
                  </span>
                </td>
                <td className='landing-highlight-col'>
                  <span className='landing-check-icon'>
                    <IconTickCircle size={16} style={{ color: 'var(--semi-color-success)' }} />
                  </span>
                </td>
              </tr>
              <tr>
                <td>{t('landing.comparison.row2')}</td>
                <td>
                  <span className='landing-check-icon'>
                    <IconTickCircle size={16} style={{ color: 'var(--semi-color-success)' }} />
                  </span>
                </td>
                <td className='landing-highlight-col'>
                  <span className='landing-check-icon'>
                    <IconTickCircle size={16} style={{ color: 'var(--semi-color-success)' }} />
                  </span>
                </td>
              </tr>
              <tr>
                <td>{t('landing.comparison.row3')}</td>
                <td>
                  <span className='landing-cross-icon'>✗</span>
                </td>
                <td className='landing-highlight-col'>
                  <span className='landing-check-icon'>
                    <IconTickCircle size={16} style={{ color: 'var(--semi-color-success)' }} />
                  </span>
                  <span className='landing-badge'>{t('landing.comparison.badge1')}</span>
                </td>
              </tr>
              <tr>
                <td>{t('landing.comparison.row4')}</td>
                <td>{t('landing.comparison.weak')}</td>
                <td className='landing-highlight-col'>
                  <span className='landing-check-icon'>
                    <IconTickCircle size={16} style={{ color: 'var(--semi-color-success)' }} />
                  </span>
                  <span className='landing-badge'>{t('landing.comparison.badge2')}</span>
                </td>
              </tr>
              <tr>
                <td>{t('landing.comparison.row5')}</td>
                <td>
                  <span className='landing-cross-icon'>✗</span>
                </td>
                <td className='landing-highlight-col'>
                  <span className='landing-check-icon'>
                    <IconTickCircle size={16} style={{ color: 'var(--semi-color-success)' }} />
                  </span>
                  <span className='landing-badge'>{t('landing.comparison.badge3')}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Mission Section */}
      <section className='landing-mission'>
        <div className='landing-section-container'>
          <div className='landing-mission-content'>
            <blockquote className='landing-mission-quote'>
              {t('landing.mission.quote')}
            </blockquote>
            <p className='landing-mission-desc'>{t('landing.mission.desc')}</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className='landing-cta'>
        <div className='landing-section-container'>
          <div className='landing-cta-box'>
            <h2 className='landing-cta-title'>{t('landing.cta.title')}</h2>
            <p className='landing-cta-desc'>{t('landing.cta.desc')}</p>
            <div className='landing-cta-actions'>
              <Link to='/register'>
                <Button theme='solid' type='primary' size='large'>
                  {t('landing.cta.btn1')}
                </Button>
              </Link>
              <Link to='/console/channel'>
                <Button size='large'>{t('landing.cta.btn2')}</Button>
              </Link>
              <Link to='/console/token'>
                <Button size='large'>{t('landing.cta.btn3')}</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className='landing-footer'>
        <div className='landing-section-container'>
          <div className='landing-footer-inner'>
            <p className='landing-footer-text'>
              © 2026 SeaRouter. {t('landing.footer.tagline')}
            </p>
            <div className='landing-footer-links'>
              <Link to='/'>{t('landing.footer.home')}</Link>
              <Link to='/console'>{t('landing.footer.console')}</Link>
              <Link to='/pricing'>{t('landing.footer.pricing')}</Link>
              <a href='https://github.com/searouter' target='_blank' rel='noopener noreferrer' aria-label='GitHub (opens in new tab)'>
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