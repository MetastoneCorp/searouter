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
    <div className='pgw2-scroll-btn-wrap'>
      <button
        type='button'
        onClick={onClick}
        aria-label={t('跳到最新')}
        title={t('跳到最新')}
        className='pgw2-scroll-btn'
      >
        <ArrowDown size={15} strokeWidth={2} />
      </button>
    </div>
  );
};

export default ScrollToLatest;
