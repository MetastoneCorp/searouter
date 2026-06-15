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
import Composer from './Composer';
import StarterChips from './StarterChips';
import { useStarterChips } from '../../../hooks/playground/useStarterChips';

// empty 态主体：垂直居中 cradle = greeting + composer + chips + trust note
// 父组件传 composer 受控状态与回调
const EmptyCradle = ({
  composerValue,
  onComposerChange,
  onSend,
  onStop,
  isStreaming,
  hasSystemPrompt,
  disabled,
  disabledHint,
  inlineWarning,
  showTrustNote,
}) => {
  const { t } = useTranslation();
  const chips = useStarterChips();

  const handleChipPick = (prompt) => {
    onComposerChange?.(prompt);
  };

  return (
    <div className='pgw2-cradle'>
      <div className='pgw2-cradle-bg' aria-hidden='true' />

      {/* 上半：greeting 居中显示在视觉中段 */}
      <div className='pgw2-cradle-mid'>
        <h1 className='pgw2-cradle-title'>
          Cube-Router · Playground
        </h1>
        <p className='pgw2-cradle-sub'>
          {t('你想让模型帮你做什么？')}
        </p>
      </div>

      {/* 下半：composer + chips + trust note，紧贴 viewport 底部 */}
      <div className='pgw2-cradle-bot'>
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
          autoFocus
          viewTransitionName='composer'
        />
        <StarterChips chips={chips} onPick={handleChipPick} />
        {showTrustNote && (
          <p className='pgw2-trust'>
            {t('Key 仅保存在你的浏览器，不会上传到服务端')}
          </p>
        )}
      </div>
    </div>
  );
};

export default EmptyCradle;
