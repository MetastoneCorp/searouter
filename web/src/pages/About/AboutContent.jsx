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
import './AboutContent.css';

const AboutContent = () => {
  const { t } = useTranslation();

  return (
    <div className='about-container'>
      {/* Hero */}
      <header className='about-hero'>
        <div className='about-logo'>🌊</div>
        <span className='about-tagline'>{t('about.tagline')}</span>
        <h1 className='about-title'>SeaRouter</h1>
        <p className='about-subtitle'>
          <strong>{t('about.subtitle')}</strong>
        </p>
      </header>

      {/* What is SeaRouter */}
      <section className='about-section'>
        <h2 className='about-section-title'>
          <span className='about-icon'>🌐</span> {t('about.what_is.title')}
        </h2>
        <p>{t('about.what_is.desc1')}</p>
        <p>{t('about.what_is.desc2')}</p>
        <p className='about-highlight'>{t('about.what_is.desc3')}</p>
      </section>

      {/* Core Features */}
      <section className='about-section'>
        <h2 className='about-section-title'>
          <span className='about-icon'>⚡</span> {t('about.features.title')}
        </h2>
        <div className='about-features'>
          <div className='about-feature-card'>
            <h3>
              <span className='about-feature-icon'>☁️</span>{' '}
              {t('about.features.relay.title')}
            </h3>
            <p>{t('about.features.relay.desc')}</p>
            <ul>
              <li>
                <strong>{t('about.features.relay.item1_title')}</strong>{' '}
                {t('about.features.relay.item1_desc')}
              </li>
              <li>
                <strong>{t('about.features.relay.item2_title')}</strong>{' '}
                {t('about.features.relay.item2_desc')}
              </li>
              <li>
                <strong>{t('about.features.relay.item3_title')}</strong>{' '}
                {t('about.features.relay.item3_desc')}
              </li>
            </ul>
          </div>

          <div className='about-feature-card'>
            <h3>
              <span className='about-feature-icon'>🔒</span>{' '}
              {t('about.features.onprem.title')}
            </h3>
            <p>{t('about.features.onprem.desc')}</p>
            <ul>
              <li>
                <strong>{t('about.features.onprem.item1_title')}</strong>{' '}
                {t('about.features.onprem.item1_desc')}
              </li>
              <li>
                <strong>{t('about.features.onprem.item2_title')}</strong>{' '}
                {t('about.features.onprem.item2_desc')}
              </li>
              <li>
                <strong>{t('about.features.onprem.item3_title')}</strong>{' '}
                {t('about.features.onprem.item3_desc')}
              </li>
            </ul>
          </div>

          <div className='about-feature-card'>
            <h3>
              <span className='about-feature-icon'>🔀</span>{' '}
              {t('about.features.routing.title')}
            </h3>
            <p>{t('about.features.routing.desc')}</p>
            <ul>
              <li>
                <strong>{t('about.features.routing.item1_title')}</strong>{' '}
                {t('about.features.routing.item1_desc')}
              </li>
              <li>
                <strong>{t('about.features.routing.item2_title')}</strong>{' '}
                {t('about.features.routing.item2_desc')}
              </li>
              <li>
                <strong>{t('about.features.routing.item3_title')}</strong>{' '}
                {t('about.features.routing.item3_desc')}
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className='about-section'>
        <h2 className='about-section-title'>
          <span className='about-icon'>📊</span> {t('about.comparison.title')}
        </h2>
        <div className='about-table-wrapper'>
          <table className='about-table'>
            <thead>
              <tr>
                <th>{t('about.comparison.feature')}</th>
                <th>{t('about.comparison.others')}</th>
                <th className='about-highlight-col'>SeaRouter</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{t('about.comparison.row1_feature')}</td>
                <td>
                  <span className='about-check'>✓</span>
                </td>
                <td className='about-highlight-col'>
                  <span className='about-check'>✓</span>
                </td>
              </tr>
              <tr>
                <td>{t('about.comparison.row2_feature')}</td>
                <td>
                  <span className='about-check'>✓</span>
                </td>
                <td className='about-highlight-col'>
                  <span className='about-check'>✓</span>
                </td>
              </tr>
              <tr>
                <td>{t('about.comparison.row3_feature')}</td>
                <td>✗</td>
                <td className='about-highlight-col'>
                  <span className='about-check'>✓</span>{' '}
                  {t('about.comparison.hybrid')}
                </td>
              </tr>
              <tr>
                <td>{t('about.comparison.row4_feature')}</td>
                <td>{t('about.comparison.weak')}</td>
                <td className='about-highlight-col'>
                  <span className='about-check'>✓</span>{' '}
                  {t('about.comparison.strong')}
                </td>
              </tr>
              <tr>
                <td>{t('about.comparison.row5_feature')}</td>
                <td>✗</td>
                <td className='about-highlight-col'>
                  <span className='about-check'>✓</span>{' '}
                  {t('about.comparison.auto_switch')}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Mission */}
      <section className='about-section'>
        <div className='about-mission'>
          <blockquote>{t('about.mission.quote')}</blockquote>
          <cite>{t('about.mission.desc')}</cite>
        </div>
      </section>

      {/* CTA */}
      <section className='about-section'>
        <h2 className='about-section-title about-center'>
          <span className='about-icon'>🚀</span> {t('about.cta.title')}
        </h2>
        <p className='about-center'>{t('about.cta.desc')}</p>
        <div className='about-cta'>
          <a href='/login' className='about-btn about-btn-primary'>
            <span>🔑</span> {t('about.cta.btn1')}
          </a>
          <a href='/console/channel' className='about-btn about-btn-secondary'>
            <span>⚙️</span> {t('about.cta.btn2')}
          </a>
          <a href='/console/token' className='about-btn about-btn-secondary'>
            <span>🎫</span> {t('about.cta.btn3')}
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className='about-footer'>
        <p>© 2026 SeaRouter. {t('about.footer.tagline')}</p>
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
