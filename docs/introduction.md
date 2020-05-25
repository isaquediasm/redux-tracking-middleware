# Introduction

## Installation

```
yarn add redux-tracking-middleware
```

## Setup

Import the middleware, write your configurations and include it in `applyMiddleware` when creating a Redux Store:

```js
import trackingMiddleware from 'redux-tracking-middleware'
import mixpanel from 'mixpanel'

const defaultTracking = {
  track: action => {
    mixpanel.track(action.type, action.payload)
  }
}

const tracking = trackingMiddleware(defaultTrack)
const store = createStore(rootReducer, applyMiddleware(tracking))
```

## Use

Dispatch an arbitrary action

```js
const foo = () => ({
  type: 'FOO',
  payload: { foo: 'bar' }
})
```

A tracking event will be immedietly dispatched to the `track` fn.

```js
action => {
  mixpanel.track(action.type, action.payload)
}
```

Copyright (c) 2020 Isaque Dias. [Code licensed with the MIT License (MIT)](/LICENSE). [Documentation licensed with the CC BY-NC License](LICENSE).
