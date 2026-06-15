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

import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { UserContext } from '../../context/User';
import { StatusContext } from '../../context/Status';
import {
  API,
  getLogo,
  showError,
  showInfo,
  showSuccess,
  updateAPI,
  getSystemName,
  setUserData,
  onGitHubOAuthClicked,
  onDiscordOAuthClicked,
  onOIDCClicked,
  onLinuxDOOAuthClicked,
  onCustomOAuthClicked,
  prepareCredentialRequestOptions,
  buildAssertionResult,
  isPasskeySupported,
} from '../../helpers';
import Turnstile from 'react-turnstile';
import { Checkbox, Modal } from '@douyinfe/semi-ui';
import TelegramLoginButton from 'react-telegram-login';

import {
  IconGithubLogo,
  IconLock,
  IconKey,
} from '@douyinfe/semi-icons';
import OIDCIcon from '../common/logo/OIDCIcon';
import WeChatIcon from '../common/logo/WeChatIcon';
import LinuxDoIcon from '../common/logo/LinuxDoIcon';
import TwoFAVerification from './TwoFAVerification';
import { useTranslation } from 'react-i18next';
import { SiDiscord } from 'react-icons/si';
import ThemeToggle from '../layout/headerbar/ThemeToggle';
import LanguageSelector from '../layout/headerbar/LanguageSelector';
import { useTheme, useSetTheme } from '../../context/Theme';

