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
import { API, showError } from '../../helpers';
import { marked } from 'marked';
import { Empty } from '@douyinfe/semi-ui';
import {
  IllustrationConstruction,
  IllustrationConstructionDark,
} from '@douyinfe/semi-illustrations';
import { useTranslation } from 'react-i18next';
import AboutContent from './AboutContent';

// 判断是否为 URL 链接（支持 http://, https://, 和 / 开头的相对路径）
const isUrl = (str) => {
  return (
    str.startsWith('http://') ||
    str.startsWith('https://') ||
    str.startsWith('/')
  );
};

const About = () => {
  const { t } = useTranslation();
  const [about, setAbout] = useState('');
  const [aboutLoaded, setAboutLoaded] = useState(false);
  const currentYear = new Date().getFullYear();

  const displayAbout = async () => {
    setAbout(localStorage.getItem('about') || '');
    const res = await API.get('/api/about');
    const { success, message, data } = res.data;
    if (success) {
      let aboutContent = data;
      if (!isUrl(data)) {
        aboutContent = marked.parse(data);
      }
      setAbout(aboutContent);
      localStorage.setItem('about', aboutContent);
    } else {
      showError(message);
      setAbout(t('加载关于内容失败...'));
    }
    setAboutLoaded(true);
  };

  useEffect(() => {
    displayAbout().then();
  }, []);

  const emptyStyle = {
    padding: '24px',
  };

  const customDescription = (
    <div style={{ textAlign: 'center' }}>
      <p>{t('可在设置页面设置关于内容，支持 HTML & Markdown')}</p>
      <p>
        {getSystemName()}{' '}
        {t('© {{currentYear}}', { currentYear })}{' '}
        {t('| 基于')}{' '}
        <a
          href='https://github.com/QuantumNous/new-api'
          target='_blank'
          rel='noopener noreferrer'
          className='!text-semi-color-primary'
        >
          New API
        </a>{' '}
        {t('开发')}
      </p>
      <p>
        {t('本项目根据')}
        <a
          href='https://github.com/songquanpeng/one-api/blob/v0.5.4/LICENSE'
          target='_blank'
          rel='noopener noreferrer'
          className='!text-semi-color-primary'
        >
          {t('MIT许可证')}
        </a>
        {t('授权，需在遵守')}
        <a
          href='https://www.gnu.org/licenses/agpl-3.0.html'
          target='_blank'
          rel='noopener noreferrer'
          className='!text-semi-color-primary'
        >
          {t('AGPL v3.0协议')}
        </a>
        {t('的前提下使用。')}
      </p>
    </div>
  );

  // 如果管理员设置了自定义内容或 URL
  if (aboutLoaded && about !== '') {
    return (
      <div className='mt-[60px] px-2'>
        {isUrl(about) ? (
          <iframe
            src={about}
            style={{ width: '100%', height: '100vh', border: 'none' }}
            title='About'
          />
        ) : (
          <div
            style={{ fontSize: 'larger' }}
            dangerouslySetInnerHTML={{ __html: about }}
          />
        )}
      </div>
    );
  }

  // 如果正在加载
  if (!aboutLoaded) {
    return <div className='mt-[60px] px-2'>{t('加载中...')}</div>;
  }

  // 如果管理员没有设置内容，显示多语言默认内容
  // 检查是否在 iframe 中（被嵌入时显示简洁版本）
  const isInIframe = window.self !== window.top;

  if (isInIframe) {
    return (
      <div className='mt-[60px] px-2'>
        <div className='flex justify-center items-center h-screen p-8'>
          <Empty
            image={
              <IllustrationConstruction style={{ width: 150, height: 150 }} />
            }
            darkModeImage={
              <IllustrationConstructionDark
                style={{ width: 150, height: 150 }}
              />
            }
            description={t('管理员暂时未设置任何关于内容')}
            style={emptyStyle}
          >
            {customDescription}
          </Empty>
        </div>
      </div>
    );
  }

  // 显示多语言默认 About 页面
  return <AboutContent />;
};

export default About;
