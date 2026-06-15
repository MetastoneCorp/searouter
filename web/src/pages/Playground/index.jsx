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

import React, {
  useContext,
  useEffect,
  useCallback,
} from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Toast } from '@douyinfe/semi-ui';

// Context
import { UserContext } from '../../context/User';
import { useIsMobile } from '../../hooks/common/useIsMobile';

// hooks
import { usePlaygroundState } from '../../hooks/playground/usePlaygroundState';
import { useMessageActions } from '../../hooks/playground/useMessageActions';
import { useApiRequest } from '../../hooks/playground/useApiRequest';
import { useSyncMessageAndCustomBody } from '../../hooks/playground/useSyncMessageAndCustomBody';
import { useMessageEdit } from '../../hooks/playground/useMessageEdit';
import { useDataLoader } from '../../hooks/playground/useDataLoader';
import { useApiKey } from '../../hooks/playground/useApiKey';

// Constants and utils
import {
  MESSAGE_ROLES,
  ERROR_MESSAGES,
} from '../../constants/playground.constants';
import {
  createMessage,
  createLoadingAssistantMessage,
  buildApiPayload,
} from '../../helpers';

// Components
import PlaygroundShell from '../../components/playground/layout/PlaygroundShell';
import { PlaygroundProvider } from '../../contexts/PlaygroundContext';

