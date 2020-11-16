# Redux tracking middleware [![Build Status](https://travis-ci.com/isaquediasm/redux-tracking-middleware.svg?branch=master)](https://travis-ci.com/isaquediasm/redux-tracking-middleware) [![Size Status](https://img.shields.io/bundlephobia/min/redux-tracking-middleware)](https://img.shields.io/bundlephobia/min/redux-tracking-middleware)

Redux Tracking Middleware uses the power of middlewares to enable a simple and robust way to handle action/event tracking in your application.

https://isaquediasm.gitbook.io/tracking-middleware/

## Motivation

UI Interactions don't often provide enough insights about our application usage. This library allows you to track your meaningful Redux actions, which is specially useful for async actions tracking, such as signup or checkout.

**Disclamer:** It's not the purpose of this library to cover all the tracking edge cases. You might still need to manually track UI events based on your own needs and use cases.

Read more about the [Design Principles](https://isaquediasm.gitbook.io/tracking-middleware/getting-started/design-principles)

## Instalation

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
const store = createStore(
  rootReducer,
  applyMiddleware(tracking.reduxMiddleware)
)
```

## Documentation and Help

- [Official Documentation](https://isaquediasm.gitbook.io/tracking-middleware/)
- [Introduction](https://isaquediasm.gitbook.io/tracking-middleware/getting-started/introduction)
- [Guides](https://isaquediasm.gitbook.io/tracking-middleware/guides/filtering-types)
- [Usage outside of Redux](https://isaquediasm.gitbook.io/tracking-middleware/guides/without-redux)

## Versioning

To keep better organization of releases we follow the [Semantic Versioning 2.0.0](http://semver.org/) guidelines.

## Contributing

Want to contribute? [Follow these recommendations](https://github.com/isaquediasm/redux-tracking-middleware/blob/master/docs/contributing.md).

## History

See [Releases](https://github.com/isaquediasm/redux-tracking-middleware/releases) for detailed changelog.

## License

[MIT License](https://github.com/isaquediasm/redux-tracking-middleware/master/LICENSE.md) © [Isaque Dias](https://github.com/isaquediasm)
