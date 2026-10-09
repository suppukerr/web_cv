import { demoTableware } from './tableware.demo.js'

export const tablewareCategories = [
  { id: 'plates', name: 'Plates' },
  { id: 'cups-saucers', name: 'Cups & Saucers' },
  { id: 'glassware', name: 'Glassware' },
  { id: 'teapots', name: 'Teapots' },
  { id: 'serving-ware', name: 'Serving Ware' },
  { id: 'cutlery', name: 'Cutlery' },
]

// Add personal records here; image paths are relative to public/.
// { id, name, category, manufacturer, country, year, description,
//   images: ['tableware/example.jpg'], status: 'wishlist', purchaseUrl? }
export const collectionItems = []
export const includeDemoItems = true
export const tablewareItems = [
  ...collectionItems,
  ...(includeDemoItems ? demoTableware.map(item => ({ ...item, demo: true })) : []),
]

export function categoryName(id) {
  return tablewareCategories.find(category => category.id === id)?.name || id || 'Unspecified'
}

export function imagePaths(item) {
  return Array.isArray(item?.images) ? item.images.filter(path => typeof path === 'string' && path.trim()) : []
}

export function statusName(status) {
  return status === 'collected' ? 'Collected' : status === 'wishlist' ? 'Wishlist' : 'Unspecified'
}

export function purchaseLink(item) {
  try {
    const url = new URL(item?.purchaseUrl)
    return ['https:', 'http:'].includes(url.protocol) ? url.href : null
  } catch { return null }
}

export function createTablewareFiles(items = tablewareItems, categories = tablewareCategories) {
  // Unknown category IDs still get a folder, so adding an item never hides it.
  const folders = [...categories]
  items.forEach(item => {
    const id = item.category || 'uncategorized'
    if (!folders.some(category => category.id === id)) folders.push({ id, name: categoryName(id) })
  })
  return [
    { id: 'tableware', name: 'Vintage Tableware', kind: 'folder', parent: null, tableware: true },
    ...folders.map(category => ({ id: `tableware-${category.id}`, name: category.name, kind: 'folder', parent: 'tableware', tableware: true, category: category.id })),
    { id: 'tableware-index', name: 'Collection Index', kind: 'collection-index', parent: 'tableware', tableware: true },
    ...items.map(item => ({ id: `tableware-item-${item.id}`, name: `${item.name || 'Untitled'}.jpg`, kind: 'tableware-item', parent: `tableware-${item.category || 'uncategorized'}`, tableware: true, item })),
  ]
}

export function filterTableware(files, filters = {}, sort = 'name', descending = false) {
  const fields = ['category', 'manufacturer', 'country', 'status']
  const result = files.filter(file => fields.every(field => !filters[field] || (file.item?.[field] || 'Unspecified') === filters[field]))
  const value = file => sort === 'name' || sort === true || !sort || sort === 'kind' ? file.name : file.item?.[sort] || ''
  return [...result].sort((a, b) => ((String(value(a)).localeCompare(String(value(b))) || a.name.localeCompare(b.name)) * (descending ? -1 : 1)))
}
