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

// Modified by searouter contributors on 2026-09-10: unify the global footer
// and update custom HTML when the asynchronous status configuration changes.

import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IconGithubLogo } from '@douyinfe/semi-icons';
import { getFooterHTML } from '../../helpers';
import { StatusContext } from '../../context/Status';
import './Footer.css';

const FooterBar = () => {
  const { t } = useTranslation();
  const [statusState] = useContext(StatusContext);
  const [cachedFooter] = useState(getFooterHTML);
  const footer = statusState?.status
    ? statusState.status.footer_html
    : cachedFooter;

  if (footer) {
    return (
      <div
        className='custom-footer'
        dangerouslySetInnerHTML={{ __html: footer }}
      />
    );
  }

  return (
    <div className='global-footer'>
      <span className='global-footer-copyright'>
        {t('footer.copyright', { year: new Date().getFullYear() })}
      </span>
      <div className='global-footer-signature'>
        <span className='global-footer-credit'>
          {t('footer.credit')}{' '}
          <a
            href='https://www.metastonecorp.com/'
            target='_blank'
            rel='noopener noreferrer'
          >
            METASTONE
          </a>
        </span>
        <span className='global-footer-divider' aria-hidden='true' />
        <a
          className='global-footer-github'
          href='https://github.com/MetastoneCorp/searouter'
          target='_blank'
          rel='noopener noreferrer'
        >
          <IconGithubLogo style={{ fontSize: 16 }} aria-hidden='true' />
          <span>GITHUB</span>
        </a>
      </div>
    </div>
  );
};

export default FooterBar;
