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

import React, { useEffect, useState } from 'react';
import {
  API,
  showError,
  showInfo,
  showSuccess,
  getSystemName,
} from '../../helpers';
import Turnstile from 'react-turnstile';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const PasswordResetForm = () => {
  const { t } = useTranslation();
  const [inputs, setInputs] = useState({
    email: '',
  });
  const { email } = inputs;

  const [loading, setLoading] = useState(false);
  const [turnstileEnabled, setTurnstileEnabled] = useState(false);
  const [turnstileSiteKey, setTurnstileSiteKey] = useState('');
  const [turnstileToken, setTurnstileToken] = useState('');
  const [disableButton, setDisableButton] = useState(false);
  const [countdown, setCountdown] = useState(30);

  const systemName = getSystemName();

  useEffect(() => {
    let status = localStorage.getItem('status');
    if (status) {
      status = JSON.parse(status);
      if (status.turnstile_check) {
        setTurnstileEnabled(true);
        setTurnstileSiteKey(status.turnstile_site_key);
      }
    }
  }, []);

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

  function handleChange(value) {
    setInputs((inputs) => ({ ...inputs, email: value }));
  }

  async function handleSubmit(e) {
    if (e && e.preventDefault) e.preventDefault();
    if (!email) {
      showError(t('请输入邮箱地址'));
      return;
    }
    if (turnstileEnabled && turnstileToken === '') {
      showInfo(t('请稍后几秒重试，Turnstile 正在检查用户环境！'));
      return;
    }
    setDisableButton(true);
    setLoading(true);
    const res = await API.get(
      `/api/reset_password?email=${email}&turnstile=${turnstileToken}`,
    );
    const { success, message } = res.data;
    if (success) {
      showSuccess(t('重置邮件发送成功，请检查邮箱！'));
      setInputs({ ...inputs, email: '' });
    } else {
      showError(message);
    }
    setLoading(false);
  }

  return (
    <div className='lg2'>
      {/* 左侧品牌 Hero */}
      <div className='lg2-hero'>
        <div className='brand'>
          <span className='lg'>
            <svg width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
              <path d='M3 16c2.5 0 2.5-2 5-2s2.5 2 5 2 2.5-2 5-2'/>
              <path d='M4 11l8-6 8 6'/>
              <path d='M6 11v4M18 11v4'/>
            </svg>
          </span>
          {systemName}
        </div>

        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
          <div className='lg2-gtile' style={{ left: '4%', top: '24%', width: 118, height: 118, transform: 'rotate(-12deg)', fontSize: 15, color: '#fff' }}>MiniMax</div>
          <div className='lg2-gtile' style={{ left: '30%', top: '12%', width: 118, height: 118, transform: 'rotate(8deg)', color: '#E8B84B' }}>Qwen</div>
          <div className='lg2-gtile' style={{ left: '56%', top: '18%', width: 118, height: 118, transform: 'rotate(-5deg)', color: '#fff' }}>GPT</div>
          <div className='lg2-gtile' style={{ left: '6%', top: '50%', width: 118, height: 118, transform: 'rotate(6deg)', fontSize: 15, color: '#fff' }}>Claude</div>
          <div className='lg2-gtile' style={{ left: '58%', top: '48%', width: 118, height: 118, transform: 'rotate(10deg)', fontSize: 14, color: '#fff' }}>DeepSeek</div>
        </div>

        <h1>{t('统一云端')}<br/>{t('守护边缘')}</h1>
        <p>{t('企业级 AI 网关，统一管理多云模型资源。通过标准化 OpenAI 兼容协议，无缝集成全球主流大模型与本地部署，兼顾安全合规与成本效率')}</p>
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

          <div className='welc'>{t('密码重置')}</div>

          <form onSubmit={handleSubmit}>
            <div className='lg2-ipt-group'>
              <label className='auth-label'>{t('邮箱')}</label>
              <div className='auth-ipt'>
                <input
                  type='email'
                  placeholder={t('请输入您的邮箱地址')}
                  value={email}
                  onChange={(e) => handleChange(e.target.value)}
                  autoComplete='email'
                />
              </div>
            </div>

            <button
              type='submit'
              className='lg2-submit'
              disabled={loading || disableButton}
              style={{ marginBottom: 10 }}
            >
              {disableButton
                ? `${t('重试')} (${countdown})`
                : loading ? t('提交中...') : t('提交')}
            </button>
          </form>

          <div className='lg2-foot'>
            {t('想起来了？')}{' '}
            <Link to='/login'>{t('登录')}</Link>
          </div>
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
    </div>
  );
};

export default PasswordResetForm;
