import { objectEntries } from '@tim-mhn/common/objects';

export function concatObjectsIf<U, V, R extends U & V = U & V>(
  obj: U,
  objToConcatIfCondition: V,
  condition: boolean
): R {
  return {
    ...obj,
    ...(condition && objToConcatIfCondition),
  } as any as R;
}

export function removeUndefinedValues<T>(_object: T): Partial<T> {
  const objectWithoutUndefinedValues = {} as Partial<T>;

  objectEntries(_object).forEach(([key, value]) => {
    if (value !== undefined) {
      objectWithoutUndefinedValues[key] = value;
    }
  });

  return objectWithoutUndefinedValues;
}