const Playground = () => {
  const { t } = useTranslation();
  const [userState] = useContext(UserContext);
  const isMobile = useIsMobile();
  const styleState = { isMobile };
  const [searchParams] = useSearchParams();
  const isLoggedIn = !!userState?.user;

  const state = usePlaygroundState();
  const {
    inputs,
    parameterEnabled,
    showDebugPanel,
    customRequestMode,
    customRequestBody,
    models,
    groups,
    message,
    debugData,
    activeDebugTab,
    previewPayload,
    sseSourceRef,
    handleInputChange,
    handleParameterToggle,
    debouncedSaveConfig,
    saveMessagesImmediately,
    setMessage,
    setDebugData,
    setActiveDebugTab,
    setPreviewPayload,
    setShowDebugPanel,
    setCustomRequestMode,
    setCustomRequestBody,
  } = state;

  // ApiKey 单源派生：useApiKey 内含 localStorage 同步 + hasAuth
  const { apiKey, setApiKey, hasAuth } = useApiKey({
    isLoggedIn,
    onChange: () => state.setModels([]), // ApiKey 变更后重新加载模型
  });

  // API 请求相关
  const { sendRequest, onStopGenerator } = useApiRequest(
    setMessage,
    setDebugData,
    setActiveDebugTab,
    sseSourceRef,
    saveMessagesImmediately,
    isLoggedIn,
  );

  // 数据加载
  useDataLoader(userState, inputs, handleInputChange, state.setModels, state.setGroups);

  // 消息编辑
  const {
    editingMessageId,
    editValue,
    setEditValue,
    handleMessageEdit,
    handleEditSave,
    handleEditCancel,
  } = useMessageEdit(
    setMessage,
    inputs,
    parameterEnabled,
    sendRequest,
    saveMessagesImmediately,
  );

  // 消息和自定义请求体同步
  const { syncMessageToCustomBody, syncCustomBodyToMessage } =
    useSyncMessageAndCustomBody(
      customRequestMode,
      customRequestBody,
      message,
      inputs,
      setCustomRequestBody,
      setMessage,
      debouncedSaveConfig,
    );

  // 消息操作
  const messageActions = useMessageActions(
    message,
    setMessage,
    onMessageSend,
    saveMessagesImmediately,
  );

  // 流式状态：最后一条消息处于 loading/incomplete 即视为流式中
  const isStreaming = (() => {
    if (!Array.isArray(message) || message.length === 0) return false;
    const last = message[message.length - 1];
    return last?.status === 'loading' || last?.status === 'incomplete';
  })();

  // 构建预览请求体
  const constructPreviewPayload = useCallback(() => {
    try {
      if (customRequestMode && customRequestBody && customRequestBody.trim()) {
        try {
          return JSON.parse(customRequestBody);
        } catch (parseError) {
          console.warn('自定义请求体JSON解析失败，回退到默认预览:', parseError);
        }
      }
      const messages = [...message];
      return buildApiPayload(messages, null, inputs, parameterEnabled);
    } catch (error) {
      console.error('构造预览请求体失败:', error);
      return null;
    }
  }, [inputs, parameterEnabled, message, customRequestMode, customRequestBody]);

  // 发送消息
  function onMessageSend(content, attachment) {
    console.log('attachment: ', attachment);

    // 鉴权守卫：未登录且未填 ApiKey → 阻止发送，引导用户去 ApiKeyBanner
    if (!isLoggedIn && !apiKey) {
      Toast.warning(t('请先填入 API Key 才能发送请求'));
      const el = document.getElementById('pg-apikey-anchor');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }

    const userMessage = createMessage(MESSAGE_ROLES.USER, content);
    const loadingMessage = createLoadingAssistantMessage(inputs?.model);

    if (customRequestMode && customRequestBody) {
      try {
        const customPayload = JSON.parse(customRequestBody);
        setMessage((prevMessage) => {
          const newMessages = [...prevMessage, userMessage, loadingMessage];
          sendRequest(customPayload, customPayload.stream !== false);
          setTimeout(() => saveMessagesImmediately(newMessages), 0);
          return newMessages;
        });
        return;
      } catch (error) {
        console.error('自定义请求体JSON解析失败:', error);
        Toast.error(ERROR_MESSAGES.JSON_PARSE_ERROR);
        return;
      }
    }

    const userMessageFinal = createMessage(MESSAGE_ROLES.USER, content);

    setMessage((prevMessage) => {
      const newMessages = [...prevMessage, userMessageFinal];
      const payload = buildApiPayload(
        newMessages,
        null,
        inputs,
        parameterEnabled,
      );
      sendRequest(payload, inputs.stream);
      const messagesWithLoading = [...newMessages, loadingMessage];
      setTimeout(() => saveMessagesImmediately(messagesWithLoading), 0);
      return messagesWithLoading;
    });
  }

  // 切换推理展开状态
  const toggleReasoningExpansion = useCallback(
    (messageId) => {
      setMessage((prevMessages) =>
        prevMessages.map((msg) =>
          msg.id === messageId && msg.role === MESSAGE_ROLES.ASSISTANT
            ? { ...msg, isReasoningExpanded: !msg.isReasoningExpanded }
            : msg,
        ),
      );
    },
    [setMessage],
  );

  // Effects
  useEffect(() => {
    syncMessageToCustomBody();
  }, [message, syncMessageToCustomBody]);

  useEffect(() => {
    syncCustomBodyToMessage();
  }, [customRequestBody, syncCustomBodyToMessage]);

  useEffect(() => {
    if (searchParams.get('expired')) {
      Toast.warning(t('登录过期，请重新登录！'));
    }
  }, [searchParams, t]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const preview = constructPreviewPayload();
      setPreviewPayload(preview);
      setDebugData((prev) => ({
        ...prev,
        previewRequest: preview ? JSON.stringify(preview, null, 2) : null,
        previewTimestamp: preview ? new Date().toISOString() : null,
      }));
    }, 300);
    return () => clearTimeout(timer);
  }, [
    message,
    inputs,
    parameterEnabled,
    customRequestMode,
    customRequestBody,
    constructPreviewPayload,
    setPreviewPayload,
    setDebugData,
  ]);

  useEffect(() => {
    debouncedSaveConfig();
  }, [
    inputs,
    parameterEnabled,
    showDebugPanel,
    customRequestMode,
    customRequestBody,
    debouncedSaveConfig,
  ]);

  // 清空对话
  const handleClearMessages = useCallback(() => {
    setMessage([]);
    setTimeout(() => saveMessagesImmediately([]), 0);
  }, [setMessage, saveMessagesImmediately]);

  const playgroundContextValue = {};

  return (
    <PlaygroundProvider value={playgroundContextValue}>
      <PlaygroundShell
        // 鉴权
        isLoggedIn={isLoggedIn}
        apiKey={apiKey}
        hasAuth={hasAuth}
        onApiKeyChange={setApiKey}
        // 配置/setters
        inputs={inputs}
        parameterEnabled={parameterEnabled}
        customRequestMode={customRequestMode}
        customRequestBody={customRequestBody}
        onInputChange={handleInputChange}
        onParameterToggle={handleParameterToggle}
        onCustomRequestModeChange={setCustomRequestMode}
        onCustomRequestBodyChange={setCustomRequestBody}
        // 模型/分组
        models={models}
        groups={groups}
        // 消息
        message={message}
        setMessage={setMessage}
        saveMessages={saveMessagesImmediately}
        onMessageSend={onMessageSend}
        onStopGenerator={onStopGenerator}
        onClearMessages={handleClearMessages}
        // 调试
        showDebugPanel={showDebugPanel}
        setShowDebugPanel={setShowDebugPanel}
        debugData={debugData}
        activeDebugTab={activeDebugTab}
        setActiveDebugTab={setActiveDebugTab}
        previewPayload={previewPayload}
        // 视觉
        isMobile={isMobile}
        // 流式状态
        isStreaming={isStreaming}
        // 视觉/状态共享
        styleState={styleState}
        messageActions={messageActions || {}}
        // 编辑相关 (Phase 3)
        editingMessageId={editingMessageId}
        editValue={editValue}
        setEditValue={setEditValue}
        onToggleReasoning={toggleReasoningExpansion}
        onEditSave={handleEditSave}
        onEditCancel={handleEditCancel}
        onEditTurn={handleMessageEdit}
      />
    </PlaygroundProvider>
  );
};

export default Playground;
