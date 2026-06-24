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
import { useTranslation } from 'react-i18next';
import { User, Sparkles, Settings2 } from 'lucide-react';

const ROLE_NAMES = { user: '用户', assistant: 'AI', system: '系统' };
const ROLE_ICONS = { user: User, assistant: Sparkles, system: Settings2 };

// 文档流角色帽：头像图标 + 名字（用户/AI/系统）在上、meta（model、time）在名字下方
const RoleLabel = ({ role, tone = 'default', children }) => {
  const { t } = useTranslation();
  const name = ROLE_NAMES[role]
    ? t(ROLE_NAMES[role])
    : (role || '').toUpperCase();
  const Icon = ROLE_ICONS[role];
  return (
    <div className='pgw2-role'>
      {Icon && (
        <span
          className={`pgw2-role-avatar pgw2-role-avatar--${role}`}
          title={name}
        >
          <Icon size={15} strokeWidth={2} />
        </span>
      )}
      {children && (
        <span className={`pgw2-role-meta${tone === 'error' ? ' error' : ''}`}>
          {children}
        </span>
      )}
    </div>
  );
};

export default RoleLabel;
