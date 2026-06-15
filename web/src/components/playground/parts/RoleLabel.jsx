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
  return (
    <div className='flex items-center gap-2'>
      <span className={`pgw2-role-text${tone === 'error' ? ' error' : ''}`}>
        {text}
      </span>
      {children && (
        <span className='pgw2-role-meta'>{children}</span>
      )}
    </div>
  );
};

export default RoleLabel;
