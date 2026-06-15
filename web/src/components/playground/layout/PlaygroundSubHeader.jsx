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

import React, { useState } from 'react';
import { Popover, Select } from '@douyinfe/semi-ui';
import { Plus, Settings2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { selectFilter } from '../../../helpers';
import { renderGroupOption } from '../../../helpers/render';
import ApiKeyEditor from './ApiKeyEditor';

// ApiKey pill：未登录显示，红=未配置 / 绿=已就绪；点击弹 ApiKeyEditor Popover
const ApiKeyPill = ({ apiKey, onChange, t }) => {
  const [visible, setVisible] = useState(false);
  const missing = !apiKey;
  return (
    <Popover
      trigger='click'
      visible={visible}
      onVisibleChange={setVisible}
      position='bottomRight'
      content={
        <ApiKeyEditor
          initialValue={apiKey}
          onSaved={(value) => {
            onChange?.(value);
            setVisible(false);
          }}
          onCleared={() => onChange?.('')}
        />
      }
    >
      <button
        type='button'
        className={`inline-flex h-9 items-center gap-1.5 rounded-xl px-3 text-sm font-medium transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] active:translate-y-[1px] ${
          missing
            ? 'bg-orange-600 text-white hover:bg-orange-700'
            : 'bg-emerald-600 text-white hover:bg-emerald-700'
        }`}
      >
        <span className='inline-flex h-4 items-center rounded-[4px] bg-white/25 px-1.5 text-[10px] font-semibold tracking-wider text-white'>
          API
        </span>
        {missing ? t('未配置') : t('已就绪')}
      </button>
    </Popover>
  );
};

const IconBtn = ({ active, onClick, ariaLabel, title, children }) => (
  <button
    type='button'
    onClick={onClick}
    aria-pressed={active ? true : undefined}
    aria-label={ariaLabel}
    title={title}
    className={`inline-flex h-9 w-9 items-center justify-center rounded-xl transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] active:translate-y-[1px] ${
      active
        ? 'bg-orange-50 text-orange-700 ring-1 ring-orange-200 dark:bg-orange-500/10 dark:text-orange-300 dark:ring-orange-500/30'
        : 'text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100'
    }`}
  >
    {children}
  </button>
);

// Sub-Header 整体
// props:
//  - inputs (provides .model, .group)
//  - models, groups
//  - isLoggedIn, apiKey
//  - showSettings, hasMessages
//  - onInputChange, onApiKeyChange, onToggleSettings, onNewChat
const PlaygroundSubHeader = ({
  inputs,
  models,
  groups,
  isLoggedIn,
  apiKey,
  customRequestMode,
  showSettings,
  hasMessages,
  onInputChange,
  onApiKeyChange,
  onToggleSettings,
  onNewChat,
}) => {
  const { t } = useTranslation();
  return (
    <header
      className='sticky top-[var(--isuanova-header-height)] z-30 w-full border-b border-zinc-100 bg-white/85 backdrop-blur dark:border-zinc-800/60 dark:bg-zinc-950/85'
    >
      <div className='mx-auto flex w-full max-w-[1100px] items-center gap-3 px-4 py-3 sm:px-6'>
        <div className='ml-auto flex items-center gap-2'>
          {isLoggedIn && groups && groups.length > 0 && (
            <Select
              placeholder={t('分组')}
              value={inputs.group}
              onChange={(value) => onInputChange('group', value)}
              optionList={groups}
              renderOptionItem={renderGroupOption}
              filter={selectFilter}
              disabled={customRequestMode}
              className='!rounded-lg'
              style={{ width: 130, height: 36 }}
            />
          )}
          <Select
            placeholder={t('请选择模型')}
            value={inputs.model}
            onChange={(value) => onInputChange('model', value)}
            optionList={
              models && models.length > 0
                ? models
                : inputs.model
                  ? [{ label: inputs.model, value: inputs.model }]
                  : []
            }
            filter={selectFilter}
            disabled={customRequestMode}
            className='!rounded-lg'
            style={{ width: 180, height: 36 }}
          />

          {!isLoggedIn && (
            <ApiKeyPill apiKey={apiKey} onChange={onApiKeyChange} t={t} />
          )}

          <IconBtn
            active={showSettings}
            onClick={onToggleSettings}
            ariaLabel={t('高级设置')}
            title={t('高级设置')}
          >
            <Settings2 size={16} strokeWidth={2} />
          </IconBtn>

          <button
            type='button'
            onClick={onNewChat}
            aria-label={t('新对话')}
            title={t('新对话')}
            className='inline-flex h-9 items-center gap-1.5 rounded-xl px-3 text-sm font-medium text-zinc-600 transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-zinc-100 hover:text-zinc-900 active:translate-y-[1px] dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-zinc-100'
          >
            <Plus size={16} strokeWidth={2} />
            <span>{t('新对话')}</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default PlaygroundSubHeader;
