export interface PasswordValidation {
  minLength: boolean;
  notTooSimple: boolean;
  noRepetitivePattern: boolean;
  doesNotReuseEmail: boolean;
  isValid: boolean;
}

const commonPasswords = [
  '123456',
  'password',
  '123456789',
  '12345678',
  '12345',
  '1234567',
  '1234567890',
  'qwerty',
  'abc123',
  'password1',
];

export const validatePassword = (password: string): PasswordValidation => {
  const repetitivePattern = /^(.)\1+$/;
  const result: PasswordValidation = {
    minLength: true,
    notTooSimple: true,
    noRepetitivePattern: true,
    doesNotReuseEmail: true,
    isValid: true,
  };

  if (password.length < 8) {
    result.minLength = false;
    result.isValid = false;
  }

  if (commonPasswords.includes(password.toLowerCase())) {
    result.notTooSimple = false;
    result.isValid = false;
  }

  if (repetitivePattern.test(password)) {
    result.noRepetitivePattern = false;
    result.isValid = false;
  }

  return result;
};

export const getPasswordError = (password: string) => {
  if (!password) {
    return '';
  }

  const validation = validatePassword(password);

  if (!validation.minLength) {
    return 'Password must be at least 8 characters long';
  }

  if (
    !validation.notTooSimple ||
    !validation.noRepetitivePattern ||
    !validation.doesNotReuseEmail
  ) {
    return 'Password is too simple or guessable';
  }

  return '';
};
