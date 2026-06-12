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
import { Empty, Pagination, Tooltip } from '@douyinfe/semi-ui';
import { IconHelpCircle } from '@douyinfe/semi-icons';
import { Copy } from 'lucide-react';
import {
  IllustrationNoResult,
  IllustrationNoResultDark,
} from '@douyinfe/semi-illustrations';
import {
  calculateModelPrice,
  getLobeHubIcon,
} from '../../../../../helpers';
import PricingCardSkeleton from './PricingCardSkeleton';
import { useMinimumLoadingTime } from '../../../../../hooks/common/useMinimumLoadingTime';
import { useIsMobile } from '../../../../../hooks/common/useIsMobile';

/* ---- SVG arrow icon ---- */
const ArrowIcon = () => (
  <svg
    width='17'
    height='17'
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth='2'
    strokeLinecap='round'
    strokeLinejoin='round'
  >
    <path d='M5 12h14M13 6l6 6-6 6' />
  </svg>
);

/* ---- 模型头像 ---- */
const ModelAvatar = ({ model }) => {
  if (!model || !model.model_name) {
    return (
      <div className='mavatar' style={{ fontSize: 12 }}>
        ?
      </div>
    );
  }
  if (model.icon) {
    return (
      <div className='mavatar' style={{ background: 'var(--brand-50)', padding: 6 }}>
        {getLobeHubIcon(model.icon, 28)}
      </div>
    );
  }
  if (model.vendor_icon) {
    return (
      <div className='mavatar' style={{ background: 'var(--brand-50)', padding: 6 }}>
        {getLobeHubIcon(model.vendor_icon, 28)}
      </div>
    );
  }
  const letters = model.model_name.slice(0, 2).toUpperCase();
  return <div className='mavatar'>{letters}</div>;
};

