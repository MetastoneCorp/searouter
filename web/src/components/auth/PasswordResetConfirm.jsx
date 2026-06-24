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
import { API, copy, showError, showNotice, getSystemName } from '../../helpers';
import { useSearchParams, Link } from 'react-router-dom';
import { Banner } from '@douyinfe/semi-ui';
import { useTranslation } from 'react-i18next';

const PasswordResetConfirm = () => {
  const { t } = useTranslation();
  const [inputs, setInputs] = useState({
    email: '',
    token: '',
  });
  const { email, token } = inputs;
  const isValidResetLink = email && token;

  const [loading, setLoading] = useState(false);
  const [disableButton, setDisableButton] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const [newPassword, setNewPassword] = useState('');
  const [searchParams] = useSearchParams();

  const systemName = getSystemName();

  useEffect(() => {
    let tokenVal = searchParams.get('token');
    let emailVal = searchParams.get('email');
    setInputs({
      token: tokenVal || '',
      email: emailVal || '',
    });
  }, [searchParams]);

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

  async function handleSubmit(e) {
    if (e && e.preventDefault) e.preventDefault();
    if (!email || !token) {
      showError(t('无效的重置链接，请重新发起密码重置请求'));
      return;
    }
    setDisableButton(true);
    setLoading(true);
    const res = await API.post(`/api/user/reset`, { email, token });
    const { success, message } = res.data;
    if (success) {
      let password = res.data.data;
      setNewPassword(password);
      await copy(password);
      showNotice(`${t('密码已重置并已复制到剪贴板：')} ${password}`);
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
              <path d='M3 16c2.5 0 2.5-2 5-2s2.5 2 5 2 2.5-2 5-2' />
              <path d='M4 11l8-6 8 6' />
              <path d='M6 11v4M18 11v4' />
            </svg>
          </span>
          {systemName}
        </div>

        <div
          style={{
            position: 'absolute',
            inset: 0,
            overflow: 'hidden',
            pointerEvents: 'none',
          }}
        >
          <div
            className='lg2-gtile'
            style={{
              left: '4%',
              top: '24%',
              width: 118,
              height: 118,
              transform: 'rotate(-12deg)',
              fontSize: 15,
              color: '#fff',
            }}
          >
            MiniMax
          </div>
          <div
            className='lg2-gtile'
            style={{
              left: '30%',
              top: '12%',
              width: 118,
              height: 118,
              transform: 'rotate(8deg)',
              color: '#E8B84B',
            }}
          >
            Qwen
          </div>
          <div
            className='lg2-gtile'
            style={{
              left: '56%',
              top: '18%',
              width: 118,
              height: 118,
              transform: 'rotate(-5deg)',
              color: '#fff',
            }}
          >
            GPT
          </div>
          <div
            className='lg2-gtile'
            style={{
              left: '6%',
              top: '50%',
              width: 118,
              height: 118,
              transform: 'rotate(6deg)',
              fontSize: 15,
              color: '#fff',
            }}
          >
            Claude
          </div>
          <div
            className='lg2-gtile'
            style={{
              left: '58%',
              top: '48%',
              width: 118,
              height: 118,
              transform: 'rotate(10deg)',
              fontSize: 14,
              color: '#fff',
            }}
          >
            DeepSeek
          </div>
        </div>

        <h1>
          {t('统一云端')}
          <br />
          {t('守护边缘')}
        </h1>
        <p>
          {t(
            '企业级 AI 网关，统一管理多云模型资源。通过标准化 OpenAI 兼容协议，无缝集成全球主流大模型与本地部署，兼顾安全合规与成本效率',
          )}
        </p>
      </div>

      {/* 右侧表单 */}
      <div className='lg2-right'>
        <div className='lg2-form'>
          <div className='lhead'>
            <span className='lg'>
              <svg
                width='22'
                height='22'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
              >
                <path d='M3 16c2.5 0 2.5-2 5-2s2.5 2 5 2 2.5-2 5-2' />
                <path d='M4 11l8-6 8 6' />
                <path d='M6 11v4M18 11v4' />
              </svg>
            </span>
            {systemName}
          </div>

          <div className='welc'>{t('密码重置确认')}</div>

          {!isValidResetLink && (
            <Banner
              type='danger'
              description={t('无效的重置链接，请重新发起密码重置请求')}
              style={{ borderRadius: 8, marginBottom: 18 }}
              closeIcon={null}
            />
          )}

          <form onSubmit={handleSubmit}>
            <div className='lg2-ipt-group'>
              <label className='auth-label'>{t('邮箱')}</label>
              <div className='auth-ipt'>
                <input
                  type='email'
                  value={email}
                  disabled={true}
                  placeholder={email ? '' : t('等待获取邮箱信息...')}
                  style={{
                    background: 'var(--surface-2)',
                    color: 'var(--ink-3)',
                    cursor: 'not-allowed',
                  }}
                />
              </div>
            </div>

            {newPassword && (
              <div className='lg2-ipt-group'>
                <label className='auth-label'>{t('新密码')}</label>
                <div className='auth-ipt'>
                  <input
                    value={newPassword}
                    disabled={true}
                    style={{
                      background: 'var(--surface-2)',
                      color: 'var(--ink-3)',
                      cursor: 'not-allowed',
                      paddingRight: 80,
                    }}
                  />
                  <span
                    style={{
                      position: 'absolute',
                      right: 10,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      cursor: 'pointer',
                    }}
                    onClick={async () => {
                      await copy(newPassword);
                      showNotice(`${t('密码已复制到剪贴板：')} ${newPassword}`);
                    }}
                  >
                    <button
                      type='button'
                      style={{
                        background: 'transparent',
                        border: 0,
                        cursor: 'pointer',
                        color: 'var(--brand-600)',
                        fontSize: 12,
                        fontWeight: 600,
                        fontFamily: 'inherit',
                        padding: '2px 6px',
                      }}
                    >
                      {t('复制')}
                    </button>
                  </span>
                </div>
              </div>
            )}

            <button
              type='submit'
              className='lg2-submit'
              disabled={
                disableButton || !!newPassword || !isValidResetLink || loading
              }
              style={{ marginBottom: 10 }}
            >
              {newPassword
                ? t('密码重置完成')
                : loading
                  ? t('重置中...')
                  : t('确认重置密码')}
            </button>
          </form>

          <div className='lg2-foot'>
            <Link to='/login'>{t('返回登录')}</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PasswordResetConfirm;
