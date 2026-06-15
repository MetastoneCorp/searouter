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
  Typography,
} from '@douyinfe/semi-ui';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import ParameterControl from '../ParameterControl';
import CustomRequestEditor from '../CustomRequestEditor';

// 标签风格与 ParameterControl 保持一致：14px 加粗（Typography.Text strong）
const FieldLabel = ({ children }) => (
  <Typography.Text strong className='block text-sm mb-2'>
    {children}
  </Typography.Text>
);

const Field = ({ label, children, className = '' }) => (
  <div className={className}>
    <FieldLabel>{label}</FieldLabel>
    {children}
  </div>
);

// 输入控件统一外观：交由 CSS 接管 bg / border（避开 Tailwind dark variant
// 与 Cascade Layers 优先级冲突），见 index.css 中 .pg-sidesheet 规则
const inputBaseClass = '!rounded-lg pg-input-shell';

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
  const dim = customRequestMode ? 'opacity-50 pointer-events-none' : '';

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
      <div className={`grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-4 ${dim}`}>
        <Field label={t('系统提示')} className='md:col-span-2'>
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
          <div className='pg-input-shell flex h-8 items-center justify-between rounded-lg px-3'>
            <span className='text-sm text-zinc-700 dark:text-zinc-200'>
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
      <div className='mt-6 pt-5 border-t border-zinc-200/70 dark:border-zinc-800'>
        <button
          type='button'
          onClick={() => setAdvancedOpen((s) => !s)}
          /*
           * 字体风格与 FieldLabel（Typography.Text strong + text-sm）保持一致，
           * 不再 ALL CAPS / tracking，避免在抽屉内出现两套标签层级
           */
          className='inline-flex items-center gap-1.5 text-sm font-semibold text-zinc-700 transition-colors hover:text-zinc-900 dark:text-zinc-200 dark:hover:text-zinc-100'
        >
          {advancedOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          {t('更多参数')}
        </button>

        {advancedOpen && (
          <div className='mt-4 space-y-4'>
            <div className={dim}>
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
