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
import { Chat } from '@douyinfe/semi-ui';
import { Eye, EyeOff, Settings } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import CustomInputRender from './CustomInputRender';

const ChatArea = ({
  chatRef,
  message,
  inputs,
  styleState,
  showDebugPanel,
  showSettings,
  roleInfo,
  onMessageSend,
  onMessageCopy,
  onMessageReset,
  onMessageDelete,
  onStopGenerator,
  onClearMessages,
  onToggleDebugPanel,
  onToggleSettings,
  renderCustomChatContent,
  renderChatBoxAction,
}) => {
  const { t } = useTranslation();

  const renderInputArea = React.useCallback((props) => {
    return <CustomInputRender {...props} />;
  }, []);

  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        height: '100%',
        background: 'var(--surface)',
      }}
    >
      {/* 顶部工具栏 */}
      <div className='pgw-bar'>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {/* 移动端显示设置按钮 */}
          {styleState.isMobile && (
            <button
              className={`pgw-cfgbtn${showSettings ? ' active' : ''}`}
              onClick={onToggleSettings}
            >
              <Settings size={15} />
              {t('模型配置')}
            </button>
          )}
          {/* 桌面端显示当前模型名 */}
          {!styleState.isMobile && inputs.model && (
            <span style={{ fontSize: 13, color: 'var(--ink-2)' }}>
              {inputs.model}
            </span>
          )}
        </div>
        <button
          className={`pgw-dbg${showDebugPanel ? ' active' : ''}`}
          onClick={onToggleDebugPanel}
        >
          {showDebugPanel ? <EyeOff size={15} /> : <Eye size={15} />}
          {showDebugPanel ? t('隐藏调试') : t('显示调试')}
        </button>
      </div>

      {/* 聊天内容区域 */}
      <div style={{ flex: 1, overflow: 'hidden' }}>
        <Chat
          ref={chatRef}
          chatBoxRenderConfig={{
            renderChatBoxContent: renderCustomChatContent,
            renderChatBoxAction: renderChatBoxAction,
            renderChatBoxTitle: () => null,
          }}
          renderInputArea={renderInputArea}
          roleConfig={roleInfo}
          style={{
            height: '100%',
            maxWidth: '100%',
            overflow: 'hidden',
          }}
          chats={message}
          onMessageSend={onMessageSend}
          onMessageCopy={onMessageCopy}
          onMessageReset={onMessageReset}
          onMessageDelete={onMessageDelete}
          showClearContext
          showStopGenerate
          onStopGenerator={onStopGenerator}
          onClear={onClearMessages}
          className='h-full'
          placeholder={t('请输入您的问题...')}
        />
      </div>
    </div>
  );
};

export default ChatArea;
