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

import React, { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { useTranslation } from 'react-i18next';

// 简化版代码块（真实 markdown 渲染由 MessageContent 内的 Markdown 组件接管）
// 这里仅在 ConversationTurn 内供"reasoning_content 单段代码"等场景直接使用
const CodeBlock = ({ content, language }) => {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content || '');
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* 降级时忽略，用户可手动选中复制 */
    }
  };

  return (
    <div className='group relative my-3 overflow-hidden rounded-xl bg-zinc-50 ring-1 ring-zinc-100 dark:bg-zinc-900/60 dark:ring-zinc-800'>
      {language && (
        <div className='border-b border-zinc-100 px-4 py-1 text-[11px] font-mono uppercase tracking-wider text-zinc-400 dark:border-zinc-800/60'>
          {language}
        </div>
      )}
      <pre className='overflow-x-auto px-4 py-3 text-[13px] leading-relaxed text-zinc-800 dark:text-zinc-200'>
        <code>{content}</code>
      </pre>
      <button
        type='button'
        onClick={handleCopy}
        aria-label={t('复制')}
        className='absolute right-2 top-2 inline-flex h-7 w-7 items-center justify-center rounded-md bg-white/80 text-zinc-500 opacity-0 ring-1 ring-zinc-200 transition-opacity hover:text-zinc-900 group-hover:opacity-100 dark:bg-zinc-900/80 dark:text-zinc-400 dark:ring-zinc-700 dark:hover:text-zinc-100'
      >
        {copied ? <Check size={14} /> : <Copy size={14} />}
      </button>
    </div>
  );
};

export default CodeBlock;
