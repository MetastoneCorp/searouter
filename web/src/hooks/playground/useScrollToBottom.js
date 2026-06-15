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

import { useCallback, useEffect, useRef, useState } from 'react';

// 监听滚动容器：用户离底 > 80px 视为「主动上滚」，暂停 auto-scroll；
// 提供 scrollToBottom() 强制贴底；提供 atBottom 状态用于显示「↓ 跳到最新」按钮
export const useScrollToBottom = (deps = []) => {
  const containerRef = useRef(null);
  const [atBottom, setAtBottom] = useState(true);
  const userPausedRef = useRef(false);

  const scrollToBottom = useCallback((behavior = 'smooth') => {
    const el = containerRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior });
    userPausedRef.current = false;
    setAtBottom(true);
  }, []);

  // 监听用户滚动
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onScroll = () => {
      const distance = el.scrollHeight - el.scrollTop - el.clientHeight;
      const isAtBottom = distance < 80;
      setAtBottom(isAtBottom);
      if (!isAtBottom) {
        userPausedRef.current = true;
      } else {
        userPausedRef.current = false;
      }
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

  // deps 变化（消息流入）时如果用户没主动上滚 → 自动贴底
  useEffect(() => {
    if (!userPausedRef.current) {
      requestAnimationFrame(() => scrollToBottom('auto'));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { containerRef, atBottom, scrollToBottom };
};
