import { Injectable } from '@angular/core';
import { defer, Observable, tap } from 'rxjs';
import { TimUISnackbar, TimUISnackbarRef } from '@tim-mhn/ng-ui/snackbar';

type MessageConstructorFn<Output> = (output: Output) => string;
type SnackbarMessages<Output, ErrorType = Error> = {
  loadingMessage?: string;
  successMessage?: string | MessageConstructorFn<Output>;
  errorMessage?: string | MessageConstructorFn<ErrorType>;
};

type ShowSnackbarMessages = {
  showLoadingMessage?: boolean;
  showSuccessMessage?: boolean;
  showErrorMessage?: boolean;
};

type SnackbarFeedbackOptions = ShowSnackbarMessages & {
  duration?: number;
  timeout?: number;
};

@Injectable()
export class SnackbarFeedbackService {
  private readonly DEFAULT_SNACKBAR_MESSAGES = {
    loadingMessage: 'Saving changes...',
    successMessage: 'Changes saved',
    errorMessage: 'An unexpected error occurred',
  };

  private DEFAULT_SNACKBAR_DURATION_MS = 3000;
  private DEFAULT_SNACKBAR_TIMEOUT = 200;
  constructor(private _snackbar: TimUISnackbar) {}

  showFeedbackSnackbars<T>(
    _messages?: SnackbarMessages<T>,
    opts?: SnackbarFeedbackOptions
  ): (source: Observable<T>) => Observable<T> {
    const snackbarMessages = {
      ...this.DEFAULT_SNACKBAR_MESSAGES,
      ..._messages,
    };

    const snackbarOptions = {
      timeout: this.DEFAULT_SNACKBAR_TIMEOUT,
      duration: this.DEFAULT_SNACKBAR_DURATION_MS,
      ...opts,
    };
    return (source: Observable<T>) =>
      defer(() => {
        let loadingSnackbar: TimUISnackbarRef;

        if (snackbarOptions?.showLoadingMessage !== false)
          loadingSnackbar = this._snackbar.open(
            snackbarMessages.loadingMessage as string,
            {
              dismissible: false,
              mode: 'loading',
            }
          );

        const sourceWithSnackbars$ = source.pipe(
          tap({
            error: (error) => {
              loadingSnackbar?.close();

              if (snackbarOptions?.showErrorMessage === false) return;
              const errorMessage =
                typeof snackbarMessages.errorMessage === 'string'
                  ? snackbarMessages.errorMessage
                  : snackbarMessages.errorMessage(error);

              this._snackbar.open(errorMessage, {
                dismissible: false,
                duration: snackbarOptions.duration,
                mode: 'error',
              });
            },
            next: (output) => {
              loadingSnackbar?.close();
              if (snackbarOptions?.showSuccessMessage === false) return;

              const successMessage =
                typeof snackbarMessages.successMessage === 'string'
                  ? snackbarMessages.successMessage
                  : snackbarMessages.successMessage(output);

              this._showSuccessSnackbarAfterSmallTimeout(
                successMessage,
                snackbarOptions.duration,
                snackbarOptions.timeout
              );
            },
          })
        );

        return sourceWithSnackbars$;
      });
  }

  private _showSuccessSnackbarAfterSmallTimeout(
    successMessage: string,
    duration: number,
    timeout: number
  ) {
    setTimeout(
      () =>
        this._snackbar.open(successMessage, {
          dismissible: false,
          duration,
          mode: 'success',
        }),
      timeout
    );
  }
}
