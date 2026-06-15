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
import { Select, Button, Switch } from '@douyinfe/semi-ui';
import { X, Settings } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { renderGroupOption, selectFilter } from '../../helpers';
import ParameterControl from './ParameterControl';
import ImageUrlInput from './ImageUrlInput';
import ConfigManager from './ConfigManager';
import CustomRequestEditor from './CustomRequestEditor';

const SettingsPanel = ({
  inputs,
  parameterEnabled,
  models,
  groups,
  styleState,
  showDebugPanel,
  customRequestMode,
  customRequestBody,
  onInputChange,
  onParameterToggle,
  onCloseSettings,
  onConfigImport,
  onConfigReset,
  onCustomRequestModeChange,
  onCustomRequestBodyChange,
  previewPayload,
  messages,
}) => {
  const { t } = useTranslation();

  const currentConfig = {
    inputs,
    parameterEnabled,
    showDebugPanel,
    customRequestMode,
    customRequestBody,
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        overflow: 'hidden',
      }}
    >
      {/* 面板标题 */}
      <div
        style={{
          padding: '14px 18px',
          borderBottom: '1px solid var(--border-2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexShrink: 0,
        }}
      >
        <div className='cfg-title' style={{ margin: 0 }}>
          <span className='ico'>
            <Settings size={16} />
          </span>
          {t('模型配置')}
        </div>
        {styleState.isMobile && onCloseSettings && (
          <Button
            icon={<X size={16} />}
            onClick={onCloseSettings}
            theme='borderless'
            type='tertiary'
            size='small'
          />
        )}
      </div>

      {/* 移动端配置管理 */}
      {styleState.isMobile && (
        <div style={{ padding: '12px 18px 0', flexShrink: 0 }}>
          <ConfigManager
            currentConfig={currentConfig}
            onConfigImport={onConfigImport}
            onConfigReset={onConfigReset}
            styleState={{ ...styleState, isMobile: false }}
            messages={messages}
          />
        </div>
      )}

      {/* 可滚动内容区 */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '16px 18px',
          display: 'flex',
          flexDirection: 'column',
          gap: 18,
        }}
      >
        {/* 自定义请求体编辑器 */}
        <CustomRequestEditor
          customRequestMode={customRequestMode}
          customRequestBody={customRequestBody}
          onCustomRequestModeChange={onCustomRequestModeChange}
          onCustomRequestBodyChange={onCustomRequestBodyChange}
          defaultPayload={previewPayload}
        />

        {/* 分组选择 */}
        <div className={customRequestMode ? 'opacity-50' : ''}>
          <div className='field' style={{ marginBottom: 0 }}>
            <label>{t('分组')}</label>
            <Select
              placeholder={t('请选择分组')}
              name='group'
              required
              selection
              filter={selectFilter}
              autoClearSearchValue={false}
              onChange={(value) => onInputChange('group', value)}
              value={inputs.group}
              autoComplete='new-password'
              optionList={groups}
              renderOptionItem={renderGroupOption}
              style={{ width: '100%' }}
              dropdownStyle={{ width: '100%', maxWidth: '100%' }}
              disabled={customRequestMode}
            />
          </div>
        </div>

        {/* 模型选择 */}
        <div className={customRequestMode ? 'opacity-50' : ''}>
          <div className='field' style={{ marginBottom: 0 }}>
            <label>{t('模型')}</label>
            <Select
              placeholder={t('请选择模型')}
              name='model'
              required
              selection
              filter={selectFilter}
              autoClearSearchValue={false}
              onChange={(value) => onInputChange('model', value)}
              value={inputs.model}
              autoComplete='new-password'
              optionList={models}
              style={{ width: '100%' }}
              dropdownStyle={{ width: '100%', maxWidth: '100%' }}
              disabled={customRequestMode}
            />
          </div>
        </div>

        {/* 图片URL输入 */}
        <div className={customRequestMode ? 'opacity-50' : ''}>
          <ImageUrlInput
            imageUrls={inputs.imageUrls}
            imageEnabled={inputs.imageEnabled}
            onImageUrlsChange={(urls) => onInputChange('imageUrls', urls)}
            onImageEnabledChange={(enabled) =>
              onInputChange('imageEnabled', enabled)
            }
            disabled={customRequestMode}
          />
        </div>

        {/* 参数控制 */}
        <div className={customRequestMode ? 'opacity-50' : ''}>
          <ParameterControl
            inputs={inputs}
            parameterEnabled={parameterEnabled}
            onInputChange={onInputChange}
            onParameterToggle={onParameterToggle}
            disabled={customRequestMode}
          />
        </div>

        {/* 流式输出开关 */}
        <div className={customRequestMode ? 'opacity-50' : ''}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 10,
            }}
          >
            <span style={{ fontSize: 14, fontWeight: 500 }}>
              {t('流式输出')}
            </span>
            <Switch
              checked={inputs.stream}
              onChange={(checked) => onInputChange('stream', checked)}
              checkedText={t('开')}
              uncheckedText={t('关')}
              size='small'
              disabled={customRequestMode}
            />
          </div>
        </div>
      </div>

      {/* 底部导入导出 - 桌面端 */}
      {!styleState.isMobile && (
        <div
          style={{
            flexShrink: 0,
            borderTop: '1px solid var(--border-2)',
            padding: '12px 18px',
          }}
        >
          <ConfigManager
            currentConfig={currentConfig}
            onConfigImport={onConfigImport}
            onConfigReset={onConfigReset}
            styleState={styleState}
            messages={messages}
          />
        </div>
      )}
    </div>
  );
};

export default SettingsPanel;
