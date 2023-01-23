import { ValidatorFn, Validators } from '@angular/forms';

const PASSWORD_REGEX =
  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
export const PasswordValidator: ValidatorFn[] = [
  Validators.required,
  Validators.pattern(PASSWORD_REGEX),
];
