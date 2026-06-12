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

const PricingCardSkeleton = ({
  skeletonCount = 9,
  rowSelection = false,
  showRatio = false,
}) => {
  const placeholder = (
    <div className='model-grid'>
      {Array.from({ length: skeletonCount }).map((_, index) => (
        <div key={index} className='mcard' style={{ gap: 14, pointerEvents: 'none' }}>
          {/* 头部 */}
          <div className='mcard-top'>
            <Skeleton.Avatar
              size='large'
              style={{ width: 46, height: 46, borderRadius: 11, flexShrink: 0 }}
            />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
              <Skeleton.Title style={{ width: `${100 + (index % 4) * 20}px`, height: 18 }} />
              <Skeleton.Button style={{ width: 60, height: 18, borderRadius: 4 }} />
            </div>
          </div>

          {/* 价格区 */}
          <div className='mcard-price' style={{ gap: 8 }}>
            <div className='prow'>
              <Skeleton.Button style={{ width: 40, height: 14, borderRadius: 4 }} />
              <Skeleton.Button style={{ width: 120, height: 14, borderRadius: 4 }} />
            </div>
            <div className='prow'>
              <Skeleton.Button style={{ width: 40, height: 14, borderRadius: 4 }} />
              <Skeleton.Button style={{ width: 120, height: 14, borderRadius: 4 }} />
            </div>
          </div>

          {/* 底部 */}
          <div className='mcard-foot'>
            <div style={{ display: 'flex', gap: 6 }}>
              <Skeleton.Button style={{ width: 60, height: 22, borderRadius: 4 }} />
              {index % 2 === 0 && (
                <Skeleton.Button style={{ width: 50, height: 22, borderRadius: 4 }} />
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return <Skeleton loading={true} active placeholder={placeholder} />;
};

export default PricingCardSkeleton;
