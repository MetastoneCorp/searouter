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

import React, { useEffect, useRef, useState } from 'react';
import { SendHorizontal, Square } from 'lucide-react';
import { useTranslation } from 'react-i18next';

// 双态共用的输入框；位置由父组件控制（cradle 内/sticky 底部）。
// 视觉始终一致：只切位置，让 view-transition 平滑成立。
//
// props:
//  - value, onChange       受控 textarea
//  - onSend(content)       发送回调
//  - onStop()              流式中点击 Stop 触发
//  - disabled              整体禁用
//  - disabledHint          禁用时 tooltip 文本（显示在 Send 按钮 hover）
//  - inlineWarning         顶部 inline 警示（如「请先选择模型」），可选
//  - isStreaming           true 时 Send 变 Stop
//  - hasSystemPrompt       true 时显示「系统提示 已设」
//  - autoFocus             挂载时聚焦
//  - viewTransitionName    用于 view-transition 的稳定 name（建议 "composer"）
const Composer = ({
  value,
  onChange,
  onSend,
  onStop,
  disabled = false,
  disabledHint,
  inlineWarning,
  isStreaming = false,
  hasSystemPrompt = false,
  autoFocus = false,
  viewTransitionName = 'composer',
}) => {
  const { t } = useTranslation();
  const taRef = useRef(null);
  const [showHint, setShowHint] = useState(false);

  // 自适应高度：56 → 200
  useEffect(() => {
    const ta = taRef.current;
    if (!ta) return;
    ta.style.height = 'auto';
    const next = Math.min(200, Math.max(56, ta.scrollHeight));
    ta.style.height = `${next}px`;
  }, [value]);

  useEffect(() => {
    if (autoFocus && taRef.current) {
      taRef.current.focus();
    }
  }, [autoFocus]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey && !e.isComposing) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = () => {
    if (disabled || isStreaming) return;
    const trimmed = (value || '').trim();
    if (!trimmed) return;
    onSend?.(trimmed);
  };

  const handlePrimaryClick = () => {
    if (isStreaming) {
      onStop?.();
    } else {
      handleSend();
    }
  };

  const canSend = !disabled && !!value && value.trim().length > 0;

  return (
    <div
      className='pg-composer relative w-full rounded-2xl border border-zinc-200 bg-white transition-colors duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] focus-within:border-transparent dark:border-zinc-800 dark:bg-zinc-900'
      style={{
        viewTransitionName: viewTransitionName,
      }}
    >
      {inlineWarning && (
        <div className='border-b border-red-100 bg-red-50/60 px-4 py-2 text-xs text-red-600 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300'>
          {inlineWarning}
        </div>
      )}

      <textarea
        ref={taRef}
        value={value || ''}
        onChange={(e) => onChange?.(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={t('Ask anything…')}
        disabled={disabled}
        rows={1}
        className='pg-scroll block w-full resize-none border-0 bg-transparent px-4 pt-4 pb-2 text-[15px] leading-relaxed text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-0 disabled:cursor-not-allowed disabled:opacity-60 dark:text-zinc-100'
      />

      <div className='flex items-center gap-2 border-t border-zinc-100 px-3 py-2 dark:border-zinc-800/60'>
        <span className='text-[11px] text-zinc-400'>
          {hasSystemPrompt
            ? t('系统提示 已设')
            : t('系统提示 未设')}
        </span>

        <span className='ml-auto text-[11px] text-zinc-400'>
          {t('Enter 发送 · Shift+Enter 换行')}
        </span>

        <div
          className='relative'
          onMouseEnter={() => disabled && disabledHint && setShowHint(true)}
          onMouseLeave={() => setShowHint(false)}
        >
          <button
            type='button'
            onClick={handlePrimaryClick}
            disabled={!isStreaming && !canSend}
            aria-label={isStreaming ? t('Stop') : t('Send')}
            className={`inline-flex h-9 w-9 items-center justify-center rounded-xl text-sm font-medium transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] active:translate-y-[1px] ${
              isStreaming
                ? 'bg-zinc-700 text-white hover:bg-zinc-800'
                : 'bg-orange-600 text-white hover:bg-orange-700 disabled:bg-zinc-200 disabled:text-zinc-400 dark:disabled:bg-zinc-800 dark:disabled:text-zinc-600'
            }`}
          >
            {isStreaming ? (
              <Square size={16} strokeWidth={2} fill='currentColor' />
            ) : (
              <SendHorizontal size={16} strokeWidth={2} />
            )}
          </button>

          {showHint && disabledHint && (
            <div className='absolute right-0 top-full z-30 mt-1.5 whitespace-nowrap rounded-md bg-zinc-900 px-2.5 py-1.5 text-[11px] text-white shadow-lg dark:bg-zinc-100 dark:text-zinc-900'>
              {disabledHint}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Composer;
