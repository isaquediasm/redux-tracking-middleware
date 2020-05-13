// Import here Polyfills if needed. Recommended core-js (npm i -D core-js)
// import "core-js/fn/array.find"
// ...

const noop = (val: Array<any>) => val
const pipe = (...functions: Array<Function>) => (...value: Array<any>) => {
  return functions.reduce((currentValue, currentFunction) => {
    return currentFunction(
      ...(Array.isArray(currentValue) ? currentValue : [currentValue])
    )
  }, value)
}

function track(event: Object) {
  if (!event) return

  console.log('##event', event)
}

function validateByTerm(terms: Array<String>) {
  return (action: any) => {
    return !terms.some(single => action.type.includes(single)) && action
  }
}

function checkValidateFn(fn: Array<Function> | Function = noop) {
  const validateFn = Array.isArray(fn) ? fn.filter(Boolean) : [fn]
  return validateFn
}

// should filter out action types containing these strigns
const filterRules = ['LOADING', 'FAILURE']

export function trackingMiddleware() {
  return (clients: Array<Object> = [], config: any = {}) => (
    next: Function
  ) => (action: Object) => {
    const { validate } = config

    const validateFn = checkValidateFn(validate)
    const event = pipe(validateByTerm(filterRules), ...validateFn)(action)

    track(event)

    return next(action)
  }
}
