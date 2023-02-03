import { objectKeys } from '@tim-mhn/common/objects';
import { combineLatest, map, Observable, tap } from 'rxjs';

type CombineLatestWithTriggerOutput<T> = Observable<T & { trigger: keyof T }>;

type CombineLatestWithTriggerInput<T> = {
  [K in keyof T]: Observable<T[K]>;
};
export function combineLatestWithTrigger<T>(
  source: CombineLatestWithTriggerInput<T>
): CombineLatestWithTriggerOutput<T> {
  const customCombineLatest: Partial<CombineLatestWithTriggerInput<T>> = {};

  let trigger: keyof T = null;

  objectKeys(source).forEach((obsKey) => {
    const obs = source[obsKey];

    const obsWithTrigger = obs.pipe(tap(() => (trigger = obsKey)));

    customCombineLatest[obsKey] = obsWithTrigger;
  });

  return combineLatest(customCombineLatest).pipe(
    map((output) => ({
      ...output,
      trigger,
    }))
  );
}
