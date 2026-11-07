import { readFileSync, writeFileSync } from 'node:fs';
const sha = process.env.GITHUB_SHA;
if (!/^[a-f0-9]{40}$/.test(sha || '')) throw new Error('A complete commit SHA is required');
const file = '_site/index.html';
const html = readFileSync(file, 'utf8');
if (!html.includes('</head>')) throw new Error('Missing document head');
writeFileSync(file, html.replace('</head>', `<meta name="deployment-commit" content="${sha}">\n</head>`));
