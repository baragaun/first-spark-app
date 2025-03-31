import type { PasswordValidationResult } from './types';

const minLength = 8;
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

const validatePassword = (password: string, email?: string): PasswordValidationResult => {
  const repetitivePattern = /^(.)\1+$/;
  const result: PasswordValidationResult = {
    minLength: true,
    notTooSimple: true,
    noRepetitivePattern: true,
    doesNotReuseEmail: true,
    isValid: true,
  };

  if (password.length < minLength) {
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

  if (email) {
    const firstEmailPart = email.split('@')[0];
    if (firstEmailPart && password.toLowerCase().includes(firstEmailPart.toLowerCase())) {
      result.doesNotReuseEmail = false;
      result.isValid = false;
    }
  }

  return result;
};

const getPasswordError = (password: string) => {
  if (!password) {
    return '';
  }

  const validation = validatePassword(password);

  if (!validation.minLength) {
    return `Password must be at least ${minLength} characters long.`;
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

const passwordHelpers = {
  minLength,
  validatePassword,
  getPasswordError,
};

export default passwordHelpers;
