import { PersistenceStorage } from '../persistence/persistence.storage';
import { readJSONFile, writeJSONFile } from './file-helpers';

export class JSONFileStorage<T> implements PersistenceStorage<T> {
  constructor(private filename: string) {}

  async get() {
    try {
      return await readJSONFile<T>(this.filename);
    } catch (err) {
      console.error(`Error in readJSONFile for JSONFileStorage: `, err);
      return null;
    }
  }

  set(data: T) {
    return writeJSONFile<T>(this.filename, data);
  }
}
