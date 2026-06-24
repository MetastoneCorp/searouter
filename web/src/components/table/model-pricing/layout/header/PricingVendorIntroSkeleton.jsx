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

import React, { memo } from 'react';

/* plaza-hero 骨架屏：模拟 hero 区块加载态 */
const PricingVendorIntroSkeleton = memo(
  ({ isAllVendors = false, isMobile = false }) => {
    const pulse = {
      background: 'rgba(255,255,255,.22)',
      borderRadius: 6,
      animation: 'pulse 1.6s ease-in-out infinite',
    };

    return (
      <>
        {/* Hero 骨架 */}
        <div className='plaza-hero' style={{ pointerEvents: 'none' }}>
          <div style={{ ...pulse, width: 200, height: 36, marginBottom: 16 }} />
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <div style={{ ...pulse, width: 120, height: 18 }} />
            <div style={{ ...pulse, width: 220, height: 18 }} />
          </div>
          <div
            className='spark'
            style={{
              background: 'rgba(255,255,255,.1)',
              border: '1px solid rgba(255,255,255,.2)',
            }}
          >
            <div
              style={{ ...pulse, width: 40, height: 40, borderRadius: '50%' }}
            />
          </div>
        </div>

        {/* 工具栏骨架 */}
        <div className='plaza-tools'>
          <div
            style={{
              flex: 1,
              height: 42,
              background: 'var(--border-2)',
              borderRadius: 10,
              animation: 'pulse 1.6s ease-in-out infinite',
            }}
          />
          <div
            style={{
              width: 80,
              height: 30,
              background: 'var(--border-2)',
              borderRadius: 6,
              animation: 'pulse 1.6s ease-in-out infinite',
            }}
          />
          {!isMobile && (
            <>
              <div
                style={{
                  width: 120,
                  height: 30,
                  background: 'var(--border-2)',
                  borderRadius: 6,
                  animation: 'pulse 1.6s ease-in-out infinite',
                }}
              />
              <div
                style={{
                  width: 100,
                  height: 30,
                  background: 'var(--border-2)',
                  borderRadius: 9,
                  animation: 'pulse 1.6s ease-in-out infinite',
                }}
              />
            </>
          )}
        </div>
      </>
    );
  },
);

PricingVendorIntroSkeleton.displayName = 'PricingVendorIntroSkeleton';

export default PricingVendorIntroSkeleton;
