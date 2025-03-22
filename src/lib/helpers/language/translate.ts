import { AppUiMessage } from '@/types/enums'
import {
  translate as translateFromClient,
  UiLanguage,
  UiMessageType,
} from '@baragaun/bg-node-client'

let appUiMessages: { [key: string]: { [key: string]: string }} = {
  [UiLanguage.en]: {
    [AppUiMessage.systemError]: 'A system error occurred. Please try again later.',
  }
}

const translate = (
  key: string,
  uiMessageType?: UiMessageType,
  language: UiLanguage = UiLanguage.en,
  defaultKey: string = '',
  defaultMessage = '',
): string => {
  if (uiMessageType === UiMessageType.appErrorCode) {
    return appUiMessages[language]?.[key] ||
      appUiMessages[UiLanguage.en]?.[key] ||
      appUiMessages[language]?.[defaultKey] ||
      appUiMessages[UiLanguage.en]?.[defaultKey] ||
      defaultMessage ||
      '';
  }

  return translateFromClient(
    key,
    uiMessageType,
    language,
    defaultKey,
    defaultMessage,
  );
}

export default translate;
