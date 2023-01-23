import { FormControl } from '@angular/forms';
import { PasswordValidator } from './password.validator';

describe('PasswordValidator', () => {
  let pwdControl: FormControl;

  beforeEach(() => {
    pwdControl = new FormControl('', PasswordValidator);
  });
  it('should mark empty password as invalid', () => {
    pwdControl.setValue('');
    pwdControl.updateValueAndValidity();

    expect(pwdControl.valid).toBeFalse();
  });

  describe('should require 8+ characters', () => {
    it('less than 7 characters should be invalid', () => {
      pwdControl.setValue('12cea');
      pwdControl.updateValueAndValidity();

      expect(pwdControl.valid).toBeFalse();
    });

    it('8 characters should be valid', () => {
      pwdControl.setValue('a!12ceac');
      pwdControl.updateValueAndValidity();

      expect(pwdControl.valid).toBeTrue();
    });
  });

  describe('should require letters and digits ', () => {
    it('"passwordWithoutDigits" should be invalid', () => {
      pwdControl.setValue('passwordWithoutDigits');
      pwdControl.updateValueAndValidity();

      expect(pwdControl.valid).toBeFalse();
    });

    it('"passw0rdWithDigitsButNoSpecialChars" should be invalid', () => {
      pwdControl.setValue('passw0rdWithDigitsButNoSpecialChars');
      pwdControl.updateValueAndValidity();

      expect(pwdControl.valid).toBeFalse();
    });

    it('"passw0rdWithD!g!tsAndSpec!alChars" should be invalid', () => {
      pwdControl.setValue('passw0rdWithD!g!tsAndSpec!alChars');
      pwdControl.updateValueAndValidity();

      expect(pwdControl.valid).toBeTrue();
    });
  });
});
