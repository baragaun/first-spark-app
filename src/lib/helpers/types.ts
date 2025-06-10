export interface PasswordValidationResult {
  minLength: boolean;
  notTooSimple: boolean;
  noRepetitivePattern: boolean;
  doesNotReuseEmail: boolean;
  isValid: boolean;
}

export interface ContactDetails {
  id: string;
  name: string;
  avatar: string;
  userHandle?: string;
}

export enum MessageStatus {
  sending,
  sent,
  seen,
  failed,
  delivered,
}
