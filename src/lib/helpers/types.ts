export interface PasswordValidationResult {
  hasUppercase: unknown;
  hasLowercase: unknown;
  hasNumber: unknown;
  hasSpecialChar: unknown;
  minLength: boolean;
  notTooSimple: boolean;
  noRepetitivePattern: boolean;
  doesNotReuseEmail: boolean;
  isValid: boolean;
}
