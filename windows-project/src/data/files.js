import { createTablewareFiles } from './tableware.js'
export const asset = path => `${import.meta.env?.BASE_URL || '/'}${path}`
export const isFinderWindow = win => ['folder', 'disk', 'trash', 'collection-index'].includes(win?.kind)
export const files = [
  { id: 'disk', name: 'Macintosh HD', kind: 'disk', parent: null },
  { id: 'about', name: 'About Me', kind: 'document', parent: 'disk' },
  { id: 'experience', name: 'Experience', kind: 'folder', parent: 'disk' },
  { id: 'projects', name: 'Projects', kind: 'folder', parent: 'disk' },
  { id: 'skills', name: 'Skills', kind: 'application', parent: 'disk' },
  { id: 'contacts', name: 'Contacts', kind: 'document', parent: 'disk' },
  { id: 'resume', name: 'Resume.pdf', kind: 'pdf', parent: 'disk' },
  { id: 'links', name: 'Links', kind: 'folder', parent: 'disk' },
  { id: 'github', name: 'GitHub', kind: 'alias', parent: 'links', url: 'https://github.com/suppukerr' },
  { id: 'telegram', name: 'Telegram', kind: 'alias', parent: 'links', url: 'https://t.me/tchepuxa' },
  { id: 'trash', name: 'Trash', kind: 'trash', parent: null },
  ...createTablewareFiles(),
]
export function iconFor(file) {
  if (file.kind === 'folder') return asset('mac/folder.png')
  if (file.kind === 'disk') return asset('mac/disk.svg')
  if (file.kind === 'trash') return asset('icons/trash.svg')
  if (file.kind === 'application') return asset('mac/computer.svg')
  if (file.kind === 'alias') return asset('mac/alias.svg')
  return asset('mac/document.svg')
}
