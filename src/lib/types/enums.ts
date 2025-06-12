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

export enum FirstSparkApp {
  title = 'First Spark',
  description = 'Discover and connect with our partner services',
  canonicalUrl = '/favicon.png',
}

export enum KCUApp {
  title = 'KCU',
  description = 'Discover and connect with our partner services',
  canonicalUrl = '/favicon-kcu.png',
}
