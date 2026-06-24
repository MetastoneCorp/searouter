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
import { AlertTriangle, RotateCcw } from 'lucide-react';

class PlaygroundErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null, info: null };
    this.handleReset = this.handleReset.bind(this);
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error('[PlaygroundErrorBoundary]', error, info);
    this.setState({ info });
  }

  handleReset() {
    this.setState({ error: null, info: null });
    if (this.props.onReset) this.props.onReset();
  }

  render() {
    if (this.state.error) {
      return (
        <div className='mx-auto flex min-h-[60dvh] w-full max-w-2xl flex-col items-center justify-center px-6 py-10'>
          <div className='flex w-full flex-col items-center rounded-2xl border border-red-200 bg-red-50/40 p-8 dark:border-red-500/30 dark:bg-red-500/5'>
            <AlertTriangle
              size={32}
              strokeWidth={1.5}
              className='text-red-500 mb-3'
            />
            <h2 className='text-base font-semibold text-zinc-900 dark:text-zinc-100 mb-1'>
              Playground 渲染出错
            </h2>
            <p className='text-sm text-zinc-500 dark:text-zinc-400 text-center mb-4'>
              请打开浏览器 DevTools
              控制台查看完整堆栈，并把错误信息反馈给开发者。
            </p>
            <pre className='w-full max-h-48 overflow-auto rounded-lg bg-zinc-900/95 p-3 text-[11px] leading-relaxed text-red-200 whitespace-pre-wrap font-mono'>
              {String(this.state.error?.stack || this.state.error)}
            </pre>
            <button
              type='button'
              onClick={this.handleReset}
              className='mt-4 inline-flex items-center gap-1.5 h-9 px-4 rounded-xl bg-zinc-900 text-white text-sm font-medium hover:bg-zinc-800 active:translate-y-[1px] dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200'
            >
              <RotateCcw size={14} />
              重试渲染
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default PlaygroundErrorBoundary;
