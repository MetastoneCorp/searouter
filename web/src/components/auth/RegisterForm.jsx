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
import { Link, useNavigate } from 'react-router-dom';
import {
  API,
  getLogo,
  showError,
  showInfo,
  showSuccess,
  updateAPI,
  getSystemName,
  setUserData,
  onDiscordOAuthClicked,
} from '../../helpers';
import Turnstile from 'react-turnstile';
import { Checkbox, Modal } from '@douyinfe/semi-ui';
import {
  IconGithubLogo,
  IconLock,
} from '@douyinfe/semi-icons';
import {
  onGitHubOAuthClicked,
  onLinuxDOOAuthClicked,
  onOIDCClicked,
} from '../../helpers';
import OIDCIcon from '../common/logo/OIDCIcon';
import LinuxDoIcon from '../common/logo/LinuxDoIcon';
import WeChatIcon from '../common/logo/WeChatIcon';
import TelegramLoginButton from 'react-telegram-login/src';
import { UserContext } from '../../context/User';
import { StatusContext } from '../../context/Status';
import { useTranslation } from 'react-i18next';
import { SiDiscord } from 'react-icons/si';

const RegisterForm = () => {
  let navigate = useNavigate();
  const { t } = useTranslation();
  const githubButtonTextKeyByState = {
    idle: '使用 GitHub 继续',
    redirecting: '正在跳转 GitHub...',
    timeout: '请求超时，请刷新页面后重新发起 GitHub 登录',
  };
  const [inputs, setInputs] = useState({
    username: '',
    password: '',
    password2: '',
    email: '',
    verification_code: '',
    wechat_verification_code: '',
  });
  const { username, password, password2 } = inputs;
  const [userState, userDispatch] = useContext(UserContext);
  const [statusState] = useContext(StatusContext);
  const [turnstileEnabled, setTurnstileEnabled] = useState(false);
  const [turnstileSiteKey, setTurnstileSiteKey] = useState('');
  const [turnstileToken, setTurnstileToken] = useState('');
  const [showWeChatLoginModal, setShowWeChatLoginModal] = useState(false);
  const [showEmailRegister, setShowEmailRegister] = useState(false);
  const [wechatLoading, setWechatLoading] = useState(false);
  const [githubLoading, setGithubLoading] = useState(false);
  const [discordLoading, setDiscordLoading] = useState(false);
  const [oidcLoading, setOidcLoading] = useState(false);
  const [linuxdoLoading, setLinuxdoLoading] = useState(false);
  const [registerLoading, setRegisterLoading] = useState(false);
  const [verificationCodeLoading, setVerificationCodeLoading] = useState(false);
  const [wechatCodeSubmitLoading, setWechatCodeSubmitLoading] = useState(false);
  const [disableButton, setDisableButton] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [hasUserAgreement, setHasUserAgreement] = useState(false);
  const [hasPrivacyPolicy, setHasPrivacyPolicy] = useState(false);
  const [githubButtonState, setGithubButtonState] = useState('idle');
  const [githubButtonDisabled, setGithubButtonDisabled] = useState(false);
  const githubTimeoutRef = useRef(null);
  const githubButtonText = t(githubButtonTextKeyByState[githubButtonState]);
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);

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

  const [showEmailVerification, setShowEmailVerification] = useState(false);

  useEffect(() => {
    setShowEmailVerification(!!status?.email_verification);
    if (status?.turnstile_check) {
      setTurnstileEnabled(true);
      setTurnstileSiteKey(status.turnstile_site_key);
    }
    setHasUserAgreement(status?.user_agreement_enabled || false);
    setHasPrivacyPolicy(status?.privacy_policy_enabled || false);
  }, [status]);

  useEffect(() => {
    let countdownInterval = null;
    if (disableButton && countdown > 0) {
      countdownInterval = setInterval(() => setCountdown(countdown - 1), 1000);
    } else if (countdown === 0) {
      setDisableButton(false);
      setCountdown(30);
    }
    return () => clearInterval(countdownInterval);
  }, [disableButton, countdown]);

  useEffect(() => {
    return () => {
      if (githubTimeoutRef.current) clearTimeout(githubTimeoutRef.current);
    };
  }, []);

  const onWeChatLoginClicked = () => {
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
    if (password.length < 8) {
      showInfo('密码长度不得小于 8 位！');
      return;
    }
    if (password !== password2) {
      showInfo('两次输入的密码不一致');
      return;
    }
    if (username && password) {
      if (turnstileEnabled && turnstileToken === '') {
        showInfo('请稍后几秒重试，Turnstile 正在检查用户环境！');
        return;
      }
      setRegisterLoading(true);
      try {
        if (!affCode) affCode = localStorage.getItem('aff');
        inputs.aff_code = affCode;
        const res = await API.post(
          `/api/user/register?turnstile=${turnstileToken}`,
          inputs,
        );
        const { success, message } = res.data;
        if (success) {
          navigate('/login');
          showSuccess('注册成功！');
        } else {
          showError(message);
        }
      } catch (error) {
        showError('注册失败，请重试');
      } finally {
        setRegisterLoading(false);
      }
    }
  }

  const sendVerificationCode = async () => {
    if (inputs.email === '') return;
    if (turnstileEnabled && turnstileToken === '') {
      showInfo('请稍后几秒重试，Turnstile 正在检查用户环境！');
      return;
    }
    setVerificationCodeLoading(true);
    try {
      const res = await API.get(
        `/api/verification?email=${encodeURIComponent(inputs.email)}&turnstile=${turnstileToken}`,
      );
      const { success, message } = res.data;
      if (success) {
        showSuccess('验证码发送成功，请检查你的邮箱！');
        setDisableButton(true);
      } else {
        showError(message);
      }
    } catch (error) {
      showError('发送验证码失败，请重试');
    } finally {
      setVerificationCodeLoading(false);
    }
  };

  const handleGitHubClick = () => {
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
    setDiscordLoading(true);
    try {
      onDiscordOAuthClicked(status.discord_client_id, { shouldLogout: true });
    } finally {
      setTimeout(() => setDiscordLoading(false), 3000);
    }
  };

  const handleOIDCClick = () => {
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
    setLinuxdoLoading(true);
    try {
      onLinuxDOOAuthClicked(status.linuxdo_client_id, { shouldLogout: true });
    } finally {
      setTimeout(() => setLinuxdoLoading(false), 3000);
    }
  };

  const onTelegramLoginClicked = async (response) => {
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

  const hasOAuth = !!(
    status.github_oauth ||
    status.discord_oauth ||
    status.oidc_enabled ||
    status.wechat_login ||
    status.linuxdo_oauth ||
    status.telegram_oauth
  );

  const termsBlock = (hasUserAgreement || hasPrivacyPolicy) && (
    <div style={{ marginBottom: 18 }}>
      <label style={{ display: 'flex', alignItems: 'flex-start', gap: 9, fontSize: 12.5, color: 'var(--ink-2)', cursor: 'pointer' }}>
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
      <div>
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
      {status.telegram_oauth && (
        <div style={{ display: 'flex', justifyContent: 'center', margin: '8px 0' }}>
          <TelegramLoginButton
            dataOnauth={onTelegramLoginClicked}
            botName={status.telegram_bot_name}
          />
        </div>
      )}
    </div>
  );

  /* 邮箱注册表单 */
  const emailRegisterForm = (
    <form onSubmit={handleSubmit}>
      <div className='lg2-ipt-group'>
        <label className='auth-label'>{t('用户名')}</label>
        <div className='auth-ipt'>
          <input
            placeholder={t('请输入用户名')}
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
            placeholder={t('输入密码，最短 8 位，最长 20 位')}
            value={password}
            onChange={(e) => handleChange('password', e.target.value)}
            autoComplete='new-password'
          />
          <span className='eye' onClick={() => setShowPassword(!showPassword)}>
            <svg width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.8'>
              <path d='M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z'/><circle cx='12' cy='12' r='3'/>
              {!showPassword && <path d='m3 3 18 18' strokeWidth='1.6'/>}
            </svg>
          </span>
        </div>
      </div>

      <div className='lg2-ipt-group'>
        <label className='auth-label'>{t('确认密码')}</label>
        <div className='auth-ipt'>
          <input
            type={showPassword2 ? 'text' : 'password'}
            placeholder={t('确认密码')}
            value={password2}
            onChange={(e) => handleChange('password2', e.target.value)}
            autoComplete='new-password'
          />
          <span className='eye' onClick={() => setShowPassword2(!showPassword2)}>
            <svg width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.8'>
              <path d='M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z'/><circle cx='12' cy='12' r='3'/>
              {!showPassword2 && <path d='m3 3 18 18' strokeWidth='1.6'/>}
            </svg>
          </span>
        </div>
      </div>

      {showEmailVerification && (
        <>
          <div className='lg2-ipt-group'>
            <label className='auth-label'>{t('邮箱')}</label>
            <div className='auth-ipt-row'>
              <div className='auth-ipt'>
                <input
                  type='email'
                  placeholder={t('输入邮箱地址')}
                  value={inputs.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                />
              </div>
              <button
                type='button'
                className='auth-code-btn'
                onClick={sendVerificationCode}
                disabled={disableButton || verificationCodeLoading}
              >
                {disableButton ? `${t('重新发送')} (${countdown})` : t('获取验证码')}
              </button>
            </div>
          </div>
          <div className='lg2-ipt-group'>
            <label className='auth-label'>{t('验证码')}</label>
            <div className='auth-ipt'>
              <input
                placeholder={t('输入验证码')}
                value={inputs.verification_code}
                onChange={(e) => handleChange('verification_code', e.target.value)}
              />
            </div>
          </div>
        </>
      )}

      {termsBlock}

      <button
        type='submit'
        className='lg2-submit'
        disabled={registerLoading || ((hasUserAgreement || hasPrivacyPolicy) && !agreedToTerms)}
        style={{ marginBottom: 10 }}
      >
        {registerLoading ? t('注册中...') : t('注册')}
      </button>

      {hasOAuth && (
        <>
          <div className='lg2-divider'>{t('或')}</div>
          <button
            type='button'
            className='lg2-oauth-btn'
            onClick={() => setShowEmailRegister(false)}
          >
            {t('其他注册选项')}
          </button>
        </>
      )}

      <div className='lg2-foot'>
        {t('已有账户？')}{' '}
        <Link to='/login'>{t('登录')}</Link>
      </div>
    </form>
  );

  /* OAuth 选项面板 */
  const oauthPanel = (
    <div>
      {oauthButtons}
      <div className='lg2-divider'>{t('或')}</div>
      <button
        className='lg2-oauth-btn'
        onClick={() => setShowEmailRegister(true)}
        style={{ fontWeight: 600, background: 'var(--ink)', color: '#fff', border: 0 }}
      >
        {t('使用 用户名 注册')}
      </button>
      <div className='lg2-foot'>
        {t('已有账户？')}{' '}
        <Link to='/login'>{t('登录')}</Link>
      </div>
    </div>
  );

  const showEmailForm = showEmailRegister || !hasOAuth;

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
        <div className='lg2-form'>
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

          <div className='welc'>{t('创建账号')}</div>

          {showEmailForm ? emailRegisterForm : oauthPanel}
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
    </div>
  );
};

export default RegisterForm;
