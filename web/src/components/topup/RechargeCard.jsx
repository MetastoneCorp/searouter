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

import React, { useEffect, useRef, useState } from 'react';
import { Select, Skeleton, Spin, Tooltip } from '@douyinfe/semi-ui';
import { SiAlipay, SiWechat, SiStripe } from 'react-icons/si';
import { CreditCard, RefreshCw, Receipt, Sparkles } from 'lucide-react';
import { useMinimumLoadingTime } from '../../hooks/common/useMinimumLoadingTime';
import { getCurrencyConfig } from '../../helpers/render';
import SubscriptionPlansCard from './SubscriptionPlansCard';

const RechargeCard = ({
  t,
  enableOnlineTopUp,
  enableStripeTopUp,
  enableCreemTopUp,
  creemProducts,
  creemPreTopUp,
  presetAmounts,
  selectedPreset,
  selectPresetAmount,
  formatLargeNumber,
  priceRatio,
  topUpCount,
  minTopUp,
  renderQuotaWithAmount,
  getAmount,
  setTopUpCount,
  setSelectedPreset,
  renderAmount,
  amountLoading,
  payMethods,
  preTopUp,
  paymentLoading,
  payWay,
  redemptionCode,
  setRedemptionCode,
  topUp,
  isSubmitting,
  topUpLink,
  openTopUpLink,
  userState,
  renderQuota,
  statusLoading,
  topupInfo,
  onOpenHistory,
  subscriptionLoading = false,
  subscriptionPlans = [],
  billingPreference,
  onChangeBillingPreference,
  activeSubscriptions = [],
  allSubscriptions = [],
  reloadSubscriptionSelf,
}) => {
  const inputRef = useRef(null);
  const initialTabSetRef = useRef(false);
  const showAmountSkeleton = useMinimumLoadingTime(amountLoading);
  const [activeTab, setActiveTab] = useState('topup');
  const [selectedPayWay, setSelectedPayWay] = useState('');
  const shouldShowSubscription =
    !subscriptionLoading && subscriptionPlans.length > 0;

  useEffect(() => {
    if (initialTabSetRef.current) return;
    if (subscriptionLoading) return;
    setActiveTab(shouldShowSubscription ? 'subscription' : 'topup');
    initialTabSetRef.current = true;
  }, [shouldShowSubscription, subscriptionLoading]);

  useEffect(() => {
    if (!shouldShowSubscription && activeTab !== 'topup') {
      setActiveTab('topup');
    }
  }, [shouldShowSubscription, activeTab]);

  // 同步父组件 payWay → 本地选中状态
  useEffect(() => {
    if (payWay) setSelectedPayWay(payWay);
  }, [payWay]);

  const handleAmountInput = async (e) => {
    const v = parseFloat(e.target.value);
    if (v && v >= 1) {
      setTopUpCount(v);
      setSelectedPreset(null);
      await getAmount(v);
    }
  };

  // 充值额度区块
  const topupContent = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* 账户状态统计 */}
      <div className='srv-acctstat'>
        <div>
          <div className='k'>{t('当前余额')}</div>
          <div className='v tnum'>{renderQuota(userState?.user?.quota)}</div>
        </div>
        <div>
          <div className='k'>{t('历史消耗')}</div>
          <div className='v tnum'>{renderQuota(userState?.user?.used_quota)}</div>
        </div>
        <div>
          <div className='k'>{t('请求次数')}</div>
          <div className='v tnum'>{userState?.user?.request_count || 0}</div>
        </div>
      </div>

      {statusLoading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '32px 0' }}>
          <Spin size='large' />
        </div>
      ) : enableOnlineTopUp || enableStripeTopUp ? (
        <>
          {/* 充值数量输入 */}
          <div>
            <div className='field-label'>{t('充值数量')}</div>
            <input
              ref={inputRef}
              className='input'
              type='number'
              min={minTopUp}
              value={topUpCount}
              onChange={handleAmountInput}
              onBlur={(e) => {
                const v = parseInt(e.target.value);
                if (!v || v < 1) {
                  setTopUpCount(minTopUp);
                  getAmount(minTopUp);
                }
              }}
              style={{ width: '100%' }}
            />
            <div className='helper'>
              {t('实付金额：')}
              {showAmountSkeleton ? (
                <Skeleton.Title active style={{ width: 80, height: 16, display: 'inline-block' }} />
              ) : (
                <span style={{ color: 'var(--danger)', fontWeight: 600 }}>{renderAmount()}</span>
              )}
            </div>
          </div>

          {/* 充值额度预设选项 */}
          <div>
            <div className='field-label' style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {t('选择充值额度')}
              {(() => {
                const { symbol, rate, type } = getCurrencyConfig();
                if (type === 'USD') return null;
                return (
                  <span style={{ color: 'var(--ink-3)', fontSize: 12, fontWeight: 400 }}>
                    (1 $ = {rate.toFixed(2)} {symbol})
                  </span>
                );
              })()}
            </div>
            <div className='srv-amts'>
              {presetAmounts.map((preset, index) => {
                const discount =
                  preset.discount || topupInfo?.discount?.[preset.value] || 1.0;
                const originalPrice = preset.value * priceRatio;
                const discountedPrice = originalPrice * discount;
                const save = originalPrice - discountedPrice;
                const { symbol, rate, type } = getCurrencyConfig();
                const statusStr = localStorage.getItem('status');
                let usdRate = 7;
                try {
                  if (statusStr) {
                    const s = JSON.parse(statusStr);
                    usdRate = s?.usd_exchange_rate || 7;
                  }
                } catch (_e) {}

                let displayValue = preset.value;
                let displayActualPay = discountedPrice;
                let displaySave = save;
                if (type === 'USD') {
                  displayActualPay = discountedPrice / usdRate;
                  displaySave = save / usdRate;
                } else if (type === 'CNY') {
                  displayValue = preset.value * usdRate;
                } else if (type === 'CUSTOM') {
                  displayValue = preset.value * rate;
                  displayActualPay = (discountedPrice / usdRate) * rate;
                  displaySave = (save / usdRate) * rate;
                }

                return (
                  <div
                    key={index}
                    className={`srv-amt${selectedPreset === preset.value ? ' on' : ''}`}
                    onClick={() => {
                      selectPresetAmount(preset);
                      if (inputRef.current) inputRef.current.value = preset.value;
                    }}
                  >
                    <div className='a tnum'>
                      {symbol}{formatLargeNumber(Math.round(displayValue * 100) / 100)}
                    </div>
                    <div className='b'>
                      {t('实付')} {symbol}{displayActualPay.toFixed(2)}，
                      {discount < 1.0
                        ? `${t('节省')} ${symbol}${displaySave.toFixed(2)}`
                        : `${t('节省')} ${symbol}0.00`}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 支付方式 */}
          <div>
            <div className='field-label'>{t('选择支付方式')}</div>
            {payMethods && payMethods.length > 0 ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
                <div className='srv-pay'>
                  {payMethods.map((payMethod) => {
                    const isStripe = payMethod.type === 'stripe';
                    const minTopupVal = Number(payMethod.min_topup) || 0;
                    const disabled =
                      (!enableOnlineTopUp && !isStripe) ||
                      (!enableStripeTopUp && isStripe) ||
                      minTopupVal > Number(topUpCount || 0);
                    const isOn = selectedPayWay === payMethod.type;

                    const icon =
                      payMethod.type === 'alipay' ? (
                        <SiAlipay size={18} color='#1677FF' />
                      ) : payMethod.type === 'wxpay' ? (
                        <SiWechat size={18} color='#07C160' />
                      ) : payMethod.type === 'stripe' ? (
                        <SiStripe size={18} color='#635BFF' />
                      ) : (
                        <CreditCard size={18} color={payMethod.color || 'var(--ink-2)'} />
                      );

                    const optEl = (
                      <label
                        key={payMethod.type}
                        className={`srv-payopt${isOn ? ' on' : ''}${disabled ? ' disabled' : ''}`}
                        style={disabled ? { opacity: 0.45, cursor: 'not-allowed' } : {}}
                        onClick={() => {
                          if (!disabled) setSelectedPayWay(payMethod.type);
                        }}
                      >
                        <span className='rd' />
                        {icon}
                        {payMethod.name}
                      </label>
                    );

                    return disabled && minTopupVal > Number(topUpCount || 0) ? (
                      <Tooltip
                        key={payMethod.type}
                        content={`${t('此支付方式最低充值金额为')} ${minTopupVal}`}
                      >
                        {optEl}
                      </Tooltip>
                    ) : (
                      <React.Fragment key={payMethod.type}>{optEl}</React.Fragment>
                    );
                  })}
                </div>
                <button
                  className='btn btn-primary'
                  disabled={!selectedPayWay || paymentLoading}
                  onClick={() => selectedPayWay && preTopUp(selectedPayWay)}
                  style={(!selectedPayWay || paymentLoading) ? { opacity: 0.55, cursor: 'not-allowed' } : {}}
                >
                  {paymentLoading ? (
                    <span className='spin' style={{ width: 14, height: 14 }} />
                  ) : null}
                  {t('支付')}
                </button>
              </div>
            ) : (
              <div style={{ color: 'var(--ink-3)', fontSize: 13, padding: '10px 14px', background: 'var(--surface-2)', borderRadius: 8, border: '1px dashed var(--border)' }}>
                {t('暂无可用的支付方式，请联系管理员配置')}
              </div>
            )}
          </div>
        </>
      ) : (
        <div style={{ color: 'var(--ink-2)', fontSize: 13.5, padding: '14px 18px', background: 'var(--brand-50)', borderRadius: 8, border: '1px solid var(--brand-100)' }}>
          {t('管理员未开启在线充值功能，请联系管理员开启或使用兑换码充值。')}
        </div>
      )}

      {/* Creem 充值区域 */}
      {enableCreemTopUp && creemProducts.length > 0 && (
        <div>
          <div className='srv-bar'>{t('Creem 充值')}</div>
          <div className='srv-plans' style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))' }}>
            {creemProducts.map((product, index) => (
              <div
                key={index}
                className='srv-plan'
                style={{ cursor: 'pointer', textAlign: 'center' }}
                onClick={() => creemPreTopUp(product)}
              >
                <h4>{product.name}</h4>
                <div className='desc'>{t('充值额度')}: {product.quota}</div>
                <div className='price' style={{ fontSize: 24 }}>
                  {product.currency === 'EUR' ? '€' : '$'}{product.price}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 兑换码充值 */}
      <div>
        <div className='srv-bar'>{t('兑换码充值')}</div>
        <div className='row' style={{ gap: 10 }}>
          <input
            className='input'
            style={{ flex: 1 }}
            placeholder={t('请输入兑换码')}
            value={redemptionCode}
            onChange={(e) => setRedemptionCode(e.target.value)}
          />
          <button
            className='btn btn-primary'
            onClick={topUp}
            disabled={isSubmitting}
            style={isSubmitting ? { opacity: 0.55 } : {}}
          >
            {isSubmitting && <span className='spin' style={{ width: 14, height: 14 }} />}
            {t('兑换额度')}
          </button>
        </div>
        {topUpLink && (
          <div className='helper'>
            {t('在找兑换码？')}
            <span
              style={{ color: 'var(--brand-600)', cursor: 'pointer', marginLeft: 4, textDecoration: 'underline' }}
              onClick={openTopUpLink}
            >
              {t('购买兑换码')}
            </span>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className='card card-pad srv-block' style={{ marginTop: 0 }}>
      {/* 卡片页头 */}
      <div className='page-head' style={{ marginBottom: 18 }}>
        <div>
          <div className='srv-sectitle'>
            <svg width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='var(--ink-2)' strokeWidth='1.8'>
              <rect x='2' y='5' width='20' height='14' rx='2' />
              <path d='M2 10h20' />
            </svg>
            {t('账户充值')}
          </div>
          <div className='srv-secsub'>{t('多种充值方式，安全便捷')}</div>
        </div>
        <button className='btn btn-ghost btn-sm' onClick={onOpenHistory}>
          <Receipt size={15} />
          {t('账单')}
        </button>
      </div>

      {shouldShowSubscription ? (
        <>
          {/* Tab 切换 */}
          <div style={{ display: 'flex', gap: 4, marginBottom: 16, background: 'var(--surface-2)', borderRadius: 8, padding: 3 }}>
            <button
              onClick={() => setActiveTab('subscription')}
              style={{
                flex: 1, height: 34, border: 0, borderRadius: 6, fontSize: 13, fontWeight: 600,
                background: activeTab === 'subscription' ? 'var(--surface)' : 'transparent',
                color: activeTab === 'subscription' ? 'var(--brand-600)' : 'var(--ink-2)',
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                boxShadow: activeTab === 'subscription' ? 'var(--sh-card)' : 'none',
              }}
            >
              <Sparkles size={14} />{t('订阅套餐')}
            </button>
            <button
              onClick={() => setActiveTab('topup')}
              style={{
                flex: 1, height: 34, border: 0, borderRadius: 6, fontSize: 13, fontWeight: 600,
                background: activeTab === 'topup' ? 'var(--surface)' : 'transparent',
                color: activeTab === 'topup' ? 'var(--brand-600)' : 'var(--ink-2)',
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                boxShadow: activeTab === 'topup' ? 'var(--sh-card)' : 'none',
              }}
            >
              <svg width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
                <rect x='2' y='5' width='20' height='14' rx='2' /><path d='M2 10h20' />
              </svg>
              {t('额度充值')}
            </button>
          </div>

          {activeTab === 'subscription' ? (
            <SubscriptionPlansCard
              t={t}
              loading={subscriptionLoading}
              plans={subscriptionPlans}
              payMethods={payMethods}
              enableOnlineTopUp={enableOnlineTopUp}
              enableStripeTopUp={enableStripeTopUp}
              enableCreemTopUp={enableCreemTopUp}
              billingPreference={billingPreference}
              onChangeBillingPreference={onChangeBillingPreference}
              activeSubscriptions={activeSubscriptions}
              allSubscriptions={allSubscriptions}
              reloadSubscriptionSelf={reloadSubscriptionSelf}
              withCard={false}
            />
          ) : (
            topupContent
          )}
        </>
      ) : (
        topupContent
      )}
    </div>
  );
};

export default RechargeCard;
