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
import {
  Input,
  InputNumber,
  SideSheet,
  Switch,
} from '@douyinfe/semi-ui';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import ParameterControl from '../ParameterControl';
import CustomRequestEditor from '../CustomRequestEditor';

// 标签风格与 ParameterControl 保持一致
const FieldLabel = ({ children }) => (
  <label style={{ display: 'block', fontSize: 12.5, fontWeight: 600, color: 'var(--ink-2)', marginBottom: 7 }}>
    {children}
  </label>
);

const Field = ({ label, children, style }) => (
  <div style={style}>
    <FieldLabel>{label}</FieldLabel>
    {children}
  </div>
);

// 输入控件统一外观
const inputBaseClass = '!rounded-lg';

// 右侧抽屉式高级设置面板。
// props:
//  - visible, onClose
//  - inputs, parameterEnabled
//  - customRequestMode, customRequestBody, previewPayload
//  - isMobile
//  - on*Change callbacks
const SettingsSideSheet = ({
  visible,
  onClose,
  inputs,
  parameterEnabled,
  customRequestMode,
  customRequestBody,
  previewPayload,
  isMobile,
  onInputChange,
  onParameterToggle,
  onCustomRequestModeChange,
  onCustomRequestBodyChange,
}) => {
  const { t } = useTranslation();
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const dimStyle = customRequestMode ? { opacity: 0.5, pointerEvents: 'none' } : {};

  return (
    <SideSheet
      className='pg-sidesheet'
      title={t('高级设置')}
      placement='right'
      visible={visible}
      onCancel={onClose}
      width={isMobile ? '100%' : 380}
      mask
      bodyStyle={{ padding: 24 }}
      headerStyle={{ borderBottom: '1px solid var(--semi-color-border)' }}
    >
      {/* 5 项核心：System Prompt（满行）/ Temperature / Max Tokens / Context Turns / Stream */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px 20px', ...dimStyle }}>
        <Field label={t('系统提示')} style={{ gridColumn: '1 / -1' }}>
          <Input
            value={inputs.systemPrompt || ''}
            onChange={(value) => onInputChange('systemPrompt', value)}
            placeholder={t('设置 System Prompt')}
            className={inputBaseClass}
          />
        </Field>

        <Field label={t('Temperature')}>
          <InputNumber
            value={inputs.temperature}
            onChange={(value) => onInputChange('temperature', value)}
            min={0}
            max={2}
            step={0.1}
            className={`${inputBaseClass} w-full`}
          />
        </Field>

        <Field label={t('Max Tokens')}>
          <InputNumber
            value={inputs.max_tokens}
            onChange={(value) => onInputChange('max_tokens', value)}
            min={1}
            step={1}
            className={`${inputBaseClass} w-full`}
          />
        </Field>

        <Field label={t('Context Turns')}>
          <InputNumber
            value={inputs.context_turns}
            onChange={(value) => onInputChange('context_turns', value)}
            min={0}
            step={1}
            className={`${inputBaseClass} w-full`}
          />
        </Field>

        <Field label={t('Stream')}>
          <div style={{ display: 'flex', height: 36, alignItems: 'center', justifyContent: 'space-between', border: '1px solid var(--border)', borderRadius: 8, padding: '0 12px' }}>
            <span style={{ fontSize: 13.5, color: 'var(--ink-2)' }}>
              {inputs.stream ? t('On') : t('Off')}
            </span>
            <Switch
              checked={inputs.stream}
              onChange={(checked) => onInputChange('stream', checked)}
              size='small'
            />
          </div>
        </Field>
      </div>

      {/* 更多参数：嵌套折叠（top_p / frequency_penalty / 自定义请求体 等） */}
      <div style={{ marginTop: 24, paddingTop: 20, borderTop: '1px solid var(--border-2)' }}>
        <button
          type='button'
          onClick={() => setAdvancedOpen((s) => !s)}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13.5, fontWeight: 600, color: 'var(--ink)', background: 'transparent', border: 0, cursor: 'pointer' }}
        >
          {advancedOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          {t('更多参数')}
        </button>

        {advancedOpen && (
          <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={dimStyle}>
              <ParameterControl
                inputs={inputs}
                parameterEnabled={parameterEnabled}
                onInputChange={onInputChange}
                onParameterToggle={onParameterToggle}
                disabled={customRequestMode}
                /*
                 * 主区块已经显示了 Temperature / Max Tokens 两个常用参数，
                 * 折叠的「更多参数」里跳过它们以避免重复
                 */
                excludeFields={['temperature', 'max_tokens']}
              />
            </div>
            <CustomRequestEditor
              customRequestMode={customRequestMode}
              customRequestBody={customRequestBody}
              onCustomRequestModeChange={onCustomRequestModeChange}
              onCustomRequestBodyChange={onCustomRequestBodyChange}
              defaultPayload={previewPayload}
            />
          </div>
        )}
      </div>
    </SideSheet>
  );
};

export default SettingsSideSheet;
