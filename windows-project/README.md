# Vue Mac OS 9 portfolio application

From this directory:

```sh
npm ci
npm run dev
npm test
npm run build
npm run check:build
npm run preview
```

The output in `dist/` is a self-contained static site. The default deployment
base is `/web_cv/`; override it at build time with `VITE_BASE_PATH` for another
repository. Hash links reopen portfolio content on refresh.

See [the repository README](../README.md) for GitHub Pages deployment and
[the migration audit](docs/MIGRATION.md) for source comparisons and validation.
