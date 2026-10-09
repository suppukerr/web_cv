import { readFile, readdir, access } from 'node:fs/promises'
import { join, resolve } from 'node:path'
import assert from 'node:assert/strict'
import { tablewareItems, imagePaths } from '../src/data/tableware.js'
const base = process.env.VITE_BASE_PATH || '/web_cv/'
const root = resolve('dist')
const html = await readFile(join(root,'index.html'),'utf8')
assert.ok(html.includes(`${base}assets/`),'HTML must respect the deployment base')
async function walk(directory) {
  return (await Promise.all((await readdir(directory,{withFileTypes:true})).map(entry => entry.isDirectory() ? walk(join(directory,entry.name)) : join(directory,entry.name)))).flat()
}
const outputs = (await walk(root)).filter(path => /\.(css|js|html)$/.test(path))
const references = new Set()
for (const path of outputs) {
  const source = await readFile(path,'utf8')
  assert.ok(!/https?:\/\/(?:localhost|127\.0\.0\.1|(?:www\.)?infinitemac\.org)/.test(source),`Runtime dependency in ${path}`)
  for (const match of source.matchAll(/(?:src|href)=["']([^"']+)["']|url\(["']?([^"')]+)["']?\)/g)) {
    const ref = match[1] || match[2]
    if (/^(?:data:|https?:|#|%23)/.test(ref) || ref.includes('${')) continue
    if (ref.startsWith('/')) assert.ok(ref.startsWith(base),`Root-relative URL: ${ref}`)
    references.add(ref.startsWith(base) ? join(root,decodeURIComponent(ref.slice(base.length))) : resolve(path,'..',ref))
  }
}
for (const path of references) await access(path)
for (const asset of ['mac/startup-reference.png','mac/Charcoal.woff2','mac/folder.png','mac/document.svg','mac/close.png','mac/zoom.png','mac/collapse.png','mac/resize.png','mac/PlatinumDialogFrame.png','mac/PlatinumButton.png','mac/PlatinumButton-Active.png','mac/PlatinumSelect.png','fonts/Geneva.ttf','icons/apple.svg','icons/finder.svg','icons/trash.svg','documents/my_resume_1.pdf','licenses/infinite-mac.txt']) await access(join(root,asset))
for (const item of tablewareItems) {
  for (const image of imagePaths(item)) await access(join(root, image))
}
const pkg=JSON.parse(await readFile('package.json','utf8'))
assert.ok(!Object.keys({...pkg.dependencies,...pkg.devDependencies}).some(name => /^(react|react-dom|next)$/.test(name)))
console.log(`Static build verified at ${base}: ${references.size} linked files plus all desktop runtime assets.`)
