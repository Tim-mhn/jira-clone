import { EMPTY, of, switchMap, throwError } from 'rxjs';
import { RequestState } from '../domain/request-state';
import { RequestStateController } from './request-state.controller';

describe('RequestStateController', () => {
  let controller = new RequestStateController();
  let requestState: RequestState;
  beforeEach(() => {
    requestState = new RequestState();
  });

  it('should be created', () => {
    expect(controller).toBeDefined();
  });

  it('should NOT call requestState.toPending if there is no subscription', () => {
    const source = getEmptyObs();
    source.pipe(controller.handleRequest(requestState));
    spyOn(requestState, 'toPending');
    expect(requestState.toPending).not.toHaveBeenCalled();
  });

  it('should call requestState.toPending if there is a subscription', (done: DoneFn) => {
    const source = getEmptyObs();
    spyOn(requestState, 'toPending');
    source.pipe(controller.handleRequest(requestState)).subscribe(() => {
      expect(requestState.toPending).toHaveBeenCalledTimes(1);
      done();
    });
  });

  it('should call requestState.toPending if the source errors', (done: DoneFn) => {
    const sourceThatThrows$ = getObsThatThrowError();

    spyOn(requestState, 'toPending');
    sourceThatThrows$.pipe(controller.handleRequest(requestState)).subscribe({
      error: () => {
        expect(requestState.toPending).toHaveBeenCalledTimes(1);
        done();
      },
    });
  });

  it('should call requestState.toSuccess if the source successfully completes ', (done: DoneFn) => {
    const source$ = getEmptyObs();

    spyOn(requestState, 'toSuccess');
    source$.pipe(controller.handleRequest(requestState)).subscribe({
      complete: () => {
        expect(requestState.toSuccess).toHaveBeenCalledTimes(1);
        done();
      },
    });
  });

  it('should call requestState.toError if the source errors ', (done: DoneFn) => {
    const source$ = getObsThatThrowError();

    spyOn(requestState, 'toError');
    source$.pipe(controller.handleRequest(requestState)).subscribe({
      error: () => {
        expect(requestState.toError).toHaveBeenCalledTimes(1);
        done();
      },
    });
  });

  it('should not change the source response ', (done: DoneFn) => {
    const mockData = {
      user: 'iqair',
      id: 'some-id',
    };

    const source$ = of(mockData);

    source$.pipe(controller.handleRequest(requestState)).subscribe((res) => {
      expect(res).toEqual(mockData);
      done();
    });
  });

  it('should not change the error response if the source errors', (done: DoneFn) => {
    const mockError = new Error('some-error-message');

    const source$ = of(EMPTY).pipe(
      switchMap(() => throwError(() => mockError))
    );

    source$.pipe(controller.handleRequest(requestState)).subscribe({
      error: (err) => {
        expect(err).toEqual(mockError);
        done();
      },
    });
  });

  describe('null or undefined requestState', () => {
    it('should return the original observable if no input request is passed ', () => {
      const source = getEmptyObs();

      const controllerOutput = source.pipe(controller.handleRequest());

      expect(controllerOutput).toEqual(source);
    });

    it('should return the original observable if input request is null ', () => {
      const source = getEmptyObs();

      const controllerOutput = source.pipe(controller.handleRequest(null));

      expect(controllerOutput).toEqual(source);
    });
  });
});

function getEmptyObs() {
  return of({});
}

function getObsThatThrowError() {
  const source = getEmptyObs();
  return source.pipe(
    switchMap(() => throwError(() => new Error('error message')))
  );
}