const LoginForm = () => {
  let navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const setTheme = useSetTheme();
  const [currentLang, setCurrentLang] = useState(i18n.language);

  useEffect(() => {
    const handleLangChange = (lng) => setCurrentLang(lng);
    i18n.on('languageChanged', handleLangChange);
    return () => i18n.off('languageChanged', handleLangChange);
  }, [i18n]);

  const handleLanguageChange = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem('i18nextLng', lang);
  };

  const handleThemeToggle = (t) => {
    if (setTheme) setTheme(t);
  };
  const githubButtonTextKeyByState = {
    idle: '使用 GitHub 继续',
    redirecting: '正在跳转 GitHub...',
    timeout: '请求超时，请刷新页面后重新发起 GitHub 登录',
  };
  const [inputs, setInputs] = useState({
    username: '',
    password: '',
    wechat_verification_code: '',
  });
  const { username, password } = inputs;
  const [searchParams] = useSearchParams();
  const [submitted, setSubmitted] = useState(false);
  const [userState, userDispatch] = useContext(UserContext);
  const [statusState] = useContext(StatusContext);
  const [turnstileEnabled, setTurnstileEnabled] = useState(false);
  const [turnstileSiteKey, setTurnstileSiteKey] = useState('');
  const [turnstileToken, setTurnstileToken] = useState('');
  const [showWeChatLoginModal, setShowWeChatLoginModal] = useState(false);
  const [showEmailLogin, setShowEmailLogin] = useState(false);
  const [wechatLoading, setWechatLoading] = useState(false);
  const [githubLoading, setGithubLoading] = useState(false);
  const [discordLoading, setDiscordLoading] = useState(false);
  const [oidcLoading, setOidcLoading] = useState(false);
  const [linuxdoLoading, setLinuxdoLoading] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [resetPasswordLoading, setResetPasswordLoading] = useState(false);
  const [wechatCodeSubmitLoading, setWechatCodeSubmitLoading] = useState(false);
  const [showTwoFA, setShowTwoFA] = useState(false);
  const [passkeySupported, setPasskeySupported] = useState(false);
  const [passkeyLoading, setPasskeyLoading] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [hasUserAgreement, setHasUserAgreement] = useState(false);
  const [hasPrivacyPolicy, setHasPrivacyPolicy] = useState(false);
  const [githubButtonState, setGithubButtonState] = useState('idle');
  const [githubButtonDisabled, setGithubButtonDisabled] = useState(false);
  const githubTimeoutRef = useRef(null);
  const githubButtonText = t(githubButtonTextKeyByState[githubButtonState]);
  const [customOAuthLoading, setCustomOAuthLoading] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const systemName = getSystemName();

  let affCode = new URLSearchParams(window.location.search).get('aff');
  if (affCode) {
    localStorage.setItem('aff', affCode);
  }

  const status = useMemo(() => {
    if (statusState?.status) return statusState.status;
    const savedStatus = localStorage.getItem('status');
    if (!savedStatus) return {};
    try {
      return JSON.parse(savedStatus) || {};
    } catch (err) {
      return {};
    }
  }, [statusState?.status]);

  useEffect(() => {
    if (status?.turnstile_check) {
      setTurnstileEnabled(true);
      setTurnstileSiteKey(status.turnstile_site_key);
    }
    setHasUserAgreement(status?.user_agreement_enabled || false);
    setHasPrivacyPolicy(status?.privacy_policy_enabled || false);
  }, [status]);

  useEffect(() => {
    isPasskeySupported()
      .then(setPasskeySupported)
      .catch(() => setPasskeySupported(false));

    return () => {
      if (githubTimeoutRef.current) {
        clearTimeout(githubTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (searchParams.get('expired')) {
      showError(t('未登录或登录已过期，请重新登录'));
    }
  }, []);

  const onWeChatLoginClicked = () => {
    if ((hasUserAgreement || hasPrivacyPolicy) && !agreedToTerms) {
      showInfo(t('请先阅读并同意用户协议和隐私政策'));
      return;
    }
    setWechatLoading(true);
    setShowWeChatLoginModal(true);
    setWechatLoading(false);
  };

  const onSubmitWeChatVerificationCode = async () => {
    if (turnstileEnabled && turnstileToken === '') {
      showInfo('请稍后几秒重试，Turnstile 正在检查用户环境！');
      return;
    }
    setWechatCodeSubmitLoading(true);
    try {
      const res = await API.get(
        `/api/oauth/wechat?code=${inputs.wechat_verification_code}`,
      );
      const { success, message, data } = res.data;
      if (success) {
        userDispatch({ type: 'login', payload: data });
        localStorage.setItem('user', JSON.stringify(data));
        setUserData(data);
        updateAPI();
        navigate('/');
        showSuccess('登录成功！');
        setShowWeChatLoginModal(false);
      } else {
        showError(message);
      }
    } catch (error) {
      showError('登录失败，请重试');
    } finally {
      setWechatCodeSubmitLoading(false);
    }
  };

  function handleChange(name, value) {
    setInputs((inputs) => ({ ...inputs, [name]: value }));
  }

  async function handleSubmit(e) {
    if (e && e.preventDefault) e.preventDefault();
    if ((hasUserAgreement || hasPrivacyPolicy) && !agreedToTerms) {
      showInfo(t('请先阅读并同意用户协议和隐私政策'));
      return;
    }
    if (turnstileEnabled && turnstileToken === '') {
      showInfo('请稍后几秒重试，Turnstile 正在检查用户环境！');
      return;
    }
    setSubmitted(true);
    setLoginLoading(true);
    try {
      if (username && password) {
        const res = await API.post(
          `/api/user/login?turnstile=${turnstileToken}`,
          {
            username,
            password,
          },
        );
        const { success, message, data } = res.data;
        if (success) {
          if (data && data.require_2fa) {
            setShowTwoFA(true);
            setLoginLoading(false);
            return;
          }
          userDispatch({ type: 'login', payload: data });
          setUserData(data);
          updateAPI();
          showSuccess('登录成功！');
          if (username === 'root' && password === '123456') {
            Modal.error({
              title: '您正在使用默认密码！',
              content: '请立刻修改默认密码！',
              centered: true,
            });
          }
          navigate('/console');
        } else {
          showError(message);
        }
      } else {
        showError('请输入用户名和密码！');
      }
    } catch (error) {
      showError('登录失败，请重试');
    } finally {
      setLoginLoading(false);
    }
  }

  const onTelegramLoginClicked = async (response) => {
    if ((hasUserAgreement || hasPrivacyPolicy) && !agreedToTerms) {
      showInfo(t('请先阅读并同意用户协议和隐私政策'));
      return;
    }
    const fields = [
      'id', 'first_name', 'last_name', 'username',
      'photo_url', 'auth_date', 'hash', 'lang',
    ];
    const params = {};
    fields.forEach((field) => {
      if (response[field]) params[field] = response[field];
    });
    try {
      const res = await API.get(`/api/oauth/telegram/login`, { params });
      const { success, message, data } = res.data;
      if (success) {
        userDispatch({ type: 'login', payload: data });
        localStorage.setItem('user', JSON.stringify(data));
        showSuccess('登录成功！');
        setUserData(data);
        updateAPI();
        navigate('/');
      } else {
        showError(message);
      }
    } catch (error) {
      showError('登录失败，请重试');
    }
  };

  const handleGitHubClick = () => {
    if ((hasUserAgreement || hasPrivacyPolicy) && !agreedToTerms) {
      showInfo(t('请先阅读并同意用户协议和隐私政策'));
      return;
    }
    if (githubButtonDisabled) return;
    setGithubLoading(true);
    setGithubButtonDisabled(true);
    setGithubButtonState('redirecting');
    if (githubTimeoutRef.current) clearTimeout(githubTimeoutRef.current);
    githubTimeoutRef.current = setTimeout(() => {
      setGithubLoading(false);
      setGithubButtonState('timeout');
      setGithubButtonDisabled(true);
    }, 20000);
    try {
      onGitHubOAuthClicked(status.github_client_id, { shouldLogout: true });
    } finally {
      setTimeout(() => setGithubLoading(false), 3000);
    }
  };

  const handleDiscordClick = () => {
    if ((hasUserAgreement || hasPrivacyPolicy) && !agreedToTerms) {
      showInfo(t('请先阅读并同意用户协议和隐私政策'));
      return;
    }
    setDiscordLoading(true);
    try {
      onDiscordOAuthClicked(status.discord_client_id, { shouldLogout: true });
    } finally {
      setTimeout(() => setDiscordLoading(false), 3000);
    }
  };

  const handleOIDCClick = () => {
    if ((hasUserAgreement || hasPrivacyPolicy) && !agreedToTerms) {
      showInfo(t('请先阅读并同意用户协议和隐私政策'));
      return;
    }
    setOidcLoading(true);
    try {
      onOIDCClicked(
        status.oidc_authorization_endpoint,
        status.oidc_client_id,
        false,
        { shouldLogout: true },
      );
    } finally {
      setTimeout(() => setOidcLoading(false), 3000);
    }
  };

  const handleLinuxDOClick = () => {
    if ((hasUserAgreement || hasPrivacyPolicy) && !agreedToTerms) {
      showInfo(t('请先阅读并同意用户协议和隐私政策'));
      return;
    }
    setLinuxdoLoading(true);
    try {
      onLinuxDOOAuthClicked(status.linuxdo_client_id, { shouldLogout: true });
    } finally {
      setTimeout(() => setLinuxdoLoading(false), 3000);
    }
  };

  const handleCustomOAuthClick = (provider) => {
    if ((hasUserAgreement || hasPrivacyPolicy) && !agreedToTerms) {
      showInfo(t('请先阅读并同意用户协议和隐私政策'));
      return;
    }
    setCustomOAuthLoading((prev) => ({ ...prev, [provider.slug]: true }));
    try {
      onCustomOAuthClicked(provider, { shouldLogout: true });
    } finally {
      setTimeout(() => {
        setCustomOAuthLoading((prev) => ({ ...prev, [provider.slug]: false }));
      }, 3000);
    }
  };

  const handlePasskeyLogin = async () => {
    if ((hasUserAgreement || hasPrivacyPolicy) && !agreedToTerms) {
      showInfo(t('请先阅读并同意用户协议和隐私政策'));
      return;
    }
    if (!passkeySupported) {
      showInfo('当前环境无法使用 Passkey 登录');
      return;
    }
    if (!window.PublicKeyCredential) {
      showInfo('当前浏览器不支持 Passkey');
      return;
    }
    setPasskeyLoading(true);
    try {
      const beginRes = await API.post('/api/user/passkey/login/begin');
      const { success, message, data } = beginRes.data;
      if (!success) {
        showError(message || '无法发起 Passkey 登录');
        return;
      }
      const publicKeyOptions = prepareCredentialRequestOptions(
        data?.options || data?.publicKey || data,
      );
      const assertion = await navigator.credentials.get({ publicKey: publicKeyOptions });
      const payload = buildAssertionResult(assertion);
      if (!payload) {
        showError('Passkey 验证失败，请重试');
        return;
      }
      const finishRes = await API.post('/api/user/passkey/login/finish', payload);
      const finish = finishRes.data;
      if (finish.success) {
        userDispatch({ type: 'login', payload: finish.data });
        setUserData(finish.data);
        updateAPI();
        showSuccess('登录成功！');
        navigate('/console');
      } else {
        showError(finish.message || 'Passkey 登录失败，请重试');
      }
    } catch (error) {
      if (error?.name === 'AbortError') {
        showInfo('已取消 Passkey 登录');
      } else {
        showError('Passkey 登录失败，请重试');
      }
    } finally {
      setPasskeyLoading(false);
    }
  };

  const handleResetPasswordClick = () => {
    setResetPasswordLoading(true);
    navigate('/reset');
    setResetPasswordLoading(false);
  };

  const handle2FASuccess = (data) => {
    userDispatch({ type: 'login', payload: data });
    setUserData(data);
    updateAPI();
    showSuccess('登录成功！');
    navigate('/console');
  };

  const handleBackToLogin = () => {
    setShowTwoFA(false);
    setInputs({ username: '', password: '', wechat_verification_code: '' });
  };

  const hasOAuth = !!(
    status.github_oauth ||
    status.discord_oauth ||
    status.oidc_enabled ||
    status.wechat_login ||
    status.linuxdo_oauth ||
    status.telegram_oauth
  );

  const termsBlock = (hasUserAgreement || hasPrivacyPolicy) && (
    <div className='lg2-form' style={{ display: 'block', width: 'auto', margin: 0, padding: 0 }}>
      <label className='agree' style={{ display: 'flex', alignItems: 'flex-start', gap: 9, fontSize: 12.5, color: 'var(--ink-2)', margin: '4px 0 22px', cursor: 'pointer' }}>
        <Checkbox
          checked={agreedToTerms}
          onChange={(e) => setAgreedToTerms(e.target.checked)}
          style={{ marginTop: 1 }}
        />
        <span>
          {t('我已阅读并同意')}
          {hasUserAgreement && (
            <a href='/user-agreement' target='_blank' rel='noopener noreferrer'
              style={{ color: 'var(--brand-600)', margin: '0 3px' }}>
              {t('用户协议')}
            </a>
          )}
          {hasUserAgreement && hasPrivacyPolicy && t('和')}
          {hasPrivacyPolicy && (
            <a href='/privacy-policy' target='_blank' rel='noopener noreferrer'
              style={{ color: 'var(--brand-600)', margin: '0 3px' }}>
              {t('隐私政策')}
            </a>
          )}
        </span>
      </label>
    </div>
  );

  /* 微信登录弹窗 */
  const wechatModal = (
    <Modal
      title={t('微信扫码登录')}
      visible={showWeChatLoginModal}
      maskClosable={true}
      onOk={onSubmitWeChatVerificationCode}
      onCancel={() => setShowWeChatLoginModal(false)}
      okText={t('登录')}
      centered={true}
      okButtonProps={{ loading: wechatCodeSubmitLoading }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <img src={status.wechat_qrcode} alt='微信二维码' style={{ marginBottom: 16 }} />
      </div>
      <div style={{ textAlign: 'center', marginBottom: 16 }}>
        <p>{t('微信扫码关注公众号，输入「验证码」获取验证码（三分钟内有效）')}</p>
      </div>
      <div className='lg2-form' style={{ width: '100%', padding: 0, margin: 0 }}>
        <div className='lg2-ipt-group'>
          <label className='auth-label'>{t('验证码')}</label>
          <div className='auth-ipt'>
            <input
              placeholder={t('验证码')}
              value={inputs.wechat_verification_code}
              onChange={(e) => handleChange('wechat_verification_code', e.target.value)}
            />
          </div>
        </div>
      </div>
    </Modal>
  );

  /* 2FA 弹窗 */
  const twoFAModal = (
    <Modal
      title={t('两步验证')}
      visible={showTwoFA}
      onCancel={handleBackToLogin}
      footer={null}
      width={450}
      centered
    >
      <TwoFAVerification
        onSuccess={handle2FASuccess}
        onBack={handleBackToLogin}
        isModal={true}
      />
    </Modal>
  );

  /* OAuth 按钮列表 */
  const oauthButtons = (
    <div>
      {status.wechat_login && (
        <button className='lg2-oauth-btn' onClick={onWeChatLoginClicked} disabled={wechatLoading}>
          <span style={{ color: '#07C160', display: 'flex', alignItems: 'center' }}><WeChatIcon /></span>
          {t('使用 微信 继续')}
        </button>
      )}
      {status.github_oauth && (
        <button className='lg2-oauth-btn' onClick={handleGitHubClick} disabled={githubLoading || githubButtonDisabled}>
          <IconGithubLogo size='large' />
          {githubButtonText}
        </button>
      )}
      {status.discord_oauth && (
        <button className='lg2-oauth-btn' onClick={handleDiscordClick} disabled={discordLoading}>
          <SiDiscord style={{ color: '#5865F2', width: 20, height: 20 }} />
          {t('使用 Discord 继续')}
        </button>
      )}
      {status.oidc_enabled && (
        <button className='lg2-oauth-btn' onClick={handleOIDCClick} disabled={oidcLoading}>
          <OIDCIcon style={{ color: '#1877F2' }} />
          {t('使用 OIDC 继续')}
        </button>
      )}
      {status.linuxdo_oauth && (
        <button className='lg2-oauth-btn' onClick={handleLinuxDOClick} disabled={linuxdoLoading}>
          <LinuxDoIcon style={{ color: '#E95420', width: 20, height: 20 }} />
          {t('使用 LinuxDO 继续')}
        </button>
      )}
      {status.custom_oauth_providers && status.custom_oauth_providers.map((provider) => (
        <button
          key={provider.slug}
          className='lg2-oauth-btn'
          onClick={() => handleCustomOAuthClick(provider)}
          disabled={customOAuthLoading[provider.slug]}
        >
          <IconLock size='large' />
          {t('使用 {{name}} 继续', { name: provider.name })}
        </button>
      ))}
      {status.telegram_oauth && (
        <div style={{ display: 'flex', justifyContent: 'center', margin: '8px 0' }}>
          <TelegramLoginButton
            dataOnauth={onTelegramLoginClicked}
            botName={status.telegram_bot_name}
          />
        </div>
      )}
      {status.passkey_login && passkeySupported && (
        <button className='lg2-oauth-btn' onClick={handlePasskeyLogin} disabled={passkeyLoading}>
          <IconKey size='large' />
          {t('使用 Passkey 登录')}
        </button>
      )}
    </div>
  );

  /* 邮箱登录表单 */
  const emailForm = (
    <form onSubmit={handleSubmit}>
      {status.passkey_login && passkeySupported && (
        <button type='button' className='lg2-oauth-btn' onClick={handlePasskeyLogin} disabled={passkeyLoading}
          style={{ marginBottom: 16 }}>
          <IconKey size='large' />
          {t('使用 Passkey 登录')}
        </button>
      )}

      <div className='lg2-ipt-group'>
        <label className='auth-label'>{t('用户名或邮箱')}</label>
        <div className='auth-ipt'>
          <input
            placeholder={t('请输入您的用户名或邮箱地址')}
            value={username}
            onChange={(e) => handleChange('username', e.target.value)}
            autoComplete='username'
          />
        </div>
      </div>

      <div className='lg2-ipt-group'>
        <label className='auth-label'>{t('密码')}</label>
        <div className='auth-ipt'>
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder={t('请输入您的密码')}
            value={password}
            onChange={(e) => handleChange('password', e.target.value)}
            autoComplete='current-password'
          />
          <span className='eye' onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? (
              <svg width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.8'>
                <path d='M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z'/><circle cx='12' cy='12' r='3'/>
              </svg>
            ) : (
              <svg width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.8'>
                <path d='M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z'/><circle cx='12' cy='12' r='3'/>
                <path d='m3 3 18 18' strokeWidth='1.6'/>
              </svg>
            )}
          </span>
        </div>
      </div>

      {termsBlock}

      <button
        type='submit'
        className='lg2-submit'
        disabled={loginLoading || ((hasUserAgreement || hasPrivacyPolicy) && !agreedToTerms)}
        style={{ marginBottom: 10 }}
      >
        {loginLoading ? t('登录中...') : t('登录 / 注册')}
      </button>

      <button
        type='button'
        className='lg2-link-btn'
        style={{ display: 'block', width: '100%', textAlign: 'center', marginTop: 10 }}
        onClick={handleResetPasswordClick}
        disabled={resetPasswordLoading}
      >
        {t('忘记密码？')}
      </button>

      {hasOAuth && (
        <>
          <div className='lg2-divider'>{t('或')}</div>
          <button
            type='button'
            className='lg2-oauth-btn'
            onClick={() => setShowEmailLogin(false)}
          >
            {t('其他登录选项')}
          </button>
        </>
      )}

      {!status.self_use_mode_enabled && (
        <div className='lg2-foot'>
          {t('没有账户？')}{' '}
          <Link to='/register'>{t('注册')}</Link>
        </div>
      )}
    </form>
  );

  /* OAuth 选项面板 */
  const oauthPanel = (
    <div>
      {oauthButtons}
      {termsBlock}
      <div className='lg2-divider'>{t('或')}</div>
      <button
        className='lg2-oauth-btn'
        onClick={() => setShowEmailLogin(true)}
        style={{ fontWeight: 600, background: 'var(--ink)', color: '#fff', border: 0 }}
      >
        {t('使用 邮箱或用户名 登录')}
      </button>
      {!status.self_use_mode_enabled && (
        <div className='lg2-foot'>
          {t('没有账户？')}{' '}
          <Link to='/register'>{t('注册')}</Link>
        </div>
      )}
    </div>
  );

  const showEmailForm = showEmailLogin || !hasOAuth;

  return (
    <div className='lg2'>
      {/* 左侧插画 Hero */}
      <div className='lg2-hero'>
        <img src='/login-hero.png' alt='' className='lg2-hero-img' />
        {/* 左上角 logo */}
        <div className='brand'>
          <span className='lg'>
            <svg width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
              <path d='M3 16c2.5 0 2.5-2 5-2s2.5 2 5 2 2.5-2 5-2'/>
              <path d='M4 11l8-6 8 6'/>
              <path d='M6 11v4M18 11v4'/>
            </svg>
          </span>
          <span style={{ fontSize: 36, fontWeight: 700, color: '#fff' }}>{systemName}</span>
        </div>
        {/* 左下角文案 */}
        <div className='lg2-hero-copy'>
          <h1>{t('统一云端')}<br/>{t('守护边缘')}</h1>
          <p>{t('企业级 AI 网关，统一管理多云模型资源。通过标准化 OpenAI 兼容协议，无缝集成全球主流大模型与本地部署，兼顾安全合规与成本效率')}</p>
        </div>
      </div>

      {/* 右侧表单 */}
      <div className='lg2-right'>
        {/* 右上角：语言/主题切换 */}
        <div className='lg2-topbar'>
          <ThemeToggle theme={theme} onThemeToggle={handleThemeToggle} t={t} />
          <LanguageSelector currentLang={currentLang} onLanguageChange={handleLanguageChange} t={t} />
        </div>

        <div className='lg2-form'>
          {/* 卡片头：logo + 系统名 */}
          <div className='lhead'>
            <span className='lg'>
              <svg width='22' height='22' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
                <path d='M3 16c2.5 0 2.5-2 5-2s2.5 2 5 2 2.5-2 5-2'/>
                <path d='M4 11l8-6 8 6'/>
                <path d='M6 11v4M18 11v4'/>
              </svg>
            </span>
            {systemName}
          </div>

          <div className='welc'>{t('欢迎登录')} {systemName}</div>

          {showEmailForm ? emailForm : oauthPanel}
        </div>

        {turnstileEnabled && (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '16px 0' }}>
            <Turnstile
              sitekey={turnstileSiteKey}
              onVerify={(token) => setTurnstileToken(token)}
            />
          </div>
        )}
      </div>

      {wechatModal}
      {twoFAModal}
    </div>
  );
};

export default LoginForm;
