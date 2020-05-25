export const noop = (val: any) => val
export const booleanNoop = (val: any) => !!val
export const pipe = (...fns: Array<any>) => (x: any) =>
  fns.reduce((v, f) => f(v), x)
