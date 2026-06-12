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

import React, { memo, useCallback, useState } from 'react';
import { Select } from '@douyinfe/semi-ui';
import { IconFilter } from '@douyinfe/semi-icons';

/* ---- SVG icons ---- */
const IcoSearch = () => (
  <svg width='17' height='17' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
    <circle cx='11' cy='11' r='7'/><path d='m21 21-4-4'/>
  </svg>
);
const IcoCopy = () => (
  <svg width='15' height='15' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.8' strokeLinecap='round' strokeLinejoin='round'>
    <rect x='9' y='9' width='11' height='11' rx='2'/><path d='M5 15V5a2 2 0 0 1 2-2h10'/>
  </svg>
);
const IcoGrid = () => (
  <svg width='15' height='15' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
    <rect x='3' y='3' width='7' height='7'/><rect x='14' y='3' width='7' height='7'/>
    <rect x='3' y='14' width='7' height='7'/><rect x='14' y='14' width='7' height='7'/>
  </svg>
);
const IcoList = () => (
  <svg width='15' height='15' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
    <path d='M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01'/>
  </svg>
);

const SearchActions = memo(
  ({
    selectedRowKeys = [],
    copyText,
    handleChange,
    handleCompositionStart,
    handleCompositionEnd,
    isMobile = false,
    searchValue = '',
    setShowFilterModal,
    showWithRecharge,
    setShowWithRecharge,
    currency,
    setCurrency,
    showRatio,
    setShowRatio,
    viewMode,
    setViewMode,
    tokenUnit,
    setTokenUnit,
    t,
  }) => {
    const [copyDone, setCopyDone] = useState(false);

    const handleCopyClick = useCallback(() => {
      if (copyText && selectedRowKeys.length > 0) {
        copyText(selectedRowKeys);
        setCopyDone(true);
        setTimeout(() => setCopyDone(false), 1200);
      }
    }, [copyText, selectedRowKeys]);

    const handleFilterClick = useCallback(() => {
      setShowFilterModal?.(true);
    }, [setShowFilterModal]);

    const handleViewGrid = useCallback(() => setViewMode?.('card'), [setViewMode]);
    const handleViewList = useCallback(() => setViewMode?.('table'), [setViewMode]);

    const handleTokenUnitToggle = useCallback(() => {
      setTokenUnit?.(tokenUnit === 'K' ? 'M' : 'K');
    }, [tokenUnit, setTokenUnit]);

    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%', flexWrap: 'wrap' }}>
        {/* 搜索框 */}
        <label className='plaza-search' style={{ flex: 1, minWidth: 160 }}>
          <IcoSearch />
          <input
            placeholder={t('模糊搜索模型名称')}
            value={searchValue}
            onCompositionStart={handleCompositionStart}
            onCompositionEnd={handleCompositionEnd}
            onChange={handleChange}
          />
        </label>

        {/* 复制按钮 */}
        <button
          className='btn btn-ghost btn-sm'
          onClick={handleCopyClick}
          disabled={selectedRowKeys.length === 0}
        >
          <IcoCopy />
          {copyDone ? t('已复制') : t('复制')}
        </button>

        {!isMobile && (
          <>
            {/* 充值价格开关 */}
            <div className='tool-toggle'>
              {t('充值价格显示')}
              <button
                className={`toggle${showWithRecharge ? ' on' : ''}`}
                onClick={() => setShowWithRecharge?.(!showWithRecharge)}
                aria-label={t('充值价格显示')}
              />
            </div>

            {/* 货币选择 */}
            {showWithRecharge && (
              <Select
                value={currency}
                onChange={setCurrency}
                style={{ width: 100 }}
                size='small'
                optionList={[
                  { value: 'USD', label: 'USD' },
                  { value: 'CNY', label: 'CNY' },
                  { value: 'CUSTOM', label: t('自定义货币') },
                ]}
              />
            )}

            {/* 倍率开关 */}
            <div className='tool-toggle'>
              {t('倍率')}
              <button
                className={`toggle${showRatio ? ' on' : ''}`}
                onClick={() => setShowRatio?.(!showRatio)}
                aria-label={t('倍率')}
              />
            </div>

            {/* Token 单位切换 */}
            <button
              className='btn btn-ghost btn-sm'
              onClick={handleTokenUnitToggle}
              title={t('切换 token 单位')}
            >
              {tokenUnit}
            </button>

            {/* 视图切换 */}
            <div className='viewseg'>
              <button
                className={viewMode === 'card' ? 'on' : ''}
                onClick={handleViewGrid}
                title={t('网格视图')}
              >
                <IcoGrid />
                {t('网格')}
              </button>
              <button
                className={viewMode === 'table' ? 'on' : ''}
                onClick={handleViewList}
                title={t('列表视图')}
              >
                <IcoList />
                {t('列表')}
              </button>
            </div>
          </>
        )}

        {/* 移动端筛选按钮 */}
        {isMobile && (
          <button className='btn btn-ghost btn-sm' onClick={handleFilterClick}>
            <IconFilter size='small' />
            {t('筛选')}
          </button>
        )}
      </div>
    );
  },
);

SearchActions.displayName = 'SearchActions';

export default SearchActions;
