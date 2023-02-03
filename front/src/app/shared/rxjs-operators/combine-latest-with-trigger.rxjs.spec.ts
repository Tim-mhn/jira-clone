import { SSL_OP_NETSCAPE_REUSE_CIPHER_CHANGE_BUG } from 'constants';
import { Subject } from 'rxjs';
import { combineLatestWithTrigger } from './combine-latest-with-trigger.rxjs';

describe('combineLatestWithTrigger', () => {
  it('should emit every time one observable emits', (done: DoneFn) => {
    const sourceA = new Subject<string>();
    const sourceB = new Subject<string>();

    const combineLatestWithTrigger$ = combineLatestWithTrigger({
      a: sourceA,
      b: sourceB,
    });

    var emissionsCount = 0;

    combineLatestWithTrigger$.subscribe({
      next: () => (emissionsCount += 1),
      complete: () => done(),
    });

    sourceA.next('a');
    sourceB.next('b');
    sourceB.next('bb');

    sourceA.complete();
    sourceB.complete();

    expect(emissionsCount).toEqual(2);
  });

  it('should emit the old values when the other observables emit', (done: DoneFn) => {
    const sourceA = new Subject<string>();
    const sourceB = new Subject<string>();

    const combineLatestWithTrigger$ = combineLatestWithTrigger({
      a: sourceA,
      b: sourceB,
    });

    var emissions: string[][] = [];

    combineLatestWithTrigger$.subscribe({
      next: ({ a, b }) => emissions.push([a, b]),
      complete: () => done(),
    });

    sourceA.next('a');
    sourceB.next('b');
    sourceB.next('bb');
    sourceA.next('aa');

    sourceA.complete();
    sourceB.complete();

    expect(emissions).toEqual([
      ['a', 'b'],
      ['a', 'bb'],
      ['aa', 'bb'],
    ]);
  });

  it('should emit the key of the observable that just emitted', (done: DoneFn) => {
    const sourceA = new Subject<string>();
    const sourceB = new Subject<string>();

    const combineLatestWithTrigger$ = combineLatestWithTrigger({
      a: sourceA,
      b: sourceB,
    });

    var triggers: string[] = [];

    combineLatestWithTrigger$.subscribe({
      next: ({ a, b, trigger }) => triggers.push(trigger),
      complete: () => done(),
    });

    sourceA.next('a');
    sourceB.next('b');
    sourceB.next('bb');
    sourceA.next('aa');

    sourceA.complete();
    sourceB.complete();

    expect(triggers).toEqual(['b', 'b', 'a']);
  });
});
