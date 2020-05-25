import { Action } from './interfaces'

export const noop = (val: any) => val
export const booleanNoop = (val: any) => !!val

/**
 * Check if patterns is either a string (regex) or
 * a function and returns a proper
 * normalised pattern validation function
 *
 * @param pattern
 */
export function getPattern(pattern: any) {
  return typeof pattern === 'string'
    ? (action: Action): boolean => !!action.type.match(new RegExp(pattern))
    : pattern
}
