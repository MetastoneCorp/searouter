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
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { IconCopy, IconTickCircle } from '@douyinfe/semi-icons';
import { Bell, ArrowRight } from 'lucide-react';
import { StatusContext } from '../../context/Status';
import { UserContext } from '../../context/User';
import { useTheme, useSetTheme } from '../../context/Theme';
import { useIsMobile } from '../../hooks/common/useIsMobile';
import { API, copy, showSuccess, getSystemName, getLogo } from '../../helpers';
import ThemeToggle from '../../components/layout/headerbar/ThemeToggle';
import LanguageSelector from '../../components/layout/headerbar/LanguageSelector';
import NoticeModal from '../../components/layout/NoticeModal';
import UserArea from '../../components/layout/headerbar/UserArea';
import './Landing.css';

const Landing = () => {
  const { t, i18n } = useTranslation();
  const [statusState] = useContext(StatusContext);
  const [userState, userDispatch] = useContext(UserContext);
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [noticeVisible, setNoticeVisible] = useState(false);
  const [endpointCopied, setEndpointCopied] = useState(false);
  const [activeClient, setActiveClient] = useState('claude');
  const [codeCopied, setCodeCopied] = useState(false);
  const theme = useTheme();
  const setTheme = useSetTheme();
  const [currentLang, setCurrentLang] = useState(i18n.language);
  const systemName = getSystemName();
  const logo = getLogo();

  useEffect(() => {
    const handleLangChange = (lng) => setCurrentLang(lng);
    i18n.on('languageChanged', handleLangChange);
    return () => i18n.off('languageChanged', handleLangChange);
  }, [i18n]);

  // 首页为独立路由（未经 PageLayout），自行从本地存储恢复登录态
  useEffect(() => {
    if (!userState.user) {
      const stored = localStorage.getItem('user');
      if (stored) {
        try {
          userDispatch({ type: 'login', payload: JSON.parse(stored) });
        } catch (e) {
          // 忽略解析错误
        }
      }
    }
  }, []);

  const handleLanguageChange = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem('i18nextLng', lang);
  };

  const handleThemeToggle = (next) => {
    if (setTheme) setTheme(next);
  };

  const isSelfUseMode = statusState?.status?.self_use_mode_enabled || false;

  const handleLogout = async () => {
    await API.get('/api/user/logout');
    showSuccess(t('注销成功!'));
    userDispatch({ type: 'logout' });
    localStorage.removeItem('user');
    navigate('/login');
  };

  const serverAddress =
    statusState?.status?.server_address ||
    'https://searouter.metastonecorp.com';

  const handleCopyEndpoint = async () => {
    const ok = await copy(`${serverAddress}`);
    if (ok) {
      setEndpointCopied(true);
      showSuccess(t('已复制到剪切板'));
      setTimeout(() => setEndpointCopied(false), 2000);
    }
  };

  // 各客户端代码示例
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

  const cherryCodeExample = `# Cherry Studio · ${t('landing.quickstart.clients.provider_settings')}
${t('landing.quickstart.clients.api_address')}: ${serverAddress}/v1
API Key: sk-your-api-key
${t('模型')}: ${t('landing.quickstart.clients.model_select')}`;

  const sdkCodeExample = `from openai import OpenAI

client = OpenAI(
    base_url="${serverAddress}/v1",
    api_key="sk-your-api-key",
)
resp = client.chat.completions.create(
    model="gpt-4o",
    messages=[{"role": "user", "content": "Hello!"}],
)`;

  const clientTabs = [
    {
      key: 'claude',
      label: t('landing.quickstart.clients.claude'),
      icon: (
        <img
          src='/home/cfg-claude.svg'
          alt=''
          className='lp-cfg-tab-icon-img'
        />
      ),
      code: claudeCodeExample,
    },
    {
      key: 'opencode',
      label: t('landing.quickstart.clients.opencode'),
      icon: (
        <img
          src='/home/cfg-opencode.svg'
          alt=''
          className='lp-cfg-tab-icon-img'
        />
      ),
      code: openCodeExample,
    },
    {
      key: 'cherry',
      label: t('landing.quickstart.clients.cherry'),
      icon: (
        <img
          src='/home/cfg-cherry.svg'
          alt=''
          className='lp-cfg-tab-icon-img'
        />
      ),
      code: cherryCodeExample,
    },
    {
      key: 'sdk',
      label: t('landing.quickstart.clients.sdk'),
      icon: (
        <img
          src='/home/cfg-openai.svg'
          alt=''
          className='lp-cfg-tab-icon-img'
        />
      ),
      code: sdkCodeExample,
    },
  ];

  const activeTab =
    clientTabs.find((tb) => tb.key === activeClient) || clientTabs[0];

  const handleCopyCode = async () => {
    const ok = await copy(activeTab.code);
    if (ok) {
      setCodeCopied(true);
      showSuccess(t('已复制到剪切板'));
      setTimeout(() => setCodeCopied(false), 2000);
    }
  };

  // 公告检测
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

  // why 卡数据
  const whyCards = [
    {
      icon: '/home/why1.svg',
      title: t('landing.features.relay.title'),
      desc: t('landing.features.relay.desc'),
      items: [
        t('landing.features.relay.item1'),
        t('landing.features.relay.item2'),
        t('landing.features.relay.item3'),
      ],
    },
    {
      icon: '/home/why2.svg',
      title: t('landing.features.onprem.title'),
      desc: t('landing.features.onprem.desc'),
      items: [
        t('landing.features.onprem.item1'),
        t('landing.features.onprem.item2'),
        t('landing.features.onprem.item3'),
      ],
    },
    {
      icon: '/home/why3.svg',
      title: t('landing.features.routing.title'),
      desc: t('landing.features.routing.desc'),
      items: [
        t('landing.features.routing.item1'),
        t('landing.features.routing.item2'),
        t('landing.features.routing.item3'),
      ],
    },
    {
      icon: '/home/why4.svg',
      title: t('landing.features.sovereignty.title'),
      desc: t('landing.features.sovereignty.desc'),
      items: [
        t('landing.features.sovereignty.item1'),
        t('landing.features.sovereignty.item2'),
        t('landing.features.sovereignty.item3'),
      ],
    },
  ];

  // 特性 4 卡
  const featureCards = [
    {
      icon: '/home/feat-api.svg',
      title: t('landing.highlights.card1.title'),
      desc: t('landing.highlights.card1.desc'),
      tags: ['OpenAI', 'Claude', 'Gemini', 'DeepSeek', 'GLM', '+50'],
    },
    {
      icon: '/home/feat-hybrid.svg',
      title: t('landing.highlights.card2.title'),
      desc: t('landing.highlights.card2.desc'),
    },
    {
      icon: '/home/feat-ha.svg',
      title: t('landing.highlights.card3.title'),
      desc: t('landing.highlights.card3.desc'),
    },
    {
      icon: '/home/feat-sovereignty.svg',
      title: t('landing.highlights.card4.title'),
      desc: t('landing.highlights.card4.desc'),
    },
  ];

  return (
    <div className='lp'>
      <NoticeModal
        visible={noticeVisible}
        onClose={() => setNoticeVisible(false)}
        isMobile={isMobile}
      />

      {/* ============ 顶部导航 ============ */}
      <header className='lp-nav'>
        <Link to='/' className='lp-nav-brand'>
          <img src={logo} alt='' className='lp-nav-logo' />
          <span className='lp-nav-name'>{systemName}</span>
        </Link>
        <nav className='lp-nav-tabs'>
          <Link to='/' className='lp-nav-tab lp-nav-tab--active'>
            {t('landing.nav.home')}
          </Link>
          <Link to='/console' className='lp-nav-tab'>
            {t('landing.nav.console')}
          </Link>
          <Link to='/pricing' className='lp-nav-tab'>
            {t('landing.nav.models')}
          </Link>
          <Link to='/about' className='lp-nav-tab'>
            {t('landing.nav.docs')}
          </Link>
          <Link to='/about' className='lp-nav-tab'>
            {t('landing.nav.about')}
          </Link>
        </nav>
        <div className='lp-nav-actions'>
          <button
            type='button'
            className='lp-nav-icon'
            aria-label={t('landing.nav.notice')}
          >
            <Bell size={20} />
          </button>
          <ThemeToggle theme={theme} onThemeToggle={handleThemeToggle} t={t} />
          <LanguageSelector
            currentLang={currentLang}
            onLanguageChange={handleLanguageChange}
            t={t}
          />
          <span className='lp-nav-divider' />
          {userState.user ? (
            <UserArea
              userState={userState}
              isLoading={false}
              isMobile={isMobile}
              isSelfUseMode={isSelfUseMode}
              logout={handleLogout}
              navigate={navigate}
              t={t}
            />
          ) : (
            <Link to='/login' className='lp-nav-login'>
              {t('landing.nav.login')}
            </Link>
          )}
        </div>
      </header>

      {/* ============ 1. Hero（单张主图） ============ */}
      <section className='lp-hero'>
        <div className='lp-hero-inner lp-hero-inner2'>
          <div className='lp-hero-text'>
            <span className='lp-hero-tag'>
              <img
                src='/home/hero-tag-icon.svg'
                alt=''
                width='18'
                height='18'
              />
              {t('landing.hero2.tag')}
            </span>
            <h1 className='lp-hero-title2'>
              <span className='lp-hero-title2-a'>
                {t('landing.hero2.title_a')}
              </span>
              <span className='lp-hero-title2-b'>
                {t('landing.hero2.title_b')}
              </span>
            </h1>
            <p className='lp-hero-sub2'>{t('landing.hero2.subtitle')}</p>
          </div>
          <div className='lp-hero-cta2'>
            <Link to='/register' className='lp-hero-btn2-primary'>
              {t('landing.hero2.cta1')}
              <ArrowRight
                className='lp-hero-btn2-arrow'
                size={24}
                aria-hidden='true'
              />
            </Link>
            <Link to='/about' className='lp-hero-btn2-ghost'>
              {t('landing.hero2.cta2')}
            </Link>
          </div>
        </div>
      </section>

      {/* ============ 2. Stats divider ============ */}
      <div className='lp-divider'>
        <div className='lp-divider-cell'>
          <div className='lp-divider-num'>30T+</div>
          <div className='lp-divider-lbl'>{t('landing.stats.tokens')}</div>
        </div>
        <div className='lp-divider-cell'>
          <div className='lp-divider-num'>50+</div>
          <div className='lp-divider-lbl'>{t('landing.hero.stat1')}</div>
        </div>
        <div className='lp-divider-cell'>
          <div className='lp-divider-num'>99.9%</div>
          <div className='lp-divider-lbl'>{t('landing.hero.stat2')}</div>
        </div>
        <div className='lp-divider-cell'>
          <div className='lp-divider-num'>&lt;50ms</div>
          <div className='lp-divider-lbl'>{t('landing.hero.stat3')}</div>
        </div>
      </div>

      {/* ============ main content ============ */}
      <div className='lp-main'>
        {/* 快速开始 + 客户端配置 + 合作伙伴：连续浅蓝竖向渐变区（顶部白 → 底部蓝） */}
        <div className='lp-flow'>
          {/* 3. Quick Start */}
          <section className='lp-qs'>
            <div className='lp-qs-head'>
              <h2 className='lp-h2'>{t('landing.quickstart.title')}</h2>
              <p className='lp-sub16'>{t('landing.quickstart.subtitle')}</p>
            </div>
            <div className='lp-qs-steps'>
              {/* 01 注册账户 */}
              <div className='lp-step'>
                <div className='lp-step-top'>
                  <span className='lp-step-no'>01.</span>
                  <span className='lp-step-ic'>
                    <img src='/home/step-register.svg' alt='' />
                  </span>
                </div>
                <div className='lp-step-body'>
                  <h3 className='lp-step-title'>
                    {t('landing.quickstart.step1.title')}
                  </h3>
                  <p className='lp-step-desc'>
                    {t('landing.quickstart.step1.desc')}
                  </p>
                </div>
                <Link to='/register' className='lp-step-btn'>
                  {t('landing.quickstart.step1.action')}
                </Link>
              </div>

              {/* 02 配置端点 */}
              <div className='lp-step'>
                <div className='lp-step-top'>
                  <span className='lp-step-no'>02.</span>
                  <span className='lp-step-ic'>
                    <img src='/home/step-config.svg' alt='' />
                  </span>
                </div>
                <div className='lp-step-body'>
                  <h3 className='lp-step-title'>
                    {t('landing.quickstart.step2.title')}
                  </h3>
                  <p className='lp-step-desc'>
                    {t('landing.quickstart.step2.desc')}
                  </p>
                </div>
                <div className='lp-endpoint'>
                  <code className='lp-endpoint-code'>{serverAddress}</code>
                  <button
                    className={`lp-endpoint-copy ${endpointCopied ? 'copied' : ''}`}
                    onClick={handleCopyEndpoint}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleCopyEndpoint();
                      }
                    }}
                    aria-label={
                      endpointCopied ? t('已复制') : t('复制端点地址')
                    }
                    title={t('复制端点地址')}
                  >
                    {endpointCopied ? (
                      <IconTickCircle size='small' />
                    ) : (
                      <img
                        src='/home/icon-copy-endpoint.svg'
                        alt=''
                        className='lp-endpoint-copy-img'
                      />
                    )}
                  </button>
                </div>
              </div>

              {/* 03 开始使用 */}
              <div className='lp-step'>
                <div className='lp-step-top'>
                  <span className='lp-step-no'>03.</span>
                  <span className='lp-step-ic'>
                    <img src='/home/step-use.svg' alt='' />
                  </span>
                </div>
                <div className='lp-step-body'>
                  <h3 className='lp-step-title'>
                    {t('landing.quickstart.step3.title')}
                  </h3>
                  <p className='lp-step-desc'>
                    {t('landing.quickstart.step3.desc')}
                  </p>
                </div>
                <Link to='/console' className='lp-step-btn'>
                  {t('landing.quickstart.step3.action')}
                </Link>
              </div>
            </div>
          </section>

          {/* 4. 客户端配置示例 */}
          <section className='lp-cfg-wrap'>
            <div className='lp-cfg'>
              <div className='lp-cfg-head'>
                <span className='lp-cfg-head-ic'>
                  <img src='/home/cfg-header-icon.svg' alt='' />
                </span>
                <span className='lp-cfg-head-title'>
                  {t('landing.quickstart.clients.title')}
                </span>
              </div>
              <div className='lp-cfg-tabs'>
                {clientTabs.map((tab) => (
                  <button
                    key={tab.key}
                    className={`lp-cfg-tab ${activeClient === tab.key ? 'active' : ''}`}
                    onClick={() => {
                      setActiveClient(tab.key);
                      setCodeCopied(false);
                    }}
                  >
                    <span className='lp-cfg-tab-icon'>{tab.icon}</span>
                    <span className='lp-cfg-tab-label'>{tab.label}</span>
                  </button>
                ))}
              </div>
              <div className='lp-cfg-body'>
                <pre className='lp-cfg-code'>
                  <code>{activeTab.code}</code>
                </pre>
                <button
                  className={`lp-cfg-copy ${codeCopied ? 'copied' : ''}`}
                  onClick={handleCopyCode}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleCopyCode();
                    }
                  }}
                  aria-label={codeCopied ? t('已复制') : t('复制代码')}
                  title={t('复制代码')}
                >
                  {codeCopied ? (
                    <IconTickCircle size='small' />
                  ) : (
                    <img
                      src='/home/icon-copy-code.svg'
                      alt=''
                      className='lp-cfg-copy-img'
                    />
                  )}
                  <span className='lp-cfg-copy-text'>
                    {codeCopied ? t('已复制') : t('复制')}
                  </span>
                </button>
              </div>
            </div>
          </section>
        </div>

        {/* 5. 合作伙伴 */}
        <section className='lp-partners'>
          <h2 className='lp-h2 lp-partners-title'>
            {t('landing.partners.title')}
          </h2>
          <div className='lp-partners-content'>
            <div className='lp-partners-text'>
              <p className='lp-partners-desc'>{t('landing.partners.desc')}</p>
              <Link to='/register' className='lp-partners-btn'>
                {t('landing.partners.cta')}
              </Link>
            </div>
            <div className='lp-partners-orbit'>
              <img src='/home/partners-orbit.svg' alt='' />
            </div>
          </div>
        </section>

        {/* 6. 特性 4 卡 */}
        <section className='lp-features'>
          {featureCards.map((card, i) => (
            <div className='lp-feat' key={i}>
              <span className='lp-feat-ic'>
                <img src={card.icon} alt='' />
              </span>
              <h3 className='lp-feat-title'>{card.title}</h3>
              <p className='lp-feat-desc'>{card.desc}</p>
              {card.tags && (
                <div className='lp-feat-tags'>
                  {card.tags.map((tag) => (
                    <span className='lp-feat-tag' key={tag}>
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </section>

        {/* 7. 为什么选择 SeaRouter */}
        <section className='lp-why'>
          <div className='lp-why-head'>
            <h2 className='lp-h2'>{t('landing.features.title')}</h2>
            <p className='lp-sub16'>{t('landing.features.desc')}</p>
          </div>
          <div className='lp-why-grid'>
            {whyCards.map((card, i) => (
              <div className='lp-why-card' key={i}>
                <span className='lp-why-ic'>
                  <img src={card.icon} alt='' />
                </span>
                <h3 className='lp-why-title'>{card.title}</h3>
                <p className='lp-why-desc'>{card.desc}</p>
                <ul className='lp-why-list'>
                  {card.items.map((item, j) => (
                    <li key={j}>
                      <img
                        src='/home/tick-circle-16.svg'
                        alt=''
                        className='lp-tick'
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* 8. 对比表 */}
        <section className='lp-cmp'>
          <div className='lp-cmp-head'>
            <h2 className='lp-h2'>{t('landing.comparison.title')}</h2>
            <p className='lp-sub16'>{t('landing.comparison.desc')}</p>
          </div>
          <div className='lp-cmp-table'>
            <div className='lp-cmp-col'>
              <div className='lp-cmp-cell lp-cmp-th'>
                {t('landing.comparison.feature')}
              </div>
              <div className='lp-cmp-cell'>{t('landing.comparison.row1')}</div>
              <div className='lp-cmp-cell'>{t('landing.comparison.row2')}</div>
              <div className='lp-cmp-cell'>{t('landing.comparison.row3')}</div>
              <div className='lp-cmp-cell'>{t('landing.comparison.row4')}</div>
              <div className='lp-cmp-cell'>{t('landing.comparison.row5')}</div>
            </div>
            <div className='lp-cmp-col'>
              <div className='lp-cmp-cell lp-cmp-th'>
                {t('landing.comparison.others')}
              </div>
              <div className='lp-cmp-cell lp-cmp-center'>
                <img
                  src='/home/tick-circle-16.svg'
                  alt='✓'
                  className='lp-tick16'
                />
              </div>
              <div className='lp-cmp-cell lp-cmp-center'>
                <img
                  src='/home/tick-circle-16.svg'
                  alt='✓'
                  className='lp-tick16'
                />
              </div>
              <div className='lp-cmp-cell lp-cmp-center'>
                <span className='lp-cmp-x'>✗</span>
              </div>
              <div className='lp-cmp-cell'>{t('landing.comparison.weak')}</div>
              <div className='lp-cmp-cell lp-cmp-center'>
                <span className='lp-cmp-x'>✗</span>
              </div>
            </div>
            <div className='lp-cmp-col lp-cmp-col-hl'>
              <div className='lp-cmp-cell lp-cmp-th lp-cmp-th-hl'>
                SeaRouter
              </div>
              <div className='lp-cmp-cell lp-cmp-center'>
                <img
                  src='/home/tick-circle-16.svg'
                  alt='✓'
                  className='lp-tick16'
                />
              </div>
              <div className='lp-cmp-cell lp-cmp-center'>
                <img
                  src='/home/tick-circle-16.svg'
                  alt='✓'
                  className='lp-tick16'
                />
              </div>
              <div className='lp-cmp-cell'>
                <img
                  src='/home/tick-circle-16.svg'
                  alt='✓'
                  className='lp-tick16'
                />
                <span className='lp-cmp-badge'>
                  {t('landing.comparison.badge1')}
                </span>
              </div>
              <div className='lp-cmp-cell'>
                <img
                  src='/home/tick-circle-16.svg'
                  alt='✓'
                  className='lp-tick16'
                />
                <span className='lp-cmp-badge'>
                  {t('landing.comparison.badge2')}
                </span>
              </div>
              <div className='lp-cmp-cell'>
                <img
                  src='/home/tick-circle-16.svg'
                  alt='✓'
                  className='lp-tick16'
                />
                <span className='lp-cmp-badge'>
                  {t('landing.comparison.badge3')}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* 9. 引言条 */}
        <section className='lp-quote'>
          <q className='lp-quote-q'>{t('landing.mission.quote')}</q>
          <p className='lp-quote-desc'>{t('landing.mission.desc')}</p>
        </section>

        {/* 10. 准备好了吗 CTA */}
        <section className='lp-cta'>
          <div className='lp-cta-text'>
            <h2 className='lp-cta-title'>{t('landing.cta.title')}</h2>
            <p className='lp-cta-sub'>{t('landing.cta.desc')}</p>
          </div>
          <div className='lp-cta-btns'>
            <Link to='/register' className='lp-cta-btn-primary'>
              {t('landing.cta.btn1')}
            </Link>
            <Link to='/console/channel' className='lp-cta-btn-ghost'>
              {t('landing.cta.btn2')}
            </Link>
            <Link to='/console/token' className='lp-cta-btn-ghost'>
              {t('landing.cta.btn3')}
            </Link>
          </div>
        </section>
      </div>

      {/* 11. Footer */}
      <footer className='lp-footer'>
        <span className='lp-footer-copy'>
          © 2026 MetaStone. {t('landing.footer.tagline')}
        </span>
        <div className='lp-footer-links'>
          <Link to='/'>{t('landing.footer.home')}</Link>
          <Link to='/console'>{t('landing.footer.console')}</Link>
          <Link to='/pricing'>{t('landing.footer.pricing')}</Link>
          <a
            href='https://www.metastonecorp.com/'
            target='_blank'
            rel='noopener noreferrer'
            aria-label='MetaStone (opens in new tab)'
          >
            MetaStone
          </a>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
