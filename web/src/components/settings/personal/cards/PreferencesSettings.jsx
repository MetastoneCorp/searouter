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

import React, { useState, useEffect, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { API, showSuccess, showError } from '../../../../helpers';
import { UserContext } from '../../../../context/User';

// Language options with native names — 仅这三项，勿增删
const languageOptions = [
  { value: 'zh-CN', label: '简体中文' },
  { value: 'zh-TW', label: '繁體中文' },
  { value: 'en', label: 'English' },
];

const PreferencesSettings = ({ t }) => {
  const { i18n } = useTranslation();
  const [userState, userDispatch] = useContext(UserContext);
  const [currentLanguage, setCurrentLanguage] = useState(
    i18n.language || 'zh-CN',
  );
  const [loading, setLoading] = useState(false);

  // Load saved language preference from user settings
  useEffect(() => {
    if (userState?.user?.setting) {
      try {
        const settings = JSON.parse(userState.user.setting);
        if (settings.language) {
          const lang = settings.language === 'zh' ? 'zh-CN' : settings.language;
          setCurrentLanguage(lang);
          if (i18n.language !== lang) {
            i18n.changeLanguage(lang);
          }
        }
      } catch (e) {
        // Ignore parse errors
      }
    }
  }, [userState?.user?.setting, i18n]);

  const handleLanguagePreferenceChange = async (lang) => {
    if (lang === currentLanguage) return;

    setLoading(true);
    const previousLang = currentLanguage;

    try {
      setCurrentLanguage(lang);
      i18n.changeLanguage(lang);

      const res = await API.put('/api/user/self', { language: lang });

      if (res.data.success) {
        showSuccess(t('语言偏好已保存'));
        if (userState?.user?.setting) {
          try {
            const settings = JSON.parse(userState.user.setting);
            settings.language = lang;
            userDispatch({
              type: 'login',
              payload: {
                ...userState.user,
                setting: JSON.stringify(settings),
              },
            });
          } catch (e) {
            // Ignore
          }
        }
      } else {
        showError(res.data.message || t('保存失败'));
        setCurrentLanguage(previousLang);
        i18n.changeLanguage(previousLang);
      }
    } catch (error) {
      showError(t('保存失败，请重试'));
      setCurrentLanguage(previousLang);
      i18n.changeLanguage(previousLang);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='card card-pad srv-block'>
      <div className='srv-sectitle'>
        <svg
          width='18'
          height='18'
          viewBox='0 0 24 24'
          fill='none'
          stroke='var(--ink-2)'
          strokeWidth='1.8'
        >
          <circle cx='12' cy='12' r='9' />
          <path d='M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18' />
        </svg>
        {t('偏好设置')}
      </div>
      <div className='srv-secsub'>{t('界面语言和其他个人偏好')}</div>

      <div className='srv-bar' style={{ marginTop: '18px' }}>
        {t('语言偏好')}
      </div>
      <select
        className='select'
        style={{ maxWidth: '280px' }}
        value={currentLanguage}
        disabled={loading}
        onChange={(e) => handleLanguagePreferenceChange(e.target.value)}
      >
        {languageOptions.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <div className='helper' style={{ marginTop: '8px' }}>
        {t(
          '提示：语言偏好会同步到您登录的所有设备，并影响API返回的错误消息语言。',
        )}
      </div>
    </div>
  );
};

export default PreferencesSettings;
