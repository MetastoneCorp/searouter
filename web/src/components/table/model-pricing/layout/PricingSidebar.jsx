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

import React, { useState, useMemo, useCallback } from 'react';
import { getLobeHubIcon } from '../../../../helpers';
import { resetPricingFilters } from '../../../../helpers/utils';
import { usePricingFilterCounts } from '../../../../hooks/model-pricing/usePricingFilterCounts';

/* ---- SVG icons ---- */
const IcoVendor = () => (
  <svg
    width='18'
    height='18'
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth='1.8'
    strokeLinecap='round'
    strokeLinejoin='round'
  >
    <path d='M21 12a9 9 0 1 1-3-6.7' />
    <path d='M21 4v5h-5' />
  </svg>
);
const IcoTag = () => (
  <svg
    width='18'
    height='18'
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth='1.8'
    strokeLinecap='round'
    strokeLinejoin='round'
  >
    <path d='M20.6 13.4 12 22l-9-9V3h10z' />
    <circle cx='7.5' cy='7.5' r='1.2' fill='currentColor' />
  </svg>
);
const IcoGroup = () => (
  <svg
    width='18'
    height='18'
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth='1.8'
    strokeLinecap='round'
    strokeLinejoin='round'
  >
    <circle cx='7.5' cy='15.5' r='4.5' />
    <path d='m10.5 12.5 8-8M17 4l3 3' />
  </svg>
);
const IcoBill = () => (
  <svg
    width='18'
    height='18'
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth='1.8'
    strokeLinecap='round'
    strokeLinejoin='round'
  >
    <path d='M5 3h10l4 4v14H5z' />
    <path d='M14 3v4h4M8 13h8M8 17h6' />
  </svg>
);
const IcoEndpoint = () => (
  <svg
    width='18'
    height='18'
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth='1.8'
    strokeLinecap='round'
    strokeLinejoin='round'
  >
    <path d='M8 9l-3 3 3 3M16 9l3 3-3 3M13 5l-2 14' />
  </svg>
);
const IcoChev = () => (
  <svg
    className='chev'
    width='16'
    height='16'
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth='2'
  >
    <path d='M6 9l6 6 6-6' />
  </svg>
);
const IcoReset = () => (
  <svg
    width='15'
    height='15'
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth='2'
    strokeLinecap='round'
    strokeLinejoin='round'
  >
    <path d='M3 12a9 9 0 1 0 3-6.7' />
    <path d='M3 4v5h5' />
  </svg>
);

/* ---- 单个筛选分组 ---- */
const FilterGroup = ({ icon, title, children, defaultOpen = false }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className={`fgroup${open ? ' open' : ''}`}>
      <div className='fhead' onClick={() => setOpen(!open)}>
        {icon}
        {title}
        <IcoChev />
      </div>
      <div className='fbody'>{children}</div>
    </div>
  );
};

/* ---- 单个选项 ---- */
const FilterOpt = ({ label, count, active, onClick, icon }) => (
  <div className={`fopt${active ? ' on' : ''}`} onClick={onClick}>
    <span className='cbx'></span>
    {icon && (
      <span style={{ display: 'flex', alignItems: 'center' }}>{icon}</span>
    )}
    {label}
    {count !== undefined && <span className='cnt'>{count}</span>}
  </div>
);

