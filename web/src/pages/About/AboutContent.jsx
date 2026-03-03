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

import React from 'react';
import { useTranslation } from 'react-i18next';
import { IconTickCircle, IconGithubLogo, IconMail } from '@douyinfe/semi-icons';
import {
  IconSeaRouterLogo,
  IconHybridCloud,
  IconDataSovereignty,
  IconHighAvailability,
} from '../../components/icons/LandingIcons';
import './AboutContent.css';

const AboutContent = () => {
  const { t } = useTranslation();

  return (
    <div className='about-container'>
      {/* Hero */}
      <header className='about-hero'>
        <div className='about-logo'>
          <IconSeaRouterLogo size={48} />
        </div>
        <span className='about-tagline'>{t('about.tagline')}</span>
        <h1 className='about-title'>SeaRouter</h1>
        <p className='about-subtitle'>
          <strong>{t('about.subtitle')}</strong>
        </p>
      </header>

      {/* Our Story - 关于页独有 */}
      <section className='about-section'>
        <h2 className='about-section-title'>
          <span className='about-icon'>
            <IconHybridCloud size={24} />
          </span>{' '}
          {t('about.story.title')}
        </h2>
        <div className='about-story-content'>
          <p>{t('about.story.p1')}</p>
          <p>{t('about.story.p2')}</p>
          <p>{t('about.story.p3')}</p>
        </div>
        {/* Timeline */}
        <div className='about-timeline'>
          <div className='about-timeline-item'>
            <div className='about-timeline-dot'></div>
            <div className='about-timeline-content'>
              <span className='about-timeline-year'>2025</span>
              <span className='about-timeline-text'>{t('about.story.founded')}</span>
            </div>
          </div>
          <div className='about-timeline-item'>
            <div className='about-timeline-dot'></div>
            <div className='about-timeline-content'>
              <span className='about-timeline-year'>2025</span>
              <span className='about-timeline-text'>{t('about.story.v1')}</span>
            </div>
          </div>
          <div className='about-timeline-item'>
            <div className='about-timeline-dot active'></div>
            <div className='about-timeline-content'>
              <span className='about-timeline-year'>2026</span>
              <span className='about-timeline-text'>{t('about.story.now')}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values - 关于页独有 */}
      <section className='about-section'>
        <h2 className='about-section-title'>
          <span className='about-icon'>
            <IconDataSovereignty size={24} />
          </span>{' '}
          {t('about.values.title')}
        </h2>
        <div className='about-values-grid'>
          <div className='about-value-card'>
            <div className='about-value-icon'>
              <IconTickCircle size={28} style={{ color: 'var(--semi-color-success)' }} />
            </div>
            <h3>{t('about.values.open.title')}</h3>
            <p>{t('about.values.open.desc')}</p>
          </div>
          <div className='about-value-card'>
            <div className='about-value-icon'>
              <IconDataSovereignty size={28} />
            </div>
            <h3>{t('about.values.security.title')}</h3>
            <p>{t('about.values.security.desc')}</p>
          </div>
          <div className='about-value-card'>
            <div className='about-value-icon'>
              <IconHighAvailability size={28} />
            </div>
            <h3>{t('about.values.developer.title')}</h3>
            <p>{t('about.values.developer.desc')}</p>
          </div>
        </div>
      </section>

      {/* By The Numbers - 从首页移来 */}
      <section className='about-section'>
        <h2 className='about-section-title about-center'>
          <span className='about-icon'>
            <IconHighAvailability size={24} />
          </span>{' '}
          {t('about.numbers.title')}
        </h2>
        <div className='about-stats-grid'>
          <div className='about-stat-card'>
            <div className='about-stat-value'>50+</div>
            <div className='about-stat-label'>{t('about.numbers.models')}</div>
          </div>
          <div className='about-stat-card'>
            <div className='about-stat-value'>99.9%</div>
            <div className='about-stat-label'>{t('about.numbers.uptime')}</div>
          </div>
          <div className='about-stat-card'>
            <div className='about-stat-value'>&lt;50ms</div>
            <div className='about-stat-label'>{t('about.numbers.latency')}</div>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className='about-section'>
        <div className='about-mission'>
          <blockquote>{t('about.mission.quote')}</blockquote>
          <cite>{t('about.mission.desc')}</cite>
        </div>
      </section>

      {/* Contact / Connect */}
      <section className='about-section'>
        <h2 className='about-section-title about-center'>
          <span className='about-icon'>
            <IconMail size={24} />
          </span>{' '}
          {t('about.connect.title')}
        </h2>
        <div className='about-connect'>
          <a
            href='https://github.com/searouter'
            target='_blank'
            rel='noopener noreferrer'
            className='about-connect-link'
          >
            <IconGithubLogo size={20} />
            <span>GitHub</span>
          </a>
          <a href='mailto:support@searouter.com' className='about-connect-link'>
            <IconMail size={20} />
            <span>Email</span>
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className='about-footer'>
        <p>&copy; 2026 SeaRouter. {t('about.footer.tagline')}</p>
        <div className='about-footer-links'>
          <a href='/'>{t('about.footer.home')}</a>
          <a href='/console'>{t('about.footer.console')}</a>
          <a href='/pricing'>{t('about.footer.pricing')}</a>
          <a href='https://github.com/searouter' target='_blank' rel='noopener noreferrer'>
            GitHub
          </a>
        </div>
      </footer>
    </div>
  );
};

export default AboutContent;
