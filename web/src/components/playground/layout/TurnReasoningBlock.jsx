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
    <div className='my-3 rounded-xl border-l-2 border-orange-500 bg-zinc-50 p-4 dark:bg-zinc-900/60'>
      <button
        type='button'
        onClick={onToggle}
        className='flex w-full items-center gap-2 text-left text-[12px] font-medium text-zinc-600 dark:text-zinc-300'
      >
        <Brain
          size={14}
          strokeWidth={2}
          className='text-orange-600 dark:text-orange-400'
        />
        <span className='tracking-wide'>{t('Thinking')}</span>
        {!isThinkingComplete && (
          <span
            aria-hidden='true'
            className='inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-orange-500'
          />
        )}
        <span className='ml-auto inline-flex items-center text-zinc-400'>
          {open ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        </span>
      </button>

      {open ? (
        <div className='mt-2 whitespace-pre-wrap text-[13px] leading-relaxed text-zinc-600 dark:text-zinc-400'>
          {content}
        </div>
      ) : (
        <div className='mt-1 truncate text-[12px] text-zinc-500 dark:text-zinc-500'>
          {preview}
          {content.length > 80 ? '…' : ''}
        </div>
      )}
    </div>
  );
};

export default TurnReasoningBlock;
