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
      className='pgw2-box'
      style={{
        viewTransitionName: viewTransitionName,
      }}
    >
      {inlineWarning && <div className='pgw2-warn'>{inlineWarning}</div>}

      <textarea
        ref={taRef}
        value={value || ''}
        onChange={(e) => onChange?.(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={t('Ask anything…')}
        disabled={disabled}
        rows={1}
        className='pgw2-ta'
      />

      <div className='pgw2-composer-foot'>
        {hasSystemPrompt && (
          <span className='pgw2-sys-hint'>{t('系统提示 已设')}</span>
        )}

        <span className='pgw2-kbd-hint'>
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
            className={`pgw2-send${isStreaming ? ' stop' : ''}`}
          >
            {isStreaming ? (
              <Square size={15} strokeWidth={2} fill='currentColor' />
            ) : (
              <SendHorizontal size={15} strokeWidth={2} />
            )}
          </button>

          {showHint && disabledHint && (
            <div className='pgw2-hint-tip'>{disabledHint}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Composer;
