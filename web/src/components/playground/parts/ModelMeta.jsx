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

const formatTime = (createAt) => {
  if (!createAt) return '';
  try {
    const d = new Date(createAt);
    return d.toLocaleTimeString(undefined, {
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return '';
  }
};

// 角色标签右侧的 inline meta：可选 model + time，点 dot 分隔
const ModelMeta = ({ model, createAt }) => {
  const time = formatTime(createAt);
  const parts = [];
  if (model) parts.push(model);
  if (time) parts.push(time);
  if (parts.length === 0) return null;
  return (
    <span className='font-mono tabular-nums'>{parts.join(' · ')}</span>
  );
};

export default ModelMeta;
