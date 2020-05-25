# Introduction

## Installation

First, install the middleware.

```text
npm i redux-promise-middleware -s
```

## Setup

Import the middleware and include it in `applyMiddleware` when creating the Redux store:

```javascript
import promise from 'redux-promise-middleware'

composeStoreWithMiddleware = applyMiddleware(
  promise,
)(createStore)
```

## Use

Dispatch a promise as the value of the `payload` property of the action.

```javascript
const foo = () => ({
  type: 'FOO',
  payload: new Promise()
});
```

A pending action is immediately dispatched.

```javascript
{
  type: 'FOO_PENDING'
}
```

Once the promise is settled, a second action will be dispatched. If the promise is resolved a fulfilled action is dispatched.

```javascript
{
  type: 'FOO_FULFILLED'
  payload: {
    ...
  }
}
```

On the other hand, if the promise is rejected, a rejected action is dispatched.

```javascript
{
  type: 'FOO_REJECTED'
  error: true,
  payload: {
    ...
  }
}
```

That's it!

## Further Reading

* [Catching Errors Thrown by Rejected Promises](isaquediasm-redux-tracking-middleware-1/rejected-promises.md)
* [Use with Reducers](isaquediasm-redux-tracking-middleware-1/reducers.md)
* [Optimistic Updates](isaquediasm-redux-tracking-middleware-1/optimistic-updates.md)
* [Design Principles](isaquediasm-redux-tracking-middleware-1/design-principles.md)

Copyright \(c\) 2017 Patrick Burtchaell. [Code licensed with the MIT License \(MIT\)](https://github.com/isaquediasm/redux-tracking-middleware/tree/70a8b8cc90993b55b3a946450a3ca5b5b06512c7/LICENSE/README.md). [Documentation licensed with the CC BY-NC License](https://github.com/isaquediasm/redux-tracking-middleware/tree/70a8b8cc90993b55b3a946450a3ca5b5b06512c7/docs/LICENSE/README.md).

