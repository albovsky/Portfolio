import assert from 'node:assert/strict'
import test from 'node:test'
import { getPushaAge, pushaStats } from '../components/bento/cat-profile-data.ts'

test('Pusha ages on January 23, not at the beginning of the year', () => {
  assert.equal(getPushaAge(new Date(2026, 0, 22, 23, 59)), 3)
  assert.equal(getPushaAge(new Date(2026, 0, 23, 0, 0)), 4)
  assert.equal(getPushaAge(new Date(2026, 8, 5)), 4)
  assert.equal(getPushaAge(new Date(2027, 0, 1)), 4)
  assert.equal(getPushaAge(new Date(2027, 0, 23)), 5)
})

test('Pusha’s personality ratings match the supplied values', () => {
  assert.deepEqual(pushaStats.map(({label, value, rating}) => [label, value, rating]), [
    ['Nap power', 10, 'MAX'], ['Loaf form', 10, '10/10'],
    ['Personal space', 2, '2/10'], ['Zoomies', 8, '8/10'],
  ])
})
