import test from 'node:test'
import assert from 'node:assert/strict'
import { fitRect, resizeRect } from '../src/composables/geometry.js'
import { cv } from '../src/data/cv.js'

test('window geometry keeps controls reachable when a viewport shrinks', () => {
  const viewport = {width:320,height:480}
  const rect = fitRect({x:900,y:700,width:680,height:640},viewport)
  assert.equal(rect.width,320)
  assert.equal(rect.height,460)
  assert.equal(rect.x,0)
  assert.ok(rect.y >= 20 && rect.y + 19 <= viewport.height)
  assert.equal(resizeRect({x:0,y:20,width:320,height:460},800,800,viewport).width,320)
  assert.equal(resizeRect({x:0,y:20,width:320,height:460},-800,-800,viewport).height,160)
})

test('original portfolio records and external destinations are preserved', () => {
  assert.equal(cv.name,'Саша Шахнова')
  assert.equal(cv.projects.length,5)
  assert.equal(cv.experience.length,2)
  assert.equal(cv.experience[0].duties.length,9)
  assert.equal(cv.skills.length,11)
  assert.equal(cv.education[0].year,'2019-2023')
  assert.ok(cv.projects.every(p => p.githubLink.startsWith('https://github.com/suppukerr/')))
})

test('desktop state supports focus, independent windows and nested Trash lifecycle', async () => {
  globalThis.window = {innerWidth:1024,innerHeight:768,open() {}}
  globalThis.localStorage = {getItem() {return null},setItem() {}}
  const {desktop,allFiles,activeWindow,open,focus,close,zoom,select,newFolder,moveToTrash,putAway,emptyTrash,children} = await import('../src/composables/useDesktop.js')
  const disk = allFiles.value.find(f => f.id === 'disk'), about = allFiles.value.find(f => f.id === 'about')
  open(disk); open(about)
  assert.equal(desktop.windows.length,2)
  const aboutId = activeWindow.value.id
  const diskId = desktop.windows[0].id
  focus(diskId)
  assert.equal(desktop.windows.at(-1).fileId,'disk')
  assert.equal(desktop.activeId,diskId)
  open(about)
  assert.equal(desktop.windows.length,2)
  assert.equal(desktop.activeId,aboutId)
  const rect = {...activeWindow.value.rect}
  zoom(activeWindow.value); assert.equal(activeWindow.value.rect.width,1024)
  zoom(activeWindow.value); assert.deepEqual({...activeWindow.value.rect},rect)
  close(); assert.equal(activeWindow.value.id,diskId)
  newFolder('Parent'); const parent = allFiles.value.find(f => f.name === 'Parent')
  open(parent); newFolder('Child'); const child = allFiles.value.find(f => f.name === 'Child')
  assert.equal(child.parent,parent.id)
  select(parent.id,diskId);moveToTrash()
  assert.ok(desktop.trash.includes(parent.id))
  assert.ok(!children('disk').some(f => f.id === parent.id))
  select(parent.id); putAway()
  assert.ok(children('disk').some(f => f.id === parent.id))
  select(parent.id);moveToTrash();emptyTrash()
  assert.ok(!allFiles.value.some(f => f.id === parent.id || f.id === child.id))
  assert.deepEqual(desktop.trash,[])
  select(disk.id);moveToTrash()
  assert.deepEqual(desktop.trash,[])
  assert.ok(allFiles.value.some(f => f.id === 'disk'))
})
