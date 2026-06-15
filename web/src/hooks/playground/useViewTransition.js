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

import { useCallback } from 'react';

// 现代浏览器 → document.startViewTransition；旧浏览器 → 同步执行
// 用法：const withTransition = useViewTransition();
//      withTransition(() => setMessages([...]));
export const useViewTransition = () => {
  const supports =
    typeof document !== 'undefined' &&
    typeof document.startViewTransition === 'function';

  return useCallback(
    (updater) => {
      if (typeof updater !== 'function') return;
      if (supports) {
        document.startViewTransition(updater);
      } else {
        updater();
      }
    },
    [supports],
  );
};
