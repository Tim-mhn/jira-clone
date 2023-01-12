import { removeUndefinedValues } from './object.util';

describe('object utils', () => {
  it('should create new object without the undefined values', () => {
    const object = {
      a: 1,
      b: undefined,
      c: 'hello',
    } as any;

    const objectWithoutUndefineds = removeUndefinedValues(object);

    expect(objectWithoutUndefineds).toEqual({
      a: 1,
      c: 'hello',
    });
  });

  it('should not filter out null values', () => {
    const object = {
      a: 1,
      b: undefined,
      c: null,
    } as any;

    const objectWithoutUndefineds = removeUndefinedValues(object);

    expect(objectWithoutUndefineds).toEqual({
      a: 1,
      c: null,
    });
  });
});
