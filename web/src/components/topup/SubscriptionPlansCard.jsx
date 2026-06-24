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

import React, { useMemo, useState } from 'react';
import { Select, Skeleton, Tooltip } from '@douyinfe/semi-ui';
import { API, showError, showSuccess, renderQuota } from '../../helpers';
import { getCurrencyConfig } from '../../helpers/render';
import { RefreshCw, Sparkles } from 'lucide-react';
import SubscriptionPurchaseModal from './modals/SubscriptionPurchaseModal';
import {
  formatSubscriptionDuration,
  formatSubscriptionResetPeriod,
} from '../../helpers/subscriptionFormat';

// 过滤易支付方式
function getEpayMethods(payMethods = []) {
  return (payMethods || []).filter(
    (m) => m?.type && m.type !== 'stripe' && m.type !== 'creem',
  );
}

// 提交易支付表单
function submitEpayForm({ url, params }) {
  const form = document.createElement('form');
  form.action = url;
  form.method = 'POST';
  const isSafari =
    navigator.userAgent.indexOf('Safari') > -1 &&
    navigator.userAgent.indexOf('Chrome') < 1;
  if (!isSafari) form.target = '_blank';
  Object.keys(params || {}).forEach((key) => {
    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = key;
    input.value = params[key];
    form.appendChild(input);
  });
  document.body.appendChild(form);
  form.submit();
  document.body.removeChild(form);
}

