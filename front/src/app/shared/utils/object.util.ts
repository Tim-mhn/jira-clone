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
