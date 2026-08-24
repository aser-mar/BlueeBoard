const test = require('node:test');
const assert = require('node:assert/strict');
const { validatePassword } = require('../utils/passwordPolicy');

test('accepts a strong password', () => {
  const result = validatePassword('StrongPass1!');
  assert.equal(result.valid, true);
});

test('rejects a password missing complexity requirements', () => {
  const result = validatePassword('weakpass');
  assert.equal(result.valid, false);
  assert.match(result.message, /at least 8 characters/);
  assert.match(result.message, /an uppercase letter/);
  assert.match(result.message, /a number/);
  assert.match(result.message, /a special character/);
});
