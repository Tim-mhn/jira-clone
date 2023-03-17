export interface PersistenceStorage<T> {
  get(): Promise<T>;
  set(data: T): Promise<void>;
}
