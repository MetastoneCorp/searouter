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
import { Input, Slider } from '@douyinfe/semi-ui';
import { useTranslation } from 'react-i18next';

const ParameterControl = ({
  inputs,
  parameterEnabled,
  onInputChange,
  onParameterToggle,
  disabled = false,
}) => {
  const { t } = useTranslation();

  // 启用/禁用切换按钮
  const ToggleBtn = ({ paramKey }) => (
    <button
      className={`toggle${parameterEnabled[paramKey] ? ' on' : ''}`}
      onClick={() => onParameterToggle(paramKey)}
      disabled={disabled}
      style={{
        opacity: disabled ? 0.4 : 1,
        cursor: disabled ? 'not-allowed' : 'pointer',
      }}
      title={
        parameterEnabled[paramKey]
          ? t('已启用，点击禁用')
          : t('已禁用，点击启用')
      }
    />
  );

  return (
    <>
      {/* Temperature */}
      <div
        style={{
          opacity: !parameterEnabled.temperature || disabled ? 0.5 : 1,
          transition: 'opacity .2s',
          marginBottom: 16,
        }}
      >
        <div className='param-head'>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <ToggleBtn paramKey='temperature' />
            <span>Temperature</span>
          </div>
          <span className='val'>{inputs.temperature}</span>
        </div>
        <p className='helper'>{t('控制输出的随机性和创造性')}</p>
        <Slider
          step={0.1}
          min={0.1}
          max={1}
          value={inputs.temperature}
          onChange={(value) => onInputChange('temperature', value)}
          disabled={!parameterEnabled.temperature || disabled}
        />
      </div>

      {/* Top P */}
      <div
        style={{
          opacity: !parameterEnabled.top_p || disabled ? 0.5 : 1,
          transition: 'opacity .2s',
          marginBottom: 16,
        }}
      >
        <div className='param-head'>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <ToggleBtn paramKey='top_p' />
            <span>Top P</span>
          </div>
          <span className='val'>{inputs.top_p}</span>
        </div>
        <p className='helper'>{t('核采样，控制词汇选择的多样性')}</p>
        <Slider
          step={0.1}
          min={0.1}
          max={1}
          value={inputs.top_p}
          onChange={(value) => onInputChange('top_p', value)}
          disabled={!parameterEnabled.top_p || disabled}
        />
      </div>

      {/* Frequency Penalty */}
      <div
        style={{
          opacity: !parameterEnabled.frequency_penalty || disabled ? 0.5 : 1,
          transition: 'opacity .2s',
          marginBottom: 16,
        }}
      >
        <div className='param-head'>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <ToggleBtn paramKey='frequency_penalty' />
            <span>Frequency Penalty</span>
          </div>
          <span className='val'>{inputs.frequency_penalty}</span>
        </div>
        <p className='helper'>{t('频率惩罚，减少重复词汇的出现')}</p>
        <Slider
          step={0.1}
          min={-2}
          max={2}
          value={inputs.frequency_penalty}
          onChange={(value) => onInputChange('frequency_penalty', value)}
          disabled={!parameterEnabled.frequency_penalty || disabled}
        />
      </div>

      {/* Presence Penalty */}
      <div
        style={{
          opacity: !parameterEnabled.presence_penalty || disabled ? 0.5 : 1,
          transition: 'opacity .2s',
          marginBottom: 16,
        }}
      >
        <div className='param-head'>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <ToggleBtn paramKey='presence_penalty' />
            <span>Presence Penalty</span>
          </div>
          <span className='val'>{inputs.presence_penalty}</span>
        </div>
        <p className='helper'>{t('存在惩罚，鼓励讨论新话题')}</p>
        <Slider
          step={0.1}
          min={-2}
          max={2}
          value={inputs.presence_penalty}
          onChange={(value) => onInputChange('presence_penalty', value)}
          disabled={!parameterEnabled.presence_penalty || disabled}
        />
      </div>

      {/* Max Tokens */}
      <div
        style={{
          opacity: !parameterEnabled.max_tokens || disabled ? 0.5 : 1,
          transition: 'opacity .2s',
          marginBottom: 16,
        }}
      >
        <div className='param-head' style={{ marginBottom: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <ToggleBtn paramKey='max_tokens' />
            <span>Max Tokens</span>
          </div>
        </div>
        <Input
          placeholder='MaxTokens'
          name='max_tokens'
          required
          autoComplete='new-password'
          defaultValue={0}
          value={inputs.max_tokens}
          onChange={(value) => onInputChange('max_tokens', value)}
          disabled={!parameterEnabled.max_tokens || disabled}
        />
      </div>

      {/* Seed */}
      <div
        style={{
          opacity: !parameterEnabled.seed || disabled ? 0.5 : 1,
          transition: 'opacity .2s',
          marginBottom: 16,
        }}
      >
        <div className='param-head' style={{ marginBottom: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <ToggleBtn paramKey='seed' />
            <span>Seed</span>
            <span className='helper' style={{ margin: 0, fontSize: 12 }}>
              ({t('可选，用于复现结果')})
            </span>
          </div>
        </div>
        <Input
          placeholder={t('随机种子 (留空为随机)')}
          name='seed'
          autoComplete='new-password'
          value={inputs.seed || ''}
          onChange={(value) =>
            onInputChange('seed', value === '' ? null : value)
          }
          disabled={!parameterEnabled.seed || disabled}
        />
      </div>
    </>
  );
};

export default ParameterControl;
