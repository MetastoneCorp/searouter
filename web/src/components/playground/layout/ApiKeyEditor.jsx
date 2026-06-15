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

import React, { useEffect, useState } from 'react';
import { Button, Input } from '@douyinfe/semi-ui';
import { Eye, EyeOff, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { STORAGE_KEYS } from '../../../constants/playground.constants';

const ApiKeyEditor = ({ initialValue = '', onSaved, onCleared }) => {
  const { t } = useTranslation();
  const [draft, setDraft] = useState(initialValue || '');
  const [showKey, setShowKey] = useState(false);

  useEffect(() => {
    setDraft(initialValue || '');
  }, [initialValue]);

  const isPersisted = !!initialValue;

  const handleSave = () => {
    const value = (draft || '')
      .trim()
      .replace(/[　 ​‌‍﻿]/g, '')
      .replace(/[^\x20-\x7E]/g, '');
    if (!value) return;
    localStorage.setItem(STORAGE_KEYS.API_KEY, value);
    onSaved?.(value);
  };

  const handleClear = () => {
    localStorage.removeItem(STORAGE_KEYS.API_KEY);
    setDraft('');
    onCleared?.();
  };

  return (
    <div className='pgw2-key-editor'>
      <div className='pgw2-key-editor-hd'>
        <span className='pgw2-key-label'>API Key</span>
        {isPersisted && (
          <button
            type='button'
            onClick={handleClear}
            className='pgw2-key-clear'
          >
            <Trash2 size={12} />
            {t('清空')}
          </button>
        )}
      </div>
      <div className='pgw2-key-row'>
        <Input
          value={draft}
          onChange={setDraft}
          type={showKey ? 'text' : 'password'}
          placeholder='sk-...'
          className='!rounded-lg flex-1'
          autoFocus
        />
        <button
          type='button'
          onClick={() => setShowKey((s) => !s)}
          className='pgw2-key-toggle'
        >
          {showKey ? <EyeOff size={14} /> : <Eye size={14} />}
        </button>
      </div>
      <Button
        theme='solid'
        onClick={handleSave}
        disabled={!draft || draft === initialValue}
        className='!rounded-lg !bg-[var(--brand-600)] hover:!bg-[var(--brand-500)] !border-0 !text-white hover:!text-white disabled:!bg-[var(--brand-600)] disabled:!text-white disabled:!opacity-50'
        block
      >
        {isPersisted ? t('更新 Key') : t('保存 Key')}
      </Button>
      <span className='pgw2-key-note'>
        {t('仅保存在当前浏览器，不会上传到服务端')}
      </span>
    </div>
  );
};

export default ApiKeyEditor;
