introspect.js
=============

Introspect and inject a property that is an object containing private functions. Could be useful for unit testing private functions.

## To use (example):
`introspect('adder.js')`

You now have access to `introspect.injected`, which is a clone of `adder.js`, but with the added bonus of `introspect.injected._private`. Yay.
