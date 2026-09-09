/* eslint-disable header/header -- Original searouter file; do not assign its copyright to upstream. */
/*
Copyright (C) 2026 searouter contributors
SPDX-License-Identifier: AGPL-3.0-or-later
See LICENSE and NOTICE in the repository root.
*/

import React from 'react';

const sourceCodeUrl =
  import.meta.env.VITE_SOURCE_CODE_URL ||
  'https://github.com/MetastoneCorp/searouter';

const OpenSourceNotice = () => (
  <nav
    aria-label='开源信息 / Open source'
    className='flex w-full flex-wrap justify-center gap-x-2 px-6 py-4 text-sm text-semi-color-text-1'
  >
    <a
      href={`${import.meta.env.BASE_URL}open-source.html`}
      className='!text-semi-color-primary underline'
    >
      开源声明
    </a>
    <span aria-hidden='true'>·</span>
    <a
      href={sourceCodeUrl}
      target='_blank'
      rel='noopener noreferrer'
      className='!text-semi-color-primary underline'
    >
      源码
    </a>
  </nav>
);

export default OpenSourceNotice;
