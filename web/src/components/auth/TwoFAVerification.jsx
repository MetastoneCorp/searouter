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
import { API, showError, showSuccess, getSystemName } from '../../helpers';
import { Divider, Typography } from '@douyinfe/semi-ui';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const { Text } = Typography;

const TwoFAVerification = ({ onSuccess, onBack, isModal = false }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [useBackupCode, setUseBackupCode] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');

  const systemName = getSystemName();

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!verificationCode) {
      showError('请输入验证码');
      return;
    }
    if (useBackupCode && verificationCode.length !== 8) {
      showError('备用码必须是8位');
      return;
    } else if (!useBackupCode && !/^\d{6}$/.test(verificationCode)) {
      showError('验证码必须是6位数字');
      return;
    }

    setLoading(true);
    try {
      const res = await API.post('/api/user/login/2fa', {
        code: verificationCode,
      });

      if (res.data.success) {
        showSuccess('登录成功');
        localStorage.setItem('user', JSON.stringify(res.data.data));
        if (onSuccess) {
          onSuccess(res.data.data);
        }
      } else {
        showError(res.data.message);
      }
    } catch (error) {
      showError('验证失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSubmit();
  };

  /* 在弹窗内使用（简洁版，无外层容器） */
  if (isModal) {
    return (
      <div style={{ paddingTop: 8 }}>
        <p style={{ color: 'var(--ink-2)', marginBottom: 18, fontSize: 14 }}>
          {t('请输入认证器应用显示的验证码完成登录')}
        </p>

        <form onSubmit={handleSubmit}>
          <div className='lg2-ipt-group' style={{ marginBottom: 20 }}>
            <label className='auth-label'>
              {useBackupCode ? t('备用码') : t('验证码')}
            </label>
            <div className='auth-ipt'>
              <input
                placeholder={
                  useBackupCode ? t('请输入8位备用码') : t('请输入6位验证码')
                }
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                onKeyPress={handleKeyPress}
                autoFocus
                style={{
                  fontSize: 16,
                  letterSpacing: useBackupCode ? 2 : 6,
                  textAlign: 'center',
                }}
              />
            </div>
          </div>

          <button
            type='submit'
            className='lg2-submit'
            disabled={loading}
            style={{ marginBottom: 14 }}
          >
            {loading ? t('验证中...') : t('验证并登录')}
          </button>
        </form>

        <Divider margin='12px' />

        <div style={{ display: 'flex', justifyContent: 'center', gap: 24 }}>
          <button
            type='button'
            className='lg2-link-btn'
            onClick={() => {
              setUseBackupCode(!useBackupCode);
              setVerificationCode('');
            }}
          >
            {useBackupCode ? t('使用认证器验证码') : t('使用备用码')}
          </button>
          {onBack && (
            <button type='button' className='lg2-link-btn' onClick={onBack}>
              {t('返回登录')}
            </button>
          )}
        </div>

        <div
          style={{
            marginTop: 18,
            padding: '12px 14px',
            background: 'var(--surface-2)',
            borderRadius: 8,
            border: '1px solid var(--border-2)',
          }}
        >
          <Text size='small' type='secondary'>
            <strong>{t('提示：')}</strong>
            <br />
            {t('• 验证码每30秒更新一次')}
            <br />
            {t('• 如果无法获取验证码，请使用备用码')}
            <br />
            {t('• 每个备用码只能使用一次')}
          </Text>
        </div>
      </div>
    );
  }

  /* 独立页面版（双栏布局） */
  return (
    <div className='lg2'>
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

          <div className='welc'>{t('两步验证')}</div>

          <p style={{ color: 'var(--ink-2)', marginBottom: 24, fontSize: 14 }}>
            {t('请输入认证器应用显示的验证码完成登录')}
          </p>

          <form onSubmit={handleSubmit}>
            <div className='lg2-ipt-group'>
              <label className='auth-label'>
                {useBackupCode ? t('备用码') : t('验证码')}
              </label>
              <div className='auth-ipt'>
                <input
                  placeholder={
                    useBackupCode ? t('请输入8位备用码') : t('请输入6位验证码')
                  }
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  onKeyPress={handleKeyPress}
                  autoFocus
                  style={{
                    fontSize: 16,
                    letterSpacing: useBackupCode ? 2 : 6,
                    textAlign: 'center',
                  }}
                />
              </div>
            </div>

            <button
              type='submit'
              className='lg2-submit'
              disabled={loading}
              style={{ marginBottom: 16 }}
            >
              {loading ? t('验证中...') : t('验证并登录')}
            </button>
          </form>

          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: 24,
              marginBottom: 20,
            }}
          >
            <button
              type='button'
              className='lg2-link-btn'
              onClick={() => {
                setUseBackupCode(!useBackupCode);
                setVerificationCode('');
              }}
            >
              {useBackupCode ? t('使用认证器验证码') : t('使用备用码')}
            </button>
            {onBack && (
              <button type='button' className='lg2-link-btn' onClick={onBack}>
                {t('返回登录')}
              </button>
            )}
          </div>

          <div
            style={{
              padding: '14px 16px',
              background: 'var(--surface-2)',
              borderRadius: 8,
              border: '1px solid var(--border-2)',
            }}
          >
            <Text size='small' type='secondary'>
              <strong>{t('提示：')}</strong>
              <br />
              {t('• 验证码每30秒更新一次')}
              <br />
              {t('• 如果无法获取验证码，请使用备用码')}
              <br />
              {t('• 每个备用码只能使用一次')}
            </Text>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TwoFAVerification;
