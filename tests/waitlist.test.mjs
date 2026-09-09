import { test } from 'node:test'
import assert from 'node:assert/strict'
import { normalizeEmail } from '../lib/waitlist/validation.ts'

test('normalizes whitespace and case without stripping plus tags', () => {
  assert.equal(normalizeEmail('  Cat+Pett@Example.COM  '), 'cat+pett@example.com')
})
test('rejects malformed, oversized, and non-string input', () => {
  for (const email of [null, {}, 123, '', 'cat', 'cat@localhost', 'a..b@example.com', '.cat@example.com', 'cat.@example.com', 'a@-example.com', 'a@bad_.com', 'a@ex ample.com', 'a\nb@example.com', `${'a'.repeat(65)}@example.com`, `a@${'b'.repeat(64)}.com`]) assert.equal(normalizeEmail(email), null, String(email))
})
test('allows common real addresses', () => {
  for (const email of ['cat@example.com', 'hello+test@pets.co.uk', "o'connor@example.com"]) assert.equal(normalizeEmail(email), email)
})
