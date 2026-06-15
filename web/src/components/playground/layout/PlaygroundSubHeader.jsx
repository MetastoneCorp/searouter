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
        className={`pgw2-key-pill ${missing ? 'missing' : 'ready'}`}
      >
        <span className='pgw2-key-badge'>API</span>
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
    className={`pgw2-icon-btn${active ? ' active' : ''}`}
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
    <header className='pgw2-subhd'>
      <div className='pgw2-subhd-inner'>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
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
              style={{ width: 130, height: 34 }}
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
            style={{ width: 180, height: 34 }}
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
            <Settings2 size={15} strokeWidth={2} />
          </IconBtn>

          <button
            type='button'
            onClick={onNewChat}
            aria-label={t('新对话')}
            title={t('新对话')}
            className='pgw2-new-btn'
          >
            <Plus size={15} strokeWidth={2} />
            <span>{t('新对话')}</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default PlaygroundSubHeader;