const PricingSidebar = ({
  showWithRecharge,
  setShowWithRecharge,
  currency,
  setCurrency,
  handleChange,
  setActiveKey,
  showRatio,
  setShowRatio,
  viewMode,
  setViewMode,
  filterGroup,
  setFilterGroup,
  handleGroupClick,
  filterQuotaType,
  setFilterQuotaType,
  filterEndpointType,
  setFilterEndpointType,
  filterVendor,
  setFilterVendor,
  filterTag,
  setFilterTag,
  currentPage,
  setCurrentPage,
  tokenUnit,
  setTokenUnit,
  loading,
  t,
  ...categoryProps
}) => {
  const {
    quotaTypeModels,
    endpointTypeModels,
    vendorModels,
    tagModels,
    groupCountModels,
  } = usePricingFilterCounts({
    models: categoryProps.models,
    filterGroup,
    filterQuotaType,
    filterEndpointType,
    filterVendor,
    filterTag,
    searchValue: categoryProps.searchValue,
  });

  const handleResetFilters = () =>
    resetPricingFilters({
      handleChange,
      setShowWithRecharge,
      setCurrency,
      setShowRatio,
      setViewMode,
      setFilterGroup,
      setFilterQuotaType,
      setFilterEndpointType,
      setFilterVendor,
      setFilterTag,
      setCurrentPage,
      setTokenUnit,
    });

  /* ---- 供应商数据 ---- */
  const vendorData = useMemo(() => {
    const vendors = new Map();
    const sourceModels =
      Array.isArray(categoryProps.models) && categoryProps.models.length > 0
        ? categoryProps.models
        : [];
    sourceModels.forEach((model) => {
      if (model.vendor_name) {
        const existing = vendors.get(model.vendor_name);
        if (existing) {
          existing.count++;
        } else {
          vendors.set(model.vendor_name, {
            name: model.vendor_name,
            icon: model.vendor_icon,
            count: 1,
          });
        }
      }
    });
    return [
      { name: 'all', icon: null, count: sourceModels.length },
      ...Array.from(vendors.values()).sort((a, b) =>
        a.name.localeCompare(b.name),
      ),
    ];
  }, [categoryProps.models]);

  /* ---- 标签数据 ---- */
  const tagData = useMemo(() => {
    const tagMap = new Map();
    const sourceModels = categoryProps.models || [];
    sourceModels.forEach((model) => {
      if (model.tags) {
        model.tags
          .split(/[,;|]+/)
          .map((tg) => tg.trim())
          .filter(Boolean)
          .forEach((tg) => {
            const key = tg.toLowerCase();
            tagMap.set(key, (tagMap.get(key) || 0) + 1);
          });
      }
    });
    return Array.from(tagMap.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([key, count]) => ({ key, label: key, count }));
  }, [categoryProps.models]);

  /* ---- 分组数据 ---- */
  const groupData = useMemo(() => {
    const groups = [
      'all',
      ...Object.keys(categoryProps.usableGroup || {}).filter((k) => k !== ''),
    ];
    return groups.map((g) => {
      const modelCount =
        g === 'all'
          ? (categoryProps.models || []).length
          : (categoryProps.models || []).filter(
              (m) => m.enable_groups && m.enable_groups.includes(g),
            ).length;
      const ratio = categoryProps.groupRatio?.[g];
      return {
        key: g,
        label: g === 'all' ? t('全部分组') : g,
        count: modelCount,
        ratio: g === 'all' ? null : ratio !== undefined ? `x${ratio}` : 'x1',
      };
    });
  }, [
    categoryProps.models,
    categoryProps.usableGroup,
    categoryProps.groupRatio,
    t,
  ]);

  /* ---- 端点类型数据 ---- */
  const endpointData = useMemo(() => {
    const epSet = new Set();
    (categoryProps.models || []).forEach((model) => {
      if (
        model.supported_endpoint_types &&
        Array.isArray(model.supported_endpoint_types)
      ) {
        model.supported_endpoint_types.forEach((ep) => epSet.add(ep));
      }
    });
    const all = [
      {
        key: 'all',
        label: t('全部端点'),
        count: (categoryProps.models || []).length,
      },
      ...Array.from(epSet)
        .sort()
        .map((ep) => ({
          key: ep,
          label: ep,
          count: (categoryProps.models || []).filter(
            (m) =>
              m.supported_endpoint_types &&
              m.supported_endpoint_types.includes(ep),
          ).length,
        })),
    ];
    return all;
  }, [categoryProps.models, t]);

  const handleVendorClick = useCallback(
    (name) => {
      setFilterVendor(name === filterVendor ? 'all' : name);
      setCurrentPage?.(1);
    },
    [filterVendor, setFilterVendor, setCurrentPage],
  );

  const handleTagClick = useCallback(
    (key) => {
      setFilterTag(key === filterTag ? 'all' : key);
      setCurrentPage?.(1);
    },
    [filterTag, setFilterTag, setCurrentPage],
  );

  const handleGroupClickInner = useCallback(
    (key) => {
      if (handleGroupClick) {
        handleGroupClick(key === filterGroup ? 'all' : key);
      } else {
        setFilterGroup(key === filterGroup ? 'all' : key);
      }
      setCurrentPage?.(1);
    },
    [filterGroup, handleGroupClick, setFilterGroup, setCurrentPage],
  );

  const handleQuotaClick = useCallback(
    (val) => {
      setFilterQuotaType(val === filterQuotaType ? 'all' : val);
      setCurrentPage?.(1);
    },
    [filterQuotaType, setFilterQuotaType, setCurrentPage],
  );

  const handleEndpointClick = useCallback(
    (key) => {
      setFilterEndpointType(key === filterEndpointType ? 'all' : key);
      setCurrentPage?.(1);
    },
    [filterEndpointType, setFilterEndpointType, setCurrentPage],
  );

  return (
    <>
      <div
        className='frail-title'
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <span>{t('筛选')}</span>
        <button
          onClick={handleResetFilters}
          title={t('重置')}
          style={{
            background: 'rgba(255,255,255,.14)',
            border: 0,
            borderRadius: 6,
            color: 'rgba(255,255,255,.85)',
            width: 28,
            height: 28,
            display: 'grid',
            placeItems: 'center',
            cursor: 'pointer',
          }}
        >
          <IcoReset />
        </button>
      </div>

      {/* 供应商 */}
      <FilterGroup icon={<IcoVendor />} title={t('供应商')} defaultOpen>
        {vendorData.map((v) => (
          <FilterOpt
            key={v.name}
            label={v.name === 'all' ? t('全部供应商') : v.name}
            count={v.count}
            active={
              filterVendor === v.name ||
              (v.name === 'all' && (!filterVendor || filterVendor === 'all'))
            }
            onClick={() =>
              v.name === 'all'
                ? setFilterVendor('all')
                : handleVendorClick(v.name)
            }
            icon={v.icon ? getLobeHubIcon(v.icon, 14) : null}
          />
        ))}
      </FilterGroup>

      {/* 标签 */}
      {tagData.length > 0 && (
        <FilterGroup icon={<IcoTag />} title={t('标签')}>
          <FilterOpt
            key='all'
            label={t('全部标签')}
            count={(categoryProps.models || []).length}
            active={!filterTag || filterTag === 'all'}
            onClick={() => setFilterTag('all')}
          />
          {tagData.map((tg) => (
            <FilterOpt
              key={tg.key}
              label={tg.label}
              count={tg.count}
              active={filterTag === tg.key}
              onClick={() => handleTagClick(tg.key)}
            />
          ))}
        </FilterGroup>
      )}

      {/* 令牌分组 */}
      {groupData.length > 1 && (
        <FilterGroup icon={<IcoGroup />} title={t('可用令牌分组')}>
          {groupData.map((g) => (
            <FilterOpt
              key={g.key}
              label={g.ratio ? `${g.label} ${g.ratio}` : g.label}
              count={g.count}
              active={
                filterGroup === g.key ||
                (g.key === 'all' && (!filterGroup || filterGroup === 'all'))
              }
              onClick={() => handleGroupClickInner(g.key)}
            />
          ))}
        </FilterGroup>
      )}

      {/* 计费类型 */}
      <FilterGroup icon={<IcoBill />} title={t('计费类型')}>
        {[
          {
            val: 'all',
            label: t('全部类型'),
            count: (categoryProps.models || []).length,
          },
          {
            val: 0,
            label: t('按量计费'),
            count: (categoryProps.models || []).filter(
              (m) => m.quota_type === 0,
            ).length,
          },
          {
            val: 1,
            label: t('按次计费'),
            count: (categoryProps.models || []).filter(
              (m) => m.quota_type === 1,
            ).length,
          },
        ].map((item) => (
          <FilterOpt
            key={String(item.val)}
            label={item.label}
            count={item.count}
            active={
              filterQuotaType === item.val ||
              (item.val === 'all' &&
                (!filterQuotaType || filterQuotaType === 'all'))
            }
            onClick={() => handleQuotaClick(item.val)}
          />
        ))}
      </FilterGroup>

      {/* 端点类型 */}
      {endpointData.length > 1 && (
        <FilterGroup icon={<IcoEndpoint />} title={t('端点类型')}>
          {endpointData.map((ep) => (
            <FilterOpt
              key={ep.key}
              label={ep.label}
              count={ep.count}
              active={
                filterEndpointType === ep.key ||
                (ep.key === 'all' &&
                  (!filterEndpointType || filterEndpointType === 'all'))
              }
              onClick={() => handleEndpointClick(ep.key)}
            />
          ))}
        </FilterGroup>
      )}
    </>
  );
};

export default PricingSidebar;
