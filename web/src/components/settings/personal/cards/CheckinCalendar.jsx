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

import React, { useState, useEffect, useMemo } from 'react';
import { Calendar, Spin, Tooltip, Collapsible, Modal } from '@douyinfe/semi-ui';
import { Check, ChevronDown, ChevronUp } from 'lucide-react';
import Turnstile from 'react-turnstile';
import { API, showError, showSuccess, renderQuota } from '../../../../helpers';

const CheckinCalendar = ({ t, status, turnstileEnabled, turnstileSiteKey }) => {
  const [loading, setLoading] = useState(false);
  const [checkinLoading, setCheckinLoading] = useState(false);
  const [turnstileModalVisible, setTurnstileModalVisible] = useState(false);
  const [turnstileWidgetKey, setTurnstileWidgetKey] = useState(0);
  const [checkinData, setCheckinData] = useState({
    enabled: false,
    stats: {
      checked_in_today: false,
      total_checkins: 0,
      total_quota: 0,
      checkin_count: 0,
      records: [],
    },
  });
  const [currentMonth, setCurrentMonth] = useState(
    new Date().toISOString().slice(0, 7),
  );
  const [initialLoaded, setInitialLoaded] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(null);

  const checkinRecordsMap = useMemo(() => {
    const map = {};
    const records = checkinData.stats?.records || [];
    records.forEach((record) => {
      map[record.checkin_date] = record.quota_awarded;
    });
    return map;
  }, [checkinData.stats?.records]);

  const monthlyQuota = useMemo(() => {
    const records = checkinData.stats?.records || [];
    return records.reduce(
      (sum, record) => sum + (record.quota_awarded || 0),
      0,
    );
  }, [checkinData.stats?.records]);

  const fetchCheckinStatus = async (month) => {
    const isFirstLoad = !initialLoaded;
    setLoading(true);
    try {
      const res = await API.get(`/api/user/checkin?month=${month}`);
      const { success, data, message } = res.data;
      if (success) {
        setCheckinData(data);
        if (isFirstLoad) {
          setIsCollapsed(data.stats?.checked_in_today ?? false);
          setInitialLoaded(true);
        }
      } else {
        showError(message || t('获取签到状态失败'));
        if (isFirstLoad) {
          setIsCollapsed(false);
          setInitialLoaded(true);
        }
      }
    } catch (error) {
      showError(t('获取签到状态失败'));
      if (isFirstLoad) {
        setIsCollapsed(false);
        setInitialLoaded(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const postCheckin = async (token) => {
    const url = token
      ? `/api/user/checkin?turnstile=${encodeURIComponent(token)}`
      : '/api/user/checkin';
    return API.post(url);
  };

  const shouldTriggerTurnstile = (message) => {
    if (!turnstileEnabled) return false;
    if (typeof message !== 'string') return true;
    return message.includes('Turnstile');
  };

  const doCheckin = async (token) => {
    setCheckinLoading(true);
    try {
      const res = await postCheckin(token);
      const { success, data, message } = res.data;
      if (success) {
        showSuccess(
          t('签到成功！获得') + ' ' + renderQuota(data.quota_awarded),
        );
        fetchCheckinStatus(currentMonth);
        setTurnstileModalVisible(false);
      } else {
        if (!token && shouldTriggerTurnstile(message)) {
          if (!turnstileSiteKey) {
            showError('Turnstile is enabled but site key is empty.');
            return;
          }
          setTurnstileModalVisible(true);
          return;
        }
        if (token && shouldTriggerTurnstile(message)) {
          setTurnstileWidgetKey((v) => v + 1);
        }
        showError(message || t('签到失败'));
      }
    } catch (error) {
      showError(t('签到失败'));
    } finally {
      setCheckinLoading(false);
    }
  };

  useEffect(() => {
    if (status?.checkin_enabled) {
      fetchCheckinStatus(currentMonth);
    }
  }, [status?.checkin_enabled, currentMonth]);

  if (!status?.checkin_enabled) {
    return null;
  }

  const dateRender = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return null;
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
    const quotaAwarded = checkinRecordsMap[formattedDate];
    const isCheckedIn = quotaAwarded !== undefined;

    if (isCheckedIn) {
      return (
        <Tooltip
          content={`${t('获得')} ${renderQuota(quotaAwarded)}`}
          position='top'
        >
          <div className='absolute inset-0 flex flex-col items-center justify-center cursor-pointer'>
            <div className='w-6 h-6 rounded-full bg-green-500 flex items-center justify-center mb-0.5 shadow-sm'>
              <Check size={14} className='text-white' strokeWidth={3} />
            </div>
            <div className='text-[10px] font-medium text-green-600 leading-none'>
              {renderQuota(quotaAwarded)}
            </div>
          </div>
        </Tooltip>
      );
    }
    return null;
  };

  const handleMonthChange = (date) => {
    const month = date.toISOString().slice(0, 7);
    setCurrentMonth(month);
  };

  return (
    <div className='card card-pad'>
      <Modal
        title='Security Check'
        visible={turnstileModalVisible}
        footer={null}
        centered
        onCancel={() => {
          setTurnstileModalVisible(false);
          setTurnstileWidgetKey((v) => v + 1);
        }}
      >
        <div className='flex justify-center py-2'>
          <Turnstile
            key={turnstileWidgetKey}
            sitekey={turnstileSiteKey}
            onVerify={(token) => doCheckin(token)}
            onExpire={() => setTurnstileWidgetKey((v) => v + 1)}
          />
        </div>
      </Modal>

      {/* 卡片头部 */}
      <div className='row between'>
        <div
          className='row'
          style={{ flex: 1, cursor: 'pointer', gap: '10px' }}
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          <div>
            <div className='row' style={{ gap: '8px' }}>
              <span style={{ fontSize: '15px', fontWeight: 600 }}>
                {t('每日签到')}
              </span>
              {isCollapsed ? (
                <ChevronDown size={16} style={{ color: 'var(--ink-3)' }} />
              ) : (
                <ChevronUp size={16} style={{ color: 'var(--ink-3)' }} />
              )}
            </div>
            <div
              style={{
                fontSize: '12px',
                color: 'var(--ink-3)',
                marginTop: '2px',
              }}
            >
              {!initialLoaded
                ? t('正在加载签到状态...')
                : checkinData.stats?.checked_in_today
                  ? t('今日已签到，累计签到') +
                    ` ${checkinData.stats?.total_checkins || 0} ` +
                    t('天')
                  : t('每日签到可获得随机额度奖励')}
            </div>
          </div>
        </div>
        <button
          className='btn btn-primary'
          style={{ background: 'var(--success,#10B981)', flexShrink: 0 }}
          onClick={() => doCheckin()}
          disabled={
            !initialLoaded ||
            checkinLoading ||
            checkinData.stats?.checked_in_today
          }
        >
          {!initialLoaded
            ? t('加载中...')
            : checkinLoading
              ? '...'
              : checkinData.stats?.checked_in_today
                ? t('今日已签到')
                : t('立即签到')}
        </button>
      </div>

      {/* 可折叠内容 */}
      <Collapsible isOpen={isCollapsed === false} keepDOM>
        {/* 签到统计 */}
        <div
          className='srv-ovgrid'
          style={{
            gridTemplateColumns: 'repeat(3,1fr)',
            marginBottom: '16px',
            marginTop: '16px',
          }}
        >
          <div className='srv-ovcard'>
            <div className='k'>{t('累计签到')}</div>
            <div className='v' style={{ color: 'var(--success,#10B981)' }}>
              {checkinData.stats?.total_checkins || 0}
            </div>
          </div>
          <div className='srv-ovcard'>
            <div className='k'>{t('本月获得')}</div>
            <div className='v' style={{ color: 'var(--warning,#F59E0B)' }}>
              {renderQuota(monthlyQuota, 6)}
            </div>
          </div>
          <div className='srv-ovcard'>
            <div className='k'>{t('累计获得')}</div>
            <div className='v' style={{ color: 'var(--brand-600)' }}>
              {renderQuota(checkinData.stats?.total_quota || 0, 6)}
            </div>
          </div>
        </div>

        {/* 签到日历 */}
        <Spin spinning={loading}>
          <div className='border rounded-lg overflow-hidden checkin-calendar'>
            <style>{`
            .checkin-calendar .semi-calendar { font-size: 13px; }
            .checkin-calendar .semi-calendar-month-header { padding: 8px 12px; }
            .checkin-calendar .semi-calendar-month-week-row { height: 28px; }
            .checkin-calendar .semi-calendar-month-week-row th { font-size: 12px; padding: 4px 0; }
            .checkin-calendar .semi-calendar-month-grid-row { height: auto; }
            .checkin-calendar .semi-calendar-month-grid-row td { height: 56px; padding: 2px; }
            .checkin-calendar .semi-calendar-month-grid-row-cell { position: relative; height: 100%; }
            .checkin-calendar .semi-calendar-month-grid-row-cell-day { position: absolute; top: 4px; left: 50%; transform: translateX(-50%); font-size: 12px; z-index: 1; }
            .checkin-calendar .semi-calendar-month-same { background: transparent; }
            .checkin-calendar .semi-calendar-month-today .semi-calendar-month-grid-row-cell-day { background: var(--semi-color-primary); color: white; border-radius: 50%; width: 20px; height: 20px; display: flex; align-items: center; justify-content: center; }
            `}</style>
            <Calendar
              mode='month'
              onChange={handleMonthChange}
              dateGridRender={(dateString) => dateRender(dateString)}
            />
          </div>
        </Spin>

        {/* 签到说明 */}
        <div
          style={{
            marginTop: '12px',
            padding: '10px 14px',
            background: 'var(--surface-2)',
            borderRadius: '8px',
            fontSize: '12.5px',
            color: 'var(--ink-3)',
          }}
        >
          <ul className='srv-bullets'>
            <li>{t('每日签到可获得随机额度奖励')}</li>
            <li>{t('签到奖励将直接添加到您的账户余额')}</li>
            <li>{t('每日仅可签到一次，请勿重复签到')}</li>
          </ul>
        </div>
      </Collapsible>
    </div>
  );
};

export default CheckinCalendar;
