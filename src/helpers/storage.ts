import { StorageDrive } from '../interfaces'

function findAvailableStorage() {
  return localStorage
}

declare global {
  interface Window {
    __tracking: any
  }
}

const prefix = '__tracking'

export class Storage {
  storage: StorageDrive
  key: string

  constructor(key: string, storage: StorageDrive = findAvailableStorage()) {
    this.storage = storage
    this.key = `${prefix}-${key}`
  }

  save(value: any) {
    this.storage.setItem(this.key, JSON.stringify(value))
  }

  get() {
    const val = this.storage.getItem(this.key)

    return val ? JSON.parse(val) : null
  }
}
