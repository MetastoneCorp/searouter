/*
Copyright (C) 2026 searouter contributors
SPDX-License-Identifier: AGPL-3.0-or-later
See LICENSE and NOTICE in the repository root.
*/

import { readFileSync } from 'node:fs';

const files = ['LICENSE', 'NOTICE', 'THIRD-PARTY-LICENSES.md'];
const assetName = (file) => (file.includes('.') ? file : `${file}.txt`);

export default function legalNotices() {
  const contents = new Map(
    files.map((file) => [
      file,
      readFileSync(new URL(`../${file}`, import.meta.url)),
    ]),
  );
  let base = '/';
  let sourceCodeUrl = 'https://github.com/MetastoneCorp/searouter';

  return {
    name: 'searouter-legal-notices',
    configResolved(config) {
      base = config.base;
      sourceCodeUrl = config.env.VITE_SOURCE_CODE_URL || sourceCodeUrl;
    },
    transformIndexHtml(html) {
      const escaped = sourceCodeUrl.replace(
        /[&<>"']/g,
        (character) =>
          ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;',
          })[character],
      );
      return html.replaceAll('__SEAROUTER_SOURCE_URL__', escaped);
    },
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const pathname = (req.url || '').split('?')[0];
        const file = files.find(
          (name) => pathname === `${base}legal/${assetName(name)}`,
        );
        if (!file || !['GET', 'HEAD'].includes(req.method)) return next();
        res.setHeader('Content-Type', 'text/plain; charset=utf-8');
        res.end(req.method === 'HEAD' ? undefined : contents.get(file));
      });
    },
    generateBundle() {
      for (const [file, source] of contents) {
        this.emitFile({
          type: 'asset',
          fileName: `legal/${assetName(file)}`,
          source,
        });
      }
    },
  };
}
