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
import { Modal } from '@douyinfe/semi-ui';
import { SiTelegram, SiWechat, SiLinux, SiDiscord } from 'react-icons/si';
import TelegramLoginButton from 'react-telegram-login';
import {
  API,
  showError,
  showSuccess,
  onGitHubOAuthClicked,
  onOIDCClicked,
  onLinuxDOOAuthClicked,
  onDiscordOAuthClicked,
  onCustomOAuthClicked,
} from '../../../../helpers';
import TwoFASetting from '../components/TwoFASetting';

const AccountManagement = ({
  t,
  userState,
  status,
  systemToken,
  setShowEmailBindModal,
  setShowWeChatBindModal,
  generateAccessToken,
  handleSystemTokenClick,
  setShowChangePasswordModal,
  setShowAccountDeleteModal,
  passkeyStatus,
  passkeySupported,
  passkeyRegisterLoading,
  passkeyDeleteLoading,
  onPasskeyRegister,
  onPasskeyDelete,
}) => {
  const isBound = (accountId) => Boolean(accountId);
  const [showTelegramBindModal, setShowTelegramBindModal] =
    React.useState(false);
  const [customOAuthBindings, setCustomOAuthBindings] = React.useState([]);
  const [customOAuthLoading, setCustomOAuthLoading] = React.useState({});

  const loadCustomOAuthBindings = async () => {
    try {
      const res = await API.get('/api/user/oauth/bindings');
      if (res.data.success) {
        setCustomOAuthBindings(res.data.data || []);
      } else {
        showError(res.data.message || t('获取绑定信息失败'));
      }
    } catch (error) {
      showError(
        error.response?.data?.message || error.message || t('获取绑定信息失败'),
      );
    }
  };

  const handleUnbindCustomOAuth = async (providerId, providerName) => {
    Modal.confirm({
      title: t('确认解绑'),
      content: t('确定要解绑 {{name}} 吗？', { name: providerName }),
      okText: t('确认'),
      cancelText: t('取消'),
      onOk: async () => {
        setCustomOAuthLoading((prev) => ({ ...prev, [providerId]: true }));
        try {
          const res = await API.delete(
            `/api/user/oauth/bindings/${providerId}`,
          );
          if (res.data.success) {
            showSuccess(t('解绑成功'));
            await loadCustomOAuthBindings();
          } else {
            showError(res.data.message);
          }
        } catch (error) {
          showError(
            error.response?.data?.message || error.message || t('操作失败'),
          );
        } finally {
          setCustomOAuthLoading((prev) => ({ ...prev, [providerId]: false }));
        }
      },
    });
  };

  const handleBindCustomOAuth = (provider) => {
    onCustomOAuthClicked(provider);
  };

  const isCustomOAuthBound = (providerId) => {
    return customOAuthBindings.some((b) => b.provider_id === providerId);
  };

  const getCustomOAuthBinding = (providerId) => {
    return customOAuthBindings.find((b) => b.provider_id === providerId);
  };

  React.useEffect(() => {
    loadCustomOAuthBindings();
  }, []);

  const passkeyEnabled = passkeyStatus?.enabled;
  const lastUsedLabel = passkeyStatus?.last_used_at
    ? new Date(passkeyStatus.last_used_at).toLocaleString()
    : t('尚未使用');

  return (
    <div className='card card-pad srv-block'>
      {/* 区块标题 */}
      <div className='srv-sectitle'>
        <svg
          width='18'
          height='18'
          viewBox='0 0 24 24'
          fill='none'
          stroke='var(--ink-2)'
          strokeWidth='1.8'
        >
          <circle cx='12' cy='8' r='4' />
          <path d='M4 21a8 8 0 0 1 16 0' />
        </svg>
        {t('账户管理')}
      </div>
      <div className='srv-secsub'>{t('账户绑定、安全设置和身份验证')}</div>

      {/* 账户绑定区域 */}
      <div className='srv-bar' style={{ marginTop: '18px' }}>
        {t('账户绑定')}
      </div>
      <div className='srv-bind'>
        {/* 邮箱绑定 */}
        <div className='srv-bindcard'>
          <div className='l'>
            <span className='ic'>
              <svg
                width='16'
                height='16'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='1.8'
              >
                <rect x='3' y='5' width='18' height='14' rx='2' />
                <path d='m3 7 9 6 9-6' />
              </svg>
            </span>
            <div>
              <div className='nm'>{t('邮箱')}</div>
              <div className='st'>{userState.user?.email || t('未绑定')}</div>
            </div>
          </div>
          <a onClick={() => setShowEmailBindModal(true)}>
            {isBound(userState.user?.email) ? t('修改绑定') : t('绑定')}
          </a>
        </div>

        {/* 微信绑定 */}
        <div className='srv-bindcard'>
          <div className='l'>
            <span className='ic'>
              <svg
                width='16'
                height='16'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='1.8'
              >
                <path d='M8 12a4 4 0 1 1 8 0M5 9a7 7 0 0 1 14 0c0 5-3 7-3 7H8s-3-2-3-7z' />
              </svg>
            </span>
            <div>
              <div className='nm'>{t('微信')}</div>
              <div className='st'>
                {!status.wechat_login
                  ? t('未启用')
                  : isBound(userState.user?.wechat_id)
                    ? t('已绑定')
                    : t('未绑定')}
              </div>
            </div>
          </div>
          {status.wechat_login ? (
            <a onClick={() => setShowWeChatBindModal(true)}>
              {isBound(userState.user?.wechat_id) ? t('修改绑定') : t('绑定')}
            </a>
          ) : (
            <span className='off'>{t('未启用')}</span>
          )}
        </div>

        {/* GitHub绑定 */}
        <div className='srv-bindcard'>
          <div className='l'>
            <span className='ic'>
              <svg
                width='16'
                height='16'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='1.8'
              >
                <path d='M9 19c-4 1.5-4-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.3 4.3 0 0 0-.1-3.2s-1-.3-3.5 1.3a12 12 0 0 0-6 0C6.6 2 5.6 2.3 5.6 2.3a4.3 4.3 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 8.7c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V20' />
              </svg>
            </span>
            <div>
              <div className='nm'>GitHub</div>
              <div className='st'>
                {userState.user?.github_id || t('未绑定')}
              </div>
            </div>
          </div>
          {status.github_oauth && !isBound(userState.user?.github_id) ? (
            <a onClick={() => onGitHubOAuthClicked(status.github_client_id)}>
              {t('绑定')}
            </a>
          ) : (
            <span className='off'>
              {isBound(userState.user?.github_id) ? t('已绑定') : t('未启用')}
            </span>
          )}
        </div>

        {/* Discord绑定 */}
        <div className='srv-bindcard'>
          <div className='l'>
            <span className='ic'>
              <svg
                width='16'
                height='16'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='1.8'
              >
                <path d='M8 12h.01M16 12h.01M7 18c-2 0-3-1.5-3-4 0-4 2-7 5-8l1 2a9 9 0 0 1 4 0l1-2c3 1 5 4 5 8 0 2.5-1 4-3 4l-1-2a12 12 0 0 1-8 0z' />
              </svg>
            </span>
            <div>
              <div className='nm'>Discord</div>
              <div className='st'>
                {userState.user?.discord_id || t('未绑定')}
              </div>
            </div>
          </div>
          {status.discord_oauth && !isBound(userState.user?.discord_id) ? (
            <a onClick={() => onDiscordOAuthClicked(status.discord_client_id)}>
              {t('绑定')}
            </a>
          ) : (
            <span className='off'>
              {isBound(userState.user?.discord_id) ? t('已绑定') : t('未启用')}
            </span>
          )}
        </div>

        {/* OIDC绑定 */}
        <div className='srv-bindcard'>
          <div className='l'>
            <span className='ic'>
              <svg
                width='16'
                height='16'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='1.8'
              >
                <circle cx='12' cy='12' r='9' />
                <path d='M8 12h8' />
              </svg>
            </span>
            <div>
              <div className='nm'>OIDC</div>
              <div className='st'>{userState.user?.oidc_id || t('未绑定')}</div>
            </div>
          </div>
          {status.oidc_enabled && !isBound(userState.user?.oidc_id) ? (
            <a
              onClick={() =>
                onOIDCClicked(
                  status.oidc_authorization_endpoint,
                  status.oidc_client_id,
                )
              }
            >
              {t('绑定')}
            </a>
          ) : (
            <span className='off'>
              {isBound(userState.user?.oidc_id) ? t('已绑定') : t('未启用')}
            </span>
          )}
        </div>

        {/* Telegram绑定 */}
        <div className='srv-bindcard'>
          <div className='l'>
            <span className='ic'>
              <svg
                width='16'
                height='16'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='1.8'
              >
                <path d='M21 5 3 12l5 2 2 6 3-4 5 3z' />
              </svg>
            </span>
            <div>
              <div className='nm'>Telegram</div>
              <div className='st'>
                {userState.user?.telegram_id || t('未绑定')}
              </div>
            </div>
          </div>
          {status.telegram_oauth ? (
            isBound(userState.user?.telegram_id) ? (
              <span className='off'>{t('已绑定')}</span>
            ) : (
              <a onClick={() => setShowTelegramBindModal(true)}>{t('绑定')}</a>
            )
          ) : (
            <span className='off'>{t('未启用')}</span>
          )}
        </div>

        {/* LinuxDO绑定 */}
        <div className='srv-bindcard'>
          <div className='l'>
            <span className='ic'>
              <svg
                width='16'
                height='16'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='1.8'
              >
                <path d='M6 4v12a4 4 0 0 0 4 4h8' />
              </svg>
            </span>
            <div>
              <div className='nm'>LinuxDO</div>
              <div className='st'>
                {userState.user?.linux_do_id || t('未绑定')}
              </div>
            </div>
          </div>
          {status.linuxdo_oauth && !isBound(userState.user?.linux_do_id) ? (
            <a onClick={() => onLinuxDOOAuthClicked(status.linuxdo_client_id)}>
              {t('绑定')}
            </a>
          ) : (
            <span className='off'>
              {isBound(userState.user?.linux_do_id) ? t('已绑定') : t('未启用')}
            </span>
          )}
        </div>

        {/* 自定义 OAuth 提供商 */}
        {status.custom_oauth_providers &&
          status.custom_oauth_providers.map((provider) => {
            const bound = isCustomOAuthBound(provider.id);
            const binding = getCustomOAuthBinding(provider.id);
            return (
              <div key={provider.slug} className='srv-bindcard'>
                <div className='l'>
                  <span className='ic'>
                    <svg
                      width='16'
                      height='16'
                      viewBox='0 0 24 24'
                      fill='none'
                      stroke='currentColor'
                      strokeWidth='1.8'
                    >
                      <rect x='3' y='11' width='18' height='11' rx='2' />
                      <path d='M7 11V7a5 5 0 0 1 10 0v4' />
                    </svg>
                  </span>
                  <div>
                    <div className='nm'>{provider.name}</div>
                    <div className='st'>
                      {bound
                        ? binding?.provider_user_id || t('已绑定')
                        : t('未绑定')}
                    </div>
                  </div>
                </div>
                {bound ? (
                  <a
                    onClick={() =>
                      handleUnbindCustomOAuth(provider.id, provider.name)
                    }
                    style={{ color: 'var(--danger)' }}
                  >
                    {customOAuthLoading[provider.id] ? '...' : t('解绑')}
                  </a>
                ) : (
                  <a onClick={() => handleBindCustomOAuth(provider)}>
                    {t('绑定')}
                  </a>
                )}
              </div>
            );
          })}
      </div>

      {/* Telegram 绑定模态框 */}
      <Modal
        title={t('绑定 Telegram')}
        visible={showTelegramBindModal}
        onCancel={() => setShowTelegramBindModal(false)}
        footer={null}
      >
        <div className='my-3 text-sm text-gray-600'>
          {t('点击下方按钮通过 Telegram 完成绑定')}
        </div>
        <div className='flex justify-center'>
          <div className='scale-90'>
            <TelegramLoginButton
              dataAuthUrl='/api/oauth/telegram/bind'
              botName={status.telegram_bot_name}
            />
          </div>
        </div>
      </Modal>

      {/* 安全设置区域 */}
      <div className='srv-bar' style={{ marginTop: '24px' }}>
        {t('安全设置')}
      </div>

      {/* 系统访问令牌 */}
      <div className='srv-secrow'>
        <div>
          <div className='nm'>{t('系统访问令牌')}</div>
          <div className='ds'>{t('用于API调用的身份验证令牌，请妥善保管')}</div>
          {systemToken && (
            <input
              className='input'
              readOnly
              value={systemToken}
              onClick={handleSystemTokenClick}
              style={{ marginTop: '8px', maxWidth: '320px' }}
            />
          )}
        </div>
        <button className='btn btn-primary' onClick={generateAccessToken}>
          {systemToken ? t('重新生成') : t('生成令牌')}
        </button>
      </div>

      {/* 密码管理 */}
      <div className='srv-secrow'>
        <div>
          <div className='nm'>{t('密码管理')}</div>
          <div className='ds'>{t('定期更改密码可以提高账户安全性')}</div>
        </div>
        <button
          className='btn btn-primary'
          onClick={() => setShowChangePasswordModal(true)}
        >
          {t('修改密码')}
        </button>
      </div>

      {/* Passkey */}
      <div className='srv-secrow'>
        <div>
          <div className='nm'>{t('Passkey 登录')}</div>
          <div className='ds'>
            {passkeyEnabled
              ? t('已启用 Passkey，无需密码即可登录')
              : t('使用 Passkey 实现免密且更安全的登录体验')}
          </div>
          <div
            style={{
              fontSize: '12px',
              color: 'var(--ink-3)',
              marginTop: '4px',
            }}
          >
            {t('最后使用时间')}：{lastUsedLabel}
            {!passkeySupported && (
              <span
                style={{ marginLeft: '8px', color: 'var(--warning,#F59E0B)' }}
              >
                {t('当前设备不支持 Passkey')}
              </span>
            )}
          </div>
        </div>
        {passkeyEnabled ? (
          <button
            className='btn btn-primary'
            style={{ background: 'var(--ink-3)' }}
            disabled={passkeyDeleteLoading}
            onClick={() => {
              Modal.confirm({
                title: t('确认解绑 Passkey'),
                content: t('解绑后将无法使用 Passkey 登录，确定要继续吗？'),
                okText: t('确认解绑'),
                cancelText: t('取消'),
                okType: 'danger',
                onOk: onPasskeyDelete,
              });
            }}
          >
            {passkeyDeleteLoading ? '...' : t('解绑 Passkey')}
          </button>
        ) : (
          <button
            className='btn btn-primary'
            disabled={!passkeySupported || passkeyRegisterLoading}
            onClick={onPasskeyRegister}
          >
            {passkeyRegisterLoading ? '...' : t('注册 Passkey')}
          </button>
        )}
      </div>

      {/* 两步验证 */}
      <TwoFASetting t={t} />

      {/* 删除账户 */}
      <div className='srv-secrow'>
        <div>
          <div className='nm'>{t('删除账户')}</div>
          <div className='ds'>{t('此操作不可逆，所有数据将被永久删除')}</div>
        </div>
        <button
          className='btn btn-primary'
          style={{ background: 'var(--danger)' }}
          onClick={() => setShowAccountDeleteModal(true)}
        >
          {t('删除账户')}
        </button>
      </div>
    </div>
  );
};

export default AccountManagement;
