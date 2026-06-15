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
    <article className='pgw2-turn'>
      {/* 角色行 — user 右对齐，assistant 左对齐 */}
      <div className={`pgw2-turn-role${turn.role === 'user' ? ' user' : ''}`}>
        <RoleLabel role={turn.role} tone={isError ? 'error' : 'default'}>
          {turn.role === 'assistant' && (
            <ModelMeta
              model={turn.model}
              createAt={turn.createAt}
            />
          )}
          {turn.role === 'user' && <ModelMeta createAt={turn.createAt} />}
          {isError && (
            <span style={{ marginLeft: 4, fontSize: 11, textTransform: 'uppercase', letterSpacing: '.08em', color: 'var(--danger)' }}>
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
      <div className={turn.role === 'user' ? 'pgw2-turn-role user' : ''}>
        <div
          className={turn.role === 'user' ? 'pgw2-user-bubble' : ''}
          style={turn.role !== 'user' ? { fontSize: 14.5, lineHeight: 1.65, color: 'var(--ink)' } : {}}
        >
          <div style={{ fontSize: 14.5, lineHeight: 1.65 }}>
            {turn.status === MESSAGE_STATUS.LOADING && !turn.content ? (
              <span className='pgw2-loading'>
                <span className='pgw2-dot' />
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
              <span aria-hidden='true' className='pgw2-cursor' />
            )}
          </div>
        </div>
      </div>

      {/* hover 操作栏 — user 右对齐，assistant 左对齐 */}
      {!isEditing && (
        <div className={turn.role === 'user' ? 'pgw2-turn-role user' : ''}>
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
