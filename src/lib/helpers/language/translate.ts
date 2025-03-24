import { AppUiMessage } from '@/types/enums';
import { UiLanguage } from '@baragaun/bg-node-client';

type AppUiMessages = Partial<{
  [key in UiLanguage]: {
    [key in AppUiMessage]: string;
  };
}>;

const appUiMessages: AppUiMessages = {
  [UiLanguage.en]: {
    [AppUiMessage.empty]: '',
    [AppUiMessage.systemError]: 'An error occurred. Please try again later.',

    [AppUiMessage.msaTokenFailed]: 'We could not verify the code you entered. Please try again.',
    [AppUiMessage.msaTokenFailedToSend]:
      'We could not send you the message. Please check the email you entered.',
    [AppUiMessage.msaTokenSending]: 'Processing.',
    [AppUiMessage.msaTokenSent]: 'The message has been sent. Please check your inbox.',
    [AppUiMessage.msaTokenSuccess]: 'The code has been verified successfully.',
    [AppUiMessage.msaTokenVerifying]: 'Verifying your code...',
    [AppUiMessage.msaTimedOut]: 'The verification process timed out. Please try again.',
  },
  [UiLanguage.de]: {
    [AppUiMessage.empty]: '',
    [AppUiMessage.systemError]: 'Es ist ein Fehler aufgetreten. Bitte versuche es nochmals später.',

    [AppUiMessage.msaTokenFailed]: 'We could not verify the code you entered. Please try again.',
    [AppUiMessage.msaTokenFailedToSend]:
      'We could not send you the message. Please check the email you entered.',
    [AppUiMessage.msaTokenSending]: 'Processing.',
    [AppUiMessage.msaTokenSent]: 'The message has been sent. Please check your inbox.',
    [AppUiMessage.msaTokenSuccess]: 'The code has been verified successfully.',
    [AppUiMessage.msaTokenVerifying]: 'Verifying your code...',
    [AppUiMessage.msaTimedOut]: 'The verification process timed out. Please try again.',
  },
};

const translate = (
  key: AppUiMessage | string,
  defaultKey: AppUiMessage | string = AppUiMessage.empty,
  defaultMessage = '',
  language: UiLanguage = UiLanguage.en,
): string => {
  return (
    appUiMessages[language]?.[key as AppUiMessage] ||
    appUiMessages[UiLanguage.en]?.[key as AppUiMessage] ||
    appUiMessages[language]?.[defaultKey as AppUiMessage] ||
    appUiMessages[UiLanguage.en]?.[defaultKey as AppUiMessage] ||
    defaultMessage ||
    ''
  );
};

export default translate;
