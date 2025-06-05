export interface PasswordValidationResult {
  minLength: boolean;
  notTooSimple: boolean;
  noRepetitivePattern: boolean;
  doesNotReuseEmail: boolean;
  isValid: boolean;
}
