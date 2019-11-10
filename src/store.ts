class Store {
  get<V = any>(key: string, defaults: V): V
  get<V = any>(key: string): V | null
  get<V = any>(key: string, defaults: V | null = null): V | null {
    let val: V | null
    try {
      val = JSON.parse(localStorage.getItem(key)!)
      if (val != null) {
        return val
      }
    } catch (error) { }
    return defaults
  }
  set<V>(key: string, val: V) {
    localStorage.setItem(key, JSON.stringify(val))
  }
  delete(key: string) {
    localStorage.removeItem(key)
  }
}

export const store = new Store()
