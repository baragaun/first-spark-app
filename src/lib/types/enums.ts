export enum AppUiMessage {
  empty = 'empty',
  systemError = 'systemError',

  msaTimedOut = 'msaTimedOut',
  msaTokenFailed = 'msaTokenFailed',
  msaTokenFailedToSend = 'msaTokenFailedToSend',
  msaTokenSending = 'msaTokenSending',
  msaTokenSent = 'msaTokenSent',
  msaTokenSuccess = 'msaTokenSuccess',
  msaTokenVerifying = 'msaTokenVerifying',
}

export enum MsaTokenStatus {
  verificationFailed = 'verificationFailed',
  sendingFailed = 'sendingFailed',
  sending = 'sending',
  notificationSent = 'notificationSent',
  success = 'success',
  timedOut = 'timedOut',
  unset = 'unset',
  verifying = 'verifying',
}
