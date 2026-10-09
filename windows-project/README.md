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

## Vintage Tableware

Open **Vintage Tableware** directly on the desktop. Double-click a category to browse
its photographs, or open **Collection Index** to filter by category, maker,
country and status. Finder's View menu switches between icons and a list.
Single-click selects a file; double-click or Enter opens PictureViewer.
Preview windows share the desktop's dragging, resizing, focus, zoom, collapse
and close controls. Use the parent-folder button to return to the collection;
Show in Finder opens and selects the photograph in its category folder.
Hash links also reopen collection folders and previews after refresh.

To add your own objects:

1. Put JPEG, PNG or WebP photographs in `public/tableware/`, for example
   `public/tableware/my-plate.jpg` and `public/tableware/my-plate-back.jpg`.
2. Add a record to `collectionItems` in `src/data/tableware.js`:

```js
export const collectionItems = [
  {
    id: 'my-plate', // Unique; keep stable for bookmarked previews.
    name: 'Blue floral dinner plate',
    category: 'plates',
    manufacturer: 'Your maker',
    country: 'Your country',
    year: 'c. 1960–1970',
    description: 'Notes about the pattern, condition and provenance.',
    images: ['tableware/my-plate.jpg', 'tableware/my-plate-back.jpg'],
    status: 'collected', // 'wishlist' or 'collected'
    // purchaseUrl: 'https://example.com/item', // Optional Find / Buy link.
  },
]
```

Paths are relative to `public/`: omit `public/`, a leading slash and the
GitHub repository prefix. The app adds the configured deployment base.
Missing photographs show a document placeholder; missing metadata displays
Unspecified. Records can have several photographs, navigated with the viewer's
arrow buttons. No upload service or extra dependency is needed.

Set `includeDemoItems = false` in the same file to hide all demo objects.
The six demo records live separately in `src/data/tableware.demo.js`, with
photographs in `public/tableware/demo/`. Their Wishlist/Collected statuses
are illustrative; they are not assertions about your personal collection.
Photo credits and museum records are documented in
[the image sources](public/tableware/demo/README.md).

Built-in category IDs: `plates`, `cups-saucers`, `glassware`, `teapots`,
`serving-ware`, `cutlery`. Add an `{ id, name }` entry to `tablewareCategories`
for a new category; items with unlisted category IDs also get a folder
rather than disappearing. Rebuild and deploy normally after changing data
or photographs.
