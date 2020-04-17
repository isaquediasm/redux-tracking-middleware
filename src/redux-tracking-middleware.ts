// Import here Polyfills if needed. Recommended core-js (npm i -D core-js)
// import "core-js/fn/array.find"
// ...

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

function checkValidateMethods() {

}

// should filter out action types containing these strigns
const filterRules = ['UI', 'LOADING', 'FAILED']

export function trackingMiddleware() {
  return (clients: Array<Object>, config: any) => (next: Function) => (
    action: Object
  ) => {
    const { validate } = config

    const validateFn = validate && Array.isArray(validate) ? validate :  
    const event = pipe(validateByTerm(filterRules))(action)

    track(event)

    return next(action)
  }
}
