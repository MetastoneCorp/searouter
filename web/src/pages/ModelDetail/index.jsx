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

import React, { useState, useMemo } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useModelPricingData } from '../../hooks/model-pricing/useModelPricingData';
import ModelHeader from '../../components/table/model-pricing/modal/components/ModelHeader';
import ModelBasicInfo from '../../components/table/model-pricing/modal/components/ModelBasicInfo';
import ModelEndpoints from '../../components/table/model-pricing/modal/components/ModelEndpoints';
import ModelPricingTable from '../../components/table/model-pricing/modal/components/ModelPricingTable';

/* ---- 返回箭头 SVG ---- */
const BackIcon = () => (
  <svg
    width='20'
    height='20'
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth='2'
    strokeLinecap='round'
    strokeLinejoin='round'
  >
    <path d='M19 12H5M11 18l-6-6 6-6' />
  </svg>
);

/* ---- 加载骨架屏 ---- */
const DetailSkeleton = () => (
  <div className='detail-wrap' style={{ opacity: 0.6 }}>
    <div
      style={{
        height: 32,
        width: 240,
        background: 'var(--surface-2)',
        borderRadius: 8,
        marginBottom: 16,
      }}
    />
    <div
      style={{
        height: 18,
        width: 360,
        background: 'var(--surface-2)',
        borderRadius: 6,
        marginBottom: 12,
      }}
    />
    <div
      style={{
        height: 18,
        width: 280,
        background: 'var(--surface-2)',
        borderRadius: 6,
        marginBottom: 24,
      }}
    />
    <div
      style={{
        height: 120,
        background: 'var(--surface-2)',
        borderRadius: 10,
      }}
    />
  </div>
);

/* ---- 空态 ---- */
const NotFoundState = ({ modelName, onBack, t }) => (
  <div className='detail-wrap' style={{ textAlign: 'center', paddingTop: 80 }}>
    <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
    <div
      style={{ fontSize: 18, fontWeight: 600, marginBottom: 8, color: 'var(--ink)' }}
    >
      {t('找不到模型')}
    </div>
    <div style={{ color: 'var(--ink-2)', marginBottom: 28 }}>
      {t('模型 "{{name}}" 不存在或已下线', { name: modelName })}
    </div>
    <button className='btn btn-primary' onClick={onBack}>
      {t('返回模型广场')}
    </button>
  </div>
);

