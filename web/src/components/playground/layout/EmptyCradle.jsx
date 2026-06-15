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
import BrandFingerprint from './BrandFingerprint';
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
    <div className='pg-mesh-wrap relative flex min-h-[calc(100dvh-var(--isuanova-header-height)-56px)] w-full flex-col px-4'>
      <BrandFingerprint />

      {/* 上半：greeting 居中显示在视觉中段 */}
      <div className='relative z-[1] flex flex-1 flex-col items-center justify-center pt-10 pb-4'>
        <h1
          className='text-zinc-950 dark:text-zinc-100 font-semibold leading-[1.1] text-center'
          style={{
            fontSize: 'clamp(28px, 4.2vw, 36px)',
            letterSpacing: '-0.02em',
          }}
        >
          Cube-Router · Playground
        </h1>
        <p className='mt-3 text-base text-zinc-500 dark:text-zinc-400 text-center'>
          {t('你想让模型帮你做什么？')}
        </p>
      </div>

      {/* 下半：composer + chips + trust note，紧贴 viewport 底部 */}
      <div className='relative z-[1] mx-auto w-full max-w-2xl flex flex-col gap-4 pb-6'>
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
          <p className='text-center text-[11px] text-zinc-400'>
            {t('Key 仅保存在你的浏览器，不会上传到服务端')}
          </p>
        )}
      </div>
    </div>
  );
};

export default EmptyCradle;
