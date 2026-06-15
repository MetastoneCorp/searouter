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

// 启动提示芯片：横向胶囊，带类目色点；点击调用 onPick(prompt) 让父组件填充输入框
// props.chips 由 useStarterChips() 提供，结构：[{id, category, dotClass, label, prompt}]
const StarterChips = ({ chips, onPick }) => {
  if (!chips || chips.length === 0) return null;

  return (
    <div className='pgw2-chips'>
      {chips.map((chip) => (
        <button
          key={chip.id}
          type='button'
          onClick={() => onPick?.(chip.prompt)}
          className='pgw2-chip'
        >
          <span
            className={`pgw2-chip-dot ${chip.dotClass}`}
            aria-hidden='true'
          />
          {chip.label}
        </button>
      ))}
    </div>
  );
};

export default StarterChips;
