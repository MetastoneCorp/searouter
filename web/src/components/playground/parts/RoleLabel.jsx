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

// 文档流角色小帽：USER · ASSISTANT · SYSTEM；右侧可拼接 children（model meta、time）
const RoleLabel = ({ role, tone = 'default', children }) => {
  const text = (role || '').toUpperCase();
  const colorCls =
    tone === 'error'
      ? 'text-red-500 dark:text-red-400'
      : 'text-zinc-500 dark:text-zinc-400';
  return (
    <div
      className={`flex items-baseline gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] ${colorCls}`}
    >
      <span>{text}</span>
      {children && (
        <span className='text-[11px] font-normal tracking-normal text-zinc-400 dark:text-zinc-500'>
          {children}
        </span>
      )}
    </div>
  );
};

export default RoleLabel;
