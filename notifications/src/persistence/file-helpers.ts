import { readFile, writeFile } from 'fs';

const FILENAME = './src/persistence/new-comment-notifications.json';

export async function openFile() {
  try {
    const data = await readJSONFile<string[]>(FILENAME);
    data.push('c');
    await writeJSONFile(FILENAME, data);
    console.log(data);
  } catch (err) {
    console.error(err);
  }
}

export async function readJSONFile<T>(filename: string): Promise<T> {
  console.log('reading file: ', filename);
  return new Promise((res, reject) => {
    readFile(filename, 'utf-8', (err: Error, data: string) => {
      if (err) reject(err);
      else res(JSON.parse(data));
    });
  });
}

export async function writeJSONFile<T>(
  filename: string,
  data: T,
): Promise<void> {
  const stringifiedData = JSON.stringify(data);
  return new Promise((res, reject) => {
    writeFile(filename, stringifiedData, 'utf-8', (err: Error) => {
      if (err) reject(err);
      else res();
    });
  });
}
