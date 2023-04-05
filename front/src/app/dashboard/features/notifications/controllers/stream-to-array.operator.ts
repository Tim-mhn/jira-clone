import { Observable, map, tap } from 'rxjs';

type StreamToArrayOrder = 'newest-first' | 'newest-last';
export function streamToArray<T>(
  source: Observable<T>,
  order: StreamToArrayOrder = 'newest-last'
): Observable<T[]> {
  const emittedValues: T[] = [];

  return source.pipe(
    tap((newValue) => {
      if (order === 'newest-first') emittedValues.unshift(newValue);
      else emittedValues.push(newValue);
    }),
    map(() => emittedValues)
  );
}
