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
    <div className='pgw2-code'>
      {language && <div className='pgw2-code-lang'>{language}</div>}
      <pre className='pgw2-code pre'>
        <code>{content}</code>
      </pre>
      <button
        type='button'
        onClick={handleCopy}
        aria-label={t('复制')}
        className='pgw2-code-copy'
      >
        {copied ? <Check size={13} /> : <Copy size={13} />}
      </button>
    </div>
  );
};

export default CodeBlock;
