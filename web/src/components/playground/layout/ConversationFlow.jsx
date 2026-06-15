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
import Composer from './Composer';
import ConversationTurn from './ConversationTurn';
import ScrollToLatest from './ScrollToLatest';
import { useScrollToBottom } from '../../../hooks/playground/useScrollToBottom';

// active 态布局：上方 turn 列表（独立滚动）+ 下方 sticky composer
// 视口高度由父容器通过 height/flex 提供；本组件占满父高度
const ConversationFlow = ({
  messages,
  modelLabel,
  styleState,
  editingMessageId,
  editValue,
  setEditValue,
  composerValue,
  onComposerChange,
  onSend,
  onStop,
  isStreaming,
  hasSystemPrompt,
  disabled,
  disabledHint,
  inlineWarning,
  onCopy,
  onRetry,
  onEdit,
  onDelete,
  onToggleReasoning,
  onEditSave,
  onEditCancel,
}) => {
  // 滚动控制：消息变化或流式追加时自动贴底；用户上滚后暂停
  const lastTurn = messages?.[messages.length - 1];
  const { containerRef, atBottom, scrollToBottom } = useScrollToBottom([
    messages?.length,
    lastTurn?.content,
    lastTurn?.reasoningContent,
  ]);

  return (
    <div className='relative flex h-full w-full flex-col px-3 sm:px-6'>
      {/* 滚动容器：撑满至 sticky composer 上沿 */}
      <div ref={containerRef} className='pg-scroll relative flex-1 overflow-y-auto'>
        <div className='divide-y divide-zinc-100 dark:divide-zinc-800/60'>
          {messages.map((turn, idx) => (
            <ConversationTurn
              key={turn.id || idx}
              turn={turn}
              modelLabel={modelLabel}
              styleState={styleState}
              editingMessageId={editingMessageId}
              editValue={editValue}
              setEditValue={setEditValue}
              onCopy={onCopy}
              onRetry={onRetry}
              onEdit={onEdit}
              onDelete={onDelete}
              onToggleReasoning={onToggleReasoning}
              onEditSave={onEditSave}
              onEditCancel={onEditCancel}
            />
          ))}
        </div>
        {/* 浮动「跳到最新」按钮 */}
        <ScrollToLatest visible={!atBottom} onClick={() => scrollToBottom()} />
      </div>

      {/* Composer 上沿渐变遮罩，防止内容紧贴 */}
      <div
        aria-hidden='true'
        className='pointer-events-none -mt-6 h-6 bg-gradient-to-t from-white to-transparent dark:from-zinc-950'
      />

      {/* sticky composer */}
      <div className='sticky bottom-0 bg-white pb-4 pt-2 dark:bg-zinc-950'>
        <Composer
          value={composerValue}
          onChange={onComposerChange}
          onSend={onSend}
          onStop={onStop}
          disabled={disabled}
          disabledHint={disabledHint}
          inlineWarning={inlineWarning}
          isStreaming={isStreaming}
          hasSystemPrompt={hasSystemPrompt}
          viewTransitionName='composer'
        />
      </div>
    </div>
  );
};

export default ConversationFlow;
