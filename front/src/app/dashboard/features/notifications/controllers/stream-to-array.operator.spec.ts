import { from, of, skip, take } from 'rxjs';
import { streamToArray } from './stream-to-array.operator';

describe('streamToArray', () => {
  it('should emit the first value inside an array', () => {
    const obs = of(15);

    streamToArray(obs)
      .pipe(take(1))
      .subscribe((nums) => {
        expect(nums).toEqual([15]);
      });
  });

  it('should emit all the values previously emitted as an array, with the first item being the first value emitted by default', () => {
    const obs = from([1, 3, 5]);

    streamToArray(obs)
      .pipe(skip(2), take(1))
      .subscribe((nums) => {
        expect(nums).toEqual([1, 3, 5]);
      });
  });

  it('when order="newest-first", it should sort emitted values by newest first', () => {
    const obs = from([1, 3, 5]);

    streamToArray(obs, 'newest-first')
      .pipe(skip(2), take(1))
      .subscribe((nums) => {
        expect(nums).toEqual([5, 3, 1]);
      });
  });
});
