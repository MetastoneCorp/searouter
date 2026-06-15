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

// 极淡 mesh gradient，仅 empty 态渲染；移动端隐藏，深色模式降低 opacity
// 使用内联 style 实现 radial gradient（Tailwind 无法表达）
const BrandFingerprint = () => {
  return (
    <div
      aria-hidden='true'
      className='pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 hidden md:block'
      style={{
        width: 'min(900px, 90vw)',
        height: 320,
        filter: 'blur(40px)',
        opacity: 0.6,
        background:
          'radial-gradient(40% 60% at 30% 40%, rgba(234, 88, 12, 0.08), transparent 70%), radial-gradient(35% 55% at 70% 50%, rgba(8, 145, 178, 0.06), transparent 70%)',
      }}
    />
  );
};

// 深色模式 opacity 通过外层注入的 dark-mode wrapper 控制
export default BrandFingerprint;