const PricingCardView = ({
  filteredModels,
  loading,
  rowSelection,
  pageSize,
  setPageSize,
  currentPage,
  setCurrentPage,
  selectedGroup,
  groupRatio,
  copyText,
  setModalImageUrl,
  setIsModalOpenurl,
  currency,
  tokenUnit,
  displayPrice,
  showRatio,
  t,
  selectedRowKeys = [],
  setSelectedRowKeys,
  openModelDetail,
}) => {
  const showSkeleton = useMinimumLoadingTime(loading);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedModels = filteredModels.slice(startIndex, startIndex + pageSize);
  const getModelKey = (model) => model.key ?? model.model_name ?? model.id;
  const isMobile = useIsMobile();

  const handleCheckboxChange = (model, checked) => {
    if (!setSelectedRowKeys) return;
    const modelKey = getModelKey(model);
    const newKeys = checked
      ? Array.from(new Set([...selectedRowKeys, modelKey]))
      : selectedRowKeys.filter((key) => key !== modelKey);
    setSelectedRowKeys(newKeys);
    rowSelection?.onChange?.(newKeys, null);
  };

  /* ---- 标签 ---- */
  const renderTags = (record) => {
    const tags = [];

    // 计费类型
    if (record.quota_type === 1) {
      tags.push(
        <span key='billing' className='tag'>
          {t('按次计费')}
        </span>,
      );
    } else if (record.quota_type === 0) {
      tags.push(
        <span key='billing' className='tag gray'>
          {t('按量计费')}
        </span>,
      );
    }

    // 自定义标签（最多 2 个）
    if (record.tags) {
      const tagArr = record.tags.split(',').filter(Boolean).slice(0, 2);
      tagArr.forEach((tg, idx) => {
        tags.push(
          <span key={`custom-${idx}`} className='tag gray'>
            {tg.trim()}
          </span>,
        );
      });
    }

    return tags;
  };

  if (showSkeleton) {
    return (
      <PricingCardSkeleton rowSelection={!!rowSelection} showRatio={showRatio} />
    );
  }

  if (!filteredModels || filteredModels.length === 0) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '60px 0',
        }}
      >
        <Empty
          image={<IllustrationNoResult style={{ width: 150, height: 150 }} />}
          darkModeImage={
            <IllustrationNoResultDark style={{ width: 150, height: 150 }} />
          }
          description={t('搜索无结果')}
        />
      </div>
    );
  }

  return (
    <>
      {/* 卡片网格 */}
      <div className='model-grid'>
        {paginatedModels.map((model, index) => {
          const modelKey = getModelKey(model);
          const isSelected = selectedRowKeys.includes(modelKey);

          const priceData = calculateModelPrice({
            record: model,
            selectedGroup,
            groupRatio,
            tokenUnit,
            displayPrice,
            currency,
          });

          return (
            <div
              key={modelKey || index}
              className='mcard'
              onClick={() => openModelDetail && openModelDetail(model)}
              style={
                isSelected
                  ? {
                      borderColor: 'var(--brand-500)',
                      background: 'var(--brand-50)',
                    }
                  : {}
              }
            >
              {/* 头部：头像 + 名称 + 操作 */}
              <div className='mcard-top'>
                <ModelAvatar model={model} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className='mname'>{model.model_name}</div>
                  <div className='mprov'>
                    {model.vendor_name && (
                      <span className='tag gray'>{model.vendor_name}</span>
                    )}
                  </div>
                </div>

                {/* 右侧操作 */}
                <div
                  style={{ display: 'flex', gap: 6, alignItems: 'center' }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    className='btn btn-ghost btn-sm btn-icon'
                    title={t('复制')}
                    onClick={() => copyText && copyText(model.model_name)}
                  >
                    <Copy size={13} />
                  </button>

                  {/* 选择框 */}
                  {rowSelection && (
                    <span
                      className='mcbx'
                      style={
                        isSelected
                          ? {
                              background: 'var(--brand-600)',
                              borderColor: 'var(--brand-600)',
                            }
                          : {}
                      }
                      onClick={() => handleCheckboxChange(model, !isSelected)}
                    />
                  )}
                </div>
              </div>

              {/* 价格区 */}
              <div className='mcard-price'>
                {priceData.isPerToken ? (
                  <>
                    <div className='prow'>
                      <span className='pl'>{t('输入')}</span>
                      <span className='pv tnum'>
                        {priceData.inputPrice} / 1{priceData.unitLabel} tokens
                      </span>
                    </div>
                    <div className='prow'>
                      <span className='pl'>{t('输出')}</span>
                      <span className='pv tnum'>
                        {priceData.completionPrice} / 1{priceData.unitLabel} tokens
                      </span>
                    </div>
                  </>
                ) : (
                  <div className='prow'>
                    <span className='pl'>{t('模型价格')}</span>
                    <span className='pv tnum'>{priceData.price}</span>
                  </div>
                )}
              </div>

              {/* 底部：标签 + 箭头 */}
              <div className='mcard-foot'>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', flex: 1 }}>
                  {renderTags(model)}
                </div>
                <div className='mcard-arrow'>
                  <ArrowIcon />
                </div>
              </div>

              {/* 倍率信息（可选） */}
              {showRatio && (
                <div
                  style={{
                    padding: '10px 0 0',
                    borderTop: '1px solid var(--border-2)',
                    display: 'flex',
                    gap: 16,
                    fontSize: 12,
                    color: 'var(--ink-2)',
                  }}
                >
                  <span>
                    {t('模型')}:{' '}
                    {model.quota_type === 0 ? model.model_ratio : t('无')}
                  </span>
                  <span>
                    {t('补全')}:{' '}
                    {model.quota_type === 0
                      ? parseFloat(model.completion_ratio?.toFixed(3))
                      : t('无')}
                  </span>
                  <span>
                    {t('分组')}: {priceData?.usedGroupRatio ?? '-'}
                  </span>
                  <Tooltip content={t('倍率是为了方便换算不同价格的模型')}>
                    <IconHelpCircle
                      style={{ color: 'var(--brand-600)', cursor: 'pointer' }}
                      size='small'
                      onClick={(e) => {
                        e.stopPropagation();
                        setModalImageUrl('/ratio.png');
                        setIsModalOpenurl(true);
                      }}
                    />
                  </Tooltip>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 分页 */}
      {filteredModels.length > 0 && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            padding: '24px 0',
            marginTop: 8,
            borderTop: '1px solid var(--border-2)',
          }}
        >
          <Pagination
            currentPage={currentPage}
            pageSize={pageSize}
            total={filteredModels.length}
            showSizeChanger
            pageSizeOptions={[10, 20, 50, 100]}
            size={isMobile ? 'small' : 'default'}
            showQuickJumper={!isMobile}
            onPageChange={(page) => setCurrentPage(page)}
            onPageSizeChange={(size) => {
              setPageSize(size);
              setCurrentPage(1);
            }}
          />
        </div>
      )}
    </>
  );
};

export default PricingCardView;
