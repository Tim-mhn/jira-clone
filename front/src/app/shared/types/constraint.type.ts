export type Constraint<T, V> = Omit<T, keyof V> & {
  [key in keyof V]: V[key];
};
