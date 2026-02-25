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
import { Link, useLocation } from 'react-router-dom';
import SkeletonWrapper from '../components/SkeletonWrapper';

const Navigation = ({
  mainNavLinks,
  isMobile,
  isLoading,
  userState,
  pricingRequireAuth,
}) => {
  const location = useLocation();

  const isActive = (link) => {
    const currentPath = location.pathname;

    // 首页精确匹配
    if (link.itemKey === 'home') {
      return currentPath === '/';
    }

    // 控制台：匹配 /console 路径
    if (link.itemKey === 'console') {
      return currentPath.startsWith('/console');
    }

    // 其他路径精确匹配
    return currentPath === link.to;
  };

  const renderNavLinks = () => {
    const baseClasses =
      'flex-shrink-0 flex items-center gap-1 font-semibold rounded-md transition-all duration-200 ease-in-out';
    const spacingClasses = isMobile ? 'p-1' : 'p-2';

    return mainNavLinks.map((link) => {
      const linkContent = <span>{link.text}</span>;
      const active = isActive(link);

      // 选中状态样式
      const activeClasses = active
        ? 'text-semi-color-primary bg-semi-color-primary-light-default'
        : 'hover:text-semi-color-primary';

      const commonLinkClasses = `${baseClasses} ${spacingClasses} ${activeClasses}`;

      if (link.isExternal) {
        return (
          <a
            key={link.itemKey}
            href={link.externalLink}
            target='_blank'
            rel='noopener noreferrer'
            className={commonLinkClasses}
          >
            {linkContent}
          </a>
        );
      }

      let targetPath = link.to;
      if (link.itemKey === 'console' && !userState.user) {
        targetPath = '/login';
      }
      if (link.itemKey === 'pricing' && pricingRequireAuth && !userState.user) {
        targetPath = '/login';
      }

      return (
        <Link key={link.itemKey} to={targetPath} className={commonLinkClasses}>
          {linkContent}
        </Link>
      );
    });
  };

  return (
    <nav className='flex flex-1 items-center gap-1 lg:gap-2 mx-2 md:mx-4 overflow-x-auto whitespace-nowrap scrollbar-hide'>
      <SkeletonWrapper
        loading={isLoading}
        type='navigation'
        count={4}
        width={60}
        height={16}
        isMobile={isMobile}
      >
        {renderNavLinks()}
      </SkeletonWrapper>
    </nav>
  );
};

export default Navigation;
