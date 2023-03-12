import { PersistenceStorage } from '../persistence/persistence.storage';

export class AppLocalStorage<T> implements PersistenceStorage<T> {
  async get(): Promise<T> {
    return this.data;
  }
  async set(data: T): Promise<void> {
    this.data = data;
  }
  private data: T;
}
