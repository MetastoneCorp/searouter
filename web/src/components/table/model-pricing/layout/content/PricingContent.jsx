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

import React, { useState } from 'react';
import PricingFilterModal from '../../modal/PricingFilterModal';
import PricingVendorIntroWithSkeleton from '../header/PricingVendorIntroWithSkeleton';
import SearchActions from '../header/SearchActions';
import PricingView from './PricingView';

const PricingContent = ({ isMobile, sidebarProps, ...props }) => {
  const [showFilterModal, setShowFilterModal] = useState(false);

  return (
    <>
      {isMobile ? (
        <>
          {/* 移动端：工具栏 + 内容 */}
          <div style={{ padding: '12px 16px 8px', flexShrink: 0 }}>
            <SearchActions
              {...props}
              isMobile={isMobile}
              searchValue={props.searchValue}
              setShowFilterModal={setShowFilterModal}
              showWithRecharge={sidebarProps.showWithRecharge}
              setShowWithRecharge={sidebarProps.setShowWithRecharge}
              currency={sidebarProps.currency}
              setCurrency={sidebarProps.setCurrency}
              showRatio={sidebarProps.showRatio}
              setShowRatio={sidebarProps.setShowRatio}
              viewMode={sidebarProps.viewMode}
              setViewMode={sidebarProps.setViewMode}
              tokenUnit={sidebarProps.tokenUnit}
              setTokenUnit={sidebarProps.setTokenUnit}
              t={props.t}
            />
          </div>
          <div style={{ flex: 1, overflow: 'auto', minHeight: 0 }}>
            <PricingView {...props} viewMode={sidebarProps.viewMode} />
          </div>
          <PricingFilterModal
            visible={showFilterModal}
            onClose={() => setShowFilterModal(false)}
            sidebarProps={sidebarProps}
            t={props.t}
          />
        </>
      ) : (
        <>
          {/* 桌面端：hero + toolbar + 卡片区 */}
          <PricingVendorIntroWithSkeleton
            loading={props.loading}
            filterVendor={props.filterVendor}
            models={props.filteredModels}
            allModels={props.models}
            t={props.t}
            selectedRowKeys={props.selectedRowKeys}
            copyText={props.copyText}
            handleChange={props.handleChange}
            handleCompositionStart={props.handleCompositionStart}
            handleCompositionEnd={props.handleCompositionEnd}
            isMobile={isMobile}
            searchValue={props.searchValue}
            setShowFilterModal={setShowFilterModal}
            showWithRecharge={sidebarProps.showWithRecharge}
            setShowWithRecharge={sidebarProps.setShowWithRecharge}
            currency={sidebarProps.currency}
            setCurrency={sidebarProps.setCurrency}
            showRatio={sidebarProps.showRatio}
            setShowRatio={sidebarProps.setShowRatio}
            viewMode={sidebarProps.viewMode}
            setViewMode={sidebarProps.setViewMode}
            tokenUnit={sidebarProps.tokenUnit}
            setTokenUnit={sidebarProps.setTokenUnit}
          />

          <PricingView {...props} viewMode={sidebarProps.viewMode} />
        </>
      )}
    </>
  );
};

export default PricingContent;
