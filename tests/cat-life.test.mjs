import assert from 'node:assert/strict'
import test from 'node:test'
import { initial, advanceResidents, sendTo } from '../components/bento/cat-life.ts'

function tick(cats, seconds, night = false) {
  for (let second = 0; second < seconds; second++) cats = advanceResidents(cats, false, night)
  return cats
}
const readyToPlay = () => initial.map(cat => ({ ...cat, activity: 'play', remaining: 6 }))

test('cats wash after meals without walking away first', () => {
  const meals = initial.map(cat => sendTo(cat, 'eat'))
  const washing = tick(meals, 12)
  washing.forEach((cat, index) => {
    assert.equal(cat.activity, 'groom')
    assert.deepEqual([cat.x, cat.y], [meals[index].x, meals[index].y])
  })
})

test('naps turn into belly-up sleep and stay restful while the lights are low', () => {
  const napping = initial.map(cat => sendTo(cat, 'sleep'))
  const bellyUp = tick(napping, 20)
  assert.ok(bellyUp.every(cat => cat.activity === 'belly'))
  const rested = tick(bellyUp, 100, true)
  assert.ok(rested.every(cat => ['sleep', 'belly'].includes(cat.activity) && cat.rest === 100))
})

test('shared grooming waits for both cats and places Pusha in front at contact', () => {
  const meeting = advanceResidents(readyToPlay(), true)
  assert.ok(meeting.every(cat => cat.activity === 'walk' && cat.destination === 'snuggle'))
  const differentArrivalTimes = meeting.map((cat, index) => ({ ...cat, remaining: index ? 3 : 1 }))
  const together = tick(differentArrivalTimes, 3)
  assert.ok(together.every(cat => cat.activity === 'snuggle' && cat.remaining === 10))
  assert.ok(together.find(cat => cat.name === 'Pusha').y > together.find(cat => cat.name === 'Bonita').y)
  assert.ok(tick(together, 10).every(cat => cat.activity === 'walk' && cat.destination !== 'snuggle'))
})

test('a feeding command interrupts the shared routine without bringing it back', () => {
  const together = tick(advanceResidents(readyToPlay(), true), 3)
  const fed = tick(together.map(cat => sendTo(cat, 'eat')), 4)
  assert.ok(fed.every(cat => cat.activity === 'eat'))
  assert.ok(tick(fed, 9).every(cat => cat.activity === 'groom'))
})

test('shared grooming does not interrupt a nap or travel', () => {
  assert.ok(advanceResidents(initial, true).every(cat => cat.destination !== 'snuggle'))
  const walking = readyToPlay().map(cat => sendTo(cat, 'watch'))
  assert.ok(advanceResidents(walking, true).every(cat => cat.destination === 'watch'))
})

test('both cats naturally reach grooming, belly-up sleep, and silly moments', () => {
  let cats = initial
  const seen = { Pusha: new Set(), Bonita: new Set() }
  for (let second = 0; second < 220; second++) {
    cats = advanceResidents(cats)
    cats.forEach(cat => seen[cat.name].add(cat.activity))
  }
  Object.values(seen).forEach(poses => ['groom', 'belly', 'silly'].forEach(pose => assert.ok(poses.has(pose))))
})


test('a silly moment on the same rug starts without walking in place', () => {
  const bonita = { ...initial[1], activity: 'play' }
  const silly = sendTo(bonita, 'silly')
  assert.equal(silly.activity, 'silly')
  assert.deepEqual([silly.x, silly.y], [bonita.x, bonita.y])
})
