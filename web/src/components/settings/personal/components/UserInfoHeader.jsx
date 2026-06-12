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
import { isRoot, isAdmin, renderQuota } from '../../../../helpers';

const UserInfoHeader = ({ t, userState }) => {
  const getUsername = () => {
    if (userState.user) {
      return userState.user.username;
    }
    return 'null';
  };

  const getAvatarText = () => {
    const username = getUsername();
    if (username && username.length > 0) {
      return username.slice(0, 2).toUpperCase();
    }
    return 'NA';
  };

  const getRoleLabel = () => {
    if (isRoot()) return t('超级管理员');
    if (isAdmin()) return t('管理员');
    return t('普通用户');
  };

  return (
    <>
      {/* 个人资料 banner */}
      <div className='srv-profile'>
        <div className='ava'>{getAvatarText()}</div>
        <div>
          <div className='nm'>{getUsername()}</div>
          <div className='sub'>
            <span>{getRoleLabel()}</span>
            <span>ID: {userState?.user?.id}</span>
          </div>
        </div>
      </div>

      {/* 概览数据卡 */}
      <div className='srv-ovgrid'>
        <div className='srv-ovcard'>
          <div className='k'>{t('当前余额')}</div>
          <div className='v'>{renderQuota(userState?.user?.quota)}</div>
        </div>
        <div className='srv-ovcard'>
          <div className='k'>{t('历史消耗')}</div>
          <div className='v'>{renderQuota(userState?.user?.used_quota)}</div>
        </div>
        <div className='srv-ovcard'>
          <div className='k'>{t('请求次数')}</div>
          <div className='v'>{userState?.user?.request_count || 0}</div>
        </div>
        <div className='srv-ovcard'>
          <div className='k'>{t('用户分组')}</div>
          <div className='v' style={{ fontSize: '18px' }}>
            {userState?.user?.group || t('默认')}
          </div>
        </div>
      </div>
    </>
  );
};

export default UserInfoHeader;
