import test from 'node:test'
import assert from 'node:assert/strict'
import { access } from 'node:fs/promises'
import { tablewareItems, tablewareCategories, collectionItems, createTablewareFiles, filterTableware, imagePaths, purchaseLink } from '../src/data/tableware.js'

test('collection files have unique identities, valid parent folders and local photographs', async () => {
  const files = createTablewareFiles()
  assert.equal(new Set(files.map(file => file.id)).size, files.length)
  assert.equal(tablewareCategories.length, 6)
  for (const file of files.filter(file => file.item)) {
    assert.ok(files.some(folder => folder.id === file.parent && folder.kind === 'folder'))
    assert.ok(['wishlist', 'collected'].includes(file.item.status))
    for (const image of imagePaths(file.item)) await access(new URL(`../public/${image}`, import.meta.url))
  }
  assert.ok(collectionItems.every(item => !item.demo))
  assert.ok(tablewareItems.filter(item => item.id.startsWith('demo-')).every(item => item.demo))
})

test('index combines filters, sorts both ways and handles incomplete metadata', () => {
  const files = createTablewareFiles().filter(file => file.item)
  const result = filterTableware(files, { country: 'United States', status: 'wishlist' }, 'manufacturer')
  assert.deepEqual(result.map(file => file.item.id), ['demo-ohr-teapot'])
  assert.equal(filterTableware(files, { category: 'plates', status: 'collected' }).length, 0)
  const ascending = filterTableware(files, {}, 'country')
  assert.deepEqual(filterTableware(files, {}, 'country', true).map(file => file.id), ascending.map(file => file.id).reverse())
  assert.equal(filterTableware(files, { manufacturer: 'Unspecified' }).length, 2)
  assert.deepEqual(imagePaths({ images: [null, '', 'plate.jpg'] }), ['plate.jpg'])
  assert.deepEqual(imagePaths({}), [])
  assert.equal(purchaseLink({ purchaseUrl: 'javascript:alert(1)' }), null)
  assert.equal(purchaseLink({}), null)
  assert.equal(purchaseLink({ purchaseUrl: 'https://example.com/plate' }), 'https://example.com/plate')
})

test('new category records are discoverable without changing Finder code', () => {
  const files = createTablewareFiles([{ id: 'bowl', name: 'Bowl', category: 'bowls' }], [])
  assert.ok(files.some(file => file.id === 'tableware-bowls' && file.kind === 'folder'))
  assert.equal(files.find(file => file.item)?.parent, 'tableware-bowls')
})

test('collection windows share desktop focus, reopening, filtering and resize behavior', async () => {
  globalThis.window = { innerWidth: 1024, innerHeight: 768 }
  globalThis.localStorage = { getItem() { return null }, setItem() {} }
  const { desktop, allFiles, open, close, children, visibleChildren, activeWindow, zoom } = await import('../src/composables/useDesktop.js')
  open(allFiles.value.find(file => file.id === 'tableware'))
  assert.equal(children('tableware').length, 7)
  open(allFiles.value.find(file => file.id === 'tableware-index'))
  const index = activeWindow.value
  assert.equal(visibleChildren(index).length, tablewareItems.length)
  index.collectionFilters.category = 'cups-saucers'
  const item = visibleChildren(index)[0]
  assert.equal(visibleChildren(index).length, 1)
  open(item)
  const preview = activeWindow.value
  assert.equal(preview.kind, 'tableware-item')
  const count = desktop.windows.length
  open(item)
  assert.equal(desktop.windows.length, count)
  zoom(preview)
  assert.equal(preview.rect.width, 1024)
  close(preview.id)
  assert.equal(activeWindow.value.id, index.id)
  assert.equal(visibleChildren(index).length, 1)
})
