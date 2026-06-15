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
    <div className='-mx-1 flex w-full flex-nowrap gap-2 overflow-x-auto px-1 py-1 md:flex-wrap md:overflow-visible'>
      {chips.map((chip) => (
        <button
          key={chip.id}
          type='button'
          onClick={() => onPick?.(chip.prompt)}
          className='inline-flex flex-shrink-0 items-center gap-2 rounded-full border border-zinc-200 bg-white px-3.5 py-1.5 text-[13px] text-zinc-700 transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-zinc-300 hover:text-zinc-900 active:translate-y-[1px] dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:border-zinc-700 dark:hover:text-zinc-100'
        >
          <span
            className={`inline-block h-1.5 w-1.5 rounded-full ${chip.dotClass}`}
            aria-hidden='true'
          />
          {chip.label}
        </button>
      ))}
    </div>
  );
};

export default StarterChips;
