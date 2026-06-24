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
import { Skeleton } from '@douyinfe/semi-ui';
import { VChart } from '@visactor/react-vchart';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const StatsCards = ({
  groupedStatsData,
  loading,
  getTrendSpec,
  CHART_CONFIG,
}) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const statItems = groupedStatsData.flatMap((group) => group.items);

  return (
    <div className='grid g-4 mb-4 max-[640px]:!grid-cols-1'>
      {statItems.map((item, idx) => (
        <div
          key={idx}
          className={`stat ${item.onClick ? 'cursor-pointer' : ''}`}
          onClick={item.onClick}
        >
          <div className='label'>
            <span className='badge-ico'>{item.icon}</span>
            {item.title}
            {item.title === t('当前余额') && (
              <button
                type='button'
                className='ml-auto h-6 px-2.5 rounded-md bg-brand-50 text-brand-600 text-xs font-semibold transition-colors hover:bg-brand-100'
                onClick={(e) => {
                  e.stopPropagation();
                  navigate('/console/topup');
                }}
              >
                {t('充值')}
              </button>
            )}
          </div>
          <div className='flex items-end justify-between gap-2'>
            <div className='num tnum'>
              <Skeleton
                loading={loading}
                active
                placeholder={
                  <Skeleton.Paragraph
                    active
                    rows={1}
                    style={{ width: '72px', height: '28px', marginTop: '10px' }}
                  />
                }
              >
                {item.value}
              </Skeleton>
            </div>
            {!loading && item.trendData && item.trendData.length > 0 && (
              <div className='w-24 h-10 flex-shrink-0'>
                <VChart
                  spec={getTrendSpec(item.trendData, item.trendColor)}
                  option={CHART_CONFIG}
                />
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;
