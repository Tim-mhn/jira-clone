import {
  DEFAULT_VALIDATION_ERROR_TO_MESSAGE,
  ValidationErrorToMessage,
} from '@tim-mhn/ng-forms/core';

export const PASSWORD_WRONG_PATTERN_MESSAGE =
  'Password should be at least 8 characters long and have one digit and one special character';

export const PASSWORD_VALIDATION_ERRORS: ValidationErrorToMessage = {
  ...DEFAULT_VALIDATION_ERROR_TO_MESSAGE,
  pattern: () => PASSWORD_WRONG_PATTERN_MESSAGE,
};
