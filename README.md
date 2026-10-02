# Sasha Shakhnova’s Macintosh portfolio

A self-contained Vue 3 / Vite CV presented as a Mac OS 9 Platinum desktop.
Experience and projects are Finder folders; biography and contacts are documents;
skills are a system profiler. The original resume PDF and external aliases are
included.

## Development and validation

```sh
cd windows-project
npm ci
npm run dev
npm test
npm run build
npm run check:build
npm run preview
```

The deployable static output is `windows-project/dist`. It requires no backend,
SSR server, Docker, emulator, ROM, or connection to Infinite Mac. All runtime
fonts and UI assets are local.

The default base is `/web_cv/`. For another repository:

```sh
VITE_BASE_PATH=/your-repository/ npm run build
VITE_BASE_PATH=/your-repository/ npm run check:build
```

Hash URLs such as `/web_cv/#projects` reopen their content after refreshing.
Wallpaper and icon positions persist locally; custom folders are session state.
The browser renders PDFs, with local download/open links as alternatives.

## GitHub Pages

Select **GitHub Actions** as the Pages source in the repository settings. The
included workflow validates/builds/deploys on pushes to `master` or manual runs
and derives the base path from the repository name. Change its branch filter if
the default branch changes. The existing `npm run deploy` remains available for
branch-based Pages. This migration does not publish anything by itself.

## Reference and implementation

[Migration audit, comparisons, and validation](windows-project/docs/MIGRATION.md).
Platinum controls/CSS and Charcoal are adapted from
[Infinite Mac](https://github.com/mihaip/infinite-mac); its Apache 2.0 license is
included locally. Additional font and rendered OS asset provenance appears in
[asset notes](windows-project/public/mac/README.md).
