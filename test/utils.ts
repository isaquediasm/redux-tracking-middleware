export const GENERIC_ACTION_TYPE = 'GENERIC_ACTION'
export const FAILURE_ACTION_TYPE = 'FAILURE_ACTION'
export const LOADING_ACTION_TYPE = 'LOADING_ACTION'

export const genericActionCreator = () => ({
  type: GENERIC_ACTION_TYPE,
  payload: {}
})

export const failureActionCreator = () => ({
  type: FAILURE_ACTION_TYPE
})

export const loadingActionCreator = () => ({
  type: LOADING_ACTION_TYPE
})
