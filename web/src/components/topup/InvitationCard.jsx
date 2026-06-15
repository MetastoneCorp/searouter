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

const InvitationCard = ({
  t,
  userState,
  renderQuota,
  setOpenTransfer,
  affLink,
  handleAffLinkClick,
}) => {
  const hasAffQuota = userState?.user?.aff_quota && userState?.user?.aff_quota > 0;

  return (
    <div className='card card-pad srv-block' style={{ marginTop: 0 }}>
      {/* 卡片标题 */}
      <div className='srv-sectitle'>
        <svg width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='var(--ink-2)' strokeWidth='1.8'>
          <circle cx='9' cy='8' r='3' />
          <path d='M3 20a6 6 0 0 1 12 0M16 5a3 3 0 0 1 0 6M15 20a6 6 0 0 1 6-6' />
        </svg>
        {t('邀请奖励')}
      </div>
      <div className='srv-secsub'>{t('邀请好友获得额外奖励')}</div>

      {/* 收益统计格 */}
      <div className='srv-acctstat'>
        <div>
          <div className='k'>{t('待使用收益')}</div>
          <div className='v tnum'>{renderQuota(userState?.user?.aff_quota || 0)}</div>
        </div>
        <div>
          <div className='k'>{t('总收益')}</div>
          <div className='v tnum'>{renderQuota(userState?.user?.aff_history_quota || 0)}</div>
        </div>
        <div>
          <div className='k'>{t('邀请人数')}</div>
          <div className='v tnum'>{userState?.user?.aff_count || 0}</div>
        </div>
      </div>

      {/* 划转按钮 */}
      <div style={{ marginTop: 14, display: 'flex', justifyContent: 'flex-end' }}>
        <button
          className='btn btn-ghost btn-sm'
          disabled={!hasAffQuota}
          style={!hasAffQuota ? { opacity: 0.45, cursor: 'not-allowed' } : {}}
          onClick={() => hasAffQuota && setOpenTransfer(true)}
        >
          <svg width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
            <path d='M13 5l7 7-7 7M5 12h14' />
          </svg>
          {t('划转到余额')}
        </button>
      </div>

      {/* 邀请链接 */}
      <div style={{ marginTop: 18 }}>
        <div className='field-label'>{t('邀请链接')}</div>
        <div className='row' style={{ gap: 10 }}>
          <input
            className='input mono'
            readOnly
            value={affLink}
            style={{ flex: 1 }}
          />
          <button className='btn btn-primary' onClick={handleAffLinkClick}>
            <svg width='15' height='15' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.8'>
              <rect x='9' y='9' width='11' height='11' rx='2' />
              <path d='M5 15V5a2 2 0 0 1 2-2h10' />
            </svg>
            {t('复制')}
          </button>
        </div>
      </div>

      {/* 奖励说明 */}
      <div style={{ marginTop: 18 }}>
        <div className='field-label'>{t('奖励说明')}</div>
        <ul className='srv-bullets'>
          <li>{t('邀请好友注册，好友充值后您可获得相应奖励')}</li>
          <li>{t('通过划转功能将奖励额度转入到您的账户余额中')}</li>
          <li>{t('邀请的好友越多，获得的奖励越多')}</li>
        </ul>
      </div>
    </div>
  );
};

export default InvitationCard;
