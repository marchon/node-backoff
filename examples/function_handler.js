#!/usr/bin/env node

var assert = require('assert');

var backoff = require('../index.js');

// Contruct a function which will fail on its first two calls.
var foo = (function() {
    var args = [[new Error('1')], [new Error('2')], [null, 'ok']];

    return function(callback) {
        callback.apply(null, args.shift());
    };
}());

// Wrap the unreliable function in a backoff handler.
var fooBackoff = backoff.wrap(foo, {
    randomizationFactor: 0.3,
    initialDelay: 5,
    maxDelay: 500
}, backoff.ExponentialStrategy, 10);

// Call the wrapped function which should now succeed.
fooBackoff(function(err, result, results) {
    assert.equal(results.length, 3);
    assert.equal(result, 'ok');
    assert.ok(!err);
});
