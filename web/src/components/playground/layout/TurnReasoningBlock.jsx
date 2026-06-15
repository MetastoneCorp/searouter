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
import { Brain, ChevronDown, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

// 折叠思考块。默认收起；流式中（isThinkingComplete=false）强制展开 + 呼吸点
// props:
//  - content: string
//  - expanded: boolean
//  - isThinkingComplete: boolean
//  - onToggle: () => void
const TurnReasoningBlock = ({
  content,
  expanded,
  isThinkingComplete,
  onToggle,
}) => {
  const { t } = useTranslation();
  if (!content) return null;

  const open = !isThinkingComplete || expanded;
  const preview = content.replace(/\s+/g, ' ').slice(0, 80);

  return (
    <div className='pgw2-reasoning'>
      <button
        type='button'
        onClick={onToggle}
        className='pgw2-reasoning-hd'
      >
        <Brain
          size={14}
          strokeWidth={2}
          className='ico'
        />
        <span>{t('Thinking')}</span>
        {!isThinkingComplete && (
          <span aria-hidden='true' className='pgw2-reasoning-dot' />
        )}
        <span style={{ marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', color: 'var(--ink-3)' }}>
          {open ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        </span>
      </button>

      {open ? (
        <div className='pgw2-reasoning-body'>{content}</div>
      ) : (
        <div className='pgw2-reasoning-preview'>
          {preview}
          {content.length > 80 ? '…' : ''}
        </div>
      )}
    </div>
  );
};

export default TurnReasoningBlock;
