export interface Config {
  filter?: Array<string>
  handlers?: Object
}

export interface Action {
  type: String
  disableTracking?: boolean
  defineTracking?: Object
}

export interface Handlers {
  [pattern: string]: Function
}

export interface Tracker {
  track: Function
  transform?: Function
  pattern?: Function | String
  filter?: Function
}

export interface TrackingService {
  reduxMiddleware(getState: any): (next: Function) => (action: Action) => any
}

export interface StateStorage {
  save: Function
  get: Function
}

export interface StorageDrive {
  setItem: Function
  getItem: Function
  length?: Number
  clear?: Function
  key?(index: number): string | null
  removeItem?: Function
}
