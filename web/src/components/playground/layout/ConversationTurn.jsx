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
import { useTranslation } from 'react-i18next';
import { MESSAGE_STATUS } from '../../../constants/playground.constants';
import RoleLabel from '../parts/RoleLabel';
import ModelMeta from '../parts/ModelMeta';
import TurnReasoningBlock from './TurnReasoningBlock';
import TurnActionBar from './TurnActionBar';
import MessageContent from '../MessageContent';

// 单条对话 turn 的文档流外壳。
// props:
//  - turn (message object: { id, role, content, reasoningContent, status, createAt, ...})
//  - modelLabel (string, 可选)
//  - styleState (传给 MessageContent)
//  - editingMessageId, editValue, setEditValue
//  - onCopy, onRetry, onEdit, onDelete
//  - onToggleReasoning, onEditSave, onEditCancel
const ConversationTurn = ({
  turn,
  modelLabel,
  styleState,
  editingMessageId,
  editValue,
  setEditValue,
  onCopy,
  onRetry,
  onEdit,
  onDelete,
  onToggleReasoning,
  onEditSave,
  onEditCancel,
}) => {
  const { t } = useTranslation();
  const isError = turn.status === MESSAGE_STATUS.ERROR;
  const isStreaming =
    turn.status === MESSAGE_STATUS.LOADING ||
    turn.status === MESSAGE_STATUS.INCOMPLETE;
  const isEditing = editingMessageId === turn.id;

  return (
    <article className='group relative py-5'>
      {/* 角色行 — user 右对齐，assistant 左对齐 */}
      <div
        className={`mb-3 flex items-center gap-2 ${
          turn.role === 'user' ? 'justify-end pr-1' : ''
        }`}
      >
        <RoleLabel role={turn.role} tone={isError ? 'error' : 'default'}>
          {turn.role === 'assistant' && (
            <ModelMeta
              model={
                /*
                 * 严格读取消息自身记录的模型，不再回退到 modelLabel（顶部当前选择）。
                 * 如此切换顶栏模型不会影响历史消息显示。turn.model 在创建
                 * loadingAssistantMessage 时由当时的 inputs.model 写入。
                 * 修复前生成的存量历史消息没有 turn.model 字段 → 不显示模型，
                 * 这是与「切换不变」目标对齐的可接受代价。
                 */
                turn.model
              }
              createAt={turn.createAt}
            />
          )}
          {turn.role === 'user' && <ModelMeta createAt={turn.createAt} />}
          {isError && (
            <span className='ml-1 text-[11px] uppercase tracking-wider text-red-500'>
              {t('failed')}
            </span>
          )}
        </RoleLabel>
      </div>

      {/* 思考块（仅 assistant） */}
      {turn.role === 'assistant' && turn.reasoningContent && (
        <TurnReasoningBlock
          content={turn.reasoningContent}
          expanded={!!turn.isReasoningExpanded}
          isThinkingComplete={!!turn.isThinkingComplete}
          onToggle={() => onToggleReasoning?.(turn.id)}
        />
      )}

      {/* 主内容容器：user 右对齐 + 卡片化；assistant 满宽文档流 */}
      <div className={turn.role === 'user' ? 'flex justify-end' : ''}>
        <div
          className={
            turn.role === 'user'
              ? 'inline-block max-w-[85%] md:max-w-[70%] rounded-2xl bg-zinc-100 px-4 py-3 text-zinc-900 dark:bg-zinc-800/60 dark:text-zinc-100'
              : 'w-full text-zinc-900 dark:text-zinc-100'
          }
        >
          <div className='text-[15px] leading-[1.65]'>
            {turn.status === MESSAGE_STATUS.LOADING && !turn.content ? (
              <span className='inline-flex items-center gap-1.5 text-zinc-400'>
                <span className='inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-zinc-400' />
                {t('正在生成…')}
              </span>
            ) : (
              <MessageContent
                message={turn}
                styleState={styleState}
                isEditing={isEditing}
                editValue={editValue}
                onEditValueChange={setEditValue}
                onEditSave={onEditSave}
                onEditCancel={onEditCancel}
                onToggleReasoningExpansion={onToggleReasoning}
              />
            )}
            {isStreaming && turn.role === 'assistant' && (
              <span
                aria-hidden='true'
                className='ml-0.5 inline-block h-[1.1em] w-[2px] translate-y-[2px] animate-pulse bg-zinc-500 align-baseline dark:bg-zinc-400'
              />
            )}
          </div>
        </div>
      </div>

      {/* hover 操作栏 — user 右对齐，assistant 左对齐 */}
      {!isEditing && (
        <div className={turn.role === 'user' ? 'flex justify-end' : ''}>
          <TurnActionBar
            role={turn.role}
            onCopy={() => onCopy?.(turn)}
            onRetry={() => onRetry?.(turn)}
            onEdit={() => onEdit?.(turn)}
            onDelete={() => onDelete?.(turn)}
          />
        </div>
      )}
    </article>
  );
};

export default ConversationTurn;
