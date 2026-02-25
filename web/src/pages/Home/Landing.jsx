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
import { Button, Typography, Input, ScrollList, ScrollItem } from '@douyinfe/semi-ui';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { IconCopy, IconArrowRight } from '@douyinfe/semi-icons';
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

  const serverAddress = statusState?.status?.server_address || `${window.location.origin}`;
  const endpointItems = API_ENDPOINTS.map((e) => ({ value: e }));
  const [endpointIndex, setEndpointIndex] = useState(0);

  const handleCopyBaseURL = async () => {
    const ok = await copy(serverAddress);
    if (ok) {
      showSuccess(t('已复制到剪切板'));
    }
  };

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

      {/* Highlights Section - 4 Cards */}
      <section className='landing-highlights'>
        <div className='landing-section-container'>
          <div className='landing-highlights-grid'>
            {/* Card 1: One API for All Models */}
            <div className='landing-highlight-card'>
              <div className='landing-highlight-icon'>🔌</div>
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
              <div className='landing-highlight-icon'>🏠</div>
              <h3 className='landing-highlight-title'>{t('landing.highlights.card2.title')}</h3>
              <p className='landing-highlight-desc'>{t('landing.highlights.card2.desc')}</p>
              <Link to='#features' className='landing-highlight-link'>
                {t('landing.highlights.card2.link')} <IconArrowRight />
              </Link>
            </div>

            {/* Card 3: High Availability */}
            <div className='landing-highlight-card'>
              <div className='landing-highlight-icon'>📊</div>
              <h3 className='landing-highlight-title'>{t('landing.highlights.card3.title')}</h3>
              <p className='landing-highlight-desc'>{t('landing.highlights.card3.desc')}</p>
              <div className='landing-graph-placeholder'></div>
              <Link to='#comparison' className='landing-highlight-link'>
                {t('landing.highlights.card3.link')} <IconArrowRight />
              </Link>
            </div>

            {/* Card 4: Data Sovereignty */}
            <div className='landing-highlight-card'>
              <div className='landing-highlight-icon'>🔒</div>
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
              <div className='landing-feature-icon'>🌐</div>
              <h3 className='landing-feature-title'>{t('landing.features.relay.title')}</h3>
              <p className='landing-feature-desc'>{t('landing.features.relay.desc')}</p>
              <ul className='landing-feature-list'>
                <li>
                  <span className='landing-feature-list-icon'>✓</span>
                  {t('landing.features.relay.item1')}
                </li>
                <li>
                  <span className='landing-feature-list-icon'>✓</span>
                  {t('landing.features.relay.item2')}
                </li>
                <li>
                  <span className='landing-feature-list-icon'>✓</span>
                  {t('landing.features.relay.item3')}
                </li>
              </ul>
            </div>

            {/* Feature 2: On-Premise Integration */}
            <div className='landing-feature-card'>
              <div className='landing-feature-icon'>🏠</div>
              <h3 className='landing-feature-title'>{t('landing.features.onprem.title')}</h3>
              <p className='landing-feature-desc'>{t('landing.features.onprem.desc')}</p>
              <ul className='landing-feature-list'>
                <li>
                  <span className='landing-feature-list-icon'>✓</span>
                  {t('landing.features.onprem.item1')}
                </li>
                <li>
                  <span className='landing-feature-list-icon'>✓</span>
                  {t('landing.features.onprem.item2')}
                </li>
                <li>
                  <span className='landing-feature-list-icon'>✓</span>
                  {t('landing.features.onprem.item3')}
                </li>
              </ul>
            </div>

            {/* Feature 3: Smart Routing */}
            <div className='landing-feature-card'>
              <div className='landing-feature-icon'>🔀</div>
              <h3 className='landing-feature-title'>{t('landing.features.routing.title')}</h3>
              <p className='landing-feature-desc'>{t('landing.features.routing.desc')}</p>
              <ul className='landing-feature-list'>
                <li>
                  <span className='landing-feature-list-icon'>✓</span>
                  {t('landing.features.routing.item1')}
                </li>
                <li>
                  <span className='landing-feature-list-icon'>✓</span>
                  {t('landing.features.routing.item2')}
                </li>
                <li>
                  <span className='landing-feature-list-icon'>✓</span>
                  {t('landing.features.routing.item3')}
                </li>
              </ul>
            </div>

            {/* Feature 4: Compute Sovereignty */}
            <div className='landing-feature-card'>
              <div className='landing-feature-icon'>⚡</div>
              <h3 className='landing-feature-title'>{t('landing.features.sovereignty.title')}</h3>
              <p className='landing-feature-desc'>{t('landing.features.sovereignty.desc')}</p>
              <ul className='landing-feature-list'>
                <li>
                  <span className='landing-feature-list-icon'>✓</span>
                  {t('landing.features.sovereignty.item1')}
                </li>
                <li>
                  <span className='landing-feature-list-icon'>✓</span>
                  {t('landing.features.sovereignty.item2')}
                </li>
                <li>
                  <span className='landing-feature-list-icon'>✓</span>
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
                  <span className='landing-check-icon'>✓</span>
                </td>
                <td className='landing-highlight-col'>
                  <span className='landing-check-icon'>✓</span>
                </td>
              </tr>
              <tr>
                <td>{t('landing.comparison.row2')}</td>
                <td>
                  <span className='landing-check-icon'>✓</span>
                </td>
                <td className='landing-highlight-col'>
                  <span className='landing-check-icon'>✓</span>
                </td>
              </tr>
              <tr>
                <td>{t('landing.comparison.row3')}</td>
                <td>
                  <span className='landing-cross-icon'>✗</span>
                </td>
                <td className='landing-highlight-col'>
                  <span className='landing-check-icon'>✓</span>
                  <span className='landing-badge'>{t('landing.comparison.badge1')}</span>
                </td>
              </tr>
              <tr>
                <td>{t('landing.comparison.row4')}</td>
                <td>{t('landing.comparison.weak')}</td>
                <td className='landing-highlight-col'>
                  <span className='landing-check-icon'>✓</span>
                  <span className='landing-badge'>{t('landing.comparison.badge2')}</span>
                </td>
              </tr>
              <tr>
                <td>{t('landing.comparison.row5')}</td>
                <td>
                  <span className='landing-cross-icon'>✗</span>
                </td>
                <td className='landing-highlight-col'>
                  <span className='landing-check-icon'>✓</span>
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
              <a href='https://github.com/searouter' target='_blank' rel='noopener noreferrer'>
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
