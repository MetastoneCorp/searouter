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

import { useCallback, useState } from 'react';
import { STORAGE_KEYS } from '../../constants/playground.constants';

// 仅未登录时使用：本地 ApiKey 存取 + 派生 hasAuth + 清空回调
export const useApiKey = ({ isLoggedIn, onChange }) => {
  const [apiKey, setApiKeyState] = useState(() => {
    const raw = localStorage.getItem(STORAGE_KEYS.API_KEY) || '';
    const clean = raw
      .replace(/[　 ​‌‍﻿]/g, '')
      .replace(/[^\x20-\x7E]/g, '')
      .trim();
    // 如果脏数据被清理掉了，同步回写
    if (clean !== raw) {
      if (clean) localStorage.setItem(STORAGE_KEYS.API_KEY, clean);
      else localStorage.removeItem(STORAGE_KEYS.API_KEY);
    }
    return clean;
  });

  const setApiKey = useCallback(
    (value) => {
      const next = value || '';
      if (next) {
        localStorage.setItem(STORAGE_KEYS.API_KEY, next);
      } else {
        localStorage.removeItem(STORAGE_KEYS.API_KEY);
      }
      setApiKeyState(next);
      onChange?.(next);
    },
    [onChange],
  );

  const clearApiKey = useCallback(() => setApiKey(''), [setApiKey]);

  // 已登录用 session；未登录用 apiKey
  const hasAuth = isLoggedIn || !!apiKey;

  return { apiKey, setApiKey, clearApiKey, hasAuth };
};
