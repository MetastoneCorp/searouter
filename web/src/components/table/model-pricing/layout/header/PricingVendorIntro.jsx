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

import React, { useState, useEffect, useMemo, useCallback, memo } from 'react';
import { Modal } from '@douyinfe/semi-ui';
import { getLobeHubIcon } from '../../../../../helpers';
import SearchActions from './SearchActions';

const CONFIG = {
  CAROUSEL_INTERVAL: 2500,
  ICON_SIZE: 40,
  UNKNOWN_VENDOR: 'unknown',
};

/* ---- 描述文本 ---- */
const CONTENT_TEXTS = {
  unknown: {
    displayName: (t) => t('未知供应商'),
    description: (t) =>
      t(
        '包含来自未知或未标明供应商的AI模型，这些模型可能来自小型供应商或开源项目。',
      ),
  },
  all: {
    description: (t) =>
      t('查看所有可用的AI模型供应商，包括众多知名供应商的模型。'),
  },
  fallback: {
    description: (t) => t('该供应商提供多种AI模型，适用于不同的应用场景。'),
  },
};

/* ---- spark 图标（右侧装饰） ---- */
const SparkIcon = () => (
  <div className='spark'>
    <svg
      width='40'
      height='40'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='1.6'
      strokeLinecap='round'
      strokeLinejoin='round'
    >
      <path d='M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z' />
      <path d='M19 14l.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7z' />
    </svg>
  </div>
);

/* ---- 供应商图标 avatar ---- */
const VendorBadge = ({ vendor, t }) => {
  if (!vendor) return null;
  if (vendor.icon) {
    return (
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: 12,
          background: 'rgba(255,255,255,.9)',
          display: 'grid',
          placeItems: 'center',
          flexShrink: 0,
        }}
      >
        {getLobeHubIcon(vendor.icon, CONFIG.ICON_SIZE)}
      </div>
    );
  }
  const letter =
    vendor.name === CONFIG.UNKNOWN_VENDOR
      ? '?'
      : vendor.name.charAt(0).toUpperCase();
  return (
    <div
      style={{
        width: 48,
        height: 48,
        borderRadius: 12,
        background: 'rgba(255,255,255,.2)',
        border: '1px solid rgba(255,255,255,.35)',
        display: 'grid',
        placeItems: 'center',
        color: '#fff',
        fontWeight: 700,
        fontSize: 18,
        flexShrink: 0,
      }}
    >
      {letter}
    </div>
  );
};

