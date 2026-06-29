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

import React, { useRef, useEffect, useState, useContext } from 'react';
import { Form, Toast, Switch } from '@douyinfe/semi-ui';
import {
  renderQuotaWithPrompt,
  API,
  showSuccess,
  showError,
} from '../../../../helpers';
import CodeViewer from '../../../playground/CodeViewer';
import { StatusContext } from '../../../../context/Status';
import { UserContext } from '../../../../context/User';
import { useUserPermissions } from '../../../../hooks/common/useUserPermissions';
import {
  mergeAdminConfig,
  useSidebar,
} from '../../../../hooks/common/useSidebar';

const NotificationSettings = ({
  t,
  notificationSettings,
  handleNotificationSettingChange,
  saveNotificationSettings,
}) => {
  const formApiRef = useRef(null);
  const [statusState] = useContext(StatusContext);
  const [userState] = useContext(UserContext);

  const [sidebarLoading, setSidebarLoading] = useState(false);
  const [sidebarModulesUser, setSidebarModulesUser] = useState({
    chat: { enabled: true, playground: true, chat: true },
    console: {
      enabled: true,
      detail: true,
      token: true,
      log: true,
      midjourney: true,
      task: true,
    },
    personal: { enabled: true, topup: true, personal: true },
    admin: {
      enabled: true,
      channel: true,
      models: true,
      deployment: true,
      redemption: true,
      user: true,
      setting: true,
    },
  });
  const [adminConfig, setAdminConfig] = useState(null);

  const {
    hasSidebarSettingsPermission,
    isSidebarSectionAllowed,
    isSidebarModuleAllowed,
  } = useUserPermissions();

  const { refreshUserConfig } = useSidebar();

  const handleSectionChange = (sectionKey) => (checked) => {
    setSidebarModulesUser((prev) => ({
      ...prev,
      [sectionKey]: { ...prev[sectionKey], enabled: checked },
    }));
  };

  const handleModuleChange = (sectionKey, moduleKey) => (checked) => {
    setSidebarModulesUser((prev) => ({
      ...prev,
      [sectionKey]: { ...prev[sectionKey], [moduleKey]: checked },
    }));
  };

  const saveSidebarSettings = async () => {
    setSidebarLoading(true);
    try {
      const res = await API.put('/api/user/self', {
        sidebar_modules: JSON.stringify(sidebarModulesUser),
      });
      if (res.data.success) {
        showSuccess(t('侧边栏设置保存成功'));
        await refreshUserConfig();
      } else {
        showError(res.data.message);
      }
    } catch (error) {
      showError(t('保存失败'));
    }
    setSidebarLoading(false);
  };

  const resetSidebarModules = () => {
    setSidebarModulesUser({
      chat: { enabled: true, playground: true, chat: true },
      console: {
        enabled: true,
        detail: true,
        token: true,
        log: true,
        midjourney: true,
        task: true,
      },
      personal: { enabled: true, topup: true, personal: true },
      admin: {
        enabled: true,
        channel: true,
        models: true,
        deployment: true,
        redemption: true,
        user: true,
        setting: true,
      },
    });
  };

  useEffect(() => {
    const loadSidebarConfigs = async () => {
      try {
        if (statusState?.status?.SidebarModulesAdmin) {
          try {
            const adminConf = JSON.parse(
              statusState.status.SidebarModulesAdmin,
            );
            setAdminConfig(mergeAdminConfig(adminConf));
          } catch (error) {
            setAdminConfig(mergeAdminConfig(null));
          }
        } else {
          setAdminConfig(mergeAdminConfig(null));
        }

        const userRes = await API.get('/api/user/self');
        if (userRes.data.success && userRes.data.data.sidebar_modules) {
          let userConf;
          if (typeof userRes.data.data.sidebar_modules === 'string') {
            userConf = JSON.parse(userRes.data.data.sidebar_modules);
          } else {
            userConf = userRes.data.data.sidebar_modules;
          }
          setSidebarModulesUser(userConf);
        }
      } catch (error) {
        console.error('加载边栏配置失败:', error);
      }
    };
    loadSidebarConfigs();
  }, [statusState]);

  useEffect(() => {
    if (formApiRef.current && notificationSettings) {
      formApiRef.current.setValues(notificationSettings);
    }
  }, [notificationSettings]);

  const handleFormChange = (field, value) => {
    handleNotificationSettingChange(field, value);
  };

  const isAllowedByAdmin = (sectionKey, moduleKey = null) => {
    if (!adminConfig) return true;
    if (moduleKey) {
      return (
        adminConfig[sectionKey]?.enabled && adminConfig[sectionKey]?.[moduleKey]
      );
    }
    return adminConfig[sectionKey]?.enabled;
  };

  const sectionConfigs = [
    {
      key: 'chat',
      title: t('聊天区域'),
      description: t('操练场和聊天功能'),
      modules: [
        {
          key: 'playground',
          title: t('操练场'),
          description: t('AI模型测试环境'),
        },
        { key: 'chat', title: t('聊天'), description: t('聊天会话管理') },
      ],
    },
    {
      key: 'console',
      title: t('控制台区域'),
      description: t('数据管理和日志查看'),
      modules: [
        { key: 'detail', title: t('数据看板'), description: t('系统数据统计') },
        { key: 'token', title: t('令牌管理'), description: t('API令牌管理') },
        { key: 'log', title: t('使用日志'), description: t('API使用记录') },
        {
          key: 'midjourney',
          title: t('绘图日志'),
          description: t('绘图任务记录'),
        },
        { key: 'task', title: t('任务日志'), description: t('系统任务记录') },
      ],
    },
    {
      key: 'personal',
      title: t('个人中心区域'),
      description: t('用户个人功能'),
      modules: [
        { key: 'topup', title: t('钱包管理'), description: t('余额充值管理') },
        {
          key: 'personal',
          title: t('个人设置'),
          description: t('个人信息设置'),
        },
      ],
    },
    {
      key: 'admin',
      title: t('管理员区域'),
      description: t('系统管理功能'),
      modules: [
        { key: 'channel', title: t('渠道管理'), description: t('API渠道配置') },
        { key: 'models', title: t('模型管理'), description: t('AI模型配置') },
        {
          key: 'deployment',
          title: t('模型部署'),
          description: t('模型部署管理'),
        },
        {
          key: 'redemption',
          title: t('兑换码管理'),
          description: t('兑换码生成管理'),
        },
        { key: 'user', title: t('用户管理'), description: t('用户账户管理') },
        {
          key: 'setting',
          title: t('系统设置'),
          description: t('系统参数配置'),
        },
      ],
    },
  ]
    .filter((section) => isSidebarSectionAllowed(section.key))
    .map((section) => ({
      ...section,
      modules: section.modules.filter((module) =>
        isSidebarModuleAllowed(section.key, module.key),
      ),
    }))
    .filter(
      (section) => section.modules.length > 0 && isAllowedByAdmin(section.key),
    );

  const handleSubmit = () => {
    if (formApiRef.current) {
      formApiRef.current
        .validate()
        .then(() => saveNotificationSettings())
        .catch(() => Toast.error(t('请检查表单填写是否正确')));
    } else {
      saveNotificationSettings();
    }
  };

  return (
    <div className='card card-pad srv-block'>
      {/* 其他设置标题 */}
      <div className='srv-sectitle'>
        <svg
          width='18'
          height='18'
          viewBox='0 0 24 24'
          fill='none'
          stroke='var(--ink-2)'
          strokeWidth='1.8'
        >
          <circle cx='12' cy='12' r='3' />
          <path d='M19.4 13.5a7.8 7.8 0 0 0 0-3l1.6-1.2-2-3.4-1.9.8a7.6 7.6 0 0 0-2.6-1.5L14 2h-4l-.5 2.2a7.6 7.6 0 0 0-2.6 1.5l-1.9-.8-2 3.4 1.6 1.2a7.8 7.8 0 0 0 0 3L3 14.7l2 3.4 1.9-.8a7.6 7.6 0 0 0 2.6 1.5L10 22h4l.5-2.2a7.6 7.6 0 0 0 2.6-1.5l1.9.8 2-3.4z' />
        </svg>
        {t('其他设置')}
      </div>
      <div className='srv-secsub'>{t('通知、价格和隐私相关设置')}</div>

      {/* 通知配置卡 */}
      <div style={{ marginTop: '28px' }}>
        <div className='srv-bar'>{t('通知配置')}</div>
        <Form
          getFormApi={(api) => (formApiRef.current = api)}
          initValues={notificationSettings}
          onSubmit={handleSubmit}
        >
          {() => (
            <>
              {/* 通知方式单选 */}
              <div className='field-label'>
                {t('通知方式')}{' '}
                <span style={{ color: 'var(--danger)' }}>*</span>
              </div>
              <div className='srv-radio-row'>
                {[
                  { value: 'email', label: t('邮件通知') },
                  { value: 'webhook', label: t('Webhook通知') },
                  { value: 'bark', label: t('Bark通知') },
                  { value: 'gotify', label: t('Gotify通知') },
                ].map((opt) => (
                  <label
                    key={opt.value}
                    className={`srv-radio${notificationSettings.warningType === opt.value ? ' on' : ''}`}
                    onClick={() => handleFormChange('warningType', opt.value)}
                  >
                    <span className='rd'></span>
                    {opt.label}
                  </label>
                ))}
              </div>

              {/* 额度预警阈值 */}
              <div style={{ marginTop: '18px' }}>
                <div className='field-label'>
                  {t('额度预警阈值')}{' '}
                  <span style={{ color: 'var(--ink-3)', fontWeight: 400 }}>
                    {renderQuotaWithPrompt(
                      notificationSettings.warningThreshold,
                    )}
                  </span>{' '}
                  <span style={{ color: 'var(--danger)' }}>*</span>
                </div>
                <input
                  className='input'
                  value={notificationSettings.warningThreshold}
                  onChange={(e) => handleFormChange('warningThreshold', e)}
                  style={{ maxWidth: '280px' }}
                />
                <div className='helper'>
                  {t(
                    '当钱包或订阅剩余额度低于此数值时，系统将通过选择的方式发送通知',
                  )}
                </div>
              </div>

              {/* 邮件通知设置 */}
              {notificationSettings.warningType === 'email' && (
                <div style={{ marginTop: '16px' }}>
                  <div className='field-label'>{t('通知邮箱')}</div>
                  <input
                    className='input'
                    placeholder={t('留空则使用账号绑定的邮箱')}
                    value={notificationSettings.notificationEmail}
                    onChange={(e) => handleFormChange('notificationEmail', e)}
                    style={{ maxWidth: '320px' }}
                  />
                  <div className='helper'>
                    {t(
                      '设置用于接收额度预警的邮箱地址，不填则使用账号绑定的邮箱',
                    )}
                  </div>
                </div>
              )}

              {/* Webhook通知设置 */}
              {notificationSettings.warningType === 'webhook' && (
                <>
                  <div style={{ marginTop: '16px' }}>
                    <div className='field-label'>{t('Webhook地址')}</div>
                    <input
                      className='input'
                      placeholder={t(
                        '请输入Webhook地址，例如: https://example.com/webhook',
                      )}
                      value={notificationSettings.webhookUrl}
                      onChange={(e) => handleFormChange('webhookUrl', e)}
                    />
                    <div className='helper'>
                      {t(
                        '只支持HTTPS，系统将以POST方式发送通知，请确保地址可以接收POST请求',
                      )}
                    </div>
                  </div>
                  <div style={{ marginTop: '16px' }}>
                    <div className='field-label'>{t('接口凭证')}</div>
                    <input
                      className='input'
                      placeholder={t('请输入密钥')}
                      value={notificationSettings.webhookSecret}
                      onChange={(e) => handleFormChange('webhookSecret', e)}
                      style={{ maxWidth: '320px' }}
                    />
                    <div className='helper'>
                      {t(
                        '密钥将以Bearer方式添加到请求头中，用于验证webhook请求的合法性',
                      )}
                    </div>
                  </div>
                  <div style={{ marginTop: '16px' }}>
                    <div className='field-label'>
                      {t('Webhook请求结构说明')}
                    </div>
                    <div style={{ height: '200px', marginBottom: '12px' }}>
                      <CodeViewer
                        content={{
                          type: 'quota_exceed',
                          title: '额度预警通知',
                          content: '您的额度即将用尽，当前剩余额度为 {{value}}',
                          values: ['$0.99'],
                          timestamp: 1739950503,
                        }}
                        title='webhook'
                        language='json'
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Bark推送设置 */}
              {notificationSettings.warningType === 'bark' && (
                <div style={{ marginTop: '16px' }}>
                  <div className='field-label'>{t('Bark推送URL')}</div>
                  <input
                    className='input'
                    placeholder={t(
                      '请输入Bark推送URL，例如: https://api.day.app/yourkey/{{title}}/{{content}}',
                    )}
                    value={notificationSettings.barkUrl}
                    onChange={(e) => handleFormChange('barkUrl', e)}
                  />
                  <div className='helper'>
                    {t(
                      '支持HTTP和HTTPS，模板变量: {{title}} (通知标题), {{content}} (通知内容)',
                    )}
                  </div>
                </div>
              )}

              {/* Gotify推送设置 */}
              {notificationSettings.warningType === 'gotify' && (
                <>
                  <div style={{ marginTop: '16px' }}>
                    <div className='field-label'>{t('Gotify服务器地址')}</div>
                    <input
                      className='input'
                      placeholder={t(
                        '请输入Gotify服务器地址，例如: https://gotify.example.com',
                      )}
                      value={notificationSettings.gotifyUrl}
                      onChange={(e) => handleFormChange('gotifyUrl', e)}
                    />
                    <div className='helper'>
                      {t('支持HTTP和HTTPS，填写Gotify服务器的完整URL地址')}
                    </div>
                  </div>
                  <div style={{ marginTop: '16px' }}>
                    <div className='field-label'>{t('Gotify应用令牌')}</div>
                    <input
                      className='input'
                      placeholder={t('请输入Gotify应用令牌')}
                      value={notificationSettings.gotifyToken}
                      onChange={(e) => handleFormChange('gotifyToken', e)}
                      style={{ maxWidth: '320px' }}
                    />
                    <div className='helper'>
                      {t('在Gotify服务器创建应用后获得的令牌，用于发送通知')}
                    </div>
                  </div>
                  <div style={{ marginTop: '16px' }}>
                    <div className='field-label'>{t('消息优先级')}</div>
                    <select
                      className='select'
                      style={{ maxWidth: '200px' }}
                      value={notificationSettings.gotifyPriority}
                      onChange={(e) =>
                        handleFormChange(
                          'gotifyPriority',
                          parseInt(e.target.value),
                        )
                      }
                    >
                      <option value={0}>{t('0 - 最低')}</option>
                      <option value={2}>{t('2 - 低')}</option>
                      <option value={5}>{t('5 - 正常（默认）')}</option>
                      <option value={8}>{t('8 - 高')}</option>
                      <option value={10}>{t('10 - 最高')}</option>
                    </select>
                    <div className='helper'>
                      {t('消息优先级，范围0-10，默认为5')}
                    </div>
                  </div>
                </>
              )}

              <div className='srv-saverow'>
                <button
                  className='btn btn-primary'
                  type='button'
                  onClick={handleSubmit}
                >
                  {t('保存设置')}
                </button>
              </div>
            </>
          )}
        </Form>
      </div>

      {/* 价格设置卡 */}
      <div style={{ marginTop: '28px' }}>
        <div className='srv-bar'>{t('价格设置')}</div>
        <div className='row between'>
          <div style={{ fontSize: '13.5px', fontWeight: 600 }}>
            {t('接受未设置价格模型')}
          </div>
          <Switch
            checked={notificationSettings.acceptUnsetModelRatioModel}
            onChange={(value) =>
              handleFormChange('acceptUnsetModelRatioModel', value)
            }
            size='default'
          />
        </div>
        <div className='helper' style={{ margin: '8px 0 0' }}>
          {t(
            '当模型没有设置价格时仍接受调用，仅当您信任该网站时使用，可能会产生高额费用',
          )}
        </div>
        <div className='srv-saverow'>
          <button
            className='btn btn-primary'
            onClick={saveNotificationSettings}
          >
            {t('保存设置')}
          </button>
        </div>
      </div>

      {/* 隐私设置卡 */}
      <div style={{ marginTop: '28px' }}>
        <div className='srv-bar'>{t('隐私设置')}</div>
        <div className='row between'>
          <div style={{ fontSize: '13.5px', fontWeight: 600 }}>
            {t('记录请求与错误日志IP')}
          </div>
          <Switch
            checked={notificationSettings.recordIpLog}
            onChange={(value) => handleFormChange('recordIpLog', value)}
            size='default'
          />
        </div>
        <div className='helper' style={{ margin: '8px 0 0' }}>
          {t('开启后，仅"消费"和"错误"日志将记录您的客户端IP地址')}
        </div>
        <div className='srv-saverow'>
          <button
            className='btn btn-primary'
            onClick={saveNotificationSettings}
          >
            {t('保存设置')}
          </button>
        </div>
      </div>

      {/* 边栏设置（权限控制） */}
      {hasSidebarSettingsPermission() && (
        <div style={{ marginTop: '28px' }}>
          <div className='srv-bar'>{t('边栏设置')}</div>
          <div className='helper' style={{ marginBottom: '14px' }}>
            {t('您可以个性化设置侧边栏的要显示功能')}
          </div>

          {sectionConfigs.map((section) => (
            <div key={section.key} style={{ marginBottom: '20px' }}>
              {/* 区域标题行 */}
              <div
                className='row between'
                style={{
                  background: 'var(--surface-2)',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  padding: '12px 16px',
                  marginBottom: '10px',
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, fontSize: '13.5px' }}>
                    {section.title}
                  </div>
                  <div className='helper' style={{ marginTop: '2px' }}>
                    {section.description}
                  </div>
                </div>
                <Switch
                  checked={sidebarModulesUser[section.key]?.enabled !== false}
                  onChange={handleSectionChange(section.key)}
                  size='default'
                />
              </div>

              {/* 功能模块网格 */}
              <div className='srv-side-grid'>
                {section.modules
                  .filter((module) => isAllowedByAdmin(section.key, module.key))
                  .map((module) => (
                    <div
                      key={module.key}
                      className='srv-side-item'
                      style={{
                        border: '1px solid var(--border)',
                        borderRadius: '8px',
                        padding: '10px 14px',
                        opacity:
                          sidebarModulesUser[section.key]?.enabled === false
                            ? 0.5
                            : 1,
                      }}
                    >
                      <div>
                        <div className='nm'>{module.title}</div>
                        <div className='ds'>{module.description}</div>
                      </div>
                      <Switch
                        checked={
                          sidebarModulesUser[section.key]?.[module.key] !==
                          false
                        }
                        onChange={handleModuleChange(section.key, module.key)}
                        size='default'
                        disabled={
                          sidebarModulesUser[section.key]?.enabled === false
                        }
                      />
                    </div>
                  ))}
              </div>
            </div>
          ))}

          <div className='srv-saverow'>
            <button className='btn btn-ghost' onClick={resetSidebarModules}>
              {t('设置为默认')}
            </button>
            <button
              className='btn btn-primary'
              onClick={saveSidebarSettings}
              disabled={sidebarLoading}
            >
              {sidebarLoading ? '...' : t('保存设置')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationSettings;
