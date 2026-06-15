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
import { SideSheet } from '@douyinfe/semi-ui';
import { useTranslation } from 'react-i18next';
import { OptimizedDebugPanel } from '../OptimizedComponents';

const DebugDrawer = ({
  visible,
  onClose,
  isMobile,
  debugData,
  activeDebugTab,
  onActiveDebugTabChange,
  customRequestMode,
}) => {
  const { t } = useTranslation();

  return (
    <SideSheet
      title={t('调试信息')}
      placement='right'
      visible={visible}
      onCancel={onClose}
      width={isMobile ? '100%' : 480}
      mask={isMobile}
      bodyStyle={{ padding: 0, height: '100%' }}
      headerStyle={{ borderBottom: '1px solid var(--semi-color-border)' }}
    >
      <div className='h-full'>
        <OptimizedDebugPanel
          debugData={debugData}
          activeDebugTab={activeDebugTab}
          onActiveDebugTabChange={onActiveDebugTabChange}
          styleState={{ isMobile }}
          customRequestMode={customRequestMode}
        />
      </div>
    </SideSheet>
  );
};

export default DebugDrawer;