const PricingVendorIntro = memo(
  ({
    filterVendor,
    models = [],
    allModels = [],
    t,
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
  }) => {
    const [currentOffset, setCurrentOffset] = useState(0);
    const [descModalVisible, setDescModalVisible] = useState(false);
    const [descModalContent, setDescModalContent] = useState('');

    const handleOpenDescModal = useCallback((content) => {
      setDescModalContent(content || '');
      setDescModalVisible(true);
    }, []);

    const handleCloseDescModal = useCallback(() => {
      setDescModalVisible(false);
    }, []);

    /* ---- 供应商信息 ---- */
    const vendorInfo = useMemo(() => {
      const vendors = new Map();
      let unknownCount = 0;
      const sourceModels =
        Array.isArray(allModels) && allModels.length > 0 ? allModels : models;

      sourceModels.forEach((model) => {
        if (model.vendor_name) {
          const existing = vendors.get(model.vendor_name);
          if (existing) {
            existing.count++;
          } else {
            vendors.set(model.vendor_name, {
              name: model.vendor_name,
              icon: model.vendor_icon,
              description: model.vendor_description,
              count: 1,
            });
          }
        } else {
          unknownCount++;
        }
      });

      const vendorList = Array.from(vendors.values()).sort((a, b) =>
        a.name.localeCompare(b.name),
      );

      if (unknownCount > 0) {
        vendorList.push({
          name: CONFIG.UNKNOWN_VENDOR,
          icon: null,
          description: CONTENT_TEXTS.unknown.description(t),
          count: unknownCount,
        });
      }

      return vendorList;
    }, [allModels, models, t]);

    /* ---- 当前展示的供应商 (全部模式下轮播) ---- */
    useEffect(() => {
      if (filterVendor !== 'all' || vendorInfo.length <= 1) {
        setCurrentOffset(0);
        return;
      }
      const interval = setInterval(() => {
        setCurrentOffset((prev) => (prev + 1) % vendorInfo.length);
      }, CONFIG.CAROUSEL_INTERVAL);
      return () => clearInterval(interval);
    }, [filterVendor, vendorInfo.length]);

    const getVendorDescription = useCallback(
      (vendorKey) => {
        if (vendorKey === 'all') return CONTENT_TEXTS.all.description(t);
        if (vendorKey === CONFIG.UNKNOWN_VENDOR)
          return CONTENT_TEXTS.unknown.description(t);
        const vendor = vendorInfo.find((v) => v.name === vendorKey);
        return vendor?.description || CONTENT_TEXTS.fallback.description(t);
      },
      [vendorInfo, t],
    );

    const currentModelCount = models.length;

    /* ---- 确定 hero 标题 & 描述 ---- */
    let heroTitle, heroDesc, heroVendor;

    if (filterVendor === 'all') {
      heroTitle = t('全部供应商');
      heroDesc = getVendorDescription('all');
      heroVendor =
        vendorInfo.length > 0
          ? vendorInfo[currentOffset % vendorInfo.length]
          : null;
    } else {
      const currentVendor = vendorInfo.find((v) => v.name === filterVendor);
      if (!currentVendor) return null;
      heroTitle =
        currentVendor.name === CONFIG.UNKNOWN_VENDOR
          ? CONTENT_TEXTS.unknown.displayName(t)
          : currentVendor.name;
      heroDesc =
        currentVendor.description || getVendorDescription(currentVendor.name);
      heroVendor = currentVendor;
    }

    return (
      <>
        {/* Hero 区块 */}
        <div
          className='plaza-hero'
          style={{ cursor: heroDesc ? 'pointer' : 'default' }}
          onClick={() => heroDesc && handleOpenDescModal(heroDesc)}
        >
          <h1 style={{ fontSize: 32, fontWeight: 800 }}>{heroTitle}</h1>
          <div className='sub'>
            <span>
              {t('共 {{count}} 个模型', { count: currentModelCount })}
            </span>
            <span className='hpill'>{heroDesc}</span>
          </div>
          {heroVendor ? (
            <div
              className='spark'
              style={{
                background: 'rgba(255,255,255,.12)',
                border: '1px solid rgba(255,255,255,.25)',
              }}
            >
              <VendorBadge vendor={heroVendor} t={t} />
            </div>
          ) : (
            <SparkIcon />
          )}
        </div>

        {/* 工具栏 */}
        <div className='plaza-tools'>
          <SearchActions
            selectedRowKeys={selectedRowKeys}
            copyText={copyText}
            handleChange={handleChange}
            handleCompositionStart={handleCompositionStart}
            handleCompositionEnd={handleCompositionEnd}
            isMobile={isMobile}
            searchValue={searchValue}
            setShowFilterModal={setShowFilterModal}
            showWithRecharge={showWithRecharge}
            setShowWithRecharge={setShowWithRecharge}
            currency={currency}
            setCurrency={setCurrency}
            showRatio={showRatio}
            setShowRatio={setShowRatio}
            viewMode={viewMode}
            setViewMode={setViewMode}
            tokenUnit={tokenUnit}
            setTokenUnit={setTokenUnit}
            t={t}
          />
        </div>

        {/* 描述 modal */}
        <Modal
          title={t('供应商介绍')}
          visible={descModalVisible}
          onCancel={handleCloseDescModal}
          footer={null}
          width={isMobile ? '95%' : 560}
          bodyStyle={{ maxHeight: '60vh', overflowY: 'auto' }}
        >
          <div style={{ fontSize: 14, lineHeight: 1.75 }}>
            {descModalContent}
          </div>
        </Modal>
      </>
    );
  },
);

PricingVendorIntro.displayName = 'PricingVendorIntro';

export default PricingVendorIntro;
