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
}
