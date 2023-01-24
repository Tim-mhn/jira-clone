import {
  objectHasOnlyNullOrEmptyStringValues,
  removeUndefinedValues,
} from './object.util';

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

describe('objectHasOnlyNullOrEmptyStringValues', () => {
  it('should return true if all values are empty strings', () => {
    const obj = {
      a: '',
      b: '',
      c: '',
    };

    expect(objectHasOnlyNullOrEmptyStringValues(obj)).toBeTrue();
  });

  it('should return false if one value is a non-empty string', () => {
    const obj = {
      a: '',
      b: 'b',
      c: '',
    };

    expect(objectHasOnlyNullOrEmptyStringValues(obj)).toBeFalse();
  });

  it('should return true if  all values are empty strings or nulls', () => {
    const obj = {
      a: '',
      b: <any>null,
      c: '',
    };

    expect(objectHasOnlyNullOrEmptyStringValues(obj)).toBeTrue();
  });

  it('should return true if the object is null', () => {
    expect(objectHasOnlyNullOrEmptyStringValues(null)).toBeTrue();
  });

  it('should return true if the object is an empty object', () => {
    expect(objectHasOnlyNullOrEmptyStringValues({})).toBeTrue();
  });
});
