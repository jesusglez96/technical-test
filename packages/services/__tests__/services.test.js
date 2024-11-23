'use strict';

const services = require('..');
const assert = require('assert').strict;

assert.strictEqual(services(), 'Hello from services');
console.info('services tests passed');
