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

import { useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { API, processModelsData, processGroupsData } from '../../helpers';
import { showError } from '../../helpers';
import { API_ENDPOINTS } from '../../constants/playground.constants';

// 模型清单统一从 /api/pricing 取（公共端点，不需要 ApiKey）。
// 已登录用户额外加载分组 /api/user/self/groups。
export const useDataLoader = (
  userState,
  inputs,
  handleInputChange,
  setModels,
  setGroups,
) => {
  const { t } = useTranslation();
  const isLoggedIn = !!userState?.user;

  const loadModels = useCallback(async () => {
    try {
      const res = await API.get('/api/pricing');
      const data = res?.data?.data;
      if (!Array.isArray(data) || data.length === 0) {
        console.warn('[useDataLoader] /api/pricing returned no data');
        setModels([]);
        return;
      }
      // pricing 返回结构 { model_name, ... }；映射成 Select 用的 {label,value}
      const modelOptions = data
        .map((item) => item?.model_name)
        .filter((name) => typeof name === 'string' && name.length > 0)
        .map((name) => ({ label: name, value: name }));

      // 去重（pricing 可能含同名供应商分发）
      const seen = new Set();
      const dedup = modelOptions.filter((m) => {
        if (seen.has(m.value)) return false;
        seen.add(m.value);
        return true;
      });

      // 排序：先 gpt 系，再字典序
      dedup.sort((a, b) => {
        const ag = a.label.startsWith('gpt');
        const bg = b.label.startsWith('gpt');
        if (ag && !bg) return -1;
        if (!ag && bg) return 1;
        return a.label.localeCompare(b.label);
      });

      setModels(dedup);

      // 如果当前选中模型不在列表中，回退到第一个
      if (dedup.length > 0 && !dedup.some((m) => m.value === inputs.model)) {
        handleInputChange('model', dedup[0].value);
      }
    } catch (error) {
      console.error('[useDataLoader] Load models error:', error);
      setModels([]);
    }
  }, [inputs.model, handleInputChange, setModels]);

  const loadGroups = useCallback(async () => {
    if (!isLoggedIn) {
      setGroups([]);
      return;
    }
    try {
      const res = await API.get(API_ENDPOINTS.USER_GROUPS);
      const { success, message, data } = res.data;
      if (success) {
        const userGroup =
          userState?.user?.group ||
          JSON.parse(localStorage.getItem('user') || '{}')?.group;
        const groupOptions = processGroupsData(data, userGroup);
        setGroups(groupOptions);

        const hasCurrentGroup = groupOptions.some(
          (option) => option.value === inputs.group,
        );
        if (!hasCurrentGroup) {
          handleInputChange('group', groupOptions[0]?.value || '');
        }
      } else {
        showError(t(message));
      }
    } catch (error) {
      console.error('[useDataLoader] Load groups error:', error);
    }
  }, [isLoggedIn, userState, inputs.group, handleInputChange, setGroups, t]);

  useEffect(() => {
    loadModels();
    loadGroups();
  }, [isLoggedIn, loadModels, loadGroups]);

  return {
    loadModels,
    loadGroups,
  };
};
