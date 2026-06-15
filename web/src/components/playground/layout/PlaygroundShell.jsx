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

import React, { useState } from 'react';
import { Toast } from '@douyinfe/semi-ui';
import { useTranslation } from 'react-i18next';

import EmptyCradle from './EmptyCradle';
import PlaygroundSubHeader from './PlaygroundSubHeader';
import SettingsSideSheet from './SettingsSideSheet';
import DebugDrawer from './DebugDrawer';
import PlaygroundErrorBoundary from './PlaygroundErrorBoundary';
import ConversationFlow from './ConversationFlow';
import { useViewTransition } from '../../../hooks/playground/useViewTransition';

// PlaygroundShell：所有 hooks 在父组件 (Playground/index.jsx) 计算后，
// 通过 props 注入。Shell 仅做布局编排 + 双态切换。
const PlaygroundShell = ({
  // 鉴权
  isLoggedIn,
  apiKey,
  hasAuth,
  onApiKeyChange,
  // 状态/setters
  inputs,
  parameterEnabled,
  customRequestMode,
  customRequestBody,
  onInputChange,
  onParameterToggle,
  onCustomRequestModeChange,
  onCustomRequestBodyChange,
  // 模型/分组
  models,
  groups,
  // 消息
  message,
  setMessage,
  saveMessages,
  onMessageSend, // (content) => void  外部组装 user turn + 调 sendRequest
  onStopGenerator,
  onClearMessages,
  // 调试
  showDebugPanel,
  setShowDebugPanel,
  debugData,
  activeDebugTab,
  setActiveDebugTab,
  previewPayload,
  // 视觉
  isMobile,
  // 流式状态推断
  isStreaming,
  // 视觉/状态
  styleState,
  messageActions,
  // 编辑相关 (Phase 3)
  editingMessageId,
  editValue,
  setEditValue,
  onToggleReasoning,
  onEditSave,
  onEditCancel,
  onEditTurn,
}) => {
  const { t } = useTranslation();
  const [composerValue, setComposerValue] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const withTransition = useViewTransition();

  const isEmpty = !Array.isArray(message) || message.length === 0;
  const hasSystemPrompt = !!(inputs?.systemPrompt && inputs.systemPrompt.trim());

  // 守卫：未登录无 Key 时阻止发送
  const guardSend = (content) => {
    if (!hasAuth) {
      Toast.warning(t('请先在右上角配置 API Key'));
      return false;
    }
    if (!inputs?.model) {
      // 由 Composer inlineWarning 显示
      return false;
    }
    if (isStreaming) return false;
    return true;
  };

  const handleSend = (content) => {
    if (!guardSend(content)) return;
    // 第一条消息触发 view-transition：Composer 从 cradle 中部平滑过渡到 active 底部
    // 后续消息直接发，不重复触发动画
    if (isEmpty) {
      withTransition(() => onMessageSend?.(content));
    } else {
      onMessageSend?.(content);
    }
    setComposerValue('');
  };

  // 优先级：未配置 API Key（最基础前置）→ 未选模型 → null
  const inlineWarning = !hasAuth
    ? t('请先在右上角配置 API Key 才能开始对话')
    : !inputs?.model
      ? t('请先选择模型')
      : null;

  const disabledHint = !hasAuth
    ? t('请先在右上角配置 API Key 才能开始对话')
    : null;

  return (
    <div
      className='min-h-[100dvh] w-full bg-white dark:bg-zinc-950'
      style={{ paddingTop: 'var(--isuanova-header-height)' }}
    >
      <PlaygroundSubHeader
        inputs={inputs}
        models={models}
        groups={groups}
        isLoggedIn={isLoggedIn}
        apiKey={apiKey}
        customRequestMode={customRequestMode}
        showSettings={showSettings}
        hasMessages={!isEmpty}
        onInputChange={onInputChange}
        onApiKeyChange={onApiKeyChange}
        onToggleSettings={() => setShowSettings((s) => !s)}
        onNewChat={onClearMessages}
      />

      {isEmpty ? (
        <PlaygroundErrorBoundary onReset={onClearMessages}>
          <EmptyCradle
            composerValue={composerValue}
            onComposerChange={setComposerValue}
            onSend={handleSend}
            onStop={onStopGenerator}
            isStreaming={isStreaming}
            hasSystemPrompt={hasSystemPrompt}
            disabled={!hasAuth || isStreaming}
            disabledHint={disabledHint}
            inlineWarning={inlineWarning}
            showTrustNote={!isLoggedIn}
          />
        </PlaygroundErrorBoundary>
      ) : (
        // Phase 3：active 态切到 ConversationFlow（文档流，自管滚动 + sticky composer）
        <div
          className='mx-auto flex w-full max-w-[1400px] flex-col overflow-hidden px-4 sm:px-6'
          style={{
            height:
              'calc(100dvh - var(--isuanova-header-height) - 56px)',
          }}
        >
          <PlaygroundErrorBoundary onReset={onClearMessages}>
            <ConversationFlow
              messages={message}
              modelLabel={inputs?.model}
              styleState={styleState}
              editingMessageId={editingMessageId}
              editValue={editValue}
              setEditValue={setEditValue}
              composerValue={composerValue}
              onComposerChange={setComposerValue}
              onSend={handleSend}
              onStop={onStopGenerator}
              isStreaming={isStreaming}
              hasSystemPrompt={hasSystemPrompt}
              disabled={!hasAuth || isStreaming}
              disabledHint={disabledHint}
              inlineWarning={inlineWarning}
              onCopy={messageActions?.handleMessageCopy}
              onRetry={messageActions?.handleMessageReset}
              onEdit={onEditTurn}
              onDelete={messageActions?.handleMessageDelete}
              onToggleReasoning={onToggleReasoning}
              onEditSave={onEditSave}
              onEditCancel={onEditCancel}
            />
          </PlaygroundErrorBoundary>
        </div>
      )}

      <SettingsSideSheet
        visible={showSettings}
        onClose={() => setShowSettings(false)}
        inputs={inputs}
        parameterEnabled={parameterEnabled}
        customRequestMode={customRequestMode}
        customRequestBody={customRequestBody}
        previewPayload={previewPayload}
        isMobile={isMobile}
        onInputChange={onInputChange}
        onParameterToggle={onParameterToggle}
        onCustomRequestModeChange={onCustomRequestModeChange}
        onCustomRequestBodyChange={onCustomRequestBodyChange}
      />

      <DebugDrawer
        visible={showDebugPanel}
        onClose={() => setShowDebugPanel(false)}
        isMobile={isMobile}
        debugData={debugData}
        activeDebugTab={activeDebugTab}
        onActiveDebugTabChange={setActiveDebugTab}
        customRequestMode={customRequestMode}
      />
    </div>
  );
};

export default PlaygroundShell;
