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
import { Button } from '@douyinfe/semi-ui';
import { RefreshCw, Clock } from 'lucide-react';

const DashboardHeader = ({
  getGreeting,
  greetingVisible,
  showSearchModal,
  refresh,
  loading,
  inputs,
  t,
}) => {
  return (
    <div className='page-head flex-wrap'>
      <div>
        <div className='page-title'>{t('数据看板')}</div>
        <div
          className='page-sub transition-opacity duration-1000 ease-in-out'
          style={{ opacity: greetingVisible ? 1 : 0 }}
        >
          {getGreeting}
        </div>
      </div>
      <div className='flex items-center gap-2.5 flex-wrap'>
        <button
          type='button'
          onClick={showSearchModal}
          className='flex items-center gap-2 h-[38px] px-3.5 bg-surface border border-line rounded-md text-[13px] text-ink-2 tnum transition-colors hover:border-[#CBD2DE] hover:bg-surface-2'
        >
          <span>{String(inputs?.start_timestamp ?? '')}</span>
          <span className='text-ink-3'>→</span>
          <span>{String(inputs?.end_timestamp ?? '')}</span>
          <Clock size={15} className='text-ink-3' />
        </button>
        <Button
          theme='light'
          type='tertiary'
          icon={<RefreshCw size={16} />}
          onClick={refresh}
          loading={loading}
          aria-label={t('刷新')}
          className='!h-[38px] !w-[38px] !rounded-md !border !border-solid !border-line !bg-surface'
        />
      </div>
    </div>
  );
};

export default DashboardHeader;
