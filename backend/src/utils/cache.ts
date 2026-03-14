type CacheEntry<T> = {
  value: T;
  expiresAt: number;
};

export interface CacheStore<T> {
  get(key: string): T | null;
  set(key: string, value: T, ttlSeconds: number): void;
}

export class InMemoryCacheStore<T> implements CacheStore<T> {
  private readonly store = new Map<string, CacheEntry<T>>();

  get(key: string): T | null {
    const entry = this.store.get(key);

    if (!entry) {
      return null;
    }

    if (entry.expiresAt <= Date.now()) {
      this.store.delete(key);
      return null;
    }

    return entry.value;
  }

  set(key: string, value: T, ttlSeconds: number): void {
    this.store.set(key, {
      value,
      expiresAt: Date.now() + ttlSeconds * 1000,
    });
  }
}
