import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, throwError, timer } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';

interface MockAPIOptions {
  duration?: number;
  errorRate?: number;
  errorMessage?: string;
  log?: boolean;
}
/**
 * Service to be used to ease the development process when API endpoints are not available.
 * This service mocks calls to an API and returns mocks data based on the data provided.
 *
 * ```
 * // Basic example mocking GET request
 * const mockOutput = { ... };
 * return this.mockAPI.get(mockOutput)
 *
 * // Basic example mocking POST request
 * const input = ... ;
 * const mockOutput = { ... };
 * return this.mockAPI.post(input, mockOutput);
 *
 * // Customizing the duration of the mock API call
 * const mockOutput = { ... };
 * const duration = 5000; // 5s
 * return this.mockAPI.get(mockOutput, { duration: duration })
 *
 * // Customizing the errorRate
 * const mockOutput = { .. };
 * const veryHighErrorRate = .99; // 99% chance of throwing an error
 * return this.mockAPI.get(mockOutput, { errorRate: veryHighErrorRate });
 *
 * // Customizing the error message
 * const mockOutput = { .. };
 * const customErrorMessage = "A custom error message";
 * return this.mockAPI.get(mockOutput, { errorMessage: customErrorMessage });
 *
 * ```
 */
@Injectable({
  providedIn: 'root',
})
export class MockAPI {
  private readonly DEFAULT_OPTIONS: MockAPIOptions = {
    duration: 2000,
    errorRate: 0.3,
    errorMessage: 'Error from Mock API',
    log: true,
  };
  constructor() {}

  public get<T>(mockData: T, options?: MockAPIOptions): Observable<T> {
    return this._mockAPICall(mockData, options);
  }

  public put<I, O>(
    input: I,
    mockOutput: O,
    options?: MockAPIOptions
  ): Observable<O> {
    return this._mockAPICall<O>(mockOutput, options);
  }

  public delete<I>(input: I, options?: MockAPIOptions) {
    return this._mockAPICall<void>(null, options);
  }

  public post<I, O>(input: I, mockOutput: O, options?: MockAPIOptions) {
    return this._mockAPICall<O>(mockOutput, options);
  }

  private _mockAPICall<O>(mockOutput: O, options?: MockAPIOptions) {
    const { duration, errorMessage, errorRate, log } =
      this._getMockOptions(options);

    const _throwError = this._willThrowError(errorRate);
    const _mockHttpError = this._buildMockHttpError(errorMessage);

    if (log) console.group('Sending mock API call');

    return timer(duration).pipe(
      switchMap(() =>
        _throwError ? throwError(() => _mockHttpError) : of(mockOutput)
      ),
      catchError(this._logAndRethrowError),
      tap(() => {
        if (log) {
          console.debug('API call finished. Output = ');
          console.log(mockOutput);
          console.groupEnd();
        }
      })
    );
  }

  private _logAndRethrowError(err: HttpErrorResponse) {
    console.group('Mock Error from Mock API');
    console.error(err);
    console.groupEnd();
    console.log(err);
    return throwError(() => err);
  }

  // override any default option with input options
  private _getMockOptions(options: MockAPIOptions) {
    return {
      ...this.DEFAULT_OPTIONS,
      ...options,
    };
  }

  private _buildMockHttpError(errorMessage: string): HttpErrorResponse {
    const errorCode = this._randomErrorCode();
    const apiError = {
      code: errorCode,
      message: errorMessage,
    };
    return new HttpErrorResponse({
      error: apiError,
      status: errorCode,
    });
  }

  private _randomErrorCode() {
    const baseErrorCode = Math.random() > 0.5 ? 400 : 500;
    const errorCode = baseErrorCode + Math.floor(Math.random() * 12);
    return errorCode;
  }

  // errorRate should be between 0-1
  // errorRate = .3 -> 30% chance errors
  // errorRate = .5 -> 50% chance errors
  // errorRate = .9 -> 90% chance errors
  // errorRate <= 0 -> 0% chance errors
  // errorRate >= 1 -> 100% chance errors
  private _willThrowError(errorRate: number) {
    const errorRateWithinBounds = Math.min(1, Math.max(0, errorRate));
    if (errorRate !== errorRateWithinBounds)
      console.warn(
        `[MockAPIService] : Error rate ${errorRate} in Mock API is not withing the correct bounds 0-1. Using ${errorRateWithinBounds} instead`
      );
    return Math.random() > 1 - errorRateWithinBounds;
  }
}
