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
import { Tooltip, Typography } from '@douyinfe/semi-ui';
import {
  TASK_ACTION_FIRST_TAIL_GENERATE,
  TASK_ACTION_GENERATE,
  TASK_ACTION_REFERENCE_GENERATE,
  TASK_ACTION_TEXT_GENERATE,
  TASK_ACTION_REMIX_GENERATE,
} from '../../../constants/common.constant';
import { CHANNEL_OPTIONS } from '../../../constants/channel.constants';
import { stringToColor } from '../../../helpers/render';
import { Avatar, Space } from '@douyinfe/semi-ui';

// Render functions
const renderTimestamp = (timestampInSeconds) => {
  const date = new Date(timestampInSeconds * 1000);
  const year = date.getFullYear();
  const month = ('0' + (date.getMonth() + 1)).slice(-2);
  const day = ('0' + date.getDate()).slice(-2);
  const hours = ('0' + date.getHours()).slice(-2);
  const minutes = ('0' + date.getMinutes()).slice(-2);
  const seconds = ('0' + date.getSeconds()).slice(-2);
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

function renderDuration(submit_time, finishTime) {
  if (!submit_time || !finishTime) return 'N/A';
  const durationSec = finishTime - submit_time;
  if (durationSec < 60) {
    return <span className='pill ok tnum'>{durationSec} s</span>;
  } else if (durationSec < 300) {
    return <span className='pill warn tnum'>{durationSec} s</span>;
  } else {
    return <span className='pill err tnum'>{durationSec} s</span>;
  }
}

const renderType = (type, t) => {
  switch (type) {
    case 'MUSIC':
      return <span className='tag'>{t('生成音乐')}</span>;
    case 'LYRICS':
      return <span className='tag'>{t('生成歌词')}</span>;
    case TASK_ACTION_GENERATE:
      return <span className='tag'>{t('图生视频')}</span>;
    case TASK_ACTION_TEXT_GENERATE:
      return <span className='tag'>{t('文生视频')}</span>;
    case TASK_ACTION_FIRST_TAIL_GENERATE:
      return <span className='tag'>{t('首尾生视频')}</span>;
    case TASK_ACTION_REFERENCE_GENERATE:
      return <span className='tag'>{t('参照生视频')}</span>;
    case TASK_ACTION_REMIX_GENERATE:
      return <span className='tag'>{t('视频Remix')}</span>;
    default:
      return <span className='tag gray'>{t('未知')}</span>;
  }
};

const renderPlatform = (platform, t) => {
  let option = CHANNEL_OPTIONS.find(
    (opt) => String(opt.value) === String(platform),
  );
  if (option) {
    return <span className='tag'>{option.label}</span>;
  }
  switch (platform) {
    case 'suno':
      return <span className='tag'>Suno</span>;
    default:
      return <span className='tag gray'>{t('未知')}</span>;
  }
};

const renderStatus = (type, t) => {
  switch (type) {
    case 'SUCCESS':
      return <span className='pill ok'>{t('成功')}</span>;
    case 'NOT_START':
      return <span className='tag gray'>{t('未启动')}</span>;
    case 'SUBMITTED':
      return <span className='pill warn'>{t('队列中')}</span>;
    case 'IN_PROGRESS':
      return <span className='status warn'>{t('执行中')}</span>;
    case 'FAILURE':
      return <span className='pill err'>{t('失败')}</span>;
    case 'QUEUED':
      return <span className='pill warn'>{t('排队中')}</span>;
    case 'UNKNOWN':
      return <span className='tag gray'>{t('未知')}</span>;
    case '':
      return <span className='tag gray'>{t('正在提交')}</span>;
    default:
      return <span className='tag gray'>{t('未知')}</span>;
  }
};

const renderProgress = (text, record) => {
  if (isNaN(text?.replace('%', ''))) {
    return <span className='tnum'>{text || '-'}</span>;
  }
  const pct = text ? parseInt(text.replace('%', '')) : 0;
  const progClass =
    record.status === 'FAILURE'
      ? 'prog err'
      : record.status === 'SUCCESS'
        ? 'prog done'
        : 'prog';
  return (
    <div className={progClass}>
      <div className='bar'>
        <i className='fill' style={{ width: `${pct}%` }} />
      </div>
      <div className='meta'>
        <span>{text || '0%'}</span>
      </div>
    </div>
  );
};

export const getTaskLogsColumns = ({
  t,
  COLUMN_KEYS,
  copyText,
  openContentModal,
  isAdminUser,
  openVideoModal,
  showUserInfoFunc,
}) => {
  return [
    {
      key: COLUMN_KEYS.SUBMIT_TIME,
      title: t('提交时间'),
      dataIndex: 'submit_time',
      render: (text) => (
        <span className='mono tnum text-ink-2'>{text ? renderTimestamp(text) : '-'}</span>
      ),
    },
    {
      key: COLUMN_KEYS.FINISH_TIME,
      title: t('结束时间'),
      dataIndex: 'finish_time',
      render: (text) => (
        <span className='mono tnum text-ink-2'>{text ? renderTimestamp(text) : '-'}</span>
      ),
    },
    {
      key: COLUMN_KEYS.DURATION,
      title: t('花费时间'),
      dataIndex: 'finish_time',
      render: (finish, record) => (
        <>{finish ? renderDuration(record.submit_time, finish) : '-'}</>
      ),
    },
    {
      key: COLUMN_KEYS.CHANNEL,
      title: t('渠道'),
      dataIndex: 'channel_id',
      render: (text) =>
        isAdminUser ? (
          <span className='tag tnum'>{text}</span>
        ) : null,
    },
    {
      key: COLUMN_KEYS.USERNAME,
      title: t('用户'),
      dataIndex: 'user_id',
      render: (userId, record) => {
        if (!isAdminUser) return <></>;
        const displayText = String(record.username || userId || '?');
        return (
          <Space>
            <Tooltip content={displayText}>
              <Avatar
                size='extra-small'
                color={stringToColor(displayText)}
                style={{ cursor: 'pointer' }}
                onClick={() => showUserInfoFunc && showUserInfoFunc(userId)}
              >
                {displayText.slice(0, 1)}
              </Avatar>
            </Tooltip>
            <Typography.Text
              ellipsis={{ showTooltip: true }}
              style={{ cursor: 'pointer', color: 'var(--brand-600)' }}
              onClick={() => showUserInfoFunc && showUserInfoFunc(userId)}
            >
              {userId}
            </Typography.Text>
          </Space>
        );
      },
    },
    {
      key: COLUMN_KEYS.PLATFORM,
      title: t('平台'),
      dataIndex: 'platform',
      render: (text) => <>{renderPlatform(text, t)}</>,
    },
    {
      key: COLUMN_KEYS.TYPE,
      title: t('类型'),
      dataIndex: 'action',
      render: (text) => <>{renderType(text, t)}</>,
    },
    {
      key: COLUMN_KEYS.TASK_ID,
      title: t('任务ID'),
      dataIndex: 'task_id',
      render: (text, record) => (
        <span
          className='tid'
          style={{ cursor: 'pointer' }}
          onClick={() => openContentModal(JSON.stringify(record, null, 2))}
        >
          {text}
        </span>
      ),
    },
    {
      key: COLUMN_KEYS.TASK_STATUS,
      title: t('任务状态'),
      dataIndex: 'status',
      render: (text) => <>{renderStatus(text, t)}</>,
    },
    {
      key: COLUMN_KEYS.PROGRESS,
      title: t('进度'),
      dataIndex: 'progress',
      render: (text, record) => renderProgress(text, record),
    },
    {
      key: COLUMN_KEYS.FAIL_REASON,
      title: t('详情'),
      dataIndex: 'fail_reason',
      fixed: 'right',
      render: (text, record) => {
        const isVideoTask =
          record.action === TASK_ACTION_GENERATE ||
          record.action === TASK_ACTION_TEXT_GENERATE ||
          record.action === TASK_ACTION_FIRST_TAIL_GENERATE ||
          record.action === TASK_ACTION_REFERENCE_GENERATE ||
          record.action === TASK_ACTION_REMIX_GENERATE;
        const isSuccess = record.status === 'SUCCESS';
        const isUrl = typeof text === 'string' && /^https?:\/\//.test(text);
        if (isSuccess && isVideoTask && isUrl) {
          return (
            <a
              href='#'
              className='text-brand-600'
              onClick={(e) => {
                e.preventDefault();
                openVideoModal(text);
              }}
            >
              {t('点击预览视频')}
            </a>
          );
        }
        if (!text) {
          return <span className='text-ink-2'>{t('无')}</span>;
        }
        return (
          <Typography.Text
            ellipsis={{ showTooltip: true }}
            style={{ width: 100, cursor: 'pointer' }}
            onClick={() => openContentModal(text)}
          >
            {text}
          </Typography.Text>
        );
      },
    },
  ];
};
