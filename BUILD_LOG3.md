npm warn deprecated node-domexception@1.0.0: Use your platform's native DOMException instead

added 246 packages, and audited 247 packages in 8s

42 packages are looking for funding
  run `npm fund` for details

13 vulnerabilities (2 low, 4 moderate, 7 high)

To address all issues, run:
  npm audit fix

Run `npm audit` for details.

> react-example@0.0.0 build
> vite build

[36mvite v6.4.2 [32mbuilding for production...[36m[39m
transforming...
[32m✓[39m 2100 modules transformed.
rendering chunks...
computing gzip size...
[2mdist/[22m[32mindex.html                 [39m[1m[2m    3.08 kB[22m[1m[22m[2m │ gzip:     1.07 kB[22m
[2mdist/[22m[2massets/[22m[35mindex-BPAIRF68.css  [39m[1m[2m   78.18 kB[22m[1m[22m[2m │ gzip:    11.75 kB[22m
[2mdist/[22m[2massets/[22m[36mindex-C7iRAKOr.js   [39m[1m[33m1,968.08 kB[39m[22m[2m │ gzip: 1,029.11 kB[22m
[33m
(!) Some chunks are larger than 500 kB after minification. Consider:
- Using dynamic import() to code-split the application
- Use build.rollupOptions.output.manualChunks to improve chunking: https://rollupjs.org/configuration-options/#output-manualchunks
- Adjust chunk size limit for this warning via build.chunkSizeWarningLimit.[39m
[32m✓ built in 3.35s[39m
BUILD_EXIT_CODE=0
