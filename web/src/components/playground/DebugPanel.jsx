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

import React, { useState, useEffect } from 'react';
import {
  Tabs,
  TabPane,
  Button,
  Dropdown,
} from '@douyinfe/semi-ui';
import { Code, Zap, Clock, X, Eye, Send } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import CodeViewer from './CodeViewer';
import SSEViewer from './SSEViewer';

const DebugPanel = ({
  debugData,
  activeDebugTab,
  onActiveDebugTabChange,
  styleState,
  onCloseDebugPanel,
  customRequestMode,
}) => {
  const { t } = useTranslation();

  const [activeKey, setActiveKey] = useState(activeDebugTab);

  useEffect(() => {
    setActiveKey(activeDebugTab);
  }, [activeDebugTab]);

  const handleTabChange = (key) => {
    setActiveKey(key);
    onActiveDebugTabChange(key);
  };

  const renderArrow = (items, pos, handleArrowClick) => {
    const style = {
      width: 32,
      height: 32,
      margin: '0 12px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: '100%',
      background: 'rgba(var(--semi-grey-1), 1)',
      color: 'var(--semi-color-text)',
      cursor: 'pointer',
    };

    return (
      <Dropdown
        render={
          <Dropdown.Menu>
            {items.map((item) => {
              return (
                <Dropdown.Item
                  key={item.itemKey}
                  onClick={() => handleTabChange(item.itemKey)}
                >
                  {item.tab}
                </Dropdown.Item>
              );
            })}
          </Dropdown.Menu>
        }
      >
        {pos === 'start' ? (
          <div style={style} onClick={handleArrowClick}>
            ←
          </div>
        ) : (
          <div style={style} onClick={handleArrowClick}>
            →
          </div>
        )}
      </Dropdown>
    );
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        overflow: 'hidden',
      }}
    >
      {/* 面板标题 */}
      <div
        style={{
          padding: '14px 18px',
          borderBottom: '1px solid var(--border-2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexShrink: 0,
        }}
      >
        <div className='pgw-dbg-head' style={{ padding: 0, border: 0, gap: 8 }}>
          <span className='ico'>
            <Code size={16} style={{ color: 'var(--ink-2)' }} />
          </span>
          <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--ink)' }}>
            {t('调试信息')}
          </span>
        </div>

        {styleState.isMobile && onCloseDebugPanel && (
          <Button
            icon={<X size={16} />}
            onClick={onCloseDebugPanel}
            theme='borderless'
            type='tertiary'
            size='small'
          />
        )}
      </div>

      {/* Tab 内容 */}
      <div style={{ flex: 1, overflow: 'hidden', padding: '0' }} className='debug-panel'>
        <Tabs
          renderArrow={renderArrow}
          type='card'
          collapsible
          className='h-full'
          style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
          activeKey={activeKey}
          onChange={handleTabChange}
        >
          <TabPane
            tab={
              <div className='flex items-center gap-2'>
                <Eye size={16} />
                {t('预览请求体')}
                {customRequestMode && (
                  <span className='px-1.5 py-0.5 text-xs bg-orange-100 text-orange-600 rounded-full'>
                    {t('自定义')}
                  </span>
                )}
              </div>
            }
            itemKey='preview'
          >
            <CodeViewer
              content={debugData.previewRequest}
              title='preview'
              language='json'
            />
          </TabPane>

          <TabPane
            tab={
              <div className='flex items-center gap-2'>
                <Send size={16} />
                {t('实际请求体')}
              </div>
            }
            itemKey='request'
          >
            <CodeViewer
              content={debugData.request}
              title='request'
              language='json'
            />
          </TabPane>

          <TabPane
            tab={
              <div className='flex items-center gap-2'>
                <Zap size={16} />
                {t('响应')}
                {debugData.sseMessages && debugData.sseMessages.length > 0 && (
                  <span className='px-1.5 py-0.5 text-xs bg-blue-100 text-blue-600 rounded-full'>
                    SSE ({debugData.sseMessages.length})
                  </span>
                )}
              </div>
            }
            itemKey='response'
          >
            {debugData.sseMessages && debugData.sseMessages.length > 0 ? (
              <SSEViewer sseData={debugData.sseMessages} title='response' />
            ) : (
              <CodeViewer
                content={debugData.response}
                title='response'
                language='json'
              />
            )}
          </TabPane>
        </Tabs>
      </div>

      {/* 底部时间戳 */}
      {(debugData.timestamp || debugData.previewTimestamp) && (
        <div
          style={{
            flexShrink: 0,
            padding: '8px 18px',
            borderTop: '1px solid var(--border-2)',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          <Clock size={13} style={{ color: 'var(--ink-3)' }} />
          <span className='mono' style={{ fontSize: 12, color: 'var(--ink-3)' }}>
            {activeKey === 'preview' && debugData.previewTimestamp
              ? `${t('预览更新')}: ${new Date(debugData.previewTimestamp).toLocaleString()}`
              : debugData.timestamp
                ? `${t('最后请求')}: ${new Date(debugData.timestamp).toLocaleString()}`
                : ''}
          </span>
        </div>
      )}
    </div>
  );
};

export default DebugPanel;
