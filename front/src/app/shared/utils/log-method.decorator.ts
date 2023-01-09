export function logMethod(
  target: any,
  methodName: string,
  descriptor: PropertyDescriptor
) {
  const targetMethod = descriptor.value;

  // eslint-disable-next-line no-param-reassign, func-names
  descriptor.value = function (...args: any[]) {
    console.group(`[Method called] ${methodName}`);
    console.log('[From] ', target);
    console.log('[Args] ', args);
    const results = targetMethod.apply(this, args);
    console.log('[Returns] ', results);
    console.groupEnd();
    return results;
  };

  return descriptor;
}