/* ---- 主页面组件 ---- */
const ModelDetailPage = () => {
  const { t } = useTranslation();
  const { modelName } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('detail');

  const decodedName = useMemo(() => {
    try {
      return decodeURIComponent(modelName || '');
    } catch {
      return modelName || '';
    }
  }, [modelName]);

  // 从 router state 获取快速展示用的预填数据（从广场跳转时携带）
  const stateModel = location.state?.modelData || null;

  const {
    models,
    loading,
    vendorsMap,
    groupRatio,
    currency,
    tokenUnit,
    displayPrice,
    showRatio,
    usableGroup,
    endpointMap,
    autoGroups,
  } = useModelPricingData();

  // 从已加载的 models 列表中找到目标模型
  const modelData = useMemo(() => {
    if (models && models.length > 0) {
      return models.find((m) => m.model_name === decodedName) || null;
    }
    // 数据未加载完时，先用 state 快速展示
    return stateModel;
  }, [models, decodedName, stateModel]);

  // 判断是否已加载完毕（hook 有 loading 状态）
  const isLoaded = !loading;
  // 数据加载完毕但找不到模型
  const notFound = isLoaded && !modelData;

  const handleBack = () => {
    if (window.history.length > 2) {
      navigate(-1);
    } else {
      navigate('/pricing');
    }
  };

  /* ---- 标签渲染 ---- */
  const renderTags = () => {
    if (!modelData) return null;
    const tags = [];
    if (modelData.tags) {
      modelData.tags
        .split(',')
        .filter(Boolean)
        .forEach((tag, i) => {
          tags.push(
            <span key={`tag-${i}`} className='dtag'>
              {tag.trim()}
            </span>,
          );
        });
    }
    if (modelData.vendor_name) {
      tags.push(
        <span key='vendor' className='dtag'>
          {modelData.vendor_name}
        </span>,
      );
    }
    return tags;
  };

  /* ---- Tab 内容渲染 ---- */
  const renderTabDetail = () => (
    <div className='tabpane on' data-pane='detail'>
      <ModelBasicInfo modelData={modelData} vendorsMap={vendorsMap} t={t} />
      <ModelEndpoints modelData={modelData} endpointMap={endpointMap} t={t} />
    </div>
  );

  const renderTabPricing = () => (
    <div className='tabpane on' data-pane='pricing'>
      <ModelPricingTable
        modelData={modelData}
        groupRatio={groupRatio}
        currency={currency}
        tokenUnit={tokenUnit}
        displayPrice={displayPrice}
        showRatio={showRatio}
        usableGroup={usableGroup}
        autoGroups={autoGroups}
        t={t}
      />
    </div>
  );

  /* ---- 加载中 ---- */
  if (loading && !stateModel) {
    return (
      <div className='plaza-shell'>
        <div className='detail-wrap'>
          <DetailSkeleton />
        </div>
      </div>
    );
  }

  /* ---- 找不到模型 ---- */
  if (notFound) {
    return (
      <div className='plaza-shell'>
        <NotFoundState modelName={decodedName} onBack={handleBack} t={t} />
      </div>
    );
  }

  return (
    <div className='plaza-shell'>
      <div className='detail-wrap'>
        {/* 头部 */}
        <div className='detail-head'>
          <button
            className='detail-back'
            onClick={handleBack}
            title={t('返回模型广场')}
          >
            <BackIcon />
          </button>

          {/* 模型名称 + 图标 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <ModelHeader
              modelData={modelData}
              vendorsMap={vendorsMap}
              t={t}
            />
          </div>

          {/* 标签 */}
          <div className='detail-tags'>{renderTags()}</div>

          {/* 操作按钮 */}
          <div className='detail-actions'>
            <button
              className='btn btn-ghost'
              onClick={() =>
                navigate(
                  '/pricing/model/' + encodeURIComponent(decodedName) + '/api',
                )
              }
            >
              {t('API 调用说明')}
            </button>
            <button
              className='btn btn-ghost'
              onClick={() => navigate('/console/playground')}
            >
              {t('立即体验')}
            </button>
          </div>
        </div>

        {/* 元数据网格 */}
        {modelData && (
          <div className='meta-grid'>
            <div className='meta-item'>
              <span className='mk'>{t('模型名称')}:</span>
              <span className='mv'>{modelData.model_name}</span>
            </div>
            {modelData.vendor_name && (
              <div className='meta-item'>
                <span className='mk'>{t('供应商')}:</span>
                <span className='mv'>{modelData.vendor_name}</span>
              </div>
            )}
            {modelData.max_input_num != null && (
              <div className='meta-item'>
                <span className='mk'>{t('上下文长度')}:</span>
                <span className='mv tnum'>
                  {(modelData.max_input_num / 1000).toFixed(0)}K
                </span>
              </div>
            )}
            {modelData.quota_type === 0 && (
              <div className='meta-item'>
                <span className='mk'>{t('计费方式')}:</span>
                <span className='tag gray'>{t('按量计费')}</span>
              </div>
            )}
            {modelData.quota_type === 1 && (
              <div className='meta-item'>
                <span className='mk'>{t('计费方式')}:</span>
                <span className='tag'>{t('按次计费')}</span>
              </div>
            )}
            {modelData.quota_type === 0 && modelData.model_price != null && (
              <div className='meta-item'>
                <span className='mk'>{t('输入')}:</span>
                <span className='mv price tnum'>
                  {displayPrice(modelData.model_price)}
                  {t('/千 tokens')}
                </span>
              </div>
            )}
            {modelData.quota_type === 0 &&
              modelData.completion_price != null && (
                <div className='meta-item'>
                  <span className='mk'>{t('输出')}:</span>
                  <span className='mv price tnum'>
                    {displayPrice(modelData.completion_price)}
                    {t('/千 tokens')}
                  </span>
                </div>
              )}
          </div>
        )}

        {/* Tabs */}
        <div className='detail-tabs'>
          <button
            className={activeTab === 'detail' ? 'on' : ''}
            onClick={() => setActiveTab('detail')}
          >
            {t('模型详情')}
          </button>
          <button
            className={activeTab === 'pricing' ? 'on' : ''}
            onClick={() => setActiveTab('pricing')}
          >
            {t('分组定价')}
          </button>
        </div>

        {/* Tab 内容 */}
        {activeTab === 'detail' && renderTabDetail()}
        {activeTab === 'pricing' && renderTabPricing()}
      </div>
    </div>
  );
};

export default ModelDetailPage;
