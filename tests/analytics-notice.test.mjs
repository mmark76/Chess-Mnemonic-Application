import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'
import vm from 'node:vm'

function createElement() {
  const listeners = new Map()
  return {
    hidden: true,
    addEventListener(event, handler) { listeners.set(event, handler) },
    click() { listeners.get('click')?.() },
  }
}

function runNotice(storage) {
  const notice = createElement()
  const close = createElement()
  const reopen = createElement()
  const document = {
    readyState: 'complete',
    getElementById(id) {
      return { analyticsConsent: notice, analyticsClose: close, analyticsInfo: reopen }[id] ?? null
    },
    addEventListener() {},
  }
  return readFile(new URL('../js/analytics-notice.js', import.meta.url), 'utf8').then((source) => {
    vm.runInNewContext(source, { document, window: { localStorage: storage } })
    return { notice, close, reopen }
  })
}

function storage(initialValue = null) {
  let value = initialValue
  return { getItem: () => value, setItem: (_key, nextValue) => { value = nextValue } }
}

test('shows on a first visit, persists Close across reload, and manually reopens', async () => {
  const localStorage = storage()
  const firstVisit = await runNotice(localStorage)
  assert.equal(firstVisit.notice.hidden, false)

  firstVisit.close.click()
  assert.equal(firstVisit.notice.hidden, true)
  assert.equal(localStorage.getItem(), 'true')

  const reload = await runNotice(localStorage)
  assert.equal(reload.notice.hidden, true)
  reload.reopen.click()
  assert.equal(reload.notice.hidden, false)
})

test('shows when localStorage is unavailable', async () => {
  const unavailableStorage = {
    getItem() { throw new Error('unavailable') },
    setItem() { throw new Error('unavailable') },
  }
  const page = await runNotice(unavailableStorage)
  assert.equal(page.notice.hidden, false)
  assert.doesNotThrow(() => page.close.click())
})
