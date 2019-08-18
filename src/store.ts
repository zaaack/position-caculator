class Store {
  get<V = any>(key: string, defaults: V): V
  get<V = any>(key: string): V | null
  get<V = any>(key: string, defaults?: V): V | null {
    try {
      return JSON.parse(localStorage.getItem(key)!) || defaults
    } catch (error) {
      return defaults!
    }
  }
  set<V>(key: string, val: V) {
    localStorage.setItem(key, JSON.stringify(val))
  }
}

export const store = new Store