const SubscriptionPlansCard = ({
  t,
  loading = false,
  plans = [],
  payMethods = [],
  enableOnlineTopUp = false,
  enableStripeTopUp = false,
  enableCreemTopUp = false,
  billingPreference,
  onChangeBillingPreference,
  activeSubscriptions = [],
  allSubscriptions = [],
  reloadSubscriptionSelf,
  withCard = true,
}) => {
  const [open, setOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [paying, setPaying] = useState(false);
  const [selectedEpayMethod, setSelectedEpayMethod] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const epayMethods = useMemo(() => getEpayMethods(payMethods), [payMethods]);

  const openBuy = (p) => {
    setSelectedPlan(p);
    setSelectedEpayMethod(epayMethods?.[0]?.type || '');
    setOpen(true);
  };

  const closeBuy = () => {
    setOpen(false);
    setSelectedPlan(null);
    setPaying(false);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await reloadSubscriptionSelf?.();
    } finally {
      setRefreshing(false);
    }
  };

  const payStripe = async () => {
    if (!selectedPlan?.plan?.stripe_price_id) {
      showError(t('该套餐未配置 Stripe'));
      return;
    }
    setPaying(true);
    try {
      const res = await API.post('/api/subscription/stripe/pay', {
        plan_id: selectedPlan.plan.id,
      });
      if (res.data?.message === 'success') {
        window.open(res.data.data?.pay_link, '_blank');
        showSuccess(t('已打开支付页面'));
        closeBuy();
      } else {
        const errorMsg =
          typeof res.data?.data === 'string'
            ? res.data.data
            : res.data?.message || t('支付失败');
        showError(errorMsg);
      }
    } catch (e) {
      showError(t('支付请求失败'));
    } finally {
      setPaying(false);
    }
  };

  const payCreem = async () => {
    if (!selectedPlan?.plan?.creem_product_id) {
      showError(t('该套餐未配置 Creem'));
      return;
    }
    setPaying(true);
    try {
      const res = await API.post('/api/subscription/creem/pay', {
        plan_id: selectedPlan.plan.id,
      });
      if (res.data?.message === 'success') {
        window.open(res.data.data?.checkout_url, '_blank');
        showSuccess(t('已打开支付页面'));
        closeBuy();
      } else {
        const errorMsg =
          typeof res.data?.data === 'string'
            ? res.data.data
            : res.data?.message || t('支付失败');
        showError(errorMsg);
      }
    } catch (e) {
      showError(t('支付请求失败'));
    } finally {
      setPaying(false);
    }
  };

  const payEpay = async () => {
    if (!selectedEpayMethod) {
      showError(t('请选择支付方式'));
      return;
    }
    setPaying(true);
    try {
      const res = await API.post('/api/subscription/epay/pay', {
        plan_id: selectedPlan.plan.id,
        payment_method: selectedEpayMethod,
      });
      if (res.data?.message === 'success') {
        submitEpayForm({ url: res.data.url, params: res.data.data });
        showSuccess(t('已发起支付'));
        closeBuy();
      } else {
        const errorMsg =
          typeof res.data?.data === 'string'
            ? res.data.data
            : res.data?.message || t('支付失败');
        showError(errorMsg);
      }
    } catch (e) {
      showError(t('支付请求失败'));
    } finally {
      setPaying(false);
    }
  };

  // 当前订阅信息
  const hasActiveSubscription = activeSubscriptions.length > 0;
  const hasAnySubscription = allSubscriptions.length > 0;
  const disableSubscriptionPreference = !hasActiveSubscription;
  const isSubscriptionPreference =
    billingPreference === 'subscription_first' ||
    billingPreference === 'subscription_only';
  const displayBillingPreference =
    disableSubscriptionPreference && isSubscriptionPreference
      ? 'wallet_first'
      : billingPreference;
  const subscriptionPreferenceLabel =
    billingPreference === 'subscription_only' ? t('仅用订阅') : t('优先订阅');

  const planPurchaseCountMap = useMemo(() => {
    const map = new Map();
    (allSubscriptions || []).forEach((sub) => {
      const planId = sub?.subscription?.plan_id;
      if (!planId) return;
      map.set(planId, (map.get(planId) || 0) + 1);
    });
    return map;
  }, [allSubscriptions]);

  const planTitleMap = useMemo(() => {
    const map = new Map();
    (plans || []).forEach((p) => {
      const plan = p?.plan;
      if (!plan?.id) return;
      map.set(plan.id, plan.title || '');
    });
    return map;
  }, [plans]);

  const getPlanPurchaseCount = (planId) =>
    planPurchaseCountMap.get(planId) || 0;

  const getRemainingDays = (sub) => {
    if (!sub?.subscription?.end_time) return 0;
    const now = Date.now() / 1000;
    const remaining = sub.subscription.end_time - now;
    return Math.max(0, Math.ceil(remaining / 86400));
  };

  const getUsagePercent = (sub) => {
    const total = Number(sub?.subscription?.amount_total || 0);
    const used = Number(sub?.subscription?.amount_used || 0);
    if (total <= 0) return 0;
    return Math.round((used / total) * 100);
  };

  const cardContent = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {loading ? (
        /* 骨架屏 */
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div className='card card-pad' style={{ padding: 14 }}>
            <Skeleton.Title
              active
              style={{ width: 120, height: 20, marginBottom: 10 }}
            />
            <Skeleton.Paragraph active rows={2} />
          </div>
          <div className='srv-plans'>
            {[1, 2, 3].map((i) => (
              <div key={i} className='srv-plan'>
                <Skeleton.Title
                  active
                  style={{ width: '60%', height: 22, marginBottom: 8 }}
                />
                <Skeleton.Paragraph
                  active
                  rows={1}
                  style={{ marginBottom: 12 }}
                />
                <Skeleton.Title
                  active
                  style={{ width: '40%', height: 30, margin: '0 auto 12px' }}
                />
                <Skeleton.Paragraph active rows={3} />
                <Skeleton.Button
                  active
                  block
                  style={{ marginTop: 14, height: 34 }}
                />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <>
          {/* 我的订阅区块标题栏 */}
          <div
            className='srv-bar'
            style={{ justifyContent: 'space-between', marginBottom: 0 }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {t('我的订阅')}
              {hasActiveSubscription ? (
                <span className='pill ok' style={{ height: 20, fontSize: 11 }}>
                  {activeSubscriptions.length} {t('个生效中')}
                </span>
              ) : (
                <span className='tag gray' style={{ height: 20, fontSize: 11 }}>
                  {t('无生效')}
                </span>
              )}
              {allSubscriptions.length > activeSubscriptions.length && (
                <span className='tag gray' style={{ height: 20, fontSize: 11 }}>
                  {allSubscriptions.length - activeSubscriptions.length}{' '}
                  {t('个已过期')}
                </span>
              )}
            </span>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                marginLeft: 'auto',
              }}
            >
              <Select
                value={displayBillingPreference}
                onChange={onChangeBillingPreference}
                size='small'
                optionList={[
                  {
                    value: 'subscription_first',
                    label: disableSubscriptionPreference
                      ? `${t('优先订阅')} (${t('无生效')})`
                      : t('优先订阅'),
                    disabled: disableSubscriptionPreference,
                  },
                  { value: 'wallet_first', label: t('优先钱包') },
                  {
                    value: 'subscription_only',
                    label: disableSubscriptionPreference
                      ? `${t('仅用订阅')} (${t('无生效')})`
                      : t('仅用订阅'),
                    disabled: disableSubscriptionPreference,
                  },
                  { value: 'wallet_only', label: t('仅用钱包') },
                ]}
              />
              <button
                className='icon-btn'
                onClick={handleRefresh}
                disabled={refreshing}
                title={t('刷新')}
              >
                <RefreshCw
                  size={14}
                  className={refreshing ? 'animate-spin' : ''}
                />
              </button>
            </div>
          </div>

          {disableSubscriptionPreference && isSubscriptionPreference && (
            <div
              style={{ fontSize: 12.5, color: 'var(--ink-3)', marginTop: -8 }}
            >
              {t('已保存偏好为')}
              {subscriptionPreferenceLabel}
              {t('，当前无生效订阅，将自动使用钱包')}
            </div>
          )}

          {/* 当前订阅列表 */}
          <div className='card' style={{ padding: '12px 16px' }}>
            {hasAnySubscription ? (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 0,
                  maxHeight: 260,
                  overflowY: 'auto',
                }}
              >
                {allSubscriptions.map((sub, subIndex) => {
                  const isLast = subIndex === allSubscriptions.length - 1;
                  const subscription = sub.subscription;
                  const totalAmount = Number(subscription?.amount_total || 0);
                  const usedAmount = Number(subscription?.amount_used || 0);
                  const remainAmount =
                    totalAmount > 0 ? Math.max(0, totalAmount - usedAmount) : 0;
                  const planTitle =
                    planTitleMap.get(subscription?.plan_id) || '';
                  const remainDays = getRemainingDays(sub);
                  const usagePercent = getUsagePercent(sub);
                  const now = Date.now() / 1000;
                  const isExpired = (subscription?.end_time || 0) < now;
                  const isCancelled = subscription?.status === 'cancelled';
                  const isActive =
                    subscription?.status === 'active' && !isExpired;

                  return (
                    <div
                      key={subscription?.id || subIndex}
                      style={
                        !isLast
                          ? {
                              paddingBottom: 12,
                              marginBottom: 12,
                              borderBottom: '1px solid var(--border-2)',
                            }
                          : {}
                      }
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          marginBottom: 5,
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 7,
                            fontSize: 13,
                            fontWeight: 500,
                          }}
                        >
                          {planTitle
                            ? `${planTitle} · ${t('订阅')} #${subscription?.id}`
                            : `${t('订阅')} #${subscription?.id}`}
                          {isActive ? (
                            <span
                              className='pill ok'
                              style={{ height: 20, fontSize: 11 }}
                            >
                              {t('生效')}
                            </span>
                          ) : isCancelled ? (
                            <span
                              className='tag gray'
                              style={{ height: 20, fontSize: 11 }}
                            >
                              {t('已作废')}
                            </span>
                          ) : (
                            <span
                              className='tag gray'
                              style={{ height: 20, fontSize: 11 }}
                            >
                              {t('已过期')}
                            </span>
                          )}
                        </div>
                        {isActive && (
                          <span
                            style={{ fontSize: 12, color: 'var(--ink-3)' }}
                            className='tnum'
                          >
                            {t('剩余')} {remainDays} {t('天')}
                          </span>
                        )}
                      </div>
                      <div
                        style={{
                          fontSize: 12,
                          color: 'var(--ink-3)',
                          marginBottom: 5,
                        }}
                      >
                        {isActive
                          ? t('至')
                          : isCancelled
                            ? t('作废于')
                            : t('过期于')}{' '}
                        {new Date(
                          (subscription?.end_time || 0) * 1000,
                        ).toLocaleString()}
                      </div>
                      <div
                        style={{
                          fontSize: 12,
                          color: 'var(--ink-3)',
                          marginBottom: totalAmount > 0 ? 6 : 0,
                        }}
                      >
                        {t('总额度')}:{' '}
                        {totalAmount > 0 ? (
                          <Tooltip
                            content={`${t('原生额度')}：${usedAmount}/${totalAmount} · ${t('剩余')} ${remainAmount}`}
                          >
                            <span>
                              {renderQuota(usedAmount)}/
                              {renderQuota(totalAmount)} · {t('剩余')}{' '}
                              {renderQuota(remainAmount)}
                            </span>
                          </Tooltip>
                        ) : (
                          t('不限')
                        )}
                        {totalAmount > 0 && (
                          <span className='tnum' style={{ marginLeft: 8 }}>
                            {t('已用')} {usagePercent}%
                          </span>
                        )}
                      </div>
                      {/* 用量进度条 */}
                      {totalAmount > 0 && (
                        <div className='prog' style={{ minWidth: 0 }}>
                          <div className='bar'>
                            <span
                              className='fill'
                              style={{
                                width: `${Math.min(usagePercent, 100)}%`,
                              }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className='srv-empty' style={{ padding: '28px 0' }}>
                <span className='ic'>
                  <svg
                    width='36'
                    height='36'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='1.4'
                  >
                    <rect x='3' y='8' width='18' height='13' rx='2' />
                    <path d='M3 12h18M12 8v13M8 8a2.5 2.5 0 1 1 4-2c0 1.5-1 2-4 2zM16 8a2.5 2.5 0 1 0-4-2c0 1.5 1 2 4 2z' />
                  </svg>
                </span>
                <div className='t'>{t('当前无活跃订阅')}</div>
                <div className='s'>{t('购买套餐后即可享受模型权益')}</div>
              </div>
            )}
          </div>

          {/* 可购买套餐 */}
          {plans.length > 0 ? (
            <>
              <div className='srv-bar' style={{ marginTop: 8 }}>
                {t('可订阅套餐')}
              </div>
              <div className='srv-plans'>
                {plans.map((p, index) => {
                  const plan = p?.plan;
                  const totalAmount = Number(plan?.total_amount || 0);
                  const { symbol, rate } = getCurrencyConfig();
                  const price = Number(plan?.price_amount || 0);
                  const convertedPrice = price * rate;
                  const displayPrice = convertedPrice.toFixed(
                    Number.isInteger(convertedPrice) ? 0 : 2,
                  );
                  const isPopular = index === 0 && plans.length > 1;
                  const limit = Number(plan?.max_purchase_per_user || 0);
                  const limitLabel = limit > 0 ? `${t('限购')} ${limit}` : null;
                  const totalLabel =
                    totalAmount > 0
                      ? `${t('总额度')}: ${renderQuota(totalAmount)}`
                      : `${t('总额度')}: ${t('不限')}`;
                  const upgradeLabel = plan?.upgrade_group
                    ? `${t('升级分组')}: ${plan.upgrade_group}`
                    : null;
                  const resetLabel =
                    formatSubscriptionResetPeriod(plan, t) === t('不重置')
                      ? null
                      : `${t('额度重置')}: ${formatSubscriptionResetPeriod(plan, t)}`;
                  const planBenefits = [
                    {
                      label: `${t('有效期')}: ${formatSubscriptionDuration(plan, t)}`,
                    },
                    resetLabel ? { label: resetLabel } : null,
                    totalAmount > 0
                      ? {
                          label: totalLabel,
                          tooltip: `${t('原生额度')}：${totalAmount}`,
                        }
                      : { label: totalLabel },
                    limitLabel ? { label: limitLabel } : null,
                    upgradeLabel ? { label: upgradeLabel } : null,
                  ].filter(Boolean);

                  const count = getPlanPurchaseCount(p?.plan?.id);
                  const reached = limit > 0 && count >= limit;
                  const tip = reached
                    ? t('已达到购买上限') + ` (${count}/${limit})`
                    : '';

                  const buyBtn = (
                    <button
                      className='btn btn-primary'
                      style={{
                        width: '100%',
                        marginTop: 'auto',
                        opacity: reached ? 0.45 : 1,
                        cursor: reached ? 'not-allowed' : 'pointer',
                      }}
                      disabled={reached}
                      onClick={() => {
                        if (!reached) openBuy(p);
                      }}
                    >
                      {reached ? t('已达上限') : t('立即订阅')}
                    </button>
                  );

                  return (
                    <div
                      key={plan?.id}
                      className='srv-plan'
                      style={
                        isPopular
                          ? {
                              borderColor: 'var(--brand-600)',
                              boxShadow: '0 0 0 2px var(--brand-100)',
                            }
                          : {}
                      }
                    >
                      {isPopular && (
                        <div style={{ marginBottom: 8 }}>
                          <span className='tag'>
                            <Sparkles size={10} />
                            {t('推荐')}
                          </span>
                        </div>
                      )}
                      <h4>{plan?.title || t('订阅套餐')}</h4>
                      {plan?.subtitle && (
                        <div className='desc'>{plan.subtitle}</div>
                      )}
                      <div className='price tnum'>
                        <small>{symbol}</small>
                        {displayPrice}
                      </div>
                      <ul>
                        {planBenefits.map((item) => {
                          const content = (
                            <li key={item.label}>
                              <span className='ck'>
                                <svg
                                  width='14'
                                  height='14'
                                  viewBox='0 0 24 24'
                                  fill='none'
                                  stroke='currentColor'
                                  strokeWidth='2.4'
                                >
                                  <path d='m5 12 5 5 9-9' />
                                </svg>
                              </span>
                              {item.label}
                            </li>
                          );
                          return item.tooltip ? (
                            <Tooltip key={item.label} content={item.tooltip}>
                              {content}
                            </Tooltip>
                          ) : (
                            content
                          );
                        })}
                      </ul>

                      {reached ? (
                        <Tooltip content={tip} position='top'>
                          {buyBtn}
                        </Tooltip>
                      ) : (
                        buyBtn
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <div
              style={{
                textAlign: 'center',
                color: 'var(--ink-3)',
                fontSize: 13,
                padding: '20px 0',
              }}
            >
              {t('暂无可购买套餐')}
            </div>
          )}
        </>
      )}
    </div>
  );

  return (
    <>
      {withCard ? (
        <div className='card card-pad'>{cardContent}</div>
      ) : (
        cardContent
      )}

      {/* 购买确认弹窗 */}
      <SubscriptionPurchaseModal
        t={t}
        visible={open}
        onCancel={closeBuy}
        selectedPlan={selectedPlan}
        paying={paying}
        selectedEpayMethod={selectedEpayMethod}
        setSelectedEpayMethod={setSelectedEpayMethod}
        epayMethods={epayMethods}
        enableOnlineTopUp={enableOnlineTopUp}
        enableStripeTopUp={enableStripeTopUp}
        enableCreemTopUp={enableCreemTopUp}
        purchaseLimitInfo={
          selectedPlan?.plan?.id
            ? {
                limit: Number(selectedPlan?.plan?.max_purchase_per_user || 0),
                count: getPlanPurchaseCount(selectedPlan?.plan?.id),
              }
            : null
        }
        onPayStripe={payStripe}
        onPayCreem={payCreem}
        onPayEpay={payEpay}
      />
    </>
  );
};

export default SubscriptionPlansCard;
