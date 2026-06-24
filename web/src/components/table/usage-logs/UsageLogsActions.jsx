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
import { Skeleton, Space } from '@douyinfe/semi-ui';
import { renderQuota } from '../../../helpers';
import CompactModeToggle from '../../common/ui/CompactModeToggle';
import { useMinimumLoadingTime } from '../../../hooks/common/useMinimumLoadingTime';

const LogsActions = ({
  stat,
  loadingStat,
  showStat,
  compactMode,
  setCompactMode,
  t,
}) => {
  const showSkeleton = useMinimumLoadingTime(loadingStat);
  const needSkeleton = !showStat || showSkeleton;

  const placeholder = (
    <Space>
      <Skeleton.Title style={{ width: 120, height: 21, borderRadius: 6 }} />
      <Skeleton.Title style={{ width: 80, height: 21, borderRadius: 6 }} />
      <Skeleton.Title style={{ width: 80, height: 21, borderRadius: 6 }} />
    </Space>
  );

  return (
    <div className='flex flex-col gap-3'>
      {/* Summary 汇总条 — 品牌色背景 */}
      <Skeleton loading={needSkeleton} active placeholder={placeholder}>
        <div
          className='flex flex-wrap gap-x-7 gap-y-3 rounded-[var(--r-card)] px-6 py-[18px]'
          style={{ background: 'var(--brand-700)', color: '#fff' }}
        >
          <div className='flex flex-col gap-1'>
            <span
              className='text-[12px]'
              style={{ color: 'rgba(255,255,255,.7)' }}
            >
              {t('消耗额度')}
            </span>
            <span className='tnum text-[22px] font-bold tracking-tight'>
              {renderQuota(stat.quota)}
            </span>
          </div>

          <div
            className='hidden sm:block w-px self-stretch'
            style={{ background: 'rgba(255,255,255,.18)' }}
          />

          <div className='flex flex-col gap-1'>
            <span
              className='text-[12px]'
              style={{ color: 'rgba(255,255,255,.7)' }}
            >
              RPM
            </span>
            <span className='tnum text-[22px] font-bold tracking-tight'>
              {stat.rpm}
            </span>
          </div>

          <div className='flex flex-col gap-1'>
            <span
              className='text-[12px]'
              style={{ color: 'rgba(255,255,255,.7)' }}
            >
              TPM
            </span>
            <span className='tnum text-[22px] font-bold tracking-tight'>
              {stat.tpm}
            </span>
          </div>
        </div>
      </Skeleton>

      {/* 紧凑模式切换 */}
      <div className='flex justify-end'>
        <CompactModeToggle
          compactMode={compactMode}
          setCompactMode={setCompactMode}
          t={t}
        />
      </div>
    </div>
  );
};

export default LogsActions;
