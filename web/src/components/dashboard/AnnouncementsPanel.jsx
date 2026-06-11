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
import { Tag, Timeline, Empty } from '@douyinfe/semi-ui';
import { Bell } from 'lucide-react';
import { marked } from 'marked';
import {
  IllustrationConstruction,
  IllustrationConstructionDark,
} from '@douyinfe/semi-illustrations';
import ScrollableContainer from '../common/ui/ScrollableContainer';

const ANNOUNCEMENT_LEGEND_COLORS = {
  grey: '#8b9aa7',
  blue: '#3b82f6',
  green: '#10b981',
  orange: '#f59e0b',
  red: '#ef4444',
};

const AnnouncementsPanel = ({
  announcementData,
  announcementLegendData,
  ILLUSTRATION_SIZE,
  t,
}) => {
  return (
    <div className='card lg:col-span-2'>
      <div className='card-head flex-wrap'>
        <h3>
          <span className='ico'>
            <Bell size={16} />
          </span>
          {t('系统公告')}
          <Tag color='white' shape='circle'>
            {t('显示最新20条')}
          </Tag>
        </h3>
        {/* 图例 */}
        <div className='flex flex-wrap gap-3 text-xs'>
          {announcementLegendData.map((legend, index) => (
            <div key={index} className='flex items-center gap-1'>
              <div
                className='w-2 h-2 rounded-full'
                style={{
                  backgroundColor:
                    ANNOUNCEMENT_LEGEND_COLORS[legend.color] || '#8b9aa7',
                }}
              />
              <span className='text-ink-2'>{legend.label}</span>
            </div>
          ))}
        </div>
      </div>
      <ScrollableContainer maxHeight='24rem'>
        {announcementData.length > 0 ? (
          <div className='card-pad'>
            <Timeline mode='left'>
              {announcementData.map((item, idx) => {
                const htmlExtra = item.extra ? marked.parse(item.extra) : '';
                return (
                  <Timeline.Item
                    key={idx}
                    type={item.type || 'default'}
                    time={`${item.relative ? item.relative + ' ' : ''}${item.time}`}
                    extra={
                      item.extra ? (
                        <div
                          className='text-xs text-ink-3'
                          dangerouslySetInnerHTML={{ __html: htmlExtra }}
                        />
                      ) : null
                    }
                  >
                    <div>
                      <div
                        dangerouslySetInnerHTML={{
                          __html: marked.parse(item.content || ''),
                        }}
                      />
                    </div>
                  </Timeline.Item>
                );
              })}
            </Timeline>
          </div>
        ) : (
          <div className='flex justify-center items-center py-8'>
            <Empty
              image={<IllustrationConstruction style={ILLUSTRATION_SIZE} />}
              darkModeImage={
                <IllustrationConstructionDark style={ILLUSTRATION_SIZE} />
              }
              title={t('暂无系统公告')}
              description={t('请联系管理员在系统设置中配置公告信息')}
            />
          </div>
        )}
      </ScrollableContainer>
    </div>
  );
};

export default AnnouncementsPanel;
