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
import { Button, Spin, Tabs, TabPane, Tag, Empty } from '@douyinfe/semi-ui';
import { Gauge, RefreshCw } from 'lucide-react';
import {
  IllustrationConstruction,
  IllustrationConstructionDark,
} from '@douyinfe/semi-illustrations';
import ScrollableContainer from '../common/ui/ScrollableContainer';

const UptimePanel = ({
  uptimeData,
  uptimeLoading,
  activeUptimeTab,
  setActiveUptimeTab,
  loadUptimeData,
  uptimeLegendData,
  renderMonitorList,
  ILLUSTRATION_SIZE,
  t,
}) => {
  return (
    <div className='card lg:col-span-1 flex flex-col'>
      <div className='card-head'>
        <h3>
          <span className='ico'>
            <Gauge size={16} />
          </span>
          {t('服务可用性')}
        </h3>
        <Button
          icon={<RefreshCw size={14} />}
          onClick={loadUptimeData}
          loading={uptimeLoading}
          size='small'
          theme='borderless'
          type='tertiary'
          aria-label={t('刷新')}
          className='!rounded-full'
        />
      </div>

      {/* 内容区域 */}
      <div className='relative flex-1'>
        <Spin spinning={uptimeLoading}>
          {uptimeData.length > 0 ? (
            uptimeData.length === 1 ? (
              <ScrollableContainer maxHeight='24rem'>
                <div className='px-3 py-2'>
                  {renderMonitorList(uptimeData[0].monitors)}
                </div>
              </ScrollableContainer>
            ) : (
              <Tabs
                type='card'
                collapsible
                activeKey={activeUptimeTab}
                onChange={setActiveUptimeTab}
                size='small'
              >
                {uptimeData.map((group, groupIdx) => (
                  <TabPane
                    tab={
                      <span className='flex items-center gap-2'>
                        <Gauge size={14} />
                        {group.categoryName}
                        <Tag
                          color={
                            activeUptimeTab === group.categoryName
                              ? 'blue'
                              : 'grey'
                          }
                          size='small'
                          shape='circle'
                        >
                          {group.monitors ? group.monitors.length : 0}
                        </Tag>
                      </span>
                    }
                    itemKey={group.categoryName}
                    key={groupIdx}
                  >
                    <ScrollableContainer maxHeight='21.5rem'>
                      <div className='px-3 py-2'>
                        {renderMonitorList(group.monitors)}
                      </div>
                    </ScrollableContainer>
                  </TabPane>
                ))}
              </Tabs>
            )
          ) : (
            <div className='flex justify-center items-center py-8'>
              <Empty
                image={<IllustrationConstruction style={ILLUSTRATION_SIZE} />}
                darkModeImage={
                  <IllustrationConstructionDark style={ILLUSTRATION_SIZE} />
                }
                title={t('暂无监控数据')}
                description={t('请联系管理员在系统设置中配置Uptime')}
              />
            </div>
          )}
        </Spin>
      </div>

      {/* 图例 */}
      {uptimeData.length > 0 && (
        <div className='p-3 bg-surface-2 border-t border-line-2 rounded-b-lg'>
          <div className='flex flex-wrap gap-3 text-xs justify-center'>
            {uptimeLegendData.map((legend, index) => (
              <div key={index} className='flex items-center gap-1'>
                <div
                  className='w-2 h-2 rounded-full'
                  style={{ backgroundColor: legend.color }}
                />
                <span className='text-ink-2'>{legend.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default UptimePanel;
