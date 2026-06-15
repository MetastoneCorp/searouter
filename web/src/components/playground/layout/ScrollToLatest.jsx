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
import { ArrowDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';

// 用户上滚后浮现的「跳到最新」按钮。位置：滚动容器右下，使用 sticky 实现避免被 absolute 撞容器边
const ScrollToLatest = ({ visible, onClick }) => {
  const { t } = useTranslation();
  if (!visible) return null;
  return (
    <div className='pointer-events-none sticky bottom-4 z-20 flex justify-end pr-2'>
      <button
        type='button'
        onClick={onClick}
        aria-label={t('跳到最新')}
        title={t('跳到最新')}
        className='pointer-events-auto inline-flex h-10 w-10 items-center justify-center rounded-full bg-white text-zinc-700 ring-1 ring-zinc-200 shadow-md transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:text-zinc-900 active:translate-y-[1px] dark:bg-zinc-900 dark:text-zinc-200 dark:ring-zinc-800 dark:hover:text-zinc-100'
      >
        <ArrowDown size={16} strokeWidth={2} />
      </button>
    </div>
  );
};

export default ScrollToLatest;
