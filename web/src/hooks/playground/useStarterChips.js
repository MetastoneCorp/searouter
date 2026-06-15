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

import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

// 4 类目，每类 2 条变体（i18n key 后缀 _label / _prompt）
const CATEGORY_CONFIG = [
  {
    category: 'write',
    dotClass: 'bg-orange-500',
    keys: ['write_email', 'write_polish'],
  },
  {
    category: 'code',
    dotClass: 'bg-cyan-500',
    keys: ['code_explain', 'code_sql'],
  },
  {
    category: 'analyze',
    dotClass: 'bg-zinc-500',
    keys: ['analyze_summary', 'analyze_data'],
  },
  {
    category: 'misc',
    dotClass: 'bg-orange-500',
    keys: ['misc_brainstorm', 'misc_translate'],
  },
];

// 每挂载一次随机抽 4 条（每类目各 1 条），保持稳定到下次刷新
export const useStarterChips = () => {
  const { t, i18n } = useTranslation();

  return useMemo(() => {
    return CATEGORY_CONFIG.map(({ category, dotClass, keys }) => {
      const pickedKey = keys[Math.floor(Math.random() * keys.length)];
      return {
        id: `${category}-${pickedKey}`,
        category,
        dotClass,
        label: t(`playground.starter.${pickedKey}_label`),
        prompt: t(`playground.starter.${pickedKey}_prompt`),
      };
    });
    // 依赖 language：切换语言时重新抽取一次
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n.language, t]);
};
