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
import { Copy, Pencil, RefreshCw, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

// 单条 turn 的 hover 操作栏。所有按钮都是图标+短文字，editorial 调子。
// props:
//  - role
//  - canCopy, canRetry, canEdit, canDelete  (布尔门控)
//  - onCopy, onRetry, onEdit, onDelete
const ActionBtn = ({ icon: Icon, label, onClick, disabled }) => (
  <button
    type='button'
    onClick={onClick}
    disabled={disabled}
    className='pgw2-action-btn'
  >
    <Icon size={13} strokeWidth={2} />
    <span>{label}</span>
  </button>
);

const TurnActionBar = ({
  role,
  canCopy = true,
  canRetry = true,
  canEdit = true,
  canDelete = true,
  onCopy,
  onRetry,
  onEdit,
  onDelete,
}) => {
  const { t } = useTranslation();
  return (
    <div className='pgw2-actions'>
      {canCopy && (
        <ActionBtn icon={Copy} label={t('复制')} onClick={onCopy} />
      )}
      {canRetry && role === 'assistant' && (
        <ActionBtn icon={RefreshCw} label={t('重生成')} onClick={onRetry} />
      )}
      {canEdit && role === 'user' && (
        <ActionBtn icon={Pencil} label={t('编辑')} onClick={onEdit} />
      )}
      {canDelete && (
        <ActionBtn icon={Trash2} label={t('删除')} onClick={onDelete} />
      )}
    </div>
  );
};

export default TurnActionBar;
