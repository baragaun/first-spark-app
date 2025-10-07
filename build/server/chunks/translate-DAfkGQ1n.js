import { UiLanguage } from '@baragaun/bg-node-client';

var AppUiMessage = /* @__PURE__ */ ((AppUiMessage2) => {
  AppUiMessage2["empty"] = "empty";
  AppUiMessage2["systemError"] = "systemError";
  AppUiMessage2["msaTimedOut"] = "msaTimedOut";
  AppUiMessage2["msaTokenFailed"] = "msaTokenFailed";
  AppUiMessage2["msaTokenFailedToSend"] = "msaTokenFailedToSend";
  AppUiMessage2["msaTokenSending"] = "msaTokenSending";
  AppUiMessage2["msaTokenSent"] = "msaTokenSent";
  AppUiMessage2["msaTokenSuccess"] = "msaTokenSuccess";
  AppUiMessage2["msaTokenVerifying"] = "msaTokenVerifying";
  return AppUiMessage2;
})(AppUiMessage || {});
var MsaTokenStatus = /* @__PURE__ */ ((MsaTokenStatus2) => {
  MsaTokenStatus2["verificationFailed"] = "verificationFailed";
  MsaTokenStatus2["sendingFailed"] = "sendingFailed";
  MsaTokenStatus2["sending"] = "sending";
  MsaTokenStatus2["notificationSent"] = "notificationSent";
  MsaTokenStatus2["success"] = "success";
  MsaTokenStatus2["timedOut"] = "timedOut";
  MsaTokenStatus2["unset"] = "unset";
  MsaTokenStatus2["verifying"] = "verifying";
  return MsaTokenStatus2;
})(MsaTokenStatus || {});
var FirstSparkApp = /* @__PURE__ */ ((FirstSparkApp2) => {
  FirstSparkApp2["title"] = "First Spark";
  FirstSparkApp2["description"] = "Discover and connect with our partner services";
  FirstSparkApp2["canonicalUrl"] = "/favicon.png";
  return FirstSparkApp2;
})(FirstSparkApp || {});
var KCUApp = /* @__PURE__ */ ((KCUApp2) => {
  KCUApp2["title"] = "KCU";
  KCUApp2["description"] = "Discover and connect with our partner services";
  KCUApp2["canonicalUrl"] = "/favicon-kcu.png";
  return KCUApp2;
})(KCUApp || {});
const appUiMessages = {
  [UiLanguage.en]: {
    [AppUiMessage.empty]: "",
    [AppUiMessage.systemError]: "An error occurred. Please try again later.",
    [AppUiMessage.msaTokenFailed]: "We could not verify the code you entered. Please try again.",
    [AppUiMessage.msaTokenFailedToSend]: "We could not send you the message. Please check the email you entered.",
    [AppUiMessage.msaTokenSending]: "Processing.",
    [AppUiMessage.msaTokenSent]: "The message has been sent. Please check your inbox.",
    [AppUiMessage.msaTokenSuccess]: "The code has been verified successfully.",
    [AppUiMessage.msaTokenVerifying]: "Verifying your code...",
    [AppUiMessage.msaTimedOut]: "The verification process timed out. Please try again."
  },
  [UiLanguage.de]: {
    [AppUiMessage.empty]: "",
    [AppUiMessage.systemError]: "Es ist ein Fehler aufgetreten. Bitte versuche es nochmals später.",
    [AppUiMessage.msaTokenFailed]: "We could not verify the code you entered. Please try again.",
    [AppUiMessage.msaTokenFailedToSend]: "We could not send you the message. Please check the email you entered.",
    [AppUiMessage.msaTokenSending]: "Processing.",
    [AppUiMessage.msaTokenSent]: "The message has been sent. Please check your inbox.",
    [AppUiMessage.msaTokenSuccess]: "The code has been verified successfully.",
    [AppUiMessage.msaTokenVerifying]: "Verifying your code...",
    [AppUiMessage.msaTimedOut]: "The verification process timed out. Please try again."
  }
};
const translate = (key, defaultKey = AppUiMessage.empty, defaultMessage = "", language = UiLanguage.en) => {
  return appUiMessages[language]?.[key] || appUiMessages[UiLanguage.en]?.[key] || appUiMessages[language]?.[defaultKey] || appUiMessages[UiLanguage.en]?.[defaultKey] || defaultMessage || "";
};

export { AppUiMessage as A, FirstSparkApp as F, KCUApp as K, MsaTokenStatus as M, translate as t };
//# sourceMappingURL=translate-DAfkGQ1n.js.map
